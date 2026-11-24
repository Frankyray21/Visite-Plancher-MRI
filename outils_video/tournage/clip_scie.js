// Copie de filme_gpu.js (depot/outils_video) + fichier de contrôle <sortie>.controle.json (table des plans, ordre des blocs, journal des clés effectives, erreurs du moteur) et option --sous-titres.
// Filme la visite narrée image par image, avec la carte graphique de cet ordinateur, et produit un MP4 fluide avec les voix.
//   node filme_gpu.js [--depot C:\chemin\du\depot | --url https://…/] [--sortie visite_narree.mp4] [--navigateur msedge|chrome] [--ips 30]
//                     [--largeur 1280 --hauteur 720 --echelle 1.5] [--mode complet|allege] [--max N images] [--logiciel]
//                     [--three <dossier d'une copie locale de three@0.128.0, si le CDN n'est pas joignable>]
// La page tourne sous une horloge simulée (horloge2.js) : elle ne voit que des images espacées de 1/60 s, donc elle garde sa pleine qualité
// (ombres, reflets, relief du roc) quelle que soit la vitesse réelle, et chaque image de la vidéo est exacte.
const fs = require('fs'), path = require('path'), http = require('http'), https = require('https'), { spawn, spawnSync } = require('child_process');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const DEPOT = arg('depot', null), URLSITE = arg('url', null), SORTIE = path.resolve(arg('sortie', 'visite_narree.mp4')), NAV = arg('navigateur', 'msedge'), IPS = +arg('ips', 30), MODE = arg('mode', 'complet');
const L = +arg('largeur', 1280), H = +arg('hauteur', 720), ECH = +arg('echelle', 1.5), MAX = +arg('max', 1e9), LOGICIEL = !!arg('logiciel', false);
const D = require(require('path').join(__dirname, '..', 'depot', 'outils_video', 'durees_voix.json')), horloge2 = require(require('path').join(__dirname, '..', 'depot', 'outils_video', 'horloge2.js')); const pause = ms => new Promise(r => setTimeout(r, ms));
let chromium; try { chromium = require(require('path').join(__dirname, '..', 'depot', 'outils_video', 'node_modules', 'playwright-core')).chromium; } catch (e) { chromium = require('playwright').chromium; }
let FFMPEG = 'ffmpeg'; try { FFMPEG = require(require('path').join(__dirname, '..', 'depot', 'outils_video', 'node_modules', 'ffmpeg-static')) || 'ffmpeg'; } catch (e) {}
const t0 = Date.now(), dit = (...a) => console.log(`[${((Date.now() - t0) / 60000).toFixed(1)} min] ` + a.join(' '));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain', '.mp3': 'audio/mpeg', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serveur(dossier) { return new Promise(ok => { const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (p === '/') p = '/index.html'; const f = path.join(dossier, p);
    if (!f.startsWith(dossier) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Content-Length': fs.statSync(f).size, 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(r); }); s.listen(0, '127.0.0.1', () => ok(s)); }); }
const telecharge = (u, f) => new Promise((ok, ko) => { (u.startsWith('https') ? https : http).get(u, r => { if (r.statusCode !== 200) return ko(new Error(u + ' : ' + r.statusCode)); const w = fs.createWriteStream(f); r.pipe(w); w.on('finish', () => w.close(ok)); }).on('error', ko); });
(async () => {
  if (!DEPOT && !URLSITE) throw new Error('indiquer --depot <dossier du site> ou --url <adresse du site>');
  let srv = null, base = URLSITE; if (DEPOT) { if (!fs.existsSync(path.join(DEPOT, 'index.html'))) throw new Error('index.html introuvable dans ' + DEPOT); srv = await serveur(path.resolve(DEPOT)); base = `http://127.0.0.1:${srv.address().port}/`; }
  if (!base.endsWith('/')) base += '/';
  const options = { headless: false, args: ['--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-background-timer-throttling', '--disable-features=CalculateNativeWinOcclusion', '--autoplay-policy=no-user-gesture-required', '--force_high_performance_gpu', `--window-size=${L + 40},${H + 140}`] };
  if (LOGICIEL) { options.headless = true; options.args.push('--ignore-gpu-blocklist', '--use-gl=angle', '--use-angle=gl-egl'); process.env.EGL_PLATFORM = process.env.EGL_PLATFORM || 'surfaceless'; } else if (NAV !== 'chromium') options.channel = NAV;
  const nav = await chromium.launch(options), ctx = await nav.newContext({ viewport: { width: L, height: H }, deviceScaleFactor: ECH, serviceWorkers: 'block' });
  await ctx.addInitScript(horloge2(D)); await ctx.route('**/voix/*.mp3', r => r.abort());
  const TROIS = arg('three', null); if (TROIS) await ctx.route('https://cdn.jsdelivr.net/npm/three@0.128.0/**', route => { const f = path.join(TROIS, new URL(route.request().url()).pathname.replace('/npm/three@0.128.0/', '')); fs.existsSync(f) ? route.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(f) }) : route.fulfill({ status: 404, body: '' }); }); const page = await ctx.newPage(); const journal = [];
  page.on('pageerror', e => journal.push('erreur: ' + String(e.message).slice(0, 200))); page.on('console', m => { if (m.type() === 'error' && !/voix\/bloc_|ERR_FAILED/.test(m.text())) journal.push('console: ' + m.text().slice(0, 200)); });
  await page.goto(base + 'index.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
  const PAS = MODE === 'complet' ? 1000 / 60 : 40;
  const pas = async (n = 1, ms = PAS) => { const a = Date.now(); const r = await page.evaluate(([n, ms]) => { window.__sansDessin = true; for (let i = 0; i < n; i++) window.__avance(ms); return { t: window.__t(), att: window.__att.n, tot: window.__att.tot, calme: window.__vrai() - window.__att.fin }; }, [n, ms]); const reste = n * ms - (Date.now() - a); if (reste > 0) await pause(reste); return r; };
  const etat = () => page.evaluate(() => { const r = window.__r, vis = e => !!e && !e.hidden && getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0, essai = f => { try { return f(); } catch (e) { return 'erreur ' + e.message; } }, c = document.querySelector('canvas');
    if (r && !r.__esp) { r.__esp = 1; const f = r.render; r.render = function (sc, cam) { if (sc && sc.isScene && !this.getRenderTarget() && sc.children.length > 20) window.__sc = sc; return f.apply(this, arguments); }; }
    let ombres = 0, mailles = 0; if (window.__sc) window.__sc.traverse(o => { if (o.isLight && o.castShadow) ombres++; if (o.isMesh && o.visible) mailles++; });
    const g = c && (c.getContext('webgl2') || c.getContext('webgl')), x = g && g.getExtension('WEBGL_debug_renderer_info');
    return { accueil: vis(document.getElementById('accueil')), construire: vis(document.getElementById('acc-construire')), toile: c ? [c.width, c.height] : null, carte: g ? String(x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER)).slice(0, 90) : '?',
      ombres, mailles, tex: r ? r.info.memory.textures : -1, geo: r ? r.info.memory.geometries : -1, prog: r && r.info.programs ? r.info.programs.length : -1,
      roc: essai(() => { const b = window.__visiteRoc.bilan(); return { fin: b.fin, niveau: b.releve && b.releve.niveau, parallaxe: b.releve && b.releve.parallaxe, garde: b.garde_mediane_ms }; }), matieres: essai(() => { const b = window.__visiteMatieres.bilan(); return { fin: b.fin, allege: b.recompile_allege }; }),
      vent: essai(() => window.__visiteVent.etat + '/' + window.__visiteVent.mode), lumiere: essai(() => { const l = window.__dbg.lumiere; return l ? { allege: l.allege, file: l.file.length, contacts: l.contacts && l.contacts.length } : null; }), lent: essai(() => window.__visiteScene.lent) }; });
  let e, r; for (let i = 0; ; i++) { r = await pas(5); if (i % 5 === 4) { e = await etat(); if (e.accueil && e.construire) break; } if (Date.now() - t0 > 600000) throw new Error('accueil jamais affiché : ' + JSON.stringify(e)); }
  dit(`accueil affiché ; carte graphique : ${e.carte}`); if (!LOGICIEL && /swiftshader|llvmpipe|basic render/i.test(e.carte)) dit('ATTENTION : le navigateur n\'utilise pas la carte graphique (rendu logiciel) — ce sera lent.');
  await page.evaluate(() => document.getElementById('acc-construire').click());
  const STABLE = MODE === 'complet' ? 25000 : 12000, MINI = MODE === 'complet' ? 45000 : 20000;
  let ref = '', depuis = 0, tClic = null; for (;;) { r = await pas(5); if (tClic === null) tClic = r.t; e = await etat(); const cle = [e.tex, e.geo, e.prog, e.mailles, e.ombres, JSON.stringify(e.roc), JSON.stringify(e.matieres), e.vent, JSON.stringify(e.lumiere)].join('|');
    if (cle !== ref) { ref = cle; depuis = r.t; } if (r.att === 0 && r.calme > 5000 && r.t - depuis > STABLE && r.t - tClic > MINI) break; if (Date.now() - t0 > 1500000) throw new Error('chargement jamais stable : ' + JSON.stringify(e)); }
  dit('visite chargée et stable : ' + JSON.stringify(e)); if (!(e.mailles > 100) || !(await page.evaluate(() => !!(window.__voixV157 && window.__narrationV155)))) throw new Error('la visite ne s\'est pas chargée (three.js ou les modèles manquent) : ' + JSON.stringify(journal.slice(0, 5))); if (MODE === 'complet' && (e.ombres === 0 || e.lent === true)) dit('ATTENTION : la page est passée en mode allégé (sans ombres).');
  // ======================= clip « la scie va-et-vient coupe le bout du plancher secondaire » (2026-11-24, demande utilisateur : « seulement une clip de 5 secondes »)
  const SORTIE_DIR = path.dirname(SORTIE), DUREE = +arg('duree', 5.5), VITESSE = +arg('vitesse', 0), CAM = JSON.parse(arg('cam', '{"off":[0.45,0.42,-0.55],"r":0.42,"vise":[0,0,0.05]}'));
  const stepSim = async (s) => { const n = Math.round(s * 60); await page.evaluate(n => { window.__sansDessin = true; for (let i = 0; i < n; i++) window.__avance(1000 / 60); window.__sansDessin = false; }, n); };
  const lit = () => page.evaluate(() => { const I = window.__inter71, K = I.scie, NV = window.__narrationV155; const e = K.etatCoupe ? K.etatCoupe() : null; return { bloc: NV.BLOCS[NV.i] && NV.BLOCS[NV.i].id, etatNV: NV.etat, office: K.office, lieu: K.lieu, mode: K.mode, vue: K.vue, releve: K.releve, avance: K.avance, enCours: K.enCours, phase: K.phase, petites: K.petites, rien: K.rienACouper, coupe: e, body: document.body.className }; });
  await page.evaluate(() => { window.__voixV157.geste = true; window.__narrationV155.SOUS_TITRES = false; const NV = window.__narrationV155; let k = 0; NV.BLOCS.forEach((b, i) => { if (b.id === '46') k = i; }); NV.joue(k); });
  for (let i = 0; i < 40; i++) { await stepSim(0.5); const e = await lit(); if (e.office === 'fait' && e.bloc === '46') break; }
  dit('bloc 48 chargé : ' + JSON.stringify(await lit()));
  await stepSim(2);
  // arrêt de la narration (la caméra du bloc 48 ne bouge plus), interface cachée (classe a06-cine), scie en main et vue de coupe
  const prep = await page.evaluate(() => { const I = window.__inter71, K = I.scie, NV = window.__narrationV155; const r = { erreurs: [] };
    try { NV.arrete(); } catch (e) { r.erreurs.push('arrete: ' + e.message); } if (!window.__camClip) { const R = window.__r, f0 = R.render; R.render = function (sc, c) { if (sc && sc.isScene && !this.getRenderTarget() && sc.children.length > 20) window.__camClip = c; return f0.apply(this, arguments); }; }
    document.body.classList.add('mode-video', 'a06-cine', 'clip-scie'); const st = document.createElement('style'); st.textContent = 'body.clip-scie #etq19,body.clip-scie #credits,body.clip-scie #a08-credit,body.clip-scie [id^=credit],body.clip-scie #message,body.clip-scie #msg{display:none!important}'; document.head.appendChild(st); K.OFFICE = false; K.lieu = 'main'; K.commence(); r.apres = { lieu: K.lieu, mode: K.mode, vue: K.vue, avance: K.avance }; return r; });
  dit('commence : ' + JSON.stringify(prep)); await stepSim(1.5);
  let eC = await lit(); if (eC.avance > 0) { await page.evaluate(() => window.__inter71.scie.recule()); for (let i = 0; i < 20 && (await lit()).enCours; i++) await stepSim(0.25); dit('reculé : ' + JSON.stringify(await lit())); }
  await page.evaluate(() => window.__inter71.scie.planche()); for (let i = 0; i < 20 && (await lit()).enCours; i++) await stepSim(0.25); await stepSim(0.5); await page.evaluate(() => { try { window.__inter71.message('', 1); } catch (e) {} });
  eC = await lit(); dit('planche neuve : ' + JSON.stringify(eC));
  // les chemins de coupe : toutes les encoches demandées (req + reqAuto), de gauche à droite ; chaque encoche = un trait (contour suivi de l'extérieur vers l'intérieur puis retour)
  const chemin = await page.evaluate(() => { const K = window.__inter71.scie, M = K.mesures, N = M.N, PAS = M.PAS, X0 = M.X0; const r = [], runs = []; for (let i = 0; i <= N; i++) r[i] = Math.max(K.req[i] || 0, K.reqAuto[i] || 0);
    for (let i = 0, j; i <= N; i = j) { j = i + 1; if (r[i] <= 0.004) continue; let aire = 0; for (j = i; j <= N && r[j] > 0.004; j++) aire += r[j] * PAS; runs.push({ de: i, a: j - 1, aire, prof: Math.max(...r.slice(i, j)) }); }
    const traits = [], centres = []; let L = 0;
    runs.filter(R => R.aire > 0.002).forEach(R => { const pts = [], xa = X0 + R.de * PAS, xb = X0 + R.a * PAS; pts.push({ x: xa - 0.012, z: -0.03 }); for (let i = R.de; i <= R.a; i++) pts.push({ x: X0 + i * PAS, z: r[i] + 0.004 }); pts.push({ x: xb + 0.012, z: -0.03 });
      for (let k = 1; k < pts.length; k++) L += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].z - pts[k - 1].z); traits.push(pts); centres.push({ x: (xa + xb) / 2, z: R.prof / 2 }); });
    const c = centres.reduce((a, p) => ({ x: a.x + p.x / centres.length, z: a.z + p.z / centres.length }), { x: 0, z: 0 });
    return { runs, traits, L, mesures: M, centre: c, etendue: centres.length ? Math.max(...centres.map(p => p.x)) - Math.min(...centres.map(p => p.x)) : 0 }; });
  dit('chemins : ' + JSON.stringify({ runs: chemin.runs, L: chemin.L, traits: chemin.traits.length, centre: chemin.centre, etendue: chemin.etendue }));
  if (!chemin.traits.length) throw new Error('aucune encoche à couper');
  const vitesse = VITESSE || Math.max(0.05, chemin.L / (DUREE - 3.6));
  await page.evaluate(v => { const K = window.__inter71.scie; K.V_SCIE = v; K.V_TRAVERSE = v * 0.6; }, vitesse); dit(`vitesse de lame ${vitesse.toFixed(3)} m/s pour ${chemin.L.toFixed(3)} m en ${chemin.traits.length} traits`);
  // caméra : gros plan 3/4 depuis le côté foreuse, vue de coupe lâchée, distance mini abaissée
  const camInfo = await page.evaluate(C => { const K = window.__inter71.scie, M = K.mesures, g = K.g; K.vue = false; const cen = g.localToWorld(new THREE.Vector3(C.vise[0] + C.c.x, M.YT + C.vise[1], M.Z0 + C.c.z + C.vise[2]));
    const off = new THREE.Vector3(C.off[0], C.off[1], C.off[2]).applyQuaternion(g.getWorldQuaternion(new THREE.Quaternion())).normalize(); const ck = window.__dbg && window.__dbg.camk; if (!ck) return { erreur: 'pas de camk' }; ck.VG_DIST_MIN = 0.35;
    ck.cadre({ tgt: cen.toArray(), dir: off.toArray(), r: C.r }); return { tgt: cen.toArray().map(v => +v.toFixed(3)), dir: off.toArray().map(v => +v.toFixed(3)), r: C.r }; }, Object.assign({ c: chemin.centre }, CAM, { r: Math.max(CAM.r, chemin.etendue / 2 + 0.25) }));
  dit('caméra : ' + JSON.stringify(camInfo)); await stepSim(1.8);
  // traits du joueur : événements de pointeur sur la toile, projetés avec la caméra du rendu ; K.vue vrai le temps de l'envoi seulement
  await page.evaluate(() => { window.__clipTrait = function (pts) { const K = window.__inter71.scie, M = K.mesures, g = K.g, c = document.getElementById('scene'), rc = c.getBoundingClientRect(); g.updateWorldMatrix(true, false); K.vue = true;
      const cl = p => { const w = g.localToWorld(new THREE.Vector3(p.x, M.YT, M.Z0 + p.z)); const v = w.project(window.__camClip); return { x: rc.left + (v.x + 1) / 2 * rc.width, y: rc.top + (1 - v.y) / 2 * rc.height }; };
      const ev = (type, p) => { const q = cl(p); c.dispatchEvent(new PointerEvent(type, { clientX: q.x, clientY: q.y, pointerId: 7, pointerType: 'mouse', button: 0, buttons: 1, bubbles: true, cancelable: true, isPrimary: true })); return q; };
      let n = 1; ev('pointerdown', pts[0]); for (let k = 1; k < pts.length; k++) { const a = pts[k - 1], b = pts[k], m = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / 0.004)); for (let s = 1; s <= m; s++) { ev('pointermove', { x: a.x + (b.x - a.x) * s / m, z: a.z + (b.z - a.z) * s / m }); n++; } }
      K.vue = false; return { n, phase: K.phase, touchers: K.touchers }; };
    window.__clipUp = function () { document.getElementById('scene').dispatchEvent(new PointerEvent('pointerup', { pointerId: 7, pointerType: 'mouse', button: 0, buttons: 0, bubbles: true, cancelable: true, isPrimary: true })); }; });
  let kT = 0, upFait = false, tUp = -1, pousse = false; const t1 = await page.evaluate(p => window.__clipTrait(p), chemin.traits[0]); dit('trait 1 : ' + JSON.stringify(t1));
  // tournage
  const muet = SORTIE.replace(/\.mp4$/i, '') + '_muet.mp4';
  const ff = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(IPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', muet], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffFin = new Promise(ok => ff.on('exit', ok)); const IMG = 1000 / IPS, SOUS = MODE === 'complet' ? Math.max(1, Math.round(IMG / (1000 / 60))) : 1;
  const image = () => page.evaluate(([sous, ms]) => { const R = window.__r; for (let i = 0; i < sous - 1; i++) { const a = R.shadowMap.autoUpdate; R.shadowMap.autoUpdate = false; window.__sansDessin = true; window.__avance(ms / sous); R.shadowMap.autoUpdate = a; } window.__sansDessin = false; window.__avance(ms / sous); return { t: window.__t(), att: window.__att.n }; }, [SOUS, IMG]);
  const calme = async x => { if (!x.att) return; const a = Date.now(); while (Date.now() - a < 60000) { await pause(40); if ((await page.evaluate(() => window.__att.n)) === 0) { await pause(60); if ((await page.evaluate(() => window.__att.n)) === 0) break; } } };
  const NIMG = Math.round(DUREE * IPS), journalClip = []; let n = 0;
  for (; n < NIMG; n++) { const x = await image(); const jpg = await page.screenshot({ type: 'jpeg', quality: 96 }); if (!ff.stdin.write(jpg)) await new Promise(ok => ff.stdin.once('drain', ok)); await calme(x);
    if (n % 3 === 0) { const e = await lit(); const c = e.coupe || {};
      if (!upFait && c.phase === 'coupe' && c.reste < 0.002 && !c.dansBois) { await page.evaluate(() => window.__clipUp()); upFait = true; tUp = n; journalClip.push({ t: +(n / IPS).toFixed(2), evt: 'fin du trait ' + (kT + 1) }); }
      if (upFait && kT + 1 < chemin.traits.length && n - tUp >= Math.round(0.5 * IPS)) { kT++; const t = await page.evaluate(p => window.__clipTrait(p), chemin.traits[kT]); upFait = false; journalClip.push({ t: +(n / IPS).toFixed(2), evt: 'trait ' + (kT + 1), n: t.n }); }
      if (upFait && !pousse && kT + 1 >= chemin.traits.length && n - tUp >= Math.round(0.6 * IPS) && c.tombent === 0) { pousse = true; const p = await page.evaluate(() => { const K = window.__inter71.scie; try { window.__inter71.message('', 1); window.__inter71.message = function () {}; } catch (e) {} K.pousse(); return { enCours: K.enCours, avance: K.avance, epouse: K.epouse }; }); journalClip.push({ t: +(n / IPS).toFixed(2), evt: 'pousse', p }); }
      if (n % Math.round(IPS / 2) === 0) journalClip.push({ t: +(n / IPS).toFixed(2), phase: c.phase, reste: c.reste, vides: c.vides, tombent: c.tombent, dansBois: c.dansBois }); }
    if (n % IPS === 0) fs.writeFileSync(path.join(SORTIE_DIR, `image_${(n / IPS).toFixed(0)}s.jpg`), jpg); }
  if (!upFait) await page.evaluate(() => window.__clipUp());
  ff.stdin.end(); await ffFin; fs.writeFileSync(SORTIE.replace(/\.mp4$/i, '') + '.journal.json', JSON.stringify({ chemin, camInfo, vitesse, journalClip, nav: journal }, null, 1));
  dit('journal : ' + JSON.stringify(journalClip.filter(j => j.evt)));
  await ctx.close(); await nav.close(); if (srv) srv.close();
  fs.renameSync(muet, SORTIE); dit(`CLIP PRÊT : ${SORTIE} (${(fs.statSync(SORTIE).size / 1e6).toFixed(1)} Mo, ${(n / IPS).toFixed(1)} s)`); process.exit(0);
})().catch(e => { console.error('ÉCHEC : ' + e.message); process.exit(1); });
