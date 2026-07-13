/* ============================================================
   Filtre catégories LearnWorlds — masque les catégories vides
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE (haut de page) :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/filters.js"></script>

   Le menu déroulant "categories" liste TOUTES les catégories de
   l'école, y compris celles sans cours sur cette page (→ "0 résultat").
   Ce script masque celles qui n'ont aucun cours dans le programme.

   Comment : POST /api/learner/products (tag=catégorie, inProduct=id du
   programme, itemsPerPage:1). Si 0 → la catégorie est masquée.
   SCAN INCRÉMENTAL : les catégories se chargent progressivement (au
   scroll du menu) ; chaque nouvelle catégorie qui apparaît est testée.
   Résultats en cache localStorage (6 h) → instantané ensuite.

   ⚠️ S'appuie sur un endpoint interne non documenté de LearnWorlds.
   Dégradation propre : si l'id du programme n'est pas trouvé, ne fait rien.
   ============================================================ */
(function(){
  "use strict";
  var ENDPOINT="/api/learner/products";
  var SEL=".lw-filter-option li, .lw-topbar-submenu-item.filter";

  var inProduct=null;
  var scanned=Object.create(null);   // nom -> true (déjà testé)
  var empty=Object.create(null);     // nom -> true (0 cours)
  var cacheLoaded=false;

  function findInProduct(){
    var scripts=document.querySelectorAll("script:not([src])");
    for(var i=0;i<scripts.length;i++){
      var txt=scripts[i].textContent||"";
      var m=txt.match(/"LearningProgram"\s*,\s*"secondaryContextKey"\s*:\s*"([a-f0-9]{24})"/)
          || txt.match(/"secondaryContextKey"\s*:\s*"([a-f0-9]{24})"/);
      if(m) return m[1];
    }
    return null;
  }

  function cacheKey(){ return "ps-emptycats2-"+inProduct; }
  function loadCache(){ try{ var c=JSON.parse(localStorage.getItem(cacheKey())||"null"); if(c && (Date.now()-c.t)<21600000) return c; }catch(e){} return null; }
  function saveCache(){ try{ localStorage.setItem(cacheKey(), JSON.stringify({t:Date.now(), scanned:Object.keys(scanned), empty:Object.keys(empty)})); }catch(e){} }

  function nodes(){ return [].slice.call(document.querySelectorAll(SEL)); }
  function nameOf(li){ return (li.textContent||"").replace(/\s+/g," ").trim(); }

  // Masquage via classe + règle !important : résiste aux ré-affichages
  // (LearnWorlds ou un autre script qui remettrait display inline).
  function ensureStyle(){
    if(document.getElementById("ps-filters-style")) return;
    var s=document.createElement("style");
    s.id="ps-filters-style";
    s.textContent=".ps-cat-hidden{display:none !important;}";
    (document.head||document.documentElement).appendChild(s);
  }
  function applyHide(){
    ensureStyle();
    nodes().forEach(function(li){
      var n=nameOf(li);
      if(!n) return;
      if(empty[n]) li.classList.add("ps-cat-hidden");
      else li.classList.remove("ps-cat-hidden");
    });
  }

  function scan(list){
    list = list.filter(function(n){ return n && n.length<40 && !scanned[n]; });
    if(!list.length) return;
    list.forEach(function(n){ scanned[n]=true; });
    var base={type:"course",access:"public,private-enroll,soon,view-locked",
      excludeNotEnrolledPrivateProductsForAdmin:"true",fields:"titleId",appliedCoupon:"",
      tag:"",inProduct:inProduct,offset:"0",itemsPerPage:"1",paginationType:"offset"};
    var pending=list.length;
    list.forEach(function(nm){
      var b={}; for(var k in base) b[k]=base[k]; b.tag=nm;
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(b)})
        .then(function(r){ return r.json(); })
        .then(function(j){ if(!(j && j.data && j.data.length)) empty[nm]=true; })
        .catch(function(){ delete scanned[nm]; })   // erreur : autoriser un nouvel essai
        .then(function(){ if(--pending===0){ saveCache(); applyHide(); } });
    });
  }

  function run(){
    if(inProduct===null){ inProduct=findInProduct(); if(!inProduct){ inProduct=null; return; } }
    if(!cacheLoaded){
      cacheLoaded=true;
      var c=loadCache();
      if(c){ (c.scanned||[]).forEach(function(n){ scanned[n]=true; }); (c.empty||[]).forEach(function(n){ empty[n]=true; }); }
    }
    applyHide();
    var seen=Object.create(null), current=[];
    nodes().forEach(function(li){ var n=nameOf(li); if(n && !seen[n]){ seen[n]=true; current.push(n); } });
    var toScan=current.filter(function(n){ return !scanned[n]; });
    if(toScan.length) scan(toScan);
  }

  var raf=false;
  function tick(){ if(raf) return; raf=true; requestAnimationFrame(function(){ raf=false; run(); }); }
  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded", run);
  new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("load", run);
  setInterval(run, 1200);
})();
