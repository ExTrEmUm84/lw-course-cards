/* ============================================================
   Cartes "études de cas" LearnWorlds — style monday + pastilles
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE Cas (Réglages de la PAGE —
   jamais dans un élément « HTML », les <script> y sont inertes) :
     <script src="https://extremum84.github.io/lw-course-cards/case-cards.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   Cible l'élément natif "Courses" (.lw-course-card). Lit la DESCRIPTION
   du cours au format "Label : valeur" (séparateur # optionnel) et rend
   chaque champ en pastille colorée. Difficulté colorée selon le niveau.

   Exemple de description :
     Cabinet : Bain # Année : 2022 # Secteur : Pharma, Santé # Type : Profit # Difficulté : Débutant
   ============================================================ */
(function(){
  "use strict";

  if(!document.getElementById("ps-figtree")){
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(f);
  }

  var CSS=[
    /* ⚠️ Scopé sous `.cards-grandpa >`. `#pageContent .lw-cols.multiple-rows` nu
       matche AUSSI la barre de filtres : elle se retrouvait alors enfermée dans
       une colonne de la grille (488px au lieu de 1000), d'où un champ de
       recherche écrasé à 157px. Et un `display:…!important` sur ce sélecteur nu
       écrase le `display:none` INLINE que LearnWorlds pose quand on désactive
       les filtres -> ils resteraient visibles. Jamais de `display` en nu. */
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows{display:grid !important;grid-template-columns:1fr 1fr !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;overflow:visible !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* la barre de filtres : alignement seul, aucun `display` */
    "#pageContent .lw-cols.with-filters{max-width:1000px !important;margin:0 auto !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* 🔴 overflow VISIBLE (et non hidden) : la plaque de titre `.ps-cc-plate`
       déborde du coin haut-gauche de la carte, il ne faut pas la rogner. Le
       natif est déjà masqué par `.lw-course-card > *:not(.ps-cc)` plus bas, donc
       rien d'autre ne dépasse. position+z-index : au survol la carte (et sa
       plaque) passent au-dessus des cartes voisines qu'elle chevauche. */
    "#pageContent .lw-cols > .col.lw-course-card{position:relative !important;z-index:1 !important;width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:none !important;overflow:visible !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:hover{z-index:10 !important;box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    "#pageContent .lw-course-card > *:not(.ps-cc){display:none !important;}",
    /* min-height:0 → la carte épouse son contenu (fini le grand vide). Dans une
       rangée, la grille égalise quand même les hauteurs. */
    ".ps-cc{position:relative !important;display:flex !important;flex-direction:column !important;padding:0 24px 24px 24px !important;min-height:0 !important;}",
    /* ─── Bandeau de titre en relief qui DÉBORDE la carte (design « fiche »,
       Option 2 validée par Ziad le 22/07) ───
       Bandeau blanc PLEINE LARGEUR débordant en haut (-18) et sur les deux côtés
       (-10/-10) ; gros titre « Cabinet ✕ Client », fin liseré d'accent en bas.
       🔴 DANS LE FLUX (pas en absolu) : sa hauteur pousse les pastilles dessous,
       même si le titre passe sur 2 lignes. Étant un flex-item, il s'étire en
       pleine largeur (align stretch par défaut). La carte est en
       `overflow:visible` (cf. plus haut) sinon le bandeau serait rogné. */
    ".ps-cc-plate{margin:-18px -10px 20px -10px !important;background:#fff !important;border-radius:14px !important;border-bottom:3px solid var(--ps-accent,#6161FF) !important;box-shadow:0 10px 26px rgba(15,23,42,.13) !important;padding:18px 22px !important;}",
    ".ps-cc-plate .ps-cc-title{font-size:29px !important;line-height:1.05 !important;}",
    /* En-tête : picto + titre sur une ligne.
       `align-items:flex-start` et non `center` : sur un titre qui passe sur 2
       lignes, un centrage ferait descendre le picto au milieu du bloc au lieu
       de le garder en regard de la 1re ligne. Le `margin-top:2px` du picto le
       recale optiquement sur la hauteur de capitale. */
    ".ps-cc-head{display:flex !important;align-items:flex-start !important;gap:12px !important;margin:0 0 14px !important;}",
    ".ps-cc-ic{flex:0 0 auto !important;width:36px !important;height:36px !important;margin-top:2px !important;border-radius:var(--ps-r-btn,10px) !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;background:#EEF1F6 !important;color:#4B5563 !important;}",
    ".ps-cc-ic svg{width:20px !important;height:20px !important;fill:none !important;stroke:currentColor !important;stroke-width:1.7 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    /* `class="f"` = aplat léger, le reste en trait : c'est ce contraste qui
       donne la densité à petite taille (même convention que sector-cards.js). */
    ".ps-cc-ic svg .f{fill:currentColor !important;fill-opacity:.18 !important;}",
    /* une teinte par famille de picto, prise dans la palette des pastilles */
    ".ps-cc-ic.ps-ic-pill{background:#E1F7EC !important;color:#009257 !important;}",
    ".ps-cc-ic.ps-ic-chart{background:#E8F1FE !important;color:#0A6ED8 !important;}",
    ".ps-cc-ic.ps-ic-car{background:#FFF3E0 !important;color:#C77700 !important;}",
    ".ps-cc-ic.ps-ic-build{background:var(--ps-accent-tint,#EDEDFF) !important;color:var(--ps-accent-hover,#4B4BE0) !important;}",
    ".ps-cc-ic.ps-ic-plane{background:#EAF5FC !important;color:#2F7DA8 !important;}",
    ".ps-cc-ic.ps-ic-cart{background:#FDEFF3 !important;color:#C2286A !important;}",
    ".ps-cc-ic.ps-ic-bank{background:#F3EAFB !important;color:#8A45C9 !important;}",
    ".ps-cc-title{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:25px !important;font-weight:800 !important;color:#243B6B !important;line-height:1.2 !important;letter-spacing:-.02em !important;margin:0 !important;}",
    /* Titre « Cabinet ✕ Client » (nom de fiche « Deloitte - Monito - FR ») :
       le cabinet en bleu marine, le client dans l'accent de la page, un ✕ discret
       au milieu (le « - FR » de langue est retiré côté JS, cf. caseTitle()). */
    ".ps-cc-cab{color:#243B6B !important;}",
    ".ps-cc-cli{color:var(--ps-accent,#6161FF) !important;}",
    ".ps-cc-x{display:inline-block !important;margin:0 .32em !important;font-size:.62em !important;font-weight:700 !important;color:#B4BCCB !important;vertical-align:.12em !important;}",
    ".ps-cc-pills{display:flex !important;flex-wrap:wrap !important;gap:7px !important;margin-bottom:auto !important;}",
    ".ps-pill{display:inline-flex !important;align-items:center !important;gap:5px !important;padding:4px 11px !important;border-radius:var(--ps-r-pill,999px) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:12px !important;font-weight:600 !important;line-height:1.1 !important;background:#EEF1F6 !important;color:#4B5563 !important;}",
    ".ps-pill b{font-weight:700 !important;opacity:.62 !important;text-transform:uppercase !important;font-size:10px !important;letter-spacing:.03em !important;}",
    ".ps-f-cabinet{background:var(--ps-accent-tint,#EDEDFF) !important;color:var(--ps-accent-hover,#4B4BE0) !important;}",
    ".ps-f-annee{background:#E8F1FE !important;color:#0A6ED8 !important;}",
    ".ps-f-secteur{background:#E1F7EC !important;color:#009257 !important;}",
    ".ps-f-type{background:#FFF3E0 !important;color:#C77700 !important;}",
    ".ps-f-niveau{background:#EAF5FC !important;color:#2F7DA8 !important;}",
    ".ps-f-duree{background:#F3EAFB !important;color:#8A45C9 !important;}",
    ".ps-f-format{background:#FDEFF3 !important;color:#C2286A !important;}",
    ".ps-f-fonction{background:#FEF3E6 !important;color:#C77700 !important;}",
    ".ps-diff-deb{background:#E6F9F0 !important;color:#12A85F !important;}",
    ".ps-diff-int{background:#FFF3E0 !important;color:#D98500 !important;}",
    ".ps-diff-adv{background:#FDECEF !important;color:#D22B45 !important;}",
    ".ps-cc-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:18px !important;color:var(--ps-accent,#6161FF) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-cc-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-cc-link:hover{color:var(--ps-accent-hover,#4B4BE0) !important;}",
    ".ps-cc-link:hover::after{transform:translateX(5px) !important;}",
    /* ================= TITRES (hero premium) — porté de course-cards.js =====
       Même géométrie que la page Cours, vérifié à la mesure : le conteneur des
       titres fait 1120px (290 -> 1410) alors que la grille des cartes fait
       1000px (350 -> 1350). Un simple text-align:left décalerait les titres de
       60px à gauche des cartes -> on reprend la même largeur 1000px centrée.
       (`.cards-grandpa` fait 1650px ici contre 1120 sur la page Cours, mais il
       ne sert pas à l'alignement : c'est la grille qui compte.) */
    "#pageContent h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* ⚠️ LearnWorlds SERT le H1 dans le HTML, "#" compris. heroText() ne peut le
       transformer qu'une fois le DOM prêt : sans ça les "#" s'affichent en clair
       pendant une demi-seconde. -> masqué tant qu'il n'est pas traité.
       `visibility` (et non `display`) : la place reste réservée, aucun décalage.
       Filet de sécurité à 2,5s plus bas, sinon un titre sans "#" resterait
       invisible pour toujours. */
    "#pageContent h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    "#pageContent h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#6161FF) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* .learnworlds-main-text existe AUSSI dans chaque carte ET dans le bouton des
       catégories du filtre : on ne stylise que la description marquée en JS
       (cf. heroText), jamais la classe nue. */
    "#pageContent .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    /* machine à écrire : le slot réserve la largeur de la phrase la plus longue
       pour que le titre ne tremble pas à chaque lettre */
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#6161FF) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#6161FF) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",
    "@media(max-width:820px){#pageContent .cards-grandpa > .lw-cols.multiple-rows{grid-template-columns:1fr !important;}#pageContent h1.learnworlds-heading{font-size:36px !important;}#pageContent h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}#pageContent .ps-desc{padding-right:0 !important;}}"
  ].join("\n");
  var st=document.getElementById("ps-casecards-style");
  if(!st){ st=document.createElement("style"); st.id="ps-casecards-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  /* --- Pictos des cartes : choisis par mot-clé du TITRE ---
     Repris de sector-cards.js (même jeu, même convention `class="f"`), avec
     deux ajouts pour cette page : "tourisme" -> avion, et un panier pour
     l'agroalimentaire. Testé sur les 12 titres réels : 9 tombaient juste, 3
     retombaient sur le picto neutre (McDonald's, Tourisme, Succession) ; les
     deux règles ci-dessous en récupèrent deux. "Succession" reste sur `doc`,
     qui convient — un picto neutre vaut mieux qu'un contresens.
     ⚠️ Pas basé sur le champ "Secteur" de la description : 11 cartes /12 n'en
     ont pas, le titre est aujourd'hui la seule donnée fiable. */
  var ICON={
    pill:'<svg viewBox="0 0 24 24"><path class="f" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
    plane:'<svg viewBox="0 0 24 24"><path class="f" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><rect class="f" x="7" y="12" width="3.2" height="6" rx="1"/><rect class="f" x="12.4" y="6.5" width="3.2" height="11.5" rx="1"/><rect class="f" x="17.8" y="9.5" width="3.2" height="8.5" rx="1"/><path d="m7 9 4-3.5 4 2 5-4.5"/></svg>',
    build:'<svg viewBox="0 0 24 24"><path class="f" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4"/></svg>',
    car:'<svg viewBox="0 0 24 24"><path class="f" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    cart:'<svg viewBox="0 0 24 24"><circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path class="f" d="M6.4 6h15l-1.7 8a2 2 0 0 1-2 1.6h-8a2 2 0 0 1-2-1.6L6.4 6Z"/><path d="M2.5 3h2.3l.7 3"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path class="f" d="M5 21V7l8-4v18Z"/><path class="f" d="M19 21V11l-6-4v14Z"/><path d="M8.5 9h.01M8.5 13h.01M8.5 17h.01"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path class="f" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>'
  };
  function pickIcon(l){ l=(l||"").toLowerCase();
    if(/pharma|sant[ée]|m[ée]dic|biotech/.test(l)) return "pill";
    if(/a[ée]ro|avion|spatial|d[ée]fense|tourisme|voyage|h[ôo]tel|loisir/.test(l)) return "plane";
    if(/agro|alimentaire|food|restaur|mcdonald|boisson/.test(l)) return "cart";
    if(/bilan|financ|comptab|banque|assurance/.test(l)) return "chart";
    if(/automobile|transport|livraison|mobilit/.test(l)) return "car";
    if(/industrie|[ée]nergie|manufactur|luxe|retail|distribution|m[ée]tallurg/.test(l)) return "build";
    if(/immobilier|public|secteur/.test(l)) return "bank";
    return "doc";
  }

  var LABELS=["Cabinet","Année","Annee","Secteur","Type","Difficulté","Difficulte","Niveau","Durée","Duree","Format","Fonction"];
  function parse(desc){
    var re=new RegExp("("+LABELS.join("|")+")\\s*:\\s*","gi"), m, ms=[];
    while((m=re.exec(desc))!==null){ ms.push({label:m[1], vs:re.lastIndex, start:m.index}); }
    var out=[];
    for(var i=0;i<ms.length;i++){
      var end=(i+1<ms.length)?ms[i+1].start:desc.length;
      var v=desc.slice(ms[i].vs,end).replace(/^[#\s]+/,"").replace(/[\s,;|#]+$/,"").trim();
      if(v) out.push({label:ms[i].label, value:v});
    }
    return out;
  }
  function keyFor(l){
    l=l.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
    if(l.indexOf("cabinet")>=0) return "cabinet";
    if(l.indexOf("anne")>=0) return "annee";
    if(l.indexOf("secteur")>=0) return "secteur";
    if(l.indexOf("type")>=0) return "type";
    if(l.indexOf("niveau")>=0) return "niveau";
    if(l.indexOf("duree")>=0) return "duree";
    if(l.indexOf("format")>=0) return "format";
    if(l.indexOf("fonction")>=0) return "fonction";
    if(l.indexOf("difficult")>=0) return "diff";
    return "def";
  }
  function diffClass(v){
    v=v.toLowerCase();
    if(/débu|debu|facile/.test(v)) return "ps-diff-deb";
    if(/interm|moyen/.test(v)) return "ps-diff-int";
    if(/avanc|expert|diffic|élev|elev/.test(v)) return "ps-diff-adv";
    return "";
  }
  function clean(s){ return (s||"").replace(/\s+/g," ").replace(/[#]+/g,"").trim(); }

  /* --- Hero : machine à écrire sur les segments marqués "#" (porté de
     course-cards.js). "Nos cas pour #le conseil #la stratégie"
     -> préfixe "Nos cas pour" + phrases qui se tapent / s'effacent en boucle. */
  var S="#pageContent";
  function heroText(){
    /* .learnworlds-main-text = la description du haut, MAIS AUSSI celle de chaque
       carte, le bouton des catégories du FILTRE et le pied de page.
       La description, c'est celle qui est hors carte, hors filtre, ET avant les
       cartes dans le document.
       🔴 L'exclusion du filtre est propre à cette page : sans elle, le bouton
       "categories Agroalimentaire Assurance…" (mesuré : 115px de large, dans
       `.lw-filters`) est capté et reçoit le style de description — 17px et
       padding-right:38% sur un bouton de filtre. Constaté en simulation. */
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
       masquage CSS. Si on le posait seulement en cas de succès, un titre sans
       "#" resterait invisible pour toujours. */
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
    slot.className="ps-tw"; slot.setAttribute("aria-hidden","true");
    var txt=document.createElement("span"); txt.className="ps-tw-txt";
    var cur=document.createElement("span"); cur.className="ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent=""; h1.appendChild(pre); h1.appendChild(slot);

    /* largeur réservée = phrase la plus longue (mesurée police chargée) */
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
       qu'après la pause. Sinon le slot part vide et se remplit lettre par lettre :
       ça se lit comme un retard d'affichage plutôt que comme une animation. */
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

  /* Filet de sécurité du masquage CSS : si heroText() n'avait jamais tourné, le
     titre resterait invisible. Au pire on le révèle brut au bout de 2,5s — un
     titre avec des "#" vaut mieux qu'un titre absent. */
  setTimeout(function(){
    var h=document.querySelector(S+" h1.learnworlds-heading");
    if(h && !h.dataset.psTw) h.dataset.psTw="1";
  },2500);

  /* Titre de fiche « Cabinet - Client - LANG » -> « Cabinet ✕ Client », deux
     couleurs, sans le code langue. Séparateurs acceptés : - – — (tiret, demi et
     cadratin). Le code langue (2-3 lettres) n'est retiré QUE s'il est un 3e+
     segment : « Deloitte - IBM » (2 segments) garde IBM comme client. Pas au
     format attendu (0 ou 1 segment) -> titre brut, comme avant.
     Tout en createElement/textContent : le titre vient du Customizer (un « & »
     ou « < » ne doit jamais être interprété comme du HTML). */
  function caseTitle(el, raw){
    el.textContent="";
    var parts=raw.split(/\s*[-–—]\s*/).map(function(s){return s.trim();}).filter(Boolean);
    if(parts.length>=3 && /^[a-zA-Z]{2,3}$/.test(parts[parts.length-1])) parts.pop();
    if(parts.length<2){ el.textContent=raw; return; }
    var cabinet=parts[0], client=parts.slice(1).join(" - ");
    var cab=document.createElement("span"); cab.className="ps-cc-cab"; cab.textContent=cabinet;
    var x=document.createElement("span"); x.className="ps-cc-x"; x.textContent="✕"; x.setAttribute("aria-hidden","true");
    var cli=document.createElement("span"); cli.className="ps-cc-cli"; cli.textContent=client;
    el.appendChild(cab); el.appendChild(x); el.appendChild(cli);
    el.setAttribute("aria-label", cabinet+" et "+client);
  }

  function build(){
    heroText();
    document.querySelectorAll("#pageContent .lw-course-card").forEach(function(card){
      if(card.querySelector(".ps-cc")) return;
      var h=card.querySelector(".learnworlds-heading3"); if(!h) return;
      var title=clean(h.textContent); if(!title) return;
      var descEl=[].slice.call(card.querySelectorAll("p,.learnworlds-main-text"))
        .map(function(e){ return (e.textContent||"").replace(/\s+/g," ").trim(); })
        .filter(function(t){ return /:/.test(t) && t.length>15; })[0] || "";
      var fields=parse(descEl);
      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";
      /* Pastille « Cabinet » retirée : le cabinet est déjà en gros dans le titre
         (choix de Ziad le 22/07). On garde Type, Difficulté, etc. */
      var pills=fields.filter(function(fld){ return keyFor(fld.label)!=="cabinet"; }).map(function(fld){
        var key=keyFor(fld.label);
        var cls="ps-pill "+(key==="diff" ? diffClass(fld.value) : "ps-f-"+key);
        return '<span class="'+cls+'">'+clean(fld.value)+'</span>';
      }).join("");
      var d=document.createElement("div");
      d.className="ps-cc";
      /* Titre dans une plaque en relief qui déborde (design « fiche »). Le picto
         est retiré (maquette A) ; pickIcon/ICON restent définis, réutilisables si
         Ziad veut le remettre dans la plaque. */
      d.innerHTML='<div class="ps-cc-plate"><h3 class="ps-cc-title"></h3></div>'
                + '<div class="ps-cc-pills">'+pills+'</div>'
                + '<a class="ps-cc-link" href="'+href+'">En savoir plus</a>';
      /* titre posé en textContent (et non concaténé dans le innerHTML) : il
         vient du Customizer, un "&" ou un "<" y serait interprété comme du HTML. */
      caseTitle(d.querySelector(".ps-cc-title"), title);
      card.appendChild(d);
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
