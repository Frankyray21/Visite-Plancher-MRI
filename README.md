# Visite Plancher MRI

Visite 3D de la galerie et du plancher de foreuse, étape par étape (PRO-DD-ST-003).
Application web installable, qui fonctionne sans réseau une fois son contenu téléchargé.

Projet d'études, non commercial.

## Ce dépôt est fabriqué

Aucun fichier ne se modifie à la main : tout sort de la chaîne de construction de la visite (outils gardés hors de ce dépôt).

```sh
node fabrique_pwa.js <dossier de la page construite> <ce dossier>
```

| Fichier | Rôle |
| --- | --- |
| `index.html` | La page de la visite, avec le bouton « Installer » et l'état « hors ligne » |
| `sw.js` | Service worker : met tout le site en cache, vérifie chaque fichier (SHA-256) |
| `manifest.webmanifest`, `icones/` | Ce qu'il faut pour installer l'application |
| `*.txt` | Modèles 3D et textures (GLB et JPEG en base 64) |
| `version.json` | Version du site (numéro de la page et empreinte du contenu) |
| `.gitattributes` | Interdit à git de convertir les fins de ligne : les empreintes en dépendent |

## Hors ligne

À la première visite, le service worker télécharge tout le site (environ 58 Mo) et l'application affiche
« hors ligne ✓ » à côté de sa version quand chaque fichier est vérifié dans le cache. Une nouvelle version
s'installe en arrière-plan ; l'application propose alors « Nouvelle version : recharger ».

three.js vient de jsDelivr et les polices de Google Fonts ; les deux sont aussi mis en cache.

## Vérifier

```sh
node verifie_depot.js <ce dossier>
node essai_pwa.js <ce dossier> <dossier des images> pc
```

## Crédits et licences

Ils sont dans l'application, sous le mot « Crédits » en bas de l'écran. Les modèles, textures et mouvements
de tiers ne sont fournis que pour faire fonctionner cette visite : ne pas les réutiliser ailleurs.
