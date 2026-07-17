/* ============================================================
   Cartes "Programme" (lw-learning-program-card) — page /page-introduction
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /page-introduction
   (Réglages de la PAGE — jamais dans un élément « HTML », les <script> y sont
   inertes) :
     <script src="https://extremum84.github.io/lw-course-cards/program-cards.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr : jsDelivr est abandonné depuis le 16/07, il
   servait `@main` figé 12h en arrière (deux régressions en prod le même jour) et
   rien ne force sa résolution branche -> commit. Déploiement = `git push`, point.

   Choix de Ziad le 17/07 : « faire cette page comme les autres » = la coquille
   commune sur les cartes enfants + l'en-tête de programme à la charte.
   On ne reprend PAS le rond qui dépasse / les pastilles de niveau / les chevrons
   de `course-cards.js` : il n'y a pas de notion de niveau ici et les titres
   suivent « 1.3 - … », pas « Niveau #N - … ».

   Ce que fait ce script :
   - panneau du programme : #F7F8FB, bord #E6E9EF, radius 16 ;
   - en-tête : titre + description en Figtree, et surtout la DÉBRANDISATION
     LearnWorlds -> bouton vert #009E78 et barre bleu marine #203866 et pastille
     bleue #3887B4 passent tous au violet #6161FF de la charte ;
   - cartes enfants (.lw-course-card-item) : coquille commune (blanc, bord
     #E6E9EF, radius 16, survol qui soulève), comme `sector-cards.js`.

   ⚠️ NE PAS charger `course-cards.js` sur cette page. Ses règles
   `#pageContent .cards-grandpa > .lw-cols.multiple-rows{...}` ne réclament
   aucune carte de cours, or cette page a bien un `.cards-grandpa > .lw-cols
   .multiple-rows` : la grille des programmes serait transformée en carrousel
   horizontal avec 90px de réserve en haut. Les cartes enfants, elles, sont des
   `.lw-course-card-item` (et non `.lw-course-card`) : celles-là seraient
   épargnées.

   🔴 POURQUOI CE SCRIPT A DU JS ALORS QU'IL NE FAIT QUE DU STYLE :
   les cartes enfants vivent dans un swiper natif DÉJÀ INITIALISÉ, qui a figé la
   largeur de ses slides au chargement. Nos styles changent la largeur utile du
   conteneur (la bordure du panneau retire 2px, le padding le reste) -> les
   slides gardent leur ancienne largeur et LA DERNIÈRE CARTE EST COUPÉE.
   Constaté à l'écran : conteneur 1072 -> 1062px, 4e carte coupée de 10px.
   D'où le `swiper.update()` ci-dessous. Toute retouche future des dimensions
   horizontales de cette page retombera dans le même piège.
   ============================================================ */
