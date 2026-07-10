# lw-course-cards

Style (CSS/JS) des cartes de cours LearnWorlds — design type monday, dynamique.
Cible l'élément natif "Courses" et affiche les vrais cours automatiquement.

## Utilisation
Dans LearnWorlds → Code personnalisé de la page (ou du site), coller :

```html
<script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/course-cards.js"></script>
```

- **Rollback** : remplacer `@main` par un tag/commit (ex. `@v1`).
- **Cache jsDelivr** : purge automatique après un push (quelques minutes), ou ajouter `?v=2`.

Pré-requis de contenu : le titre de chaque cours au format `Niveau #N - Nom du cours`.
