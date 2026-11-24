// a12_objets_scene.js — A12 + A15 : objets de scène à montrer dans la vidéo narrée (mode vidéo seulement : NV.actif + body.mode-video).
//  (1) Bloc 4, étape 0 : copie du poste de secours (armoire vitrée, trousse, 2 lave-yeux, extincteur ; modèle « Poste_secours » de la clôture
//      de la cage, visible seulement à l'étape 18) posée contre la paroi de gauche, juste après la barricade du côté où on arrive (x ≈ 21,2) ;
//      voyant orange clignotant (dôme ambre) sur les deux flashers de la barricade (Entree_s00_023, Entree_s00_029) pour qu'on les reconnaisse.
//      Les panneaux Entree_s00_021-031 sont dans l'arbre de la barricade (Entree_s00_020 / 026) : ils ont déjà suivi le recul (x 20,55), rien à faire.
//  (2) Bloc 8 : barres d'écaillage écartées de 11 cm et posées à plat sur le sol (hauteur mesurée au rayon), plus près de la paroi, hors de la
//      pile de 2 × 4 ; étiquettes « Pingouin » et « Barres » posées sur les outils.
//  (3) Étape 9 (bloc 24) : faisceau du laser Bosch = ligne rouge fine horizontale à la hauteur du dessous des 6 × 6 de la section 1 (y 0), qui part
//      de la fenêtre de l'appareil (grossi par la table e7_e9) et passe au-dessus de la section 2 ; cote ambre « ≈ 14 po à soutenir » du faisceau
//      au sol (x 8,0 : 0,36 m mesurés) avec son étiquette.
//  (4) Étape 11 (blocs 27-29) : repère « même hauteur » = ligne laser rouge sur la face intérieure du madrier de rive (z+) de la section 1
//      (bande libre x 4,47-4,88) et de la section 2, à mi-hauteur des 6 × 6.
// Rien n'est créé ni changé hors mode vidéo ; tout est rendu (barres, étiquettes) dès que la vidéo s'arrête. Aucune erreur en console :
// les erreurs sont gardées dans window.__a12.erreurs.
(function () {
  "use strict";
  var NV = window.__narrationV155, I = window.__inter71;
  if (!NV || !I || typeof I.anime !== "function" || typeof THREE === "undefined") return;
  var A = window.__a12 = { erreurs: [], poste: null, barres: "attente", faisceau: null, memeHauteur: null, flashers: 0 };
  function err(e, ou) { try { if (A.erreurs.length < 50) A.erreurs.push(ou + " : " + String(e && e.message || e)); } catch (x) {} }
  function enVideo() { try { return !!NV.actif && document.body.classList.contains("mode-video"); } catch (e) { return false; } }
  function sceneVisite() { var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
    var P = window.__perso && window.__perso.persos, r = P && (P.T1 || P.T2 || P.AV), o = r && r.racine; while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }
  function etapeCourante() { try { var b = NV.BLOCS[NV.i]; if (NV.actif && b && b.c.etape !== undefined) return b.c.etape;
      if (NV.actif && b && b.c.ecran !== undefined) { var E = window.__ecransV19, s = E && E.liste.filter(function (x) { return x.id === b.c.ecran; })[0]; if (s) return s.apres; } } catch (e) {}
    var m = /(\d+)\s+sur/.exec((document.getElementById("etape-num") || {}).textContent || ""); return m ? +m[1] : -1; }
  function blocId() { try { var b = NV.BLOCS[NV.i]; return b ? String(b.id) : null; } catch (e) { return null; } }
  function vu(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
  var V3 = THREE.Vector3, rc = new THREE.Raycaster(), BAS = new V3(0, -1, 0);
  var sols = null;
  function lesSols(s) { if (sols && sols.length) return sols; sols = []; s.traverse(function (o) { if (o.isMesh && /^(Galerie|Suite)_Sol/.test(o.name)) sols.push(o); }); return sols; }
  function sol(s, x, z) { rc.set(new V3(x, 3, z), BAS); rc.far = 10; var h = rc.intersectObjects(lesSols(s), false)[0]; return h ? h.point.y : null; }
  var rocs = null;
  function lesRocs(s) { if (rocs && rocs.length) return rocs; rocs = []; s.traverse(function (o) { if (o.isMesh && /^(Galerie|Suite)_Roc/.test(o.name)) rocs.push(o); }); return rocs; }
  function paroi(s, x, y, sens) { rc.set(new V3(x, y, 0), new V3(0, 0, sens)); rc.far = 6; var h = rc.intersectObjects(lesRocs(s), false)[0]; return h ? h.point.z : null; }
  function mat(c) { var m = new THREE.MeshBasicMaterial({ color: c }); m.toneMapped = false; return m; }
  function boite(o) { o.updateMatrixWorld(true); return new THREE.Box3().setFromObject(o); }

  // ---------------------------------------------------------------- (1) poste de secours de l'entrée
  var POSTE_X = 21.2;               // centre en x, côté arrivée, 0,6 m après les panneaux blancs (x 20,55)
  function creePoste(s) {
    var o = s.getObjectByName("Poste_secours"); if (!o) return null;
    var box = boite(o), c = box.getCenter(new V3()), h = box.max.y - box.min.y, prof = box.max.x - box.min.x;
    var copie = o.clone(true); copie.traverse(function (q) { if (q.name) q.name = "A12_" + q.name; });   // jamais trouvé par les recherches « Poste_secours »
    var p = new V3(), q = new THREE.Quaternion(), e = new V3(); o.matrixWorld.decompose(p, q, e);
    copie.position.copy(p).sub(c); copie.quaternion.copy(q); copie.scale.copy(e);
    var W = new THREE.Group(); W.name = "A12_Poste_secours_entree"; W.add(copie);
    W.rotation.y = Math.PI / 2;                                                    // façade (+x du modèle) tournée vers le centre de la galerie (-z)
    var g = sol(s, POSTE_X, 1.9); if (g === null) g = -0.29;
    var zP = 9; [-0.4, 0, 0.4].forEach(function (dx) { [g + 0.8, g + 1.15, g + 1.5].forEach(function (y) { var z = paroi(s, POSTE_X + dx, y, 1); if (z !== null && z < zP) zP = z; }); });
    if (zP > 5) zP = 2.5;
    W.position.set(POSTE_X, g + 0.85 + h / 2, zP - prof / 2 - 0.012);              // bas de l'armoire à 85 cm du sol, dos contre la roche
    W.visible = false; s.add(W); W.updateMatrixWorld(true);
    A.poste = { x: POSTE_X, sol: +g.toFixed(3), paroi: +zP.toFixed(3), haut: +h.toFixed(3) };
    var L = window.__etiquettesV19 = window.__etiquettesV19 || [];
    function pt(nom, dy) { var m = W.getObjectByName("A12_" + nom); if (!m) return null; var b = boite(m), r = b.getCenter(new V3()); if (dy) r.y = b.max.y + dy; return r.toArray().map(function (v) { return +v.toFixed(3); }); }
    var pa = pt("Poste_secours_6", 0), pe = pt("Poste_secours_16", 0);
    function actif() { return enVideo() && W.visible; }
    if (pa) L.push({ id: "a12_poste_armoire", texte: "Armoire vitrée", pos: pa, genre: "note", etapes: [0], ecran: "materiel", actif: actif });
    if (pe) L.push({ id: "a12_poste_extincteur", texte: "Extincteur", pos: pe, genre: "note", etapes: [0], ecran: "materiel", actif: actif });
    return W;
  }
  // voyants orange des flashers de la barricade
  var voyants = [], HALO = null;
  function texHalo() { if (HALO) return HALO; var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,0.9)"); r.addColorStop(0.25, "rgba(255,255,255,0.35)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 64, 64); HALO = new THREE.CanvasTexture(c); return HALO; }
  function creeVoyants(s) {
    ["Entree_s00_023", "Entree_s00_029"].forEach(function (n) { var l = s.getObjectByName(n); if (!l) return; var b = boite(l), c = b.getCenter(new V3());
      var G = new THREE.Group(); G.name = "A12_voyant_" + n;
      var m = mat(0xff8c10), d = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), m); d.position.set(0, 0.014, 0); G.add(d);
      var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texHalo(), color: 0xff7a10, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false })); halo.scale.set(0.34, 0.34, 1); halo.position.set(0, 0.05, 0); G.add(halo);
      var base = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.074, 0.028, 24), new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.6 })); G.add(base);
      G.position.set(c.x, b.min.y + 0.014, c.z); G.visible = false; s.add(G); voyants.push({ g: G, m: m, halo: halo, lampe: l }); });
    A.flashers = voyants.length; return voyants.length > 0;
  }

  // ---------------------------------------------------------------- (2) barres d'écaillage, étiquettes du pingouin et des barres
  var BARRES = null;   // [{ o, local0 }]
  function barres(s, video) {
    var M = I.materiel; if (!M) return;
    if (!BARRES) { var l = []; [6, 8, 10].forEach(function (ft) { var o = s.getObjectByName("Materiel_barre_" + ft); if (o) l.push({ o: o, ft: ft, local0: o.position.clone(), cible: null }); }); if (l.length !== 3) return; BARRES = l; }
    var ouvert = video && M.ouvert;
    BARRES.forEach(function (b) { if (b.o.visible !== !video) b.o.visible = !video; });   // 2026-11-24 : barres d'écaillage retirées de la vidéo (cachées en mode vidéo)
    BARRES.forEach(function (b, k) {
      if (!ouvert) { if (!b.o.position.equals(b.local0)) { b.o.position.copy(b.local0); b.o.updateMatrixWorld(true); } return; }
      if (!b.cible) {   // place calculée une fois : à plat, sur le point le plus haut du sol sous la barre
        b.o.position.copy(b.local0); b.o.updateMatrixWorld(true); var w0 = b.o.getWorldPosition(new V3()), Lg = b.ft * 0.3048, z = 2.04 + 0.11 * k, ys;
        for (var essai = 0; essai < 6; essai++, z -= 0.04) { ys = []; for (var u = 0; u <= 6; u++) { var y = sol(s, w0.x + Lg * u / 6, z); ys.push(y === null ? 9 : y); }
          var mx = Math.max.apply(null, ys), mn = Math.min.apply(null, ys); if (mx < -0.2 && mx - mn < 0.05) break; }
        var w = new V3(w0.x, Math.max.apply(null, ys) + 0.0159 + 0.003, z); b.cible = b.o.parent.worldToLocal(w.clone()); b.monde = w; }
      if (!b.o.position.equals(b.cible)) { b.o.position.copy(b.cible); b.o.updateMatrixWorld(true); }
    });
    A.barres = ouvert ? BARRES.map(function (b) { return b.monde ? b.monde.toArray().map(function (v) { return +v.toFixed(3); }) : null; }) : "rendues";
  }
  var ETQ0 = {};
  function etiquetteSur(id, pos, video) {
    var d = (window.__etiquettesV19 || []).filter(function (x) { return x.id === id; })[0]; if (!d || !d.pos) return;
    if (!ETQ0[id]) ETQ0[id] = { d: d, pos: d.pos.slice() };
    var p = video && pos ? pos : ETQ0[id].pos; for (var i = 0; i < 3; i++) d.pos[i] = p[i];
  }
  var tetePingouin = null;
  function posPingouin(s) {
    if (!tetePingouin) { var o = s.getObjectByName("MAT_pingouin"); if (!o) return null; var best = null, sc = -9;
      o.traverse(function (q) { if (!q.isMesh || !q.material || !q.material.color) return; var c = q.material.color, v = c.r + c.g - 2 * c.b; if (v > sc) { sc = v; best = q; } });
      tetePingouin = best || o; }
    var b = boite(tetePingouin), c = b.getCenter(new V3()); return [c.x, b.max.y + 0.03, c.z];
  }

  // ---------------------------------------------------------------- (3) faisceau du laser et cote de 14 po (étape 9)
  var Y_FAISCEAU = 0.0;               // dessous des 6 × 6 de la section 1 (P04_s04_* : y 0 à 0,152)
  var X_COTE = 8.0, X_FIN = 9.55;
  var F9 = null;
  function creeFaisceau(s) {
    var G = new THREE.Group(); G.name = "A12_faisceau_laser_e9"; G.visible = false;
    var rouge = mat(0xff1a0a);
    var ray = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0032, 1, 10), rouge); ray.rotation.z = Math.PI / 2; G.add(ray);   // longueur = scale.y, le long de x
    var pt = new THREE.Mesh(new THREE.SphereGeometry(0.009, 12, 8), rouge); G.add(pt);
    var ambre = mat(0xffb020), g8 = sol(s, X_COTE, 2.1); if (g8 === null) g8 = -0.364;
    var hC = Y_FAISCEAU - g8, cote = new THREE.Group(); cote.name = "A12_cote_14po";
    var tr = new THREE.Mesh(new THREE.BoxGeometry(0.006, hC, 0.006), ambre); tr.position.y = g8 + hC / 2; cote.add(tr);
    [g8 + 0.003, Y_FAISCEAU].forEach(function (y) { var t = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.006, 0.006), ambre); t.position.y = y; cote.add(t); });
    cote.position.set(X_COTE, 0, 2.1); G.add(cote); s.add(G);
    F9 = { g: G, ray: ray, pt: pt, sol: g8 };
    A.faisceau = { y: Y_FAISCEAU, solCote: +g8.toFixed(3), hauteur_po: +(hC / 0.0254).toFixed(1) };
    (window.__etiquettesV19 = window.__etiquettesV19 || []).push({ id: "a12_cote_14po", texte: "≈ 14 po à soutenir", pos: [X_COTE, +((g8 + Y_FAISCEAU) / 2).toFixed(3), 2.1], genre: "cote", etapes: [9], ecran: null,
      actif: function () { return enVideo() && F9 && F9.g.visible; } });
  }
  // ancienne cote 3D des 14 po (maquette v27, « Cote_v27_16 », x 9,7-10,1, contre la paroi) : cachée par couche pendant le faisceau (une seule cote)
  var BIT = 1 << 26, SAUVE = new Map();
  function cacheCouche(o, oui) { if (!o) return; o.traverse(function (q) { if (!q.isMesh && !q.isLine) return;
      if (oui) { if (q.layers.mask !== BIT) { SAUVE.set(q, q.layers.mask); q.layers.mask = BIT; } }
      else if (SAUVE.has(q)) { if (q.layers.mask === BIT) q.layers.mask = SAUVE.get(q); SAUVE.delete(q); } }); }
  var vieilleCote = null;
  function majFaisceau(s, montrer) {
    if (!F9) return; var K = window.__laserOutilsV19, Ap = K && K.L && K.L.appareil;
    var ok = montrer && Ap && vu(Ap);
    if (!vieilleCote || !vieilleCote.parent) vieilleCote = s.getObjectByName("Cote_v27_16");
    if (vieilleCote) cacheCouche(vieilleCote, !!ok);
    F9.g.visible = !!ok; if (!ok) return;
    var b = boite(Ap), x0 = b.max.x - 0.004, z = (b.min.z + b.max.z) / 2, Lg = Math.max(0.1, X_FIN - x0);
    F9.ray.scale.set(1, Lg, 1); F9.ray.position.set(x0 + Lg / 2, Y_FAISCEAU, z); F9.pt.position.set(x0, Y_FAISCEAU, z);
    F9.g.children[2].position.z = z;   // la cote suit le faisceau
    A.faisceau.fenetre = [+x0.toFixed(3), +b.min.y.toFixed(3), +b.max.y.toFixed(3), Ap.scale.x];
  }

  // ---------------------------------------------------------------- (4) même hauteur (étape 11)
  var MH = null;
  function creeMemeHauteur(s) {
    var p1 = s.getObjectByName("P04_s04_006"); if (!p1) return false;
    var s2 = null, zmax = -9; for (var i = 1; i <= 7; i++) { var o = s.getObjectByName("P10_s11_00" + i); if (!o) continue; var b = boite(o); if (b.max.z > zmax) { zmax = b.max.z; s2 = { o: o, b: b }; } }
    if (!s2) return false;
    var b1 = boite(p1), rouge = mat(0xff1a0a), G = new THREE.Group(); G.name = "A12_meme_hauteur_e11"; G.visible = false;
    function trait(xa, xb, y, z) { var m = new THREE.Mesh(new THREE.BoxGeometry(xb - xa, 0.009, 0.002), rouge); m.position.set((xa + xb) / 2, y, z); G.add(m); return m; }
    var y = (b1.min.y + b1.max.y) / 2;
    var t1 = trait(4.47, b1.max.x, y, b1.min.z - 0.0015);                       // bande libre de la section 1 (pas encore couverte à l'étape 11)
    var t2 = trait(s2.b.min.x, s2.b.max.x - 0.05, y, s2.b.min.z - 0.0015);       // madrier de rive de la section 2
    s.add(G); MH = { g: G, piece2: s2.o, t2: t2 };
    A.memeHauteur = { y: +y.toFixed(3), z1: +b1.min.z.toFixed(3), z2: +s2.b.min.z.toFixed(3), haut2: +s2.b.max.y.toFixed(3), haut1: +b1.max.y.toFixed(3) };
    return true;
  }

  // ---------------------------------------------------------------- boucle
  var WP = null, n = 0, prets = { poste: false, voyants: false, faisceau: false, mh: false };
  I.anime(function () {
    try {
      var s = sceneVisite(); if (!s) return;
      var video = enVideo(), et = video ? etapeCourante() : -1;
      if (!video && !A.__actif) return;   // rien à faire ni à rendre
      A.__actif = video;
      if (video && !(++n % 30)) {           // créations paresseuses (une fois)
        try { if (!prets.poste) prets.poste = !!(WP = creePoste(s)); } catch (e) { err(e, "poste"); prets.poste = true; }
        try { if (!prets.voyants) prets.voyants = creeVoyants(s) || n > 3000; } catch (e) { err(e, "voyants"); prets.voyants = true; }
        try { if (!prets.faisceau) { creeFaisceau(s); prets.faisceau = true; } } catch (e) { err(e, "faisceau"); prets.faisceau = true; }
        try { if (!prets.mh && et === 11) prets.mh = creeMemeHauteur(s); } catch (e) { err(e, "même hauteur"); prets.mh = true; }
      }
      // (1)
      if (WP) WP.visible = video && et >= 0 && et < 18;
      var t = performance.now() / 1000, allume = (t % 0.9) < 0.42;
      voyants.forEach(function (v) { v.g.visible = video && vu(v.lampe); v.m.color.setHex(allume ? 0xff7a00 : 0x5a2400); v.halo.visible = allume; });
      // (2)
      try { barres(s, video); } catch (e) { err(e, "barres"); }
      try { var af = s.getObjectByName("Entree_s00_013"); if (af && af.visible !== !video) af.visible = !video; } catch (e) { err(e, "affiche fumer"); }   // 2026-11-24 : affiche « Défense de fumer » retirée de la vidéo (le ruban jaune reste)
      try { var M = I.materiel, surM = video && M && M.ouvert;
        etiquetteSur("materiel_pingouin", surM ? posPingouin(s) : null, surM);
        var b8 = BARRES && BARRES[0] && BARRES[0].monde; etiquetteSur("materiel_barres", surM && b8 ? [b8.x + 1.0, b8.y + 0.02, b8.z] : null, surM && !!b8);
      } catch (e) { err(e, "étiquettes matériel"); }
      // (3)
      try { majFaisceau(s, video && et === 9); } catch (e) { err(e, "faisceau"); }
      // (4)
      try { if (MH) { MH.g.visible = video && et === 11; MH.t2.visible = vu(MH.piece2); } } catch (e) { err(e, "même hauteur"); }
    } catch (e) { err(e, "image"); }
  });
})();
