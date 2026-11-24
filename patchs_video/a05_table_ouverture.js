// Table phrase -> plan du groupe « ouverture » (blocs 1, 2, 3).
// t = secondes de voix du bloc (fins de silences de phrases_mp3.json).
// A6 (a06_blocs_ordre_cartons.js) : les blocs 1-3 visent l'étape 18 (plancher FINI) et la caméra est une orbite lente posée au rendu
// pendant toute la voix 1-3 : la table ne donne plus de caméra (sinon des vols invisibles sous l'orbite), seulement les clés au mot.
(function () {
  "use strict";
  var VP = window.__videoPlans; if (!VP) return;
  // Bloc 1 : « Aujourd'hui, on bâtit un plancher de foreuse au diamant sous terre » (0-3,4) / « seize pieds par trente-deux » (3,77-5,14)
  VP.definir("1", [
    { t: 0, cle: "Un plancher de foreuse au diamant sous terre", etq: [] },
    { t: 3.8, cle: "Plancher complet : 16 pi × 32 pi" }
  ]);
  // Bloc 2 : « Le plancher complet, celui des trous de cinq cents mètres et plus ? » (0-3,31)
  VP.definir("2", [
    { t: 0, cle: "Trous de 500 m et plus : plancher complet", etq: [] }
  ]);
  // Bloc 3 : « Exactement. » (0-0,78) / « On suit la procédure … étape par étape. » (1,19-6,94)
  VP.definir("3", [
    { t: 1.19, cle: "Procédure PRO-DD-ST-003 : fabrication d'un plancher", etq: [] }
  ]);
})();
