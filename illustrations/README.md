# Illustrations des cartes de cours

Couvertures des 6 niveaux du programme « Conseil en Stratégie ».

| Fichier | Niveau | Sujet |
|---|---|---|
| `niveau-1` | Introduction au conseil en stratégie | consultant devant un écran (mise en route) |
| `niveau-2` | Passage du screening et fondamentaux | CV / sélection |
| `niveau-3` | Montée en puissance sur les études de cas | analyse de données |
| `niveau-4` | Accélération de la préparation | progression en cours |
| `niveau-5` | Préparation aux derniers tours | entretien |
| `niveau-6` | Intégration d'un MBB | célébration d'équipe |

## Source et licence

[unDraw](https://undraw.co) — **licence MIT, libre, sans attribution requise**.
Récupérées via le miroir `cuuupid/undraw-illustrations` (les services
`undraw.co/api` et `undraw.oswaldlabs.com` ne répondent plus).

## Ce qui a été fait

1. Téléchargement des SVG d'origine.
2. **Recoloration** : la couleur d'accent unDraw `#6c63ff` (violet) remplacée par
   le bleu de marque PrepaStrat **`#507EC5`** (3 à 55 zones selon l'illustration).
3. Rendu en PNG **1000×1000, fond blanc**.

## 🔴 Pourquoi CARRÉ et pas 640×360

LearnWorlds conseille 640×360, mais `course-cards.js` affiche l'illustration dans
un **cercle de 180px** en `background-size:cover`
(règle `.lw-course-card > .learnworlds-image`). Une image 16:9 serait rognée sur
les côtés et perdrait son sujet ; un carré centré tombe juste.

## Utilisation

Dans LearnWorlds : cours → Paramètres du cours → **Général** → **Image** →
téléverser le PNG. Rien à coder.

## Régénérer après un changement de couleur de marque

Les SVG sources sont conservés ici. Remplacer la valeur, puis reconvertir :

```bash
# 1) recolorer (remplacer l'ancien accent par le nouveau)
sed -i '' 's/#507EC5/#NOUVELLE/gI' niveau-*.svg

# 2) SVG -> PNG carré (macOS : qlmanage pour le rendu, ImageMagick pour le cadrage)
for f in niveau-*.svg; do n="${f%.svg}"
  qlmanage -t -s 1400 -o /tmp "$f" >/dev/null 2>&1
  convert "/tmp/$f.png" -trim +repage -resize 900x900 \
          -background white -gravity center -extent 1000x1000 "$n.png"
done
```
