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

## Contenu de la home : c'est le Site Builder qui commande
Les sections refaites par `home-page.js` (mur de cabinets, timeline « Notre histoire »,
équipe, « Quel candidat êtes-vous ? ») **lisent le contenu natif du builder** et se
refont dès qu'il change. Écrire le texte dans le builder suffit : pas de déploiement.

Ce qui ne s'extrait pas d'une mise en page (des pourcentages, des étiquettes) passe par
une **clé explicite**, à écrire dans un bloc de texte de la page — le bloc est masqué
aux visiteurs, et le configurateur peut fournir les mêmes clés :

```
#profils_repartition : Fin d'études 40, M1 & césure 15, MBA 11
#profils_chips_juniors : M1 & césure, Fin d'études
#profils_chips_experimentes : Docteur (PhD), MBA, En poste
#lien_video : https://vimeo.com/…
```

Une clé absente ou vide garde la valeur d'origine — jamais de section vide.

**Vérifier d'où vient ce qui s'affiche** : `PS_HOME_SOURCE()` dans la console de la home
répond bloc par bloc (« builder » ou « repli en dur ») et donne la version du fichier
exécuté. À l'œil, un repli et une lecture réussie se ressemblent exactement : c'est ce
qui a fait passer inaperçu, longtemps, le fait que les modifications n'arrivaient pas.
