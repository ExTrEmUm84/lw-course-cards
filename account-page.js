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

  /* Progression par cours : le Worker Cloudflare (API admin LearnWorlds),
     derrière Turnstile, exactement comme l'annuaire. Clé publique déjà
     autorisée sur le domaine → Turnstile s'auto-injecte, aucun loader à
     ajouter côté page. */
  var ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/";
  var SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";

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
  var FT="font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;";

  var CSS=[
    /* 🔴 FOND BLANC (05/08). C'était `#F5F6F8` — un gris posé par NOUS, pas par
       LearnWorlds, pour détacher les cartes. Ziad : « retire-moi ce fond taupe
       moche ». Relevé sur l'annuaire, qui sert de référence : ses sections sont
       sur du BLANC PUR, et ses cartes se détachent par une bordure fine, sans
       ombre ni fond coloré. On aligne. */
    /* 🔴 LE `body` AUSSI, sinon le cadre reste. Mesuré : `body` était en
       `rgb(225,225,225)` et la boîte blanche `.account-app` descend jusqu'en
       bas de la fenêtre (847 px) alors que le contenu n'en fait que 308. D'où
       l'impression que la carte « flotte dans du vide » — ce n'était pas la
       carte, c'était un grand rectangle blanc posé sur du gris. Tout en blanc,
       l'espace restant redevient de la page, pas une boîte vide. */
    "body.slug-account,body.slug-account .account-app-page,body.slug-account .account-app{background:#fff !important;}",

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
    /* 🔴 38 px au-dessus d'une barre d'onglets, c'était trop : le titre pesait
       plus lourd que la navigation qu'il surplombe. 28 px, et la marge passe de
       20 à 10 px — l'ensemble titre + onglets se lit comme un seul bloc. */
    B+".account-app h2{"+FT+"font-size:28px !important;font-weight:800 !important;letter-spacing:-.02em !important;color:var(--ps-text,#1c1f26) !important;margin:0 0 10px !important;}",
    /* 40 px de marge sous le contenu creusaient encore le bas d'une section courte. */
    B+".account-page-content{margin-bottom:16px !important;padding-bottom:0 !important;}",

    /* --- pastilles de la fiche d'annuaire (hors panneau « Modifier ») --- */
    /* 🔴 DEUX COLONNES. Mesuré : `.personal-details-values` prenait 910 px pour
       trois valeurs courtes — d'où le grand vide à droite signalé par Ziad. On
       borne l'identité et on installe les pastilles dans l'espace libéré, à
       hauteur de l'avatar plutôt qu'en bas de carte. */
    /* --- Piste A : identité compacte, la fiche part dans sa propre carte --- */
    /* 🔴 Les trois valeurs prenaient 910 px de large pour « Ziad ». On les met
       en grille libellé/valeur et on retire les traits de soulignement, qui
       filaient jusqu'au bord et soulignaient du vide. */
    B+".personal-details{align-items:center !important;gap:20px !important;}",
    B+".personal-details-values{flex:0 1 auto !important;max-width:none !important;display:block !important;}",
    B+".account-value-display{display:grid !important;grid-template-columns:78px minmax(0,1fr) !important;gap:0 20px !important;align-items:baseline !important;border:0 !important;border-bottom:0 !important;padding:3px 0 !important;margin:0 !important;}",
    [B+".account-value-display:after",B+".account-value-display:before"].join(",")+"{display:none !important;}",
    B+".account-value-display-title{margin:0 !important;padding:0 !important;font-size:12.5px !important;color:var(--ps-text-soft,#676879) !important;}",
    B+".account-value-display-value{margin:0 !important;padding:0 !important;font-size:14.5px !important;font-weight:600 !important;border:0 !important;}",

    /* --- la carte « Ma fiche d'annuaire » --- */
    /* 🔴 CHAQUE sélecteur porte son scope. En n'en préfixant qu'un, on relâche
       les suivants sans que rien ne le signale — ils s'appliqueraient alors à
       toute la page. Nos classes nous appartiennent, donc l'effet serait nul
       ici ; c'est l'habitude qui compte, elle a déjà coûté cher ailleurs. */
    B+".ps-carte-fiche .ps-fiche-actions{display:flex;gap:8px;flex-wrap:wrap}",
    /* Le crayon vit DANS la pastille, hérite de sa couleur, et ne se révèle
       qu'au survol sur les grands écrans — au doigt il n'y a pas de survol,
       donc il reste visible en dessous de 900px. */
    B+".ps-carte-fiche .ps-fpill{position:relative;display:inline-flex;align-items:center;gap:8px}",
    /* 🔴🔴 LE CRAYON EST SORTI DU FLUX (08/08). Il était posé en enfant normal
       d'une pastille que la règle `.ps-fpill{flex-direction:column !important}`
       met en COLONNE — il tombait donc sur une troisième ligne, et les
       pastilles à crayon étaient plus hautes que les autres. Invisible tant que
       toutes en avaient un ; flagrant depuis que les pastilles vides existent.
       La ligne au-dessus (`position:relative` sur la pastille, `align-items:
       center`) montre que cette mise en page était l'intention d'origine :
       c'est le `!important` d'une règle écrite plus bas qui la battait.
       ⇒ Épinglé à droite, centré : toutes les pastilles ont la même hauteur.
       `ps-fpill-cray` réserve la place pour que le texte ne passe pas dessous —
       une classe posée dans le BALISAGE plutôt qu'un `:has()`, parce qu'on sait
       exactement quelles pastilles portent un crayon. */
    B+".ps-carte-fiche .ps-fpill-cray{padding-right:31px !important;}",
    B+".ps-carte-fiche .ps-fpill-edit{position:absolute !important;right:9px !important;top:50% !important;"+
      "transform:translateY(-50%) !important;border:0;background:transparent;padding:2px;margin:0;cursor:pointer;"+
      "line-height:0;color:inherit;opacity:.45;transition:opacity .15s ease}",
    B+".ps-carte-fiche .ps-fpill:hover .ps-fpill-edit,.ps-carte-fiche .ps-fpill-edit:focus-visible{opacity:1}",
    B+".ps-carte-fiche .ps-fpill-edit svg{width:14px;height:14px;fill:none;stroke:currentColor;"+
      "stroke-width:2;stroke-linecap:round;stroke-linejoin:round}",
    "@media(max-width:900px){"+B+".ps-carte-fiche .ps-fpill-edit{opacity:.8}}",
    B+".ps-carte-fiche .ps-fiche-alerte{margin:10px 0 0;font:400 13.5px/1.5 var(--ps-font,Figtree,sans-serif);"+
      "color:#8a5a00;background:#fff8e6;border:1px solid #f0dca8;border-radius:10px;padding:9px 12px}",
    B+".ps-carte-fiche .ps-fiche-hd{margin-bottom:14px !important;}",
    B+".ps-carte-fiche .ps-fiche-t{display:flex !important;align-items:center !important;gap:10px !important;}",
    B+".ps-carte-fiche .ps-fiche-cta{white-space:nowrap !important;}",
    B+".personal-details-values{flex:0 1 420px !important;max-width:440px !important;}",
    B+".ps-fpills{display:flex !important;flex-wrap:wrap !important;gap:9px !important;margin:0 !important;padding:0 !important;border:0 !important;}",
    /* Sous 900 px la carte repasse en pile : les pastilles suivent le contenu. */
    "@media(max-width:640px){"+B+".personal-details{flex-wrap:wrap !important;}"+B+".account-value-display{grid-template-columns:1fr !important;}}",
    B+".ps-fpill{display:inline-flex !important;flex-direction:column !important;align-items:flex-start !important;gap:1px !important;background:#F3F5F9 !important;border:0 !important;border-radius:var(--ps-r-btn,10px) !important;padding:7px 13px !important;"+FT+"}",
    B+".ps-fpill b{"+FT+"font-size:10px !important;font-weight:800 !important;letter-spacing:.06em !important;text-transform:uppercase !important;opacity:.72 !important;}",
    B+".ps-fpill i{"+FT+"font-style:normal !important;font-size:13.5px !important;font-weight:700 !important;line-height:1.25 !important;}",
    B+".ps-fpill.ps-lvl1{background:var(--ps-lvl1-tint,#EEF4FA) !important;color:var(--ps-lvl1,#3887b4) !important;}",
    B+".ps-fpill.ps-lvl2{background:var(--ps-lvl2-tint,#EEF4FA) !important;color:var(--ps-lvl2,#3887b4) !important;}",
    B+".ps-fpill.ps-lvl3{background:var(--ps-lvl3-tint,#EEF4FA) !important;color:var(--ps-lvl3,#3887b4) !important;}",
    B+".ps-fpill.ps-lvl4{background:var(--ps-lvl4-tint,#EEF4FA) !important;color:var(--ps-lvl4,#3887b4) !important;}",
    B+".ps-fpill.ps-lvl5{background:var(--ps-lvl5-tint,#EEF4FA) !important;color:var(--ps-lvl5,#3887b4) !important;}",
    B+".ps-fpill.ps-lvl6{background:var(--ps-lvl6-tint,#EEF4FA) !important;color:var(--ps-lvl6,#3887b4) !important;}",
    /* état de l'opt-in : le seul qui porte une couleur, parce que c'est le seul
       qui conditionne quelque chose (apparaître ou non dans l'annuaire). */
    B+".ps-fpill-oui,"+B+".ps-fpill-non{flex-direction:row !important;align-items:center !important;font-size:11.5px !important;font-weight:800 !important;padding:4px 11px !important;letter-spacing:.03em !important;text-transform:uppercase !important;}"+
    B+".ps-fpill-oui{background:var(--ps-lvl4-tint,#e4fbf6) !important;color:var(--ps-lvl4,#009e78) !important;}",
    B+".ps-fpill-non{background:#F3F5F9 !important;color:var(--ps-text-soft,#676879) !important;}",
    /* champ manquant : pointillé, cliquable — il ouvre le formulaire. */
    B+".ps-fpill-vide{flex-direction:row !important;align-items:center !important;background:transparent !important;border:1.5px dashed var(--ps-border,#E6E9EF) !important;color:var(--ps-text-soft,#676879) !important;cursor:pointer !important;font-size:12.5px !important;font-weight:700 !important;padding:8px 13px !important;}",
    B+".ps-fpill-vide:hover{border-color:var(--ps-accent,#3887b4) !important;color:var(--ps-accent,#3887b4) !important;}",
    /* Pastille VIDE d'un champ précis (08/08) : MÊME gabarit que les remplies —
       le nom au-dessus, l'état en dessous — pour que la grille reste régulière,
       mais en pointillé. On lit d'un coup d'œil ce qui est fait et ce qui ne
       l'est pas, et toute la pastille est le bouton : il n'y a rien à corriger
       dedans, donc pas de crayon.
       🔴 `padding` réduit de 1,5 px : la bordure s'ajoute à la boîte, sans quoi
       les pastilles vides seraient 3 px plus hautes que les autres et la ligne
       ondulerait. */
    B+".ps-fpill-todo{background:transparent !important;border:1.5px dashed var(--ps-border,#E6E9EF) !important;"+
      "color:var(--ps-text-soft,#676879) !important;cursor:pointer !important;padding:5.5px 11.5px !important;}",
    B+".ps-fpill-todo i{font-weight:800 !important;opacity:.9 !important;}",
    B+".ps-fpill-todo:hover,"+B+".ps-fpill-todo:focus-visible{border-color:var(--ps-accent,#3887b4) !important;color:var(--ps-accent,#3887b4) !important;}",

    /* La grande carte blanche unique s'efface : ce sont les sections qui
       portent désormais la carte (choix de Ziad). */
    B+".lw-body-bg.border-radius.account-cnt{background:transparent !important;border-radius:0 !important;box-shadow:none !important;}",

    /* --- une carte par section --- */
    /* 🔴 Espacements resserrés (05/08, demande de Ziad : « c'est trop »).
       20 px entre les cartes + le blanc autour donnaient une page qui respire
       trop pour son contenu ; sur fond blanc, la bordure suffit à séparer. */
    B+"section.account-section{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;padding:22px 24px !important;margin:0 0 12px !important;box-shadow:none !important;transition:box-shadow .2s ease !important;}",
    B+"section.account-section:hover{box-shadow:0 6px 20px rgba(15,23,42,.05) !important;}",
    /* 🔴🔴 `flex-wrap` MANQUAIT (08/08, capture de Ziad sur iPhone : « sur
       mobile cette page est cassée »). Un `space-between` sans repli ne fait pas
       tenir ses enfants : il les laisse SORTIR. Mesuré dans un cadre de 390 px —
       document 398 px, donc défilement horizontal, et les deux boutons de la
       fiche hors de l'écran.
       🔴 Le repli ne coûte rien sur grand écran : tant que tout tient, il ne se
       déclenche jamais. Ce n'est pas un correctif mobile, c'est la règle qui
       manquait. */
    B+".account-section-header{display:flex !important;align-items:center !important;justify-content:space-between !important;flex-wrap:wrap !important;gap:16px !important;margin-bottom:18px !important;}",
    /* Sous 600 px, les actions prennent leur propre ligne et se partagent la
       largeur : deux boutons côte à côte s'ils tiennent, empilés sinon.
       🔴 `min-width:0` : sans lui un bouton refuse de descendre sous la largeur
       de son texte et re-déborde — c'est le défaut qu'on vient de corriger, par
       un autre chemin. */
    "@media(max-width:600px){"+
      B+".ps-carte-fiche .ps-fiche-actions{width:100% !important;}"+
      B+".ps-carte-fiche .ps-fiche-actions button{flex:1 1 140px !important;min-width:0 !important;}"+
      B+".ps-carte-fiche .ps-fiche-t{min-width:0 !important;}"+
    "}",
    B+".account-section-title{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:21px !important;font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",
    /* petite icône du titre de section : en accent, un peu plus grande */
    B+".account-section-title-icon{color:var(--ps-accent,#507EC5) !important;width:22px !important;height:22px !important;margin-right:9px !important;vertical-align:-3px !important;}",
    [B+".account-section-title-icon path",B+".account-section-title-icon circle",B+".account-section-title-icon rect"].join(",")+"{fill:var(--ps-accent,#507EC5) !important;}",

    /* --- bouton "Modifier" : PILULE OUTLINE moderne (se remplit au survol) --- */
    B+".account-section-header button.learnworlds-button{background:#fff !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;box-shadow:none !important;padding:8px 18px !important;border-radius:var(--ps-r-pill,999px) !important;color:var(--ps-accent,#507EC5) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;font-weight:600 !important;line-height:1 !important;cursor:pointer !important;transition:background .18s ease,color .18s ease,border-color .18s ease !important;}",
    B+".account-section-header button.learnworlds-button:hover{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;color:#fff !important;}",
    /* en mode édition, le header porte « Enregistrer » (.p-0.lw-brand-text) +
       « Annuler ». On rend « Enregistrer » PLEIN (action primaire) ; « Annuler »
       garde la pilule outline ci-dessus. */
    B+".account-section-header button.learnworlds-button.p-0.lw-brand-text{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;color:#fff !important;}",
    B+".account-section-header button.learnworlds-button.p-0.lw-brand-text:hover{background:var(--ps-accent-hover,#486798) !important;border-color:var(--ps-accent-hover,#486798) !important;color:#fff !important;}",

    /* --- menu latéral --- */
    B+".account-menu-content{position:sticky !important;top:24px !important;}",
    B+".account-section-navigation a{display:block !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;color:#4B5563 !important;text-decoration:none !important;padding:9px 12px !important;margin-bottom:2px !important;border-radius:9px !important;transition:color .15s ease, background .15s ease !important;}",
    B+".account-section-navigation a:hover{color:var(--ps-accent,#507EC5) !important;background:var(--ps-accent-tint,#EDF4FF) !important;}",
    /* item actif : AUCUN état natif (vérifié : cliquer n'ajoute aucune classe
       et le hash reste vide) -> classe posée en JS par l'observateur. */
    B+".account-section-navigation a.ps-acc-on{color:var(--ps-accent,#507EC5) !important;background:var(--ps-accent-tint,#EDF4FF) !important;}",

    /* --- COURS RETIRÉS (demande Ziad) : on masque la section « Cours et
       programmes » ET son entrée de menu. La progression par cours n'est donc
       plus lancée (cf. run()). --- */
    B+"#courses-programs{display:none !important;}",
    B+".account-section-navigation a[href='#courses-programs']{display:none !important;}",

    /* --- champs / valeurs --- */
    B+".personal-details-values{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* avatar : ROND avec anneau tint + ombre douce (look profil moderne) */
    B+".account-user-avatar{border-radius:50% !important;overflow:hidden !important;border:3px solid #fff !important;box-shadow:0 0 0 2px var(--ps-accent-tint,#EDF4FF),0 4px 14px rgba(15,23,42,.08) !important;}",

    /* --- mode ÉDITION : champs de saisie modernes (radius + anneau de focus
       accent, au lieu du bord gris fin radius 4px natif) --- */
    B+".account-app .learnworlds-input{border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:10px !important;padding:10px 14px !important;font-size:15px !important;background:#fff !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;transition:border-color .15s ease,box-shadow .15s ease !important;}",
    B+".account-app .learnworlds-input:focus{border-color:var(--ps-accent,#507EC5) !important;box-shadow:0 0 0 3px var(--ps-accent-tint,#EDF4FF) !important;outline:none !important;}",

    /* --- barre de progression par cours (injectée en JS dans #courses-programs) ---
       🔴 La cellule de ligne est en display:flex (direction row) : sans
       flex-wrap, la barre devient un flex-item comprimé à côté du titre et son
       remplissage s'effondre à 0. On fait passer la cellule en wrap et on donne
       à la barre flex-basis 100% pour qu'elle prenne sa PROPRE ligne sous le
       titre. Vérifié en direct : remplissages exacts, barres sous le titre. */
    B+"#courses-programs .account-table-row .account-table-cell{flex-wrap:wrap !important;}",
    B+"#courses-programs .ps-acc-prog{flex:0 0 100% !important;width:100% !important;max-width:520px !important;margin:9px 0 2px !important;}",
    B+"#courses-programs .ps-acc-prog-head{display:flex !important;align-items:baseline !important;gap:5px !important;margin-bottom:5px !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    B+"#courses-programs .ps-acc-prog-pct{font-size:12.5px !important;font-weight:800 !important;color:var(--ps-accent,#507EC5) !important;letter-spacing:-.01em !important;}",
    B+"#courses-programs .ps-acc-prog-lbl{font-size:12px !important;font-weight:600 !important;color:#8A93A5 !important;}",
    B+"#courses-programs .ps-acc-prog-track{width:auto !important;height:6px !important;border-radius:999px !important;background:var(--ps-accent-tint,#edf4ff) !important;overflow:hidden !important;}",
    B+"#courses-programs .ps-acc-prog-fill{height:100% !important;border-radius:999px !important;background:var(--ps-accent,#507EC5) !important;width:0;transition:width .6s ease !important;}",
    B+"#courses-programs .ps-acc-prog[data-done='1'] .ps-acc-prog-pct{color:#15A46A !important;}",
    B+"#courses-programs .ps-acc-prog[data-done='1'] .ps-acc-prog-fill{background:#15A46A !important;}",

    /* --- ACCÈS FINANCÉ PAR L'ÉCOLE (bandeau dans « Paiements ») ---
       Bandeau sobre, pas une réclame : c'est une INFORMATION de compte. Fond en
       teinte d'accent, liseré à gauche, picto diplôme. */
    B+".ps-acc-ecole{display:flex !important;align-items:flex-start !important;gap:14px !important;background:var(--ps-accent-tint,#EDF4FF) !important;border-left:4px solid var(--ps-accent,#507EC5) !important;border-radius:12px !important;padding:16px 18px !important;margin:0 0 18px !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    B+".ps-acc-ecole-ic{flex:none !important;width:38px !important;height:38px !important;border-radius:50% !important;background:var(--ps-accent,#507EC5) !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
    B+".ps-acc-ecole-ic svg{width:20px !important;height:20px !important;fill:none !important;stroke:#fff !important;stroke-width:1.9 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    B+".ps-acc-ecole-t{font-size:15.5px !important;font-weight:800 !important;color:#243B6B !important;letter-spacing:-.01em !important;margin-bottom:3px !important;}",
    B+".ps-acc-ecole-s{font-size:14px !important;line-height:1.55 !important;color:#4B5563 !important;}",
    B+".ps-acc-ecole-s strong{font-weight:700 !important;color:#243B6B !important;}",
    /* Historique vide masqué UNIQUEMENT quand l'école prend en charge : la classe
       n'est posée qu'après avoir vérifié qu'il n'y a AUCUNE ligne réelle. */
    B+"#payments.ps-acc-paye-ecole .account-payments-view{display:none !important;}"
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

  /* --- 4) Progression par cours ---
     La liste native « Cours et programmes » (#courses-programs) n'a AUCUNE
     donnée d'avancement (vérifié : 0 barre, aucun %). On la récupère via le
     Worker (API admin LearnWorlds).
     🔴 Les lignes de cours pointent vers /path-player?courseid=<slug> — le slug
     est dans la QUERY STRING, PAS dans un /course/<slug>. Les programmes
     (/program-player?program=) n'ont pas de progression par cours : ignorés. */
  var progStarted=false, lastBySlug=null, tsEl=null, progPolling=false, progTries=0, progObs=null;

  function courseRows(){
    var cp=document.getElementById("courses-programs");
    if(!cp) return [];
    var map=[];
    [].forEach.call(cp.querySelectorAll(".account-table-row a[href*='courseid=']"),function(a){
      var slug=null;
      try{ slug=new URL(a.href,location.href).searchParams.get("courseid"); }catch(e){}
      if(!slug) return;
      var row=a.closest(".account-table-row");
      var cell=a.closest(".account-table-cell")||row;
      if(row&&cell) map.push({slug:slug, title:(a.textContent||"").replace(/\s+/g," ").trim(), cell:cell});
    });
    return map;
  }

  /* e-mail du membre connecté, lu dans « Informations personnelles ». Il part
     UNIQUEMENT vers le Worker, en en-tête (jamais en URL : une donnée perso
     n'a rien à faire dans une query string qui finit dans les logs). */
  function findEmail(){
    var re=/[^\s@]+@[^\s@]+\.[^\s@]+/;
    var inp=document.querySelector(".account-app input[type='email']");
    if(inp && re.test(inp.value||"")) return inp.value.trim().match(re)[0];
    var ml=document.querySelector(".account-app a[href^='mailto:']");
    if(ml){ var m=ml.getAttribute("href").slice(7).match(re); if(m) return m[0]; }
    var pool=document.querySelectorAll("#personal-details .account-value-display-value, #personal-details .account-value-display, .personal-details-values *");
    for(var i=0;i<pool.length;i++){ var mm=(pool[i].textContent||"").match(re); if(mm) return mm[0]; }
    return null;
  }

  /* Pose/actualise la barre sur chaque ligne dont on connaît le %. Idempotent :
     rejouée à chaque run() (les lignes peuvent arriver tard) sans doublonner. */
  function paint(bySlug){
    if(!bySlug) return;
    lastBySlug=bySlug;
    courseRows().forEach(function(c){
      var p=bySlug[c.slug];
      if(p==null) return;                         // pas de donnée : pas de barre
      var box=c.cell.querySelector(":scope > .ps-acc-prog");
      if(!box){
        box=document.createElement("div"); box.className="ps-acc-prog";
        var head=document.createElement("div"); head.className="ps-acc-prog-head";
        var pct=document.createElement("span"); pct.className="ps-acc-prog-pct";
        var lbl=document.createElement("span"); lbl.className="ps-acc-prog-lbl";
        head.appendChild(pct); head.appendChild(lbl);
        var track=document.createElement("div"); track.className="ps-acc-prog-track";
        track.appendChild(document.createElement("div")).className="ps-acc-prog-fill";
        box.appendChild(head); box.appendChild(track);
        c.cell.appendChild(box);
      }
      var done=p>=100;
      box.dataset.done=done?"1":"0";
      box.querySelector(".ps-acc-prog-pct").textContent=done?"Terminé":(p+" %");
      box.querySelector(".ps-acc-prog-lbl").textContent=done?"✓":(p>0?"complété":"pas commencé");
      /* Largeur posée SYNCHRONEMENT (reflow forcé entre 0 et la cible) plutôt
         que via requestAnimationFrame : rAF est gelé quand l'onglet n'est pas
         au premier plan, ce qui laissait la barre vide. Le reflow garantit la
         largeur tout en jouant la transition. */
      var fillEl=box.querySelector(".ps-acc-prog-fill");
      var target=(p>0&&p<2?2:p)+"%";
      fillEl.style.width="0%";
      void fillEl.offsetWidth;              // force le reflow
      fillEl.style.width=target;
    });
  }

  function charger(jeton){
    var email=findEmail();
    if(!email){
      /* 🔴 « Informations personnelles » (où se lit l'e-mail) peut être rendu
         APRÈS l'arrivée du jeton Turnstile : sans réessai, charger() sortait en
         silence et aucune barre n'apparaissait (course de rendu constatée en
         live). On repousse, borné (~20 s) ; le jeton Turnstile reste valide
         plusieurs minutes, donc on peut le réutiliser. */
      if((charger.tries=(charger.tries||0)+1) <= 40){ setTimeout(function(){ charger(jeton); }, 500); }
      return;
    }
    fetch(ENDPOINT+"progress",{ headers:{ Accept:"application/json", "X-Turnstile-Token":jeton, "X-LW-Email":email } })
      .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(function(data){ paint(data && data.bySlug); })
      .catch(function(err){ console.error("[account-progress]",err); });
  }

  /* Turnstile auto-injecté (comme annuaire.js) : widget invisible dans un
     conteneur hors écran mais RENDU (un display:none empêcherait l'exécution). */
  function turnstile(){
    if(!tsEl){
      tsEl=document.createElement("div");
      tsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(tsEl);
    }
    window.psAccTsReady=function(){
      try{
        window.turnstile.render(tsEl,{
          sitekey:SITEKEY,
          callback:charger,
          "error-callback":function(){ return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(tsEl); }catch(e){} },
        });
      }catch(e){ console.error("[account-progress] turnstile",e); }
    };
    if(window.turnstile){ window.psAccTsReady(); return; }
    if(document.getElementById("ps-acc-ts-api")) return;
    var s=document.createElement("script");
    s.id="ps-acc-ts-api";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psAccTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  /* Rejoue paint quand l'app compte re-render la table « Cours et programmes »
     (pagination, tri…) : les barres injectées seraient sinon perdues. Posé une
     seule fois. On se déconnecte le temps de peindre pour ne pas se
     ré-observer soi-même (paint modifie le DOM de la section). */
  function watchCourses(){
    if(progObs) return;
    var cp=document.getElementById("courses-programs");
    if(!cp) return;
    progObs=new MutationObserver(function(){
      if(!lastBySlug) return;
      progObs.disconnect();
      paint(lastBySlug);
      progObs.observe(cp,{childList:true,subtree:true});
    });
    progObs.observe(cp,{childList:true,subtree:true});
  }

  function progression(){
    if(progStarted){ if(lastBySlug) paint(lastBySlug); watchCourses(); return; }
    if(courseRows().length){ progStarted=true; watchCourses(); turnstile(); return; }
    /* 🔴 La table est rendue TARD par l'app compte (souvent après 2,5 s). Les
       relances de run() s'arrêtent à 2500 ms → si on se contentait de sortir,
       la progression ne démarrerait JAMAIS quand la table apparaît plus tard
       (bug constaté en live). On poursuit donc le poll au-delà, borné (~20 s),
       en une seule chaîne. */
    if(progPolling) return;
    progPolling=true;
    (function poll(){
      if(progStarted) return;
      if(courseRows().length){ progStarted=true; watchCourses(); turnstile(); return; }
      if(progTries++ < 40) setTimeout(poll,500); else progPolling=false;
    })();
  }

  /* ====================================================================
     ACCÈS FINANCÉ PAR L'ÉCOLE — bandeau dans la section « Paiements »
     --------------------------------------------------------------------
     Demande de Ziad (04/08). Sans lui, un étudiant dont l'école paie ouvre
     « Paiements » et lit « Vous n'avez pas encore effectué de paiement » — une
     phrase exacte, mais qui invite surtout à se demander si l'on aurait dû.
     🔴 AUCUNE DONNÉE RECOPIÉE : l'école reconnue vient de `window.PS_PARTENAIRE`,
     posé par `tokens.js` à partir de la table `PARTENAIRES` (tag d'automatisation
     sur le domaine e-mail, repli sur le domaine). Ajouter une école reste UNE
     entrée dans cette table, ici comme sur la home.
     🔴 `tokens.js` peut être chargé APRÈS nous : on relit `PS_PARTENAIRE` à chaque
     passage de `run()` (relances 200/600/1200/2500 ms), jamais une seule fois.
     🔴 Pas d'école reconnue -> on RETIRE ce qu'on aurait posé et on ré-affiche
     l'historique. Un membre peut changer de statut entre deux passages ; laisser
     un bandeau périmé serait pire que ne rien afficher. */
  var ICONE_ECOLE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 12v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4"/></svg>';

  /* 🔴 « Vide » se prouve, il ne se suppose pas : on ne masque l'historique que
     si la vue ne contient AUCUN élément qui ressemble à une ligne de paiement.
     Un test sur le TEXTE (« vous n'avez pas encore… ») aurait été piégeux : la
     phrase est traduite par Weglot dès qu'on passe en anglais. Au moindre doute
     on n'enlève rien — masquer un vrai historique de paiements serait grave. */
  function historiqueVide(vue){
    if(!vue) return false;
    return !vue.querySelector("table, .account-table, .account-table-row, [class*='row'], [class*='item'], [class*='invoice'], [class*='receipt']");
  }

  function blocEcole(){
    var sec=document.getElementById("payments");
    if(!sec) return;
    var ec=window.PS_PARTENAIRE, nom=ec && ec.nom;
    var pose=sec.querySelector(":scope > .ps-acc-ecole");
    if(!nom){
      if(pose) pose.remove();
      sec.classList.remove("ps-acc-paye-ecole");
      return;
    }
    if(pose){
      if(pose.getAttribute("data-ps-ecole")===nom) return;   // déjà à jour
      pose.remove();
    }
    var box=document.createElement("div");
    box.className="ps-acc-ecole";
    box.setAttribute("data-ps-ecole",nom);
    var ic=document.createElement("div"); ic.className="ps-acc-ecole-ic"; ic.innerHTML=ICONE_ECOLE;
    var txt=document.createElement("div");
    var t=document.createElement("div"); t.className="ps-acc-ecole-t";
    /* Le titre est le libellé que Ziad a écrit dans la table (`pastille`) : le
       mot à mot commercial lui appartient, il se change là-bas, pas ici. */
    t.textContent=ec.pastille || "Accès offert par votre école";
    var s=document.createElement("div"); s.className="ps-acc-ecole-s";
    /* textContent + <strong> séparé : le nom vient d'une table, mais on ne
       construit jamais du HTML par concaténation dans ce dépôt. */
    s.appendChild(document.createTextNode("Votre accès à PrepaStrat est pris en charge par "));
    var b=document.createElement("strong"); b.textContent=nom; s.appendChild(b);
    s.appendChild(document.createTextNode(". Vous n'avez rien à régler."));
    txt.appendChild(t); txt.appendChild(s);
    box.appendChild(ic); box.appendChild(txt);
    var head=sec.querySelector(":scope > .account-section-header");
    if(head && head.nextSibling) sec.insertBefore(box, head.nextSibling);
    else sec.appendChild(box);
    /* l'historique ne disparaît que s'il est réellement vide (cf. historiqueVide) */
    sec.classList.toggle("ps-acc-paye-ecole", historiqueVide(sec.querySelector(".account-payments-view")));
  }

  /* ════════════════════════════════════════════════════════════════════════
     ONGLETS  (05/08) — demande de Ziad : « cette page est très moche, refais-la
     avec des tabs, aux couleurs PrepaStrat ».
     ────────────────────────────────────────────────────────────────────────
     La page empile ses cinq sections sur ~1 000 px et la colonne de gauche ne
     fait que les faire défiler. En onglets, une seule est visible : la page
     tient dans un écran et la navigation devient un choix, pas un repérage.

     🔴 ON RÉUTILISE LA NAVIGATION NATIVE, on ne la reconstruit pas. Ses liens
     `a[href="#id"]` pointent déjà sur les bonnes sections — c'est LearnWorlds
     qui les maintient. Fabriquer notre propre liste, ce serait la refaire à
     chaque fois qu'ils ajoutent une rubrique, et rater celles qui dépendent des
     réglages de l'école (les paiements n'apparaissent pas partout).

     🔴 ON N'INSCRIT QUE LES SECTIONS RÉELLEMENT VISIBLES. « Cours et
     programmes » est masquée par notre propre CSS depuis le 24/07 : en faire un
     onglet ouvrirait un panneau vide, et personne ne comprendrait pourquoi.

     🔴 LE SCROLL-SPY DOIT S'ARRÊTER. Il marque l'élément actif d'après ce qui
     occupe l'écran ; avec un seul panneau affiché il désignerait toujours le
     même et se battrait avec l'état des onglets. On le débranche.
     ════════════════════════════════════════════════════════════════════════ */
  function stylesOnglets(){
    if(document.getElementById("ps-acc-tabs-css")) return;
    var st=document.createElement("style"); st.id="ps-acc-tabs-css";
    st.textContent=
      ".account-section-navigation[data-ps-tabs]{display:flex !important;flex-direction:row !important;"+
      "gap:8px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding:0 2px 10px !important;"+
      "margin:0 !important;border:0 !important;background:transparent !important;width:100% !important;max-width:none !important}"+
      /* 🔴 Le menu était `sticky` avec 24 px de décalage : en colonne ça se
         justifiait, en barre horizontale ça creusait un vide au-dessus des
         cartes. On le remet dans le flux, sans marge. */
      ".account-menu-content{position:static !important;top:auto !important;margin:0 !important;padding:0 !important}"+
      ".account-menu{margin:0 !important;padding:0 !important}"+
      ".account-page-content{padding-top:0 !important;margin-top:0 !important}"+
      ".account-section-navigation[data-ps-tabs]::-webkit-scrollbar{display:none}"+
      ".account-section-navigation[data-ps-tabs] a{flex:0 0 auto;display:inline-block;white-space:nowrap;"+
      "border:1.5px solid var(--ps-border,#E6E9EF);background:#fff;color:var(--ps-text-soft,#676879);"+
      "border-radius:var(--ps-r-pill,999px);padding:9px 17px;text-decoration:none;"+
      "font:700 13.5px var(--ps-font,Figtree,sans-serif);transition:background .18s,color .18s,border-color .18s}"+
      ".account-section-navigation[data-ps-tabs] a:hover{border-color:var(--ps-accent,#3887b4);color:var(--ps-text,#1c1f26)}"+
      /* 🔴 CLASSE DOUBLÉE, ET C'EST VOULU. `a.ps-acc-on` seul perdait contre la
         règle d'état actif de LearnWorlds : la pastille restait bleu pâle au
         lieu de prendre l'accent PrepaStrat. Répéter la classe monte la
         spécificité sans partir à la chasse au sélecteur natif — qui changera
         au prochain déploiement de leur part, alors que ceci tiendra. */
      ".account-section-navigation[data-ps-tabs] a.ps-acc-on.ps-acc-on{background:var(--ps-accent,#3887b4) !important;"+
      "border-color:var(--ps-accent,#3887b4) !important;color:#fff !important}"+
      /* 🔴 LE VERROU ÉTAIT ICI, ET TROIS NIVEAUX PLUS HAUT QUE LÀ OÙ JE
         CHERCHAIS. Chaîne relevée le 05/08 sur la vraie page :
            .account-section-navigation  200 px
            .account-menu-content        200 px
            .account-menu                250 px  ← min-width ET max-width
         Élargir les deux premiers ne servait à rien : `width:100%` vaut 100 %
         d'un parent lui-même bridé. C'est `.account-menu` qu'il faut déverrouiller,
         et il faut lever `min-width` autant que `max-width` — l'un des deux
         suffit à tout retenir. */
      ".account-cnt{flex-direction:column !important;align-items:stretch !important}"+
      ".account-menu{width:100% !important;min-width:0 !important;max-width:none !important}"+
      ".account-menu-content{width:100% !important;max-width:none !important}"+
      ".account-page-content{width:100% !important;max-width:none !important}"+
      "@media(prefers-reduced-motion:reduce){.account-section-navigation[data-ps-tabs] a{transition:none}}";
    (document.head||document.documentElement).appendChild(st);
  }

  /* 🔴🔴 NON, LEARNWORLDS NE FAIT PAS D'ONGLETS — ET J'AI CRU LE CONTRAIRE
     EN OBSERVANT MON PROPRE CODE. Le 05/08 j'ai relevé « une seule section en
     block, les quatre autres masquées » et j'en ai déduit que la plateforme
     gérait déjà le basculement. C'était la version PRÉCÉDENTE de ce fichier,
     déjà en production, qui masquait. Mesure refaite une fois le masquage
     retiré : les quatre sections utiles sont TOUTES en `block`, au chargement
     comme onze secondes plus tard, sans aucun style inline de notre part.
     ⇒ Regarder l'effet de son propre code et l'attribuer à la plateforme :
     l'erreur la plus coûteuse de la journée, parce qu'elle m'a fait retirer un
     mécanisme qui marchait.

     🔴 CE QUI RESTE VRAI de cet aller-retour : le garde-fou. Des onglets
     masquent les sections non actives ; si la barre déborde de son conteneur,
     une seule pastille reste cliquable et Sécurité, Paiements et Notifications
     deviennent INACCESSIBLES. On vérifie donc, et on renonce plutôt que de
     livrer une page amputée.
     🟢 Le risque de capture partielle (une section pas encore rendue) est
     écarté : mesuré, les cinq sections existent DÈS le chargement. */
  function onglets(){
    var nav=document.querySelector(".account-section-navigation");
    if(!nav || nav.dataset.psTabs) return !!(nav && nav.dataset.psTabs);
    var vues=[];
    [].slice.call(nav.querySelectorAll("a[href^='#']")).forEach(function(a){
      var id=(a.getAttribute("href")||"").slice(1);
      var el=id && document.getElementById(id);
      /* Une section masquée par ailleurs (« Cours et programmes ») ne devient
         pas un onglet : on ouvrirait un panneau vide. */
      if(el && el.offsetParent!==null) vues.push({a:a, el:el, id:id});
    });
    if(vues.length<2) return false;

    stylesOnglets();
    nav.dataset.psTabs="1";
    nav.setAttribute("role","tablist");
    if(io){ try{ io.disconnect(); }catch(e){} io=null; }

    function activer(id, memoriser){
      vues.forEach(function(v){
        var on=v.id===id;
        v.el.style.display = on ? "" : "none";
        /* Les cartes que NOUS ajoutons à côté d'une section suivent son sort. */
        [].slice.call(document.querySelectorAll('[data-ps-suit="'+v.id+'"]')).forEach(function(x){
          x.style.display = on ? "" : "none";
        });
        v.a.classList.toggle("ps-acc-on", on);
        v.a.setAttribute("aria-selected", on ? "true" : "false");
        v.a.setAttribute("tabindex", on ? "0" : "-1");
        v.el.setAttribute("role","tabpanel");
        v.el.setAttribute("aria-hidden", on ? "false" : "true");
      });
      /* `replaceState` et non `location.hash` : écrire le hash ferait sauter la
         page vers l'ancre, or c'est justement ce qu'on remplace. */
      if(memoriser) try{ history.replaceState(null,"","#"+id); }catch(e){}
    }

    vues.forEach(function(v){
      v.a.setAttribute("role","tab");
      v.a.addEventListener("click", function(ev){
        ev.preventDefault(); ev.stopPropagation();
        activer(v.id, true);
      });
    });

    var vise=(location.hash||"").slice(1);
    var trouve=vues.filter(function(v){ return v.id===vise; })[0];
    activer(trouve ? trouve.id : vues[0].id, false);

    /* Le garde-fou : si le dernier onglet déborde, on défait TOUT. */
    var boite=nav.getBoundingClientRect();
    var dernier=vues[vues.length-1].a.getBoundingClientRect();
    if(dernier.right > boite.right + 1){
      vues.forEach(function(v){
        v.el.style.display="";
        v.a.classList.remove("ps-acc-on");
        ["role","aria-selected","tabindex"].forEach(function(k){ v.a.removeAttribute(k); });
        ["role","aria-hidden"].forEach(function(k){ v.el.removeAttribute(k); });
      });
      nav.removeAttribute("data-ps-tabs"); nav.removeAttribute("role");
      var css=document.getElementById("ps-acc-tabs-css");
      if(css && css.parentNode) css.parentNode.removeChild(css);
      try{ console.warn("[PrepaStrat] /account : barre d'onglets trop large ("+
        Math.round(boite.width)+" px), page laissée en sections empilées."); }catch(e){}
      return false;
    }
    return true;
  }

  /* ════════════════════════════════════════════════════════════════════════
     LA FICHE D'ANNUAIRE, EN PASTILLES, HORS DU PANNEAU « MODIFIER »  (05/08)
     ────────────────────────────────────────────────────────────────────────
     Demande de Ziad : en lecture, la carte n'affiche que Prénom, Nom et
     E-mail ; école, niveau, recherche, langue et contact ne sont visibles
     qu'une fois « Modifier » ouvert. On les sort donc, en pastilles.

     🔴 SOURCE : `me.custom_fields`, avec repli sur les TAGS. Mesuré sur cette
     page : les valeurs y sont (`cf_ecole:"ESSEC"`…), mais elles manquent sur
     d'autres pages du site où seuls les tags `cf_<champ>_<valeur>` subsistent.
     Lire les deux coûte trois lignes et évite une carte vide selon la page.
     🔴 UN CHAMP VIDE N'EST PAS CACHÉ : il devient une pastille pointillée qui
     OUVRE LE FORMULAIRE. Masquer ce qui manque, c'est laisser une fiche
     incomplète le rester — et on a justement construit la popup pour ça.
     ════════════════════════════════════════════════════════════════════════ */
  /* 🔴 UNE COULEUR PAR CHAMP, PRISE DANS LES JETONS DE NIVEAU DÉJÀ EXISTANTS
     (`--ps-lvl1..6` + leurs fonds clairs). Ce sont ceux des badges de cours :
     les pastilles parlent donc la même langue que le reste du site, et une
     retouche au configurateur les suit sans toucher à ce fichier. Inventer
     cinq couleurs ici, c'eût été créer une seconde charte à maintenir. */
  /* Crayon inline : pas de police d'icônes, pas de requête, et il hérite de la
     couleur de sa pastille via `currentColor`. */
  var CRAYON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M14 6l4 4"/></svg>';

  /* 🔴🔴 UN CANAL = UNE PASTILLE (08/08, Ziad : « contact il faut le retirer
     pour mettre les différents choix visibles sur la page »).
     L'unique pastille « Contact — renseigné » cachait deux choses à la fois :
     PAR QUOI le membre est joignable, et le fait que son crayon n'ouvrait
     jamais que l'e-mail. Quatre canaux, quatre pastilles, quatre crayons.
     - `discret` : la VALEUR ne s'affiche pas (« renseigné »). C'est le moyen de
       joindre quelqu'un, lisible par-dessus son épaule — la règle du 07/08 ne
       change pas, c'est le NOMBRE de pastilles qui change.
     - Même `lvl` pour les quatre : la couleur dit qu'ils forment une famille.
     🔴 L'ORDRE EST CELUI DE `FICHE_ECRANS` dans `tokens.js`, et la liste doit
     lui rester parallèle : une pastille sans écran serait un crayon qui n'ouvre
     rien, un écran sans pastille un champ qu'on ne peut plus atteindre depuis
     la carte. Ajouter une question quelque part, c'est l'ajouter aux deux. */
  var FICHE_PASTILLES=[
    {cle:"cf_ecole",     nom:"École",     lvl:1},
    {cle:"cf_niveau",    nom:"Niveau",    lvl:4},
    {cle:"cf_recherche", nom:"Recherche", lvl:3},
    {cle:"cf_langue",    nom:"Langue",    lvl:6},
    {cle:"cf_contactmail",     nom:"E-mail",    lvl:5, discret:true},
    {cle:"cf_contactlinkedin", nom:"LinkedIn",  lvl:5, discret:true},
    {cle:"cf_contacttel",      nom:"Téléphone", lvl:5, discret:true},
    {cle:"cf_contactwhatsapp", nom:"WhatsApp",  lvl:5},
    /* 🔴 L'ANCIEN champ libre n'est PAS supprimé : des membres l'ont rempli
       avant le 07/08 et le Worker le lit toujours pour bâtir leur carte. Le
       retirer de cet écran sans regarder leur donnée leur afficherait « aucun
       contact » alors qu'ils en ont un. Il s'efface de lui-même dès qu'un canal
       explicite existe (`ancien`), et son crayon ouvre l'e-mail — l'écran
       `cf_contact` n'existe plus dans la popup, ce serait un crayon qui
       n'ouvre rien.
       🔴 Sa place est ICI, avec les canaux : rangé après la bio il partait tout
       seul en fin de rangée, séparé de la famille dont il fait partie. */
    {cle:"cf_contact",   nom:"Contact",   lvl:5, discret:true, ancien:true},
    /* 🔴🔴 LA BIO EST UN CHAMP **NATIF** de LearnWorlds : elle n'a pas de tag
       `cf_bio_…`, donc `champsFiche()` ne la voyait pas et la pastille aurait
       affiché « à renseigner » à un membre qui l'a remplie — un écran qui ment.
       C'est pour ça qu'elle manquait ici. Elle est lue à part, sur `me`
       directement (voir `champsFiche`). */
    {cle:"bio",          nom:"Bio",       lvl:2}
  ];

  function champsFiche(){
    var m=(typeof me==="object"&&me)?me:null;
    if(!m) return {};
    var cf={}, k, src=m.custom_fields||{};
    for(k in src) if(Object.prototype.hasOwnProperty.call(src,k)) cf[k]=src[k];
    /* 🔴🔴 LA BIO EST NATIVE, ET ELLE EST LÀ (mesuré le 08/08 sur `/account` :
       `me.bio` = chaîne, 11 caractères). Ma note du 07/08 — « la bio paraîtra
       toujours à remplir » — décrivait une limite de CE CODE, qui ne lisait que
       `custom_fields` et les tags `cf_*`, pas une limite de LearnWorlds.
       ⇒ C'est aussi la réponse à « on ne peut pas la remplacer par une bio de
       chez nous ? » : inutile. Un `cf_bio` obligerait à migrer les bios déjà
       écrites, à changer `CHAMPS_ANNUAIRE`/`toCard()` côté Worker, et
       LearnWorlds en ferait un TAG portant la bio entière — sans empêcher
       `/profile` de continuer à éditer la native. Deux portes d'écriture pour
       la même donnée finissent toujours par diverger (règle déjà écrite dans
       le Worker pour la photo). */
    if(m.bio!=null && String(m.bio).trim()) cf.bio=String(m.bio);
    [].slice.call(m.tags||[]).forEach(function(t){
      var s=String(typeof t==="string"?t:(t&&t.name)||"");
      if(s.indexOf("cf_")!==0) return;
      var reste=s.slice(3), i=reste.indexOf("_");
      if(i<=0) return;
      var cle="cf_"+reste.slice(0,i), val=reste.slice(i+1);
      if(!cf[cle] && val) cf[cle]=val;
    });
    return cf;
  }

  var obsFiche=null;

  /* ── PISTE A (choisie le 05/08) : une CARTE À PART ────────────────────────
     La carte « Informations personnelles » mélangeait deux sujets qui n'ont ni
     le même propriétaire ni la même action : l'identité du compte (servir à se
     connecter) et la fiche d'annuaire (servir à être trouvé). D'où une carte
     éclatée — avatar, champs, pastilles et bandeau d'état sans rapport de
     poids. On sépare : la fiche a sa carte, son titre, son état et son bouton,
     lequel ouvre NOTRE formulaire.
     🔴 La carte suit l'onglet de son voisin. Elle n'est pas dans la navigation
     de LearnWorlds, donc les onglets ne la connaissent pas : sans
     `data-ps-suit`, elle resterait affichée sous « Paiements ». */
  function carteFiche(){
    var sec=document.getElementById("personal-details");
    if(!sec) return;
    if(!obsFiche){
      obsFiche=new MutationObserver(function(){ carteFiche(); });
      obsFiche.observe(sec,{childList:true,subtree:true});
    }
    var cf=champsFiche();
    var optin=String(cf.cf_annuaire||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
    var sig=JSON.stringify(FICHE_PASTILLES.map(function(c){ return String(cf[c.cle]||""); }).concat([optin]));

    var carte=document.getElementById("ps-carte-fiche");
    if(carte && carte.getAttribute("data-ps-sig")===sig) return;
    if(carte && carte.parentNode) carte.parentNode.removeChild(carte);

    carte=document.createElement("section");
    carte.id="ps-carte-fiche";
    carte.className="account-section ps-carte-fiche";
    carte.setAttribute("data-ps-suit","personal-details");
    carte.setAttribute("data-ps-sig",sig);

    var oui=optin.indexOf("oui")===0;
    var etat = optin ? '<span class="ps-fpill '+(oui?"ps-fpill-oui":"ps-fpill-non")+'">'+(oui?"Visible":"Masquée")+'</span>' : "";
    var libelleBouton = optin ? (oui ? "Modifier" : "Réactiver") : "Compléter";

    var chips="";
    /* L'ancien champ libre ne coexiste pas avec les canaux explicites : dès
       qu'un seul est rempli, il n'a plus rien à dire que les autres ne disent
       mieux. */
    var aCanal=["cf_contactmail","cf_contactlinkedin","cf_contacttel"]
                 .some(function(k){ return String(cf[k]||"").trim(); });
    /* 🔴🔴 TOUS LES CHAMPS SONT À L'ÉCRAN, REMPLIS OU NON (08/08, Ziad : « ya
       pas toutes les entrées dans les pastilles colorées, faut tout rajouter,
       bio, linkedin etc »).
       ⚠️ Cela REMPLACE la règle du 07/08 (« une seule pastille pour tout ce qui
       manque, une par champ vide transformait la carte en liste de reproches »).
       Ce qui a changé entre-temps et rend l'inversion juste : depuis le crayon,
       une pastille n'est plus une étiquette, c'est **la seule porte d'entrée
       vers un champ précis**. Regroupées, les entrées manquantes n'avaient pas
       de porte — pour ajouter son LinkedIn il fallait retraverser tout le
       questionnaire. Une pastille vide n'est plus un reproche, c'est un bouton.
       🔴 La contrepartie est réelle : la carte affiche désormais tout ce qui
       n'est pas fait. C'est un arbitrage assumé, pas un oubli. */
    FICHE_PASTILLES.forEach(function(c){
      if(c.ancien && aCanal) return;
      var v=String(cf[c.cle]==null?"":cf[c.cle]).trim();
      var cible = c.ancien ? "cf_contactmail" : c.cle;
      if(!v){
        /* L'ancien champ libre ne se PROPOSE pas : on ne demande plus de le
           remplir, on se contente de ne pas perdre ceux qui l'ont fait. */
        if(c.ancien) return;
        /* Vide : la pastille ENTIÈRE est le bouton — pas de crayon dans une
           pastille qui n'a rien à corriger. */
        chips+='<span class="ps-fpill ps-fpill-todo" role="button" tabindex="0" '+
          'data-ps-champ="'+cible+'" title="Renseigner">'+
          '<b>'+c.nom+'</b><i>+ à renseigner</i></span>';
        return;
      }
      /* 🔴 Un moyen de CONTACT ne s'affiche pas en clair : c'est ce qui permet
         de joindre la personne, lisible par-dessus son épaule. On dit qu'il est
         là, le crayon suffit à le revoir. */
      var aff = c.discret ? "renseigné" : v.replace(/[&<>]/g,"");
      /* 🔴 La BIO va jusqu'à 280 caractères : affichée entière, elle faisait de
         sa pastille un pavé qui déformait toute la rangée. Les autres champs
         sont courts par nature — la coupe ne les touche pas, elle ne coûte donc
         rien et protège du seul cas qui déborde. Le texte complet reste à un
         clic, dans son écran. */
      if(aff.length>44) aff=aff.slice(0,42).replace(/\s+\S*$/,"")+"…";
      chips+='<span class="ps-fpill ps-fpill-cray ps-lvl'+c.lvl+'"><b>'+c.nom+'</b><i>'+aff+'</i>'+
        '<button type="button" class="ps-fpill-edit" data-ps-champ="'+cible+'" '+
        'aria-label="Modifier '+c.nom.toLowerCase()+'" title="Modifier">'+CRAYON+'</button></span>';
    });

    /* 🔴🔴 DEUX ACTIONS SÉPARÉES (07/08, demande de Ziad : « dissocier
       l'activation de la visibilité seule et le remplissage des infos »).
       Un seul bouton faisait les deux : basculer sa visibilité ouvrait le
       questionnaire, et on ne pouvait pas réviser ses infos sans toucher à sa
       visibilité. Deux intentions, deux boutons.
       🔴 LE MINIMUM EST DIT, PAS DEVINÉ. La règle du Worker retire les fiches
       sans école ni moyen de contact : sans ce message, un membre verrait
       « Visible » et n'apparaîtrait nulle part, sans jamais savoir pourquoi.
       Un opt-in qui semble accepté mais ne produit rien est pire qu'un refus. */
    var aEcole=!!String(cf.cf_ecole||"").trim();
    var aContact=["cf_contactmail","cf_contactlinkedin","cf_contacttel","cf_contact"]
                   .some(function(k){ return String(cf[k]||"").trim(); });
    var manqueMin=[]; if(!aEcole) manqueMin.push("votre école");
    if(!aContact) manqueMin.push("un moyen de vous joindre");

    carte.innerHTML=
      '<div class="account-section-header ps-fiche-hd">'+
        '<div class="ps-fiche-t"><span class="account-section-title">Ma fiche d\'annuaire</span>'+etat+'</div>'+
        '<div class="ps-fiche-actions">'+
          '<button type="button" class="learnworlds-button ps-fiche-visi">'+(oui?"Masquer ma fiche":"Afficher ma fiche")+'</button>'+
          '<button type="button" class="learnworlds-button ps-fiche-cta">'+(optin?"Modifier mes infos":"Compléter")+'</button>'+
        '</div>'+
      '</div>'+
      (oui && manqueMin.length
        ? '<p class="ps-fiche-alerte">Votre fiche n\'apparaîtra pas tant qu\'il manque '+
          manqueMin.join(" et ")+'&nbsp;: sans cela, personne ne peut vous trouver ni vous joindre.</p>'
        : '')+
      '<div class="ps-fpills">'+(chips||'<span class="ps-fpill ps-fpill-vide" role="button" tabindex="0">+ Renseigner ma fiche</span>')+'</div>';

    var ouvrir=function(){
      if(typeof window.PS_FICHE_OUVRIR==="function" && window.PS_FICHE_OUVRIR(true)) return;
      var b=[].slice.call(sec.querySelectorAll("button")).filter(function(x){
        return /modifier/i.test((x.textContent||"").trim()); })[0];
      if(b) b.click();
    };
    /* L'interrupteur n'ouvre RIEN : il écrit, et la carte se refait sur
       l'événement `ps:fiche-enregistree` émis par tokens.js. */
    var basculer=function(){
      if(typeof window.PS_FICHE_ECRIRE!=="function") return ouvrir();
      var vers = oui ? window.PS_OPTIN_NON : window.PS_OPTIN_OUI;
      if(!vers) return ouvrir();                 /* libellés absents : on ne devine pas */
      var b=carte.querySelector(".ps-fiche-visi");
      if(b){ b.disabled=true; b.textContent="…"; }
      window.PS_FICHE_ECRIRE({ cf_annuaire: vers });
    };
    var brancher=function(sel, action){
      [].slice.call(carte.querySelectorAll(sel)).forEach(function(e){
        e.addEventListener("click",action);
        e.addEventListener("keydown",function(ev){ if(ev.key==="Enter"||ev.key===" "){ ev.preventDefault(); action(); } });
      });
    };
    /* 🔴 `stopPropagation` : sans lui, le clic du crayon remonterait à la
       pastille et ouvrirait AUSSI le parcours complet — deux popups pour un
       clic, ou la mauvaise des deux. */
    /* Le crayon d'une pastille remplie ET la pastille vide entière ouvrent la
       même chose : l'écran de CE champ. Deux apparences, une seule action. */
    [].slice.call(carte.querySelectorAll(".ps-fpill-edit,.ps-fpill-todo")).forEach(function(b){
      var agir=function(ev){
        ev.preventDefault(); ev.stopPropagation();
        var cle=b.getAttribute("data-ps-champ");
        if(typeof window.PS_FICHE_OUVRIR_CHAMP==="function" && window.PS_FICHE_OUVRIR_CHAMP(cle)) return;
        ouvrir();                       /* repli : le parcours complet */
      };
      b.addEventListener("click",agir);
      /* Les pastilles vides sont des `span` en `role="button"` : le clavier ne
         les active pas tout seul, il faut le lui dire. */
      b.addEventListener("keydown",function(ev){
        if(ev.key==="Enter"||ev.key===" ") agir(ev);
      });
    });
    brancher(".ps-fiche-visi", basculer);
    brancher(".ps-fiche-cta,.ps-fpill-vide", ouvrir);

    if(sec.parentNode) sec.parentNode.insertBefore(carte, sec.nextSibling);
    /* Elle prend la visibilité de sa voisine dès l'insertion. */
    carte.style.display = getComputedStyle(sec).display==="none" ? "none" : "";
  }

  function run(){
    if(!surLaPage()) return;
    figtree(); styles(); blocEcole(); carteFiche();
    /* Les onglets remplacent le repérage par défilement : le spy n'est appelé
       que s'ils n'ont pas pu se poser (une seule section, ou nav absente). */
    if(!onglets()) spy();
    /* progression() n'est PLUS appelée : la section « Cours et programmes » est
       masquée (cf. CSS), donc inutile d'aller chercher l'avancement via le
       Worker/Turnstile. Le code de progression est conservé plus haut au cas où
       la section serait ré-affichée. */
  }

  /* 🔴 La popup prévient quand elle a enregistré : la carte se refait sans
     rechargement. Sans ça, choisir « Non » laissait la pastille sur « Visible »
     jusqu'à la prochaine visite — l'inverse de ce que la personne venait de
     décider, sur un sujet de confidentialité. */
  document.addEventListener("ps:fiche-enregistree", function(){ if(surLaPage()) carteFiche(); });

  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded",run);
  window.addEventListener("load",run);
  /* l'app compte est rendue en JS : les sections n'existent pas au 1er passage.
     Mêmes relances que les autres fichiers du repo. */
  /* 🔴 Relances poussées à 12 s : `me.custom_fields` est rempli TARD par
     l'app de compte, et les pastilles doivent pouvoir se corriger. */
  [200,600,1200,2500,5000,8000,12000].forEach(function(d){ setTimeout(run,d); });
})();
