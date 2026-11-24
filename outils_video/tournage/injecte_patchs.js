// Injecte (ou met à jour) dans index.html les balises <script> des patchs vidéo : tous les fichiers depot/patchs_video/*.js, triés par nom,
// entre les marqueurs <!-- PATCHS_VIDEO --> … <!-- /PATCHS_VIDEO --> juste avant </body>. Réexécutable sans risque.
//   node injecte_patchs.js [--depot C:\IA\video\depot] [--aucun]   (--aucun retire les patchs)
const fs = require('fs'), path = require('path');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
const DEPOT = path.resolve(arg('depot', path.join(__dirname, '..', 'depot'))), AUCUN = !!arg('aucun', false);
const DOSSIER = path.join(DEPOT, 'patchs_video'); fs.mkdirSync(DOSSIER, { recursive: true });
const liste = AUCUN ? [] : fs.readdirSync(DOSSIER).filter(f => /\.js$/.test(f)).sort();
const bloc = liste.length ? `<!-- PATCHS_VIDEO -->\n${liste.map(f => `<script src="patchs_video/${f}"></script>`).join('\n')}\n<!-- /PATCHS_VIDEO -->\n` : '';
const f = path.join(DEPOT, 'index.html'); let s = fs.readFileSync(f, 'utf8');
s = s.replace(/<!-- PATCHS_VIDEO -->[\s\S]*?<!-- \/PATCHS_VIDEO -->\n?/, '');
const i = s.lastIndexOf('</body>'); if (i < 0) throw new Error('</body> introuvable'); s = s.slice(0, i) + bloc + s.slice(i);
fs.writeFileSync(f, s); console.log(`${liste.length} patch(s) injecté(s) : ${liste.join(', ') || 'aucun'}`);
