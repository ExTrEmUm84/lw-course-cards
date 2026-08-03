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
    /* Figtree sur tous les titres et textes (le template est en Poppins/Raleway).
       🔴 `:not(.learnworlds-icon)` PARTOUT : sur ce template, des `.learnworlds-subheading`
       (et heading) sont AUSSI des icônes FontAwesome (bandeau stats) — forcer une police
       dessus casse le glyphe (carrés vides). On exclut donc les icônes des règles de police. */
    [H+" h1:not(.learnworlds-icon)",H+" h2:not(.learnworlds-icon)",H+" h3:not(.learnworlds-icon)",H+" h4:not(.learnworlds-icon)",
     H+" .learnworlds-heading:not(.learnworlds-icon)",H+" .learnworlds-subheading:not(.learnworlds-icon)",
     H+" .learnworlds-heading3:not(.learnworlds-icon)",H+" .learnworlds-heading4:not(.learnworlds-icon)",H+" .learnworlds-main-text",
     H+" .learnworlds-main-text-large",H+" .learnworlds-main-text-small",H+" p",H+" li",H+" a"].join(",")+"{"+FT+"}",
    /* Grands titres (H1) : graisse forte + interlettrage serré, couleur texte du site. */
    H+" h1.learnworlds-heading:not(.learnworlds-icon),"+H+" .learnworlds-heading:not(.learnworlds-icon){font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;}",
    /* Corps de texte : gris doux du site. */
    H+" .learnworlds-main-text,"+H+" .learnworlds-main-text-large,"+H+" .learnworlds-main-text-small{color:var(--ps-text-soft,#676879) !important;line-height:1.65 !important;}",

    /* ================= 2) TITRES DE SECTION = MARINE (premium, comme la maquette) ================= */
    /* Les grands titres de section (`.learnworlds-subheading`) en MARINE #243B6B — pas
       en accent (le tout-bleu faisait « pas premium »). L'accent reste pour boutons /
       icônes / liens / dates. 🔴 hors icônes (cf. ci-dessus) ; le bandeau stats repasse
       ses titres en blanc plus bas. */
    H+" .learnworlds-subheading:not(.learnworlds-icon){"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-marine,#243B6B) !important;}",

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

    /* ================= 6) BANDEAU STATS (compteurs) — REFONTE PREMIUM =================
       Fond MARINE #243B6B. Chaque cellule est une PILE CENTRÉE : badge picto (SVG
       ligne custom, injecté par buildStats) -> grand chiffre -> libellé. Révélation
       au scroll EN CASCADE. Le compteur natif LW (0 -> cible) est conservé tel quel.
       (Retour Ziad : « pas bien centré », « plus premium », « animation », « pictos
       plus premium ».) */
    H+" .ps-home-stats{background:#243B6B !important;}",
    /* rangée : grille de 4 colonnes égalisée et centrée */
    H+" .ps-home-stats .lw-cols.main{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:28px 24px !important;max-width:1080px !important;margin:0 auto !important;align-items:start !important;}",
    "@media(max-width:820px){"+H+" .ps-home-stats .lw-cols.main{grid-template-columns:repeat(2,1fr) !important;gap:40px 24px !important;}}",
    "@media(max-width:480px){"+H+" .ps-home-stats .lw-cols.main{grid-template-columns:1fr !important;}}",
    /* cellule = pile centrée + état de révélation */
    H+" .ps-home-stats .ps-stat{display:flex !important;flex-direction:column !important;align-items:center !important;text-align:center !important;opacity:0 !important;transform:translateY(18px) !important;transition:opacity .6s ease,transform .6s ease !important;}",
    H+" .ps-home-stats.ps-in .ps-stat{opacity:1 !important;transform:none !important;}",
    /* cascade : léger décalage colonne par colonne */
    H+" .ps-home-stats .lw-cols.main > .col:nth-child(2) .ps-stat{transition-delay:.08s !important;}",
    H+" .ps-home-stats .lw-cols.main > .col:nth-child(3) .ps-stat{transition-delay:.16s !important;}",
    H+" .ps-home-stats .lw-cols.main > .col:nth-child(4) .ps-stat{transition-delay:.24s !important;}",
    /* rangée interne icône+chiffre -> COLONNE centrée (au lieu de côte à côte) */
    H+" .ps-home-stats .ps-stat .with-flexible-parts{display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:flex-start !important;}",
    H+" .ps-home-stats .ps-stat .flexible-part{width:auto !important;margin:0 !important;}",
    /* badge picto : cercle translucide sur le marine */
    H+" .ps-home-stats .ps-stat-ic{display:inline-flex !important;align-items:center !important;justify-content:center !important;width:56px !important;height:56px !important;border-radius:50% !important;background:rgba(255,255,255,.08) !important;border:1px solid rgba(255,255,255,.16) !important;color:#BFD0EC !important;margin:0 0 18px !important;}",
    H+" .ps-home-stats .ps-stat-ic svg{width:26px !important;height:26px !important;stroke:currentColor !important;fill:none !important;stroke-width:1.9 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    /* chiffre : grand, blanc */
    [H+" .ps-home-stats .progress-container_counter",H+" .ps-home-stats .progress-container_counter h2"].join(",")+"{"+FT+"font-size:46px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1 !important;color:#fff !important;margin:0 !important;}",
    "@media(max-width:820px){"+[H+" .ps-home-stats .progress-container_counter",H+" .ps-home-stats .progress-container_counter h2"].join(",")+"{font-size:40px !important;}}",
    /* libellé reconstruit en 2 spans par buildStats (le contenu natif est
       incohérent : certaines cellules ont un <div> 2e ligne, une autre a un
       texte fusionné « reçoiventune » sans espace). Ligne principale
       semi-grasse + sous-ligne RÉGULIÈRE nettement plus légère (fin du « tout
       en gras »). text-wrap:balance évite les orphelins (« K) » seul). */
    H+" .ps-home-stats [data-magic='title']{"+FT+"margin:14px auto 0 !important;max-width:250px !important;letter-spacing:normal !important;text-transform:none !important;}",
    H+" .ps-home-stats .ps-stat-lbl{display:block !important;font-size:15px !important;font-weight:600 !important;color:#EAF1FB !important;line-height:1.35 !important;text-wrap:balance !important;}",
    H+" .ps-home-stats .ps-stat-sub{display:block !important;font-size:13.5px !important;font-weight:400 !important;color:#93A6C6 !important;line-height:1.4 !important;margin-top:4px !important;text-wrap:balance !important;}",
    /* pas de marge native parasite autour du compteur (espacement chiffre↔libellé) */
    [H+" .ps-home-stats .lw-progress",H+" .ps-home-stats .progress-container_counter"].join(",")+"{margin:0 !important;padding:0 !important;}",
    /* note de bas de bandeau : centrée et discrète (était collée à gauche) */
    H+" .ps-home-stats .learnworlds-main-text{color:#8DA0C2 !important;text-align:center !important;font-size:13px !important;max-width:760px !important;margin-left:auto !important;margin-right:auto !important;}",

    /* ================= 6b) HERO (section 2 : texte | vidéo) ================= */
    /* Section repérée en JS par la présence de la vidéo (`.ps-home-hero`). Colonnes
       centrées verticalement, titre (H4) agrandi en vrai titre hero, vidéo arrondie
       + ombre portée. */
    H+" .ps-home-hero .lw-cols{align-items:center !important;}",
    H+" .ps-home-hero .learnworlds-heading4{"+FT+"font-size:40px !important;font-weight:800 !important;letter-spacing:-.03em !important;line-height:1.1 !important;color:var(--ps-text,#1c1f26) !important;margin:0 0 14px !important;}",
    H+" .ps-home-hero .learnworlds-main-text{font-size:17px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;}",
    H+" .ps-home-hero .learnworlds-video-iframe,"+H+" .ps-home-hero iframe{border-radius:16px !important;overflow:hidden !important;box-shadow:0 18px 50px rgba(15,23,42,.16) !important;}",
    "@media(max-width:820px){"+H+" .ps-home-hero .learnworlds-heading4{font-size:30px !important;}}",

    /* ---- HERO MODE VIDÉO PLEIN ÉCRAN (classe .ps-hero-bg posée par heroVideoBg) :
         vidéo Vimeo en fond (background=1 : autoplay muet en boucle), voile sombre,
         contenu blanc par-dessus. Section pleine largeur (100vw) + ~90vh de haut. ---- */
    H+" .ps-home-hero.ps-hero-bg{position:relative !important;min-height:90vh !important;display:flex !important;align-items:center !important;overflow:hidden !important;width:100vw !important;margin-left:calc(50% - 50vw) !important;padding:0 !important;background:#0f1b33 !important;}",
    H+" .ps-hero-vwrap{position:absolute !important;inset:0 !important;overflow:hidden !important;z-index:0 !important;}",
    /* 🔴 iframe DÉCALÉE À DROITE (left:68% au lieu de 50%) : le sujet de la vidéo se
       déplace dans la moitié droite, dégagée du panneau de texte. */
    H+" .ps-hero-vwrap iframe{position:absolute !important;top:50% !important;left:68% !important;transform:translate(-50%,-50%) !important;width:100vw !important;height:56.25vw !important;min-width:177.78vh !important;min-height:100vh !important;border:0 !important;border-radius:0 !important;box-shadow:none !important;pointer-events:none !important;}",
    /* 🔴 dégradé : panneau sombre sur la gauche (texte) qui s'ouvre vers ~60% pour
       laisser voir la vidéo sur toute la droite. */
    H+" .ps-hero-scrim{position:absolute !important;inset:0 !important;z-index:1 !important;background:linear-gradient(90deg,rgba(12,22,44,.97) 0%,rgba(12,22,44,.92) 30%,rgba(12,22,44,.5) 48%,rgba(12,22,44,0) 64%) !important;}",
    /* contenu aligné sur la grille du reste de la page (~1180px centrés = même bord
       gauche que les titres de section), pas 1000px. */
    H+" .ps-home-hero.ps-hero-bg .lw-cols{position:relative !important;z-index:2 !important;max-width:1180px !important;margin:0 auto !important;width:100% !important;padding:0 24px !important;align-items:center !important;}",
    H+" .ps-home-hero.ps-hero-bg .ps-hero-vidcol{display:none !important;}",
    H+" .ps-home-hero.ps-hero-bg .lw-cols > .col{width:100% !important;max-width:640px !important;flex:1 1 auto !important;}",
    [H+" .ps-home-hero.ps-hero-bg .learnworlds-heading4",H+" .ps-home-hero.ps-hero-bg .learnworlds-heading",H+" .ps-home-hero.ps-hero-bg .learnworlds-subheading",H+" .ps-home-hero.ps-hero-bg .learnworlds-main-text"].join(",")+"{color:#fff !important;}",
    H+" .ps-home-hero.ps-hero-bg .learnworlds-heading4{font-size:46px !important;}",
    "@media(max-width:820px){"+H+" .ps-home-hero.ps-hero-bg{min-height:78vh !important;}"+H+" .ps-home-hero.ps-hero-bg .learnworlds-heading4{font-size:32px !important;}}",
    /* boutons de contrôle du hero vidéo : volume + « Regarder la vidéo » (popup) */
    H+" .ps-hero-ctrls{position:absolute !important;bottom:32px !important;right:34px !important;z-index:3 !important;display:flex !important;align-items:center !important;gap:12px !important;}",
    H+" .ps-hero-btn{display:inline-flex !important;align-items:center !important;gap:9px !important;background:rgba(255,255,255,.14) !important;border:1px solid rgba(255,255,255,.4) !important;color:#fff !important;border-radius:999px !important;cursor:pointer !important;"+FT+"font-weight:600 !important;font-size:14px !important;line-height:1 !important;transition:background .18s ease !important;}",
    H+" .ps-hero-btn:hover{background:rgba(255,255,255,.28) !important;}",
    H+" .ps-hero-vol{width:44px !important;height:44px !important;justify-content:center !important;padding:0 !important;}",
    H+" .ps-hero-watch{padding:11px 18px !important;}",
    H+" .ps-hero-btn svg{width:19px !important;height:19px !important;stroke:currentColor !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;flex:none !important;}",
    "@media(max-width:600px){"+H+" .ps-hero-ctrls{bottom:20px !important;right:20px !important;}"+H+" .ps-hero-watch span{display:none !important;}"+H+" .ps-hero-watch{width:44px !important;height:44px !important;padding:0 !important;justify-content:center !important;}}",
    /* modale lecteur (ajoutée à <body>, hors #pageContent) */
    "body.slug-home .ps-hero-modal{position:fixed !important;inset:0 !important;z-index:99999 !important;background:rgba(8,14,28,.9) !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:24px !important;}",
    "body.slug-home .ps-hero-modal-inner{position:relative !important;width:min(1000px,92vw) !important;aspect-ratio:16/9 !important;border-radius:14px !important;overflow:hidden !important;box-shadow:0 30px 80px rgba(0,0,0,.55) !important;background:#000 !important;}",
    "body.slug-home .ps-hero-modal-inner iframe{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;border:0 !important;}",
    "body.slug-home .ps-hero-modal-x{position:absolute !important;top:-48px !important;right:0 !important;width:40px !important;height:40px !important;border-radius:50% !important;background:rgba(255,255,255,.16) !important;border:1px solid rgba(255,255,255,.4) !important;color:#fff !important;cursor:pointer !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
    "body.slug-home .ps-hero-modal-x svg{width:20px !important;height:20px !important;stroke:currentColor !important;stroke-width:2 !important;fill:none !important;}",

    /* Placeholders du template (« Write your awesome label here. ») masqués. */
    H+" .ps-home-hide{display:none !important;}",

    /* ================= 6c) CABINETS : mur de logos monochromes ================= */
    /* Section `.ps-home-cabinets` : on masque les rangées de 16 pastilles natives
       (buildCabinets en JS) et on construit une grille de cellules-logos. Logo image
       hébergé quand dispo (grayscale + couleur au survol), sinon nom stylé (repli). */
    H+" .ps-cabgrid{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:12px !important;max-width:1000px !important;margin:22px auto 0 !important;}",
    H+" .ps-cabcell{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:14px !important;height:78px !important;display:flex !important;align-items:center !important;justify-content:center !important;padding:14px 18px !important;box-shadow:0 3px 12px rgba(15,23,42,.05) !important;transition:box-shadow .2s ease,transform .2s ease !important;}",
    H+" .ps-cabcell:hover{box-shadow:0 12px 26px rgba(15,23,42,.10) !important;transform:translateY(-2px) !important;}",
    H+" .ps-cablogo{max-width:100% !important;max-height:42px !important;object-fit:contain !important;filter:grayscale(1) !important;opacity:.72 !important;transition:filter .2s ease,opacity .2s ease !important;}",
    H+" .ps-cabcell:hover .ps-cablogo{filter:none !important;opacity:1 !important;}",
    H+" .ps-cabtext{"+FT+"font-weight:800 !important;font-size:15px !important;color:#8A93A5 !important;letter-spacing:-.01em !important;text-align:center !important;line-height:1.2 !important;transition:color .2s ease !important;}",
    H+" .ps-cabcell:hover .ps-cabtext{color:var(--ps-accent,#507EC5) !important;}",
    "@media(max-width:820px){"+H+" .ps-cabgrid{grid-template-columns:repeat(2,1fr) !important;}}",

    /* ================= 7) BANDES NEUTRES (#f5f3f5) ================= */
    /* Les sections à fond gris-rosé du template : on garde une bande neutre, mais on
       la pose sur le gris DA (plus froid, cohérent). Classe `.ps-home-soft` en JS. */
    H+" .ps-home-soft{background:var(--ps-surface-soft,#F6F8FB) !important;}",

    /* ================= 8) IMAGES ================= */
    H+" .learnworlds-image{border-radius:var(--ps-r-card,16px) !important;}",

    /* ================= 9) SECTIONS SPÉCIFIQUES ================= */
    /* --- CARTES OFFRES / ATOUTS (classes .ps-hcard/.ps-hgrid posées en JS, pas de :has) --- */
    H+" .ps-hcard{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 16px rgba(15,23,42,.05) !important;padding:24px !important;margin:0 !important;width:auto !important;transition:box-shadow .2s ease,transform .2s ease !important;}",
    H+" .ps-hcard:hover{box-shadow:0 12px 30px rgba(0,0,0,.09) !important;transform:translateY(-3px) !important;}",
    /* atouts : la rangée des cartes passe en grille de 4 */
    H+" .ps-home-atouts .ps-hgrid{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:14px !important;}",
    "@media(max-width:820px){"+H+" .ps-home-atouts .ps-hgrid{grid-template-columns:repeat(2,1fr) !important;}}",
    /* --- OFFRES : refonte premium (demande Ziad : « trop collé », « pas premium »,
       « texte de différentes tailles »). Les 2 cartes MOOCs/Webinars sont des
       colonnes NATIVES asymétriques (sous-titre fané côté Webinars, boutons
       plein/outline de largeurs différentes, <br><br> en guise d'espacement,
       font-size inline baladeurs dans l'intro). On rééquilibre TOUT en CSS :
       grille égalisée, plus d'air, hiérarchie sous-titre≠corps, bouton collé
       en bas et pleine largeur sur les deux cartes. --- */
    H+" .ps-home-offres .lw-cols.multiple-rows{display:grid !important;grid-template-columns:1fr 1fr !important;gap:40px !important;max-width:1040px !important;margin:10px auto 0 !important;align-items:stretch !important;}",
    "@media(max-width:820px){"+H+" .ps-home-offres .lw-cols.multiple-rows{grid-template-columns:1fr !important;gap:22px !important;}}",
    /* carte : plus d'air, colonne flex pour coller le bouton en bas */
    H+" .ps-home-offres .ps-hcard{display:flex !important;flex-direction:column !important;height:100% !important;padding:36px 34px !important;}",
    H+" .ps-home-offres .ps-hcard .flexible-part{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;width:100% !important;}",
    /* icône : tuile arrondie tint accent, plus grande, de l'air dessous */
    [H+" .ps-home-offres .box-icon-wrapper",H+" .ps-home-offres .learnworlds-icon-wrapper"].join(",")+"{display:flex !important;align-items:center !important;justify-content:center !important;border-radius:16px !important;width:58px !important;height:58px !important;margin:0 0 22px !important;flex:none !important;align-self:flex-start !important;}",
    [H+" .ps-home-offres .box-icon-wrapper .learnworlds-icon",H+" .ps-home-offres .learnworlds-icon-wrapper .learnworlds-icon"].join(",")+"{font-size:25px !important;}",
    /* titre */
    H+" .ps-home-offres .learnworlds-heading3{font-size:23px !important;margin:0 0 10px !important;}",
    /* on neutralise les <br><br> natifs (espacement crade) : marges maîtrisées */
    H+" .ps-home-offres .ps-hcard .learnworlds-main-text-large br{display:none !important;}",
    /* sous-titre méta (col-description) : eyebrow accent en petites capitales —
       bat aussi la couleur fanée (fadeout20) de la carte Webinars. */
    H+" .ps-home-offres [data-magic='col-description']{"+FT+"font-size:12.5px !important;font-weight:700 !important;letter-spacing:.05em !important;text-transform:uppercase !important;color:var(--ps-accent,#507EC5) !important;line-height:1.45 !important;margin:0 0 16px !important;}",
    /* corps : paragraphe lisible gris doux (hiérarchie claire vs sous-titre) */
    H+" .ps-home-offres [data-element-id='textLarge']{"+FT+"font-size:15.5px !important;font-weight:500 !important;color:var(--ps-text-soft,#676879) !important;line-height:1.65 !important;margin:0 0 26px !important;}",
    /* bouton : pleine largeur, collé en bas, mêmes dimensions sur les 2 cartes */
    H+" .ps-home-offres .learnworlds-button-wrapper{margin-top:auto !important;width:100% !important;}",
    H+" .ps-home-offres .learnworlds-button{width:100% !important;padding:14px 24px !important;font-size:15px !important;font-weight:700 !important;}",
    /* intro de section : neutralise les font-size:1.7rem inline baladeurs */
    H+" .ps-home-offres [data-element-id='textNormal']{font-size:17px !important;line-height:1.65 !important;}",
    H+" .ps-home-offres [data-element-id='textNormal'] span{font-size:inherit !important;letter-spacing:normal !important;}",
    H+" .ps-home-offres [data-element-id='textNormal'] b{color:var(--ps-marine,#243B6B) !important;}",
    H+" .ps-home-atouts .learnworlds-heading3{font-size:16px !important;color:var(--ps-marine,#243B6B) !important;margin-top:12px !important;}",
    /* 🔴 carte atout : picto CENTRÉ EN HAUT, contenu centré (demande Ziad) —
       la carte passe en colonne, l'icône (1er enfant) se centre au-dessus du titre+desc. */
    H+" .ps-home-atouts .ps-hcard{display:flex !important;flex-direction:column !important;align-items:center !important;text-align:center !important;padding:30px 22px !important;}",
    [H+" .ps-home-atouts .ps-hcard .box-icon-wrapper",H+" .ps-home-atouts .ps-hcard .learnworlds-icon-wrapper"].join(",")+"{margin:0 auto 4px !important;width:64px !important;height:64px !important;}",
    H+" .ps-home-atouts .ps-hcard .flexible-part{width:100% !important;}",
    H+" .ps-home-atouts .ps-hcard .box-icon-wrapper .learnworlds-icon,"+H+" .ps-home-atouts .ps-hcard .learnworlds-icon-wrapper .learnworlds-icon{font-size:24px !important;}",
    /* pictos SVG premium (buildAtouts) : les FontAwesome natifs (5x play-circle,
       receipt, question…) ne collent pas au sens -> remplacés par un SVG ligne
       assorti à chaque atout, dans le badge cercle tint. */
    [H+" .ps-home-atouts .box-icon-wrapper",H+" .ps-home-atouts .learnworlds-icon-wrapper"].join(",")+"{display:flex !important;align-items:center !important;justify-content:center !important;}",
    H+" .ps-home-atouts .ps-atout-ic{display:inline-flex !important;align-items:center !important;justify-content:center !important;}",
    H+" .ps-home-atouts .ps-atout-ic svg{width:28px !important;height:28px !important;stroke:var(--ps-accent,#507EC5) !important;fill:none !important;stroke-width:1.9 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    /* révélation au scroll en cascade (transform reveal .3s -> le hover -3px reste vif) */
    H+" .ps-home-atouts .ps-hcard{opacity:0 !important;transform:translateY(18px) !important;transition:opacity .5s ease,transform .3s ease,box-shadow .2s ease !important;}",
    H+" .ps-home-atouts.ps-in .ps-hcard{opacity:1 !important;transform:translateY(0) !important;}",
    H+" .ps-home-atouts.ps-in .ps-hgrid > .ps-hcard:nth-child(4n+2){transition-delay:.06s !important;}",
    H+" .ps-home-atouts.ps-in .ps-hgrid > .ps-hcard:nth-child(4n+3){transition-delay:.12s !important;}",
    H+" .ps-home-atouts.ps-in .ps-hgrid > .ps-hcard:nth-child(4n){transition-delay:.18s !important;}",

    /* --- 5) BANDE « Avez-vous besoin d'une formation » (constat) — REFONTE :
       titre centré, mais le CORPS passe en COLONNE DE LECTURE alignée à gauche
       (un pavé de ~1800 caractères centré est illisible). Les « Fait #1/#2 »
       sont extraits en CALLOUTS d'accent (buildCta), et les <br><br> natifs
       remplacés par des marges maîtrisées. --- */
    H+" .ps-home-cta [data-magic='title']{text-align:center !important;margin:0 auto 6px !important;max-width:860px !important;}",
    H+" .ps-home-cta [data-element-id='textNormal']{"+FT+"max-width:760px !important;margin:20px auto 0 !important;text-align:left !important;font-size:16.5px !important;line-height:1.75 !important;color:var(--ps-text-soft,#676879) !important;}",
    H+" .ps-home-cta .ps-cta-p{margin:0 0 18px !important;}",
    H+" .ps-home-cta .ps-cta-sp{display:none !important;}",   /* espaceurs <br> natifs -> marges */
    H+" .ps-home-cta .ps-cta-fact{display:flex !important;align-items:center !important;gap:14px !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-left:4px solid var(--ps-accent,#507EC5) !important;border-radius:12px !important;padding:16px 20px !important;margin:22px 0 !important;box-shadow:0 4px 16px rgba(15,23,42,.05) !important;}",
    H+" .ps-home-cta .ps-cta-fact-badge{flex:none !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;padding:5px 11px !important;border-radius:999px !important;background:var(--ps-accent-tint,#EDF4FF) !important;color:var(--ps-accent-hover,#486798) !important;"+FT+"font-size:11.5px !important;font-weight:800 !important;letter-spacing:.04em !important;text-transform:uppercase !important;white-space:nowrap !important;}",
    H+" .ps-home-cta .ps-cta-fact-txt{"+FT+"font-size:16px !important;font-weight:700 !important;color:var(--ps-marine,#243B6B) !important;line-height:1.45 !important;}",

    /* --- 6) PREUVE (graphes 1% / 90%) — REFONTE : les 2 « tables » sont des IMAGES
       de graphes enfermées dans un widget « écran » natif LW (cadre daté + légende
       vide + cadre 16:9 qui ROGNE le graphe). buildPreuve() les réinjecte en <img>
       PLEIN (non rogné) dans une carte propre. Titres au-dessus, conclusion forte
       centrée dessous, révélation au scroll. --- */
    H+" .ps-home-preuve .lw-cols.one-row{display:grid !important;grid-template-columns:1fr 1fr !important;gap:30px !important;max-width:1080px !important;margin:0 auto !important;align-items:start !important;}",
    "@media(max-width:860px){"+H+" .ps-home-preuve .lw-cols.one-row{grid-template-columns:1fr !important;gap:24px !important;}}",
    H+" .ps-home-preuve .learnworlds-heading4{"+FT+"color:var(--ps-marine,#243B6B) !important;font-size:18px !important;font-weight:800 !important;letter-spacing:-.01em !important;text-align:center !important;margin:0 0 14px !important;}",
    H+" .ps-home-preuve .ps-preuve-graph{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 6px 22px rgba(15,23,42,.07) !important;padding:16px !important;overflow:hidden !important;opacity:0 !important;transform:translateY(18px) !important;transition:opacity .6s ease,transform .6s ease !important;}",
    H+" .ps-home-preuve.ps-in .ps-preuve-graph{opacity:1 !important;transform:none !important;}",
    H+" .ps-home-preuve .lw-cols.one-row > .col:nth-child(2) .ps-preuve-graph{transition-delay:.1s !important;}",
    H+" .ps-home-preuve .ps-preuve-graph img{display:block !important;width:100% !important;height:auto !important;border-radius:8px !important;}",
    /* conclusion : phrase forte marine centrée + note légère */
    H+" .ps-home-preuve .learnworlds-heading3{"+FT+"color:var(--ps-marine,#243B6B) !important;font-weight:800 !important;font-size:28px !important;letter-spacing:-.02em !important;text-align:center !important;max-width:820px !important;margin:40px auto 10px !important;line-height:1.25 !important;}",
    H+" .ps-home-preuve .learnworlds-main-text:not(.ps-home-hide){"+FT+"text-align:center !important;color:var(--ps-text-soft,#676879) !important;font-size:16px !important;max-width:680px !important;margin:0 auto !important;}",

    /* --- 8) PROFILS v2 (buildProfils) : REFONTE — donut animé (répartition) + 2 cartes
         profils à pastilles + cabinets en TIERS à chips. Le natif (pie moche + accordéons
         + liste) est masqué. Fond doux, contenu en cartes blanches. --- */
    [H+" .ps-home-profils",H+" .ps-home-profils .learnworlds-section-content"].join(",")+"{background:var(--ps-surface-soft,#F6F8FB) !important;}",
    /* 🔴 un seul fond : le calque bleu du template (.learnworlds-section-overlay.lw-brand-bg
       #3887B4) est neutralisé, sinon on voit un cadre bleu autour du fond doux. */
    H+" .ps-home-profils .learnworlds-section-overlay{background:transparent !important;background-color:transparent !important;opacity:0 !important;}",
    /* colonnes de MÊME largeur + MÊME hauteur (align stretch) */
    H+" .ps-pf2{display:grid !important;grid-template-columns:1fr 1fr !important;gap:18px !important;max-width:1000px !important;margin:24px auto 0 !important;align-items:stretch !important;}",
    H+" .ps-pf2-left{display:flex !important;flex-direction:column !important;gap:14px !important;}",
    /* carte donut */
    H+" .ps-donutcard{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;padding:22px !important;display:flex !important;align-items:center !important;gap:18px !important;}",
    H+" .ps-donut{width:132px !important;height:132px !important;flex:none !important;}",
    H+" .ps-donut-seg{transition:stroke-dashoffset 1s cubic-bezier(.35,0,.2,1) !important;}",
    H+" .ps-pf2.ps-in .ps-donut-seg{stroke-dashoffset:0 !important;}",
    H+" .ps-donut-c{"+FT+"font-weight:800 !important;fill:var(--ps-marine,#243B6B) !important;}",
    H+" .ps-donut-cs{"+FT+"font-weight:600 !important;fill:var(--ps-text-soft,#676879) !important;}",
    H+" .ps-donut-leg{display:flex !important;flex-direction:column !important;gap:7px !important;flex:1 !important;min-width:0 !important;}",
    H+" .ps-donut-leg-i{display:flex !important;align-items:center !important;gap:8px !important;"+FT+"font-size:12.5px !important;color:var(--ps-text,#1c1f26) !important;}",
    H+" .ps-donut-dot{width:10px !important;height:10px !important;border-radius:3px !important;flex:none !important;}",
    H+" .ps-donut-val{margin-left:auto !important;font-weight:700 !important;color:var(--ps-marine,#243B6B) !important;}",
    /* cartes profils */
    H+" .ps-pfcard{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;padding:20px !important;}",
    H+" .ps-pfcard-h{display:flex !important;align-items:center !important;gap:11px !important;margin-bottom:11px !important;}",
    H+" .ps-pfcard-ic{width:42px !important;height:42px !important;border-radius:12px !important;background:var(--ps-accent-tint,#EDF4FF) !important;color:var(--ps-accent,#507EC5) !important;display:flex !important;align-items:center !important;justify-content:center !important;flex:none !important;}",
    H+" .ps-pfcard-ic svg{width:22px !important;height:22px !important;stroke:currentColor !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    H+" .ps-pfcard-t{"+FT+"font-size:17px !important;font-weight:800 !important;color:var(--ps-marine,#243B6B) !important;}",
    H+" .ps-pfchips{display:flex !important;flex-wrap:wrap !important;gap:7px !important;margin-bottom:11px !important;}",
    H+" .ps-chip{display:inline-flex !important;align-items:center !important;"+FT+"font-size:12.5px !important;font-weight:600 !important;background:var(--ps-accent-tint,#EDF4FF) !important;color:var(--ps-marine,#243B6B) !important;padding:6px 12px !important;border-radius:999px !important;}",
    H+" .ps-pfcard-d{"+FT+"font-size:13.5px !important;color:var(--ps-text-soft,#676879) !important;line-height:1.6 !important;margin:0 !important;}",
    /* colonne droite : tiers cabinets */
    H+" .ps-pf2-right{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;padding:24px !important;display:flex !important;flex-direction:column !important;}",
    H+" .ps-pf2-right-t{"+FT+"font-size:17px !important;font-weight:800 !important;color:var(--ps-marine,#243B6B) !important;margin:0 0 16px !important;}",
    H+" .ps-tier{display:flex !important;gap:11px !important;align-items:flex-start !important;margin-bottom:12px !important;}",
    H+" .ps-tierbadge{display:inline-flex !important;align-items:center !important;justify-content:center !important;min-width:66px !important;height:26px !important;padding:0 10px !important;background:var(--ps-marine,#243B6B) !important;color:#fff !important;"+FT+"font-size:12px !important;font-weight:700 !important;border-radius:7px !important;flex:none !important;}",
    H+" .ps-tier-firms{display:flex !important;flex-wrap:wrap !important;gap:6px !important;}",
    H+" .ps-pf-callout{margin-top:auto !important;background:var(--ps-accent-tint,#EDF4FF) !important;border-radius:12px !important;padding:14px 16px !important;"+FT+"font-size:13.5px !important;color:var(--ps-marine,#243B6B) !important;font-weight:600 !important;line-height:1.5 !important;}",
    /* révélation au scroll */
    H+" .ps-pf-rise{opacity:0 !important;transform:translateY(16px) !important;transition:opacity .6s ease,transform .6s ease !important;}",
    H+" .ps-pf2.ps-in .ps-pf-rise{opacity:1 !important;transform:none !important;}",
    "@media(max-width:820px){"+H+" .ps-pf2{grid-template-columns:1fr !important;}"+H+" .ps-donutcard{flex-direction:column !important;text-align:center !important;}}",

    /* --- 10) HISTOIRE : timeline HORIZONTALE moderne, reconstruite en JS (`buildTimeline`)
         et révélée au scroll. Le natif vertical est masqué. --- */
    H+" .ps-timeline{display:grid !important;grid-template-columns:repeat(4,1fr) !important;max-width:1000px !important;margin:40px auto 0 !important;}",
    H+" .ps-tl-node{text-align:center !important;padding:0 10px !important;opacity:0 !important;transform:translateY(20px) !important;transition:opacity .6s ease,transform .6s ease !important;}",
    H+" .ps-timeline.ps-in .ps-tl-node{opacity:1 !important;transform:none !important;}",
    H+" .ps-tl-date{"+FT+"font-weight:800 !important;font-size:17px !important;letter-spacing:-.01em !important;color:var(--ps-marine,#243B6B) !important;margin:0 0 16px !important;min-height:1.3em !important;}",
    H+" .ps-tl-dotwrap{position:relative !important;height:20px !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
    [H+" .ps-tl-dotwrap::before",H+" .ps-tl-dotwrap::after"].join(",")+"{content:'' !important;position:absolute !important;top:50% !important;transform:translateY(-50%) !important;height:2px !important;width:calc(50% - 9px) !important;background:#C7D8F0 !important;}",
    H+" .ps-tl-dotwrap::before{right:calc(50% + 9px) !important;}",
    H+" .ps-tl-dotwrap::after{left:calc(50% + 9px) !important;}",
    H+" .ps-tl-node:first-child .ps-tl-dotwrap::before{display:none !important;}",
    H+" .ps-tl-node:last-child .ps-tl-dotwrap::after{display:none !important;}",
    H+" .ps-tl-dot{width:18px !important;height:18px !important;border-radius:50% !important;background:var(--ps-accent,#507EC5) !important;border:4px solid #fff !important;box-shadow:0 0 0 2px var(--ps-accent,#507EC5),0 4px 12px rgba(80,126,197,.45) !important;}",
    H+" .ps-tl-desc{"+FT+"font-size:14px !important;color:var(--ps-text-soft,#676879) !important;margin-top:16px !important;line-height:1.5 !important;}",
    "@media(max-width:720px){"+H+" .ps-timeline{grid-template-columns:1fr !important;gap:26px !important;}"+H+" .ps-tl-dotwrap::before,"+H+" .ps-tl-dotwrap::after{display:none !important;}}",

    /* --- 11) ÉQUIPE : images arrondies. 🔴 Le panneau `.lw-brand-bg` (bleu vif du
         template #3887B4) passe en MARINE #243B6B avec TEXTE BLANC — sinon les noms
         (marine) et bios (gris) étaient sombre-sur-bleu = illisibles. Spécificité
         renforcée (`.lw-brand-bg .learnworlds-*`) pour battre la règle globale. --- */
    H+" .ps-home-equipe .learnworlds-image{border-radius:16px !important;}",
    H+" .ps-home-equipe .learnworlds-heading3{color:var(--ps-marine,#243B6B) !important;font-size:18px !important;}",
    H+" .ps-home-equipe .learnworlds-heading4{color:var(--ps-accent,#507EC5) !important;font-weight:700 !important;}",
    H+" .ps-home-equipe .lw-brand-bg{background:#243B6B !important;}",
    [H+" .ps-home-equipe .lw-brand-bg .learnworlds-heading3",H+" .ps-home-equipe .lw-brand-bg .learnworlds-heading4",H+" .ps-home-equipe .lw-brand-bg .learnworlds-heading:not(.learnworlds-icon)",H+" .ps-home-equipe .lw-brand-bg .learnworlds-main-text",H+" .ps-home-equipe .lw-brand-bg p"].join(",")+"{color:#fff !important;}",

    /* --- 11b) ÉQUIPE — REFONTE : le widget natif est un système d'ONGLETS
       (Les Fondateurs / L'équipe / Les coachs) sans photos. buildEquipe() le
       convertit en grille de CARTES groupées, avatar à INITIALES (ou picto pour
       les pools de coachs), nom + rôle + bio. Onglets natifs masqués. --- */
    H+" .ps-home-equipe .ps-team{max-width:1080px !important;margin:26px auto 0 !important;}",
    H+" .ps-home-equipe .ps-team-group{margin-top:44px !important;}",
    H+" .ps-home-equipe .ps-team-group:first-child{margin-top:12px !important;}",
    H+" .ps-home-equipe .ps-team-gt{"+FT+"font-size:13px !important;font-weight:800 !important;text-transform:uppercase !important;letter-spacing:.06em !important;color:var(--ps-accent,#507EC5) !important;text-align:center !important;margin:0 0 22px !important;}",
    H+" .ps-home-equipe .ps-team-grid{display:grid !important;grid-template-columns:repeat(4,1fr) !important;gap:18px !important;justify-content:center !important;}",
    "@media(max-width:900px){"+H+" .ps-home-equipe .ps-team-grid{grid-template-columns:repeat(2,1fr) !important;}}",
    "@media(max-width:520px){"+H+" .ps-home-equipe .ps-team-grid{grid-template-columns:1fr !important;}}",
    H+" .ps-home-equipe .ps-team-card{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 4px 16px rgba(15,23,42,.05) !important;padding:24px 20px !important;display:flex !important;flex-direction:column !important;align-items:center !important;text-align:center !important;opacity:0 !important;transform:translateY(16px) !important;transition:opacity .5s ease,transform .3s ease,box-shadow .2s ease !important;}",
    H+" .ps-home-equipe.ps-in .ps-team-card{opacity:1 !important;transform:translateY(0) !important;}",
    H+" .ps-home-equipe .ps-team-card:hover{box-shadow:0 12px 30px rgba(15,23,42,.10) !important;transform:translateY(-3px) !important;}",
    H+" .ps-home-equipe .ps-team-av{width:62px !important;height:62px !important;border-radius:50% !important;background:var(--ps-accent-tint,#EDF4FF) !important;color:var(--ps-accent-hover,#486798) !important;display:flex !important;align-items:center !important;justify-content:center !important;"+FT+"font-weight:800 !important;font-size:21px !important;letter-spacing:.02em !important;margin:0 0 14px !important;flex:none !important;}",
    H+" .ps-home-equipe .ps-team-av svg{width:27px !important;height:27px !important;stroke:currentColor !important;fill:none !important;stroke-width:1.8 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    H+" .ps-home-equipe .ps-team-name{"+FT+"font-size:16px !important;font-weight:800 !important;color:var(--ps-marine,#243B6B) !important;line-height:1.2 !important;}",
    H+" .ps-home-equipe .ps-team-role{"+FT+"font-size:12px !important;font-weight:700 !important;text-transform:uppercase !important;letter-spacing:.04em !important;color:var(--ps-accent,#507EC5) !important;margin:4px 0 0 !important;}",
    H+" .ps-home-equipe .ps-team-bio{"+FT+"font-size:13px !important;color:var(--ps-text-soft,#676879) !important;line-height:1.55 !important;margin:11px 0 0 !important;display:-webkit-box !important;-webkit-line-clamp:4 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* --- 12) ARTICLES : bouton « Charger plus » en outline centré --- */
    H+" .ps-home-articles .learnworlds-button{background:transparent !important;border:1.5px solid var(--ps-accent,#507EC5) !important;color:var(--ps-accent,#507EC5) !important;}",
    H+" .ps-home-articles .learnworlds-button:hover{background:var(--ps-accent,#507EC5) !important;color:#fff !important;}",

    /* --- 13) RDV : bande foncée #203866 -> titres blancs, bouton blanc.
         🔴 on cible AUSSI les titres en <div> (learnworlds-heading/subheading) sinon la
         règle globale marine gagne et le titre reste sombre sur fond sombre (illisible). */
    [H+" .ps-home-rdv h1.learnworlds-heading",H+" .ps-home-rdv h2",H+" .ps-home-rdv h3",H+" .ps-home-rdv h4",
     H+" .ps-home-rdv .learnworlds-heading:not(.learnworlds-icon)",H+" .ps-home-rdv .learnworlds-subheading:not(.learnworlds-icon)",
     H+" .ps-home-rdv .learnworlds-heading3:not(.learnworlds-icon)",H+" .ps-home-rdv .learnworlds-heading4:not(.learnworlds-icon)",H+" .ps-home-rdv .learnworlds-main-text"].join(",")+"{color:#fff !important;}",
    H+" .ps-home-rdv .learnworlds-button{background:#fff !important;border:0 !important;color:var(--ps-accent,#507EC5) !important;}",
    H+" .ps-home-rdv .learnworlds-button:hover{background:var(--ps-accent-tint,#EDF4FF) !important;color:var(--ps-accent-hover,#486798) !important;}",

    /* --- 14) FAQ : accordéon DA (buildFaq) — cartes arrondies, FERMÉ par défaut,
         toggle au clic, chevron qui tourne. Le natif chargeait tout ouvert. --- */
    H+" .ps-home-faq .faq-card{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 3px 14px rgba(15,23,42,.05) !important;margin-bottom:12px !important;overflow:hidden !important;padding:20px 22px !important;transition:box-shadow .2s ease !important;}",
    H+" .ps-home-faq .faq-card:hover{box-shadow:0 10px 26px rgba(15,23,42,.09) !important;}",
    [H+" .ps-home-faq .learnworlds-heading3",H+" .ps-home-faq .learnworlds-heading4"].join(",")+"{color:var(--ps-marine,#243B6B) !important;font-weight:700 !important;font-size:16px !important;}",
    H+" .ps-home-faq .ps-faq-q{cursor:pointer !important;}",
    H+" .ps-home-faq .ps-faq-body{max-height:0 !important;overflow:hidden !important;opacity:0 !important;margin-top:0 !important;transition:max-height .4s ease,opacity .3s ease,margin-top .3s ease !important;}",
    H+" .ps-home-faq .faq-card.ps-faq-open .ps-faq-body{max-height:1600px !important;opacity:1 !important;margin-top:10px !important;}",
    H+" .ps-home-faq .accordion-icon{transition:transform .3s ease !important;color:var(--ps-accent,#507EC5) !important;cursor:pointer !important;}",
    H+" .ps-home-faq .faq-card:not(.ps-faq-open) .accordion-icon{transform:rotate(180deg) !important;}"
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
  /* Chaque section repérée par le TEXTE de ses titres (robuste au réordonnancement).
     `htext` = concat des titres de la section. Une section = une classe stable. */
  var SECTAGS=[
    [/cabinets?\s+int[ée]gr/i,"ps-home-cabinets"],
    [/nos offres de formation/i,"ps-home-offres"],
    [/avez-vous besoin/i,"ps-home-cta"],
    [/assurance de rester|s[ée]lectivit[ée]/i,"ps-home-preuve"],
    [/pourquoi choisir prepastrat/i,"ps-home-atouts"],
    [/quel candidat/i,"ps-home-profils"],
    [/notre histoire/i,"ps-home-histoire"],
    [/qui sommes-nous/i,"ps-home-equipe"],
    [/derniers articles/i,"ps-home-articles"],
    [/prenez rendez-vous/i,"ps-home-rdv"],
    [/\bfaq\b/i,"ps-home-faq"]
  ];
  function marquer(){
    var secs=document.querySelectorAll(H+" section.learnworlds-section");
    secs.forEach(function(s){
      if(s.parentElement && s.parentElement.closest("section.learnworlds-section")) return; // sections de tête seulement
      if(s.querySelector(".progress-container_counter")) s.classList.add("ps-home-stats");
      /* hero = la section qui porte la vidéo (iframe / learnworlds-video-iframe) */
      if(s.querySelector(".learnworlds-video-iframe, iframe")) s.classList.add("ps-home-hero");
      /* tag par titre — on lit AUSSI les titres en <div> (learnworlds-heading/subheading),
         car sur ce template beaucoup de titres ne sont pas des balises h1-h4. */
      var htext=""; s.querySelectorAll("h1,h2,h3,h4,.learnworlds-heading,.learnworlds-subheading,.learnworlds-heading3,.learnworlds-heading4").forEach(function(x){ htext+=" "+(x.textContent||""); });
      SECTAGS.forEach(function(t){ if(t[0].test(htext)) s.classList.add(t[1]); });
      /* bande neutre : fond gris-rosé du template (rgb(245,243,245)) */
      var bg=getComputedStyle(s).backgroundColor;
      if(bg==="rgb(245, 243, 245)") s.classList.add("ps-home-soft");
    });
    /* Placeholders laissés par le template : on les masque. */
    document.querySelectorAll(H+" .learnworlds-main-text").forEach(function(t){
      if((t.textContent||"").replace(/\s+/g," ").trim()==="Write your awesome label here.") t.classList.add("ps-home-hide");
    });
  }

  /* Logos cabinets hébergés (dossier /logos, SVG transparents). Clé = nom
     normalisé. Repli = nom stylé si pas de logo. Ajouter un logo = déposer le SVG
     dans /logos + une ligne ici (le mur se recompose tout seul). */
  var LOGO_BASE="https://extremum84.github.io/lw-course-cards/logos/";
  var LOGOS={
    accenture:"accenture.svg",
    bain:"bain.svg", baincompany:"bain.svg",
    bcg:"bcg.svg", bcggamma:"bcg.svg", bostonconsultinggroup:"bcg.svg",
    eyconsulting:"ey.svg",
    eyparthenon:"ey-parthenon.svg",
    mckinsey:"mckinsey.svg", mckinseycompany:"mckinsey.svg",
    wavestone:"wavestone.svg"
  };
  function normName(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,""); }

  /* Reconstruit la section cabinets en mur de logos. Idempotent (ne rebuild pas
     si la grille existe). Masque les rangées de pastilles natives (sans toucher au
     titre) et insère une grille de cellules-logos à leur place. */
  function buildCabinets(){
    var sec=document.querySelector(H+" .ps-home-cabinets");
    if(!sec || sec.querySelector(".ps-cabgrid")) return;
    var btnRows=Array.prototype.slice.call(sec.querySelectorAll(".lw-cols")).filter(function(r){
      return r.querySelector(".learnworlds-button") && !r.querySelector("h1,h2,h3,h4");
    });
    if(!btnRows.length) return;
    var names=[];
    sec.querySelectorAll(".learnworlds-button").forEach(function(b){
      var n=(b.textContent||"").replace(/\s+/g," ").trim();
      if(n) names.push(n);
    });
    if(!names.length) return;
    var grid=document.createElement("div"); grid.className="ps-cabgrid";
    names.forEach(function(name){
      var cell=document.createElement("div"); cell.className="ps-cabcell";
      var file=LOGOS[normName(name)];
      if(file){
        var img=document.createElement("img");
        img.className="ps-cablogo"; img.src=LOGO_BASE+file; img.alt=name; img.loading="lazy";
        cell.appendChild(img);
      } else {
        var sp=document.createElement("span");
        sp.className="ps-cabtext"; sp.textContent=name;   // textContent : pas d'injection
        cell.appendChild(sp);
      }
      grid.appendChild(cell);
    });
    btnRows[0].parentNode.insertBefore(grid, btnRows[0]);
    btnRows.forEach(function(r){ r.classList.add("ps-home-hide"); });
  }

  /* Cartes offres/atouts SANS `:has` (peu fiable ici) : on tague en JS les colonnes
     qui portent une icône, et la rangée de la section atouts pour la passer en grille. */
  function cartes(){
    ["ps-home-offres","ps-home-atouts"].forEach(function(cl){
      var sec=document.querySelector(H+" ."+cl); if(!sec) return;
      sec.querySelectorAll(".lw-cols > .col").forEach(function(col){
        if(col.querySelector(".box-icon-wrapper, .learnworlds-icon-wrapper")) col.classList.add("ps-hcard");
      });
      if(cl==="ps-home-atouts"){
        sec.querySelectorAll(".lw-cols").forEach(function(row){
          if(row.querySelector(".ps-hcard")) row.classList.add("ps-hgrid");
        });
      }
    });
  }

  /* ================= BANDEAU STATS : pictos premium + révélation =================
     Chaque cellule (.lw-progress-wrapper) reçoit .ps-stat ; l'icône FontAwesome
     native est masquée et remplacée par un badge SVG (ligne, style Lucide). Le
     compteur natif LW n'est PAS touché (il continue d'animer 0 -> cible). La
     section reçoit .ps-in au scroll pour la cascade d'apparition. Idempotent. */
  var STAT_ICON={
    /* users (auditeurs libres) */
    user:'<svg viewBox="0 0 24 24"><path d="M16 21v-1.8a4 4 0 0 0-4-4H6.6a4 4 0 0 0-4 4V21"/><circle cx="9.3" cy="7.4" r="3.6"/><path d="M21.4 21v-1.8a4 4 0 0 0-3-3.87M16.6 3.9a3.6 3.6 0 0 1 0 7"/></svg>',
    /* graduation cap (candidats coachés intégrés) */
    grad:'<svg viewBox="0 0 24 24"><path d="M21.6 9.4 12 5 2.4 9.4 12 13.8l9.6-4.4Z"/><path d="M6 11.3V16c0 1.35 2.7 2.7 6 2.7s6-1.35 6-2.7v-4.7"/><path d="M21.6 9.4v4.7"/></svg>',
    /* trophy (offres Top-6 MBB) */
    trophy:'<svg viewBox="0 0 24 24"><path d="M7.4 4h9.2v5.4a4.6 4.6 0 0 1-9.2 0V4Z"/><path d="M7.4 6H5.3a2 2 0 0 0 0 4h2.2M16.6 6h2.1a2 2 0 0 1 0 4h-2.2"/><path d="M9.4 21h5.2M12 16.8V21"/></svg>',
    /* medal (offres Top-20) */
    medal:'<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="5.3"/><path d="m9.4 13.3-1.7 7.3L12 18.1l4.3 2.5-1.7-7.3"/><path d="m12 6.7.85 1.72 1.9.28-1.37 1.34.32 1.9L12 11.05l-1.7.89.32-1.9L9.25 8.7l1.9-.28L12 6.7Z"/></svg>',
    _default:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg>'
  };
  function statKey(cls){ cls=cls||"";
    if(/fa-user/.test(cls)) return "user";
    if(/fa-calendar/.test(cls)) return "grad";
    if(/fa-clock/.test(cls)) return "trophy";
    if(/fa-play/.test(cls)) return "medal";
    return "_default";
  }
  /* Le contenu natif des libellés stats est INCOHÉRENT (saisi à la main dans le
     Customizer) : la plupart ont un <div> pour la 2e ligne, mais au moins une
     cellule a un texte fusionné SANS espace ni <div> (« reçoiventune offre… »).
     On en extrait proprement [ligne principale, sous-ligne] :
       - <div> présent -> principal = texte avant le div, sous = texte du div ;
       - sinon -> on répare l'espace manquant du gabarit et on découpe sur le
         motif (« …reçoivent | une offre… » ou « … | (…) »). Sans motif : 1 ligne. */
  function splitStatLabel(lbl){
    var div=lbl.querySelector(":scope > div");
    if(div){
      var sub=(div.textContent||"").replace(/ /g," ").replace(/\s+/g," ").trim();
      var main="";
      for(var i=0;i<lbl.childNodes.length;i++){ var n=lbl.childNodes[i]; if(n===div) break; if(n.nodeType===3) main+=n.nodeValue; }
      return [main.replace(/ /g," ").replace(/\s+/g," ").trim(), sub];
    }
    var full=(lbl.textContent||"").replace(/ /g," ").replace(/\s+/g," ").trim();
    full=full.replace(/reçoivent(?=une offre)/i,"reçoivent ");   /* espace manquant */
    var m=full.match(/^(.*?reçoivent)\s+(une offre.*)$/i) || full.match(/^(.*?\S)\s*(\(.+\))$/);
    return m ? [m[1].trim(), m[2].trim()] : [full, ""];
  }
  function buildStats(){
    var sec=document.querySelector(H+" .ps-home-stats"); if(!sec) return;
    sec.querySelectorAll(".lw-progress-wrapper").forEach(function(w){
      w.classList.add("ps-stat");
      var fa=w.querySelector("span.learnworlds-icon");
      if(fa && !w.querySelector(".ps-stat-ic")){
        var badge=document.createElement("span");
        badge.className="ps-stat-ic";
        badge.innerHTML=STAT_ICON[statKey(fa.className)]||STAT_ICON._default;
        fa.parentNode.insertBefore(badge, fa);
        fa.classList.add("ps-home-hide");   /* masque l'icône FontAwesome native */
      }
    });
    /* libellés reconstruits en 2 spans propres (auto-réparé si LW réécrit :
       on re-traite dès que le span .ps-stat-lbl a disparu). */
    sec.querySelectorAll("[data-magic='title']").forEach(function(lbl){
      if(lbl.querySelector(".ps-stat-lbl")) return;
      var p=splitStatLabel(lbl);
      lbl.textContent="";
      var a=document.createElement("span"); a.className="ps-stat-lbl"; a.textContent=p[0]; lbl.appendChild(a);
      if(p[1]){ var b=document.createElement("span"); b.className="ps-stat-sub"; b.textContent=p[1]; lbl.appendChild(b); }
    });
    /* révélation en cascade (une seule fois) */
    if(!sec.classList.contains("ps-in") && !sec.__psStatObs){
      sec.__psStatObs=1;
      if(window.IntersectionObserver){
        var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ sec.classList.add("ps-in"); io.disconnect(); } }); },{threshold:0.15});
        io.observe(sec);
        setTimeout(function(){ var r=sec.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) sec.classList.add("ps-in"); },450);
      } else { sec.classList.add("ps-in"); }
    }
  }

  /* ================= BANDE CONSTAT : callouts « Fait #1/#2 » =================
     Dans le corps de la section « Avez-vous besoin d'une formation », on tague
     les <div> enfants : espaceurs <br> -> .ps-cta-sp (masqués), lignes « Fait #N :
     … » -> callout .ps-cta-fact (badge + énoncé), reste -> paragraphe .ps-cta-p.
     Auto-réparant si LW réécrit (on re-traite dès qu'il n'y a plus de .ps-cta-*). */
  function buildCta(){
    var body=document.querySelector(H+" .ps-home-cta [data-element-id='textNormal']");
    if(!body || body.querySelector(".ps-cta-fact, .ps-cta-p")) return;
    [].slice.call(body.children).forEach(function(d){
      if(d.tagName!=="DIV") return;
      var t=(d.textContent||"").replace(/\s+/g," ").trim();
      if(!t){ d.classList.add("ps-cta-sp"); return; }               // espaceur <br>
      var m=t.match(/^Fait\s*#?\s*(\d+)\s*:\s*(.+)$/i);
      if(m){
        d.classList.add("ps-cta-fact");
        d.textContent="";
        var b=document.createElement("span"); b.className="ps-cta-fact-badge"; b.textContent="Fait "+m[1];
        var s=document.createElement("span"); s.className="ps-cta-fact-txt"; s.textContent=m[2];
        d.appendChild(b); d.appendChild(s);
      } else { d.classList.add("ps-cta-p"); }
    });
  }

  /* ================= PREUVE : graphes en <img> plein + reveal =================
     Chaque « table » est une image de graphe dans un widget écran natif LW
     (cadre + légende vide + cadre 16:9 qui rogne). On récupère l'URL réelle
     (style inline, pas le gif de lazy-load), on l'injecte en <img> plein dans
     une carte .ps-preuve-graph, et on masque le widget natif. Les rangées vides
     du template sont masquées. Réveil au scroll. Idempotent / auto-réparant. */
  function buildPreuve(){
    var sec=document.querySelector(H+" .ps-home-preuve"); if(!sec) return;
    sec.querySelectorAll(".learnworlds-screen-wrapper").forEach(function(w){
      if(w.classList.contains("ps-home-hide")) return;
      var imgDiv=w.querySelector("[data-magic='image']");
      var m=imgDiv ? (imgDiv.getAttribute("style")||"").match(/background-image:\s*url\(([^)]+)\)/) : null;
      var url=m ? m[1].replace(/["']/g,"").trim() : null;
      if(!url || /^data:/.test(url)) return;   /* image réelle pas encore posée (lazy) -> réessai */
      var fig=document.createElement("div"); fig.className="ps-preuve-graph";
      var img=document.createElement("img"); img.src=url; img.alt=""; img.loading="lazy";
      fig.appendChild(img);
      w.parentNode.insertBefore(fig, w);
      w.classList.add("ps-home-hide");         /* masque le widget écran natif */
    });
    /* rangées vides du template (colonnes span_2_of_12 sans contenu) -> masquées */
    sec.querySelectorAll(".lw-cols").forEach(function(row){
      if(!(row.textContent||"").trim() && !row.querySelector("img,.ps-preuve-graph,.learnworlds-screen-wrapper")) row.classList.add("ps-home-hide");
    });
    if(!sec.classList.contains("ps-in") && !sec.__psPreuveObs){
      sec.__psPreuveObs=1;
      if(window.IntersectionObserver){
        var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ sec.classList.add("ps-in"); io.disconnect(); } }); },{threshold:0.12});
        io.observe(sec);
        setTimeout(function(){ var r=sec.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) sec.classList.add("ps-in"); },450);
      } else { sec.classList.add("ps-in"); }
    }
  }

  /* ================= ATOUTS : pictos SVG assortis + révélation =================
     Les 8 cartes « Pourquoi choisir PrepaStrat ? » portent des FontAwesome
     génériques (5x play-circle, receipt, question…). On choisit un SVG ligne
     par mot-clé du TITRE et on remplace l'icône native dans son badge. La
     section reçoit .ps-in au scroll pour la cascade. Idempotent / auto-réparant. */
  var ATOUT_ICON={
    trophy:'<svg viewBox="0 0 24 24"><path d="M7.4 4h9.2v5.4a4.6 4.6 0 0 1-9.2 0V4Z"/><path d="M7.4 6H5.3a2 2 0 0 0 0 4h2.2M16.6 6h2.1a2 2 0 0 1 0 4h-2.2"/><path d="M9.4 21h5.2M12 16.8V21"/></svg>',
    compass:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.2 5.3-5.3 2.2 2.2-5.3 5.3-2.2Z"/></svg>',
    medal:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8.6" r="5.3"/><path d="m9.4 12.9-1.7 7.7L12 18.1l4.3 2.5-1.7-7.7"/></svg>',
    users:'<svg viewBox="0 0 24 24"><path d="M16 21v-1.8a4 4 0 0 0-4-4H6.6a4 4 0 0 0-4 4V21"/><circle cx="9.3" cy="7.4" r="3.6"/><path d="M21.4 21v-1.8a4 4 0 0 0-3-3.87M16.6 3.9a3.6 3.6 0 0 1 0 7"/></svg>',
    target:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>',
    network:'<svg viewBox="0 0 24 24"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18.2" r="2.4"/><path d="M8 6h8M7.6 7.8 10.6 16M16.4 7.8 13.4 16"/></svg>',
    star:'<svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.2 5.8.85-4.2 4.1 1 5.75L12 21.3l-5.2-2.75 1-5.75-4.2-4.1 5.8-.85L12 3Z"/></svg>',
    globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.9 5.8 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.8-3.9-9S9.5 5.6 12 3Z"/></svg>',
    check:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.5 2.5 4.7-5.1"/></svg>'
  };
  function atoutKey(title){
    var t=(title||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    if(/admission|taux|reussit|%/.test(t)) return "trophy";
    if(/pedagogie|sur-mesure|personnalis|mesure/.test(t)) return "compass";
    if(/expertise|ans|ancien|annee|experience/.test(t)) return "medal";
    if(/tous profils|profils/.test(t)) return "users";
    if(/specialis|conseil|coeur|coeur|c.ur/.test(t)) return "target";
    if(/reseau/.test(t)) return "network";
    if(/coach|mbb/.test(t)) return "star";
    if(/francophone|langue|bureau|internation/.test(t)) return "globe";
    return "check";
  }
  function buildAtouts(){
    var sec=document.querySelector(H+" .ps-home-atouts"); if(!sec) return;
    sec.querySelectorAll(".ps-hcard").forEach(function(card){
      var wrap=card.querySelector(".box-icon-wrapper, .learnworlds-icon-wrapper");
      var fa=wrap ? wrap.querySelector(".learnworlds-icon") : null;
      if(wrap && fa && !wrap.querySelector(".ps-atout-ic")){
        var h=card.querySelector(".learnworlds-heading3, .learnworlds-heading4");
        var sp=document.createElement("span");
        sp.className="ps-atout-ic";
        sp.innerHTML=ATOUT_ICON[atoutKey(h?h.textContent:"")]||ATOUT_ICON.check;
        wrap.appendChild(sp);
        fa.classList.add("ps-home-hide");
      }
    });
    if(!sec.classList.contains("ps-in") && !sec.__psAtoutObs){
      sec.__psAtoutObs=1;
      if(window.IntersectionObserver){
        var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ sec.classList.add("ps-in"); io.disconnect(); } }); },{threshold:0.1});
        io.observe(sec);
        setTimeout(function(){ var r=sec.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) sec.classList.add("ps-in"); },450);
      } else { sec.classList.add("ps-in"); }
    }
  }

  /* ================= ÉQUIPE : onglets -> cartes groupées + avatars =================
     Le natif est un widget à 3 onglets (Fondateurs / Équipe / Coachs) sans photos.
     On lit les 3 .lw-tab-content, on en extrait chaque membre (nom, rôle après un
     « - », bio), on construit une grille de cartes par groupe (avatar à initiales,
     ou picto étoile pour les pools « Nos coachs … »), et on masque le widget natif.
     Bios placeholder (anglais template) ignorées. Construit une seule fois. */
  var STAR_SVG='<svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.2 5.8.85-4.2 4.1 1 5.75L12 21.3l-5.2-2.75 1-5.75-4.2-4.1 5.8-.85L12 3Z"/></svg>';
  function teamInitials(name){
    var w=(name||"").replace(/[^A-Za-zÀ-ÿ' -]/g,"").split(/[\s'-]+/).filter(Boolean);
    if(!w.length) return "?";
    if(w.length===1) return w[0].slice(0,2).toUpperCase();
    return (w[0].charAt(0)+w[w.length-1].charAt(0)).toUpperCase();
  }
  function buildEquipe(){
    var sec=document.querySelector(H+" .ps-home-equipe"); if(!sec) return;
    if(sec.querySelector(".ps-team")) return;
    var tabs=sec.querySelector(".lw-tabs"); if(!tabs) return;
    var btnWrap=tabs.querySelector(".lw-tabs-buttons");
    var labels=btnWrap ? [].slice.call(btnWrap.querySelectorAll(".lw-tab, .js-lw-tab")).map(function(b){ return (b.textContent||"").replace(/\s+/g," ").trim(); }) : [];
    var panels=[].slice.call(tabs.querySelectorAll(".lw-tab-content"));
    if(!panels.length) return;
    var container=document.createElement("div"); container.className="ps-team";
    panels.forEach(function(p, gi){
      var members=[];
      p.querySelectorAll(".learnworlds-heading3, .learnworlds-heading4").forEach(function(h){
        var raw=(h.textContent||"").replace(/\s+/g," ").trim();
        var parts=raw.split(/\s+[-–—]\s+/);
        var name=parts[0].trim(), role=parts.length>1 ? parts.slice(1).join(" - ").trim() : "";
        var bio="", n=h.nextElementSibling;
        while(n){ if(/main-text/.test(n.className||"")){ bio=(n.textContent||"").replace(/\s+/g," ").trim(); break; } n=n.nextElementSibling; }
        if(/multiple ways of adding|awesome label|lorem ipsum|write your/i.test(bio)) bio="";  /* placeholder EN */
        if(name) members.push({name:name, role:role, bio:bio});
      });
      if(!members.length) return;
      var grp=document.createElement("div"); grp.className="ps-team-group";
      var gt=document.createElement("div"); gt.className="ps-team-gt"; gt.textContent=labels[gi]||"";
      grp.appendChild(gt);
      var grid=document.createElement("div"); grid.className="ps-team-grid";
      members.forEach(function(m){
        var card=document.createElement("div"); card.className="ps-team-card";
        var av=document.createElement("div"); av.className="ps-team-av";
        if(/^nos\s/i.test(m.name)) av.innerHTML=STAR_SVG;      /* pool de coachs -> picto */
        else av.textContent=teamInitials(m.name);
        card.appendChild(av);
        var nm=document.createElement("div"); nm.className="ps-team-name"; nm.textContent=m.name; card.appendChild(nm);
        if(m.role){ var rl=document.createElement("div"); rl.className="ps-team-role"; rl.textContent=m.role; card.appendChild(rl); }
        if(m.bio){ var bo=document.createElement("div"); bo.className="ps-team-bio"; bo.textContent=m.bio; bo.setAttribute("title", m.bio); card.appendChild(bo); }
        grid.appendChild(card);
      });
      grp.appendChild(grid);
      container.appendChild(grp);
    });
    if(!container.children.length) return;
    tabs.parentNode.insertBefore(container, tabs);
    tabs.classList.add("ps-home-hide");   /* masque le widget onglets natif */
    if(!sec.classList.contains("ps-in") && !sec.__psEquipeObs){
      sec.__psEquipeObs=1;
      if(window.IntersectionObserver){
        var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ sec.classList.add("ps-in"); io.disconnect(); } }); },{threshold:0.08});
        io.observe(sec);
        setTimeout(function(){ var r=sec.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) sec.classList.add("ps-in"); },450);
      } else { sec.classList.add("ps-in"); }
    }
  }

  /* Reconstruit « Notre histoire » en timeline HORIZONTALE (4 jalons), révélée au
     scroll. Idempotent. Masque les rangées natives verticales. */
  function buildTimeline(){
    var sec=document.querySelector(H+" .ps-home-histoire");
    if(!sec || sec.querySelector(".ps-timeline")) return;
    var dates=sec.querySelectorAll(".learnworlds-heading4");
    if(dates.length<2) return;
    var items=[];
    dates.forEach(function(d){
      var date=(d.textContent||"").replace(/\s+/g," ").trim();
      var col=d.parentElement;
      var t=col && col.querySelector(".learnworlds-main-text");
      var desc=t ? (t.textContent||"").replace(/\s+/g," ").trim() : "";
      if(date) items.push({date:date, desc:desc});
    });
    if(!items.length) return;
    var tl=document.createElement("div"); tl.className="ps-timeline";
    items.forEach(function(it,i){
      var node=document.createElement("div"); node.className="ps-tl-node";
      node.style.transitionDelay=(i*0.12)+"s";
      var dt=document.createElement("div"); dt.className="ps-tl-date"; dt.textContent=it.date;
      var dw=document.createElement("div"); dw.className="ps-tl-dotwrap";
      var dot=document.createElement("span"); dot.className="ps-tl-dot"; dw.appendChild(dot);
      var ds=document.createElement("div"); ds.className="ps-tl-desc"; ds.textContent=it.desc;
      node.appendChild(dt); node.appendChild(dw); node.appendChild(ds);
      tl.appendChild(node);
    });
    /* masque les rangées de jalons natives (celles qui portent une date ou un point) */
    var rows=Array.prototype.slice.call(sec.querySelectorAll(".lw-cols")).filter(function(r){
      return r.querySelector(".learnworlds-heading4") || r.querySelector(".lw-dot-icon");
    });
    if(rows.length){ rows[0].parentNode.insertBefore(tl, rows[0]); rows.forEach(function(r){ r.classList.add("ps-home-hide"); }); }
    else { sec.appendChild(tl); }
    /* révélation au scroll */
    if(window.IntersectionObserver){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ tl.classList.add("ps-in"); io.disconnect(); } }); }, {threshold:0.15});
      io.observe(tl);
      /* filet : si déjà visible au chargement */
      setTimeout(function(){ var r=tl.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) tl.classList.add("ps-in"); }, 400);
    } else { tl.classList.add("ps-in"); }
  }

  /* ===== Refonte section « Quel candidat êtes-vous ? » (buildProfils) =====
     🔴 VALEURS DU DONUT ESTIMÉES (le graphique natif ne s'extrait pas) — Ziad donne
     les vrais % et on remplace `value` ici. Le reste (chips, tiers) = contenu réel. */
  var PF_SEGMENTS=[
    {label:"Fin d'études",           value:40, color:"#507EC5"},
    {label:"M1 & césure",            value:15, color:"#243B6B"},
    {label:"Changement de cabinet",  value:13, color:"#14B8A6"},
    {label:"Expérimenté",            value:12, color:"#7EA6DC"},
    {label:"MBA",                    value:11, color:"#F0A93C"},
    {label:"Docteur (PhD)",          value:9,  color:"#8B7BD8"}
  ];
  var PF_JUNIORS={ title:"Profils juniors",
    icon:'<svg viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/></svg>',
    chips:["M1 & césure","Fin d'études"],
    desc:"Que vous sortiez d'une école cible ou d'un parcours atypique, on vous fait briller en entretien — comme les centaines de candidats avant vous." };
  var PF_EXPERT={ title:"Profils expérimentés",
    icon:'<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    chips:["Docteur (PhD)","MBA","En poste","Changement de cabinet"],
    desc:"Attentes spécifiques et peu de temps ? On optimise votre candidature de senior hire — tous ceux qu'on a coachés ont atteint leur objectif." };
  var PF_TIERS=[
    {tier:"MBB",       firms:["McKinsey","BCG","Bain"]},
    {tier:"Top-6",     firms:["Oliver Wyman","Roland Berger","Kearney"]},
    {tier:"Big-4",     firms:["Deloitte","EY-Parthenon","KPMG","PwC Strategy&"]},
    {tier:"Boutiques", firms:["Mars & Co","Cepton","Vertone","Simon-Kucher"]},
    {tier:"Data",      firms:["BCG Gamma","Black Quantum","Eleven Strategy"]},
    {tier:"IT",        firms:["Accenture","IBM","Capgemini","BearingPoint"]}
  ];
  var PF_CALLOUT="Votre cabinet idéal vous correspond-il vraiment ? On répond à toutes vos questions pendant la formation.";

  /* ====================================================================
     LIRE LE CONTENU DU BUILDER AU LIEU DE LE RECOPIER (03/08)
     --------------------------------------------------------------------
     🔴 LE PROBLÈME, constaté par Ziad puis mesuré sur la home en production :
     il modifie un texte dans le Site Builder et **rien ne bouge**. Cause : on
     MASQUE le contenu natif (`ps-home-hide`) et on affiche une copie écrite en
     dur dans ce fichier. Écart relevé le 03/08, en français :
       builder « Top-20 / Cursus Data / Cabinets TEST » + une 6e ligne
       « Cabinets de Conseil en Management : Sia Partners, Wavestone… »
       code    « Top-6 / Data / IT », et la 6e ligne inexistante.
     Ses modifications étaient donc invisibles depuis un moment.

     ⇒ Les textes viennent désormais du DOM natif. Ce qui n'est PAS extractible
     garde sa valeur en dur, et c'est assumé :
       • les % du donut (le graphique natif ne s'extrait pas, cf. plus haut) ;
       • les couleurs et les icônes SVG, qui sont du design, pas du contenu ;
       • les « chips » des deux cartes profils.

     🔴 RÈGLE DE SÉCURITÉ, la même que les replis `var(--ps-accent,#6161FF)` de
     tokens.js : si la lecture ne donne RIEN (élément renommé, déplacé, vidé
     dans le builder), on retombe sur les tables ci-dessus **au lieu d'afficher
     une section vide**. Un lecteur qui ne sait pas ne doit jamais effacer.
     ==================================================================== */
  function psTxt(e){ return e ? (e.textContent||"").replace(/\s+/g," ").trim() : ""; }

  /* 🔴 LE MOTIF EST LE `<strong>`, PAS LA PUCE. Première version : je lisais les
     `<li>`, et je ne trouvais que 6 tiers sur 8 — **MBB et Top-6 auraient disparu
     de la home**, parce que Ziad les a écrits en paragraphe et non en puce.
     Relevé de la structure réelle : les HUIT tiers, dans la liste comme hors
     d'elle, ont exactement la même forme — un `<strong>` qui porte le nom, suivi
     d'un `<span>` qui porte les cabinets. C'est donc ÇA le motif stable, et il
     ne dépend pas de la façon dont le texte est mis en page.
     Leçon : lire la structure réelle avant d'écrire l'analyseur. La première
     version marchait « à 75 % », ce qui est la pire des situations — elle aurait
     silencieusement effacé deux lignes. */
  function lireTiers(sec){
    var out=[];
    [].slice.call(sec.querySelectorAll("li")).forEach(function(li){
      var s=psTxt(li);
      var m=s.match(/^(.{2,45}?)\s*:\s*(.+)$/);
      if(!m) return;
      var firms=m[2].split(",").map(function(f){
        return f.replace(/[.…\s]+$/,"").trim();       // « … » et « .... » de fin de liste
      }).filter(function(f){ return f && f!=="…"; });
      if(!firms.length) return;
      out.push({tier:m[1].trim(), firms:firms});
    });
    if(!out.length) return null;
    /* 🔴🔴 GARDE-FOU : SI DES TIERS VIVENT HORS DE LA LISTE, ON NE LIT RIEN.
       Mesuré sur la home le 03/08 : 6 tiers en puces, mais **MBB et Top-6 en
       paragraphes**, dans un balisage où le texte des lignes suivantes est
       recollé au précédent (« …Roland Berger, KearneyNous vous préparons… »).
       Deux analyseurs successifs s'y sont cassé les dents, le second allant
       jusqu'à transformer « McKinsey & Company » en « Mc ». Plutôt que de
       deviner, on constate : un tier hors liste = lecture incomplète = on garde
       la table de repli, et RIEN ne disparaît de la home.
       ✅ Cette règle se débloque TOUTE SEULE : le jour où les lignes hors liste
       passent en puces, le compteur tombe à zéro et la lecture prend le relais,
       sans une ligne de code à changer.
       Un tier hors liste = un `<strong>` court (un nom, pas une phrase) suivi
       d'un voisin qui contient des virgules. */
    var ul=sec.querySelector("ul,ol");
    var dehors=[].slice.call(sec.querySelectorAll("strong,b")).filter(function(s){
      if(ul && ul.contains(s)) return false;
      var l=psTxt(s);
      if(!l || l.length>45 || /[.?!]/.test(l)) return false;
      return psTxt(s.nextElementSibling).indexOf(",")>=0;
    }).length;
    if(dehors) return null;
    return out;
  }

  /* Les deux cartes profils sont des accordéons dont le texte commence par leur
     propre titre. 🔴 Le builder en rend plusieurs, dont des VIDES et des
     DOUBLONS (mesuré : 5 accordéons pour 2 profils réels) — d'où la
     déduplication par titre et le rejet des descriptions vides. */
  function lireProfils(sec){
    var vus={}, out=[];
    [].slice.call(sec.querySelectorAll("[class*=accordion],[class*=toggle]")).forEach(function(a){
      var titre=psTxt(a.querySelector("h4,.learnworlds-heading4"));
      if(!titre || vus[titre]) return;
      var tout=psTxt(a);
      var desc=(tout.indexOf(titre)===0) ? tout.slice(titre.length).trim() : tout;
      if(!desc) return;
      vus[titre]=1;
      out.push({title:titre, desc:desc});
    });
    return out.length ? out : null;
  }

  /* Titre et accroche du bloc de droite : on part de la LISTE (l'ancre la plus
     fiable) et on remonte à sa carte, plutôt que de compter les `h4` de la
     section — leur nombre change dès que Ziad ajoute un bloc. */
  function lireBlocDroite(sec){
    var ul=sec.querySelector("ul,ol");
    if(!ul) return null;
    var carte=ul.closest(".box-shadow-round-light,.radius-15,.lw-cols")||sec;
    var titre=psTxt(carte.querySelector("h4,.learnworlds-heading4"));
    var accroche="";
    [].slice.call(carte.querySelectorAll("p")).forEach(function(p){
      var s=psTxt(p);
      if(!accroche && s && s!==titre && s.length>25) accroche=s;
    });
    return {titre:titre, accroche:accroche};
  }

  var SVGNS="http://www.w3.org/2000/svg";
  function makeDonut(segs){
    var C=2*Math.PI*45, total=0; segs.forEach(function(s){ total+=s.value; }); if(!total) total=1;
    var svg=document.createElementNS(SVGNS,"svg"); svg.setAttribute("class","ps-donut"); svg.setAttribute("viewBox","0 0 120 120"); svg.setAttribute("aria-hidden","true");
    function circ(stroke,w){ var c=document.createElementNS(SVGNS,"circle"); c.setAttribute("cx","60"); c.setAttribute("cy","60"); c.setAttribute("r","45"); c.setAttribute("fill","none"); c.setAttribute("stroke",stroke); c.setAttribute("stroke-width",w); return c; }
    svg.appendChild(circ("#EEF1F6","18"));
    var cum=0;
    segs.forEach(function(s,i){
      var frac=s.value/total, arc=frac*C;
      var c=circ(s.color,"18"); c.setAttribute("class","ps-donut-seg");
      c.setAttribute("stroke-dasharray",arc.toFixed(2)+" "+C.toFixed(2));
      c.setAttribute("transform","rotate("+(-90+cum*360).toFixed(2)+" 60 60)");
      c.style.strokeDashoffset=arc.toFixed(2);        // caché au départ, révélé au scroll
      c.style.transitionDelay=(i*0.1)+"s";
      svg.appendChild(c); cum+=frac;
    });
    function txt(cls,y,size,t){ var e=document.createElementNS(SVGNS,"text"); e.setAttribute("class",cls); e.setAttribute("x","60"); e.setAttribute("y",y); e.setAttribute("text-anchor","middle"); e.setAttribute("font-size",size); e.textContent=t; return e; }
    svg.appendChild(txt("ps-donut-c","58","22",String(segs.length)));
    svg.appendChild(txt("ps-donut-cs","74","10","profils"));
    return svg;
  }

  function buildProfils(){
    var sec=document.querySelector(H+" .ps-home-profils");
    if(!sec || sec.querySelector(".ps-pf2")) return;

    /* 🔴 LECTURE AVANT CONSTRUCTION, et repli sur les tables si ça ne donne
       rien. C'est ici que le contenu du builder entre dans la section. */
    var tiers=lireTiers(sec)||PF_TIERS;
    var lus=lireProfils(sec);
    var cartesProfils=(lus && lus.length>=2)
      ? [{title:lus[0].title, icon:PF_JUNIORS.icon, chips:PF_JUNIORS.chips, desc:lus[0].desc},
         {title:lus[1].title, icon:PF_EXPERT.icon,  chips:PF_EXPERT.chips,  desc:lus[1].desc}]
      : [PF_JUNIORS, PF_EXPERT];
    var droite=lireBlocDroite(sec)||{};
    var titreDroite=droite.titre||"À quels cabinets nous préparons-vous ?";
    var callout=droite.accroche||PF_CALLOUT;

    var pf2=document.createElement("div"); pf2.className="ps-pf2";
    /* ---- gauche : donut + 2 cartes profils ---- */
    var left=document.createElement("div"); left.className="ps-pf2-left";
    var dc=document.createElement("div"); dc.className="ps-donutcard ps-pf-rise";
    dc.appendChild(makeDonut(PF_SEGMENTS));
    var leg=document.createElement("div"); leg.className="ps-donut-leg";
    PF_SEGMENTS.forEach(function(s){
      var it=document.createElement("div"); it.className="ps-donut-leg-i";
      var dot=document.createElement("span"); dot.className="ps-donut-dot"; dot.style.background=s.color;
      var lb=document.createElement("span"); lb.textContent=s.label;
      var v=document.createElement("span"); v.className="ps-donut-val"; v.textContent=s.value+" %";
      it.appendChild(dot); it.appendChild(lb); it.appendChild(v); leg.appendChild(it);
    });
    dc.appendChild(leg); left.appendChild(dc);
    cartesProfils.forEach(function(p,i){
      var card=document.createElement("div"); card.className="ps-pfcard ps-pf-rise"; card.style.transitionDelay=((i+1)*0.1)+"s";
      var h=document.createElement("div"); h.className="ps-pfcard-h";
      var ic=document.createElement("span"); ic.className="ps-pfcard-ic"; ic.innerHTML=p.icon;   // SVG statique
      var t=document.createElement("div"); t.className="ps-pfcard-t"; t.textContent=p.title;
      h.appendChild(ic); h.appendChild(t); card.appendChild(h);
      var chips=document.createElement("div"); chips.className="ps-pfchips";
      p.chips.forEach(function(c){ var ch=document.createElement("span"); ch.className="ps-chip"; ch.textContent=c; chips.appendChild(ch); });
      card.appendChild(chips);
      var d=document.createElement("p"); d.className="ps-pfcard-d"; d.textContent=p.desc; card.appendChild(d);
      left.appendChild(card);
    });
    pf2.appendChild(left);
    /* ---- droite : tiers cabinets ---- */
    var right=document.createElement("div"); right.className="ps-pf2-right ps-pf-rise"; right.style.transitionDelay="0.15s";
    var rt=document.createElement("div"); rt.className="ps-pf2-right-t"; rt.textContent=titreDroite; right.appendChild(rt);
    tiers.forEach(function(tr){
      var row=document.createElement("div"); row.className="ps-tier";
      var b=document.createElement("span"); b.className="ps-tierbadge"; b.textContent=tr.tier;
      var fw=document.createElement("div"); fw.className="ps-tier-firms";
      tr.firms.forEach(function(f){ var ch=document.createElement("span"); ch.className="ps-chip"; ch.textContent=f; fw.appendChild(ch); });
      row.appendChild(b); row.appendChild(fw); right.appendChild(row);
    });
    var co=document.createElement("div"); co.className="ps-pf-callout"; co.textContent=callout; right.appendChild(co);
    pf2.appendChild(right);
    /* ---- insertion + masquage du natif (pie + accordéons + liste) ---- */
    var nativeCards=sec.querySelectorAll(".box-shadow-round-light, .radius-15");
    var anchor=nativeCards[0] ? (nativeCards[0].closest(".lw-cols")||nativeCards[0]) : sec.querySelector(".lw-cols");
    if(anchor){ anchor.parentNode.insertBefore(pf2, anchor); }
    else { sec.appendChild(pf2); }
    Array.prototype.forEach.call(nativeCards,function(c){ c.classList.add("ps-home-hide"); });
    /* ---- révélation au scroll ---- */
    if(window.IntersectionObserver){
      var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ pf2.classList.add("ps-in"); io.disconnect(); } }); },{threshold:0.1});
      io.observe(pf2);
      setTimeout(function(){ var r=pf2.getBoundingClientRect(); if(r.top<(window.innerHeight||800)) pf2.classList.add("ps-in"); },450);
    } else { pf2.classList.add("ps-in"); }
  }

  /* ====================================================================
     BLOC DE RÉGLAGES DU BUILDER — « #clé : valeur »
     --------------------------------------------------------------------
     Ziad a posé sur la home un bloc de texte contenant :
         #lien_video_background :
         #lien_video :
     C'est la bonne façon de faire, et bien plus solide que d'analyser de la
     prose : la clé est EXPLICITE, elle ne dépend d'aucune mise en page.
     Toute clé future marche sans une ligne de code ici — il suffit de lire
     `psReglage("ma_cle")` là où on en a besoin.

     🔴 Les lignes sont séparées par des `<br>`, donc `textContent` les COLLE
     (« #lien_video_background :#lien_video : », mesuré). On découpe donc sur les
     `<br>` et non sur le texte : une URL contenant un « # » (fragment) serait
     sinon tronquée par une découpe naïve sur ce caractère.
     🔴 Le bloc est MASQUÉ : mesuré le 03/08, il s'affichait en clair sur la home
     pour les visiteurs. C'est de la configuration, pas du contenu.
     🔴 Une valeur vide ⇒ on garde la valeur d'origine. Ziad a créé les deux clés
     sans les remplir : sans cette règle, la home perdait ses vidéos.
     ==================================================================== */
  var _regl=null;
  function lireReglages(){
    if(_regl) return _regl;
    _regl={};
    var blocs=[].slice.call(document.querySelectorAll(H+" .learnworlds-main-text, "+H+" .lw-widget-in"));
    blocs.forEach(function(b){
      if((b.textContent||"").indexOf("#")<0) return;
      /* reconstruction ligne par ligne : chaque `<br>` termine une ligne */
      var lignes=[], cur="";
      [].slice.call(b.childNodes).forEach(function(n){
        if(n.nodeType===1 && n.tagName==="BR"){ lignes.push(cur); cur=""; return; }
        cur+=(n.textContent||"");
      });
      lignes.push(cur);
      var trouve=false;
      lignes.forEach(function(l){
        var m=l.replace(/\s+/g," ").trim().match(/^#([a-z0-9_-]+)\s*:\s*(.*)$/i);
        if(!m) return;
        trouve=true;
        var v=(m[2]||"").trim();
        if(v) _regl[m[1].toLowerCase()]=v;          // vide = on ne surcharge pas
      });
      if(trouve) b.classList.add("ps-home-hide");   // configuration : jamais à l'écran
    });
    return _regl;
  }
  /* Accepte aussi bien une URL de player qu'un lien Vimeo « public » : les deux
     se collent dans le builder, autant les accepter tous les deux. */
  function psReglage(cle, repli){
    var v=lireReglages()[String(cle).toLowerCase()];
    if(!v) return repli;
    var m=v.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)(?:\?(.*))?$/i);
    if(m) v="https://player.vimeo.com/video/"+m[1]+(m[2]?("?"+m[2]):"");
    return v;
  }

  /* Vidéo du hero : le template a un iframe Vimeo avec un ID mort (« Cette vidéo
     n'existe pas »). On remplace la source par la vraie vidéo (demande Ziad).
     Posé UNE fois (garde `data-ps-vid`) pour ne pas recharger la vidéo à chaque build. */
  var HERO_VIDEO="https://player.vimeo.com/video/910833393?h=94064c722b&badge=0&autopause=0&player_id=0&app_id=58479";
  function setHeroVideo(){
    var hero=document.querySelector(H+" .ps-home-hero");
    if(!hero || hero.classList.contains("ps-hero-bg")) return;   // mode vidéo-fond : géré par heroVideoBg
    var ifr=hero.querySelector(".learnworlds-video-iframe iframe, .learnworlds-video-iframe-wrapper iframe, iframe");
    if(!ifr || ifr.getAttribute("data-ps-vid")) return;
    ifr.setAttribute("src",psReglage("lien_video",HERO_VIDEO));
    ifr.setAttribute("allow","autoplay; fullscreen; picture-in-picture; clipboard-write");
    ifr.setAttribute("allowfullscreen","");
    ifr.setAttribute("data-ps-vid","1");
  }

  /* --- helpers vidéo : postMessage vers le player Vimeo + modale lecteur --- */
  function psVimeo(f,method,value){ if(!f||!f.contentWindow) return; var m={method:method}; if(value!==undefined) m.value=value; try{ f.contentWindow.postMessage(JSON.stringify(m),"https://player.vimeo.com"); }catch(e){} }
  function psHeroModal(bgIfr){
    if(document.querySelector(".ps-hero-modal")) return;
    var ov=document.createElement("div"); ov.className="ps-hero-modal";
    var inner=document.createElement("div"); inner.className="ps-hero-modal-inner";
    var ifr=document.createElement("iframe");
    /* Même vidéo que le hero, mais lancée toute seule. 🔴 On AJOUTE `autoplay`
       au lieu de le supposer : si Ziad colle une URL sans ce paramètre, la
       modale s'ouvrirait sur une vidéo à l'arrêt. */
    var src=psReglage("lien_video","https://player.vimeo.com/video/910833393?h=94064c722b&title=0&byline=0&portrait=0");
    if(!/[?&]autoplay=/.test(src)) src+=(src.indexOf("?")<0?"?":"&")+"autoplay=1";
    ifr.src=src;
    ifr.setAttribute("allow","autoplay; fullscreen; picture-in-picture");
    ifr.setAttribute("allowfullscreen","");
    inner.appendChild(ifr);
    var x=document.createElement("button"); x.className="ps-hero-modal-x"; x.type="button"; x.setAttribute("aria-label","Fermer");
    x.innerHTML='<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    inner.appendChild(x); ov.appendChild(inner); document.body.appendChild(ov);
    if(bgIfr) psVimeo(bgIfr,"pause");                     // met le fond en pause pendant la lecture
    function close(){ ov.remove(); if(bgIfr) psVimeo(bgIfr,"play"); document.removeEventListener("keydown",esc); }
    function esc(e){ if(e.key==="Escape") close(); }
    x.addEventListener("click",close);
    ov.addEventListener("click",function(e){ if(e.target===ov) close(); });   // clic hors du player = fermer
    document.addEventListener("keydown",esc);
  }

  /* HERO plein écran avec la vidéo en FOND (Vimeo background=1 : autoplay muet en
     boucle, sans contrôles), voile sombre + contenu blanc dessus. Idempotent. */
  var HERO_BG_VIDEO="https://player.vimeo.com/video/910833393?h=94064c722b&background=1&autopause=0&muted=1";
  function heroVideoBg(){
    var hero=document.querySelector(H+" .ps-home-hero");
    if(!hero || hero.classList.contains("ps-hero-bg")) return;
    hero.classList.add("ps-hero-bg");
    var wrap=document.createElement("div"); wrap.className="ps-hero-vwrap";
    var ifr=document.createElement("iframe");
    /* 🔴 `background=1` (autoplay muet, en boucle, sans contrôles) est ce qui
       fait la vidéo de FOND : on l'ajoute si l'URL fournie ne l'a pas, sinon un
       lien Vimeo ordinaire collé dans le builder afficherait les contrôles et ne
       démarrerait pas tout seul. */
    var bg=psReglage("lien_video_background",HERO_BG_VIDEO);
    if(!/[?&]background=/.test(bg)) bg+=(bg.indexOf("?")<0?"?":"&")+"background=1&autopause=0&muted=1";
    ifr.src=bg;
    ifr.setAttribute("allow","autoplay; fullscreen; picture-in-picture");
    ifr.setAttribute("frameborder","0");
    ifr.setAttribute("title","Vidéo de fond");
    wrap.appendChild(ifr);
    var scrim=document.createElement("div"); scrim.className="ps-hero-scrim";
    var first=hero.firstChild;
    hero.insertBefore(wrap, first);
    hero.insertBefore(scrim, first);   // ordre DOM : wrap(z0), scrim(z1), contenu(z2)
    /* masque la colonne vidéo latérale d'origine (la vidéo est maintenant en fond) */
    var sideVid=hero.querySelector(".learnworlds-video-iframe-wrapper, .learnworlds-video-iframe");
    var sideCol=sideVid && (sideVid.closest(".lw-cols > .col") || sideVid.closest(".col"));
    if(sideCol) sideCol.classList.add("ps-hero-vidcol");
    /* --- boutons : volume (son de la vidéo de fond) + « Regarder la vidéo » (popup) --- */
    var IVOL='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
    var IMUTE='<svg viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>';
    var IPLAY='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none"/></svg>';
    var ctrls=document.createElement("div"); ctrls.className="ps-hero-ctrls";
    var vol=document.createElement("button"); vol.className="ps-hero-btn ps-hero-vol"; vol.type="button"; vol.setAttribute("aria-label","Activer le son"); vol.innerHTML=IMUTE;
    var muted=true;
    vol.addEventListener("click",function(){ muted=!muted; psVimeo(ifr,"setMuted",muted); psVimeo(ifr,"setVolume",muted?0:1); vol.innerHTML=muted?IMUTE:IVOL; vol.setAttribute("aria-label",muted?"Activer le son":"Couper le son"); });
    var watch=document.createElement("button"); watch.className="ps-hero-btn ps-hero-watch"; watch.type="button"; watch.innerHTML=IPLAY+'<span>Regarder la vidéo</span>';
    watch.addEventListener("click",function(){ psHeroModal(ifr); });
    ctrls.appendChild(vol); ctrls.appendChild(watch);
    hero.appendChild(ctrls);
  }

  /* FAQ : transforme les `.faq-card` (chargées ouvertes) en accordéon — corps
     repliés, clic sur le header pour ouvrir/fermer. Idempotent (data-ps-faq).
     Le 1er reste ouvert. */
  function buildFaq(){
    var faq=document.querySelector(H+" .ps-home-faq");
    if(!faq) return;
    faq.querySelectorAll(".faq-card").forEach(function(card,idx){
      if(card.dataset.psFaq) return;
      var q=card.querySelector(".learnworlds-heading3,.learnworlds-heading4,h3,h4");
      var bodies=card.querySelectorAll(".learnworlds-main-text, ul, ol");
      if(!q || !bodies.length) return;
      card.dataset.psFaq="1";
      Array.prototype.forEach.call(bodies,function(b){ b.classList.add("ps-faq-body"); });
      var icon=card.querySelector(".accordion-icon");
      /* header cliquable = l'ancêtre de la question qui contient aussi le chevron */
      var head=q, a=q.parentElement;
      while(a && a!==card){ if(icon && a.contains(icon)){ head=a; break; } a=a.parentElement; }
      head.classList.add("ps-faq-q");
      var toggle=function(){ card.classList.toggle("ps-faq-open"); };
      head.addEventListener("click",toggle);
      if(icon && !head.contains(icon)) icon.addEventListener("click",toggle);
      if(idx===0) card.classList.add("ps-faq-open");
    });
  }

  /* ====================================================================
     SECTION PARTENAIRE (école cliente) — juste sous le hero
     --------------------------------------------------------------------
     Pendant du badge d'en-tête posé par `tokens.js`. Toute la donnée (nom,
     titre, texte, puces) vient de la table PARTENAIRES de tokens.js, exposée
     ici via `window.PS_PARTENAIRE` : ajouter une école ne touche QUE tokens.js.
     🔴 Rien ne s'affiche pour un visiteur anonyme (`me` n'existe pas) ni pour un
     membre sans école partenaire — c'est voulu.
     🔴 tokens.js peut être chargé APRÈS nous : `PS_PARTENAIRE` est donc lu à
     chaque passage de build() (relances + MutationObserver), pas une seule fois.
     Placement : après la 2e section de tête (section 1 = topbar, section 2 = le
     vrai hero vidéo) → la bande partenaire est la 1re chose sous le hero. */
  var PART_ICONS=[
    '<path d="M7 11V8a5 5 0 0 1 9.9-1"/><rect x="4" y="11" width="16" height="10" rx="2"/>',
    '<path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="4"/><path d="M22 20v-2a4 4 0 0 0-3-3.9"/>',
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>'
  ];
  function buildPartenaire(){
    var p=window.PS_PARTENAIRE;
    if(!p) return;
    var hote=document.querySelector(H);
    if(!hote) return;
    var deja=hote.querySelector(".ps-part");
    if(deja){ if(deja.getAttribute("data-ps-part")===p.nom) return; deja.remove(); }

    if(!document.getElementById("ps-part-css")){
      var st=document.createElement("style"); st.id="ps-part-css";
      st.textContent=
        /* 🔴 font-size ET text-align redéclarés : les sections LW posent
           `font-size:0` + `text-align:center`, qui descendent jusqu'ici. */
        H+" .ps-part{font-size:16px !important;text-align:left !important;padding:34px 20px 6px !important;}"+
        H+" .ps-part-in{max-width:1120px !important;margin:0 auto !important;background:#F4F7FC !important;"+
          "border:1px solid #E3E8F0 !important;border-radius:var(--ps-r-card,16px) !important;padding:28px 30px 30px !important;}"+
        H+" .ps-part-head{display:flex !important;align-items:center !important;gap:14px !important;flex-wrap:wrap !important;margin-bottom:14px !important;}"+
        H+" .ps-part-nom{"+FT+"font-size:17px !important;font-weight:800 !important;letter-spacing:.16em !important;color:#243B6B !important;"+
          "border:2px solid #243B6B !important;border-radius:5px !important;padding:5px 12px !important;line-height:1.2 !important;}"+
        H+" .ps-part-img{height:34px !important;width:auto !important;display:block !important;}"+
        H+" .ps-part-pill{"+FT+"font-size:11.5px !important;font-weight:700 !important;letter-spacing:.06em !important;text-transform:uppercase !important;"+
          "background:#E4EDFA !important;color:#1B3D6B !important;padding:6px 12px !important;border-radius:var(--ps-r-pill,999px) !important;}"+
        H+" .ps-part-t{"+FT+"font-size:26px !important;font-weight:800 !important;color:#243B6B !important;letter-spacing:-.02em !important;"+
          "line-height:1.25 !important;margin:0 0 9px !important;}"+
        H+" .ps-part-x{"+FT+"font-size:15px !important;font-weight:500 !important;color:#4B5563 !important;line-height:1.6 !important;"+
          "margin:0 0 20px !important;max-width:660px !important;}"+
        H+" .ps-part-g{display:grid !important;grid-template-columns:repeat(auto-fit,minmax(180px,1fr)) !important;gap:13px !important;}"+
        H+" .ps-part-c{background:#fff !important;border:1px solid #E9EEF6 !important;border-radius:11px !important;padding:14px 16px !important;}"+
        H+" .ps-part-c svg{display:block !important;color:var(--ps-accent,#507EC5) !important;margin-bottom:7px !important;}"+
        H+" .ps-part-ct{"+FT+"font-size:14px !important;font-weight:700 !important;color:#243B6B !important;margin:0 !important;}"+
        H+" .ps-part-cs{"+FT+"font-size:13px !important;font-weight:500 !important;color:#8A93A5 !important;margin:2px 0 0 !important;}"+
        /* ---- cartes d'accompagnement, sous la bande partenaire ---- */
        H+" .ps-offres{max-width:1120px !important;margin:16px auto 0 !important;display:grid !important;"+
          "grid-template-columns:repeat(auto-fit,minmax(232px,1fr)) !important;gap:14px !important;}"+
        H+" .ps-offre{display:flex !important;flex-direction:column !important;background:#fff !important;"+
          "border:1px solid #E3E8F0 !important;border-radius:var(--ps-r-card,16px) !important;padding:18px 19px 19px !important;"+
          "transition:transform .2s ease, box-shadow .2s ease !important;}"+
        H+" .ps-offre:hover{transform:translateY(-2px) !important;box-shadow:0 10px 26px rgba(15,23,42,.10) !important;}"+
        H+" .ps-offre-h{display:flex !important;align-items:center !important;gap:9px !important;margin-bottom:11px !important;flex-wrap:wrap !important;}"+
        H+" .ps-offre-t{"+FT+"font-size:16.5px !important;font-weight:800 !important;color:#243B6B !important;line-height:1.25 !important;}"+
        H+" .ps-offre-l{"+FT+"font-size:13.5px !important;font-weight:500 !important;color:#4B5563 !important;line-height:1.5 !important;"+
          "margin:0 0 7px !important;padding-left:14px !important;position:relative !important;}"+
        /* puce ronde à la couleur d'accent, alignée sur la 1re ligne de texte */
        H+" .ps-offre-l::before{content:'' !important;position:absolute !important;left:0 !important;top:7px !important;"+
          "width:5px !important;height:5px !important;border-radius:50% !important;background:var(--ps-accent,#507EC5) !important;}"+
        /* le bouton est collé en bas : les 4 cartes s'alignent malgré des textes de longueurs différentes */
        H+" .ps-offre-cta{margin-top:auto !important;display:block !important;text-align:center !important;"+FT+
          "font-size:13.5px !important;font-weight:700 !important;padding:11px 14px !important;"+
          "border-radius:var(--ps-r-pill,999px) !important;background:var(--ps-accent,#507EC5) !important;color:#fff !important;"+
          "text-decoration:none !important;border:0 !important;}"+
        H+" a.ps-offre-cta:hover{filter:brightness(1.08) !important;color:#fff !important;text-decoration:none !important;}"+
        /* 🔴 URL pas encore fournie : pastille inerte, curseur par défaut — un
           lien mort renverrait l'étudiant en haut de page. */
        H+" span.ps-offre-cta{opacity:.55 !important;cursor:default !important;}"+
        "@media (max-width:700px){"+H+" .ps-part-t{font-size:21px !important;}"+H+" .ps-part-in{padding:22px 20px 24px !important;}}";
      (document.head||document.documentElement).appendChild(st);
    }

    var wrap=document.createElement("div");
    wrap.className="ps-part";
    wrap.setAttribute("data-ps-part", p.nom);
    var box=document.createElement("div"); box.className="ps-part-in";

    var head=document.createElement("div"); head.className="ps-part-head";
    if(p.logo){
      var im=document.createElement("img"); im.className="ps-part-img"; im.src=p.logo; im.alt=p.nom;
      head.appendChild(im);
    } else {
      var nm=document.createElement("span"); nm.className="ps-part-nom"; nm.textContent=p.nom;
      head.appendChild(nm);
    }
    if(p.pastille){
      var pl=document.createElement("span"); pl.className="ps-part-pill"; pl.textContent=p.pastille;
      head.appendChild(pl);
    }
    box.appendChild(head);

    var t=document.createElement("h2"); t.className="ps-part-t"; t.textContent=p.titre||""; box.appendChild(t);
    var x=document.createElement("p"); x.className="ps-part-x"; x.textContent=p.texte||""; box.appendChild(x);

    if(p.puces && p.puces.length){
      var g=document.createElement("div"); g.className="ps-part-g";
      var NS="http://www.w3.org/2000/svg";
      p.puces.forEach(function(pc,i){
        var c=document.createElement("div"); c.className="ps-part-c";
        var svg=document.createElementNS(NS,"svg");
        svg.setAttribute("viewBox","0 0 24 24"); svg.setAttribute("width","20"); svg.setAttribute("height","20");
        svg.setAttribute("fill","none"); svg.setAttribute("stroke","currentColor");
        svg.setAttribute("stroke-width","1.8"); svg.setAttribute("stroke-linecap","round"); svg.setAttribute("stroke-linejoin","round");
        var tmp=document.createElementNS(NS,"g");
        tmp.innerHTML=PART_ICONS[i%PART_ICONS.length];
        while(tmp.firstChild) svg.appendChild(tmp.firstChild);
        c.appendChild(svg);
        var ct=document.createElement("p"); ct.className="ps-part-ct"; ct.textContent=pc.t||""; c.appendChild(ct);
        var cs=document.createElement("p"); cs.className="ps-part-cs"; cs.textContent=pc.s||""; c.appendChild(cs);
        g.appendChild(c);
      });
      box.appendChild(g);
    }

    wrap.appendChild(box);

    /* Cartes d'accompagnement (présentiel), sous la bande partenaire. */
    if(p.offres && p.offres.length){
      var grille=document.createElement("div"); grille.className="ps-offres";
      p.offres.forEach(function(o){
        var c=document.createElement("div"); c.className="ps-offre";
        var head=document.createElement("div"); head.className="ps-offre-h";
        var t=document.createElement("span"); t.className="ps-offre-t"; t.textContent=o.titre||"";
        head.appendChild(t);
        c.appendChild(head);
        (o.lignes||[]).forEach(function(txt){
          var l=document.createElement("p"); l.className="ps-offre-l"; l.textContent=txt;
          c.appendChild(l);
        });
        if(o.cta){
          /* lien si l'URL est connue, pastille inerte sinon (cf. commentaire CSS) */
          var b=document.createElement(o.url ? "a" : "span");
          b.className="ps-offre-cta";
          if(o.url) b.href=o.url;
          b.textContent=o.cta;
          c.appendChild(b);
        }
        grille.appendChild(c);
      });
      wrap.appendChild(grille);
    }

    var secs=hote.querySelectorAll(":scope > section.learnworlds-section, :scope > section");
    if(secs.length>=2 && secs[1].parentNode) secs[1].parentNode.insertBefore(wrap, secs[1].nextSibling);
    else hote.insertBefore(wrap, hote.firstChild);
  }

  function build(){
    if(!surLaPage()) return;
    styles(); marquer(); cartes(); buildStats(); buildCta(); buildPreuve(); buildAtouts(); buildCabinets(); buildTimeline(); buildProfils(); buildEquipe(); heroVideoBg(); setHeroVideo(); buildFaq(); buildPartenaire();
  }

  /* 🔴 Planif via setTimeout (PAS requestAnimationFrame) : rAF est GELÉ dans un onglet
     d'arrière-plan, ce qui empêchait marquer()/buildCabinets() de rattraper les sections
     rendues tard. setTimeout tourne même en arrière-plan. */
  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; setTimeout(function(){ scheduled=false; build(); }, 60); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.documentElement,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