(function(){
  "use strict";

  var S="#pageContent";
  var PROG=S+" .lw-learning-program-card";

  var CSS=[
    /* ================= HERO — porté de cabinet-cards.js ==================
       ⚠️ PORTÉ SANS son `max-width:1000px; margin:auto`. Sur les autres pages
       ce calage aligne le hero sur une grille de 1000px ; ICI le H1 est DÉJÀ
       aligné sur les panneaux (mesuré : 290 -> 1410 des deux côtés, la page
       fait 1120px). Le recopier décalerait le titre. Ne pas le réintroduire.
       Pas de `padding-right:38%` sur la description non plus : sur la page
       Cours il réserve la place de la tuile de progression, qui n'existe pas ici. */
    S+" h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;}",
    /* LW sert le H1 avec ses "#" en clair : on le masque tant que heroText() ne
       l'a pas transformé, sinon les "#" clignotent une demi-seconde.
       `visibility` et non `display` : la place reste réservée, pas de saut.
       Filet de sécurité à 2,5s plus bas — sinon un titre sans "#" resterait
       invisible pour toujours. */
    S+" h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    S+" h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;}",
    S+" .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;}",
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#6161FF) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#6161FF) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",
    "@media(max-width:820px){"+S+" h1.learnworlds-heading{font-size:36px !important;}"+S+" h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}}",

    /* ---- panneau du programme ---------------------------------------- */
    PROG+"{background:var(--ps-surface-soft,#F7F8FB) !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;padding:28px 24px !important;}",

    /* ---- en-tête ------------------------------------------------------ */
    PROG+" h3{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:26px !important;font-weight:800 !important;color:var(--ps-text,#1c1f26) !important;line-height:1.2 !important;}",
    PROG+" .lw-learning-program-card-descr{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;line-height:1.6 !important;color:var(--ps-text-soft,#676879) !important;}",

    /* Pastille « N Leçons » : bleu natif #3887B4 -> violet teinté. */
    PROG+" .lw-tag{background:var(--ps-accent-tint,#EDEDFF) !important;color:var(--ps-accent,#6161FF) !important;border-radius:var(--ps-r-pill,999px) !important;padding:5px 11px !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:12px !important;font-weight:700 !important;}",

    /* Bouton « Continuer » : vert LearnWorlds #009E78 -> violet de la charte. */
    PROG+" button.learnworlds-button{background:var(--ps-accent,#6161FF) !important;color:#fff !important;border-radius:var(--ps-r-btn,10px) !important;border:0 !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-weight:700 !important;transition:background .18s ease !important;}",
    PROG+" button.learnworlds-button:hover{background:var(--ps-accent-hover,#4B4BE0) !important;}",

    /* Progression : remplissage bleu marine #203866 -> violet. */
    PROG+" .lw-course-card-progress{background:#EDEDF2 !important;border-radius:var(--ps-r-pill,999px) !important;overflow:hidden !important;}",
    PROG+" .lw-course-card-progress-bar{background:var(--ps-accent,#6161FF) !important;border-radius:var(--ps-r-pill,999px) !important;}",
    PROG+" .learnworlds-overline-text{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;color:var(--ps-text-soft,#676879) !important;font-weight:600 !important;}",

    /* ---- cartes enfants : la coquille commune ------------------------- */
    /* Photo RETIRÉE (choix de Ziad le 17/07) : la carte ne porte plus que son
       titre, comme `cabinet-cards.js`. Vérifié avant de masquer : le lien de la
       photo et celui du titre pointent sur le même cours — on ne perd aucun
       accès. La photo reste dans le DOM en `background-image` si on veut la
       réintroduire un jour ; ne pas la supprimer côté LearnWorlds.
       On masque le CONTENEUR et pas `.learnworlds-image` : ça emporte aussi le
       lien qui l'enveloppe, sinon on garderait une zone cliquable vide. */
    S+" .lw-course-card-item .product-image-container{display:none !important;}",
    /* `overflow:hidden` est conservé bien que la photo ait disparu : il garde
       tout futur contenu à l'intérieur du radius. */
    S+" .lw-course-card-item{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;overflow:hidden !important;box-shadow:none !important;transition:transform .18s ease, box-shadow .18s ease !important;}",
    S+" .lw-course-card-item:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    S+" .lw-course-card-item h4{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;font-weight:700 !important;color:var(--ps-text,#1c1f26) !important;line-height:1.3 !important;}",

    /* Le swiper est en `overflow:hidden` : sans cette réserve verticale, le
       `translateY(-3px)` du survol et l'ombre seraient rognés. Réserve VERTICALE
       uniquement — toucher au padding horizontal décalerait les slides. */
    S+" .product-child-cards-swiper .swiper-container{padding-top:6px !important;padding-bottom:16px !important;}",

    "@media(prefers-reduced-motion:reduce){"+S+" .lw-course-card-item{transition:none !important;}}"
  ].join("\n");

  function styles(){
    var st=document.getElementById("ps-prog-style");
    if(!st){ st=document.createElement("style"); st.id="ps-prog-style"; document.head.appendChild(st); }
    if(st.textContent!==CSS) st.textContent=CSS;
  }

  /* Recale les swipers après nos styles (cf. l'avertissement en tête).
     `update()` est idempotent : l'appeler à chaque passage ne coûte qu'un
     recalcul et rattrape aussi les swipers réinitialisés par LearnWorlds.
     ⚠️ Un swiper qui déborde n'est PAS forcément cassé : quand il a plus de
     cartes que la rangée n'en montre (5 ici sur un programme), les suivantes
     attendent hors champ — c'est le principe. Ne pas « corriger » ça. */
  function recalerSwipers(){
    document.querySelectorAll(".product-child-cards-swiper .swiper-container").forEach(function(c){
      if(c.swiper && typeof c.swiper.update==="function"){
        try{ c.swiper.update(); }catch(e){}
      }
    });
  }

  /* Hero : machine à écrire sur les segments marqués "#" — porté de
     cabinet-cards.js. « Nos formations pour #le conseil #la stratégie #test »
     -> préfixe « Nos formations pour » + phrases qui se tapent / s'effacent. */
  function heroText(){
    /* `.learnworlds-main-text` désigne AUSSI la description de chaque programme
       et le pied de page. On ne marque que celles du hero :
       - dans `.cards-grandpa` -> description de programme, on laisse ;
       - après `.cards-grandpa` dans le document -> pied de page, on laisse. */
    var grandpa=document.querySelector(S+" .cards-grandpa");
    if(grandpa){
      document.querySelectorAll(S+" .learnworlds-main-text").forEach(function(el){
        if(el.closest(".cards-grandpa")) return;
        if(!(grandpa.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING)) return;
        el.classList.add("ps-desc");
      });
    }

    var h1=document.querySelector(S+" h1.learnworlds-heading");
    if(!h1 || h1.dataset.psTw) return;
    /* data-ps-tw posé AVANT toute autre condition : c'est lui qui lève le
       masquage CSS. Posé seulement en cas de succès, un titre sans "#" resterait
       invisible pour toujours. */
    h1.dataset.psTw="1";
    var raw=(h1.textContent||"").replace(/\s+/g," ").trim();
    var i=raw.indexOf("#");
    if(i<0) return;                                   // pas de # -> titre natif, rien à animer
    var prefix=raw.slice(0,i).trim();
    var parts=raw.slice(i).split("#").map(function(s){ return s.trim(); }).filter(Boolean);
    if(!parts.length) return;
    /* le texte animé est masqué aux lecteurs d'écran : on rend la phrase entière */
    h1.setAttribute("aria-label", prefix+" "+parts.join(", "));

    var pre=document.createElement("span");
    pre.textContent=prefix+" ";                       // textContent : pas d'injection HTML
    var slot=document.createElement("span");
    slot.className="ps-tw"; slot.setAttribute("aria-hidden","true");
    var txt=document.createElement("span"); txt.className="ps-tw-txt";
    var cur=document.createElement("span"); cur.className="ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent=""; h1.appendChild(pre); h1.appendChild(slot);

    /* largeur réservée = la phrase la plus longue, mesurée police chargée,
       sinon le titre tremble à chaque lettre */
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
     révèle le titre brut au bout de 2,5s — un titre avec ses "#" vaut mieux
     qu'un titre absent. */
  setTimeout(function(){
    var h=document.querySelector(S+" h1.learnworlds-heading");
    if(h && !h.dataset.psTw) h.dataset.psTw="1";
  },2500);

  function build(){ styles(); heroText(); recalerSwipers(); }

  var t;
  function schedule(){ clearTimeout(t); t=setTimeout(build,120); }

  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
})();
