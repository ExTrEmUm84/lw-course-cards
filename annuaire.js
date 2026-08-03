/* ============================================================
   Annuaire des membres — étudiants PrepaStrat
   ------------------------------------------------------------
   🔴 À charger dans le Code personnalisé de LA PAGE (et non du site) :
     <script src="https://extremum84.github.io/lw-course-cards/annuaire.js"></script>

   Et poser le point de montage dans un élément HTML de la page :
     <div id="psa-root"></div>

   Le `<script>` DOIT aller dans le Code personnalisé : dans un élément HTML il
   resterait inerte (LearnWorlds y injecte via innerHTML). Le `<div>`, lui, va
   bien dans un élément HTML — c'est ce qui te laisse le placer où tu veux dans
   le Site Builder. Sans lui, rien ne s'affiche (et un mot l'explique en console).

   ⚠️ GitHub Pages, PAS jsDelivr (abandonné le 16/07). Déploiement = `git push`.

   🔴 Mets la page derrière login dans ses réglages d'accès. Turnstile empêche
   d'aspirer le JSON, mais c'est LearnWorlds qui empêche un visiteur anonyme de
   voir la page. Les deux sont nécessaires.

   D'OÙ VIENNENT LES DONNÉES : d'un Worker Cloudflare qui interroge l'API
   LearnWorlds côté serveur (le client_secret ne peut pas vivre ici, il serait
   lisible par tous). Le Worker ne renvoie que des champs publics — jamais
   d'email — et n'accepte que les requêtes portant un jeton Turnstile valide.

   CE QUI S'AFFICHE : annuaire d'ÉTUDIANTS, pas d'anciens. Filière, promo,
   ville, bio, et les matières sur lesquelles on peut s'entraider (pastilles
   cliquables). Pas d'entreprise ni d'université : ces champs natifs ne sont pas
   activés dans l'école, et n'auraient aucun sens pour des élèves en cours.

   QUI APPARAÎT : uniquement les membres dont le champ « annuaire » vaut « oui »
   (opt-in RGPD). Aucun filtre de rôle : un prof qui accepte y figure aussi.
   ============================================================ */
