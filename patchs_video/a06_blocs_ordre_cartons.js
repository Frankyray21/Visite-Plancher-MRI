// a06_blocs_ordre_cartons.js — ordre des blocs, ouverture, cartons de partie (audit A6, A7, A8 ; contrat A11).
// SEUL patch qui modifie NV.BLOCS (au chargement, avant NV.joue ; modifié EN PLACE, mêmes objets de bloc).
//  A7 (refait le 2026-11-24, demandes de l'utilisateur) : ordre 46 → 47 → 48a. RETIRÉS de la liste : le bloc 47a (porte de la cage jamais
//       fermée avec quelqu'un dedans) et le bloc 48 (31 s sur la vignette de l'écran « avoir18 », visuels simplifiés refusés). Le bloc 47
//       (« Pis s'il faut monter plus haut ? », auquel répond 48a) garde sa cible d'origine { etape: 18 } : plus aucun bloc ne vise « avoir18 »
//       en vidéo. Les entrées 47a / 48 de a05_table_secondaire.js et a15_vignette_6x6.js restent, sans effet puisque ces blocs ne jouent plus ;
//       le rendu plein écran d'avoir18 (§ 6) reste en place, inerte tant que l'écran n'est pas ouvert.
//  A8 : avant le 1er bloc de chaque partie (K.GROUPES de __sequenceV157 : 1, 10, 24, 40, 46, 49, 52), pseudo-bloc muet
//       { id: "carton_<n>", d: 2.5, s: "" } : carton de partie SEUL sur fond noir, retiré avant la voix ; le carton d'origine (#seq157 .chap)
//       ne s'affiche plus ; la carte d'étape est opaque et visible dès son apparition.
//       Cible du carton = celle du bloc suivant (scène prête sous le carton) ; pour les parties qui s'ouvrent sur un écran (49, 52) :
//       l'étape de l'écran (18), pour que le 1er bloc de la partie reste « nouveau » (a05_table_fin s'en sert).
//  A11 : plus de pseudo-bloc final « fin_ecran » (écran final retiré le 2026-11-24 : la vidéo finit sur la fiche « À retenir » du bloc 53) ;
//       le nom reste dans PSEUDO et dans le court-circuit du fetch, sans effet.
//  A6 : blocs 1-3 sur le plancher FINI (étape 18), opérateur caché, orbite lente sur toute la voix 1-3 ; fondu au noir vers le bloc 4
//       (écran Matériel, étape 0) ; bloc 9 à l'étape 0 sans la pile de démonstration ni la planche de démo dans le cadre.
// Pseudo-blocs : NV.AUDIO = null pendant eux (crochet NV.journal.push, avant la lecture de NV.AUDIO dans demarre) ; leur mp3 n'est
// jamais demandé au réseau (fetch court-circuité pour ces seuls noms). Hors mode vidéo : rien ne change à l'écran.
(function () {
  "use strict";
  var NV = window.__narrationV155, I = window.__inter71, VP = window.__videoPlans, SEQ = window.__sequenceV157;
  if (!NV || !NV.BLOCS || !NV.journal || !I || typeof I.anime !== "function") return;
  if (NV.__a06) return; NV.__a06 = true;
  var vus = {};
  function err(e, ou) { var m = "[a06] " + ou + " : " + (e && e.message || e); if (vus[m]) return; vus[m] = 1;
    try { if (VP && VP.erreurs) VP.erreurs.push({ ou: "a06 " + ou, message: String(e && e.message || e), t: performance.now() }); } catch (x) {}
    try { console.warn(m); } catch (x) {} }
  var PSEUDO = /^(carton_\d+|fin_ecran|fin_cine)$/;   // fin_cine (2026-11-24) : prise de vue cinématique de la place de travail complète à la fin
  var DUREE_CARTON = 1.0, FADE = 350;  // 1,0 s de silence + 1,2 s de changement de cible + 0,3 s = 2,5 s de carton
  var AUDIO0 = NV.AUDIO;
  function enVideo() { return !!NV.actif && document.body.classList.contains("mode-video"); }
  function copie(c) { return JSON.parse(JSON.stringify(c || {})); }
  function ecran(id) { try { return (window.__ecransV19.liste || []).filter(function (s) { return s.id === id; })[0] || null; } catch (e) { return null; } }

  // ================================================================ 1. NV.BLOCS
  var GROUPE_DE = {};          // id de bloc → index de partie (copie de OU de __sequenceV157, figé au chargement)
  var PREMIERS = [];           // [{ g, id }] premier bloc de chaque partie
  try {
    if (SEQ && SEQ.GROUPES) SEQ.GROUPES.forEach(function (G, g) { G.items.forEach(function (it) { it.blocs.forEach(function (id) { GROUPE_DE[id] = g; }); });
      var p = G.items[0] && G.items[0].blocs[0]; if (p) PREMIERS.push({ g: g, id: p }); });
    if (!PREMIERS.length) ["1", "10", "24", "40", "46", "49", "52"].forEach(function (id, g) { PREMIERS.push({ g: g, id: id }); });
  } catch (e) { err(e, "parties"); }

  var DUREE_CINE = 16;   // s : travelling lent d'entrée vers la foreuse, fondu au noir sur les 1,8 dernières secondes
  var L = NV.BLOCS.slice();
  function idx(id) { for (var k = 0; k < L.length; k++) if (L[k].id === id) return k; return -1; }
  try {
    // A6 : ouverture sur le plancher fini
    ["1", "2", "3"].forEach(function (id) { var k = idx(id); if (k >= 0) L[k].c = { etape: 18 }; });
    // A7 : 46 → 47 → 48a ; 47a et 48 retirés (2026-11-24) ; 47 garde sa cible d'origine (étape 18)
    ["47a", "48"].forEach(function (id) { var k = idx(id); if (k >= 0) L.splice(k, 1); });
    // A8 : cartons
    PREMIERS.forEach(function (P) { var k = idx(P.id); if (k < 0) return; var b = L[k], c;
      if (b.c.etape !== undefined) c = copie(b.c);
      else { var s = ecran(b.c.ecran); c = { etape: s && s.apres !== undefined ? s.apres : 18 }; }
      L.splice(k, 0, { id: "carton_" + (P.g + 1), o: "F", c: c, d: DUREE_CARTON, s: "", carton: P.g }); });
    // A11 : plus d'écran final (2026-11-24) : aucun pseudo-bloc « fin_ecran » ajouté
    // 2026-11-24 soir (utilisateur) : la vidéo se termine par une prise de vue cinématique de la place de travail complète (étape 18, sans l'opérateur)
    L.push({ id: "fin_cine", o: "F", c: { etape: 18 }, d: DUREE_CINE, s: "" });
    NV.BLOCS.length = 0; L.forEach(function (b) { NV.BLOCS.push(b); });
  } catch (e) { err(e, "liste des blocs"); }
  function bloc(id) { for (var k = 0; k < NV.BLOCS.length; k++) if (NV.BLOCS[k].id === id) return NV.BLOCS[k]; return null; }

  // ---- mp3 des pseudo-blocs : jamais demandés (le préchargement des voix lit toute la liste) ----
  try { var f0 = window.fetch; if (typeof f0 === "function") window.fetch = function (u) {
      try { var s = typeof u === "string" ? u : (u && u.url) || ""; if (/bloc_(carton_\d+|fin_ecran|fin_cine)\.mp3/.test(s)) return Promise.resolve(new Response(new Blob([], { type: "audio/mpeg" }), { status: 200 })); } catch (e) {}
      return f0.apply(this, arguments); }; } catch (e) { err(e, "fetch"); }

  // ================================================================ 2. tables du moteur pour les pseudo-blocs et l'ouverture
  try {
    if (VP && VP.table) {
      NV.BLOCS.forEach(function (b, k) { if (!/^carton_/.test(b.id)) return;
        var suiv = NV.BLOCS[k + 1], T = suiv && VP.table[suiv.id], p0 = T && T.filter(function (p) { return p.cam || p.plan; })[0];
        var memeCible = suiv && suiv.c.etape === b.c.etape && suiv.c.ecran === b.c.ecran;
        if (p0 && memeCible && (+p0.t || 0) <= 0.5) VP.definir(b.id, [{ t: 0, cam: p0.cam || undefined, plan: p0.plan || undefined, cle: null, etq: [] }]);
        else VP.definir(b.id, [{ t: 0, cle: null, etq: [] }]); });
    }
    if (VP && VP.table) VP.definir("fin_cine", [{ t: 0, cle: null, etq: [] }]);
  } catch (e) { err(e, "tables des cartons"); }

  // ================================================================ 3. DOM : carton, fondu, CSS de #seq157
  var CSS = document.createElement("style");
  CSS.textContent =
    "#carton06,#fondu06{position:fixed;inset:0;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .35s,visibility 0s linear .35s}" +
    "#carton06{z-index:60;background:#0c0e10;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--f-texte,system-ui),sans-serif}" +
    "#fondu06{z-index:59;background:#000}" +
    "body.mode-video #carton06.vu,body.mode-video #fondu06.vu{opacity:1;visibility:visible;transition:none}" +
    "body.mode-video #fondu06.vu.lent{transition:opacity .35s}" +
    "body.a06-cine #seq157,body.a06-cine #cle156,body.a06-cine #parties159,body.a06-cine #a08-fiche,body.a06-cine #ouv19{display:none!important}" +
    "body.a06-cine #fondu06{transition:opacity 1.4s,visibility 0s linear 1.4s}" +
    "body.a06-cine #fondu06.vu{opacity:1;visibility:visible;transition:opacity 1.8s}" +
    "body.a06-cine-noir #fondu06{opacity:1!important;visibility:visible!important;transition:none!important}" +
    "#carton06 p{margin:0}#carton06 .boite{max-width:min(980px,calc(100vw - 48px));box-sizing:border-box;padding:clamp(18px,2.4vw,30px) clamp(22px,3.2vw,44px) clamp(22px,2.6vw,34px);border-top:6px solid #f4c01e}" +
    "#carton06 .titre0{font:600 clamp(15px,1.4vw,19px)/1.25 var(--f-titre,system-ui),sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#d5dbe0;margin-bottom:clamp(14px,1.8vw,24px)}" +
    "#carton06 .tete{display:flex;align-items:center;gap:clamp(14px,1.7vw,22px)}" +
    "#carton06 .no{flex:none;display:flex;align-items:center;justify-content:center;width:clamp(54px,5.6vw,76px);height:clamp(54px,5.6vw,76px);border-radius:50%;background:#f4c01e;color:#14171a;font:700 clamp(32px,3.5vw,46px)/1 var(--f-titre,system-ui),sans-serif}" +
    "#carton06 .sur{font:600 clamp(15px,1.3vw,18px)/1 var(--f-titre,system-ui),sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#f4c01e}" +
    "#carton06 .nom{margin-top:8px;font:700 clamp(34px,4.2vw,56px)/1 var(--f-titre,system-ui),sans-serif;letter-spacing:.02em;text-transform:uppercase}" +
    "#carton06 ol{list-style:none;margin:clamp(16px,2vw,26px) 0 0;padding:0;display:grid;gap:clamp(7px,.8vw,11px) 44px;justify-content:start}" +
    "#carton06 ol.deux{grid-auto-flow:column;grid-template-rows:repeat(var(--rangs),auto)}" +
    "#carton06 li{display:flex;align-items:center;gap:12px;font:500 clamp(17px,1.65vw,22px)/1.15 var(--f-texte,system-ui),sans-serif;color:#e8ecef}" +
    "#carton06 li b{flex:none;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-width:30px;height:30px;padding:0 6px;border-radius:15px;border:1.5px solid #f4c01e;color:#f4c01e;font:700 16px/1 var(--f-titre,system-ui),sans-serif}" +
    "#carton06 li b.point{min-width:11px;width:11px;height:11px;padding:0;background:#f4c01e}" +
    // #seq157 : plus de carton d'origine ; carte d'étape opaque, visible dès qu'elle est écrite, cachée tant qu'elle montre la partie d'avant
    "body.mode-video #seq157 .chap{display:none!important}" +
    "body.mode-video #seq157 .carte{background:#101316!important;transition:none!important}" +
    "body.mode-video #seq157 .carte.cache{opacity:1!important;visibility:visible!important}" +
    "body.mode-video.a06-attente #seq157 .carte{visibility:hidden!important}" +
    // écran avoir18 en plein écran : la vignette (cadre, légende, plaques placées pour le petit rectangle) est cachée
    "body.a06-plein #avoir18-vignette,body.mode-video.a06-a18 #avoir18-vignette{display:none!important}";
  document.body.appendChild(CSS);
  var CARTON = document.createElement("div"); CARTON.id = "carton06"; CARTON.setAttribute("aria-hidden", "true"); document.body.appendChild(CARTON);
  var FONDU = document.createElement("div"); FONDU.id = "fondu06"; FONDU.setAttribute("aria-hidden", "true"); document.body.appendChild(FONDU);

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function htmlCarton(g) {
    var GS = SEQ && SEQ.GROUPES, G = GS && GS[g]; if (!G) return "";
    var Lst = []; G.items.forEach(function (it) { if (it.variante) return; if (it.no !== undefined && Lst.some(function (x) { return x.no === it.no; })) return; Lst.push(it); });
    var liste = Lst.length > 1 ? '<ol class="' + (Lst.length > 4 ? "deux" : "") + '" style="--rangs:' + Math.ceil(Lst.length / 2) + '">' +
      Lst.map(function (it) { return '<li><b class="' + (it.no === undefined ? "point" : "") + '">' + (it.no === undefined ? "" : it.no) + "</b>" + esc(it.titre) + "</li>"; }).join("") + "</ol>" : "";
    var titre0 = g === 0 ? '<p class="titre0">PRO-DD-ST-003 · Fabrication d’un plancher pour foreuse aux diamants sous terre</p>' : "";
    return '<div class="boite">' + titre0 + '<div class="tete"><p class="no">' + (g + 1) + '</p><div><p class="sur">Partie ' + (g + 1) + " sur " + GS.length +
      '</p><p class="nom">' + esc(G.nom) + "</p></div></div>" + liste + "</div>";
  }

  // ================================================================ 4. couches : cacher sans casser (scene.md §4)
  var BIT = 1 << 26, SAUVE = new Map();
  function cache(o) { if (!o) return; o.traverse(function (q) { if (q.isLight) { if (!SAUVE.has(q)) SAUVE.set(q, q.intensity); q.intensity = 0; return; }
    if (q.isCamera) return; if (q.layers.mask !== BIT) { if (!SAUVE.has(q)) SAUVE.set(q, q.layers.mask); q.layers.mask = BIT; } }); }
  function rendTout() { SAUVE.forEach(function (v, q) { try { if (q.isLight) { if (q.intensity === 0) q.intensity = v; } else if (q.layers.mask === BIT) q.layers.mask = v; } catch (e) {} }); SAUVE.clear(); }
  function sceneVisite() { var K = window.__laserOutilsV19; if (K && K.groupe && K.groupe.parent && K.groupe.parent.isScene) return K.groupe.parent;
    var P = window.__perso && window.__perso.persos, r = P && (P.T2 || P.T1 || P.AV), o = r && r.racine; while (o && o.parent) o = o.parent; return o && o.isScene ? o : null; }
  function cacheTravailleurs() { try { var P = window.__perso && window.__perso.persos; if (P && P.T2) cache(P.T2.racine);
      var Po = window.__poste; if (Po && Po.chaise) cache(Po.chaise); } catch (e) { err(e, "travailleurs"); } }
  function cachePileDemo() { try { var s = sceneVisite(); if (!s) return;
      s.children.forEach(function (o) { var p = o.isMesh && o.geometry && o.geometry.parameters;
        if (p && Math.abs(p.height - 0.0764) < 1e-3 && Math.abs(p.depth - 2.4384) < 1e-3) cache(o); }); } catch (e) { err(e, "pile de démonstration"); } }

  // ================================================================ 5. orbite (pose écrite juste avant le rendu de la scène de la visite)
  var O = null, CTR = null, R = null, PS = null, CAMP = null, SV = null, CV = null, r0 = null;
  function poseOrbite(c) { var now = performance.now(), u = Math.max(0, Math.min(1, (now - O.t0) / O.T)), e = u * u * (3 - 2 * u), a = O.a0 + (O.a1 - O.a0) * e;
    if (!CTR) CTR = new THREE.Vector3();
    if (O.p0) { var L_ = function (k) { return O.p0[k] + (O.p1[k] - O.p0[k]) * e; }, M_ = function (k) { return O.c0[k] + (O.c1[k] - O.c0[k]) * e; };
      c.position.set(L_(0), L_(1), L_(2)); c.lookAt(CTR.set(M_(0), M_(1), M_(2))); }
    else { c.position.set(O.c[0] + O.ax * Math.cos(a), O.y, O.c[2] + O.az * Math.sin(a)); c.lookAt(CTR.set(O.c[0], O.c[1], O.c[2])); } if (O.fov && c.fov !== O.fov) { c.fov = O.fov; c.updateProjectionMatrix(); } c.updateMatrixWorld(true); }
  function orbite(t0, T) { O = { t0: t0, T: T, c: [4.6, -0.3, 0], ax: 8.3, az: 1.75, y: 3.55, a0: -0.6, a1: 0.6, fov: 72 }; }
  // prise de vue finale : travelling lent de l'entrée (haut, côté gauche) vers la foreuse, la visée glisse du centre du plancher vers la foreuse
  function cinematique(t0, T) { O = { t0: t0, T: T, p0: [13.4, 3.1, -1.6], p1: [9.8, 2.5, 1.1], c0: [5.0, -0.2, 0.1], c1: [3.0, 0.1, -0.1], fov: 62 }; }

  // ================================================================ 6. rendu : orbite + avoir18 plein écran (enveloppe de renderer.render)
  var A18 = window.__avoir18;
  function pleinActif() { try { return enVideo() && !!A18 && A18.ouvert && A18.etat === "pret" && window.__ecransV19.actif === "avoir18"; } catch (e) { return false; } }
  var sz = null, vp = null, cc = null;
  function rendPlein(Rd) {
    if (!sz) { sz = new THREE.Vector2(); vp = new THREE.Vector4(); cc = new THREE.Color(); }
    Rd.getSize(sz); Rd.getViewport(vp); Rd.getClearColor(cc);
    var ca = Rd.getClearAlpha(), ac = Rd.autoClear, ex = Rd.toneMappingExposure, sct = Rd.getScissorTest(), asp = CV.aspect;
    try { CV.aspect = sz.x / Math.max(1, sz.y); CV.updateProjectionMatrix();
      Rd.setScissorTest(false); Rd.setViewport(0, 0, sz.x, sz.y); Rd.setClearColor(0x0b0d10, 1); Rd.autoClear = true;
      if (typeof A18.EXPOSITION === "number") Rd.toneMappingExposure = A18.EXPOSITION;
      r0.call(Rd, SV, CV); }
    finally { Rd.setClearColor(cc, ca); Rd.autoClear = ac; Rd.toneMappingExposure = ex; Rd.setScissorTest(sct); Rd.setViewport(vp); CV.aspect = asp; CV.updateProjectionMatrix(); }
  }
  function installeRendu(Rd) {
    if (!Rd || Rd.__a06) return; R = Rd; r0 = Rd.render; Rd.__a06 = true;
    Rd.render = function (s, c) {
      try {
        if (s && s.isScene && this.getRenderTarget() === null) {
          if (!PS) PS = sceneVisite();
          if (s === PS) {
            if (c && c.isPerspectiveCamera && !CAMP && c.parent === PS) CAMP = c;
            if (pleinActif() && SV && CV) { document.body.classList.add("a06-plein"); rendPlein(this); return; }
            if (O && c === CAMP) poseOrbite(c);
          } else if (A18 && A18.ouvert && this.getScissorTest() && c && c.isPerspectiveCamera) {   // rendu de la vignette avoir18
            SV = s; CV = c; if (pleinActif()) return;
          }
        }
      } catch (e) { err(e, "rendu"); }
      return r0.apply(this, arguments);
    };
  }
  try { if (window.__r) installeRendu(window.__r); } catch (e) { err(e, "rendeur"); }
  if (!R) I.prepare(function () {   // navigateur ordinaire : le rendeur arrive par onBeforeRender de la scène
    try { if (R) return true; var s = sceneVisite(); if (!s) return false; var avant = s.onBeforeRender;
      s.onBeforeRender = function (rd) { try { if (!R && rd && rd.render) installeRendu(rd); } catch (e) {} if (typeof avant === "function") return avant.apply(this, arguments); };
      return true; } catch (e) { err(e, "prépare rendeur"); return true; } });

  // ================================================================ 7. début de chaque bloc (crochet NV.journal.push, avant la lecture de NV.AUDIO)
  var ST = { carton: null, fondu: 0, ouverture: false, pile: false, groupe: -1, cine: null };
  function tempsBloc() { try { var m = VP && VP.maintenant && VP.maintenant(); return m ? m.t : null; } catch (e) { return null; } }
  function debutVoix() { var t = tempsBloc(); return t === null ? performance.now() : performance.now() - t * 1000; }
  function fonduCine(o) { if (o === null) { FONDU.style.opacity = ""; FONDU.style.visibility = ""; FONDU.style.transition = ""; return; }
    FONDU.style.transition = "none"; FONDU.style.opacity = String(o); FONDU.style.visibility = o > 0 ? "visible" : "hidden"; }
  function finCarton() { CARTON.classList.remove("vu"); ST.carton = null; }
  function finOuverture() { if (!ST.ouverture) return; ST.ouverture = false; O = null; rendTout(); if (ST.pile) cachePileDemo(); }
  function surBloc(id) {
    var b = NV.BLOCS[NV.i]; if (!b || b.id !== id) return;
    var pseudo = PSEUDO.test(id);
    if (/^carton_/.test(id)) {
      var g = typeof b.carton === "number" ? b.carton : +id.slice(7) - 1;
      CARTON.innerHTML = htmlCarton(g); CARTON.classList.add("vu"); ST.carton = { id: id, fin: debutVoix() + b.d * 1000 }; ST.groupe = g;
      document.body.classList.add("a06-attente");
    } else if (ST.carton) finCarton();
    if (!pseudo) ST.groupe = GROUPE_DE[id] !== undefined ? GROUPE_DE[id] : ST.groupe;
    // ouverture : plancher fini, sans travailleur, orbite sur la voix des blocs 1 à 3
    if (id === "carton_1" || id === "1" || id === "2" || id === "3") {
      if (!ST.ouverture) { ST.ouverture = true; cacheTravailleurs(); }
      if (id === "carton_1") orbite(Infinity, 1);
      else if (id === "1" || !O) { var T = 0; ["1", "2", "3"].forEach(function (x) { var q = bloc(x); T += q ? q.d * 1000 : 0; });
        var t0 = debutVoix(); if (id !== "1") { var q1 = bloc("1"); t0 -= (id === "3" && bloc("2") ? bloc("2").d * 1000 : 0) + (q1 ? q1.d * 1000 : 0); }
        orbite(t0, Math.max(4000, T)); }
    } else if (ST.ouverture) {
      finOuverture();
      if (ST.fondu) { var f = ST.fondu; ST.fondu = 0; setTimeout(function () { if (f === ST.fonduId) { FONDU.classList.add("lent"); FONDU.classList.remove("vu"); } }, 750); }
    }
    // prise de vue cinématique finale : place de travail complète (étape 18), opérateur caché, interface cachée, fondu au noir à la fin
    if (id === "fin_cine") { ST.cine = { t0: debutVoix(), T: b.d * 1000, noir: false }; cacheTravailleurs(); cinematique(ST.cine.t0, ST.cine.T); document.body.classList.add("a06-cine"); FONDU.classList.remove("vu", "lent"); fonduCine(1); }   // ouverture au noir, fondu piloté image par image (horloge simulée du tournage)
    else if (ST.cine) { ST.cine = null; O = null; rendTout(); fonduCine(null); document.body.classList.remove("a06-cine", "a06-cine-noir"); }
    // bloc 9 : étape 0 sans la pile de 3 × 8 de la démonstration ni la planche de démo
    if (id === "9") { ST.pile = true; cachePileDemo(); } else if (ST.pile && !ST.ouverture) { ST.pile = false; rendTout(); }
  }
  ST.fonduId = 0;
  try {
    var J = NV.journal, push1 = J.push;
    J.push = function (id) {
      var sid = String(id);
      try { NV.AUDIO = PSEUDO.test(sid) ? null : AUDIO0; } catch (e) {}
      var r = push1.apply(this, arguments);
      try { if (NV.actif) surBloc(sid); } catch (e) { err(e, "début de bloc " + sid); }
      return r; };
  } catch (e) { err(e, "crochet journal"); }

  // ================================================================ 8. à chaque image
  var actifAvant = false;
  I.anime(function () {
    try {
      if (!NV.actif) {
        if (actifAvant) { actifAvant = false; NV.AUDIO = AUDIO0; finCarton(); FONDU.classList.remove("vu", "lent"); ST.fondu = 0;
          finOuverture(); if (ST.pile) { ST.pile = false; rendTout(); }
          document.body.classList.remove("a06-attente", "a06-plein", "a06-a18");
          if (ST.cine && NV.etat === "fini") { fonduCine(1); document.body.classList.add("a06-cine-noir"); setTimeout(function () { if (!NV.actif) { document.body.classList.remove("a06-cine", "a06-cine-noir"); fonduCine(null); O = null; rendTout(); ST.cine = null; } }, 6000); }
          else if (ST.cine) { ST.cine = null; O = null; rendTout(); fonduCine(null); document.body.classList.remove("a06-cine", "a06-cine-noir"); } }
        return; }
      actifAvant = true;
      var now = performance.now(), b = NV.BLOCS[NV.i];
      // carton : s'efface FADE ms avant la fin du pseudo-bloc (la voix suivante part au moins 0,3 s après)
      if (ST.carton && CARTON.classList.contains("vu") && now >= ST.carton.fin - FADE) CARTON.classList.remove("vu");
      // #seq157 : le carton d'origine ne s'ouvre plus, la carte d'étape est montrée tout de suite (classes réelles, lues par a09)
      var RS = document.getElementById("seq157");
      if (RS && RS.classList.contains("vu") && RS.children.length >= 3) { var ca = RS.children[1], ch = RS.children[2];
        if (!ch.classList.contains("cache")) ch.classList.add("cache");
        if (ca.classList.contains("cache") && ca.innerHTML) ca.classList.remove("cache"); }
      // carte d'étape : cachée tant que #seq157 montre encore la partie d'avant
      if (document.body.classList.contains("a06-attente") && b && !PSEUDO.test(b.id) && SEQ && SEQ.g === ST.groupe) document.body.classList.remove("a06-attente");
      // fondu au noir à la fin du bloc 3 (retour à l'étape 0 sous le noir au bloc 4)
      if (b && b.id === "3" && ST.ouverture && !ST.fondu) { var t = tempsBloc(); if (t !== null && t >= b.d - 0.4) { ST.fonduId++; ST.fondu = ST.fonduId; FONDU.classList.remove("lent"); FONDU.classList.add("lent", "vu"); } }
      if (ST.cine) { var uc = now - ST.cine.t0, oc = uc < 1200 ? 1 - uc / 1200 : (uc > ST.cine.T - 1800 ? (uc - (ST.cine.T - 1800)) / 1800 : 0); fonduCine(Math.max(0, Math.min(1, oc))); if (oc >= 1) ST.cine.noir = true; }
      // plein écran avoir18
      if (!pleinActif()) document.body.classList.remove("a06-plein");
      var a18 = false; try { a18 = enVideo() && window.__ecransV19.actif === "avoir18"; } catch (e) {} document.body.classList.toggle("a06-a18", a18);
    } catch (e) { err(e, "image"); }
  });

  window.__a06 = { ST: ST, orbite: function () { return O; }, plein: pleinActif };
})();
