// Contrôle A22 après un tournage avec filme_v2.js :
//   node controle_a22.js --video C:\IA\video\visite_v2.mp4 [--planche C:\IA\video\planche_v2.jpg] [--rapport C:\IA\video\controle_v2.md]
// 1. lit <video sans .mp4>.controle.json (table des plans, blocs, journal des clés effectives) et le journal du tournage (lignes « image n … : bloc id ») ;
// 2. vérifie, pour chaque plan de la table, qu'une clé identique a été affichée entre t et t + 1,8 s (sinon : manquante ou en retard) ;
// 3. tire 3 images par bloc (début de voix + 1/6, 1/2, 5/6 de la durée) et monte une planche numérotée ;
// 4. écrit un rapport markdown.
const fs = require('fs'), path = require('path'), { execFileSync, spawnSync } = require('child_process');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const VIDEO = path.resolve(arg('video', 'C:/IA/video/visite_v2.mp4')), BASE = VIDEO.replace(/\.mp4$/i, '');
const PLANCHE = path.resolve(arg('planche', BASE + '_planche.jpg')), RAPPORT = path.resolve(arg('rapport', BASE + '_controle.md'));
const JOURNAL = path.resolve(arg('journal', BASE + '.journal.txt'));
const FF = path.join(__dirname, '..', 'depot', 'outils_video', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const C = JSON.parse(fs.readFileSync(BASE + '.controle.json', 'utf8'));
const D = require(path.join(__dirname, '..', 'depot', 'outils_video', 'durees_voix.json'));
// débuts de blocs d'après le journal du tournage (NV.i change) et débuts de voix d'après __pistes
const lignes = fs.existsSync(JOURNAL) ? fs.readFileSync(JOURNAL, 'utf8').split('\n') : [];
const debuts = lignes.map(l => l.match(/\((\d+\.\d) s de vidéo\) : bloc (\S+)/)).filter(Boolean).map(m => ({ id: m[2], t: +m[1] }));
const voix = {}; for (const p of C.pistes || []) if (!(p.id in voix)) voix[p.id] = (p.t - C.T0) / 1000;
// 2. clés : table vs journal effectif
const lig = [], manq = []; let nPlans = 0, nOk = 0;
for (const id in C.table) { const J = (C.journal || []).filter(j => j.id === id);
  for (const p of C.table[id]) { if (p.cle === undefined || p.cle === null) continue; nPlans++;
    const att = p.t + (p.cam ? 0.8 : 0); const hit = J.find(j => j.cle === p.cle && j.t >= p.t - 0.3 && j.t <= att + 1.8);
    if (hit) { nOk++; if (hit.t - att > 1.0) lig.push(`| ${id} | ${p.t} | ${p.cle} | en retard de ${(hit.t - att).toFixed(1)} s |`); }
    else { const proche = J.find(j => j.cle === p.cle); manq.push(`| ${id} | ${p.t} | ${p.cle} | ${proche ? 'affichée à ' + proche.t + ' s' : 'jamais affichée'} |`); } } }
const errs = (C.erreursVP || []).map(e => '- ' + (typeof e === 'string' ? e : JSON.stringify(e)).slice(0, 200));
// 3. planche : 3 images par bloc
const items = []; for (const b of debuts) { const d = D[b.id] || (C.blocs.find(x => x.id === b.id) || {}).d || 3; const t0 = voix[b.id] !== undefined ? voix[b.id] : b.t;
  for (const k of [0, 1, 2]) items.push({ id: b.id, k, t: +(t0 + d * (k + 0.5) / 3).toFixed(2) }); }
const dossier = BASE + '_images'; fs.mkdirSync(dossier, { recursive: true });
for (const it of items) { const f = path.join(dossier, `bloc_${it.id}_${it.k}.jpg`); if (!fs.existsSync(f)) execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(it.t), '-i', VIDEO, '-frames:v', '1', '-vf', 'scale=960:540', '-q:v', '4', f]); it.f = f; }
// planche : une ligne par bloc (3 images), 4 blocs par rangée de planche → 12 vignettes par ligne de 2880 px ; on fait des planches de 14 blocs
const blocsIds = debuts.map(b => b.id), par = 14, planches = [];
for (let p = 0; p * par < blocsIds.length; p++) { const ids = blocsIds.slice(p * par, (p + 1) * par), args = ['-hide_banner', '-loglevel', 'error', '-y']; let fc = '', n = 0;
  ids.forEach((id, r) => { for (const k of [0, 1, 2]) { const it = items.find(x => x.id === id && x.k === k); args.push('-i', it.f); fc += `[${n}:v]scale=480:270,drawtext=text='${id}${k === 0 ? '' : ''}':fontsize=36:fontcolor=yellow:borderw=3:x=8:y=8[v${n}];`; n++; } });
  fc += Array.from({ length: n }, (_, i) => `[v${i}]`).join('') + `xstack=inputs=${n}:layout=${Array.from({ length: n }, (_, i) => `${(i % 3) * 480}_${Math.floor(i / 3) * 270}`).join('|')}:fill=black[out]`;
  const fcf = BASE + `_planche${p}.txt`; fs.writeFileSync(fcf, fc); const out = PLANCHE.replace(/\.jpg$/i, '') + `_${p + 1}.jpg`; args.push('-filter_complex_script', fcf, '-map', '[out]', '-q:v', '5', out);
  const r = spawnSync(FF, args, { encoding: 'utf8' }); if (r.status !== 0) console.error(r.stderr.split('\n').filter(l => !/Fontconfig/.test(l)).join('\n')); planches.push(out); }
// 4. rapport
const md = [`# Contrôle A22 — ${path.basename(VIDEO)}`, '', `Images : ${C.images} (${(C.images / C.ips).toFixed(1)} s) ; blocs joués : ${debuts.length} ; voix : ${(C.pistes || []).length}.`, '',
  `## Clés planifiées vs affichées`, '', `Plans avec clé : ${nPlans} ; affichés à l'heure : ${nOk - lig.length} ; en retard (> 1 s) : ${lig.length} ; manquants : ${manq.length}.`, '',
  ...(manq.length ? ['| Bloc | t | Clé | Constat |', '|---|---|---|---|', ...manq, ''] : []), ...(lig.length ? ['| Bloc | t | Clé | Retard |', '|---|---|---|---|', ...lig, ''] : []),
  `## Erreurs du moteur`, '', ...(errs.length ? errs : ['aucune']), '', `## Erreurs du navigateur`, '', ...((C.journalNav || []).length ? C.journalNav.map(e => '- ' + e) : ['aucune']), '',
  `## Ordre des blocs joués`, '', debuts.map(b => `${b.id} (${b.t} s)`).join(' → '), '', `## Planches`, '', ...planches.map(p => '- ' + p)].join('\n');
fs.writeFileSync(RAPPORT, md); console.log(md.split('\n').slice(0, 12).join('\n')); console.log('rapport :', RAPPORT, '; planches :', planches.join(', '));
