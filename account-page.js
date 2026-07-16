/* ============================================================
   Page "Mon compte" (/account) — refonte au style du site
   ------------------------------------------------------------
   🔴 À charger dans le Code personnalisé du SITE (Réglages du site),
   à côté de mega-menu.js — PAS dans une page :
     <script src="https://extremum84.github.io/lw-course-cards/account-page.js"></script>

   POURQUOI le site et pas la page : /account n'est PAS une page du Site
   Builder (aucun `#pageContent`, aucune `learnworlds-section`) — c'est une
   page native de LearnWorlds, elle n'a donc pas de champ "Code personnalisé"
   à elle. Vérifié : mega-menu.js s'y charge, donc le code SITE l'atteint.

   ⚠️ CONSÉQUENCE : ce fichier se charge sur TOUTES les pages du site. Tout
   est donc scopé sous `body.slug-account` (CSS) et la partie JS sort
   immédiatement ailleurs. Ne jamais écrire une règle non scopée ici.

   Ce que ça fait :
   - typo Figtree partout (le natif est en Raleway)
   - la grande carte blanche unique devient TRANSPARENTE, et chaque
     `section.account-section` devient une carte (blanc, bord #E6E9EF,
     radius 16) — choix de Ziad le 16/07
   - menu latéral en typo du site + item actif en violet
   - boutons "Modifier" au CTA violet du site
   ============================================================ */
