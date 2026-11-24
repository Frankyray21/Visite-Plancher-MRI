// Découpe de la narration complète v26 (un seul mp3 de l'utilisateur) en blocs bloc_<id>.mp3, alignés sur l'ordre du script.
//   node decoupe_v26.js [--seuil -34] [--coupe]      (sans --coupe : analyse et table seulement)
// Méthode : 1. segments de parole par énergie (16 kHz PCM) ; 2. hauteur médiane par segment (autocorrélation) → Formateur (grave) /
// Travailleuse (aigu) ; 3. programmation dynamique : segments consécutifs → blocs dans l'ordre, coût = orateur + écart de durée
// par rapport à l'attendu (durée de l'ancien mp3, mise à l'échelle par le nombre de caractères quand le texte a changé).
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const DIR = 'C:/IA/video/v26_audio', FF = 'C:/IA/video/depot/outils_video/node_modules/ffmpeg-static/ffmpeg.exe';
const SR = 16000, HOP = 160; // 10 ms
const raw = fs.readFileSync(path.join(DIR, 'full16k.raw')); const N = raw.length / 2; const pcm = new Float32Array(N);
for (let i = 0; i < N; i++) pcm[i] = raw.readInt16LE(i * 2) / 32768;
// ---- 1. énergie par trame de 10 ms, segments de parole
const nF = Math.floor(N / HOP); const db = new Float32Array(nF);
for (let f = 0; f < nF; f++) { let s = 0; for (let i = f * HOP; i < (f + 1) * HOP; i++) s += pcm[i] * pcm[i]; db[f] = 10 * Math.log10(s / HOP + 1e-10); }
const SEUIL = +arg('seuil', -34), MIN_SIL = +arg('minsil', 0.30), MIN_PAROLE = 0.12;
let segs = []; let enParole = false, deb = 0, finParole = 0;
for (let f = 0; f <= nF; f++) { const v = f < nF && db[f] > SEUIL;
  if (v && !enParole) { if (segs.length && f * HOP / SR - segs[segs.length - 1].fin < MIN_SIL) { enParole = true; deb = segs.pop().deb * SR / HOP; } else { enParole = true; deb = f; } }
  if (v) finParole = f;
  if (!v && enParole && (f - finParole) * HOP / SR >= MIN_SIL) { enParole = false; segs.push({ deb: deb * HOP / SR, fin: (finParole + 1) * HOP / SR }); } }
if (enParole) segs.push({ deb: deb * HOP / SR, fin: (finParole + 1) * HOP / SR });
segs = segs.filter(s => s.fin - s.deb >= MIN_PAROLE);
// ---- 2. hauteur médiane par segment (autocorrélation sur trames de 40 ms, voisées si énergie et clarté suffisantes)
function hauteur(s) { const W = 640, pitches = []; for (let d = Math.floor(s.deb * SR); d + W < s.fin * SR; d += 320) {
    let e = 0; for (let i = 0; i < W; i++) e += pcm[d + i] * pcm[d + i]; if (10 * Math.log10(e / W + 1e-10) < SEUIL + 6) continue;
    let best = 0, bl = 0; for (let lag = 60; lag <= 320; lag++) { let c = 0, n1 = 0, n2 = 0; for (let i = 0; i < W - lag; i += 2) { c += pcm[d + i] * pcm[d + i + lag]; n1 += pcm[d + i] * pcm[d + i]; n2 += pcm[d + i + lag] * pcm[d + i + lag]; }
      const r = c / Math.sqrt(n1 * n2 + 1e-12); if (r > best) { best = r; bl = lag; } }
    if (best > 0.6) pitches.push(SR / bl); }
  if (!pitches.length) return { f0: 0, n: 0 }; pitches.sort((a, b) => a - b); return { f0: pitches[Math.floor(pitches.length / 2)], n: pitches.length }; }
