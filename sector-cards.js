/* ============================================================
   Cartes "Fiches secteur" — même design que les cartes de cours
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /fiches-secteur (Réglages de la
   PAGE — jamais dans un élément « HTML », les <script> y sont inertes) :
     <script src="https://extremum84.github.io/lw-course-cards/sector-cards.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   Même coquille que `course-cards.js` (blanc, bord #E6E9EF, radius 16,
   survol qui soulève) mais SANS la marque "PrepaStrat" ni la pastille :
   on ne reprend que ce que la carte native contient réellement, à savoir
   titre + description + lien. Disposition : grille de 3.

   ⚠️ NE PAS charger `course-cards.js` sur cette page : son build() exige le
   format "Niveau #N - Nom" et abandonne sinon, alors que son CSS masque quand
   même le contenu natif -> 3 cartes VIDES. Ici le masquage du natif est
   conditionné à `[data-ps-s]`, donc une carte non reconstruite reste intacte.

   ⚠️ `#pageContent .lw-cols.multiple-rows` matche AUSSI la barre de filtres
   de la page (mesuré : 2 éléments). Toutes les règles de mise en page sont
   scopées sous `.cards-grandpa >`. Et surtout : jamais de `display` sur le
   sélecteur nu — LearnWorlds masque les filtres désactivés avec un
   `display:none` INLINE qu'un `!important` écraserait.
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

  /* une carte = 1 teinte : picto en plein, le CERCLE en clair (au lieu du bandeau),
     et la barre de progression reprend la MÊME teinte pleine (fiches inscrites). */
  function CYCLE(n, plein, clair){
    var C=S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+"+n+") ";
    return C+".ps-sicon svg{color:"+plein+" !important;}\n"
         + C+".ps-sicon{background:"+clair+" !important;}\n"
         + C+".ps-sca-prog-bar{background:"+plein+" !important;}";
  }

  // --- 2) Styles ---
  var CSS=[
    /* grille de 3, alignée comme la page Cours (1000px centrés) */
    /* Style « carte cours » : cercle picto CENTRÉ qui FLOTTE au-dessus (cf. cabinet/course).
       padding-top:78px (1re rangée) + row-gap:84px (rangées suivantes, sinon les cercles
       flottants débordent sur la carte du dessus en grille multi-rangées). */
    GRID+"{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:84px 24px !important;max-width:1000px !important;margin:0 auto !important;padding:78px 0 0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* overflow:visible pour le cercle flottant ; flex column ; position/cursor pour le lien-calque */
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card{position:relative !important;cursor:pointer !important;width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;overflow:visible !important;display:flex !important;flex-direction:column !important;isolation:isolate !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover{box-shadow:0 14px 34px rgba(0,0,0,.10) !important;transform:translateY(-3px) !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover .ps-sicon{box-shadow:0 10px 26px rgba(15,23,42,.18) !important;}",
    /* cercle + contenu + lien-calque = enfants directs de la carte -> exclus du masquage */
    S+" .lw-course-card[data-ps-s] > *:not(.ps-scard):not(.ps-sicon):not(.ps-scover){display:none !important;}",
    /* lien-calque : toute la carte cliquable, transparent, sous le CTA */
    ".ps-scover{position:absolute !important;inset:0 !important;z-index:1 !important;border-radius:var(--ps-r-card,16px) !important;background:transparent !important;text-decoration:none !important;}",

    /* height:100% : sans ça .ps-scard s'arrête à son contenu au lieu de remplir
       la carte étirée par la grille -> le `margin-bottom:auto` de .ps-sdesc n'a
       aucun espace à absorber et les CTA ne s'alignent plus d'une carte à l'autre. */
    /* .ps-scard = conteneur du contenu (sous le cercle), aligné à gauche */
    ".ps-scard{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;padding:0 24px 24px !important;text-align:left !important;}",
    /* Cercle picto 140px CENTRÉ qui FLOTTE au-dessus (`margin:-70px auto`), bordure
       blanche 4px + ombre — comme les cartes cours. Fond = teinte claire de la
       couleur de la carte (posée par le cycle), picto en couleur pleine. */
    ".ps-sicon{width:140px !important;height:140px !important;border-radius:50% !important;background:#fff !important;display:flex !important;align-items:center !important;justify-content:center !important;margin:-70px auto 16px !important;border:4px solid #fff !important;box-shadow:0 6px 18px rgba(15,23,42,.12) !important;flex:none !important;transition:box-shadow .25s ease !important;}",
    ".ps-sicon svg{width:56px !important;height:56px !important;fill:none !important;stroke:currentColor !important;stroke-width:1.5 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-sicon svg .f{fill:currentColor !important;fill-opacity:.18 !important;}",
    ".ps-stitle{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:21px !important;line-height:1.25 !important;font-weight:800 !important;color:var(--ps-text,#1c1f26) !important;margin:0 0 8px !important;}",
    /* description bornée à 3 lignes : les cartes gardent la même hauteur */
    ".ps-sdesc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;margin:0 0 auto !important;display:-webkit-box !important;-webkit-line-clamp:3 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* ===== Barre de progression (fiches INSCRITES uniquement) =====
       Donnée native (`.lw-course-card-progress-bar`, largeur inline), comme
       profile-page.js. Ici pas de `margin-top:auto` sur le bloc : c'est le
       `margin-bottom:auto` de .ps-sdesc qui pousse déjà progression+CTA en bas.
       La barre prend la couleur de la carte (posée par CYCLE), la piste reste grise. */
    ".ps-sca-prog + .ps-slink{margin-top:12px !important;}",
    ".ps-sca-prog-head{display:flex !important;align-items:baseline !important;justify-content:space-between !important;margin-bottom:7px !important;}",
    ".ps-sca-prog-pct{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:13px !important;font-weight:700 !important;color:var(--ps-text,#1c1f26) !important;}",
    ".ps-sca-prog-lbl{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:12px !important;font-weight:500 !important;color:#8A93A5 !important;}",
    ".ps-sca-prog-track{height:8px !important;border-radius:var(--ps-r-pill,999px) !important;background:#EEF1F6 !important;overflow:hidden !important;}",
    ".ps-sca-prog-bar{height:100% !important;border-radius:var(--ps-r-pill,999px) !important;background:var(--ps-f1,#6161FF) !important;transition:width .6s ease !important;}",
    /* même CTA que partout ailleurs */
    ".ps-slink{position:relative !important;z-index:2 !important;display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:18px !important;color:var(--ps-accent,#6161FF) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-slink::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-slink:hover{color:var(--ps-accent-hover,#4B4BE0) !important;}",
    ".ps-slink:hover::after{transform:translateX(5px) !important;}",
    /* Cycle de couleurs : une seule teinte par carte, déclinée en 2 valeurs —
       `color` porte le picto (trait plein + aplat via currentColor), et le
       bandeau reprend la MÊME teinte en clair. Le cercle, lui, reste blanc. */
    CYCLE(1, "var(--ps-f1,#6161FF)", "var(--ps-f1-tint,#EDEDFF)"),
    CYCLE(2, "var(--ps-f2,#00C875)", "var(--ps-f2-tint,#E3F8EE)"),
    CYCLE(3, "var(--ps-f3,#E2445C)", "var(--ps-f3-tint,#FDECEF)"),
    CYCLE(4, "var(--ps-f4,#FDAB3D)", "var(--ps-f4-tint,#FFF3E0)"),
    CYCLE(5, "var(--ps-f5,#A25DDC)", "var(--ps-f5-tint,#F3EAFB)"),
    CYCLE(6, "var(--ps-f6,#0073EA)", "var(--ps-f6-tint,#E6F1FD)"),
    /* ================= TITRES (hero) — porté de case-cards.js ==============
       Alignés sur les CARTES : le conteneur natif du titre fait 1120px
       (mesuré : 290->1410) alors que la grille fait 1000px (350->1350). Sans
       `max-width:1000px`, le titre et la description débordent de 60px à
       gauche des cartes — c'est le décalage que Ziad a signalé. */
    S+" h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* LW sert le H1 avec ses "#" : masqué tant que heroText() ne l'a pas
       transformé, sinon les "#" s'affichent en clair une demi-seconde.
       `visibility` et non `display` : la place reste réservée. Filet de
       sécurité à 2,5s, sinon un titre sans "#" resterait invisible. */
    S+" h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    S+" h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#6161FF) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    S+" .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#6161FF) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#6161FF) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",

    "@media(max-width:1040px){"+GRID+"{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:820px){"+S+" h1.learnworlds-heading{font-size:36px !important;}"+S+" h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}"+S+" .ps-desc{padding-right:0 !important;}}",
    "@media(max-width:700px){"+GRID+"{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var st=document.getElementById("ps-sector-style");
  if(!st){ st=document.createElement("style"); st.id="ps-sector-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  // --- 3) Pictogrammes : par mot-clé du titre, avec repli neutre ---
  /* Tracés pensés pour un rendu à 52px dans le cercle blanc : les icônes
     "24px" habituelles (traits épais, détails serrés) deviennent illisibles
     agrandies — l'avion notamment.
     `class="f"` = forme remplie en aplat léger (cf. .ps-sicon svg .f). Les
     autres tracés restent en trait : c'est ce contraste qui donne la densité. */
  var ICON={
    pill:'<svg viewBox="0 0 24 24"><path class="f" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/><path d="M6.8 13.2 9 11M9.6 16 11.8 13.8"/></svg>',
    plane:'<svg viewBox="0 0 24 24"><path class="f" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><rect class="f" x="7" y="12" width="3.2" height="6" rx="1"/><rect class="f" x="12.4" y="6.5" width="3.2" height="11.5" rx="1"/><rect class="f" x="17.8" y="9.5" width="3.2" height="8.5" rx="1"/><path d="m7 9 4-3.5 4 2 5-4.5"/></svg>',
    build:'<svg viewBox="0 0 24 24"><path class="f" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>',
    car:'<svg viewBox="0 0 24 24"><path class="f" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"/><path d="M5.5 10.5h13"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path class="f" d="M5 21V7l8-4v18Z"/><path class="f" d="M19 21V11l-6-4v14Z"/><path d="M8.5 9h.01M8.5 12h.01M8.5 15h.01M8.5 18h.01M16 13h.01M16 17h.01"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path class="f" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>'
  };
  function pick(l){ l=l.toLowerCase();
    if(/pharma|sant[ée]|m[ée]dic|biotech/.test(l)) return "pill";
    if(/a[ée]ro|avion|spatial|defense|défense/.test(l)) return "plane";
    if(/bilan|financ|comptab|banque|assurance/.test(l)) return "chart";
    if(/automobile|transport|mobilit/.test(l)) return "car";
    if(/industrie|[ée]nergie|manufactur|luxe|retail|distribution/.test(l)) return "build";
    if(/immobilier|public|secteur/.test(l)) return "bank";
    return "doc";
  }

  /* --- 4) Hero : machine à écrire sur les segments marqués "#" ---
     Porté de case-cards.js. "Nos fiches secteur pour #le conseil #la stratégie"
     -> préfixe + phrases qui se tapent / s'effacent en boucle. */
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
    if(i<0) return;                                   // pas de # -> titre natif
    var prefix=raw.slice(0,i).trim();
    var parts=raw.slice(i).split("#").map(function(s){ return s.trim(); }).filter(Boolean);
    if(!parts.length) return;
    h1.setAttribute("aria-label", prefix+" "+parts.join(", "));   // le texte animé est aria-hidden

    var pre=document.createElement("span");
    pre.textContent=prefix+" ";                       // textContent : pas d'injection HTML
    var slot=document.createElement("span");
    slot.className="ps-tw"; slot.setAttribute("aria-hidden","true");
    var txt=document.createElement("span"); txt.className="ps-tw-txt";
    var cur=document.createElement("span"); cur.className="ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent=""; h1.appendChild(pre); h1.appendChild(slot);

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

  // --- 5) Construction ---
  function build(){
    heroText();
    document.querySelectorAll(S+" .cards-grandpa .lw-course-card").forEach(function(card){
      if(card.dataset.psS) return;
      var h=card.querySelector(".learnworlds-heading3");
      if(!h) return;
      var title=(h.textContent||"").replace(/\s+/g," ").trim();
      if(!title) return;                       // pas de titre -> on laisse la carte native
      var dEl=card.querySelector(".lw-course-card-descr, .learnworlds-main-text");
      var desc=dEl ? (dEl.textContent||"").replace(/\s+/g," ").trim() : "";
      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";

      /* 🔴 Clic DIRECT sur le LECTEUR (`/path-player?courseid=<slug>`) si INSCRIT
         (barre de progression native), sinon présentation (un non-inscrit sur
         /path-player est renvoyé à l'accueil). Cf. cabinet-cards.js. */
      var natBar = card.querySelector(".lw-course-card-progress-bar");
      var enrolled = !!natBar;
      var slug = (href.match(/\/course\/([^\/?#]+)/) || [])[1] || "";
      var target = (enrolled && slug) ? ("/path-player?courseid=" + encodeURIComponent(slug)) : href;

      /* Cercle picto FLOTTANT (enfant direct de la carte, comme l'illustration cours) */
      var ic=document.createElement("span");
      ic.className="ps-sicon"; ic.innerHTML=ICON[pick(title)]||ICON.doc;   // SVG statique, pas de données membre
      ic.setAttribute("aria-hidden","true");

      /* Contenu (sous le cercle) : titre + description + CTA */
      var d=document.createElement("div"); d.className="ps-scard";
      var t=document.createElement("h3");
      t.className="ps-stitle"; t.textContent=title;          // textContent : pas d'injection
      d.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-sdesc"; p.textContent=desc; d.appendChild(p); }
      /* Progression native (fiches inscrites uniquement) : largeur inline de la
         barre native, comme profile-page.js. Barre teintée par CYCLE. */
      var pct=natBar ? parseInt((natBar.style.width||"").replace("%",""),10) : NaN;
      if(!isNaN(pct)){
        var cp=Math.max(0,Math.min(pct,100));
        var pr=document.createElement("div"); pr.className="ps-sca-prog";
        var ph=document.createElement("div"); ph.className="ps-sca-prog-head";
        var pv=document.createElement("span"); pv.className="ps-sca-prog-pct"; pv.textContent=cp+" %";
        var pl=document.createElement("span"); pl.className="ps-sca-prog-lbl"; pl.textContent=cp>=100?"terminé":(cp>0?"complété":"pas commencé");
        ph.appendChild(pv); ph.appendChild(pl);
        var pt=document.createElement("div"); pt.className="ps-sca-prog-track";
        var pb=document.createElement("div"); pb.className="ps-sca-prog-bar"; pb.style.width=(cp>0&&cp<2?2:cp)+"%";
        pt.appendChild(pb);
        pr.appendChild(ph); pr.appendChild(pt);
        d.appendChild(pr);
      }
      var a=document.createElement("a");
      a.className="ps-slink"; a.href=target; a.textContent="En savoir plus";
      d.appendChild(a);

      /* Lien-calque : toute la carte cliquable (même destination que le CTA) */
      var cover=document.createElement("a");
      cover.className="ps-scover"; cover.href=target; cover.setAttribute("aria-label", title);

      card.appendChild(ic);                    // cercle flottant, au-dessus
      card.appendChild(d);                     // contenu
      card.appendChild(cover);                 // calque cliquable
      card.dataset.psS="1";                    // déclenche le masquage du natif
    });
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
