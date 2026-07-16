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

  /* une carte = 1 teinte, déclinée en plein (picto) et en clair (bandeau) */
  function CYCLE(n, plein, clair){
    var C=S+" .cards-grandpa > .lw-cols > .col.lw-course-card:nth-child(6n+"+n+") ";
    return C+".ps-sicon svg{color:"+plein+" !important;}\n"
         + C+".ps-shero{background:"+clair+" !important;}";
  }

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
    ".ps-scard{display:flex !important;flex-direction:column !important;padding:0 !important;height:100% !important;}",
    /* bandeau teinté + grand cercle blanc (motif monday) ; les coins hauts sont
       découpés par le overflow:hidden de la carte. La teinte est accordée à la
       couleur du picto, carte par carte (cf. cycle plus bas). */
    ".ps-shero{height:196px !important;display:flex !important;align-items:center !important;justify-content:center !important;flex:none !important;}",
    ".ps-sicon{width:138px !important;height:138px !important;border-radius:50% !important;background:#fff !important;display:flex !important;align-items:center !important;justify-content:center !important;flex:none !important;}",
    /* Pictos BI-TON : le trait suit `currentColor` (posé par le cycle), et les
       formes marquées .f se remplissent du même ton en aplat léger -> plus
       "chargé" qu'un simple contour, sans partir sur des illustrations.
       stroke-width 1.5 (et non 2) : à 52px pour un viewBox de 24, chaque unité
       vaut ~2,2px à l'écran — un trait de 2 devient épais et pâteux. */
    ".ps-sicon svg{width:52px !important;height:52px !important;fill:none !important;stroke:currentColor !important;stroke-width:1.5 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-sicon svg .f{fill:currentColor !important;fill-opacity:.18 !important;}",
    ".ps-sbody{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;padding:22px 24px 24px !important;}",
    ".ps-stitle{font-family:Figtree,sans-serif !important;font-size:21px !important;line-height:1.25 !important;font-weight:800 !important;color:#1c1f26 !important;margin:0 0 8px !important;}",
    /* description bornée à 3 lignes : les cartes gardent la même hauteur */
    ".ps-sdesc{font-family:Figtree,sans-serif !important;font-size:14px !important;line-height:1.6 !important;color:#676879 !important;margin:0 0 auto !important;display:-webkit-box !important;-webkit-line-clamp:3 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* même CTA que partout ailleurs */
    ".ps-slink{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:18px !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-slink::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-slink:hover{color:#4B4BE0 !important;}",
    ".ps-slink:hover::after{transform:translateX(5px) !important;}",
    /* Cycle de couleurs : une seule teinte par carte, déclinée en 2 valeurs —
       `color` porte le picto (trait plein + aplat via currentColor), et le
       bandeau reprend la MÊME teinte en clair. Le cercle, lui, reste blanc. */
    CYCLE(1, "#6161FF", "#EDEDFF"),
    CYCLE(2, "#00C875", "#E3F8EE"),
    CYCLE(3, "#E2445C", "#FDECEF"),
    CYCLE(4, "#FDAB3D", "#FFF3E0"),
    CYCLE(5, "#A25DDC", "#F3EAFB"),
    CYCLE(6, "#0073EA", "#E6F1FD"),
    "@media(max-width:1040px){"+GRID+"{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:700px){"+GRID+"{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var st=document.getElementById("ps-sector-style");
  if(!st){ st=document.createElement("style"); st.id="ps-sector-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  // --- 3) Pictogrammes : par mot-clé du titre, avec repli neutre ---
  /* Tracés pensés pour un rendu à 52px dans le cercle blanc : les icônes
     "24px" habituelles (traits épais, détails serrés) deviennent illisibles
     agrandies — l'avion notamment.
     `class="f"` = forme remplie en aplat léger (cf. .ps-sicon svg .f). Les
     autres tracés restent en trait : c'est ce contraste qui donne la densité. */
  var ICON={
    pill:'<svg viewBox="0 0 24 24"><path class="f" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/><path d="M6.8 13.2 9 11M9.6 16 11.8 13.8"/></svg>',
    plane:'<svg viewBox="0 0 24 24"><path class="f" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2Z"/></svg>',
    chart:'<svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><rect class="f" x="7" y="12" width="3.2" height="6" rx="1"/><rect class="f" x="12.4" y="6.5" width="3.2" height="11.5" rx="1"/><rect class="f" x="17.8" y="9.5" width="3.2" height="8.5" rx="1"/><path d="m7 9 4-3.5 4 2 5-4.5"/></svg>',
    build:'<svg viewBox="0 0 24 24"><path class="f" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>',
    car:'<svg viewBox="0 0 24 24"><path class="f" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"/><path d="M5.5 10.5h13"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    bank:'<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path class="f" d="M5 21V7l8-4v18Z"/><path class="f" d="M19 21V11l-6-4v14Z"/><path d="M8.5 9h.01M8.5 12h.01M8.5 15h.01M8.5 18h.01M16 13h.01M16 17h.01"/></svg>',
    doc:'<svg viewBox="0 0 24 24"><path class="f" d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>'
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
      /* bandeau teinté + cercle blanc + picto */
      var hero=document.createElement("div"); hero.className="ps-shero";
      var ic=document.createElement("span");
      ic.className="ps-sicon"; ic.innerHTML=ICON[pick(title)]||ICON.doc;
      hero.appendChild(ic);
      /* corps : titre + description + CTA */
      var body=document.createElement("div"); body.className="ps-sbody";
      var t=document.createElement("h3");
      t.className="ps-stitle"; t.textContent=title;          // textContent : pas d'injection
      body.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-sdesc"; p.textContent=desc; body.appendChild(p); }
      var a=document.createElement("a");
      a.className="ps-slink"; a.href=href; a.textContent="En savoir plus";
      body.appendChild(a);
      d.appendChild(hero); d.appendChild(body);

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
