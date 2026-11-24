// Horloge simulée dès le chargement de la page : le temps (performance.now, Date.now, requestAnimationFrame, minuteries) n'avance que par __avance(ms).
// La page ne voit donc jamais une image lente : ses choix de qualité ne dépendent que de la taille des pas, pas de la vitesse de cette machine.
// En plus : voix simulées (durée connue, début noté), hasard à graine fixe, suivi des téléchargements, dessin à l'écran suspendu à la demande,
// animations et transitions CSS asservies à l'horloge simulée, accès au rendu three.js.
module.exports = (DUREES) => `(() => {
  const D = ${JSON.stringify(DUREES)}; const P = performance, now0 = P.now.bind(P), date0 = Date.now.bind(Date); window.__vrai = now0;
  let vt = now0(); const decal = date0() - vt; let nid = 1e9; const raf = [], min = [];
  P.now = () => vt; Date.now = () => decal + vt;
  window.requestAnimationFrame = cb => { raf.push({ id: ++nid, cb }); return nid; };
  window.cancelAnimationFrame = id => { const i = raf.findIndex(x => x.id === id); if (i >= 0) raf.splice(i, 1); };
  window.setTimeout = (cb, ms, ...a) => { min.push({ id: ++nid, t: vt + Math.max(0, +ms || 0), cb, a }); return nid; };
  window.setInterval = (cb, ms, ...a) => { const p = Math.max(1, +ms || 0); min.push({ id: ++nid, t: vt + p, cb, a, p }); return nid; };
  window.clearTimeout = window.clearInterval = id => { const i = min.findIndex(x => x.id === id); if (i >= 0) min.splice(i, 1); };
  // hasard à graine fixe (clignements, gouttes…) : même suite dans tous les navigateurs
  let g = 20261124; Math.random = () => { g = g + 0x6D2B79F5 | 0; let t = Math.imul(g ^ g >>> 15, 1 | g); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  // téléchargements en cours (fetch et lecture du corps)
  const A = window.__att = { n: 0, tot: 0, fin: now0() }; const f0 = window.fetch.bind(window), entre = () => { A.n++; A.tot++; }, sort = () => { A.n--; A.fin = now0(); };
  window.fetch = function () { entre(); return f0.apply(null, arguments).then(r => { sort(); return r; }, e => { sort(); throw e; }); };
  if (window.createImageBitmap) { const c0 = window.createImageBitmap.bind(window); window.createImageBitmap = function () { entre(); return c0.apply(null, arguments).then(r => { sort(); return r; }, e => { sort(); throw e; }); }; }
  for (const m of ['text', 'json', 'arrayBuffer', 'blob']) { const o = Response.prototype[m]; Response.prototype[m] = function () { entre(); return o.apply(this, arguments).then(r => { sort(); return r; }, e => { sort(); throw e; }); }; }
  // animations et transitions CSS : mises en pause dès qu'elles apparaissent, puis avancées du temps simulé
  const vus = new WeakMap(); window.__css = dt => { let n = 0; for (const a of document.getAnimations()) { n++; let t = vus.get(a); if (t === undefined) { t = 0; try { a.pause(); } catch (e) {} } else t += dt; vus.set(a, t);
      let fin = Infinity; try { fin = a.effect.getComputedTiming().endTime; } catch (e) {} try { if (t >= fin) a.finish(); else a.currentTime = t; } catch (e) {} } return n; };
  window.__t = () => vt;
  window.__avance = dt => { const fin = vt + dt, t0 = now0(); let garde = 0;
    for (;;) { let k = -1; for (let i = 0; i < min.length; i++) if (min[i].t <= fin && (k < 0 || min[i].t < min[k].t)) k = i; if (k < 0 || ++garde > 5000) break; const x = min[k]; vt = Math.max(vt, x.t); if (x.p) x.t += x.p; else min.splice(k, 1); try { x.cb(...x.a); } catch (e) { console.error('minuterie', e && e.message); } }
    vt = fin; const q = raf.splice(0); for (const x of q) { try { x.cb(vt); } catch (e) { console.error('image', e && e.message); } }
    try { window.__css(dt); } catch (e) {} return now0() - t0; };
  // voix simulées
  window.__pistes = [];
  class Voix { constructor(src) { this._e = {}; this.paused = true; this._t0 = null; this.duration = NaN; if (src) this.src = src; }
    set src(v) { this._src = String(v); this._t0 = null; this.paused = true; const m = /bloc_([0-9a-z]+)\\.mp3/.exec(this._src); this._id = m ? m[1] : null; this.duration = m && D[m[1]] ? D[m[1]] : 0.01; window.setTimeout(() => (this._e.loadedmetadata || []).forEach(f => { try { f(); } catch (e) {} }), 0); }
    get src() { return this._src; } get currentTime() { return this._t0 == null ? 0 : Math.min(this.duration, (P.now() - this._t0) / 1000); } set currentTime(v) {}
    get ended() { return this._t0 != null && (P.now() - this._t0) / 1000 >= this.duration; }
    play() { this._t0 = P.now(); this.paused = false; if (this._id) window.__pistes.push({ id: this._id, t: this._t0 }); return Promise.resolve(); } pause() { this.paused = true; } load() {}
    addEventListener(n, f) { (this._e[n] = this._e[n] || []).push(f); } removeEventListener() {} }
  window.Audio = Voix;
  // WebGL : pas d'attente de compilation en parallèle (entrées en scène identiques partout) ; dessin à l'écran suspendu quand __sansDessin est vrai
  window.__gl = { hors: 0, ecran: 0 };
  for (const C of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) { if (!C) continue; const Q = C.prototype, lie = Q.bindFramebuffer, ext = Q.getExtension;
    Q.getExtension = function (n) { return n === 'KHR_parallel_shader_compile' ? null : ext.call(this, n); };
    Q.bindFramebuffer = function (c, f) { if (c === 0x8D40 || c === 0x8CA9) this.__tampon = f || null; return lie.call(this, c, f); };
    for (const n of ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced', 'drawRangeElements']) { const d = Q[n]; if (d) Q[n] = function () { if (window.__sansDessin && !this.__tampon) return; if (this.__tampon) window.__gl.hors++; else window.__gl.ecran++; return d.apply(this, arguments); }; } }
  // accès au rendu three.js (variable de fermeture de la page) et à la scène principale
  Object.defineProperty(Object.prototype, 'shadowMap', { configurable: true, set(v) { Object.defineProperty(this, 'shadowMap', { value: v, writable: true, configurable: true, enumerable: true });
      if (v && typeof v === 'object' && 'autoUpdate' in v && !window.__r) { window.__r = this; delete Object.prototype.shadowMap; } } });
  window.__dbg = {};
})();`;
