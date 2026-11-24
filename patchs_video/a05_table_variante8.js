// a05_table_variante8.js — table phrase → plan du groupe « variante8 » (blocs 30 à 34, écran inter_variante8_v8).
// L'écran a ses propres plans (V.PLANS : caméra K.CAM + étiquettes 3D par plan). On ne change pas ses caméras : on recale ses instants
// sur les phrases de la voix (phrases_mp3.json) et on resynchronise au début de chaque phrase (V.tEcran), la clé jaune passe par la table.
// Instants V.PLANS (ms depuis l'ouverture de l'écran = voix du bloc 30 - 1,2 s ; blocs : 30 = 0 s, 31 = 4,0 s, 32 = 25,0 s, 33 = 26,6 s, 34 = 54,8 s).
(function () {
  var VP = window.__videoPlans; if (!VP) return;
  function V() { return window.__variante8; }
  // plan :            0 ensemble, 1 joint1, 2 niveau, 3 jonction, 4 joint2large, 5 joint2 (sauté), 6 rive, 7 trois (3 × 6 orange), 8 trois (serrage), 9 fin
  var T_PLAN = [0, 9730, 13350, 18380, 26200, 31290, 31290, 36880, 46040, 51670];
  var frais = false, CACHEES = ["variante8_p3_0", "variante8_p6_0", "variante8_p6_2"];
  function regle() { var K = V(); if (!K || !K.PLANS) return;
    K.PLANS.forEach(function (p, i) { if (T_PLAN[i] != null) p.t = T_PLAN[i]; });
    K.POSE_TOTAL = 8000;   // pose des pièces finie avant le 1er gros plan (bloc 31, phrase 3)
    // étiquette des rives : la voix sépare le bout de 3 × 6 des rives (sans longueur) du 3 × 6 de 24 po des joints de 8 pi
    (window.__etiquettesV19 || []).forEach(function (d) { if (!d) return;
      if (d.id === "variante8_p6_1") d.texte = "Bout de 3 × 6 le long des rives : vissé aux 2 sections";
      if (d.id === "variante8_p9_0") d.texte = "Bout de 3 × 6 le long des rives";
      // étiquettes d'une phrase déjà passée (niveau sur la jonction ; soutien et 6 × 6 doublé sur la rive) : cachées
      if (CACHEES.indexOf(d.id) >= 0 && !d.__v8Cache) { d.__v8Cache = true; d.actif = function () { return false; }; } }); }
  // aller au plan i : écran frais (lecture commencée à ce bloc) → pièces posées d'un coup ; sinon simple recalage de la minuterie
  function va(i) { return function () { var K = V(); if (!K || !K.ouvert || !K.pret || !K.PLANS[i]) return;
    if (frais) { frais = false; K.allerPlan(i); } else if (K.tEcran) K.tEcran = performance.now() - K.PLANS[i].t - 1; }; }
  ["30", "31", "32", "33", "34"].forEach(function (id) { VP.au(id, function (ctx) { regle(); frais = !!ctx.nouveau && id !== "30"; }); });
  // plan courant au début de chaque bloc (utile quand la lecture commence à ce bloc), puis à chaque phrase
  var CALAGE = { "30": [[0, 0]], "31": [[0, 0], [4.53, 1], [8.15, 2], [13.18, 3]], "32": [[0, 4]], "33": [[0, 4], [3.49, 6], [9.08, 7], [18.24, 8], [23.87, 9]], "34": [[0, 9]] };
  Object.keys(CALAGE).forEach(function (id) { CALAGE[id].forEach(function (c) { VP.a(id, c[0], va(c[1])); }); });

  VP.definir("30", [{ t: 0, cle: "Seulement des 6 × 6 de 8 pi ?" }]);
  VP.definir("31", [
    { t: 1.79, cle: "Deux 6 × 6 de 8 pi bout à bout : 16 pi" },
    { t: 4.53, cle: "Joint toujours sur un blocage" },
    { t: 8.15, cle: "Les deux 6 × 6 parfaitement de niveau" },
    { t: 13.18, cle: "Jonction : 6 × 6 doublé, un sous chaque section" },
    { t: 17.96, cle: "Chaque bout de madrier appuyé au complet" }]);
  VP.definir("32", [{ t: 0, cle: null }]);
  VP.definir("33", [
    { t: 0, cle: "Section 2 : joint sur un soutien" },
    { t: 3.49, cle: "Rives : bout de 3 × 6 vissé aux 2 sections" },
    { t: 9.08, cle: "Joints des 8 pi : 3 × 6 de 24 po à cheval" },
    { t: 15.32, cle: "Seulement les rives et le madrier du milieu" },
    { t: 18.24, cle: "Serrage (étape 7) : planche vissée dans ces 3 madriers" },
    { t: 23.87, cle: "Même cadrage, même 32 po centre" }]);
  VP.definir("34", [{ t: 0, cle: null }]);
})();
