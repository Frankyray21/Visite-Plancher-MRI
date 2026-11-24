// a09_image_etiquettes_soustitres.js — vidéo narrée, audit A9 + A10 + A17 (image, étiquettes 3D, sous-titres). N'agit qu'en mode vidéo.
// A9  : la tache blanche floue au centre des plans (et la « boule » au sol près du front) = le spot très serré de la lampe frontale accrochée
//       à la caméra (window.__lum52.L52.FRONTALE_*, carto/habillage.md §6). En vidéo, le spot est élargi et adouci (FRONT ci-dessous) ; le reste
//       de l'éclairage (plafond, trépied, entrée, exposition) n'est pas touché. La pile de 3 × 8 et la planche de démonstration, au sol après le bout
//       du plancher, sont rangées le long de la paroi dès l'étape 12 (inter_pile_rangee : K.ETAPE 14 → 12 en vidéo).
// A10 : étiquettes 3D (#etq19, window.__etiquettesV19) : 2 au plus, texte ≥ 32 px en 1080p avec contour noir épais, jamais sous la carte d'étape,
//       le carton de partie, la clé jaune ou les sous-titres (obstacles du moteur + contrôle à l'image), jamais en double avec la clé jaune (même sens :
//       l'entrée est mise de côté par un champ « piece » introuvable, rendu tel quel ensuite), effacées pendant le changement d'étape (1,7 s).
//       Le filtre etq du moteur a04 (d.etapes / d.__vpEtapes) n'est pas touché.
// A17 : sous-titres incrustés si NV.SOUS_TITRES est vrai (apercu_bloc.js --sous-titres le met à vrai ; inter_sequence_v157 et filme_gpu le mettent à faux) :
//       phrase par phrase (phrases_mp3.json : textes et silences, calés sur la voix), découpées pour tenir sur 2 lignes, bas centre, largeur ≤ 60 %,
//       ≥ 40 px en 1080p, contour noir, sans bandeau ; Formateur en blanc, Apprenti en jaune pâle ; décalés à droite de la carte d'étape, jamais dessus.
//       L'ancien #sous-titre155 est masqué en vidéo.
// Réglages en direct : window.__a09 = { FRONT, ST, ETQ, journal }.
(function () {
  "use strict";
  var NV = window.__narrationV155, I = window.__inter71;
  if (!NV || !I || typeof I.anime !== "function") return;
  var DONNEES = /*DONNEES*/{"1":[5.54,[[3.35,3.78],[5.11,5.51]],["Aujourd'hui, on bâtit un plancher de foreuse au diamant sous terre : seize pieds par trente-deux."]],"2":[3.74,[[3.3,3.68]],["Le plancher complet, celui des trous de cinq cents mètres et plus ?"]],"3":[7.37,[[0.75,1.2],[5.42,5.81],[6.92,7.32]],["Exactement. On suit la procédure « Fabrication d’un plancher pour foreuse aux diamants sous terre », étape par étape."]],"4":[16.43,[[0.87,1.46],[5.52,6.24],[11.18,11.78],[16,16.39]],["Avant de commencer : on barricade l'entrée de la place de travail avec le ruban jaune, du côté où on arrive.","Le bois pis l'équipement restent derrière la barricade, en dehors de la place où on va bâtir le plancher.","La trousse de premiers soins, les deux lave-yeux pis l'extincteur sont au poste de secours."]],"5":[8.36,[[0.61,0.93],[5.68,6.05],[7.94,8.32]],["Pis le bois : du six par six brut, du trois par huit brut, du deux par quatre, des coins pis des tire-fonds de six pouces."]],"6":[4.99,[[1.26,1.74],[4.53,4.94]],["Une règle qui change pas : les grosses pièces de bois, on les transporte toujours à deux."]],"7":[1.62,[[0.7,1.08],[1.19,1.58]],["Pis les outils ?"]],"8":[11.78,[[1.83,2.47],[3.89,4.45],[7.39,7.98],[8.63,9.16],[11.35,11.75]],["Pied de biche, masse pis marteau.","La scie à main pis les pinces.","Le niveau au laser Bosch pis le niveau de quarante-huit pouces.","Le pingouin.","Pis la scie va-et-vient, avec ses lames à bois."]],"9":[8.33,[[3.02,3.55],[4.65,5.02],[5.29,5.76],[7.89,8.28]],["Le superviseur inspecte les lieux avant d'amener l'équipement : un sol sans débris, plat, pis les fonds de trous trouvés et marqués au front."]],"10":[11.28,[[0.62,1.14],[2.22,2.54],[5.51,6],[9.34,9.74],[10.86,11.25]],["Étape un : plan de forage en main, on place le plancher d'après la position prévue de la foreuse. On trace la ligne à la peinture, bien droite sur toute la longueur : seize par trente-deux."]],"11":[11.26,[[0.64,1.18],[4.65,5.12],[8.31,8.73],[10.85,11.23]],["Étape deux : avec le niveau au laser Bosch, on trouve le point le plus haut du sol. Le premier madrier va reposer directement là, sur le sol : ça va être le repère de niveau pour tout le reste."]],"12":[8.59,[[0.69,1.16],[5.12,5.71],[8.18,8.56]],["Étape trois : la structure de base en six par six, dans le sens contraire du forage. Les patins de la foreuse vont croiser les madriers."]],"13":[3.6,[[3.16,3.56]],["Pis en partant du point haut, on monte pas plus haut qu'il faut."]],"14":[4.49,[[0.53,0.84],[4.08,4.47]],["C'est ça : moins de blocage, moins de bois à forcer, moins de temps perdu."]],"15":[10.19,[[0.78,1.3],[3.68,3.99],[6.25,6.86],[9.76,10.14]],["Étape quatre : un six par six à seize pieds du premier, pour un cadrage de seize par seize bien droit. Les quatre autres entre les deux, à trente-deux pouces centre."]],"16":[16.17,[[0.79,1.27],[2.13,2.8],[6.4,6.71],[7.66,8.27],[9.28,9.63],[12.83,13.35],[15.51,16.12]],["Étape cinq : la mise de niveau. Un niveau de quarante-huit pouces sur un trois par huit d'au moins huit pieds, pour avoir de la portée.","Sous chaque madrier : des blocages dans le sens contraire, pis des coins de bois pour ajuster. Au moins six appuis par six par six."]],"17":[8.2,[[4.97,5.5],[7.76,8.15]],["Au bout de la première section, on met tout de suite le blocage qui va porter aussi les madriers de la deuxième. Les deux sections vont être parfaitement égales."]],"18":[10.42,[[0.85,1.36],[5.45,6.01],[8.92,9.27],[10,10.38]],["Étape six : on couvre avec du trois par huit brut, dans le sens contraire des six par six. La première planche est vissée avec des tire-fonds à chaque bout, pis on avance."]],"19":[1.91,[[0.92,1.86]],["On part de quel bord ?"]],"20":[7.05,[[2.72,3.24],[5.14,5.57],[6.64,7.02]],["Du bord où tu peux marcher sur ce qui est déjà couvert. On enjambe jamais les six par six : c'est là qu'on trébuche."]],"21":[12.75,[[0.76,1.28],[3.18,3.67],[7.8,8.17],[12.32,12.7]],["Étape sept : rendu à la moitié, on resserre. On visse la dernière planche, on enfonce des coins pour mettre les planches en tension, on visse la planche devant les coins, pis on retire les tire-fonds pour libérer les coins."]],"22":[2.74,[[2.3,2.7]],["Sinon, à la longue, ça ouvre."]],"23":[8.72,[[0.77,1.3],[3.14,3.66],[5.85,6.31],[8.07,8.68]],["Étape huit : on laisse environ deux planches libres au bout. Ça donne la place pour partir la deuxième section ; on les visse à la fin pour joindre les deux."]],"24":[11.05,[[0.75,1.26],[2.22,2.91],[5.97,6.51],[7.95,8.39],[9.09,9.41],[10.63,11.02]],["Étape neuf : la deuxième section. Le laser donne la hauteur à soutenir sous les six par six. Ici, le sol descend : il faut monter, environ quatorze pouces."]],"25":[10.24,[[0.82,1.31],[4.44,4.99],[6.09,6.39],[9.81,10.21]],["Étape dix : un madrier à seize pieds de la première section sert de guide. Quand la hauteur le permet, des six par six de seize pieds en dessous, dans le sens contraire."]],"26":[3.08,[[2.64,3.03]],["Ça fait une base stable pour poser les madriers dessus."]],"27":[6.03,[[0.88,1.34],[3.39,3.71],[5.6,5.99]],["Étape onze : les madriers à trente-deux pouces centre, à la même hauteur que la première section."]],"28":[2.12,[[1.68,2.07]],["Pis comment on joint les deux sections ?"]],"29":[11.52,[[4.69,5.28],[8.52,8.99],[11.09,11.47]],["Avec un bout de bois à l’intérieur, sous les planches, vissé dans les madriers des deux sections. Les madriers de la deuxième reposent sur le même blocage que la première : les deux sections sont parfaitement égales."]],"30":[2.72,[[2.27,2.68]],["Pis si on a juste des six par six de huit pieds ?"]],"31":[21.08,[[1.42,1.79],[4.03,4.53],[7.55,8.15],[12.62,13.18],[15.61,16.03],[17.46,17.96],[20.64,21.03]],["C’est correct, c’est courant. On en met deux bout à bout pour faire les seize pieds.","Le joint tombe toujours sur un blocage, jamais dans le vide.","Pis dans une section, les deux six par six de huit pieds doivent être parfaitement de niveau.","À la jonction, on double le six par six : un en dessous de chaque section. Comme ça, chaque bout de madrier est appuyé au complet."]],"32":[1.59,[[1.16,1.55]],["Pis dans la deuxième section ?"]],"33":[28.13,[[1.5,1.8],[2.78,3.49],[8.48,9.08],[14.91,15.33],[17.76,18.24],[23.36,23.87],[24.87,25.17],[27.72,28.11]],["Le joint tombe sur un soutien, placé juste en dessous.","Le long des madriers de rive, le bout de trois par six vissé dans les deux sections, comme d'habitude.","Aux joints des huit pieds, un bout de trois par six de vingt-quatre pouces, à cheval sur le joint, vissé des deux bords : seulement sur les madriers de rive pis celui du milieu.","Pis au serrage, à l'étape sept, la planche temporaire se visse juste dans ces trois madriers-là.","Le reste ne change pas : même cadrage, même trente-deux pouces centre."]],"34":[2.48,[[2.06,2.45]],["Parfait. On revient à notre plancher."]],"35":[17.21,[[3.37,3.96],[6.32,6.65],[9.82,10.33],[10.94,11.31],[13.84,14.21],[16.78,17.18]],["Les soutiens, toujours vis-à-vis le croisement des six par six.","Dans un creux comme celui-là, on monte une cage : des bouts de vingt-quatre à trente-six pouces, empilés croisés.","Pis attention : on empile jamais des morceaux de bois un par-dessus l'autre. C'est un blocage avec ses coins, ou une cage croisée."]],"36":[9.98,[[0.82,1.3],[2.25,2.81],[6.63,7.17],[9.55,9.94]],["Étape douze : la deuxième section. On la couvre du bout vers le centre, avec les trois par huit, sans serrer : comme ça, on marche dessus pour placer les planches."]],"37":[1.36,[[0.91,1.31]],["Pis rendu au centre ?"]],"38":[25.36,[[4.48,5.06],[7.44,8.1],[10.41,10.86],[18.04,18.55],[20.32,21.01],[24.94,25.32]],["On replace chaque planche, une par une, en repartant de la section un vers le bout : les deux planches de jonction en premier, bien collées.","Rendu à la moitié, on refait l'étape sept : on visse la planche suivante le temps du serrage, on enfonce les coins, on visse la planche devant les coins, pis on retire coins pis tire-fonds. Ensuite, on continue jusqu'au bout.","À la fin, on visse les planches du centre pis la planche du bout, à chaque bout."]],"39":[10.48,[[0.94,1.4],[2.37,2.92],[7.37,7.96],[10.06,10.44]],["Étape treize : rien ne dépasse. Les bouts de six par six pis de trois par huit sont coupés carrés, égal avec le bord. Un bout qui dépasse, on trébuche dessus."]],"40":[12.93,[[0.95,1.46],[3.79,4.22],[5,5.41],[11.25,11.67],[12.49,12.89]],["Étape quatorze : ici, le plancher dépasse douze pouces. Il faut des marches : seize pouces de profondeur, entre trente-six pis soixante pouces de large, douze pouces de haut au maximum. On vise neuf."]],"41":[2.17,[[1.74,2.13]],["Pis les marches, on les monte comment ?"]],"42":[13.37,[[0.87,1.47],[4.7,5.2],[7.67,8],[9.19,9.7],[12.66,13.33]],["De bas en haut. En bas, du trois par huit à plat sur le sol, de niveau. Au-dessus, un bout de six par six par appui : jamais de bois empilé. Pis le dessus en trois par huit, deux planches pour la marche."]],"43":[25.1,[[0.96,1.36],[6.16,6.79],[9.33,9.73],[10.83,11.14],[13.65,14.41],[14.9,15.33],[21.35,21.89],[24.67,25.07]],["Étape quinze : plus de douze pouces de haut pis un vide, des garde-corps selon l'article douze du RSST. La lisse du haut entre un mètre pis un mètre vingt, une lisse à mi-hauteur, pis un coup de pied en deux par quatre au ras du plancher.","Un truc : un deux par quatre de huit pieds coupé en deux, ça donne deux montants de quarante-huit pouces, à la bonne hauteur sans mesurer. Avec quatre deux par quatre, on fait une section de huit pieds."]],"44":[4.1,[[0.86,1.3],[3.65,4.06]],["Étape seize : plus d'une marche, des mains courantes des deux bords."]],"45":[11.78,[[1.03,1.51],[5.02,5.52],[7.47,8.01],[10.14,10.45],[11.37,11.75]],["Étape dix-sept : entre le bord du plancher pis le mur, il reste souvent une ouverture. Douze pouces ou moins, on laisse comme ça. Plus que douze pouces, on met un garde-corps, comme au bout du plancher."]],"46":[20.98,[[3.91,4.43],[5.03,5.49],[9.87,10.35],[11.02,11.57],[13.6,14.15],[20.54,20.93]],["Derrière la tête de forage, collé à la tour : le plancher secondaire. Le standard : au moins trente-deux par soixante-douze pouces, neuf pouces de haut, rien en porte-à-faux. Ça fait une marche.","Chaque planche est vissée à chaque bout. Pis les six par six sont à six pouces du bout des planches : rien dépasse, pis on prend le plancher par le bout sans se coincer les doigts."]],"47":[1.67,[[1.25,1.64]],["Pis s'il faut monter plus haut ?"]],"48":[32.37,[[0.71,1.23],[6.47,7.1],[9.31,9.92],[12.14,12.46],[13.31,13.76],[17.51,18.12],[19.53,20.03],[24.14,24.61],[26.02,26.6],[29.84,30.38],[31.95,32.34]],["Deux marches : en dessous, un plancher seize pouces plus long pis seize pouces plus large, le standard par-dessus. Pour une seule marche, on enlève celui du dessous.","Du côté des poulies, jamais de garde-corps : c'est une marche. Au bout sans marche, un garde-corps avec un coup de pied, fixé solidement.","La planche collée à la foreuse : une ou deux coupes autour de la tour, juste assez pour s'approcher à trois pouces ou moins. Le pied peut pas glisser en dessous.","À chaque changement d'angle, on ajuste les planches pis les garde-corps. Pis pas de bois plané sur les planchers."]],"49":[20.9,[[2.58,2.96],[4.68,5.33],[8.2,8.64],[9.44,10.09],[12.8,13.12],[14.79,15.38],[20.47,20.85]],["Au démantèlement, après le départ de la foreuse : on lave le plancher au boyau d'eau. Le plancher secondaire, on l'enlève en premier, tel quel : il va resservir.","Le principal, en commençant par les planches du fond, les tire-fonds enlevés à mesure.","Une fois toutes les planches pis tous les tire-fonds enlevés, on défait la structure en six par six."]],"50":[2.19,[[1.75,2.14]],["Pis s'il y a de la boue de forage en dessous ?"]],"51":[18.1,[[4.2,4.76],[9.32,9.99],[10.52,10.94],[12.97,13.49],[15.51,15.83],[17.67,18.07]],["On se place sur la partie la plus solide, on reste vigilant, les pieds solides. On commence au fond de la baie, pis on fait glisser les pièces de bois les unes sur les autres pour les sortir.","À la fin : clôture orange pis carte de ruban rouge. Trou non arpenté et non cimenté, la date, le nom du superviseur."]],"52":[13.45,[[0.7,1.22],[6.72,7.32],[8.46,8.8],[11.04,11.46],[12.14,12.45],[13.02,13.42]],["À retenir : le premier madrier au point le plus haut, six appuis minimum par six par six, enlignés aux croisements.","Plus de douze pouces : marches, garde-corps pis mains courantes. Pis le gros bois, toujours à deux."]],"53":[2.38,[[1.93,2.33]],["Compris. On est prêts à bâtir."]],"48a":[22.75,[[2.55,3.04],[4.67,5.17],[5.99,6.32],[7.39,7.96],[10.51,10.99],[11.4,11.71],[15.1,15.63],[19.14,19.63],[22.31,22.72]],["Le plancher secondaire suit l'angle de forage. En descendant, neuf pouces. À l'horizontale, pas de plancher secondaire. En montant jusqu'à douze degrés, neuf pouces ; plus haut, deux marches de neuf pouces, avec le garde-corps au bout sans marche.","Il se place derrière la tête de forage, là où on ajoute les tiges : les tiges restent entre la hanche pis le milieu du tronc."]]}/*FIN_DONNEES*/;
  var A = window.__a09 = {
    FRONT: { FRONTALE_ANGLE: 0.62, FRONTALE_PENOMBRE: 1, FRONTALE_CD: 9 },   // spot large et doux : plus de tache (valeurs d'origine gardées et remises hors vidéo)
    ST: { PX1080: 42, LARGEUR: 0.6, BAS: 0.066, ECART_CARTE: 20 },          // sous-titres
    ETQ: { PX1080: 32, MAX: 2, CACHE_CHANGEMENT_MS: 1700, SEUIL: 0.6 },       // étiquettes
    PILE_ETAPE: 12, journal: [], erreurs: []
  };
  var vus = {};
  function erreur(e, ou) { var m = ou + " : " + (e && e.message || e); A.erreurs.push(m); if (!vus[m]) { vus[m] = 1; try { console.warn("[a09] " + m); } catch (x) {} } }
  function enVideo() { return !!NV.actif && document.body.classList.contains("mode-video"); }

  // ---------------------------------------------------------------- styles (dans body : passent après les feuilles de la page)
  var OMBRE = (function () { var l = [], k, r = 0.085; for (k = 0; k < 16; k++) { var a = k * Math.PI / 8; l.push((r * Math.cos(a)).toFixed(3) + "em " + (r * Math.sin(a)).toFixed(3) + "em 0 #000"); }
    l.push("0 0 0.12em #000", "0 0.04em 0.2em rgba(0,0,0,.85)"); return l.join(","); })();
  var css = document.createElement("style"); css.id = "a09-style";
  css.textContent =
    "body.mode-video #sous-titre155{display:none!important}" +
    "#st-a09{position:fixed;left:0;bottom:0;z-index:9;display:none;box-sizing:border-box;padding:0;margin:0;text-align:center;pointer-events:none;" +
      "font:600 " + (A.ST.PX1080 / 10.8).toFixed(3) + "vh/1.2 var(--f-texte,system-ui),sans-serif;letter-spacing:.005em;color:#fff;text-shadow:" + OMBRE + ";text-wrap:balance}" +
    "#st-a09.T{color:#fff1a6}" +
    "#st-a09-mesure{position:fixed;left:-9999px;top:0;visibility:hidden;box-sizing:border-box;text-align:center;font:600 " + (A.ST.PX1080 / 10.8).toFixed(3) + "vh/1.2 var(--f-texte,system-ui),sans-serif;letter-spacing:.005em;text-wrap:balance}" +
    "body.mode-video #etq19 .e{font-size:max(15px," + (A.ETQ.PX1080 / 10.8).toFixed(3) + "vh)!important;line-height:1.15!important;max-width:34vw!important;text-shadow:" + OMBRE + "!important}" +
    "body.mode-video #etq19 .p{width:9px!important;height:9px!important;margin:-1px 0 0 -1px;box-shadow:0 0 0 2px #000,0 0 5px rgba(0,0,0,.9)!important}" +
    "body.mode-video #etq19 .l{height:3px!important;box-shadow:0 0 0 1.5px #000!important}" +
    "body.a09-etq-off #etq19{visibility:hidden!important}";
  document.body.appendChild(css);
  var ST = document.createElement("div"); ST.id = "st-a09"; ST.setAttribute("aria-hidden", "true"); ST.setAttribute("data-etiq-obstacle", "1"); document.body.appendChild(ST);
  var MES = document.createElement("div"); MES.id = "st-a09-mesure"; MES.setAttribute("aria-hidden", "true"); document.body.appendChild(MES);

  // ---------------------------------------------------------------- A9 : lampe frontale (spot élargi) et pile rangée dès l'étape 12
  var front0 = null, frontVideo = false;
  function frontale(v) { var Lm = window.__lum52, L = Lm && Lm.L52; if (!L) return;
    if (v && !frontVideo) { front0 = {}; for (var k in A.FRONT) front0[k] = L[k]; frontVideo = true; }
    if (v) { var chg = false; for (var k2 in A.FRONT) if (L[k2] !== A.FRONT[k2]) { L[k2] = A.FRONT[k2]; chg = true; }
      if (chg && typeof Lm.regle === "function") Lm.regle({}); }               // regle() réapplique angle et pénombre (aucun nuanceur recompilé)
    else if (!v && frontVideo) { for (var k3 in front0) L[k3] = front0[k3]; frontVideo = false; if (typeof Lm.regle === "function") Lm.regle({}); } }
  var pile0 = null;
  function pile(v) { var K = I.pileRangee; if (!K) return; if (pile0 === null) pile0 = K.ETAPE; K.ETAPE = v ? Math.min(pile0, A.PILE_ETAPE) : pile0; }

  // ---------------------------------------------------------------- A17 : sous-titres
  function nettoie(s) { return String(s || "").replace(/\[[^\]]*\]\s*/g, "").replace(/\s*…\s*/g, " ").replace(/\s+/g, " ").trim(); }
  function phrasesDe(b) { var x = DONNEES[b.id]; if (x && x[2] && x[2].length) return { d: x[0], sil: x[1] || [], ph: x[2] };
    var t = nettoie(b.s), ph = t.match(/[^.?!]+[.?!]*/g) || [t]; return { d: b.d || 5, sil: [], ph: ph.map(nettoie).filter(Boolean) }; }
  // temps de parole → temps réel, en sautant les silences internes
  function caleur(d, sil) { var s0 = 0, e0 = d, S = (sil || []).slice().sort(function (a, b) { return a[0] - b[0]; });
    if (S.length && S[0][0] < 0.08) s0 = S[0][1]; if (S.length && S[S.length - 1][1] >= d - 0.12) e0 = S[S.length - 1][0];
    var IN = S.filter(function (s) { return s[0] > s0 + 0.01 && s[1] < e0 - 0.01; }), parole = e0 - s0; IN.forEach(function (s) { parole -= s[1] - s[0]; });
    function reel(tp) { var t = s0, reste = tp; for (var i = 0; i < IN.length; i++) { var seg = IN[i][0] - t; if (reste <= seg) return t + reste; reste -= seg; t = IN[i][1]; } return t + reste; }
    return { s0: s0, e0: e0, IN: IN, parole: Math.max(0.1, parole), reel: reel }; }
  // bornes de n morceaux (longueurs en caractères) entre a et b ; une borne se pose sur le silence le plus proche (à moins de « prise » s)
  function bornes(longs, a, b, C, prise) { var tot = 0; longs.forEach(function (l) { tot += l; });
    var IN = C.IN.filter(function (s) { return s[0] > a && s[1] < b; }), tpA = 0, tpB = 0, t = C.s0, k;
    function versParole(tr) { var p = 0, u = C.s0; for (var i = 0; i < C.IN.length; i++) { var s = C.IN[i]; if (tr <= s[0]) return p + (tr - u); if (tr < s[1]) return p + (s[0] - u); p += s[0] - u; u = s[1]; } return p + (tr - u); }
    tpA = versParole(a); tpB = versParole(b); var res = [], cum = 0, pris = {}, prec = a;
    for (k = 0; k < longs.length - 1; k++) { cum += longs[k]; var est = C.reel(tpA + (tpB - tpA) * cum / tot), best = -1, bd = 1e9;
      IN.forEach(function (s, j) { if (pris[j] || s[0] <= prec) return; var dd = Math.abs((s[0] + s[1]) / 2 - est); if (dd < bd) { bd = dd; best = j; } });
      if (best >= 0 && bd <= prise) { pris[best] = 1; res.push([IN[best][0], IN[best][1]]); prec = IN[best][1]; } else { var e = Math.max(est, prec + 0.3); res.push([e, e]); prec = e; } }
    return res; }   // res[k] = [fin du morceau k, début du morceau k+1]
  var lh = 0, maxH = 0, largeurMes = 0;
  function mesure(w) { var fs = parseFloat(getComputedStyle(MES).fontSize) || 28; lh = fs * 1.2; maxH = lh * 2 + 2; if (largeurMes !== w) { MES.style.width = w + "px"; largeurMes = w; } }
  function tient(txt) { MES.textContent = txt; return MES.offsetHeight <= maxH; }
  function decoupe(ph) { if (tient(ph)) return [ph];
    var mots = ph.split(" "), out = [], cur = [];
    for (var i = 0; i < mots.length; i++) { var essai = cur.concat(mots[i]); if (!cur.length || tient(essai.join(" "))) { cur = essai; continue; }
      var j = -1; for (var q = cur.length - 1; q >= Math.ceil(cur.length * 0.45); q--) if (/[,;:]$/.test(cur[q])) { j = q; break; }
      if (j >= 0 && j < cur.length - 1) { out.push(cur.slice(0, j + 1).join(" ")); cur = cur.slice(j + 1).concat(mots[i]); } else { out.push(cur.join(" ")); cur = [mots[i]]; } }
    if (cur.length) out.push(cur.join(" "));
    // dernier morceau très court : on rééquilibre avec le précédent si les deux tiennent
    if (out.length > 1) { var der = out[out.length - 1].split(" "); if (der.length <= 3) { var av = out[out.length - 2].split(" ");
      for (var m = 0; m < 4 && av.length > 4; m++) { var mv = av.pop(); der.unshift(mv); if (!tient(der.join(" "))) { der.shift(); av.push(mv); break; } }
      out[out.length - 2] = av.join(" "); out[out.length - 1] = der.join(" "); } }
    return out; }
  function plan(b) { var P = phrasesDe(b), C = caleur(P.d, P.sil), ph = P.ph, L = [];
    var bp = bornes(ph.map(function (p) { return p.length; }), C.s0, C.e0, C, 1.2), deb = C.s0;
    ph.forEach(function (p, k) { var fin = k < bp.length ? bp[k][0] : C.e0, suiv = k < bp.length ? bp[k][1] : null, morceaux = decoupe(p);
      var bm = morceaux.length > 1 ? bornes(morceaux.map(function (m) { return m.length; }), deb, fin, C, 0.6) : [], d0 = deb;
      morceaux.forEach(function (m, j) { var f = j < bm.length ? bm[j][0] : fin; L.push({ a: d0, b: f, txt: m }); d0 = j < bm.length ? bm[j][1] : fin; });
      deb = suiv !== null ? suiv : fin; });
    // un morceau reste affiché jusqu'au suivant si l'écart est court ; sinon 0,35 s après la fin de sa parole
    for (var i = 0; i < L.length; i++) { var n = L[i + 1]; L[i].z = n && n.a - L[i].b < 0.9 ? n.a : L[i].b + 0.35; }
    return L; }
  var SS = { id: null, i: -1, nj: -1, t0: 0, liste: null, cle: null, k: -1, largeur: 0 };
  function cibleCle(b) { return b && b.c ? (b.c.etape !== undefined ? "e" + b.c.etape : "") + "|" + (b.c.ecran || "") : ""; }
  function rect(el) { if (!el) return null; var s = getComputedStyle(el); if (s.display === "none" || s.visibility === "hidden" || +s.opacity < 0.05) return null; var r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 ? r : null; }
  function seq(sel) { var r = document.getElementById("seq157"); if (!r || !r.classList.contains("vu")) return null; var e = r.querySelector(sel); return e && !e.classList.contains("cache") ? rect(e) : null; }
  function sousTitres(now) {
    var B = document.body; if (!NV.SOUS_TITRES || !enVideo() || B.classList.contains("a08-fiche") || B.classList.contains("a08-fin")) {   // fiche « À retenir » et écran final (a08) : le texte est déjà à l'écran
      if (ST.style.display !== "none") ST.style.display = "none"; return; }
    var b = NV.BLOCS[NV.i]; if (!b) { ST.style.display = "none"; return; }
    var W = innerWidth, H = innerHeight, w = Math.round(Math.min(W - 32, W * A.ST.LARGEUR)), gauche = (W - w) / 2, carte = seq(".carte"), chap = seq(".chap");
    if (carte && gauche < carte.right + A.ST.ECART_CARTE) { gauche = carte.right + A.ST.ECART_CARTE; if (gauche + w > W - 16) w = Math.round(W - 16 - gauche); }   // relecture : largeur finale avant la mesure (sinon 3 lignes à côté d'une carte large)
    var nj = NV.journal ? NV.journal.length : 0, neuf = SS.i !== NV.i || SS.nj !== nj;
    if (neuf || SS.largeur !== w) { if (neuf) { SS.nj = nj; var prec = NV.BLOCS[NV.i - 1]; SS.t0 = now + (SS.i < 0 || !prec || cibleCle(prec) !== cibleCle(b) ? 1200 : 0); }
      SS.i = NV.i; SS.id = b.id; SS.largeur = w; mesure(w); SS.liste = plan(b); SS.k = -1; A.journal.push({ id: b.id, morceaux: SS.liste.map(function (m) { return [+m.a.toFixed(2), +m.z.toFixed(2), m.txt]; }) }); if (A.journal.length > 80) A.journal.shift(); }
    var t = (now - SS.t0) / 1000, k = -1; for (var j = 0; j < SS.liste.length; j++) if (t >= SS.liste[j].a - 0.05 && t < SS.liste[j].z) { k = j; break; }
    if (k < 0) { if (ST.style.display !== "none") ST.style.display = "none"; SS.k = -1; return; }
    if (k !== SS.k) { SS.k = k; ST.textContent = SS.liste[k].txt; ST.className = b.o === "T" ? "T" : ""; }
    // place : bas centre ; décalé à droite de la carte d'étape si elle est là ; au-dessus du carton de partie s'il descend jusque-là
    var bas = Math.round(H * A.ST.BAS);
    ST.style.width = w + "px"; ST.style.left = Math.round(gauche) + "px"; ST.style.bottom = bas + "px"; ST.style.display = "block";
    var r = ST.getBoundingClientRect();
    if (chap && r.top < chap.bottom + 8 && r.bottom > chap.top) { ST.style.display = "none"; return; }   // jamais sur le carton de partie (rare)
    var cle = rect(document.getElementById("cle156")); if (cle && r.top < cle.bottom + 8 && r.bottom > cle.top) ST.style.display = "none";
  }

  // ---------------------------------------------------------------- A10 : étiquettes 3D
  var MOTS_VIDES = { le: 1, la: 1, les: 1, l: 1, de: 1, des: 1, du: 1, d: 1, un: 1, une: 1, et: 1, a: 1, au: 1, aux: 1, en: 1, sur: 1, sous: 1, par: 1, pour: 1, avec: 1, pis: 1, ou: 1, on: 1, il: 1, faut: 1, est: 1, c: 1, ce: 1, se: 1, sa: 1, son: 1, ses: 1, qui: 1, que: 1, ne: 1, rien: 1, tout: 1, po: 1, pi: 1, m: 1, x: 1, plus: 0 };
  var SYN = { min: "moins", minimum: "moins", max: "plus", maximum: "plus", madriers: "madrier", appui: "appuis", planches: "planche", marches: "marche", bouts: "bout", coupes: "coupe", coupe: "coupe", coins: "coin", blocages: "blocage", "1er": "premier" };
  function jetons(s) { var t = String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[×*]/g, " x ").replace(/[^a-z0-9]+/g, " ").trim().split(" "), o = {};
    t.forEach(function (w) { if (!w) return; w = SYN[w] || w; if (MOTS_VIDES[w] === 1) return; if (w.length > 4 && /s$/.test(w)) w = w.slice(0, -1); o[w] = 1; }); return Object.keys(o); }
  function memeSens(a, b) { var A1 = jetons(a), B1 = jetons(b); if (!A1.length || !B1.length) return false; var n = 0; A1.forEach(function (w) { if (B1.indexOf(w) >= 0) n++; });
    if (A1.join(" ") === B1.join(" ")) return true;
    if (A1.some(function (w) { return /^\d+$/.test(w) && B1.indexOf(w) < 0; })) return false;   /* relecture : « 3 × 6 de 24 po » ≠ « 6 × 6 de 8 pi », « section 2 » ≠ « section 1 » */
    var mots = 0; A1.forEach(function (w) { if (B1.indexOf(w) >= 0 && !/^\d+$/.test(w)) mots++; });
    return n >= 2 && mots >= 1 && n / A1.length >= A.ETQ.SEUIL; }
  A.memeSens = memeSens;
  var SENT = ["__a09_double_cle__"], mis = [];   // entrées mises de côté (piece introuvable)
  function metDeCote(d) { if (d.__a09 !== undefined) return; d.__a09 = Object.prototype.hasOwnProperty.call(d, "piece") ? { p: d.piece } : { aucun: true }; d.piece = SENT; mis.push(d); }
  function remet(d) { if (d.__a09 === undefined) return; if (d.piece === SENT) { if (d.__a09.aucun) delete d.piece; else d.piece = d.__a09.p; } delete d.__a09; }
  function remetTout() { mis.forEach(remet); mis.length = 0; }
  var E0 = null, cibleAv = null, cacheJusqua = 0, videoAv = false, carteMarquee = false, encoreCaches = false;
  function etiquettes(now, v) {
    var E = I.etiquettes, L = window.__etiquettesV19;
    if (E && v && !E0) { E0 = { MAX: E.MAX, MAX_ECRAN: E.MAX_ECRAN }; }
    if (E && v) { E.MAX = A.ETQ.MAX; E.MAX_ECRAN = A.ETQ.MAX; }
    else if (E && !v && E0) { E.MAX = E0.MAX; E.MAX_ECRAN = E0.MAX_ECRAN; E0 = null; }
    // carte d'étape, carton de partie et fil des parties : obstacles du moteur des étiquettes
    if (carteMarquee !== v) { var r0 = document.getElementById("seq157"); if (r0) { [].forEach.call(r0.children, function (c) { if (v) c.setAttribute("data-etiq-obstacle", "1"); else if (c.getAttribute("data-etiq-obstacle") === "1") c.removeAttribute("data-etiq-obstacle"); }); carteMarquee = v; } }
    if (!v) { if (mis.length) remetTout(); document.body.classList.remove("a09-etq-off");
      if (encoreCaches) { encoreCaches = false; var c0 = document.getElementById("etq19"); if (c0) [].forEach.call(c0.querySelectorAll(".e"), function (e) { if (e.__a09v) montreE(e, true); }); }
      return; }
    encoreCaches = true;
    // changement d'étape ou d'écran : on efface le temps du vol de caméra
    var b = NV.BLOCS[NV.i], ck = cibleCle(b); if (ck !== cibleAv) { if (cibleAv !== null) cacheJusqua = now + A.ETQ.CACHE_CHANGEMENT_MS; cibleAv = ck; }
    document.body.classList.toggle("a09-etq-off", now < cacheJusqua);
    // doublon avec la clé jaune : même sens → mise de côté tant que la clé est là
    var c = document.getElementById("cle156"), txt = c && c.classList.contains("vu") ? (c.textContent || "").trim() : "";
    if (L && L.forEach) L.forEach(function (d) { if (!d || !d.texte) return; var dbl = !!txt && memeSens(d.texte, txt);
      if (dbl && d.__a09 === undefined) metDeCote(d); else if (!dbl && d.__a09 !== undefined) { remet(d); var i = mis.indexOf(d); if (i >= 0) mis.splice(i, 1); } });
    // contrôle à l'image (les obstacles du moteur sont relus toutes les 12 images) : rien sous la carte, le carton, la clé, les sous-titres ni hors écran
    var calque = document.getElementById("etq19"); if (!calque) return;
    var obs = [seq(".carte"), seq(".chap"), seq(".fil"), c && c.classList.contains("vu") ? rect(c) : null, ST.style.display !== "none" ? rect(ST) : null].filter(Boolean);
    var es = calque.querySelectorAll(".e"), W = innerWidth, H = innerHeight;
    for (var i = 0; i < es.length; i++) { var e = es[i]; if (e.style.display === "none") { if (e.__a09v) montreE(e, true); continue; }
      var r = e.getBoundingClientRect(), mauvais = r.left < 2 || r.top < 2 || r.right > W - 2 || r.bottom > H - 2;
      for (var j = 0; j < obs.length && !mauvais; j++) { var o = obs[j]; if (r.left < o.right + 4 && r.right > o.left - 4 && r.top < o.bottom + 4 && r.bottom > o.top - 4) mauvais = true; }
      montreE(e, !mauvais); }
  }
  function montreE(e, oui) { var p = e.previousSibling, l = p && p.previousSibling, v = oui ? "" : "hidden"; if (!oui) e.__a09v = 1; else delete e.__a09v;
    if (e.style.visibility !== v) e.style.visibility = v; if (p && p.className && /^p/.test(p.className) && p.style.visibility !== v) p.style.visibility = v; if (l && l.className && /^l/.test(l.className) && l.style.visibility !== v) l.style.visibility = v; }

  // ---------------------------------------------------------------- boucle
  var finA = 0;
  I.anime(function () {
    var now = performance.now(), v = enVideo();
    if (!v && NV.etat === "fini") { if (!finA) finA = now; if (now - finA < 4000) v = true; } else if (NV.etat !== "fini") finA = 0;   // 2 s de queue après la fin : même image
    try { frontale(v); } catch (e) { erreur(e, "frontale"); }
    try { pile(v); } catch (e) { erreur(e, "pile"); }
    try { etiquettes(now, v); } catch (e) { erreur(e, "étiquettes"); }
    try { sousTitres(now); } catch (e) { erreur(e, "sous-titres"); }
    if (v !== videoAv) { videoAv = v; if (!v) { SS.i = -1; cibleAv = null; } try { window.dispatchEvent(new Event("resize")); } catch (e) {} }   // remesure des étiquettes (taille changée)
  });
})();
