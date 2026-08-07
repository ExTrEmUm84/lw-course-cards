/* ============================================================
   Cartes "Fiches cabinet" + hero — page /fiches-cabinet
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE :
     <script src="https://extremum84.github.io/lw-course-cards/cabinet-cards.js"></script>

   Même coquille que `sector-cards.js` (blanc, bord #E6E9EF, radius 16,
   survol qui soulève, grille de 3) mais SANS bandeau, SANS picto et SANS
   logo : la carte ne porte que titre + description + CTA.
   Choix de Ziad le 16/07 — les logos des cabinets (Advancy, Bain) sont
   pourtant présents en `background-image` sur `.learnworlds-image` et
   restent disponibles si on veut les réintroduire un jour. ⚠️ Ils sont
   servis en `background-size:cover`, qui ROGNE : un logo demanderait
   `contain` sur fond blanc.

   Le titre est à 25px comme les cartes de la page Cas — l'autre jeu de
   cartes SANS visuel. (`sector-cards.js` est à 21px, mais ses cartes ont
   un grand picto qui porte le regard ; ici le titre est seul.)

   ⚠️ NE PAS charger `course-cards.js` ni `sector-cards.js` ici : leur CSS
   masque le contenu natif et leur build() a d'autres exigences -> cartes
   vides. Ici le masquage est conditionné à `[data-ps-c]`, donc une carte
   non reconstruite reste intacte.

   ⚠️ `#pageContent .lw-cols.multiple-rows` matche AUSSI la barre de
   filtres. Tout est scopé sous `.cards-grandpa >`, et jamais de `display`
   sur le sélecteur nu (LearnWorlds masque les filtres désactivés par un
   `display:none` INLINE qu'un `!important` écraserait).
   ============================================================ */
