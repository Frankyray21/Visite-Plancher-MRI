// a05_table_e3_e4.js — table « phrase → plan » des blocs 12, 13, 14 (étape 3) et 15 (étape 4). Moteur : a04_moteur_plans.js.
// Instants = secondes de voix du bloc (phrases_mp3.json : une phrase commence à la fin d'un silence).
//  12 : « Étape trois : la structure de base en six par six, dans le sens contraire du forage. » (1,16 s) / « Les patins… » (5,71 s)
//  13 : « Pis en partant du point haut, on monte pas plus haut qu'il faut. » (0 s)
//  14 : « C'est ça : moins de blocage, moins de bois à forcer, moins de temps perdu. » (0 s)
//  15 : « un six par six à seize pieds du premier » (1,32 s) / « pour un cadrage de seize par seize bien droit » (3,99 s) /
//       « Les autres entre les deux, à trente-deux pouces centre » (6,87 s)
(function () {
  var VP = window.__videoPlans; if (!VP) return;

  // ---------- étape 3 ----------
  var PT_HAUT = "Point haut : le 6 × 6 repose sur le sol";
  VP.au("12", function () {   // repère « point haut » au bout du 1er madrier, visible seulement pendant les blocs 13 et 14
    var L = window.__etiquettesV19; if (!L || L.some(function (d) { return d.id === "vp_point_haut"; })) return;
    L.push({ id: "vp_point_haut", texte: PT_HAUT, pos: [0.35, 0.2, -2.36], genre: "note", etapes: [3], ecran: null,
      actif: function () { var m = VP.maintenant(); return !!m && (m.id === "13" || m.id === "14"); } });
  });
  // Étiquettes de l'étape 3 masquées (etq: []) : « 1er madrier sur la ligne de peinture » appartient à l'étape 4 (audit), et
  // « Sens du forage » : dans la scène la flèche (comme la foreuse de l'étape 18) est PARALLÈLE aux 6 × 6 (voir « reste »).
  VP.definir("12", [
    { t: 0, plan: "a_ensemble", cle: null, etq: [] },
    { t: 1.2, cle: "Structure de base en 6 × 6, sens contraire du forage" },
    { t: 5.5, cam: { tgt: [2.2, 0.1, -2.3], dir: [0.3, 0.5, 1], r: 0.9 }, cle: "Les patins de la foreuse vont croiser les madriers", etq: [] }
  ]);
  VP.definir("13", [
    { t: 0, cam: { tgt: [0.45, 0.1, -2.3], dir: [1, 0.3, 0.8], r: 0.8 }, cle: "En partant du point haut : pas plus haut qu'il faut", etq: [PT_HAUT] }
  ]);
  VP.definir("14", [
    { t: 0, cam: { tgt: [2.2, 0.1, -2.3], dir: [0.25, 0.3, 1], r: 1.8 }, cle: "Moins de blocage, moins de bois, moins de temps perdu", etq: [PT_HAUT] }
  ]);

  // ---------- étape 4 : les 6 × 6 intermédiaires n'apparaissent qu'au mot « Les autres » ----------
  function scene() {
    if (window.__sc) return window.__sc;
    try { var z = window.__inter71.zones, o = z && z[0] && z[0].o; while (o && o.parent) o = o.parent; return o || null; } catch (e) { return null; }
  }
  function intermediaires() {   // P04_s04_* sauf le plus loin du 1er madrier (z max = « à 16 pi du premier »), triés depuis le premier
    var sc = scene(), L = []; if (!sc) return L;
    sc.traverse(function (o) { if (/^P04_s04_/.test(o.name || "") && !(o.parent && /^P04_s04_/.test(o.parent.name || ""))) L.push(o); });
    var w = new (sc.position.constructor)(), zmax = -1e9, loin = null;
    L.forEach(function (o) { o.getWorldPosition(w); o.__vpz = w.z; if (w.z > zmax) { zmax = w.z; loin = o; } });
    return L.filter(function (o) { return o !== loin; }).sort(function (a, b) { return a.__vpz - b.__vpz; });
  }
  // Propriété « visible » interceptée (la pose animée de la page les remontre à chaque image pendant plusieurs secondes) :
  // cachés tant que le bloc 15 n'a pas atteint « Les autres » (6,87 s), puis apparition un par un (0,15 s d'écart).
  // Auto-réparant : hors bloc 15 (arrêt, autre bloc, navigation normale), la valeur réelle est rendue.
  var T_AUTRES = 6.87;
  VP.au("15", function () {
    intermediaires().forEach(function (o, k) {
      if (o.__vpVis) return; o.__vpVis = true; var v = o.visible;
      Object.defineProperty(o, "visible", { configurable: true, enumerable: true,
        get: function () { var m = VP.maintenant(); if (m && m.id === "15" && m.t < T_AUTRES + 0.15 * k) return false; return v; },
        set: function (x) { v = x; } });
    });
  });
  // (relecture) traits 3D des cotes, qu'etq ne cache pas : « Sens du forage » (Cote_v27_2, flèche le long de x, donc PARALLÈLE aux 6 × 6 :
  // elle contredisait la voix « sens contraire du forage » et passait en gros plan pendant le vol vers le bloc 13) et « 6 po » (Cote_v27_3)
  // cachés pendant les blocs 12 à 14 ; « ≈ 32 po c/c » (Cote_v27_6) caché au bloc 15 jusqu'à « Les autres ». Hors de ces blocs : valeur réelle.
  var REGLES_COTES = {
    Cote_v27_2: function (m) { return m.id === "12" || m.id === "13" || m.id === "14"; },
    Cote_v27_3: function (m) { return m.id === "12" || m.id === "13" || m.id === "14"; },
    Cote_v27_6: function (m) { return m.id === "15" && m.t < T_AUTRES; }
  };
  function cacheCotes() {
    var sc = scene(); if (!sc) return;
    Object.keys(REGLES_COTES).forEach(function (nom) {
      var o = sc.getObjectByName(nom); if (!o || o.__vpVis) return; o.__vpVis = true; var v = o.visible, regle = REGLES_COTES[nom];
      Object.defineProperty(o, "visible", { configurable: true, enumerable: true,
        get: function () { var m = VP.maintenant(); if (m && regle(m)) return false; return v; },
        set: function (x) { v = x; } });
    });
  }
  ["12", "13", "14", "15"].forEach(function (id) { VP.au(id, cacheCotes); VP.a(id, 0, cacheCotes); VP.a(id, 1, cacheCotes); });
  VP.definir("15", [
    { t: 0, plan: "a_ensemble", cle: null, etq: ["Madrier à 16 pi du premier", "16 pi"] },
    { t: 1.3, cle: "Un 6 × 6 à 16 pi du premier" },
    { t: 3.99, cam: { tgt: [2.44, 0, 0], dir: [0.12, 1, 0.08], r: 3.1 }, cle: "Cadrage de 16 × 16 pi bien droit", etq: ["16 pi"] },
    { t: 6.87, plan: "c_entraxe", cle: "Les 4 autres entre les deux, à 32 po centre", etq: ["≈ 32 po c/c"] }
  ]);
})();
