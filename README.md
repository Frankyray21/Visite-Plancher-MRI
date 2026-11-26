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
large) ; `rack_core_box.txt` n'a plus que la plate-forme, les arceaux et les couvercles, `palette_boites.txt` la palette de 60 × 40 po et ses 60 couvercles. Version 166 : boîtes fermées (couvercles) et palette trois fois plus haute (12 boîtes de haut). Version 168 : rack bleu au complet, deux passages de fourche en travers des boîtes (modèle pieces-3d corrigé), tourné de 180°. Version 183 : tourné de 90° (« pour que les fourches puissent rentrer dans les trous sous le rack ») : passages de fourche le long de la galerie, ouverts vers l'entrée ; x 12,85 à 14,03 m, z 0,50 à 2,10 m. Empreinte `166-60c7b1b3`.

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

## Affiches sur la porte grillagée (version 169)

D'après les photos de François, deux affiches de Machines Roger International sont fixées au grillage du battant de la porte de la cage
(`porte_1801020.txt`), au milieu de sa largeur, du côté de l'entrée quand la porte est fermée :

- « Production sécuritaire » : panneau blanc usé à bordure rouge (46 × 31 cm), dans le bas du battant (centre à 0,45 m du plancher,
  version 171 ; à 1,50 m en version 169). La photo est redressée en
  perspective ; le bord tordu et le grillage visible derrière deviennent transparents (masque).
- Au-dessus, l'avis « IMPORTANT » (feuille lettre, 21,6 × 29,9 cm, centre à 1,83 m) : interdiction d'utiliser la foreuse si les dispositifs
  d'interverrouillage sont défectueux, inactifs ou mis hors service ; approche à moins de 1,5 m seulement en mode « handling ».

Les deux images (JPEG en base 64) sont dans `index.html`, module `AFFICHE_V169` (coupé par `AFFICHE_V169.ACTIF = false`), appelé dans
`rhabilleCage` quand le battant est en place. Les affiches suivent le battant, ne reçoivent pas d'ombre (à 6 mm du grillage, ses fils y
dessinaient une grille d'ombre) et ne bloquent ni les rayons ni le passage. Ajouté à la page déjà construite, hors de la chaîne de
construction : empreinte `169-a00cbb9c`. À reporter dans la source de la visite avant la prochaine fabrication.

## Bac de rétention et chaudières d'huile (version 170)

Demande de l'utilisateur (2026-11-25) : « ajoute aussi bac de rétention avec max 5 chaudière huile 5 gallons ». Modèle `chaudieres-5-gal`, P02,
du dépôt pieces-3d : le mini bac de rétention 100 L (modèle `bac-retention-100l`, 990 × 645 mm, caillebotis, affiche « MAX 100 LITRES ») et
5 chaudières d'huile hydraulique de 5 gallons, fermées (5 × 18,9 L = 94,6 L, sous les 100 L du bac ; d'où le maximum de 5), 3 au fond et 2 devant.
Sur le sol de la galerie, contre la paroi de droite, entre le tube à l'eau et la palette de boîtes vides (x 11,16 à 11,80 m, z −2,42 à −1,44 m),
à environ 2 m du power pack ; les étiquettes regardent le plancher. L'allée et le pied de l'escalier restent libres. Il arrive avec l'équipement
(étape 18) et se déplace comme les autres pièces.

Fichier `bac_huile.txt` (GLB en base 64 exporté dans un navigateur pour garder les étiquettes dessinées, mailles fusionnées par matière,
facettes allégées de moitié) et une ligne de `PIECES` dans `index.html`. Comme le rack à boîtes, ajouté à la page déjà construite, hors de la
chaîne de construction : empreinte `170-d324417e`. À reporter dans la source de la visite avant la prochaine fabrication.

## Prise 600 V du power pack (version 172)

