/* ============================================================
   Page d'accueil (/pages/home, body.slug-home) — passage à la DA PrepaStrat
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE home :
     <script src="https://extremum84.github.io/lw-course-cards/home-page.js"></script>

   Contrairement aux pages à cartes (course-cards.js…), on ne RECONSTRUIT rien :
   la home est une page marketing du template LearnWorlds d'origine (Poppins,
   Raleway, boutons bleus #3887B4). On la RESTYLE en pur CSS pour la mettre à la
   DA du site : Figtree, accent bleu marque `--ps-accent` (#507EC5), boutons
   pilule, cartes blanches à filet + ombre douce, sous-titres de section en accent.

   🔴 TOUT est scopé `body.slug-home #pageContent` : les classes LW ciblées
   (.learnworlds-button, .box-shadow-round-light, .box-icon-wrapper…) existent sur
   TOUT le site — sans ce garde de slug, on repeindrait les autres pages.

   `tokens.js` (chargé site-wide) fournit déjà les tokens `--ps-*` : on s'appuie
   dessus avec des valeurs de repli. Pas de MutationObserver nécessaire : du CSS
   scopé s'applique tout seul aux éléments à mesure que LW les rend.

   Premier passage (global) : typo + boutons + cartes + icônes + sous-titres.
   Les réglages fins par section (bandeau stats, cabinets, articles, FAQ) viendront
   en itération une fois le rendu validé.
   ============================================================ */
