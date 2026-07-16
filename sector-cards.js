/* ============================================================
   Cartes "Fiches secteur" — même design que les cartes de cours
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /fiches-secteur :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/sector-cards.js"></script>

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

  // --- 2) Styles ---
  var CSS=[
    /* grille de 3, alignée comme la page Cours (1000px centrés) */
    GRID+"{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    /* on ne masque le natif QUE sur les cartes effectivement reconstruites */
    S+" .lw-course-card[data-ps-s] > *:not(.ps-scard){display:none !important;}",

    /* height:100% : sans ça .ps-scard s'arrête à son contenu au lieu de remplir
       la carte étirée par la grille -> le `margin-bottom:auto` de .ps-sdesc n'a
       aucun espace à absorber et les CTA ne s'alignent plus d'une carte à l'autre. */
    ".ps-scard{display:flex !important;flex-direction:column !important;padding:24px !important;min-height:250px !important;height:100% !important;}",
    ".ps-sicon{width:40px !important;height:40px !important;border-radius:10px !important;display:flex !important;align-items:center !important;justify-content:center !important;flex:none !important;margin-bottom:18px !important;}",
    ".ps-sicon svg{width:22px !important;height:22px !important;stroke:#fff !important;fill:none !important;stroke-width:2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-stitle{font-family:Figtree,sans-serif !important;font-size:21px !important;line-height:1.25 !important;font-weight:700 !important;color:#323338 !important;margin:0 0 10px !important;}",
    /* description bornée à 4 lignes : les cartes gardent la même hauteur */
    ".ps-sdesc{font-family:Figtree,sans-serif !important;font-size:14px !important;line-height:1.6 !important;color:#676879 !important;margin:0 0 auto !important;display:-webkit-box !important;-webkit-line-clamp:4 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* même CTA que partout ailleurs */
    ".ps-slink{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:20px !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-slink::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-slink:hover{color:#4B4BE0 !important;}",
    ".ps-slink:hover::after{transform:translateX(5px) !important;}",
    /* couleurs cyclées, comme les cartes de cours */
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+1) .ps-sicon{background:#6161FF !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+2) .ps-sicon{background:#00C875 !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+3) .ps-sicon{background:#E2445C !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+4) .ps-sicon{background:#FDAB3D !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+5) .ps-sicon{background:#A25DDC !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+6) .ps-sicon{background:#0073EA !important;}",
    "@media(max-width:1040px){"+GRID+"{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:700px){"+GRID+"{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var st=document.getElementById("ps-sector-style");
  if(!st){ st=document.createElement("style"); st.id="ps-sector-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  // --- 3) Pictogrammes : par mot-clé du titre, avec repli neutre ---
  var ICON={
    pill:'<svg viewBox="0 0 24 24"><path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7z"/><path d="m8.5 8.5 7 7"/></svg>',
    plane:'<svg viewBox="0 0 24 24"><path d="M17.8 19.8 16 14l-4 1-1 4-2 1v-4l-3-2 1-2 5 1 1-4-5.8-1.8"/><path d="M21 4a2 2 0 0 0-3 0l-11 11"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    build:'<svg viewBox="0 0 24 24"><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16"/><path d="M15 9h4a1 1 0 0 1 1 1v11"/><path d="M8 8h3M8 12h3M8 16h3"/></svg>',
    car:'<svg viewBox="0 0 24 24"><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M9 17h6"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 10 12 4l9 6"/><path d="M5 10v8M19 10v8M9 10v8M15 10v8"/><path d="M3 20h18"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/></svg>'
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

  // --- 4) Construction ---
  function build(){
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

      var d=document.createElement("div");
      d.className="ps-scard";
      var ic=document.createElement("span");
      ic.className="ps-sicon"; ic.innerHTML=ICON[pick(title)]||ICON.doc;
      var t=document.createElement("h3");
      t.className="ps-stitle"; t.textContent=title;          // textContent : pas d'injection
      d.appendChild(ic); d.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-sdesc"; p.textContent=desc; d.appendChild(p); }
      var a=document.createElement("a");
      a.className="ps-slink"; a.href=href; a.textContent="En savoir plus";
      d.appendChild(a);

      card.appendChild(d);
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
