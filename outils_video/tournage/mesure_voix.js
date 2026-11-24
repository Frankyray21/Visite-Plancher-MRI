// Remesure les mp3 de depot/voix : durées (durees_voix.json, lu par filme_gpu/apercu) et pauses (phrases_mp3.json : fin des silences = début
// des phrases, utilisé pour caler les t des tables a05). Textes des phrases = blocs_v26_texte.json découpé sur « … ».
//   node mesure_voix.js [--noise -30] [--d 0.3]
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : process.argv[i + 1]; };
const FF = 'C:/IA/video/depot/outils_video/node_modules/ffmpeg-static/ffmpeg.exe', VOIX = 'C:/IA/video/depot/voix';
const NOISE = arg('noise', '-30'), DMIN = arg('d', '0.3');
const B = JSON.parse(fs.readFileSync('C:/IA/video/blocs_v26_texte.json', 'utf8'));
const durees = {}, phrases = {};
for (const b of B) { const id = String(b.id), f = path.join(VOIX, `bloc_${id}.mp3`); if (!fs.existsSync(f)) continue;
  let out = ''; try { execFileSync(FF, ['-hide_banner', '-i', f, '-af', `silencedetect=noise=${NOISE}dB:d=${DMIN}`, '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { out = (e.stderr || '') + (e.stdout || ''); }
  if (!/Duration/.test(out)) out = require('child_process').spawnSync(FF, ['-hide_banner', '-i', f, '-af', `silencedetect=noise=${NOISE}dB:d=${DMIN}`, '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const duree = +(/Duration: (\d+):(\d+):([\d.]+)/.exec(out).slice(1).reduce((a, v, i) => a + +v * [3600, 60, 1][i], 0)).toFixed(2);
  const sil = []; let cur = null; for (const m of out.matchAll(/silence_(start|end): ([\d.]+)/g)) { if (m[1] === 'start') cur = +(+m[2]).toFixed(2); else { sil.push([cur, +(+m[2]).toFixed(2)]); cur = null; } }
  if (cur !== null) sil.push([cur, duree]);
  const textes = b.texte.split('…').map(s => s.trim()).filter(Boolean);
  durees[id] = duree; phrases[id] = { duree, silences: sil, nPhrases: textes.length, phrases: textes }; }
fs.writeFileSync('C:/IA/video/depot/outils_video/durees_voix.json', JSON.stringify(durees, null, 1));
fs.writeFileSync('C:/IA/video/phrases_mp3.json', JSON.stringify(phrases, null, 1));
let total = 0; for (const k in durees) total += durees[k];
console.log(Object.keys(durees).length, 'blocs mesurés, total', total.toFixed(1), 's');
// comparaison avec la v25 : nombre de pauses internes (silences qui ne touchent pas la fin) ancien vs nouveau
const P0 = JSON.parse(fs.readFileSync('C:/IA/video/phrases_mp3_v25.json', 'utf8')), D0 = JSON.parse(fs.readFileSync('C:/IA/video/depot/outils_video/durees_voix_v25.json', 'utf8'));
const interne = p => p.silences.filter(s => s[1] < p.duree - 0.05).length;
const diff = []; for (const id in phrases) { if (!P0[id]) continue; const a = interne(P0[id]), n = interne(phrases[id]); diff.push(`${id}: ${D0[id]}→${durees[id]} s, pauses ${a}→${n}${a !== n ? ' ≠' : ''}`); }
console.log(diff.join('\n'));
