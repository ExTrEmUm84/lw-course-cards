/* ============================================================
   Filtre catégories LearnWorlds — masque les catégories vides
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE (idéalement dans
   le <head> / haut de page) où se trouve la liste filtrable :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/filters.js"></script>

   Problème résolu : le menu déroulant "categories" liste TOUTES les
   catégories de l'école, même celles sans aucun cours sur cette page
   (→ "0 résultat"). Ce script masque les catégories qui n'ont aucun
   cours dans le programme de la page.

   Comment : il interroge l'endpoint interne POST /api/learner/products
   (tag = catégorie, inProduct = id du programme) avec itemsPerPage:1 ;
   si 0 résultat → la catégorie est masquée. Résultat mis en cache
   (localStorage, 6 h) pour être instantané aux visites suivantes.

   ⚠️ S'appuie sur un endpoint interne non documenté de LearnWorlds :
   fonctionne aujourd'hui, à réajuster s'ils le changent. Dégradation
   propre : si l'id du programme n'est pas trouvé, le script ne fait rien.
   ============================================================ */
(function(){
  "use strict";
  var ENDPOINT="/api/learner/products";
  var SEL=".lw-filter-option li, .lw-topbar-submenu-item.filter";

  var inProduct=null, emptySet=null, scanned=false;

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

  function cacheKey(){ return "ps-emptycats-"+inProduct; }
  function loadCache(){ try{ var c=JSON.parse(localStorage.getItem(cacheKey())||"null"); if(c && (Date.now()-c.t)<21600000) return c.cats; }catch(e){} return null; }
  function saveCache(cats){ try{ localStorage.setItem(cacheKey(), JSON.stringify({t:Date.now(), cats:cats})); }catch(e){} }

  function nodes(){ return [].slice.call(document.querySelectorAll(SEL)); }
  function names(){
    var seen={}, out=[];
    nodes().forEach(function(li){
      var n=(li.textContent||"").replace(/\s+/g," ").trim();
      if(n && n.length<40 && !seen[n]){ seen[n]=1; out.push(n); }
    });
    return out;
  }
  function applyHide(){
    if(!emptySet) return;
    nodes().forEach(function(li){
      var n=(li.textContent||"").replace(/\s+/g," ").trim();
      li.style.display = (emptySet.indexOf(n)>=0) ? "none" : "";
    });
  }

  function scan(ns){
    if(!ns.length) return;
    var base={type:"course",access:"public,private-enroll,soon,view-locked",
      excludeNotEnrolledPrivateProductsForAdmin:"true",fields:"titleId",appliedCoupon:"",
      tag:"",inProduct:inProduct,offset:"0",itemsPerPage:"1",paginationType:"offset"};
    var empt=[], pending=ns.length;
    ns.forEach(function(nm){
      var b={}; for(var k in base) b[k]=base[k]; b.tag=nm;
      fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",body:JSON.stringify(b)})
        .then(function(r){ return r.json(); })
        .then(function(j){ if(!(j && j.data && j.data.length)) empt.push(nm); })
        .catch(function(){})
        .then(function(){ if(--pending===0){ emptySet=empt; saveCache(empt); applyHide(); } });
    });
  }

  function run(){
    if(inProduct===null){ inProduct=findInProduct(); if(!inProduct){ inProduct=null; return; } }
    if(emptySet===null){ var c=loadCache(); if(c) emptySet=c; }
    applyHide();
    if(!scanned){ var ns=names(); if(ns.length){ scanned=true; scan(ns); } }
  }

  var raf=false;
  function tick(){ if(raf) return; raf=true; requestAnimationFrame(function(){ raf=false; run(); }); }
  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded", run);
  new MutationObserver(tick).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener("load", run);
  setInterval(run, 1500);
})();
