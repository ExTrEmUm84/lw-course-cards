/* ============================================================
   Page "Mon profil" (/profile) — refonte au style du site
   ------------------------------------------------------------
   À charger dans le Code personnalisé de la PAGE /profile :
     <script src="https://extremum84.github.io/lw-course-cards/profile-page.js"></script>

   Contrairement à /account, /profile EST une page du Site Builder
   (elle a un `#pageContent` et 7 `learnworlds-section`) : elle a donc son
   propre champ "Code personnalisé". Le garde `body.slug-profile` reste
   posé par sécurité.

   La page empile 4 chantiers, traités ici dans un seul fichier :
     1. en-tête   : avatar + nom + bouton "Edit profile"
     2. RÉSUMÉ    : le H1 + 4 tuiles de stats sur bandeau bleu
     3. VUE GÉNÉRALE      : 3 cartes `.lw-course-card` "Niveau #N - Nom"
     4. VUE PAR THÉMATIQUE : cartes `.lw-learning-program-card1`

   ⚠️ NE PAS charger `course-cards.js` ici : il embarque le carrousel, les
   doubles chevrons et le hero — son CSS restylerait le H1 "RÉSUMÉ" en 56px
   et transformerait la grille en rail défilant. Le rendu des cartes est
   donc REFAIT ici, repris de course-cards.js mais réduit au nécessaire.

   ⚠️ La page a 4 `.cards-grandpa` (tuiles du RÉSUMÉ, cours, thématiques…).
   Tout est scopé par section, jamais sur `.cards-grandpa` nu.

   ⚠️ Largeur : les sections font 1120px en natif (290->1410) et non 1000
   comme les pages Cours/Cas. On garde 1120 — la page est cohérente avec
   elle-même, et forcer 1000 déplacerait tuiles et cartes sans bénéfice.
   ============================================================ */
