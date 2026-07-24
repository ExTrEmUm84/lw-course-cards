/* ============================================================
   Page "Mon compte" (/account) — refonte au style du site
   ------------------------------------------------------------
   🔴 À charger dans le Code personnalisé du SITE (Réglages du site),
   à côté de mega-menu.js — PAS dans une page :
     <script src="https://extremum84.github.io/lw-course-cards/account-page.js"></script>

   POURQUOI le site et pas la page : /account n'est PAS une page du Site
   Builder (aucun `#pageContent`, aucune `learnworlds-section`) — c'est une
   page native de LearnWorlds, elle n'a donc pas de champ "Code personnalisé"
   à elle. Vérifié : mega-menu.js s'y charge, donc le code SITE l'atteint.

   ⚠️ CONSÉQUENCE : ce fichier se charge sur TOUTES les pages du site. Tout
   est donc scopé sous `body.slug-account` (CSS) et la partie JS sort
   immédiatement ailleurs. Ne jamais écrire une règle non scopée ici.

   Ce que ça fait :
   - typo Figtree partout (le natif est en Raleway)
   - la grande carte blanche unique devient TRANSPARENTE, et chaque
     `section.account-section` devient une carte (blanc, bord #E6E9EF,
     radius 16) — choix de Ziad le 16/07
   - menu latéral en typo du site + item actif en violet
   - boutons "Modifier" au CTA violet du site
   ============================================================ */
