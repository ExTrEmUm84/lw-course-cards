/* ============================================================
   Cartes de cours LearnWorlds — style "monday produit" (dynamique)
   ------------------------------------------------------------
   Hébergé sur GitHub, chargé via jsDelivr dans le Code personnalisé :
     <script src="https://cdn.jsdelivr.net/gh/ExTrEmUm84/lw-course-cards@main/course-cards.js"></script>

   Cible l'élément natif "Courses" (.lw-course-card).
   Titre requis : "Niveau #N - Nom du cours".

   Les cartes défilent en CARROUSEL horizontal (3 visibles) avec deux
   flèches de navigation.

   ⚠️ `#pageContent .lw-cols.multiple-rows` matche AUSSI les deux barres
   de filtres de la page. Les règles du carrousel sont donc scopées sous
   `.cards-grandpa >` (le vrai conteneur des cartes) — sinon on transforme
   la barre de filtres en carrousel.
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
    /* ⚠️ NE JAMAIS poser `display` sur `.lw-cols.multiple-rows` NON scopé : le
       sélecteur matche aussi les barres de filtres, que LearnWorlds masque avec
       un `display:none` INLINE quand on désactive les filtres dans l'éditeur.
       Un `display:… !important` en feuille de style écrase cet inline -> les
       filtres restent visibles malgré la désactivation. Ici : alignement seul. */
    "#pageContent .lw-cols.with-filters{max-width:1000px !important;margin:0 auto !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
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

    /* ================= CARROUSEL (scopé au conteneur des cartes) ============ */
    /* le rail : 3 cartes visibles, défilement horizontal aimanté */
    "#pageContent .cards-grandpa{position:relative !important;}",
    /* le rail porte lui-même sa largeur/fond/police : le `display:flex` n'est posé
       QUE sur ce sélecteur scopé, jamais sur `.lw-cols.multiple-rows` nu (cf. plus haut) */
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows{display:flex !important;flex-wrap:nowrap !important;overflow-x:auto !important;scroll-snap-type:x mandatory !important;scrollbar-width:none !important;-ms-overflow-style:none !important;gap:24px !important;padding:14px 0 26px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows::-webkit-scrollbar{display:none !important;}",
    /* 3 cartes : largeur = (100% - 2 gouttières) / 3 */
    "#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 calc((100% - 48px) / 3) !important;scroll-snap-align:start !important;}",
    /* densité réduite pour tenir sur ~317px */
    "#pageContent .cards-grandpa .ps-mcard{padding:24px !important;min-height:250px !important;}",
    "#pageContent .cards-grandpa .ps-mtitle{font-size:21px !important;}",
    "#pageContent .cards-grandpa .ps-mhead{gap:11px !important;margin-bottom:20px !important;}",
    "#pageContent .cards-grandpa .ps-micon{width:40px !important;height:40px !important;}",
    "#pageContent .cards-grandpa .ps-mlink{margin-top:20px !important;}",
    /* les flèches */
    ".ps-car-btn{position:absolute !important;top:50% !important;transform:translateY(-50%) !important;width:44px !important;height:44px !important;border-radius:50% !important;background:#fff !important;border:1px solid #E6E9EF !important;box-shadow:0 4px 14px rgba(15,23,42,.12) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;padding:0 !important;z-index:5 !important;transition:background .15s ease, box-shadow .15s ease, opacity .2s ease !important;}",
    ".ps-car-btn:hover{background:#F5F7FB !important;box-shadow:0 6px 18px rgba(15,23,42,.16) !important;}",
    ".ps-car-btn svg{width:20px !important;height:20px !important;stroke:#1c1f26 !important;fill:none !important;stroke-width:2.2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-car-btn[disabled]{opacity:0 !important;pointer-events:none !important;}",
    ".ps-car-prev{left:4px !important;}",
    ".ps-car-next{right:4px !important;}",
    /* responsive : 2 puis 1 carte, flèches collées aux bords */
    "@media(max-width:1100px){.ps-car-prev{left:-2px !important;} .ps-car-next{right:-2px !important;}}",
    "@media(max-width:1040px){#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 calc((100% - 24px) / 2) !important;}}",
    "@media(max-width:700px){#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 86% !important;}}",

    /* ================= TITRES (hero premium) =============================== */
    /* Alignés à gauche SUR LES CARTES : le conteneur natif fait 1120px alors que
       le rail des cartes fait 1000px centré. Un simple text-align:left décalerait
       les titres de 60px à gauche des cartes -> on reprend la même largeur 1000px. */
    "#pageContent h1.learnworlds-heading{font-family:Figtree,sans-serif !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:#1c1f26 !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    "#pageContent h2.learnworlds-subheading{font-family:Figtree,sans-serif !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:#1c1f26 !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* .learnworlds-main-text existe AUSSI dans chaque carte : on ne stylise que
       la description marquée en JS (cf. heroText), jamais la classe nue.
       padding-right : garde une longueur de ligne lisible (~620px) tout en
       laissant le bord GAUCHE calé sur les cartes. */
    "#pageContent .ps-desc{font-family:Figtree,sans-serif !important;font-size:17px !important;line-height:1.65 !important;color:#676879 !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    /* machine à écrire : le slot réserve la largeur de la phrase la plus longue
       pour que le titre centré ne tremble pas à chaque lettre */
    ".ps-tw{display:inline-block !important;text-align:left !important;color:#6161FF !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:#6161FF !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",
    "@media(max-width:820px){#pageContent h1.learnworlds-heading{font-size:36px !important;}#pageContent h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}#pageContent .ps-desc{padding-right:0 !important;}}"
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
    mountCarousel();
    heroText();
  }

  // --- 4) Hero : machine à écrire sur les segments marqués "#" ---
  /* "Nos formations pour #le conseil #la stratégie"
     -> préfixe "Nos formations pour" + phrases ["le conseil","la stratégie"]
     qui se tapent / s'effacent en boucle. */
  function heroText(){
    /* .learnworlds-main-text = la description du haut, MAIS AUSSI celle de chaque
       carte ET le pied de page (contact, copyright). La description, c'est celle
       qui est hors carte ET avant les cartes dans le document. */
    var grandpa=document.querySelector(S+" .cards-grandpa");
    if(grandpa){
      document.querySelectorAll(S+" .learnworlds-main-text").forEach(function(el){
        if(el.closest(".cards-grandpa")) return;                                     // carte
        if(!(grandpa.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)) return; // pied de page
        el.classList.add("ps-desc");
      });
    }

    var h1=document.querySelector(S+" h1.learnworlds-heading");
    if(!h1 || h1.dataset.psTw) return;
    var raw=(h1.textContent||"").replace(/\s+/g," ").trim();
    var i=raw.indexOf("#");
    if(i<0) return;                                   // pas de # -> on ne touche à rien
    var prefix=raw.slice(0,i).trim();
    var parts=raw.slice(i).split("#").map(function(s){ return s.trim(); }).filter(Boolean);
    if(!parts.length) return;
    h1.dataset.psTw="1";
    /* le texte animé est masqué aux lecteurs d'écran : on rend la phrase complète */
    h1.setAttribute("aria-label", prefix+" "+parts.join(", "));

    var pre=document.createElement("span");
    pre.textContent=prefix+" ";                       // textContent : pas d'injection HTML
    var slot=document.createElement("span");
    slot.className="ps-tw"; slot.setAttribute("aria-hidden","true");
    var txt=document.createElement("span"); txt.className="ps-tw-txt";
    var cur=document.createElement("span"); cur.className="ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent=""; h1.appendChild(pre); h1.appendChild(slot);

    /* largeur réservée = phrase la plus longue (mesurée police chargée) */
    function reserve(){
      var w=0, keep=txt.textContent;
      slot.style.minWidth="0px";
      parts.forEach(function(p){ txt.textContent=p; w=Math.max(w, txt.getBoundingClientRect().width); });
      txt.textContent=keep;
      slot.style.minWidth=Math.ceil(w)+"px";
    }
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(reserve); else reserve();
    var rt; window.addEventListener("resize",function(){ clearTimeout(rt); rt=setTimeout(reserve,150); });

    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      txt.textContent=parts[0]; return;               // pas d'animation si l'utilisateur la refuse
    }
    var p=0, c=0, del=false;
    (function tick(){
      var full=parts[p];
      c += del ? -1 : 1;
      txt.textContent=full.slice(0,c);
      var d = del ? 34 : 58;
      if(!del && c>=full.length){ del=true; d=1700; }
      else if(del && c<=0){ del=false; p=(p+1)%parts.length; d=320; }
      setTimeout(tick,d);
    })();
  }

  // --- 5) Carrousel : deux flèches + défilement d'une carte à la fois ---
  var CHEV_L='<svg viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></svg>';
  var CHEV_R='<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>';
  function mountCarousel(){
    var track=document.querySelector(S+" .cards-grandpa > .lw-cols.multiple-rows");
    if(!track) return;
    var wrap=track.parentElement;               // .cards-grandpa (ne défile pas)
    if(wrap.dataset.psCar){ refresh(wrap); return; }
    wrap.dataset.psCar="1";

    var prev=document.createElement("button");
    prev.className="ps-car-btn ps-car-prev"; prev.type="button";
    prev.setAttribute("aria-label","Cartes précédentes"); prev.innerHTML=CHEV_L;
    var next=document.createElement("button");
    next.className="ps-car-btn ps-car-next"; next.type="button";
    next.setAttribute("aria-label","Cartes suivantes"); next.innerHTML=CHEV_R;

    /* position de défilement de chaque carte (= ses points d'aimantation) */
    function offsets(){
      var tl=track.getBoundingClientRect().left, sl=track.scrollLeft, o=[];
      track.querySelectorAll(".lw-course-card").forEach(function(c){
        o.push(Math.round(sl + c.getBoundingClientRect().left - tl));
      });
      return o;
    }
    /* on vise la position exacte de la carte : l'aimantation n'a plus rien à corriger */
    function animateTo(target){
      var max=track.scrollWidth-track.clientWidth;
      track.scrollTo({left:Math.max(0,Math.min(target,max)),behavior:"smooth"});
    }
    function go(dir){
      var o=offsets(), sl=track.scrollLeft, i, target=null;
      if(dir>0){ for(i=0;i<o.length;i++){ if(o[i]>sl+2){ target=o[i]; break; } }
                 if(target===null) target=track.scrollWidth-track.clientWidth; }
      else { for(i=o.length-1;i>=0;i--){ if(o[i]<sl-2){ target=o[i]; break; } }
             if(target===null) target=0; }
      animateTo(target);
    }
    prev.addEventListener("click",function(e){ e.preventDefault(); go(-1); });
    next.addEventListener("click",function(e){ e.preventDefault(); go(1); });

    wrap.appendChild(prev); wrap.appendChild(next);
    track.addEventListener("scroll",function(){ refresh(wrap); },{passive:true});
    window.addEventListener("resize",function(){ refresh(wrap); });
    refresh(wrap);
  }
  /* masque la flèche inutile en début / fin de course */
  function refresh(wrap){
    var track=wrap.querySelector(":scope > .lw-cols.multiple-rows");
    var prev=wrap.querySelector(".ps-car-prev"), next=wrap.querySelector(".ps-car-next");
    if(!track || !prev || !next) return;
    var max=track.scrollWidth-track.clientWidth;
    prev.disabled = track.scrollLeft<=2;
    next.disabled = track.scrollLeft>=max-2;
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