(function(){
  "use strict";

  function surLaPage(){ return document.body && /(^|\s)slug-profile(\s|$)/.test(document.body.className); }
  if(!surLaPage()) return;

  if(!document.getElementById("ps-figtree")){
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head||document.documentElement).appendChild(f);
  }

  var S="#pageContent";
  var FT="font-family:Figtree,-apple-system,Segoe UI,Roboto,sans-serif !important;";

  var CSS=[
    /* ============ 1) EN-TÊTE : avatar + nom + bouton ============ */
    S+" img.user-image{border-radius:50% !important;border:3px solid #fff !important;box-shadow:0 6px 20px rgba(15,23,42,.10) !important;}",
    /* le bouton "Edit profile" prend le CTA violet du site */
    S+" .ps-pf-head button.learnworlds-button,"+S+" button.learnworlds-button.ps-pf-edit{background:#6161FF !important;border:0 !important;border-radius:999px !important;padding:11px 22px !important;color:#fff !important;"+FT+"font-size:15px !important;font-weight:600 !important;box-shadow:none !important;cursor:pointer !important;transition:background .18s ease !important;}",
    S+" button.learnworlds-button.ps-pf-edit:hover{background:#4B4BE0 !important;}",

    /* ============ 2) RÉSUMÉ : titre + tuiles ============ */
    /* le H1 est sur le bandeau bleu -> il reste blanc, on ne touche qu'à la typo */
    S+" h1.learnworlds-heading{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;}",
    /* Les tuiles : `.lw-body-bg` est la boîte blanche de chaque tuile.
       Scopé sous .ps-pf-tiles (posé en JS sur le grandpa du RÉSUMÉ) : la page
       compte 4 `.cards-grandpa`, et `.lw-body-bg` existe AUSSI dans les cartes
       thématiques — une règle nue les toucherait toutes. */
    S+" .ps-pf-tiles .lw-body-bg{background:#fff !important;border:1px solid rgba(255,255,255,.5) !important;border-radius:16px !important;box-shadow:0 4px 14px rgba(15,23,42,.06) !important;padding:18px 20px !important;transition:transform .2s ease, box-shadow .2s ease !important;}",
    S+" .ps-pf-tiles .lw-body-bg:hover{transform:translateY(-2px) !important;box-shadow:0 10px 26px rgba(15,23,42,.10) !important;}",
    S+" .ps-pf-tiles .lw-body-bg *{"+FT+"}",

    /* ============ 3) titres de section ============ */
    /* On garde LEURS couleurs (rouge / vert / bleu) : c'est un choix éditorial
       de Ziad, pas un défaut. On n'unifie que la typo et la graisse. */
    S+" h2.learnworlds-subheading,"+S+" .ps-pf-h2{"+FT+"font-weight:800 !important;letter-spacing:-.02em !important;}",

    /* ============ 4) CARTES COURS (VUE GÉNÉRALE) ============ */
    /* Repris de course-cards.js, SANS carrousel ni chevrons.
       Scopé sous `.ps-pf-courses` (posé en JS) : la page a 4 grandpas. */
    S+" .ps-pf-courses > .lw-cols.multiple-rows{display:grid !important;grid-template-columns:repeat(3,1fr) !important;gap:24px !important;background:transparent !important;border:0 !important;box-shadow:none !important;"+FT+"}",
    S+" .ps-pf-courses > .lw-cols > .col.lw-course-card{width:auto !important;max-width:none !important;flex:none !important;margin:0 !important;padding:0 !important;background:#fff !important;border:1px solid #E6E9EF !important;border-radius:16px !important;box-shadow:none !important;overflow:hidden !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .ps-pf-courses > .lw-cols > .col.lw-course-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    /* 🔴 masquage conditionné à [data-ps-pf] : une carte non reconstruite doit
       rester intacte. La liste des :not() doit inclure TOUT ce qu'on ajoute en
       enfant direct — l'illustration native comprise (elle a déjà été « mangée »
       deux fois sur course-cards.js). */
    S+" .lw-course-card[data-ps-pf] > *:not(.ps-pfc):not(.learnworlds-image){display:none !important;}",
    /* l'illustration native est un background-image sur le 1er enfant */
    S+" .ps-pf-courses .lw-course-card > .learnworlds-image{position:static !important;}",
    S+" .ps-pf-courses .lw-course-card a.lw-course-card--stretched-link{z-index:3 !important;}",

    ".ps-pfc{display:flex !important;flex-direction:column !important;padding:24px !important;}",
    ".ps-pfc-head{display:flex !important;flex-direction:column !important;align-items:flex-start !important;gap:10px !important;margin-bottom:16px !important;}",
    ".ps-pfc-tag{display:inline-flex !important;align-items:center !important;padding:5px 13px !important;border-radius:999px !important;"+FT+"font-size:14px !important;font-weight:800 !important;line-height:1.2 !important;background:#EDEDFF !important;color:#4B4BE0 !important;}",
    /* 🔴 couleur par NIVEAU (data-ps-lvl), JAMAIS par nth-child : sur la page
       Cours, les chevrons intercalés décalaient les positions et le cycle
       sautait. Même principe ici par cohérence. */
    ".ps-pfc-tag[data-ps-lvl='1']{background:#EDEDFF !important;color:#4B4BE0 !important;}",
    ".ps-pfc-tag[data-ps-lvl='2']{background:#E3F8EE !important;color:#00A063 !important;}",
    ".ps-pfc-tag[data-ps-lvl='3']{background:#FFF3E0 !important;color:#C77700 !important;}",
    ".ps-pfc-tag[data-ps-lvl='4']{background:#FDECEF !important;color:#D22B45 !important;}",
    ".ps-pfc-tag[data-ps-lvl='5']{background:#F3EAFB !important;color:#8A45C9 !important;}",
    ".ps-pfc-tag[data-ps-lvl='6']{background:#E6F1FD !important;color:#0073EA !important;}",
    ".ps-pfc-metas{display:flex !important;flex-wrap:wrap !important;gap:7px !important;}",
    ".ps-pfc-meta{display:inline-flex !important;align-items:center !important;padding:4px 11px !important;border-radius:999px !important;"+FT+"font-size:12px !important;font-weight:600 !important;background:#EEF1F6 !important;color:#4B5563 !important;}",
    ".ps-pfc-title{"+FT+"font-size:20px !important;font-weight:800 !important;line-height:1.25 !important;letter-spacing:-.015em !important;color:#243B6B !important;margin:0 0 auto !important;}",
    ".ps-pfc-prog{height:7px !important;border-radius:999px !important;background:#EEF1F6 !important;overflow:hidden !important;margin-top:18px !important;}",
    ".ps-pfc-prog-bar{height:100% !important;border-radius:999px !important;background:#6161FF !important;}",
    ".ps-pfc-prog-txt{"+FT+"font-size:13px !important;font-weight:600 !important;color:#676879 !important;margin-top:7px !important;}",
    ".ps-pfc-link{display:inline-flex !important;align-items:center !important;gap:8px !important;align-self:flex-start !important;margin-top:14px !important;color:#6161FF !important;"+FT+"font-size:15px !important;font-weight:600 !important;text-decoration:none !important;transition:color .18s ease !important;}",
    ".ps-pfc-link::after{content:\"\\2192\" !important;font-size:17px !important;font-weight:700 !important;line-height:1 !important;transition:transform .18s ease !important;}",
    ".ps-pfc-link:hover{color:#4B4BE0 !important;}",
    ".ps-pfc-link:hover::after{transform:translateX(5px) !important;}",
    ".ps-pfc-link.ps-done{color:#00A063 !important;}",
    ".ps-pfc-link.ps-done::after{content:\"\\2713\" !important;}",

    /* ============ 5) CARTES THÉMATIQUES (Learning Program) ============ */
    /* Type `.lw-learning-program-card1` — jamais rencontré sur les autres
       pages du site. Restylé en CSS seulement : on ne reconstruit pas, LW y
       gère l'image, le badge "N Leçons" et la progression. */
    S+" .lw-learning-program-card{border-radius:16px !important;overflow:hidden !important;box-shadow:none !important;transition:box-shadow .2s ease, transform .2s ease !important;}",
    S+" .lw-learning-program-card:hover{box-shadow:0 12px 30px rgba(0,0,0,.08) !important;transform:translateY(-3px) !important;}",
    S+" .lw-learning-program-card-cnt{border:1px solid #E6E9EF !important;border-radius:16px !important;overflow:hidden !important;background:#fff !important;}",
    S+" .lw-learning-program-card .learnworlds-heading3{"+FT+"font-size:20px !important;font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",
    S+" .lw-learning-program-card-descr{"+FT+"font-size:14px !important;line-height:1.6 !important;color:#676879 !important;}",
    /* le bouton bleu natif -> CTA violet du site */
    S+" .lw-learning-program-card button.learnworlds-button,"+S+" .lw-learning-program-card a.learnworlds-button{background:#6161FF !important;border:0 !important;border-radius:999px !important;"+FT+"font-size:15px !important;font-weight:600 !important;color:#fff !important;box-shadow:none !important;transition:background .18s ease !important;}",
    S+" .lw-learning-program-card button.learnworlds-button:hover,"+S+" .lw-learning-program-card a.learnworlds-button:hover{background:#4B4BE0 !important;}",

    /* ============ 6) barres de filtres ============ */
    /* Ces filtres sont des STATUTS (En cours / Terminé / …), pas des
       catégories : `filters.js` n'a rien à faire ici. On ne reprend que le
       style des pastilles.
       ⚠️ Jamais de `display` sur ces sélecteurs : LW masque les filtres
       désactivés par un `display:none` INLINE qu'un `!important` écraserait. */
    S+" .learnworlds-button.filter.text-only{display:inline-flex !important;align-items:center !important;height:40px !important;padding:0 16px !important;margin-right:8px !important;border-radius:999px !important;border:1.5px solid #E6E9EF !important;background:#fff !important;color:#4B5563 !important;"+FT+"font-size:14px !important;font-weight:600 !important;cursor:pointer !important;transition:all .15s ease !important;}",
    S+" .learnworlds-button.filter.text-only:hover{border-color:#6161FF !important;color:#6161FF !important;background:#F3F1FF !important;}",
    S+" .-search-box{display:inline-flex !important;align-items:center !important;border:1.5px solid #E6E9EF !important;border-radius:12px !important;background:#fff !important;overflow:hidden !important;height:44px !important;}",
    S+" .-search-box input{border:0 !important;box-shadow:none !important;"+FT+"font-size:15px !important;background:transparent !important;}",
    S+" .-search-box button{border:0 !important;box-shadow:none !important;background:transparent !important;}",

    "@media(max-width:1040px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr 1fr !important;}}",
    "@media(max-width:700px){"+S+" .ps-pf-courses > .lw-cols.multiple-rows{grid-template-columns:1fr !important;}}"
  ].join("\n");

  var st=document.getElementById("ps-profile-style");
  if(!st){ st=document.createElement("style"); st.id="ps-profile-style"; (document.head||document.documentElement).appendChild(st); }
  st.textContent=CSS;

  /* ---- compteurs "Leçons : 8 # Quiz : 3", repris de course-cards.js ---- */
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
  function metaText(label,value){
    var l=label.toLowerCase();
    if(/^le[çc]ons?$/.test(l)) l = (value==="1" ? "leçon" : "leçons");
    return value+" "+l;
  }

  /* Repère les grandpas par leur CONTENU, pas par leur position : la page en a
     4 et leur ordre pourrait changer si Ziad réorganise les sections. */
  function marquer(){
    document.querySelectorAll(S+" .cards-grandpa").forEach(function(gp){
      if(gp.querySelector(".lw-course-card")) gp.classList.add("ps-pf-courses");
      else if(!gp.querySelector(".lw-learning-program-card") && /Le[çc]ons|Heures|Publications/.test(gp.textContent||"")) gp.classList.add("ps-pf-tiles");
    });
    /* le bouton "Edit profile" : marqué en JS, aucun sélecteur natif ne le
       distingue des autres `.learnworlds-button` de la page. */
    var sec=document.querySelector(S+" img.user-image");
    sec=sec && sec.closest("section.learnworlds-section");
    if(sec) sec.querySelectorAll("button.learnworlds-button").forEach(function(b){ b.classList.add("ps-pf-edit"); });
  }

  function build(){
    marquer();
    document.querySelectorAll(S+" .ps-pf-courses .lw-course-card").forEach(function(card){
      if(card.dataset.psPf) return;
      var h=card.querySelector(".learnworlds-heading3"); if(!h) return;
      var level, name;
      var badge=h.querySelector(".course-level-badge"), ct=h.querySelector(".course-title");
      if(badge && ct){ level=((badge.textContent.match(/(\d+)/)||[])[1]); name=ct.textContent.trim(); }
      else { var m=h.textContent.trim().match(/^Niveau\s*#?\s*(\d+)\s*-\s*(.+)$/i); if(m){ level=m[1]; name=m[2]; } }
      if(!level || !name) return;                 // format inattendu -> carte native intacte

      var link=card.querySelector("a.card-link[href], a[href]");
      var href=link ? link.getAttribute("href") : "#";
      var dEl=card.querySelector(".lw-course-card-descr");
      var metas=dEl ? parseMeta((dEl.textContent||"").replace(/\s+/g," ").trim()) : [];

      var d=document.createElement("div");
      d.className="ps-pfc";
      var head=document.createElement("div"); head.className="ps-pfc-head";
      var tag=document.createElement("span");
      tag.className="ps-pfc-tag"; tag.setAttribute("data-ps-lvl",level); tag.textContent="Niveau "+level;
      head.appendChild(tag);
      if(metas.length){
        var row=document.createElement("div"); row.className="ps-pfc-metas";
        metas.forEach(function(mt){
          var s=document.createElement("span");
          s.className="ps-pfc-meta"; s.textContent=metaText(mt.label,mt.value);
          row.appendChild(s);
        });
        head.appendChild(row);
      }
      var t=document.createElement("h3");
      t.className="ps-pfc-title"; t.textContent=name;     // textContent : pas d'injection
      d.appendChild(head); d.appendChild(t);

      /* Progression : on lit la largeur INLINE de la barre native, pas le texte
         "72% Complété" (dépendant de la langue). Affichée seulement si > 0. */
      var nat=card.querySelector(".lw-course-card-progress-bar");
      var pct=nat ? parseInt((nat.style.width||"").replace("%",""),10) : NaN;
      if(!isNaN(pct) && pct>0){
        var pw=document.createElement("div"); pw.className="ps-pfc-prog";
        var pb=document.createElement("div"); pb.className="ps-pfc-prog-bar";
        pb.style.width=Math.min(pct,100)+"%";
        pw.appendChild(pb);
        var pt=document.createElement("div");
        pt.className="ps-pfc-prog-txt"; pt.textContent=pct+" % complété";
        d.appendChild(pw); d.appendChild(pt);
      }

      var a=document.createElement("a");
      a.className="ps-pfc-link"; a.href=href;
      var label="En savoir plus";
      if(!isNaN(pct)){
        if(pct>=100){ label="Terminé"; a.classList.add("ps-done"); }
        else if(pct>0){ label="Continuer"; }
        else { label="Commencer"; }
      }
      a.textContent=label;
      d.appendChild(a);

      card.appendChild(d);
      card.dataset.psPf="1";                      // déclenche le masquage du natif
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
