/* ============================================================
   Mega menu de navigation LearnWorlds — style monday (pictos)
   ------------------------------------------------------------
   À charger SITE-WIDE (Réglages du SITE → Code personnalisé) car
   le menu est présent sur toutes les pages :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/mega-menu.js"></script>

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

  if(!document.getElementById("ps-figtree")){
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

  var C=["#6161FF","#00C875","#E2445C","#FDAB3D","#A25DDC","#0073EA"];
  var NAV=" nav.lw-topbar-menu ";           // scope desktop
  var CSS=[
    /* ---------- pictos + libellés (desktop ET tiroir mobile) ---------- */
    ".ps-mm-ic{border-radius:11px !important;flex:none !important;display:flex !important;align-items:center !important;justify-content:center !important;color:#fff !important;}",
    ".ps-mm-ic svg{stroke:#fff !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-mm-t{font-family:Figtree,sans-serif !important;font-weight:600 !important;color:#1c1f26 !important;line-height:1.3 !important;}",
    /* tiroir mobile : on garde la ligne picto + libellé */
    ".ps-mm-ic{width:34px !important;height:34px !important;}",
    ".ps-mm-ic svg{width:19px !important;height:19px !important;}",
    ".ps-mm-t{font-size:14.5px !important;}",
    ".lw-topbar-submenu-item.ps-mm-hide{display:none !important;}",
    ".lw-topbar-submenu.ps-mm-empty{display:none !important;}",

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
    NAV+".lw-topbar-option-link-lbl{font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;letter-spacing:-.01em !important;color:#1c1f26 !important;transition:color .15s ease !important;}",
    NAV+".lw-topbar-option:hover > .lw-topbar-option-link .lw-topbar-option-link-lbl{color:#6161FF !important;}",
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
    NAV+".lw-topbar-submenu.js-submenu-list{position:absolute !important;top:100% !important;bottom:auto !important;left:50% !important;right:auto !important;transform:translateX(-50%) !important;width:100vw !important;min-width:0 !important;max-width:100vw !important;height:auto !important;max-height:none !important;overflow:visible !important;margin-top:var(--ps-mm-gap,26px) !important;padding:12px 24px !important;border-radius:0 !important;border:0 !important;border-top:1px solid #E6E9EF !important;border-bottom:1px solid #E6E9EF !important;background:#F5F6F8 !important;box-shadow:none !important;gap:48px !important;font-family:Figtree,sans-serif !important;grid-template-columns:none !important;justify-content:center !important;align-items:center !important;}",
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
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link{display:flex !important;flex-direction:row !important;align-items:center !important;justify-content:flex-start !important;text-align:left !important;gap:12px !important;padding:8px 4px !important;border-radius:10px !important;width:auto !important;white-space:nowrap !important;text-decoration:none !important;transition:opacity .15s ease !important;}",
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link:hover{background:transparent !important;opacity:.7 !important;}",
    NAV+".ps-mm-ic{width:38px !important;height:38px !important;}",
    NAV+".ps-mm-ic svg{width:21px !important;height:21px !important;}",
    NAV+".ps-mm-t{font-size:14px !important;white-space:nowrap !important;}",
    /* item de la barre dont le panneau est ouvert : on le marque, comme Boks */
    NAV+"li.lw-topbar-option.ps-mm-on > .lw-topbar-option-link .lw-topbar-option-link-lbl{color:#6161FF !important;}",
    NAV+"li.lw-topbar-option.ps-mm-on > .lw-topbar-option-link svg{transform:rotate(180deg) !important;}",
    /* sous 900px la bande deviendrait illisible sur une ligne : on la scrolle */
    "@media(max-width:900px){"+NAV+".lw-topbar-submenu.js-submenu-list{justify-content:flex-start !important;overflow-x:auto !important;gap:28px !important;}}"
  ];
  C.forEach(function(c,i){ CSS.push(".lw-topbar-submenu-item:nth-child(6n+"+(i+1)+") .ps-mm-ic{background:"+c+" !important;}"); });
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
    /* panneaux sans aucune entrée réelle : ne pas afficher de boîte vide */
    document.querySelectorAll(".lw-topbar-submenu").forEach(function(s){
      s.classList.toggle("ps-mm-empty", s.querySelectorAll(".lw-topbar-submenu-item:not(.ps-mm-hide)").length===0);
    });
    openMenus();
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
