# lw-course-cards

Style (CSS/JS) des cartes de cours LearnWorlds — design type monday, dynamique.
Cible l'élément natif "Courses" et affiche les vrais cours automatiquement.

## Utilisation
Les fichiers sont servis par **GitHub Pages**. Dans LearnWorlds → **Code personnalisé** de la page
(ou du site pour `mega-menu.js` et `account-page.js`), coller :

```html
<script src="https://extremum84.github.io/lw-course-cards/course-cards.js"></script>
```

⚠️ Toujours dans le **Code personnalisé** (Réglages de la page / du site), **jamais** dans un élément
« HTML » du Site Builder : les `<script>` y sont inertes.

- **Déploiement** : `git push`. C'est tout — pas de purge, pas de tag. En ligne 1-2 min après le push
  (déploiement Pages) + 10 min de cache navigateur max. Les balises `<script>` ne changent jamais.
- **Rollback** : revenir au commit voulu et pousser (les tags `v2`→`v5` restent des points de repère
  datés).

### 🔴 Ne pas revenir à jsDelivr
jsDelivr a été **abandonné le 16/07/2026** : il servait `@main` **figé 12 commits en arrière**
(deux régressions en prod dans la même journée). La purge ne sert à rien — ce n'est pas le cache
edge qui est périmé mais la résolution `branche → commit` **côté origine jsDelivr**, gelée ~12h et
que rien ne force (jsDelivr ne connaît vraiment que les **tags**). Et `raw.githubusercontent` est
servi en `text/plain` + `nosniff` : le navigateur refuse de l'exécuter.

Pré-requis de contenu : le titre de chaque cours au format `Niveau #N - Nom du cours`.
