/* ============================================================
   footer.js — Refonte du footer natif LearnWorlds en footer CLAIR moderne
   ------------------------------------------------------------
   À charger SITE-WIDE (Réglages du SITE → Code personnalisé → pied de page),
   PAS par page (le footer est le même partout) :
     <script src="https://extremum84.github.io/lw-course-cards/footer.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr (abandonné le 16/07). Déploiement = git push.

   Le footer natif (section .lw-footer.footer5) est un bloc MARINE plein
   (#203865) qui ne contient qu'un logo + 3 icônes sociales : d'où une
   transition « clair -> marine » très marquée et un contenu pauvre.
   Ce script le RECONSTRUIT en footer clair, multi-colonnes (marque, menus,
   légal, réseaux) + barre de copyright. Le contenu natif est masqué, jamais
   supprimé (réversible : retirer le <script> restaure le footer d'origine).

   Réappliqué via MutationObserver : LearnWorlds recompose parfois la section.
   ============================================================ */
(function(){
  "use strict";

  var LOGO="https://lwfiles.mycourse.app/69b2ecbe6983ee7051b4f960-public/0d0f4e0215a7a098f74d6133d5f524b7.png";
  var TAGLINE="La méthode complète pour réussir vos entretiens en conseil en stratégie.";

  /* Colonnes de liens. Un href égal à "signin"/"signup" = déclenche la modale
     native LearnWorlds (pas de page /signin, c'est un formulaire). "#" = lien
     légal provisoire (les pages CGV / Mentions / Confidentialité n'existent pas
     encore -> à câbler quand elles seront créées). */
  var COLS=[
    { title:"Formation", links:[
      ["Cours","/course/"],
      ["Études de cas","/emptykk-clone-clone"],
      ["Secteurs","/fiches-secteur"],
      ["Cabinets","/fiches-secteur-clone"],
      ["S'entraîner","/sentrainer"]
    ]},
    { title:"Le site", links:[
      ["Accueil","/home"],
      ["À propos","/about"],
      ["Connexion","signin"],
      ["Inscription","signup"]
    ]},
    { title:"Légal", links:[
      ["CGV","#"],
      ["Mentions légales","#"],
      ["Confidentialité","#"]
    ]}
  ];

  /* Réseaux. Instagram + LinkedIn = vrais comptes PrepaStrat.
     🔴 Facebook = URL générique héritée du footer natif (facebook.com/?_rdr,
     PAS la page PrepaStrat). À remplacer par la vraie URL quand tu l'as. */
  var SOCIAL=[
    ["instagram","https://www.instagram.com/prepastrat/","Instagram"],
    ["linkedin","https://www.linkedin.com/school/prepastrat/","LinkedIn"],
    ["facebook","https://www.facebook.com/?_rdr","Facebook"]
  ];
  var ICON={
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.55l.38-2.97H13.5V8.13c0-.86.24-1.45 1.47-1.45h1.57V4.02A21 21 0 0 0 14.25 3.9c-2.27 0-3.82 1.39-3.82 3.93v2.2H7.86V13h2.57v8h3.07z"/></svg>',
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.6" y="3.6" width="16.8" height="16.8" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none"/></svg>',
    linkedin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 5.01A1.94 1.94 0 1 1 3.06 5a1.94 1.94 0 0 1 3.88 0zM3.4 8.53h3.1V21H3.4V8.53zM9.2 8.53h2.97v1.7h.04c.42-.78 1.43-1.6 2.94-1.6 3.14 0 3.72 2.06 3.72 4.75V21h-3.1v-5.42c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.86V21H9.2V8.53z"/></svg>'
  };

  var STYLE=[
    /* La section : de MARINE plein -> CLAIR. border-top fin = séparation douce
       (transition « moins marquée » demandée). On neutralise l'overlay natif. */
    ".lw-footer.footer5{background:#F2F5F9 !important;background-image:none !important;border-top:1px solid #E4E8EF !important;color:#5A6478 !important;padding:0 !important;}",
    ".lw-footer.footer5 .learnworlds-section-overlay{background:transparent !important;opacity:0 !important;}",
    /* on masque le contenu natif (logo + icônes) : notre bloc le remplace */
    ".lw-footer.footer5 .learnworlds-section-content{display:none !important;}",
    ".lw-footer.footer5 .ps-footer{display:block !important;}",

    ".ps-footer{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;max-width:1180px !important;margin:0 auto !important;padding:56px 24px 0 !important;box-sizing:border-box !important;text-align:left !important;}",
    ".ps-footer *{box-sizing:border-box !important;}",
    /* grille : marque (large) + 3 colonnes de liens */
    ".ps-footer-top{display:grid !important;grid-template-columns:1.6fr 1fr 1fr 1fr !important;gap:40px !important;align-items:start !important;}",

    /* --- colonne marque --- */
    ".ps-footer-brand{max-width:300px !important;}",
    ".ps-footer-logo{height:34px !important;width:auto !important;display:block !important;margin:0 0 18px !important;}",
    ".ps-footer-tag{font-size:14px !important;line-height:1.6 !important;color:#6B7280 !important;margin:0 0 20px !important;}",
    ".ps-footer-social{display:flex !important;gap:10px !important;}",
    ".ps-footer-social a{display:inline-flex !important;align-items:center !important;justify-content:center !important;width:38px !important;height:38px !important;border-radius:10px !important;background:#E7ECF3 !important;color:#243B6B !important;text-decoration:none !important;transition:background .15s ease, color .15s ease, transform .15s ease !important;}",
    ".ps-footer-social a:hover{background:#243B6B !important;color:#fff !important;transform:translateY(-2px) !important;}",
    ".ps-footer-social svg{width:19px !important;height:19px !important;}",

    /* --- colonnes de liens --- */
    ".ps-footer-col-title{font-size:13px !important;font-weight:700 !important;letter-spacing:.04em !important;text-transform:uppercase !important;color:#243B6B !important;margin:2px 0 16px !important;}",
    ".ps-footer-col a{display:block !important;font-size:15px !important;font-weight:500 !important;line-height:1.3 !important;color:#5A6478 !important;text-decoration:none !important;padding:7px 0 !important;transition:color .15s ease, padding-left .15s ease !important;}",
    ".ps-footer-col a:hover{color:#2A6FB0 !important;padding-left:4px !important;}",

    /* --- barre de bas de page --- */
    ".ps-footer-bottom{margin-top:44px !important;border-top:1px solid #E4E8EF !important;padding:20px 0 24px !important;display:flex !important;flex-wrap:wrap !important;gap:8px 18px !important;align-items:center !important;justify-content:space-between !important;}",
    ".ps-footer-copy{font-size:13px !important;color:#8A93A5 !important;margin:0 !important;}",
    ".ps-footer-madein{font-size:13px !important;color:#A2AAB8 !important;margin:0 !important;}",

    /* --- responsive --- */
    "@media(max-width:860px){.ps-footer-top{grid-template-columns:1fr 1fr !important;gap:32px !important;}.ps-footer-brand{grid-column:1 / -1 !important;max-width:none !important;}}",
    "@media(max-width:520px){.ps-footer-top{grid-template-columns:1fr !important;}.ps-footer{padding-top:40px !important;}.ps-footer-bottom{justify-content:flex-start !important;}}"
  ].join("\n");

  function ensureStyle(){
    var st=document.getElementById("ps-footer-style");
    if(!st){ st=document.createElement("style"); st.id="ps-footer-style"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==STYLE) st.textContent=STYLE;
  }

  /* Déclenche la modale native de connexion / inscription en cliquant le
     contrôle d'en-tête (data-interactive-link-type="openformslink"). */
  function openForm(kind){
    var t=document.querySelector('a[data-interactive-link-type="openformslink"][data-interactive-link-var1="'+kind+'"]');
    if(t){ t.click(); return true; }
    return false;
  }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  function colHTML(col){
    var lis=col.links.map(function(l){
      var label=esc(l[0]), href=l[1];
      if(href==="signin"||href==="signup") return '<a href="#" data-ps-form="'+href+'">'+label+'</a>';
      return '<a href="'+esc(href)+'">'+label+'</a>';
    }).join("");
    return '<div class="ps-footer-col"><div class="ps-footer-col-title">'+esc(col.title)+'</div>'+lis+'</div>';
  }

  function build(){
    ensureStyle();
    var sec=document.querySelector(".lw-footer.footer5") || document.querySelector(".lw-footer");
    if(!sec) return;
    if(sec.querySelector(".ps-footer")) return;   // déjà construit

    var social=SOCIAL.map(function(s){
      return '<a href="'+esc(s[1])+'" target="_blank" rel="noopener" aria-label="'+esc(s[2])+'">'+(ICON[s[0]]||"")+'</a>';
    }).join("");

    var year=(function(){ try{ return new Date().getFullYear(); }catch(e){ return 2026; } })();

    var html=''
      + '<div class="ps-footer-top">'
      +   '<div class="ps-footer-brand">'
      +     '<img class="ps-footer-logo" src="'+LOGO+'" alt="PrepaStrat">'
      +     '<p class="ps-footer-tag">'+esc(TAGLINE)+'</p>'
      +     '<div class="ps-footer-social">'+social+'</div>'
      +   '</div>'
      +   COLS.map(colHTML).join("")
      + '</div>'
      + '<div class="ps-footer-bottom">'
      +   '<p class="ps-footer-copy">© '+year+' PrepaStrat. Tous droits réservés.</p>'
      +   '<p class="ps-footer-madein">Préparez le conseil en stratégie avec méthode.</p>'
      + '</div>';

    var wrap=document.createElement("div");
    wrap.className="ps-footer";
    wrap.innerHTML=html;
    sec.appendChild(wrap);

    /* liens Connexion / Inscription -> modale native */
    wrap.querySelectorAll("a[data-ps-form]").forEach(function(a){
      a.addEventListener("click",function(e){ e.preventDefault(); openForm(a.getAttribute("data-ps-form")); });
    });
  }

  var scheduled=false;
  function schedule(){ if(scheduled) return; scheduled=true; requestAnimationFrame(function(){ scheduled=false; build(); }); }
  function start(){ build(); new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true}); }
  if(document.readyState!=="loading") start(); else document.addEventListener("DOMContentLoaded",start);
  window.addEventListener("load",build);
  [200,600,1200,2500].forEach(function(d){ setTimeout(build,d); });
})();
