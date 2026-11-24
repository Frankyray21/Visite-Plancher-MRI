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
| `voix/` | Voix de la visite narrée : un fichier `bloc_<id>.mp3` par bloc du script de narration (55 blocs, version 25) |
| `version.json` | Version du site (numéro de la page et empreinte du contenu) |
| `.gitattributes` | Interdit à git de convertir les fins de ligne : les empreintes en dépendent |

## Hors ligne

À la première visite, le service worker télécharge tout le site (environ 113 Mo) et l'application affiche
« hors ligne ✓ » à côté de sa version quand chaque fichier est vérifié dans le cache. Une nouvelle version
s'installe en arrière-plan ; l'application propose alors « Nouvelle version : recharger ».

three.js vient de jsDelivr et les polices de Google Fonts ; les deux sont aussi mis en cache.

## Visite narrée

Sur l'accueil, le bouton « Visite narrée » construit le plancher puis enchaîne les 55 blocs du script : la caméra suit les plans de chaque
étape et les voix jouent (formateur et apprenti, environ 9 minutes). À la place des sous-titres, un fil en haut situe la partie en cours
(sept parties, d'« Avant de construire » à « À retenir »), une carte donne l'étape, et une carte annonce chaque partie avec ses étapes. L'adresse terminée par `#video` fait le même
parcours sans l'interface, pour enregistrer une vidéo : un bouton « Lancer la visite narrée » attend un clic, exigé par les navigateurs avant
de jouer du son.

Les voix et leurs modules (`inter_voix_v157.js` et `inter_sequence_v157.js`, dans `index.html`) ont été ajoutés à la version 157 déjà déployée, hors de la chaîne de
construction : `index.html`, `sw.js` et `version.json` portent une nouvelle empreinte (`157-63fd50dc`). À reporter dans la source de la visite
avant la prochaine fabrication, sinon les voix disparaîtront.

## Vérifier

```sh
node verifie_depot.js <ce dossier>
node essai_pwa.js <ce dossier> <dossier des images> pc
```

## Crédits et licences

Ils sont dans l'application, sous le mot « Crédits » en bas de l'écran. Les modèles, textures et mouvements
de tiers ne sont fournis que pour faire fonctionner cette visite : ne pas les réutiliser ailleurs.
