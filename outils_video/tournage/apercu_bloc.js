// Aperçu de la visite narrée : ouvre le site servi en local, construit le plancher, attend la stabilité, puis pour chaque
// bloc demandé lance la narration à ce bloc (NV.joue(id)) et prend une image à chaque instant t (secondes depuis le début du bloc).
//   node apercu_bloc.js --depot C:\IA\video\depot --blocs "9:0.5,4,7;10:1,6" --sortie C:\IA\video\apercus [--mode complet|allege] [--navigateur msedge]
//                       [--largeur 1280 --hauteur 720 --echelle 1] [--sous-titres] [--journal C:\...\journal.json] [--garde]
// Sortie : <sortie>/bloc_<id>_<t>.jpg et <journal> (par image : bloc, t, NV.i, clé jaune affichée, erreurs console).
// Même horloge simulée que filme_gpu.js (horloge2.js) : les durées sont celles de la vidéo finale.
const fs = require('fs'), path = require('path'), http = require('http');
const OUT = path.resolve(__dirname, '..', 'depot', 'outils_video');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const DEPOT = path.resolve(arg('depot', path.join(__dirname, '..', 'depot'))), SORTIE = path.resolve(arg('sortie', path.join(__dirname, '..', 'apercus')));
const NAV = arg('navigateur', 'msedge'), MODE = arg('mode', 'complet'), ST = !!arg('sous-titres', false), GARDE = !!arg('garde', false);
const L = +arg('largeur', 1280), H = +arg('hauteur', 720), ECH = +arg('echelle', 1);
const JOURNAL = path.resolve(arg('journal', path.join(SORTIE, 'journal.json')));
const D = require(path.join(OUT, 'durees_voix.json')), horloge2 = require(path.join(OUT, 'horloge2.js'));
const { chromium } = require(path.join(OUT, 'node_modules', 'playwright-core'));
const pause = ms => new Promise(r => setTimeout(r, ms));
// au plus 4 navigateurs à la fois sur cette machine : verrou par fichier dans ../verrous (attente jusqu'à 30 min)
const VERROUS = path.join(__dirname, '..', 'verrous'); fs.mkdirSync(VERROUS, { recursive: true }); let monVerrou = null;
async function prendVerrou() { const debut = Date.now(); for (;;) { for (let k = 1; k <= 4; k++) { const f = path.join(VERROUS, 'slot' + k); try { const st = fs.statSync(f); if (Date.now() - st.mtimeMs > 25 * 60000) fs.unlinkSync(f); else continue; } catch (e) {} try { fs.writeFileSync(f, String(process.pid), { flag: 'wx' }); monVerrou = f; return; } catch (e) {} } if (Date.now() - debut > 30 * 60000) throw new Error('aucun créneau de navigateur libre après 30 min'); await pause(3000 + Math.random() * 2000); } }
function rendVerrou() { try { if (monVerrou) fs.unlinkSync(monVerrou); } catch (e) {} }
process.on('exit', rendVerrou);
const t0 = Date.now(), dit = (...a) => console.log(`[${((Date.now() - t0) / 60000).toFixed(1)} min] ` + a.join(' '));
// --blocs "9:0.5,4,7;10:1,6"  ou  --plan fichier.json [{bloc:"9", t:[0.5,4]}]
function demandes() { const p = arg('plan', null); if (p) return JSON.parse(fs.readFileSync(path.resolve(p), 'utf8'));
  const s = arg('blocs', ''); if (!s) throw new Error('indiquer --blocs "id:t1,t2;id2:t" ou --plan fichier.json');
  return s.split(';').filter(Boolean).map(x => { const [id, ts] = x.split(':'); return { bloc: id.trim(), t: (ts || '1').split(',').map(Number) }; }); }
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.txt': 'text/plain', '.mp3': 'audio/mpeg', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
function serveur(dossier) { return new Promise(ok => { const s = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (p === '/') p = '/index.html'; const f = path.join(dossier, p);
    if (!f.startsWith(dossier) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
    r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Content-Length': fs.statSync(f).size, 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(r); }); s.listen(0, '127.0.0.1', () => ok(s)); }); }
(async () => {
  const DEM = demandes(); fs.mkdirSync(SORTIE, { recursive: true }); await prendVerrou();
  if (!fs.existsSync(path.join(DEPOT, 'index.html'))) throw new Error('index.html introuvable dans ' + DEPOT);
  const srv = await serveur(DEPOT), base = `http://127.0.0.1:${srv.address().port}/`;
  const options = { headless: false, channel: NAV, args: ['--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--disable-background-timer-throttling', '--disable-features=CalculateNativeWinOcclusion', '--autoplay-policy=no-user-gesture-required', '--force_high_performance_gpu', `--window-size=${L + 40},${H + 140}`] };
  const nav = await chromium.launch(options), ctx = await nav.newContext({ viewport: { width: L, height: H }, deviceScaleFactor: ECH, serviceWorkers: 'block' });
  await ctx.addInitScript(horloge2(D)); await ctx.route('**/voix/*.mp3', r => r.abort());
  const page = await ctx.newPage(); const journal = [], erreurs = [];
  page.on('pageerror', e => erreurs.push('erreur: ' + String(e.message).slice(0, 300))); page.on('console', m => { if (m.type() === 'error' && !/voix\/bloc_|ERR_FAILED|installing/.test(m.text())) erreurs.push('console: ' + m.text().slice(0, 300)); });
  await page.goto(base + 'index.html', { waitUntil: 'domcontentloaded', timeout: 180000 });
  const PAS = MODE === 'complet' ? 1000 / 60 : 40;
  const pas = async (n = 1, ms = PAS) => { const a = Date.now(); const r = await page.evaluate(([n, ms]) => { window.__sansDessin = true; for (let i = 0; i < n; i++) window.__avance(ms); return { t: window.__t(), att: window.__att.n, calme: window.__vrai() - window.__att.fin }; }, [n, ms]); const reste = n * ms - (Date.now() - a); if (reste > 0) await pause(reste); return r; };
  const etat = () => page.evaluate(() => { const vis = e => !!e && !e.hidden && getComputedStyle(e).display !== 'none' && e.getClientRects().length > 0, r = window.__r;
    if (r && !r.__esp) { r.__esp = 1; const f = r.render; r.render = function (sc, cam) { if (sc && sc.isScene && !this.getRenderTarget() && sc.children.length > 20) window.__sc = sc; return f.apply(this, arguments); }; }
    let mailles = 0; if (window.__sc) window.__sc.traverse(o => { if (o.isMesh && o.visible) mailles++; });
    return { accueil: vis(document.getElementById('accueil')), construire: vis(document.getElementById('acc-construire')), mailles, tex: r ? r.info.memory.textures : -1, geo: r ? r.info.memory.geometries : -1, prog: r && r.info.programs ? r.info.programs.length : -1 }; });
  let e, r; for (let i = 0; ; i++) { r = await pas(5); if (i % 5 === 4) { e = await etat(); if (e.accueil && e.construire) break; } if (Date.now() - t0 > 600000) throw new Error('accueil jamais affiché'); }
  dit('accueil affiché'); await page.evaluate(() => document.getElementById('acc-construire').click());
  const STABLE = MODE === 'complet' ? 20000 : 10000, MINI = MODE === 'complet' ? 40000 : 20000;
  let ref = '', depuis = 0, tClic = null; for (;;) { r = await pas(5); if (tClic === null) tClic = r.t; e = await etat(); const cle = [e.tex, e.geo, e.prog, e.mailles].join('|');
    if (cle !== ref) { ref = cle; depuis = r.t; } if (r.att === 0 && r.calme > 5000 && r.t - depuis > STABLE && r.t - tClic > MINI) break; if (Date.now() - t0 > 1500000) throw new Error('chargement jamais stable'); }
  dit('visite chargée : ' + JSON.stringify(e) + ' ; erreurs au chargement : ' + erreurs.length);
  const ok = await page.evaluate(() => !!(window.__voixV157 && window.__narrationV155)); if (!ok) throw new Error('narration absente');
  await page.evaluate(st => { window.__voixV157.geste = true; window.__narrationV155.SOUS_TITRES = st; }, ST);
  const image = ms => page.evaluate(ms => { window.__sansDessin = true; const n = Math.max(1, Math.round(ms / (1000 / 60))); for (let i = 0; i < n - 1; i++) window.__avance(ms / n); window.__sansDessin = false; window.__avance(ms / n); return window.__t(); }, ms);
  const calme = async () => { const a = Date.now(); while (Date.now() - a < 60000) { if ((await page.evaluate(() => window.__att.n)) === 0) { await pause(60); if ((await page.evaluate(() => window.__att.n)) === 0) break; } await pause(40); } };
  const lit = () => page.evaluate(() => { const NV = window.__narrationV155, c = document.getElementById('cle156'), vis = e => !!e && !e.hidden && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden' && e.getClientRects().length > 0;
    return { i: NV.i, etat: NV.etat, cle: c && vis(c) ? c.textContent.trim().slice(0, 120) : null, son: window.__voixV157.son && window.__voixV157.son() }; });
  for (const d of DEM) {
    const ts = d.t.slice().sort((a, b) => a - b); const n0 = erreurs.length;
    await page.evaluate(id => { window.__narrationV155.joue(id); }, d.bloc); let tv = await image(1000 / 60); await calme(); const debut = tv; let tCour = 0;
    // le bloc commence vraiment quand la voix part (cur.t0 = +1,2 s si la cible change) : on attend le départ de la piste
    for (let k = 0; k < 400; k++) { const p = await page.evaluate(id => { const P = window.__pistes; return P.length && P[P.length - 1].id === id ? P[P.length - 1].t : null; }, d.bloc); if (p !== null) { tCour = (tv - p) / 1000; break; } tv = await image(100); await calme(); }
    for (const t of ts) { const dt = Math.max(0, t - tCour) * 1000; if (dt > 0) { let fait = 0; while (fait < dt) { const step = Math.min(dt - fait, 1000); tv = await image(step); fait += step; } await calme(); tCour = t; }
      const f = path.join(SORTIE, `bloc_${d.bloc}_${String(t).replace('.', 'p')}.jpg`); await page.screenshot({ path: f, type: 'jpeg', quality: 90 }); const info = await lit();
      journal.push({ bloc: d.bloc, t, fichier: f, i: info.i, etat: info.etat, cle: info.cle, erreurs: erreurs.slice(n0) }); dit(`bloc ${d.bloc} t=${t}s : clé « ${info.cle || '—'} » ; erreurs ${erreurs.length - n0}`); }
    await page.evaluate(() => { try { window.__narrationV155.arrete(); } catch (e) {} });
  }
  fs.writeFileSync(JOURNAL, JSON.stringify({ images: journal, erreurs_chargement: erreurs }, null, 1));
  dit(`fini : ${journal.length} images dans ${SORTIE} ; journal ${JOURNAL}`);
  if (!GARDE) { await ctx.close(); await nav.close(); srv.close(); rendVerrou(); process.exit(0); }
})().catch(e => { console.error('ÉCHEC : ' + e.message); process.exit(1); });
