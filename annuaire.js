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
    R + ".psa-filiere{margin:3px 0 0;font-size:14px;font-weight:600;color:var(--ps-accent,#6161FF);}",
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
    R + ".psa-chip-btn:hover{background:var(--ps-accent,#6161FF);color:#fff;}",
    R + ".psa-chip-btn:focus-visible{outline:2px solid var(--ps-accent,#6161FF);outline-offset:2px;}",

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
      "border-radius:var(--ps-r-btn,10px);background:var(--ps-accent,#6161FF) !important;color:#fff !important;" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);" +
      "font-size:13.5px;font-weight:600;text-decoration:none !important;transition:background .15s ease;}",
    R + ".psa-contact:hover{background:var(--ps-accent-hover,#4B4BE0) !important;color:#fff !important;}",
    R + ".psa-contact:focus-visible{outline:2px solid var(--ps-accent,#6161FF);outline-offset:2px;}",
    R + ".psa-links{display:flex;gap:14px;}",
    /* Mêmes <a>, même écrasement LW : on force la couleur violette. */
    R + ".psa-link{font-size:13px;font-weight:600;color:var(--ps-accent,#6161FF) !important;text-decoration:none !important;}",
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
    "#pageContent h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-accent,#6161FF) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
    /* `.learnworlds-main-text` existe aussi dans le pied de page : on ne stylise
       que la description marquée en JS (cf. hero), jamais la classe nue. */
    "#pageContent .ps-desc{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:17px !important;line-height:1.65 !important;color:var(--ps-text-soft,#676879) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;padding-right:38% !important;}",
    /* Machine à écrire : le slot réserve la largeur de la phrase la plus longue
       pour que le titre ne tremble pas à chaque lettre. */
    ".ps-tw{display:inline-block !important;text-align:left !important;color:var(--ps-accent,#6161FF) !important;white-space:nowrap !important;}",
    ".ps-tw-cur{display:inline-block !important;width:3px !important;height:.86em !important;background:var(--ps-accent,#6161FF) !important;margin-left:5px !important;vertical-align:-.06em !important;border-radius:2px !important;animation:ps-blink 1.05s steps(1) infinite !important;}",
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
     <select> — les facettes .ps-ff n'ont pas de valeur native. */
  var filtre = { filiere: "", promo: "" };
  var facettes = {}; /* key -> { box, label, resetTxt, valeurs } */

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
    if (m.filiere) c.appendChild(el("p", "psa-filiere", m.filiere));

    var meta = [m.promo ? "Promo " + m.promo : null, m.location].filter(Boolean).join(" · ");
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
    return [m.name, m.filiere, m.location, m.promo]
      .concat(m.matieres || [])
      .filter(Boolean).join(" ").toLowerCase();
  }

  function rendre() {
    var q = qEl.value.trim().toLowerCase();
    var promo = filtre.promo;
    var filiere = filtre.filiere;

    var vus = membres.filter(function (m) {
      return (!promo || String(m.promo) === promo) &&
             (!filiere || m.filiere === filiere) &&
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
    membres.map(function (m) { return m[cle]; }).filter(Boolean).forEach(function (v) { vues[v] = 1; });
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
    /* Promos décroissantes (sortie la plus proche en premier), filières A→Z. */
    facettes.promo.valeurs = distinctes("promo", function (a, b) {
      return String(b).localeCompare(String(a), "fr", { numeric: true });
    });
    facettes.filiere.valeurs = distinctes("filiere", function (a, b) {
      return String(a).localeCompare(String(b), "fr", { numeric: true });
    });
    peindreFacette("filiere");
    peindreFacette("promo");
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

  // --- Chargement -------------------------------------------------------
  function charger(jeton) {
    fetch(ENDPOINT, { headers: { Accept: "application/json", "X-Turnstile-Token": jeton } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        membres = Array.isArray(data.members) ? data.members : [];
        if (DEMO_FILL) membres = membres.concat(DEMO_MEMBERS.map(demoPhoto));
        if (!membres.length) {
          grid.replaceChildren();
          count.textContent = "";
          empty.hidden = false;
          empty.textContent = "L'annuaire est encore vide. Les membres y apparaîtront dès qu'ils auront accepté d'y figurer.";
          return;
        }
        remplirFiltres();
        rendre();
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
    slot.className = "ps-tw";
    slot.setAttribute("aria-hidden", "true");
    var txt = document.createElement("span"); txt.className = "ps-tw-txt";
    var cur = document.createElement("span"); cur.className = "ps-tw-cur";
    slot.appendChild(txt); slot.appendChild(cur);
    h1.textContent = ""; h1.appendChild(pre); h1.appendChild(slot);

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

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
    qEl.placeholder = "Rechercher un nom, une filière, une matière…";
    qEl.autocomplete = "off";
    qEl.setAttribute("aria-label", "Rechercher dans l'annuaire");

    /* La pilule affiche le nom du champ ("Filière"), le menu porte le reset
       ("Toutes les filières") — comme les filtres "Année"/"Type" de la page Cas. */
    var filiereBox = creerFacette("filiere", "Filière", "Toutes les filières");
    filiereBox.setAttribute("aria-label", "Filtrer par filière");
    var promoBox = creerFacette("promo", "Promo", "Toutes les promos");
    promoBox.setAttribute("aria-label", "Filtrer par promo");

    bar.appendChild(qEl);
    bar.appendChild(filiereBox);
    bar.appendChild(promoBox);

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

  /* Le titre est indépendant de l'annuaire : il doit s'animer même si le point
     de montage manque. D'où hero() ici et non dans monter() — sinon un oubli de
     <div id="psa-root"> laisserait le H1 masqué par le CSS, donc la page sans
     titre du tout. */
  function demarrer() {
    figtree();
    styles();
    hero();
    monter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
