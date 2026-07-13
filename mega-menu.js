/* ============================================================
   Mega menu de navigation LearnWorlds — style monday (pictos)
   ------------------------------------------------------------
   À charger SITE-WIDE (Réglages du SITE → Code personnalisé) car
   le menu est présent sur toutes les pages :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/mega-menu.js"></script>

   Transforme les dropdowns natifs (.lw-topbar-submenu) en panneau
   type monday : grille 2 colonnes, icône colorée + titre.
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
    if(/connexion/.test(l)) return "out";
    return "def";
  }

  var C=["#6161FF","#00C875","#E2445C","#FDAB3D","#A25DDC","#0073EA"];
  var CSS=[
    ".lw-topbar-submenu.js-submenu-list{min-width:300px !important;padding:12px !important;border-radius:16px !important;background:#fff !important;border:1px solid #E6E9EF !important;box-shadow:0 20px 50px rgba(15,23,42,.16) !important;grid-template-columns:1fr 1fr !important;gap:2px !important;font-family:Figtree,sans-serif !important;margin-top:8px !important;}",
    ".lw-topbar-option:hover .lw-topbar-submenu.js-submenu-list{display:grid !important;}",
    ".lw-topbar-submenu-item{list-style:none !important;margin:0 !important;}",
    ".lw-topbar-submenu-item > .lw-topbar-option-link{display:flex !important;align-items:center !important;gap:11px !important;padding:9px 12px !important;border-radius:10px !important;text-decoration:none !important;transition:background .15s ease !important;height:auto !important;white-space:nowrap !important;}",
    ".lw-topbar-submenu-item > .lw-topbar-option-link:hover{background:#F5F7FB !important;}",
    ".ps-mm-ic{width:34px !important;height:34px !important;border-radius:9px !important;flex:none !important;display:flex !important;align-items:center !important;justify-content:center !important;color:#fff !important;}",
    ".ps-mm-ic svg{width:19px !important;height:19px !important;stroke:#fff !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-mm-t{font-family:Figtree,sans-serif !important;font-weight:700 !important;font-size:14.5px !important;color:#1c1f26 !important;line-height:1.2 !important;}"
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
      if(/^submenu link$/i.test(label) || !label){ if(li) li.style.display="none"; return; }
      link.innerHTML='<span class="ps-mm-ic">'+(ICON[pick(label)]||ICON.def)+'</span>'
                   + '<span class="ps-mm-t">'+label+'</span>';
      link.dataset.psMm="1";
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
