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
    /* On masque le natif SAUF l'illustration : LearnWorlds la pose en
       `background-image` sur un `div.learnworlds-image`, PREMIER enfant de la
       carte (pas une balise <img>) — inutile donc d'aller relire son URL, il
       suffit de la ré-autoriser et de la styler. */
    "#pageContent .lw-course-card > *:not(.ps-mcard):not(.learnworlds-image){display:none !important;}",
    ".ps-mcard{display:flex !important;flex-direction:column !important;padding:32px !important;min-height:270px !important;}",
    /* En-tête sur 2 lignes : le niveau seul dessus (c'est LE repère de la carte),
       les compteurs en dessous, plus discrets. */
    ".ps-mhead{display:flex !important;flex-direction:column !important;align-items:flex-start !important;gap:10px !important;margin-bottom:24px !important;}",
    ".ps-mtag{display:inline-flex !important;align-items:center !important;padding:7px 16px !important;border-radius:999px !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:800 !important;line-height:1 !important;letter-spacing:-.01em !important;white-space:nowrap !important;}",
    /* la rangée des compteurs, sous le niveau */
    ".ps-mmetas{display:flex !important;align-items:center !important;gap:8px !important;flex-wrap:wrap !important;}",
    /* compteurs (« 8 leçons », « 3 quiz ») : pastille neutre, pour que la
       couleur reste réservée au niveau — qui est le vrai repère de la carte */
    ".ps-mmeta{display:inline-flex !important;align-items:center !important;padding:4px 10px !important;border-radius:999px !important;background:#F1F2F6 !important;color:#676879 !important;font-family:Figtree,sans-serif !important;font-size:12px !important;font-weight:600 !important;line-height:1 !important;white-space:nowrap !important;}",
    /* Progression : reprise de la donnée native de LearnWorlds (elle est dans la
       carte, on la masquait simplement). La barre prend la couleur du niveau. */
    ".ps-mprog{height:6px !important;border-radius:999px !important;background:#EDEFF4 !important;overflow:hidden !important;margin-top:18px !important;}",
    ".ps-mprog-bar{height:100% !important;border-radius:999px !important;transition:width .4s ease !important;}",
    ".ps-mprog-txt{font-family:Figtree,sans-serif !important;font-size:12px !important;font-weight:600 !important;color:#676879 !important;margin-top:7px !important;}",
    ".ps-mtitle{font-family:Figtree,sans-serif !important;font-size:25px !important;line-height:1.25 !important;font-weight:700 !important;color:#323338 !important;margin:0 0 auto !important;}",
    ".ps-mlink{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:26px !important;color:#6161FF !important;font-family:Figtree,sans-serif !important;font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-mlink::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-mlink:hover{color:#4B4BE0 !important;}",
    ".ps-mlink:hover::after{transform:translateX(5px) !important;}",
    /* Cours terminé : "Terminé" est un ÉTAT, pas une action — la flèche qui
       pousse en avant n'a plus de sens, on met une coche. Le lien reste
       cliquable (on peut revenir sur un cours fini), mais il ne réclame plus.
       Vert (et non violet) : c'est un statut d'accomplissement. */
    ".ps-mlink.ps-done{color:#12A85F !important;}",
    ".ps-mlink.ps-done:hover{color:#009257 !important;}",
    ".ps-mlink.ps-done::after{content:\"\\2713\" !important;}",
    ".ps-mlink.ps-done:hover::after{transform:none !important;}",

    /* Couleur par NIVEAU, et non par position : les chevrons intercalés entre
       les cartes décalent nth-child et le cycle sautait (vérifié : Niveau 4
       récupérait la couleur du Niveau 1). data-ps-lvl est posé dans build(). */
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='1'] .ps-mtag{background:#EDEDFF !important;color:#4B4BE0 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='1'] .ps-mprog-bar{background:#4B4BE0 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='2'] .ps-mtag{background:#E6F9F0 !important;color:#12A85F !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='2'] .ps-mprog-bar{background:#12A85F !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='3'] .ps-mtag{background:#E1F7EC !important;color:#009257 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='3'] .ps-mprog-bar{background:#009257 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='4'] .ps-mtag{background:#FDECEF !important;color:#D22B45 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='4'] .ps-mprog-bar{background:#D22B45 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='5'] .ps-mtag{background:#FFF3E0 !important;color:#D98500 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='5'] .ps-mprog-bar{background:#D98500 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='6'] .ps-mtag{background:#F3EAFB !important;color:#8A45C9 !important;}",
    "#pageContent .lw-cols > .col.lw-course-card[data-ps-lvl='6'] .ps-mprog-bar{background:#8A45C9 !important;}",
    /* Timeline : double chevron entre les cartes, le 1er clair et le 2e foncé,
       pour donner le sens de la progression. */
    ".ps-chev{flex:none !important;width:40px !important;display:flex !important;align-items:center !important;justify-content:center !important;align-self:stretch !important;}",
    ".ps-chev svg{width:40px !important;height:40px !important;fill:none !important;stroke-width:3.6 !important;stroke-linejoin:round !important;stroke-linecap:butt !important;}",
    ".ps-chev svg .c1{stroke:#B4BAC4 !important;}",
    ".ps-chev svg .c2{stroke:#656E7E !important;}",
    /* ================= CARROUSEL (scopé au conteneur des cartes) ============ */
    /* le rail : 3 cartes visibles, défilement horizontal aimanté */
    "#pageContent .cards-grandpa{position:relative !important;}",
    /* le rail porte lui-même sa largeur/fond/police : le `display:flex` n'est posé
       QUE sur ce sélecteur scopé, jamais sur `.lw-cols.multiple-rows` nu (cf. plus haut) */
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows{display:flex !important;flex-wrap:nowrap !important;overflow-x:auto !important;scroll-snap-type:x mandatory !important;scrollbar-width:none !important;-ms-overflow-style:none !important;gap:16px !important;padding:14px 0 26px !important;max-width:1000px !important;margin:0 auto !important;background:transparent !important;border:0 !important;box-shadow:none !important;font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;}",
    "#pageContent .cards-grandpa > .lw-cols.multiple-rows::-webkit-scrollbar{display:none !important;}",
    /* 3 cartes : largeur = (100% - 2 gouttières) / 3.
       flex-direction:column : la carte est déjà en flex côté LW, il faut la
       passer en colonne pour empiler l'illustration puis le contenu. */
    "#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 calc((100% - 80px - 64px) / 3) !important;scroll-snap-align:start !important;flex-direction:column !important;}",
    /* l'illustration : bandeau haut, coins découpés par le overflow:hidden de la carte */
    "#pageContent .cards-grandpa .lw-course-card > .learnworlds-image{display:block !important;width:100% !important;height:168px !important;padding:0 !important;margin:0 !important;flex:none !important;background-size:cover !important;background-position:50% 50% !important;}",
    /* Densité réduite pour tenir sur ~317px + le corps prend la hauteur restante
       sous l'illustration (d'où les CTA alignés d'une carte à l'autre).
       min-height:0 annule le 270px de .ps-mcard : sans ça, image + corps
       gonflent la carte. Tout dans UNE règle — deux règles de même sélecteur et
       même spécificité, c'est la dernière qui gagne, piège garanti. */
    "#pageContent .cards-grandpa .ps-mcard{padding:24px !important;min-height:0 !important;flex:1 1 auto !important;}",
    "#pageContent .cards-grandpa .ps-mtitle{font-size:21px !important;}",
    "#pageContent .cards-grandpa .ps-mhead{gap:11px !important;margin-bottom:20px !important;}",
    "#pageContent .cards-grandpa .ps-mlink{margin-top:20px !important;}",
    /* Bouton « Charger plus » masqué (demande de Ziad). Les 6 niveaux tiennent
       dans le carrousel, le bouton n'a plus d'utilité. `.lw-load-more` ne
       désigne que ces boutons sur la page (vérifié : 2, un par bloc de cours,
       et rien d'autre) — on peut donc poser un `display` ici sans risque, à la
       différence de `.lw-cols.multiple-rows`.
       ⚠️ Si un jour tu ajoutes des cours au-delà du lot initial chargé par LW,
       ils deviendront inatteignables : il faudra retirer cette règle. */
    "#pageContent .lw-load-more{display:none !important;}",
    /* les flèches */
    ".ps-car-btn{position:absolute !important;top:50% !important;transform:translateY(-50%) !important;width:44px !important;height:44px !important;border-radius:50% !important;background:#fff !important;border:1px solid #E6E9EF !important;box-shadow:0 4px 14px rgba(15,23,42,.12) !important;display:flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;padding:0 !important;z-index:5 !important;transition:background .15s ease, box-shadow .15s ease, opacity .2s ease !important;}",
    ".ps-car-btn:hover{background:#F5F7FB !important;box-shadow:0 6px 18px rgba(15,23,42,.16) !important;}",
    ".ps-car-btn svg{width:20px !important;height:20px !important;stroke:#1c1f26 !important;fill:none !important;stroke-width:2.2 !important;stroke-linecap:round !important;stroke-linejoin:round !important;}",
    ".ps-car-btn[disabled]{opacity:0 !important;pointer-events:none !important;}",
    ".ps-car-prev{left:4px !important;}",
    ".ps-car-next{right:4px !important;}",
    /* responsive : 2 puis 1 carte, flèches collées aux bords */
    "@media(max-width:1100px){.ps-car-prev{left:-2px !important;} .ps-car-next{right:-2px !important;}}",
    "@media(max-width:1040px){#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 calc((100% - 40px - 48px) / 2) !important;}}",
    "@media(max-width:700px){#pageContent .cards-grandpa > .lw-cols > .col.lw-course-card{flex:0 0 86% !important;} .ps-chev{display:none !important;}}",

    /* ================= TITRES (hero premium) =============================== */
    /* Alignés à gauche SUR LES CARTES : le conteneur natif fait 1120px alors que
       le rail des cartes fait 1000px centré. Un simple text-align:left décalerait
       les titres de 60px à gauche des cartes -> on reprend la même largeur 1000px. */
    "#pageContent h1.learnworlds-heading{font-family:Figtree,sans-serif !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:#1c1f26 !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* ⚠️ LearnWorlds SERT le H1 dans le HTML, "#" compris. Le loader étant en
       <head>, notre CSS est en place avant que le titre soit peint, mais
       heroText() ne peut le transformer qu'une fois le DOM prêt (~500ms) : sans
       ça, les "#" s'affichent en clair pendant une demi-seconde.
       -> on masque le titre tant qu'il n'est pas traité. `visibility` (et non
       `display`) : la place reste réservée, donc aucun décalage à l'apparition.
       heroText() pose data-ps-tw dès qu'il voit le titre, même s'il n'y a pas de
       "#" à animer — et un filet de sécurité le révèle après 2,5s au pire. */
    "#pageContent h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
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

  /* Compteurs lus dans la DESCRIPTION du cours, format "Label : valeur", séparés
     par "#" — même convention que les cartes Cas :
         Leçons : 8 # Quiz : 3
     Pourquoi pas depuis le sommaire du cours ? Parce qu'il n'existe nulle part
     avant que le JS de LearnWorlds ne le fabrique : ni dans le HTML servi (412 Ko
     vérifiés, aucune trace des unités), ni dans un <script>, ni dans une API
     (/api/learner/products ne renvoie que access, titleId, id, cohorts,
     includedInProducts). Il faudrait charger les 6 pages de cours entières dans
     des iframes (~2,5 Mo) et lire leur DOM — inacceptable pour le temps
     d'affichage. La description est donc la source, tenue à jour à la main. */
  var META=["Leçons","Lecons","Quiz"];
  function parseMeta(desc){
    var re=new RegExp("("+META.join("|")+")\\s*:\\s*","gi"), m, ms=[];
    while((m=re.exec(desc))!==null){ ms.push({label:m[1], vs:re.lastIndex, start:m.index}); }
    var out=[];
    for(var i=0;i<ms.length;i++){
      var end=(i+1<ms.length)?ms[i+1].start:desc.length;
      var v=desc.slice(ms[i].vs,end).replace(/^[#\s]+/,"").replace(/[\s,;|#]+$/,"").trim();
      if(v) out.push({label:ms[i].label, value:v});
    }
    return out;
  }
  /* "Leçons"+"8" -> "8 leçons" ; "Leçons"+"1" -> "1 leçon" ; "Quiz" invariable */
  function metaText(label,value){
    var l=label.toLowerCase();
    if(/^le[çc]ons?$/.test(l)) l = (value==="1" ? "leçon" : "leçons");
    return value+" "+l;
  }

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
      /* compteurs éventuels ("Leçons : 8 # Quiz : 3") ; absents -> pas de pastille */
      var dEl=card.querySelector(".lw-course-card-descr");
      var metas=dEl ? parseMeta((dEl.textContent||"").replace(/\s+/g," ").trim()) : [];

      var d=document.createElement("div");
      d.className="ps-mcard";
      var head=document.createElement("div");
      head.className="ps-mhead";
      var tag=document.createElement("span");
      tag.className="ps-mtag"; tag.textContent="Niveau "+level;
      head.appendChild(tag);
      /* compteurs regroupés sur leur propre ligne, sous le niveau ; pas de
         rangée vide si le cours n'a pas encore les champs dans sa description */
      if(metas.length){
        var row=document.createElement("div");
        row.className="ps-mmetas";
        metas.forEach(function(mt){
          var s=document.createElement("span");
          s.className="ps-mmeta"; s.textContent=metaText(mt.label,mt.value);   // textContent : pas d'injection
          row.appendChild(s);
        });
        head.appendChild(row);
      }
      var t=document.createElement("h3");
      t.className="ps-mtitle"; t.textContent=name;
      d.appendChild(head); d.appendChild(t);

      /* Progression : LearnWorlds la met DÉJÀ dans la carte (on la masquait).
         On lit la largeur INLINE de sa barre plutôt que le texte "72% Complété" :
         pas de dépendance à la langue ni au format d'affichage.
         Affichée seulement si > 0 : un visiteur anonyme n'a pas de progression,
         et un apprenant qui débute n'a pas besoin de 6 barres vides. */
      var nat=card.querySelector(".lw-course-card-progress-bar");
      var pct=nat ? parseInt((nat.style.width||"").replace("%",""),10) : NaN;
      if(!isNaN(pct) && pct>0){
        var pw=document.createElement("div"); pw.className="ps-mprog";
        var pb=document.createElement("div"); pb.className="ps-mprog-bar";
        pb.style.width=Math.min(pct,100)+"%";
        pw.appendChild(pb);
        var pt=document.createElement("div");
        pt.className="ps-mprog-txt"; pt.textContent=pct+" % complété";
        d.appendChild(pw); d.appendChild(pt);
      }

      var a=document.createElement("a");
      /* Le libellé suit l'avancement. "Continuer" est le mot qu'emploie
         LearnWorlds lui-même sur sa carte native — on garde son vocabulaire.
         La distinction anonyme / inscrit-à-0% tient parce que LW ne met PAS de
         barre de progression pour un visiteur anonyme (vérifié : il affiche
         "S'inscrire gratuitement" à la place). Donc :
           pas de barre -> NaN -> "En savoir plus"  (il n'est pas inscrit)
           barre à 0%          -> "Commencer"       (inscrit, jamais ouvert) */
      a.className="ps-mlink"; a.href=href;
      var label="En savoir plus";
      if(!isNaN(pct)){
        if(pct>=100){ label="Terminé"; a.classList.add("ps-done"); }
        else if(pct>0){ label="Continuer"; }
        else { label="Commencer"; }
      }
      a.textContent=label;
      d.appendChild(a);
      card.appendChild(d);
      /* la couleur suit le NIVEAU (cf. CSS [data-ps-lvl]) : les chevrons
         intercalés décalent nth-child, qui compte tous les frères */
      card.dataset.psLvl=(((parseInt(level,10)-1)%6)+1);
      card.dataset.psM="1";
    });
    mountChevrons();
    mountCarousel();
    heroText();
  }

  /* Chevrons intercalés entre les cartes, pour lire la progression des niveaux
     comme une timeline. Insérés en JS car un ::after sur la carte serait rogné :
     elle porte `overflow:hidden` (nécessaire aux coins ronds de l'illustration).
     Idempotent : l'observer rappelle build() à chaque mutation, y compris celles
     que cette fonction provoque — d'où le contrôle du frère suivant. */
  var CHEV='<svg viewBox="0 0 24 24"><path class="c1" d="M4 6l6 6-6 6"/><path class="c2" d="M13 6l6 6-6 6"/></svg>';
  function mountChevrons(){
    var track=document.querySelector(S+" .cards-grandpa > .lw-cols.multiple-rows");
    if(!track) return;
    var cards=[].slice.call(track.querySelectorAll(".lw-course-card"));
    cards.forEach(function(c,i){
      var nxt=c.nextElementSibling;
      var deja=nxt && nxt.classList && nxt.classList.contains("ps-chev");
      if(i===cards.length-1){ if(deja) nxt.remove(); return; }   // jamais après la dernière
      if(deja) return;
      var ch=document.createElement("div");
      ch.className="ps-chev"; ch.setAttribute("aria-hidden","true");   // décoratif
      ch.innerHTML=CHEV;
      c.after(ch);
    });
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
    /* data-ps-tw posé AVANT toute autre condition : c'est lui qui lève le
       masquage CSS. Si on le posait seulement en cas de succès, un titre sans
       "#" resterait invisible pour toujours. */
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
    /* La 1re phrase est affichée EN ENTIER dès le départ, le cycle ne démarre
       qu'après la pause. Sinon le slot part vide et se remplit lettre par lettre
       (~600ms) : au chargement le titre reste incomplet, et ça se lit comme un
       retard d'affichage plutôt que comme une animation. */
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

  /* Filet de sécurité du masquage ci-dessus (.ps-hero-style) : si heroText()
     n'avait jamais tourné, le titre resterait invisible. Au pire on le révèle
     brut au bout de 2,5s — un titre avec des "#" vaut mieux qu'un titre absent. */
  setTimeout(function(){
    var h=document.querySelector(S+" h1.learnworlds-heading");
    if(h && !h.dataset.psTw) h.dataset.psTw="1";
  },2500);

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  var obs=new MutationObserver(schedule);
  function start(){ build(); obs.observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
