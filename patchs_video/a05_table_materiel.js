// a05_table_materiel.js — table « phrase → plan » du groupe « materiel » (blocs 4, 5, 6, 7, 8 ; cible écran « materiel »).
// t = secondes de voix du bloc (fins de silences de phrases_mp3.json). Une clé à la fois, ≥ 3 s, texte de la voix.
// Le tour automatique de l'écran est coupé (M.TOUR = false) : c'est la table qui cadre (window.__dbg.camk via le moteur a04).
// Les phases de l'écran sont repoussées (aucun outil ni étiquette ne part tout seul) ; en vidéo, les étiquettes du matériel
// sont allumées par la liste etq de chaque plan ; les outils sont posés tous ensemble à la question « Pis les outils ? » (bloc 7).
(function () {
  "use strict";
  var VP = window.__videoPlans, I = window.__inter71; if (!VP || !I) return;
  var M = I.materiel; if (!M) return;
  function enVideo() { var NV = window.__narrationV155; return !!(NV && NV.actif && document.body.classList.contains("mode-video")); }

  // texte exact d'une étiquette du matériel (id « materiel_<nom> »)
  function T(nom) { var L = window.__etiquettesV19 || [], d = L.filter(function (x) { return x.id === "materiel_" + nom; })[0]; return d ? d.texte : "materiel_" + nom; }

  // en vidéo : une étiquette du matériel est active dès que l'écran est prêt et son objet visible (le choix vient de etq)
  function objetVu(nom) { var l = M.objOutils && M.objOutils[nom]; if (!l) return true; l = [].concat(l); if (!l.length) return false;
    for (var i = 0; i < l.length; i++) { var p = l[i]; while (p && p !== M.G) { if (!p.visible) return false; p = p.parent; } if (p !== M.G) return false; } return true; }
  (window.__etiquettesV19 || []).forEach(function (d) {
    if (!/^materiel_/.test(d.id) || d.__vpActif) return; var a0 = d.actif, nom = d.id.slice(9); d.__vpActif = a0;
    d.actif = function () { try { if (enVideo() && M.__vpPilote) return !!(M.ouvert && M.pret && objetVu(nom)); } catch (e) {} return a0.apply(this, arguments); };
  });

  // début du groupe (avant l'ouverture de l'écran) : tour coupé, phases repoussées, outils cachés jusqu'au bloc 7
  var PH0 = null;
  var CL0 = null;
  function prepare() { CL0 = CL0 || [M.CAM_LARGE, M.CAM_ETROIT].map(function (c) { return c ? { c: c, tgt: c.tgt.slice(), dir: c.dir.slice(), r: c.r } : null; });
    // l'écran s'ouvre directement sur la barricade (vol pendant les 1,2 s avant la voix) : même cadrage que le 1er plan du bloc 4
    [M.CAM_LARGE, M.CAM_ETROIT].forEach(function (c) { if (c) { c.tgt = CAM_BARRICADE.tgt.slice(); c.dir = CAM_BARRICADE.dir.slice(); c.r = CAM_BARRICADE.r; } });
    M.TOUR = false; M.__vpPilote = true; PH0 = PH0 || (M.PHASES || [0, 10, 20, 28]).slice(); M.reglePhases([0, 1000, 1000, 1000], 4); M.gMax = -1; M.gFait = null; }
  // (lecture lancée à n'importe quel bloc du groupe : la préparation se fait au premier bloc joué)
  ["4", "5", "6", "7", "8"].forEach(function (id) { VP.au(id, function (c) { if (c.nouveau || !M.__vpPilote) prepare(); }); });
  // fin du groupe (bloc suivant hors écran) : on rend la main au module
  VP.au("9", function () { if (!M.__vpPilote) return; M.__vpPilote = false; M.TOUR = true; if (PH0) M.reglePhases(PH0, 4); if (CL0) CL0.forEach(function (o) { if (o) { o.c.tgt = o.tgt.slice(); o.c.dir = o.dir.slice(); o.c.r = o.r; } }); });

  // ---- cadrages (dir = de la cible vers la caméra ; distance ≈ 1,87 r) ----
  var Y = -0.23;   // sol du matériel ≈ -0,35 (+ 0,12 comme le tour du module)
  var CAM_BARRICADE = { tgt: [19.45, 1.25, -0.1], dir: [0.93, 0.22, -0.2], r: 2.0 };       // côté où on arrive (affiches lisibles)
  var CAM_AFFICHES = { tgt: [19.5, 1.35, 0.25], dir: [1, 0.12, -0.12], r: 1.3 };
  var CAM_DERRIERE = { tgt: [15.0, 0.1, 0.0], dir: [0.85, 0.5, 0.1], r: 3.2 };           // barricade devant, bois derrière, place du plancher au fond
  var CAM_BOIS = { tgt: [14.9, Y + 0.1, -1.1], dir: [-0.8, 0.45, 0.4], r: 1.3 };           // bouts des piles de 6 × 6 et de 3 × 8
  var CAM_24_COINS = { tgt: [16.9, Y, 0.95], dir: [-0.1, 0.72, -0.69], r: 1.9 };           // 2 × 4 planés, coins, seau de tire-fonds
  var CAM_66 = { tgt: [16.4, Y + 0.15, -1.6], dir: [-0.25, 0.55, 0.8], r: 1.9 };           // pile de 6 × 6 de 16 pi
  var CAM_OUTILS_A = { tgt: [15.7, Y, 0.4], dir: [-0.45, 0.78, 0.42], r: 0.95 };           // pinces, sciotte, marteau, masse, pied de biche
  var CAM_NIVEAUX = { tgt: [16.0, Y, 0.5], dir: [0.8, 0.55, 0.12], r: 1.5 };              // laser au premier plan, niveau de 48 po au fond
  var CAM_PINGOUIN_SCIE = { tgt: [15.85, Y, 0.7], dir: [-0.45, 0.78, 0.42], r: 1.1 };     // pingouin, scie va-et-vient et lames
  var CAM_BARRES = { tgt: [16.2, Y, 2.1], dir: [-0.05, 0.9, -0.45], r: 1.5 };            // barres d'écaillage couchées à plat le long de la paroi (écartées par a12_objets_scene.js)
  // A12 (a12_objets_scene.js) : flasher de droite (Entree_s00_023, voyant ambre clignotant) et copie du poste de secours, paroi de gauche, x ≈ 21,2
  var CAM_FLASHER = { tgt: [20.45, 1.35, -1.65], dir: [0.85, 0.18, 0.5], r: 0.85 };
  var CAM_POSTE = { tgt: [21.2, 0.95, 2.25], dir: [0.3, 0.22, -0.92], r: 0.8 };

  // Relecture : plans 2 et 3 avancés au début du silence qui précède (clé à 4,1 s et 11,7 s, au début de la phrase).
  // Bloc 4 (21,5 s) : « Avant de commencer (0-0,96) : on barricade l'entrée de la place de travail (1,41-3,31).
  // Le ruban, le flasher orange, pis les affiches … (3,8-9,63), du côté où on arrive (9,95-10,92). Le bois pis l'équipement restent
  // derrière la barricade, en dehors de la place où on va bâtir le plancher (11,49-16,3). La trousse … au poste de secours (16,89-21,11). »
  VP.definir("4", [
    { t: 0, cam: CAM_BARRICADE, cle: "On barricade l'entrée de la place de travail", etq: [T("barricade")] },
    { t: 3.4, cam: CAM_BARRICADE, cle: "Ruban jaune : du côté où on arrive", etq: [] },   // voix du 24 nov. (16,4 s) : « avec le ruban jaune » ≈ 3,6-4,4 ; « du côté où on arrive » 4,6-5,6
    { t: 6.24, cam: CAM_DERRIERE, cle: "Bois et équipement derrière la barricade, hors du plancher", etq: [] },   // 6,24-11,2
    { t: 11.78, cam: CAM_POSTE, cle: "Premiers soins, 2 lave-yeux, extincteur : poste de secours", etq: ["Armoire vitrée", "Extincteur"] }
  ]);
  // Bloc 5 (7,8 s) : « Pis le bois (0-0,61) : du six par six brut, du trois par huit brut (0,92-≈3,3), du deux par quatre plané,
  // des coins pis des tire-fonds de six pouces (≈3,3-7,39). »
  VP.definir("5", [
    { t: 0, cam: CAM_BOIS, cle: "Le bois : 6 × 6 brut, 3 × 8 brut", etq: [T("b66"), T("c66"), T("b38"), T("c38a"), T("c38b")] },
    { t: 4.2, cam: CAM_24_COINS, cle: "2 × 4, coins, tire-fonds de 6 po", etq: [T("s24"), T("coins"), T("tirefonds")] }
  ]);
  // Bloc 6 (5,0 s) : « Une règle qui change pas (0-1,29) : les grosses pièces de bois, on les transporte toujours à deux (1,74-4,56). »
  VP.definir("6", [
    { t: 0, cam: CAM_66, cle: "Grosses pièces de bois : toujours à deux", etq: [] }
  ]);
  // Bloc 7 (1,6 s) : « Pis les outils ? » : les outils sont posés, plan sur la rangée ; pas de clé (la réponse vient au bloc 8).
  VP.definir("7", [
    { t: 0, cam: CAM_OUTILS_A, cle: null, etq: [], action: function () { M.gMax = 5; M.gFait = null; } }
  ]);
  // Bloc 8 (15,4 s) : « Pied de biche, masse pis marteau (0-1,91). La scie à main pis les pinces (2,46-3,91). Le niveau au laser Bosch
  // pis le niveau de quarante-huit pouces (4,45-7,39). Le pingouin (7,98-8,64). Pis la scie va-et-vient, avec ses lames à bois (9,16-11,37).
  // Pis les barres d'écaillage : six, huit pis dix pieds (11,88-15,0). » Relecture : plans avancés au début du silence qui précède
  // (la clé suit le vol de 0,8 s et tombe sur le début de la phrase) ; scie à main et pinces rejoignent la 1re clé (règle des 3 s).
  VP.definir("8", [
    { t: 0, cle: "Pied de biche, masse, marteau, scie à main, pinces", etq: [T("biche"), T("masse"), T("marteau")], action: function () { M.gMax = 5; M.gFait = null; } },
    { t: 2.46, etq: [T("sciotte"), T("pinces")] },
    { t: 3.91, cam: CAM_NIVEAUX, cle: "Niveau au laser Bosch, niveau de 48 po", etq: [T("laser"), T("niveau")] },
    { t: 7.39, cam: CAM_PINGOUIN_SCIE, cle: "Le pingouin · scie va-et-vient, lames à bois", etq: [T("pingouin")] },
    { t: 9.16, etq: [T("scie")] }   // barres d'écaillage retirées (utilisateur 2026-11-24)
  ]);
})();
