// a05_table_e10_e11.js : table phrase -> plan des blocs 25, 26 (étape 10), 27, 28, 29 et 35 (étape 11).
// Instants = secondes de voix du bloc (fins de silences de phrases_mp3.json). Ne fait que des appels VP.definir / VP.a / VP.au.
(function () {
  var VP = window.__videoPlans; if (!VP) return;
  function I() { return window.__inter71 || {}; }
  // textes des étiquettes 3D à garder : toutes sauf celles qui répondent à re (espaces insécables ramenés à des espaces pour le test)
  function sauf(re) { return (window.__etiquettesV19 || []).filter(function (d) { return d && d.texte && !re.test(String(d.texte).replace(/ /g, " ")); }).map(function (d) { return d.texte; }); }

  // ---------- étape 10 : madrier guide (bloc 25), soutiens 6 x 6 (bloc 25), base stable (bloc 26)
  // 25 : « Étape dix : » 0-0,83 | « un madrier à seize pieds de la première section sert de guide. » 1,31 | « Quand la hauteur le permet, des six par six ... dans le sens contraire. » 4,99
  VP.definir("25", [
    { t: 0, plan: "a", cle: null, etq: sauf(/Hauteur à soutenir|Soutiens 6/) },
    { t: 1.3, cle: "Madrier guide à 16 pi de la section 1" },
    { t: 6.2, plan: "c", cle: "6 × 6 de 16 pi en dessous, en sens contraire" }
  ]);
  // 26 : « Ça fait une base stable pour poser les madriers dessus. » 0
  VP.definir("26", [
    { t: 0, plan: "d", cle: "Une base stable pour poser les madriers" }
  ]);

  // ---------- étape 11 : blocs 27, 28, 29 (un seul groupe)
  // 27 : « Étape onze : » 0-0,9 | « les madriers à trente-deux pouces centre, à la même hauteur que la première section. » 1,34
  VP.definir("27", [
    { t: 0, cam: { tgt: [5.6, 0.05, 0.6], dir: [1, 0.35, 0.3], r: 2.2 }, cle: null, etq: sauf(/Soutiens enlignés|jonction|Tire-fond|Cage|Couche|Coin/) },
    { t: 1.34, cle: "Madriers à 32 po centre, même hauteur que la section 1" }
  ]);
  // Au début de la voix du bloc 27 : l'animation du bois de jonction (variante8) est décalée pour tomber sur la réponse (bloc 29) et ne
  // déplace plus la caméra ; le montage animé de la cage (cage11) est coupé ici : la cage est dite au bloc 35.
  VP.a("27", 0, function () {
    var V = window.__variante8, JN = V && V.jonction;
    if (JN && JN.actif) { JN.cams = { approche: true, zoom: true, recul: true, retour: true }; JN.t0 = performance.now() + 4500; }
    var C = I().cage11; if (C && C.ETAPE === 11) { C.__vpEtape = 11; C.ETAPE = 99; }
  });
  // 28 : « Pis comment on joint les deux sections ? » 0
  VP.definir("28", [
    { t: 0, plan: "b", cle: null, etq: sauf(/Soutiens enlignés|jonction|Tire-fond|Cage|Couche|Coin/) }
  ]);
  // 29 : « Avec un bout de bois à l'intérieur, sous les planches, vissé dans les madriers des deux sections. » 0
  //      « Les madriers de la deuxième reposent sur le même blocage que la première : » 5,28 | « les deux sections sont parfaitement égales. » 8,98
  VP.definir("29", [
    { t: 0.3, cam: { tgt: [4.877, 0.09, 2.22], dir: [-0.12, 0.45, -0.88], r: 1.2 }, cle: "Bout de bois à l'intérieur, vissé aux 2 sections",
      etq: sauf(/Soutiens enlignés|Cage|Couche|Coin|prolongement|sous les planches/) },
    { t: 5.28, cam: { tgt: [4.9, -0.05, 0.0], dir: [1, 0.3, 0.35], r: 1.0 }, cle: "Même blocage sous les 2 sections : parfaitement égales",
      etq: sauf(/Soutiens enlignés|Cage|Couche|Coin|prolongement|sous les planches|Tire-fond|Bois de jonction/) }
  ]);
  VP.a("29", 10.5, function () { var C = I().cage11; if (C && C.__vpEtape) { C.ETAPE = C.__vpEtape; delete C.__vpEtape; } });

  // ---------- étape 11 au retour de l'écran variante 8 pi : bloc 35
  // « Les soutiens, toujours vis-à-vis le croisement des six par six. » 0 | « Dans un creux comme celui-là, on monte une cage : » 3,96
  // « des bouts de vingt-quatre à trente-six pouces, empilés croisés. » 6,65 | « Pis attention : on empile jamais des morceaux de bois un par-dessus l'autre. » 10,33
  // « C'est un blocage avec ses coins, ou une cage croisée. » 14,21
  VP.au("35", function () { var C = I().cage11; if (C && C.__vpEtape) { C.ETAPE = C.__vpEtape; delete C.__vpEtape; } });
  VP.a("35", 0, function () {
    try { var V = window.__variante8; if (V && V.finJonction) V.finJonction(); } catch (e) {}
    try { var C = I().cage11; if (C && C.fin) C.fin(); } catch (e) {}
  });
  VP.definir("35", [
    { t: 0, cam: { tgt: [7.277, -0.2, 0.787], dir: [0.6, 0.8, 0.5], r: 1.4 }, cle: "Soutiens vis-à-vis le croisement des 6 × 6",
      etq: sauf(/Cage|Couche|Coin|jonction|Tire-fond|Madrier section|prolongement|planches/) },
    { t: 3.96, plan: "c", cle: "Dans un creux : cage, bouts de 24 à 36 po croisés" },
    { t: 10.5, plan: "d", cle: "On empile jamais le bois un par-dessus l'autre" },
    { t: 14.21, cle: "Un blocage avec ses coins, ou une cage croisée" }
  ]);
})();