(function(){
  "use strict";

  // --- 1) Police Figtree ---
  if(!document.getElementById("ps-figtree")){
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(f);
  }

  var S="#pageContent";
  var GRID=S+" .cards-grandpa > .lw-cols.multiple-rows";

  /* Logos hébergés sur GitHub Pages (dossier /logos), SVG TRANSPARENTS (Wikimedia
     Commons). 🔴 Depuis le 23/07 on n'utilise QUE ceux-ci (plus les images
     uploadées dans LW) : le design « logo blanc sur cercle bleu » exige un fond
     transparent, or les images LW (Advancy/Bain/Sia) ont un fond opaque.
     Clé = nom normalisé (minuscule, sans accent ni séparateur). Cabinets sans
     SVG propre (Advancy, Sia, Kéa) -> badge d'initiales. Ajouter = SVG dans
     /logos + une ligne ici. */
  var LOGO_BASE="https://extremum84.github.io/lw-course-cards/logos/";
  var LOGOS={
    accenture:"accenture.svg",
    bain:"bain.svg", baincompany:"bain.svg",
    bcg:"bcg.svg", bostonconsultinggroup:"bcg.svg",
    eyconsulting:"ey.svg",
    eyparthenon:"ey-parthenon.svg",
    mckinsey:"mckinsey.svg", mckinseycompany:"mckinsey.svg",
    wavestone:"wavestone.svg"
  };
  function normName(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,""); }
  function logoFor(title){ var f=LOGOS[normName(title)]; return f ? 'url("'+LOGO_BASE+f+'")' : ""; }

  /** Initiales du cabinet (repli quand il n'y a pas de logo). */
  function initialsOf(name){
    var w=(name||"").trim().split(/\s+/).filter(Boolean);
    if(!w.length) return "?";
    return (w.length===1 ? w[0].slice(0,2) : (w[0][0]+w[1][0])).toUpperCase();
  }

  // --- 2) Styles ---
  var CSS=[
    /* grille de 3, alignée comme les autres pages (1000px centrés).
       Le natif fait 1120px ici (mesuré : 290->1410) : on reprend 1000 pour
       que les cartes tombent sur le même bord gauche que le hero. */
    /* 🔴 Style « carte cours » : cercle centré qui FLOTTE au-dessus (cf. course-cards.js).
       - padding-top:96px : place pour les cercles de la 1re rangée.
       - row-gap:106px : place pour les cercles des rangées suivantes, sinon ils
         débordent sur les cartes de la rangée du dessus (grille multi-rangées,
         contrairement au rail d'une seule rangée de la page Cours). column-gap:24px. */
    GRID+"{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:84px 24px !important;max-width:1000px !important;margin:0 auto !important;padding:78px 0 0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* overflow:visible pour laisser sortir le badge ; flex column pour empiler
       badge (flottant) puis contenu — comme les cartes cours. */
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card{position:relative !important;cursor:pointer !important;width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;overflow:visible !important;display:flex !important;flex-direction:column !important;isolation:isolate !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover{box-shadow:0 14px 34px rgba(0,0,0,.10) !important;transform:translateY(-3px) !important;}",
    /* badge + lien-calque = enfants DIRECTS de la carte -> exclus du masquage */
    /* 🔴 `:not(.ps-mline)` AJOUTE LE 03/08. Cette regle masque tous les enfants
       de la carte sauf ceux que ce script construit — elle a ete ecrite avant
       que le lisere puisse arriver ici. Resultat : `tokens.js` injectait bien
       le SVG, au bon endroit et a la bonne taille, et cette ligne le mettait
       en `display:none`. Mesure : SVG 0x0, display none, alors que
       stroke-dashoffset valait bien 0 au survol — tout etait juste sauf
       qu'il etait masque. `course-cards.js` l'excluait deja ; pas les autres.
       ⚠️ Toute nouvelle classe injectee de l'exterieur devra etre ajoutee ici. */
    S+" .lw-course-card[data-ps-c] > *:not(.ps-ccab):not(.ps-cab-logo):not(.ps-cab-cover):not(.ps-mline){display:none !important;}",
    /* lien-calque : couvre toute la carte, transparent, sous le CTA (z-index) */
    ".ps-cab-cover{position:absolute !important;inset:0 !important;z-index:1 !important;border-radius:var(--ps-r-card,16px) !important;background:transparent !important;text-decoration:none !important;}",

    /* height:100% : sans ça la carte reconstruite s'arrête à son contenu au lieu
       de remplir la hauteur étirée par la grille -> le `margin-bottom:auto` de
       la description n'a rien à absorber et les CTA se désalignent entre cartes. */
    ".ps-ccab{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;padding:0 26px 26px !important;text-align:left !important;}",
    /* Logo du cabinet, HARMONISÉ sur toutes les cartes (demande de Ziad le 22/07) :
       hauteur fixe + `background-size:contain` -> aucun rognage, tous à la même
       échelle visuelle quel que soit le ratio du logo ; MONOCHROME via
       `grayscale(1)` + opacité normalisée pour que des logos de teintes très
       variées (bleu Advancy, violet Accenture, rouge…) se ressemblent. Couleur
       restaurée au survol de la carte, repère de reconnaissance. Le logo natif
       est un `background-image` sur `.learnworlds-image` (masqué) : build() en
       recopie l'URL sur cette div. */
    /* CERCLE 180px CENTRÉ qui FLOTTE au-dessus de la carte (style « carte cours » :
       `margin:-90px auto 18px` = remonte de la moitié + centré ; bordure blanche
       5px + ombre, comme l'illustration ronde des cours). Fond bleu de marque
       #507EC5 (choix Ziad 24/07, était #203866 marine), logo en BLANC par-dessus.
       🔴 background-color EN DUR (pas var(--ps-accent) : l'accent de la page
       Cabinets est ROUGE #c51d4a). 🔴 Blanchiment (`brightness(0) invert(1)`) sur
       un élément INTERNE `.ps-cab-logo-img` (sinon le fond bleu blanchit aussi). */
    ".ps-cab-logo{width:140px !important;height:140px !important;border-radius:50% !important;background-color:var(--ps-cab-logo,#507EC5) !important;display:flex !important;align-items:center !important;justify-content:center !important;margin:-70px auto 16px !important;border:4px solid #fff !important;box-shadow:0 6px 18px rgba(15,23,42,.12) !important;overflow:hidden !important;flex:none !important;transition:box-shadow .25s ease !important;}",
    ".ps-cab-logo-img{width:66% !important;height:66% !important;background-repeat:no-repeat !important;background-position:center !important;background-size:contain !important;filter:brightness(0) invert(1) !important;}",
    /* Repli : cabinet sans logo hébergé transparent (Advancy, Sia, Kéa) ->
       initiales BLANCHES sur le même cercle bleu, look homogène. */
    ".ps-cab-logo--ini{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:42px !important;font-weight:800 !important;color:#fff !important;letter-spacing:.5px !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover .ps-cab-logo{box-shadow:0 10px 26px rgba(15,23,42,.18) !important;}",
    ".ps-cab-title{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:25px !important;line-height:1.2 !important;font-weight:800 !important;letter-spacing:-.02em !important;color:#243B6B !important;margin:0 0 10px !important;}",
    /* description bornée à 4 lignes : les cartes gardent la même hauteur */
    ".ps-cab-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;margin:0 !important;display:-webkit-box !important;-webkit-line-clamp:4 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* Même CTA que partout ailleurs.
       🔴 `margin-top:auto` sur le LIEN, et non `margin-bottom:auto` sur la
       description (comme le fait sector-cards.js) : toutes les fiches n'ont pas
       de description — "Bain & Company" n'en a pas — et sans elle plus rien ne
       poussait le CTA, qui remontait se coller au titre au milieu d'une carte
       vide (constaté à l'écran). Le lien, lui, existe toujours.
       `padding-top` et non `margin-top` pour l'écart : le `margin-top:auto`
       occupe déjà la propriété. */
    ".ps-cab-link{position:relative !important;z-index:2 !important;display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:auto !important;padding-top:18px !important;color:var(--ps-accent,#507EC5) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-cab-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-cab-link:hover{color:var(--ps-accent-hover,#486798) !important;}",
    ".ps-cab-link:hover::after{transform:translateX(5px) !important;}",

    /* ================= TITRES (hero) — porté de case-cards.js ============== */
    S+" h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* LW sert le H1 avec ses "#" : on le masque tant que heroText() ne l'a pas
       transformé, sinon les "#" s'affichent en clair une demi-seconde.
       `visibility` et non `display` : la place reste réservée. Filet de
       sécurité à 2,5s plus bas, sinon un titre sans "#" resterait invisible. */
    S+" h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    S+" h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-h2,var(--ps-accent,#507EC5)) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* 🔴 Séparateur ajouté le 07/08 : il n'existait QUE sur la page Cours, alors
       que le titre en accent, lui, était partout. Demande de Ziad — « sans oublier
       le petit séparateur qui vient par dessus », sur toutes les pages.
       Sa couleur suit celle du titre tant que `--ps-h2-sep` n'est pas posée. */
    S+" h2.learnworlds-subheading::before{content:\"\" !important;display:block !important;width:60px !important;height:4px !important;border-radius:2px !important;background:var(--ps-h2-sep,var(--ps-h2,var(--ps-accent,#507EC5))) !important;margin:0 0 24px 0 !important;}",
    S+" .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    /* ─── Tuile de progression EN HAUT (portée de course-cards.js) ───
       mountKpi() enveloppe le H1 + la tuile dans `.ps-herotop` (titre à gauche,
       tuile 352px à droite). Moyenne de la progression des fiches : non-inscrites
       = 0 au numérateur, dénominateur = TOUTES les fiches (sémantique Cours). */
    S+" .ps-herotop{display:flex !important;align-items:flex-start !important;justify-content:space-between !important;gap:32px !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    S+" .ps-herotop > h1.learnworlds-heading{margin:0 !important;max-width:none !important;flex:1 1 auto !important;}",
    S+" .ps-herotop > .ps-kpi{flex:0 0 352px !important;margin:6px 0 0 0 !important;}",
    ".ps-kpi{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:16px !important;padding:20px 22px !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 14px rgba(15,23,42,.05) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    ".ps-kpi-num{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.1 !important;color:#243B6B !important;}",
    ".ps-kpi-lbl{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;font-weight:500 !important;color:var(--ps-text-soft,#676879) !important;margin-top:2px !important;}",
    ".ps-kpi-ic{flex:0 0 auto !important;width:56px !important;height:56px !important;border-radius:50% !important;background:var(--ps-accent-tint,#edf4ff) !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
    ".ps-kpi-ic svg{width:28px !important;height:28px !important;fill:none !important;stroke:var(--ps-accent,#507EC5) !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-kpi-bar{height:7px !important;border-radius:var(--ps-r-pill,999px) !important;background:#EEF1F6 !important;overflow:hidden !important;margin-top:10px !important;width:100% !important;}",
    ".ps-kpi-bar-in{height:100% !important;border-radius:var(--ps-r-pill,999px) !important;background:var(--ps-accent,#507EC5) !important;transition:width .6s ease !important;}",
    ".ps-kpi-txt{flex:1 1 auto !important;min-width:0 !important;}",
    "@media(max-width:900px){"+S+" .ps-herotop{flex-direction:column !important;gap:20px !important;}"+S+" .ps-herotop > .ps-kpi{flex:0 0 auto !important;width:100% !important;max-width:352px !important;}}",

    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#507EC5) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#507EC5) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",

    "@media(max-width:1040px){"+GRID+"{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:820px){"+S+" h1.learnworlds-heading{font-size:var(--ps-mob-h1,36px) !important;}"+S+" h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}"+S+" .ps-desc{padding-right:0 !important;}}",
    "@media(max-width:700px){"+GRID+"{grid-template-columns:1fr !important;}}"
  ].join("\n");


  /* ====================================================================
     CSS EXPOSÉ POUR LE CONFIGURATEUR — la maquette cesse d'être une COPIE
     --------------------------------------------------------------------
     Demande de Ziad (03/08) : « on peut synchroniser les designs des pages sur
     le board, pour qu'il soit toujours à jour ? ». L'aperçu du configurateur
     était redessiné À LA MAIN, avec l'avertissement, écrit dès le 17/07, qu'il
     « peut dériver si les scripts évoluent ». Il a dérivé.
     Le design des cartes ne vit plus dans LearnWorlds mais ICI : on publie donc
     la feuille telle quelle, et le configurateur la charge au lieu de la
     recopier. Une dérive redevient impossible par construction.

     🔴 `PS_CSS_ONLY` EST UN DRAPEAU POSÉ PAR LE CONFIGURATEUR, JAMAIS PAR LE
     SITE. Charger ce fichier ailleurs que sur LearnWorlds ne doit surtout pas
     déclencher sa logique : observateurs, lecture du DOM, et surtout le dépôt de
     progression vers le Worker. Un garde basé sur le nom de domaine ou sur la
     présence de `#pageContent` aurait pu se tromper — le premier au moindre
     domaine personnalisé, le second si LearnWorlds rend son conteneur en retard.
     Un drapeau explicite ne peut pas se tromper : le site ne le pose jamais.
     ==================================================================== */
  window.PS_CSS=window.PS_CSS||{};
  window.PS_CSS.cabinet=CSS;
  if(window.PS_CSS_ONLY) return;

  var st=document.getElementById("ps-cabinet-style");
  if(!st){ st=document.createElement("style"); st.id="ps-cabinet-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  // --- 3) Hero : machine à écrire sur les segments marqués "#" ---
  /* "Nos fiches pour #le conseil #la stratégie"
     -> préfixe "Nos fiches pour" + phrases qui se tapent / s'effacent en boucle. */
  function heroText(){
    /* .learnworlds-main-text = la description du haut, MAIS AUSSI celle de
       chaque carte, le bouton des catégories du FILTRE et le pied de page.
       🔴 L'exclusion du filtre est indispensable : cette page a une barre de
       filtres, et sans elle le bouton "categories …" reçoit le style de
       description (17px + padding-right:38% sur un bouton). Même piège que sur
       la page Cas. */
    var grandpa=document.querySelector(S+" .cards-grandpa");
    if(grandpa){
      document.querySelectorAll(S+" .learnworlds-main-text").forEach(function(el){
        if(el.closest(".cards-grandpa")) return;                                     // carte
        if(el.closest(".lw-filters, .lw-cols.with-filters")) return;                 // barre de filtres
        if(!(grandpa.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)) return; // pied de page
        el.classList.add("ps-desc");
      });
    }

    var h1=document.querySelector(S+" h1.learnworlds-heading");
    if(!h1 || h1.dataset.psTw) return;
    /* data-ps-tw posé AVANT toute autre condition : c'est lui qui lève le
       masquage CSS. Posé seulement en cas de succès, un titre sans "#"
       resterait invisible pour toujours. */
    h1.dataset.psTw="1";
    var raw=(h1.textContent||"").replace(/\s+/g," ").trim();
    var i=raw.indexOf("#");
    if(i<0) return;                                   // pas de # -> titre natif, rien à animer
    var prefix=raw.slice(0,i).trim();
    var parts=raw.slice(i).split("#").map(function(s){ return s.trim(); }).filter(Boolean);
    if(!parts.length) return;
    /* le texte animé est masqué aux lecteurs d'écran : on rend la phrase complète */
    h1.setAttribute("aria-label", prefix+" "+parts.join(", "));

    var pre=document.createElement("span");
    pre.textContent=prefix+" ";                       // textContent : pas d'injection HTML
    var slot=document.createElement("span");
    slot.className="ps-tw wg-notranslate"; slot.setAttribute("aria-hidden","true");
    var txt=document.createElement("span"); txt.className="ps-tw-txt";
    var cur=document.createElement("span"); cur.className="ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent=""; h1.appendChild(pre); h1.appendChild(slot);
    /* 🔴 Le H1 ENTIER sort de la portée de Weglot : on le reconstruit en JS, donc
       Weglot traduit le préfixe mais ne sait plus le RESTAURER au retour à la
       langue d'origine -> « Our training programs for » restait affiché sur une
       page repassée en français (constaté en prod). On traduit tout nous-mêmes. */
    h1.classList.add("wg-notranslate");

    /* largeur réservée = phrase la plus longue (mesurée police chargée), sinon
       le titre tremble à chaque lettre */
    function reserve(){
      var w=0, keep=txt.textContent;
      slot.style.minWidth="0px";
      parts.forEach(function(p){ txt.textContent=p; w=Math.max(w, txt.getBoundingClientRect().width); });
      txt.textContent=keep;
      slot.style.minWidth=Math.ceil(w)+"px";
    }
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(reserve); else reserve();
    var rt; window.addEventListener("resize",function(){ clearTimeout(rt); rt=setTimeout(reserve,150); });

    /* 🔴 TRADUCTION DES SEGMENTS ANIMÉS (Weglot) — sinon le titre fait des
       ALLERS-RETOURS FR/EN : Weglot traduisait le slot pendant que notre
       minuteur y réécrivait le français, chacun défaisant l'autre en boucle
       (constaté en prod : préfixe traduit « Our training programs for » mais
       segment resté « la stratégie »). Parade en deux temps :
         1. le slot porte `wg-notranslate` -> Weglot ne le touche plus ;
         2. on traduit les phrases nous-mêmes via l'API Weglot (vérifiée en
            direct : « la stratégie » -> « the strategy »), puis on anime le
            résultat. Retour à la langue d'origine -> phrases d'origine.
       🔴 Weglot est injecté par LearnWorlds APRÈS nous -> on réessaie ~16 s,
       et on s'abonne à « languageChanged » dès qu'il est là. */
    var PARTS0=parts.slice(), PREFIX0=prefix, twBound=false;
    var twRM=!!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* list = [préfixe traduit, ...segments traduits] ; null = langue d'origine */
    function psTwApply(list){
      pre.textContent=((list && list[0]) || PREFIX0)+" ";
      for(var k=0;k<parts.length;k++) parts[k]=(list && list[k+1])||PARTS0[k];
      h1.setAttribute("aria-label", pre.textContent+parts.join(", "));
      reserve();
      if(twRM) txt.textContent=parts[0];               // pas d'animation : on repose la 1re phrase
    }
    function psTwTr(evLang){
      var W=window.Weglot;
      if(!W || !W.initialized || typeof W.translate!=="function") return false;
      if(!twBound){ try{ W.on("languageChanged", psTwTr); twBound=true; }catch(e){} }
      /* 🔴 « languageChanged » fournit la NOUVELLE langue en argument. On DOIT
         l'utiliser : au moment du callback, getCurrentLang() peut encore
         renvoyer l'ANCIENNE -> en revenant au français on retraduisait vers
         l'anglais et le titre restait bloqué en anglais (signalé en prod). */
      var to=(typeof evLang==="string" && evLang) ? evLang : W.getCurrentLang();
      var from=(W.options && W.options.language_from) || "fr";
      if(!to || to===from){ psTwApply(null); return true; }
      try{
        W.translate({ words:[{t:1,w:PREFIX0}].concat(PARTS0.map(function(p){ return {t:1,w:p}; })), languageTo:to },
          function(res){ if(res && res.length===PARTS0.length+1) psTwApply(res); });
      }catch(e){}
      return true;
    }
    if(!psTwTr()){ var twN=0, twIv=setInterval(function(){ if(psTwTr()||++twN>40) clearInterval(twIv); }, 400); }

    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      txt.textContent=parts[0]; return;               // pas d'animation si l'utilisateur la refuse
    }
    /* La 1re phrase est affichée EN ENTIER dès le départ, le cycle ne démarre
       qu'après la pause : sinon le slot part vide et se remplit lettre par
       lettre, ce qui se lit comme un retard d'affichage. */
    var p=0, c=parts[0].length, del=true;
    txt.textContent=parts[0];
    function tick(){
      var full=parts[p];
      c += del ? -1 : 1;
      txt.textContent=full.slice(0,c);
      var d = del ? 34 : 58;                          // frappe / effacement
      if(!del && c>=full.length){ del=true; d=1700; } // pause phrase complète
      else if(del && c<=0){ del=false; p=(p+1)%parts.length; d=320; }
      setTimeout(tick,d);
    }
    setTimeout(tick,1700);                            // phrase lisible avant le 1er effacement
  }

  /* Filet de sécurité du masquage CSS : si heroText() n'a jamais tourné, on
     révèle le titre brut au bout de 2,5s — un titre avec des "#" vaut mieux
     qu'un titre absent. */
  setTimeout(function(){
    var h=document.querySelector(S+" h1.learnworlds-heading");
    if(h && !h.dataset.psTw) h.dataset.psTw="1";
  },2500);

  /* ─── Tuile de progression globale EN HAUT (portée de course-cards.js) ───
     Moyenne de la progression des fiches. Dédup par lien (href). Non-inscrite
     (pas de barre native) = 0 au numérateur, mais reste au dénominateur.
     Aucune fiche inscrite (anonyme) -> pas de donnée : on démonte la tuile et
     le H1 reprend toute la largeur. */
  var ICON_KPI='<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/><path d="M15 7h4v4"/></svg>';
  function mountKpi(){
    var desc=document.querySelector(S+" .ps-desc");
    if(!desc) return;                                // hero pas encore prêt : réessai
    var vus=Object.create(null);
    document.querySelectorAll(S+" .cards-grandpa .lw-course-card").forEach(function(card){
      if(card.classList.contains("ps-lang-off")) return;   // autre langue : hors calcul
      var a=card.querySelector("a.card-link[href], a[href]");
      var cle=a ? a.getAttribute("href") : null;
      if(!cle || cle in vus) return;                 // déjà compté : doublon
      var nat=card.querySelector(".lw-course-card-progress-bar");
      var p=nat ? parseInt((nat.style.width||"").replace("%",""),10) : NaN;
      vus[cle]=isNaN(p) ? null : Math.max(0, Math.min(100, p));
    });
    var cles=Object.keys(vus);
    var avecBarre=cles.filter(function(k){ return vus[k]!==null; });
    var kpi=document.querySelector(S+" .ps-kpi");
    var h1=document.querySelector(S+" h1.learnworlds-heading");
    var top=document.querySelector(S+" .ps-herotop");
    if(!cles.length || !avecBarre.length){           // aucune fiche inscrite -> pas de tuile
      if(kpi) kpi.remove();
      if(top){ if(h1) top.parentNode.insertBefore(h1, top); top.remove(); }
      return;
    }
    var total=0;
    cles.forEach(function(k){ total += (vus[k]||0); });
    var pct=Math.round(total/cles.length);
    /* Rangée haute (titre + tuile) créée UNE fois. Le H1 est seulement DÉPLACÉ :
       la machine à écrire (posée sur ce même élément) survit au déplacement. */
    if(h1 && !top){
      top=document.createElement("div"); top.className="ps-herotop";
      h1.parentNode.insertBefore(top, h1);
      top.appendChild(h1);
    }
    if(!kpi || !kpi.querySelector(".ps-kpi-num")){
      if(kpi) kpi.remove();
      kpi=document.createElement("div");
      kpi.className="ps-kpi";
      kpi.innerHTML='<div class="ps-kpi-txt"><div class="ps-kpi-num"></div><div class="ps-kpi-lbl"></div><div class="ps-kpi-bar"><div class="ps-kpi-bar-in"></div></div></div><span class="ps-kpi-ic" aria-hidden="true">'+ICON_KPI+'</span>';
    }
    var hote=top||desc;
    if(kpi.parentNode!==hote) hote.appendChild(kpi);
    /* 🔴 N'ÉCRIRE QUE SI LA VALEUR CHANGE (cf. sector-cards.js) : sinon on
       réécrit le FRANÇAIS par-dessus la traduction Weglot à chaque passage de
       build(), Weglot retraduit, et la tuile clignote FR/EN en boucle. */
    var sigKpi=pct+"|"+cles.length;
    if(kpi.getAttribute("data-ps-sig")!==sigKpi){
      kpi.setAttribute("data-ps-sig",sigKpi);
      kpi.querySelector(".ps-kpi-num").textContent=pct+" %";
      kpi.querySelector(".ps-kpi-lbl").textContent="Progression sur "+cles.length+" fiches";
      kpi.setAttribute("aria-label","Progression globale : "+pct+" % sur "+cles.length+" fiches");
    }
    kpi.querySelector(".ps-kpi-bar-in").style.width=pct+"%";
  }

  /* Le placeholder de la barre de recherche NATIVE LW est « Rechercher des cours »
     (chaîne système LW, pas un réglage par élément). Sur la page Cabinets on le
     force à « Rechercher un cabinet… ». Idempotent : ne réécrit QUE les placeholders
     contenant « cours » -> une fois corrigé il n'y touche plus, et re-corrige si LW
     re-render le remet à « cours ». N'ajoute/retire aucun nœud -> pas de boucle avec
     l'observer (childList seulement). */
  function searchPlaceholder(){
    var ins=document.querySelectorAll("#pageContent input[placeholder]");
    for(var i=0;i<ins.length;i++){
      if(/cours/i.test(ins[i].getAttribute("placeholder")||"")) ins[i].setAttribute("placeholder","Rechercher un cabinet…");
    }
  }

  // --- 4) Construction des cartes ---
  function build(){
    heroText();
    mountKpi();
    mountFiltres();
    searchPlaceholder();
    document.querySelectorAll(S+" .cards-grandpa .lw-course-card").forEach(function(card){
      if(card.dataset.psC) return;
      var h=card.querySelector(".learnworlds-heading3");
      if(!h) return;
      var title=(h.textContent||"").replace(/\s+/g," ").trim();
      if(!title) return;                       // pas de titre -> on laisse la carte native
      var dEl=card.querySelector(".lw-course-card-descr, .learnworlds-main-text");
      var desc=dEl ? (dEl.textContent||"").replace(/\s+/g," ").trim() : "";
      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";
      /* 🔴 Lien = lien NATIF LW (href de la carte). On NE fabrique PLUS
         « /path-player?courseid=<slug> » à la main : cette URL lecteur est SANS unité
         → LW rend une PAGE BLANCHE (constaté 24/07 sur bain-…-gorilla, un cours pourtant
         PLEIN). Le direct-au-player fiable = réglage NATIF (Site Builder → élément Cours →
         « Lorsque l'on clique sur » → Inscrits → « Lecteur du cours »), qui met la bonne
         URL (avec unité) dans le href natif — que ce `target` recopie tel quel. */
      var target = href;

      /* 🔴 Le BADGE est un enfant DIRECT de la carte (comme l'illustration ronde
         des cartes cours), pas dans .ps-ccab : c'est lui qui FLOTTE au-dessus via
         `margin-top:-90px`. On n'utilise QUE les logos hébergés transparents (une
         image uploadée dans LW a un fond opaque -> bloc blanc sous le filtre). Le
         logo va dans un élément INTERNE `.ps-cab-logo-img` (sinon le filtre
         blanchit aussi le fond bleu). Pas de logo hébergé (Advancy/Sia/Kéa) ->
         initiales blanches. */
      var badge;
      var logo = logoFor(title);
      if(logo){
        badge=document.createElement("div");
        badge.className="ps-cab-logo";
        badge.setAttribute("role","img");
        badge.setAttribute("aria-label","Logo "+title);
        var im=document.createElement("div");
        im.className="ps-cab-logo-img";
        im.style.backgroundImage=logo;
        badge.appendChild(im);
      } else {
        badge=document.createElement("div");
        badge.className="ps-cab-logo ps-cab-logo--ini";
        badge.textContent=initialsOf(title);
        badge.setAttribute("aria-hidden","true");
      }

      var d=document.createElement("div");
      d.className="ps-ccab";
      var t=document.createElement("h3");
      t.className="ps-cab-title"; t.textContent=title;        // textContent : pas d'injection
      d.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-cab-desc"; p.textContent=desc; d.appendChild(p); }
      var a=document.createElement("a");
      a.className="ps-cab-link"; a.href=target; a.textContent="En savoir plus";
      d.appendChild(a);

      card.appendChild(badge);                 // badge flottant, au-dessus
      card.appendChild(d);                     // puis le contenu
      /* Toute la carte cliquable : lien-calque transparent couvrant la carte
         (même href que le CTA). Le CTA « En savoir plus » reste au-dessus (z-index)
         pour garder son animation de survol ; les deux mènent au même endroit. */
      var cover=document.createElement("a");
      cover.className="ps-cab-cover"; cover.href=target;
      cover.setAttribute("aria-label", title);
      card.appendChild(cover);
      /* Origine mémorisée pour le bouton retour du player : géré de façon GÉNÉRIQUE
         dans tokens.js (playerFlag, site-wide) — plus besoin de le poser ici. */
      card.dataset.psC="1";                    // déclenche le masquage du natif
    });
  }

  /* ---- CATÉGORIES SORTIES EN PASTILLES (demande de Ziad, 03/08) -------------
     🔴 POURQUOI ICI ET PAS DANS `filters.js` : ce fichier n'est chargé QUE sur la
     page Cabinets. `filters.js`, lui, sert plusieurs pages — j'y avais mis ce code
     et j'ai cassé les filtres de la page Études de cas, qui possède les mêmes
     catégories dans son menu natif : mes pastilles s'y créaient et le menu natif
     y était masqué. Choix de Ziad : l'isolation vient du fichier, pas d'une table
     de pages — ainsi un renommage de page ou d'URL ne peut plus rien casser.

     🔴 ON NE RÉIMPLÉMENTE PAS LE FILTRAGE : chaque pastille délègue au `li` natif.
     Vérifié avant d'écrire : un clic dessus fait passer la page de 10 cartes à 1.
     C'est LearnWorlds qui filtre, donc ça vaut aussi pour un ÉTUDIANT — un filtre
     maison aurait dû lire les catégories via `/api/courses`, muet pour les
     non-admins (mesuré le 03/08), et serait resté inerte chez lui. Elles ne sont
     pas davantage dans le DOM : `.lw-tags` est vide sur toutes les cartes.

     Ajouter/retirer une pastille = une ligne dans PASTILLES. « Cabinet » en est
     volontairement absent : il porte 7 des 10 fiches, le proposer n'a pas d'intérêt. */
  var PASTILLES=["Conseil en Stratégie","Conseil en Management","Conseil en Transformation Numérique"];

  function normCat(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,""); }
  function optionsCat(){ return [].slice.call(document.querySelectorAll(S+" .lw-filters .lw-topbar-submenu-item.filter")); }
  function texteDe(el){ return (el.textContent||"").replace(/\s+/g," ").trim(); }

  /* 🔴 AUCUN STYLE DE PASTILLE ICI (03/08). Il était défini en double — ici en
     bleu foncé plein, dans `filters.js` en bleu clair — et l'état actif changeait
     donc d'aspect selon la page. La définition unique vit maintenant dans
     `tokens.js`, chargé sur tout le site : ce fichier ne garde que la LOGIQUE de
     filtrage, propre à cette page. Repli si tokens.js n'a pas encore tourné : la
     pastille reste un bouton nu mais cliquable, jamais invisible. */
  function styleFiltres(){
    if(typeof window.PS_FILTRE_STYLE==="function") window.PS_FILTRE_STYLE();
  }

  function mountFiltres(){
    var wrap=document.querySelector(S+" .learnworlds-button-wrapper.lw-filters");
    if(!wrap) return;
    var opts=optionsCat();
    if(!opts.length) return;                       // menu natif pas encore rendu : on réessaiera
    var dispo=PASTILLES.filter(function(nom){
      return opts.some(function(o){ return normCat(texteDe(o))===normCat(nom); });
    });
    /* 🔴 Rien à construire ⇒ on ne touche À RIEN. C'est la leçon du jour : ne
       jamais masquer un élément natif sur la seule foi d'avoir trouvé son
       conteneur, sinon on retire des filtres sans rien mettre à la place. */
    if(!dispo.length) return;
    styleFiltres();

    var row=wrap.querySelector(".ps-cf-row");
    var sig=dispo.join("|");
    if(row && row.dataset.psSig===sig) return;     // rien de neuf : pas de repeinture
    if(!row){ row=document.createElement("span"); row.className="ps-cf-row"; wrap.appendChild(row); }
    row.dataset.psSig=sig;
    row.textContent="";

    dispo.forEach(function(nom){
      var b=document.createElement("button");
      b.type="button"; b.className="ps-cf"; b.textContent=nom;
      b.setAttribute("aria-pressed","false");
      b.addEventListener("click", function(){
        var actif=b.classList.contains("ps-cf-on");
        [].slice.call(row.querySelectorAll(".ps-cf")).forEach(function(x){
          x.classList.remove("ps-cf-on"); x.setAttribute("aria-pressed","false");
        });
        if(actif){
          /* 2e clic = on retire le filtre. Le bouton natif « tout » est le seul
             chemin fiable : recliquer l'option ne la désélectionne pas toujours. */
          var tout=wrap.querySelector(".learnworlds-button.filter.text-only");
          if(tout) tout.click();
          return;
        }
        var o=optionsCat().filter(function(x){ return normCat(texteDe(x))===normCat(nom); })[0];
        if(o) o.click();
        b.classList.add("ps-cf-on"); b.setAttribute("aria-pressed","true");
      });
      row.appendChild(b);
    });

    /* Le menu natif ferait doublon — masqué SEULEMENT maintenant que les
       pastilles existent réellement. */
    var menu=wrap.querySelector(".lw-filter-option.with-submenu");
    if(menu) menu.style.setProperty("display","none","important");
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  /* 🔴 Le filtre de langue ne fait que poser une CLASSE : ce n'est pas une
     mutation observée -> sans cet écouteur la tuile de progression garderait
     le dénominateur de l'autre langue. tokens.js émet cet événement. */
  window.addEventListener("ps-lang-change", build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
