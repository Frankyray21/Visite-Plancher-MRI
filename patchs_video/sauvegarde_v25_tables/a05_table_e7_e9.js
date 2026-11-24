// Table phrase -> plan du groupe « e7_e9 » (blocs 21, 22 = étape 7 ; 23 = étape 8 ; 24 = étape 9).
// t = secondes de voix du bloc (fins de silences de phrases_mp3.json). Une caméra qui change décale la clé de 0,8 s (moteur a04) :
// les plans avec caméra sont donc posés 0,8 s avant le début de la phrase qu'ils illustrent.
(function () {
  "use strict";
  var VP = window.__videoPlans; if (!VP) return;
  function LO() { return window.__laserOutilsV19 || null; }
  function camk() { return window.__dbg && window.__dbg.camk || null; }

  // ---------------- Étape 7 : resserrer (blocs 21-22) ----------------
  // L'animation du serrage (inter_laser_outils_v19, K.COINS.t, ms depuis l'arrivée à l'étape 7) dure 11 s et devançait la voix
  // de 4 à 6 s. On la recale sur les mots : temps module ≈ temps de voix + 1,2 s (délai de début de bloc).
  //   « On visse la dernière planche » 3,67 s ; « on enfonce des coins … en tension » ≈ 5,2 s ;
  //   « on visse la planche devant les coins » 8,17 s ; « pis on retire les tire-fonds » ≈ 9,9 s ; « pour libérer les coins » ≈ 11,2 s.
  var T7 = { ancre: [0, 500], visA: [5000, 6000], coins: [6400, 6900], serre: [7000, 9000], visT: [9400, 9900], devisse: [11100, 11700],
    sortie: [12300, 12800], retour: [12700, 13400], suite: 13600, fleche: [7000, 9400], fin: 15000 };
  var sauve7 = null;
  function recale7() { try { var K = LO(); if (!K || !K.COINS || !K.CAM7) return; if (!sauve7) sauve7 = { t: K.COINS.t, cam: K.CAM7.t };
    K.COINS.t = T7; K.CAM7.t = [1e9, 1e9]; } catch (e) {} }   // caméras propres du module coupées : la table cadre elle-même
  function remet7() { try { var K = LO(); if (!K || !sauve7) return; K.COINS.t = sauve7.t; K.CAM7.t = sauve7.cam; sauve7 = null; } catch (e) {} }

  // Bout +z de la dernière planche (rang 11, x ≈ 2,1) : tire-fonds de la dernière planche, coin au droit du madrier z 2,36,
  // tire-fonds de la planche devant les coins (rang 10).
  // Joints serrés de la section 1, loin des étiquettes au passé du module (z ≈ 1,6) : image de la réplique « ça ouvre ».
  var CAM_JOINTS = { tgt: [1.6, 0.25, -1.4], dir: [-0.4, 1.1, -0.2], r: 1.0 };
  var CAM_BOUT = { tgt: [2.15, 0.25, 1.95], dir: [0.55, 0.9, -0.7], r: 0.75 };

  VP.au("21", recale7);
  // Bloc 21 : « Étape sept : rendu à la moitié, on resserre. » (0-3,21 ; « rendu » à 1,27)
  //           « On visse la dernière planche, on enfonce des coins pour mettre les planches en tension, » (3,67-7,81)
  //           « on visse la planche devant les coins, pis on retire les tire-fonds pour libérer les coins. » (8,17-12,34)
  VP.definir("21", [
    { t: 0, plan: "a", cle: "Rendu à la moitié : on resserre" },   // t 0 (clé à 0,8) : sinon la règle des 3 s retarde la clé suivante à 4,27 et le plan a ne dure que 2,4 s
    { t: 2.87, cam: CAM_BOUT, cle: "Visser la dernière planche, enfoncer des coins" },
    { t: 8.17, cle: "Visser la planche devant, retirer les tire-fonds" },
    { t: 12.4, cam: CAM_JOINTS, cle: null, etq: [] }                    // fin de phrase, avant la réplique de l apprenti
  ]);
  // Bloc 22 (apprenti) : « Sinon, à la longue, ça ouvre. » (0-2,34)
  VP.definir("22", [
    { t: 0, cle: "Sinon, à la longue, ça ouvre" }
  ]);

  // ---------------- Étape 8 : deux planches libres (bloc 23) ----------------
  // « Étape huit : on laisse environ deux planches libres au bout. » (0-3,17 ; « on laisse » à 1,3)
  // « Ça donne la place pour partir la deuxième section ; » (3,65-5,85) « on les visse à la fin pour joindre les deux. » (6,3-8,1)
  VP.au("23", remet7);
  VP.definir("23", [
    // t 0,55 (et non 1,3) : avec 1,3 la règle des 3 s repoussait les clés b et c à 4,3 et 7,3 (1 s après « on les visse »)
    { t: 0.55, cle: "Laisser environ 2 planches libres au bout", etq: ["2 planches laissées libres, à la jonction", "≈ 2 planches (16 po)"] },   // cote couchée à plat : a03_textes_cotes.js
    { t: 2.85, plan: "b", cle: "Ça donne la place pour partir la section 2", etq: ["≈ 2 planches (16 po)"] },
    { t: 5.85, plan: "c", cle: "On les visse à la fin pour joindre les deux", etq: ["≈ 2 planches (16 po)"] }
  ]);

  // ---------------- Étape 9 : section 2, hauteur au laser (bloc 24) ----------------
  // « Étape neuf : la deuxième section. » (0-2,28) — la carte de partie couvre l'image : pas de clé.
  // « Le laser donne la hauteur à soutenir sous les six par six. » (2,92-5,97) « Ici, le sol descend : il faut monter. » (6,46-9,08)
  function laserGros() { try { var K = LO(); if (K && K.L && K.L.appareil) K.L.appareil.scale.setScalar(3.3); var C = camk(); if (C) C.VG_DIST_MIN = 0.6; } catch (e) {} }
  function distNormale() { try { var C = camk(); if (C) C.VG_DIST_MIN = 1.6; } catch (e) {} }
  function laserNormal() { try { var K = LO(); if (K && K.L && K.L.appareil) K.L.appareil.scale.setScalar(1); } catch (e) {} distNormale(); }
  VP.au("24", function () { remet7(); laserNormal(); });
  VP.definir("24", [
    { t: 2.02, action: laserGros },
    // A15 : faisceau rouge à la hauteur du dessous des 6 × 6 et cote « ≈ 14 po à soutenir » (a12_objets_scene.js) ; vue de côté puis de trois quarts
    { t: 2.12, cam: { tgt: [6.85, -0.12, 2.1], dir: [-0.1, 0.22, -1], r: 1.35 }, cle: "Le laser donne la hauteur sous les 6 × 6", etq: ["Niveau au laser Bosch", "≈ 14 po à soutenir"] },
    { t: 5.6, action: distNormale },
    { t: 5.66, cam: { tgt: [7.1, -0.2, 1.8], dir: [0.75, 0.38, -0.7], r: 1.5 }, cle: "Ici, le sol descend : il faut monter", etq: ["≈ 14 po à soutenir"] },
    { t: 9.3, action: laserNormal }
  ]);
})();
