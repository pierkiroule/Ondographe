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

## Labo des résonances (optionnel)

Importer un son dans le labo pour obtenir automatiquement une empreinte fixe
et une version animée de 10 secondes. Le niveau, les variations et les passages
par zéro du signal déterminent la forme, l’espacement et le nombre de vagues ;
son enveloppe d’énergie devient une piste d’animation. Cette interprétation
est graphique et ne prétend pas identifier les sources sonores.

Les deux versions sont affichées et exportables séparément. « Retoucher au
pinceau », « Modifier l’animation » et « Revoir forme, trait et fond » reprennent
la proposition dans l’atelier. La sauvegarde conserve le projet avec sa version
fixe et ses clés d’animation. Le son reste local au navigateur et n’est pas inclus
dans le projet sauvegardé.

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

Les aperçus animés de l’atelier, du labo et de l’Ondothèque partagent la même
horloge de lecture. L’Ondothèque propose lecture/pause et retour au début pour
chaque animation. Le temps se suspend quand l’onglet du navigateur est masqué,
puis reprend sans saut au retour. Les aperçus fixes restent statiques.

À l’étape Animer, combiner le mouvement avec un mode d’apparition : Continu,
Résonance (pulsation), Écho (vagues successives), Émergence (révélation du centre
vers l’extérieur) ou Tracé (dessin progressif des contours). Les aperçus et les
exports animés suivent ce choix ; le SVG fixe reste entièrement visible.
Le labo propose par défaut une apparition Écho. Les anciennes clés de 30 secondes
sont recalées proportionnellement sur la boucle de 10 secondes à la lecture.
