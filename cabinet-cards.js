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

  /* Logos hébergés sur GitHub Pages (dossier /logos), SVG TRANSPARENTS (Wikimedia
     Commons). 🔴 Depuis le 23/07 on n'utilise QUE ceux-ci (plus les images
     uploadées dans LW) : le design « logo blanc sur cercle bleu » exige un fond
     transparent, or les images LW (Advancy/Bain/Sia) ont un fond opaque.
     Clé = nom normalisé (minuscule, sans accent ni séparateur). Cabinets sans
     SVG propre (Advancy, Sia, Kéa) -> badge d'initiales. Ajouter = SVG dans
     /logos + une ligne ici. */
  var LOGO_BASE="https://extremum84.github.io/lw-course-cards/logos/";
  var LOGOS={
    accenture:"accenture.svg",
    bain:"bain.svg", baincompany:"bain.svg",
    bcg:"bcg.svg", bostonconsultinggroup:"bcg.svg",
    eyconsulting:"ey.svg",
    eyparthenon:"ey-parthenon.svg",
    mckinsey:"mckinsey.svg", mckinseycompany:"mckinsey.svg",
    wavestone:"wavestone.svg"
  };
  function normName(s){ return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]/g,""); }
  function logoFor(title){ var f=LOGOS[normName(title)]; return f ? 'url("'+LOGO_BASE+f+'")' : ""; }

  /** Initiales du cabinet (repli quand il n'y a pas de logo). */
  function initialsOf(name){
    var w=(name||"").trim().split(/\s+/).filter(Boolean);
    if(!w.length) return "?";
    return (w.length===1 ? w[0].slice(0,2) : (w[0][0]+w[1][0])).toUpperCase();
  }

  // --- 2) Styles ---
  var CSS=[
    /* grille de 3, alignée comme les autres pages (1000px centrés).
       Le natif fait 1120px ici (mesuré : 290->1410) : on reprend 1000 pour
       que les cartes tombent sur le même bord gauche que le hero. */
    /* 🔴 padding-top:96px : laisse la place aux badges qui DÉBORDENT au-dessus des
       cartes (style « carte cours » : cercle centré flottant, cf. course-cards.js). */
    GRID+"{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:24px !important;max-width:1000px !important;margin:0 auto !important;padding:96px 0 0 !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* overflow:visible pour laisser sortir le badge ; flex column pour empiler
       badge (flottant) puis contenu — comme les cartes cours. */
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;box-shadow:0 4px 18px rgba(15,23,42,.06) !important;overflow:visible !important;display:flex !important;flex-direction:column !important;isolation:isolate !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover{box-shadow:0 14px 34px rgba(0,0,0,.10) !important;transform:translateY(-3px) !important;}",
    /* le badge est un enfant DIRECT de la carte (comme l'illustration cours) -> l'exclure du masquage */
    S+" .lw-course-card[data-ps-c] > *:not(.ps-ccab):not(.ps-cab-logo){display:none !important;}",

    /* height:100% : sans ça la carte reconstruite s'arrête à son contenu au lieu
       de remplir la hauteur étirée par la grille -> le `margin-bottom:auto` de
       la description n'a rien à absorber et les CTA se désalignent entre cartes. */
    ".ps-ccab{display:flex !important;flex-direction:column !important;flex:1 1 auto !important;padding:0 26px 26px !important;text-align:left !important;}",
    /* Logo du cabinet, HARMONISÉ sur toutes les cartes (demande de Ziad le 22/07) :
       hauteur fixe + `background-size:contain` -> aucun rognage, tous à la même
       échelle visuelle quel que soit le ratio du logo ; MONOCHROME via
       `grayscale(1)` + opacité normalisée pour que des logos de teintes très
       variées (bleu Advancy, violet Accenture, rouge…) se ressemblent. Couleur
       restaurée au survol de la carte, repère de reconnaissance. Le logo natif
       est un `background-image` sur `.learnworlds-image` (masqué) : build() en
       recopie l'URL sur cette div. */
    /* CERCLE 180px CENTRÉ qui FLOTTE au-dessus de la carte (style « carte cours » :
       `margin:-90px auto 18px` = remonte de la moitié + centré ; bordure blanche
       5px + ombre, comme l'illustration ronde des cours). Fond bleu #203866, logo
       en BLANC par-dessus. 🔴 Blanchiment (`brightness(0) invert(1)`) sur un
       élément INTERNE `.ps-cab-logo-img` (sinon le fond bleu blanchit aussi). */
    ".ps-cab-logo{width:180px !important;height:180px !important;border-radius:50% !important;background-color:#203866 !important;display:flex !important;align-items:center !important;justify-content:center !important;margin:-90px auto 18px !important;border:5px solid #fff !important;box-shadow:0 6px 18px rgba(15,23,42,.12) !important;overflow:hidden !important;flex:none !important;transition:box-shadow .25s ease !important;}",
    ".ps-cab-logo-img{width:66% !important;height:66% !important;background-repeat:no-repeat !important;background-position:center !important;background-size:contain !important;filter:brightness(0) invert(1) !important;}",
    /* Repli : cabinet sans logo hébergé transparent (Advancy, Sia, Kéa) ->
       initiales BLANCHES sur le même cercle bleu, look homogène. */
    ".ps-cab-logo--ini{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:52px !important;font-weight:800 !important;color:#fff !important;letter-spacing:.5px !important;}",
    S+" .cards-grandpa > .lw-cols > .col.lw-course-card:hover .ps-cab-logo{box-shadow:0 10px 26px rgba(15,23,42,.18) !important;}",
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
    S+" h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#6161FF) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
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

      /* 🔴 Le BADGE est un enfant DIRECT de la carte (comme l'illustration ronde
         des cartes cours), pas dans .ps-ccab : c'est lui qui FLOTTE au-dessus via
         `margin-top:-90px`. On n'utilise QUE les logos hébergés transparents (une
         image uploadée dans LW a un fond opaque -> bloc blanc sous le filtre). Le
         logo va dans un élément INTERNE `.ps-cab-logo-img` (sinon le filtre
         blanchit aussi le fond bleu). Pas de logo hébergé (Advancy/Sia/Kéa) ->
         initiales blanches. */
      var badge;
      var logo = logoFor(title);
      if(logo){
        badge=document.createElement("div");
        badge.className="ps-cab-logo";
        badge.setAttribute("role","img");
        badge.setAttribute("aria-label","Logo "+title);
        var im=document.createElement("div");
        im.className="ps-cab-logo-img";
        im.style.backgroundImage=logo;
        badge.appendChild(im);
      } else {
        badge=document.createElement("div");
        badge.className="ps-cab-logo ps-cab-logo--ini";
        badge.textContent=initialsOf(title);
        badge.setAttribute("aria-hidden","true");
      }

      var d=document.createElement("div");
      d.className="ps-ccab";
      var t=document.createElement("h3");
      t.className="ps-cab-title"; t.textContent=title;        // textContent : pas d'injection
      d.appendChild(t);
      if(desc){ var p=document.createElement("p"); p.className="ps-cab-desc"; p.textContent=desc; d.appendChild(p); }
      var a=document.createElement("a");
      a.className="ps-cab-link"; a.href=href; a.textContent="En savoir plus";
      d.appendChild(a);

      card.appendChild(badge);                 // badge flottant, au-dessus
      card.appendChild(d);                     // puis le contenu
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
