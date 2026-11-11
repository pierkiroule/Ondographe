# L’Ondographe •°

Instrument graphique génératif des Sourciers du vivant.

## Démarrer

```bash
npm install
npm run dev
```

## Production et tests

```bash
npm run build
GITHUB_PAGES=true npm run build
node --test tests/*.test.js
npm run preview
```

## Un parcours en cinq étapes

1. **Composer** : choisir le style de trait, le fond, la forme de l’onde,
   l’épaisseur, l’espacement et la complexité (nombre de vagues). Le bleu papier
   et les traits blancs embossés s’inspirent du dossier « Oreillez-vous ».
2. **Résonance** : déformer les lignes au doigt ou à la souris avec un pinceau
   de taille et d’intensité réglables. Son contour indique le rayon d’action.
   Le déplacement du centre, l’annulation du dernier geste complet et la
   réinitialisation restent disponibles. Aucun masque n’efface les tracés.
3. **Valider le fixe** : conserver une version fixe distincte des réglages
   d’animation. Une retouche de la géométrie ou de la matière invalide cette
   validation ; il faut alors valider à nouveau avant l’animation ou les exports.
4. **Animer** : choisir Respiration, Dérive, Orbite, Balancement ou Ondulation,
   en boucle de 10 secondes. Les images clés et leurs courbes Bézier sont
   modifiables après le choix. L’animation peut aussi être ignorée.
5. **Exporter** : SVG fixe validé, SVG animé, SVG noir sans fond pour la gravure,
   projet JSON modifiable et sauvegarde dans l’Ondothèque. Les modifications
   des images clés ne changent pas la version fixe validée.

## Audio réactif dans l’atelier

L’étape Animer propose deux entrées : mouvements prédéfinis et audio réactif.
Dans le mode audio, importer un sample (lu en boucle) ou activer le microphone.
L’autorisation micro est demandée uniquement après un clic explicite. Le micro
n’est jamais renvoyé vers les haut-parleurs. Le sample est audible pendant sa lecture.

Sensibilité, douceur et intensité règlent la réaction : volume → amplitude,
graves → dilatation, aigus → vibration. Les modes d’apparition restent
combinables : Continu, Résonance, Écho, Émergence ou Tracé.

« Capturer 10 secondes » transforme la réaction en pistes d’images clés. La
capture revient progressivement à ses valeurs initiales en fin de boucle.
Elle est rejouable, modifiable et exportable comme les animations prédéfinies.
Le SVG contient le mouvement capturé, sans incorporer le son. Le SVG fixe validé
reste indépendant de cette capture. Les exports demandent d’abord une capture ou
l’arrêt du direct.

Changer de mode ou d’étape, arrêter le son ou quitter l’atelier coupe la source
et libère le microphone. Le traitement reste local ; aucun fichier sonore n’est
téléversé ni ajouté au projet sauvegardé. Le micro nécessite HTTPS (ou localhost)
et un navigateur compatible. L’ancien labo séparé est supprimé.

La barre d’étapes permet de revenir sur chaque choix sans recommencer. L’aperçu
reste visible pendant les réglages, y compris sur mobile. L’aperçu agrandi utilise
le même temps de lecture. Les exports reprennent le style, le papier et les clés ;
le mouvement est échantillonné tous les 0,125 s et aux temps exacts des clés.
Les cinq préréglages bouclent ; en édition libre, conserver les mêmes valeurs
aux clés de 0 et 10 secondes pour une boucle sans rupture.

Les sons importés sont analysés dans le navigateur sans téléversement.
L’Ondothèque utilise localStorage ; exporter les projets ou la collection pour
une conservation indépendante du navigateur. Un projet JSON peut être réimporté
et repris depuis l’Ondothèque. Les anciennes œuvres sont compatibles avec les
nouveaux motifs et peuvent être reprises pour édition.

Les aperçus animés de l’atelier et de l’Ondothèque partagent la même
horloge de lecture. L’Ondothèque propose lecture/pause et retour au début pour
chaque animation. Le temps se suspend quand l’onglet du navigateur est masqué,
puis reprend sans saut au retour. Les aperçus fixes restent statiques.

À l’étape Animer, combiner le mouvement avec un mode d’apparition : Continu,
Résonance (pulsation), Écho (vagues successives), Émergence (révélation du centre
vers l’extérieur) ou Tracé (dessin progressif des contours). Les aperçus et les
exports animés suivent ce choix ; le SVG fixe reste entièrement visible.
Les anciennes clés de 30 secondes
sont recalées proportionnellement sur la boucle de 10 secondes à la lecture.

Dans Composer, choisir le format de page : A4 portrait/paysage (en mm), carré,
Instagram portrait, Story/Reel, publication ou couverture LinkedIn, bannière ou
dimensions personnalisées en px/mm. L’échelle, la rotation et les positions
horizontale/verticale du motif se règlent indépendamment du fond. Le pinceau et
le déplacement du centre tiennent compte de ce placement. L’export conserve les
dimensions physiques, le rapport de page et le placement, en fixe comme en animé.
Les dimensions personnalisées sont limitées à 1–20 000 unités par côté ; changer
l’unité réinterprète les valeurs saisies dans l’unité choisie.

Les réglages numériques utilisent des sliders avec leur valeur affichée, dont
les dimensions personnalisées et le temps/la valeur des images clés. Les formats
prédéfinis affichent un résumé ; « Personnaliser » ouvre les dimensions, avec une
plage standard et une option Grand format. Le placement du motif est repliable.
Les sliders restent réglables au clavier avec les flèches.

Un tutoriel court s’ouvre au lancement. « Ne plus afficher au lancement » mémorise
la préférence dans le navigateur ; le bouton Aide permet de rouvrir le guide.
