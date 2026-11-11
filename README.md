# L'Ondographe •°
Instrument graphique génératif des Sourciers du vivant.

## Démarrer

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

Fonctions : accords d'emojis, une proposition SVG sculptable, sculpture tactile, import audio et analyse locale, sauvegarde locale dans l'Ondothèque, exports SVG fixes et animés.

Les fichiers audio sont analysés dans le navigateur et ne sont pas téléversés. L'Ondothèque utilise localStorage : exportez vos œuvres pour les conserver indépendamment du navigateur.

## Animation

Choisir « Animé » dans Mouvement pour ouvrir la timeline de 30 secondes sous l’œuvre.
Déplacer la tête de lecture puis ajouter une image clé sur les pistes Vitalité,
Organicité ou Complexité. Sélectionner un losange pour modifier son temps, sa valeur
et la courbe Bézier vers la clé suivante (préréglages ou quatre curseurs).
Lecture et aperçu agrandi partagent le même temps. Les clés sont conservées dans
l’Ondothèque et utilisées par l’export SVG animé, échantillonné à 0,25 s ainsi
qu’aux temps exacts des clés. Pour une boucle sans rupture, donner aux clés de
0 et 30 secondes les mêmes valeurs. La densité reste constante pendant la lecture.

Tests de l’interpolation : `node --test tests/animation.test.js`.