(function(){
  "use strict";

  var B="body.slug-account ";                 // scope : cette page uniquement

  /* Progression par cours : le Worker Cloudflare (API admin LearnWorlds),
     derrière Turnstile, exactement comme l'annuaire. Clé publique déjà
     autorisée sur le domaine → Turnstile s'auto-injecte, aucun loader à
     ajouter côté page. */
  var ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/";
  var SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";

  /* Sort tout de suite ailleurs : le fichier est chargé site-wide.
     Le CSS est de toute façon scopé, mais inutile de poser une feuille de
     style et un observer sur chaque page du site. */
  function surLaPage(){ return document.body && /(^|\s)slug-account(\s|$)/.test(document.body.className); }

  // --- 1) Police Figtree ---
  function figtree(){
    if(document.getElementById("ps-figtree")) return;
    var f=document.createElement("link");
    f.id="ps-figtree"; f.rel="stylesheet";
    f.href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head||document.documentElement).appendChild(f);
  }

  // --- 2) Styles ---
  /* Périmètre : `.account-app` et NON `.account-app-page` — la barre de nav du
     site vit dans `.account-app-page` (vérifié), et c'est mega-menu.js qui la
     gère. `.account-app` contient le titre, le menu latéral et les 4 sections,
     et rien d'autre. */
  var A=B+".account-app ";
  var FT="font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;";

  var CSS=[
    /* fond de page : le gris clair du site, pour que les cartes se détachent */
    "body.slug-account .account-app-page{background:#F5F6F8 !important;}",

    /* 🔴 POLICE PAR HÉRITAGE, JAMAIS PAR `*`.
       Un `*{font-family:…}` force la police sur CHAQUE élément, y compris les
       porteurs d'icônes (`.learnworlds-icon.fas`, Font Awesome 5 Free — présent
       sur cette page) : les pictos deviendraient des carrés. À l'essai l'icône
       survivait, mais seulement parce que la règle de LW est plus spécifique
       que la mienne — ça tenait par accident, pas par conception.
       Ici la police est posée sur le CONTENEUR : elle se propage par héritage,
       et tout élément qui déclare sa propre police (les icônes, les SVG) la
       garde. Sûr par construction. */
    B+".account-app{"+FT+"}",
    /* Les classes LW qui déclarent leur propre police et ne prennent donc pas
       l'héritage. Liste relevée à l'écran, pas devinée : Raleway sur les liens
       du menu et les valeurs, Poppins sur les titres et les libellés. */
    [A+".learnworlds-main-text", A+".learnworlds-main-text-small", A+".learnworlds-main-text-normal",
     A+".learnworlds-heading4", A+".learnworlds-subheading", A+".learnworlds-button",
     A+".account-value-display-title", A+".account-value-display-value", A+"p.ellipsis"
    ].join(",")+"{"+FT+"}",

    /* titre de page */
    B+".account-app h2{"+FT+"font-size:38px !important;font-weight:800 !important;letter-spacing:-.025em !important;color:var(--ps-text,#1c1f26) !important;}",

    /* La grande carte blanche unique s'efface : ce sont les sections qui
       portent désormais la carte (choix de Ziad). */
    B+".lw-body-bg.border-radius.account-cnt{background:transparent !important;border-radius:0 !important;box-shadow:none !important;}",

    /* --- une carte par section --- */
    B+"section.account-section{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-card,16px) !important;padding:26px 28px !important;margin:0 0 20px !important;box-shadow:none !important;transition:box-shadow .2s ease !important;}",
    B+"section.account-section:hover{box-shadow:0 6px 20px rgba(15,23,42,.05) !important;}",
    B+".account-section-header{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:16px !important;margin-bottom:18px !important;}",
    B+".account-section-title{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:21px !important;font-weight:800 !important;letter-spacing:-.015em !important;color:#243B6B !important;}",
    /* petite icône du titre de section : en accent, un peu plus grande */
    B+".account-section-title-icon{color:var(--ps-accent,#507EC5) !important;width:22px !important;height:22px !important;margin-right:9px !important;vertical-align:-3px !important;}",
    [B+".account-section-title-icon path",B+".account-section-title-icon circle",B+".account-section-title-icon rect"].join(",")+"{fill:var(--ps-accent,#507EC5) !important;}",

    /* --- bouton "Modifier" : PILULE OUTLINE moderne (se remplit au survol) --- */
    B+".account-section-header button.learnworlds-button{background:#fff !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;box-shadow:none !important;padding:8px 18px !important;border-radius:var(--ps-r-pill,999px) !important;color:var(--ps-accent,#507EC5) !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:14px !important;font-weight:600 !important;line-height:1 !important;cursor:pointer !important;transition:background .18s ease,color .18s ease,border-color .18s ease !important;}",
    B+".account-section-header button.learnworlds-button:hover{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;color:#fff !important;}",
    /* en mode édition, le header porte « Enregistrer » (.p-0.lw-brand-text) +
       « Annuler ». On rend « Enregistrer » PLEIN (action primaire) ; « Annuler »
       garde la pilule outline ci-dessus. */
    B+".account-section-header button.learnworlds-button.p-0.lw-brand-text{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;color:#fff !important;}",
    B+".account-section-header button.learnworlds-button.p-0.lw-brand-text:hover{background:var(--ps-accent-hover,#486798) !important;border-color:var(--ps-accent-hover,#486798) !important;color:#fff !important;}",

    /* --- menu latéral --- */
    B+".account-menu-content{position:sticky !important;top:24px !important;}",
    B+".account-section-navigation a{display:block !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;color:#4B5563 !important;text-decoration:none !important;padding:9px 12px !important;margin-bottom:2px !important;border-radius:9px !important;transition:color .15s ease, background .15s ease !important;}",
    B+".account-section-navigation a:hover{color:var(--ps-accent,#507EC5) !important;background:var(--ps-accent-tint,#EDF4FF) !important;}",
    /* item actif : AUCUN état natif (vérifié : cliquer n'ajoute aucune classe
       et le hash reste vide) -> classe posée en JS par l'observateur. */
    B+".account-section-navigation a.ps-acc-on{color:var(--ps-accent,#507EC5) !important;background:var(--ps-accent-tint,#EDF4FF) !important;}",

    /* --- COURS RETIRÉS (demande Ziad) : on masque la section « Cours et
       programmes » ET son entrée de menu. La progression par cours n'est donc
       plus lancée (cf. run()). --- */
    B+"#courses-programs{display:none !important;}",
    B+".account-section-navigation a[href='#courses-programs']{display:none !important;}",

    /* --- champs / valeurs --- */
    B+".personal-details-values{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    /* avatar : ROND avec anneau tint + ombre douce (look profil moderne) */
    B+".account-user-avatar{border-radius:50% !important;overflow:hidden !important;border:3px solid #fff !important;box-shadow:0 0 0 2px var(--ps-accent-tint,#EDF4FF),0 4px 14px rgba(15,23,42,.08) !important;}",

    /* --- mode ÉDITION : champs de saisie modernes (radius + anneau de focus
       accent, au lieu du bord gris fin radius 4px natif) --- */
    B+".account-app .learnworlds-input{border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:10px !important;padding:10px 14px !important;font-size:15px !important;background:#fff !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;transition:border-color .15s ease,box-shadow .15s ease !important;}",
    B+".account-app .learnworlds-input:focus{border-color:var(--ps-accent,#507EC5) !important;box-shadow:0 0 0 3px var(--ps-accent-tint,#EDF4FF) !important;outline:none !important;}",

    /* --- barre de progression par cours (injectée en JS dans #courses-programs) ---
       🔴 La cellule de ligne est en display:flex (direction row) : sans
       flex-wrap, la barre devient un flex-item comprimé à côté du titre et son
       remplissage s'effondre à 0. On fait passer la cellule en wrap et on donne
       à la barre flex-basis 100% pour qu'elle prenne sa PROPRE ligne sous le
       titre. Vérifié en direct : remplissages exacts, barres sous le titre. */
    B+"#courses-programs .account-table-row .account-table-cell{flex-wrap:wrap !important;}",
    B+"#courses-programs .ps-acc-prog{flex:0 0 100% !important;width:100% !important;max-width:520px !important;margin:9px 0 2px !important;}",
    B+"#courses-programs .ps-acc-prog-head{display:flex !important;align-items:baseline !important;gap:5px !important;margin-bottom:5px !important;font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",
    B+"#courses-programs .ps-acc-prog-pct{font-size:12.5px !important;font-weight:800 !important;color:var(--ps-accent,#6161FF) !important;letter-spacing:-.01em !important;}",
    B+"#courses-programs .ps-acc-prog-lbl{font-size:12px !important;font-weight:600 !important;color:#8A93A5 !important;}",
    B+"#courses-programs .ps-acc-prog-track{width:auto !important;height:6px !important;border-radius:999px !important;background:var(--ps-accent-tint,#EDEDFF) !important;overflow:hidden !important;}",
    B+"#courses-programs .ps-acc-prog-fill{height:100% !important;border-radius:999px !important;background:var(--ps-accent,#6161FF) !important;width:0;transition:width .6s ease !important;}",
    B+"#courses-programs .ps-acc-prog[data-done='1'] .ps-acc-prog-pct{color:#15A46A !important;}",
    B+"#courses-programs .ps-acc-prog[data-done='1'] .ps-acc-prog-fill{background:#15A46A !important;}"
  ].join("\n");

  function styles(){
    var st=document.getElementById("ps-account-style");
    if(!st){ st=document.createElement("style"); st.id="ps-account-style"; (document.head||document.documentElement).appendChild(st); }
    st.textContent=CSS;
  }

  /* --- 3) Item actif du menu ---
     Les liens pointent vers #personal-details / #security / #courses-programs
     / #payments, mais LearnWorlds n'a AUCUN état actif : cliquer n'ajoute pas
     de classe et le hash reste vide (vérifié). On le calcule donc nous-mêmes.
     IntersectionObserver plutôt qu'un écouteur de scroll : on ne connaît pas le
     conteneur qui défile (la page n'a pas la structure d'une page Builder), et
     l'observateur s'en moque — il travaille par rapport au viewport. */
  var io=null;
  function spy(){
    var nav=document.querySelector(".account-section-navigation");
    if(!nav || nav.dataset.psSpy) return;
    var liens=[].slice.call(nav.querySelectorAll("a[href^='#']"));
    if(!liens.length) return;
    var cibles=[];
    liens.forEach(function(a){
      var id=(a.getAttribute("href")||"").slice(1);
      var el=id && document.getElementById(id);
      if(el) cibles.push({a:a, el:el});
    });
    if(!cibles.length) return;
    nav.dataset.psSpy="1";

    var vus=Object.create(null);
    io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ vus[e.target.id]=e.isIntersecting ? e.intersectionRatio : 0; });
      /* la section active = celle qui occupe le plus l'écran ; on ne retire la
         marque que si une autre gagne, sinon l'état clignoterait entre deux
         sections à l'entrée/sortie. */
      var best=null, bestR=0;
      cibles.forEach(function(c){
        var r=vus[c.el.id]||0;
        if(r>bestR){ bestR=r; best=c; }
      });
      if(!best) return;
      cibles.forEach(function(c){ c.a.classList.toggle("ps-acc-on", c===best); });
    },{threshold:[0,.25,.5,.75,1]});
    cibles.forEach(function(c){ io.observe(c.el); });
  }

  /* --- 4) Progression par cours ---
     La liste native « Cours et programmes » (#courses-programs) n'a AUCUNE
     donnée d'avancement (vérifié : 0 barre, aucun %). On la récupère via le
     Worker (API admin LearnWorlds).
     🔴 Les lignes de cours pointent vers /path-player?courseid=<slug> — le slug
     est dans la QUERY STRING, PAS dans un /course/<slug>. Les programmes
     (/program-player?program=) n'ont pas de progression par cours : ignorés. */
  var progStarted=false, lastBySlug=null, tsEl=null, progPolling=false, progTries=0, progObs=null;

  function courseRows(){
    var cp=document.getElementById("courses-programs");
    if(!cp) return [];
    var map=[];
    [].forEach.call(cp.querySelectorAll(".account-table-row a[href*='courseid=']"),function(a){
      var slug=null;
      try{ slug=new URL(a.href,location.href).searchParams.get("courseid"); }catch(e){}
      if(!slug) return;
      var row=a.closest(".account-table-row");
      var cell=a.closest(".account-table-cell")||row;
      if(row&&cell) map.push({slug:slug, title:(a.textContent||"").replace(/\s+/g," ").trim(), cell:cell});
    });
    return map;
  }

  /* e-mail du membre connecté, lu dans « Informations personnelles ». Il part
     UNIQUEMENT vers le Worker, en en-tête (jamais en URL : une donnée perso
     n'a rien à faire dans une query string qui finit dans les logs). */
  function findEmail(){
    var re=/[^\s@]+@[^\s@]+\.[^\s@]+/;
    var inp=document.querySelector(".account-app input[type='email']");
    if(inp && re.test(inp.value||"")) return inp.value.trim().match(re)[0];
    var ml=document.querySelector(".account-app a[href^='mailto:']");
    if(ml){ var m=ml.getAttribute("href").slice(7).match(re); if(m) return m[0]; }
    var pool=document.querySelectorAll("#personal-details .account-value-display-value, #personal-details .account-value-display, .personal-details-values *");
    for(var i=0;i<pool.length;i++){ var mm=(pool[i].textContent||"").match(re); if(mm) return mm[0]; }
    return null;
  }

  /* Pose/actualise la barre sur chaque ligne dont on connaît le %. Idempotent :
     rejouée à chaque run() (les lignes peuvent arriver tard) sans doublonner. */
  function paint(bySlug){
    if(!bySlug) return;
    lastBySlug=bySlug;
    courseRows().forEach(function(c){
      var p=bySlug[c.slug];
      if(p==null) return;                         // pas de donnée : pas de barre
      var box=c.cell.querySelector(":scope > .ps-acc-prog");
      if(!box){
        box=document.createElement("div"); box.className="ps-acc-prog";
        var head=document.createElement("div"); head.className="ps-acc-prog-head";
        var pct=document.createElement("span"); pct.className="ps-acc-prog-pct";
        var lbl=document.createElement("span"); lbl.className="ps-acc-prog-lbl";
        head.appendChild(pct); head.appendChild(lbl);
        var track=document.createElement("div"); track.className="ps-acc-prog-track";
        track.appendChild(document.createElement("div")).className="ps-acc-prog-fill";
        box.appendChild(head); box.appendChild(track);
        c.cell.appendChild(box);
      }
      var done=p>=100;
      box.dataset.done=done?"1":"0";
      box.querySelector(".ps-acc-prog-pct").textContent=done?"Terminé":(p+" %");
      box.querySelector(".ps-acc-prog-lbl").textContent=done?"✓":(p>0?"complété":"pas commencé");
      /* Largeur posée SYNCHRONEMENT (reflow forcé entre 0 et la cible) plutôt
         que via requestAnimationFrame : rAF est gelé quand l'onglet n'est pas
         au premier plan, ce qui laissait la barre vide. Le reflow garantit la
         largeur tout en jouant la transition. */
      var fillEl=box.querySelector(".ps-acc-prog-fill");
      var target=(p>0&&p<2?2:p)+"%";
      fillEl.style.width="0%";
      void fillEl.offsetWidth;              // force le reflow
      fillEl.style.width=target;
    });
  }

  function charger(jeton){
    var email=findEmail();
    if(!email){
      /* 🔴 « Informations personnelles » (où se lit l'e-mail) peut être rendu
         APRÈS l'arrivée du jeton Turnstile : sans réessai, charger() sortait en
         silence et aucune barre n'apparaissait (course de rendu constatée en
         live). On repousse, borné (~20 s) ; le jeton Turnstile reste valide
         plusieurs minutes, donc on peut le réutiliser. */
      if((charger.tries=(charger.tries||0)+1) <= 40){ setTimeout(function(){ charger(jeton); }, 500); }
      return;
    }
    fetch(ENDPOINT+"progress",{ headers:{ Accept:"application/json", "X-Turnstile-Token":jeton, "X-LW-Email":email } })
      .then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(function(data){ paint(data && data.bySlug); })
      .catch(function(err){ console.error("[account-progress]",err); });
  }

  /* Turnstile auto-injecté (comme annuaire.js) : widget invisible dans un
     conteneur hors écran mais RENDU (un display:none empêcherait l'exécution). */
  function turnstile(){
    if(!tsEl){
      tsEl=document.createElement("div");
      tsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(tsEl);
    }
    window.psAccTsReady=function(){
      try{
        window.turnstile.render(tsEl,{
          sitekey:SITEKEY,
          callback:charger,
          "error-callback":function(){ return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(tsEl); }catch(e){} },
        });
      }catch(e){ console.error("[account-progress] turnstile",e); }
    };
    if(window.turnstile){ window.psAccTsReady(); return; }
    if(document.getElementById("ps-acc-ts-api")) return;
    var s=document.createElement("script");
    s.id="ps-acc-ts-api";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psAccTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  /* Rejoue paint quand l'app compte re-render la table « Cours et programmes »
     (pagination, tri…) : les barres injectées seraient sinon perdues. Posé une
     seule fois. On se déconnecte le temps de peindre pour ne pas se
     ré-observer soi-même (paint modifie le DOM de la section). */
  function watchCourses(){
    if(progObs) return;
    var cp=document.getElementById("courses-programs");
    if(!cp) return;
    progObs=new MutationObserver(function(){
      if(!lastBySlug) return;
      progObs.disconnect();
      paint(lastBySlug);
      progObs.observe(cp,{childList:true,subtree:true});
    });
    progObs.observe(cp,{childList:true,subtree:true});
  }

  function progression(){
    if(progStarted){ if(lastBySlug) paint(lastBySlug); watchCourses(); return; }
    if(courseRows().length){ progStarted=true; watchCourses(); turnstile(); return; }
    /* 🔴 La table est rendue TARD par l'app compte (souvent après 2,5 s). Les
       relances de run() s'arrêtent à 2500 ms → si on se contentait de sortir,
       la progression ne démarrerait JAMAIS quand la table apparaît plus tard
       (bug constaté en live). On poursuit donc le poll au-delà, borné (~20 s),
       en une seule chaîne. */
    if(progPolling) return;
    progPolling=true;
    (function poll(){
      if(progStarted) return;
      if(courseRows().length){ progStarted=true; watchCourses(); turnstile(); return; }
      if(progTries++ < 40) setTimeout(poll,500); else progPolling=false;
    })();
  }

  function run(){
    if(!surLaPage()) return;
    figtree(); styles(); spy();
    /* progression() n'est PLUS appelée : la section « Cours et programmes » est
       masquée (cf. CSS), donc inutile d'aller chercher l'avancement via le
       Worker/Turnstile. Le code de progression est conservé plus haut au cas où
       la section serait ré-affichée. */
  }

  if(document.readyState!=="loading") run(); else document.addEventListener("DOMContentLoaded",run);
  window.addEventListener("load",run);
  /* l'app compte est rendue en JS : les sections n'existent pas au 1er passage.
     Mêmes relances que les autres fichiers du repo. */
  [200,600,1200,2500].forEach(function(d){ setTimeout(run,d); });
})();
