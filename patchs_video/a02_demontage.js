// a02_demontage.js — A2 de l'audit (rapport_synchro_scenario.md) : démantèlement de la vidéo narrée (écran « demontage », blocs 49-51).
// Procédure PRO-DD-ST-003 p. 18 (5a-5d) et voix du bloc 51 (« On commence au fond de la baie, pis on fait glisser les pièces de bois les
// unes sur les autres pour les sortir ») :
//  1. Structure (6 × 6, soutiens, cales, blocages) : la table a05_table_fin.js la garde en place jusqu'à 4,76 s du bloc 51 et l'ordonne du FOND
//     (front, x 0) vers la sortie. Ici, chaque pièce GLISSE au lieu de sauter : petite levée (juste ce qu'il faut pour passer sur les pièces encore en
//     place : au-dessus du haut de toute pièce encore en place sur son trajet + 2 cm, au moins 3 cm, au plus 40 cm ; relecture contradictoire), puis long glissement vers la sortie
//     (+x), départs étalés sur la phrase (4,76 → 9,36 s : 40,0 → 43,5 s de la minuterie du module, 1,6 s par pièce, fin avant 9,8 s).
//     La pièce finie est rendue au module (e.d passé) qui la remet à sa place et la cache par sa couche 27, comme les autres : ferme() remet tout.
//  2. Textes à l'écran du module (fiche et étiquettes dem-*) : « si nécessaire » au lieu de « récupérable », ordre « du fond vers la sortie »,
//     « à deux » retiré (dit au bloc 52), « laver les madriers » retiré (hors procédure). Remis tels quels hors du mode vidéo.
//  3. Plancher secondaire GARDÉ (utilisateur, 2026-11-24 : « pas besoin de démonter le plancher secondaire au démantèlement, on le conserve tel
//     quel pour le réutiliser ») : le module range ses mailles (groupes Plancher_secondaire et Plancher_secondaire_dessous, sous le pivot
//     mobiles.secondaire) dans sa liste A, minutée par K.T.a (3000-6000 ms) au moment de construitPlan() dans ouvre(). Cette liste (« plan »)
//     est locale à la fermeture du module, hors d'atteinte ; voie la moins invasive : en vidéo, K.T.a est repoussée à [1e12, 1e12 + 3000]
//     AVANT l'ouverture (à chaque image tant que l'écran est fermé, et par une enveloppe de l'ouvre() de l'écran « demontage ») : chaque
//     entrée A reçoit e.d ≥ 1e12, reste en phase 0 (à sa place, visible) tout l'écran ; seule la phase 2 cache (cacheArbre), jamais atteinte ;
//     racinesAcacher() exclut déjà le contenu du plancher secondaire. Écran déjà ouvert à l'entrée en vidéo (ouverture non gardée, vue à
//     l'aperçu d'un bloc 49 joué seul juste après le chargement) : K.ferme() puis K.ouvre() une fois, avec la fenêtre A repoussée. K.T.a d'origine remise hors du mode vidéo (écran fermé).
//     Textes : fiche et étiquette dem-secondaire disent « gardé tel quel, réutilisé ».
// Rien hors du mode vidéo (NV.actif et body.mode-video). Tout sous try/catch, aucune erreur console.
(function () {
  try {
    var I = window.__inter71; if (!I || typeof I.anime !== "function") return;
    var NV = function () { return window.__narrationV155; };
    function enVideo() { var n = NV(); return !!(n && n.actif) && document.body.classList.contains("mode-video"); }
    function lisse(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
    var A = window.__a02Demontage = { DUR: 1600, DEBUT: 40000, ETALE: 3500, PART_LEVE: 0.22, GLISSE: 2.2, LEVE_LONG: 0.03, MARGE: 0.02, LEVE_MAX: 0.40, leveMax: 0,
      faits: 0, n: 0, textes: false, erreur: null, garde: false, nA: null, ouvSure: -1, rouvert: 0 };
    var T_A_LOIN = [7400, 10000] /* voix du 24 nov. (20,9 s) : « on l'enlève en premier, tel quel » 6,43-9,49 s de voix, K.t = voix + 1,2 s ; avant [6400, 8900] ; 2026-11-24 soir : retire en premier, pendant « Le plancher secondaire, on le garde tel quel : il va resservir » (5,24-7,64 s de voix) ; avant : [1e12, 1e12 + 3000] = jamais retire */, tA0 = null, ouvre0 = null;
    // ---------------------------------------------------------------- plancher secondaire gardé (point 3)
    function poseLoin(K) { if (K.T.a !== T_A_LOIN) { if (tA0 === null) tA0 = K.T.a; K.T.a = T_A_LOIN; } A.garde = true; A.ouvSure = K.ouvertures + 1; }
    function gardeSecondaire() { var K = I.demontage; if (!K || !K.T) return;
      if (!K.ouvert) { poseLoin(K); return; }
      // écran déjà ouvert AVANT le mode vidéo (plan construit avec la fenêtre A d'origine) : refermé puis rouvert une fois, fenêtre A repoussée
      if (K.ouvertures !== A.ouvSure) { poseLoin(K); A.rouvert++; K.ferme(); K.ouvre(); } }
    function rendSecondaire() { var K = I.demontage; if (!K || !K.T || K.ouvert || tA0 === null) return; K.T.a = tA0; tA0 = null; A.garde = false; }

    // ---------------------------------------------------------------- textes
    var REMPL = {
      ecran: [
        "Après le départ de la foreuse : le plancher secondaire est retiré en premier, gardé tel quel : on le réutilise.",
        "Plancher principal : les planches du fond en premier ; clous et tire-fonds enlevés à mesure.",
        "Structure de 6 × 6 : seulement quand toutes les planches et tous les tire-fonds sont enlevés ; en commençant au fond de la baie, vers la sortie.",
        "Boue de forage sous le plancher : se placer dans la partie la plus solide et stable ; rester vigilant, les pieds solides au sol ; commencer au fond de la baie de forage ; faire glisser les pièces de bois les unes sur les autres pour les sortir."
      ],
      etq: {
        "dem-secondaire": "1. Plancher secondaire retiré en premier : gardé tel quel, réutilisé",
        "dem-6x6": "3. Les 6 × 6 : du fond de la baie vers la sortie",
        "dem-glisser": "Commencer au fond de la baie de forage : faire glisser les pièces de bois les unes sur les autres pour les sortir"
      }
    };
    var origine = null;
    function ecranDem() { try { return (window.__ecransV19 && window.__ecransV19.liste || []).filter(function (s) { return s.id === "demontage"; })[0] || null; } catch (e) { return null; } }
    function etqDem() { try { return (window.__etiquettesV19 || []).filter(function (d) { return d && d.ecran === "demontage"; }); } catch (e) { return []; } }
    function poseTextes() { var s = ecranDem(); if (!s) return; var L = etqDem();
      origine = { texte: s.texte, etq: L.map(function (d) { return { d: d, texte: d.texte, actif: d.actif }; }) };
      if (!ouvre0 && typeof s.ouvre === "function") { ouvre0 = s.ouvre; s.ouvre = function () { try { var K = I.demontage; if (enVideo() && K && K.T && !K.ouvert) poseLoin(K); } catch (e) {} return ouvre0.apply(this, arguments); }; }
      s.texte = REMPL.ecran.slice();
      L.forEach(function (d) { if (REMPL.etq[d.id]) d.texte = REMPL.etq[d.id];
        if (d.id === "dem-deux") d.actif = function () { return false; }; });   // « à deux » : bloc 52
      A.textes = true; }
    function remetTextes() { if (!origine) return; var s = ecranDem(); if (s) { s.texte = origine.texte; if (ouvre0) { s.ouvre = ouvre0; ouvre0 = null; } }
      origine.etq.forEach(function (x) { x.d.texte = x.texte; x.d.actif = x.actif; }); origine = null; A.textes = false; }

    // ---------------------------------------------------------------- glissement de la structure
    function programme(K) { var C = K._C.slice().sort(function (a, b) { return a.d - b.d; }), n = C.length,
        pas = n > 1 ? A.ETALE / (n - 1) : 0; A.leveMax = 0;
      // levée = ce qu'il faut pour passer AU-DESSUS de toute pièce encore en place sur le trajet (relecture : avec 3 cm, un 6 × 6 long traversait le
      // 6 × 6 suivant de la même file) ; au moins A.LEVE_LONG
      C.forEach(function (e, k) { var lv = A.LEVE_LONG;
        for (var j = k + 1; j < n; j++) { var b = C[j];
          if (Math.min(b.zx, e.zx) - Math.max(b.zn, e.zn) > 0.02 && Math.min(b.xs, e.xs + A.GLISSE) - Math.max(b.xn, e.xn) > 0.02 && b.yh > e.yb + 0.005) lv = Math.max(lv, b.yh - e.yb + A.MARGE); }
        lv = Math.min(A.LEVE_MAX, lv); A.leveMax = Math.max(A.leveMax, lv);
        e.__a02 = { d: A.DEBUT + k * pas, leve: lv, fini: false };
        e.d = 1e12; });   // le module garde la pièce en place (phase 0) : c'est ce patch qui l'anime
      A.n = n; A.faits = 0; K.__a02 = K.ouvertures; }
    function anime(K) { var t = K.t, C = K._C;
      for (var i = 0; i < C.length; i++) { var e = C[i], s = e.__a02; if (!s || s.fini) continue;
        var u = (t - s.d) / A.DUR; if (u <= 0) continue;
        var o = e.o;
        if (u >= 1) { s.fini = true; A.faits++; e.d = t - (K.DUREE || 600) - 1; continue; }   // rendue au module : remise en place et cachée (couche 27)
        var lv = lisse(u / A.PART_LEVE), gl = lisse((u - A.PART_LEVE) / (1 - A.PART_LEVE));   // glisse une fois levée
        o.position.copy(e.p0).addScaledVector(e.haut, s.leve * lv).addScaledVector(e.sortie, A.GLISSE * gl);
        if (!o.matrixAutoUpdate) o.updateMatrix(); } }

    I.anime(function () {
      try {
        var v = enVideo();
        if (!v) { if (origine) remetTextes(); rendSecondaire(); A.ouvSure = -1; return; }
        if (!origine) poseTextes();
        gardeSecondaire();
        var K = I.demontage; if (!K || !K.ouvert || !K._C) return;
        A.nA = K.nA;
        // après le réordonnancement de la table (K.__vpOrd) : une fois par ouverture
        if (K.__a02 !== K.ouvertures) { if (K.__vpOrd !== K.ouvertures) return; programme(K); }
        anime(K);
      } catch (e) { if (!A.erreur) A.erreur = String(e && e.message || e).slice(0, 300); }
    });
  } catch (e) {}
})();