(function(){
  "use strict";

  // --- Police Figtree (idempotent, partagée avec les autres scripts) ---
  if(!document.getElementById("ps-figtree")){
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head||document.documentElement).appendChild(f);
  }

  var H="body.slug-home #pageContent";
  var FT="font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;";

  var CSS=[
    /* ================= 1) TYPOGRAPHIE ================= */
    /* Figtree sur tous les titres et textes (le template est en Poppins/Raleway). */
    [H+" h1",H+" h2",H+" h3",H+" h4",H+" .learnworlds-heading",H+" .learnworlds-subheading",
     H+" .learnworlds-heading3",H+" .learnworlds-heading4",H+" .learnworlds-main-text",
     H+" .learnworlds-main-text-large",H+" .learnworlds-main-text-small",H+" p",H+" li",H+" a"].join(",")+"{"+FT+"}",
    /* Grands titres (H1) : graisse forte + interlettrage serré, couleur texte du site. */
    H+" h1.learnworlds-heading,"+H+" .learnworlds-heading{font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;}",
    /* Corps de texte : gris doux du site. */
    H+" .learnworlds-main-text,"+H+" .learnworlds-main-text-large,"+H+" .learnworlds-main-text-small{color:var(--ps-text-soft,#676879) !important;line-height:1.65 !important;}",

    /* ================= 2) SOUS-TITRES DE SECTION = ACCENT ================= */
    /* Convention du site (course/case/sector…) : le sous-titre de section prend
       l'accent. Ancre de spécificité `line-height` comme sur les autres scripts.
       🔴 Exclus le bandeau stats (fond accent) : ses sous-titres restent blancs
       (géré en 6). On cible donc les subheadings hors `.ps-home-stats`. */
    H+" .learnworlds-subheading{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#507EC5) !important;}",

    /* ================= 3) BOUTONS -> PILULES DA ================= */
    H+" .learnworlds-button{"+FT+"border-radius:var(--ps-r-pill,999px) !important;font-weight:600 !important;letter-spacing:0 !important;box-shadow:none !important;transition:background .18s ease,color .18s ease,border-color .18s ease,transform .18s ease !important;}",
    /* pleins (brand/accent/solid) -> fond accent, texte blanc */
    [H+" .learnworlds-button-solid-brand",H+" .learnworlds-button-solid-accent1",H+" .learnworlds-button-solid-accent2",
     H+" [class*='button-solid']",H+" .learnworlds-button-solid"].join(",")+"{background:var(--ps-accent,#507EC5) !important;border:0 !important;color:#fff !important;}",
    [H+" .learnworlds-button-solid-brand:hover",H+" .learnworlds-button-solid-accent1:hover",H+" .learnworlds-button-solid-accent2:hover",
     H+" [class*='button-solid']:hover",H+" .learnworlds-button-solid:hover"].join(",")+"{background:var(--ps-accent-hover,#486798) !important;color:#fff !important;}",
    /* contours -> pilule outline accent */
    H+" [class*='button-outline']{background:transparent !important;border:1.5px solid var(--ps-accent,#507EC5) !important;color:var(--ps-accent,#507EC5) !important;}",
    H+" [class*='button-outline']:hover{background:var(--ps-accent,#507EC5) !important;color:#fff !important;border-color:var(--ps-accent,#507EC5) !important;}",
    /* liens texte -> accent (LW force #1c1f26 + underline) */
    H+" a.learnworlds-link,"+H+" .learnworlds-main-text a{color:var(--ps-accent,#507EC5) !important;}",

    /* ================= 4) CARTES (box-shadow-round / radius-15) -> CARTE DA ================= */
    [H+" .box-shadow-round-light",H+" .box-shadow-round",H+" .radius-15"].join(",")+"{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;transition:box-shadow .2s ease,transform .2s ease !important;}",
    [H+" .box-shadow-round-light:hover",H+" .box-shadow-round:hover",H+" .radius-15:hover"].join(",")+"{box-shadow:0 14px 34px rgba(0,0,0,.10) !important;transform:translateY(-3px) !important;}",
    /* titres de carte (heading3/4) -> marine du site */
    H+" .learnworlds-heading3,"+H+" .learnworlds-heading4{font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",

    /* ================= 5) ICÔNES (box-icon-wrapper) -> CERCLE TINT ACCENT ================= */
    [H+" .box-icon-wrapper",H+" .learnworlds-icon-wrapper"].join(",")+"{background:var(--ps-accent-tint,#edf4ff) !important;border-radius:50% !important;color:var(--ps-accent,#507EC5) !important;box-shadow:none !important;}",
    [H+" .box-icon-wrapper .learnworlds-icon",H+" .learnworlds-icon-wrapper .learnworlds-icon",H+" .box-icon-wrapper .standalone",H+" .learnworlds-icon-wrapper .standalone"].join(",")+"{color:var(--ps-accent,#507EC5) !important;}",

    /* ================= 6) BANDEAU STATS (compteurs) ================= */
    /* Le template met un fond bleu vif #3887B4 sur la section. On le passe au
       MARINE #243B6B (plus premium, validé maquette) via `.ps-home-stats` (posée en
       JS sur la section qui contient un `.progress-container_counter`). Chiffres +
       sous-titres blancs, sous-libellés en bleu clair. */
    H+" .ps-home-stats{background:#243B6B !important;}",
    H+" .ps-home-stats .progress-container_counter,"+H+" .ps-home-stats .learnworlds-subheading,"+H+" .ps-home-stats h1,"+H+" .ps-home-stats h2,"+H+" .ps-home-stats h3{color:#fff !important;}",
    H+" .ps-home-stats .learnworlds-main-text{color:#C3D2EA !important;}",
    H+" .ps-home-stats .progress-container_counter{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;}",
    /* icônes du bandeau : bleu clair sur le marine (pas de cercle tint) */
    H+" .ps-home-stats .box-icon-wrapper,"+H+" .ps-home-stats .learnworlds-icon-wrapper{background:transparent !important;color:#9FB3D6 !important;}",
    H+" .ps-home-stats .learnworlds-icon{color:#9FB3D6 !important;}",

    /* ================= 6b) HERO (section 2 : texte | vidéo) ================= */
    /* Section repérée en JS par la présence de la vidéo (`.ps-home-hero`). Colonnes
       centrées verticalement, titre (H4) agrandi en vrai titre hero, vidéo arrondie
       + ombre portée. */
    H+" .ps-home-hero .lw-cols{align-items:center !important;}",
    H+" .ps-home-hero .learnworlds-heading4{"+FT+"font-size:40px !important;font-weight:800 !important;letter-spacing:-.03em !important;line-height:1.1 !important;color:var(--ps-text,#1c1f26) !important;margin:0 0 14px !important;}",
    H+" .ps-home-hero .learnworlds-main-text{font-size:17px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;}",
    H+" .ps-home-hero .learnworlds-video-iframe,"+H+" .ps-home-hero iframe{border-radius:16px !important;overflow:hidden !important;box-shadow:0 18px 50px rgba(15,23,42,.16) !important;}",
    "@media(max-width:820px){"+H+" .ps-home-hero .learnworlds-heading4{font-size:30px !important;}}",

    /* Placeholders du template (« Write your awesome label here. ») masqués. */
    H+" .ps-home-hide{display:none !important;}",

    /* ================= 7) BANDES NEUTRES (#f5f3f5) ================= */
    /* Les sections à fond gris-rosé du template : on garde une bande neutre, mais on
       la pose sur le gris DA (plus froid, cohérent). Classe `.ps-home-soft` en JS. */
    H+" .ps-home-soft{background:var(--ps-surface-soft,#F6F8FB) !important;}",

    /* ================= 8) IMAGES ================= */
    H+" .learnworlds-image{border-radius:var(--ps-r-card,16px) !important;}"
  ].join("\n");

  function styles(){
    var st=document.getElementById("ps-home-style");
    if(!st){ st=document.createElement("style"); st.id="ps-home-style"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==CSS) st.textContent=CSS;
  }

  /* Garde slug évalué TARD (le body est null au chargement, cf. profile-page.js). */
  function surLaPage(){ return !!document.body && /(^|\s)slug-home(\s|$)/.test(document.body.className); }

  /* Repère par CONTENU (pas par position) la section des stats et les bandes
     neutres, pour leur poser une classe stable ciblée par le CSS ci-dessus. */
  function marquer(){
    var secs=document.querySelectorAll(H+" section.learnworlds-section");
    secs.forEach(function(s){
      if(s.parentElement && s.parentElement.closest("section.learnworlds-section")) return; // sections de tête seulement
      if(s.querySelector(".progress-container_counter")) s.classList.add("ps-home-stats");
      /* hero = la section qui porte la vidéo (iframe / learnworlds-video-iframe) */
      if(s.querySelector(".learnworlds-video-iframe, iframe")) s.classList.add("ps-home-hero");
      /* bande neutre : fond gris-rosé du template (rgb(245,243,245)) */
      var bg=getComputedStyle(s).backgroundColor;
      if(bg==="rgb(245, 243, 245)") s.classList.add("ps-home-soft");
    });
    /* Placeholders laissés par le template : on les masque. */
    document.querySelectorAll(H+" .learnworlds-main-text").forEach(function(t){
      if((t.textContent||"").replace(/\s+/g," ").trim()==="Write your awesome label here.") t.classList.add("ps-home-hide");
    });
  }

  function build(){
    if(!surLaPage()) return;
    styles(); marquer();
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.documentElement,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
