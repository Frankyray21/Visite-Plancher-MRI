// Table phrase -> plan du groupe « e12_e13 » (blocs 36, 37, 38 : étape 12 « Couvrir la section 2 » ; bloc 39 : étape 13 « Couper au ras »).
// t = secondes de voix du bloc (fins de silences de phrases_mp3.json).
// Étape 12 : l'animation du module reprise12 (window.__reprise12, instants R.t en ms depuis l'arrivée à l'étape) est recalée sur la voix :
// à chaque image, K.joue.t0 est réglé pour que le temps d'animation suive la courbe ANIM ci-dessous (points [t voix, ms d'animation],
// interpolation linéaire, paliers = gel). Les gros plans propres au module sont coupés (K.joue.libre) : la table cadre elle-même.
(function () {
  "use strict";
  var VP = window.__videoPlans; if (!VP) return;

  // ---------- cadrages ----------
  var CAM_S2 = { tgt: [7.6, -0.1, 0], dir: [0.5, 1.2, 0.3], r: 3.4 };                 // plan a de l'étape 12 : section 2 en plongée
  var CAM_JOURS = { tgt: [7.2, 0.24, -0.6], dir: [-0.25, 0.35, -0.9], r: 0.9 };       // rasant depuis l'allée sur les jours entre 3 × 8
  var CAM_CENTRE = { tgt: [5.0, 0.23, 0.6], dir: [-0.38, 0.72, -0.58], r: 1.0 };      // centre : vide des 2 planches de jonction (reprise12, cam 1)
  var CAM_MOITIE = { tgt: [5.85, 0.23, 0.6], dir: [-0.3, 0.72, -0.62], r: 1.7 };      // section 2 de près, planches replacées (reprise12, cam 2)
  var CAM_COINS = { tgt: [6.73, 0.27, -0.39], dir: [-0.2, 0.5, -0.84], r: 0.5 };      // tire-fonds temporaires et coins (reprise12, cam 3)
  var CAM_BOUT = { tgt: [7.0, 0.23, 0.0], dir: [-0.7, 0.55, -0.45], r: 2.6 };         // centre ET bout : les 2 rangées de tire-fonds (reprise12, cam 4)
  // A14 (a14_coins_tirefonds.js) : coins ET têtes de tire-fonds (grossies) dans le même plan : bout +z des rangées x 6,6 / 6,8, coin z 1,18
  var CAM_VIS_COINS = { tgt: [6.72, 0.23, 1.9], dir: [0.12, 1.0, -0.3], r: 0.75 };   // plongée sur le bout +z : têtes de vis z 2,36 en haut, coin z 1,18 en bas ; VG_DIST_MIN 1,1 (a14)
  // A14 : les 3 rangées finales (centre x 4,67, devant les coins x 6,6, bout x 9,65) à leur bout +z, vues d au-dessus du milieu du plancher
  var CAM_RANGS = { tgt: [7.2, 0.23, 2.15], dir: [0, 1.0, -0.55], r: 1.6 };
  // A14 : coin bout-rive côté allée (x 9,75, z -2,44) : bouts des 3 × 8 sur la rive et des 6 × 6 au bout ; copie de P13_s12_004 qui dépasse de 20 cm
  var CAM_DEPASSE = { tgt: [9.3, 0.15, -2.4], dir: [0.6, 0.75, -0.7], r: 0.85 };
  var CAM_RIVE = { tgt: [8.6, 0.1, 0.6], dir: [1, 0.75, -0.35], r: 2.2 };             // étape 13 : bout du plancher et rive, pas la paroi

  // ---------- étape 12 : temps d'animation de reprise12 en fonction de la voix ----------
  // repères (ms, décalage K.DEC compris) : couverture 0-3000 ; planches de jonction 5800-6620 ; replacées 6600-9100 ;
  // tire-fonds temporaires 9400-9800 ; coins 10100-10600 ; serrage 10900-12700 ; vis devant les coins 13000-13400 ;
  // coins retirés 13700-14200 ; tire-fonds retirés 14300-14800 ; planche suivante 14900-15400 ; jusqu'au bout 15600-18040 ; vis du centre et du bout 18300-18800.
  var ANIM = {
    "36": [[-5, -10], [2.81, -10], [6.6, 3000], [99, 3000]],           // section 2 nue pendant « deuxième section », couverte pendant « on la couvre… »
    "37": [[-5, 4400], [99, 4400]],                                     // « Pis rendu au centre ? » : le vide des 2 planches de jonction
    "38": [[-5, 5500], [2.4, 5700], [4.2, 6700], [4.6, 6750], [7.5, 9250], [8.4, 9350], [9.8, 9850], [10.86, 10050],
           [12.5, 12700], [14.4, 13450], [15.4, 13650], [17.6, 15000], [18.05, 15400], [20.33, 18100], [21.2, 18250], [23.5, 18850], [99, 18850]]
  };
  function f(L, t) { if (t <= L[0][0]) return L[0][1]; for (var k = 1; k < L.length; k++) if (t <= L[k][0]) { var a = L[k - 1], b = L[k]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); } return L[L.length - 1][1]; }
  function installeHorloge() {
    var I = window.__inter71; if (!I || typeof I.anime !== "function" || VP.__horlogeE12) return; VP.__horlogeE12 = true;
    I.anime(function () { try {
      var m = VP.maintenant(), K = window.__reprise12; if (!m || !K || !K.joue || !ANIM[m.id]) return;
      K.joue.libre = true;                                             // les gros plans du module ne prennent pas la caméra
      K.joue.t0 = performance.now() - f(ANIM[m.id], m.t);
    } catch (e) {} });
  }
  ["36", "37", "38"].forEach(function (id) { VP.au(id, installeHorloge); });

  // Bloc 36 : « Étape douze : la deuxième section. » (0-2,25) / « On la couvre du bout vers le centre, avec les trois par huit, sans serrer : » (2,81-6,65)
  //           « comme ça, on marche dessus pour placer les planches. » (7,17-9,57)
  VP.definir("36", [
    { t: 0, cam: CAM_S2, cle: null, etq: [] },
    { t: 2.81, cle: "On la couvre du bout vers le centre, sans serrer" },
    { t: 6.65, cam: CAM_JOURS, cle: "Sans serrer : on marche dessus pour placer les planches", etq: [] }
  ]);
  // Bloc 37 : Apprenti « Pis rendu au centre ? » (0-0,94) : le centre, les 2 planches de jonction encore libres ; rien de nouveau dit.
  VP.definir("37", [
    { t: 0, cam: CAM_CENTRE, cle: null, etq: [] }
  ]);
  // Bloc 38 : « On replace chaque planche … les deux planches de jonction en premier, bien collées. » (0-4,54)
  //           « Rendu à la moitié, on refait l'étape sept : » (5,06-7,46) « on visse la planche suivante le temps du serrage, » (8,09-10,41)
  //           « on enfonce les coins, on visse la planche devant les coins, pis on retire coins pis tire-fonds. » (10,86-18,05)
  //           « Ensuite, on continue jusqu'au bout. » (18,55-20,33) « À la fin, on visse les planches du centre pis la planche du bout, à chaque bout. » (21,01-24,94)
  VP.definir("38", [
    { t: 0, cam: CAM_CENTRE, cle: "On replace chaque planche : la jonction en premier", etq: [] },
    { t: 4.6, cam: CAM_MOITIE, cle: "Rendu à la moitié : on refait l'étape 7", etq: [] },
    { t: 7.6, cam: CAM_VIS_COINS, cle: "On visse la planche suivante le temps du serrage", etq: [] },
    { t: 11.4, cle: "On enfonce les coins, on visse la planche devant" },
    { t: 15.4, cle: "On retire coins pis tire-fonds" },
    { t: 18.05, cam: CAM_BOUT, cle: "Ensuite, on continue jusqu'au bout", etq: [] },
    { t: 21.05, cam: CAM_RANGS, cle: "On visse les planches du centre et celle du bout", etq: [] }
  ]);
  // Bloc 39 : « Étape treize » (0-0,9) « rien ne dépasse. » (1,37-2,35) / « Les bouts de six par six pis de trois par huit sont coupés carrés, » (2,88-6,31)
  //           « égal avec le bord. » (6,61-7,58) / « Un bout qui dépasse, c'est une chute. » (8,14-10,06)
  VP.definir("39", [
    { t: 0, cam: CAM_RIVE, cle: "Étape 13 : rien ne dépasse", etq: [] },
    { t: 3.0, cam: CAM_DEPASSE, cle: "Bouts de 6 × 6 et de 3 × 8 coupés carrés, égal au bord", etq: [] },
    { t: 7.6, cle: "Un bout qui dépasse : on trébuche, c'est une chute" }   // même caméra : le bout qui dépasse (2,88 s) est coupé au ras à 8,14 s (A14)
  ]);
})();
