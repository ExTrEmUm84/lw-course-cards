/* ============================================================
   PREPASTRAT — Cartes cours "style monday produit" (dynamique)
   ------------------------------------------------------------
   Fichier hébergé sur GitHub, chargé dans LearnWorlds via jsDelivr :
     <script src="https://cdn.jsdelivr.net/gh/USER/REPO@main/prepastrat-cards.js"></script>
   (à mettre dans le Code personnalisé de la page ou du site.)

   Cible l'élément natif "Courses" (.lw-course-card) -> tes vrais cours.
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
    ".ps-mlabel{font-family:Figtree,sans-serif !important;font-size:18px !important;color:#676879 !important;line-height:1.2 !important;}",
    ".ps-mlabel b{color:#1c1f26 !important;font-weight:800 !important;}",
    ".ps-mtitle{font-family:Figtree,sans-serif !important;font-size:25px !important;line-height:1.25 !important;font-weight:700 !important;color:#323338 !important;margin:0 0 auto !important;}",
    ".ps-mlink{display:inline-block !important;margin-top:26px !important;color:#323338 !important;font-family:Figtree,sans-serif !important;font-size:17px !important;font-weight:600 !important;text-decoration:underline !important;text-underline-offset:4px !important;}",
    ".ps-mlink:hover{color:#0073EA !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+1) .ps-micon{background:#6161FF !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+2) .ps-micon{background:#33D391 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+3) .ps-micon{background:#00C875 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+4) .ps-micon{background:#E2445C !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+5) .ps-micon{background:#FDAB3D !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:nth-child(6n+6) .ps-micon{background:#A25DDC !important;}",
    "@media(max-width:820px){#pageContent .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var styleEl=document.getElementById("ps-cards-style");
  if(!styleEl){ styleEl=document.createElement("style"); styleEl.id="ps-cards-style"; document.head.appendChild(styleEl); }
  styleEl.textContent=CSS;

  // --- 3) Construction des cartes ---
  var S="#pageContent";
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
      d.innerHTML='<div class="ps-mhead"><span class="ps-micon">'+level+'</span>'
                + '<span class="ps-mlabel"><b>PrepaStrat</b> Niveau '+level+'</span></div>'
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
