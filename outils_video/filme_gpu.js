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
const D = require('./durees_voix.json'), horloge2 = require('./horloge2.js'); const pause = ms => new Promise(r => setTimeout(r, ms));
let chromium; try { chromium = require('playwright-core').chromium; } catch (e) { chromium = require('playwright').chromium; }
let FFMPEG = 'ffmpeg'; try { FFMPEG = require('ffmpeg-static') || 'ffmpeg'; } catch (e) {}
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
  // tournage : les images vont directement à ffmpeg
  const muet = SORTIE.replace(/\.mp4$/i, '') + '_muet.mp4';
  const ff = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(IPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', muet], { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffFin = new Promise(ok => ff.on('exit', ok)); const IMG = 1000 / IPS, SOUS = MODE === 'complet' ? Math.max(1, Math.round(IMG / (1000 / 60))) : 1;
  const image = () => page.evaluate(([sous, ms]) => { const R = window.__r; for (let i = 0; i < sous - 1; i++) { const a = R.shadowMap.autoUpdate; R.shadowMap.autoUpdate = false; window.__sansDessin = true; window.__avance(ms / sous); R.shadowMap.autoUpdate = a; }
    window.__sansDessin = false; window.__avance(ms / sous); const NV = window.__narrationV155; return { t: window.__t(), etat: NV.etat, i: NV.i, att: window.__att.n }; }, [SOUS, IMG]);
  const calme = async x => { if (!x.att) return; const a = Date.now(); while (Date.now() - a < 60000) { await pause(40); if ((await page.evaluate(() => window.__att.n)) === 0) { await pause(60); if ((await page.evaluate(() => window.__att.n)) === 0) break; } } };
  await page.evaluate(() => { window.__voixV157.geste = true; window.__narrationV155.SOUS_TITRES = false; window.__narrationV155.joue(0); });
  let x = await page.evaluate(() => { window.__sansDessin = true; window.__avance(1000 / 60); return { att: window.__att.n }; }); await calme(x);
  let n = 0, T0 = null, fin = -1, dernier = -2; const ids = await page.evaluate(() => window.__narrationV155.BLOCS.map(b => String(b.id)));
  for (; n < MAX; n++) { x = await image(); if (T0 === null) T0 = x.t; const jpg = await page.screenshot({ type: 'jpeg', quality: 96 }); if (!ff.stdin.write(jpg)) await new Promise(ok => ff.stdin.once('drain', ok)); await calme(x);
    if (x.i !== dernier) { dernier = x.i; dit(`image ${n} (${(n / IPS).toFixed(1)} s de vidéo) : bloc ${ids[x.i] || '?'}`); }
    if (x.etat === 'fini' || x.etat === 'arrete') { if (fin < 0) fin = n; if (n - fin >= 2 * IPS) { n++; break; } } }
  ff.stdin.end(); await ffFin; const pistes = await page.evaluate(() => window.__pistes); const duree = n / IPS; dit(`tournage fini : ${n} images (${duree.toFixed(1)} s), ${pistes.length} voix ; journal du navigateur : ${JSON.stringify(journal.slice(0, 5))}`);
  await ctx.close(); await nav.close();
  // voix : chaque bloc au moment où la visite l'a lancé
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'voix-')); const entrees = [], filtres = [], noms = [];
  for (let k = 0; k < pistes.length; k++) { const p = pistes[k], f = path.join(tmp, `bloc_${p.id}.mp3`); if (DEPOT) fs.copyFileSync(path.join(DEPOT, 'voix', `bloc_${p.id}.mp3`), f); else await telecharge(base + `voix/bloc_${p.id}.mp3`, f);
    const ms = Math.max(0, Math.round(p.t - T0)); entrees.push('-i', f); filtres.push(`[${k + 1}:a]aresample=44100,adelay=${ms}:all=1[a${k}]`); noms.push(`[a${k}]`); }
  const graphe = filtres.join(';') + ';' + noms.join('') + `amix=inputs=${noms.length}:normalize=0:dropout_transition=0,afade=t=out:st=${Math.max(0, duree - 1).toFixed(2)}:d=1[son];[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st=${Math.max(0, duree - 1).toFixed(2)}:d=1[v]`;
  const g = path.join(tmp, 'graphe.txt'); fs.writeFileSync(g, graphe);
  const m = spawnSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-i', muet, ...entrees, '-filter_complex_script', g, '-map', '[v]', '-map', '[son]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-t', duree.toFixed(3), '-movflags', '+faststart', SORTIE], { stdio: 'inherit' });
  if (m.status !== 0) throw new Error('montage des voix : ffmpeg a échoué (la vidéo sans son est dans ' + muet + ')'); fs.unlinkSync(muet); fs.rmSync(tmp, { recursive: true, force: true }); if (srv) srv.close();
  dit(`VIDÉO PRÊTE : ${SORTIE} (${(fs.statSync(SORTIE).size / 1e6).toFixed(0)} Mo, ${duree.toFixed(0)} s, ${IPS} images/s)`); process.exit(0);
})().catch(e => { console.error('ÉCHEC : ' + e.message); process.exit(1); });
