/* ============================================================
   Page "Mon profil" (/profile) — refonte au style du site
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /profile :
     <script src="https://extremum84.github.io/lw-course-cards/profile-page.js"></script>

   Contrairement à /account, /profile EST une page du Site Builder
   (elle a un `#pageContent` et 7 `learnworlds-section`) : elle a donc son
   propre champ "Code personnalisé". Le garde `body.slug-profile` reste
   posé par sécurité.

   La page empile 4 chantiers, traités ici dans un seul fichier :
     1. en-tête   : avatar + nom + bouton "Edit profile"
     2. RÉSUMÉ    : le H1 + 4 tuiles de stats sur bandeau bleu
     3. VUE GÉNÉRALE      : 3 cartes `.lw-course-card` "Niveau #N - Nom"
     4. VUE PAR THÉMATIQUE : cartes `.lw-learning-program-card1`

   ⚠️ NE PAS charger `course-cards.js` ici : il embarque le carrousel, les
   doubles chevrons et le hero — son CSS restylerait le H1 "RÉSUMÉ" en 56px
   et transformerait la grille en rail défilant. Le rendu des cartes est
   donc REFAIT ici, repris de course-cards.js mais réduit au nécessaire.

   ⚠️ La page a 4 `.cards-grandpa` (tuiles du RÉSUMÉ, cours, thématiques…).
   Tout est scopé par section, jamais sur `.cards-grandpa` nu.

   ⚠️ Largeur : les sections font 1120px en natif (290->1410) et non 1000
   comme les pages Cours/Cas. On garde 1120 — la page est cohérente avec
   elle-même, et forcer 1000 déplacerait tuiles et cartes sans bénéfice.
   ============================================================ */
