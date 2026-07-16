/* ============================================================
   Cartes de cours LearnWorlds — style "monday produit" (dynamique)
   ------------------------------------------------------------
   Hébergé sur GitHub, chargé via jsDelivr dans le Code personnalisé :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/course-cards.js"></script>

   Cible l'élément natif "Courses" (.lw-course-card).
   Titre requis : "Niveau #N - Nom du cours".
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

  // --- 2) Styles (injectés une seule fois) ---
  var CSS = [
    "#pageContent .lw-cols.multiple-rows{display:grid !important;grid-template-columns:1fr 1fr !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;overflow:visible !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    "#pageContent .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    "#pageContent .lw-course-card > *:not(.ps-mcard){display:none !important;}",
    ".ps-mcard{display:flex !important;flex-direction:column !important;padding:32px !important;min-height:270px !important;}",
    ".ps-mhead{display:flex !important;align-items:center !important;gap:14px !important;margin-bottom:24px !important;}",
    ".ps-micon{width:44px !important;height:44px !important;border-radius:10px !important;display:flex !important;align-items:center !important;justify-content:center !important;color:#fff !important;font-weight:800 !important;font-size:20px !important;font-family:Figtree,sans-serif !important;flex:none !important;}",
    ".ps-micon svg{width:24px !important;height:24px !important;stroke:#fff !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-mlabel{font-family:Figtree,sans-serif !important;font-size:18px !important;color:#676879 !important;line-height:1.2 !important;}",
    ".ps-mlabel b{color:#1c1f26 !important;font-weight:800 !important;}",
    ".ps-mbrand{font-family:Figtree,sans-serif !important;font-size:17px !important;font-weight:800 !important;color:#1c1f26 !important;line-height:1 !important;}",
    ".ps-mtag{display:inline-flex !important;align-items:center !important;padding:4px 11px !important;border-radius:999px !important;font-family:Figtree,sans-serif !important;font-size:12px !important;font-weight:700 !important;line-height:1 !important;letter-spacing:.01em !important;white-space:nowrap !important;}",
    ".ps-mtitle{font-family:Figtree,sans-serif !important;font-size:25px !important;line-height:1.25 !important;font-weight:700 !important;color:#323338 !important;margin:0 0 auto !important;}",
    ".ps-mlink{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:26px !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-mlink::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-mlink:hover{color:#4B4BE0 !important;}",
    ".ps-mlink:hover::after{transform:translateX(5px) !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+1) .ps-micon{background:#6161FF !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+2) .ps-micon{background:#33D391 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+3) .ps-micon{background:#00C875 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+4) .ps-micon{background:#E2445C !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+5) .ps-micon{background:#FDAB3D !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+6) .ps-micon{background:#A25DDC !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+1) .ps-mtag{background:#EDEDFF !important;color:#4B4BE0 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+2) .ps-mtag{background:#E6F9F0 !important;color:#12A85F !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+3) .ps-mtag{background:#E1F7EC !important;color:#009257 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+4) .ps-mtag{background:#FDECEF !important;color:#D22B45 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+5) .ps-mtag{background:#FFF3E0 !important;color:#D98500 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+6) .ps-mtag{background:#F3EAFB !important;color:#8A45C9 !important;}",
    "@media(max-width:820px){#pageContent .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var styleEl=document.getElementById("ps-cards-style");
  if(!styleEl){ styleEl=document.createElement("style"); styleEl.id="ps-cards-style"; document.head.appendChild(styleEl); }
  styleEl.textContent=CSS;

  // --- 3) Construction des cartes ---
  var S="#pageContent";
  // Un pictogramme par niveau (thème progressif) — cycle si plus de 6 niveaux
  var ICONS=[
    '<svg viewBox="0 0 24 24"><path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1.1 2.2 2 5 2s5-.9 5-2v-4"/></svg>',            // 1 livre / intro
    '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',                                    // 2 loupe / screening
    '<svg viewBox="0 0 24 24"><path d="M4 18l6-6 3 3 7-7"/><path d="M16 8h5v5"/></svg>',                                          // 3 courbe / montée
    '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',                                                   // 4 éclair / accélération
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/></svg>',// 5 cible / derniers tours
    '<svg viewBox="0 0 24 24"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4v1a3 3 0 0 0 3 3"/><path d="M17 6h3v1a3 3 0 0 1-3 3"/></svg>' // 6 trophée / MBB
  ];
  function iconFor(level){ var i=(parseInt(level,10)-1); if(isNaN(i)||i<0) i=0; return ICONS[i % ICONS.length]; }
  function build(){
    document.querySelectorAll(S+" .lw-course-card").forEach(function(card){
      if(card.dataset.psM) return;
      var h=card.querySelector(".learnworlds-heading3"); if(!h) return;
      var level, name;
      var badge=h.querySelector(".course-level-badge"), ct=h.querySelector(".course-title");
      if(badge && ct){ level=((badge.textContent.match(/(\d+)/)||[])[1]); name=ct.textContent.trim(); }
      else { var m=h.textContent.trim().match(/^Niveau\s*#?\s*(\d+)\s*-\s*(.+)$/i); if(m){ level=m[1]; name=m[2]; } }
      if(!level || !name) return;
      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";
      var d=document.createElement("div");
      d.className="ps-mcard";
      d.innerHTML='<div class="ps-mhead"><span class="ps-micon">'+iconFor(level)+'</span>'
                + '<span class="ps-mbrand">PrepaStrat</span>'
                + '<span class="ps-mtag">Niveau '+level+'</span></div>'
                + '<h3 class="ps-mtitle">'+name+'</h3>'
                + '<a class="ps-mlink" href="'+href+'">En savoir plus</a>';
      card.appendChild(d);
      card.dataset.psM="1";
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
