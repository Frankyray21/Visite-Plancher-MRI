// a05_table_secondaire.js — table « phrase → plan » du groupe « secondaire » (blocs 46, 47, 47a, 48, 48a).
// Instants = secondes de voix du bloc (fin des silences de C:/IA/video/phrases_mp3.json). Moteur : a04_moteur_plans.js.
(function () {
  var VP = window.__videoPlans; if (!VP) return;
  var AUCUNE = [];                                    // étiquettes 3D : aucune (« Planche côté tour » attend le bloc 48)
  // étiquettes du plancher secondaire rallumées en vidéo par a03_textes_cotes.js (A13) : textes exacts, espaces insécables
  var NB = " ", VIS = "Tire-fonds de 6" + NB + "po", COTE6 = "6" + NB + "po";
  var TAILLE = "Planche côté tour : une ou deux coupes autour de la tour, pour s’approcher à 3 po ou moins sans que le pied glisse dessous";

  // ---------- étape 18 : blocs 46, 47, 47a (un seul groupe de caméra) ----------
  // 46 : P1 0 « Derrière la tête… plancher secondaire » · P2 4,43 « Le standard : 32 × 72, 9 po, rien en porte-à-faux » · P3 10,33 « Ça fait une marche »
  //      P4 11,56 « Chaque planche est vissée à chaque bout » · P5 14,15 « les 6 × 6 à 6 po du bout des planches… »
  VP.definir("46", [
    { t: -1.2, cam: { tgt: [1.0, 1.3, -0.6], dir: [1, 0.45, 0.4], r: 1.5 }, cle: "Plancher secondaire derrière la tête de forage", etq: AUCUNE },   // a16 : avatar debout sur le plancher (x 0,87), tige et plancher dans le cadre
    { t: 4.43, cle: "Au moins 32 × 72 po · 9 po de haut · rien en porte-à-faux" },
    { t: 11.1, plan: "b", cle: "Chaque planche vissée à chaque bout", etq: [VIS] },
    { t: 14.15, cam: { tgt: [2.3, 0.36, 0.36], dir: [0.3, 0.55, 1], r: 0.8 }, cle: "6 × 6 à 6 po du bout des planches : rien ne dépasse", etq: [COTE6] }
  ]);
  // 47 : question de l'apprenti (1,7 s) : pas de clé, pas de nouveau plan
  VP.definir("47", [{ t: 0, cle: null }]);
  // 47a : la porte de la cage, de face, depuis l'enceinte
  VP.definir("47a", [
    { t: 0, cam: { tgt: [5.0, 1.1, 0.3], dir: [-1, 0.3, 0.15], r: 1.5 }, cle: "Porte de la cage : jamais fermée avec quelqu'un dedans", etq: AUCUNE }
  ]);

  // ---------- écran avoir18 : bloc 48 (vignette pilotée phrase par phrase) ----------
  function tape() {   // plan suivant de la vignette (touche courte simulée)
    var z = document.querySelector("#avoir18-vignette .avoir18-zone"); if (!z) throw new Error("vignette avoir18 absente");
    var o = { clientX: 10, clientY: 10, pointerId: 1, bubbles: true };
    z.dispatchEvent(new PointerEvent("pointerdown", o)); z.dispatchEvent(new PointerEvent("pointerup", o));
  }
  VP.au("48", function () { var A = window.__avoir18; if (A) A.PLAN = 10000; });   // vignette figée sur un plan : on avance à la voix
  VP.definir("48", [
    { t: 0, plan: "a", cle: "Deux marches : dessous, 16 po plus long et plus large", etq: AUCUNE },
    { t: 7.0, cle: "Une seule marche : on enlève celui du dessous" },
    { t: 9.92, action: tape },
    { t: 10.0, cle: "Côté poulies : jamais de garde-corps, c'est une marche" },
    { t: 13.76, cle: "Bout sans marche : garde-corps et coup de pied" },
    { t: 18.12, action: tape, plan: "c", cle: "Planche collée à la foreuse : 1 ou 2 coupes, 3 po max", etq: [TAILLE] },
    { t: 26.6, action: tape, plan: "a", cle: "Changement d'angle : on ajuste planches et garde-corps", etq: AUCUNE },
    { t: 30.38, cle: "Pas de bois plané sur les planchers" }
  ]);

  // ---------- écran angle147 : bloc 48a (angle réglé à la voix) ----------
  function angle(a) { return function () { var I = window.__inter71, G = I && I.angleStm;
    if (!(G && G.ouvert && G.etat === "pret")) throw new Error("angle147 pas prêt pour " + a + "°");
    G.regle(a); var r = document.getElementById("a147r"); if (r) r.value = a; }; }
  VP.au("48a", function () { var A = window.__avoir18; if (A) A.PLAN = 7.5; });
  VP.definir("48a", [
    { t: -0.2, etq: AUCUNE, cle: "Le plancher secondaire suit l'angle de forage" },
    { t: 2.8, action: angle(-30), cle: "En descendant : 9 po" },
    { t: 5.25, action: angle(0) },
    { t: 5.8, cle: "À l'horizontale : pas de plancher secondaire" },
    { t: 7.86, action: angle(10) },
    { t: 8.8, cle: "En montant jusqu'à 12° : 9 po" },
    { t: 10.97, action: angle(19) },
    { t: 11.8, cle: "Plus haut : 2 marches, garde-corps au bout sans marche" },
    { t: 15.82, cam: { tgt: [1.8, 1.5, -0.55], dir: [1, 0.4, 0.4], r: 1.6 } /* a16 : avatar entier sur le plancher de deux marches */, etq: AUCUNE, cle: "Derrière la tête de forage, là où on ajoute les tiges" },
    { t: 19.73, cle: "Tiges entre la hanche et le milieu du tronc" }
  ]);
})();
