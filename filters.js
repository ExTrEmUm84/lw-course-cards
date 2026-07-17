/* ============================================================
   Filtre catégories LearnWorlds — masque les catégories vides
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE, haut de page (Réglages de la
   PAGE — jamais dans un élément « HTML », les <script> y sont inertes) :
     <script src="https://extremum84.github.io/lw-course-cards/filters.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   Le menu déroulant "categories" liste TOUTES les catégories de
   l'école, y compris celles sans cours sur cette page (→ "0 résultat").
   Ce script masque celles qui n'ont aucun cours dans le programme.

   Comment : POST /api/learner/products (tag=catégorie, inProduct=id du
   programme, itemsPerPage:1). Si 0 → la catégorie est masquée.
   SCAN INCRÉMENTAL : les catégories se chargent progressivement (au
   scroll du menu) ; chaque nouvelle catégorie qui apparaît est testée.
   Résultats en cache localStorage (6 h) → instantané ensuite.

   ⚠️ S'appuie sur un endpoint interne non documenté de LearnWorlds.
   Dégradation propre : si l'id du programme n'est pas trouvé, ne fait rien.
   ============================================================ */
(function(){
  "use strict";
  var ENDPOINT="/api/learner/products";
  var SEL=".lw-filter-option li, .lw-topbar-submenu-item.filter";

  var inProduct=null;
  var scanned=Object.create(null);   // nom -> true (déjà testé)
  var empty=Object.create(null);     // nom -> true (0 cours)
  var cacheLoaded=false;

  function findInProduct(){
    var scripts=document.querySelectorAll("script:not([src])");
    for(var i=0;i<scripts.length;i++){
      var txt=scripts[i].textContent||"";
      var m=txt.match(/"LearningProgram"\s*,\s*"secondaryContextKey"\s*:\s*"([a-f0-9]{24})"/)
          || txt.match(/"secondaryContextKey"\s*:\s*"([a-f0-9]{24})"/);
      if(m) return m[1];
    }
    return null;
  }

  function cacheKey(){ return "ps-emptycats2-"+inProduct; }
  function loadCache(){ try{ var c=JSON.parse(localStorage.getItem(cacheKey())||"null"); if(c && (Date.now()-c.t)<21600000) return c; }catch(e){} return null; }
  function saveCache(){ try{ localStorage.setItem(cacheKey(), JSON.stringify({t:Date.now(), scanned:Object.keys(scanned), empty:Object.keys(empty)})); }catch(e){} }

  function nodes(){ return [].slice.call(document.querySelectorAll(SEL)); }
  function nameOf(li){ return (li.textContent||"").replace(/\s+/g," ").trim(); }

  // Masquage via classe + règle !important : résiste aux ré-affichages
  // (LearnWorlds ou un autre script qui remettrait display inline).
  // + Style "dropdown modernisé" (variante B) de la barre de filtres.
  function ensureStyle(){
    if(document.getElementById("ps-filters-style")) return;
    if(!document.getElementById("ps-figtree")){
      var f=document.createElement("link");
      f.id="ps-figtree"; f.rel="stylesheet";
      f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap";
      (document.head||document.documentElement).appendChild(f);
    }
    var s=document.createElement("style");
    s.id="ps-filters-style";
    s.textContent=[
      ".ps-cat-hidden{display:none !important;}",
      /* --- barre de recherche moderne --- */
      "#pageContent .-search-box{display:inline-flex !important;align-items:center !important;border:1.5px solid #E6E9EF !important;border-radius:12px !important;background:#fff !important;padding:0 6px 0 0 !important;box-shadow:0 1px 2px rgba(0,0,0,.04) !important;overflow:hidden !important;height:46px !important;transition:border-color .15s ease, box-shadow .15s ease !important;}",
      "#pageContent .-search-box:focus-within{border-color:#3887B4 !important;box-shadow:0 0 0 3px rgba(56,135,180,.15) !important;}",
      "#pageContent .-search-box .learnworlds-input, #pageContent .-search-box input{border:0 !important;box-shadow:none !important;height:44px !important;font-family:Figtree,sans-serif !important;font-size:15px !important;background:transparent !important;color:#323338 !important;}",
      /* Le bouton loupe garde sinon SA bordure native (1px rgba(32,56,102,.2),
         radius 0 7px 7px 0) : elle dessinait un 2e rectangle arrondi À
         L'INTÉRIEUR de notre champ -> effet "double ligne". On neutralise la
         bordure du bouton, le champ porte le seul contour. */
      "#pageContent .-search-box button, #pageContent .-search-box .learnworlds-button{border:0 !important;box-shadow:none !important;background:transparent !important;border-radius:0 11px 11px 0 !important;height:44px !important;}",
      /* --- bouton "tout" en pill --- */
      "#pageContent .learnworlds-button.filter.text-only{display:inline-flex !important;align-items:center !important;justify-content:center !important;height:44px !important;padding:0 18px !important;border-radius:999px !important;border:1.5px solid #E6E9EF !important;background:#fff !important;color:#4B5563 !important;font-family:Figtree,sans-serif !important;font-size:14px !important;font-weight:600 !important;margin-right:10px !important;cursor:pointer !important;transition:all .15s ease !important;}",
      "#pageContent .learnworlds-button.filter.text-only:hover{border-color:#3887B4 !important;color:#3887B4 !important;background:#F3F9FC !important;}",
      /* Pastille de filtre SANS libellé : LearnWorlds en génère (mesuré : 36x2px,
         donc invisible en natif). Notre style de pastille ci-dessus (hauteur 44 +
         bordure + rayon) lui donnait du volume -> capsule vide visible.
         Sélecteur volontairement plus spécifique que la règle ci-dessus, sinon
         `display:inline-flex !important` l'emporterait sur le masquage. */
      "#pageContent .learnworlds-button.filter.text-only.ps-f-blank{display:none !important;}",
      /* --- bouton "Secteurs" (ex-"categories") en pill ---
         `margin:0 10px 0 0` corrige DEUX défauts natifs de cette pastille :
         1) elle était la SEULE sans marge droite -> "Secteurs" et "Cabinet" se
            touchaient (écart mesuré : 0px, contre 10px partout ailleurs).
         2) elle portait un `margin-bottom:3px` natif -> sa boîte de marges
            faisait 47px au lieu de 44. La barre étant en `align-items:center`,
            c'est la BOÎTE DES MARGES qui est centrée : la pastille se
            retrouvait 1,5px plus haut que les autres (mesuré : top 438,1 contre
            439,6). Hauteur et bordure étaient pourtant identiques — le coupable
            n'était pas la taille mais la marge. */
      "#pageContent .lw-filter-option.with-submenu{display:inline-flex !important;align-items:center !important;height:44px !important;padding:0 18px !important;margin:0 10px 0 0 !important;border-radius:999px !important;border:1.5px solid #E6E9EF !important;background:#fff !important;font-family:Figtree,sans-serif !important;cursor:pointer !important;transition:all .15s ease !important;}",
      "#pageContent .lw-filter-option.with-submenu:hover{border-color:#3887B4 !important;background:#F3F9FC !important;}",
      "#pageContent .lw-filter-option-lbl{font-family:Figtree,sans-serif !important;font-size:14px !important;font-weight:600 !important;color:#4B5563 !important;}",
      "#pageContent .lw-filter-option.with-submenu:hover .lw-filter-option-lbl{color:#3887B4 !important;}",
      /* --- panneau déroulant --- */
      "#pageContent .lw-filter-option.with-submenu .lw-topbar-submenu{border-radius:14px !important;box-shadow:0 16px 40px rgba(15,23,42,.14) !important;border:1px solid #E6E9EF !important;padding:8px !important;margin-top:10px !important;min-width:220px !important;background:#fff !important;}",
      "#pageContent .lw-topbar-submenu-item.filter{list-style:none !important;padding:9px 14px !important;border-radius:9px !important;font-family:Figtree,sans-serif !important;font-size:14px !important;font-weight:500 !important;color:#323338 !important;cursor:pointer !important;transition:background .12s ease, color .12s ease !important;}",
      "#pageContent .lw-topbar-submenu-item.filter:hover{background:#F3F9FC !important;color:#3887B4 !important;}",

      /* ============ SÉLECTEURS MAISON (Cabinet / Année / Type / Difficulté) ====
         🔴 Classes volontairement DISTINCTES du natif (`ps-ff-*`, jamais
         `.lw-filter-option` ni `.lw-topbar-submenu-item.filter`). Le scan de ce
         fichier cible `".lw-filter-option li, .lw-topbar-submenu-item.filter"` :
         en réutilisant ces classes, nos propres options seraient prises pour des
         catégories et envoyées une par une à /api/learner/products. */
      ".ps-ff{position:relative !important;display:inline-flex !important;align-items:center !important;gap:7px !important;height:44px !important;padding:0 16px !important;margin-right:10px !important;border-radius:999px !important;border:1.5px solid #E6E9EF !important;background:#fff !important;font-family:Figtree,sans-serif !important;font-size:14px !important;font-weight:600 !important;color:#4B5563 !important;cursor:pointer !important;user-select:none !important;transition:all .15s ease !important;}",
      ".ps-ff:hover{border-color:#3887B4 !important;color:#3887B4 !important;background:#F3F9FC !important;}",
      /* sélecteur actif : même bleu que le reste de la barre */
      ".ps-ff.ps-ff-on{border-color:#3887B4 !important;background:#F3F9FC !important;color:#3887B4 !important;}",
      ".ps-ff-cur{font-weight:700 !important;}",
      ".ps-ff-arrow{width:9px !important;height:9px !important;border-right:2px solid currentColor !important;border-bottom:2px solid currentColor !important;transform:rotate(45deg) translateY(-2px) !important;transition:transform .18s ease !important;}",
      ".ps-ff.ps-ff-open .ps-ff-arrow{transform:rotate(-135deg) translateY(2px) !important;}",
      /* ---- RECHERCHE SUR SA PROPRE LIGNE, FILTRES SUR LA SUIVANTE ----
         En natif, `.one-row` est une rangée flex à 2 colonnes : la recherche
         (span_4, 323px) et les filtres (span_8, 661px). Une fois deux pastilles
         sélectionnées elles portent leur valeur ("Année : 2022"), s'élargissent
         et ne tiennent plus dans 661px -> la barre passait sur 2 lignes
         (mesuré : 6 pastilles, 2 lignes, hauteur 88px).
         -> on empile les 2 colonnes : les filtres récupèrent les 1000px et
         tiennent sur une ligne.
         ⚠️ `:has(.lw-filters)` est INDISPENSABLE : la page compte **18**
         `.one-row` (hero, cartes, pied de page…). Un `.one-row` nu les casserait
         toutes.
         ⚠️ `margin-left:0` sur la colonne : elle porte une gouttière native de
         16px qui, à pleine largeur, poussait la barre à 358->1358 alors que la
         grille des cartes fait 350->1350.
         ⚠️ `justify-content:flex-start` sur la rangée : elle centre ses items en
         natif -> la recherche se retrouvait centrée (670->1030) au lieu d'être
         calée à gauche.
         `max-width` sur la recherche : sans elle, le champ s'étirait à 1000px. */
      /* 🔴 `max-width:1000px` : la rangée des filtres doit être calée sur la
         GRILLE DES CARTES, qui fait 1000px sur toutes les pages. Le conteneur
         natif, lui, varie : 1000px sur la page Cas (ça tombait juste par
         hasard) mais **1120px sur Fiches cabinet** -> recherche et filtres
         démarraient à 290 quand le hero et les cartes étaient à 350.
         Alignement seul (max-width + marges auto), jamais de `display` : cf. la
         règle du piège n°1. */
      "#pageContent .one-row:has(.lw-filters){flex-wrap:wrap !important;justify-content:flex-start !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
      "#pageContent .one-row:has(.lw-filters) > .col{flex:0 0 100% !important;max-width:100% !important;margin-left:0 !important;margin-right:0 !important;}",
      "#pageContent .one-row:has(.lw-filters) > .-search-box{max-width:360px !important;margin-bottom:16px !important;}",
      /* row-gap : la barre est en flex-wrap:wrap. Sur un écran étroit elle
         repasse sur 2 lignes, et les marges des pastilles sont horizontales
         seulement -> les rangées se toucheraient. (Pas de `gap` tout court :
         il s'ajouterait aux margin-right de 10px et doublerait l'écart.) */
      "#pageContent .lw-filters{justify-content:flex-start !important;row-gap:10px !important;}",
      /* 🔴 SANS CETTE RÈGLE, LE MENU PASSE DERRIÈRE LES CARTES.
         Le `z-index:50` du menu ne sert à rien seul : il est enfermé dans la
         branche de la barre. Mesuré : la barre (`.lw-cols.no-gutter`) ET la
         grille (`.lw-cols.multiple-rows`) sont TOUTES DEUX en `z-index:2`,
         dans le même contexte d'empilement (`.learnworlds-section-content`,
         z:1). À z-index égal, l'ordre du DOM tranche — et la grille vient
         APRÈS la barre, donc elle peint par-dessus.
         -> on remonte la branche de la barre. `:has()` la cible sans toucher
         à la grille (même précédent que mega-menu.js). Aucun `display` posé
         sur un `.lw-cols` nu : cf. la règle du piège n°1. */
      "#pageContent .lw-cols.no-gutter:has(.lw-filters){z-index:20 !important;}",
      ".ps-ff-menu{display:none !important;position:absolute !important;top:calc(100% + 10px) !important;left:0 !important;z-index:50 !important;min-width:200px !important;max-height:280px !important;overflow-y:auto !important;margin:0 !important;padding:8px !important;list-style:none !important;text-align:left !important;border-radius:14px !important;border:1px solid #E6E9EF !important;background:#fff !important;box-shadow:0 16px 40px rgba(15,23,42,.14) !important;}",
      ".ps-ff.ps-ff-open .ps-ff-menu{display:block !important;}",
      /* text-align:left explicite : la barre de filtres est alignée à DROITE sur
         la page, et les options en héritaient (constaté à l'écran : "Tous" et
         "2022" collés à droite du panneau). */
      ".ps-ff-item{list-style:none !important;padding:9px 14px !important;border-radius:9px !important;font-size:14px !important;font-weight:500 !important;color:#323338 !important;white-space:nowrap !important;text-align:left !important;cursor:pointer !important;transition:background .12s ease, color .12s ease !important;}",
      ".ps-ff-item:hover{background:#F3F9FC !important;color:#3887B4 !important;}",
      ".ps-ff-item.ps-ff-sel{background:#EAF5FC !important;color:#3887B4 !important;font-weight:700 !important;}",
      /* masquage des cartes filtrées : classe + !important (résiste aux
         ré-affichages inline). Posé sur la CARTE, jamais sur la grille. */
      "#pageContent .lw-course-card.ps-card-hidden{display:none !important;}",
      ".ps-ff-empty{padding:9px 14px !important;font-size:13px !important;color:#9AA0AC !important;}"
    ].join("\n");
    (document.head||document.documentElement).appendChild(s);
  }
  /* ================= RENOMMAGE DU FILTRE "categories" =====================
     PARAMÉTRABLE PAR PAGE — le libellé dépend de ce que les catégories
     désignent là où le script tourne : "Secteurs" sur la page Cas, mais ce
     serait FAUX sur /fiches-secteur-clone (fiches cabinet). D'où un réglage
     par page, posé AVANT le chargement du script :
         <script>window.PS_CAT_LABEL="Secteurs";</script>
         <script src=".../filters.js"></script>
     Non défini -> on ne renomme pas, on garde le libellé natif. C'est le
     défaut sûr : une nouvelle page n'hérite pas d'un nom qui ne la concerne
     pas.
     Cosmétique et posé par-dessus le natif : le vrai nom du groupe de tags
     reste "categories" partout ailleurs dans LearnWorlds. Réappliqué à chaque
     run() (toutes les 1,2s) car LearnWorlds réécrit le libellé quand il
     reconstruit la barre. Le span ne contient que le libellé : le <ul> des
     options est un frère, on ne l'écrase donc pas. */
  var CAT_LABEL=(typeof window.PS_CAT_LABEL==="string" && window.PS_CAT_LABEL.trim()) ? window.PS_CAT_LABEL.trim() : null;
  function renameCategories(){
    if(!CAT_LABEL) return;
    document.querySelectorAll("#pageContent .lw-filter-option-lbl").forEach(function(el){
      if((el.textContent||"").trim()!==CAT_LABEL) el.textContent=CAT_LABEL;
    });
  }

  /* ================= SÉLECTEURS PAR CHAMP DE LA DESCRIPTION ===============
     Les cartes cas portent une description "Cabinet : X # Année : 2022 # …".
     On en tire un sélecteur par champ, alimenté UNIQUEMENT par les valeurs
     réellement présentes sur la page (même esprit que le masquage des
     catégories vides : on ne propose jamais un choix qui donnerait 0 résultat).

     ⚠️ LIMITE CONNUE — pagination : LearnWorlds ne charge que 12 cartes et
     garde un bouton "Charger plus". Ces sélecteurs ne voient que les cartes
     CHARGÉES : tant que tout n'est pas chargé, un filtre peut afficher moins de
     cas qu'il n'en existe. Le filtre "Secteurs" natif, lui, est piloté serveur.
     ⚠️ LearnWorlds RECRÉE les cartes à chaque filtrage natif (vérifié : le nœud
     témoin disparaît) -> on ne mémorise aucun état sur les cartes, tout est
     re-dérivé du DOM à chaque passe. */
  var ALL_LABELS=["Cabinet","Année","Annee","Secteur","Type","Difficulté","Difficulte","Niveau","Durée","Duree","Format","Fonction"];
  var FIELDS=[
    {key:"cabinet",    label:"Cabinet",    re:/^cabinets?$/i},
    {key:"annee",      label:"Année",      re:/^ann[ée]e$/i},
    {key:"type",       label:"Type",       re:/^type$/i},
    {key:"difficulte", label:"Difficulté", re:/^difficult[ée]$/i}
  ];
  var state=Object.create(null);       // key -> valeur choisie (ou absente)
  var lastSig="";                      // signature des valeurs -> évite de reconstruire le DOM

  function keyOf(label){
    for(var i=0;i<FIELDS.length;i++) if(FIELDS[i].re.test(label)) return FIELDS[i].key;
    return null;
  }
  /* Découpe la description sur TOUS les labels connus, pas seulement les 4
     retenus : sinon la valeur d'un champ déborderait sur le suivant
     ("Secteur : x # Type : y" -> Type vaudrait "y" seulement si on sait où
     commence le label suivant). Même logique que case-cards.js. */
  function parseDesc(desc){
    var re=new RegExp("("+ALL_LABELS.join("|")+")\\s*:\\s*","gi"), m, ms=[];
    while((m=re.exec(desc))!==null) ms.push({label:m[1], vs:re.lastIndex, start:m.index});
    var out=[];
    for(var i=0;i<ms.length;i++){
      var end=(i+1<ms.length)?ms[i+1].start:desc.length;
      out.push({label:ms[i].label, value:desc.slice(ms[i].vs,end).replace(/[#]+\s*$/,"").trim()});
    }
    return out;
  }
  /* même heuristique que case-cards.js : le texte de la carte qui contient un
     ":" et fait plus de 15 caractères. Le natif reste dans le DOM (masqué par
     case-cards.js), donc lisible. */
  function descOf(card){
    return [].slice.call(card.querySelectorAll("p,.learnworlds-main-text"))
      .map(function(e){ return (e.textContent||"").replace(/\s+/g," ").trim(); })
      .filter(function(t){ return /:/.test(t) && t.length>15; })[0] || "";
  }
  function splitVals(v){
    return String(v).split(",").map(function(s){ return s.trim(); }).filter(Boolean);
  }
  function cardValues(card){
    var m=Object.create(null);
    parseDesc(descOf(card)).forEach(function(f){
      var k=keyOf(f.label); if(!k) return;
      m[k]=splitVals(f.value);
    });
    return m;
  }
  function allCards(){ return [].slice.call(document.querySelectorAll("#pageContent .lw-course-card")); }

  /* Une carte passe-t-elle tous les filtres actifs SAUF celui-ci ? Base du
     calcul à facettes ci-dessous. */
  function matchesExcept(card, exceptKey){
    var m=cardValues(card);
    for(var i=0;i<FIELDS.length;i++){
      var k=FIELDS[i].key;
      if(k===exceptKey) continue;
      var sel=state[k];
      if(!sel) continue;
      if(!m[k] || m[k].indexOf(sel)<0) return false;
    }
    return true;
  }

  /* VALEURS PROPOSÉES — filtrage À FACETTES (les sélecteurs sont cumulatifs).
     Pour un champ donné, on ne propose que les valeurs encore atteignables
     compte tenu des AUTRES filtres actifs : choisir Cabinet=BCG retire de
     "Année" les années où BCG n'a aucun cas. Même esprit que le masquage des
     catégories vides : jamais un choix qui donnerait 0 résultat.

     🔴 On exclut le champ DE SA PROPRE facette (`matchesExcept(card, f.key)`).
     Sinon un filtre actif se retirerait lui-même de sa liste : dès qu'il masque
     les autres cartes, sa propre valeur deviendrait la seule "atteignable" et
     les autres options disparaîtraient — impossible d'en changer sans repasser
     par "Tous".
     Le filtre "Secteurs" natif n'a pas besoin d'être traité ici : LearnWorlds
     RECRÉE les cartes côté serveur, donc `allCards()` ne contient déjà plus que
     le secteur choisi et les facettes se resserrent toutes seules. */
  function collectValues(){
    var out=Object.create(null);
    var cards=allCards();
    FIELDS.forEach(function(f){
      var set=Object.create(null);
      cards.forEach(function(card){
        if(!matchesExcept(card, f.key)) return;
        var m=cardValues(card);
        if(m[f.key]) m[f.key].forEach(function(v){ set[v]=true; });
      });
      out[f.key]=Object.keys(set).sort(function(a,b){
        var na=parseFloat(a), nb=parseFloat(b);
        if(!isNaN(na) && !isNaN(nb)) return nb-na;          // années : plus récent d'abord
        return a.localeCompare(b,"fr");
      });
    });
    return out;
  }

  /* ET entre les sélecteurs actifs. Une carte sans le champ filtré ne matche
     pas : aujourd'hui 11 cartes /12 n'ont aucun champ, elles disparaîtront donc
     dès qu'un sélecteur est actif — c'est voulu, et ça se réglera en
     remplissant les descriptions. */
  function matches(card){
    var m=cardValues(card);
    for(var i=0;i<FIELDS.length;i++){
      var k=FIELDS[i].key, sel=state[k];
      if(!sel) continue;
      if(!m[k] || m[k].indexOf(sel)<0) return false;
    }
    return true;
  }
  function applyCardFilter(){
    var actif=FIELDS.some(function(f){ return !!state[f.key]; });
    allCards().forEach(function(card){
      card.classList.toggle("ps-card-hidden", actif && !matches(card));
    });
  }

  function closeMenus(){
    document.querySelectorAll(".ps-ff.ps-ff-open").forEach(function(d){ d.classList.remove("ps-ff-open"); });
  }
  if(!window.__psFfBound){
    window.__psFfBound=1;
    document.addEventListener("click",function(e){
      if(!e.target.closest || !e.target.closest(".ps-ff")) closeMenus();
    });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeMenus(); });

    /* 🔴 Le bouton natif "tout" doit AUSSI remettre nos sélecteurs à zéro.
       En natif il ne réinitialise que le filtre Secteurs de LearnWorlds : nos
       filtres restaient actifs et les cartes restaient masquées. Constaté :
       après un clic sur "tout", 11 cartes /12 toujours masquées et deux
       sélecteurs encore actifs -> le bouton ne faisait visiblement RIEN.
       On l'identifie par sa POSITION (1er bouton-pastille du conteneur), pas
       par son libellé : le site est bilingue FR/EN, "tout" devient "all".
       Le 2e bouton est celui sans libellé (cf. .ps-f-blank), déjà masqué.
       Délégué sur document et posé une seule fois : LearnWorlds reconstruit la
       barre, un écouteur posé sur le bouton lui-même partirait avec. */
    document.addEventListener("click",function(e){
      if(!e.target.closest) return;
      var btn=e.target.closest("#pageContent .learnworlds-button.filter.text-only");
      if(!btn) return;
      var wrap=btn.closest(".learnworlds-button-wrapper.lw-filters");
      if(!wrap || btn!==wrap.querySelector(".learnworlds-button.filter.text-only")) return;  // pas le "tout"
      FIELDS.forEach(function(f){ delete state[f.key]; });
      setTimeout(refresh,0);   // après le handler natif, qui recharge les cartes
    });
  }

  function mountFieldFilters(){
    var wrap=document.querySelector("#pageContent .learnworlds-button-wrapper.lw-filters");
    if(!wrap) return;
    var vals=collectValues();
    /* signature : on ne reconstruit le DOM que si les valeurs OU la sélection
       changent. Sans ça, run() (toutes les 1,2s) refermerait le menu ouvert. */
    var sig=FIELDS.map(function(f){ return f.key+"="+vals[f.key].join("|")+">"+(state[f.key]||""); }).join(";");
    if(sig===lastSig && wrap.querySelector(".ps-ff")) return;
    lastSig=sig;

    FIELDS.forEach(function(f){
      var liste=vals[f.key];
      var box=wrap.querySelector('.ps-ff[data-ps-f="'+f.key+'"]');
      /* aucune valeur sur la page -> pas de sélecteur du tout (même principe
         que les catégories vides masquées) */
      if(!liste.length){ if(box) box.remove(); delete state[f.key]; return; }
      /* la valeur choisie a disparu (filtre natif changé) -> on la lâche */
      if(state[f.key] && liste.indexOf(state[f.key])<0) delete state[f.key];

      if(!box){
        box=document.createElement("div");
        box.className="ps-ff"; box.setAttribute("data-ps-f",f.key);
        wrap.appendChild(box);
        /* 🔴 L'écouteur d'ouverture se pose UNE SEULE FOIS, à la création.
           Posé à chaque passe, il s'accumulait sur la même pastille (elle est
           réutilisée, seul son contenu est refait) : le 1er écouteur ouvrait le
           menu, le 2e le voyait déjà ouvert et le refermait dans le même clic.
           Symptôme constaté : le menu ne s'ouvrait JAMAIS (nombre pair
           d'écouteurs), et ils s'empilaient à chaque refresh().
           Les <li> d'options, eux, sont recréés à chaque passe : leurs
           écouteurs partent avec eux, pas de fuite. */
        box.addEventListener("click",function(e){
          if(e.target.closest(".ps-ff-menu")) return;   // clic sur une option : géré par le <li>
          e.stopPropagation();                          // sinon le listener document referme aussitôt
          var ouvert=box.classList.contains("ps-ff-open");
          closeMenus();
          if(!ouvert) box.classList.add("ps-ff-open");
        });
      }
      var sel=state[f.key];
      box.classList.toggle("ps-ff-on", !!sel);
      box.innerHTML='<span class="ps-ff-lbl">'+f.label+(sel?' : <span class="ps-ff-cur"></span>':'')+'</span><span class="ps-ff-arrow"></span><ul class="ps-ff-menu"></ul>';
      if(sel) box.querySelector(".ps-ff-cur").textContent=sel;   // textContent : pas d'injection
      var menu=box.querySelector(".ps-ff-menu");

      var tous=document.createElement("li");
      tous.className="ps-ff-item"+(sel?"":" ps-ff-sel");
      tous.textContent="Tous";
      tous.addEventListener("click",function(e){ e.stopPropagation(); delete state[f.key]; closeMenus(); refresh(); });
      menu.appendChild(tous);

      liste.forEach(function(v){
        var li=document.createElement("li");
        li.className="ps-ff-item"+(sel===v?" ps-ff-sel":"");
        li.textContent=v;
        li.addEventListener("click",function(e){ e.stopPropagation(); state[f.key]=v; closeMenus(); refresh(); });
        menu.appendChild(li);
      });
    });
  }
  function refresh(){ lastSig=""; mountFieldFilters(); applyCardFilter(); }

  function applyHide(){
    ensureStyle();
    nodes().forEach(function(li){
      var n=nameOf(li);
      if(!n) return;
      if(empty[n]) li.classList.add("ps-cat-hidden");
      else li.classList.remove("ps-cat-hidden");
    });
    hideBlankPills();
    renameCategories();
    mountFieldFilters();
    applyCardFilter();
  }

  /* Masque les pastilles de filtre sans libellé (cf. règle .ps-f-blank).
     Pas faisable en CSS : le bouton contient une espace, donc :empty ne
     matche pas. */
  function hideBlankPills(){
    document.querySelectorAll("#pageContent .learnworlds-button.filter.text-only").forEach(function(b){
      b.classList.toggle("ps-f-blank", !(b.textContent||"").trim());
    });
  }

  function scan(list){
    list = list.filter(function(n){ return n && n.length<40 && !scanned[n]; });
    if(!list.length) return;
    list.forEach(function(n){ scanned[n]=true; });
    var base={type:"course",access:"public,private-enroll,soon,view-locked",
      excludeNotEnrolledPrivateProductsForAdmin:"true",fields:"titleId",appliedCoupon:"",
      tag:"",inProduct:inProduct,offset:"0",itemsPerPage:"1",paginationType:"offset"};
    var pending=list.length;
    list.forEach(function(nm){
      var b={}; for(var k in base) b[k]=base[k]; b.tag=nm;
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(b)})
        .then(function(r){ return r.json(); })
        .then(function(j){ if(!(j && j.data && j.data.length)) empty[nm]=true; })
        .catch(function(){ delete scanned[nm]; })   // erreur : autoriser un nouvel essai
        .then(function(){ if(--pending===0){ saveCache(); applyHide(); } });
    });
  }

  function run(){
    if(inProduct===null){ inProduct=findInProduct(); if(!inProduct){ inProduct=null; return; } }
    if(!cacheLoaded){
      cacheLoaded=true;
      var c=loadCache();
      if(c){ (c.scanned||[]).forEach(function(n){ scanned[n]=true; }); (c.empty||[]).forEach(function(n){ empty[n]=true; }); }
    }
    applyHide();
    var seen=Object.create(null), current=[];
    nodes().forEach(function(li){ var n=nameOf(li); if(n && !seen[n]){ seen[n]=true; current.push(n); } });
    var toScan=current.filter(function(n){ return !scanned[n]; });
    if(toScan.length) scan(toScan);
  }

  var raf=false;
  function tick(){ if(raf) return; raf=true; requestAnimationFrame(function(){ raf=false; run(); }); }
  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded", run);
  new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("load", run);
  setInterval(run, 1200);
})();
