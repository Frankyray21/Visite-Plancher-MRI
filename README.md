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

À la première visite, le service worker télécharge tout le site (environ 120 Mo) et l'application affiche
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
construction : `index.html`, `sw.js` et `version.json` ont alors reçu une nouvelle empreinte (`157-63fd50dc`). À reporter dans la source de la visite
avant la prochaine fabrication, sinon les voix disparaîtront.

## Sol de la galerie

Le sol de la galerie est une boue piétinée scannée (« Brown Mud 03 », Poly Haven, CC0), teintée en gris comme le roc, posée par-dessus le sol
fabriqué, qui garde ses flaques, ses ornières et ses éboulis. Le relief du scan sert trois fois : parallaxe (empreintes de bottes en creux,
mode normal, à moins de 7 m), bord des flaques (l'eau remplit d'abord les creux) et dépôts de cuttings, la boue fine grise du forage, autour
des flaques et dans les creux humides (mouillée et sombre au bord de l'eau, sèche et pâle plus loin).

Quatre fichiers `sol_boue_*.txt` : clarté, rugosité et occlusion (`cro`), normales et relief (`nnr`), en 1K puis en 2K quand le relevé du roc
passe lui-même en 2K. Deux textures seulement : le nuanceur du sol en lisait déjà 15 et beaucoup d'appareils en acceptent 16 ; avec le scan
il en lit toujours 15. Si un fichier manque ou si le nuanceur ne compile pas, la page garde le sol fabriqué. Tout se règle et se coupe dans
`ROC` (`SOL_SCAN`, `CUTTINGS`, `FLAQUES_RELIEF`…), dans `index.html`.

Comme les voix, ce sol a été ajouté à la version 157 déjà déployée, hors de la chaîne de construction (`patch_sol_scan`, 2026-11-24) :
`index.html`, `sw.js` et `version.json` portent une nouvelle empreinte (`157-99f946da`). À reporter dans la source de la visite avant la
prochaine fabrication, sinon le sol scanné disparaîtra.

## Rack à boîtes à carottes et palette (version 164)

À l'entrée de la place de travail, contre la paroi de gauche, la pile de 3 × 8 rangée laisse la place au rack à boîtes à carottes du dépôt
pieces-3d (modèle `rack-core-box`, P01 : rack plein, 5 boîtes de large et 8 de haut) ; en face, contre la paroi de droite, 20 boîtes vides du
même modèle, sans couvercle, sur une palette de bois de 60 × 48 po. Les deux arrivent avec l'équipement (étape 18) et se déplacent comme les autres
pièces. L'escalier reste libre : le rack commence à 0,9 m de son pied et l'allée garde 1,8 m entre le rack et la palette. Pendant la démonstration
« Levage et transport », la pile revient à la place où le travailleur prend sa planche et le rack s'efface le temps de la démonstration.

Fichiers `rack_core_box.txt` et `palette_boites.txt` (GLB en base 64, mailles fusionnées par matière, coordonnées de texture du bois calculées
pièce par pièce), module `inter_rack_core_v164.js` et deux lignes de `PIECES` dans `index.html`. Comme les voix et le sol scanné, ils ont été
ajoutés à la page déjà construite, hors de la chaîne de construction : `index.html`, `sw.js` et `version.json` portent une nouvelle empreinte
(`164-e9e030c0`). À reporter dans la source de la visite avant la prochaine fabrication, sinon le rack et la palette disparaîtront.

Version 165 (demande de l'utilisateur : « le rack nuit accès marche » et « prend [les boîtes] qu'on utilise sur la table à core ») : le rack est
tourné le long de la paroi de gauche et avancé vers l'entrée (x 12,4 à 14,0 m, z 0,92 à 2,11 m) ; le pied des marches est dégagé sur 1,8 m.
Toutes les boîtes sont maintenant celles de la table à carottes (1,50 × 0,197 × 0,060 m, 3 rangées NQ) : la page copie les triangles de la
boîte pleine du milieu de la table (40 boîtes dans le rack, 5 par étage sur 8) et de la boîte vide du fond
(60 boîtes sur la palette, 5 de large sur 12 de haut, « fait x3 en hauteur ») ; toutes sont fermées par un couvercle (« les boîtes ne doivent pas être ouvertes »). Le rack du dépôt pieces-3d a été recalculé pour 5 de ces boîtes par étage (1,19 m de
large) ; `rack_core_box.txt` n'a plus que la plate-forme, les arceaux et les couvercles, `palette_boites.txt` la palette de 60 × 40 po et ses 60 couvercles. Version 166 : boîtes fermées (couvercles) et palette trois fois plus haute (12 boîtes de haut). Empreinte `166-60c7b1b3`.

## Boyaux du poste de commande et power pack (version 167)

D'après les photos de l'arrière du poste de commande de la STM-1500 : sur les 9 traversées du panneau arrière (pression, retour et drain du
groupe, rotation A et B, quatre boyaux du traîneau), un raccord rapide (coupleur femelle six-pans, manchon moleté, nez du mâle), dont deux
avec une étiquette jaune ; ils sont enfants de la console et la suivent dans le mode Déplacer. Les boyaux posés au sol serpentent de 5,5 cm
de part et d'autre de leur tracé, en phase d'un boyau à l'autre : le faisceau ondule sans que les boyaux se croisent ; l'ondulation s'efface
aux bouts et près de la clôture. La DR1500-U n'a aucune connexion hydraulique sur sa console : pas de raccords, ses conduits ondulent comme
les autres.

Le power pack de la STM-1500 (`groupe_hydraulique.txt`, cotes du manuel : cadre 1,405 m) est réduit à 0,85 : cadre à 1,19 m, sous le dessus du
caisson de la console (48 po), oreilles de levage à 1,32 m, sous le haut du poste (1,50 m). Il garde son coin au bout du plancher, contre la
clôture ; les bouts des boyaux qui y arrivent suivent la réduction.

Module `inter_boyaux_console_v167.js` dans `index.html` (tout se coupe par `v167Conf().ACTIF`), deux appels dans la fabrication des conduits et
le chargement des équipements. Comme le rack, ajouté à la page déjà construite, hors de la chaîne de construction : `index.html`, `sw.js` et
`version.json` portent l'empreinte `167-60c7b1b3`. À reporter dans la source de la visite avant la prochaine fabrication, sinon les raccords,
l'ondulation et la réduction du power pack disparaîtront.

## Vérifier

```sh
node verifie_depot.js <ce dossier>
node essai_pwa.js <ce dossier> <dossier des images> pc
```

## Crédits et licences

Ils sont dans l'application, sous le mot « Crédits » en bas de l'écran. Les modèles, textures et mouvements
de tiers ne sont fournis que pour faire fonctionner cette visite : ne pas les réutiliser ailleurs.
