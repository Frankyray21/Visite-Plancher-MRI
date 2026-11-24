// a17_lavage.js — lavage du plancher principal au boyau d'eau au démantèlement (vidéo narrée, bloc 49, écran « demontage »).
// Nouvelle voix du bloc 49 (à enregistrer) : « Au démantèlement, après le départ de la foreuse : on lave le plancher au boyau d'eau. Le plancher
// secondaire, on le garde tel quel : il va resservir. … Le principal, en commençant par les planches du fond … ». L'animation joue sur la phrase
// « on lave le plancher au boyau d'eau », estimée de T0 = 1,2 s à T1 = 6,5 s de voix (constantes ci-dessous).
// Ce que l'on voit (sobre : aucune particule en nuage, aucune poussière) :
//  - un boyau d'eau (matière du boyau jaune de mine de la scène, « Boyau_arrosage », sinon tube sombre) qui arrive du sol de la galerie par les
//    marches de l'entrée (x ≈ 10,6 → 9,75) et monte jusqu'à une lance tenue à hauteur de main (copie de la lance de la page, I.boyau.lanceTenue) au
//    bord du plancher côté entrée, dans l'ouverture du garde-corps (z 0,31-1,61) ;
//  - un jet (tube fin semi-transparent bleuté qui suit une parabole, s'élargit vers l'impact), une éclaboussure plate et 28 gouttelettes en arc
//    au point frappé ; le jet balaie le plancher en deux passes de gauche (+z) à droite (-z) : moitié du fond (x ≈ 1,2-3,8) puis moitié de l'entrée
//    (x ≈ 5,8-8,4), en ondulant ; s'il frappe le dessus du plancher secondaire (gardé, x 0,57-2,40), l'impact se pose dessus (pas de traversée) ;
//  - une pellicule d'eau brillante (plan mince MeshStandardMaterial rugosité 0,1, métal 0,2, opacité 0,35, 4 mm au-dessus des planches) dont la
//    carte alpha s'étend derrière le passage du jet, puis sèche lentement ; elle s'efface du fond vers la sortie au rythme du départ des planches ;
//  - la saleté du plancher (nuanceur des madriers, inter_salete.js : K.resalit / K.lave) s'efface sous le jet ; tout est propre à T1.
// Planches encore en place pendant le lavage : la fenêtre b (planches) du module démontage, [6000, 14000] ms depuis l'ouverture (= 4,8 s de voix,
// AVANT la fin du lavage), est repoussée en vidéo à B_VIDEO = [7900, 14000] (6,7 s de voix) : posée avant chaque ouverture (enveloppes de K.ouvre et de
// l'ouvre() de l'écran « demontage », et à chaque image tant que l'écran est fermé), remise hors vidéo (écran fermé). a02 n'est pas touché.
// Caméra et clé : a05_table_fin.js (bloc 49 : plongée douce depuis l'entrée à t 0, clé « On lave le plancher au boyau d'eau » à T0).
// Rien hors du mode vidéo (NV.actif et body.mode-video) ; tout sous try/catch ; état dans window.__a17 ; la pellicule et le boyau sont des objets
// propres au patch (groupe « Lavage_a17 » sous la scène), montrés/cachés par leur .visible (aucun personnage), jamais rien sur les pièces de la page.
(function () {
  "use strict";
  var I = window.__inter71;
  if (!I || typeof I.anime !== "function" || typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, HAUT = new V3(0, 1, 0);
  var A = window.__a17 = { phase: "attente", progression: 0, objets: 0, erreur: null, erreurs: 0, lave: 0, fenetreB: null, construit: false, t: null,
    impact: null, boyauMat: null, lance: null, plancher: null, secondaire: null, film: 0, dirt: null, reglages: { opacite: null } };   // reglages.opacite : essai (null = 0,35)
  function err(e, ou) { A.erreurs++; A.erreur = ou + " : " + String(e && e.message || e).slice(0, 200); }
  function NV() { return window.__narrationV155; }
  function VP() { return window.__videoPlans; }
  function enVideo() { var n = NV(); return !!(n && n.actif) && document.body.classList.contains("mode-video"); }
  function sceneVisite() { var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
    var P = window.__perso && window.__perso.persos, r = P && (P.T1 || P.T2 || P.AV), o = r && r.racine; while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }
  function ss(a, b, v) { var t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); }
  function cl(v, a, b) { return v < a ? a : v > b ? b : v; }

  // ---------------------------------------------------------------- instants (secondes de voix du bloc 49)
  // À RECALER sur phrases_mp3.json quand la voix 49 sera réenregistrée (fin du silence avant « on lave » / fin de « boyau d'eau »).
  var BLOC = "49", T0 = 2.96, T1 = 6.0;   // voix du 24 nov. (20,9 s) : « on lave le plancher au boyau d'eau » = 2,96 → 4,69 s ; « Le plancher secondaire… » à 5,33 —   // voix v26 (20,0 s, 2026-11-24) : « on lave le plancher au boyau d'eau » = 3,10 → 5,24 s ; « Le plancher secondaire… » à 5,24
  var T_SORTIE = 0.45;            // s : après T1, le jet s'arrête puis le boyau et la lance s'effacent en fondu
  var T_SECHE = 9.0;              // s : la pellicule passe de 0,35 à 0,10 d'opacité en T_SECHE après T1 (le bois sèche lentement)
  // fenêtre b (planches) du module démontage en mode vidéo : début ≥ 1200 (carton) + T1 × 1000 + 200 ms de marge → 7900 (origine : 6000)
  var B_VIDEO = [10600, 18600];   // voix v26 : « Le principal, en commençant par les planches du fond » à 9,40 s → planches dès 1200 + 9400 ms, fenêtre de 8 s
  A.fenetreB = B_VIDEO;

  // ---------------------------------------------------------------- fenêtre b du démontage (planches) repoussée en vidéo
  var tB0 = null;
  function poseB() { var K = I.demontage; if (!K || !K.T) return; if (K.T.b !== B_VIDEO) { if (tB0 === null) tB0 = K.T.b; K.T.b = B_VIDEO; } }
  function rendB() { var K = I.demontage; if (!K || !K.T || K.ouvert || tB0 === null) return; K.T.b = tB0; tB0 = null; }
  try { var K0 = I.demontage; if (K0 && typeof K0.ouvre === "function" && !K0.__a17) { var ouvreK = K0.ouvre;
      K0.ouvre = function () { try { if (enVideo() && !K0.ouvert) poseB(); } catch (e) { err(e, "K.ouvre"); } return ouvreK.apply(this, arguments); }; K0.__a17 = true; }
    var E = window.__ecransV19, s0 = E && E.liste ? E.liste.filter(function (s) { return s.id === "demontage"; })[0] : null;
    if (s0 && typeof s0.ouvre === "function" && !s0.__a17) { var ouvreS = s0.ouvre;
      s0.ouvre = function () { try { var K = I.demontage; if (enVideo() && K && !K.ouvert) poseB(); } catch (e) { err(e, "s.ouvre"); } return ouvreS.apply(this, arguments); }; s0.__a17 = true; }
  } catch (e) { err(e, "enveloppes"); }

  // ---------------------------------------------------------------- mesures de la scène (une fois, à la construction)
  var PL = { x0: 0, x1: 9.754, z0: -2.438, z1: 2.438, haut: 0.236 };                 // planches du plancher principal (mesuré 2026-11-24)
  var SEC = { x0: 0.567, x1: 2.402, z0: -0.628, z1: 0.191, haut: 0.466 };            // plancher secondaire gardé (DR 18), dessus
  function mesure(s) { try { var b = new THREE.Box3(), bb = new THREE.Box3(), n = 0;
      s.traverse(function (o) { if (o.isMesh && /^P(07_s06|07_s12|13_s12)_\d{3}$/.test(o.name)) { bb.setFromObject(o); if (!bb.isEmpty()) { b.union(bb); n++; } } });
      if (n > 10 && b.max.x - b.min.x > 5) PL = { x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z, haut: b.max.y };
    } catch (e) { err(e, "mesure planches"); }
    try { var tf = s.getObjectByName("Tire_fonds_secondaire_v19"), g = tf && tf.parent; if (g) { g.updateWorldMatrix(true, true); var c = new THREE.Box3().setFromObject(g);
        if (!c.isEmpty() && c.max.x - c.min.x < 6) SEC = { x0: c.min.x, x1: c.max.x, z0: c.min.z, z1: c.max.z, haut: c.max.y }; }
    } catch (e) { err(e, "mesure secondaire"); }
    A.plancher = PL; A.secondaire = SEC; }
  function hauteurImpact(x, z) { return (x > SEC.x0 - 0.05 && x < SEC.x1 + 0.05 && z > SEC.z0 - 0.05 && z < SEC.z1 + 0.05) ? SEC.haut : PL.haut; }

  // ---------------------------------------------------------------- objets du patch
  var G = null, boyau = null, lance = null, jet = null, disque = null, gouttes = [], film = null, filmTex = null, filmA = null;
  var NX = 160, NZ = 80, N_JET = 22, R_JET = 6, N_GOUTTES = 28;
  var MAIN = new V3(9.35, 1.0, 0.95);        // main qui tient la lance : 40 cm en dedans du bord d'entrée, dans l'ouverture du garde-corps (z 0,31-1,61)
  var matEau = null, matDisque = null, matGoutte = null;
  function matiereBoyau(s) { var m = null;
    try { var b = s.getObjectByName("Boyau_arrosage"); if (b) b.traverse(function (o) { if (!m && o.isMesh && o.material && !Array.isArray(o.material) && o.material.map && o.material.roughness > 0.7) m = o.material; }); } catch (e) {}
    if (m) { A.boyauMat = "Boyau_arrosage (jaune de mine)"; var c = m.clone(); c.transparent = true; c.opacity = 1; return c; }
    A.boyauMat = "tube sombre (secours)"; return new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.74, metalness: 0, transparent: true, opacity: 1 }); }
  function construit(s) {
    mesure(s);
    G = new THREE.Group(); G.name = "Lavage_a17"; G.visible = false; s.add(G);
    // pellicule d'eau : plan sur les planches, carte alpha peinte derrière le jet
    filmA = new Uint8Array(NX * NZ * 4); filmTex = new THREE.DataTexture(filmA, NX, NZ, THREE.RGBAFormat); filmTex.magFilter = filmTex.minFilter = THREE.LinearFilter; filmTex.generateMipmaps = false; filmTex.needsUpdate = true;
    // teinte sombre et chaude : le bois mouillé fonce sans griser (essais 2026-11-24 : pellicule claire = planches blanchies, gris-bleu = bois terne) ;
    // le reflet des lampes (rugosité 0,1) donne le brillant
    var mf = new THREE.MeshStandardMaterial({ color: 0x241a12, roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.35, depthWrite: false, alphaMap: filmTex, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    mf.name = "a17_pellicule";
    var gf = new THREE.PlaneGeometry(PL.x1 - PL.x0, PL.z1 - PL.z0); gf.rotateX(-Math.PI / 2);   // local +y → monde -z : v = (zMax - z) / H, rangée 0 = v 0
    film = new THREE.Mesh(gf, mf); film.name = "Lavage_pellicule_a17"; film.position.set((PL.x0 + PL.x1) / 2, PL.haut + 0.004, (PL.z0 + PL.z1) / 2); film.renderOrder = 1; film.frustumCulled = false; film.receiveShadow = true; G.add(film);
    // boyau (tube refait à chaque image du lavage) et lance (copie de la lance de la page)
    var mb = matiereBoyau(s); boyau = new THREE.Mesh(new THREE.BufferGeometry(), mb); boyau.name = "Lavage_boyau_a17"; boyau.castShadow = true; boyau.frustumCulled = false; G.add(boyau);
    try { var L0 = I.boyau && I.boyau.lanceTenue; if (L0) { lance = L0.clone(true); lance.name = "Lavage_lance_a17"; lance.traverse(function (q) { q.visible = true; q.layers.set(0); q.frustumCulled = false; }); A.lance = "copie de I.boyau.lanceTenue"; } } catch (e) { err(e, "lance"); lance = null; }
    if (!lance) { lance = new THREE.Group(); lance.name = "Lavage_lance_a17"; var ml = new THREE.MeshStandardMaterial({ color: 0xa9883f, roughness: 0.5, metalness: 0.45 });
      var corps = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.2, 12), ml); corps.position.y = -0.1; lance.add(corps);
      var bec = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.008, 0.06, 12), ml); bec.position.y = -0.225; lance.add(bec); A.lance = "lance simple (secours)"; }
    lance.traverse(function (q) { if (q.isMesh && q.material && !q.material.__a17) { q.material = q.material.clone(); q.material.transparent = true; q.material.__a17 = true; } });
    G.add(lance);
    // jet : tube fin dont le rayon croît vers l'impact ; matière d'eau bleutée semi-transparente (aucune lumière compilée en plus)
    matEau = new THREE.MeshStandardMaterial({ color: 0xa6c6dc, roughness: 0.08, metalness: 0.05, transparent: true, opacity: 0.6, depthWrite: false, side: THREE.DoubleSide }); matEau.name = "a17_eau";
    var gj = new THREE.BufferGeometry(), pos = new Float32Array((N_JET + 1) * R_JET * 3), ix = [];
    for (var i = 0; i < N_JET; i++) for (var k = 0; k < R_JET; k++) { var a0 = i * R_JET + k, a1 = i * R_JET + (k + 1) % R_JET, b0 = a0 + R_JET, b1 = a1 + R_JET; ix.push(a0, b0, a1, a1, b0, b1); }
    gj.setAttribute("position", new THREE.BufferAttribute(pos, 3)); gj.setIndex(ix); gj.computeVertexNormals();
    jet = new THREE.Mesh(gj, matEau); jet.name = "Lavage_jet_a17"; jet.renderOrder = 2; jet.frustumCulled = false; G.add(jet);
    // éclaboussure plate à l'impact et gouttelettes en arc
    matDisque = new THREE.MeshStandardMaterial({ color: 0xdce9f1, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.3, depthWrite: false }); matDisque.name = "a17_eclabous";
    var gd = new THREE.CircleGeometry(0.28, 20); gd.rotateX(-Math.PI / 2); disque = new THREE.Mesh(gd, matDisque); disque.name = "Lavage_eclaboussure_a17"; disque.renderOrder = 2; disque.frustumCulled = false; G.add(disque);
    matGoutte = new THREE.MeshStandardMaterial({ color: 0xcfe2ee, roughness: 0.05, metalness: 0.05, transparent: true, opacity: 0.7, depthWrite: false }); matGoutte.name = "a17_goutte";
    var gg = new THREE.SphereGeometry(0.012, 6, 5), al = 4621; function rnd() { al = (al * 16807) % 2147483647; return al / 2147483647; }
    for (var g = 0; g < N_GOUTTES; g++) { var m = new THREE.Mesh(gg, matGoutte); m.name = "Lavage_goutte_a17"; m.renderOrder = 3; m.frustumCulled = false;
      m.userData = { a: rnd() * Math.PI * 2, v: 0.5 + 1.1 * rnd(), vy: 0.9 + 0.9 * rnd(), ph: rnd(), dur: 0.3 + 0.2 * rnd() }; gouttes.push(m); G.add(m); }
    var n = 0; G.traverse(function (q) { if (q.isMesh) n++; }); A.objets = n; A.construit = true;
    // chauffe : deux images avec tout visible mais le groupe réduit à presque rien (vers l'origine, dans le bois du bout du plancher ; frustumCulled
    // coupé partout) : les nuanceurs se compilent pendant le carton du bloc, pas au premier jet
    cible(0, P); poseOutils(0); montreJet(true); chauffe = 2; G.visible = true; G.scale.setScalar(0.0005); A.chauffe = "en cours"; }
  var chauffe = 0;
  function finChauffe() { G.scale.setScalar(1); A.chauffe = "faite"; }
  function opaciteOutils(o) { try { boyau.material.opacity = o; lance.traverse(function (q) { if (q.isMesh && q.material) q.material.opacity = o; }); } catch (e) {} }

  // ---------------------------------------------------------------- pellicule : peinture et effacement
  function peintFilm(x, z, r) { var W = PL.x1 - PL.x0, H = PL.z1 - PL.z0, dx = W / NX, dz = H / NZ, touche = false;
    var x0 = Math.max(0, Math.floor((x - r - PL.x0) / dx)), x1 = Math.min(NX - 1, Math.ceil((x + r - PL.x0) / dx));
    var r0 = Math.max(0, Math.floor((PL.z1 - (z + r)) / dz)), r1 = Math.min(NZ - 1, Math.ceil((PL.z1 - (z - r)) / dz));
    for (var iz = r0; iz <= r1; iz++) for (var ix = x0; ix <= x1; ix++) { var cx = PL.x0 + (ix + 0.5) * dx, cz = PL.z1 - (iz + 0.5) * dz, d = Math.hypot(cx - x, cz - z); if (d > r) continue;
      var v = Math.round(255 * (1 - ss(r * 0.45, r, d))), j = (iz * NX + ix) * 4; if (v > filmA[j + 1]) { filmA[j] = filmA[j + 1] = filmA[j + 2] = v; filmA[j + 3] = 255; touche = true; } }
    if (touche) filmTex.needsUpdate = true; }
  function remplitFilm(k) { var touche = false; for (var j = 0; j < NX * NZ * 4; j += 4) { var v = Math.min(255, filmA[j + 1] + Math.ceil(k * (255 - filmA[j + 1]))); if (v > filmA[j + 1]) { filmA[j] = filmA[j + 1] = filmA[j + 2] = v; filmA[j + 3] = 255; touche = true; } }
    if (touche) filmTex.needsUpdate = true; }
  var frontFait = -1;
  function effaceFilmJusqua(xF) { var W = PL.x1 - PL.x0, dx = W / NX, ixF = Math.min(NX, Math.floor((xF - PL.x0) / dx)); if (ixF <= frontFait) return; frontFait = ixF;
    for (var iz = 0; iz < NZ; iz++) for (var ix = 0; ix < ixF; ix++) { var j = (iz * NX + ix) * 4; filmA[j] = filmA[j + 1] = filmA[j + 2] = 0; } filmTex.needsUpdate = true; }
  function videFilm() { filmA.fill(0); filmTex.needsUpdate = true; frontFait = -1; A.film = 0; }

  // ---------------------------------------------------------------- saleté des planches (inter_salete.js)
  var saleReset = false, aLave = false;
  function salete() { return I.salete && typeof I.salete.lave === "function" ? I.salete : null; }
  function saletePrete() { var S = salete(); if (!S) { A.dirt = "inter_salete absent"; return; } if (!saleReset) { try { S.resalit(); } catch (e) {} saleReset = true; } S.propre = true; A.dirt = "resalie puis lavée (K.lave), message « Plancher nettoyé » coupé"; }
  function laveIci(x, z, r, k) { var S = salete(); if (!S) return; try { A.lave += S.lave(x, z, r, k) || 0; aLave = true; } catch (e) { err(e, "lave"); } }
  function rendSalete() { var S = salete(); if (!S || !aLave) return; try { S.resalit(); S.propre = false; } catch (e) {} aLave = false; saleReset = false; }

  // ---------------------------------------------------------------- trajectoire du jet (u = 0 → 1 pendant [T0, T1])
  function cible(u, out) { var s, z, x;
    if (u < 0.46) { s = u / 0.46; z = 2.25 - 4.5 * s; x = 2.5 + 1.25 * Math.sin(2 * Math.PI * 2.5 * s); }                       // passe 1 : moitié du fond, de gauche (+z) à droite (-z)
    else if (u < 0.54) { s = (u - 0.46) / 0.08; var e = s * s * (3 - 2 * s); z = -2.25 + 4.5 * e; x = 3.75 + (6.5 - 3.75) * e; }  // retour rapide vers la gauche, plus près
    else { s = (u - 0.54) / 0.46; z = 2.25 - 4.5 * s; x = 7.1 + 1.3 * Math.sin(2 * Math.PI * 2.5 * s); }                            // passe 2 : moitié de l'entrée
    x = cl(x, PL.x0 + 0.15, PL.x1 - 0.2); z = cl(z, PL.z0 + 0.15, PL.z1 - 0.15); out.set(x, hauteurImpact(x, z), z); return out; }
  var P = new V3(), B = new V3(), D = new V3(), dirJet = new V3(), tmp = new V3(), tmp2 = new V3(), n1 = new V3(), n2 = new V3(), R = new V3(), H = new V3();
  var qLance = new THREE.Quaternion(), MOINS_Y = new V3(0, -1, 0), BEC = 0.252, ARRIERE = 0.092;
  function poseOutils(tv) {
    // main : suit un peu le balayage en z
    H.copy(MAIN); H.z = MAIN.z + 0.10 * (P.z / 2.25); H.x = MAIN.x - 0.04 * Math.max(0, 1 - (P.x - 1) / 8);
    // parabole main → impact : d = P − B (bec provisoire à la main), flèche h = 0,045·|d| ; tangente au départ = direction de la lance
    D.subVectors(P, H); var dist = D.length(), h = 0.045 * dist;
    dirJet.copy(D).addScaledVector(HAUT, 4 * h).normalize();
    lance.quaternion.copy(qLance.setFromUnitVectors(MOINS_Y, dirJet)); lance.position.copy(H);
    B.copy(H).addScaledVector(dirJet, BEC); R.copy(H).addScaledVector(dirJet, -ARRIERE);
    // jet : B → P, rayon 9 mm → 45 mm
    D.subVectors(P, B); dist = D.length(); h = 0.045 * dist;
    var pos = jet.geometry.attributes.position.array, i, k;
    for (i = 0; i <= N_JET; i++) { var s = i / N_JET; tmp.copy(B).addScaledVector(D, s).addScaledVector(HAUT, 4 * h * s * (1 - s));
      tmp2.copy(D).addScaledVector(HAUT, 4 * h * (1 - 2 * s)).normalize();                               // tangente
      n1.crossVectors(tmp2, Math.abs(tmp2.y) > 0.9 ? new V3(1, 0, 0) : HAUT).normalize(); n2.crossVectors(tmp2, n1).normalize();
      var r = 0.011 + 0.042 * Math.pow(s, 1.3) * (0.9 + 0.1 * Math.sin(tv * 37 + s * 9));
      for (k = 0; k < R_JET; k++) { var a = k / R_JET * Math.PI * 2, o = (i * R_JET + k) * 3; pos[o] = tmp.x + r * (n1.x * Math.cos(a) + n2.x * Math.sin(a)); pos[o + 1] = tmp.y + r * (n1.y * Math.cos(a) + n2.y * Math.sin(a)); pos[o + 2] = tmp.z + r * (n1.z * Math.cos(a) + n2.z * Math.sin(a)); } }
    jet.geometry.attributes.position.needsUpdate = true; jet.geometry.computeVertexNormals();
    // boyau : du sol de la galerie (x 11,6), par les marches (dessus à -0,229 puis 0), le bord du plancher (0,236), jusqu'à l'arrière de la lance
    var pts = [new V3(11.9, -0.34, 1.05), new V3(11.1, -0.34, 1.0), new V3(10.45, -0.205, 0.97), new V3(10.05, 0.025, 0.96), new V3(9.74, 0.262, 0.96),
      new V3(9.56, 0.42, H.z + 0.02), tmp.copy(R).addScaledVector(dirJet, -0.12).clone(), R.clone()];
    var courbe = new THREE.CatmullRomCurve3(pts, false, "centripetal"), geo = new THREE.TubeGeometry(courbe, 56, 0.0175, 8, false);
    var ancien = boyau.geometry; boyau.geometry = geo; if (ancien && ancien.dispose) ancien.dispose();
    // éclaboussure et gouttelettes à l'impact
    disque.position.set(P.x, P.y + 0.003, P.z); var pu = 0.85 + 0.15 * Math.sin(tv * 31); disque.scale.set(pu, 1, pu * 0.9);
    for (i = 0; i < gouttes.length; i++) { var gm = gouttes[i], u = gm.userData, f = ((tv / u.dur) + u.ph) % 1, tau = f * u.dur;
      var gy = P.y + u.vy * tau - 4.9 * tau * tau; if (gy < P.y) gy = P.y;
      gm.position.set(P.x + Math.cos(u.a) * u.v * tau, gy, P.z + Math.sin(u.a) * u.v * tau); var sc = 1 - 0.5 * f; gm.scale.setScalar(sc); }
    A.impact = [+P.x.toFixed(2), +P.y.toFixed(2), +P.z.toFixed(2)]; }
  function montreJet(v) { jet.visible = v; disque.visible = v; for (var i = 0; i < gouttes.length; i++) gouttes[i].visible = v; }

  // ---------------------------------------------------------------- chaque image
  var tPrec = null, cache = true;
  function cacheTout() { if (G && !cache) { G.visible = false; cache = true; } A.phase = G ? "cache" : "attente"; }
  I.anime(function (dt) {
    try {
      var v = enVideo(), K = I.demontage;
      if (!v) { cacheTout(); rendSalete(); rendB(); tPrec = null; if (G && (A.film || frontFait >= 0)) videFilm(); return; }
      if (!K || !K.T) return;
      if (!K.ouvert) { poseB(); cacheTout(); tPrec = null; return; }
      var vp = VP(), m = vp && vp.maintenant ? vp.maintenant() : null, n = NV(), b = n && n.BLOCS && n.BLOCS[n.i];
      var ecranDem = !!(b && b.c && b.c.ecran === "demontage"); if (!ecranDem) { cacheTout(); return; }
      var s = sceneVisite(); if (!s) return;
      if (!G) construit(s);
      if (chauffe > 0) { chauffe--; if (chauffe === 0) { finChauffe(); G.visible = false; cache = true; } return; }
      // temps : voix du bloc 49 (VP) ; aux blocs 50-51, l'équivalent par la minuterie de l'écran (ouverture = carton, 1,2 s avant la voix)
      var tv = (m && m.id === BLOC) ? m.t : (K.t - 1200) / 1000; A.t = +tv.toFixed(2);
      var u = (tv - T0) / (T1 - T0); A.progression = +cl(u, 0, 1).toFixed(3);
      if (tv < T0) { cacheTout(); A.phase = "attente"; tPrec = tv; return; }
      if (cache) { G.visible = true; cache = false; }
      if (u <= 1) {
        A.phase = "lavage"; saletePrete(); opaciteOutils(1); boyau.visible = true; lance.visible = true; montreJet(true);
        cible(u, P); poseOutils(tv);
        var pas = tPrec === null ? 0.02 : cl(tv - tPrec, 0, 0.1);
        peintFilm(P.x, P.z, 1.35); laveIci(P.x, P.z, 1.3, Math.min(1, 4.5 * pas));
        if (u > 0.85) { var kf = Math.min(1, 2.2 * pas); remplitFilm(kf); var S2 = salete(); if (S2) for (var gx = PL.x0 + 0.7; gx < PL.x1; gx += 1.4) for (var gz = PL.z0 + 0.7; gz < PL.z1; gz += 1.4) laveIci(gx, gz, 1.1, kf); }
        film.material.opacity = A.reglages.opacite === null ? 0.35 : A.reglages.opacite; A.film = 1;
      } else {
        var w = (tv - T1) / T_SORTIE;
        if (w < 1) { A.phase = "sortie"; montreJet(false); opaciteOutils(1 - w * w); boyau.visible = true; lance.visible = true; if (!A.finiPropre) { A.finiPropre = true; remplitFilm(1); laveIci((PL.x0 + PL.x1) / 2, 0, 20, 1); } }
        else { A.phase = "mouille"; boyau.visible = false; lance.visible = false; montreJet(false); }
        film.material.opacity = (A.reglages.opacite === null ? 0.35 : A.reglages.opacite) - 0.25 * cl((tv - T1) / T_SECHE, 0, 1);
        // les planches partent du fond (x 0) vers la sortie pendant K.T.b : la pellicule s'efface avec elles (un peu en avance)
        var Tb = K.T.b, front = PL.x0 + (PL.x1 - PL.x0) * cl((K.t - Tb[0]) / (Tb[1] - Tb[0] - (K.DUREE || 600)), 0, 1) + 0.25;
        if (K.t > Tb[0]) effaceFilmJusqua(front); if (front >= PL.x1) { A.phase = "fini"; film.visible = false; } else film.visible = true;
      }
      tPrec = tv;
    } catch (e) { err(e, "image"); }
  });

  // ---------------------------------------------------------------- bloc 49 : tout prêt d'avance (objets, nuanceurs), saleté remise
  try { var VPo = VP(); if (VPo && VPo.au) VPo.au(BLOC, function () { try { var s = sceneVisite(); if (s && !G && enVideo()) construit(s); A.finiPropre = false; saleReset = false; if (G && chauffe === 0) { videFilm(); cacheTout(); } } catch (e) { err(e, "au 49"); } }); } catch (e) { err(e, "VP.au"); }   // bloc (re)joué : pellicule neuve, saleté remise au lavage
})();
