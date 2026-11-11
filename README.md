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

## Un parcours en quatre étapes

1. **Forme & matière** : choisir un motif parmi Tourbillon, Boucle, Double foyer,
   Arche, Selle et Rosace ; choisir le trait (empreinte embossée, encre, pointillé),
   son épaisseur et le fond. Le bleu papier et les traits blancs en relief
   s’inspirent du dossier « Oreillez-vous ». Le grain de papier est facultatif.
2. **Sculpter** : travailler une seule image statique au doigt ou à la souris,
   déplacer le centre, régler l’espacement des lignes et l’ouverture du motif.
   Le centre ne masque et n’efface aucun tracé : l’ouverture vient de la géométrie.
   Annulation du dernier geste complet et réinitialisation disponibles.
3. **Animer**, en option : choisir Respiration, Dérive, Orbite, Balancement ou
   Ondulation. La boucle de 30 secondes démarre sans réglage préalable. Ouvrir
   « Modifier les images clés » après le choix pour ajuster les valeurs et les
   courbes Bézier. L’animation conserve la sculpture et la matière choisies.
   « Continuer sans animation » conduit directement aux exports statiques.
4. **Exporter** : SVG statique, SVG animé si choisi, SVG noir sans fond pour la
   gravure, projet JSON modifiable et sauvegarde dans l’Ondothèque.

La barre d’étapes permet de revenir sur chaque choix sans recommencer. L’aperçu
reste visible pendant les réglages, y compris sur mobile. L’aperçu agrandi utilise
le même temps de lecture. Les exports reprennent le style, le papier et les clés ;
le mouvement est échantillonné tous les 0,25 s et aux temps exacts des clés.
Les cinq préréglages bouclent ; en édition libre, conserver les mêmes valeurs
aux clés de 0 et 30 secondes pour une boucle sans rupture.

Les sons importés sont analysés dans le navigateur sans téléversement.
L’Ondothèque utilise localStorage ; exporter les projets ou la collection pour
une conservation indépendante du navigateur. Un projet JSON peut être réimporté
et repris depuis l’Ondothèque. Les anciennes œuvres sont compatibles avec les
nouveaux motifs et peuvent être reprises pour édition.
