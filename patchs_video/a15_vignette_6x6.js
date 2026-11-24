// a15_vignette_6x6.js — bloc 48 (écran « avoir18 ») : « coupe les 6x6 qui dépasse » (règle du projet : aucun bois ne dépasse).
// La vignette 3D (index.html, construit(sec, stm) : SV = new THREE.Scene(), SV.name = "Avoir18_vignette", SV.add(sec)) montre le plancher
// secondaire du cas 3 (avoir18_secondaire.txt, GLB) : ses 6 x 6 dépassent des planches du côté z max (la foreuse est du côté z min).
//   - plancher du dessous : 6 x 6 m = 1, planches m = 2 ;
//   - plancher du dessus  : 6 x 6 m = 3, planches m = 4 et la planche taillée (m = 4,6, extra t). Leurs bouts z min passent sous la planche
//     taillée exprès (« les 6 × 6 avancent sous la planche taillée ») : on n'y touche pas.
// La scène est privée à la fermeture de la vignette : on enveloppe THREE.Object3D.prototype.add ; quand this.name === "Avoir18_vignette",
// chaque objet ajouté qui porte des nœuds grp « secondaire » est traité une seule fois (drapeau userData.a15). Vaut en vidéo ET en visite normale.
// Traitement générique (repère de la vignette, matrices monde des nœuds : les 6 x 6 sont tournés de 90° autour de y) :
//   limite = z max (boîtes englobantes monde) des planches du plancher ; le bout z max d'un 6 x 6 (sommets à moins de 2 cm du z max : biseau
//   de 3,5 mm compris) recule d'un bloc pour que son z max tombe sur la limite.
//   La géométrie est clonée par 6 x 6 (le GLB partage une géométrie entre deux 6 x 6 placés différemment). Les uv éventuels des faces ±x / ±y
//   sont recalés par interpolation le long du bois (le GLB n'en a pas aujourd'hui : la texture ne s'étire pas, on rogne).
// État : window.__a15 = { coupes, limites, sommets, scenes, erreur }.
(function () {
  "use strict";
  var A = window.__a15 = { coupes: 0, limites: {}, sommets: 0, scenes: 0, erreur: null };
  try {
    var THREE = window.THREE;
    if (!THREE || !THREE.Object3D || THREE.Object3D.prototype.__a15) return;
    var NOM = "Avoir18_vignette", TOL = 1e-4, BOUT = 0.02;   // BOUT : longueur du bout biseauté déplacé d'un bloc
    // groupes de 6 x 6 -> planches qui les recouvrent
    var GROUPES = [{ m: 1, planches: function (u) { return u.m === 2; } },
                   { m: 3, planches: function (u) { return u.m === 4 || (Math.floor(u.m) === 4 && !!u.t); } }];
    function secondaire(o) { for (var p = o; p; p = p.parent) if (p.userData && p.userData.grp === "secondaire") return p.userData; return null; }
    function zMaxMonde(m) { var g = m.geometry, P = g && g.attributes && g.attributes.position; if (!P) return -Infinity; var v = new THREE.Vector3(), z = -Infinity;
      for (var i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i).applyMatrix4(m.matrixWorld); if (v.z > z) z = v.z; } return z; }
    function coupe(m, lim) {
      var g = m.geometry.clone(); m.geometry = g;   // clone : la géométrie d'origine peut servir à un autre 6 x 6 (autre matrice)
      var P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, M = m.matrixWorld, Mi = new THREE.Matrix4().copy(M).invert(), nm = new THREE.Matrix3().getNormalMatrix(M);
      var w = [], i, v = new THREE.Vector3(), n = new THREE.Vector3(), zmax = -Infinity, zmin = Infinity;
      for (i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i).applyMatrix4(M); w.push(v.clone()); if (v.z > zmax) zmax = v.z; if (v.z < zmin) zmin = v.z; }
      if (!(zmax > lim + TOL)) return 0;
      // les bouts des 6 x 6 sont biseautés (3,5 mm) : tout le bout (sommets à moins de BOUT du z max) recule d'un bloc, biseau compris
      var dz = lim - zmax, nb = 0, bout = Math.min(BOUT, (zmax - zmin) / 4);
      for (i = 0; i < P.count; i++) { if (w[i].z < zmax - bout) continue;
        // uv : faces dont la normale est ±x ou ±y (le long du bois) -> uv interpolé avec le sommet jumeau du bout z min (même x, y, même normale)
        if (U && N) { n.fromBufferAttribute(N, i).applyMatrix3(nm).normalize();
          if (Math.abs(n.z) < 0.5) { var j = -1, dj = Infinity, nj = new THREE.Vector3();
            for (var k = 0; k < P.count; k++) { if (k === i || w[k].z > zmin + bout) continue; nj.fromBufferAttribute(N, k).applyMatrix3(nm).normalize(); if (nj.dot(n) < 0.99) continue;
              var d = Math.abs(w[k].x - w[i].x) + Math.abs(w[k].y - w[i].y); if (d < dj) { dj = d; j = k; } }
            if (j >= 0 && dj < 1e-3 && w[i].z - w[j].z > TOL) { var f = (w[i].z + dz - w[j].z) / (w[i].z - w[j].z); U.setXY(i, U.getX(j) + (U.getX(i) - U.getX(j)) * f, U.getY(j) + (U.getY(i) - U.getY(j)) * f); } } }
        v.copy(w[i]); v.z += dz; v.applyMatrix4(Mi); P.setXYZ(i, v.x, v.y, v.z); nb++; }
      P.needsUpdate = true; if (U) U.needsUpdate = true; g.computeBoundingBox(); g.computeBoundingSphere();
      return nb;
    }
    function traite(racine) {
      if (!racine || !racine.isObject3D || (racine.userData && racine.userData.a15)) return;
      var ms = []; racine.traverse(function (o) { if (o.isMesh && !o.isInstancedMesh && secondaire(o)) ms.push(o); });
      if (!ms.length) return;
      racine.userData.a15 = true; A.scenes++;
      racine.updateMatrixWorld(true);   // la scène de la vignette est à l'identité : monde de la racine = repère de la vignette
      GROUPES.forEach(function (G) {
        var lim = -Infinity, pl = 0; ms.forEach(function (o) { var u = secondaire(o); if (u && G.planches(u)) { var z = zMaxMonde(o); if (z > lim) lim = z; pl++; } });
        if (!pl || !isFinite(lim)) return;
        A.limites["m" + G.m] = +lim.toFixed(4);
        ms.forEach(function (o) { var u = secondaire(o); if (!u || u.m !== G.m) return;
          try { var n = coupe(o, lim); if (n) { A.coupes++; A.sommets += n; } } catch (e) { A.erreur = "coupe " + (o.name || "") + " : " + String(e && e.message || e); } });
      });
    }
    var add0 = THREE.Object3D.prototype.add;
    THREE.Object3D.prototype.add = function () {
      var r = add0.apply(this, arguments);
      if (this && this.name === NOM) { for (var i = 0; i < arguments.length; i++) { try { traite(arguments[i]); } catch (e) { A.erreur = String(e && e.message || e); } } }
      return r;
    };
    THREE.Object3D.prototype.__a15 = true;
  } catch (e) { A.erreur = String(e && e.message || e); }
})();