(function(){
  "use strict";

  var B="body.slug-account ";                 // scope : cette page uniquement

  /* Sort tout de suite ailleurs : le fichier est chargé site-wide.
     Le CSS est de toute façon scopé, mais inutile de poser une feuille de
     style et un observer sur chaque page du site. */
  function surLaPage(){ return document.body && /(^|\s)slug-account(\s|$)/.test(document.body.className); }

  // --- 1) Police Figtree ---
  function figtree(){
    if(document.getElementById("ps-figtree")) return;
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head||document.documentElement).appendChild(f);
  }

  // --- 2) Styles ---
  /* Périmètre : `.account-app` et NON `.account-app-page` — la barre de nav du
     site vit dans `.account-app-page` (vérifié), et c'est mega-menu.js qui la
     gère. `.account-app` contient le titre, le menu latéral et les 4 sections,
     et rien d'autre. */
  var A=B+".account-app ";
  var FT="font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;";

  var CSS=[
    /* fond de page : le gris clair du site, pour que les cartes se détachent */
    "body.slug-account .account-app-page{background:#F5F6F8 !important;}",

    /* 🔴 POLICE PAR HÉRITAGE, JAMAIS PAR `*`.
       Un `*{font-family:…}` force la police sur CHAQUE élément, y compris les
       porteurs d'icônes (`.learnworlds-icon.fas`, Font Awesome 5 Free — présent
       sur cette page) : les pictos deviendraient des carrés. À l'essai l'icône
       survivait, mais seulement parce que la règle de LW est plus spécifique
       que la mienne — ça tenait par accident, pas par conception.
       Ici la police est posée sur le CONTENEUR : elle se propage par héritage,
       et tout élément qui déclare sa propre police (les icônes, les SVG) la
       garde. Sûr par construction. */
    B+".account-app{"+FT+"}",
    /* Les classes LW qui déclarent leur propre police et ne prennent donc pas
       l'héritage. Liste relevée à l'écran, pas devinée : Raleway sur les liens
       du menu et les valeurs, Poppins sur les titres et les libellés. */
    [A+".learnworlds-main-text", A+".learnworlds-main-text-small", A+".learnworlds-main-text-normal",
     A+".learnworlds-heading4", A+".learnworlds-subheading", A+".learnworlds-button",
     A+".account-value-display-title", A+".account-value-display-value", A+"p.ellipsis"
    ].join(",")+"{"+FT+"}",

    /* titre de page */
    B+".account-app h2{"+FT+"font-size:38px !important;font-weight:800 !important;letter-spacing:-.025em !important;color:#1c1f26 !important;}",

    /* La grande carte blanche unique s'efface : ce sont les sections qui
       portent désormais la carte (choix de Ziad). */
    B+".lw-body-bg.border-radius.account-cnt{background:transparent !important;border-radius:0 !important;box-shadow:none !important;}",

    /* --- une carte par section --- */
    B+"section.account-section{background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;padding:26px 28px !important;margin:0 0 20px !important;box-shadow:none !important;transition:box-shadow .2s ease !important;}",
    B+"section.account-section:hover{box-shadow:0 6px 20px rgba(15,23,42,.05) !important;}",
    B+".account-section-header{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:16px !important;margin-bottom:18px !important;}",
    B+".account-section-title{font-family:Figtree,sans-serif !important;font-size:21px !important;font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",

    /* --- bouton "Modifier" : le CTA violet du site --- */
    B+".account-section-header button.learnworlds-button{background:transparent !important;border:0 !important;box-shadow:none !important;padding:0 !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;cursor:pointer !important;transition:color .18s ease !important;}",
    B+".account-section-header button.learnworlds-button:hover{color:#4B4BE0 !important;}",

    /* --- menu latéral --- */
    B+".account-menu-content{position:sticky !important;top:24px !important;}",
    B+".account-section-navigation a{display:block !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;color:#4B5563 !important;text-decoration:none !important;padding:9px 12px !important;margin-bottom:2px !important;border-radius:9px !important;transition:color .15s ease, background .15s ease !important;}",
    B+".account-section-navigation a:hover{color:#6161FF !important;background:#F3F1FF !important;}",
    /* item actif : AUCUN état natif (vérifié : cliquer n'ajoute aucune classe
       et le hash reste vide) -> classe posée en JS par l'observateur. */
    B+".account-section-navigation a.ps-acc-on{color:#6161FF !important;background:#EDEDFF !important;}",

    /* --- champs / valeurs --- */
    B+".personal-details-values{font-family:Figtree,sans-serif !important;}",
    B+".account-user-avatar{border-radius:16px !important;overflow:hidden !important;}"
  ].join("\n");

  function styles(){
    var st=document.getElementById("ps-account-style");
    if(!st){ st=document.createElement("style"); st.id="ps-account-style"; (document.head||document.documentElement).appendChild(st); }
    st.textContent=CSS;
  }

  /* --- 3) Item actif du menu ---
     Les liens pointent vers #personal-details / #security / #courses-programs
     / #payments, mais LearnWorlds n'a AUCUN état actif : cliquer n'ajoute pas
     de classe et le hash reste vide (vérifié). On le calcule donc nous-mêmes.
     IntersectionObserver plutôt qu'un écouteur de scroll : on ne connaît pas le
     conteneur qui défile (la page n'a pas la structure d'une page Builder), et
     l'observateur s'en moque — il travaille par rapport au viewport. */
  var io=null;
  function spy(){
    var nav=document.querySelector(".account-section-navigation");
    if(!nav || nav.dataset.psSpy) return;
    var liens=[].slice.call(nav.querySelectorAll("a[href^='#']"));
    if(!liens.length) return;
    var cibles=[];
    liens.forEach(function(a){
      var id=(a.getAttribute("href")||"").slice(1);
      var el=id && document.getElementById(id);
      if(el) cibles.push({a:a, el:el});
    });
    if(!cibles.length) return;
    nav.dataset.psSpy="1";

    var vus=Object.create(null);
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ vus[e.target.id]=e.isIntersecting ? e.intersectionRatio : 0; });
      /* la section active = celle qui occupe le plus l'écran ; on ne retire la
         marque que si une autre gagne, sinon l'état clignoterait entre deux
         sections à l'entrée/sortie. */
      var best=null, bestR=0;
      cibles.forEach(function(c){
        var r=vus[c.el.id]||0;
        if(r>bestR){ bestR=r; best=c; }
      });
      if(!best) return;
      cibles.forEach(function(c){ c.a.classList.toggle("ps-acc-on", c===best); });
    },{threshold:[0,.25,.5,.75,1]});
    cibles.forEach(function(c){ io.observe(c.el); });
  }

  function run(){
    if(!surLaPage()) return;
    figtree(); styles(); spy();
  }

  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded",run);
  window.addEventListener("load",run);
  /* l'app compte est rendue en JS : les sections n'existent pas au 1er passage.
     Mêmes relances que les autres fichiers du repo. */
  [200,600,1200,2500].forEach(function(d){ setTimeout(run,d); });
})();
