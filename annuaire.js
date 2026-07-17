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
    R + "{" +
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif);" +
      "font-size:15px;text-align:left;" +
      "color:var(--ps-text,#1c1f26);" +
      "max-width:1120px;margin:0 auto;padding:8px 16px 48px;" +
      "line-height:1.5;box-sizing:border-box;}",
    R + "*," + R + "*::before," + R + "*::after{box-sizing:inherit;}",

    /* Barre de recherche */
    R + ".psa-bar{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;}",
    R + ".psa-input," + R + ".psa-select{" +
      "font:inherit;color:inherit;padding:11px 14px;" +
      "border:1px solid var(--ps-border,#E6E9EF);" +
      "border-radius:var(--ps-r-btn,10px);background:#fff;outline:none;}",
    R + ".psa-input{flex:1 1 280px;min-width:0;}",
    R + ".psa-select{flex:0 0 auto;cursor:pointer;}",
    R + ".psa-input:focus," + R + ".psa-select:focus{" +
      "border-color:var(--ps-accent,#6161FF);" +
      "box-shadow:0 0 0 3px rgba(var(--ps-accent-rgb,97,97,255),.18);}",
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

    R + ".psa-links{margin-top:auto;padding-top:16px;display:flex;gap:14px;}",
    R + ".psa-link{font-size:13px;font-weight:600;color:var(--ps-accent,#6161FF);text-decoration:none;}",
    R + ".psa-link:hover{text-decoration:underline;}",

    /* États */
    R + ".psa-empty," + R + ".psa-error{color:var(--ps-text-soft,#676879);font-size:15px;padding:32px 0;text-align:center;}",
    R + ".psa-turnstile{display:flex;justify-content:center;margin-top:24px;}",
    R + ".psa-turnstile:empty{display:none;}",
    R + ".psa-skeleton{height:218px;border-radius:var(--ps-r-card,16px);" +
      "background:linear-gradient(90deg,var(--ps-surface-soft,#F7F8FB) 25%,var(--ps-border,#E6E9EF) 37%,var(--ps-surface-soft,#F7F8FB) 63%);" +
      "background-size:400% 100%;animation:psa-shimmer 1.3s ease-in-out infinite;}",
    "@keyframes psa-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}",

    "@media (max-width:520px){" + R + ".psa-select{flex:1 1 100%;}}",
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
    "#pageContent h2.learnworlds-subheading{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:34px !important;font-weight:800 !important;letter-spacing:-.02em !important;line-height:1.2 !important;color:var(--ps-text,#1c1f26) !important;text-align:left !important;max-width:1000px !important;margin-left:auto !important;margin-right:auto !important;}",
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
  var grid, count, empty, qEl, promoEl, filiereEl, tsEl;

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

  /** Construit la carte via le DOM — jamais innerHTML avec des données membres :
      une bio contenant du HTML doit s'afficher comme du texte, pas s'exécuter. */
  function carte(m) {
    var c = el("article", "psa-card");

    if (m.photo) {
      var img = el("img", "psa-avatar");
      img.src = m.photo;
      img.alt = "";
      img.loading = "lazy";
      c.appendChild(img);
    } else {
      var av = el("div", "psa-avatar", m.initials || "?");
      var h = hueOf(m.name || "");
      av.style.background = "linear-gradient(135deg,hsl(" + h + " 62% 52%),hsl(" + ((h + 40) % 360) + " 62% 44%))";
      av.setAttribute("aria-hidden", "true");
      c.appendChild(av);
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
    if (links.childNodes.length) c.appendChild(links);

    return c;
  }

  function botteDeFoin(m) {
    return [m.name, m.filiere, m.location, m.promo]
      .concat(m.matieres || [])
      .filter(Boolean).join(" ").toLowerCase();
  }

  function rendre() {
    var q = qEl.value.trim().toLowerCase();
    var promo = promoEl.value;
    var filiere = filiereEl.value;

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

  /** Remplit un <select> avec les valeurs réellement présentes chez les membres. */
  function remplirSelect(sel, valeurs, tri) {
    var vues = {};
    valeurs.filter(Boolean).forEach(function (v) { vues[v] = 1; });
    Object.keys(vues).sort(tri).forEach(function (v) {
      var o = document.createElement("option");
      o.value = o.textContent = v;
      sel.appendChild(o);
    });
  }

  function remplirFiltres() {
    /* Promos décroissantes : la sortie la plus proche en premier. */
    remplirSelect(promoEl, membres.map(function (m) { return m.promo; }), function (a, b) {
      return String(b).localeCompare(String(a), "fr", { numeric: true });
    });
    remplirSelect(filiereEl, membres.map(function (m) { return m.filiere; }), function (a, b) {
      return String(a).localeCompare(String(b), "fr", { numeric: true });
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

  // --- Chargement -------------------------------------------------------
  function charger(jeton) {
    fetch(ENDPOINT, { headers: { Accept: "application/json", "X-Turnstile-Token": jeton } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        membres = Array.isArray(data.members) ? data.members : [];
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

    filiereEl = el("select", "psa-select");
    filiereEl.setAttribute("aria-label", "Filtrer par filière");
    filiereEl.appendChild(new Option("Toutes les filières", ""));

    promoEl = el("select", "psa-select");
    promoEl.setAttribute("aria-label", "Filtrer par promo");
    promoEl.appendChild(new Option("Toutes les promos", ""));

    bar.appendChild(qEl);
    bar.appendChild(filiereEl);
    bar.appendChild(promoEl);

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
    promoEl.addEventListener("change", rendre);
    filiereEl.addEventListener("change", rendre);

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