(function () {
  "use strict";

  /* Le Worker. `?fresh=1` force le rafraîchissement si un profil vient d'être
     modifié (le cache est de 5 min). */
  var ENDPOINT = "https://annuaire-prepastrat.ziedbencheikh.workers.dev/";

  /* Clé de site Turnstile : publique par nature. C'est la clé SECRÈTE, côté
     Worker, qui fait le vrai travail. */
  var SITEKEY = "0x4AAAAAAD35WbGwkjYZmALf";

  var MOUNT = "psa-root";

  // --- Police du site ---------------------------------------------------
  function figtree() {
    if (document.getElementById("ps-figtree")) return;
    var f = document.createElement("link");
    f.id = "ps-figtree";
    f.rel = "stylesheet";
    f.href = "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap";
    (document.head || document.documentElement).appendChild(f);
  }

  // --- Styles -----------------------------------------------------------
  /* 🔴 Chaque var() porte sa valeur de repli, comme partout dans le repo : si
     tokens.js ne charge pas, l'annuaire garde exactement cette allure au lieu
     de virer au noir sur blanc sans arrondis. Ces replis doivent rester égaux
     aux valeurs de tokens.js. */
  var R = "#psa-root ";

  var CSS = [
    /* 🔴 `font-size` et `text-align` NE SONT PAS DÉCORATIFS ICI — ils coupent
       deux héritages de LearnWorlds :
       - LW pose `font-size:0` sur ses sections (vieille astuce anti-espaces
         entre colonnes inline-block). Sans la ligne ci-dessous, tout ce qui
         fait `font:inherit` — l'input et les selects — tombe à 0 : les menus
         déroulants deviennent deux boîtes vides de 50px. Les cartes, elles,
         ont des tailles explicites et ne le montrent pas. Vérifié sur la page
         réelle le 17/07.
       - LW pose aussi `text-align:center` sur ses sections.
       Déclarer les deux ici arrête l'héritage : aucune bagarre de spécificité,
       aucun !important. Ne pas les retirer. */
    /* `max-width:1000px` sans marge horizontale = exactement la boîte du hero
       (h1 et .ps-desc, plus bas). Mesuré sur la page réelle : avec 1120px et
       16px de padding, l'annuaire commençait 44px à gauche du titre — visible
       à l'œil. Le conteneur LearnWorlds a `padding:0`, il ne rattrape rien.
       Ne pas retoucher ces valeurs sans les remesurer contre le hero. */
    R + "{" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);" +
      "font-size:15px;text-align:left;" +
      "color:var(--ps-text,#1c1f26);" +
      "max-width:1000px;margin:0 auto;padding:8px 0 48px;" +
      "line-height:1.5;box-sizing:border-box;}",
    /* En dessous de la largeur du hero, plus rien ne protège des bords : on
       remet une marge. L'alignement avec le titre y perd 16px, invisible sur
       un écran où tout est en une colonne — des cartes coupées, non. */
    "@media (max-width:1040px){" + R + "{padding-left:16px;padding-right:16px;}}",
    R + "*," + R + "*::before," + R + "*::after{box-sizing:inherit;}",

    /* Barre de recherche — vocabulaire des filtres du site (cf. filters.js,
       page Cas). 🔴 Accent BLEU #3887B4, PAS le violet : le design system
       PrepaStrat distingue deux accents — bleu/navy pour les FILTRES, violet
       (--ps-accent) pour les CARTES. Décision archivée dans filter-styles.md.
       Les cartes plus bas restent donc en violet, seuls les contrôles de
       filtre sont en bleu. Le bleu est écrit en dur comme dans filters.js
       (ce n'est pas un token). */
    /* position:relative + z-index : le panneau des filtres (absolu, plus bas)
       doit passer AU-DESSUS de la grille des cartes. La barre et la grille sont
       sœurs ; sans contexte d'empilement sur la barre, le menu passe derrière.
       Même problème résolu dans filters.js par la remontée de la branche. */
    R + ".psa-bar{position:relative;z-index:5;display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:12px;}",
    /* Champ de recherche : boîte 46px, coins 12px, focus bleu, comme
       `.-search-box` de filters.js. */
    R + ".psa-input{flex:1 1 280px;min-width:0;height:46px;padding:0 16px;" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);font-size:15px;color:#323338;" +
      "border:1.5px solid var(--ps-border,#E6E9EF);border-radius:12px;background:#fff;outline:none;" +
      "box-shadow:0 1px 2px rgba(0,0,0,.04);transition:border-color .15s ease,box-shadow .15s ease;}",
    R + ".psa-input:focus{border-color:#3887B4;box-shadow:0 0 0 3px rgba(56,135,180,.15);}",

    /* ─── Filtres = composant `.ps-ff` de filters.js, repris à l'identique ───
       Un vrai menu custom (pilule + panneau), PAS un <select> natif : le
       panneau natif du système ne peut pas être stylé. Seule adaptation à ma
       barre : `margin:0` au lieu de `margin-right:10px` (j'espace avec `gap`). */
    R + " .ps-ff{position:relative;display:inline-flex;align-items:center;gap:7px;height:44px;padding:0 16px;margin:0;" +
      "border-radius:var(--ps-r-pill,999px);border:1.5px solid var(--ps-border,#E6E9EF);background:#fff;" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);font-size:14px;font-weight:600;" +
      "color:#4B5563;cursor:pointer;user-select:none;transition:all .15s ease;}",
    R + " .ps-ff:hover{border-color:#3887B4;color:#3887B4;background:#F3F9FC;}",
    R + " .ps-ff.ps-ff-on{border-color:#3887B4;background:#F3F9FC;color:#3887B4;}",
    R + " .ps-ff:focus-visible{outline:2px solid #3887B4;outline-offset:2px;}",
    R + " .ps-ff-cur{font-weight:700;}",
    R + " .ps-ff-arrow{width:9px;height:9px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg) translateY(-2px);transition:transform .18s ease;}",
    R + " .ps-ff.ps-ff-open .ps-ff-arrow{transform:rotate(-135deg) translateY(2px);}",
    R + " .ps-ff-menu{display:none;position:absolute;top:calc(100% + 10px);left:0;z-index:50;min-width:200px;max-height:280px;overflow-y:auto;margin:0;padding:8px;list-style:none;text-align:left;" +
      "border-radius:14px;border:1px solid var(--ps-border,#E6E9EF);background:#fff;box-shadow:0 16px 40px rgba(15,23,42,.14);}",
    R + " .ps-ff.ps-ff-open .ps-ff-menu{display:block;}",
    R + " .ps-ff-item{list-style:none;padding:9px 14px;border-radius:9px;font-size:14px;font-weight:500;color:#323338;white-space:nowrap;text-align:left;cursor:pointer;transition:background .12s ease,color .12s ease;}",
    R + " .ps-ff-item:hover{background:#F3F9FC;color:#3887B4;}",
    R + " .ps-ff-item.ps-ff-sel{background:#EAF5FC;color:#3887B4;font-weight:700;}",

    R + ".psa-count{margin:0 0 20px;color:var(--ps-text-soft,#676879);font-size:14px;}",

    /* Grille */
    R + ".psa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}",

    /* Carte */
    R + ".psa-card{display:flex;flex-direction:column;padding:20px;background:#fff;" +
      "border:1px solid var(--ps-border,#E6E9EF);" +
      "border-radius:var(--ps-r-card,16px);" +
      "transition:box-shadow .18s ease,transform .18s ease;}",
    R + ".psa-card:hover{box-shadow:0 6px 20px rgba(var(--ps-accent-rgb,97,97,255),.14);transform:translateY(-2px);}",

    R + ".psa-avatar{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;" +
      "font-weight:700;font-size:18px;letter-spacing:.5px;color:#fff;margin-bottom:14px;" +
      "object-fit:cover;flex:none;}",

    R + ".psa-name{margin:0;font-size:16px;font-weight:700;color:var(--ps-text,#1c1f26);}",
    R + ".psa-filiere{margin:3px 0 0;font-size:14px;font-weight:600;color:var(--ps-accent,#507EC5);}",
    R + ".psa-meta{margin:8px 0 0;font-size:13px;color:var(--ps-text-soft,#676879);}",
    R + ".psa-bio{margin:12px 0 0;font-size:13.5px;color:var(--ps-text-soft,#676879);" +
      "display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}",

    /* Matières : le cœur de l'annuaire, donc mises en avant. */
    R + ".psa-aide{margin-top:14px;}",
    R + ".psa-aide-titre{margin:0 0 6px;font-size:11px;font-weight:700;" +
      "text-transform:uppercase;letter-spacing:.5px;color:var(--ps-text-soft,#676879);}",
    R + ".psa-chips{display:flex;gap:6px;flex-wrap:wrap;}",
    R + ".psa-chip{font-size:12px;padding:4px 10px;" +
      "border-radius:var(--ps-r-pill,999px);" +
      "background:var(--ps-accent-tint,#EDEDFF);" +
      "color:var(--ps-accent-hover,#4B4BE0);}",
    R + ".psa-chip-btn{font-family:inherit;border:0;cursor:pointer;" +
      "transition:background .15s ease,color .15s ease;}",
    R + ".psa-chip-btn:hover{background:var(--ps-accent,#507EC5);color:#fff;}",
    R + ".psa-chip-btn:focus-visible{outline:2px solid var(--ps-accent,#507EC5);outline-offset:2px;}",

    /* Pied de carte : collé en bas, action principale (bouton) au-dessus des
       liens secondaires. Le margin-top:auto vit ici, plus sur .psa-links. */
    R + ".psa-foot{margin-top:auto;padding-top:16px;display:flex;flex-direction:column;gap:12px;align-items:flex-start;}",
    /* Bouton "Contacter" : CTA plein au violet du site (--ps-accent), coins
       --ps-r-btn. Affordance bouton pour une action, là où .ps-mlink est un
       simple lien "voir plus".
       🔴 !important sur color/background/text-decoration : ce sont des <a>, et
       LearnWorlds impose à TOUS ses liens sa couleur (#1c1f26) + un soulignement.
       Sans !important, le texte du bouton virait gris foncé souligné sur fond
       violet — illisible. Vérifié sur la page réelle le 2026-07-17. */
    R + ".psa-contact{display:inline-flex;align-items:center;gap:7px;padding:9px 15px;" +
      "border-radius:var(--ps-r-btn,10px);background:var(--ps-accent,#507EC5) !important;color:#fff !important;" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);" +
      "font-size:13.5px;font-weight:600;text-decoration:none !important;transition:background .15s ease;}",
    R + ".psa-contact:hover{background:var(--ps-accent-hover,#4B4BE0) !important;color:#fff !important;}",
    R + ".psa-contact:focus-visible{outline:2px solid var(--ps-accent,#507EC5);outline-offset:2px;}",
    R + ".psa-links{display:flex;gap:14px;}",
    /* Mêmes <a>, même écrasement LW : on force la couleur violette. */
    R + ".psa-link{font-size:13px;font-weight:600;color:var(--ps-accent,#507EC5) !important;text-decoration:none !important;}",
    R + ".psa-link:hover{text-decoration:underline !important;}",

    /* États */
    R + ".psa-empty," + R + ".psa-error{color:var(--ps-text-soft,#676879);font-size:15px;padding:32px 0;text-align:center;}",
    R + ".psa-turnstile{display:flex;justify-content:center;margin-top:24px;}",
    R + ".psa-turnstile:empty{display:none;}",
    R + ".psa-skeleton{height:218px;border-radius:var(--ps-r-card,16px);" +
      "background:linear-gradient(90deg,var(--ps-surface-soft,#F7F8FB) 25%,var(--ps-border,#E6E9EF) 37%,var(--ps-surface-soft,#F7F8FB) 63%);" +
      "background-size:400% 100%;animation:psa-shimmer 1.3s ease-in-out infinite;}",
    "@keyframes psa-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}",

    "@media (prefers-reduced-motion:reduce){" + R + ".psa-card," + R + ".psa-skeleton{transition:none;animation:none;}}",

    /* ─── Titre de page ─────────────────────────────────────────────────
       Mêmes valeurs que case-cards.js / course-cards.js / sector-cards.js :
       le titre de l'annuaire doit être indiscernable de ceux des autres pages.
       Scope `#pageContent` (et non `#psa-root`) : le H1 est un élément
       LearnWorlds, il vit à côté de l'annuaire, pas dedans. Sans danger, ce
       fichier n'est chargé que sur cette page. */
    "#pageContent h1.learnworlds-heading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:56px !important;font-weight:800 !important;letter-spacing:-.025em !important;line-height:1.14 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* ⚠️ LearnWorlds SERT le H1 dans le HTML, "#" compris. hero() ne peut le
       transformer qu'une fois le DOM prêt : sans ça les "#" s'affichent en clair
       pendant une demi-seconde. -> masqué tant qu'il n'est pas traité.
       `visibility` (et non `display`) : la place reste réservée, aucun décalage.
       Filet de sécurité à 2,5s dans hero(), sinon un titre sans "#" resterait
       invisible pour toujours. */
    "#pageContent h1.learnworlds-heading:not([data-ps-tw]){visibility:hidden !important;}",
    "#pageContent h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#507EC5) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* `.learnworlds-main-text` existe aussi dans le pied de page : on ne stylise
       que la description marquée en JS (cf. hero), jamais la classe nue. */
    "#pageContent .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    /* Machine à écrire : le slot réserve la largeur de la phrase la plus longue
       pour que le titre ne tremble pas à chaque lettre. */
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#507EC5) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#507EC5) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
    "@keyframes ps-blink{50%{opacity:0}}",
    "@media(max-width:820px){#pageContent h1.learnworlds-heading{font-size:36px !important;}#pageContent h2.learnworlds-subheading{font-size:27px !important;}.ps-tw{white-space:normal !important;}#pageContent .ps-desc{padding-right:0 !important;}}",
  ].join("\n");

  function styles() {
    var st = document.getElementById("psa-styles");
    if (!st) {
      st = document.createElement("style");
      st.id = "psa-styles";
      (document.head || document.documentElement).appendChild(st);
    }
    if (st.textContent !== CSS) st.textContent = CSS;
  }

  // --- Rendu ------------------------------------------------------------
  var membres = [];
  var grid, count, empty, qEl, tsEl;
  /* État des filtres : "" = « toutes ». Remplace les .value des anciens
     <select> — les facettes .ps-ff n'ont pas de valeur native.
     🔴 Filtres de CETTE page (annuaire partenaire de cas) : École, Niveau,
     Recherche, Langue (Promo/Filière retirés — demande Ziad). Les valeurs
     viennent des champs LW cf_ecole/cf_niveau/cf_recherche/cf_langue (Worker). */
  var filtre = { ecole: "", niveau: "", recherche: "", langue: "" };
  var facettes = {}; /* key -> { box, label, resetTxt, valeurs } */
  /* Ordres imposés pour Niveau/Recherche/Langue (sinon tri alphabétique). */
  var ORDRE = {
    niveau: ["Débutant", "Avancé", "Expert"],
    recherche: ["Stage", "CDI Junior", "CDI expérimenté"],
    langue: ["Français", "Anglais"]
  };
  function triFacette(cle) {
    var ord = ORDRE[cle];
    if (ord) return function (a, b) {
      var ia = ord.indexOf(a), ib = ord.indexOf(b);
      if (ia < 0) ia = 99; if (ib < 0) ib = 99;
      return ia - ib || String(a).localeCompare(String(b), "fr");
    };
    return function (a, b) { return String(a).localeCompare(String(b), "fr", { numeric: true }); };
  }

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  /** Couleur d'avatar stable, dérivée du nom (même personne = même teinte). */
  function hueOf(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return h;
  }

  /** Pastille d'initiales colorée (avatar par défaut, et repli si une photo ne charge pas). */
  function initialsAvatar(m) {
    var av = el("div", "psa-avatar", m.initials || "?");
    var h = hueOf(m.name || "");
    av.style.background = "linear-gradient(135deg,hsl(" + h + " 62% 52%),hsl(" + ((h + 40) % 360) + " 62% 44%))";
    av.setAttribute("aria-hidden", "true");
    return av;
  }

  /** Construit la carte via le DOM — jamais innerHTML avec des données membres :
      une bio contenant du HTML doit s'afficher comme du texte, pas s'exécuter. */
  function carte(m) {
    var c = el("article", "psa-card");

    if (m.photo) {
      var img = el("img", "psa-avatar");
      img.src = m.photo;
      img.alt = "";
      img.loading = "lazy";
      /* repli sur les initiales si la photo ne charge pas (source externe) */
      img.onerror = function () {
        if (img.parentNode) img.parentNode.replaceChild(initialsAvatar(m), img);
      };
      c.appendChild(img);
    } else {
      c.appendChild(initialsAvatar(m));
    }

    c.appendChild(el("h3", "psa-name", m.name));
    var sousTitre = m.ecole || m.filiere;
    if (sousTitre) c.appendChild(el("p", "psa-filiere", sousTitre));

    var langueTxt = Array.isArray(m.langue) ? m.langue.join(" / ") : m.langue;
    var meta = [m.niveau ? "Niveau " + m.niveau : null, m.recherche, langueTxt, m.location]
      .filter(Boolean).join(" · ");
    if (meta) c.appendChild(el("p", "psa-meta", meta));
    if (m.bio) c.appendChild(el("p", "psa-bio", m.bio));

    if (m.matieres && m.matieres.length) {
      var wrap = el("div", "psa-aide");
      wrap.appendChild(el("p", "psa-aide-titre", "Peut aider en"));
      var chips = el("div", "psa-chips");
      m.matieres.forEach(function (mat) {
        var b = el("button", "psa-chip psa-chip-btn", mat);
        b.type = "button";
        b.setAttribute("aria-label", "Rechercher les membres qui peuvent aider en " + mat);
        b.addEventListener("click", function () {
          qEl.value = mat;
          rendre();
          qEl.focus();
        });
        chips.appendChild(b);
      });
      wrap.appendChild(chips);
      c.appendChild(wrap);
    }

    // Pied de carte : le bouton "Contacter" (action principale) puis les liens
    // secondaires (LinkedIn / Site). Le tout collé en bas par margin-top:auto.
    var foot = el("div", "psa-foot");

    // Bouton contact : le canal (email, LinkedIn, tél…) est choisi par le
    // membre ; le Worker a déjà déterminé libellé et lien.
    if (m.contact && m.contact.href) {
      var cta = el("a", "psa-contact", m.contact.label);
      cta.href = m.contact.href;
      // On n'ouvre un nouvel onglet que pour le web ; mailto:/tel: restent
      // dans le même contexte (sinon un onglet blanc s'ouvre puis se ferme).
      if (/^https?:/i.test(m.contact.href)) {
        cta.target = "_blank";
        cta.rel = "noopener noreferrer nofollow";
      }
      cta.setAttribute("aria-label", m.contact.label + " — " + m.name);
      foot.appendChild(cta);
    }

    var links = el("div", "psa-links");
    [[m.linkedin, "LinkedIn"], [m.website, "Site web"]].forEach(function (p) {
      if (!p[0]) return;
      var a = el("a", "psa-link", p[1]);
      a.href = p[0];
      a.target = "_blank";
      a.rel = "noopener noreferrer nofollow";
      a.setAttribute("aria-label", p[1] + " de " + m.name);
      links.appendChild(a);
    });
    if (links.childNodes.length) foot.appendChild(links);

    if (foot.childNodes.length) c.appendChild(foot);

    return c;
  }

  function botteDeFoin(m) {
    return [m.name, m.ecole, m.filiere, m.niveau, m.recherche, m.location]
      .concat(Array.isArray(m.langue) ? m.langue : [m.langue])
      .concat(m.matieres || [])
      .filter(Boolean).join(" ").toLowerCase();
  }

  /** Une langue peut être une valeur unique ou une liste : match si présente. */
  function matchVal(champ, val) {
    if (!val) return true;
    if (Array.isArray(champ)) return champ.indexOf(val) !== -1;
    return String(champ) === val;
  }

  function rendre() {
    var q = qEl.value.trim().toLowerCase();

    var vus = membres.filter(function (m) {
      return matchVal(m.ecole, filtre.ecole) &&
             matchVal(m.niveau, filtre.niveau) &&
             matchVal(m.recherche, filtre.recherche) &&
             matchVal(m.langue, filtre.langue) &&
             (!q || botteDeFoin(m).indexOf(q) !== -1);
    });

    grid.replaceChildren.apply(grid, vus.map(carte));

    count.textContent = vus.length === membres.length
      ? membres.length + " membre" + (membres.length > 1 ? "s" : "")
      : vus.length + " sur " + membres.length + " membres";

    empty.hidden = vus.length > 0;
    empty.textContent = "Aucun membre ne correspond à cette recherche.";
  }

  // --- Filtres (composant .ps-ff) ---------------------------------------
  /** Valeurs distinctes réellement présentes chez les membres, triées. */
  function distinctes(cle, tri) {
    var vues = {};
    membres.forEach(function (m) {
      var v = m[cle];
      if (!v) return;
      if (Array.isArray(v)) v.forEach(function (x) { if (x) vues[x] = 1; });   /* ex. langue = ["Français","Anglais"] */
      else vues[v] = 1;
    });
    return Object.keys(vues).sort(tri);
  }

  function fermerFacettes() {
    var els = grid.ownerDocument.querySelectorAll("#" + MOUNT + " .ps-ff.ps-ff-open");
    for (var i = 0; i < els.length; i++) els[i].classList.remove("ps-ff-open");
  }

  /** Crée la pilule d'une facette. Le contenu (label, options) est (re)peint
      par peindreFacette dès que les valeurs sont connues. */
  function creerFacette(cle, label, resetTxt) {
    var box = el("div", "ps-ff");
    box.setAttribute("data-ps-f", cle);
    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-haspopup", "listbox");
    box.addEventListener("click", function (e) {
      if (e.target.closest(".ps-ff-menu")) return; /* clic sur une option : géré par le <li> */
      e.stopPropagation();                         /* sinon le listener document referme aussitôt */
      var ouvert = box.classList.contains("ps-ff-open");
      fermerFacettes();
      if (!ouvert) box.classList.add("ps-ff-open");
      box.setAttribute("aria-expanded", ouvert ? "false" : "true");
    });
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); box.click(); }
    });
    facettes[cle] = { box: box, label: label, resetTxt: resetTxt, valeurs: [] };
    return box;
  }

  function peindreFacette(cle) {
    var f = facettes[cle], box = f.box, sel = filtre[cle];
    box.classList.toggle("ps-ff-on", !!sel);
    box.replaceChildren();

    var lbl = el("span", "ps-ff-lbl");
    lbl.appendChild(document.createTextNode(sel ? f.label + " : " : f.label));
    if (sel) lbl.appendChild(el("span", "ps-ff-cur", sel)); /* textContent : pas d'injection */
    box.appendChild(lbl);
    box.appendChild(el("span", "ps-ff-arrow"));

    var menu = el("ul", "ps-ff-menu");
    menu.setAttribute("role", "listbox");
    var options = [{ v: "", t: f.resetTxt }];
    f.valeurs.forEach(function (v) { options.push({ v: v, t: v }); });
    options.forEach(function (o) {
      var li = el("li", "ps-ff-item" + (filtre[cle] === o.v ? " ps-ff-sel" : ""), o.t);
      li.setAttribute("role", "option");
      li.addEventListener("click", function (e) {
        e.stopPropagation();
        filtre[cle] = o.v;
        fermerFacettes();
        peindreFacette(cle);
        rendre();
      });
      menu.appendChild(li);
    });
    box.appendChild(menu);
  }

  function remplirFiltres() {
    /* École A→Z ; Niveau/Recherche/Langue dans l'ordre imposé (triFacette). */
    ["ecole", "niveau", "recherche", "langue"].forEach(function (cle) {
      if (!facettes[cle]) return;
      facettes[cle].valeurs = distinctes(cle, triFacette(cle));
      peindreFacette(cle);
    });
  }

  function squelettes(n) {
    var s = [];
    for (var i = 0; i < n; i++) s.push(el("div", "psa-skeleton"));
    grid.replaceChildren.apply(grid, s);
  }

  function erreur(msg) {
    grid.replaceChildren();
    count.textContent = "";
    empty.hidden = false;
    empty.className = "psa-error";
    empty.textContent = msg;
  }

  /* ═══════════════════════════════════════════════════════════════════
     PROFILS DE DÉMO — FICTIFS, POUR L'AFFICHAGE UNIQUEMENT (choix de Ziad).
     Ces 42 profils n'existent PAS comme comptes LearnWorlds : ils sont
     concaténés aux vrais membres renvoyés par le Worker, juste pour montrer
     la page peuplée. Aucune donnée réelle. Leurs liens de contact pointent
     vers des adresses bidon (exemple.fr, wa.me/336…) — ils ne mènent nulle
     part d'utile, c'est normal.
     🔴 POUR REVENIR AUX SEULS VRAIS MEMBRES : passer DEMO_FILL à false
     (ou supprimer ce bloc + la ligne « if (DEMO_FILL) … » plus bas).
     ═══════════════════════════════════════════════════════════════════ */
  var DEMO_FILL = true;

  /* Photos des profils démo (choix de Ziad : portraits réalistes). Source
     externe randomuser.me, assortie au GENRE du prénom, déterministe (même
     profil = même photo car les indices sont attribués dans l'ordre du tableau).
     Repli sur les initiales si l'image ne charge pas (voir img.onerror).
     🔴 Purement démo — disparaît avec DEMO_FILL/DEMO_MEMBERS. */
  var DEMO_FEMALE = { "Claire":1,"Léa":1,"Sarah":1,"Inès":1,"Nour":1,"Camille":1,"Juliette":1,"Fatou":1,"Chloé":1,"Manon":1,"Emma":1,"Aya":1,"Salomé":1,"Jeanne":1,"Lina":1,"Yasmine":1,"Margaux":1,"Alice":1,"Maëlys":1,"Romane":1,"Anaïs":1 };
  var _demoIdx = { men: 0, women: 0 };
  function demoPhoto(m) {
    if (m.photo) return m;                                   // idempotent
    var first = (m.name || "").split(/\s+/)[0];
    var g = DEMO_FEMALE[first] ? "women" : "men";
    m.photo = "https://randomuser.me/api/portraits/" + g + "/" + (_demoIdx[g]++) + ".jpg";
    return m;
  }

  /* Démo : remplit École/Niveau/Recherche/Langue sur les faux profils (déterministe
     via un hash du nom) pour que les 4 filtres soient peuplés et démontrables. Les
     VRAIS membres gardent leurs champs du Worker (cf_ecole/cf_niveau/cf_recherche/cf_langue). */
  var DEMO_ECOLES = ["HEC Paris", "ESSEC", "ESCP", "EM Lyon", "EDHEC", "SKEMA", "Audencia", "NEOMA", "Grenoble EM", "Polytechnique (X)", "CentraleSupélec", "Mines Paris", "Ponts ParisTech", "Télécom Paris", "ENSAE", "Arts et Métiers", "Dauphine", "Sciences Po Paris", "ENS"];
  var DEMO_NIVEAUX = ["Débutant", "Avancé", "Expert"];
  var DEMO_RECH = ["Stage", "CDI Junior", "CDI expérimenté"];
  var DEMO_LANGUES = [["Français"], ["Français", "Anglais"], ["Anglais"], ["Français", "Anglais"]];
  function demoEnrich(m) {
    var s = (m.id || m.name || ""), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    if (!m.ecole)     m.ecole = DEMO_ECOLES[h % DEMO_ECOLES.length];
    if (!m.niveau)    m.niveau = DEMO_NIVEAUX[(h >> 3) % DEMO_NIVEAUX.length];
    if (!m.recherche) m.recherche = DEMO_RECH[(h >> 5) % DEMO_RECH.length];
    if (!m.langue)    m.langue = DEMO_LANGUES[(h >> 7) % DEMO_LANGUES.length];
    return m;
  }

  var DEMO_MEMBERS =   [
    {
      "id": "m01",
      "name": "Amine Marchetti",
      "initials": "AM",
      "photo": null,
      "filiere": "ECT 2e année",
      "matieres": [
        "Anglais",
        "Espagnol"
      ],
      "location": "Paris",
      "promo": "2026",
      "bio": "Dispo le soir en semaine pour réviser la culture générale ensemble.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur WhatsApp",
        "href": "https://wa.me/33612345678"
      }
    },
    {
      "id": "m02",
      "name": "Claire Nguyen",
      "initials": "CN",
      "photo": null,
      "filiere": "Prépa MP",
      "matieres": [
        "Maths",
        "Physique"
      ],
      "location": "Lille",
      "promo": "2026",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": "https://linkedin.com/in/claire-nguyen",
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/claire-nguyen/30min"
      }
    },
    {
      "id": "m03",
      "name": "Yanis Ferreira",
      "initials": "YF",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Maths",
        "Espagnol"
      ],
      "location": "Clermont-Ferrand",
      "promo": "2027",
      "bio": "Passé par la fac avant la prépa, je parle réorientation sans tabou.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur WhatsApp",
        "href": "https://wa.me/33612345678"
      }
    },
    {
      "id": "m04",
      "name": "Léa Aubert",
      "initials": "LA",
      "photo": null,
      "filiere": "Prépa D2",
      "matieres": [
        "Économie",
        "Sociologie"
      ],
      "location": "Strasbourg",
      "promo": "2026",
      "bio": "J'ai beaucoup galéré au premier semestre, je m'en sors mieux maintenant. Je peux rassurer ceux qui doutent.",
      "linkedin": "https://linkedin.com/in/lea-aubert",
      "website": null,
      "contact": {
        "label": "Contacter sur LinkedIn",
        "href": "https://linkedin.com/in/lea-aubert"
      }
    },
    {
      "id": "m05",
      "name": "Thomas Traoré",
      "initials": "TT",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Anglais",
        "Allemand"
      ],
      "location": "Nancy",
      "promo": "2027",
      "bio": null,
      "linkedin": "https://linkedin.com/in/thomas-traore",
      "website": null,
      "contact": null
    },
    {
      "id": "m06",
      "name": "Sarah Rousseau",
      "initials": "SR",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Maths",
        "Contraction"
      ],
      "location": "Lyon",
      "promo": "2028",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m07",
      "name": "Hugo Moreau",
      "initials": "HM",
      "photo": null,
      "filiere": "Licence 3 Économie",
      "matieres": [
        "Marketing",
        "Management"
      ],
      "location": "Versailles",
      "promo": "2027",
      "bio": "Dispo le soir en semaine pour réviser la culture générale ensemble.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/hugo-moreau/30min"
      }
    },
    {
      "id": "m08",
      "name": "Inès Lemoine",
      "initials": "IL",
      "photo": null,
      "filiere": "Prépa B/L",
      "matieres": [
        "Sciences sociales",
        "Philosophie"
      ],
      "location": "Nancy",
      "promo": "2027",
      "bio": "Bilingue, je peux faire passer des oraux blancs de langue à qui veut.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/ines-lemoine/30min"
      }
    },
    {
      "id": "m09",
      "name": "Marc Fontaine",
      "initials": "MF",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Maths",
        "ESH"
      ],
      "location": "Marseille",
      "promo": "2028",
      "bio": "Filière peu représentée, je réponds volontiers aux questions dessus.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m10",
      "name": "Nour Diallo",
      "initials": "ND",
      "photo": null,
      "filiere": "Licence 2 Éco-Gestion",
      "matieres": [
        "Statistiques",
        "Microéconomie"
      ],
      "location": "Metz",
      "promo": "2028",
      "bio": "J'ai beaucoup galéré au premier semestre, je m'en sors mieux maintenant. Je peux rassurer ceux qui doutent.",
      "linkedin": "https://linkedin.com/in/nour-diallo",
      "website": null,
      "contact": {
        "label": "Contacter sur WhatsApp",
        "href": "https://wa.me/33612345678"
      }
    },
    {
      "id": "m11",
      "name": "Camille Barbier",
      "initials": "CB",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Maths",
        "Géopolitique"
      ],
      "location": "Lille",
      "promo": "2027",
      "bio": "Grosse expérience des concours blancs, je partage ma méthode de gestion du temps.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:camille-barbier@exemple.fr"
      }
    },
    {
      "id": "m12",
      "name": "Mehdi Renard",
      "initials": "MR",
      "photo": null,
      "filiere": "Prépa D1",
      "matieres": [
        "Droit",
        "Culture générale"
      ],
      "location": "Nice",
      "promo": "2027",
      "bio": "Dispo le soir en semaine pour réviser la culture générale ensemble.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/mehdi-renard/30min"
      }
    },
    {
      "id": "m13",
      "name": "Juliette Faure",
      "initials": "JF",
      "photo": null,
      "filiere": "Prépa PC",
      "matieres": [
        "Maths",
        "Chimie"
      ],
      "location": "Lille",
      "promo": "2027",
      "bio": "Je tiens un planning de révisions que je partage avec plaisir.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur Instagram",
        "href": "https://instagram.com/juliettefaure"
      }
    },
    {
      "id": "m14",
      "name": "Antoine Meyer",
      "initials": "AM",
      "photo": null,
      "filiere": "Prépa MP",
      "matieres": [
        "Maths",
        "Informatique"
      ],
      "location": "Toulouse",
      "promo": "2026",
      "bio": "Filière peu représentée, je réponds volontiers aux questions dessus.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:antoine-meyer@exemple.fr"
      }
    },
    {
      "id": "m15",
      "name": "Fatou Roy",
      "initials": "FR",
      "photo": null,
      "filiere": "Licence 2 Éco-Gestion",
      "matieres": [
        "Comptabilité",
        "Droit"
      ],
      "location": "Tours",
      "promo": "2028",
      "bio": "Je cherche des partenaires pour des mini-cas de stratégie en groupe.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m16",
      "name": "Louis Leclerc",
      "initials": "LL",
      "photo": null,
      "filiere": "ECT 2e année",
      "matieres": [
        "Anglais",
        "Espagnol"
      ],
      "location": "Strasbourg",
      "promo": "2026",
      "bio": "J'ai beaucoup galéré au premier semestre, je m'en sors mieux maintenant. Je peux rassurer ceux qui doutent.",
      "linkedin": "https://linkedin.com/in/louis-leclerc",
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/louis-leclerc/30min"
      }
    },
    {
      "id": "m17",
      "name": "Chloé Marchand",
      "initials": "CM",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "ESH",
        "Culture générale"
      ],
      "location": "Tours",
      "promo": "2027",
      "bio": "Bilingue, je peux faire passer des oraux blancs de langue à qui veut.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m18",
      "name": "Rayan Dupuis",
      "initials": "RD",
      "photo": null,
      "filiere": "Licence 3 Économie",
      "matieres": [
        "Marketing",
        "Management"
      ],
      "location": "Versailles",
      "promo": "2027",
      "bio": "Je cherche des partenaires pour des mini-cas de stratégie en groupe.",
      "linkedin": "https://linkedin.com/in/rayan-dupuis",
      "website": null,
      "contact": {
        "label": "Appeler",
        "href": "tel:0612345678"
      }
    },
    {
      "id": "m19",
      "name": "Manon Hamon",
      "initials": "MH",
      "photo": null,
      "filiere": "ECG 2e année",
      "matieres": [
        "Maths",
        "Espagnol"
      ],
      "location": "Metz",
      "promo": "2026",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/manon-hamon/30min"
      }
    },
    {
      "id": "m20",
      "name": "Karim Pires",
      "initials": "KP",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Anglais",
        "Allemand"
      ],
      "location": "Reims",
      "promo": "2027",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:karim-pires@exemple.fr"
      }
    },
    {
      "id": "m21",
      "name": "Emma Blin",
      "initials": "EB",
      "photo": null,
      "filiere": "Prépa D2",
      "matieres": [
        "Économie",
        "Sociologie"
      ],
      "location": "Rouen",
      "promo": "2026",
      "bio": null,
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m22",
      "name": "Baptiste Ollivier",
      "initials": "BO",
      "photo": null,
      "filiere": "Prépa B/L",
      "matieres": [
        "Sciences sociales",
        "Philosophie"
      ],
      "location": "Lyon",
      "promo": "2027",
      "bio": "Filière peu représentée, je réponds volontiers aux questions dessus.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/baptiste-ollivier/30min"
      }
    },
    {
      "id": "m23",
      "name": "Aya Vasseur",
      "initials": "AV",
      "photo": null,
      "filiere": "Prépa BCPST",
      "matieres": [
        "Maths",
        "SVT"
      ],
      "location": "Clermont-Ferrand",
      "promo": "2026",
      "bio": "Passé par la fac avant la prépa, je parle réorientation sans tabou.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Appeler",
        "href": "tel:0612345678"
      }
    },
    {
      "id": "m24",
      "name": "Gabriel Bouzid",
      "initials": "GB",
      "photo": null,
      "filiere": "Licence 2 Éco-Gestion",
      "matieres": [
        "Marketing",
        "Management"
      ],
      "location": "Poitiers",
      "promo": "2028",
      "bio": null,
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m25",
      "name": "Salomé Benkirane",
      "initials": "SB",
      "photo": null,
      "filiere": "ECG 2e année",
      "matieres": [
        "Maths",
        "Géopolitique"
      ],
      "location": "Rennes",
      "promo": "2027",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Appeler",
        "href": "tel:0612345678"
      }
    },
    {
      "id": "m26",
      "name": "Idris Perrin",
      "initials": "IP",
      "photo": null,
      "filiere": "Prépa D2",
      "matieres": [
        "Économie",
        "Sociologie"
      ],
      "location": "Paris",
      "promo": "2026",
      "bio": null,
      "linkedin": "https://linkedin.com/in/idris-perrin",
      "website": null,
      "contact": {
        "label": "Contacter sur WhatsApp",
        "href": "https://wa.me/33612345678"
      }
    },
    {
      "id": "m27",
      "name": "Jeanne Haddad",
      "initials": "JH",
      "photo": null,
      "filiere": "Bachelor Business",
      "matieres": [
        "Market sizing",
        "Anglais"
      ],
      "location": "Amiens",
      "promo": "2027",
      "bio": "Je bosse les maths appliquées à fond cette année. Dispo pour des colles blanches en visio le week-end.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/jeanne-haddad/30min"
      }
    },
    {
      "id": "m28",
      "name": "Nathan Lefèvre",
      "initials": "NL",
      "photo": null,
      "filiere": "Bachelor Business",
      "matieres": [
        "Market sizing",
        "Anglais"
      ],
      "location": "Nancy",
      "promo": "2027",
      "bio": "Je tiens un planning de révisions que je partage avec plaisir.",
      "linkedin": "https://linkedin.com/in/nathan-lefevre",
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:nathan-lefevre@exemple.fr"
      }
    },
    {
      "id": "m29",
      "name": "Lina Da Silva",
      "initials": "LD",
      "photo": null,
      "filiere": "Licence 2 Éco-Gestion",
      "matieres": [
        "Comptabilité",
        "Droit"
      ],
      "location": "Poitiers",
      "promo": "2028",
      "bio": "Je cherche des partenaires pour des mini-cas de stratégie en groupe.",
      "linkedin": "https://linkedin.com/in/lina-da-silva",
      "website": null,
      "contact": null
    },
    {
      "id": "m30",
      "name": "Paul Chevalier",
      "initials": "PC",
      "photo": null,
      "filiere": "Licence 1 Éco-Gestion",
      "matieres": [
        "Économétrie",
        "Statistiques"
      ],
      "location": "Amiens",
      "promo": "2029",
      "bio": "Je cherche des partenaires pour des mini-cas de stratégie en groupe.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Appeler",
        "href": "tel:0612345678"
      }
    },
    {
      "id": "m31",
      "name": "Yasmine El Amrani",
      "initials": "YE",
      "photo": null,
      "filiere": "Prépa PC",
      "matieres": [
        "Maths",
        "Chimie"
      ],
      "location": "Nancy",
      "promo": "2027",
      "bio": "Passé par la fac avant la prépa, je parle réorientation sans tabou.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m32",
      "name": "Adrien Girard",
      "initials": "AG",
      "photo": null,
      "filiere": "Prépa D1",
      "matieres": [
        "Droit",
        "Économie"
      ],
      "location": "Grenoble",
      "promo": "2027",
      "bio": "J'ai beaucoup galéré au premier semestre, je m'en sors mieux maintenant. Je peux rassurer ceux qui doutent.",
      "linkedin": "https://linkedin.com/in/adrien-girard",
      "website": null,
      "contact": {
        "label": "Contacter sur Instagram",
        "href": "https://instagram.com/adriengirard"
      }
    },
    {
      "id": "m33",
      "name": "Margaux Bertrand",
      "initials": "MB",
      "photo": null,
      "filiere": "Prépa PC",
      "matieres": [
        "Physique",
        "Chimie"
      ],
      "location": "Pau",
      "promo": "2027",
      "bio": "Grosse expérience des concours blancs, je partage ma méthode de gestion du temps.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:margaux-bertrand@exemple.fr"
      }
    },
    {
      "id": "m34",
      "name": "Sofiane Guerin",
      "initials": "SG",
      "photo": null,
      "filiere": "Prépa PC",
      "matieres": [
        "Maths",
        "Chimie"
      ],
      "location": "Orléans",
      "promo": "2027",
      "bio": null,
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur Instagram",
        "href": "https://instagram.com/sofianeguerin"
      }
    },
    {
      "id": "m35",
      "name": "Alice Ben Salah",
      "initials": "AB",
      "photo": null,
      "filiere": "Prépa D1",
      "matieres": [
        "Droit",
        "Économie"
      ],
      "location": "Le Havre",
      "promo": "2027",
      "bio": "Filière peu représentée, je réponds volontiers aux questions dessus.",
      "linkedin": "https://linkedin.com/in/alice-ben-salah",
      "website": null,
      "contact": null
    },
    {
      "id": "m36",
      "name": "Victor Colin",
      "initials": "VC",
      "photo": null,
      "filiere": "Licence 2 Éco-Gestion",
      "matieres": [
        "Économétrie",
        "Statistiques"
      ],
      "location": "Dijon",
      "promo": "2028",
      "bio": "Je peux échanger des fiches et des annales, envoyez-moi un message.",
      "linkedin": null,
      "website": null,
      "contact": null
    },
    {
      "id": "m37",
      "name": "Maëlys Boucher",
      "initials": "MB",
      "photo": null,
      "filiere": "ECG 1re année",
      "matieres": [
        "Maths",
        "Espagnol"
      ],
      "location": "Angers",
      "promo": "2028",
      "bio": "Passé par la fac avant la prépa, je parle réorientation sans tabou.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur LinkedIn",
        "href": "https://linkedin.com/in/maelys-boucher"
      }
    },
    {
      "id": "m38",
      "name": "Elias Cohen",
      "initials": "EC",
      "photo": null,
      "filiere": "ECT 1re année",
      "matieres": [
        "Management",
        "Économie"
      ],
      "location": "Nice",
      "promo": "2027",
      "bio": "Je peux échanger des fiches et des annales, envoyez-moi un message.",
      "linkedin": "https://linkedin.com/in/elias-cohen",
      "website": null,
      "contact": {
        "label": "Envoyer un email",
        "href": "mailto:elias-cohen@exemple.fr"
      }
    },
    {
      "id": "m39",
      "name": "Romane Payet",
      "initials": "RP",
      "photo": null,
      "filiere": "ECT 1re année",
      "matieres": [
        "Économie",
        "Droit"
      ],
      "location": "Paris",
      "promo": "2027",
      "bio": "Je peux échanger des fiches et des annales, envoyez-moi un message.",
      "linkedin": "https://linkedin.com/in/romane-payet",
      "website": null,
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/romane-payet/30min"
      }
    },
    {
      "id": "m40",
      "name": "Théo Schmitt",
      "initials": "TS",
      "photo": null,
      "filiere": "Professeur d'ESH",
      "matieres": [
        "Maths",
        "Géopolitique"
      ],
      "location": "Clermont-Ferrand",
      "promo": null,
      "bio": "J'enseigne en ECG. Dispo pour les questions de méthode et la structuration des dissertations.",
      "linkedin": null,
      "website": "https://theo-schmitt.fr",
      "contact": null
    },
    {
      "id": "m41",
      "name": "Anaïs Sow",
      "initials": "AS",
      "photo": null,
      "filiere": "Professeur de Maths",
      "matieres": [
        "Maths",
        "Informatique"
      ],
      "location": "Toulouse",
      "promo": null,
      "bio": "Prof de maths approfondies. Je peux relire des copies et pointer les erreurs de rédaction.",
      "linkedin": null,
      "website": "https://anais-sow.fr",
      "contact": {
        "label": "Prendre rendez-vous",
        "href": "https://calendly.com/anais-sow/30min"
      }
    },
    {
      "id": "m42",
      "name": "Wassim Carpentier",
      "initials": "WC",
      "photo": null,
      "filiere": "Colleur de Géopolitique",
      "matieres": [
        "Maths",
        "ESH"
      ],
      "location": "Clermont-Ferrand",
      "promo": null,
      "bio": "Colleur HGG depuis 6 ans. Je fais passer des oraux blancs sur les sujets d'actualité.",
      "linkedin": null,
      "website": null,
      "contact": {
        "label": "Contacter sur LinkedIn",
        "href": "https://linkedin.com/in/wassim-carpentier"
      }
    }
  ];

  /* --- Dépôt de la photo du membre connecté ----------------------------
     🔴 POURQUOI : l'API d'administration LearnWorlds n'expose AUCUNE photo
     (champs relevés le 29/07 : pas le moindre avatar), et l'URL n'est pas
     reconstructible (elle contient un hash propre au fichier envoyé). La seule
     source qui existe est `me.image` — que chaque membre a, mais UNIQUEMENT
     pour lui-même, dans sa propre session. Chacun dépose donc SA photo en
     passant ici, et l'annuaire se remplit tout seul, sans formulaire, sans
     fichier hébergé et sans rien à modérer.
     🔴 Le Worker n'accepte que les URLs servies par LearnWorlds : c'est ce qui
     rend cette écriture acceptable alors que Turnstile ne prouve pas l'identité.
     🔴 Un SECOND jeton Turnstile est nécessaire : celui de `charger()` a déjà
     servi et ils sont à usage unique. Widget invisible, rendu hors écran — un
     `display:none` empêcherait son exécution.
     Une fois par session et par membre : au-delà, on ne réécrit rien. */
  function deposerPhoto() {
    var u = null;
    try { u = (typeof me === "object" && me) ? me : null; } catch (e) { return; }
    if (!u || !u.id || !u.image) return;                 // anonyme, ou aucune photo de compte
    try { if (sessionStorage.getItem("psaPhoto") === String(u.id)) return; } catch (e) {}
    if (!window.turnstile) return;                        // API pas chargée : tant pis, ce n'est pas critique

    var boite = el("div", "");
    boite.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
    document.body.appendChild(boite);
    try {
      window.turnstile.render(boite, {
        sitekey: SITEKEY,
        callback: function (jeton2) {
          fetch(ENDPOINT + "photo", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Turnstile-Token": jeton2 },
            body: JSON.stringify({ id: String(u.id), url: String(u.image) }),
          })
            .then(function (r) {
              /* on ne retient le succès que s'il est réel : sinon on retentera
                 à la prochaine visite plutôt que de perdre la photo. */
              if (r.ok) { try { sessionStorage.setItem("psaPhoto", String(u.id)); } catch (e) {} }
            })
            .catch(function () {});
        },
        "error-callback": function () { return true; },   // silencieux : l'annuaire marche sans
      });
    } catch (e) {}
  }

  // --- Chargement -------------------------------------------------------
  function charger(jeton) {
    fetch(ENDPOINT, { headers: { Accept: "application/json", "X-Turnstile-Token": jeton } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        membres = Array.isArray(data.members) ? data.members : [];
        if (DEMO_FILL) membres = membres.concat(DEMO_MEMBERS.map(demoPhoto).map(demoEnrich));
        if (!membres.length) {
          grid.replaceChildren();
          count.textContent = "";
          empty.hidden = false;
          empty.textContent = "L'annuaire est encore vide. Les membres y apparaîtront dès qu'ils auront accepté d'y figurer.";
          return;
        }
        remplirFiltres();
        rendre();
        deposerPhoto();          // alimente l'annuaire avec la photo du visiteur
      })
      .catch(function (err) {
        console.error("[annuaire]", err);
        erreur("L'annuaire est momentanément indisponible. Réessayez dans quelques minutes.");
      });
  }

  // --- Titre de page ----------------------------------------------------
  /* Machine à écrire sur le H1, reprise telle quelle de case-cards.js pour que
     le titre soit indiscernable de ceux des autres pages. LearnWorlds sert le
     titre brut, "#" compris : c'est ce JS qui le transforme.
     Syntaxe : "Vos partenaires pour #le conseil #la stratégie" -> "Vos
     partenaires pour " reste fixe, les segments après chaque "#" défilent. */
  function hero() {
    var h1 = document.querySelector("#pageContent h1.learnworlds-heading");
    if (!h1 || h1.dataset.psTw) return;
    /* data-ps-tw posé AVANT toute autre condition : c'est lui qui lève le
       masquage CSS. Si on le posait seulement en cas de succès, un titre sans
       "#" resterait invisible pour toujours. */
    h1.dataset.psTw = "1";

    var raw = (h1.textContent || "").replace(/\s+/g, " ").trim();
    var i = raw.indexOf("#");
    if (i < 0) return; /* pas de # -> titre natif, rien à animer */
    var prefix = raw.slice(0, i).trim();
    var parts = raw.slice(i).split("#").map(function (s) { return s.trim(); }).filter(Boolean);
    if (!parts.length) return;

    /* Le texte animé est masqué aux lecteurs d'écran : on leur rend la phrase
       complète, sinon ils n'entendraient qu'un mot sur trois. */
    h1.setAttribute("aria-label", prefix + " " + parts.join(", "));

    var pre = document.createElement("span");
    pre.textContent = prefix + " "; /* textContent : pas d'injection HTML */
    var slot = document.createElement("span");
    /* 🔴 `wg-notranslate` : Weglot ne doit PAS toucher au slot animé. Sinon il le
       traduit pendant que notre minuteur y réécrit le français, chacun défaisant
       l'autre — le titre fait des allers-retours FR/EN sans fin. */
    slot.className = "ps-tw wg-notranslate";
    slot.setAttribute("aria-hidden", "true");
    var txt = document.createElement("span"); txt.className = "ps-tw-txt";
    var cur = document.createElement("span"); cur.className = "ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent = ""; h1.appendChild(pre); h1.appendChild(slot);
    /* 🔴 Le H1 ENTIER sort de la portée de Weglot : on le reconstruit en JS, donc
       Weglot sait traduire le préfixe mais ne sait plus le RESTAURER au retour à
       la langue d'origine — le préfixe restait bloqué en anglais sur une page
       repassée en français. On traduit donc tout nous-mêmes, ci-dessous. */
    h1.classList.add("wg-notranslate");

    /* Largeur réservée = phrase la plus longue, mesurée police chargée. Sans
       ça le titre tremble à chaque lettre. */
    function reserve() {
      var w = 0, keep = txt.textContent;
      slot.style.minWidth = "0px";
      parts.forEach(function (p) {
        txt.textContent = p;
        w = Math.max(w, txt.getBoundingClientRect().width);
      });
      txt.textContent = keep;
      slot.style.minWidth = Math.ceil(w) + "px";
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reserve); else reserve();
    var rt;
    window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(reserve, 150); });

    /* 🔴 TRADUCTION DES SEGMENTS ANIMÉS (porté de case-cards.js, 30/07) — ce bloc
       manquait ICI, et c'est toute l'explication du titre mal traduit sur cette
       page : `hero()` capture le texte UNE SEULE FOIS, reconstruit le H1 en JS,
       et sans ce bloc les segments restaient figés dans la langue capturée au
       chargement (le préfixe pouvant, lui, rester dans l'autre langue).
       Parade en deux temps :
         1. le slot et le H1 portent `wg-notranslate` -> Weglot n'y touche plus ;
         2. on traduit préfixe et segments NOUS-MÊMES via l'API Weglot, puis on
            anime le résultat. Retour à la langue d'origine -> phrases d'origine.
       🔴 Weglot est injecté par LearnWorlds APRÈS nous -> on réessaie ~16 s, et
       on s'abonne à « languageChanged » dès qu'il est disponible. */
    var PARTS0 = parts.slice(), PREFIX0 = prefix, twBound = false;
    var twRM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* list = [préfixe traduit, ...segments traduits] ; null = langue d'origine */
    function psTwApply(list) {
      pre.textContent = ((list && list[0]) || PREFIX0) + " ";
      for (var k = 0; k < parts.length; k++) parts[k] = (list && list[k + 1]) || PARTS0[k];
      h1.setAttribute("aria-label", pre.textContent + parts.join(", "));
      reserve();
      if (twRM) txt.textContent = parts[0];          /* pas d'animation : on repose la 1re phrase */
    }
    function psTwTr(evLang) {
      var W = window.Weglot;
      if (!W || !W.initialized || typeof W.translate !== "function") return false;
      if (!twBound) { try { W.on("languageChanged", psTwTr); twBound = true; } catch (e) {} }
      /* 🔴 « languageChanged » fournit la NOUVELLE langue en 1er argument. On DOIT
         l'utiliser : au moment du callback, getCurrentLang() peut encore renvoyer
         l'ANCIENNE -> en revenant au français on retraduisait vers l'anglais et le
         titre restait bloqué en anglais. */
      var to = (typeof evLang === "string" && evLang) ? evLang : W.getCurrentLang();
      var from = (W.options && W.options.language_from) || "fr";
      if (!to || to === from) { psTwApply(null); return true; }
      try {
        W.translate({ words: [{ t: 1, w: PREFIX0 }].concat(PARTS0.map(function (p) { return { t: 1, w: p }; })), languageTo: to },
          function (res) { if (res && res.length === PARTS0.length + 1) psTwApply(res); });
      } catch (e) {}
      return true;
    }
    if (!psTwTr()) { var twN = 0, twIv = setInterval(function () { if (psTwTr() || ++twN > 40) clearInterval(twIv); }, 400); }

    if (twRM) {
      txt.textContent = parts[0];
      return; /* pas d'animation si l'utilisateur la refuse */
    }

    /* La 1re phrase est affichée EN ENTIER dès le départ, le cycle ne démarre
       qu'après la pause. Sinon le slot part vide et se remplit lettre par
       lettre : ça se lit comme un retard d'affichage, pas comme une animation. */
    var p = 0, c = parts[0].length, del = true;
    txt.textContent = parts[0];
    function tick() {
      var full = parts[p];
      c += del ? -1 : 1;
      txt.textContent = full.slice(0, c);
      var d = del ? 34 : 58; /* frappe / effacement */
      if (!del && c >= full.length) { del = true; d = 1700; } /* pause phrase complète */
      else if (del && c <= 0) { del = false; p = (p + 1) % parts.length; d = 320; }
      setTimeout(tick, d);
    }
    setTimeout(tick, 1700); /* phrase lisible avant le 1er effacement */
  }

  /* Filet de sécurité du masquage CSS : si hero() n'avait jamais tourné, le
     titre resterait invisible. Au pire on le révèle brut au bout de 2,5s — un
     titre avec des "#" vaut mieux qu'un titre absent. */
  setTimeout(function () {
    var h = document.querySelector("#pageContent h1.learnworlds-heading");
    if (h && !h.dataset.psTw) h.dataset.psTw = "1";
  }, 2500);

  /* La description du hero. Repère : le seul `.learnworlds-main-text` situé
     AVANT l'annuaire — les autres sont dans le pied de page (contact,
     copyright). Sur les autres pages du repo c'est `.cards-grandpa` qui sert
     de frontière ; ici c'est `#psa-root`. */
  function desc(root) {
    document.querySelectorAll("#pageContent .learnworlds-main-text").forEach(function (e) {
      if (root.contains(e)) return;
      if (!(root.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING)) return;
      e.classList.add("ps-desc");
    });
  }

  // --- Montage ----------------------------------------------------------
  function construire(root) {
    root.replaceChildren();

    /* 🔴 UN `<form>`, PAS UN `<div>` — et ce n'est pas cosmétique.
       Les modales de connexion/inscription de LearnWorlds laissent 3 champs
       mot de passe ORPHELINS (hors de tout `<form>`) dans le DOM de chaque
       page. Chrome regroupe les champs orphelins entre eux : il voyait « un
       champ texte + des mots de passe » et concluait « formulaire de
       connexion », donc il remplissait l'email de l'utilisateur dans ma
       recherche. `autocomplete="off"` n'y change rien, Chrome l'ignore pour le
       remplissage d'identité. Donner un formulaire à mon champ le sort du
       groupe des orphelins : c'est ça qui règle le problème.
       Vérifié sur la page réelle le 17/07 : `#psa-root` n'est dans aucun
       formulaire, celui-ci n'est donc pas imbriqué (ce qui l'invaliderait). */
    var bar = el("form", "psa-bar");
    bar.setAttribute("autocomplete", "off");
    bar.addEventListener("submit", function (e) { e.preventDefault(); });

    qEl = el("input", "psa-input");
    qEl.type = "search";
    qEl.id = "psa-q";
    qEl.name = "psa-recherche";
    qEl.placeholder = "Rechercher un nom, une école, une langue…";
    qEl.autocomplete = "off";
    qEl.setAttribute("aria-label", "Rechercher dans l'annuaire");

    /* La pilule affiche le nom du champ ("Filière"), le menu porte le reset
       ("Toutes les filières") — comme les filtres "Année"/"Type" de la page Cas. */
    var ecoleBox = creerFacette("ecole", "École", "Toutes les écoles");
    ecoleBox.setAttribute("aria-label", "Filtrer par école");
    var niveauBox = creerFacette("niveau", "Niveau", "Tous les niveaux");
    niveauBox.setAttribute("aria-label", "Filtrer par niveau");
    var rechercheBox = creerFacette("recherche", "Recherche", "Toutes les recherches");
    rechercheBox.setAttribute("aria-label", "Filtrer par type de recherche");
    var langueBox = creerFacette("langue", "Langue", "Toutes les langues");
    langueBox.setAttribute("aria-label", "Filtrer par langue");

    bar.appendChild(qEl);
    bar.appendChild(ecoleBox);
    bar.appendChild(niveauBox);
    bar.appendChild(rechercheBox);
    bar.appendChild(langueBox);

    count = el("p", "psa-count");
    count.setAttribute("aria-live", "polite");
    grid = el("div", "psa-grid");
    empty = el("p", "psa-empty");
    empty.hidden = true;
    tsEl = el("div", "psa-turnstile");

    root.appendChild(bar);
    root.appendChild(count);
    root.appendChild(grid);
    root.appendChild(empty);
    root.appendChild(tsEl);

    var t;
    qEl.addEventListener("input", function () {
      clearTimeout(t);
      t = setTimeout(rendre, 120);
    });

    /* Ferme les menus au clic dehors et à Échap. Posé une seule fois : le
       flag survit aux remontages éventuels. Scopé sous #psa-root pour ne
       jamais interférer avec les filtres d'une autre page. */
    if (!window.__psaFacetBound) {
      window.__psaFacetBound = 1;
      document.addEventListener("click", function (e) {
        if (!e.target.closest || !e.target.closest("#" + MOUNT + " .ps-ff")) fermerFacettes();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") fermerFacettes();
      });
    }

    squelettes(8);
    turnstile();
  }

  /* Turnstile délivre un jeton à usage unique prouvant qu'on est un vrai
     navigateur. Sans lui le Worker ne renvoie rien : on n'appelle donc
     `charger` qu'une fois le jeton en main. */
  function turnstile() {
    window.psaTurnstileReady = function () {
      window.turnstile.render(tsEl, {
        sitekey: SITEKEY,
        callback: charger,
        "error-callback": function () {
          erreur("Impossible de vérifier votre navigateur. Rechargez la page pour réessayer.");
          return true; /* on gère l'erreur nous-mêmes */
        },
        /* Le jeton expire au bout de quelques minutes ; on en redemande un. */
        "expired-callback": function () { window.turnstile.reset(tsEl); },
      });
    };

    if (window.turnstile) { window.psaTurnstileReady(); return; }
    if (document.getElementById("psa-turnstile-api")) return;

    var s = document.createElement("script");
    s.id = "psa-turnstile-api";
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psaTurnstileReady&render=explicit";
    s.async = true;
    s.defer = true;
    s.onerror = function () {
      erreur("L'annuaire est momentanément indisponible. Réessayez dans quelques minutes.");
    };
    (document.head || document.documentElement).appendChild(s);
  }

  /* Le Site Builder construit la page progressivement : le point de montage
     peut n'exister qu'après nous. On attend, puis on renonce en le disant —
     un annuaire absent sans explication est le pire des cas. */
  function monter() {
    var root = document.getElementById(MOUNT);
    if (root) {
      if (root.dataset.psaMonte === "1") return;
      root.dataset.psaMonte = "1";
      desc(root);
      construire(root);
      return;
    }

    var obs = new MutationObserver(function () {
      if (document.getElementById(MOUNT)) { obs.disconnect(); monter(); }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(function () {
      obs.disconnect();
      if (!document.getElementById(MOUNT)) {
        console.warn('[annuaire] Aucun <div id="' + MOUNT + '"></div> sur la page : ' +
                     "ajoute-le dans un élément HTML là où l'annuaire doit apparaître.");
      }
    }, 10000);
  }

  /* ====================================================================
     BLOCS COMMUNAUTÉ (Slack / WhatsApp) — cartes modernes compactes
     --------------------------------------------------------------------
     Deux blocs de contenu LW (colonnes .col span_6_of_12) au-dessus de
     l'annuaire, repérés par le TEXTE de leur H2 (« Groupe Slack » / « Groupe
     Whatsapp »). On les transforme en cartes HORIZONTALES compactes (~77px) :
       [gros picto de marque] · titre + sous-titre · bouton « Rejoindre ».
     🔴 Titre ET sous-titre ont une taille posée par LW en CSS PAR-ID de widget
     (#el_...) qui bat nos classes → on force la taille en INLINE (seul l'inline
     !important gagne). 🔴 Largeur : la section est en conteneur « wide » (~1170px)
     plus large que le hero/annuaire (1000px, la boîte de #psa-root) → on contraint
     la rangée .lw-cols à max-width:1000 + marges auto pour l'aligner pile dessous.
     🔴 Les boutons N'ONT PAS de lien tant que Ziad ne l'ajoute pas dans le Site
     Builder (élément bouton → « Lien ») : invitation Slack + groupe WhatsApp. */
  var PSC = "body.slug-annuaire-partenaire-de-cas ";
  var COMM_CSS = [
    PSC + ".psa-comm{display:flex !important;flex-direction:row !important;align-items:center !important;gap:12px !important;background:#fff !important;border:1px solid #eceff3 !important;border-radius:16px !important;padding:12px 18px !important;text-align:left !important;box-shadow:0 6px 18px rgba(20,30,60,.05) !important;transition:transform .18s ease, box-shadow .18s ease !important;box-sizing:border-box !important;}",
    PSC + ".psa-comm:hover{transform:translateY(-2px) !important;box-shadow:0 12px 28px rgba(20,30,60,.1) !important;}",
    PSC + ".psa-comm-badge{flex:0 0 auto !important;width:46px !important;height:46px !important;border-radius:14px !important;display:flex !important;align-items:center !important;justify-content:center !important;margin:0 !important;}",
    PSC + ".psa-comm--slack .psa-comm-badge{background:#F5F1FB !important;border:1px solid #ece4f7 !important;}",
    PSC + ".psa-comm--wa .psa-comm-badge{background:#25D366 !important;box-shadow:0 6px 14px rgba(37,211,102,.3) !important;}",
    PSC + ".psa-comm-txt{display:flex !important;flex-direction:column !important;justify-content:center !important;min-width:0 !important;flex:1 1 auto !important;}",
    /* titre : couleur/poids ici, TAILLE en inline (cf. plus bas) */
    PSC + ".psa-comm h2.learnworlds-subheading{color:#243B6B !important;font-weight:700 !important;text-align:left !important;margin:0 !important;}",
    PSC + ".psa-comm h2.learnworlds-subheading::before{display:none !important;}",
    /* sous-titre : wrap autorisé (le picto domine la hauteur → reste compact) */
    PSC + ".psa-comm .learnworlds-main-text{color:#6B7280 !important;text-align:left !important;margin:1px 0 0 !important;white-space:normal !important;}",
    PSC + ".psa-comm .learnworlds-button-wrapper{margin:0 !important;flex:0 0 auto !important;width:auto !important;display:flex !important;align-items:center !important;}",
    PSC + ".psa-comm .learnworlds-button{display:inline-flex !important;align-items:center !important;padding:9px 20px !important;border-radius:999px !important;font-weight:700 !important;font-size:13.5px !important;font-family:Figtree,sans-serif !important;color:#fff !important;text-decoration:none !important;border:0 !important;white-space:nowrap !important;transition:filter .15s ease, transform .15s ease !important;}",
    PSC + ".psa-comm .learnworlds-button:hover{filter:brightness(1.08) !important;transform:translateY(-1px) !important;}",
    PSC + ".psa-comm--slack .learnworlds-button{background:#4A154B !important;}",
    PSC + ".psa-comm--wa .learnworlds-button{background:#25D366 !important;}",
    PSC + ".psa-comm-row{max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}"
  ].join("\n");

  var COMM_SLACK = '<svg viewBox="0 0 122.8 122.8" width="34" height="34" aria-hidden="true">'
    + '<path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#E01E5A"/>'
    + '<path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A"/>'
    + '<path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36C5F0"/>'
    + '<path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0"/>'
    + '<path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2EB67D"/>'
    + '<path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D"/>'
    + '<path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ECB22E"/>'
    + '<path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E"/></svg>';
  var COMM_WA = '<svg viewBox="0 0 448 512" width="32" height="32" aria-hidden="true"><path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.2-157zM223.9 438.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.5-186.6 184.5zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';

  function communityBlocks() {
    if (!document.getElementById("psa-comm-css")) {
      var st = document.createElement("style");
      st.id = "psa-comm-css";
      st.textContent = COMM_CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    function col(txt) {
      var h = [].slice.call(document.querySelectorAll("h2.learnworlds-subheading")).filter(function (x) {
        return (x.textContent || "").trim().toLowerCase().indexOf(txt) >= 0;
      })[0];
      if (!h) return null;
      var c = h;
      for (var i = 0; i < 8 && c; i++) { if (c.classList && c.classList.contains("col")) break; c = c.parentElement; }
      return (c && c.classList && c.classList.contains("col")) ? c : null;
    }
    function deco(txt, mod, svg) {
      var c = col(txt);
      if (!c) return;
      c.classList.add("psa-comm", mod);
      if (!c.querySelector(".psa-comm-badge")) {
        var b = document.createElement("div");
        b.className = "psa-comm-badge";
        b.innerHTML = svg;
        c.insertBefore(b, c.firstChild);
      }
      var h2 = c.querySelector("h2.learnworlds-subheading");
      var mt = c.querySelector(".learnworlds-main-text");
      if (h2 && !c.querySelector(".psa-comm-txt")) {
        var tw = document.createElement("div");
        tw.className = "psa-comm-txt";
        h2.parentNode.insertBefore(tw, h2);
        tw.appendChild(h2);
        if (mt) tw.appendChild(mt);
      }
      /* 🔴 Tailles en INLINE : le CSS par-ID de LW bat nos classes. */
      if (h2) { h2.style.setProperty("font-size", "16px", "important"); h2.style.setProperty("line-height", "1.2", "important"); }
      if (mt) { mt.style.setProperty("font-size", "12.5px", "important"); mt.style.setProperty("line-height", "1.25", "important"); }
      var btn = c.querySelector(".learnworlds-button, .learnworlds-button-wrapper a, .learnworlds-button-wrapper button");
      if (btn) { var lbl = btn.querySelector("span") || btn; if ((lbl.textContent || "").trim() !== "Rejoindre") lbl.textContent = "Rejoindre"; }
      /* aligne la rangée sur la largeur de la page (1000px, comme le hero) */
      var row = c.closest ? c.closest(".lw-cols") : null;
      if (row) row.classList.add("psa-comm-row");
    }
    deco("slack", "psa-comm--slack", COMM_SLACK);
    deco("whatsapp", "psa-comm--wa", COMM_WA);
  }

  /* Le titre est indépendant de l'annuaire : il doit s'animer même si le point
     de montage manque. D'où hero() ici et non dans monter() — sinon un oubli de
     <div id="psa-root"> laisserait le H1 masqué par le CSS, donc la page sans
     titre du tout. */
  function demarrer() {
    figtree();
    styles();
    hero();
    monter();
    /* Blocs communauté : rendus par le Site Builder, parfois APRÈS nous →
       on tente tout de suite puis on relance quelques fois (idempotent). */
    communityBlocks();
    [400, 1000, 2000, 3500].forEach(function (d) { setTimeout(communityBlocks, d); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
