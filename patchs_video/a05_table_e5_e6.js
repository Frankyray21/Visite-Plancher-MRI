// Table phrase -> plan du groupe « e5_e6 » (blocs 16, 17 = étape 5 ; 18, 19, 20 = étape 6).
// t = secondes de voix du bloc (fins de silences de phrases_mp3.json). Une caméra qui change décale la clé de 0,8 s (moteur a04) :
// les plans avec caméra sont posés 0,8 s avant la phrase qu'ils illustrent, pour que la clé tombe sur le premier mot.
(function () {
  "use strict";
  var VP = window.__videoPlans; if (!VP) return;
  function camk() { return window.__dbg && window.__dbg.camk || null; }
  function distMin(v) { try { var C = camk(); if (C) C.VG_DIST_MIN = v; } catch (e) {} }

  // ---------------- planches de l'étape 6 cachées par couches (carto/scene.md §3-§4) ----------------
  // userData.ord : 0 = 1re planche (x 4,27, côté section 2) ... 21 = planche du front (x 0). On cache par couche 26 (jamais .visible,
  // que la pose de la page réécrit). Restitution au bloc 21 (étape 7, qui fait sa propre moitié) et aux blocs 16-17.
  var BIT = 1 << 26, SAUVE = new Map(), PL = null;
  function scene() { if (window.__sc) return window.__sc; var I = window.__inter71, z = I && I.zones && I.zones[0], o = z && z.o;
    while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }
  function planches() { if (PL && PL.length) return PL; var sc = scene(); if (!sc) return [];
    var L = []; sc.traverse(function (o) { if (o.userData && typeof o.userData.ord === "number" && /_s06_/.test(o.name || "")) L.push(o); });
    L.sort(function (a, b) { return a.userData.ord - b.userData.ord; }); PL = L; return L; }
  function cache(o) { o.traverse(function (q) { if (q.isLight || q.isCamera) return; if (q.layers.mask !== BIT) { if (!SAUVE.has(q)) SAUVE.set(q, q.layers.mask); q.layers.mask = BIT; } }); }
  function rend(o) { o.traverse(function (q) { if (!SAUVE.has(q)) return; q.layers.mask = SAUVE.get(q); SAUVE.delete(q); }); }
  // ne laisser que les planches de rang <= n (n < 0 : toutes rendues)
  function jusqua(n) { try { planches().forEach(function (o) { if (n >= 0 && o.userData.ord > n) cache(o); else rend(o); }); } catch (e) {} }
  function toutes() { jusqua(-1); }
  var MOITIE = 10;                                  // rangs 0 à 10 posés (x 2,2 à 4,47), rangs 11 à 21 : 6 × 6 nus

  // ---------------- Étape 5 : mise de niveau (blocs 16-17) ----------------
  // Bloc 16 : « Étape cinq : la mise de niveau. » (0-2,15)
  //           « Un niveau de quarante-huit pouces sur un trois par huit d'au moins huit pieds, pour avoir de la portée. » (2,8-7,66)
  //           « Sous chaque madrier : des blocages dans le sens contraire, pis des coins de bois pour ajuster. » (8,26-12,84)
  //           « Au moins six appuis par six par six. » (13,35-15,53)
  var CAM_BLOCAGE = { tgt: [3.36, -0.08, 0.79], dir: [0.75, 0.45, 0.8], r: 0.55 };   // un 6 × 6, son blocage en travers et ses coins, au ras du sol
  var CAM_APPUIS = { tgt: [2.4, -0.05, 0.79], dir: [0.22, 0.6, 1], r: 2.6 };          // le long d'un madrier : ses appuis
  var CAM_EGALES = { tgt: [4.6, -0.1, 0], dir: [1, 1.15, 0.3], r: 3.0 };             // section 1 et la place de la section 2
  VP.au("16", function () { toutes(); distMin(1.6); });
  VP.definir("16", [
    { t: 0, etq: [] },                                                            // ouverture d'étape (carte en bas) : pas de clé
    { t: 2.0, plan: "b_niveau", cle: "Niveau de 48 po sur un 3 × 8 d'au moins 8 pi", etq: ["Niveau 48 po", "3 × 8 de 8 pi min."] },
    { t: 7.4, action: function () { distMin(1.0); } },
    { t: 7.46, cam: CAM_BLOCAGE, cle: "Blocages en sens contraire, coins pour ajuster", etq: [] },
    { t: 12.55, cam: CAM_APPUIS, cle: "Au moins 6 appuis par 6 × 6", etq: ["6 appuis min. par madrier"], action: function () { distMin(1.6); } }
  ]);
  // Bloc 17 : « Au bout de la première section, on met tout de suite le blocage qui va porter aussi les madriers de la deuxième. » (0-5,02)
  //           « Les deux sections vont être parfaitement égales. » (5,49-7,78)
  VP.au("17", function () { toutes(); distMin(1.6); });
  VP.definir("17", [
    { t: 0, plan: "d_jonction", cle: "Blocage de jonction : porte aussi la section 2", etq: ["Blocage de jonction"] },
    { t: 4.69, cam: CAM_EGALES, cle: "Les 2 sections : parfaitement égales", etq: [] }
  ]);

  // ---------------- Étape 6 : couvrir en 3 × 8 (blocs 18-20) ----------------
  // Bloc 18 : « Étape six : on couvre avec du trois par huit brut, dans le sens contraire des six par six. » (0-5,48)
  //           « La première planche est vissée avec des tire-fonds à chaque bout, » (6,01-8,92) « pis on avance. » (9,27-10,01)
  // La pose de la page met la 1re planche et ses tire-fonds, puis toutes les autres en ≈ 6 s : on n'en laisse que 4, puis on « avance »
  // jusqu'à la moitié (rangs 0-10) sur « pis on avance », et cet état reste pour la question et la réponse (blocs 19-20).
  var CAM6_SENS = { tgt: [3.7, 0.12, 0.3], dir: [-1, 0.7, 0.45], r: 1.7 };          // depuis le front : 6 × 6 nus devant, 3 × 8 en travers derrière
  var CAM6_MOITIE = { tgt: [2.4, 0.12, 0], dir: [1, 1, 0.35], r: 2.5 };             // couvert / non couvert
  var CAM20_COUVERT = { tgt: [2.7, 0.25, 0.6], dir: [1, 0.55, 0.25], r: 1.4 };      // depuis le bord couvert vers le front
  var CAM6_TIREFOND = { tgt: [4.37, 0.25, -2.3], dir: [0.6, 1, 0.5], r: 0.3 };       // tête du tire-fond, bout -z de la 1re planche
  var CAM20_ENJAMBE = { tgt: [1.75, 0.05, 0.5], dir: [0.5, 0.8, 0.6], r: 0.9 };     // la limite : 6 × 6 nus à enjamber
  VP.au("18", function () { jusqua(3); distMin(1.6); });
  var REVELE = [];
  for (var k = 4; k <= MOITIE; k++) (function (n) { REVELE.push({ t: 9.27 + (n - 4) * 0.28, action: function () { jusqua(n); } }); })(k);
  VP.definir("18", [
    { t: -0.8, cam: CAM6_SENS, cle: "3 × 8 brut, dans le sens contraire des 6 × 6", etq: [] },
    { t: 5.15, action: function () { distMin(0.6); } },
    { t: 5.21, cam: CAM6_TIREFOND, cle: "1re planche : un tire-fond à chaque bout", etq: [] },
    { t: 8.47, cam: CAM6_MOITIE, cle: "Puis on avance", etq: [], action: function () { distMin(1.6); } }
  ].concat(REVELE));
  // Bloc 19 (apprenti) : « On part de quel bord ? » (0-0,97). La clé « Puis on avance » reste ; caméra posée après la question.
  VP.au("19", function () { jusqua(MOITIE); });
  VP.definir("19", [
    { t: 0, etq: [] },                                                            // lancé seul : pas d étiquettes de l étape avant le plan
    { t: 1.1, cam: CAM20_COUVERT, cle: undefined, etq: ["Avancer sur la surface couverte"] }
  ]);
  // Bloc 20 : « Du bord où tu peux marcher sur ce qui est déjà couvert. » (0-2,73)
  //           « On enjambe jamais les six par six : c'est là qu'on trébuche. » (3,24-6,66)
  VP.au("20", function () { jusqua(MOITIE); });
  VP.definir("20", [
    { t: 0, cle: "Marcher sur ce qui est déjà couvert", etq: ["Avancer sur la surface couverte"] },
    { t: 2.44, cam: CAM20_ENJAMBE, cle: "On n'enjambe jamais les 6 × 6 : on trébuche", etq: [] }
  ]);
  // Étape 7 : elle fait sa propre moitié (rangs 12-21 cachés 8,8 s) : on rend tout au début du bloc 21.
  VP.au("21", function () { toutes(); });
})();
