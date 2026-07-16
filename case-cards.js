/* ============================================================
   Cartes "études de cas" LearnWorlds — style monday + pastilles
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE Cas :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/case-cards.js"></script>

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
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows{display:grid !important;grid-template-columns:1fr 1fr !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;overflow:visible !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    /* la barre de filtres : alignement seul, aucun `display` */
    "#pageContent .lw-cols.with-filters{max-width:1000px !important;margin:0 auto !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    "#pageContent .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    "#pageContent .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    "#pageContent .lw-course-card > *:not(.ps-cc){display:none !important;}",
    ".ps-cc{display:flex !important;flex-direction:column !important;padding:26px !important;min-height:180px !important;}",
    ".ps-cc-title{font-family:Figtree,sans-serif !important;font-size:21px !important;font-weight:800 !important;color:#243B6B !important;line-height:1.25 !important;margin:0 0 14px !important;}",
    ".ps-cc-pills{display:flex !important;flex-wrap:wrap !important;gap:7px !important;margin-bottom:auto !important;}",
    ".ps-pill{display:inline-flex !important;align-items:center !important;gap:5px !important;padding:4px 11px !important;border-radius:999px !important;font-family:Figtree,sans-serif !important;font-size:12px !important;font-weight:600 !important;line-height:1.1 !important;background:#EEF1F6 !important;color:#4B5563 !important;}",
    ".ps-pill b{font-weight:700 !important;opacity:.62 !important;text-transform:uppercase !important;font-size:10px !important;letter-spacing:.03em !important;}",
    ".ps-f-cabinet{background:#EDEDFF !important;color:#4B4BE0 !important;}",
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
    ".ps-cc-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:18px !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-cc-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-cc-link:hover{color:#4B4BE0 !important;}",
    ".ps-cc-link:hover::after{transform:translateX(5px) !important;}",
    "@media(max-width:820px){#pageContent .cards-grandpa > .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}"
  ].join("\n");
  var st=document.getElementById("ps-casecards-style");
  if(!st){ st=document.createElement("style"); st.id="ps-casecards-style"; document.head.appendChild(st); }
  st.textContent=CSS;

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

  function build(){
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
      var pills=fields.map(function(fld){
        var key=keyFor(fld.label);
        var cls="ps-pill "+(key==="diff" ? diffClass(fld.value) : "ps-f-"+key);
        return '<span class="'+cls+'">'+clean(fld.value)+'</span>';
      }).join("");
      var d=document.createElement("div");
      d.className="ps-cc";
      d.innerHTML='<h3 class="ps-cc-title">'+title+'</h3>'
                + '<div class="ps-cc-pills">'+pills+'</div>'
                + '<a class="ps-cc-link" href="'+href+'">En savoir plus</a>';
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
