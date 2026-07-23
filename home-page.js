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
    /* icône offres : tuile arrondie (au lieu du cercle global) */
    H+" .ps-home-offres .box-icon-wrapper,"+H+" .ps-home-offres .learnworlds-icon-wrapper{border-radius:14px !important;width:54px !important;height:54px !important;}",
    H+" .ps-home-offres .learnworlds-main-text-large{font-size:14px !important;font-weight:600 !important;color:var(--ps-accent,#507EC5) !important;}",
    H+" .ps-home-atouts .learnworlds-heading3{font-size:16px !important;color:var(--ps-marine,#243B6B) !important;margin-top:12px !important;}",
    /* 🔴 carte atout : picto CENTRÉ EN HAUT, contenu centré (demande Ziad) —
       la carte passe en colonne, l'icône (1er enfant) se centre au-dessus du titre+desc. */
    H+" .ps-home-atouts .ps-hcard{display:flex !important;flex-direction:column !important;align-items:center !important;text-align:center !important;padding:30px 22px !important;}",
    [H+" .ps-home-atouts .ps-hcard .box-icon-wrapper",H+" .ps-home-atouts .ps-hcard .learnworlds-icon-wrapper"].join(",")+"{margin:0 auto 4px !important;width:64px !important;height:64px !important;}",
    H+" .ps-home-atouts .ps-hcard .flexible-part{width:100% !important;}",
    H+" .ps-home-atouts .ps-hcard .box-icon-wrapper .learnworlds-icon,"+H+" .ps-home-atouts .ps-hcard .learnworlds-icon-wrapper .learnworlds-icon{font-size:24px !important;}",

    /* --- 5) BANDE CTA « Avez-vous besoin d'une formation » : centrée --- */
    H+" .ps-home-cta{text-align:center !important;}",

    /* --- 6) PREUVE (1% / 90%) : les chiffres en accent, la phrase en marine --- */
    H+" .ps-home-preuve .learnworlds-heading4{color:var(--ps-accent,#507EC5) !important;font-size:22px !important;font-weight:800 !important;letter-spacing:-.02em !important;}",
    H+" .ps-home-preuve .learnworlds-heading3{color:var(--ps-marine,#243B6B) !important;font-weight:800 !important;}",

    /* --- 8) PROFILS v2 (buildProfils) : REFONTE — donut animé (répartition) + 2 cartes
         profils à pastilles + cabinets en TIERS à chips. Le natif (pie moche + accordéons
         + liste) est masqué. Fond doux, contenu en cartes blanches. --- */
    [H+" .ps-home-profils",H+" .ps-home-profils .learnworlds-section-content"].join(",")+"{background:var(--ps-surface-soft,#F6F8FB) !important;}",
    H+" .ps-pf2{display:grid !important;grid-template-columns:1fr 1.15fr !important;gap:18px !important;max-width:1000px !important;margin:24px auto 0 !important;align-items:start !important;}",
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
    H+" .ps-pf2-right{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:16px !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;padding:24px !important;}",
    H+" .ps-pf2-right-t{"+FT+"font-size:17px !important;font-weight:800 !important;color:var(--ps-marine,#243B6B) !important;margin:0 0 16px !important;}",
    H+" .ps-tier{display:flex !important;gap:11px !important;align-items:flex-start !important;margin-bottom:12px !important;}",
    H+" .ps-tierbadge{display:inline-flex !important;align-items:center !important;justify-content:center !important;min-width:66px !important;height:26px !important;padding:0 10px !important;background:var(--ps-marine,#243B6B) !important;color:#fff !important;"+FT+"font-size:12px !important;font-weight:700 !important;border-radius:7px !important;flex:none !important;}",
    H+" .ps-tier-firms{display:flex !important;flex-wrap:wrap !important;gap:6px !important;}",
    H+" .ps-pf-callout{margin-top:16px !important;background:var(--ps-accent-tint,#EDF4FF) !important;border-radius:12px !important;padding:14px 16px !important;"+FT+"font-size:13.5px !important;color:var(--ps-marine,#243B6B) !important;font-weight:600 !important;line-height:1.5 !important;}",
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

    /* --- 14) FAQ : items d'accordéon en cartes propres, questions marine --- */
    H+" .ps-home-faq .learnworlds-heading3{color:var(--ps-marine,#243B6B) !important;font-weight:700 !important;font-size:16px !important;}",
    [H+" .ps-home-faq [class*='accordion']",H+" .ps-home-faq [class*='collaps']"].join(",")+"{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:12px !important;margin-bottom:10px !important;overflow:hidden !important;}"
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
    [PF_JUNIORS,PF_EXPERT].forEach(function(p,i){
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
    var rt=document.createElement("div"); rt.className="ps-pf2-right-t"; rt.textContent="À quels cabinets nous préparons-vous ?"; right.appendChild(rt);
    PF_TIERS.forEach(function(tr){
      var row=document.createElement("div"); row.className="ps-tier";
      var b=document.createElement("span"); b.className="ps-tierbadge"; b.textContent=tr.tier;
      var fw=document.createElement("div"); fw.className="ps-tier-firms";
      tr.firms.forEach(function(f){ var ch=document.createElement("span"); ch.className="ps-chip"; ch.textContent=f; fw.appendChild(ch); });
      row.appendChild(b); row.appendChild(fw); right.appendChild(row);
    });
    var co=document.createElement("div"); co.className="ps-pf-callout"; co.textContent=PF_CALLOUT; right.appendChild(co);
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

  /* Vidéo du hero : le template a un iframe Vimeo avec un ID mort (« Cette vidéo
     n'existe pas »). On remplace la source par la vraie vidéo (demande Ziad).
     Posé UNE fois (garde `data-ps-vid`) pour ne pas recharger la vidéo à chaque build. */
  var HERO_VIDEO="https://player.vimeo.com/video/910833393?h=94064c722b&badge=0&autopause=0&player_id=0&app_id=58479";
  function setHeroVideo(){
    var hero=document.querySelector(H+" .ps-home-hero");
    if(!hero) return;
    var ifr=hero.querySelector(".learnworlds-video-iframe iframe, .learnworlds-video-iframe-wrapper iframe, iframe");
    if(!ifr || ifr.getAttribute("data-ps-vid")) return;
    ifr.setAttribute("src",HERO_VIDEO);
    ifr.setAttribute("allow","autoplay; fullscreen; picture-in-picture; clipboard-write");
    ifr.setAttribute("allowfullscreen","");
    ifr.setAttribute("data-ps-vid","1");
  }

  function build(){
    if(!surLaPage()) return;
    styles(); marquer(); cartes(); buildCabinets(); buildTimeline(); buildProfils(); setHeroVideo();
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
