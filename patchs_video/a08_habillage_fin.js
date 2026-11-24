// a08_habillage_fin.js — habillage de fin de la vidéo narrée (audit A11, A18, A20).
//  A11 : blocs 52-53 (écran « retenir ») : fiche « À retenir » plein écran, 4 lignes = mots de la voix du bloc 52, chaque ligne cochée
//        quand la voix la dit (instants = secondes de voix, phrases_mp3.json) ; fiche tenue pendant le bloc 53 et pendant la queue après la fin
//        de la narration (toutes les lignes cochées), puis retirée.
//        2026-11-24 (demande de l'utilisateur) : PLUS D'ÉCRAN FINAL (procédure, question d'échange, crédits) : ni pendant un bloc « fin_ecran »
//        (a06 n'en ajoute plus), ni à 2,4 s du bloc 53, ni pendant la queue. La vidéo finit sur la fiche « À retenir ».
//  A18 : bandeau de crédits #credits-mouvement (CMU, Bandai Namco CC BY-NC, Kimodo : attribution exigée par la licence des mouvements)
//        masqué pendant la vidéo SAUF pendant le carton de la partie 1 (pseudo-bloc « carton_1 » de a06) : il y paraît tel que la page le
//        dessine (petit, en bas à droite), simplement remonté au-dessus du carton (z-index 61 > 60 de #carton06).
//  A20 : carte d'étape « Inspection des lieux » (étape 0, bloc 9) : points de progression faits bien visibles (pleins, clairs),
//        à venir creux, en cours jaune — avant, les points faits étaient presque noirs et seul le 3e point paraissait allumé.
// N'agit qu'en mode vidéo (classe à soi body.a08-video posée quand NV.actif + body.mode-video, gardée pendant la queue « fini »).
(function () {
  try {
    var NV = window.__narrationV155, I = window.__inter71;
    if (!NV || !I || typeof I.anime !== "function") return;
    var B = document.body;
    // ---- textes ----
    var LIGNES = [
      { t: 1.3, txt: "1<sup>er</sup> madrier au point le plus haut" },
      { t: 3.4, txt: "6 appuis minimum par 6 × 6, enlignés aux croisements" },
      { t: 7.4, txt: "Plus de 12 po : marches, garde-corps et mains courantes" },
      { t: 11.6, txt: "Le gros bois : toujours à deux" }
    ];
    var QUEUE_MAX = 10000;   // ms : la fiche « À retenir » se retire seule après la fin de la narration (visite normale)

    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
    function credits() {
      try { var c = document.getElementById("credits-mouvement"), s = "";
        if (!c) return "";
        c.childNodes.forEach(function (n) { if (n.nodeType === 1 && n.id === "credits-ouvrir") return; s += n.textContent; });
        s = s.replace(/\s+/g, " ").replace(/[\s·]+$/, "").trim();
        return s; } catch (e) { return ""; }
    }

    // ---- CSS (dans BODY : passe après les feuilles de la page) ----
    var st = document.createElement("style");
    st.textContent =
      // A18 : crédits masqués en vidéo, sauf pendant le carton de la partie 1 (au-dessus du carton #carton06, z 60)
      "body.a08-video:not(.a08-carton1) #credits-mouvement{display:none!important}" +
      "body.a08-video.a08-carton1 #credits-mouvement{z-index:61!important}" +
      // A20 : points de progression de la carte d'étape
      "body.mode-video #seq157 .pas u.point{background:transparent;border:2px solid rgba(255,255,255,.55)}" +
      "body.mode-video #seq157 .pas u.point.fait{background:#d5dbe0;border-color:#d5dbe0}" +
      "body.mode-video #seq157 .pas u.point.ici{background:#f4c01e;border-color:#f4c01e;box-shadow:0 0 0 3px rgba(244,192,30,.28)}" +
      // A11 : fiche et écran final
      "#a08-fiche,#a08-fin{position:fixed;inset:0;display:none;pointer-events:none;box-sizing:border-box;color:#fff;" +
      "font-family:var(--f-texte,system-ui),sans-serif;text-shadow:0 0 3px #000,0 0 3px #000,0 2px 4px #000}" +
      "#a08-fiche{z-index:7;background:rgba(10,12,14,.93);padding:calc(44px + 5vh) 7vw 6vh;flex-direction:column;justify-content:center}" +
      "#a08-fin{z-index:40;background:#0c0e10;padding:6vh 6vw;flex-direction:column;justify-content:center;align-items:center;text-align:center}" +
      "body.a08-fiche #a08-fiche,body.a08-fin #a08-fin{display:flex}" +
      // queue après la fin de la narration (body.mode-video retiré, l'interface de la page revient) : fiche opaque, rien ne transparaît
      "body.a08-video:not(.mode-video) #a08-fiche{background:#0c0e10}" +
      "body.a08-fiche #seq157 .carte,body.a08-fiche #seq157 .chap,body.a08-fiche #cle156,body.a08-fin #cle156{display:none!important}" +
      "#a08-fiche h2{margin:0 0 4.5vh;font:700 clamp(48px,6vw,76px)/1 var(--f-titre,system-ui),sans-serif;letter-spacing:.03em;text-transform:uppercase;color:#f4c01e}" +
      "#a08-fiche ol{list-style:none;margin:0;padding:0;display:grid;gap:3.2vh}" +
      "#a08-fiche li{display:flex;align-items:center;gap:26px;font:600 clamp(40px,3.5vw,50px)/1.12 var(--f-texte,system-ui),sans-serif;color:rgba(255,255,255,.62);transition:color .3s}" +
      "#a08-fiche li i{flex:none;position:relative;display:inline-block;width:52px;height:52px;box-sizing:border-box;border:4px solid rgba(255,255,255,.6);border-radius:8px;transition:background .3s,border-color .3s}" +
      "#a08-fiche li.ok{color:#fff}#a08-fiche li.ok i{background:#f4c01e;border-color:#f4c01e}" +
      "#a08-fiche li.ok i::after{content:'';position:absolute;left:14px;top:4px;width:14px;height:26px;border:solid #14171a;border-width:0 6px 6px 0;transform:rotate(42deg)}" +
      "#a08-fiche sup{font-size:.55em;vertical-align:.7em}" +
      "#a08-fin .proc{margin:0;font:700 clamp(54px,6.4vw,84px)/1 var(--f-titre,system-ui),sans-serif;letter-spacing:.05em;color:#f4c01e}" +
      "#a08-fin .titre{margin:2vh 0 0;font:600 clamp(40px,3.2vw,46px)/1.15 var(--f-titre,system-ui),sans-serif;letter-spacing:.02em;text-transform:uppercase;max-width:1100px}" +
      "#a08-fin .q{margin:7vh 0 0;padding:3vh 0 0;border-top:5px solid #f4c01e;max-width:1150px;font:700 clamp(46px,4.6vw,64px)/1.12 var(--f-texte,system-ui),sans-serif}" +
      "#a08-fin .q small{display:block;margin-bottom:1.6vh;font:600 clamp(40px,3vw,42px)/1 var(--f-titre,system-ui),sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#f4c01e}" +
      "#a08-fin .cr{margin:7vh 0 0;max-width:1180px;font:500 clamp(20px,1.75vw,26px)/1.35 var(--f-texte,system-ui),sans-serif;color:#e4e9ed}";
    B.appendChild(st);

    // ---- DOM ----
    var fiche = document.createElement("div"); fiche.id = "a08-fiche"; fiche.setAttribute("aria-hidden", "true"); fiche.setAttribute("data-etiq-obstacle", "1");
    fiche.innerHTML = "<h2>À retenir</h2><ol>" + LIGNES.map(function (l) { return "<li><i></i><span>" + l.txt + "</span></li>"; }).join("") + "</ol>";
    var fin = document.createElement("div"); fin.id = "a08-fin"; fin.setAttribute("aria-hidden", "true");
    function remplitFin() {
      fin.innerHTML = '<p class="proc">PRO-DD-ST-003</p><p class="titre">Fabrication d\'un plancher pour foreuse aux diamants sous terre</p>' +
        '<p class="q"><small>À discuter en équipe</small>Qu\'est-ce qui dépasse ou se fait enjamber sur ton plancher&nbsp;?</p>' +
        '<p class="cr">' + esc(credits()) + "</p>";
    }
    remplitFin();
    B.appendChild(fiche); B.appendChild(fin);
    var items = fiche.querySelectorAll("li");

    // ---- état par image ----
    var finDepuis = 0, aFin = false, aFiche = false;
    function classe(c, v) { if (B.classList.contains(c) !== !!v) B.classList.toggle(c, !!v); }
    function coche(n) { for (var k = 0; k < items.length; k++) { var ok = k < n; if (items[k].classList.contains("ok") !== ok) items[k].classList.toggle("ok", ok); } }
    function tVoix(id) { try { var VP = window.__videoPlans, m = VP && VP.maintenant(); if (m && m.id === id) return m.t; } catch (e) {} return null; }

    I.anime(function () {
      try {
        var video = !!NV.actif && B.classList.contains("mode-video");
        if (video) { classe("a08-video", true); finDepuis = 0; }
        else if (B.classList.contains("a08-video")) {
          classe("a08-carton1", false);
          // fin naturelle : la queue garde la fiche « À retenir » (toutes cochées, PAS d'écran final) puis tout se retire ; arrêt manuel : retrait immédiat
          if (NV.etat === "fini" && aFiche) {
            coche(LIGNES.length); classe("a08-fin", false);
            if (!finDepuis) finDepuis = performance.now(); if (performance.now() - finDepuis < QUEUE_MAX) return; }
          classe("a08-video", false); classe("a08-fiche", false); classe("a08-fin", false); aFin = aFiche = false; finDepuis = 0; return;
        } else return;
        var b = NV.BLOCS[NV.i], id = b ? String(b.id) : "";
        classe("a08-carton1", id === "carton_1");   // A18 : crédits visibles sur le carton de la partie 1 seulement
        var ficheVue = id === "52" || id === "53";   // 2026-11-24 : plus d'écran final (ni « fin_ecran », ni 2,4 s du bloc 53)
        if (id === "52") { var t = tVoix("52"), n = 0; if (t !== null) LIGNES.forEach(function (l) { if (t >= l.t) n++; }); coche(n); }
        else if (id === "53") coche(LIGNES.length);
        else coche(0);
        aFiche = ficheVue; aFin = false;
        classe("a08-fiche", aFiche); classe("a08-fin", aFin);
      } catch (e) {}
    });
  } catch (e) {}
})();
