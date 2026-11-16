/* Service worker · Visite du plancher · hors ligne complet.
   Fichier fabriqué par C:/IA/banc/visite_web/pwa/fabrique_pwa.js : ne pas le modifier à la main, refaire la fabrication.
   - À l'installation, TOUT le site est mis en cache : la page, les modèles 3D, les icônes, three.js (jsDelivr) et les polices (Google Fonts).
   - Chaque fichier est vérifié octet pour octet (empreinte SHA-256) avant d'entrer dans le cache.
   - Un fichier inchangé depuis la version précédente est repris de l'ancien cache ; un fichier que la page vient de charger est repris du cache
     HTTP du navigateur : pas de second téléchargement.
   - Ensuite la page est servie depuis le cache d'abord : elle s'ouvre sans réseau.
   - Une nouvelle version s'installe en arrière-plan ; elle remplace l'ancienne à la prochaine ouverture, ou tout de suite si la page le demande. */
const VERSION = "100-d787d755";
const PREFIXE = "visite-plancher-";
const CACHE = PREFIXE + VERSION;
const LISTE = [{"u":"index.html","h":"7bc03bb0aef78d63ce4bfc12949163e0983d839ed53704b5121187d7aa5addec","o":2507691},{"u":"manifest.webmanifest","h":"fe84e242cec360b357c59e2410ca0226b3103b356fb5ead9714ed982651b7f77","o":834},{"u":"icones/icone-192.png","h":"2dd74ecc7c597a57349cdd52513a052fdb206e7929a30dd73c9899004b3f0f23","o":31734},{"u":"icones/icone-512.png","h":"611a74af4ce8836b7ddc59d3251e278310cea03cf01e4e03afb359d15b802016","o":190158},{"u":"icones/icone-maskable-512.png","h":"611a74af4ce8836b7ddc59d3251e278310cea03cf01e4e03afb359d15b802016","o":190158},{"u":"icones/icone-180.png","h":"235a95abc0d334315d43075342f2f39860021d89fd078e8adfac5fcd882e5a01","o":28121},{"u":"icones/favicon.png","h":"a02380c3f8293d09437234df3ca32bd1bc268a71c70b450ad7ce052af7e5a568","o":3254},{"u":"cloture_cage.txt","h":"30f165b575556df72a1acc6a04dfbeb154bc3ad2727aaba4b913d1475206d1c7","o":597424},{"u":"coffre.txt","h":"62910035ba6e489cb4c24fc86ed981b8136d7ce3901f22be1fa0b1c520098ec4","o":362956},{"u":"coffre_jeu.txt","h":"e046a4219caec8870e3771c8a62f0c118fb65dd862cbb542e2e62473d081bb54","o":1563344},{"u":"coffre_pieces_hd.txt","h":"0109fd3eca997a3dbff88cc0a3a455046a52f5c528eae87c06ee844a256365df","o":3742716},{"u":"console.txt","h":"31cc1ba3815e05ae86fb1c15f941a44d28c34d9d478778a3930380aab7b11832","o":1522440},{"u":"core_knocker.txt","h":"6144749a6f86d7c76d45a6b45e22e179450ff81e448fd1c4befd17e3bad1a580","o":193664},{"u":"foreuse.txt","h":"d3c31292e91e7e10646a3d3b224e1b33469096688f947b3fe5450f711bb9ab81","o":5438120},{"u":"galerie.txt","h":"fb949675113d83b47ca86cf6230c9cca277471098279a9c88a29d8ebf41efb01","o":13656844},{"u":"groupe_hydraulique.txt","h":"a6ed9e5b58312195044ec3e4eee929965d655c888a86b0a62896838425767fdf","o":2337004},{"u":"plancher.txt","h":"04d788bed5c5cde38f5564d340917c863381a2da33668399419c9702d401729f","o":2562552},{"u":"porte_1801020.txt","h":"c4eac7fd1066699e146cd6be9e4084da0dd519fdb508d272b55cc787fad753d4","o":858460},{"u":"poste_secours.txt","h":"9e72ad27185aab2da94b4e9aa36a6dfb1dae0307b3556a4a7dce208b9ae8ace9","o":507064},{"u":"poubelle_dd.txt","h":"42a62d5cc84dbb675286610cc622d8fa093b5f8ae86d3afc9c3f167744acdddf","o":268424},{"u":"rack_installation.txt","h":"e37a80df0c80b0af29d643fba6e7e022a8737e52e0014334e7227bf1e17a8419","o":3449900},{"u":"rack_outil.txt","h":"673e243be55352a19e7105581aa38d8d64b48c19afa7ea7138344af271ce088b","o":289568},{"u":"rack_tiges.txt","h":"b414e7b56fc9cd479aec670bb369316fcca6a28712bb694c5673ad851f2dedfc","o":1906384},{"u":"roc_mega_couleur_1k.txt","h":"a7c2041cc88cc188dbfbc502b595104a4c80594c6e3e8f8655d9474a4fe23c23","o":332192},{"u":"roc_mega_couleur_2k.txt","h":"5281c46690e9faeaf55b99166e1cc04a82240f9a3f88760243b5f1ba1fb341f8","o":1380344},{"u":"roc_mega_normale_1k.txt","h":"f503dcb25ba1255d9000b7d15065f4f05fb18226c1014c71b7874ccf13e2e946","o":778160},{"u":"roc_mega_normale_2k.txt","h":"b38d0b3a46838b224d56d79a70b50e585c5d88f26c162a7cce82c61a544d4d5a","o":2539420},{"u":"roc_mega_ord_1k.txt","h":"634c9011b269a7add09fc355c7eebd9d4d0c8e5776bfbaac1530560acc3ec0e5","o":276500},{"u":"roc_mega_ord_2k.txt","h":"7165916b48a2ce10fb192987a6e2c009b003e42257268d349b39657fd6b359be","o":933024},{"u":"support_pipewrench.txt","h":"402fb679c84fcc66c864c1d648febfbbf26bb6f93171ceaedc7d722430f231f5","o":620300},{"u":"t1_web.txt","h":"8d09fefad341c4fc05b84b824e6dad550d1986da698230fea91cf02b08a1df4b","o":11481504},{"u":"table_core.txt","h":"ea3b47a854275678188df90c07a45caaac174ded90e31227fa858faf83c5a2a6","o":241560},{"u":"tube_eau.txt","h":"4be33d52762572a3b9662f173288a13ec34346f4693d121e703c3e7cfe62a786","o":573324}];          // fichiers du site : { u: chemin relatif, h: empreinte SHA-256, o: octets }
const EXTERNES = ["https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js"];    // scripts servis par un CDN (three.js)
const POLICES = "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap";      // feuille de style des polices (ou null)
const INDEX = "__index";

