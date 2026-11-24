// a16_avatar_secondaire.js — regle de l'utilisateur (2026-11-24) : « lorsqu'on parle des planchers secondaires, ajoute toujours l'avatar pour qu'on
// constate la hauteur de travail ». Un travailleur (copie du travailleur de la demo T1, 1,72 m) se tient DEBOUT SUR le plancher secondaire, derriere la
// tete de forage, face a la foreuse (-z), la ou l'axe des tiges passe entre sa hanche (0,91 m) et le milieu de son tronc (1,15 m) : « travailler sur
// la foreuse entre les hanches et le milieu du tronc ».
//  - Narration (video) : blocs 46, 47 et 48a seulement. Hors ecran : sur le plancher secondaire de l'etape 18 (rattache a son pivot, il suit le
//    plancher). Ecran « angle147 » ouvert (bloc 48a) : sur le plancher de l'ecran (« Plancher_secondaire_angle_v147 », refait a chaque tranche) ;
//    a l'horizontale (pas de plancher secondaire) : sur le plancher principal.
//  - Visite normale : quand l'ecran « angle147 » est ouvert.
//  - Jamais ailleurs (demantelement 49-51, autres etapes) : cache par les couches (bit 30), jamais par .visible.
// Le travailleur T1 lui-meme n'est pas touche (inter_travailleur_repos le cache par couches a chaque image) : on en fait une COPIE
// (THREE.SkeletonUtils.clone) sans sa lampe de casque. Etat : window.__a16 { place, hanche, tronc, axe, erreur, ... }.
// (La copie dans la vignette « avoir18 » a ete retiree : le bloc 48 et la vignette sortent de la video, demande de l'utilisateur.)
(function () {
  "use strict";
  var I = window.__inter71;
  if (!I || typeof I.anime !== "function" || typeof THREE === "undefined" || !THREE.SkeletonUtils) return;
  var V3 = THREE.Vector3, CACHE = 1 << 30, VU = 1, BLOCS = { "46": 1, "47": 1, "48a": 1 };
  var A = window.__a16 = { place: null, hanche: 0.91, tronc: 1.15, axe: null, erreur: null, erreurs: 0, mode: null, pose: null, sol: null, x: null, z: null, montre: false };
  function err(e, ou) { A.erreurs++; A.erreur = ou + " : " + String(e && e.message || e); }
  function sceneVisite() { var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
    var P = window.__perso && window.__perso.persos, r = P && (P.T1 || P.T2 || P.AV), o = r && r.racine; while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }
  function T1() { var P = window.__perso && window.__perso.persos; return P && P.T1 && P.T1.racine || null; }
  function nMailles(o) { var n = 0; o.traverse(function (q) { if (q.isMesh) n++; }); return n; }

  // ------------------------------------------------------------ la copie et sa pose (mesuree une fois, dans son propre repere)
  var C = null, nSrc = 0;
  function masque(m) { if (!C) return; C.traverse(function (q) { if (q.layers.mask !== m) q.layers.mask = m; }); }
  function fabrique() { var src = T1(); if (!src) return false;
    if (C && C.parent) C.parent.remove(C);
    var c = THREE.SkeletonUtils.clone(src), lampes = []; c.name = "Avatar_plancher_secondaire_a16";
    c.traverse(function (q) { if (q.isLight) lampes.push(q); if (q.isMesh) q.frustumCulled = false; });
    lampes.forEach(function (l) { if (l.parent) l.parent.remove(l); });
    c.position.set(0, 0, 0); c.quaternion.identity(); c.updateMatrixWorld(true);
    // sommets poses (avec leurs os) : bas des pieds et haut de la tete
    var v = new V3(), ymin = 1e9, ymax = -1e9;
    c.traverse(function (q) { if (!q.isSkinnedMesh || !q.visible) return; var p = q.geometry.attributes.position, st = Math.max(1, Math.floor(p.count / 3000));
      for (var i = 0; i < p.count; i += st) { v.fromBufferAttribute(p, i); q.boneTransform(i, v); v.applyMatrix4(q.matrixWorld); if (v.y < ymin) ymin = v.y; if (v.y > ymax) ymax = v.y; } });
    function os(n) { var o = c.getObjectByName(n); return o ? o.getWorldPosition(new V3()) : null; }
    var fl = os("foot_l"), fr = os("foot_r"), tl = os("thigh_l"), tr = os("thigh_r"), pe = os("pelvis"), he = os("head"), bl = os("ball_l");
    if (!fl || !fr || !tl || !tr || !pe || ymin > 1e8) throw new Error("os ou sommets introuvables sur la copie de T1");
    var f = new V3().subVectors(tl, tr).cross(new V3(0, 1, 0)); f.y = 0; f.normalize();   // devant = gauche x haut (personnage)
    var pied = new V3((fl.x + fr.x) / 2, ymin, (fl.z + fr.z) / 2), taille = ymax - ymin;
    A.pose = { taille: +taille.toFixed(3), bassin: +(pe.y - ymin).toFixed(3), tete: he ? +(he.y - ymin).toFixed(3) : null, piedsDy: +Math.abs(fl.y - fr.y).toFixed(3),
      penche: he ? +Math.hypot(he.x - pe.x, he.z - pe.z).toFixed(3) : null, orteils: bl ? +new V3(bl.x - fl.x, 0, bl.z - fl.z).normalize().dot(f).toFixed(2) : null,
      ecartPieds: +Math.hypot(fl.x - fr.x, fl.z - fr.z).toFixed(3) };
    C = c; C.userData.a16 = { pied: pied, lacet: Math.atan2(f.x, f.z) }; nSrc = nMailles(src); masque(CACHE); return true; }

  // pose la copie : pieds au point monde « cible », face a -z, enfant de « parent »
  var qW = new THREE.Quaternion(), qP = new THREE.Quaternion(), Y = new V3(0, 1, 0);
  function pose(parent, cible) { var u = C.userData.a16; if (C.parent !== parent) parent.add(C);
    parent.updateMatrixWorld(true); qW.setFromAxisAngle(Y, Math.PI - u.lacet);   // lacet vise : -z (atan2(0, -1) = PI)
    parent.getWorldQuaternion(qP); C.quaternion.copy(qP.invert().multiply(qW));
    var o = u.pied.clone().applyQuaternion(qW), w = cible.clone().sub(o); C.position.copy(parent.worldToLocal(w)); C.updateMatrixWorld(true); }

  // ------------------------------------------------------------ hauteur de l'axe des tiges au-dessus du plancher, a l'abscisse x
  function surLigne(a, d, x) { if (Math.abs(d.x) < 1e-6) return null; return a.y + d.y * (x - a.x) / d.x; }
  function axePrincipal(s) { var t = s.getObjectByName("Foreuse_tige_arriere"); if (!t) return null; t.updateWorldMatrix(true, false);
    var a = t.getWorldPosition(new V3()), d = Y.clone().applyQuaternion(t.getWorldQuaternion(new THREE.Quaternion())); return { a: a, d: d, src: "tige" }; }
  function axeAngle(s) { var S = s.getObjectByName("Foreuse_STM_articulee_v147"); if (!S) return null; var ta = S.getObjectByName("Tige_Arriere"), tv = S.getObjectByName("Tige_Avant"); if (!ta || !tv) return null;
    S.updateWorldMatrix(true, true); var a = ta.getWorldPosition(new V3()), b = tv.getWorldPosition(new V3()); return { a: a, d: b.sub(a), src: "os Tige_Arriere/Tige_Avant" }; }
  // x ou se tenir : 0,30 m du bout x0 si l'axe y est entre hanche et milieu du tronc (2 cm de marge), sinon le x le plus pres de 1,03 m
  function choisitX(ax, x0, x1, haut) { function h(x) { if (!ax) return null; var y = surLigne(ax.a, ax.d, x); return y === null ? null : y - haut; }
    var xp = Math.min(x1 - 0.25, x0 + 0.30), hp = h(xp); if (hp === null || (hp >= A.hanche + 0.02 && hp <= A.tronc - 0.02)) return { x: xp, h: hp };
    var mid = (A.hanche + A.tronc) / 2, best = { x: xp, h: hp };
    for (var x = x0 + 0.25; x <= x1 - 0.25 + 1e-6; x += 0.025) { var hx = h(x); if (hx !== null && Math.abs(hx - mid) < Math.abs(best.h - mid)) best = { x: x, h: hx }; }
    return best; }

  // ------------------------------------------------------------ plancher secondaire de l'etape 18 (groupe sans nom sous un pivot)
  function boiteSecondaire(s) { var tf = s.getObjectByName("Tire_fonds_secondaire_v19"), g = tf && tf.parent;
    if (!g) s.traverse(function (o) { if (!g && o.isMesh && o.material && o.material.name === "wood_secondaire" && o.parent && !o.parent.isScene && o.parent.name !== "Plancher_secondaire_dessous") g = o.parent; });
    if (!g || !g.parent) return null; g.updateWorldMatrix(true, true); var b = new THREE.Box3(), bb = new THREE.Box3();
    g.children.forEach(function (m) { if (!m.isMesh || !m.material || m.material.name !== "wood_secondaire") return; if (!m.geometry.boundingBox) m.geometry.computeBoundingBox(); bb.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld); b.union(bb); });
    if (b.isEmpty()) return null; return { g: g, p: g.parent, b: b }; }

  // ------------------------------------------------------------ chaque image
  var n = 0, cle = "";
  function veut() { var NV = window.__narrationV155, G = I.angleStm, ang = !!(G && G.ouvert);
    if (NV && NV.actif) { var b = NV.BLOCS[NV.i], id = b ? String(b.id) : ""; if (!BLOCS[id]) return null; if (b.c && b.c.ecran === "angle147") return ang ? "angle" : null; return ang ? "angle" : "principal"; }
    return ang ? "angle" : null; }
  function place(mode, s) {
    if (mode === "principal") { var B = boiteSecondaire(s); if (!B) return false; var ax = axePrincipal(s), haut = B.b.max.y;
      if (!ax) { var hp0 = 0.766, pente = 0.577; ax = { a: new V3(0, B.b.max.y - 0.2286 + hp0 + pente * 0.095, -1.07), d: new V3(1, pente, 0), src: "formule l. 1789" }; }
      var c = choisitX(ax, B.b.min.x, B.b.max.x, haut), z = B.b.min.z + 0.30; pose(B.p, new V3(c.x, haut, z));
      A.sol = { haut: +haut.toFixed(3), x: [+B.b.min.x.toFixed(3), +B.b.max.x.toFixed(3)], z: [+B.b.min.z.toFixed(3), +B.b.max.z.toFixed(3)] }; fixe(c, z, ax.src); return true; }
    var G = I.angleStm, P = G && G._PM ? G._PM() : null, ax2 = axeAngle(s), Gg = s.getObjectByName("Plancher_secondaire_angle_v147");
    if (!ax2) return false;
    if (P && Gg) { var c2 = choisitX(ax2, P.x0, P.x1, P.haut), z2 = P.z0 + 0.30; pose(Gg, new V3(c2.x, P.haut, z2));
      A.sol = { haut: +P.haut.toFixed(3), x: [+P.x0.toFixed(3), +P.x1.toFixed(3)], z: [+P.z0.toFixed(3), +P.z1.toFixed(3)], tranche: G.tranche && G.tranche.id }; fixe(c2, z2, ax2.src); return true; }
    // a l'horizontale : pas de plancher secondaire, debout sur le plancher principal au meme endroit
    var sol = G && G.SOL || 0.23, x3 = 0.87, y3 = surLigne(ax2.a, ax2.d, x3); pose(s, new V3(x3, sol, -0.15));
    A.sol = { haut: sol, tranche: G.tranche && G.tranche.id, sansSecondaire: true }; fixe({ x: x3, h: y3 === null ? null : y3 - sol }, -0.15, ax2.src); return true; }
  function fixe(c, z, src) { A.x = +c.x.toFixed(3); A.z = +z.toFixed(3); A.axe = c.h === null ? null : +c.h.toFixed(3); A.axeSource = src;
    A.dansBornes = A.axe !== null && A.axe >= A.hanche && A.axe <= A.tronc; }

  I.anime(function () { try { n++;
      var src = T1(); if (!src) return;
      if (!C || (n % 120 === 0 && nMailles(src) !== nSrc)) { if (!fabrique()) return; cle = ""; }
      var mode = veut(), s = sceneVisite();
      if (!mode || !s) { if (A.montre) { masque(CACHE); A.montre = false; } A.mode = null; return; }
      var G = I.angleStm, Gg = mode === "angle" ? s.getObjectByName("Plancher_secondaire_angle_v147") : null;
      var k = mode + "|" + (Gg ? Gg.uuid + "|" + Gg.position.x.toFixed(3) : "") + "|" + (G && G.angle);
      if (k !== cle || n % 30 === 0) { var ok = place(mode, s); if (!ok) { masque(CACHE); A.montre = false; return; } cle = k; A.mode = mode; A.place = mode === "angle" ? (A.sol && A.sol.sansSecondaire ? "plancher principal (angle 0)" : "plancher de l'ecran angle147") : "plancher secondaire etape 18"; }
      // ecran angle : on attend que les pieces du plancher refait soient posees (elles tombent de 0,4 m une a une)
      var pret = true; if (Gg) { Gg.traverse(function (q) { if (q.isMesh && q.geometry && q.geometry.type === "BoxGeometry" && !q.visible) pret = false; }); }
      if (pret && !A.montre) { masque(VU); A.montre = true; } else if (!pret && A.montre) { masque(CACHE); A.montre = false; }
    } catch (e) { err(e, "image"); try { masque(CACHE); A.montre = false; } catch (x) {} } });

  // debut du bloc 46 : la copie est prete d'avance
  try { var VP = window.__videoPlans; if (VP && VP.au) VP.au("46", function () { try { if (!C) fabrique(); } catch (e) { err(e, "bloc 46"); } }); } catch (e) { err(e, "VP.au"); }
})();