for (const s of segs) Object.assign(s, hauteur(s));
const f0s = segs.filter(s => s.n > 5).map(s => s.f0).sort((a, b) => a - b);
// seuil entre les deux voix : plus grand trou de la distribution entre 120 et 260 Hz
let coupe = 165, meilleur = 0; for (let i = 1; i < f0s.length; i++) { if (f0s[i - 1] < 120 || f0s[i] > 260) continue; const g = f0s[i] - f0s[i - 1]; if (g > meilleur) { meilleur = g; coupe = (f0s[i] + f0s[i - 1]) / 2; } }
if (arg('coupehz')) coupe = +arg('coupehz');
for (const s of segs) s.voix = s.n > 5 ? (s.f0 < coupe ? 'F' : 'T') : '?';   // F = Formateur, T = Travailleuse
// ---- 3. blocs attendus
const B = JSON.parse(fs.readFileSync('C:/IA/video/blocs_v26_texte.json', 'utf8')).filter(b => String(b.id) !== '48');  // 47a absent du json, 48 retiré
const D = require('C:/IA/video/depot/outils_video/durees_voix.json');
const NOUV = { '5': 1.03, '9': 1.0, '11': 1.03, '15': 1.02, '24': 1.08, '39': 1.0, '43': 1.55, '45': 0.92, '48a': 1.03, '49': 1.35 }; // facteur de longueur du nouveau texte
const blocs = B.map(b => ({ id: String(b.id), voix: b.orateur === 'Formateur' ? 'F' : 'T', att: (D[String(b.id)] || 5) * (NOUV[String(b.id)] || 1) }));
// ---- 4. programmation dynamique : bloc k couvre les segments [i, j)
// ancres : positions trouvées par corrélation avec les mp3 de bloc fournis séparément par l'utilisateur (outils/correle_env.js)
const ANCRES = { '5': 40.38, '9': 73.00, '11': 93.74, '15': 123.96, '24': 207.12 };
const nS = segs.length, nB = blocs.length; const INF = 1e18;
const cout = new Float64Array((nS + 1) * (nB + 1)).fill(INF), prev = new Int32Array((nS + 1) * (nB + 1)).fill(-1);
const K = (i, k) => i * (nB + 1) + k; cout[K(0, 0)] = 0;
for (let k = 0; k < nB; k++) for (let i = 0; i < nS; i++) { const c0 = cout[K(i, k)]; if (c0 >= INF) continue;
  for (let j = i + 1; j <= nS && j <= i + 12; j++) { const duree = segs[j - 1].fin - segs[i].deb; const b = blocs[k];
    let c = Math.pow((duree - b.att) / Math.max(2, 0.25 * b.att), 2);
    if (ANCRES[b.id] !== undefined && Math.abs(segs[i].deb - ANCRES[b.id]) > 0.6) c += 1000;
    for (let m = i; m < j; m++) if (segs[m].voix !== '?' && segs[m].voix !== b.voix) c += 6;
    if (j < nS) { const trou = segs[j].deb - segs[j - 1].fin; c += trou < 0.45 ? 1.5 : 0; }   // une frontière de bloc tombe sur une vraie pause
    if (c0 + c < cout[K(j, k + 1)]) { cout[K(j, k + 1)] = c0 + c; prev[K(j, k + 1)] = i; } } }
if (cout[K(nS, nB)] >= INF) { console.error('pas d\'alignement : segments', nS, 'blocs', nB); process.exit(1); }
const res = []; let j = nS; for (let k = nB; k > 0; k--) { const i = prev[K(j, k)]; res.unshift({ ...blocs[k - 1], i, j, deb: segs[i].deb, fin: segs[j - 1].fin }); j = i; }
console.log(`segments ${nS}, blocs ${nB}, seuil voix ${coupe.toFixed(0)} Hz, coût ${cout[K(nS, nB)].toFixed(1)}`);
console.log('| bloc | voix | segs | début | fin | durée | attendue | écart | voix des segs |'); console.log('|---|---|---|---|---|---|---|---|---|');
let alertes = 0;
for (const r of res) { const d = r.fin - r.deb, e = (d - r.att) / r.att; const v = segs.slice(r.i, r.j).map(s => s.voix).join(''); const mauvais = [...v].filter(c => c !== '?' && c !== r.voix).length;
  if (Math.abs(e) > 0.25 || mauvais) alertes++;
  console.log(`| ${r.id} | ${r.voix} | ${r.j - r.i} | ${r.deb.toFixed(2)} | ${r.fin.toFixed(2)} | ${d.toFixed(2)} | ${r.att.toFixed(2)} | ${(e * 100).toFixed(0)} % | ${v}${mauvais ? ' ⚠' : ''} |`); }
console.log('alertes :', alertes);
fs.writeFileSync(path.join(DIR, 'decoupe.json'), JSON.stringify({ seuil: SEUIL, coupeHz: coupe, segments: segs, blocs: res }, null, 1));
// ---- 5. coupe
if (arg('coupe')) { const out = path.join(DIR, 'blocs'); fs.mkdirSync(out, { recursive: true });
  for (let n = 0; n < res.length; n++) { const r = res[n]; const avant = n ? res[n - 1].fin : 0, apres = n + 1 < res.length ? res[n + 1].deb : r.fin + 1;
    const t0 = Math.max(avant, r.deb - 0.12), t1 = Math.min(apres, r.fin + 0.35);
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', t0.toFixed(3), '-to', t1.toFixed(3), '-i', path.join(DIR, 'narration_plancher_v26.mp3'), '-ac', '1', '-ar', '44100', '-b:a', '128k', path.join(out, `bloc_${r.id}.mp3`)]); }
  console.log('coupés dans', out); }
