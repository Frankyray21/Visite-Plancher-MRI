// a04_moteur_plans.js — moteur « phrase → plan » de la vidéo narrée (spécification : C:/IA/video/carto/SPEC_moteur.md).
// N'agit qu'en mode vidéo (narration __narrationV155 active, body.mode-video). Navigation normale inchangée.
// API : window.__videoPlans = { definir, au, a, cle, maintenant, table, journal, erreurs }.
// Passages obligés (la page est une seule fermeture) : NV.journal.push (début de bloc), I.plansEtapes.plansSur (plans d'un groupe,
// tableau relu à chaque image par la narration), I.anime (file des clés, actions, caméras d'écran, étiquettes).
(function () {
  var NV = window.__narrationV155, I = window.__inter71;
  if (!NV || !I || !I.plansEtapes || typeof I.anime !== "function") { try { console.error("[videoPlans] narration ou plansEtapes absents : moteur inactif"); } catch (e) {} return; }
  var PE = I.plansEtapes, plansSur0 = PE.plansSur, cle0 = PE.cle;
  var TRANSITION_MAX = 0.8;          // s : la clé suit le vol de caméra (vol CAMK ≥ 1,6 s) ; plafond spec 1 s, 0,8 s garde une marge d image
  var ECART_CLES = 3.0;              // s : au moins 3 s entre deux clés
  var TABLE = {}, AU = {}, A = {};
  var VP = window.__videoPlans = {
    table: TABLE, journal: [], erreurs: [],
    definir: function (id, plans) { id = String(id); if (!plans || !plans.length) { delete TABLE[id]; return; }
      TABLE[id] = plans.slice().sort(function (x, y) { return (+x.t || 0) - (+y.t || 0); }); },
    au: function (id, fn) { id = String(id); (AU[id] = AU[id] || []).push(fn); },
    a: function (id, t, fn) { id = String(id); (A[id] = A[id] || []).push({ t: +t || 0, fn: fn }); },
    cle: function (txt) { montreCle(txt == null ? null : String(txt), null); },
    maintenant: function () { if (!NV.actif || !S.bloc) return null; return { id: S.bloc.id, t: (performance.now() - S.debutBloc) / 1000 }; }
  };
  var vus = {};
  function erreur(e, ou) { var m = ou + " : " + (e && e.message || e); VP.erreurs.push({ ou: ou, message: String(e && e.message || e), t: performance.now() });
    if (!vus[m]) { vus[m] = 1; try { console.error("[videoPlans] " + m); } catch (x) {} } }
  function enVideo() { return !!NV.actif && document.body.classList.contains("mode-video"); }
  function memeCible(a, b) { return !!a && !!b && a.etape === b.etape && a.ecran === b.ecran; }

  // ---------- état de la lecture ----------
  var S = { bloc: null, i: -1, debutBloc: 0, debutGroupe: 0, liste: null, controle: false, file: [], cles: [], derniereCle: null, camPrec: null, etq: null, premier: true };
  function remise() { S.bloc = null; S.i = -1; S.liste = null; S.controle = false; S.file = []; S.cles = []; S.camPrec = null; S.premier = true; filtreEtq(null); }

  // ---------- clé jaune : la narration ne la touche plus quand le moteur pilote le groupe ----------
  var moi = false, minuterieVide = null;
  PE.cle = function (txt) { if (S.controle && !moi && NV.actif) return; return cle0.apply(this, arguments); };
  function montreCle(txt, plan) {
    moi = true; try { cle0.call(PE, txt || null); } catch (e) { erreur(e, "clé"); } finally { moi = false; }
    // texte vidé après le fondu (sinon une puce cachée garde un texte lisible par les outils de contrôle)
    try { clearTimeout(minuterieVide); if (!txt) minuterieVide = setTimeout(function () { var c = document.getElementById("cle156"); if (c && !c.classList.contains("vu")) c.textContent = ""; }, 300); } catch (e) {}
    S.derniereCle = txt ? { txt: txt, at: performance.now() } : S.derniereCle;
    var m = VP.maintenant(); VP.journal.push({ id: m ? m.id : null, t: m ? +m.t.toFixed(2) : null, cle: txt || null, plan: plan || null });
  }

  // ---------- résolution d'un élément de table ----------
  function etapeDe(b) { if (!b || !b.c) return undefined; if (b.c.etape !== undefined) return b.c.etape;
    try { var E = window.__ecransV19, s = E && E.liste.filter(function (x) { return x.id === b.c.ecran; })[0]; return s ? s.apres : undefined; } catch (e) { return undefined; } }
  function resout(p, n) { var r = { t: +p.t || 0, cam: p.cam || null, cle: p.cle, etq: p.etq, action: p.action, plan: p.plan || null };
    if (p.plan) { var L = PE.PLANS[n] || [], q = L.filter(function (x) { return x.nom === p.plan; })[0];
      if (!q) erreur("plan « " + p.plan + " » inconnu à l'étape " + n, "table"); else { if (!r.cam) r.cam = q.cam; if (r.cle === undefined) r.cle = q.cle; } }
    if (r.cle === undefined) r.cle = r.cam ? null : undefined;   // un plan sans clé efface la puce ; un élément sans caméra ni clé la laisse
    return r; }
  function memeCam(a, b) { return !!a && !!b && (a === b || JSON.stringify([a.tgt, a.dir, a.r]) === JSON.stringify([b.tgt, b.dir, b.r])); }

  // programme les éléments d'un bloc : t0abs = instant absolu (ms) du t = 0 du bloc ; tListe = décalage (s) dans la liste du groupe
  function programme(id, elements, t0abs, n, versListe, tListe) {
    elements.forEach(function (p) {
      var at = t0abs + p.t * 1000;
      if (p.cam) {
        if (versListe && S.liste) S.liste.push({ t: tListe + p.t, cam: p.cam, cle: null });
        else S.file.push({ at: at, cam: p.cam, ecran: true, id: id });           // écran : le moteur cadre lui-même
        S.file.push({ at: at, etq: p.etq === undefined ? "defaut" : p.etq, plan: p.plan, id: id, journal: true });
      } else if (p.etq !== undefined) S.file.push({ at: at, etq: p.etq, id: id });
      if (p.cle !== undefined) { var d = p.cam && !memeCam(p.cam, S.camPrec) ? TRANSITION_MAX : 0; S.cles.push({ at: at + d * 1000, txt: p.cle, plan: p.plan, id: id }); }
      if (p.cam) S.camPrec = p.cam;
      if (typeof p.action === "function") S.file.push({ at: at, fn: p.action, id: id });
    });
    (A[id] || []).forEach(function (x) { S.file.push({ at: t0abs + x.t * 1000, fn: x.fn, id: id }); });
    S.file.sort(function (x, y) { return x.at - y.at; }); S.cles.sort(function (x, y) { return x.at - y.at; });
  }
  function dureeGroupeDepuis(i) { var c = NV.BLOCS[i].c, s = 0; for (var k = i; k < NV.BLOCS.length && memeCible(NV.BLOCS[k].c, c); k++) s += (NV.BLOCS[k].d || 0) + NV.ECART; return s; }
  function purgeFuturs(ecoule) { if (S.liste) for (var k = S.liste.length - 1; k >= 0; k--) if (S.liste[k].t > ecoule) S.liste.splice(k, 1);
    var now = performance.now(); S.cles = S.cles.filter(function (x) { return x.at <= now; }); S.file = S.file.filter(function (x) { return x.at <= now || !x.cam && !x.etq; }); }

  // ---------- plans d'un groupe d'étape ----------
  PE.plansSur = function (n, duree, sansDelai) {
    if (sansDelai || !enVideo()) return plansSur0.apply(this, arguments);
    try {
      var b = NV.BLOCS[NV.i], T = b && TABLE[b.id];
      if (!T) { var r = plansSur0.apply(this, arguments); S.liste = r && r.length ? r : null; return r; }
      var el = T.map(function (p) { return resout(p, n); });
      S.liste = []; S.camPrec = null;
      programme(b.id, el, S.debutBloc, n, true, 0);
      if (!S.liste.length) { var L = PE.PLANS[n]; S.liste.push({ t: 1e9, cam: L && L[0] ? L[0].cam : null, cle: null }); }   // aucun mouvement
      return S.liste;
    } catch (e) { erreur(e, "plansSur"); S.controle = false; return plansSur0.apply(this, arguments); }
  };

  // ---------- début de chaque bloc : crochet NV.journal.push ----------
  function surBloc(id) {
    var i = NV.i, b = NV.BLOCS[i], prec = NV.BLOCS[i - 1], now = performance.now();
    if (!b || b.id !== id) return;
    var nouveau = S.premier || !memeCible(prec && prec.c, b.c); S.premier = false;
    S.bloc = b; S.i = i; S.debutBloc = now + (nouveau ? 1200 : 0);
    var n = etapeDe(b), T = TABLE[b.id], ecran = b.c.etape === undefined;
    if (nouveau) { S.debutGroupe = S.debutBloc; S.liste = null; S.file = []; S.cles = []; S.camPrec = null; S.controle = !!T || !!A[b.id]; filtreEtq(null); S.derniereCle = null; if (S.controle) montreCle(null, null); }
    else if (T || A[b.id]) S.controle = true;
    (AU[b.id] || []).forEach(function (f) { try { f({ id: b.id, i: i, nouveau: nouveau, etape: b.c.etape, ecran: b.c.ecran }); } catch (e) { erreur(e, "au " + b.id); } });
    if (ecran) { if (T || A[b.id]) programme(b.id, (T || []).map(function (p) { return resout(p, n); }), S.debutBloc, n, false, 0); return; }
    if (nouveau) { if (!T && A[b.id]) programme(b.id, [], S.debutBloc, n, false, 0); return; }   // la table du 1er bloc passe par plansSur
    // bloc suivant d'un même groupe d'étape
    if (!S.controle) return;                                   // groupe sans table : comportement d'origine
    var dt = (S.debutBloc - S.debutGroupe) / 1000, ecoule = (now - S.debutGroupe) / 1000;
    if (!S.liste) { erreur("groupe sans liste de plans modifiable (bloc " + b.id + ")", "groupe"); programme(b.id, (T || []).filter(function (p) { return !p.cam && !p.plan; }).map(function (p) { return resout(p, n); }), S.debutBloc, n, false, 0); return; }
    purgeFuturs(ecoule);
    var el;
    if (T) el = T.map(function (p) { return resout(p, n); });
    else {   // bloc sans table dans un groupe piloté : plans d'origine sur le reste du groupe
      var o = plansSur0.call(PE, n, dureeGroupeDepuis(i), true) || [];
      el = o.map(function (p) { return { t: p.t, cam: p.cam, cle: p.cle || null }; });
    }
    programme(b.id, el, S.debutBloc, n, true, dt);
  }
  function installePush() { var J = NV.journal; if (!J || J.__vp) return; var push0 = Array.prototype.push;
    J.push = function (id) { var r = push0.apply(this, arguments); try { if (enVideo() || NV.actif) surBloc(id); } catch (e) { erreur(e, "début de bloc"); } return r; };
    try { Object.defineProperty(J, "__vp", { value: true }); } catch (e) { J.__vp = true; } }
  installePush();
  var joue0 = NV.joue;
  NV.joue = function () { try { if (NV.journal) NV.journal.length = 0; installePush(); remise(); } catch (e) { erreur(e, "joue"); } return joue0.apply(this, arguments); };

  // ---------- étiquettes : ne laisser que celles de etq ----------
  function filtreEtq(liste) {
    var L = window.__etiquettesV19; if (!L || !L.forEach) { S.etq = liste; return; }
    if (!liste) { L.forEach(function (d) { if (d.__vpEtapes !== undefined) { d.etapes = d.__vpEtapes; delete d.__vpEtapes; } }); S.etq = null; return; }
    S.etq = liste;
    L.forEach(function (d) { var garde = liste.indexOf(d.texte) >= 0;
      if (!garde && d.__vpEtapes === undefined) { d.__vpEtapes = d.etapes; d.etapes = [-99]; }
      else if (garde && d.__vpEtapes !== undefined) { d.etapes = d.__vpEtapes; delete d.__vpEtapes; } });
  }

  // ---------- boucle par image (après la narration : même image, ordre d'enregistrement) ----------
  var actifAvant = false;
  I.anime(function () {
    try {
      if (!NV.actif) { if (actifAvant) { actifAvant = false; if (S.controle) { S.controle = false; montreCle(null, null); } remise(); } return; }
      actifAvant = true;
      var now = performance.now();
      while (S.file.length && S.file[0].at <= now) {
        var x = S.file.shift();
        try {
          if (x.cam) { var C = window.__dbg && window.__dbg.camk;
            if (C && typeof C.cadre === "function") { try { if (window.__variante8) window.__variante8.CAMERA_PLANS = false; } catch (e) {} C.cadre(x.cam); }
            else erreur("caméra d'écran impossible (window.__dbg.camk absent)", "écran " + x.id); }
          if (x.etq !== undefined) filtreEtq(x.etq === "defaut" ? null : x.etq);
          if (x.journal) { var m = VP.maintenant(); VP.journal.push({ id: x.id, t: m ? +m.t.toFixed(2) : null, cle: undefined, plan: x.plan || "cam" }); }
          if (x.fn) x.fn();
        } catch (e) { erreur(e, "action " + x.id); }
      }
      if (S.etq) filtreEtq(S.etq);   // nouvelles étiquettes créées en cours de plan
      var dus = 0; while (dus < S.cles.length && S.cles[dus].at <= now) dus++;
      if (dus) { var c = S.cles[dus - 1];
        var attente = c.txt && S.derniereCle && S.derniereCle.txt !== c.txt && (now - S.derniereCle.at) < ECART_CLES * 1000;
        if (!attente) { S.cles.splice(0, dus); montreCle(c.txt, c.plan); }
        else if (dus > 1) S.cles.splice(0, dus - 1);   // seule la dernière clé due attend
      }
    } catch (e) { erreur(e, "image"); }
  });
})();
