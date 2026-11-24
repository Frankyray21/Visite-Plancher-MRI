// a05_table_fin.js — table phrase → plan du groupe « fin » (blocs 49 à 53 : écrans « demontage » puis « retenir »).
// N'appelle que VP.definir / VP.au / VP.a. Instants = secondes de voix du bloc (fins de silences de phrases_mp3.json).
// Démontage (procédure p. 18) : le bois de structure reste en place jusqu'à « On commence au fond de la baie » (bloc 51, 4,76 s),
// puis part du FOND (front de taille) vers la sortie ; clôture à « À la fin » (51, 10,94 s) ; gros plan de la carte à « Trou non arpenté » (51, 13,49 s).
(function () {
  var VP = window.__videoPlans; if (!VP) return;
  var I = window.__inter71;
  function D() { return I && I.demontage; }
  var C0 = 40000, C1 = 45600, E0 = 50000;          // ms de la minuterie K.t de l'écran démontage (6 × 6 ; clôture)
  var sauve = null, distSauve = null;
  function prepare() { var K = D(); if (!K || !K.T) return;
    if (!sauve) sauve = { e: K.T.e.slice(), cam: K.T_CAM_CARTE };
    K.T.e = [E0, E0 + 2200]; K.T_CAM_CARTE = 1e9; }        // pas de gros plan automatique : la table cadre la carte au mot dit
  function restaure() { var K = D();
    if (K && sauve) { K.T.e = sauve.e; K.T_CAM_CARTE = sauve.cam; sauve = null; }
    var C = window.__dbg && window.__dbg.camk; if (C && distSauve !== null) { C.VG_DIST_MIN = distSauve; distSauve = null; } }
  function avance(ms) { var K = D(); if (K && K.ouvert && K.t < ms) K.t0 = performance.now() - ms; }   // en avant seulement
  // 6 × 6, soutiens et blocages : du fond (x 0, front) vers la sortie ; une pièce part toujours avant celle qui la porte
  function ordonne() { var K = D(); if (!K || !K.ouvert || !K._C || K.__vpOrd === K.ouvertures) return; K.__vpOrd = K.ouvertures;
    var C = K._C, Ch = C.slice().sort(function (a, b) { return b.yh - a.yh; });
    Ch.forEach(function (e, i) { e.kf = e.xn; for (var j = 0; j < i; j++) { var u = Ch[j];
      if (u.yb >= e.yh - 0.04 && u.yb <= e.yh + 0.12 && Math.min(u.xs, e.xs) - Math.max(u.xn, e.xn) > 0.02 && Math.min(u.zx, e.zx) - Math.max(u.zn, e.zn) > 0.02 && u.kf + 0.001 > e.kf) e.kf = u.kf + 0.001; } });
    var L = C.slice().sort(function (a, b) { return a.kf - b.kf || b.yh - a.yh; }), pas = L.length > 1 ? (C1 - C0 - (K.DUREE || 600)) / (L.length - 1) : 0;
    L.forEach(function (e, k) { e.d = C0 + k * pas; }); }
  function prepareSi(ctx) { if (ctx && ctx.nouveau) prepare(); }
  VP.au("49", prepareSi); VP.au("50", prepareSi); VP.au("51", prepareSi);

  var VIDE = [];
  var camCarte = { tgt: [0.766, 0.6, -1.07], dir: [1, 0.28, 0.1], r: 0.35 };
  // ---- bloc 49 (14,1 s ; voix à réenregistrer : « … après le départ de la foreuse : on lave le plancher au boyau d'eau. Le plancher secondaire, on le
  // garde tel quel … Le principal … Une fois toutes les planches … les 6 × 6 ») — instants estimés, À RECALER sur phrases_mp3.json avec la nouvelle voix.
  // Lavage (patch a17_lavage.js) de 1,2 à 6,5 s : plongée douce sur tout le plancher principal depuis l'entrée dès le début de la voix (un seul vol :
  // « après le départ de la foreuse » montre déjà le plancher vide), clé du lavage au mot « on lave » (1,2 s, sans vol : affichée tout de suite).
  // Ensuite (6,6 s) retour à la vue du plancher secondaire ; sa clé est portée par ce plan (le moteur l'affiche à la fin du vol, 6,6 + 0,8 s ; une clé
  // seule à 6,8 serait effacée par la clé nulle du plan). Puis planches (9,9) et 6 × 6 (12,9) : ≥ 3 s entre deux clés.
  var camLavage = { tgt: [4.9, 0.24, 0], dir: [1, 0.55, 0.1], r: 4.5 };
  VP.definir("49", [
    { t: 0, cam: camLavage, cle: null, etq: VIDE },
    { t: 2.96, cle: "On lave le plancher au boyau d'eau" },   // voix du 24 nov. (20,9 s) : « on lave » 2,96-4,69 = T0 de a17_lavage.js                                                 // = T0 de a17_lavage.js (voix v26 : 3,10 s)
    { t: 5.33, cam: { tgt: [1.5, 0.5, -0.1], dir: [1, 0.75, 0.35], r: 1.4 }, cle: "Plancher secondaire retiré en premier : gardé tel quel, on le réutilise", etq: VIDE },   // « Le plancher secondaire, on l'enlève en premier, tel quel : il va resservir » 5,33-9,49 (levée a02 T_A_LOIN = [7400, 10000] en K.t = voix + 1,2 s)   // 2026-11-24 soir : retire en premier (a02 T_A_LOIN = [6400, 8900])   // voix v26 : « Le plancher secondaire, on le garde tel quel » 5,24 → 9,40 ; après le lavage (T1 6,2 s)
    { t: 10.09, cam: { tgt: [2.6, 0.15, 0], dir: [1, 0.85, 0.25], r: 2.4 }, cle: "2. Planches du fond d'abord, tire-fonds à mesure", etq: VIDE },   // voix v26 : 9,40 s
    { t: 15.38, cam: { tgt: [4.6, 0, 0], dir: [1, 0.85, 0.05], r: 4.2 }, cle: "3. Plus de planches ni de tire-fonds : défaire les 6 × 6", etq: VIDE }   // voix v26 : 14,56 s
  ]);
  VP.a("49", 0, ordonne);
  VP.a("49", 2.17, function () { avance(3370); });
  // ---- bloc 50 (2,2 s) : la question de la boue ----
  VP.definir("50", [
    { t: 0, cam: { tgt: [2.7, -0.32, 1.05], dir: [0.55, 1, 0.2], r: 1.7 }, cle: "Boue de forage en dessous ?", etq: VIDE }   // A2 : la flaque sombre (2,9 ; 0,75) et sa voisine au centre, entre les 6 × 6
  ]);
  VP.a("50", 0, function () { ordonne(); avance(16500); });
  // ---- bloc 51 (18,1 s) ----
  VP.definir("51", [
    { t: 0.8, cam: { tgt: [3.6, 0, -0.2], dir: [1, 0.65, 0.15], r: 2.0 }, cle: "Se placer sur la partie la plus solide, pieds solides", etq: VIDE },
    { t: 4.76, cam: { tgt: [4.0, 0, 0], dir: [1, 0.6, 0.25], r: 4.0 }, cle: "Commencer au fond, faire glisser les pièces", etq: VIDE },
    { t: 10.94, cam: { tgt: [0.75, 0.4, 0], dir: [1, 0.4, 0.15], r: 2.4 }, cle: "À la fin : clôture orange et carte de ruban rouge", etq: VIDE },
    { t: 13.49, cam: camCarte, cle: "Trou non arpenté et non cimenté · date · superviseur", etq: VIDE }
  ]);
  VP.a("51", 0, function () { ordonne(); avance(18700); });
  VP.a("51", 4.76, function () { avance(C0); });
  VP.a("51", 10.94, function () { avance(E0); });
  VP.a("51", 13.2, function () { var K = D(), C = window.__dbg && window.__dbg.camk;
    if (K && K.carte) camCarte.tgt = K.carte.slice();
    if (C && typeof C.VG_DIST_MIN === "number") { if (distSauve === null) distSauve = C.VG_DIST_MIN; C.VG_DIST_MIN = Math.min(distSauve, 0.45); } });

  // ---- écran « retenir » : sans assombrissement (on doit voir ce qui est nommé) ----
  var ouvreR = null;
  function ecranR() { try { return window.__ecransV19.liste.filter(function (s) { return s.id === "retenir"; })[0]; } catch (e) { return null; } }
  VP.au("52", function (ctx) { restaure(); var R = ecranR(); if (R && ctx.nouveau && !ouvreR) { ouvreR = R.ouvre; R.ouvre = function () {}; } });
  VP.a("52", 0, function () { var R = ecranR(); if (R && ouvreR) { R.ouvre = ouvreR; ouvreR = null; } try { document.getElementById("scene").style.filter = ""; } catch (e) {} });
  // ---- bloc 52 (13,5 s) ----
  VP.definir("52", [
    { t: 0, cam: { tgt: [2.0, 0.2, -1.6], dir: [1, 0.7, 0.45], r: 2.6 }, cle: null, etq: VIDE },
    { t: 1.22, cle: "1er madrier au point le plus haut" },
    { t: 3.5, cam: { tgt: [9.3, -0.35, -0.6], dir: [1, 0.2, 0.25], r: 1.5 }, cle: "6 appuis min. par 6 × 6, enlignés aux croisements", etq: VIDE },
    { t: 7.32, cam: { tgt: [9.9, 0.4, 0.6], dir: [0.74, 0.36, -0.57], r: 2.2 }, cle: "Plus de 12 po : marches, garde-corps, mains courantes", etq: VIDE },
    { t: 11.46, cam: { tgt: [11.85, -0.15, 2.05], dir: [-0.2, 0.7, -0.7], r: 2.0 }, cle: "Le gros bois : toujours à deux", etq: VIDE }
  ]);
  // ---- bloc 53 (2,4 s) ----
  VP.definir("53", [
    { t: 0, cam: { tgt: [4.9, 0.25, 0], dir: [1, 0.45, 0.1], r: 5 }, cle: "On est prêts à bâtir · PRO-DD-ST-003", etq: VIDE }
  ]);
})();
