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

  /* ====================================================================
     ACCENT PAR PAGE — une couleur dominante par page
     --------------------------------------------------------------------
     Une seule couleur par page ; survol / teinte / canaux RGB sont DÉRIVÉS
     (mêmes coefficients que le configurateur). Pages non listées -> accent
     global défini plus haut (le bleu). Clé = slug LearnWorlds : la classe
     `slug-…` que LW pose sur le <body>, égale à "slug-" + le slug d'URL.

     🔴 Couleur CLAIRE (ex. jaune) : illisible en TEXTE sur blanc. On assombrit
     alors l'accent-texte jusqu'à un contraste lisible (>=4:1), MAIS la lueur
     des cartes (`--ps-accent-rgb`) garde la couleur VIVE. L'impression « page
     jaune » vient de la lueur + des pastilles claires, pas du texte. Les
     couleurs déjà foncées (vert, rouge) restent fidèles au hex donné.

     Pour changer/ajouter une page : une ligne dans PAGE_ACCENTS, c'est tout. */
  var PAGE_ACCENTS={
    "fiches-secteur":"#fad54a",        /* Secteurs — jaune */
    "emptykk-clone-clone":"#6b7280",   /* Cas — gris */
    "fiches-secteur-clone":"#007260"   /* Cabinets — vert (choix Ziad 24/07, était rouge #c51d4a) */
  };

  function _chan(hex){var h=hex.replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
  function _hex2hsl(hex){var c=_chan(hex),r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,H=0,L=(mx+mn)/2,S=d===0?0:d/(1-Math.abs(2*L-1));if(d!==0){if(mx===r)H=60*(((g-b)/d)%6);else if(mx===g)H=60*((b-r)/d+2);else H=60*((r-g)/d+4);}if(H<0)H+=360;return [H,S*100,L*100];}
  function _hsl2hex(hh,s,l){s/=100;l/=100;var a=s*Math.min(l,1-l);function f(n){var k=(n+hh/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,"0");}return "#"+f(0)+f(8)+f(4);}
  function _lum(hex){var c=_chan(hex).map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
  function _contraste(hex){return 1.05/(_lum(hex)+0.05);}

  /* hex de page -> {accent (texte, lisible), rgb (lueur, vive), hover, tint}.
     hover/tint : mêmes coefficients que deduire() du configurateur. */
  function _deriver(hex){
    var t=_hex2hsl(hex), accent=hex;
    if(t[2]>55){ var L=t[2]; while(L>10 && _contraste(_hsl2hex(t[0],t[1],L))<4) L-=1; accent=_hsl2hex(t[0],t[1],L); }
    var ta=_hex2hsl(accent);
    return {
      accent:accent,
      rgb:_chan(hex).join(","),                                    /* lueur = couleur VIVE d'origine */
      hover:_hsl2hex(ta[0], Math.max(0,ta[1]*0.71), Math.max(0,ta[2]-10.4)),
      tint:_hsl2hex(t[0], 100, 96.5)
    };
  }

  function accentPage(){
    if(!document.body) return;                                    /* body pas encore là (script en <head>) */
    var m=document.body.className.match(/slug-([a-z0-9-]+)/i);
    var hex=m ? PAGE_ACCENTS[m[1]] : null;
    var st=document.getElementById("ps-tokens-page");
    if(!hex){ if(st) st.textContent=""; return; }                 /* page non listée -> accent global */
    var d=_deriver(hex);
    var css=":root{--ps-accent:"+d.accent+";--ps-accent-rgb:"+d.rgb+";--ps-accent-hover:"+d.hover+";--ps-accent-tint:"+d.tint+";}";
    /* APRÈS ps-tokens dans le <head> : même spécificité (:root), l'ordre du DOM
       tranche -> l'override de page gagne sur les valeurs globales. */
    if(!st){ st=document.createElement("style"); st.id="ps-tokens-page"; document.head.appendChild(st); }
    if(st.textContent!==css) st.textContent=css;
  }

  /* ====================================================================
     BOUTONS DE HERO « Cours » / « Compétences » — SITE-WIDE
     --------------------------------------------------------------------
     Ces boutons natifs (`learnworlds-button-outline-accent1`) apparaissent sur
     plusieurs pages (Cours, Compétences…) qui ne chargent PAS le même script de
     cartes. Leur style + l'état actif vivent donc ici (tokens.js est chargé
     partout), et non dans course-cards.js.

     Style pilule au design system ; le bouton qui correspond à la page courante
     passe en PLEIN à la couleur d'accent de la page. Repérage par POSITION (le
     bouton LW ne porte pas son URL cible de façon fiable) : map slug -> index.
     Ajouter une page = une ligne dans HERO_ACTIVE.

     ⚠️ L'ALIGNEMENT des boutons (boîte 1000px) reste dans course-cards.js : il
     n'est valable que là où le titre est calé sur 1000px (page Cours). Ailleurs
     (ex. Compétences) le titre est à sa place naturelle et les boutons suivent.
     ==================================================================== */
  var HERO_ACTIVE={ "formation-par-modules":0, "formation-par-comptences":1 };
  var HERO_BTN_CSS=
      "#pageContent .learnworlds-button.learnworlds-button-outline-accent1{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;padding:11px 26px !important;height:auto !important;border-radius:var(--ps-r-pill,999px) !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;background:#fff !important;color:var(--ps-text,#1c1f26) !important;box-shadow:0 1px 2px rgba(0,0,0,.04) !important;transition:all .15s ease !important;cursor:pointer !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1 *{font-family:inherit !important;color:inherit !important;font-weight:inherit !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1:hover{border-color:var(--ps-accent,#6161FF) !important;color:var(--ps-accent,#6161FF) !important;background:var(--ps-accent-tint,#EDEDFF) !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active{background:var(--ps-accent,#6161FF) !important;border-color:var(--ps-accent,#6161FF) !important;color:#fff !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active *{color:#fff !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active:hover{background:var(--ps-accent-hover,#4B4BE0) !important;border-color:var(--ps-accent-hover,#4B4BE0) !important;color:#fff !important;}";

  function heroBtns(){
    var st=document.getElementById("ps-hero-btn");
    if(!st){ st=document.createElement("style"); st.id="ps-hero-btn"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==HERO_BTN_CSS) st.textContent=HERO_BTN_CSS;
    if(!document.body) return;
    var m=document.body.className.match(/slug-([a-z0-9-]+)/i);
    var idx=m ? HERO_ACTIVE[m[1]] : undefined;
    var btns=document.querySelectorAll("#pageContent .learnworlds-button.learnworlds-button-outline-accent1");
    btns.forEach(function(b,i){ b.classList.toggle("ps-hb-active", idx!==undefined && i===idx); });
  }

  /* ====================================================================
     ANTI-FLASH (FOUC) — masquer les cartes tant que nos scripts ne les ont pas
     refaites, puis révéler en FONDU. Sinon on voit les cartes NATIVES de
     LearnWorlds une fraction de seconde (« l'ancien css ») avant le restyling.
     Scopé aux pages à cartes gérées (par slug) pour ne RIEN cacher ailleurs.
     Révélé dès qu'une carte reconstruite apparaît (.ps-mcard/.ps-cc/…), ou au
     bout de 3,5 s (filet de sécurité : ne JAMAIS laisser une page cachée, même
     si un script échoue).
     ⚠️ Efficace parce que ce fichier (petit, en cache) s'exécute avant que la
     grosse SPA de LearnWorlds ne peigne les cartes. ==================== */
  /* 🔴 MAJ 30/07 — les slugs de Cours et Compétences ont CHANGÉ : `empty` ->
     `formation-par-modules`, `page-introduction` -> `formation-par-comptences`
     (relevés dans le sitemap et vérifiés en direct ; `/page-introduction`
     renvoie désormais une page d'erreur). Conséquence de l'ancien nom ici :
     l'anti-flash ne s'appliquait plus du tout sur la page Cours. */
  var CLOAK_SLUGS=["formation-par-modules","emptykk-clone-clone","fiches-secteur","fiches-secteur-clone","sentrainer"];
  var READY_SEL="#pageContent .ps-mcard,#pageContent .ps-cc,#pageContent .ps-ccab,#pageContent .ps-scard,#pageContent .ps-pfc";
  function cloak(){
    if(document.getElementById("ps-cloak")) return;
    /* 🔴 Trop tard ? Si les cartes sont DÉJÀ dans le DOM (LW les a déjà peintes),
       les cacher maintenant créerait un « blink » (visible -> caché -> révélé),
       pire que le flash. Dans ce cas on ne cache pas : jamais pire que l'actuel. */
    if(document.querySelector("#pageContent .cards-grandpa .lw-course-card")) return;
    /* pas sur une page à cartes gérée -> inutile (le sélecteur ne matcherait rien,
       mais on évite d'injecter une feuille pour rien). */
    var base=CLOAK_SLUGS.map(function(s){ return "body.slug-"+s; });
    var trans=base.map(function(b){ return b+" #pageContent .cards-grandpa .lw-course-card"; }).join(",")+"{transition:opacity .35s ease !important;}";
    var hide=base.map(function(b){ return b+":not(.ps-cards-ready) #pageContent .cards-grandpa .lw-course-card"; }).join(",")+"{opacity:0 !important;}";
    var st=document.createElement("style"); st.id="ps-cloak"; st.textContent=trans+hide;
    var head=document.head||document.documentElement; head.insertBefore(st, head.firstChild);
  }
  function reveal(){ if(document.body) document.body.classList.add("ps-cards-ready"); }
  var _revObs=null;
  function watchReveal(){
    if(!document.body || document.body.classList.contains("ps-cards-ready")) return;
    if(document.querySelector(READY_SEL)){ reveal(); return; }
    if(_revObs) return;
    _revObs=new MutationObserver(function(){ if(document.querySelector(READY_SEL)){ reveal(); _revObs.disconnect(); } });
    _revObs.observe(document.documentElement,{childList:true,subtree:true});
  }

  /* ====================================================================
     BOUTON RETOUR sur le PLAYER (page /path-player) — REMPLACE le natif
     --------------------------------------------------------------------
     Le player LW a un bouton natif « Retour à la page du cours »
     (a.-default-course-player-back, en haut de la sidebar du burger) qui
     mène à la présentation du cours. Quand une carte de liste (ex. fiches
     cabinet) est cliquée, le script de la page pose
     sessionStorage.psPlayerReturn = {url,label,slug}. Ici, si on est sur le
     player DU cours qu'on vient d'ouvrir (slug === courseid), on REMPLACE ce
     bouton natif : (1) on réécrit son libellé, (2) on intercepte son clic
     (phase CAPTURE, avant le handler natif) pour rediriger vers l'origine
     (ex. /fiches-secteur-clone) au lieu de la présentation. Batch auto.
     🔴 Le player ne se peint PAS en onglet caché (SPA) ; validé en direct,
     onglet au 1er plan : clic natif -> /fiches-secteur-clone. Placement/label
     ajustables ici. */
  function playerReturn(){
    var r; try{ r=JSON.parse(sessionStorage.getItem("psPlayerReturn")||"null"); }catch(e){ return null; }
    if(!r || !r.url) return null;
    var c=(new URLSearchParams(location.search)).get("courseid")||"";
    if(r.slug && c && r.slug!==c) return null;   // pas le cours ouvert depuis la liste
    return r;
  }
  function playerBack(){
    if(!/\/path-player/.test(location.pathname) && !(document.body && document.body.classList.contains("slug-path-player"))) return;
    var d=playerReturn();
    if(!d) return;
    /* 1) Réétiquette le libellé du bouton retour natif de la sidebar. */
    document.querySelectorAll("a.-default-course-player-back span").forEach(function(sp){
      if(sp.children.length===0 && (sp.textContent||"").trim()) sp.textContent=(d.label||"Retour").replace(/[<>]/g,"");
    });
    /* 2) Intercepte le clic du bouton natif (capture) et redirige vers
       l'origine. Posé une seule fois ; re-vérifie le flag AU CLIC. */
    if(!window.__psBackHooked){
      window.__psBackHooked=true;
      document.addEventListener("click", function(e){
        var back=e.target && e.target.closest && e.target.closest("a.-default-course-player-back");
        if(!back) return;
        var r=playerReturn();
        if(!r) return;                       // pas notre cas -> on laisse le natif
        e.preventDefault(); e.stopImmediatePropagation();
        window.location.href=r.url;
      }, true);
    }
  }

  /* ====================================================================
     LECTEUR IMMERSIF (page /path-player) — barre du bas auto-masquée
     --------------------------------------------------------------------
     La barre de navigation du bas (.-default-course-player-topbar) se cache
     pendant la lecture et réapparaît quand la souris s'approche du bas, puis se
     re-cache ~0,8 s après que la souris s'éloigne (auto-masquage temporisé, pour
     qu'elle disparaisse même si la souris s'arrête). 🔴 Le SOMMAIRE (.-first-col)
     a été RETIRÉ de l'immersif : le masquer par transform écrasait le burger natif
     (symptôme « pas de sommaire »). Le sommaire reste piloté par le burger.
     Seuils (110px) / délai (800ms) / vitesse (.3s) ajustables ici. */
  function immersivePlayer(){
    var onP = /\/path-player/.test(location.pathname) || (document.body && document.body.classList.contains("slug-path-player"));
    if(!onP || !document.body) return;
    if(!document.getElementById("ps-imm-css")){
      var s=document.createElement("style"); s.id="ps-imm-css";
      /* 🔴🔴 DEUX classes exigées : `ps-imm-bas` atteste que la barre est
         RÉELLEMENT en bas de l'écran. Sur une unité QUIZ, LearnWorlds rend cette
         même barre EN HAUT (l'élément s'appelle d'ailleurs `topbar`) — et un
         `translateY(130%)` sur une barre du haut ne la sort pas de l'écran, il la
         POUSSE DANS LE CONTENU : elle restait visible et décalée (signalé par
         Ziad, capture d'un quiz à l'appui). On ne masque donc que ce qui est
         vraiment en bas. */
      s.textContent="#coursePlayerWrapper .-default-course-player-topbar{transition:transform .3s ease !important;}"+
        "body.ps-imm-nobottom.ps-imm-bas #coursePlayerWrapper .-default-course-player-topbar{transform:translateY(130%) !important;}";
      (document.head||document.documentElement).appendChild(s);
      document.body.classList.add("ps-imm-nobottom");   // démarre caché
    }

    if(window.__psImmOn) return; window.__psImmOn=true;   // 🔴 tout ce qui suit ne s'enregistre QU'UNE FOIS (4 appels : démarrage + 3 relances)
    /* Barre en bas ou en haut ? Le test tient dans les DEUX états : masquée, une
       barre du bas reste sous la moitié de l'écran, et une barre du haut au-dessus.
       Réévalué en continu car le lecteur change d'unité sans recharger la page. */
    function evaluerBarre(){
      var b=document.querySelector("#coursePlayerWrapper .-default-course-player-topbar");
      if(!b){ document.body.classList.remove("ps-imm-bas"); return; }
      var r=b.getBoundingClientRect();
      if(!r.height){ document.body.classList.remove("ps-imm-bas"); return; }
      document.body.classList.toggle("ps-imm-bas", (r.top + r.height/2) > (window.innerHeight/2));
    }
    evaluerBarre();
    setInterval(evaluerBarre, 1000);
    window.addEventListener("resize", evaluerBarre, {passive:true});
    var hideT;
    function scheduleHide(){ clearTimeout(hideT); hideT=setTimeout(function(){ document.body.classList.add("ps-imm-nobottom"); }, 1200); }
    document.addEventListener("mousemove", function(e){
      if((window.innerHeight - e.clientY) < 110){ document.body.classList.remove("ps-imm-nobottom"); clearTimeout(hideT); }  // près du bas -> montre
      else scheduleHide();                                                                                                   // ailleurs -> re-cache après délai
    }, {passive:true});
    document.addEventListener("mouseleave", scheduleHide, {passive:true});
    /* 🔴 Le contenu de lecture est dans une IFRAME same-origin : les mousemove N'Y
       REMONTENT PAS au document parent → sans ça la barre ne se re-cache jamais quand
       on lit (bug « ne disparaît pas quand on quitte la zone »). On écoute AUSSI
       l'iframe : toute activité dedans = lecture → programme le masquage. Ré-attaché
       périodiquement (l'iframe se recharge à chaque leçon). */
    function hookIframe(){
      var f=document.querySelector("#coursePlayerWrapper iframe");
      if(!f) return;
      try{ var d=f.contentDocument; if(d && !d.__psImmHook){ d.__psImmHook=true; d.addEventListener("mousemove", scheduleHide, {passive:true}); } }catch(_){}
    }
    hookIframe(); setInterval(hookIframe, 2000);
  }

  /* ====================================================================
     BOUTON RETOUR DU PLAYER → PAGE PRINCIPALE, GÉNÉRIQUE (site-wide)
     --------------------------------------------------------------------
     Sur une page de LISTE, au clic d'un lien de cours, on mémorise l'origine
     dans sessionStorage.psPlayerReturn. playerBack() (plus haut) réécrit alors le
     bouton retour natif du player (« Retour à la page du cours ») pour revenir
     DIRECT à cette page principale, sans passer par la présentation. Marche sur
     TOUTES les pages sans script par page. Libellé selon le slug de la page. */
  var RETURN_LABELS={"formation-par-modules":"Retour aux cours",sentrainer:"Retour à l'entraînement","emptykk-clone-clone":"Retour aux études de cas","fiches-secteur":"Retour aux fiches secteur","fiches-secteur-clone":"Retour aux fiches cabinet","formation-par-comptences":"Retour aux compétences"};
  function returnLabel(){ var m=(((document.body&&document.body.className)||"")).match(/slug-([a-z0-9-]+)/); return (m&&RETURN_LABELS[m[1]])||"Retour"; }
  function playerFlag(){
    if(window.__psFlagOn) return; window.__psFlagOn=true;
    document.addEventListener("click", function(e){
      if(/\/path-player/.test(location.pathname)) return;                  // pas depuis le player
      var a=e.target&&e.target.closest&&e.target.closest("a[href]"); if(!a) return;
      var href=a.getAttribute("href")||"";
      var m=href.match(/courseid=([^&]+)/)||href.match(/\/course\/([^\/?#]+)/); if(!m) return;   // pas un lien de cours
      var slug; try{ slug=decodeURIComponent(m[1]); }catch(_){ slug=m[1]; }
      try{ sessionStorage.setItem("psPlayerReturn", JSON.stringify({url:location.pathname,label:returnLabel(),slug:slug})); }catch(_){}
    }, true);   // capture, avant navigation
  }

  /* ====================================================================
     PANNEAU FLOTTANT WEGLOT -> MASQUÉ (site-wide, demandé par Ziad)
     --------------------------------------------------------------------
     Weglot ajoute de lui-même son propre sélecteur de langue : un
     `div.weglot-container` collé au `<body>` qui contient un
     `aside.weglot_switcher` en `position:fixed` en bas à droite
     (« Français ▸ »). Il faisait DOUBLON avec les drapeaux du header
     (ci-dessous, qui sont notre vrai switcher) et se superposait à ce qui
     traîne dans ce coin de l'écran.
     🔴 On masque l'INTERFACE, pas la traduction : `Weglot.switchTo()` ne
     dépend pas de ce panneau — les drapeaux continuent de fonctionner
     (vérifié en direct : cycle FR -> EN -> FR avec le panneau masqué).
     🔴 CSS et pas JS : la règle est posée AVANT que Weglot n'injecte son
     panneau (il se charge après nous), donc il n'apparaît jamais — pas de
     clignotement, et rien à rejouer au changement de page.
     Pour le faire revenir un jour : supprimer ce bloc. Le même réglage
     existe côté Weglot (`hide_switcher`) mais il vit dans les paramètres
     Weglot/LearnWorlds, hors de ce dépôt. */
  (function(){
    if(document.getElementById("ps-wg-hide")) return;
    var st=document.createElement("style"); st.id="ps-wg-hide";
    st.textContent=".weglot-container,aside.weglot_switcher{display:none !important;}";
    (document.head||document.documentElement).appendChild(st);
  })();

  /* ====================================================================
     DRAPEAUX FR / EN DU HEADER -> VRAI SWITCHER WEGLOT (site-wide)
     --------------------------------------------------------------------
     Les 2 drapeaux du header sont des IMAGES posées à la main dans le Site
     Builder, enveloppées dans un lien `a.js-linked-node`. 🔴 Ces liens
     pointaient vers `/courses-clone` et `/courses-clone-clone` — des pages
     sans aucun rapport (placeholders jamais nettoyés) : cliquer un drapeau
     envoyait donc sur une page au hasard au lieu de changer de langue.
     Ici on INTERCEPTE le clic (phase capture, avant la navigation) et on
     appelle l'API Weglot : `Weglot.switchTo('fr'|'en')`. Weglot traduit SUR
     PLACE, sans rechargement (vérifié en direct : la page entière, y compris
     nos contenus injectés, bascule en anglais).
     🔴 Weglot vient de l'intégration NATIVE de LearnWorlds et se charge de
     façon asynchrone -> on réessaie jusqu'à ce qu'il soit prêt.
     L'ordre des drapeaux dans le header donne les langues (1er = FR, 2e = EN) :
     changer FLAG_LANGS suffit si Ziad en ajoute ou les inverse. */
  var FLAG_LANGS=["fr","en"];

  function flagLinks(){
    /* Les drapeaux = liens du header contenant une petite image. On ne se fie
       PAS au href (il est faux) ni à une classe (aucune ne les distingue). */
    return [].slice.call(document.querySelectorAll("a.js-linked-node")).filter(function(a){
      if(!a.querySelector("img")) return false;
      var r=a.getBoundingClientRect();
      return r.top<130 && r.width>0 && r.width<80 && r.height<60;
    });
  }
  function flagActive(){
    var cur=""; try{ cur=window.Weglot.getCurrentLang(); }catch(e){ return; }
    document.querySelectorAll(".ps-flag[data-ps-lang]").forEach(function(a){
      var on=(a.getAttribute("data-ps-lang")===cur);
      a.classList.toggle("ps-flag-on", on);
      a.setAttribute("aria-current", on?"true":"false");
    });
  }
  function weglotFlags(){
    if(!window.Weglot || !window.Weglot.initialized || typeof window.Weglot.switchTo!=="function") return false;
    /* déjà convertis (les <a> n'existent plus) : on se contente de rafraîchir l'état actif */
    if(document.querySelectorAll(".ps-flag[data-ps-lang]").length>=2){ flagActive(); return true; }
    var links=flagLinks();
    if(links.length<2) return false;

    if(!document.getElementById("ps-flag-css")){
      var st=document.createElement("style"); st.id="ps-flag-css";
      /* Repère de langue active. 🔴 PAS de `grayscale` sur la langue inactive :
         Ziad n'aime pas le drapeau qui devient gris. Les deux drapeaux gardent
         donc LEURS COULEURS ; l'actif se distingue par un petit trait dessous
         (couleur d'accent) + une opacité pleine, l'inactif est juste un peu
         estompé et se réveille au survol. */
      st.textContent=
        ".ps-flag{cursor:pointer !important;position:relative !important;padding-bottom:5px !important;}"+
        ".ps-flag img{opacity:.72 !important;transition:opacity .18s ease, transform .18s ease !important;}"+
        ".ps-flag:hover img{opacity:1 !important;transform:translateY(-1px) !important;}"+
        ".ps-flag.ps-flag-on img{opacity:1 !important;}"+
        ".ps-flag::after{content:'' !important;position:absolute !important;left:50% !important;bottom:0 !important;"+
          "width:0 !important;height:2px !important;border-radius:2px !important;background:var(--ps-accent,#507EC5) !important;"+
          "transform:translateX(-50%) !important;transition:width .18s ease !important;}"+
        ".ps-flag.ps-flag-on::after{width:calc(100% - 8px) !important;}"+
        /* 🔴 Pas de RECTANGLE de focus après un clic souris (le drapeau est un
           `role=button tabindex=0` : le navigateur dessinait un cadre bleu autour,
           visible sur la capture de Ziad). On le garde pour le CLAVIER seulement. */
        ".ps-flag:focus{outline:none !important;}"+
        ".ps-flag:focus-visible{outline:2px solid var(--ps-accent,#507EC5) !important;outline-offset:3px !important;border-radius:4px !important;}";
      (document.head||document.documentElement).appendChild(st);
    }
    /* 🔴 On REMPLACE le lien LW par un <span> neutre au lieu d'intercepter son
       clic : LearnWorlds pose un écouteur sur `a.js-linked-node` qui STOPPE LA
       PROPAGATION avant d'atteindre le document — notre handler n'était jamais
       appelé (constaté : seul un écouteur posé sur `window` voyait l'événement).
       Sans balise <a>, plus rien n'intercepte. L'image d'origine est conservée
       (on déplace les enfants), donc le visuel ne change pas. */
    links.slice(0,2).forEach(function(a,i){
      var lang=FLAG_LANGS[i]||"";
      if(!lang) return;
      var span=document.createElement("span");
      span.className="ps-flag";
      span.setAttribute("data-ps-lang", lang);
      span.setAttribute("role","button");
      span.setAttribute("tabindex","0");
      span.setAttribute("title", (lang==="en")?"English":"Français");
      span.setAttribute("aria-label", (lang==="en")?"Switch to English":"Passer en français");
      span.style.cssText="display:inline-flex;align-items:center;cursor:pointer;";
      while(a.firstChild) span.appendChild(a.firstChild);
      a.parentNode.replaceChild(span, a);
      function go(){
        if(!window.Weglot) return;
        try{ if(window.Weglot.getCurrentLang()!==lang) window.Weglot.switchTo(lang); }catch(_){}
        setTimeout(flagActive, 60);
      }
      span.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); go(); });
      span.addEventListener("keydown", function(e){        // accessible au clavier
        if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); }
      });
    });
    flagActive();
    try{ window.Weglot.on("languageChanged", flagActive); }catch(_){}
    return true;
  }
  /* Weglot est injecté par LearnWorlds APRÈS nous : on retente jusqu'à ~20 s. */
  (function(){
    if(weglotFlags()) return;
    var n=0, iv=setInterval(function(){
      if(weglotFlags() || ++n>50) clearInterval(iv);
    }, 400);
  })();

  /* ====================================================================
     COURS PAR LANGUE — n'afficher que les cours de la langue courante
     --------------------------------------------------------------------
     Ziad prépare des versions ANGLAISES (SCORM EN) de ses cours. Règle
     retenue (choix de Ziad le 25/07) :
       • en ANGLAIS  -> on n'affiche QUE les cours tagués « EN » ;
       • en FRANÇAIS -> on affiche tout SAUF les cours tagués « EN ».
     🔴 Un cours SANS tag de langue est considéré FRANÇAIS : sans cette
     tolérance, les 51 cours de l'école disparaîtraient tant que Ziad n'a
     pas tout tagué. Le tag « FR » est donc facultatif, le tag « EN » est
     celui qui compte.
     🔴 Le marquage est un TAG LearnWorlds (Cours -> Tags), pas un suffixe
     de nom : le titre reste libre et rien ne casse sur une faute de frappe.
     Source : `/api/courses` (catalogue de l'école, lisible côté page, sans
     Worker ni secret) -> table slug -> tags. Apparié aux cartes par le slug
     de leur lien (`?courseid=` ou `/course/<slug>`) : vérifié 12/12 en direct.
     Le catalogue est mis en cache pour la session (il bouge rarement). */
  var LANG_TAG_EN="EN";
  var _cat=null, _catEnCours=false;

  function catalogue(cb){
    if(_cat){ cb(_cat); return; }
    /* 🔴 Cache À DURÉE LIMITÉE (10 min). Sans expiration, une catégorie ajoutée
       dans LearnWorlds n'était prise en compte qu'après fermeture de l'onglet :
       constaté en prod pendant la création des cours EN, le filtre travaillait
       sur un catalogue périmé. */
    try{
      var brut=sessionStorage.getItem("psCatTags");
      if(brut){
        var j=JSON.parse(brut);
        if(j && j.t && (Date.now()-j.t)<600000 && j.map){ _cat=j.map; cb(_cat); return; }
      }
    }catch(e){}
    if(_catEnCours) return;                       // un seul appel en vol
    _catEnCours=true;
    try{
      fetch("/api/courses",{credentials:"include",headers:{Accept:"application/json"}})
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(j){
          var arr=(j && j.courses) ? Object.keys(j.courses).map(function(k){ return j.courses[k]; }) : [];
          var map={};
          arr.forEach(function(c){
            if(!c || !c.titleId) return;
            map[c.titleId]=(c.tags||[]).map(function(t){ return String(t).trim().toUpperCase(); });
          });
          _cat=map; _catEnCours=false;
          try{ sessionStorage.setItem("psCatTags", JSON.stringify({t:Date.now(), map:map})); }catch(e){}
          cb(map);
        })
        .catch(function(){ _catEnCours=false; });
    }catch(e){ _catEnCours=false; }
  }

  /* Convention maison : un contenu anglais se termine par « - EN » (ou « EN »).
     Sert de SECONDE source au filtre de langue, et de source unique pour les
     cartes de programme (un programme n'a pas de tag). */
  var RE_TITRE_EN=/(?:^|[\s\-–—:(\[])EN[)\]]?\s*$/i;
  function titreDeCarte(card){
    var h=card.querySelector(".learnworlds-heading3")||card.querySelector("[class*='heading']");
    return (h ? h.textContent : "").replace(/\s+/g," ").trim();
  }

  function slugDeCarte(card){
    var a=card.querySelector("a[href]"); if(!a) return "";
    var h=a.getAttribute("href")||"";
    var m=h.match(/courseid=([^&]+)/)||h.match(/\/course\/([^\/?#]+)/);
    if(!m) return "";
    try{ return decodeURIComponent(m[1]); }catch(e){ return m[1]; }
  }

  var _langBound=false;
  function langCourses(evLang){
    var W=window.Weglot;
    /* 🔴 Abonnement fait ICI et pas au chargement : Weglot est injecté par
       LearnWorlds APRÈS nous, donc un `Weglot.on(...)` en haut de fichier ne
       s'exécuterait jamais (même piège que le titre animé). */
    if(!_langBound && W && W.on){ try{ W.on("languageChanged", langCourses); _langBound=true; }catch(e){} }
    var from=(W && W.options && W.options.language_from) || "fr";
    var lang=(typeof evLang==="string" && evLang) ? evLang
           : (W && W.initialized && W.getCurrentLang ? W.getCurrentLang() : from);
    var cards=document.querySelectorAll(".lw-course-card");
    if(!cards.length) return;

    if(!document.getElementById("ps-lang-css")){
      var st=document.createElement("style"); st.id="ps-lang-css";
      st.textContent=".lw-course-card.ps-lang-off{display:none !important;}"+
        /* même règle pour les cartes de PROGRAMME (page Compétences) */
        "[class*='learning-program-card'].ps-lang-off{display:none !important;}"+
        /* Bloc entier masqué quand AUCUNE de ses cartes n'est de la langue
           courante : c'est le cas d'usage « un élément par programme » (un bloc
           FR + un bloc EN sur la même page) — sans ça on verrait un carrousel
           vide avec son titre. */
        ".ps-lang-bloc-off{display:none !important;}"+
        ".ps-lang-empty{grid-column:1/-1 !important;padding:34px 4px !important;text-align:center !important;"+
        "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;"+
        "font-size:16px !important;color:var(--ps-text-soft,#676879) !important;}";
      (document.head||document.documentElement).appendChild(st);
    }

    /* 🔴🔴 PASSE IMMÉDIATE, SANS RÉSEAU (retour de Ziad, 29/07 : « on voit la
       carte disparaître, c'est pas top »). Le filtre n'agissait qu'APRÈS la
       réponse de `/api/courses` : les cartes anglaises s'affichaient, puis
       disparaissaient — un clignotement bien visible au premier chargement (les
       suivants sont instantanés grâce au cache de session).
       Or le SUFFIXE DU TITRE tranche déjà sans le moindre appel : on classe donc
       tout de suite avec lui, et la passe réseau ne fait plus que confirmer et
       rattraper les cas où le titre ne dirait rien (tag `EN` sans suffixe).
       🔴 Les DEUX passes appellent le même code : aucune règle ne peut diverger
       entre l'affichage immédiat et la correction qui suit. */
    appliquer(null);
    catalogue(appliquer);

    function appliquer(map){
      var enAnglais=(lang!==from);
      var visibles=0, masques=0;
      [].slice.call(cards).forEach(function(card){
        /* 🔴🔴 DEUX SOURCES, PAS UNE (bug signalé le 29/07 : sur un compte élève
           les cours FR et EN s'affichaient MÉLANGÉS, alors que le même filtre
           marchait sur le compte admin).
           Mécanique : `map[slug]` ne trouvait rien pour ce compte -> `tags` vide
           -> `estEN` faux -> le cours anglais passait pour français et restait
           visible. Le catalogue lui-même est PROPRE (vérifié : les 6 cours EN
           portent bien le tag `EN`), c'est l'APPARIEMENT carte -> cours qui rate
           — l'identifiant du lien (`?courseid=`) n'est pas toujours le `titleId`.
           Parade : si le tag ne tranche pas, on retombe sur le SUFFIXE DU TITRE
           (« … - EN »), exactement la convention déjà utilisée plus bas pour les
           cartes de PROGRAMME. Le repli ne peut se déclencher que sur un titre
           qui se TERMINE par EN, donc aucun cours français n'est menacé. */
        var tags=map ? map[slugDeCarte(card)] : null;
        var estEN=(!!tags && tags.indexOf(LANG_TAG_EN)>=0) || RE_TITRE_EN.test(titreDeCarte(card));
        var off=enAnglais ? !estEN : estEN;        // EN -> que les EN ; FR -> tout sauf EN
        card.classList.toggle("ps-lang-off", off);
        if(off) masques++; else visibles++;
      });

      /* 🔴 Cartes de PROGRAMME (page Compétences) : elles ne sont pas des cours,
         elles n'ont donc pas de tag. On se fie au SUFFIXE du nom — convention
         retenue avec Ziad : le programme anglais s'appelle « … - EN ». Sans ça,
         le programme anglais resterait visible en français (et son 0 % ferait
         chuter la tuile de progression de la page). */
      document.querySelectorAll("[class*='learning-program-card']").forEach(function(pc){
        var h=pc.querySelector("h3")||pc.querySelector("[class*='heading']");
        var titre=(h?h.textContent:"").replace(/\s+/g," ").trim();
        if(!titre) return;
        var estEN=RE_TITRE_EN.test(titre);            // « … - EN » OU « … EN » (même règle que les cours)
        pc.classList.toggle("ps-lang-off", enAnglais ? !estEN : estEN);
      });
      /* 🔴 Prévenir les scripts de page : la tuile « Progression sur N cours »
         fait la moyenne des cartes PRÉSENTES. Masquer une carte en CSS ne la
         retire pas du DOM -> sans ce signal, les cours de l'autre langue (à 0 %)
         resteraient dans le dénominateur et feraient chuter le pourcentage.
         Les scripts de cartes écoutent « ps-lang-change » et recalculent. */
      try{ window.dispatchEvent(new Event("ps-lang-change")); }catch(e){}

      /* 🔴 UN BLOC PAR PROGRAMME (organisation retenue avec Ziad le 26/07) :
         la page porte un élément « Cours » par langue — celui du programme FR
         et celui du programme EN. On masque donc le BLOC ENTIER dont aucune
         carte n'est de la langue courante, sinon il resterait un carrousel vide
         avec son titre. Le bloc est le conteneur de cartes (`.cards-grandpa`,
         ou à défaut le parent direct des cartes) ; on remonte aussi à sa
         SECTION si celle-ci ne contient que ce bloc, pour emporter le titre. */
      var blocs=[];
      [].slice.call(cards).forEach(function(card){
        var bloc=card.closest(".cards-grandpa")||card.parentNode;
        if(bloc && blocs.indexOf(bloc)<0) blocs.push(bloc);
      });
      blocs.forEach(function(bloc){
        var dedans=bloc.querySelectorAll(".lw-course-card");
        var cachees=bloc.querySelectorAll(".lw-course-card.ps-lang-off");
        var vide=(dedans.length>0 && dedans.length===cachees.length);
        bloc.classList.toggle("ps-lang-bloc-off", vide);
        var sec=bloc.closest("section.learnworlds-section");
        /* on n'emporte la section que si elle n'existe QUE pour ces cartes */
        if(sec && sec.querySelectorAll(".lw-course-card").length===dedans.length){
          sec.classList.toggle("ps-lang-bloc-off", vide);
        }
      });

      /* Message seulement si PLUS RIEN n'est visible sur toute la page (cas où
         aucune version dans cette langue n'existe encore). */
      var grille=cards[0] && cards[0].parentNode;
      if(grille){
        var note=document.querySelector(".ps-lang-empty");
        if(!visibles && masques){
          if(!note){ note=document.createElement("div"); note.className="ps-lang-empty"; grille.appendChild(note); }
          note.textContent="Aucun cours n'est encore disponible dans cette langue.";
          note.classList.remove("ps-lang-bloc-off");
          var pBloc=note.closest(".ps-lang-bloc-off");
          if(pBloc) pBloc.classList.remove("ps-lang-bloc-off");   // sinon le message serait masqué avec son bloc
        } else if(note){ note.remove(); }
      }
    }
  }
  /* Les cartes sont rendues par le JS catalogue de LW, souvent après nous. */
  [400,1000,2000,3500,6000].forEach(function(d){ setTimeout(function(){ langCourses(); }, d); });

  /* 🔴🔴 OBSERVATEUR — classer DÈS QUE la carte entre dans le DOM.
     Les relances ci-dessus sont à intervalles fixes : une carte rendue à 1,2 s
     n'était filtrée qu'à 2 s, soit ~800 ms pendant lesquels l'étudiant voyait la
     carte anglaise AVANT sa disparition (mesuré en harnais : 2,2 s). Avec
     l'observateur, la classification suit l'apparition de la carte.
     🔴 On n'observe QUE `childList` : nos propres `classList.toggle` sont des
     mutations d'ATTRIBUT, donc ils ne se re-déclenchent pas eux-mêmes (pas de
     boucle). Le petit délai regroupe les cartes rendues en rafale. */
  (function(){
    var enAttente=false;
    var obsLang=new MutationObserver(function(mutations){
      if(enAttente) return;
      var pertinent=false;
      for(var i=0;i<mutations.length && !pertinent;i++){
        var aj=mutations[i].addedNodes;
        for(var j=0;j<aj.length;j++){
          var n=aj[j];
          if(n.nodeType!==1) continue;
          if((n.classList && n.classList.contains("lw-course-card")) ||
             (n.querySelector && n.querySelector(".lw-course-card"))){ pertinent=true; break; }
        }
      }
      if(!pertinent) return;
      /* 🔴 MICROTÂCHE et non setTimeout : les minuteurs sont BRIDÉS à ~1 s dans
         un onglet d'arrière-plan (mesuré : 1,7 s au lieu de 30 ms). Une
         microtâche s'exécute à la fin de la tâche courante, sans bridage — donc
         le masquage suit vraiment l'apparition de la carte. Elle regroupe aussi
         les cartes rendues en rafale : un seul passage pour tout le lot. */
      enAttente=true;
      Promise.resolve().then(function(){ enAttente=false; langCourses(); });
    });
    function brancher(){ if(document.body) obsLang.observe(document.body,{childList:true,subtree:true}); }
    if(document.body) brancher(); else document.addEventListener("DOMContentLoaded", brancher);
  })();

  /* ====================================================================
     CO-BRANDING PARTENAIRE (écoles clientes) — site-wide
     --------------------------------------------------------------------
     Une école qui achète la formation pour ses étudiants veut voir SA marque.
     Ici : un badge « avec ESSEC » à côté du logo PrepaStrat dans l'en-tête ;
     `home-page.js` ajoute en plus une section d'accueil (il lit la même table
     via `window.PS_PARTENAIRE`, posé par `partenaire()` ci-dessous).

     🔴🔴 DÉTECTION SANS RÉSEAU : LearnWorlds fabrique tout seul un tag
     `cf_<champ>_<valeur>` pour chaque champ personnalisé rempli — vérifié en
     direct, le compte de Ziad porte `cf_ecole_ESCP` dans `me.tags`. Reconnaître
     l'école se réduit donc à lire `me.tags` : aucun appel, aucun Worker.
     🔴 Lire les TAGS et pas `me.custom_fields`, qui est VIDE côté page.
     🔴 `me` n'existe que pour un membre CONNECTÉ : un prospect anonyme ne voit
     aucun co-branding. C'est une limite du dispositif, pas un bug.
     ⚠️ `cf_ecole` est déclaré par l'étudiant et facultatif : pour une école
     facturée, le signal fiable est un tag posé par AUTOMATISATION sur le domaine
     e-mail. Les deux sont acceptés ci-dessous (tag d'abord, domaine en repli).

     AJOUTER UNE ÉCOLE = UNE ENTRÉE dans PARTENAIRES. Rien d'autre à toucher.
     🔴 Le logo est pour l'instant un bloc TYPOGRAPHIQUE : le logo d'une école est
     une marque déposée, on ne le récupère pas sur son site — il arrive par le
     contrat, puis se dépose dans /logos (champ `logo` ci-dessous). */
  var PARTENAIRES={
    essec:{
      nom:"ESSEC",
      /* 🔴🔴 TAG D'AUTOMATISATION UNIQUEMENT (bascule demandée le 29/07).
         `cf_ecole_ESSEC` a été RETIRÉ volontairement : ce tag vient du champ
         « école » que l'étudiant remplit LUI-MÊME dans l'annuaire — n'importe qui
         pouvait donc se déclarer ESSEC et récupérer le co-branding d'une école
         payante. Le tag ci-dessous est posé par une AUTOMATISATION LearnWorlds sur
         le domaine de l'e-mail, adresse vérifiée à l'inscription : il ne peut pas
         être obtenu sans posséder une adresse @essec.edu.
         🔴 Le nom doit correspondre EXACTEMENT au tag de l'automatisation. */
      tags:["ecole-essec"],
      /* Repli de secours si l'automatisation n'a pas encore tourné (tags posés
         seulement APRÈS activation chez LearnWorlds : les comptes existants se
         traitent en lot). Le domaine est celui de l'adresse VÉRIFIÉE. */
      domaines:["essec.edu"],
      logo:"",                       // SVG transparent à déposer dans /logos, sinon bloc typo
      pastille:"Accès offert par votre école",
      /* Texte fourni par Ziad le 29/07 — c'est du contenu commercial, il est
         maître du mot à mot. Deux corrections de saisie seulement : « moduldes »
         -> « modules », et « modules de formations » -> « de formation ». */
      titre:"Votre préparation au conseil, sponsorisée par l'Essec Career Center",
      texte:"Bénéficiez de l'intégralité de la plateforme en ligne : des modules de formation, une banque d'études de cas complète, des fiches cabinets et fiches secteurs.",
      puces:[
        {t:"Catalogue complet", s:"Aucun paiement"},
        {t:"Promo ESSEC",       s:"Annuaire entre étudiants"},
        {t:"Webinars",          s:"Tous les mois"}
      ],
      /* Accompagnements en présentiel proposés à l'école, affichés en 4 cartes
         sous la bande partenaire (contenu fourni par Ziad le 29/07).
         🔴 `url` VIDE = le bouton est rendu en pastille NON cliquable plutôt
         qu'en lien mort : un `href="#"` renverrait l'étudiant en haut de page,
         ce qui est pire que pas de lien. Renseigner l'URL suffit à l'activer. */
      offres:[
        {
          titre:"Ace Your Interview",
          lignes:["Entretien individuel en conditions réelles. 1 h avec un consultant ou ex-consultant MBB",
                  "1 fois dans l'année"],
          cta:"Réserver un créneau", url:""
        },
        {
          titre:"Task Force",
          lignes:["17 h de formation sur 3 jours",
                  "30 € de frais d'inscription — gratuit pour les étudiants boursiers"],
          cta:"S'inscrire à une session", url:""
        },
        {
          titre:"Consulting Squad",
          lignes:["Curieux du conseil à l'international ? 4 h de formation sur le recrutement dans une région du monde",
                  "8 personnes par squad"],
          cta:"S'inscrire à une session", url:""
        },
        {
          titre:"Classe Étoile",
          lignes:["Pour les étudiants au 2e tour de top cabinet",
                  "4 personnes par classe",
                  "3 h de formation + 1 h d'entretien individuel"],
          cta:"S'inscrire à une session", url:""
        }
      ]
    }
  };

  function membrePS(){ try{ return (typeof me==="object" && me) ? me : null; }catch(e){ return null; } }

  var _part;                       // undefined = pas encore cherché, null = aucun
  function partenaire(){
    if(_part!==undefined) return _part;
    _part=null;
    var u=membrePS();
    if(u){
      var tags=[].slice.call(u.tags||[]).map(function(t){
        return String(typeof t==="string" ? t : (t && t.name) || "").toLowerCase();
      });
      var dom=(String(u.email||"").split("@")[1]||"").toLowerCase();
      for(var k in PARTENAIRES){
        var p=PARTENAIRES[k], ok=false;
        for(var i=0;i<p.tags.length && !ok;i++){ if(tags.indexOf(p.tags[i].toLowerCase())>=0) ok=true; }
        for(var j=0;j<p.domaines.length && !ok;j++){
          var d=p.domaines[j].toLowerCase();
          if(dom===d || (dom.length>d.length && dom.slice(-(d.length+1))==="."+d)) ok=true;
        }
        if(ok){ _part=p; break; }
      }
    }
    window.PS_PARTENAIRE=_part;    // home-page.js lit ça pour sa section d'accueil
    return _part;
  }

  function partnerHeader(){
    var p=partenaire();
    if(!p) return;
    if(document.querySelector(".ps-cob")) return;          // déjà posé
    var logo=document.querySelector("img.lw-logo");
    if(!logo) return;                                       // en-tête pas encore rendu -> relance
    /* On se pose APRÈS le lien qui enveloppe le logo, dans la même rangée flex. */
    var ancre=(logo.closest && logo.closest("a")) || logo;
    if(!ancre.parentNode) return;

    if(!document.getElementById("ps-cob-css")){
      var st=document.createElement("style"); st.id="ps-cob-css";
      st.textContent=
        /* 🔴🔴 Le logo vit dans un `div.lw-topbar-logo-wrapper` en `display:flex`
           avec **flex-wrap:wrap** (structure relevée sur le site). Sans annuler ce
           wrap, le badge passe à la ligne dès qu'il manque quelques pixels et
           l'en-tête grandit d'un cran — exactement ce que Ziad a constaté.
           On force donc `nowrap` sur CE conteneur (classe posée par le script,
           jamais sur tous les wrappers du site) et on empêche le badge de se
           comprimer ou de se couper en deux. */
        ".ps-cob-host{flex-wrap:nowrap !important;align-items:center !important;"+
          "width:auto !important;max-width:none !important;flex:0 0 auto !important;}"+
        ".ps-cob{display:inline-flex !important;align-items:center !important;gap:9px !important;margin-left:14px !important;"+
          "vertical-align:middle !important;flex:none !important;white-space:nowrap !important;}"+
        ".ps-cob-sep{display:block !important;width:1px !important;height:26px !important;background:#E3E8F0 !important;}"+
        ".ps-cob-av{font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:10.5px !important;font-weight:700 !important;"+
          "letter-spacing:.07em !important;text-transform:uppercase !important;color:#8A93A5 !important;}"+
        ".ps-cob-nom{font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:14px !important;font-weight:700 !important;"+
          "letter-spacing:.14em !important;color:var(--ps-cob-c,#243B6B) !important;border:1.5px solid var(--ps-cob-c,#243B6B) !important;"+
          "border-radius:4px !important;padding:3px 9px !important;line-height:1.2 !important;}"+
        ".ps-cob-img{height:26px !important;width:auto !important;display:block !important;}"+
        /* en petit écran l'en-tête est déjà serré : on ne garde que la marque */
        "@media (max-width:900px){.ps-cob-av{display:none !important;}.ps-cob{margin-left:9px !important;gap:7px !important;}}";
      (document.head||document.documentElement).appendChild(st);
    }

    var box=document.createElement("span");
    box.className="ps-cob";
    box.style.setProperty("--ps-cob-c", "#243B6B");
    var sep=document.createElement("span"); sep.className="ps-cob-sep"; box.appendChild(sep);
    var av=document.createElement("span"); av.className="ps-cob-av"; av.textContent="avec"; box.appendChild(av);
    if(p.logo){
      var im=document.createElement("img");
      im.className="ps-cob-img"; im.src=p.logo; im.alt=p.nom;
      box.appendChild(im);
    } else {
      var nm=document.createElement("span"); nm.className="ps-cob-nom"; nm.textContent=p.nom;
      box.appendChild(nm);
    }
    /* 🔴🔴 On se pose dans la COLONNE du logo, pas à côté du logo lui-même.
       Mesuré sur le site : `div.lw-topbar-logo-wrapper` fait EXACTEMENT la largeur
       du logo (138 px, zéro place restante) — y glisser le badge le renvoyait donc
       à la ligne, et `flex-wrap:nowrap` seul n'y changeait rien puisqu'il n'y a
       pas de place. En le posant dans la colonne parente et en libérant la largeur
       des deux conteneurs, la colonne s'élargit (188 -> 326 px) et la hauteur de
       l'en-tête ne bouge pas (55 px avant comme après, vérifié en direct). */
    var conteneur=ancre.parentNode;
    var colonne=conteneur && conteneur.parentNode;
    var cible=(colonne && colonne.classList && /logo-col/.test(colonne.className)) ? colonne : conteneur;
    cible.appendChild(box);
    if(conteneur.classList) conteneur.classList.add("ps-cob-host");
    if(cible!==conteneur && cible.classList) cible.classList.add("ps-cob-host");
  }

  /* ====================================================================
     DÉPÔT DE LA PROGRESSION (site-wide) — mesuré le 30/07
     --------------------------------------------------------------------
     🔴 POURQUOI : calculer la progression par l'API d'administration coûte
     ~1 appel PAR COURS et par membre (~60 pour un inscrit au catalogue complet),
     face à une limite LearnWorlds de 30 requêtes / 10 s qu'aucun plan Cloudflare
     ne relève. Or la progression est DÉJÀ dans la page : chaque membre dépose
     donc la sienne en passant (même principe que sa photo), et le Worker n'a plus
     qu'à LIRE. Quasi temps réel, et plus aucun appel LearnWorlds par membre.

     🔴 Ce qu'on lit : `.lw-course-card-progress-bar` PORTE lui-même
     `style="width:N%"` — l'élément EST le remplissage, il n'a aucun enfant
     (lire `firstElementChild.style.width` ne renvoie rien : piège vécu).
     🔴 Ce qu'on envoie : le `titleId` du lien de la carte, le SEUL identifiant
     commun à la page et à l'API d'administration (mesuré 46/46 ; les clés
     24-hexa de `/api/courses` ne matchent 0/46 et ne sortent jamais de la page).
     🔴 Ce qu'on n'invente pas : une carte SANS barre est ignorée. Poser un 0 %
     fabriquerait un faux « pas commencé », indiscernable d'un vrai.
     🔴 UNE PAGE NE MONTRE QU'UNE PARTIE DU CATALOGUE (10 cours sur Cours, 12 sur
     Cas… union de 46 sur 58 inscrits) : c'est le Worker qui FUSIONNE, on n'envoie
     ici que ce que la page courante sait. */
  var DEP_ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/depot";
  /* Clé de SITE Turnstile : publique par nature (c'est la clé secrète, côté
     Worker, qui valide). Même clé que l'annuaire, /account et /profile.
     🔴 Jamais de clé de service ici : ce dépôt est PUBLIC. */
  var DEP_SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";
  var DEP_SIG="psDepotSig";
  var depEnVol=false, depTsEl=null, depRendu=false, depCorps=null, depSig="";

  function depMe(){ try{ return (typeof me==="object" && me && me.id) ? me : null; }catch(e){ return null; } }

  /* Paires titleId -> % présentes sur la page courante. null si rien. */
  function depLire(){
    var cards=document.querySelectorAll(".lw-course-card");
    var out={}, n=0;
    for(var i=0;i<cards.length;i++){
      var bar=cards[i].querySelector(".lw-course-card-progress-bar");
      if(!bar) continue;
      var w=(bar.style && bar.style.width)||"";
      if(w.indexOf("%")<0) continue;
      var p=parseFloat(w);
      if(!isFinite(p)) continue;
      var slug=slugDeCarte(cards[i]);
      if(!slug) continue;
      out[slug]=Math.max(0,Math.min(100,Math.round(p)));
      n++;
    }
    return n?out:null;
  }

  /* Progression PAR PROGRAMME (30/07) — la trouvaille qui règle les tuiles vides.
     🔴 Sur la page Compétences, LearnWorlds publie une barre par PROGRAMME
     (`.lw-learning-program-card`), pas par cours : mesuré, 4 cartes portant chacune
     une `.lw-course-card-progress-bar` à largeur inline, avec l'identifiant du
     programme dans le lien (`learningProgramId`). Notre collecteur ne regardait que
     les cartes de COURS et passait donc à côté.
     🔴 POURQUOI C'EST MIEUX QU'UNE MOYENNE : c'est une valeur DIRECTE, qui n'exige
     pas de retrouver chaque cours du programme — or 19 références de cours des
     programmes de l'école ne correspondent à aucune carte du site, ce qui laissait
     6 programmes à « — » pour toujours.
     🔴 On l'émet sous LES DEUX identifiants : le lien porte l'id de 24 caractères
     hexadécimaux, alors que `/bundles` côté API parle l'identifiant COURT.
     `me.userLearningPrograms` donne la correspondance sans aucun appel réseau. */
  function depLireProgrammes(u){
    var cards=document.querySelectorAll(".lw-learning-program-card");
    if(!cards.length) return null;
    var court={};                                  // id 24-hexa -> identifiant court
    var arr=(u && u.userLearningPrograms)||[];
    for(var i=0;i<arr.length;i++){
      if(arr[i] && arr[i].id && arr[i].titleId) court[String(arr[i].id)]=String(arr[i].titleId);
    }
    var out={}, n=0;
    for(var j=0;j<cards.length;j++){
      var bar=cards[j].querySelector(".lw-course-card-progress-bar");
      if(!bar) continue;                           // pas de barre : on n'invente pas un 0 %
      var w=(bar.style && bar.style.width)||"";
      if(w.indexOf("%")<0) continue;
      var p=parseFloat(w);
      if(!isFinite(p)) continue;
      p=Math.max(0,Math.min(100,Math.round(p)));
      var a=cards[j].querySelector("a[href]");
      var h=a?(a.getAttribute("href")||""):"";
      var m=h.match(/learningProgramId=([^&]+)/)||h.match(/[?&]program=([^&]+)/);
      if(!m) continue;                             // sans identifiant, la valeur est inutilisable
      var id;
      try{ id=decodeURIComponent(m[1]); }catch(e){ id=m[1]; }
      out[id]=p; n++;
      if(court[id]) out[court[id]]=p;              // même valeur sous l'identifiant court
    }
    return n?out:null;
  }

  /* Programmes du membre : `me.userLearningPrograms`, disponible sans réseau et
     COMPLET quelle que soit la page.
     🔴 C'est LUI le signal d'inscription, pas la présence d'une barre : les barres
     apparaissent quasi partout pour un membre connecté (mesuré 10/11, 3/3, 11/11,
     10/10, 12/12), donc une barre à 0 % ne prouve rien. Sans cette liste, un
     rapport d'école compterait des non-inscrits comme « inscrits à 0 % ». */
  /* 🔴 On envoie les DEUX identifiants de chaque programme. Mesuré en direct le
     30/07 : côté page un programme a un `id` de 24 caractères hexadécimaux ET un
     `titleId` court, exactement comme les cours — et c'est l'identifiant COURT que
     parle `/bundles` côté API d'administration. N'envoyer que `id` donnait une
     intersection VIDE côté Worker (13 programmes d'un côté, 12 de l'autre, 0 en
     commun). Envoyer les deux évite de parier sur le bon, et le Worker n'a qu'à
     tester l'appartenance. */
  function depProgrammes(u){
    var arr=u && u.userLearningPrograms;
    if(!arr || !arr.length) return [];
    var out=[];
    for(var i=0;i<arr.length;i++){
      var p=arr[i]; if(!p) continue;
      if(p.id) out.push(String(p.id));
      if(p.titleId && p.titleId!==p.id) out.push(String(p.titleId));
    }
    return out;
  }

  function depEnvoyer(jeton){
    if(!depCorps){ depEnVol=false; return; }
    var envoye=depSig;
    fetch(DEP_ENDPOINT,{
      method:"POST",
      headers:{ "Content-Type":"application/json", "X-Turnstile-Token":jeton },
      body:JSON.stringify(depCorps)
    })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        /* 🔴 On ne mémorise la signature QUE si le Worker a bien répondu : sinon
           un échec réseau ferait sauter le dépôt jusqu'à la prochaine session,
           et la progression serait perdue pour rien. */
        if(j && j.ok){ try{ sessionStorage.setItem(DEP_SIG, envoye); }catch(e){} }
      })
      .catch(function(){})
      .then(function(){ depEnVol=false; });
  }

  /* Turnstile invisible, auto-injecté. Widget rendu HORS ÉCRAN et non
     `display:none` : caché de cette façon il ne s'exécuterait pas.
     🔴 Un jeton est à USAGE UNIQUE : celui de /profile ou de l'annuaire a déjà
     servi, il faut le nôtre (même leçon que le dépôt de photo). */
  function depTurnstile(){
    if(!depTsEl){
      depTsEl=document.createElement("div");
      depTsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(depTsEl);
    }
    window.psDepTsReady=function(){
      try{
        /* 🔴 Le widget ne se rend qu'UNE fois ; pour un 2e dépôt (la page a fini
           d'afficher ses cartes entre-temps) on demande un NOUVEAU jeton par
           `reset` — un jeton Turnstile ne se rejoue pas, le Worker le refuserait
           en « timeout-or-duplicate ». */
        if(depRendu){ window.turnstile.reset(depTsEl); return; }
        window.turnstile.render(depTsEl,{
          sitekey:DEP_SITEKEY,
          callback:depEnvoyer,
          "error-callback":function(){ depEnVol=false; return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(depTsEl); }catch(e){} }
        });
        depRendu=true;
      }catch(e){ depEnVol=false; console.error("[ps-depot] turnstile",e); }
    };
    if(window.turnstile){ window.psDepTsReady(); return; }
    if(document.getElementById("ps-dep-ts-api")) return;
    var s=document.createElement("script");
    s.id="ps-dep-ts-api";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psDepTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function depotProgression(){
    if(depEnVol) return;                      // un dépôt déjà en cours d'envoi
    var u=depMe();
    if(!u) return;                            // anonyme : rien à déposer
    var cours=depLire();
    var progpct=depLireProgrammes(u);
    /* 🔴 On accepte l'UN ou l'AUTRE. La page Compétences n'a AUCUNE carte de cours
       (mesuré : 0 carte de cours, 4 cartes de programme) — exiger `cours` comme
       avant y aurait bloqué le dépôt et c'est précisément la page qui porte la
       donnée la plus utile. */
    if(!cours && !progpct) return;             // page sans rien à lire : on repassera
    var slugs=cours?Object.keys(cours).sort():[];
    var progs=depProgrammes(u);
    /* Signature = ce qu'on s'apprête à envoyer. 🔴 Sans elle, un membre qui
       navigue déclencherait un POST et une écriture KV par page — or KV plafonne
       à 1 écriture par seconde et par clé. On ne parle au Worker que quand la
       valeur a VRAIMENT changé — mais on RESTE capable de renvoyer plus tard dans
       la même page, quand le Site Builder a fini d'afficher ses cartes. */
    var pcles=progpct?Object.keys(progpct).sort():[];
    var sig=slugs.map(function(s){ return s+":"+cours[s]; }).join(",")
          +"|"+progs.join(",")
          +"|"+pcles.map(function(k){ return k+":"+progpct[k]; }).join(",");
    var vue=null;
    try{ vue=sessionStorage.getItem(DEP_SIG); }catch(e){}
    if(vue===sig) return;
    depEnVol=true;
    depSig=sig;
    depCorps={ uid:String(u.id), cours:cours||{}, programmes:progs, progpct:progpct||{} };
    depTurnstile();
  }

  cloak(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){ cloak(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader(); });
  /* Les boutons peuvent être rendus après nous (Site Builder progressif) :
     quelques relances pour attraper la classe active. */
  [300,800,1600].forEach(function(d){ setTimeout(heroBtns,d); setTimeout(playerBack,d); setTimeout(immersivePlayer,d); setTimeout(partnerHeader,d); });
  /* 🔴 Le dépôt est relancé PLUS TARD que le reste : les cartes du Site Builder
     n'apparaissent qu'au bout de plusieurs secondes (mesuré : ~5 à 8 s avant que
     le compte de barres se stabilise). Déposer trop tôt n'enverrait qu'une partie
     de la page — et la signature nous empêcherait de renvoyer le complément. */
  [4000,9000,15000].forEach(function(d){ setTimeout(depotProgression,d); });
  setTimeout(reveal, 3500);   // filet de sécurité anti-flash

  /* ====================================================================
     CHARGEMENT DU FOOTER REFAIT (footer.js)
     --------------------------------------------------------------------
     tokens.js est chargé sur TOUT le site ; le footer étant identique
     partout, on charge footer.js d'ici plutôt que d'ajouter un 2e include
     site-wide dans LearnWorlds (zéro admin : un git push suffit). Fichier
     séparé pour la lisibilité. Garde-fou par id -> jamais injecté 2 fois. */
  if(!document.getElementById("ps-footer-js")){
    var _fs=document.createElement("script");
    _fs.id="ps-footer-js";
    _fs.src="https://extremum84.github.io/lw-course-cards/footer.js";
    _fs.async=true;
    (document.head||document.documentElement).appendChild(_fs);
  }

  /* ====================================================================
     CHARGEMENT DU RESTYLE DU LECTEUR (player.js) — page /path-player
     --------------------------------------------------------------------
     Idem : chargé d'ici UNIQUEMENT sur le player → tout le CSS/JS du player
     (burger 3 traits, navigation, liste, DA marine/Figtree) est versionné dans
     le repo, plus rien dans le Code personnalisé de la page (3 loaders suffisent). */
  if((/\/path-player/.test(location.pathname) || (document.body && document.body.classList.contains("slug-path-player"))) && !document.getElementById("ps-player-js")){
    var _pl=document.createElement("script");
    _pl.id="ps-player-js";
    _pl.src="https://extremum84.github.io/lw-course-cards/player.js";
    _pl.async=true;
    (document.head||document.documentElement).appendChild(_pl);
  }
})();
