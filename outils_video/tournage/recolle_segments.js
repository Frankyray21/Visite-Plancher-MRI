// Recolle des segments refilmés (filme_segment.js) dans une vidéo déjà filmée, aux frontières de blocs (images du journal).
//   node recolle_segments.js --base visite_v6.mp4 --journal visite_v6.journal.txt --sortie visite_v7.mp4 --seg "4:seg_4.mp4;49:seg_49.mp4" [--ips 30]
// Chaque segment remplace [début du bloc id, début du bloc suivant dans le journal[. Chaque morceau est encodé à part (NVENC h264, aac 160k mono
// 44,1 kHz) puis les morceaux sont enchaînés sans ré-encodage (concat demuxer) : pas de mise en mémoire de toute la vidéo.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const BASE = path.resolve(arg('base')), J = fs.readFileSync(path.resolve(arg('journal')), 'utf8'), SORTIE = path.resolve(arg('sortie')), IPS = +arg('ips', 30);
const FF = path.join(__dirname, '..', 'depot', 'outils_video', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const blocs = []; for (const m of J.matchAll(/image (\d+) \([\d.]+ s de vidéo\) : bloc (\S+)/g)) blocs.push({ img: +m[1], id: m[2] });
function images(f) { const p = spawnSync(FF, ['-hide_banner', '-stats', '-threads', '4', '-i', f, '-map', '0:v:0', '-f', 'null', '-'], { encoding: 'utf8' }); const m = [...(p.stderr + p.stdout).matchAll(/frame=\s*(\d+)/g)].pop(); if (!m) throw new Error('images non comptées : ' + f); return +m[1]; }
const total = images(BASE);
// --ins "46:clip.mp4" : clip INSÉRÉ au début du bloc (rien remplacé, son muet ajouté si le clip n'en a pas)
const segs = [...(arg('seg', '') ? arg('seg').split(';').map(x => [x, false]) : []), ...(arg('ins', '') ? arg('ins').split(';').map(x => [x, true]) : [])].map(([s, ins]) => { const [id, f] = s.split(':'); const k = blocs.findIndex(b => b.id === id); if (k < 0) throw new Error('bloc ' + id + ' absent du journal');
  return { id, f: path.resolve(f), ins, de: blocs[k].img, a: ins ? blocs[k].img : (k + 1 < blocs.length ? blocs[k + 1].img : total) }; }).sort((a, b) => a.de - b.de);
const morceaux = []; let cur = 0;
for (const s of segs) { if (s.de > cur) morceaux.push({ base: true, de: cur, a: s.de }); morceaux.push({ base: false, f: s.f, id: s.id, ins: s.ins }); cur = s.a; }
if (cur < total) morceaux.push({ base: true, de: cur, a: total });
console.log('morceaux :', morceaux.map(m => m.base ? `base ${m.de}-${m.a}` : `segment bloc ${m.id} (${path.basename(m.f)})`).join(' | '), '; total base', total, 'images');
const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'recolle-')); const liste = [];
const ENC = ['-c:v', 'h264_nvenc', '-preset', 'p5', '-rc', 'vbr', '-cq', '19', '-b:v', '0', '-pix_fmt', 'yuv420p', '-r', String(IPS), '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-ac', '1', '-video_track_timescale', '15360'];
morceaux.forEach((m, i) => { const out = path.join(tmp, `m${i}.mp4`); let args;
  if (m.base) { const t0 = m.de / IPS, n = m.a - m.de; args = ['-hide_banner', '-loglevel', 'error', '-y', '-ss', t0.toFixed(6), '-i', BASE, '-frames:v', String(n), '-t', (n / IPS).toFixed(6), '-vf', 'fps=' + IPS, '-af', 'aresample=44100', ...ENC, out]; }
  else if (m.ins) { args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', m.f, '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-map', '0:v:0', '-map', '1:a:0', '-shortest', '-vf', `scale=1920:1080,fps=${IPS}`, ...ENC, out]; }
  else { args = ['-hide_banner', '-loglevel', 'error', '-y', '-i', m.f, '-vf', `scale=1920:1080,fps=${IPS}`, '-af', 'aresample=44100', ...ENC, out]; }
  let r = spawnSync(FF, args, { stdio: 'inherit' });
  if (r.status !== 0) { const k = args.indexOf('h264_nvenc'); args.splice(k - 1, 10, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', String(IPS)); r = spawnSync(FF, args, { stdio: 'inherit' }); }
  if (r.status !== 0) throw new Error('morceau ' + i + ' : ffmpeg a échoué');
  const n = images(out); console.log(`morceau ${i} : ${n} images` + (m.base ? ` (attendu ${m.a - m.de})` : '')); m.n = n; liste.push(`file '${out.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`); });
const lst = path.join(tmp, 'liste.txt'); fs.writeFileSync(lst, liste.join('\n') + '\n');
const c = spawnSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', '-movflags', '+faststart', SORTIE], { stdio: 'inherit' });
if (c.status !== 0) throw new Error('enchaînement : ffmpeg a échoué');
// journal recomposé : images de début des blocs dans la nouvelle vidéo
let dec = 0; const lignes = []; const segParId = Object.fromEntries(segs.map(s => [s.id, s]));
for (const b of blocs) { const s = segParId[b.id]; lignes.push(`image ${b.img + dec} (${((b.img + dec) / IPS).toFixed(1)} s de vidéo) : bloc ${b.id}`); if (s) { if (s.ins) lignes[lignes.length - 1] = `image ${b.img + dec} (${((b.img + dec) / IPS).toFixed(1)} s de vidéo) : clip inséré avant le bloc ${b.id}`; dec += morceaux.find(m => !m.base && m.id === s.id).n - (s.a - s.de); if (s.ins) lignes.push(`image ${b.img + dec} (${((b.img + dec) / IPS).toFixed(1)} s de vidéo) : bloc ${b.id}`); } }
fs.writeFileSync(SORTIE.replace(/\.mp4$/i, '') + '.journal.txt', lignes.join('\n') + '\n');
fs.rmSync(tmp, { recursive: true, force: true });
console.log('VIDÉO PRÊTE :', SORTIE, (fs.statSync(SORTIE).size / 1e6).toFixed(0), 'Mo ;', images(SORTIE), 'images (attendu', morceaux.reduce((a, m) => a + m.n, 0) + ')');