Demande de l'utilisateur (2026-11-25) : « j'ai ajouté connecteur prise 600 V dans le dépôt pièces 3D, ajoute-le au 3D place de travail, qu'il se
connecte au power pack en descendant d'en haut du bac en longeant paroi ». Modèle `coupleur-quik-loc`, P01, du dépôt pieces-3d : coupleur
Quik-Loc 600 V de Crouse-Hinds, 4/0 AWG 325 A (fiche femelle en haut, fiche mâle en bas, support en inox fabriqué à la mine), exporté tel quel
(`scripts/export-glb.mjs`) dans `coupleur_600v.txt`. Il pend à la verticale contre le grillage de la paroi de droite, au-dessus du bac (tube à
l'eau, x 10,45 m, bague à 1,85 m), tiges à crochet côté paroi. Le câble portatif 3 × 4/0 (Ø 57 mm) arrive de la galerie d'accès le long du haut
de la paroi de droite (3,3 m, attaché au grillage tous les 1,5 m), descend la paroi jusqu'à la fiche femelle ; de la fiche mâle, il descend
encore, longe la paroi jusqu'au bout du power pack côté bac, longe ce bout et entre dans l'armoire électrique par la face du bout
(presse-étoupe). La paroi est relevée par rayons : le câble la suit à 5 cm. Visible avec l'équipement (étape 18) ; le bout qui entre au groupe
est refait si on déplace le groupe.

Version 174 (utilisateur : « le câble 600 V est jaune », puis « n'est pas à l'échelle, trop gros ») : gaine jaune ; coupleur réduit à 0,65
(`K.ECHELLE`), soit la taille #2 AWG 160 A du même catalogue (Ø 106 × 362 mm par fiche au lieu de Ø 163 × 557 mm), et câble de Ø 37 mm
(3 × #2 AWG) au lieu de 57 mm.

Module `inter_cable_600v_v172.js` dans `index.html` (tout se coupe par `K.ACTIF`), ajouté à la page déjà construite, hors de la chaîne de
construction : empreinte `172-eff0cc19`. À reporter dans la source de la visite avant la prochaine fabrication.

## Carte de travail sur le power pack (version 175)

Demande de l'utilisateur (2026-11-25) : « ajoute la carte de travail sur le power pack derrière le siège du foreur fait dans le dépôt pièces 3D ».
Modèle `carte-forage-dd`, P01, du dépôt pieces-3d : formulaire MA4657078 « Forage au diamant sous-terre » de Machines Roger International,
feuille lettre pliée en deux (carte fermée de 5 1/2 × 8 1/2 po). Comme sur la photo du poste, la carte est rangée dans une pochette de
plastique transparent (6 1/4 × 9 1/2 po) fixée sur la face du power pack tournée vers la chaise de l'opérateur, en haut (centre à 0,86 m du
plancher), près du montant côté paroi ; la couverture se lit depuis le siège. La face est relevée par rayons (pochette à 4 mm de la tôle) et
la pochette est un enfant du groupe : elle le suit dans le mode Déplacer. Couverture (moitié droite de la page 1 du PDF) dans
`carte_travail.txt` (JPEG 1024 × 1582 en base 64) ; le dos est contre la tôle, donc absent.

Module `inter_carte_travail_v175.js` dans `index.html` (tout se coupe par `K.ACTIF`), ajouté à la page déjà construite, hors de la chaîne de
construction : empreinte `175-f7697287`. À reporter dans la source de la visite avant la prochaine fabrication.

## Dix modèles de pieces-3d ajoutés (version 185)

Demande de l'utilisateur (2026-11-26), devant la liste des modèles du dépôt pieces-3d absents de la place de travail : « ajoute 1, 2, 3, 6, 7, 8,
10, 11, 12, 13 ». Chaque objet est exporté de pieces-3d tel quel (P01, facettes à 0,5, mailles fusionnées par matière, GLB en base 64) :

| Objet (modèle pieces-3d) | Fichier | Place |
| --- | --- | --- |
| Trousse de déversement Zenith, baril de 30 gal (`trousse-deversement-zenith`) | `trousse_deversement.txt` | Sol de la galerie, paroi de droite, entre la palette de boîtes vides et la barricade, à 2 m du bac d'huile |
| Arrêt d'urgence à câble de la STM-1500 (`stm-1500`, P023 et P025) | `arret_urgence_cable.txt` | Flanc −Z du mât, sur la foreuse fixe (pose de rig.js à −30°) et sur l'os `Mat` de la STM articulée (écran Angle de forage) |
| Pistolet à graisse Lincoln 1142 (`pistolet-graisse-1142`) | `pistolet_graisse.txt` | Sur le dessus du coffre |
| Niveau à degrés Tajima (`niveau-a-degres`, `outil()` et `niveler()`) | `niveau_degres.txt` | Aimanté au poteau du rack à tiges côté allée ; la fiole est de niveau, l'aiguille lit l'angle du poteau (75,7°) |
| Clé à tube au carbure N (`cle-a-tube`), pince pour tube intérieur (`pince-tube-interieur`), blocs de bois (`blocs-de-bois`), ruban de cerclage Uline S-5736 (`ruban-cerclage-s5736`) | `cle_a_tube.txt`, `pince_tube.txt`, `blocs_bois.txt`, `ruban_cerclage.txt` | Tablette du bas de la table à carottes |
| Boîte à lunch de mineur (`boite-lunch-mineur`), boulon d'ancrage TIME 83-52 de 5 pi (`boulon-ancrage-time`) | `boite_lunch.txt`, `boulon_ancrage.txt` | Sol de la galerie, paroi de gauche, avant le rack à boîtes à carottes |

La trousse, le boulon et la boîte à lunch se déplacent comme les autres pièces ; les objets posés sur le coffre, la table et le rack sont leurs enfants
et les suivent. Visibles avec l'équipement (étape 18). Module `inter_pieces_v185.js` dans `index.html` (tout se coupe par `K.ACTIF`), et deux lignes
dans `inter_angle_stm_v147.js` (`K.matMonde`, appel de `surArticulee`). Ajouté à la page déjà construite, hors de la chaîne de construction :
empreinte `185-5a8dd56c`. À reporter dans la source de la visite avant la prochaine fabrication.

## Vérifier

```sh
node verifie_depot.js <ce dossier>
node essai_pwa.js <ce dossier> <dossier des images> pc
```

## Crédits et licences

Ils sont dans l'application, sous le mot « Crédits » en bas de l'écran. Les modèles, textures et mouvements
de tiers ne sont fournis que pour faire fonctionner cette visite : ne pas les réutiliser ailleurs.
