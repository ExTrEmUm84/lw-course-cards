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
    NAV+".lw-topbar-option:hover > .lw-topbar-option-link svg{transform:rotate(180deg) !important;}",

    /* ---------- panneau : une seule ligne, largeur du menu ---------- */
    /* on ancre le panneau sur la barre entière (et non sur l'item survolé) */
    NAV+"ul.lw-topbar-options{position:relative !important;}",
    NAV+"li.lw-topbar-option{position:static !important;}",
    NAV+".lw-topbar-submenu.js-submenu-list{position:absolute !important;top:100% !important;bottom:auto !important;left:0 !important;right:auto !important;width:100% !important;min-width:0 !important;max-width:none !important;height:auto !important;max-height:none !important;overflow:visible !important;transform:none !important;margin-top:12px !important;padding:10px !important;border-radius:18px !important;background:#fff !important;border:1px solid #E6E9EF !important;box-shadow:0 24px 60px rgba(15,23,42,.18) !important;gap:4px !important;font-family:Figtree,sans-serif !important;grid-template-columns:none !important;align-items:stretch !important;}",
    /* Ouverture pilotée en JS (classe), PAS en :hover — cf. openMenus() :
       le panneau fait toute la largeur du menu alors que son déclencheur est
       étroit ; en diagonale la souris sort du li AVANT d'atteindre le panneau,
       le :hover tombe et le menu disparaît. Un délai de grâce corrige ça. */
    NAV+".lw-topbar-submenu.js-submenu-list:not(.ps-mm-open){display:none !important;}",
    NAV+".lw-topbar-submenu.js-submenu-list.ps-mm-open{display:flex !important;}",
    /* pont invisible qui comble les 12px entre la barre et le panneau.
       top:0 (et NON -13px) : calibré et vérifié — à -13px le pont se posait SUR
       les libellés du menu (et interceptait leurs clics) sans combler l'espace. */
    NAV+".lw-topbar-submenu.js-submenu-list::before{content:\"\" !important;position:absolute !important;left:0 !important;right:0 !important;top:0 !important;height:13px !important;display:block !important;}",
    NAV+".lw-topbar-submenu-item:not(.ps-mm-hide){list-style:none !important;margin:0 !important;padding:0 !important;flex:1 1 0 !important;min-width:0 !important;display:flex !important;}",
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link{display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:flex-start !important;text-align:center !important;gap:9px !important;padding:16px 8px 14px !important;border-radius:12px !important;width:100% !important;white-space:normal !important;text-decoration:none !important;transition:background .15s ease !important;}",
    NAV+".lw-topbar-submenu-item > .lw-topbar-option-link:hover{background:#F5F7FB !important;}",
    NAV+".ps-mm-ic{width:38px !important;height:38px !important;}",
    NAV+".ps-mm-ic svg{width:21px !important;height:21px !important;}",
    NAV+".ps-mm-t{font-size:13px !important;white-space:normal !important;}"
  ];
  C.forEach(function(c,i){ CSS.push(".lw-topbar-submenu-item:nth-child(6n+"+(i+1)+") .ps-mm-ic{background:"+c+" !important;}"); });
  var st=document.getElementById("ps-megamenu-style");
  if(!st){ st=document.createElement("style"); st.id="ps-megamenu-style"; document.head.appendChild(st); }
  st.textContent=CSS.join("\n");

  function build(){
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
     Ouverture / fermeture des panneaux — avec DÉLAI DE GRÂCE.
     Pourquoi pas un simple :hover ? Le panneau occupe toute la largeur du
     menu, mais son déclencheur est étroit ("Cas" ne fait que ~24px). Pour
     atteindre un item à l'autre bout du panneau, la souris part en diagonale
     et quitte le li par le CÔTÉ, quelques pixels au-dessus du panneau : le
     :hover tombe et le menu se ferme sous le curseur. Mesuré : rupture en
     (1091,70) pour "Cas". Aucun pont CSS ne couvre ce cas sans recouvrir les
     autres items de la barre -> on ferme 200ms après la sortie.
     ------------------------------------------------------------------ */
  var GRACE=200, closeT=null;
  function closeAll(){
    document.querySelectorAll("nav.lw-topbar-menu .lw-topbar-submenu.ps-mm-open")
      .forEach(function(s){ s.classList.remove("ps-mm-open"); });
  }
  function openMenus(){
    document.querySelectorAll("nav.lw-topbar-menu li.lw-topbar-option").forEach(function(li){
      if(li.dataset.psHov) return;
      var sub=li.querySelector(".lw-topbar-submenu");
      if(!sub || sub.classList.contains("ps-mm-empty")) return;   // ex : Blog
      li.dataset.psHov="1";
      /* mouseenter/mouseleave suivent le DOM : entrer dans le panneau (enfant
         du li) ré-arme l'ouverture même s'il est géométriquement hors du li. */
      li.addEventListener("mouseenter",function(){
        clearTimeout(closeT); closeAll(); sub.classList.add("ps-mm-open");
      });
      li.addEventListener("mouseleave",function(){
        clearTimeout(closeT); closeT=setTimeout(closeAll,GRACE);
      });
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
