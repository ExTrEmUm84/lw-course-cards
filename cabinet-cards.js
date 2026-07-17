/* ============================================================
   Cartes "Fiches cabinet" + hero — page /fiches-secteur-clone
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE :
     <script src="https://extremum84.github.io/lw-course-cards/cabinet-cards.js"></script>

   Même coquille que `sector-cards.js` (blanc, bord #E6E9EF, radius 16,
   survol qui soulève, grille de 3) mais SANS bandeau, SANS picto et SANS
   logo : la carte ne porte que titre + description + CTA.
   Choix de Ziad le 16/07 — les logos des cabinets (Advancy, Bain) sont
   pourtant présents en `background-image` sur `.learnworlds-image` et
   restent disponibles si on veut les réintroduire un jour. ⚠️ Ils sont
   servis en `background-size:cover`, qui ROGNE : un logo demanderait
   `contain` sur fond blanc.

   Le titre est à 25px comme les cartes de la page Cas — l'autre jeu de
   cartes SANS visuel. (`sector-cards.js` est à 21px, mais ses cartes ont
   un grand picto qui porte le regard ; ici le titre est seul.)

   ⚠️ NE PAS charger `course-cards.js` ni `sector-cards.js` ici : leur CSS
   masque le contenu natif et leur build() a d'autres exigences -> cartes
   vides. Ici le masquage est conditionné à `[data-ps-c]`, donc une carte
   non reconstruite reste intacte.

   ⚠️ `#pageContent .lw-cols.multiple-rows` matche AUSSI la barre de
   filtres. Tout est scopé sous `.cards-grandpa >`, et jamais de `display`
   sur le sélecteur nu (LearnWorlds masque les filtres désactivés par un
   `display:none` INLINE qu'un `!important` écraserait).
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
    /* grille de 3, alignée comme les autres pages (1000px centrés).
       Le natif fait 1120px ici (mesuré : 290->1410) : on reprend 1000 pour
       que les cartes tombent sur le même bord gauche que le hero. */
    GRID+"{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    /* on ne masque le natif QUE sur les cartes effectivement reconstruites */
    S+" .lw-course-card[data-ps-c] > *:not(.ps-ccab){display:none !important;}",

    /* height:100% : sans ça la carte reconstruite s'arrête à son contenu au lieu
       de remplir la hauteur étirée par la grille -> le `margin-bottom:auto` de
       la description n'a rien à absorber et les CTA se désalignent entre cartes. */
    ".ps-ccab{display:flex !important;flex-direction:column !important;height:100% !important;padding:26px !important;}",
    ".ps-cab-title{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:25px !important;line-height:1.2 !important;font-weight:800 !important;letter-spacing:-.02em !important;color:#243B6B !important;margin:0 0 10px !important;}",
    /* description bornée à 4 lignes : les cartes gardent la même hauteur */
    ".ps-cab-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;margin:0 !important;display:-webkit-box !important;-webkit-line-clamp:4 !important;-webkit-box-orient:vertical !important;overflow:hidden !important;}",
    /* Même CTA que partout ailleurs.
       🔴 `margin-top:auto` sur le LIEN, et non `margin-bottom:auto` sur la
       description (comme le fait sector-cards.js) : toutes les fiches n'ont pas
       de description — "Bain & Company" n'en a pas — et sans elle plus rien ne
       poussait le CTA, qui remontait se coller au titre au milieu d'une carte
       vide (constaté à l'écran). Le lien, lui, existe toujours.
       `padding-top` et non `margin-top` pour l'écart : le `margin-top:auto`
       occupe déjà la propriété. */
    ".ps-cab-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:auto !important;padding-top:18px !important;color:var(--ps-accent,#6161FF) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-cab-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-cab-link:hover{color:var(--ps-accent-hover,#4B4BE0) !important;}",
    ".ps-cab-link:hover::after{transform:translateX(5px) !important;}",

    /* ================= TITRES (hero) — porté de case-cards.js ============== */
    S+" h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* LW sert le H1 avec ses "#" : on le masque tant que heroText() ne l'a pas
       transformé, sinon les "#" s'affichent en clair une demi-seconde.
       `visibility` et non `display` : la place reste réservée. Filet de
       sécurité à 2,5s plus bas, sinon un titre sans "#" resterait invisible. */
    S+" h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    S+" h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    S+" .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#6161FF) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#6161FF) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",

    "@media(max-width:1040px){"+GRID+"{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:820px){"+S+" h1.learnworlds-heading{font-size:36px !important;}"+S+" h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}"+S+" .ps-desc{padding-right:0 !important;}}",
    "@media(max-width:700px){"+GRID+"{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var st=document.getElementById("ps-cabinet-style");
  if(!st){ st=document.createElement("style"); st.id="ps-cabinet-style"; document.head.appendChild(st); }
  st.textContent=CSS;

  // --- 3) Hero : machine à écrire sur les segments marqués "#" ---
  /* "Nos fiches pour #le conseil #la stratégie"
     -> préfixe "Nos fiches pour" + phrases qui se tapent / s'effacent en boucle. */
  function heroText(){
    /* .learnworlds-main-text = la description du haut, MAIS AUSSI celle de
       chaque carte, le bouton des catégories du FILTRE et le pied de page.
       🔴 L'exclusion du filtre est indispensable : cette page a une barre de
       filtres, et sans elle le bouton "categories …" reçoit le style de
       description (17px + padding-right:38% sur un bouton). Même piège que sur
       la page Cas. */
    var grandpa=document.querySelector(S+" .cards-grandpa");
    if(grandpa){
      document.querySelectorAll(S+" .learnworlds-main-text").forEach(function(el){
        if(el.closest(".cards-grandpa")) return;                                     // carte
        if(el.closest(".lw-filters, .lw-cols.with-filters")) return;                 // barre de filtres
        if(!(grandpa.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)) return; // pied de page
        el.classList.add("ps-desc");
      });
    }

    var h1=document.querySelector(S+" h1.learnworlds-heading");
    if(!h1 || h1.dataset.psTw) return;
    /* data-ps-tw posé AVANT toute autre condition : c'est lui qui lève le
       masquage CSS. Posé seulement en cas de succès, un titre sans "#"
       resterait invisible pour toujours. */
    h1.dataset.psTw="1";
    var raw=(h1.textContent||"").replace(/\s+/g," ").trim();
    var i=raw.indexOf("#");
    if(i<0) return;                                   // pas de # -> titre natif, rien à animer
    var prefix=raw.slice(0,i).trim();
    var parts=raw.slice(i).split("#").map(function(s){ return s.trim(); }).filter(Boolean);
    if(!parts.length) return;
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

    /* largeur réservée = phrase la plus longue (mesurée police chargée), sinon
       le titre tremble à chaque lettre */
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
    /* La 1re phrase est affichée EN ENTIER dès le départ, le cycle ne démarre
       qu'après la pause : sinon le slot part vide et se remplit lettre par
       lettre, ce qui se lit comme un retard d'affichage. */
    var p=0, c=parts[0].length, del=true;
    txt.textContent=parts[0];
    function tick(){
      var full=parts[p];
      c += del ? -1 : 1;
      txt.textContent=full.slice(0,c);
      var d = del ? 34 : 58;                          // frappe / effacement
      if(!del && c>=full.length){ del=true; d=1700; } // pause phrase complète
      else if(del && c<=0){ del=false; p=(p+1)%parts.length; d=320; }
      setTimeout(tick,d);
    }
    setTimeout(tick,1700);                            // phrase lisible avant le 1er effacement
  }

  /* Filet de sécurité du masquage CSS : si heroText() n'a jamais tourné, on
     révèle le titre brut au bout de 2,5s — un titre avec des "#" vaut mieux
     qu'un titre absent. */
  setTimeout(function(){
    var h=document.querySelector(S+" h1.learnworlds-heading");
    if(h && !h.dataset.psTw) h.dataset.psTw="1";
  },2500);

  // --- 4) Construction des cartes ---
  function build(){
    heroText();
    document.querySelectorAll(S+" .cards-grandpa .lw-course-card").forEach(function(card){
      if(card.dataset.psC) return;
      var h=card.querySelector(".learnworlds-heading3");
      if(!h) return;
      var title=(h.textContent||"").replace(/\s+/g," ").trim();
      if(!title) return;                       // pas de titre -> on laisse la carte native
      var dEl=card.querySelector(".lw-course-card-descr, .learnworlds-main-text");
      var desc=dEl ? (dEl.textContent||"").replace(/\s+/g," ").trim() : "";
      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";

      var d=document.createElement("div");
      d.className="ps-ccab";
      var t=document.createElement("h3");
      t.className="ps-cab-title"; t.textContent=title;        // textContent : pas d'injection
      d.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-cab-desc"; p.textContent=desc; d.appendChild(p); }
      var a=document.createElement("a");
      a.className="ps-cab-link"; a.href=href; a.textContent="En savoir plus";
      d.appendChild(a);

      card.appendChild(d);
      card.dataset.psC="1";                    // déclenche le masquage du natif
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
