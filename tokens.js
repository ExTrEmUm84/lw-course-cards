/* ============================================================
   TOKENS — le design system PrepaStrat en un seul endroit
   ------------------------------------------------------------
   À charger dans le Code personnalisé du SITE (Réglages du SITE, à côté de
   `mega-menu.js`), pour qu'il soit présent sur TOUTES les pages :
     <script src="https://extremum84.github.io/lw-course-cards/tokens.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr (abandonné le 16/07 : `@main` figé 12h en
   arrière, deux régressions en prod le même jour). Déploiement = `git push`.

   À QUOI ÇA SERT : changer une valeur ICI la change sur toutes les pages d'un
   coup. Avant, le violet `#6161FF` était écrit en dur 34 fois dans 9 fichiers.

   🔴 CHAQUE `var()` DES AUTRES FICHIERS PORTE SA VALEUR EN REPLI :
       `color:var(--ps-accent,#6161FF)`
   Donc si CE fichier ne charge pas (oubli dans le code du site, panne de
   Pages…), **rien ne casse** : chaque page retombe exactement sur les valeurs
   d'avant. Ne jamais retirer ces replis : ils sont le filet de sécurité de tout
   le système. Ils doivent rester égaux aux valeurs ci-dessous.

   ------------------------------------------------------------
   🔴🔴 LE BLOC DE VALEURS PLUS BAS EST RÉÉCRIT PAR MACHINE.
   Le configurateur (`configurateur.html`, bouton « Publier ») remplace TOUT ce
   qui se trouve entre les balises `>>> DEBUT TOKENS` et `<<< FIN TOKENS` via
   l'API GitHub. **N'y mettre AUCUN commentaire ni aucune logique : ils seraient
   effacés au prochain clic sur Publier.** Tout ce qu'il faut expliquer se met
   ICI, au-dessus. Les marqueurs eux-mêmes ne doivent jamais être renommés.
   ------------------------------------------------------------

   CE QU'IL FAUT SAVOIR SUR LES VALEURS :

   - `--ps-accent-rgb` = les CANAUX du violet, pour les `rgba()` : une variable
     ne peut pas être glissée dans `rgba(#hex, .18)`. C'est la lueur des cartes
     cours qui s'en sert. 🔴 DOIT rester synchronisé avec `--ps-accent` — le
     configurateur le DÉRIVE tout seul, à la main il faut y penser.

   - `--ps-r-card` commande AUSSI le liseré de la page Cours, dont le rect est
     tracé à `calc(var(--ps-r-card) - 2px)` pour rester concentrique.

   - `--ps-lvl1..6` (+ `-tint`) : pastille « Niveau N » et barre de progression,
     page Cours. Le niveau 1 SUIT la marque (`var(--ps-accent-hover)`) : changer
     l'accent recolore sa pastille. C'était déjà le cas de fait (mêmes valeurs),
     c'est désormais explicite.

   - `--ps-f1..6` (+ `-tint`) : cycle des pastilles de champs, fiches secteur.
     Le champ 1 suit la marque, comme le niveau 1. ⚠️ Palette DISTINCTE des
     niveaux : mêmes teintes parfois, rôles différents — ne pas les fusionner.

   - `--ps-font` : la police doit être DISPONIBLE côté LearnWorlds, sinon le
     site retombe sur la suivante de la liste.
   ============================================================ */
(function(){
  "use strict";

  var VALEURS=[
/* >>> DEBUT TOKENS — réécrit par le configurateur, ne rien ajouter ici */
    "--ps-accent:#507EC5",
    "--ps-accent-rgb:80,126,197",
    "--ps-accent-hover:#486798",
    "--ps-accent-tint:#edf4ff",
    "--ps-text:#1c1f26",
    "--ps-text-soft:#676879",
    "--ps-surface-soft:#F7F8FB",
    "--ps-border:#E6E9EF",
    "--ps-font:Figtree,-apple-system,Segoe UI,Roboto,sans-serif",
    "--ps-r-card:16px",
    "--ps-r-pill:999px",
    "--ps-r-btn:10px",
    "--ps-lvl1:var(--ps-accent-hover)",
    "--ps-lvl1-tint:var(--ps-accent-tint)",
    "--ps-lvl2:#12A85F",
    "--ps-lvl2-tint:#E6F9F0",
    "--ps-lvl3:#009257",
    "--ps-lvl3-tint:#E1F7EC",
    "--ps-lvl4:#D22B45",
    "--ps-lvl4-tint:#FDECEF",
    "--ps-lvl5:#D98500",
    "--ps-lvl5-tint:#FFF3E0",
    "--ps-lvl6:#8A45C9",
    "--ps-lvl6-tint:#F3EAFB",
    "--ps-f1:var(--ps-accent)",
    "--ps-f1-tint:var(--ps-accent-tint)",
    "--ps-f2:#00C875",
    "--ps-f2-tint:#E3F8EE",
    "--ps-f3:#E2445C",
    "--ps-f3-tint:#FDECEF",
    "--ps-f4:#FDAB3D",
    "--ps-f4-tint:#FFF3E0",
    "--ps-f5:#A25DDC",
    "--ps-f5-tint:#F3EAFB",
    "--ps-f6:#0073EA",
    "--ps-f6-tint:#E6F1FD"
/* <<< FIN TOKENS */
  ];

  var TOKENS=":root{"+VALEURS.join(";")+";}";

  /* Idempotent : l'observer des autres scripts peut rappeler le DOM en boucle,
     on ne réécrit que si le contenu a changé. */
  function poser(){
    var st=document.getElementById("ps-tokens");
    if(!st){
      st=document.createElement("style"); st.id="ps-tokens";
      /* En TÊTE du <head> : les tokens ne sont que des valeurs, ils ne doivent
         jamais entrer en concurrence de cascade avec les feuilles des pages. */
      document.head.insertBefore(st, document.head.firstChild);
    }
    if(st.textContent!==TOKENS) st.textContent=TOKENS;
  }

  poser();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",poser);
})();
