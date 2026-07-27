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
    S+" .ps-pf-head button.learnworlds-button,"+S+" button.learnworlds-button.ps-pf-edit{background:var(--ps-accent,#6161FF) !important;border:0 !important;border-radius:var(--ps-r-pill,999px) !important;padding:11px 22px !important;color:#fff !important;"+FT+"font-size:15px !important;font-weight:600 !important;box-shadow:none !important;cursor:pointer !important;transition:background .18s ease !important;}",
    S+" button.learnworlds-button.ps-pf-edit:hover{background:var(--ps-accent-hover,#4B4BE0) !important;}",

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
    S+" .ps-pf-board{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(196px,1fr)) !important;gap:14px !important;}",
    S+" .ps-pf-bt{background:#fff !important;border-radius:var(--ps-r-card,16px) !important;padding:16px 17px 15px !important;box-shadow:0 4px 14px rgba(15,23,42,.06) !important;display:flex !important;flex-direction:column !important;gap:12px !important;transition:transform .2s ease, box-shadow .2s ease !important;animation:psPfUp .55s ease both !important;}",
    S+" .ps-pf-bt:hover{transform:translateY(-3px) !important;box-shadow:0 12px 28px rgba(15,23,42,.12) !important;}",
    S+" .ps-pf-bt-top{display:flex !important;align-items:center !important;gap:13px !important;}",
    S+" .ps-pf-ring{width:58px !important;height:58px !important;flex:none !important;position:relative !important;}",
    S+" .ps-pf-ring svg{transform:rotate(-90deg) !important;display:block !important;}",
    /* l'anneau s'anime en dessinant son tracé (stroke-dashoffset) */
    S+" .ps-pf-ring .ps-pf-arc{transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1) !important;}",
    S+" .ps-pf-bt-pct{position:absolute !important;inset:0 !important;display:flex !important;align-items:center !important;justify-content:center !important;"+FT+"font-size:14px !important;font-weight:800 !important;color:#243B6B !important;letter-spacing:-.02em !important;}",
    S+" .ps-pf-bt-name{"+FT+"font-size:13.5px !important;font-weight:700 !important;color:#243B6B !important;line-height:1.25 !important;}",
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
    ".ps-pfc-tag{display:inline-flex !important;align-items:center !important;padding:5px 13px !important;border-radius:var(--ps-r-pill,999px) !important;"+FT+"font-size:14px !important;font-weight:800 !important;line-height:1.2 !important;background:var(--ps-accent-tint,#EDEDFF) !important;color:var(--ps-accent-hover,#4B4BE0) !important;}",
    /* 🔴 couleur par NIVEAU (data-ps-lvl), JAMAIS par nth-child : sur la page
       Cours, les chevrons intercalés décalaient les positions et le cycle
       sautait. Même principe ici par cohérence. */
    ".ps-pfc-tag[data-ps-lvl='1']{background:var(--ps-accent-tint,#EDEDFF) !important;color:var(--ps-accent-hover,#4B4BE0) !important;}",
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
    ".ps-pfc-prog{height:8px !important;border-radius:var(--ps-r-pill,999px) !important;background:#EEF1F6 !important;overflow:hidden !important;}",
    ".ps-pfc-prog-bar{height:100% !important;border-radius:var(--ps-r-pill,999px) !important;background:var(--ps-accent,#6161FF) !important;}",
    ".ps-pfc-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:14px !important;color:var(--ps-accent,#6161FF) !important;"+FT+"font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-pfc-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-pfc-link:hover{color:var(--ps-accent-hover,#4B4BE0) !important;}",
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
    S+" .lw-learning-program-card button.learnworlds-button,"+S+" .lw-learning-program-card a.learnworlds-button{background:var(--ps-accent,#6161FF) !important;border:0 !important;border-radius:var(--ps-r-pill,999px) !important;"+FT+"font-size:15px !important;font-weight:600 !important;color:#fff !important;box-shadow:none !important;transition:background .18s ease !important;}",
    S+" .lw-learning-program-card button.learnworlds-button:hover,"+S+" .lw-learning-program-card a.learnworlds-button:hover{background:var(--ps-accent-hover,#4B4BE0) !important;}",

    /* ============ 6) barres de filtres ============ */
    /* Ces filtres sont des STATUTS (En cours / Terminé / …), pas des
       catégories : `filters.js` n'a rien à faire ici. On ne reprend que le
       style des pastilles.
       ⚠️ Jamais de `display` sur ces sélecteurs : LW masque les filtres
       désactivés par un `display:none` INLINE qu'un `!important` écraserait. */
    S+" .learnworlds-button.filter.text-only{display:inline-flex !important;align-items:center !important;height:40px !important;padding:0 16px !important;margin-right:8px !important;border-radius:var(--ps-r-pill,999px) !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;background:#fff !important;color:#4B5563 !important;"+FT+"font-size:14px !important;font-weight:600 !important;cursor:pointer !important;transition:all .15s ease !important;}",
    S+" .learnworlds-button.filter.text-only:hover{border-color:var(--ps-accent,#6161FF) !important;color:var(--ps-accent,#6161FF) !important;background:#F3F1FF !important;}",
    S+" .-search-box{display:inline-flex !important;align-items:center !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:12px !important;background:#fff !important;overflow:hidden !important;height:44px !important;}",
    S+" .-search-box input{border:0 !important;box-shadow:none !important;"+FT+"font-size:15px !important;background:transparent !important;}",
    S+" .-search-box button{border:0 !important;box-shadow:none !important;background:transparent !important;}",

    "@media(max-width:1040px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:700px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}"
  ].join("\n");

  /* Posée depuis build(), donc APRÈS le garde : le CSS est scopé `#pageContent`
     et non `body.slug-profile`, il ne doit pas atterrir sur une autre page si
     la balise venait à être posée ailleurs. */
  function styles(){
    var st=document.getElementById("ps-profile-style");
    if(!st){ st=document.createElement("style"); st.id="ps-profile-style"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==CSS) st.textContent=CSS;
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
  var PROG_PAGES={
    "introduction-conseil-strategie":                    {url:"/empty",               col:"#507EC5"},
    "module-de-formation-les-autres-types-de-conseil":   {url:"/empty",               col:"#507EC5"},
    "introduction":                                      {url:"/page-introduction",   col:"#243B6B"},
    "fit":                                               {url:"/page-introduction",   col:"#243B6B"},
    "mathematiques":                                     {url:"/page-introduction",   col:"#243B6B"},
    "etudes-de-cas":                                     {url:"/emptykk-clone-clone", col:"#6B7280"},
    "etudes-de-cas2":                                    {url:"/emptykk-clone-clone", col:"#6B7280"},
    "fiches-secteurs":                                   {url:"/fiches-secteur",      col:"#C9A227"},
    "fiches-cabinet-and-tests-en-ligne":                 {url:"/fiches-secteur-clone",col:"#007260"},
    "s-entrainer":                                       {url:"/sentrainer",          col:"#3887B4"}
  };
  /* Domaine inconnu -> page « Nos formations », qui les liste tous. */
  var PROG_FALLBACK={url:"/page-introduction", col:"#507EC5"};
  function progPage(id){ return (id && PROG_PAGES[id]) || PROG_FALLBACK; }

  var LP_ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/";
  /* Clé de site Turnstile : PUBLIQUE par nature (c'est la clé secrète, côté
     Worker, qui valide). Même clé que l'annuaire et /account.
     🔴 Ne JAMAIS mettre ici une clé de service qui contourne Turnstile : ce
     dépôt est PUBLIC, tout ce qui y est écrit est lisible par n'importe qui. */
  var LP_SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";
  var LP_STORE="psLpProgress";
  var lpData=null;        // [{name,pct}] une fois connu (mémoire locale ou Worker)
  var lpAsked=false;
  var lpTsEl=null;

  function meUser(){ try{ return (typeof me==="object" && me) ? me : null; }catch(e){ return null; } }

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
      var raw=localStorage.getItem(LP_STORE);
      if(!raw) return null;
      var j=JSON.parse(raw);
      return (j && j.programs && j.programs.length) ? j.programs : null;
    }catch(e){ return null; }
  }

  /* Appel au Worker, derrière Turnstile (comme l'annuaire et /account) : le
     Worker refuse toute requête sans jeton valide. Le widget est invisible et
     auto-injecté — rien à ajouter dans la page. La réponse est mise en cache
     côté Worker (renvoi immédiat + rafraîchissement en arrière-plan), et côté
     navigateur dans LP_STORE : l'attente n'est visible qu'à la 1re visite. */
  function lpFetch(jeton){
    var u=meUser();
    if(!u || !u.id) return;
    fetch(LP_ENDPOINT+"lp?uid="+encodeURIComponent(u.id),{
      headers:{ Accept:"application/json", "X-Turnstile-Token":jeton, "X-LW-User":String(u.id) }
    })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        if(!j || !j.programs || !j.programs.length) return;
        var progs=j.programs.map(function(p){ return {id:p.id||"", name:domainLabel(p.name||""), raw:(p.name||""), pct:p.pct, courses:p.courses}; });
        lpData=progs;
        try{ localStorage.setItem(LP_STORE, JSON.stringify({t:Date.now(), programs:progs})); }catch(e){}
        mountBoard();                       // repeint avec les vrais %
      })
      .catch(function(){});
  }

  /* Turnstile auto-injecté, widget invisible hors écran mais RENDU (un
     display:none empêcherait son exécution). Repris de account-page.js. */
  function lpStart(){
    if(lpAsked) return;
    var u=meUser();
    if(!u || !u.id) return;                  // membre non identifié : rien à demander
    lpAsked=true;
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
    /* progression globale : moyenne des domaines connus (vide tant que le
       Worker n'a pas répondu ET qu'aucune valeur n'est mémorisée). */
    var src=lpData||lpFromStore()||[], moy=null;
    var chiffres=src.filter(function(p){ return typeof p.pct==="number"; });
    if(chiffres.length){
      moy=Math.round(chiffres.reduce(function(a,p){ return a+p.pct; },0)/chiffres.length);
    }
    /* Nombre de programmes : celui du BOARD s'il est connu (il fait foi, c'est ce
       que le membre voit), sinon la liste de `me`. Sans ça on affichait « 7 »
       au-dessus de 8 tuiles. */
    var nbProg=src.length||(u.userLearningPrograms&&u.userLearningPrograms.length)||0;
    var sig=[nom,role,chips.map(function(c){return c.t;}).join(","),moy,nbProg,u.total_time].join("|");

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
        if(bs[2]) bs[2].textContent=(moy==null?"—":moy+" %");
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
    var photo=f.cf_photo && String(f.cf_photo).trim();
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

    var stats=[
      {v:fmtDuree(u.total_time), l:"de formation"},
      {v:String(nbProg),         l:nbProg>1?"programmes":"programme"},
      {v:(moy==null?"—":moy+" %"), l:"progression"}
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
    lpStart();                                     // rafraîchit (une seule fois)
    if(!progs.length) return;                       // programmes pas encore rendus : réessai
    var sig=progs.map(function(p){return p.name+"="+p.pct;}).join("|");
    var board=grandpa.querySelector(".ps-pf-board");
    if(board && board.dataset.sig===sig){ grandpa.classList.add("ps-has-board"); return; }
    if(!board){ board=document.createElement("div"); board.className="ps-pf-board"; grandpa.insertBefore(board,grandpa.firstChild); }
    board.dataset.sig=sig;
    board.textContent="";
    var R=24, CIRC=2*Math.PI*R;                      // anneau de progression
    progs.forEach(function(p,i){
      /* pct null = pas encore connu (1re visite, réponse du Worker en route) :
         la tuile s'affiche quand même avec son nom, le chiffre arrive ensuite. */
      var known=(typeof p.pct==="number" && isFinite(p.pct));
      var val=known?Math.max(0,Math.min(100,Math.round(p.pct))):0;
      var conf=progPage(p.id);

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
      svg.setAttribute("width","58"); svg.setAttribute("height","58");
      function cercle(stroke,dash,off){
        var c=document.createElementNS(NS,"circle");
        c.setAttribute("cx","29"); c.setAttribute("cy","29"); c.setAttribute("r",String(R));
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
      go.className="ps-pf-go"; go.href=conf.url;
      go.textContent=(known && val>0) ? "Continuer" : "Commencer";
      tile.appendChild(go);

      board.appendChild(tile);
      /* remplissage de l'anneau après insertion (sinon pas de transition) */
      if(known && val>0){
        setTimeout(function(){ arc.setAttribute("stroke-dashoffset", String(CIRC-(CIRC*val/100))); }, 220+i*70);
      }
    });
    grandpa.classList.add("ps-has-board");
    /* fond neutre « tableau de bord » sur la section qui porte le board */
    var sec=grandpa.closest && grandpa.closest("section.learnworlds-section");
    if(sec) sec.classList.add("ps-pf-dash");
  }

  function build(){
    /* garde évalué ICI, pas au chargement : cf. l'avertissement en tête */
    if(!surLaPage()) return;
    figtree(); styles(); marquer(); buildHero(); mountBoard();
    document.querySelectorAll(S+" .ps-pf-courses .lw-course-card").forEach(function(card){
      if(card.dataset.psPf) return;
      var h=card.querySelector(".learnworlds-heading3"); if(!h) return;
      var level, name;
      var badge=h.querySelector(".course-level-badge"), ct=h.querySelector(".course-title");
      if(badge && ct){ level=((badge.textContent.match(/(\d+)/)||[])[1]); name=ct.textContent.trim(); }
      else { var m=h.textContent.trim().match(/^Niveau\s*#?\s*(\d+)\s*-\s*(.+)$/i); if(m){ level=m[1]; name=m[2]; } }
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

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
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
