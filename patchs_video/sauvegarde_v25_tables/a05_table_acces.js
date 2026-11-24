// Table phrase → plan du groupe « acces » (blocs 40 à 45, étapes 14 à 17). Seulement des appels au moteur a04 (window.__videoPlans).
// Instants = secondes de voix du bloc (fin des silences de phrases_mp3.json). Une entrée avec cam porte sa clé (affichée 0,8 s après) ;
// une entrée avec cam sans clé efface la puce : la clé de la phrase suit alors dans une entrée sans cam, au moins 0,8 s plus tard.
(function () {
  var VP = window.__videoPlans; if (!VP) return;

  // ---- caméras propres à cette table (repère monde, m ; voir carto/camera.md §7)
  var CAM = {
    hauteur: { tgt: [9.9, -0.05, -0.6], dir: [1, 0.3, -0.25], r: 1.5 },     // bout d'entrée : cote « 22 po » + marches
    cote:    { tgt: [10.15, -0.22, 0.95], dir: [0.3, 0.18, -1], r: 0.85 },  // marches de côté, au ras du sol (ordre de montage)
    lisses:  { tgt: [9.75, 0.7, -1.3], dir: [1, 0.2, 0.3], r: 1.1 },        // garde-corps du bout, de l'extérieur : lisse du haut et mi-hauteur
    pied:    { tgt: [9.74, 0.3, -1.2], dir: [-1, 0.55, 0.25], r: 0.75 }     // bas du garde-corps vu du plancher : coup de pied au ras du plancher
  };

  // Bloc 40 — Étape 14 : plancher > 12 po, marches 16 po, 36 à 60 po, 12 po max, on vise 9.
  VP.definir("40", [
    { t: 0,    cam: CAM.hauteur, cle: null, etq: ["22 po : plus de 12 po"] },
    { t: 1.45, cle: "Le plancher dépasse 12 po" },
    { t: 3.9,  plan: "c", cle: "Marches : 16 po de profondeur, 36 à 60 po de large", etq: ["Giron 16 po min.", "Largeur 48 po (36 à 60 po)"] },
    { t: 8.9,  plan: "b", cle: "12 po de haut au plus ; on vise 9 po", etq: ["9 po sous le dessus du plancher (12 po max.)"] }
  ]);

  // Bloc 41 — question de l'apprenti : vue basse de côté (ordre de montage), pas de clé.
  VP.definir("41", [
    { t: 0, cam: CAM.cote, cle: null, etq: [] }
  ]);

  // Bloc 42 — de bas en haut : 3 × 8 à plat, un bout de 6 × 6 par appui, dessus deux 3 × 8.
  VP.definir("42", [
    { t: 1.47, cle: "En bas : 3 × 8 à plat sur le sol, de niveau" },
    { t: 5.2,  cle: "Au-dessus : un bout de 6 × 6 par appui, jamais empilé" },
    { t: 9.2,  plan: "c", cle: "Dessus : deux 3 × 8 pour la marche", etq: ["Giron 16 po min."] }
  ]);

  // Bloc 43 — Étape 15 : garde-corps (RSST art. 12), lisse du haut, lisse à mi-hauteur, coup de pied.
  VP.definir("43", [
    { t: 0,    plan: "a", cle: null, etq: ["22 po : plus de 12 po"] },
    { t: 1.35, cle: "Plus de 12 po avec un vide : garde-corps (RSST, art. 12)" },
    { t: 6.0,  cam: CAM.lisses, cle: "Lisse du haut : entre 1 m et 1,2 m", etq: ["1 m à 1,2 m"] },
    { t: 9.8,  cle: "Une lisse à mi-hauteur" },
    { t: 11.3, cam: CAM.pied, cle: "Coup de pied au ras du plancher", etq: ["Coup de pied : 2 × 4 brut sur chant"] },   // étiquette renommée par a03_textes_cotes.js (A16)
    // Correctif garde-corps (utilisateur 2026-11-24) : truc du 2 × 4 de 8 pi coupé en deux = 2 montants de 48 po ; quatre 2 × 4 = une section de 8 pi.
    // t PROVISOIRE (fin de la voix actuelle, 14,3 s) : la phrase du truc arrive avec la voix 43 réenregistrée (script v26) ; recaler t sur phrases_mp3.json.
    { t: 13.3, cam: CAM.lisses, cle: "Truc : un 2 × 4 de 8 pi coupé en 2 = 2 montants de 48 po", etq: ["1 m à 1,2 m"] }
  ]);

  // Bloc 44 — Étape 16 : un seul plan, mains courantes des deux bords.
  VP.definir("44", [
    { t: 0,   plan: "c", cle: null, etq: [] },
    { t: 1.3, cle: "Plus d'une marche : mains courantes des deux bords" }
  ]);

  // Bloc 45 — Étape 17 : ouverture entre le plancher et le mur ; grillage de 24 po au bas du mur (procédure p. 16, point 17).
  // Le grillage 3D a été retiré à la demande de l'utilisateur (G.ACTIF = false) : l'image montre l'ouverture, la clé dit la règle.
  VP.definir("45", [
    { t: 0,     plan: "a", cle: null },
    { t: 1.44,  cle: "Entre le plancher et le mur : une ouverture" },
    { t: 5.2,   plan: "b", cle: "Si le pied passe : grillage de 24 po au bas du mur" },
    { t: 10.63, cle: "Il bloque l'ouverture : le pied ne passe plus" }
  ]);
})();