const adresse = (u) => new URL(u, self.registration.scope).href;
async function dit(m) { try { const cl = await self.clients.matchAll({ includeUncontrolled: true, type: "window" }); for (const c of cl) c.postMessage(m); } catch (e) {} }

async function empreinte(buf) { const d = await crypto.subtle.digest("SHA-256", buf); return Array.from(new Uint8Array(d)).map((x) => x.toString(16).padStart(2, "0")).join(""); }
// D'abord le cache HTTP du navigateur (ce que la page vient de charger n'est pas retéléchargé), sinon le réseau ; le contenu doit être exactement
// celui de cette version (taille et empreinte), sinon l'installation échoue et sera reprise à la prochaine ouverture.
async function charge(url, f) {
  for (const mode of ["default", "reload"]) {
    const r = await fetch(url, { cache: mode }); if (!r.ok) { if (mode === "reload") throw new Error(f.u + " : " + r.status); continue; }
    const buf = await r.arrayBuffer();
    if (buf.byteLength === f.o && (await empreinte(buf)) === f.h) return new Response(buf, { headers: { "Content-Type": r.headers.get("Content-Type") || "application/octet-stream", "Content-Length": String(buf.byteLength) } });
  }
  throw new Error(f.u + " : contenu inattendu");
}

async function installe() {
  const cache = await caches.open(CACHE), anciens = [];
  for (const n of await caches.keys()) {
    if (!n.startsWith(PREFIXE) || n === CACHE) continue;
    try { const c = await caches.open(n), r = await c.match(adresse(INDEX)); if (r) anciens.push({ c, idx: await r.json() }); } catch (e) {}
  }
  const total = LISTE.reduce((s, f) => s + f.o, 0); let fait = 0;
  const un = async (f) => {
    const url = adresse(f.u);
    if (!(await cache.match(url))) {
      let rep = null;
      for (const a of anciens) { if (a.idx && a.idx[f.u] === f.h) { rep = await a.c.match(url); if (rep) break; } }
      await cache.put(url, rep || (await charge(url, f)));
    }
    fait += f.o; dit({ pwa: "progres", version: VERSION, fait, total });
  };
  for (let i = 0; i < LISTE.length; i += 4) await Promise.all(LISTE.slice(i, i + 4).map(un));
  // la racine du site rend la même page que index.html
  const page = await cache.match(adresse("index.html")); if (page) await cache.put(adresse("./"), page.clone());
  // three.js : indispensable
  for (const u of EXTERNES) { if (!(await cache.match(u))) { const r = await fetch(u, { mode: "cors" }); if (!r.ok) throw new Error(u + " : " + r.status); await cache.put(u, r); } }
  // polices : souhaitées, pas indispensables (sans elles la page prend les polices de l'appareil)
  let polices = 0;
  if (POLICES) {
    try {
      let r = await cache.match(POLICES);
      if (!r) { r = await fetch(POLICES, { mode: "cors" }); if (!r.ok) throw new Error("polices " + r.status); await cache.put(POLICES, r.clone()); }
      const css = await r.text(), vus = {}, re = /url\((https:\/\/[^)"']+)\)/g; let m;
      while ((m = re.exec(css))) vus[m[1]] = 1;
      for (const u of Object.keys(vus)) { if (!(await cache.match(u))) { const q = await fetch(u, { mode: "cors" }); if (q.ok) await cache.put(u, q); } polices++; }
    } catch (e) { polices = -1; }
  }
  const idx = {}; for (const f of LISTE) idx[f.u] = f.h;
  await cache.put(adresse(INDEX), new Response(JSON.stringify(idx), { headers: { "Content-Type": "application/json" } }));
  dit({ pwa: "pret", version: VERSION, total, polices });
}

// vrai seulement si chaque fichier de la liste est réellement dans le cache (vérification, pas supposition)
async function etat() {
  const cache = await caches.open(CACHE); let fait = 0, manque = 0; const total = LISTE.reduce((s, f) => s + f.o, 0);
  for (const f of LISTE) { if (await cache.match(adresse(f.u))) fait += f.o; else manque++; }
  for (const u of EXTERNES) if (!(await cache.match(u))) manque++;
  return { pwa: "etat", version: VERSION, complet: manque === 0, manque, fait, total, fichiers: LISTE.length, polices: POLICES ? !!(await cache.match(POLICES)) : null };
}

self.addEventListener("install", (e) => { e.waitUntil(installe().catch((err) => { dit({ pwa: "echec", version: VERSION, raison: String(err && err.message || err) }); throw err; })); });

self.addEventListener("activate", (e) => { e.waitUntil((async () => {
  for (const n of await caches.keys()) if (n.startsWith(PREFIXE) && n !== CACHE) await caches.delete(n);
  await self.clients.claim();
})()); });

self.addEventListener("message", (e) => { const d = e.data || {};
  if (d.pwa === "etat?") e.waitUntil(etat().then((r) => { if (e.source) e.source.postMessage(r); }));
  if (d.pwa === "active") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const q = e.request; if (q.method !== "GET") return;
  const u = new URL(q.url), meme = u.origin === self.location.origin, racine = new URL(self.registration.scope).pathname;
  if (meme && !u.pathname.startsWith(racine)) return;
  if (!meme && EXTERNES.indexOf(q.url) < 0 && u.hostname !== "fonts.googleapis.com" && u.hostname !== "fonts.gstatic.com") return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cle = q.mode === "navigate" ? adresse("index.html") : q.url;
    const r = await cache.match(cle, { ignoreVary: true, ignoreSearch: meme });
    return r || fetch(q);
  })());
});
