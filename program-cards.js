/* ============================================================
   Cartes "Programme" (lw-learning-program-card) — page /page-introduction
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /page-introduction
   (Réglages de la PAGE — jamais dans un élément « HTML », les <script> y sont
   inertes) :
     <script src="https://extremum84.github.io/lw-course-cards/program-cards.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   Choix de Ziad le 17/07 : « faire cette page comme les autres » = la coquille
   commune sur les cartes enfants + l'en-tête de programme à la charte.
   On ne reprend PAS le rond qui dépasse / les pastilles de niveau / les chevrons
   de `course-cards.js` : il n'y a pas de notion de niveau ici et les titres
   suivent « 1.3 - … », pas « Niveau #N - … ».

   Ce que fait ce script :
   - panneau du programme : #F7F8FB, bord #E6E9EF, radius 16 ;
   - en-tête : titre + description en Figtree, et surtout la DÉBRANDISATION
     LearnWorlds -> bouton vert #009E78 et barre bleu marine #203866 et pastille
     bleue #3887B4 passent tous au violet #6161FF de la charte ;
   - cartes enfants (.lw-course-card-item) : coquille commune (blanc, bord
     #E6E9EF, radius 16, survol qui soulève), comme `sector-cards.js`.

   ⚠️ NE PAS charger `course-cards.js` sur cette page. Ses règles
   `#pageContent .cards-grandpa > .lw-cols.multiple-rows{...}` ne réclament
   aucune carte de cours, or cette page a bien un `.cards-grandpa > .lw-cols
   .multiple-rows` : la grille des programmes serait transformée en carrousel
   horizontal avec 90px de réserve en haut. Les cartes enfants, elles, sont des
   `.lw-course-card-item` (et non `.lw-course-card`) : celles-là seraient
   épargnées.

   🔴 POURQUOI CE SCRIPT A DU JS ALORS QU'IL NE FAIT QUE DU STYLE :
   les cartes enfants vivent dans un swiper natif DÉJÀ INITIALISÉ, qui a figé la
   largeur de ses slides au chargement. Nos styles changent la largeur utile du
   conteneur (la bordure du panneau retire 2px, le padding le reste) -> les
   slides gardent leur ancienne largeur et LA DERNIÈRE CARTE EST COUPÉE.
   Constaté à l'écran : conteneur 1072 -> 1062px, 4e carte coupée de 10px.
   D'où le `swiper.update()` ci-dessous. Toute retouche future des dimensions
   horizontales de cette page retombera dans le même piège.
   ============================================================ */
(function(){
  "use strict";

  var S="#pageContent";
  var PROG=S+" .lw-learning-program-card";

  var CSS=[
    /* ---- panneau du programme ---------------------------------------- */
    PROG+"{background:#F7F8FB !important;border:1px solid #E6E9EF !important;border-radius:16px !important;padding:28px 24px !important;}",

    /* ---- en-tête ------------------------------------------------------ */
    PROG+" h3{font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;font-size:26px !important;font-weight:800 !important;color:#1c1f26 !important;line-height:1.2 !important;}",
    PROG+" .lw-learning-program-card-descr{font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;font-size:15px !important;line-height:1.6 !important;color:#676879 !important;}",

    /* Pastille « N Leçons » : bleu natif #3887B4 -> violet teinté. */
    PROG+" .lw-tag{background:#EDEDFF !important;color:#6161FF !important;border-radius:999px !important;padding:5px 11px !important;font-family:Figtree,sans-serif !important;font-size:12px !important;font-weight:700 !important;}",

    /* Bouton « Continuer » : vert LearnWorlds #009E78 -> violet de la charte. */
    PROG+" button.learnworlds-button{background:#6161FF !important;color:#fff !important;border-radius:10px !important;border:0 !important;font-family:Figtree,sans-serif !important;font-weight:700 !important;transition:background .18s ease !important;}",
    PROG+" button.learnworlds-button:hover{background:#4B4BE0 !important;}",

    /* Progression : remplissage bleu marine #203866 -> violet. */
    PROG+" .lw-course-card-progress{background:#EDEDF2 !important;border-radius:999px !important;overflow:hidden !important;}",
    PROG+" .lw-course-card-progress-bar{background:#6161FF !important;border-radius:999px !important;}",
    PROG+" .learnworlds-overline-text{font-family:Figtree,sans-serif !important;color:#676879 !important;font-weight:600 !important;}",

    /* ---- cartes enfants : la coquille commune ------------------------- */
    /* Photo RETIRÉE (choix de Ziad le 17/07) : la carte ne porte plus que son
       titre, comme `cabinet-cards.js`. Vérifié avant de masquer : le lien de la
       photo et celui du titre pointent sur le même cours — on ne perd aucun
       accès. La photo reste dans le DOM en `background-image` si on veut la
       réintroduire un jour ; ne pas la supprimer côté LearnWorlds.
       On masque le CONTENEUR et pas `.learnworlds-image` : ça emporte aussi le
       lien qui l'enveloppe, sinon on garderait une zone cliquable vide. */
    S+" .lw-course-card-item .product-image-container{display:none !important;}",
    /* `overflow:hidden` est conservé bien que la photo ait disparu : il garde
       tout futur contenu à l'intérieur du radius. */
    S+" .lw-course-card-item{background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;overflow:hidden !important;box-shadow:none !important;transition:transform .18s ease, box-shadow .18s ease !important;}",
    S+" .lw-course-card-item:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    S+" .lw-course-card-item h4{font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;font-size:17px !important;font-weight:700 !important;color:#1c1f26 !important;line-height:1.3 !important;}",

    /* Le swiper est en `overflow:hidden` : sans cette réserve verticale, le
       `translateY(-3px)` du survol et l'ombre seraient rognés. Réserve VERTICALE
       uniquement — toucher au padding horizontal décalerait les slides. */
    S+" .product-child-cards-swiper .swiper-container{padding-top:6px !important;padding-bottom:16px !important;}",

    "@media(prefers-reduced-motion:reduce){"+S+" .lw-course-card-item{transition:none !important;}}"
  ].join("\n");

  function styles(){
    var st=document.getElementById("ps-prog-style");
    if(!st){ st=document.createElement("style"); st.id="ps-prog-style"; document.head.appendChild(st); }
    if(st.textContent!==CSS) st.textContent=CSS;
  }

  /* Recale les swipers après nos styles (cf. l'avertissement en tête).
     `update()` est idempotent : l'appeler à chaque passage ne coûte qu'un
     recalcul et rattrape aussi les swipers réinitialisés par LearnWorlds.
     ⚠️ Un swiper qui déborde n'est PAS forcément cassé : quand il a plus de
     cartes que la rangée n'en montre (5 ici sur un programme), les suivantes
     attendent hors champ — c'est le principe. Ne pas « corriger » ça. */
  function recalerSwipers(){
    document.querySelectorAll(".product-child-cards-swiper .swiper-container").forEach(function(c){
      if(c.swiper && typeof c.swiper.update==="function"){
        try{ c.swiper.update(); }catch(e){}
      }
    });
  }

  function build(){ styles(); recalerSwipers(); }

  var t;
  function schedule(){ clearTimeout(t); t=setTimeout(build,120); }

  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
})();
