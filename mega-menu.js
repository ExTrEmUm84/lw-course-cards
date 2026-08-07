/* ============================================================
   Mega menu de navigation LearnWorlds — style monday (pictos)
   ------------------------------------------------------------
   À charger SITE-WIDE (Réglages du SITE → Code personnalisé) car le menu est
   présent sur toutes les pages — jamais dans un élément « HTML », les <script>
   y sont inertes :
     <script src="https://extremum84.github.io/lw-course-cards/mega-menu.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   1) Typo moderne (Figtree) sur toute la barre de nav.
   2) Dropdowns natifs (.lw-topbar-submenu) -> panneau type monday :
      UNE SEULE LIGNE occupant la largeur du menu, picto coloré + titre.

   ⚠️ Le menu MOBILE (burger) réutilise les mêmes classes mais vit HORS
   de `nav.lw-topbar-menu`. Toutes les règles de mise en page sont donc
   scopées sous `nav.lw-topbar-menu` pour ne pas casser le tiroir mobile.

   ⚠️ LearnWorlds pose `bottom:0` sur le panneau. Un `top:100%` sans
   `bottom:auto` rend la hauteur définie -> les items s'écrasent à 0px.
   Le `bottom:auto !important` ci-dessous est INDISPENSABLE.
   ============================================================ */
