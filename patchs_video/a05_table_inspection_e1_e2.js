// a05_table_inspection_e1_e2.js — table « phrase → plan » des blocs 9, 10, 11 (inspection, étape 1, étape 2).
// Instants = secondes de voix du bloc (fin des silences de phrases_mp3.json). Une clé à la fois, ≥ 3 s, texte de la voix.
(function () {
  var VP = window.__videoPlans; if (!VP) return;
  function err(e, ou) { try { VP.erreurs.push({ ou: "a05_inspection " + ou, message: String(e && e.message || e), t: performance.now() }); console.error("[videoPlans] a05_inspection " + ou + " : " + (e && e.message || e)); } catch (x) {} }

  // ---------------- Bloc 9 (8,5 s) ----------------
  // « Le superviseur inspecte les lieux avant d'amener l'équipement (0–3,1) : un sol sans débris, plat (3,55–4,7),
  //   pis les fonds de trous trouvés et marqués sur le mur (5,0–8,1). »
  // Sol et fonds à 1,45 s d'écart : un seul plan qui montre le sol ET le mur du front, une seule clé (règle des 3 s).
  // La barricade n'est pas dite : retirée. Étiquettes 3D masquées (elles doublaient la clé).
  VP.definir("9", [
    { t: 0, plan: "front", cle: "Le superviseur inspecte les lieux avant l'équipement", etq: [] },
    { t: 3.55, cam: { tgt: [1.0, 0.6, -0.3], dir: [1, 0.45, 0.1], r: 2.0 },
      cle: "Sol sans débris, plat · fonds de trous marqués au front", etq: [] }
  ]);

  // ---------------- Bloc 10 (11,3 s) ----------------
  // « Étape un (0–0,6) : plan de forage en main (1,1–2,2), on place le plancher d'après la position prévue de la foreuse (2,5–5,5).
  //   On trace la ligne à la peinture, bien droite sur toute la longueur (6,0–9,4) : seize par trente-deux (9,7–10,9). »
  // Le module laser (inter_laser_outils_v19) joue sa propre suite à l'étape 1 : caméras CAM1 (bombe dès 1,8 s de voix, retour à
  // la vue d'étape à 7,1 s) et peinture de 3 à 8 s d'étape. On coupe ses caméras (K.cams.perdu) et on retient son horloge
  // (L.t0) pour que la peinture parte à 6,0 s, sur « on trace la ligne à la peinture ».
  var tient = { actif: false, pret: false };
  function retientLaser() {
    if (tient.pret) return; tient.pret = true;
    window.__inter71.anime(function () {
      if (!tient.actif) return;
      try {
        var m = VP.maintenant(), K = window.__laserOutilsV19, L = K && K.L;
        if (!m || m.id !== "10" || !L) { tient.actif = false; return; }
        if (m.t >= 5.2) { tient.actif = false; return; }      // relâché : t d'étape 2,2 s à 5,2 s → peinture (3,0 s) à 6,0 s de voix
        if (L.t0) L.t0 = performance.now() - 2200;            // laser posé, ligne laser tracée, peinture pas commencée
      } catch (e) { tient.actif = false; err(e, "retient laser"); }
    });
  }
  VP.a("10", 0, function () {
    try { var K = window.__laserOutilsV19; if (K && K.cams) K.cams.perdu = true; } catch (e) { err(e, "caméras laser"); }
    try { retientLaser(); tient.actif = true; } catch (e) { err(e, "retient laser"); }
  });
  VP.definir("10", [
    { t: 0, plan: "cote16", cle: null, etq: ["16 pi", "32 pi"] },
    { t: 1.14, cle: "Plan de forage en main : plancher placé selon la foreuse" },
    { t: 5.6, plan: "ligne", cle: "On trace la ligne à la peinture, bien droite", etq: ["16 pi", "32 pi", "Ligne de référence en peinture"] },
    { t: 9.73, cle: "16 × 32 pi" }
  ]);

  // ---------------- Bloc 11 (11,0 s) ----------------
  // « Étape deux (0–0,65) : avec le niveau au laser Bosch, on trouve le point le plus haut du sol (1,26–4,8).
  //   Le premier madrier repose directement là, sur le sol (5,3–8,3) : c'est le repère de niveau pour tout le reste (8,7–10,5). »
  // Laser cadré serré : distance mini de CAMK baissée le temps du plan (recette carto/camera.md § 8.3), remise à 1,6 m ensuite.
  function distMin(v) { try { var C = window.__dbg && window.__dbg.camk; if (C && typeof C.VG_DIST_MIN === "number") C.VG_DIST_MIN = v; } catch (e) { err(e, "distance mini"); } }
  VP.au("11", function () { distMin(0.45); });
  VP.a("11", 5.05, function () { distMin(1.6); });
  VP.definir("11", [
    { t: 0, cam: { tgt: [0.25, 0.0, -1.84], dir: [0.7, 0.6, 1], r: 0.15 }, cle: null, etq: ["Niveau au laser Bosch"] },
    { t: 1.18, cle: "Niveau au laser Bosch : trouver le point le plus haut" },
    { t: 5.12, plan: "pointhaut", cle: "Le premier madrier va reposer directement là, sur le sol" },
    { t: 8.73, cle: "Ça va être le repère de niveau pour tout le reste" }
  ]);
})();
