// a03_textes_cotes.js — textes et cotes à l'écran pour la vidéo narrée (audit A3, A13, A16 ; C:/IA/video/rapport_synchro_scenario.md).
// N'agit qu'en mode vidéo (narration __narrationV155 active ET body.mode-video) ; tout est remis comme avant à la sortie du mode vidéo.
//  A3  : « 18 po » écrit seul (écran « À savoir » avoir18, écran Angle, règles cochées) → « 2 marches de 9 po (18 po au total) » (procédure p. 17 b).
//        La voix du bloc 48a (« deux marches de dix-huit pouces ») n'est pas touchée : décision de l'utilisateur.
//  A13 : étape 18, bloc 46 : les étiquettes du plancher secondaire coupées dans la page (ETIQUETTES_PLANCHER = false, v145) reviennent en vidéo
//        seulement, sans répéter la clé jaune (a09 cache toute étiquette de même sens) : « Tire-fonds de 6 po » sur la tête d'un tire-fond et
//        la cote « 6 po » avec son trait Cote_6po_v19 (bout des planches → 6 × 6 du bout). La table a05_table_secondaire les cadre (etq).
//  A16 : étape 8 : la cote « 2 planches = 16 po » (trait Cote_v27_15, posé contre le flanc du 6 × 6, lu comme vertical) devient
//        « ≈ 2 planches (16 po) », couchée à plat sur les 6 × 6 dans l'espace des 2 planches libres. Étape 14 : « Giron 16 po min. » est déjà
//        à plat sur la marche (trait 18, y = 0) : rien à faire. Étape 15 : « Plinthe : 2 × 4 brut sur chant (4 po) » → « Coup de pied : 2 × 4
//        brut sur chant », posée sur le coup de pied du bout (plan « pied » du bloc 43).
(function () {
  try {
    var NV = window.__narrationV155, I = window.__inter71;
    if (!NV || !I || typeof I.anime !== "function" || typeof THREE === "undefined") return;
    var NB = "\u00a0";
    var T = window.__a03Textes = {
      VIS2: "Tire-fonds de 6" + NB + "po",
      COTE6: "6" + NB + "po",
      PL16: "≈ 2 planches (16 po)",
      PIED: "Coup de pied : 2 × 4 sur chant",  // la procédure dit « 2 × 4 planés » et la voix aussi : ni brut ni plané à l écran
      M18: "2 marches de 9 po (18 po au total)"
    };
    var A = window.__a03 = { actif: false, erreurs: 0, erreur: null, remplacements: 0, scene: false, trait16: "attente" };
    function err(e, ou) { A.erreurs++; if (!A.erreur) A.erreur = ou + " : " + String(e && e.message || e); }
    function enVideo() { return !!NV.actif && !!document.body && document.body.classList.contains("mode-video"); }
    function bloc() { return NV.BLOCS && NV.BLOCS[NV.i]; }
    function etapeVideo() { var b = bloc(), c = b && b.c; if (!c) return -1; if (c.etape !== undefined) return c.etape;
      try { var E = window.__ecransV19, s = E && E.liste.filter(function (x) { return x && x.id === c.ecran; })[0]; return s ? s.apres : -1; } catch (e) { return -1; } }
    function sceneVisite() {
      var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
      var G = window.__grillage17; if (G && G.groupe) { var o = G.groupe; while (o && o.parent) o = o.parent; if (o && o.isScene) return o; }
      var P = window.__perso && window.__perso.persos, r = P && (P.T1 || P.T2 || P.AV), q = r && r.racine; while (q && q.parent) q = q.parent; return q && q.isScene ? q : null; }
    var NOMS = {}, IMG = 0;   // recherche par nom : au plus une fois toutes les 30 images tant que l'objet manque (parcours de toute la scène)
    function objet(n) { var c = NOMS[n]; if (c && c.o && c.o.parent) return c.o; if (c && IMG - c.k < 30) return null; var s = sceneVisite(); var o = s ? s.getObjectByName(n) || null : null; NOMS[n] = { o: o, k: IMG }; return o; }
    function vu(o) { if (!o) return false; if (I.vu) { try { return !!I.vu(o); } catch (e) {} } while (o) { if (!o.visible) return false; o = o.parent; } return true; }

    // ------------------------------------------------------------ A3 : textes « 18 po » (données d'écrans + DOM)
    var RX = [
      [/plancher secondaire de 18[\s\u00a0\u202f]po,\s*donc 2[\s\u00a0\u202f]marches/g, "plancher secondaire en " + T.M18],
      [/Au montage de 18[\s\u00a0\u202f]po/g, "Au montage en " + T.M18],
      [/(?:deux|2)[\s\u00a0\u202f]marches de 9[\s\u00a0\u202f]po \(18[\s\u00a0\u202f]po\)/g, T.M18],
      [/(?:deux|2)[\s\u00a0\u202f]marches \(18[\s\u00a0\u202f]po\)/g, T.M18],
      [/18[\s\u00a0\u202f]po,\s*2[\s\u00a0\u202f]marches/g, T.M18],
      [/plancher de 18[\s\u00a0\u202f]po en deux étages \(deux marches\)/g, "plancher en " + T.M18],
      [/Plancher secondaire de 18[\s\u00a0\u202f]po en deux étages/g, "Plancher secondaire en " + T.M18]
    ];
    function corrige(s) { if (typeof s !== "string" || s.indexOf("18") < 0) return s; var r = s; for (var i = 0; i < RX.length; i++) r = r.replace(RX[i][0], RX[i][1]); return r; }
    var DONNEES = [];   // [objet, clé, valeur d'origine]
    function poseDonnee(o, k) { if (!o || typeof o[k] !== "string") return; var v = corrige(o[k]); if (v !== o[k]) { DONNEES.push([o, k, o[k]]); o[k] = v; } }
    function appliqueDonnees() {
      try { var E = window.__ecransV19; (E && E.liste || []).forEach(function (s) { if (!s || (s.id !== "avoir18" && s.id !== "angle147")) return;
        if (Array.isArray(s.texte)) for (var i = 0; i < s.texte.length; i++) poseDonnee(s.texte, i); poseDonnee(s, "detail"); poseDonnee(s, "titre"); }); } catch (e) { err(e, "écrans"); }
      try { var G = I.angleStm; (G && G.TRANCHES || []).forEach(function (t) { poseDonnee(t, "plancher"); }); } catch (e) { err(e, "tranches"); }
    }
    function remetDonnees() { for (var i = DONNEES.length - 1; i >= 0; i--) { var d = DONNEES[i]; try { d[0][d[1]] = d[2]; } catch (e) {} } DONNEES.length = 0; }
    // DOM : textes déjà affichés (fiche, écrans, vignette avoir18, panneau Angle, règles) ; un observateur corrige avant l'image suivante
    var NOEUDS = [], OBS = null, EXCLUS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
    function exclu(n) { var p = n.parentNode; while (p && p.nodeType === 1) { if (EXCLUS[p.nodeName] || p.id === "sous-titre155") return true; p = p.parentNode; } return false; }
    function corrigeNoeud(n) { if (!n || n.nodeType !== 3) return; var v = n.nodeValue; if (!v || v.indexOf("18") < 0) return; var r = corrige(v); if (r === v || exclu(n)) return;
      NOEUDS.push([n, v, r]); n.nodeValue = r; A.remplacements++; }
    function parcourt(racine) { if (!racine) return; if (racine.nodeType === 3) { corrigeNoeud(racine); return; } if (racine.nodeType !== 1 || EXCLUS[racine.nodeName]) return;
      var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, null, false), n, l = []; while ((n = w.nextNode())) l.push(n); l.forEach(corrigeNoeud); }
    function demarreDom() { if (OBS) return; parcourt(document.body);
      OBS = new MutationObserver(function (ms) { try { for (var i = 0; i < ms.length; i++) { var m = ms[i];
        if (m.type === "characterData") corrigeNoeud(m.target); else for (var j = 0; j < m.addedNodes.length; j++) parcourt(m.addedNodes[j]); } } catch (e) { err(e, "observateur"); } });
      OBS.observe(document.body, { childList: true, subtree: true, characterData: true }); }
    function arreteDom() { if (OBS) { OBS.disconnect(); OBS = null; } for (var i = NOEUDS.length - 1; i >= 0; i--) { var q = NOEUDS[i]; try { if (q[0].nodeValue === q[2]) q[0].nodeValue = q[1]; } catch (e) {} } NOEUDS.length = 0; }

    // ------------------------------------------------------------ étiquettes 3D (contrat v19)
    var L = window.__etiquettesV19 = window.__etiquettesV19 || [];
    function parTexte(t) { for (var i = 0; i < L.length; i++) if (L[i] && L[i].texte === t) return L[i]; return null; }
    // A16 étape 8 : cote à plat ; position du trait couché (repère monde) : du bord des planches (x 4,47) au bout des 6 × 6 (x 4,877)
    var P16 = { x0: 4.47, x1: 4.877, y: 0.158, z: 1.45 };
    var MODIFS = [   // [texte d'origine, nouveau texte, nouvelle position, segment de glisse]
      { de: "2 planches = 16 po", vers: T.PL16, pos: [(P16.x0 + P16.x1) / 2, P16.y + 0.01, P16.z], seg: [[P16.x0, P16.y, P16.z], [P16.x1, P16.y, P16.z]] },
      { de: "Plinthe : 2 × 4 brut sur chant (4 po)", vers: T.PIED, pos: [9.75, 0.29, -0.95], seg: null }
    ];
    MODIFS.forEach(function (m) { m.d = null; });
    function appliqueEtiquettes() { MODIFS.forEach(function (m) { try {
        if (!m.d || L.indexOf(m.d) < 0) m.d = parTexte(m.de) || parTexte(m.vers); var d = m.d; if (!d || d.__a03) return;
        d.__a03 = { texte: d.texte, pos: d.pos, seg: Object.prototype.hasOwnProperty.call(d, "_seg") ? d._seg : undefined };
        d.texte = m.vers; d.pos = m.pos.slice(); d._seg = m.seg ? { a: new THREE.Vector3().fromArray(m.seg[0]), b: new THREE.Vector3().fromArray(m.seg[1]) } : null;
      } catch (e) { err(e, "étiquette " + m.de); } }); }
    function remetEtiquettes() { MODIFS.forEach(function (m) { var d = m.d; if (!d || !d.__a03) return; var o = d.__a03; d.texte = o.texte; d.pos = o.pos;
      if (o.seg === undefined) delete d._seg; else d._seg = o.seg; delete d.__a03; }); }
    // A13 étape 18 : les trois étiquettes du plancher secondaire, en vidéo seulement (actif → faux hors vidéo)
    function horsCoupe() { return !(I.scie && I.scie.lieu === "coupe"); }
    function ancre(n) { var o = objet(n); return o && vu(o) ? o : null; }
    // Textes : la clé jaune du bloc 46 dit déjà « Chaque planche vissée à chaque bout » et « 6 × 6 à 6 po du bout des planches » ; le patch a09
    // met de côté toute étiquette de même sens que la clé. Les étiquettes désignent donc la chose sans répéter la clé : « Tire-fonds de 6 po »
    // sur la tête d'un tire-fond, et la cote « 6 po » sur son trait (du bout des planches au 6 × 6 du bout).
    var SEC = [
      { id: "a03_secondaire_vis", texte: T.VIS2, genre: "note", nom: "Ancre_tire_fond_v19" },
      { id: "a03_secondaire_cote_6po", texte: T.COTE6, genre: "cote", nom: "Ancre_cote_6po_v19", cote: true }
    ];
    SEC.forEach(function (s) {
      var d = { id: s.id, texte: s.texte, genre: s.genre, etapes: [18], ecran: null, pos: [0, -50, 0], decal: [0, 0, 0], _seg: null };
      d.actif = function () { try {
          if (!A.actif || !horsCoupe()) return false; var E19 = window.__ecransV19; if (E19 && E19.actif) return false;
          var o = ancre(s.nom); if (!o) return false; if (d.objet !== o) d.objet = o; return true; } catch (e) { err(e, "actif " + s.id); return false; } };
      s.d = d; if (!parTexte(s.texte)) L.push(d);
    });
    // trait ambre « 6 po » (Cote_6po_v19, inter_secondaire_v19) : la page ne le montre qu'avec sa note « 6 po entre le bout des planches… »
    // (coupée, v145). En vidéo, il suit l'étiquette « 6 po » : montré quand le filtre etq du moteur a04 la garde (etapes non mises à [-99]).
    function traitSix(et) { try {
        var tr = objet("Cote_6po_v19"); if (!tr) return; var d = SEC[1].d, E19 = window.__ecransV19;
        var garde = et === 18 && !(E19 && E19.actif) && horsCoupe() && d && Array.isArray(d.etapes) && d.etapes.indexOf(18) >= 0 && !!d.actif();
        var gs = tr.userData && tr.userData.suit; if (garde && !(gs && vu(gs))) garde = false;
        if (!garde) return;   // la page garde la main (caché)
        gs.updateWorldMatrix(true, false); tr.matrix.copy(gs.matrixWorld); tr.matrixWorldNeedsUpdate = true; tr.visible = true;
      } catch (e) { err(e, "trait 6 po"); } }

    // ------------------------------------------------------------ A16 : trait de la cote 16 po couché à plat (géométrie échangée en vidéo)
    var G16 = { maille: null, geo0: null, geo: null };
    function geoPlate() {
      var p = [], ix = [];
      function quad(a, b, c, d) { var o = p.length / 3; p.push.apply(p, a.concat(b, c, d)); ix.push(o, o + 1, o + 2, o, o + 2, o + 3, o + 2, o + 1, o, o + 3, o + 2, o); }
      function tri(a, b, c) { var o = p.length / 3; p.push.apply(p, a.concat(b, c)); ix.push(o, o + 1, o + 2, o + 2, o + 1, o); }
      var y = P16.y, z = P16.z, x0 = P16.x0, x1 = P16.x1, e = 0.006, F = 0.075, H = 0.028, R = 0.07;
      // trait principal, entre les deux pointes
      quad([x0 + F, y, z - e], [x1 - F, y, z - e], [x1 - F, y, z + e], [x0 + F, y, z + e]);
      // pointes (triangles à plat, pointe sur la ligne de rappel)
      tri([x0, y, z], [x0 + F, y, z - H], [x0 + F, y, z + H]);
      tri([x1, y, z], [x1 - F, y, z + H], [x1 - F, y, z - H]);
      // lignes de rappel (en travers, à plat)
      quad([x0 - e, y, z - R], [x0 + e, y, z - R], [x0 + e, y, z + R], [x0 - e, y, z + R]);
      quad([x1 - e, y, z - R], [x1 + e, y, z - R], [x1 + e, y, z + R], [x1 - e, y, z + R]);
      var g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(p), 3)); g.setIndex(ix); g.computeBoundingSphere(); return g; }
    function appliqueTrait() { try {
        var m = objet("Cote_v27_15"); if (!m || !m.isMesh) { A.trait16 = "attente"; return; }
        if (G16.maille !== m) { G16.maille = m; G16.geo0 = m.geometry; }
        if (!G16.geo) G16.geo = geoPlate();
        if (m.geometry !== G16.geo) m.geometry = G16.geo;
        A.trait16 = "à plat";
      } catch (e) { err(e, "trait 16 po"); } }
    function remetTrait() { var m = G16.maille; if (m && G16.geo0 && m.geometry !== G16.geo0) m.geometry = G16.geo0; A.trait16 = "origine"; }

    // ------------------------------------------------------------ bascule par image
    function entre() { A.actif = true; appliqueDonnees(); demarreDom(); appliqueEtiquettes(); }
    function sort() { A.actif = false; remetDonnees(); arreteDom(); remetEtiquettes(); remetTrait(); }
    I.anime(function () { try {
        IMG++; var v = enVideo();
        if (v !== A.actif) { if (v) entre(); else sort(); }
        if (!v) return;
        appliqueEtiquettes();   // une entrée créée plus tard (rare) est prise au vol
        var et = etapeVideo();
        if (et === 18) traitSix(et);
        if (et >= 1 && et <= 17) appliqueTrait();
      } catch (e) { err(e, "image"); } });
  } catch (e) { try { console.warn("[a03_textes_cotes] inactif : " + (e && e.message || e)); } catch (x) {} }
})();