(function(){
  "use strict";

  /* 🔴 LE GARDE S'ÉVALUE TARD, JAMAIS AU CHARGEMENT.
     LearnWorlds pose la balise dans le <HEAD> : à l'exécution du fichier,
     `document.body` est **null**. Un `if(!surLaPage()) return;` en tête d'IIFE
     tuait donc le script DÉFINITIVEMENT — il se chargeait sans rien faire.
     ⚠️ Mes tests ne l'avaient pas vu parce qu'ils INJECTAIENT le script après
     le chargement de la page (body déjà présent) : injecter tardivement
     n'équivaut PAS à une balise dans le <head>. */
  function surLaPage(){ return !!document.body && /(^|\s)slug-profile(\s|$)/.test(document.body.className); }

  function figtree(){
    if(document.getElementById("ps-figtree")) return;
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head||document.documentElement).appendChild(f);
  }

  var S="#pageContent";
  var FT="font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;";

  var CSS=[
    /* ============ 1) EN-TÊTE : avatar + nom + bouton ============ */
    S+" img.user-image{border-radius:50% !important;border:3px solid #fff !important;box-shadow:0 6px 20px rgba(15,23,42,.10) !important;}",
    /* le bouton "Edit profile" prend le CTA violet du site */
    S+" .ps-pf-head button.learnworlds-button,"+S+" button.learnworlds-button.ps-pf-edit{background:var(--ps-accent,#507EC5) !important;border:0 !important;border-radius:var(--ps-r-pill,999px) !important;padding:11px 22px !important;color:#fff !important;"+FT+"font-size:15px !important;font-weight:600 !important;box-shadow:none !important;cursor:pointer !important;transition:background .18s ease !important;}",
    S+" button.learnworlds-button.ps-pf-edit:hover{background:var(--ps-accent-hover,#486798) !important;}",

    /* ============ 2) RÉSUMÉ : titre + tuiles ============ */
    /* le H1 est sur le bandeau bleu -> il reste blanc, on ne touche qu'à la typo */
    S+" h1.learnworlds-heading{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;}",
    /* Les tuiles : `.lw-body-bg` est la boîte blanche de chaque tuile.
       Scopé sous .ps-pf-tiles (posé en JS sur le grandpa du RÉSUMÉ) : la page
       compte 4 `.cards-grandpa`, et `.lw-body-bg` existe AUSSI dans les cartes
       thématiques — une règle nue les toucherait toutes. */
    S+" .ps-pf-tiles .lw-body-bg{background:#fff !important;border:1px solid rgba(255,255,255,.5) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 14px rgba(15,23,42,.06) !important;padding:18px 20px !important;transition:transform .2s ease, box-shadow .2s ease !important;}",
    S+" .ps-pf-tiles .lw-body-bg:hover{transform:translateY(-2px) !important;box-shadow:0 10px 26px rgba(15,23,42,.10) !important;}",
    /* 🔴 JAMAIS `.lw-body-bg *` ICI — la police se pose sur la TUILE et se
       propage par héritage. Le `*` a réellement cassé les pictos des 4 tuiles :
       ils sont portés par des `span.learnworlds-icon` dont le glyphe vient
       d'une POLICE D'ICÔNES ; forcer Figtree dessus les transforme en carrés
       vides (constaté à l'écran, puis confirmé : police du ::before = Figtree
       au lieu de la police d'icône). Par héritage, tout élément qui déclare sa
       propre police — les icônes — la garde. Même leçon que account-page.js. */
    S+" .ps-pf-tiles .lw-body-bg{"+FT+"}",
    /* les classes de texte de LW déclarent leur police et ne prennent donc pas
       l'héritage : on les surcharge nommément, sans jamais toucher aux icônes */
    [S+" .ps-pf-tiles .learnworlds-main-text", S+" .ps-pf-tiles .learnworlds-main-text-small",
     S+" .ps-pf-tiles .learnworlds-heading3", S+" .ps-pf-tiles .learnworlds-heading4",
     S+" .ps-pf-tiles p", S+" .ps-pf-tiles .talign-l"].join(",")+"{"+FT+"}",

    /* ============ 2b) BOARD "progression par domaine" (remplace les 4 tuiles) ============ */
    /* Une tuile par programme thématique, avec son %. Données 100 % natives
       (progression des Learning Programs déjà rendue plus bas) -> instantané.
       Le board est injecté DANS le grandpa des tuiles ; les tuiles natives sont
       masquées via `ps-has-board`. */
    /* Mode DASHBOARD : anneau de progression + bouton « Continuer », une couleur
       par domaine (celle de sa page, posée en inline `--c` par le JS). */
    S+" .ps-pf-tiles.ps-has-board > *:not(.ps-pf-board){display:none !important;}",
    /* 🔴 MISE EN PAGE « BOARD » (29/07, retour de Ziad sur capture : « c'est très
       petit et vide, je veux de grosses cartes qui s'imbriquent pour occuper la
       largeur »). Le problème : chaque section prenait une LIGNE entière, donc
       une section à 1 parcours laissait les 3/4 de la ligne vides.
       Solution : le board est une grille de 4 colonnes et CHAQUE SECTION EST UNE
       CARTE dont la largeur suit son contenu — 1 parcours = 1 colonne, 2 = 2,
       4 = toute la largeur. Avec `grid-auto-flow:dense`, les petites cartes
       viennent COMBLER les trous laissés par les grandes : plus de vide.
       🔴 La largeur passe par une CLASSE (`ps-pf-w1..w4`) et non par un
       `span var(--n)` : `span` attend un entier littéral, une variable CSS ou un
       `min()` n'y est pas accepté — et il faut de toute façon pouvoir réduire
       les spans aux paliers responsive. */
    S+" .ps-pf-board{display:grid !important;grid-template-columns:repeat(4,minmax(0,1fr)) !important;gap:16px !important;grid-auto-flow:dense !important;align-items:start !important;}",
    S+" .ps-pf-w1{grid-column:span 1 !important;} "+S+" .ps-pf-w2{grid-column:span 2 !important;}",
    S+" .ps-pf-w3{grid-column:span 3 !important;} "+S+" .ps-pf-w4{grid-column:span 4 !important;}",
    /* la section EST la carte : c'est elle qui porte le fond blanc et l'ombre */
    S+" .ps-pf-grp{text-align:left !important;background:#fff !important;border-radius:var(--ps-r-card,16px) !important;padding:18px 20px 20px !important;box-shadow:0 4px 16px rgba(15,23,42,.07) !important;animation:psPfUp .55s ease both !important;}",
    S+" .ps-pf-grp-h{display:flex !important;align-items:center !important;gap:10px !important;margin:0 0 14px !important;}",
    /* trait vertical à la couleur de la page : repère de section */
    S+" .ps-pf-grp-h::before{content:'' !important;flex:none !important;width:4px !important;height:18px !important;border-radius:3px !important;background:var(--ps-pf-btn,var(--c,#507EC5)) !important;}",
    S+" .ps-pf-grp-t{"+FT+"font-size:14px !important;font-weight:800 !important;letter-spacing:.05em !important;text-transform:uppercase !important;color:#243B6B !important;}",
    S+" .ps-pf-grp-n{"+FT+"font-size:12px !important;font-weight:600 !important;color:#8A93A5 !important;margin-left:auto !important;white-space:nowrap !important;}",
    /* auto-fit ici est SANS DANGER : la carte est déjà dimensionnée sur son
       nombre de parcours, donc une tuile seule ne s'étire pas démesurément. */
    S+" .ps-pf-grp-g{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(190px,1fr)) !important;gap:12px !important;}",
    /* paliers : 4 colonnes -> 2 -> 1, en écrasant les spans */
    "@media (max-width:1040px){"+S+" .ps-pf-board{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}"
      +S+" .ps-pf-w2,"+S+" .ps-pf-w3,"+S+" .ps-pf-w4{grid-column:span 2 !important;}}",
    "@media (max-width:620px){"+S+" .ps-pf-board{grid-template-columns:minmax(0,1fr) !important;}"
      +S+" .ps-pf-w1,"+S+" .ps-pf-w2,"+S+" .ps-pf-w3,"+S+" .ps-pf-w4{grid-column:span 1 !important;}}",

    /* ---- bandeau de grade (gamification), pleine largeur en tête du board ---- */
    S+" .ps-pf-rank{text-align:left !important;grid-column:1 / -1 !important;display:flex !important;align-items:center !important;gap:22px !important;"
      +"background:#243B6B !important;border-radius:var(--ps-r-card,16px) !important;padding:22px 26px !important;"
      +"box-shadow:0 8px 24px rgba(36,59,107,.22) !important;animation:psPfUp .55s ease both !important;}",
    S+" .ps-pf-rank-med{flex:none !important;width:76px !important;height:76px !important;border-radius:50% !important;"
      +"background:var(--ps-accent,#507EC5) !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
    S+" .ps-pf-rank-txt{flex:1 !important;min-width:0 !important;}",
    S+" .ps-pf-rank-over{"+FT+"font-size:11.5px !important;font-weight:700 !important;letter-spacing:.08em !important;text-transform:uppercase !important;color:#A9C0E4 !important;}",
    S+" .ps-pf-rank-name{"+FT+"font-size:26px !important;font-weight:800 !important;color:#fff !important;letter-spacing:-.02em !important;line-height:1.2 !important;margin:2px 0 5px !important;}",
    S+" .ps-pf-rank-msg{"+FT+"font-size:13.5px !important;font-weight:500 !important;color:#C8D8EF !important;line-height:1.45 !important;margin:0 0 12px !important;}",
    S+" .ps-pf-rank-bar{height:8px !important;border-radius:5px !important;background:rgba(255,255,255,.18) !important;overflow:hidden !important;}",
    S+" .ps-pf-rank-fill{display:block !important;height:100% !important;width:0 !important;border-radius:5px !important;background:#7FA8DE !important;transition:width 1.1s cubic-bezier(.4,0,.2,1) !important;}",
    S+" .ps-pf-rank-r{flex:none !important;text-align:right !important;}",
    S+" .ps-pf-rank-pct{"+FT+"font-size:38px !important;font-weight:800 !important;color:#fff !important;letter-spacing:-.03em !important;line-height:1 !important;}",
    S+" .ps-pf-rank-lbl{"+FT+"font-size:12px !important;font-weight:600 !important;color:#A9C0E4 !important;margin-top:3px !important;}",
    /* ---- bandeau d'attente / d'indisponibilite (jamais de tuiles muettes) ---- */
    S+" .ps-pf-wait{text-align:left !important;grid-column:1 / -1 !important;display:flex !important;align-items:flex-start !important;gap:15px !important;"
      +"background:#EEF3FA !important;border:1px solid #DCE6F4 !important;border-radius:var(--ps-r-card,16px) !important;padding:18px 20px !important;}",
    S+" .ps-pf-wait-ko{background:#FFF6E8 !important;border-color:#F5E0BE !important;}",
    S+" .ps-pf-wait-ic{flex:none !important;width:44px !important;height:44px !important;border-radius:50% !important;background:#fff !important;"
      +"display:flex !important;align-items:center !important;justify-content:center !important;color:var(--ps-accent,#507EC5) !important;}",
    S+" .ps-pf-wait-ko .ps-pf-wait-ic{color:#B8791B !important;}",
    S+" .ps-pf-wait-ic svg{animation:psPfPulse 1.6s ease-in-out infinite !important;}",
    S+" .ps-pf-wait-ko .ps-pf-wait-ic svg{animation:none !important;}",
    S+" .ps-pf-wait-t{"+FT+"font-size:16px !important;font-weight:800 !important;color:#243B6B !important;margin-bottom:3px !important;}",
    S+" .ps-pf-wait-x{"+FT+"font-size:13.5px !important;font-weight:500 !important;color:#5A6b85 !important;line-height:1.5 !important;}",
    "@keyframes psPfPulse{0%,100%{opacity:1}50%{opacity:.35}}",
    "@media (max-width:620px){"+S+" .ps-pf-rank{flex-wrap:wrap !important;gap:16px !important;padding:20px !important;}"
      +S+" .ps-pf-rank-pct{font-size:30px !important;}}",
    /* 🔴 La tuile n'est plus une carte blanche flottante : la CARTE, c'est
       désormais la section. La tuile devient une plaque intérieure sobre, sinon
       on empile deux niveaux d'ombre et le tout fait « boîtes dans des boîtes ». */
    S+" .ps-pf-bt{background:#F7F9FC !important;border:1px solid #EDF1F7 !important;border-radius:13px !important;padding:16px 17px 15px !important;display:flex !important;flex-direction:column !important;gap:13px !important;transition:transform .2s ease, box-shadow .2s ease, background .2s ease !important;}",
    S+" .ps-pf-bt:hover{transform:translateY(-2px) !important;background:#fff !important;box-shadow:0 10px 24px rgba(15,23,42,.10) !important;}",
    S+" .ps-pf-bt-top{display:flex !important;align-items:center !important;gap:13px !important;}",
    S+" .ps-pf-ring{width:var(--ps-pf-ring,64px) !important;height:var(--ps-pf-ring,64px) !important;flex:none !important;position:relative !important;}",
    S+" .ps-pf-ring svg{transform:rotate(-90deg) !important;display:block !important;}",
    /* l'anneau s'anime en dessinant son tracé (stroke-dashoffset) */
    S+" .ps-pf-ring .ps-pf-arc{transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1) !important;}",
    S+" .ps-pf-bt-pct{position:absolute !important;inset:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;"+FT+"font-size:15px !important;font-weight:800 !important;color:#243B6B !important;letter-spacing:-.02em !important;}",
    S+" .ps-pf-bt-name{"+FT+"font-size:14.5px !important;font-weight:700 !important;color:#243B6B !important;line-height:1.25 !important;}",
    S+" .ps-pf-bt-sub{"+FT+"font-size:11.5px !important;font-weight:500 !important;color:#8A93A5 !important;margin-top:2px !important;}",
    S+" .ps-pf-go{display:flex !important;align-items:center !important;justify-content:center !important;gap:6px !important;"+FT+"font-size:12.5px !important;font-weight:700 !important;padding:9px 12px !important;border-radius:var(--ps-r-pill,999px) !important;background:var(--c,#507EC5) !important;color:#fff !important;text-decoration:none !important;border:0 !important;transition:filter .15s ease, transform .15s ease !important;}",
    S+" .ps-pf-go:hover{filter:brightness(1.09) !important;transform:translateY(-1px) !important;color:#fff !important;text-decoration:none !important;}",
    S+" .ps-pf-go::after{content:\"\\2192\" !important;font-size:14px !important;line-height:1 !important;}",
    /* fond neutre sous le board pour l'effet « tableau de bord » (1 ligne à retirer si Ziad préfère la bande bleue) */
    S+" section.learnworlds-section.ps-pf-dash{background:#F7F9FC !important;}",
    S+" .ps-pf-dash .learnworlds-section-overlay{display:none !important;}",
    /* 🔴 Le titre de section était BLANC (il vivait sur la bande bleue) : sur notre
       fond clair il devenait invisible. La règle globale `h1.learnworlds-heading`
       bat un sélecteur trop court — on remonte la spécificité (même piège que la
       home) avec section + :not(.learnworlds-icon). */
    S+" section.learnworlds-section.ps-pf-dash h1.learnworlds-heading:not(.learnworlds-icon),"
      +S+" section.learnworlds-section.ps-pf-dash h1.learnworlds-heading:not(.learnworlds-icon) *{color:#243B6B !important;}",

    /* ============ 2c) EN-TÊTE « dashboard » (avatar + identité + stats) ============
       L'en-tête natif (petit avatar centré + nom + bouton) faisait vide et perdu.
       On construit `.ps-pf-hero` (bandeau marine) et on MASQUE le natif de cette
       section. 🔴 Le bouton « Edit profile » est DÉPLACÉ dans notre en-tête, jamais
       recréé : il porte un handler LearnWorlds qu'on perdrait en le clonant. */
    S+" .ps-pf-heroed .learnworlds-section-content > *:not(.ps-pf-hero){display:none !important;}",
    S+" .ps-pf-hero{background:#243B6B !important;border-radius:20px !important;padding:30px 32px 26px !important;color:#fff !important;"+FT+"}",
    S+" .ps-pf-hero-row{display:flex !important;align-items:center !important;gap:22px !important;flex-wrap:wrap !important;}",
    S+" .ps-pf-av{width:92px !important;height:92px !important;border-radius:50% !important;background:var(--ps-accent,#507EC5) !important;display:flex !important;align-items:center !important;justify-content:center !important;font-size:32px !important;font-weight:800 !important;color:#fff !important;flex:none !important;box-shadow:0 0 0 4px rgba(255,255,255,.18) !important;overflow:hidden !important;animation:psPfIn .5s ease both !important;}",
    S+" .ps-pf-av img{width:100% !important;height:100% !important;object-fit:cover !important;border-radius:50% !important;}",
    S+" .ps-pf-id{min-width:0 !important;flex:1 1 260px !important;}",
    S+" .ps-pf-hname{"+FT+"font-size:27px !important;font-weight:800 !important;letter-spacing:-.02em !important;color:#fff !important;margin:0 0 4px !important;line-height:1.15 !important;animation:psPfIn .5s .05s ease both !important;}",
    S+" .ps-pf-hrole{"+FT+"font-size:13px !important;color:rgba(255,255,255,.72) !important;margin:0 0 12px !important;animation:psPfIn .5s .1s ease both !important;}",
    S+" .ps-pf-chips{display:flex !important;flex-wrap:wrap !important;gap:7px !important;}",
    S+" .ps-pf-chip{"+FT+"font-size:12px !important;font-weight:700 !important;padding:5px 13px !important;border-radius:var(--ps-r-pill,999px) !important;background:rgba(255,255,255,.14) !important;border:1px solid rgba(255,255,255,.16) !important;color:#fff !important;animation:psPfIn .5s ease both !important;}",
    S+" .ps-pf-chip.-hi{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;}",
    S+" .ps-pf-hero .ps-pf-edit{margin-left:auto !important;align-self:flex-start !important;flex:none !important;}",
    S+" .ps-pf-stats{display:flex !important;gap:12px !important;margin-top:20px !important;flex-wrap:wrap !important;}",
    /* 🔴🔴 LE BANDEAU SUR TÉLÉPHONE (08/08, capture de Ziad : « le cadre touche
       les bords, les trucs ne sont pas alignés »).
       Trois défauts, une seule cause : des valeurs pensées pour 1170 px.
       1. `margin:0` — sur grand écran ce sont les marges du conteneur
          LearnWorlds qui donnent l'air ; sur téléphone ce conteneur fait toute
          la largeur, donc notre carte **touche les deux bords** alors que le
          reste de la page respire. On lui donne ses propres marges.
       2. `.ps-pf-id{flex:1 1 260px}` : 260 px de base + l'avatar + l'écart ne
          tiennent pas dans 294 px utiles, l'identité passe donc sous l'avatar.
          On l'assume — mais en pleine largeur, pas en reliquat.
       3. `.ps-pf-edit{margin-left:auto}` : une fois seul sur sa ligne, ce
          `auto` le colle à DROITE, séparé de tout. C'est ce que montre la
          capture. Sur téléphone il prend la largeur, comme tout le reste.
       🔴 Rembourrage réduit aussi : 32 px de chaque côté sur un écran de 390,
       c'est 16 % de la largeur mangés par du vide. */
    "@media(max-width:768px){"+
      S+" .ps-pf-hero{margin-left:16px !important;margin-right:16px !important;padding:22px 18px 20px !important;}"+
      S+" .ps-pf-hero-row{gap:16px !important;}"+
      S+" .ps-pf-id{flex:1 1 100% !important;}"+
      S+" .ps-pf-hero .ps-pf-edit{margin-left:0 !important;width:100% !important;align-self:stretch !important;}"+
      S+" .ps-pf-stats{gap:10px !important;margin-top:16px !important;}"+
    "}",
    S+" .ps-pf-st{flex:1 1 130px !important;background:rgba(255,255,255,.09) !important;border:1px solid rgba(255,255,255,.12) !important;border-radius:13px !important;padding:12px 14px !important;animation:psPfIn .5s ease both !important;}",
    S+" .ps-pf-st b{display:block !important;"+FT+"font-size:21px !important;font-weight:800 !important;color:#fff !important;line-height:1.1 !important;}",
    S+" .ps-pf-st span{"+FT+"font-size:11.5px !important;color:rgba(255,255,255,.66) !important;}",
    "@keyframes psPfIn{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:none}}",
    "@keyframes psPfUp{from{opacity:0;transform:translateY(11px)}to{opacity:1;transform:none}}",

    /* ============ 3) titres de section ============ */
    /* On garde LEURS couleurs (rouge / vert / bleu) : c'est un choix éditorial
       de Ziad, pas un défaut. On n'unifie que la typo et la graisse. */
    S+" h2.learnworlds-subheading,"+S+" .ps-pf-h2{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;}",

    /* ============ 4) CARTES COURS (VUE GÉNÉRALE) ============ */
    /* Repris de course-cards.js, SANS carrousel ni chevrons.
       Scopé sous `.ps-pf-courses` (posé en JS) : la page a 4 grandpas. */
    S+" .ps-pf-courses > .lw-cols.multiple-rows{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:24px !important;background:transparent !important;border:0 !important;box-shadow:none !important;"+FT+"}",
    S+" .ps-pf-courses > .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .ps-pf-courses > .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    /* 🔴 masquage conditionné à [data-ps-pf] : une carte non reconstruite doit
       rester intacte. La liste des :not() doit inclure TOUT ce qu'on ajoute en
       enfant direct — l'illustration native comprise (elle a déjà été « mangée »
       deux fois sur course-cards.js). */
    /* Illustration native MASQUÉE (design « Option A » choisi par Ziad le 22/07 :
       cartes sobres SANS image stock). On retire `.learnworlds-image` de la liste
       des `:not()` -> tout le natif est masqué sauf notre `.ps-pfc`. */
    S+" .lw-course-card[data-ps-pf] > *:not(.ps-pfc){display:none !important;}",

    /* 🔴 `flex:1 1 auto` : la carte native est en `flex-direction:column` et
       répartit son espace libre. Sans ça, `.ps-pfc` s'arrête à son contenu et
       les cartes les moins remplies (pas de compteurs, pas de progression) le
       voyaient POUSSÉ VERS LE BAS : pastille à 514 contre 433 sur la carte
       complète, alors que les 3 cartes et leurs images font la même hauteur.
       En remplissant la hauteur, le contenu repart du haut et c'est le
       `margin-bottom:auto` du titre qui plaque le CTA en bas.
       (Même leçon que le `height:100%` de sector-cards.js.) */
    ".ps-pfc{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;padding:24px !important;}",
    ".ps-pfc-head{display:flex !important;flex-direction:row !important;flex-wrap:wrap !important;align-items:center !important;gap:8px !important;margin-bottom:16px !important;}",
    ".ps-pfc-tag{display:inline-flex !important;align-items:center !important;padding:5px 13px !important;border-radius:var(--ps-r-pill,999px) !important;"+FT+"font-size:14px !important;font-weight:800 !important;line-height:1.2 !important;background:var(--ps-accent-tint,#edf4ff) !important;color:var(--ps-accent-hover,#486798) !important;}",
    /* 🔴 couleur par NIVEAU (data-ps-lvl), JAMAIS par nth-child : sur la page
       Cours, les chevrons intercalés décalaient les positions et le cycle
       sautait. Même principe ici par cohérence. */
    ".ps-pfc-tag[data-ps-lvl='1']{background:var(--ps-accent-tint,#edf4ff) !important;color:var(--ps-accent-hover,#486798) !important;}",
    ".ps-pfc-tag[data-ps-lvl='2']{background:#E3F8EE !important;color:#00A063 !important;}",
    ".ps-pfc-tag[data-ps-lvl='3']{background:#FFF3E0 !important;color:#C77700 !important;}",
    ".ps-pfc-tag[data-ps-lvl='4']{background:#FDECEF !important;color:#D22B45 !important;}",
    ".ps-pfc-tag[data-ps-lvl='5']{background:#F3EAFB !important;color:#8A45C9 !important;}",
    ".ps-pfc-tag[data-ps-lvl='6']{background:#E6F1FD !important;color:#0073EA !important;}",
    ".ps-pfc-metas{display:flex !important;flex-wrap:wrap !important;gap:7px !important;}",
    ".ps-pfc-meta{display:inline-flex !important;align-items:center !important;padding:4px 11px !important;border-radius:var(--ps-r-pill,999px) !important;"+FT+"font-size:12px !important;font-weight:600 !important;background:#EEF1F6 !important;color:#4B5563 !important;}",
    ".ps-pfc-title{"+FT+"font-size:20px !important;font-weight:800 !important;line-height:1.25 !important;letter-spacing:-.015em !important;color:#243B6B !important;margin:0 0 auto !important;}",
    ".ps-pfc-prog-head{display:flex !important;align-items:baseline !important;justify-content:space-between !important;margin-top:18px !important;margin-bottom:7px !important;}",
    ".ps-pfc-prog-pct{"+FT+"font-size:13px !important;font-weight:700 !important;color:#243B6B !important;}",
    ".ps-pfc-prog-lbl{"+FT+"font-size:12px !important;font-weight:500 !important;color:#8A93A5 !important;}",
    ".ps-pfc-prog{height:var(--ps-pf-bar,8px) !important;border-radius:var(--ps-r-pill,999px) !important;background:#EEF1F6 !important;overflow:hidden !important;}",
    ".ps-pfc-prog-bar{height:100% !important;border-radius:var(--ps-r-pill,999px) !important;background:var(--ps-accent,#507EC5) !important;}",
    ".ps-pfc-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:14px !important;color:var(--ps-accent,#507EC5) !important;"+FT+"font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-pfc-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-pfc-link:hover{color:var(--ps-accent-hover,#486798) !important;}",
    ".ps-pfc-link:hover::after{transform:translateX(5px) !important;}",
    ".ps-pfc-link.ps-done{color:#00A063 !important;}",
    ".ps-pfc-link.ps-done::after{content:\"\\2713\" !important;}",

    /* ============ 5) CARTES THÉMATIQUES (Learning Program) ============ */
    /* Type `.lw-learning-program-card1` — jamais rencontré sur les autres
       pages du site. Restylé en CSS seulement : on ne reconstruit pas, LW y
       gère l'image, le badge "N Leçons" et la progression. */
    S+" .lw-learning-program-card{border-radius:var(--ps-r-card,16px) !important;overflow:hidden !important;box-shadow:none !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .lw-learning-program-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    S+" .lw-learning-program-card-cnt{border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;overflow:hidden !important;background:#fff !important;}",
    S+" .lw-learning-program-card .learnworlds-heading3{"+FT+"font-size:20px !important;font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",
    S+" .lw-learning-program-card-descr{"+FT+"font-size:14px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;}",
    /* le bouton bleu natif -> CTA violet du site */
    S+" .lw-learning-program-card button.learnworlds-button,"+S+" .lw-learning-program-card a.learnworlds-button{background:var(--ps-accent,#507EC5) !important;border:0 !important;border-radius:var(--ps-r-pill,999px) !important;"+FT+"font-size:15px !important;font-weight:600 !important;color:#fff !important;box-shadow:none !important;transition:background .18s ease !important;}",
    S+" .lw-learning-program-card button.learnworlds-button:hover,"+S+" .lw-learning-program-card a.learnworlds-button:hover{background:var(--ps-accent-hover,#486798) !important;}",

    /* ============ 6) barres de filtres ============ */
    /* Ces filtres sont des STATUTS (En cours / Terminé / …), pas des
       catégories : `filters.js` n'a rien à faire ici. On ne reprend que le
       style des pastilles.
       ⚠️ Jamais de `display` sur ces sélecteurs : LW masque les filtres
       désactivés par un `display:none` INLINE qu'un `!important` écraserait. */
    S+" .learnworlds-button.filter.text-only{display:inline-flex !important;align-items:center !important;height:40px !important;padding:0 16px !important;margin-right:8px !important;border-radius:var(--ps-r-pill,999px) !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;background:#fff !important;color:#4B5563 !important;"+FT+"font-size:14px !important;font-weight:600 !important;cursor:pointer !important;transition:all .15s ease !important;}",
    S+" .learnworlds-button.filter.text-only:hover{border-color:var(--ps-accent,#507EC5) !important;color:var(--ps-accent,#507EC5) !important;background:#F3F1FF !important;}",
    S+" .-search-box{display:inline-flex !important;align-items:center !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:12px !important;background:#fff !important;overflow:hidden !important;height:44px !important;}",
    S+" .-search-box input{border:0 !important;box-shadow:none !important;"+FT+"font-size:15px !important;background:transparent !important;}",
    S+" .-search-box button{border:0 !important;box-shadow:none !important;background:transparent !important;}",

    "@media(max-width:1040px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:700px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}",

    /* Catalogue de collecte (cf. cacherCatalogue) : sorti de l'écran, PAS
       `display:none`. LearnWorlds construit ses cartes en JS et rien ne garantit
       qu'il le fasse dans un bloc jamais affiché — hors écran, il est rendu
       normalement et le collecteur peut lire les barres. Hauteur 1px pour ne pas
       créer de barre de défilement. */
    ".ps-pf-cat-off{position:absolute !important;left:-9999px !important;top:0 !important;width:1200px !important;height:1px !important;overflow:hidden !important;pointer-events:none !important;}"
  ].join("\n");

  /* Posée depuis build(), donc APRÈS le garde : le CSS est scopé `#pageContent`
     et non `body.slug-profile`, il ne doit pas atterrir sur une autre page si
     la balise venait à être posée ailleurs. */
  function styles(){
    var st=document.getElementById("ps-profile-style");
    if(!st){ st=document.createElement("style"); st.id="ps-profile-style"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==CSS) st.textContent=CSS;
  }

  /* ---- Catalogue de COLLECTE, masqué (30/07) ------------------------------
     🔴 À QUOI SERT L'ÉLÉMENT « Cours » AJOUTÉ SUR /profile : il n'est PAS là pour
     être lu. Il existe pour que le collecteur de `tokens.js` voie TOUT le
     catalogue en une seule visite — mesuré : **59 cours d'un coup**, contre 10 sur
     la page Cours — et dépose donc la progression complète du membre. Sans lui, un
     membre qui ne navigue pas voyait 8 tuiles sur 11 à « — ».
     🔴 HORS ÉCRAN ET NON `display:none` : la largeur des barres est lue en style
     INLINE, donc `display:none` suffirait en théorie — mais LearnWorlds construit
     ses cartes en JS et rien ne garantit qu'il le fasse dans un bloc jamais
     affiché. Hors écran, il est rendu normalement.
     Masqué aussi aux lecteurs d'écran : 59 cartes annoncées après le tableau de
     bord seraient une nuisance.
     🔴 On ne touche JAMAIS la section du tableau de bord (test explicite).
     Échappatoire : `window.PS_PROFILE_CATALOGUE_VISIBLE = true` le laisse visible. */
  function cacherCatalogue(){
    if(window.PS_PROFILE_CATALOGUE_VISIBLE) return;
    document.querySelectorAll(S+" section").forEach(function(sec){
      if(sec.classList.contains("ps-pf-cat-off")) return;          // déjà traité
      if(!sec.querySelector(".lw-course-card")) return;            // rien à masquer
      if(sec.querySelector(".ps-pf-board,.ps-pf-tiles,.ps-pf-hero")) return;
      sec.classList.add("ps-pf-cat-off");
      sec.setAttribute("aria-hidden","true");
    });
  }

  /* ---- compteurs "Leçons : 8 # Quiz : 3", repris de course-cards.js ---- */
  var META=["Leçons","Lecons","Quiz"];
  function parseMeta(desc){
    var re=new RegExp("("+META.join("|")+")\\s*:\\s*","gi"), m, ms=[];
    while((m=re.exec(desc))!==null){ ms.push({label:m[1], vs:re.lastIndex, start:m.index}); }
    var out=[];
    for(var i=0;i<ms.length;i++){
      var end=(i+1<ms.length)?ms[i+1].start:desc.length;
      var v=desc.slice(ms[i].vs,end).replace(/^[#\s]+/,"").replace(/[\s,;|#]+$/,"").trim();
      if(v) out.push({label:ms[i].label, value:v});
    }
    return out;
  }
  function metaText(label,value){
    var l=label.toLowerCase();
    if(/^le[çc]ons?$/.test(l)) l = (value==="1" ? "leçon" : "leçons");
    return value+" "+l;
  }

  /* Repère les grandpas par leur CONTENU, pas par leur position : la page en a
     4 et leur ordre pourrait changer si Ziad réorganise les sections. */
  function marquer(){
    document.querySelectorAll(S+" .cards-grandpa").forEach(function(gp){
      if(gp.querySelector(".lw-course-card")) gp.classList.add("ps-pf-courses");
      else if(!gp.querySelector(".lw-learning-program-card") && /Le[çc]ons|Heures|Publications/.test(gp.textContent||"")) gp.classList.add("ps-pf-tiles");
    });
    /* le bouton "Edit profile" : marqué en JS, aucun sélecteur natif ne le
       distingue des autres `.learnworlds-button` de la page. */
    var sec=document.querySelector(S+" img.user-image");
    sec=sec && sec.closest("section.learnworlds-section");
    if(sec) sec.querySelectorAll("button.learnworlds-button").forEach(function(b){ b.classList.add("ps-pf-edit"); });
  }

  /* ---- Board "progression par domaine" (remplace les 4 tuiles du RÉSUMÉ) ---- */
  var BOARD_ICON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/></svg>';

  /* Libellés raccourcis (validés par Ziad) : on retire les préfixes verbeux. */
  function domainLabel(t){
    t=(t||"").replace(/\s+/g," ").trim();
    t=t.replace(/^Module de Formation\s*[-–—:]\s*/i,"");
    t=t.replace(/^Tout Savoir sur\s+(les?\s+|l['’]\s*)?/i,"");
    t=t.replace(/[\s\-–—:(\[]+EN[)\]]?\s*$/i,"");   // le suffixe de langue n'a rien à faire à l'écran
    return t;
  }

  /* ---- Langue du tableau de progression ----
     🔴 Le tableau ignorait TOTALEMENT la langue : il affichait les programmes
     français ET anglais ensemble, dans les deux langues (signalé par Ziad).
     Convention du site : un programme anglais se nomme « … - EN » (un programme
     n'a pas de catégorie, contrairement à un cours — cf. tokens.js).
     🔴 Le test se fait sur le nom BRUT, avant domainLabel() qui retire justement
     ce suffixe. */
  /* 🔴 Le suffixe de langue n'est PAS toujours « - EN » : le programme de Ziad
     s'appelle « Module de Formation - Conseil en Stratégie EN » (espace, sans
     tiret). On accepte donc espace, tiret, deux-points, parenthèses/crochets. */
  var RE_EN=/(?:^|[\s\-–—:(\[])EN[)\]]?\s*$/i;
  function progEN(nom){ return RE_EN.test(String(nom||"").trim()); }

  function langueCourante(){
    var W=window.Weglot;
    var from=(W && W.options && W.options.language_from) || "fr";
    var lang=(W && W.initialized && W.getCurrentLang) ? W.getCurrentLang() : from;
    return { lang:lang, from:from, enAnglais:(lang!==from) };
  }

  /* % d'un programme thématique : d'abord la largeur inline d'un remplissage
     dans son bloc de progression, sinon le texte "N %". */
  function programPct(card){
    var box=card.querySelector("[class*='progress']")||card;
    var els=box.querySelectorAll("*");
    for(var i=0;i<els.length;i++){
      var w=els[i].style && els[i].style.width;
      if(w && /^\d+(\.\d+)?%$/.test(w)){ var n=parseFloat(w); if(n>0) return Math.min(100,Math.round(n)); }
    }
    var m=(box.textContent||"").match(/(\d+)\s*%/);
    return m ? Math.min(100,parseInt(m[1],10)) : 0;
  }

  /* ---- Source des domaines : page, mémoire locale, puis Worker ----
     🔴 HISTORIQUE : le board recopiait la section « Vue par thématique ». Ziad
     l'ayant retirée de la page, il n'y avait plus AUCUNE donnée (0 carte) et le
     board disparaissait. On ne dépend donc plus du widget :
       1. `me.userLearningPrograms` (global LearnWorlds du membre connecté) donne
          la LISTE de ses programmes INSTANTANÉMENT, sans réseau → les tuiles
          s'affichent tout de suite, avec leur nom.
       2. Le dernier résultat connu est gardé en mémoire locale → au retour sur la
          page, les % s'affichent instantanément (puis sont rafraîchis).
       3. Le Worker (/lp) calcule le vrai % par programme (moyenne des cours du
          programme où le membre est inscrit) et met tout à jour.
     🔴 L'identifiant vient de `me.id` : la résolution par e-mail côté Worker
     tombait sur le MAUVAIS compte (LearnWorlds ignore un filtre inconnu et
     renvoie le premier utilisateur de l'école). */
  /* ---- Domaine -> page du site + couleur ----
     🔴 Le bouton « Continuer » mène à LA PAGE du domaine, PAS à une URL de lecteur
     fabriquée : le lien natif d'un programme est `/path-player?courseid=<X>&
     learningProgramId=<Y>` et exige un courseid PRÉCIS (la leçon où reprendre),
     qu'on ne connaît pas — une URL lecteur incomplète rend une PAGE BLANCHE.
     Couleur = celle de la page (cf. PAGE_ACCENTS de tokens.js) pour que chaque
     tuile rappelle sa section. Ajouter/changer un domaine = 1 ligne ici.
     Clé = l'id du programme LearnWorlds (bundle id). */
  /* 🔴 MAJ 30/07 — DEUX SLUGS ONT CHANGÉ CÔTÉ SITE, tous les liens ci-dessous
     étaient donc morts ou faux : Cours `empty` -> `formation-par-modules`, et
     Compétences `page-introduction` -> `formation-par-comptences`. Vérifié en
     direct : `/page-introduction` renvoie une PAGE D'ERREUR, et la vraie page
     Cours est `formation-par-modules` (`/courses` est une page « A SUPPRIMER »).
     Les boutons « Continuer » des tuiles envoyaient donc l'étudiant dans le mur.
     🔴🔴 MAJ 04/08 — ET ÇA A RECOMMENCÉ, DEUX FOIS : Compétences
     `formation-par-comptences` -> **`formation-par-thematiques`** et Études de cas
     `emptykk-clone-clone` -> **`etudes-cas`**, les deux en 404 au moment où on l'a
     découvert. C'est le quatrième renommage silencieux en une semaine ; les mêmes
     boutons « Continuer » renvoyaient donc à nouveau dans le mur.
     ⚠️ Ne pas réécrire les anciens noms de ce commentaire : ils datent CHAQUE
     étape. Une recherche-remplacement globale les a déjà aplatis une fois, ce qui
     transformait l'historique en un état présent faux. */
  var PROG_PAGES={
    "introduction-conseil-strategie":                    {url:"/formation-par-modules",    col:"#507EC5"},
    "module-de-formation-les-autres-types-de-conseil":   {url:"/formation-par-modules",    col:"#507EC5"},
    "introduction":                                      {url:"/formation-par-thematiques", col:"#243B6B"},
    "fit":                                               {url:"/formation-par-thematiques", col:"#243B6B"},
    "mathematiques":                                     {url:"/formation-par-thematiques", col:"#243B6B"},
    "etudes-de-cas":                                     {url:"/etudes-cas",      col:"#6B7280"},
    "etudes-de-cas2":                                    {url:"/etudes-cas",      col:"#6B7280"},
    "fiches-secteurs":                                   {url:"/fiches-secteur",           col:"#C9A227"},
    "fiches-cabinet-and-tests-en-ligne":                 {url:"/fiches-cabinet",     col:"#007260"},
    "s-entrainer":                                       {url:"/sentrainer",               col:"#3887B4"}
  };
  /* 🔴 PARCOURS INCONNU : AUCUNE page, donc section « Autres » (30/07).
     Avant, le repli pointait sur Compétences — c'est ce qui faisait apparaître
     « Webinars PrepaStrat » dans cette section alors qu'il n'est sur AUCUNE page
     du site (signalé par Ziad). Inventer un rangement est pire que d'assumer
     qu'on ne sait pas : `url` vide ⇒ `labelPage()` renvoie « Autres » et la
     section se range en dernier. */
  var PROG_FALLBACK={url:"", col:"#507EC5"};

  /* 🔴🔴 SECONDE CLÉ : LE NOM DU PROGRAMME (bug signalé le 29/07 sur un compte
     élève — les 12 parcours tombaient TOUS dans « Compétences »).
     Cause : `PROG_PAGES` est indexé par le slug du programme, qui n'est servi que
     par le Worker `/lp`. La source INSTANTANÉE `me.userLearningPrograms` donne,
     elle, des **id hexadécimaux** (`6a27ca91…`) qui ne matchent aucune clé —
     donc repli sur la page « Nos formations » pour tout le monde. Le compte admin ne
     le voyait pas : son `localStorage` gardait déjà la réponse du Worker.
     Parade : à défaut d'id connu, on apparie sur le NOM normalisé (minuscules,
     sans accents ni ponctuation), qui est disponible dans les TROIS sources.
     Ajouter un programme = 1 ligne ici (et non plus une par identifiant). */
  /* 🔴🔴 UNE SEULE SOURCE DE COULEURS. Cette table etait ecrite en dur et
     DESYNCHRONISEE de celle du site : elle disait encore #507EC5 pour Cours alors
     que la page etait passee au rouge, et #C9A227 pour Fiches secteur au lieu du
     jaune choisi. Les boutons du board affichaient donc des couleurs que plus
     aucune page ne portait — deux verites pour la meme chose, exactement ce qu'on
     passe la journee a supprimer ailleurs.
     Elle lit desormais `PS_PAGE_ACCENTS`, publie par tokens.js : regler la couleur
     d'une page dans le configurateur repeint son bouton ici, sans double saisie.
     🔴 Les valeurs ci-dessous ne servent plus que de REPLI, pour les pages qui
     n'ont pas de couleur propre (S'entrainer, Competences en portent une ici
     depuis longtemps, il serait brutal de la leur retirer). */
  var PAGE_COL_DEFAUT={
    "/formation-par-modules":    "#507EC5",
    "/fiches-cabinet":           "#007260",
    "/fiches-secteur":           "#C9A227",
    "/etudes-cas":      "#6B7280",
    "/formation-par-thematiques": "#243B6B",
    "/sentrainer":               "#3887B4"
  };
  var PAGE_COL=(function(){
    var t={}, pub=window.PS_PAGE_ACCENTS||{};
    Object.keys(PAGE_COL_DEFAUT).forEach(function(u){ t[u]=PAGE_COL_DEFAUT[u]; });
    Object.keys(pub).forEach(function(slug){ if(pub[slug]) t["/"+slug]=pub[slug]; });
    return t;
  })();
  var PROG_NOMS={
    "conseilenstrategie":        "/formation-par-modules",
    "lesautrestypesdeconseil":   "/formation-par-modules",
    "fichescabinettestsenligne": "/fiches-cabinet",
    "fichessecteurs":            "/fiches-secteur",
    "etudesdecas":               "/etudes-cas",
    "businesssense":             "/formation-par-thematiques",
    "fit":                       "/formation-par-thematiques",
    "mathematiques":             "/formation-par-thematiques",
    /* 🔴 « Webinars PrepaStrat » RETIRÉ de cette table : il n'a de carte sur AUCUNE
       page du site, cette ligne le rangeait donc faussement dans Compétences.
       Sans elle, il tombe dans « Autres » — et il rejoindra sa vraie section tout
       seul le jour où il apparaîtra quelque part. */
    "sentrainer":                "/sentrainer"
  };
  /* ---- Parcours RETIRÉS du tableau de bord (demande de Ziad, 30/07) ---------
     « Tout Savoir sur les Études de Cas » : il vit en réalité sur la page
     Compétences (vérifié : c'est l'une des 4 cartes de programme de cette page),
     et comme `domainLabel()` lui retire son préfixe il se retrouvait rangé à côté
     de « ETUDES DE CAS » — deux tuiles côte à côte pointant vers la même page.
     « S'entraîner » : retiré du tableau à la demande de Ziad.
     🔴🔴 ON FILTRE SUR LE NOM BRUT, JAMAIS SUR LE LIBELLÉ NETTOYÉ : après
     `domainLabel()`, « Tout Savoir sur les Études de Cas » et « ETUDES DE CAS »
     portent le MÊME libellé (« Études de Cas ») — filtrer là-dessus supprimerait
     les DEUX, alors que le second doit rester. Le nom brut les distingue.
     Ajouter une exclusion = 1 ligne (nom brut normalisé : minuscules, sans
     accents ni ponctuation). */
  var PROG_EXCLUS={
    /* 🔴 « Tout Savoir sur les Études de Cas » N'EST PLUS EXCLU (30/07). Il l'avait
       été parce qu'il s'affichait en doublon à côté de « ETUDES DE CAS » — mais
       c'était un symptôme, pas la maladie : il vit en réalité sur la page
       Compétences, et c'est notre table écrite à la main qui le rangeait au mauvais
       endroit. Le rangement vient désormais de la page RÉELLEMENT observée, donc
       il retrouve sa place et n'est plus un doublon. */
    "sentrainer":                  1
  };
  function progExclu(p){
    if(!p) return false;
    if(PROG_EXCLUS[normProg(p.raw||"")]) return true;
    /* Repli quand le nom brut n'est pas disponible. Sans risque ici : le libellé
       nettoyé de « Tout Savoir… » est « Études de Cas », qui n'est PAS dans la
       table — donc « ETUDES DE CAS » ne peut pas être emporté par ce repli. */
    return !!PROG_EXCLUS[normProg(p.name||"")];
  }

  function normProg(s){
    return String(s||"").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g,"")   // accents
      .replace(/[^a-z0-9]/g,"");                          // espaces, &, apostrophes, tirets
  }
  /* 🔴🔴 LA PAGE OBSERVÉE PASSE AVANT TOUT (30/07). Les deux tables ci-dessus sont
     écrites À LA MAIN et avaient dérivé du contenu réel : « Tout Savoir sur les
     Études de Cas » est un élément de la page Compétences mais était rangé dans
     Études de cas, et « Webinars PrepaStrat » n'est sur AUCUNE page mais
     s'affichait quand même dans Compétences. Signalé par Ziad.
     Le Worker renvoie désormais `page` : la page où une carte de ce parcours a été
     RÉELLEMENT vue, relevée par le collecteur au fil des visites. Les tables ne
     servent plus que de repli, le temps qu'une page soit visitée au moins une fois.
     🔴 Plus de repli inventé : un parcours sans page connue et absent des tables
     tombe dans « Autres » plutôt que d'être affiché dans une section où il n'est
     pas. Mieux vaut « Autres » qu'un rangement faux. */
  function progPage(id, nom, brut, page){
    if(page) return {url:page, col:PAGE_COL[page]||PROG_FALLBACK.col};
    if(id && PROG_PAGES[id]) return PROG_PAGES[id];
    var u=PROG_NOMS[normProg(nom)] || PROG_NOMS[normProg(brut)];
    if(u) return {url:u, col:PAGE_COL[u]||PROG_FALLBACK.col};
    return PROG_FALLBACK;
  }

  /* 🔴 « Continuer » doit mener à la page de LA LANGUE COURANTE (03/08). Sinon
     un étudiant anglophone repart de son profil vers la page française.
     La table des jumelles vit dans `tokens.js` (`PS_PAGES_EN`) : un seul endroit
     à tenir à jour pour tout le site. Une page sans jumelle garde son URL.
     🔴 Appliqué UNIQUEMENT au lien sortant, jamais à la clé de regroupement :
     les sections du board doivent rester les mêmes dans les deux langues, sinon
     une même page se dédoublerait en deux sections selon la langue. */
  function urlLangue(u){
    var t=window.PS_PAGES_EN;
    if(!t || !u) return u;
    var lang=""; try{ lang=window.Weglot.getCurrentLang(); }catch(e){}
    if(!lang){ try{ lang=localStorage.getItem("wglang")||""; }catch(e){} }
    if(lang!=="en") return u;
    var cible=t[u.replace(/^\//,"")];
    return cible ? "/"+cible : u;
  }

  /* ---- Regroupement du tableau PAR PAGE DU SITE (demande de Ziad, 29/07) ----
     Avant : une liste plate de 10 tuiles, une par programme LearnWorlds — le
     membre ne voyait pas à quelle PAGE du site chaque progression correspondait.
     Maintenant : une section par page, et les programmes de cette page dedans.
     🔴 Le regroupement se fait sur l'URL rendue par `progPage()`, pas sur le nom
     du programme : c'est la même source que le bouton « Continuer » de la tuile,
     donc une tuile est TOUJOURS dans la section vers laquelle elle pointe (rien
     ne peut diverger).
     La page Cours en a naturellement DEUX (« Conseil en Stratégie » et « Les
     autres types de Conseil »), ce qui est exactement ce que Ziad voulait voir.
     🔴 Ajouter une page = 1 ligne dans PAGE_LABELS **et** 1 dans PAGE_ORDRE ; une
     page absente de ces tables tombe dans « Autres » (plus jamais de tuile
     perdue). Les pages sans aucun programme ne s'affichent pas du tout. */
  var PAGE_LABELS={
    "/formation-par-modules":    "Cours",
    "/fiches-cabinet":     "Fiches cabinet",
    "/fiches-secteur":           "Fiches secteur",
    "/etudes-cas":      "Études de cas",
    "/formation-par-thematiques": "Compétences",
    "/sentrainer":               "S'entraîner"
  };
  /* Ordre d'affichage voulu par Ziad : Cours, Cabinet, Secteur, Études de cas,
     puis le reste. */
  var PAGE_ORDRE=["/formation-par-modules","/fiches-cabinet","/fiches-secteur","/etudes-cas","/formation-par-thematiques","/sentrainer"];
  function rangPage(u){ var i=PAGE_ORDRE.indexOf(u); return i<0 ? 99 : i; }
  function labelPage(u){ return PAGE_LABELS[u] || "Autres"; }

  /* ====================================================================
     BANDEAU DE GRADE (gamification) — en tête du tableau
     --------------------------------------------------------------------
     Demande de Ziad (29/07) : au-dessus des sections, un bandeau qui félicite
     le membre et lui donne un GRADE selon son avancement global.
     Échelle retenue (choix de Ziad) : la CARRIÈRE EN CONSEIL — c'est la promesse
     du site (« intégrez les meilleurs cabinets »), donc le grade raconte ce que
     l'étudiant vient chercher. Changer un palier ou un libellé = 1 ligne ici.
     🔴 Les seuils sont des MINIMA, dans l'ordre croissant : `gradeDe()` prend le
     dernier atteint. Ne pas les désordonner. */
  /* 🔴 CES VALEURS NE SONT QU'UN REPLI. Depuis le 05/08, l'échelle se règle
     depuis le SITE BUILDER, comme les tarifs de `/formules` : Ziad doit pouvoir
     renommer un grade ou déplacer un palier sans moi. Les noms ci-dessous
     reprennent les 6 niveaux du MOOC, qu'il a demandés le 05/08. */
  var GRADES=[
    {min:0,  nom:"Junior",            mot:"Votre préparation démarre. Chaque module compte."},
    {min:10, nom:"Consultant",        mot:"Les bases sont posées, continuez sur cette lancée."},
    {min:25, nom:"Manager",           mot:"Beau parcours, vous tenez le rythme."},
    {min:45, nom:"Principal",         mot:"Vous maîtrisez l'essentiel, la marche suivante est proche."},
    {min:65, nom:"Partner",           mot:"Excellent niveau, les entretiens exigeants sont à votre portée."},
    {min:85, nom:"PrepaStrat Master", mot:"Parcours complet : vous avez de quoi viser les meilleurs cabinets."}
  ];

  /* ====================================================================
     L'ÉCHELLE SE RÈGLE DEPUIS LE SITE BUILDER  (05/08, demande de Ziad)
     --------------------------------------------------------------------
     Même convention que `/formules` : des lignes `clé : valeur` dans un bloc de
     texte normal de la page. Une clé mal orthographiée garde simplement le
     repli — le pire cas est « ma correction n'apparaît pas », jamais « la page
     affiche autre chose ».

     grade1-nom : Junior
     grade1-seuil : 0
     grade1-mot : Votre préparation démarre.

     🔴 NI `innerText` NI `textContent` pour lire le bloc. `innerText` rend une
     chaîne VIDE sur un élément masqué — or on masque justement ce bloc — et
     `textContent` avale les retours à la ligne, or on découpe en lignes. On lit
     donc le HTML en rétablissant les sauts. Ce piège a déjà coûté deux fois
     aujourd'hui : `abonnement.js` sur une section masquée, et la page de
     vérification où notre propre anti-flash cachait l'adresse à notre lecture.

     🔴 ON TRIE PAR SEUIL. L'ancien commentaire disait « ne pas les
     désordonner » — une consigne tenable dans un fichier relu par moi, pas dans
     un champ de texte édité à la main entre deux réunions. Le tri rend
     l'ordre de saisie sans importance.

     🔴 UN GRADE SANS NOM EST IGNORÉ, et un seuil illisible aussi : mieux vaut
     une échelle amputée d'un palier qu'un grade « undefined » sur le profil
     d'un étudiant. Si RIEN n'est exploitable, on garde l'échelle par défaut.
     ==================================================================== */
  function texteDeBloc(el){
    var h=(el&&el.innerHTML)||"";
    h=h.replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|div|li|h[1-6]|section)>/gi,"\n");
    var tmp=document.createElement("div"); tmp.innerHTML=h;
    return tmp.textContent||"";
  }

  /* Pure et testable : c'est elle qui décide de l'échelle affichée. */
  function lireGrades(texte){
    var par={}, vus={};
    String(texte||"").split(/\r?\n/).forEach(function(ligne){
      var m=ligne.match(/^\s*grade\s*(\d{1,2})\s*-\s*(nom|seuil|mot)\s*:\s*(\S.*?)\s*$/i);
      if(!m) return;
      var i=m[1];
      (par[i]=par[i]||{})[m[2].toLowerCase()]=m[3];
      vus[i]=1;
    });
    var out=[];
    Object.keys(vus).forEach(function(i){
      var g=par[i];
      if(!g.nom) return;                                  /* sans nom, on n'invente pas */
      var s=parseFloat(String(g.seuil==null?"":g.seuil).replace(",","."));
      if(!isFinite(s)) return;                            /* seuil illisible : on saute */
      out.push({min:Math.max(0,Math.min(100,s)), nom:g.nom, mot:g.mot||""});
    });
    out.sort(function(a,b){ return a.min-b.min; });
    return out;
  }

  /* Cherche les réglages dans la page, applique s'il y en a, et MASQUE le bloc.
     🔴 Masquer est indispensable : sans ça chaque étudiant lirait
     « grade1-nom : Junior » en clair sur son profil. C'est la même règle que le
     bloc de tarifs de `/formules`, et pour la même raison. */
  function appliquerGradesDuBuilder(){
    var hote=document.getElementById("pageContent");
    if(!hote) return false;
    var blocs=hote.querySelectorAll(".learnworlds-main-text, .learnworlds-element");
    for(var i=0;i<blocs.length;i++){
      var t=texteDeBloc(blocs[i]);
      if(!/grade\s*\d{1,2}\s*-\s*nom\s*:/i.test(t)) continue;
      var lus=lireGrades(t);
      /* Le bloc est masqué même si la lecture échoue : il ne doit JAMAIS
         s'afficher, et un réglage illisible se voit en console, pas à l'écran. */
      blocs[i].style.setProperty("display","none","important");
      if(lus.length>=2){ GRADES=lus; return true; }
      try{ console.warn("[PrepaStrat] /profile : bloc de grades trouvé mais "+lus.length+
        " palier(s) exploitable(s) — échelle par défaut conservée. Chaque grade demande "+
        "au moins `gradeN-nom` et `gradeN-seuil`."); }catch(e){}
      return false;
    }
    return false;
  }
  function gradeDe(pct){
    var g=GRADES[0], suivant=null;
    for(var i=0;i<GRADES.length;i++){
      if(pct>=GRADES[i].min){ g=GRADES[i]; suivant=GRADES[i+1]||null; }
    }
    return {actuel:g, suivant:suivant};
  }

  /* % global = moyenne PONDÉRÉE PAR LE NOMBRE DE COURS (choix de Ziad) : un
     parcours de 10 cours doit peser plus qu'un parcours d'1 cours, sinon finir
     un tout petit parcours ferait bondir la jauge autant qu'un gros.
     🔴 Repli sur la moyenne simple quand aucun parcours ne connaît son nombre de
     cours — c'est le cas de la source `me.userLearningPrograms` (affichage
     instantané, avant la réponse du Worker) : sans ce repli, le bandeau
     resterait vide à la 1re visite. */
  function pctGlobal(progs){
    var somPond=0, nbCours=0, som=0, n=0;
    progs.forEach(function(p){
      if(typeof p.pct!=="number" || !isFinite(p.pct)) return;
      var v=Math.max(0,Math.min(100,p.pct));
      n++; som+=v;
      var c=(typeof p.courses==="number" && p.courses>0) ? p.courses : 0;
      if(c){ somPond+=v*c; nbCours+=c; }
    });
    if(nbCours) return Math.round(somPond/nbCours);
    return n ? Math.round(som/n) : null;
  }

  var MEDAILLE='<circle cx="12" cy="9" r="6"/><path d="M8.5 14.6 L7 22 l5-2.9 5 2.9 -1.5-7.4"/>';
  var SABLIER='<path d="M6 2h12M6 22h12M8 2v4a4 4 0 0 0 4 4 4 4 0 0 0 4-4V2M8 22v-4a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4"/>';

  /* ====================================================================
     BANDEAU D'ATTENTE — jamais de tuiles vides sans explication
     --------------------------------------------------------------------
     Demande de Ziad (29/07) : « mets un message type revenez plus tard, profil
     en cours de mise à jour, pour que les étudiants n'arrivent pas sur une page
     sans pourcentage ». Le cas est réel : le calcul de progression passe par le
     Worker, qui peut être long (l'API LearnWorlds plafonne à 30 requêtes/10 s)
     voire échouer quand le membre est inscrit à TOUT le catalogue.
     Le bandeau prend la place du bandeau de grade tant qu'aucun % n'est connu,
     et disparaît de lui-même dès que les chiffres arrivent (mountBoard est
     rappelé par lpFetch).
     🔴 Deux états distincts : tant que ça calcule on rassure (« dans quelques
     instants »), au-delà de LP_DELAI_MAX ou en cas d'erreur on invite à revenir
     — mentir sur un calcul mort ferait attendre l'étudiant pour rien. */
  function buildAttente(){
    var echec=(lpEtat==="echec");
    var box=document.createElement("div");
    box.className="ps-pf-wait"+(echec?" ps-pf-wait-ko":"");

    var ic=document.createElement("div"); ic.className="ps-pf-wait-ic";
    var NS="http://www.w3.org/2000/svg";
    var svg=document.createElementNS(NS,"svg");
    svg.setAttribute("viewBox","0 0 24 24"); svg.setAttribute("width","26"); svg.setAttribute("height","26");
    svg.setAttribute("fill","none"); svg.setAttribute("stroke","currentColor");
    svg.setAttribute("stroke-width","1.7"); svg.setAttribute("stroke-linecap","round"); svg.setAttribute("stroke-linejoin","round");
    var tmp=document.createElementNS(NS,"g");
    tmp.innerHTML=SABLIER;
    while(tmp.firstChild) svg.appendChild(tmp.firstChild);
    ic.appendChild(svg);
    box.appendChild(ic);

    var txt=document.createElement("div"); txt.className="ps-pf-wait-txt";
    var t=document.createElement("div"); t.className="ps-pf-wait-t";
    t.textContent = echec ? "Profil en cours de mise à jour"
                          : "Calcul de votre progression…";
    txt.appendChild(t);
    var x=document.createElement("div"); x.className="ps-pf-wait-x";
    x.textContent = echec
      ? "Vos pourcentages ne sont pas disponibles pour le moment. Revenez dans quelques minutes : vos parcours et vos accès, eux, sont bien actifs."
      : "Vos pourcentages s'affichent dans quelques instants. Vous pouvez commencer un parcours sans attendre.";
    txt.appendChild(x);
    box.appendChild(txt);
    return box;
  }

  /* Le bandeau n'est construit QUE si le % global est connu : afficher
     « Candidat 0 % » pendant que le Worker répond serait un faux message
     décourageant (et il changerait sous les yeux du membre). */
  function buildRank(progs){
    var pct=pctGlobal(progs);
    if(pct===null) return null;
    var g=gradeDe(pct);

    var box=document.createElement("div"); box.className="ps-pf-rank";

    var med=document.createElement("div"); med.className="ps-pf-rank-med";
    var NS="http://www.w3.org/2000/svg";
    var svg=document.createElementNS(NS,"svg");
    svg.setAttribute("viewBox","0 0 24 24"); svg.setAttribute("width","36"); svg.setAttribute("height","36");
    svg.setAttribute("fill","none"); svg.setAttribute("stroke","#fff");
    svg.setAttribute("stroke-width","1.7"); svg.setAttribute("stroke-linecap","round"); svg.setAttribute("stroke-linejoin","round");
    /* innerHTML sur du SVG ne construit pas toujours les bons noeuds : on passe
       par un conteneur SVG temporaire parsé en XML (même précaution que l'anneau). */
    var tmp=document.createElementNS(NS,"g");
    tmp.innerHTML=MEDAILLE;
    while(tmp.firstChild) svg.appendChild(tmp.firstChild);
    med.appendChild(svg);
    box.appendChild(med);

    var txt=document.createElement("div"); txt.className="ps-pf-rank-txt";
    var ov=document.createElement("div"); ov.className="ps-pf-rank-over"; ov.textContent="Votre grade";
    txt.appendChild(ov);
    var nm=document.createElement("div"); nm.className="ps-pf-rank-name"; nm.textContent=g.actuel.nom;
    txt.appendChild(nm);
    var ms=document.createElement("div"); ms.className="ps-pf-rank-msg";
    ms.textContent = g.suivant
      ? (g.actuel.mot+" Encore "+Math.max(1,g.suivant.min-pct)+" % pour devenir "+g.suivant.nom.toLowerCase()+".")
      : g.actuel.mot;
    txt.appendChild(ms);
    var bar=document.createElement("div"); bar.className="ps-pf-rank-bar";
    var fill=document.createElement("i"); fill.className="ps-pf-rank-fill";
    bar.appendChild(fill); txt.appendChild(bar);
    box.appendChild(txt);

    var right=document.createElement("div"); right.className="ps-pf-rank-r";
    var big=document.createElement("div"); big.className="ps-pf-rank-pct"; big.textContent=pct+" %";
    right.appendChild(big);
    var lbl=document.createElement("div"); lbl.className="ps-pf-rank-lbl"; lbl.textContent="global";
    right.appendChild(lbl);
    box.appendChild(right);

    /* largeur posée après insertion, sinon pas de transition (même raison que
       les anneaux des tuiles) */
    /* 🔴 setProperty(...,"important") et NON `style.width=` : la règle CSS pose
       `width:0 !important`, qui bat un style inline ordinaire — la barre restait
       donc vide (mesuré : inline 29%, calculé 0px). */
    setTimeout(function(){ fill.style.setProperty("width", Math.max(2,pct)+"%", "important"); }, 260);
    return box;
  }

  var LP_ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/";
  /* Clé de site Turnstile : PUBLIQUE par nature (c'est la clé secrète, côté
     Worker, qui valide). Même clé que l'annuaire et /account.
     🔴 Ne JAMAIS mettre ici une clé de service qui contourne Turnstile : ce
     dépôt est PUBLIC, tout ce qui y est écrit est lisible par n'importe qui. */
  var LP_SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";
  /* 🔴 CLÉ PAR MEMBRE (30/07). Avant, la clé était `psLpProgress` tout court :
     sur un poste partagé — une salle informatique, un ordinateur familial — le
     membre suivant voyait brièvement les POURCENTAGES DU PRÉCÉDENT, le temps que
     le Worker réponde. Constaté en changeant de compte dans le même navigateur.
     On suffixe donc par l'identifiant du membre. Repli sans suffixe uniquement si
     `me` n'est pas encore là, auquel cas on n'écrit rien (cf. lpStoreKey). */
  var LP_STORE_BASE="psLpProgress";
  /* 🔴 VERSION DES VALEURS MISES EN CACHE. À incrémenter dès que la façon de
     calculer les pourcentages change côté Worker — sinon les valeurs déjà
     stockées dans le navigateur survivent au correctif et le membre continue de
     voir les anciennes.
     Vécu le 30/07 : le Worker inventait des 100 % à partir d'un statut, on a
     corrigé, et Ziad voyait toujours 67 % — la valeur venait de SON localStorage,
     et comme elle s'affiche avant la réponse du Worker (et reste seule si Turnstile
     échoue), rien ne la remplaçait jamais. Même piège que le cache côté Worker.
     v2 = suppression de l'heuristique « statut completed = 100 % ». */
  var LP_STORE_V=3;
  function lpStoreKey(){
    var u=meUser();
    return (u && u.id) ? (LP_STORE_BASE+":"+u.id) : null;
  }
  var lpData=null;        // [{name,pct}] une fois connu (mémoire locale ou Worker)
  var lpPages=[];         // [{page,pct}] — la progression de chaque page du site
  var lpAsked=false;
  var lpTsEl=null;
  /* État du calcul de progression, pour ne JAMAIS laisser l'étudiant devant des
     tuiles vides sans explication (demande de Ziad, 29/07) :
       "attente" -> le Worker calcule (peut durer, cf. plafond API LearnWorlds)
       "ok"      -> pourcentages reçus
       "echec"   -> Worker en erreur ou trop lent -> on invite à revenir plus tard */
  var lpEtat="attente";
  var LP_DELAI_MAX=75000;   // au-delà, on considère que le calcul n'aboutira pas

  function meUser(){ try{ return (typeof me==="object" && me) ? me : null; }catch(e){ return null; } }

  /* Crochet de VÉRIFICATION uniquement (harnais local) : permet de forcer l'état
     d'échec pour voir le message « revenez plus tard » sans casser le Worker.
     Inoffensif en production — rien sur le site ne l'appelle. */
  window.__psForceEchec=function(){ lpEtat="echec"; mountBoard(); };

  /* Programmes du membre connectés, sans aucun appel réseau. */
  function lpFromPage(){
    var u=meUser();
    var arr=u && u.userLearningPrograms;
    if(!arr || !arr.length) return null;
    return [].slice.call(arr).map(function(p){
      return {id:p.id||"", name:domainLabel(p.title||p.id||""), raw:(p.title||p.id||""), pct:null};
    }).filter(function(p){ return p.name; });
  }

  function lpFromStore(){
    try{
      var cle=lpStoreKey();
      if(!cle) return null;                    // membre inconnu : on ne lit RIEN
      var raw=localStorage.getItem(cle);
      /* Ménage : l'ancienne clé commune n'appartenait à personne et pouvait
         afficher les % d'un autre membre. On la retire au passage. */
      try{ localStorage.removeItem(LP_STORE_BASE); }catch(e){}
      if(!raw) return null;
      var j=JSON.parse(raw);
      /* 🔴 Valeurs produites par une AUTRE version du calcul : on les jette au
         lieu de les afficher. Sans ça, un correctif côté Worker reste invisible
         pour tous ceux qui ont déjà des valeurs en cache. */
      if(!j || j.v!==LP_STORE_V){ try{ localStorage.removeItem(cle); }catch(e){} return null; }
      if(j.pages && j.pages.length && !lpPages.length) lpPages=j.pages;   // 1re peinture immédiate
      return (j.programs && j.programs.length) ? j.programs : null;
    }catch(e){ return null; }
  }

  /* Appel au Worker, derrière Turnstile (comme l'annuaire et /account) : le
     Worker refuse toute requête sans jeton valide. Le widget est invisible et
     auto-injecté — rien à ajouter dans la page. La réponse est mise en cache
     côté Worker (renvoi immédiat + rafraîchissement en arrière-plan), et côté
     navigateur sous une clé PAR MEMBRE : l'attente n'est visible qu'à la 1re visite. */
  function lpFetch(jeton){
    var u=meUser();
    if(!u || !u.id) return;
    fetch(LP_ENDPOINT+"lp?uid="+encodeURIComponent(u.id),{
      headers:{ Accept:"application/json", "X-Turnstile-Token":jeton, "X-LW-User":String(u.id) }
    })
      /* 🔴 On lit le CORPS même en erreur : depuis le 30/07 le Worker répond 503
         avec `attente:true` quand trop de calculs en direct tournent en même temps
         (garde-fou de mise à l'échelle). Ce n'est PAS une panne — le traiter comme
         un échec ferait clignoter « revenez plus tard » alors que la réponse
         arrivera d'elle-même à la visite suivante. */
      .then(function(r){ return r.json().catch(function(){ return null; }); })
      .then(function(j){
        if(j && j.attente){ lpEtat="attente"; mountBoard(); return; }
        /* 🔴 Une reponse vide ou en erreur n'est PAS silencieuse : sans ca le
           membre restait devant des tuiles a « — » sans la moindre explication
           (cas reel : Worker en 502 quand le membre est inscrit a tout le
           catalogue). On bascule le bandeau sur « revenez plus tard ». */
        if(!j || !j.programs || !j.programs.length){ lpEtat="echec"; mountBoard(); return; }
        lpEtat="ok";
        /* `page` = la page où une carte de ce parcours a été réellement vue
           (relevée par le collecteur). C'est elle qui décide de la section. */
        /* 🔴 CE QU'ON AFFICHE DÉSORMAIS : une entrée par PAGE, avec le pourcentage
           que la page a calculé elle-même (cf. `depLirePage` dans tokens.js). On
           ne le recalcule pas — le recalculer est exactement ce qui donnait deux
           nombres différents pour la même chose. */
        lpPages=(j.pages||[]).filter(function(p){ return p && p.page && typeof p.pct==="number"; });
        var progs=j.programs.map(function(p){ return {id:p.id||"", name:domainLabel(p.name||""), raw:(p.name||""), pct:p.pct, courses:p.courses, page:p.page||null}; });
        lpData=progs;
        var cle=lpStoreKey();
        if(cle){ try{ localStorage.setItem(cle, JSON.stringify({v:LP_STORE_V, t:Date.now(), programs:progs, pages:lpPages})); }catch(e){} }
        mountBoard();                       // repeint avec les vrais %
      })
      .catch(function(){ lpEtat="echec"; mountBoard(); });
  }

  /* Turnstile auto-injecté, widget invisible hors écran mais RENDU (un
     display:none empêcherait son exécution). Repris de account-page.js. */
  function lpStart(){
    if(lpAsked) return;
    var u=meUser();
    if(!u || !u.id) return;                  // membre non identifié : rien à demander
    lpAsked=true;
    /* Filet de securite : si le Worker ne repond jamais (ni succes ni erreur —
       requete perdue, onglet en veille), on ne laisse pas le bandeau tourner
       indefiniment. Au-dela du delai, on invite a revenir plus tard. */
    setTimeout(function(){ if(lpEtat==="attente"){ lpEtat="echec"; mountBoard(); } }, LP_DELAI_MAX);
    if(!lpTsEl){
      lpTsEl=document.createElement("div");
      lpTsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(lpTsEl);
    }
    window.psLpTsReady=function(){
      try{
        window.turnstile.render(lpTsEl,{
          sitekey:LP_SITEKEY,
          callback:lpFetch,
          "error-callback":function(){ return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(lpTsEl); }catch(e){} },
        });
      }catch(e){ console.error("[profile-board] turnstile",e); }
    };
    if(window.turnstile){ window.psLpTsReady(); return; }
    if(document.getElementById("ps-lp-ts-api")) return;
    var s=document.createElement("script");
    s.id="ps-lp-ts-api";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psLpTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  /* ---- EN-TÊTE « dashboard » : avatar + identité + stats ----
     Tout vient de `me` (global LearnWorlds du membre connecté) : aucun appel
     réseau, donc aucune attente et aucune donnée exposée. `me.custom_fields`
     porte les champs de l'annuaire (cf_ecole, cf_niveau, cf_recherche, cf_langue,
     cf_poste, cf_promo) ; `me.total_time` le temps de formation cumulé.
     🔴 Le bouton natif « Edit profile » est DÉPLACÉ (pas recréé) : il porte un
     handler LearnWorlds qu'un clone perdrait. */
  function fmtDuree(sec){
    var s=Number(sec)||0, h=Math.floor(s/3600), m=Math.round((s%3600)/60);
    if(m===60){ h+=1; m=0; }
    return h ? (h+" h "+(m<10?"0":"")+m) : (m+" min");
  }
  function initialesDe(n){
    return String(n||"").split(/\s+/).filter(Boolean).slice(0,2)
      .map(function(w){ return w[0].toUpperCase(); }).join("") || "?";
  }
  function buildHero(){
    var u=meUser(); if(!u) return;
    var img=document.querySelector(S+" img.user-image");
    var sec=img && img.closest("section.learnworlds-section");
    if(!sec) return;
    var content=sec.querySelector(".learnworlds-section-content")||sec;
    var f=u.custom_fields||u.custom||{};
    var nom=[u.firstName||u.first_name, u.lastName||u.last_name].filter(Boolean).join(" ")||u.username||"Membre";
    var chips=[];
    if(f.cf_ecole)     chips.push({t:f.cf_ecole, hi:true});
    if(f.cf_niveau)    chips.push({t:"Niveau "+f.cf_niveau});
    if(f.cf_recherche) chips.push({t:f.cf_recherche});
    if(f.cf_langue)    chips.push({t:f.cf_langue});
    var role=[f.cf_poste, f.cf_promo?("Promo "+f.cf_promo):null].filter(Boolean).join(" · ");
    /* 🔴🔴 LA STAT « PROGRESSION » DE L'EN-TÊTE A ÉTÉ RETIRÉE (07/08, demande de
       Ziad : « elle ne sert à rien »). Elle affichait la moyenne simple des
       PARCOURS, pendant que le bandeau de grade, trois centimètres plus bas,
       affichait la moyenne des PAGES — deux ensembles différents, deux moyennes
       différentes, deux nombres différents sur le même écran. Le membre n'avait
       aucun moyen de savoir lequel le concernait.
       🔴 NE PAS LA REMETTRE « en la corrigeant » : le problème n'était pas la
       formule, c'était d'avoir deux chiffres globaux. Un seul vit désormais sur
       cette page, celui du bandeau de grade. Si un chiffre est voulu ici un jour,
       il doit LIRE celui du bandeau, jamais en recalculer un second.
       🔴 `lpFromStore()` RESTE APPELÉ : il ne sert pas qu'à rendre des valeurs,
       il amorce aussi `lpPages` pour la première peinture du board (cf. sa
       définition). Le supprimer d'ici retarderait l'affichage des tuiles. */
    var src=lpData||lpFromStore()||[];
    /* Nombre de programmes : celui du BOARD s'il est connu (il fait foi, c'est ce
       que le membre voit), sinon la liste de `me`. Sans ça on affichait « 7 »
       au-dessus de 8 tuiles. */
    var nbProg=src.length||(u.userLearningPrograms&&u.userLearningPrograms.length)||0;
    var sig=[nom,role,chips.map(function(c){return c.t;}).join(","),nbProg,u.total_time].join("|");

    var hero=content.querySelector(".ps-pf-hero");

    /* 🔴 ON NE VIDE JAMAIS L'EN-TÊTE. Une 1re version le reconstruisait à chaque
       changement de signature (`hero.textContent=""`), ce qui DÉTRUISAIT le bouton
       natif « Edit profile » qu'on y avait déplacé — perdu définitivement, son
       handler étant interne à LearnWorlds. Désormais : squelette construit UNE
       fois, puis on ne réécrit que les VALEURS (stats, pastilles). */
    if(hero && hero.dataset.built==="1"){
      sec.classList.add("ps-pf-heroed");
      if(hero.dataset.sig!==sig){
        hero.dataset.sig=sig;
        var bs=hero.querySelectorAll(".ps-pf-st b");
        if(bs[0]) bs[0].textContent=fmtDuree(u.total_time);
        if(bs[1]) bs[1].textContent=String(nbProg);
        var lbl=hero.querySelectorAll(".ps-pf-st span");
        if(lbl[1]) lbl[1].textContent=(nbProg>1?"programmes":"programme");
      }
      /* le bouton natif peut être rendu APRÈS nous : on le rapatrie s'il traîne. */
      var late=sec.querySelector("button.learnworlds-button");
      if(late && !hero.contains(late)){
        late.classList.add("ps-pf-edit");
        var r0=hero.querySelector(".ps-pf-hero-row");
        if(r0) r0.appendChild(late);
      }
      return;
    }

    /* Construction complète. 🔴 Le bouton natif est d'abord MIS À L'ABRI dans la
       section : si un en-tête d'une version précédente est présent (transition de
       cache), on doit le vider — sans ça son contenu se dupliquait (6 stats au
       lieu de 3) — et un vidage emporterait le bouton avec lui. */
    var edit=sec.querySelector("button.learnworlds-button");
    if(edit && hero && hero.contains(edit)) sec.appendChild(edit);
    if(!hero){
      hero=document.createElement("div");
      hero.className="ps-pf-hero";
      content.insertBefore(hero, content.firstChild);
    } else {
      hero.textContent="";                    // sûr : le bouton est à l'abri
    }
    hero.dataset.sig=sig;
    hero.dataset.built="1";

    var row=document.createElement("div"); row.className="ps-pf-hero-row";
    var av=document.createElement("div"); av.className="ps-pf-av";
    /* 🔴🔴 LA VRAIE PHOTO EST DANS `me.image` (bug signalé le 29/07 : « la page
       profil ne récupère pas les photos »). On ne lisait que le champ
       personnalisé `cf_photo` : il EXISTE bien dans l'école (vérifié en direct
       sur /profile, aux côtés de cf_ecole, cf_niveau…), mais **personne ne le
       remplit** — c'est une saisie manuelle d'URL. Résultat : tout le monde
       tombait sur les initiales, alors que LearnWorlds expose déjà l'avatar du
       compte dans `me.image` (URL absolue en .jpg, renseignée).
       ⚠️ `custom_fields` n'est peuplé que sur les pages MEMBRE : sur les écrans
       d'administration il ressort vide. Ne pas en conclure qu'il l'est partout.
       Ordre retenu : `cf_photo` d'abord (il permet de surcharger volontairement),
       sinon la photo du compte. `onerror` garde le repli sur les initiales. */
    var photo=(f.cf_photo && String(f.cf_photo).trim()) || (u && u.image && String(u.image).trim());
    if(photo){
      var im=document.createElement("img");
      im.src=photo; im.alt="";
      im.onerror=function(){ av.textContent=initialesDe(nom); };   // photo morte -> initiales
      av.appendChild(im);
    } else av.textContent=initialesDe(nom);
    row.appendChild(av);

    var id=document.createElement("div"); id.className="ps-pf-id";
    var h=document.createElement("p"); h.className="ps-pf-hname"; h.textContent=nom;   // textContent : jamais d'injection
    id.appendChild(h);
    if(role){ var r=document.createElement("p"); r.className="ps-pf-hrole"; r.textContent=role; id.appendChild(r); }
    if(chips.length){
      var cw=document.createElement("div"); cw.className="ps-pf-chips";
      chips.forEach(function(c,i){
        var s=document.createElement("span");
        s.className="ps-pf-chip"+(c.hi?" -hi":"");
        s.style.animationDelay=(0.14+i*0.04)+"s";
        s.textContent=c.t;
        cw.appendChild(s);
      });
      id.appendChild(cw);
    }
    row.appendChild(id);

    /* le bouton natif (mis à l'abri plus haut) rejoint l'en-tête */
    if(edit){ edit.classList.add("ps-pf-edit"); row.appendChild(edit); }
    hero.appendChild(row);

    /* Deux stats, plus trois : la progression a quitté l'en-tête (cf. plus haut).
       `.ps-pf-st` est en `flex:1 1 130px`, les deux restantes s'élargissent
       d'elles-mêmes — rien à changer côté CSS. */
    var stats=[
      {v:fmtDuree(u.total_time), l:"de formation"},
      {v:String(nbProg),         l:nbProg>1?"programmes":"programme"}
    ];
    var sw=document.createElement("div"); sw.className="ps-pf-stats";
    stats.forEach(function(st,i){
      var d=document.createElement("div"); d.className="ps-pf-st";
      d.style.animationDelay=(0.3+i*0.05)+"s";
      var b=document.createElement("b"); b.textContent=st.v;
      var sp=document.createElement("span"); sp.textContent=st.l;
      d.appendChild(b); d.appendChild(sp); sw.appendChild(d);
    });
    hero.appendChild(sw);
    sec.classList.add("ps-pf-heroed");
  }

  /* Construit/actualise le board dans le grandpa des tuiles. Idempotent grâce à
     une signature : ne se reconstruit que si les domaines ou les % changent
     (l'observer rappelle build() à chaque mutation). */
  function mountBoard(){
    var grandpa=document.querySelector(S+" .ps-pf-tiles");
    if(!grandpa) return;
    /* 🔴 AVANT toute peinture : le bandeau lit `GRADES` au moment où il se
       dessine. Appeler plus tard afficherait l'échelle par défaut puis la
       remplacerait sous les yeux du membre — le grade de quelqu'un ne doit pas
       changer de nom une seconde après s'être affiché. Idempotent : le bloc est
       masqué au premier passage, mais `mountBoard` peut être rappelé. */
    appliquerGradesDuBuilder();
    var seen={}, progs=[];
    document.querySelectorAll(S+" [class*='learning-program-card']").forEach(function(card){
      var h=card.querySelector(".learnworlds-heading3")||card.querySelector("[class*='heading']");
      var raw=h?(h.textContent||"").replace(/\s+/g," ").trim():"";
      if(!raw || seen[raw]) return; seen[raw]=1;
      progs.push({name:domainLabel(raw), raw:raw, pct:programPct(card)});
    });
    /* Pas de widget « Vue par thématique » sur la page (cas courant depuis que
       Ziad l'a retiré) : on prend le Worker, sinon la mémoire locale, sinon la
       liste de la page — dans cet ordre de fraîcheur. */
    if(!progs.length) progs = lpData || lpFromStore() || lpFromPage() || [];

    /* 🔴 FILTRE DE LANGUE : en anglais on ne garde que les programmes « - EN »,
       en français tous les autres. Sans ça les deux langues s'empilaient dans le
       tableau et les pourcentages n'avaient plus de sens. Garde-fou : si le
       filtre ne laisse rien (langue sans programme), on n'affiche pas de tableau
       vide — les tuiles natives de LearnWorlds reprennent la main. */
    var L=langueCourante();
    progs = progs.filter(function(p){
      var brut=(p.raw!==undefined ? p.raw : p.name);
      return L.enAnglais ? progEN(brut) : !progEN(brut);
    });
    /* Exclusions demandées (cf. PROG_EXCLUS). Placé APRÈS le filtre de langue et
       AVANT la signature et le bandeau de grade : ce qui n'est pas affiché ne doit
       pas non plus peser dans le pourcentage global. */
    progs = progs.filter(function(p){ return !progExclu(p); });
    lpStart();                                     // rafraîchit (une seule fois)

    /* 🔴🔴 MODE PAGE (03/08) — ce que Ziad veut lire ici : « le board du profil
       affiche les progressions de toutes les pages, sur une seule page ». Dès
       qu'on connaît le pourcentage d'au moins une page, on affiche UNE TUILE PAR
       PAGE et rien d'autre, avec le chiffre que la page a calculé elle-même.
       Les deux nombres sont donc identiques par construction — c'est tout l'objet
       du changement, après deux jours où je faisais un second calcul concurrent.
       Repli sur l'affichage par parcours tant qu'aucune page n'est connue (le
       membre n'a encore visité aucune page depuis la mise en service). */
    /* 🔴 TOUTES LES PAGES SONT AFFICHÉES, y compris à 0 % (demande de Ziad,
       03/08) : « ça pousse les étudiants à commencer les autres modules ». La
       liste vient donc de PAGE_ORDRE — les pages du site — et NON des pages déjà
       déposées. Sinon une page jamais visitée n'aurait aucune tuile, et l'étudiant
       n'aurait justement aucune raison d'y aller.
       Une page dont on ne connaît pas encore le pourcentage s'affiche à 0 : c'est
       le cas d'un étudiant qui n'y est jamais allé, donc où il n'a rien fait. */
    var modePage=true;
    var connu={};
    lpPages.forEach(function(p){ connu[p.page]=p.pct; });
    progs=PAGE_ORDRE.map(function(u){
      return { id:"", name:labelPage(u), raw:labelPage(u), page:u,
               pct:(typeof connu[u]==="number" ? connu[u] : 0) };
    }).filter(function(p){ return p.name && p.name!=="Autres"; });
    if(!progs.length) return;                       // rien à peindre : on réessaiera
    /* 🔴 La signature porte AUSSI la page : sans ça, un programme qui change de
       section (1 ligne dans PROG_PAGES) ne repeindrait pas le tableau. */
    var sig=lpEtat+"~"+progs.map(function(p){return progPage(p.id,p.name,p.raw,p.page).url+">"+p.name+"="+p.pct;}).join("|");
    var board=grandpa.querySelector(".ps-pf-board");
    if(board && board.dataset.sig===sig){ grandpa.classList.add("ps-has-board"); return; }
    if(!board){ board=document.createElement("div"); board.className="ps-pf-board"; grandpa.insertBefore(board,grandpa.firstChild); }
    board.dataset.sig=sig;
    board.textContent="";
    var R=27, CIRC=2*Math.PI*R;                      // anneau de progression

    /* Regroupement par page, puis tri selon l'ordre voulu (cf. PAGE_ORDRE). */
    var groupes={}, urls=[];
    progs.forEach(function(p){
      var c=progPage(p.id,p.name,p.raw,p.page);
      if(!groupes[c.url]){ groupes[c.url]={col:c.col, items:[]}; urls.push(c.url); }
      groupes[c.url].items.push(p);
    });
    urls.sort(function(a,b){ return rangPage(a)-rangPage(b); });

    /* 🔴 `i` est un compteur GLOBAL, pas l'index dans la section : la cascade
       d'apparition doit traverser tout le tableau, sinon chaque section
       redémarrerait son animation à zéro et l'ensemble clignoterait par paquets. */
    var i=0;
    /* Grade si le % global est connu, sinon message d'attente : dans tous les
       cas l'etudiant a une explication en haut du tableau. */
    var bandeau=buildRank(progs) || buildAttente();
    board.appendChild(bandeau);

    urls.forEach(function(u){
      var g=groupes[u];
      var grp=document.createElement("div");
      /* largeur de la carte = nombre de parcours (plafonné à 4 colonnes) :
         c'est ce qui fait que les sections s'imbriquent au lieu de laisser
         des lignes à moitié vides. */
      grp.className="ps-pf-grp ps-pf-w"+Math.min(4, g.items.length);
      grp.style.setProperty("--c", g.col);

      /* 🔴 En mode PAGE, pas d'en-tête de section : elle répéterait mot pour mot
         le nom de l'unique tuile qu'elle contient (« Cours » au-dessus de
         « Cours »). Ziad a demandé une tuile par page, rien d'autre. */
      if(!modePage){
        var head=document.createElement("div"); head.className="ps-pf-grp-h";
        var ttl=document.createElement("span"); ttl.className="ps-pf-grp-t";
        ttl.textContent=labelPage(u);
        head.appendChild(ttl);
        var cnt=document.createElement("span"); cnt.className="ps-pf-grp-n";
        cnt.textContent=g.items.length+" parcours";   // « parcours » est invariable
        head.appendChild(cnt);
        grp.appendChild(head);
      }

      var grille=document.createElement("div"); grille.className="ps-pf-grp-g";
      grp.appendChild(grille);
      board.appendChild(grp);

      g.items.forEach(function(p){
      /* pct null = pas encore connu (1re visite, réponse du Worker en route) :
         la tuile s'affiche quand même avec son nom, le chiffre arrive ensuite. */
      var known=(typeof p.pct==="number" && isFinite(p.pct));
      var val=known?Math.max(0,Math.min(100,Math.round(p.pct))):0;
      var conf=progPage(p.id,p.name,p.raw,p.page);

      var tile=document.createElement("div");
      tile.className="ps-pf-bt";
      tile.style.setProperty("--c", conf.col);
      tile.style.animationDelay=(0.05+i*0.06)+"s";

      var top=document.createElement("div"); top.className="ps-pf-bt-top";
      var ring=document.createElement("div"); ring.className="ps-pf-ring";
      /* SVG en createElementNS : un innerHTML sur du SVG ne construit pas les
         bons noeuds dans tous les navigateurs. */
      var NS="http://www.w3.org/2000/svg";
      var svg=document.createElementNS(NS,"svg");
      svg.setAttribute("width","64"); svg.setAttribute("height","64");
      function cercle(stroke,dash,off){
        var c=document.createElementNS(NS,"circle");
        c.setAttribute("cx","32"); c.setAttribute("cy","32"); c.setAttribute("r",String(R));
        c.setAttribute("fill","none"); c.setAttribute("stroke",stroke); c.setAttribute("stroke-width","6");
        if(dash!=null){ c.setAttribute("stroke-linecap","round"); c.setAttribute("stroke-dasharray",String(dash)); c.setAttribute("stroke-dashoffset",String(off)); }
        return c;
      }
      svg.appendChild(cercle("#EEF1F6",null,null));
      var arc=cercle(conf.col,CIRC,CIRC);            // part de 0 puis s'anime
      arc.setAttribute("class","ps-pf-arc");
      svg.appendChild(arc);
      ring.appendChild(svg);
      var pc=document.createElement("span"); pc.className="ps-pf-bt-pct"; pc.textContent=known?(val+" %"):"—";
      ring.appendChild(pc);
      top.appendChild(ring);

      var txt=document.createElement("div"); txt.style.minWidth="0";
      var nm=document.createElement("div"); nm.className="ps-pf-bt-name"; nm.textContent=p.name;
      txt.appendChild(nm);
      if(typeof p.courses==="number" && p.courses>0){
        var sb=document.createElement("div"); sb.className="ps-pf-bt-sub";
        sb.textContent=p.courses+(p.courses>1?" cours":" cours");
        txt.appendChild(sb);
      }
      top.appendChild(txt);
      tile.appendChild(top);

      var go=document.createElement("a");
      go.className="ps-pf-go"; go.href=urlLangue(conf.url);
      go.textContent=(known && val>0) ? "Continuer" : "Commencer";
      tile.appendChild(go);

      grille.appendChild(tile);
      /* remplissage de l'anneau après insertion (sinon pas de transition) */
      if(known && val>0){
        (function(rang){
          setTimeout(function(){ arc.setAttribute("stroke-dashoffset", String(CIRC-(CIRC*val/100))); }, 220+rang*70);
        })(i);
      }
      i++;
      });
    });
    grandpa.classList.add("ps-has-board");
    /* fond neutre « tableau de bord » sur la section qui porte le board */
    var sec=grandpa.closest && grandpa.closest("section.learnworlds-section");
    if(sec) sec.classList.add("ps-pf-dash");
  }

  /* 🔴 TITRE « Niveau #N - Nom », TOUTES LANGUES (03/08). Weglot traduit le titre :
     « Niveau #1 - … » devient « Level #1 - … ». Notre ancien motif exigeait le mot
     « Niveau », donc en anglais la carte n'etait plus reconnue et restait dans son
     habillage natif LearnWorlds — sans pastille de niveau, sans compteurs, sans
     barre (constate par Ziad).
     On ne reconnait donc plus un MOT mais une FORME : un mot court, un nombre, un
     tiret. Ca marche dans toutes les langues activees sans avoir a les lister, et
     un titre sans nombre (« Introduction au conseil ») ne matche toujours pas. */
  var RE_NIVEAU=/^[A-Za-zÀ-ÿ]{2,12}\s*#?\s*(\d+)\s*[-–—:]\s*(.+)$/;

  function build(){
    /* garde évalué ICI, pas au chargement : cf. l'avertissement en tête */
    if(!surLaPage()) return;
    figtree(); styles(); marquer(); cacherCatalogue(); buildHero(); mountBoard();
    document.querySelectorAll(S+" .ps-pf-courses .lw-course-card").forEach(function(card){
      if(card.dataset.psPf) return;
      var h=card.querySelector(".learnworlds-heading3"); if(!h) return;
      var level, name;
      var badge=h.querySelector(".course-level-badge"), ct=h.querySelector(".course-title");
      if(badge && ct){ level=((badge.textContent.match(/(\d+)/)||[])[1]); name=ct.textContent.trim(); }
      else { var m=h.textContent.trim().match(RE_NIVEAU); if(m){ level=m[1]; name=m[2]; } }
      if(!level || !name) return;                 // format inattendu -> carte native intacte

      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";
      var dEl=card.querySelector(".lw-course-card-descr");
      var metas=dEl ? parseMeta((dEl.textContent||"").replace(/\s+/g," ").trim()) : [];

      var d=document.createElement("div");
      d.className="ps-pfc";
      var head=document.createElement("div"); head.className="ps-pfc-head";
      var tag=document.createElement("span");
      tag.className="ps-pfc-tag"; tag.setAttribute("data-ps-lvl",level); tag.textContent="Niveau "+level;
      head.appendChild(tag);
      if(metas.length){
        var row=document.createElement("div"); row.className="ps-pfc-metas";
        metas.forEach(function(mt){
          var s=document.createElement("span");
          s.className="ps-pfc-meta"; s.textContent=metaText(mt.label,mt.value);
          row.appendChild(s);
        });
        head.appendChild(row);
      }
      var t=document.createElement("h3");
      t.className="ps-pfc-title"; t.textContent=name;     // textContent : pas d'injection
      d.appendChild(head); d.appendChild(t);

      /* Progression : on lit la largeur INLINE de la barre native, pas le texte
         "72% Complété" (dépendant de la langue). Affichée dès que la donnée
         existe (barre native présente), y compris à 0 % — comme ça CHAQUE carte
         de cours suivi porte sa progression, pas seulement les cours entamés. */
      var nat=card.querySelector(".lw-course-card-progress-bar");
      var pct=nat ? parseInt((nat.style.width||"").replace("%",""),10) : NaN;
      if(!isNaN(pct) && pct>=0){
        var cp=Math.max(0,Math.min(pct,100));
        var ph=document.createElement("div"); ph.className="ps-pfc-prog-head";
        var pn=document.createElement("span"); pn.className="ps-pfc-prog-pct"; pn.textContent=cp+" %";
        var pl=document.createElement("span"); pl.className="ps-pfc-prog-lbl"; pl.textContent=cp>0?"complété":"pas commencé";
        ph.appendChild(pn); ph.appendChild(pl);
        var pw=document.createElement("div"); pw.className="ps-pfc-prog";
        var pb=document.createElement("div"); pb.className="ps-pfc-prog-bar";
        pb.style.width=cp+"%";
        pw.appendChild(pb);
        d.appendChild(ph); d.appendChild(pw);
      }

      var a=document.createElement("a");
      a.className="ps-pfc-link"; a.href=href;
      var label="En savoir plus";
      if(!isNaN(pct)){
        if(pct>=100){ label="Terminé"; a.classList.add("ps-done"); }
        else if(pct>0){ label="Continuer"; }
        else { label="Commencer"; }
      }
      a.textContent=label;
      d.appendChild(a);

      card.appendChild(d);
      card.dataset.psPf="1";                      // déclenche le masquage du natif
    });
  }

  /* ====================================================================
     LA SECTION « MY COURSES » : MASQUÉE SEULEMENT SI ELLE EST VIDE
     --------------------------------------------------------------------
     Signalée par Ziad, qui la voyait brute sur un compte neuf. Mon premier
     réflexe a été de la masquer ; la mesure l'a interdit.

     🔴🔴 C'EST LA SOURCE DE PROGRESSION LA PLUS RICHE DU SITE. Mesuré sur le
     compte de Ziad : **55 cartes de cours et 55 barres de progression** dans
     cette seule section, et ZÉRO ailleurs sur la page. C'est très exactement
     l'élément que mes notes du 30/07 recommandaient d'AJOUTER pour que chaque
     membre dépose sa progression complète en une visite — il existait déjà.
     La masquer, c'était supprimer la couverture qu'on cherche à gagner depuis
     trois sessions (« 12 cours inscrits n'ont de carte nulle part »).

     🔴 Le vrai défaut n'est pas qu'elle soit visible : c'est qu'elle est LAIDE
     QUAND ELLE EST VIDE. Sur un compte sans cours, notre script n'a rien à
     transformer et le bloc natif reste nu, en anglais (« My Courses », « Exp.
     Soon »), haut de 381 px pour ne rien montrer.
     ⇒ On ne masque que ce cas-là, et on le décide sur ce que la section
     CONTIENT, pas sur un compte ou un rôle : zéro carte ⇒ zéro raison d'être.
     🔴 Réévalué à chaque passage : les cartes arrivent après le rendu initial,
     et conclure « vide » trop tôt masquerait une section qui allait se remplir.
     ==================================================================== */
  /* 🔴🔴 ON LA RECONNAÎT PAR L'IDENTIFIANT DE LEARNWORLDS, ET C'EST TOUT LE
     CORRECTIF DE LA SECONDE TENTATIVE. Ma première version cherchait « une
     grille contenant des cartes de cours OU des filtres ». Elle ne s'est jamais
     déclenchée — parce que le cas à traiter est précisément celui où il n'y a
     NI carte NI filtre. J'avais bâti l'identification sur ce dont l'absence
     définit le problème.
     LearnWorlds pose lui-même `data-section-id="MyCourses1"` et la classe
     `lw-course-cards` sur la section, pleine ou vide. On vise ça — pas le
     titre (traduit par Weglot), pas le contenu (variable par définition). */
  function sectionCoursVide(){
    var hote=document.getElementById("pageContent");
    if(!hote) return;
    var secs=hote.querySelectorAll(':scope > [data-section-id^="MyCourses"], :scope > .lw-course-cards');
    [].slice.call(secs).forEach(function(sec){
      var cartes=sec.querySelectorAll(".lw-course-card").length;
      /* 🔴 Réévalué à chaque passage : les cartes arrivent après le rendu
         initial. Conclure « vide » une fois pour toutes masquerait une section
         qui allait se remplir — et avec elle les 55 barres de progression que
         le collecteur y lit, la meilleure source du site. */
      if(cartes>0) sec.style.removeProperty("display");
      else sec.style.display="none";
    });
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); sectionCoursVide(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); sectionCoursVide(); obs.observe(document.body,{childList:true,subtree:true}); }
  /* ════════════════════════════════════════════════════════════════════════
     MASQUER LE BLOC DE RÉGLAGES AVANT LA PEINTURE  (07/08)
     ------------------------------------------------------------------------
     🔴 Signalé par Ziad : « la page profil affiche aussi le texte du builder
     avant de mettre en page ». Autrement dit l'étudiant lit
     « grade1-nom : Junior », « grade1-seuil : 0 »… en clair, une demi-seconde,
     avant que le board ne se construise.
     Cause : `appliquerGradesDuBuilder()` n'était appelée que depuis `start()`,
     lui-même suspendu à `DOMContentLoaded` — mesuré ce jour sur ce site :
     **411 ms**, bien après l'affichage du texte servi dans le HTML.
     ⇒ On tente immédiatement, puis toutes les 20 ms jusqu'à l'avoir trouvé et
     masqué. Le bloc est dans le HTML servi : il est donc atteignable dès que le
     corps est analysé, sans attendre le moindre événement.
     🔴 UNE SEULE SOURCE : on rappelle la fonction existante, on ne recopie pas
     sa détection ailleurs. Une seconde copie du motif `gradeN-nom` finirait par
     diverger de celle qui lit vraiment les valeurs.
     🔴 Plafond 3 s : une page sans bloc de réglages est le cas NORMAL (l'échelle
     par défaut suffit), il ne faut pas interroger le DOM indéfiniment pour rien.
     🔴 Idempotent : `appliquerGradesDuBuilder` repose `display:none` sur le même
     élément et sort au premier bloc trouvé — la rappeler ne coûte rien.
     ════════════════════════════════════════════════════════════════════════ */
  /* 🔴🔴 NE PAS SORTIR SUR `surLaPage()` AU PREMIER PASSAGE. À l'exécution du
     script, `document.body` peut être NUL et la classe `slug-profile` pas
     encore posée : un `if(!surLaPage()) return;` ici ne se déclencherait
     JAMAIS. C'est mot pour mot la faute du 05/08 — l'anti-flash de la home
     testait cette classe trop tôt et n'a jamais été posé, alors que je le
     croyais en service. On teste donc À CHAQUE passage, pas une seule fois. */
  /* 🔴🔴 DEUXIÈME TOUR (08/08) — « la page profil affiche TOUJOURS le contenu du
     builder avant de mettre en forme ». La boucle ci-dessous existait déjà ;
     ce qui la retenait, c'est le garde `surLaPage()` : elle refusait d'agir
     tant que LearnWorlds n'avait pas posé `slug-profile` sur le corps, et
     pendant ce temps le texte était DÉJÀ peint.
     ⇒ Le masquage ne dépend plus de la classe. Il peut se le permettre : il ne
     masque QUE le bloc qui contient littéralement `gradeN-nom :`, une signature
     qu'aucun autre contenu ne porte. Attendre la classe, c'était se protéger
     d'un risque qui n'existait pas — au prix du défaut qu'on voulait corriger.
     🔴 Un OBSERVATEUR en plus de la boucle : il se déclenche à l'INSERTION du
     nœud, donc avant la peinture, là où un intervalle de 20 ms arrive forcément
     après. La boucle reste comme filet — l'observateur ne voit rien si le bloc
     était déjà là avant notre exécution. */
  (function masquerTot(){
    var t0=Date.now(), h=null, obs=null;
    function fini(){
      if(h){ clearInterval(h); h=null; }
      if(obs){ try{ obs.disconnect(); }catch(e){} obs=null; }
    }
    function essayer(){
      if(Date.now()-t0>3000){ fini(); return; }
      if(appliquerGradesDuBuilder()) fini();
    }
    essayer();
    h=setInterval(essayer, 20);
    /* 🔴 UNE FOIS PAR TRAME, PAS PAR MUTATION. `appliquerGradesDuBuilder`
       balaie tous les `.learnworlds-element` de la page ; le déclencher à
       chaque insertion pendant la construction du DOM ferait payer ce balayage
       des centaines de fois. `requestAnimationFrame` regroupe — et il s'exécute
       AVANT la peinture, donc on ne perd rien de ce qu'on cherchait. */
    try{
      var prevu=false;
      obs=new MutationObserver(function(){
        if(prevu) return;
        prevu=true;
        requestAnimationFrame(function(){ prevu=false; essayer(); });
      });
      obs.observe(document.documentElement, {childList:true, subtree:true});
    }catch(e){}
  })();

  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  /* Le tableau dépend de la langue -> le reconstruire quand elle change.
     Deux sources : l'événement émis par tokens.js, et Weglot directement (sur
     une page sans carte de cours, tokens.js n'émet pas). */
  window.addEventListener("ps-lang-change", build);
  (function(){
    var n=0, iv=setInterval(function(){
      if(window.Weglot && window.Weglot.on){
        try{ window.Weglot.on("languageChanged", function(){ setTimeout(build,50); }); }catch(e){}
        clearInterval(iv);
      } else if(++n>50) clearInterval(iv);
    }, 400);
  })();
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
