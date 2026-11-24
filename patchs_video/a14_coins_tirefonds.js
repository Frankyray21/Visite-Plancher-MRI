// a14_coins_tirefonds.js — A14 (rapport_synchro_scenario.md) : coins et tire-fonds lisibles, bout qui dépasse.
// N'agit qu'en mode vidéo (narration __narrationV155 active ET body.mode-video) ; hors vidéo tout est remis tel quel à l'image suivante.
// 1. Blocs 21-22 (étape 7) et 36-38 (étape 12) : les rangées de tire-fonds (maillage « zinc » 0,02 × 0,16 × 4,74 qui porte les têtes aux deux
//    bouts) reçoivent des têtes grossies ×3 (tête hexagonale 6 cm + rondelle 7,6 cm), enfants des rangées : elles suivent leur pose, leur
//    vissage et leur retrait (les modules laser_outils et reprise12 bougent et cachent les rangées). Cachées hors de ces blocs.
//    Les instants de pose des coins et des vis sont ceux des tables a05_table_e7_e9.js (K.COINS.t recalé) et a05_table_e12_e13.js (ANIM).
// 2. Bloc 39 (étape 13) : avant/après d'un bout qui dépasse : de « Les bouts … coupés carrés » (2,88 s) à « Un bout qui dépasse » (8,14 s),
//    une copie du 3 × 8 P13_s12_004 décalée de 20 cm vers -z (côté allée) remplace la planche (cachée par la couche 26) ; à 8,14 s la copie
//    est retirée et la planche revient : bout coupé au ras. Cadrage : table a05_table_e12_e13.js (CAM_DEPASSE).
(function () {
  "use strict";
  try {
    var NV = window.__narrationV155, I = window.__inter71, VP = window.__videoPlans;
    if (!NV || !I || typeof I.anime !== "function" || !VP || !window.THREE) return;
    var THREE = window.THREE;
    var BLOCS_VIS = { "21": 1, "22": 1, "36": 1, "37": 1, "38": 1 };
    var RANGEES = ["P07_s06_023", "P07_s07_001", "Tire_fonds_dernier_3x8_temporaires", "P07_s12_003", "P13_s12_025", "P13_s12_026", "Reprise12_tire_fonds_temporaires"];
    var PLANCHE39 = "P13_s12_004", DEPASSE = 0.2, T39 = [2.88, 8.14];
    var BIT = 1 << 26;
    // gros plan plus proche (CAMK.VG_DIST_MIN 1,6 -> 1,1) le temps du plan CAM_VIS_COINS du bloc 38 (7,6 à 18,05 s), remis ensuite
    var PROCHE = { id: "38", t: [7.3, 17.9], d: 1.1 }, distSauvee = null;
    var A = window.__a14 = { tetes: [], ranges: 0, etat39: false, erreurs: [] };
    function err(e, ou) { try { A.erreurs.push(ou + " : " + String(e && e.message || e)); } catch (x) {} }
    function enVideo() { return !!NV.actif && document.body.classList.contains("mode-video"); }
    function scene() { var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
      var P = window.__perso && window.__perso.persos, r = P && (P.T1 || P.T2 || P.AV), o = r && r.racine; while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }

    // ---------- 1. têtes de tire-fonds grossies ----------
    var geoTete = null, geoRond = null, matTete = null, faites = {};
    function tetesSur(m) {
      if (!m || !m.isMesh || faites[m.uuid]) return; var g = m.geometry, p = g && g.attributes && g.attributes.position; if (!p) return;
      // une tête par vis : cellules de 5 cm en x, z (P07_s12_003 porte 2 vis par bout)
      var cel = {}; for (var i = 0; i < p.count; i++) { var x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = Math.round(x / 0.05) + "," + Math.round(z / 0.05);
        var c = cel[k] || (cel[k] = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9, y1: -1e9 }); if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (z < c.z0) c.z0 = z; if (z > c.z1) c.z1 = z; if (y > c.y1) c.y1 = y; }
      if (!geoTete) { geoTete = new THREE.CylinderGeometry(0.03, 0.03, 0.012, 6); geoRond = new THREE.CylinderGeometry(0.038, 0.038, 0.004, 24);
        // zinc galvanisé clair : la matière « zinc » de la page rend noir sans reflet d environnement
        matTete = new THREE.MeshStandardMaterial({ color: 0xa2a8ac, metalness: 0.25, roughness: 0.45 }); matTete.name = "A14_zinc_tete"; }
      Object.keys(cel).forEach(function (k) { var c = cel[k], cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2, yb = c.y1 - 0.007;   // dessus du bois : 7 mm sous le haut de la vis
        var G = new THREE.Group(); G.name = "A14_tete_tire_fond"; G.position.set(cx, yb, cz); G.visible = false;
        var r = new THREE.Mesh(geoRond, matTete); r.position.y = 0.002; r.castShadow = true; r.receiveShadow = true;
        var h = new THREE.Mesh(geoTete, matTete); h.position.y = 0.004 + 0.006; h.rotation.y = Math.PI / 6; h.castShadow = true; h.receiveShadow = true;
        G.add(r, h); m.add(G); A.tetes.push(G); });
      faites[m.uuid] = true; A.ranges++;
    }
    function prepareTetes(s) { RANGEES.forEach(function (n) { try { tetesSur(s.getObjectByName(n)); } catch (e) { err(e, "têtes " + n); } }); }
    var tetesVues = false, essais = 0;
    function montreTetes(v) { if (v === tetesVues) return; tetesVues = v; A.tetes.forEach(function (G) { G.visible = v; }); }

    // ---------- 2. bloc 39 : bout qui dépasse ----------
    var S39 = { copie: null, orig: null, masque: null };
    function pose39(s) { var o = s.getObjectByName(PLANCHE39); if (!o || !o.parent) return false;
      var c = o.clone(); c.name = "A14_bout_qui_depasse"; c.position.z -= DEPASSE; c.visible = true; c.layers.mask = o.layers.mask; o.parent.add(c);
      S39.copie = c; S39.orig = o; S39.masque = o.layers.mask; o.layers.mask = BIT; A.etat39 = true; return true; }
    function retire39() { try { if (S39.copie && S39.copie.parent) S39.copie.parent.remove(S39.copie); if (S39.orig && S39.masque !== null && S39.orig.layers.mask === BIT) S39.orig.layers.mask = S39.masque;  /* ne remet que si le masque vaut encore la couche 26 (carto/scene.md, piège 4) */ } catch (e) { err(e, "retire39"); }
      S39.copie = null; S39.orig = null; S39.masque = null; A.etat39 = false; }

    I.anime(function () {
      try {
        var v = enVideo(), m = v ? VP.maintenant() : null, id = m ? String(m.id) : null, s = null;
        // têtes
        var veut = !!(id && BLOCS_VIS[id]);
        if (veut && A.ranges < RANGEES.length && (essais++ % 30) === 0) { s = s || scene(); if (s) prepareTetes(s); }
        montreTetes(veut);
        // distance mini
        var C = window.__dbg && window.__dbg.camk, veutD = !!(C && id === PROCHE.id && m.t >= PROCHE.t[0] && m.t < PROCHE.t[1]);
        if (veutD && distSauvee === null) { distSauvee = C.VG_DIST_MIN; C.VG_DIST_MIN = PROCHE.d; }
        else if (!veutD && distSauvee !== null) { if (C && C.VG_DIST_MIN === PROCHE.d) C.VG_DIST_MIN = distSauvee; distSauvee = null; }
        // bloc 39
        var veut39 = id === "39" && m.t >= T39[0] && m.t < T39[1];
        if (veut39 && !S39.copie) { s = s || scene(); if (s) pose39(s); }
        else if (!veut39 && S39.copie) retire39();
      } catch (e) { err(e, "image"); }
    });
  } catch (e) { try { (window.__a14 = window.__a14 || { erreurs: [] }).erreurs.push("init : " + String(e && e.message || e)); } catch (x) {} }
})();
