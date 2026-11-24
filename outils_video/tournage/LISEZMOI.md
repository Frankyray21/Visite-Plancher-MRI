# Outils de tournage de la visite narrée (copie du 2026-11-24)

Ces scripts tournent depuis `C:/IA/video/outils/` (le dépôt est cloné à côté, dans `C:/IA/video/depot/`) :
ils cherchent `../depot/outils_video/node_modules` (playwright-core, ffmpeg-static) et `../depot/voix`.

- `injecte_patchs.js` : ajoute les `<script src="patchs_video/…">` à la copie vidéo de index.html.
- `mesure_voix.js` : durées et silences des mp3 (`phrases_mp3.json`, `durees_voix.json`).
- `filme_v2.js` : tournage complet (horloge simulée, images vers ffmpeg, voix mixées) ; `--sous-titres` interdit (règle du projet).
- `filme_segment.js` : refilme un ou plusieurs blocs seulement (`--de --garde-de --garde-jusqua`).
- `recolle_segments.js` : remplace (`--seg "4:seg_4.mp4"`) ou insère (`--ins "46:clip.mp4"`) des segments aux frontières de blocs du journal, sans ré-encoder le reste.
- `clip_scie.js` : clip de la scie va-et-vient (coupes puis poussée du plancher secondaire) piloté par le module de coupe du jeu.
- `controle_a22.js`, `apercu_bloc.js`, `decoupe_v26.js`, `correle_*.js` : contrôles et aperçus.

Chaîne de la v8 : v6 → `filme_segment` (blocs 4 et 49 avec les voix enregistrées par l'utilisateur) → `recolle_segments --seg` = v7 → `clip_scie` → `recolle_segments --ins 46:` = v8.
