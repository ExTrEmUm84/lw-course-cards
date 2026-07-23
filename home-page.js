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
    H+" .ps-home-atouts .learnworlds-heading3{font-size:16px !important;color:var(--ps-marine,#243B6B) !important;margin-top:10px !important;}",

    /* --- 5) BANDE CTA « Avez-vous besoin d'une formation » : centrée --- */
    H+" .ps-home-cta{text-align:center !important;}",

    /* --- 6) PREUVE (1% / 90%) : les chiffres en accent, la phrase en marine --- */
    H+" .ps-home-preuve .learnworlds-heading4{color:var(--ps-accent,#507EC5) !important;font-size:22px !important;font-weight:800 !important;letter-spacing:-.02em !important;}",
    H+" .ps-home-preuve .learnworlds-heading3{color:var(--ps-marine,#243B6B) !important;font-weight:800 !important;}",

    /* --- 8) PROFILS : fond blanc (le fond bleu clair du template écrasait le titre),
         cartes à liseré d'accent en haut --- */
    H+" .ps-home-profils{background:#fff !important;}",
    H+" .ps-home-profils .box-shadow-round-light,"+H+" .ps-home-profils .radius-15{border-top:3px solid var(--ps-accent,#507EC5) !important;padding:26px !important;}",
    H+" .ps-home-profils .learnworlds-heading4{color:var(--ps-marine,#243B6B) !important;}",

    /* --- 10) HISTOIRE (timeline) : les dates en accent --- */
    H+" .ps-home-histoire .learnworlds-heading4{color:var(--ps-accent,#507EC5) !important;font-weight:800 !important;letter-spacing:-.01em !important;}",

    /* --- 11) ÉQUIPE : images arrondies, noms marine, rôles accent --- */
    H+" .ps-home-equipe .learnworlds-image{border-radius:16px !important;}",
    H+" .ps-home-equipe .learnworlds-heading3{color:var(--ps-marine,#243B6B) !important;font-size:18px !important;}",
    H+" .ps-home-equipe .learnworlds-heading4{color:var(--ps-accent,#507EC5) !important;font-weight:700 !important;}",

    /* --- 12) ARTICLES : bouton « Charger plus » en outline centré --- */
    H+" .ps-home-articles .learnworlds-button{background:transparent !important;border:1.5px solid var(--ps-accent,#507EC5) !important;color:var(--ps-accent,#507EC5) !important;}",
    H+" .ps-home-articles .learnworlds-button:hover{background:var(--ps-accent,#507EC5) !important;color:#fff !important;}",

    /* --- 13) RDV : bande foncée #203866 -> titres blancs, bouton blanc.
         🔴 on cible AUSSI les titres en <div> (learnworlds-heading/subheading) sinon la
         règle globale marine gagne et le titre reste sombre sur fond sombre (illisible). */
    [H+" .ps-home-rdv h1",H+" .ps-home-rdv h2",H+" .ps-home-rdv h3",H+" .ps-home-rdv h4",
     H+" .ps-home-rdv .learnworlds-heading",H+" .ps-home-rdv .learnworlds-subheading:not(.learnworlds-icon)",
     H+" .ps-home-rdv .learnworlds-heading3",H+" .ps-home-rdv .learnworlds-heading4",H+" .ps-home-rdv .learnworlds-main-text"].join(",")+"{color:#fff !important;}",
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

  function build(){
    if(!surLaPage()) return;
    styles(); marquer(); cartes(); buildCabinets();
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