(function(){
  "use strict";

  /* 🔴 MARQUEUR DE VERSION, ET IL MANQUAIT. Deux fois dans la seule journée du
     05/08 j'ai été incapable de dire si une page exécutait mon correctif ou une
     copie en cache — GitHub Pages garde le fichier ~10 minutes. `tokens.js` a
     `PS_TOKENS_V` et c'est ce qui permet de trancher en une seconde ; ce fichier
     n'avait rien. Posé AVANT tout le reste : un marqueur défini en fin de
     fichier ne dit rien quand une erreur survient au milieu.
     ⇒ En console : `PS_MENU_V`. */
  window.PS_MENU_V="2026-08-06-a";

  /* 🔴 `PS_CSS_ONLY` : drapeau posé par le CONFIGURATEUR et par lui seul (le site
     ne le pose jamais). Sous ce drapeau, ce fichier ne fait plus rien d'autre que
     PUBLIER ses pictos et sa feuille — il ne construit aucun menu, n'observe rien
     et ne touche pas au <head> de l'outil. Même contrat que `tokens.js`.
     Pourquoi : le configurateur doit montrer les VRAIS pictos du menu quand on en
     règle la couleur. Sans ça il en garderait une copie, et une copie dérive —
     c'est exactement ce qui a été retiré des maquettes de cartes le 04/08. */
  if(!window.PS_CSS_ONLY && !document.getElementById("ps-figtree")){
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(f);
  }

  var ICON={
    play:'<svg viewBox="0 0 24 24"><path d="M7 5l11 7-11 7z"/></svg>',
    bolt:'<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
    chat:'<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    book:'<svg viewBox="0 0 24 24"><path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/></svg>',
    build:'<svg viewBox="0 0 24 24"><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h3M8 12h3M8 16h3"/></svg>',
    clip:'<svg viewBox="0 0 24 24"><path d="M9 4h6v2H9z"/><path d="M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2"/><path d="M9 12h6M9 16h4"/></svg>',
    users:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6"/></svg>',
    user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2"/></svg>',
    out:'<svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/></svg>',
    def:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>'
  };
  function pick(l){ l=l.toLowerCase();
    if(/webinar/.test(l)) return "play";
    if(/bootcamp/.test(l)) return "bolt";
    if(/entretien/.test(l)) return "chat";
    if(/fiches?\s*cabinet|test/.test(l)) return "doc";
    if(/secteur/.test(l)) return "build";
    if(/cours/.test(l)) return "book";
    if(/partenaire/.test(l)) return "users";
    if(/etude|étude|\bcas\b/.test(l)) return "clip";
    if(/profil/.test(l)) return "user";
    if(/messagerie/.test(l)) return "mail";
    if(/compte/.test(l)) return "gear";
    if(/connexion|déconnexion|deconnexion/.test(l)) return "out";
    return "def";
  }

  var NAV=" nav.lw-topbar-menu ";           // scope desktop
  /* Scope du TIROIR MOBILE. Il est disjoint de NAV : LearnWorlds construit
     deux menus distincts, et le tiroir n'apparaît dans le DOM qu'en dessous
     du point de bascule (mesuré : peuplé à 614px, VIDÉ à 1565px — il est
     détruit et reconstruit au redimensionnement, d'où l'importance de
     l'observateur de mutations qui rejoue `build()`). */
  var DRW=" .js-lw-topbar-hamburger-wrapper ";

  /* 🔴 LA LANGUE SE LIT DANS LE DESSIN DU DRAPEAU, PAS DANS SA POSITION.
     Relevé sur les deux SVG servis, et revérifié dans le tiroir mobile le
     06/08 (mêmes fichiers) :
        • Union Jack : 4 `<rect>` + **6 `<polygon>`** (les croix diagonales), 2,7 ko
        • drapeau FR : **3 `<rect>`, 0 `<polygon>`**, 585 octets
     Les images n'ont ni `alt`, ni `title`, ni classe distinctive. La position
     était le seul repère évident, et c'est exactement ce qu'il ne fallait pas
     prendre : Ziad réordonne ses éléments dans le Site Builder, et deux
     drapeaux inversés enverraient les francophones en anglais sans que rien
     ne le signale. Le dessin, lui, ne change pas quand on déplace l'icône.
     🔴 Remontée au niveau du fichier le 06/08 : l'en-tête ET le tiroir en ont
     besoin. En laisser une copie dans chacun, c'est se garantir qu'un jour
     l'une des deux ne connaîtra pas un drapeau que l'autre reconnaît. */
  function langueDuDessin(svg){
    var poly=(svg.match(/<polygon/gi)||[]).length;
    var rect=(svg.match(/<rect/gi)||[]).length;
    if(poly>0) return "en";                 /* croix diagonales = Union Jack */
    if(rect>=3) return "fr";                /* trois bandes verticales */
    return null;                            /* on ne devine pas */
  }

  var CSS=[
    /* ---------- pictos + libellés (desktop ET tiroir mobile) ---------- */
    /* 🔴🔴 CHAQUE PICTO PORTE LA COULEUR DE LA PAGE QU'IL VISE (Ziad, 04/08).
       Historique en deux temps, parce que je me suis trompé de cible au premier :
       1. Les pictos cyclaient sur six teintes selon leur POSITION
          (`nth-child(6n+N)`) : une seule suivait l'accent, les cinq autres étaient
          figées en dur. D'où « les couleurs changent tout le temps » — elles
          changeaient en effet à chaque menu et à chaque rang, sans rien signifier.
       2. Je les ai d'abord toutes alignées sur la couleur de la page COURANTE.
          Ziad : « je veux qu'elles gardent la couleur de leurs pages
          respectives ». C'est mieux, et ça donne au menu une vraie information :
          le picto annonce la couleur de la page où l'on va.
       La couleur est donc posée par `couleurLien()`, à partir de `PS_PAGE_ACCENTS`
       — la MÊME table qui colore les pages, donc rien à tenir à jour ici.
       Cette règle-ci reste le défaut : une page sans couleur propre (Blog, Profil,
       Bootcamp…) prend l'accent de la marque.
       ⚠️ Réserve assumée, cohérente avec la décision du 03/08 (« plus aucun
       assombrissement ») : sur une teinte CLAIRE — le jaune des fiches secteur —
       le glyphe blanc est peu lisible. C'est visible, donc corrigeable en changeant
       la couleur, plutôt que compensé dans le dos de celui qui la choisit. */
    ".ps-mm-ic{background:var(--ps-accent,#507EC5) !important;border-radius:11px !important;flex:none !important;display:flex !important;align-items:center !important;justify-content:center !important;color:#fff !important;}",
    ".ps-mm-ic svg{stroke:#fff !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-mm-t{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-weight:600 !important;color:var(--ps-text,#1c1f26) !important;line-height:1.3 !important;}",
    /* tiroir mobile : on garde la ligne picto + libellé */
    ".ps-mm-ic{width:34px !important;height:34px !important;}",
    ".ps-mm-ic svg{width:19px !important;height:19px !important;}",
    ".ps-mm-t{font-size:14.5px !important;}",
    ".lw-topbar-submenu-item.ps-mm-hide{display:none !important;}",
    ".lw-topbar-submenu.ps-mm-empty{display:none !important;}",

    /* ================================================================
       TIROIR MOBILE (burger) — 06/08, demande de Ziad : « il est très
       moche, y a pas de hiérarchie »
       ----------------------------------------------------------------
       🔴🔴 CE TIROIR N'EST PAS LE MENU DE BUREAU, ET RIEN NE LE TOUCHAIT.
       Mesuré en session connectée : il vit dans
       `.js-lw-topbar-hamburger-wrapper`, HORS de `nav.lw-topbar-menu`, et
       utilise des classes à lui (`mobile-nav-menu`, `mobile-nav-subMenu`)
       qui ne croisent JAMAIS `.lw-topbar-submenu-item`. `build()` ne
       pouvait donc pas l'atteindre — d'où zéro picto, zéro couleur, et
       cinq libellés gris centrés dans du blanc.

       🔴 CE QU'ON NE TOUCHE PAS, ET POURQUOI :
       • `max-height` / `overflow` de `ul.mobile-nav-subMenu` — c'est
         LearnWorlds qui anime l'accordéon avec (mesuré : `0px` fermé,
         `none` ouvert, via la classe `.subMenu-open` sur le `li`). Une
         règle à nous dessus fige les sous-menus ouverts ou fermés.
       • Le CONTENU de `a.subMenu-toggle` — c'est un nœud de texte nu
         suivi de `<span class="chevron">`. Un `innerHTML` comme celui du
         bureau supprimerait le chevron de LearnWorlds.
       • Le bouton burger/croix — le MÊME élément sert aux deux états.
         Le lecteur de cours a déjà coûté un aller-retour sur ce piège
         exact (`427595f` → `6b08e3c`) : on n'y touche pas sans mesurer
         les deux états.

       🔴 Les PICTOS vont sur les FEUILLES, pas sur les rubriques — même
       règle que le bureau, où ils vivent sur `.lw-topbar-submenu-item`.
       Une rubrique est un intertitre, pas une destination : dans le
       tiroir LearnWorlds lui met d'ailleurs `href="javascript:void(0)"`.
       ================================================================ */
    /* la colonne : alignée à gauche, largeur bornée, respiration.
       🔴🔴 LES 64px DU HAUT DÉGAGENT LA CROIX DE FERMETURE, et ce défaut n'est
       apparu que sur un VRAI TÉLÉPHONE (capture de Ziad, 06/08 : « la croix
       vient sur le sélecteur »). La croix est en `position:absolute`,
       `z-index:101`, calée à **15px du bord droit** et haute de 27px à partir
       de y=24 — donc elle chevauche verticalement la première ligne quelle que
       soit la largeur. Ce qui change avec la largeur, c'est l'axe X :
         • à 614px (le minimum que Chrome accepte) la croix est à 559-599 et le
           chevron de la 1re rubrique à 536-545 → aucun recouvrement ;
         • à 375px la croix glisse à ~320-360 et le chevron à ~344-353 → ils se
           SUPERPOSENT, le chevron disparaît, et toute la zone droite de la
           première ligne FERME le menu au lieu de la déplier.
       🔴 **Mon banc d'essai était trop large pour révéler le défaut.** Chrome ne
       réduit pas sa fenêtre sous ~614px : j'avais noté « non mesuré sous 614 »
       comme une réserve mineure, c'était en réalité l'angle mort qui comptait.
       Un élément positionné par rapport au BORD DROIT doit être vérifié à la
       largeur la plus ÉTROITE, jamais à la plus commode.
       (La croix elle-même n'est pas touchée : c'est le même élément que le
       burger, et le lecteur de cours a déjà coûté un aller-retour sur ce piège.) */
    DRW+".lw-topbar-hamburger-menu{justify-content:flex-start !important;text-align:left !important;padding:64px 0 28px !important;}",
    DRW+"ul.mobile-nav-menu{width:100% !important;max-width:520px !important;margin:0 auto !important;padding:0 20px !important;text-align:left !important;list-style:none !important;}",
    /* 🔴 `align-items:stretch` — SANS LUI, RIEN N'EST ALIGNÉ À GAUCHE.
       LearnWorlds met `display:flex` sur le `li`. Notre lien devient donc un
       ÉLÉMENT de flex, se réduit à son contenu (mesuré : 199px dans un `li` de
       480) et se retrouve centré. Le `space-between` de la ligne ci-dessous
       n'avait tout simplement aucune largeur où s'exercer, et j'ai d'abord cru
       ma règle ignorée. Elle s'appliquait : c'est la BOÎTE qui était fausse. */
    DRW+"li.mobile-nav-menu-item{text-align:left !important;align-items:stretch !important;}",
    /* un filet entre rubriques : c'est lui qui crée la hiérarchie, pas une taille de police */
    DRW+"ul.mobile-nav-menu > li.mobile-nav-menu-item + li.mobile-nav-menu-item{border-top:1px solid var(--ps-border,#E6E9EF) !important;}",

    /* rubrique = ligne pleine largeur, libellé à gauche, chevron à droite.
       🔴 52px : en dessous de ~44px une cible tactile se rate. Mesuré
       avant correctif : 36px. */
    DRW+"ul.mobile-nav-menu > li > .mobile-nav-menu-link{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:12px !important;min-height:52px !important;padding:6px 2px !important;text-align:left !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;font-weight:700 !important;letter-spacing:-.01em !important;color:var(--ps-text,#1c1f26) !important;text-decoration:none !important;}",
    /* 🔴🔴 LES DEUX `color` DE CE BLOC NE SUFFISENT PAS, ET C'EST MESURÉ.
       Le 06/08 : `font-size` et `font-weight` de cette même règle passent, mais
       `color` reste à `#676879`. LearnWorlds colore ces liens depuis une règle
       ancrée sur **`#pageContainer`** — un sélecteur à ID bat une classe quel
       que soit le `!important` ET quel que soit l'ordre des feuilles. Seul
       l'inline gagne (vérifié en direct : la couleur bascule à la pose inline).
       ⇒ La vraie couleur est posée par `peindreRubriques()`, plus bas.
       Ces deux règles restent comme REPLI, pour le jour où LearnWorlds
       abandonnerait sa règle à ID — pas comme mécanisme principal. Même piège
       que les titres de widget de l'annuaire (25/07). */
    DRW+"li.subMenu-open > a.subMenu-toggle{color:var(--ps-accent,#507EC5) !important;}",
    DRW+".chevron{flex:none !important;opacity:.5 !important;transition:opacity .15s ease !important;}",
    DRW+"li.subMenu-open > a.subMenu-toggle .chevron{opacity:1 !important;}",

    /* sous-liste : jamais de max-height ici (cf. ci-dessus) */
    DRW+"ul.mobile-nav-subMenu{margin:0 !important;padding:0 0 12px !important;list-style:none !important;}",
    DRW+"ul.mobile-nav-subMenu > li.mobile-nav-menu-item{border:0 !important;}",
    DRW+"ul.mobile-nav-subMenu .mobile-nav-menu-link{display:flex !important;align-items:center !important;gap:13px !important;min-height:48px !important;padding:4px 2px !important;text-align:left !important;text-decoration:none !important;border-radius:12px !important;transition:background .15s ease !important;}",
    DRW+"ul.mobile-nav-subMenu .mobile-nav-menu-link:active{background:var(--ps-tint,#edf4ff) !important;}",
    /* le libellé d'une feuille est un peu plus grand qu'au bureau : on lit
       un menu de téléphone à bout de bras, pas à 60 cm d'un écran. */
    DRW+".ps-mm-t{font-size:15.5px !important;font-weight:600 !important;}",

    /* drapeaux : deux lignes centrées, séparées du menu par un filet.
       L'état actif/atténué vient des règles `[data-ps-lang]` déjà posées
       plus bas — rien à dupliquer ici. */
    DRW+".hamburger-icon-component{display:flex !important;align-items:center !important;justify-content:center !important;min-height:44px !important;min-width:44px !important;text-decoration:none !important;}",

    /* ---------- drapeaux de langue : état actif ----------
       🔴 Le drapeau INACTIF est atténué, pas masqué : on doit voir qu'une autre
       langue existe. Et le soulignement est en `box-shadow` plutôt qu'en
       `border-bottom` : une bordure ajouterait 2 px à la hauteur de l'élément et
       décalerait la barre de navigation d'un cheveu au changement de langue. */
    /* 🔴🔴 LE TRAIT SE POSE SUR L'IMAGE, PAS SUR LA BOÎTE. Première version :
       `box-shadow` sur le conteneur — or il fait **50×55 px** pour un drapeau de
       **26×16** (mesuré). Le trait se dessinait donc 19 px SOUS le drapeau, seul
       au milieu du vide, et Ziad l'a signalé dans la minute avec une capture.
       Un indicateur doit toucher ce qu'il indique. */
    /* 🔴🔴 LE DÉFAUT EST « NORMAL », L'EXCEPTION EST « ATTÉNUÉ » — ET C'EST
       L'INVERSE DE MA PREMIÈRE VERSION, qui a produit le défaut signalé par
       Ziad : « pourquoi les drapeaux sont transparents maintenant ? ».
       J'avais mis `opacity:.45` sur TOUS les drapeaux, et `1` sur le seul actif.
       Or `marquerActif()` sort sans rien faire si Weglot n'est pas encore prêt à
       lire la langue — et dans ce cas AUCUN drapeau n'est marqué actif, donc les
       deux restent à 45 % : l'en-tête a l'air désactivé.
       **Un état qui dépend d'une lecture doit dégrader vers le NORMAL, pas vers
       l'anormal.** Sans langue connue, on n'affiche pas d'indicateur — et rien
       ne paraît cassé. */
    "[data-ps-lang]{opacity:1 !important;transition:opacity .15s ease !important;}",
    "[data-ps-lang].ps-lang-off{opacity:.45 !important;}",
    "[data-ps-lang].ps-lang-off:hover{opacity:.85 !important;}",
    "[data-ps-lang] img{transition:border-color .15s ease !important;border-radius:2px !important;}",
    /* 🔴🔴 LE TRAIT ÉTAIT COLLÉ AU DRAPEAU (08/08, signalé par Ziad sur son
       iPhone). L'ancienne version — `box-shadow:0 5px 0 -3px` — annonçait
       « 3 px de respiration » dans son commentaire ; sa géométrie réelle en
       donnait **zéro** : pour une image de 16 px, l'ombre s'étendait de 16 à
       18 px, soit une bande qui commence exactement au bord bas.
       🔴 Et ces valeurs ne valaient QUE pour 16 px : une ombre décalée dépend
       de la hauteur de l'élément, si bien qu'un drapeau d'une autre taille
       aurait donné un tout autre écart. Le tiroir mobile n'était pas mesurable
       à la largeur où je travaillais — j'aurais réglé à l'aveugle.
       ✅ `padding` + `border` sur l'image : l'écart et l'épaisseur sont dits
       en clair et ne dépendent plus d'aucune hauteur. Mesuré : la largeur est
       imposée (26 px) mais la HAUTEUR est libre, donc le rembourrage grandit
       la boîte au lieu de rogner l'image — ce qu'un `box-sizing:border-box`
       aurait fait sur une hauteur fixée.
       🔴 `margin-bottom` négatif : la boîte ne grandit pas, donc la barre de
       navigation ne bouge pas d'un pixel au changement de langue. C'était la
       raison d'être du `box-shadow` d'origine, elle reste satisfaite. */
    "[data-ps-lang].ps-lang-on img{padding-bottom:4px !important;"+
      "border-bottom:2px solid var(--ps-accent,#507EC5) !important;"+
      "margin-bottom:-6px !important;box-shadow:none !important;}",
    "[data-ps-lang]:focus-visible{outline:2px solid var(--ps-accent,#507EC5) !important;outline-offset:2px !important;}",

    /* ---------- menu centré, drapeaux inchangés ----------
       La colonne de droite est en `justify-content:flex-end` et contient, à la
       suite : le menu puis les 2 drapeaux. Centrer cette colonne centrerait
       aussi les drapeaux. On sort donc LA SEULE colonne du menu du flux et on
       la centre sur la rangée du header : les drapeaux restent à leur place
       (mesuré : x 1306->1406 avant comme après) et le panneau du mega menu,
       ancré sur le menu, suit automatiquement.

       ⚠️ En CSS PUR, surtout pas via une classe posée en JS : le loader est en
       <head> mais le JS n'agit qu'au DOM prêt (~500ms). Le menu s'affichait donc
       à droite (natif) PUIS sautait au centre. Ici la règle est en place avant le
       premier rendu -> aucun saut. `:has()` cible la colonne qui contient la nav
       (vérifié : 1 seul élément, le bon). La rangée est déjà `position:relative`
       en natif ; on le réaffirme par sécurité. Si :has() n'était pas supporté,
       la règle est ignorée et le menu reste simplement aligné à droite. */
    ".lw-cols.js-same-content-wrapper{position:relative !important;}",
    ".lw-cols.js-same-content-wrapper .flex-item:has(> .lw-topbar-menu-wrapper){position:absolute !important;left:50% !important;top:50% !important;transform:translate(-50%,-50%) !important;}",
    /* garde-fou : sous ~1100px le menu centré finirait par toucher le logo ou
       les drapeaux -> on rend la main à la mise en page native */
    "@media(max-width:1100px){.lw-cols.js-same-content-wrapper .flex-item:has(> .lw-topbar-menu-wrapper){position:static !important;transform:none !important;}}",

    /* ---------- barre de nav : typo moderne ---------- */
    NAV+".lw-topbar-option-link-lbl{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;letter-spacing:-.01em !important;color:var(--ps-text,#1c1f26) !important;transition:color .15s ease !important;}",
    NAV+".lw-topbar-option:hover > .lw-topbar-option-link .lw-topbar-option-link-lbl{color:var(--ps-accent,#507EC5) !important;}",
    /* 🔴🔴 LE LIBELLÉ POSÉ SUR UN BOUTON PLEIN DOIT ÊTRE BLANC (05/08, signalé
       par Ziad). La règle du dessus colore TOUS les libellés de la barre en
       marine — y compris celui de « Sign up », qui est un bouton plein à
       l'accent. Résultat : marine sur bleu, presque illisible, sur le seul
       bouton qui compte pour un visiteur non connecté.
       🔴 CE QUI M'A FAIT PERDRE DU TEMPS, et c'est une leçon de mesure : je
       lisais `getComputedStyle` sur le `<a>`, qui EST blanc — le texte, lui,
       vit dans un `<span class="lw-topbar-option-link-lbl">` enfant, avec sa
       propre couleur. J'ai donc conclu trois fois « il est déjà blanc » face à
       quelqu'un qui le voyait marine. **Mesurer l'ancêtre, ce n'est pas mesurer
       le texte** : lire la couleur sur l'élément qui porte réellement les mots.
       🔴 Le survol aussi : sans cette seconde règle, il passerait à l'accent,
       c'est-à-dire à la couleur du fond du bouton — le libellé disparaîtrait. */
    NAV+".lw-topbar-option-link.learnworlds-button-solid-brand .lw-topbar-option-link-lbl,"+
    NAV+".lw-topbar-option:hover > .lw-topbar-option-link.learnworlds-button-solid-brand .lw-topbar-option-link-lbl"+
    "{color:#fff !important;}",
    NAV+".lw-topbar-option > .lw-topbar-option-link svg{transition:transform .2s ease !important;}",
    /* le chevron ne pivote plus au survol : il indique l'état OUVERT, et
       l'ouverture se fait maintenant au clic (cf. .ps-mm-on plus bas) */

    /* ---------- panneau : une seule ligne, largeur du menu ---------- */
    /* on ancre le panneau sur la barre entière (et non sur l'item survolé) */
    NAV+"ul.lw-topbar-options{position:relative !important;}",
    NAV+"li.lw-topbar-option{position:static !important;}",
    /* BANDE PLEINE LARGEUR sous le header (motif Boks).
       `left:50% + translateX(-50%) + width:100vw` : le menu étant centré sur la
       page, la bande se centre sur lui et couvre donc toute la largeur (mesuré :
       -10 -> 1702, soit la page entière). Pas d'ancrage sur la section : ses
       parents `.lw-cols` et `.learnworlds-section-content` sont déjà
       `position:relative` en natif, on ne peut pas s'y accrocher sans les
       neutraliser — et la rangée doit rester relative pour centrer le menu.
       ⚠️ `page-content` porte `overflow:hidden auto` : inutile de dépasser 1702.

       ÉCART SOUS LE HEADER — `--ps-mm-gap` (cf. measureGap()).
       `top:100%` se résout sur `ul.lw-topbar-options`, qui fait exactement la
       hauteur du TEXTE (mesuré : 26 -> 49px). Sans marge, la bande démarrait
       donc à 49, soit 26px À L'INTÉRIEUR du header (la section va de 0 à 75) :
       le bord venait mordre sous les libellés. On ne peut pas ancrer le panneau
       sur la section (cf. ci-dessus), d'où la marge mesurée en JS. */
    NAV+".lw-topbar-submenu.js-submenu-list{position:absolute !important;top:100% !important;bottom:auto !important;left:50% !important;right:auto !important;transform:translateX(-50%) !important;width:100vw !important;min-width:0 !important;max-width:100vw !important;height:auto !important;max-height:none !important;overflow:visible !important;margin-top:var(--ps-mm-gap,26px) !important;padding:12px 24px !important;border-radius:0 !important;border:0 !important;border-top:1px solid var(--ps-border,#E6E9EF) !important;border-bottom:1px solid var(--ps-border,#E6E9EF) !important;background:#F5F6F8 !important;box-shadow:none !important;gap:48px !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;grid-template-columns:none !important;justify-content:center !important;align-items:center !important;}",
    /* Ouverture pilotée en JS (classe), PAS en :hover — cf. openMenus() :
       le panneau fait toute la largeur du menu alors que son déclencheur est
       étroit ; en diagonale la souris sort du li AVANT d'atteindre le panneau,
       le :hover tombe et le menu disparaît. Un délai de grâce corrige ça. */
    NAV+".lw-topbar-submenu.js-submenu-list:not(.ps-mm-open){display:none !important;}",
    NAV+".lw-topbar-submenu.js-submenu-list.ps-mm-open{display:flex !important;}",
    /* Plus de pont ::before : la bande touche la barre (margin-top:0), il n'y a
       plus d'espace à combler — et le clic rend la question du survol caduque. */
    /* items sur UNE ligne : picto + libellé côte à côte, comme chez Boks */
    NAV+".lw-topbar-submenu-item:not(.ps-mm-hide){list-style:none !important;margin:0 !important;padding:0 !important;flex:0 0 auto !important;min-width:0 !important;display:flex !important;}",
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link{display:flex !important;flex-direction:row !important;align-items:center !important;justify-content:flex-start !important;text-align:left !important;gap:12px !important;padding:8px 4px !important;border-radius:var(--ps-r-btn,10px) !important;width:auto !important;white-space:nowrap !important;text-decoration:none !important;transition:opacity .15s ease !important;}",
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link:hover{background:transparent !important;opacity:.7 !important;}",
    NAV+".ps-mm-ic{width:38px !important;height:38px !important;}",
    NAV+".ps-mm-ic svg{width:21px !important;height:21px !important;}",
    NAV+".ps-mm-t{font-size:14px !important;white-space:nowrap !important;}",
    /* item de la barre dont le panneau est ouvert : on le marque, comme Boks */
    NAV+"li.lw-topbar-option.ps-mm-on > .lw-topbar-option-link .lw-topbar-option-link-lbl{color:var(--ps-accent,#507EC5) !important;}",
    NAV+"li.lw-topbar-option.ps-mm-on > .lw-topbar-option-link svg{transform:rotate(180deg) !important;}",
    /* sous 900px la bande deviendrait illisible sur une ligne : on la scrolle */
    "@media(max-width:900px){"+NAV+".lw-topbar-submenu.js-submenu-list{justify-content:flex-start !important;overflow-x:auto !important;gap:28px !important;}}"
  ];
  /* ====================================================================
     PUBLICATION POUR LE CONFIGURATEUR — pictos, choix du picto, feuille
     --------------------------------------------------------------------
     Trois choses, et rien de plus : la table des SVG, la fonction qui choisit
     lequel va sur quelle entrée, et le texte de la feuille. Le configurateur
     s'en sert pour peindre ses lignes de réglage avec le picto exact que le
     site posera — même glyphe, même pastille de 34px, même rayon.
     🔴 `pick` est publiée elle aussi : recopier ses douze motifs dans l'outil
     ferait diverger le picto affiché de celui du site au premier ajout d'entrée.
     🔴 Publié AVANT toute écriture dans le document : sous `PS_CSS_ONLY` on sort
     juste après, donc rien de ce qui suit (feuille injectée, mesures, observer,
     construction du menu) ne s'exécute dans le configurateur. */
  window.PS_CSS=window.PS_CSS||{};
  window.PS_CSS.menu=CSS.join("\n");
  window.PS_MM_ICON=ICON;
  window.PS_MM_PICK=pick;
  if(window.PS_CSS_ONLY) return;

  /* ====================================================================
     LES DRAPEAUX DE LANGUE DE L'EN-TÊTE  (05/08, demande de Ziad)
     --------------------------------------------------------------------
     Ziad a posé deux drapeaux dans l'en-tête depuis le Site Builder. Ce sont
     des ICÔNES, pas des liens : le clic ne faisait rien. On les câble sur
     Weglot, qui est déjà là — mesuré : `Weglot.initialized` vaut `true` et
     `getCurrentLang()` renvoie `fr` sur une page publique.
     🔴 On NE recrée PAS de sélecteur de langue et on n'injecte AUCUN script
     Weglot : la traduction passe par l'intégration NATIVE de LearnWorlds, et
     un second init sur une clé vide casse tout le dispositif (piège déjà payé).
     On ne fait qu'ajouter un écouteur.

     🔴🔴 LA LANGUE EST DÉDUITE DU DESSIN, PAS DE LA POSITION. Relevé sur les
     deux SVG servis :
        • Union Jack  : 4 `<rect>` + **6 `<polygon>`** (les croix diagonales), 2,7 ko
        • drapeau FR  : **3 `<rect>`, 0 `<polygon>`**, 585 octets
     Les deux images n'ont ni `alt`, ni `title`, ni classe distinctive — la
     position était le seul repère évident, et c'est exactement ce qu'il ne
     fallait pas prendre : Ziad réordonne ses éléments dans le Site Builder, et
     deux drapeaux inversés enverraient les francophones en anglais sans que
     rien ne le signale. Le dessin, lui, ne change pas quand on déplace l'icône.
     🔴 Repli sur la position (gauche = EN) si la lecture du SVG échoue, et on
     le DIT en console : mieux vaut un repli annoncé qu'un silence.
     ==================================================================== */
  (function drapeauxLangue(){
    if(window.__psLangBound) return;

    function pretWeglot(){ try{ return !!(window.Weglot && Weglot.initialized && Weglot.switchTo); }catch(e){ return false; } }

    /* ------------------------------------------------------------------
       INDIQUER LA LANGUE ACTIVE  (05/08, signalé par Ziad)
       ------------------------------------------------------------------
       Deux drapeaux côte à côte sans état actif ne disent pas dans quelle
       langue on est : ils ressemblent à deux boutons identiques. L'information
       manquait complètement.
       🔴 L'ÉTAT VIENT DE WEGLOT, PAS D'UN SOUVENIR À NOUS. On lit
       `getCurrentLang()` et on écoute son changement : garder notre propre
       variable, c'est se condamner à diverger le jour où la langue change par
       un autre chemin (URL `/en/…`, sélecteur natif, retour arrière).
       🔴 Le drapeau inactif est ATTÉNUÉ, pas masqué : on doit voir qu'une autre
       langue existe — c'est tout l'intérêt de l'afficher. */
    function marquerActif(){
      var actuelle;
      try{ actuelle=Weglot.getCurrentLang(); }catch(e){ actuelle=null; }
      var zones=[].slice.call(document.querySelectorAll("[data-ps-lang]"));
      /* 🔴🔴 ON N'ATTÉNUE QUE SI UN DRAPEAU CORRESPOND VRAIMENT. Ma première
         écriture atténuait « tout ce qui n'est pas actif » — donc les DEUX
         quand la langue courante ne correspondait à aucun d'eux (Weglot pas
         encore prêt, ou une troisième langue ajoutée un jour). C'est ce qui a
         donné l'en-tête tout pâle signalé par Ziad. On calcule d'abord si
         l'information est exploitable, ET SEULEMENT ALORS on marque. */
      var connue = !!actuelle && zones.some(function(z){ return z.getAttribute("data-ps-lang")===actuelle; });
      zones.forEach(function(z){
        var on = connue && z.getAttribute("data-ps-lang")===actuelle;
        z.classList.toggle("ps-lang-on", on);
        z.classList.toggle("ps-lang-off", connue && !on);
        /* `aria-current` : un lecteur d'écran annonce la langue active, pas
           seulement deux boutons de même nom. */
        if(on) z.setAttribute("aria-current","true"); else z.removeAttribute("aria-current");
      });
    }

    /* 🔴 Exposée pour le TIROIR MOBILE (06/08), qui câble ses propres drapeaux
       et doit pouvoir demander la mise à jour de l'indicateur. Sans ça, un
       drapeau du tiroir serait actif sans jamais le montrer — et l'indicateur
       de langue est justement ce qui manquait à l'en-tête avant le 05/08. */
    window.__psMarquerLangue=marquerActif;

    /* Weglot prévient quand la langue change — y compris quand le changement ne
       vient pas de nous. Repli : on repasse après le clic, au cas où cette
       version de l'API n'exposerait pas `on()`. */
    try{ if(window.Weglot && Weglot.on) Weglot.on("languageChanged", marquerActif); }catch(e){}

    function drapeauxDansEnTete(){
      return [].slice.call(document.querySelectorAll("img")).filter(function(e){
        var r=e.getBoundingClientRect();
        return e.offsetParent!==null && r.top<110 && r.width>=16 && r.width<=44 && r.height>=9 && r.height<=28;
      }).sort(function(a,b){ return a.getBoundingClientRect().left-b.getBoundingClientRect().left; });
    }

    /* (`langueDuDessin` est remontée au niveau du fichier : le tiroir mobile
       s'en sert aussi.) */

    function brancher(img, lang, origine){
      var zone=(img.closest && img.closest(".flex-item")) || img.parentElement || img;
      /* 🔴 IDEMPOTENCE PAR L'ANCÊTRE AUTANT QUE PAR SOI-MÊME. Sans ça, si le
         fichier est exécuté deux fois — un rechargement de script, une relance
         du configurateur — on peut marquer un conteneur PUIS un de ses parents,
         et l'indicateur se dessine deux fois. C'est ce que montrait la capture
         de Ziad : deux traits empilés sous le même drapeau. */
      if(zone.getAttribute("data-ps-lang")) return;
      if(zone.querySelector && zone.querySelector("[data-ps-lang]")) return;
      if(zone.parentElement && zone.parentElement.closest("[data-ps-lang]")) return;
      zone.setAttribute("data-ps-lang", lang);
      zone.style.cursor="pointer";
      zone.setAttribute("role","button");
      zone.setAttribute("tabindex","0");
      /* Le libellé manquait complètement : une icône cliquable sans nom n'est
         annoncée par aucun lecteur d'écran. */
      zone.setAttribute("aria-label", lang==="en" ? "Switch to English" : "Afficher le site en français");
      zone.title = lang==="en" ? "English" : "Français";
      function aller(){ try{ Weglot.switchTo(lang); }catch(e){} }
      zone.addEventListener("click", aller);
      marquerActif();
      zone.addEventListener("keydown", function(ev){
        if(ev.key==="Enter" || ev.key===" "){ ev.preventDefault(); aller(); }
      });
      /* Repli du repli : Weglot recharge parfois la page, parfois non. On
         repasse après le clic sans dépendre de son événement. */
      zone.addEventListener("click", function(){ setTimeout(marquerActif, 300); });
      try{ console.info("[PrepaStrat] Drapeau câblé sur « "+lang+" » ("+origine+")."); }catch(e){}
    }

    function poser(){
      if(!pretWeglot()) return false;
      var imgs=drapeauxDansEnTete();
      if(imgs.length<2) return false;
      window.__psLangBound=1;
      imgs.forEach(function(img, i){
        fetch(img.src).then(function(r){ return r.text(); }).then(function(t){
          var l=langueDuDessin(t);
          if(l) return brancher(img, l, "dessin du drapeau");
          brancher(img, i===0?"en":"fr", "REPLI par position — dessin non reconnu");
        }).catch(function(){
          brancher(img, i===0?"en":"fr", "REPLI par position — SVG illisible");
        });
      });
      return true;
    }

    /* L'en-tête et Weglot arrivent l'un après l'autre : quelques relances
       bornées, pas d'observateur permanent sur toutes les pages du site. */
    if(!poser()){
      var essais=0;
      var t=setInterval(function(){ if(poser() || ++essais>20) clearInterval(t); }, 400);
    }
  })();

  /* (le cycle de six couleurs par `nth-child` vivait ici : supprimé le 04/08,
     la couleur est posée une seule fois sur `.ps-mm-ic`, plus haut) */
  var st=document.getElementById("ps-megamenu-style");
  if(!st){ st=document.createElement("style"); st.id="ps-megamenu-style"; document.head.appendChild(st); }
  st.textContent=CSS.join("\n");

  /* Écart entre la barre et la bande.
     La bande se positionne en `top:100%` de `ul.lw-topbar-options`, qui est
     collée au texte du menu — pas au bas du header. On mesure donc ce qui
     manque pour atteindre le bas de la section du header (26px sur le thème
     actuel, header non sticky et de hauteur fixe). Mesuré plutôt que codé en
     dur : suit le padding du header s'il change dans le Customizer, et le
     passage en < 1100px où la colonne du menu repasse dans le flux.
     Le panneau est `position:absolute` : ouvert, il ne change pas la hauteur
     de la section, la mesure reste donc valable dans les deux états. */
  function measureGap(){
    var ul=document.querySelector("nav.lw-topbar-menu ul.lw-topbar-options");
    if(!ul) return;
    var sec=ul.closest("section.learnworlds-section");
    if(!sec) return;
    var gap=Math.round(sec.getBoundingClientRect().bottom-ul.getBoundingClientRect().bottom);
    if(!isFinite(gap) || gap<0 || gap>60) return;   // mesure aberrante -> on garde le repli CSS
    ul.closest("nav.lw-topbar-menu").style.setProperty("--ps-mm-gap",gap+"px");
  }

  /* ====================================================================
     LA COULEUR D'UN PICTO = LA SIENNE, FIXE, INDÉPENDANTE DES PAGES
     --------------------------------------------------------------------
     Troisième version, et c'est celle que Ziad a tranchée le 04/08 :
       1. cycle par POSITION (`nth-child(6n+N)`) -> « les couleurs changent tout
          le temps », et en effet elles se décalaient d'un menu à l'autre ;
       2. couleur de la page COURANTE -> tous les pictos identiques ;
       3. couleur de la page VISÉE -> juste sur le principe, mais sept entrées sur
          onze n'ont pas de couleur propre et tombaient sur le bleu de marque.
     ⇒ Chaque entrée porte SA teinte, décidée une fois dans `MENU_COULEURS`
     (`tokens.js`) et identique partout sur le site.
     🔴 La clé est le SLUG et non le libellé : les libellés sont traduits par
     Weglot, une table indexée dessus perdrait ses couleurs en anglais.
     🔴 Les jumelles EN passent par `PS_PAGES_FR` : le lien « Formations » pointe
     sur la jumelle anglaise, absente de la table. Sans cette résolution, la
     version anglaise du menu serait entièrement bleue.
     🔴 Le slug de cette jumelle a CHANGÉ le 04/08 : `formation-par-modules-clone-en`
     (mesuré le 03/08 sur le menu) renvoie désormais **404**, la page vit sous
     `formation-par-modules-en`. Corrigé dans `PS_PAGES_FR`. ⚠️ Le nouveau nom vient
     du sitemap, pas d'un relevé sur le menu lui-même : le menu ne se construit pas
     pour un visiteur anonyme, donc la cible du lien reste à reconfirmer en session.
     🔴 Entrée absente (Profil, Déconnexion) : on ne pose RIEN et la règle CSS de
     `.ps-mm-ic` fait retomber sur l'accent de la marque. Un repli en dur ici
     figerait une douzième couleur que personne ne pourrait régler. */
  function couleurLien(link){
    var tab=window.PS_MENU_COULEURS;
    if(!tab) return "";                       /* tokens.js absent : repli CSS */
    var slug="";
    try{ slug=new URL(link.getAttribute("href")||"",location.href).pathname.replace(/^\/+|\/+$/g,""); }
    catch(e){ return ""; }
    if(!slug) return "";
    var fr=window.PS_PAGES_FR;
    if(fr && fr[slug]) slug=fr[slug];         /* jumelle EN -> réglage de sa page FR */
    return tab[slug]||"";
  }
  /* 🔴 Passe SÉPARÉE de la construction, et rejouée à chaque `build()`. La
     construction est gardée par `data-ps-mm` (on ne réécrit pas le contenu d'un
     lien déjà fait) ; si la couleur vivait là, un `tokens.js` chargé APRÈS
     `mega-menu.js` n'aurait jamais repeint les pictos — l'ordre des deux balises
     dans le code du site n'est pas de notre ressort. Idempotent et sans effet de
     bord : on repose la même valeur.
     🔴 `important` obligatoire : la règle `.ps-mm-ic` du fichier porte
     `background:… !important`, qu'un style inline ordinaire ne bat pas. */
  /* 🔴 Le tiroir mobile est dans CE sélecteur, et pas dans une fonction à lui :
     sa couleur obéit exactement à la même règle (slug -> teinte) et doit être
     reposée dans les mêmes conditions — notamment quand `tokens.js` se charge
     APRÈS `mega-menu.js`, ordre sur lequel nous n'avons pas la main. Deux
     chemins séparés, c'est la garantie qu'un jour l'un des deux sera oublié. */
  function couleurs(){
    document.querySelectorAll(".lw-topbar-submenu-item > .lw-topbar-option-link,"+DRW+"ul.mobile-nav-subMenu .mobile-nav-menu-link").forEach(function(link){
      var ic=link.querySelector(".ps-mm-ic");
      if(!ic) return;
      var c=couleurLien(link);
      if(c) ic.style.setProperty("background",c,"important");
      else  ic.style.removeProperty("background");
    });
  }

  function build(){
    measureGap();
    document.querySelectorAll(".lw-topbar-submenu-item > .lw-topbar-option-link").forEach(function(link){
      if(link.dataset.psMm) return;
      var label=(link.textContent||"").replace(/\s+/g," ").trim();
      var li=link.closest(".lw-topbar-submenu-item");
      /* placeholder LW : masqué via une CLASSE (un display:none inline
         perdrait face aux !important des règles ci-dessus) */
      if(/^submenu link$/i.test(label) || !label){ if(li) li.classList.add("ps-mm-hide"); return; }
      link.innerHTML='<span class="ps-mm-ic">'+(ICON[pick(label)]||ICON.def)+'</span>'
                   + '<span class="ps-mm-t">'+label+'</span>';
      link.dataset.psMm="1";
    });
    tiroir();                   /* le menu mobile, avant la passe de couleurs */
    couleurs();                 /* après la construction : les pictos existent */
    /* panneaux sans aucune entrée réelle : ne pas afficher de boîte vide */
    document.querySelectorAll(".lw-topbar-submenu").forEach(function(s){
      s.classList.toggle("ps-mm-empty", s.querySelectorAll(".lw-topbar-submenu-item:not(.ps-mm-hide)").length===0);
    });
    openMenus();
  }

  /* ====================================================================
     TIROIR MOBILE — pictos sur les feuilles, et drapeaux désamorcés
     --------------------------------------------------------------------
     Appelée depuis `build()`, donc rejouée par l'observateur de mutations :
     indispensable ici, parce que LearnWorlds DÉTRUIT et RECONSTRUIT tout le
     tiroir quand la fenêtre franchit son point de bascule (mesuré : 17 items
     à 614px, 0 à 1565px). Une décoration posée une seule fois disparaîtrait
     à la première rotation de téléphone.
     ==================================================================== */
  function tiroir(){
    var w=document.querySelector(".js-lw-topbar-hamburger-wrapper");
    if(!w) return;

    /* --- 1. Pastille + libellé sur les FEUILLES uniquement ---
       Le libellé est LU dans le DOM, jamais écrit en dur : Ziad doit pouvoir
       ajouter, renommer ou réordonner ses entrées depuis le Site Builder sans
       que personne ne touche à ce fichier. Une entrée inédite tombe sur le
       glyphe par défaut de `pick()` — jamais sur du vide. */
    w.querySelectorAll("ul.mobile-nav-subMenu .mobile-nav-menu-link").forEach(function(link){
      if(link.dataset.psMm) return;
      var label=(link.textContent||"").replace(/\s+/g," ").trim();
      if(!label || /^submenu link$/i.test(label)) return;   // gabarit LW non rempli
      link.innerHTML='<span class="ps-mm-ic">'+(ICON[pick(label)]||ICON.def)+'</span>'
                   + '<span class="ps-mm-t">'+label+'</span>';
      link.dataset.psMm="1";
    });

    /* --- 2. Les drapeaux du tiroir ---
       🔴🔴 ILS MÈNENT À DES 404. Mesuré le 06/08 en session connectée : dans
       le tiroir ce sont des `<a href="/courses-clone">` et
       `<a href="/courses-clone-clone">` — les liens fantômes déjà relevés le
       25/07 sur l'en-tête — et les deux répondent **HTTP 404**. Le correctif
       de bureau ne les a jamais atteints : `drapeauxDansEnTete()` ne retient
       que les images à `top < 110`, or dans un tiroir déroulant elles sont à
       443 et 483. Sur téléphone, toucher un drapeau EXPULSE donc l'utilisateur
       vers une page d'erreur, au lieu de changer de langue — et c'est le seul
       sélecteur de langue disponible, le panneau flottant de Weglot étant
       masqué site-wide depuis le 28/07.
       🔴 On DÉSARME plutôt qu'on ne remplace : retirer le `href` et arrêter
       l'événement suffit à tuer la navigation, là où remplacer le `<a>` par un
       `<span>` ferait perdre les accroches de LearnWorlds sur un élément qu'il
       reconstruit lui-même. */
    w.querySelectorAll("a.hamburger-icon-component, .hamburger-icon-component").forEach(function(zone){
      if(zone.getAttribute("data-ps-lang")) return;
      if(zone.closest("[data-ps-lang]")) return;
      var img=zone.querySelector("img");
      if(!img || !img.src) return;

      /* La langue se lit dans le DESSIN, jamais dans la position : Ziad
         réordonne ses éléments dans le Site Builder, et deux drapeaux inversés
         enverraient les francophones en anglais sans que rien ne le signale.
         Même méthode que l'en-tête, mêmes signatures (FR : 3 rect / 0 polygon,
         585 octets — EN : 4 rect / 6 polygon, 2,7 ko), revérifiées dans le
         tiroir le 06/08. */
      fetch(img.src).then(function(r){ return r.text(); }).then(function(t){
        var l=langueDuDessin(t);
        /* 🔴 Pas de repli par position ICI. Dans l'en-tête il y a exactement
           deux images et le repli est raisonnable ; dans le tiroir, n'importe
           quelle icône de LearnWorlds porte la même classe. Deviner reviendrait
           à câbler « changer de langue » sur un pictogramme quelconque. Sans
           dessin reconnu, on ne fait rien — mais on désarme quand même le lien
           mort, qui, lui, est mesuré. */
        desarmer(zone);
        if(l) brancherTiroir(zone, l);
      }).catch(function(){ desarmer(zone); });
    });

    /* --- 3. Couleur des rubriques : EN INLINE, sinon LearnWorlds gagne ---
       Voir la mise en garde de la feuille : `color` est la seule propriété que
       notre règle ne remporte pas, la faute à un sélecteur ancré sur un ID.
       🔴 L'état vient de LA CLASSE POSÉE PAR LEARNWORLDS (`.subMenu-open`), lue
       après coup — on ne tient aucune variable d'état à nous. C'est la même
       règle que pour la langue active : un état qu'on recopie finit par
       diverger de celui qui commande réellement l'affichage.
       🔴 Repeint APRÈS le clic, avec un léger décalage : c'est LearnWorlds qui
       bascule la classe, et la lire dans le même souffle que le clic donnerait
       l'ancien état — piège déjà payé deux fois en août. */
    function jeton(nom, repli){
      var v="";
      try{ v=getComputedStyle(document.documentElement).getPropertyValue(nom).trim(); }catch(e){}
      return v||repli;
    }
    function peindreRubriques(){
      w.querySelectorAll("ul.mobile-nav-menu > li.mobile-nav-menu-item").forEach(function(li){
        var a=li.querySelector(".mobile-nav-menu-link");
        if(!a || a.parentElement!==li) return;          /* pas les feuilles */
        var ouverte=li.classList.contains("subMenu-open");
        a.style.setProperty("color", ouverte ? jeton("--ps-accent","#507EC5") : jeton("--ps-text","#1c1f26"), "important");
        if(!a.dataset.psRepeint){
          a.dataset.psRepeint="1";
          a.addEventListener("click", function(){ setTimeout(peindreRubriques, 80); });
        }
      });
    }
    peindreRubriques();

    function desarmer(zone){
      var a=(zone.tagName==="A") ? zone : zone.querySelector("a");
      if(!a) return;
      var h=a.getAttribute("href");
      if(h && h!=="javascript:void(0)"){
        a.setAttribute("data-ps-href-mort", h);   // trace : on saura ce qu'on a retiré
        a.removeAttribute("href");
      }
      if(!a.dataset.psStop){
        a.dataset.psStop="1";
        a.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); });
      }
    }

    function brancherTiroir(zone, lang){
      if(zone.getAttribute("data-ps-lang")) return;
      zone.setAttribute("data-ps-lang", lang);
      zone.setAttribute("role","button");
      zone.setAttribute("tabindex","0");
      zone.style.cursor="pointer";
      zone.setAttribute("aria-label", lang==="en" ? "Switch to English" : "Afficher le site en français");
      zone.title = lang==="en" ? "English" : "Français";
      function aller(){ try{ Weglot.switchTo(lang); }catch(e){} }
      zone.addEventListener("click", function(e){ e.preventDefault(); aller(); });
      zone.addEventListener("keydown", function(e){
        if(e.key==="Enter" || e.key===" "){ e.preventDefault(); aller(); }
      });
      try{ if(window.__psMarquerLangue) window.__psMarquerLangue(); }catch(e){}
      try{ console.info("[PrepaStrat] Drapeau du tiroir mobile câblé sur « "+lang+" » (lien mort désarmé)."); }catch(e){}
    }
  }

  /* ------------------------------------------------------------------
     Ouverture au CLIC (et non au survol).

     ⚠️ Conséquence assumée : 3 des 4 items à panneau sont de vrais liens
     ("Formations PrepaStrat" -> /, "Cas" -> /social, "Mon compte" -> /account).
     Le clic ouvre le panneau au lieu de naviguer. Ces destinations restent
     atteignables depuis le panneau ("Etudes de cas", "Compte"…). "Blog" n'a
     pas de panneau : son lien fonctionne normalement.

     Le clic règle au passage le défaut du survol : le panneau fait toute la
     largeur alors que son déclencheur est étroit ("Cas" ~24px), donc la souris
     quittait le li par le côté avant d'atteindre le panneau (rupture mesurée
     en (1091,70)) et le menu se fermait sous le curseur.
     ------------------------------------------------------------------ */
  function closeAll(){
    document.querySelectorAll("nav.lw-topbar-menu .lw-topbar-submenu.ps-mm-open")
      .forEach(function(s){ s.classList.remove("ps-mm-open"); });
    document.querySelectorAll("nav.lw-topbar-menu li.lw-topbar-option.ps-mm-on")
      .forEach(function(l){ l.classList.remove("ps-mm-on"); });
  }
  function openMenus(){
    document.querySelectorAll("nav.lw-topbar-menu li.lw-topbar-option").forEach(function(li){
      if(li.dataset.psClick) return;
      var sub=li.querySelector(".lw-topbar-submenu");
      if(!sub || sub.classList.contains("ps-mm-empty")) return;   // ex : Blog -> lien normal
      var trigger=li.querySelector(":scope > .lw-topbar-option-link");
      if(!trigger) return;
      li.dataset.psClick="1";
      trigger.addEventListener("click",function(e){
        e.preventDefault();      // sinon on navigue au lieu d'ouvrir
        e.stopPropagation();     // sinon le listener document referme aussitôt
        var ouvert=sub.classList.contains("ps-mm-open");
        closeAll();
        if(!ouvert){ sub.classList.add("ps-mm-open"); li.classList.add("ps-mm-on"); }
      });
    });
  }
  /* fermeture : clic ailleurs, ou Échap. Posés une seule fois. */
  if(!window.__psMmBound){
    window.__psMmBound=1;
    document.addEventListener("click",function(e){
      if(!e.target.closest || !e.target.closest("nav.lw-topbar-menu")) closeAll();
    });
    document.addEventListener("keydown",function(e){ if(e.key==="Escape") closeAll(); });
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  window.addEventListener("resize",measureGap);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
