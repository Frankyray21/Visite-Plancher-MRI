/* Service worker · Visite du plancher · hors ligne complet.
   Fichier fabriqué par C:/IA/banc/visite_web/pwa/fabrique_pwa.js : ne pas le modifier à la main, refaire la fabrication.
   - À l'installation, TOUT le site est mis en cache : la page, les modèles 3D, les icônes, three.js (jsDelivr) et les polices (Google Fonts).
   - Chaque fichier est vérifié octet pour octet (empreinte SHA-256) avant d'entrer dans le cache.
   - Un fichier inchangé depuis la version précédente est repris de l'ancien cache ; un fichier que la page vient de charger est repris du cache
     HTTP du navigateur : pas de second téléchargement.
   - Ensuite la page est servie depuis le cache d'abord : elle s'ouvre sans réseau.
   - Une nouvelle version s'installe en arrière-plan ; elle remplace l'ancienne à la prochaine ouverture, ou tout de suite si la page le demande. */
const VERSION = "165-0d09583a";
const PREFIXE = "visite-plancher-";
const CACHE = PREFIXE + VERSION;
const LISTE = [{"u":"index.html","h":"68e0bf1a9b2fac30ddb55ce9c85fb2d5f5680e7a05187911cdeb2831202dcf65","o":4558623},{"u":"manifest.webmanifest","h":"fe84e242cec360b357c59e2410ca0226b3103b356fb5ead9714ed982651b7f77","o":834},{"u":"icones/icone-192.png","h":"2dd74ecc7c597a57349cdd52513a052fdb206e7929a30dd73c9899004b3f0f23","o":31734},{"u":"icones/icone-512.png","h":"611a74af4ce8836b7ddc59d3251e278310cea03cf01e4e03afb359d15b802016","o":190158},{"u":"icones/icone-maskable-512.png","h":"611a74af4ce8836b7ddc59d3251e278310cea03cf01e4e03afb359d15b802016","o":190158},{"u":"icones/icone-180.png","h":"235a95abc0d334315d43075342f2f39860021d89fd078e8adfac5fcd882e5a01","o":28121},{"u":"icones/favicon.png","h":"a02380c3f8293d09437234df3ca32bd1bc268a71c70b450ad7ce052af7e5a568","o":3254},{"u":"avoir18_secondaire.txt","h":"b2dfeb5723e3d562c5a0f07332bcf33f24658fcfa3bb43cfb0f27218acf73d2c","o":1110732},{"u":"cles_mixtes.txt","h":"bcb812e19eec15ecf185728ec3ec8d2ffdb5a97c4a1f318d8b402055005274c3","o":1262880},{"u":"cles_rack.txt","h":"826bc881b2300c30cec6e591d83e4ef72602e52503e099fe9d81c84d73462e47","o":454744},{"u":"cloture_cage.txt","h":"30f165b575556df72a1acc6a04dfbeb154bc3ad2727aaba4b913d1475206d1c7","o":597424},{"u":"coffre.txt","h":"62910035ba6e489cb4c24fc86ed981b8136d7ce3901f22be1fa0b1c520098ec4","o":362956},{"u":"coffre_jeu.txt","h":"e046a4219caec8870e3771c8a62f0c118fb65dd862cbb542e2e62473d081bb54","o":1563344},{"u":"coffre_pieces_hd.txt","h":"0109fd3eca997a3dbff88cc0a3a455046a52f5c528eae87c06ee844a256365df","o":3742716},{"u":"console.txt","h":"31cc1ba3815e05ae86fb1c15f941a44d28c34d9d478778a3930380aab7b11832","o":1522440},{"u":"console_dr1500.txt","h":"245542523451f2bb5692a1d8a377b6a6ba46600808536fb55102f1e38f7b6b33","o":1063184},{"u":"core_knocker.txt","h":"6144749a6f86d7c76d45a6b45e22e179450ff81e448fd1c4befd17e3bad1a580","o":193664},{"u":"dead_man.txt","h":"b3cfb2ddc5343f98924567b521b85a46cdbd7de06e91cd0804c62840b100e0f3","o":1086752},{"u":"etiquettes_cotes_v27.txt","h":"816c336230ada9eb1851b82abf219685026c3d8b9cb27ad1adc82fa0d5e32ca3","o":115815},{"u":"etui_avec_cle.txt","h":"c32f7d6a461a4121c43bc0892e046a68569b60b31c7d0d114a2fce8593d50f26","o":710136},{"u":"foreuse.txt","h":"d3c31292e91e7e10646a3d3b224e1b33469096688f947b3fe5450f711bb9ab81","o":5438120},{"u":"foreuse_dr1500.txt","h":"3942f2c8b4f0ca9365f10f245bedb5d73cb764ef96f56a3582420892c901939e","o":9426072},{"u":"foreuse_v22.txt","h":"676c6edac7f5d484d5ad9aad40bb1500b078a52092671e4ab6737545ad788da7","o":7342656},{"u":"galerie.txt","h":"fb949675113d83b47ca86cf6230c9cca277471098279a9c88a29d8ebf41efb01","o":13656844},{"u":"groupe_dr1500.txt","h":"3c539b34480d0779004f47709ba1e489c6391fedfcdc28e6694830f7decdd9cb","o":2444488},{"u":"groupe_hydraulique.txt","h":"a6ed9e5b58312195044ec3e4eee929965d655c888a86b0a62896838425767fdf","o":2337004},{"u":"laser_outils_bosch.txt","h":"ecf7145e74fabb16662020ee430a3dfaed022ce591ef29e46db077022eae93cb","o":274864},{"u":"laser_outils_niveau48.txt","h":"a325bd4fb9d87b23f88afc2eccfb12696a39843b03b85c99e1840b1cfe4b99a4","o":993804},{"u":"materiel_outils.txt","h":"189bd92a71e11fab7f15c6857b53b201fe45aad705fcdc091ff4270f5e82a403","o":4252252},{"u":"ouverture_fond.txt","h":"290f95baefd1ec355726ac6750db4c16bfd83f77b11d4a0ad20f456a83d1a943","o":508516},{"u":"palette_boites.txt","h":"322c65b7f2402392e278fa86f9666e977ca97cc982e6c030b9ebab68eecbf754","o":59852},{"u":"pince_a_sertir.txt","h":"eeaa22d14b133d7841782bf6dbabfd3228e507f47f8ccfcfce599afef16ea8eb","o":352496},{"u":"pince_monseigneur.txt","h":"038ed0501650592bac490435ad55d00eddf34ad305d856f2f4ec42add02dd9a5","o":82508},{"u":"plancher.txt","h":"04d788bed5c5cde38f5564d340917c863381a2da33668399419c9702d401729f","o":2562552},{"u":"porte_1801020.txt","h":"c4eac7fd1066699e146cd6be9e4084da0dd519fdb508d272b55cc787fad753d4","o":858460},{"u":"poste_secours.txt","h":"9e72ad27185aab2da94b4e9aa36a6dfb1dae0307b3556a4a7dce208b9ae8ace9","o":507064},{"u":"poubelle_dd.txt","h":"42a62d5cc84dbb675286610cc622d8fa093b5f8ae86d3afc9c3f167744acdddf","o":268424},{"u":"rack_core_box.txt","h":"20579e513f93e106f4b8981451c25db038452212a57c6c8afd2896f16ab5b886","o":292220},{"u":"rack_installation.txt","h":"e37a80df0c80b0af29d643fba6e7e022a8737e52e0014334e7227bf1e17a8419","o":3449900},{"u":"rack_outil.txt","h":"673e243be55352a19e7105581aa38d8d64b48c19afa7ea7138344af271ce088b","o":289568},{"u":"rack_tiges.txt","h":"b414e7b56fc9cd479aec670bb369316fcca6a28712bb694c5673ad851f2dedfc","o":1906384},{"u":"roc_mega_couleur_1k.txt","h":"a7c2041cc88cc188dbfbc502b595104a4c80594c6e3e8f8655d9474a4fe23c23","o":332192},{"u":"roc_mega_couleur_2k.txt","h":"5281c46690e9faeaf55b99166e1cc04a82240f9a3f88760243b5f1ba1fb341f8","o":1380344},{"u":"roc_mega_normale_1k.txt","h":"f503dcb25ba1255d9000b7d15065f4f05fb18226c1014c71b7874ccf13e2e946","o":778160},{"u":"roc_mega_normale_2k.txt","h":"b38d0b3a46838b224d56d79a70b50e585c5d88f26c162a7cce82c61a544d4d5a","o":2539420},{"u":"roc_mega_ord_1k.txt","h":"634c9011b269a7add09fc355c7eebd9d4d0c8e5776bfbaac1530560acc3ec0e5","o":276500},{"u":"roc_mega_ord_2k.txt","h":"7165916b48a2ce10fb192987a6e2c009b003e42257268d349b39657fd6b359be","o":933024},{"u":"sol_boue_cro_1k.txt","h":"8384ae7cf7ef007953205fc7bb3e9013e96d6fb2b80ee0b2f747e3630d90240c","o":679576},{"u":"sol_boue_cro_2k.txt","h":"75c07a4751e0b245409261a78564ea74a7bfed1d2635d935a862f65688cdd77d","o":2594524},{"u":"sol_boue_nnr_1k.txt","h":"4bfa157f193dbe543bd165c16b022917796c5bf91732c848c28316c37d5c530c","o":964848},{"u":"sol_boue_nnr_2k.txt","h":"b323cca4db368f85a857f97ee46fd4d5e755e6b832bd2d1624e239a9b36d868f","o":2870496},{"u":"stm_articulee.txt","h":"80d690fed55fc567c57d40869c0ff8509c1fc1b8a4b63348337ea9dd521f2209","o":9644892},{"u":"support_pipewrench.txt","h":"402fb679c84fcc66c864c1d648febfbbf26bb6f93171ceaedc7d722430f231f5","o":620300},{"u":"t1_web.txt","h":"8d09fefad341c4fc05b84b824e6dad550d1986da698230fea91cf02b08a1df4b","o":11481504},{"u":"table_core.txt","h":"ea3b47a854275678188df90c07a45caaac174ded90e31227fa858faf83c5a2a6","o":241560},{"u":"tube_eau_pompe.txt","h":"49f098ef5f8fdff1f5470961e8b2a4382858f769131f8d3f0f3a2eefc945bb7d","o":2231320},{"u":"variante8_v8.txt","h":"f05a941cab7cff7d6d60c8128de164b754356a5bc8cb3ffe15be945a406958b8","o":216140},{"u":"voix/bloc_1.mp3","h":"db4a257e8039ad6f49d8a32419ed0765c9f72a503345d8d375afcb15b3609e5d","o":66814},{"u":"voix/bloc_2.mp3","h":"b2e2665266f61432efd7b2febdac2b68ef579610a3eb97598eac32a7851fac60","o":45184},{"u":"voix/bloc_3.mp3","h":"96a52f658e7f8020def4505a86221fe4c336d7a216421b57b226194b5d3ef428","o":88756},{"u":"voix/bloc_4.mp3","h":"1e09523e98495841d0dc6ad1365d364b0b93cb944f7ef9aba54f1436ae03111f","o":197530},{"u":"voix/bloc_5.mp3","h":"ae200f77b434e19499493b2caf19cb12e1fb2a5f18e7bcdc0f93ab8c3dd61d50","o":100668},{"u":"voix/bloc_6.mp3","h":"8aad9a5e9ea553cbb90c1bd5f51d38ca809d4b01f788f557c036fe7b7817c9cf","o":60231},{"u":"voix/bloc_7.mp3","h":"84b30beeb4f7d5a4f9fc593015205e0a8d0185760cf192be82834199ed0af67d","o":19793},{"u":"voix/bloc_8.mp3","h":"e10725db4c25bfd0605193f26d169c1802bc0922773847da2b127bc86f6d118e","o":188961},{"u":"voix/bloc_9.mp3","h":"b72979c85ac21902a0abd1759caf03aa8157574425192a0de082cb650bb3cdeb","o":100355},{"u":"voix/bloc_10.mp3","h":"d7d68bb4e3854782c3da34392da5455609bee745ecc899be7e39c6460d85498a","o":135777},{"u":"voix/bloc_11.mp3","h":"ad3b474bba0d5f5189e51015c9c7530eda8b1fff5a0e160532d4383be95d34ae","o":135463},{"u":"voix/bloc_12.mp3","h":"91ef989506081eac23902a6faa10088db366897bf0898955134c19285c544efa","o":103489},{"u":"voix/bloc_13.mp3","h":"462af3976f5f9a49a035cbe0d2c32b2a212d26d7ee0c36548bde69925182c890","o":43617},{"u":"voix/bloc_14.mp3","h":"ba2eb4cb10abd7260de1757f8e14561864e5edbf1d29029309bded76e225c79b","o":54275},{"u":"voix/bloc_15.mp3","h":"f1f839572a3a8eb8e4e188060a82b38d772f7ff2462398628619204d5bcfd56b","o":122611},{"u":"voix/bloc_16.mp3","h":"2ff82539e548de5d4bbec4fb05abfedeff8965d6dc62db2ebca65a739cfb2b17","o":194396},{"u":"voix/bloc_17.mp3","h":"ba8fc24c304f75621091b1de9831f658d3bb5d06c5d1b7135de3e8e42a038443","o":98787},{"u":"voix/bloc_18.mp3","h":"6f4b63c2e899ecf5a6018cb8504a4a7f49452c4fb2b6df227218da2e16edd9c3","o":125432},{"u":"voix/bloc_19.mp3","h":"ebdad3b6670c9af35ac7bad30edf80558b03041049b742bcb4293850fedbad27","o":23241},{"u":"voix/bloc_20.mp3","h":"af7a190d4c1fcd65e52eba52c5de48acac81df3e0109ac2b97bfa30145b640b8","o":84995},{"u":"voix/bloc_21.mp3","h":"e839adc6f33d2b89afe660eba0eed0d96528f4a5d47a85078fad064f67dd1249","o":153331},{"u":"voix/bloc_22.mp3","h":"db8264748e08645cc8f84d3275417dbbdb446f8e847abd0a9d211578ebceb7e1","o":33272},{"u":"voix/bloc_23.mp3","h":"ec580d52e392c437d90f7ec21533d805fd61b32d7261092d27177cf57c0bb937","o":105057},{"u":"voix/bloc_24.mp3","h":"4bfce9e33f6d24f66279542f16689c076261c4bdbd0407dbc8bc51e5e6f91a8c","o":132956},{"u":"voix/bloc_25.mp3","h":"43a141197765475d1409a5c47cefeb6304560e4ca8bd01f595c69a334095a386","o":123238},{"u":"voix/bloc_26.mp3","h":"a6e9e14fbec26d4e3610e81eb7d368b1a686e1051269ee9f1ff2d5737a4e250c","o":37347},{"u":"voix/bloc_27.mp3","h":"188d597f5fff34960dc049cbde42b4143118302a01b94626880db691598da1c2","o":72769},{"u":"voix/bloc_28.mp3","h":"8084c853bf8c1871253b937c1f0da12b435f9b1c314c4d0df7e594c0b33fe0ad","o":25749},{"u":"voix/bloc_29.mp3","h":"9745f756b2b70d1f6f0980d6ff3df33f9a2a6280694d9af457a476ad41115c5d","o":138598},{"u":"voix/bloc_30.mp3","h":"7b1c112be8a6b638823dcbf6ab9513295b6fe8fda400fac4ae3ac121733e4fa0","o":32959},{"u":"voix/bloc_31.mp3","h":"dd7ac7ec05d30493747045b2f96d4e3919c0324786a9448ee5651f5b038ac6db","o":253328},{"u":"voix/bloc_32.mp3","h":"e63da4eb212cf832db59070abdc6f6a10ab5d0bfb2ee4323101fed8312e4597f","o":19480},{"u":"voix/bloc_33.mp3","h":"b6ff190eda5220bc6d456d9af9a87a4c6a8147d48c6225d3fba1caac169d8386","o":337965},{"u":"voix/bloc_34.mp3","h":"cf35f83bdf765b97136ede73aa0b42d1ecefb06ee5cb9191613a13e9a1b4a4f5","o":30138},{"u":"voix/bloc_35.mp3","h":"5975854428a2f60a223246fd1d539194d3b4fe123731398baca50e0e9a49a308","o":206934},{"u":"voix/bloc_36.mp3","h":"4a47cecea4fb2f7ee4c5034c09c2fc340811c1819c9b7e1427f61f46bf2ee4f2","o":120103},{"u":"voix/bloc_37.mp3","h":"e3fb4123dd613dd0b2187f000838993ee34332914ff3e21968078b50da228269","o":16658},{"u":"voix/bloc_38.mp3","h":"cd15985b6b388258a7cbde5eec1790d74151596c1162d929975ddcca6ad21921","o":304737},{"u":"voix/bloc_39.mp3","h":"be6be9c8140c11947b4e5d76fccd5ae44c98ed980e154db1fbd7a9759c5c8e1b","o":168063},{"u":"voix/bloc_40.mp3","h":"ccfd7c33a317aa747957bfd9be08be5c6960e438b51df4c82f5aa545eb993e6e","o":155525},{"u":"voix/bloc_41.mp3","h":"f3bf809f6b7046b4f5a5aadf0511a521c1fbe24ef381ec0484232085fa8da499","o":26376},{"u":"voix/bloc_42.mp3","h":"bec2e23efeb743a7c8fd41a22789023a0db8346e530014ddff11e9b2b551bda5","o":160854},{"u":"voix/bloc_43.mp3","h":"3d8beb86a76d6b607f69e30e52c2dc7e1ded3610d11a7d72d19aac3b29a509b6","o":402120},{"u":"voix/bloc_44.mp3","h":"d0e8deb6d875608373b85a707156742a1601491123d480033bcfc3bec301f9c1","o":49573},{"u":"voix/bloc_45.mp3","h":"5049b26704996390c73d4ae6530671e06a7ae45df064023e0a70acb32707c1fe","o":188961},{"u":"voix/bloc_46.mp3","h":"67f5ac437027a1da5a6c1fb17ae7cf4d87bb2c14c85048114cade228569c5d4e","o":252074},{"u":"voix/bloc_47.mp3","h":"000ff6d07f3a18d0efa7e32b0e90021a8c6d92d84527572675d61f043db64aa9","o":20420},{"u":"voix/bloc_47a.mp3","h":"88c533b503288c83fc20bd717b4069bb596f85d14d17f9fb713082cacd5aa25e","o":55842},{"u":"voix/bloc_48.mp3","h":"0382d3842e9901aee2285de25d0951b058147cb11d984b3c903cf2a9cdae865f","o":388747},{"u":"voix/bloc_48a.mp3","h":"1d51da2d88f3f4dc9af7da3622a476da6093384b56c78a7849c45390c0f20037","o":364504},{"u":"voix/bloc_49.mp3","h":"6af580bb3a42e1fb67dc80ad1854617544119082761a89de1791aab3ea259777","o":251134},{"u":"voix/bloc_50.mp3","h":"8d7fb1089cc165e71110a2b39ab97252b0b2e45b507f1bfeec2a3b796f7e7c84","o":26689},{"u":"voix/bloc_51.mp3","h":"f8f52877c4a1f8db71826389ca9f3b55df08b5e03545e1c9e953498b9b8b6f8c","o":217592},{"u":"voix/bloc_52.mp3","h":"213b502293a42ae1318476cca70b0d3df7be8f1b9050f01d5f14568158920d93","o":161795},{"u":"voix/bloc_53.mp3","h":"e2d77a5c8935d9bd605e9f12e9e40279c8f172d249f20d0d9a3318eb43e81aa3","o":28884}];          // fichiers du site : { u: chemin relatif, h: empreinte SHA-256, o: octets }
const EXTERNES = ["https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/utils/SkeletonUtils.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/lines/LineSegmentsGeometry.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/lines/LineMaterial.js","https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/lines/LineSegments2.js"];    // scripts servis par un CDN (three.js)
const POLICES = "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap";      // feuille de style des polices (ou null)
const INDEX = "__index";
const ESSAI = String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);   // une installation = un essai ; apres un echec, plus aucun message de progression
let abandonne = false;

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
    fait += f.o; if (!abandonne) dit({ pwa: "progres", version: VERSION, essai: ESSAI, fait, total });
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

self.addEventListener("install", (e) => { e.waitUntil(installe().catch((err) => { abandonne = true; dit({ pwa: "echec", version: VERSION, essai: ESSAI, raison: String(err && err.message || err) }); throw err; })); });

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
