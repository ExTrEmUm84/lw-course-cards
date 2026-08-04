/* ============================================================
   PAGE D'ABONNEMENT — deux formules, deux cartes
   https://extremum84.github.io/lw-course-cards/abonnement.js
   ------------------------------------------------------------
   Chargée par `tokens.js` sur `body.slug-abonnement` uniquement : Ziad crée la
   page dans LearnWorlds, il n'a aucun code personnalisé à poser.

   🔴🔴 LES PRIX AFFICHÉS ICI SONT ÉCRITS EN DUR, ET C'EST UN RISQUE ASSUMÉ.
   LearnWorlds ne donne pas de moyen de les lire depuis une autre page : les
   boutons d'achat de la page programme sont des `<div>` sans lien, le prix
   n'apparaît qu'au moment du paiement. Relevé le 04/08/2026 en chargeant les
   deux URL de paiement : `tier_6a7212438db3d` = 99 € par mois,
   `tier_6a721279a79f2` = 252 € tous les 3 mois.
   ⇒ **Changer un tarif dans LearnWorlds sans toucher ce fichier fait mentir la
   page.** Le garde-fou n'est pas technique, il est humain : c'est écrit ici, en
   haut, et rappelé dans les notes. Le client verra toutefois le vrai prix à
   l'écran de paiement avant de valider — l'écart est visible, jamais facturé.

   🔴 LES `packageId` SONT INDISPENSABLES ICI. Mesuré : sans lui,
   `/payment?product_id=collection-3-mois&type=learning_program` sélectionne
   **la formule mensuelle** en silence — la trimestrielle devient inatteignable.
   Mes notes disaient « ne jamais figer un packageId » : c'était vrai quand un
   seul plan existait. Avec deux formules, ne PAS le figer, c'est en cacher une.
   ⚠️ Si Ziad recrée un plan, l'identifiant change et le bouton mènera à la
   mauvaise formule. À revérifier à chaque changement de tarif.
   ============================================================ */
(function () {
  "use strict";

  /* 🔴 Le slug de la page, PAS le nom de ce fichier. Ziad renomme ses pages
     souvent — quatre slugs morts en une semaine début août — donc le fichier
     garde un nom qui décrit ce qu'il FAIT, et seule cette constante suit la
     page. Page créée le 04/08 sous `formules` (vérifié : `/formules` répond
     200, `/abonnement` est en 404). */
  var SLUG = "formules";

  /* ==================================================================
     LE TEXTE VIENT DU SITE BUILDER — ces valeurs ne sont qu'un REPLI
     ------------------------------------------------------------------
     Ziad doit pouvoir corriger un prix, un argument ou un libellé sans
     moi. Il écrit donc des lignes `clé : valeur` dans un bloc de texte
     normal de la page, et ce fichier les reprend.

     🔴 CONVENTION `clé : valeur`, PAS UN ORDRE DE LIGNES. La page
     d'inscription apparie ses lignes par position : une ligne déplacée
     et tout se décale, en silence. Ici une clé mal orthographiée garde
     simplement le repli ci-dessous — le pire cas est « ma correction
     n'apparaît pas », jamais « la page affiche autre chose ».
     🔴 SEULES LES CLÉS CONNUES SONT LUES. Sans ça, n'importe quelle
     phrase contenant deux-points ailleurs sur la page deviendrait un
     réglage.
     🔴 Les clés non reconnues sont SIGNALÉES en console : une faute de
     frappe qui ne fait rien est exactement le genre de silence qui fait
     perdre une demi-heure.
     ================================================================== */
  var CLES = [
    "surtitre","titre","description","produit",
    "f1-nom","f1-prix","f1-unite","f1-detail","f1-bouton","f1-package","f1-lien",
    "f2-nom","f2-prix","f2-unite","f2-detail","f2-bouton","f2-package","f2-lien","f2-badge",
    "inclus-titre",
    "inclus1-titre","inclus1-detail","inclus2-titre","inclus2-detail",
    "inclus3-titre","inclus3-detail","inclus4-titre","inclus4-detail",
    "pied"
  ];

  /* 🔴🔴 NI `innerText`, NI `textContent` — LES DEUX ÉCHOUENT ICI.
     `innerText` est conscient de la mise en page : sur un élément en
     `display:none` il renvoie une chaîne VIDE. Or on masque justement la
     section une fois lue… donc au passage suivant il n'y avait plus aucune
     clé, et la page se reconstruisait avec les valeurs par défaut. Le code
     effaçait sa propre lecture, un tour plus tard — trouvé au harnais, pas en
     production, en simulant une section qui arrive tardivement.
     `textContent`, lui, ignore la mise en page mais AVALE les retours à la
     ligne : `<p>a<br>b</p>` donne « ab », et le découpage en lignes tombe.
     ⇒ On lit le HTML en rétablissant les sauts de ligne. Sans état, sans
     cache : la lecture donne le même résultat que la section soit visible ou
     non, ce qui est exactement la propriété qui manquait. */
  function texteDe(el) {
    var h = (el && el.innerHTML) || "";
    h = h.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li|h[1-6]|section)>/gi, "\n");
    var tmp = document.createElement("div");
    tmp.innerHTML = h;
    return tmp.textContent || "";
  }

  /* Extrait les réglages d'un texte. Pure et testable : c'est elle qui décide
     ce que la page affiche, donc la seule à relire quand le résultat surprend. */
  function lireReglages(texte) {
    var out = {}, inconnues = [];
    String(texte || "").split(/\r?\n/).forEach(function (ligne) {
      var m = ligne.match(/^\s*([A-Za-z0-9_-]{2,20})\s*:\s*(\S.*?)\s*$/);
      if (!m) return;
      var cle = m[1].toLowerCase();
      if (CLES.indexOf(cle) >= 0) out[cle] = m[2];
      else if (/^(f1|f2|inclus\d?|titre|surtitre|description|pied)/.test(cle)) inconnues.push(cle);
    });
    return { valeurs: out, inconnues: inconnues };
  }

  /* Une entrée par formule. L'ordre est celui de l'affichage. */
  var FORMULES = [
    {
      cle: "mensuel",
      nom: "Mensuel",
      prix: "99 €",
      unite: "par mois",
      detail: "Sans engagement, résiliable à tout moment.",
      url: "/payment?product_id=collection-3-mois&type=learning_program&packageId=tier_6a7212438db3d",
      cta: "Choisir le mensuel",
      avant: false
    },
    {
      cle: "trimestriel",
      nom: "3 mois",
      prix: "84 €",
      unite: "par mois",
      /* 🔴 On annonce le prix MENSUEL pour que les deux cartes se comparent, et
         on dit immédiatement ce qui est réellement débité. Afficher 84 € sans
         préciser les 252 € prélevés en une fois serait exact et trompeur. */
      detail: "Facturé 252 € tous les 3 mois. Vous économisez 45 €.",
      url: "/payment?product_id=collection-3-mois&type=learning_program&packageId=tier_6a721279a79f2",
      cta: "Choisir les 3 mois",
      avant: true,
      badge: "−15 % par mois"
    }
  ];

  var INCLUS = [
    ["cours",    "60 cours",                 "Du screening à l'intégration en MBB"],
    ["cas",      "Études de cas",            "Cas réels de cabinets, corrigés"],
    ["fiches",   "Fiches cabinets et secteurs", "Pour arriver préparé en entretien"],
    ["annuaire", "Annuaire de partenaires",  "Pour vous entraîner à deux"]
  ];

  function slugCourant() {
    var b = document.body;
    var m = b && (b.className || "").match(/(?:^|\s)slug-([a-z0-9-]+)/i);
    if (m) return m[1];
    return (location.pathname || "").split("/").filter(Boolean).pop() || "";
  }

  /* Les pictos viennent de `mega-menu.js`, comme sur la page d'inscription : un
     troisième jeu dessiné à la main finirait par montrer autre chose que le site.
     🔴 La mise en page n'en DÉPEND PAS : sans eux, la ligne s'affiche nue. */
  function picto(cle) {
    try {
      if (typeof window.PS_MM_ICON === "function") return window.PS_MM_ICON(cle) || "";
    } catch (e) {}
    return "";
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var CSS = [
    "#ps-abo{max-width:1060px;margin:0 auto;padding:44px 20px 60px;font-family:var(--ps-font,Figtree,sans-serif);}",
    "#ps-abo .ps-abo-tete{text-align:center;margin-bottom:38px;}",
    "#ps-abo .ps-abo-sur{font:800 11px var(--ps-font,Figtree,sans-serif);text-transform:uppercase;letter-spacing:.14em;color:var(--ps-accent,#507EC5);}",
    "#ps-abo h2.ps-abo-t{font:800 34px/1.2 var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text,#1c1f26) !important;letter-spacing:-.02em !important;margin:10px 0 0 !important;}",
    "#ps-abo .ps-abo-d{font:400 15.5px/1.6 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);margin:12px auto 0;max-width:56ch;}",
    "#ps-abo .ps-abo-cartes{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:stretch;}",
    "#ps-abo .ps-abo-c{position:relative;display:flex;flex-direction:column;background:#fff;"+
      "border:1.5px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-card,16px);padding:30px 28px 28px;}",
    /* La formule mise en avant se distingue par le liseré d'accent, pas par une
       couleur de fond : le contenu doit rester lisible, c'est une page qui vend. */
    "#ps-abo .ps-abo-c.ps-abo-avant{border-color:var(--ps-accent,#507EC5);box-shadow:0 14px 38px rgba(var(--ps-accent-rgb,80,126,197),.16);}",
    "#ps-abo .ps-abo-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);"+
      "background:var(--ps-accent,#507EC5);color:#fff;border-radius:var(--ps-r-pill,999px);"+
      "padding:6px 16px;font:800 11.5px var(--ps-font,Figtree,sans-serif);letter-spacing:.04em;white-space:nowrap;}",
    "#ps-abo .ps-abo-nom{font:800 17px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);}",
    "#ps-abo .ps-abo-prix{display:flex;align-items:baseline;gap:8px;margin-top:12px;}",
    "#ps-abo .ps-abo-prix b{font:800 42px/1 var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);letter-spacing:-.03em;}",
    "#ps-abo .ps-abo-prix span{font:600 14px var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);}",
    "#ps-abo .ps-abo-det{margin-top:10px;font:400 13.5px/1.55 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);min-height:42px;}",
    "#ps-abo .ps-abo-cta{display:block;margin-top:20px;text-align:center;text-decoration:none;"+
      "border-radius:var(--ps-r-btn,10px);padding:14px 18px;font:800 14.5px var(--ps-font,Figtree,sans-serif);"+
      "background:#fff;color:var(--ps-accent,#507EC5);border:1.5px solid var(--ps-accent,#507EC5);transition:.16s;}",
    "#ps-abo .ps-abo-cta:hover{background:var(--ps-accent-tint,#edf4ff);}",
    "#ps-abo .ps-abo-avant .ps-abo-cta{background:var(--ps-accent,#507EC5);color:#fff;}",
    "#ps-abo .ps-abo-avant .ps-abo-cta:hover{background:var(--ps-accent-hover,#486798);}",
    "#ps-abo .ps-abo-inclus{margin-top:38px;background:#fff;border:1px solid var(--ps-border,#E6E9EF);"+
      "border-radius:var(--ps-r-card,16px);padding:26px 28px;}",
    "#ps-abo .ps-abo-it{font:800 12px var(--ps-font,Figtree,sans-serif);text-transform:uppercase;letter-spacing:.12em;color:var(--ps-text-soft,#676879);margin-bottom:18px;}",
    "#ps-abo .ps-abo-liste{display:grid;grid-template-columns:1fr 1fr;gap:16px 30px;}",
    "#ps-abo .ps-abo-l{display:flex;gap:12px;align-items:flex-start;}",
    "#ps-abo .ps-abo-ic{flex:none;width:30px;height:30px;border-radius:9px;background:var(--ps-accent-tint,#edf4ff);"+
      "color:var(--ps-accent,#507EC5);display:flex;align-items:center;justify-content:center;}",
    "#ps-abo .ps-abo-ic svg{width:16px;height:16px;}",
    "#ps-abo .ps-abo-ln{font:700 14px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);}",
    "#ps-abo .ps-abo-ls{font:400 13px/1.45 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);}",
    "#ps-abo .ps-abo-pied{margin-top:20px;text-align:center;font:400 12.5px/1.6 var(--ps-font,Figtree,sans-serif);color:#9AA0B0;}",
    "@media(max-width:760px){#ps-abo .ps-abo-cartes{grid-template-columns:1fr;gap:26px;}"+
      "#ps-abo .ps-abo-liste{grid-template-columns:1fr;}#ps-abo h2.ps-abo-t{font-size:27px !important;}}"
  ].join("\n");

  function poserCSS() {
    if (document.getElementById("ps-abo-css")) return;
    var s = document.createElement("style");
    s.id = "ps-abo-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  var PRODUIT_DEFAUT = "collection-3-mois";

  /* 🔴 L'IDENTIFIANT DE FORMULE EST VÉRIFIÉ AVANT D'ÊTRE UTILISÉ. Un `tier_…`
     tronqué au copier-coller enverrait vers un paiement cassé, ou pire vers la
     mauvaise formule — et rien ne le dirait. Une valeur qui n'a pas la forme
     attendue est donc ignorée : on garde le lien de repli, qui marche. */
  function lienFormule(pkg, produit, repli) {
    if (!/^tier_[A-Za-z0-9]{6,}$/.test(String(pkg || ""))) return repli;
    return "/payment?product_id=" + encodeURIComponent(produit || PRODUIT_DEFAUT) +
           "&type=learning_program&packageId=" + encodeURIComponent(pkg);
  }

  /* Applique les réglages du Site Builder par-dessus les replis. */
  function fusionner(v) {
    var f = JSON.parse(JSON.stringify(FORMULES));
    [0, 1].forEach(function (i) {
      var p = "f" + (i + 1) + "-";
      ["nom", "prix", "unite", "detail"].forEach(function (k) {
        if (v[p + k]) f[i][k] = v[p + k];
      });
      if (v[p + "bouton"]) f[i].cta = v[p + "bouton"];
      if (i === 1 && v["f2-badge"]) f[i].badge = v["f2-badge"];
      /* `lien` (URL complète) reste la porte de sortie si un jour LearnWorlds
         change la forme de ses URL de paiement. Sinon, `package` suffit. */
      f[i].url = v[p + "lien"] || lienFormule(v[p + "package"], v.produit, f[i].url);
    });
    var inc = INCLUS.map(function (l, i) {
      var p = "inclus" + (i + 1) + "-";
      return [l[0], v[p + "titre"] || l[1], v[p + "detail"] || l[2]];
    });
    return { formules: f, inclus: inc };
  }

  /* 🔴🔴 ON RELIT À CHAQUE PASSAGE, ET C'EST TOUT LE CORRECTIF (04/08, soir).
     Première version : `if (document.getElementById("ps-abo")) return true;` en
     tête — construire une bonne fois, puis ne plus rien faire. Or le Site
     Builder peint PAR ÉTAPES : au premier passage (400 ms) la section de texte
     de Ziad n'existait pas encore, la page se construisait donc avec les valeurs
     par défaut, et les relances suivantes sortaient aussitôt. Résultat mesuré en
     production : prix modifié dans le Builder, page inchangée, section de
     réglages même pas masquée — la preuve qu'elle n'avait jamais été lue.
     🔴 C'est EXACTEMENT le piège déjà documenté pour le découpage du formulaire
     d'inscription. Je l'avais écrit, cité le jour même, et reproduit.
     ⇒ On relit à chaque passage et on ne reconstruit que si le texte a changé
     (signature) : pas de scintillement, et la page rattrape l'arrivée tardive
     de la section quel qu'en soit le délai. */
  function construire() {
    var hote = document.getElementById("pageContent");
    if (!hote) return false;

    /* ── Le texte de Ziad, lu dans les sections de la page ────────────────
       🔴 On MASQUE la section qui porte les réglages, on ne la supprime pas :
       le Site Builder la republie à chaque édition, et Ziad doit continuer de
       la voir et de la modifier dans l'éditeur. La supprimer ferait
       disparaître son texte sans qu'il puisse le retrouver. */
    var reglages = {}, inconnues = [];
    var barreSection = null;
    var barre0 = hote.querySelector("nav.lw-topbar-menu, .lw-topbar, [class*='topbar']");
    if (barre0) barreSection = barre0.closest("#pageContent > *");
    [].slice.call(hote.children).forEach(function (sec) {
      if (sec === barreSection || sec.id === "ps-abo") return;
      var lu = lireReglages(texteDe(sec));
      var n = Object.keys(lu.valeurs).length;
      if (n < 2) return;                       /* pas la section de réglages */
      Object.keys(lu.valeurs).forEach(function (k) { reglages[k] = lu.valeurs[k]; });
      inconnues = inconnues.concat(lu.inconnues);
      sec.style.display = "none";
    });
    if (inconnues.length) {
      try { console.warn("[PrepaStrat] Page formules — clés non reconnues, donc ignorées : " +
        inconnues.join(", ") + ". Vérifier l'orthographe."); } catch (e) {}
    }

    /* La signature, c'est le texte lu. Tant qu'il ne bouge pas, on ne touche à
       rien — donc aucun scintillement malgré les relances. Dès qu'il bouge (la
       section arrive enfin, ou Ziad republie), on refait le contenu. */
    var signature = JSON.stringify(reglages);
    var box = document.getElementById("ps-abo");
    if (box && box.getAttribute("data-ps-sig") === signature) return true;

    var donnees = fusionner(reglages);

    poserCSS();
    var neuf = !box;
    if (neuf) { box = document.createElement("div"); box.id = "ps-abo"; }
    box.setAttribute("data-ps-sig", signature);

    var cartes = donnees.formules.map(function (f) {
      return '<div class="ps-abo-c' + (f.avant ? " ps-abo-avant" : "") + '">' +
        (f.badge ? '<span class="ps-abo-badge">' + esc(f.badge) + "</span>" : "") +
        '<div class="ps-abo-nom">' + esc(f.nom) + "</div>" +
        '<div class="ps-abo-prix"><b>' + esc(f.prix) + "</b><span>" + esc(f.unite) + "</span></div>" +
        '<div class="ps-abo-det">' + esc(f.detail) + "</div>" +
        '<a class="ps-abo-cta" href="' + esc(f.url) + '">' + esc(f.cta) + "</a>" +
        "</div>";
    }).join("");

    var liste = donnees.inclus.map(function (i) {
      return '<div class="ps-abo-l"><span class="ps-abo-ic">' + picto(i[0]) + "</span>" +
        '<div><div class="ps-abo-ln">' + esc(i[1]) + '</div><div class="ps-abo-ls">' + esc(i[2]) + "</div></div></div>";
    }).join("");

    var r = reglages;
    box.innerHTML =
      '<div class="ps-abo-tete">' +
        '<div class="ps-abo-sur">' + esc(r.surtitre || "Accès complet") + "</div>" +
        '<h2 class="ps-abo-t">' + esc(r.titre || "Tout le catalogue, un seul accès") + "</h2>" +
        '<p class="ps-abo-d">' + esc(r.description ||
          "Les 60 cours, les études de cas, les fiches cabinets et secteurs, et l'annuaire " +
          "pour vous entraîner à deux. Une seule formule à choisir.") + "</p>" +
      "</div>" +
      '<div class="ps-abo-cartes">' + cartes + "</div>" +
      '<div class="ps-abo-inclus"><div class="ps-abo-it">' +
        esc(r["inclus-titre"] || "Compris dans les deux formules") + "</div>" +
        '<div class="ps-abo-liste">' + liste + "</div></div>" +
      '<p class="ps-abo-pied">' + esc(r.pied ||
        "Paiement sécurisé par Stripe. Vous gérez ou résiliez votre abonnement depuis votre page Mon compte.") +
        "</p>";

    /* 🔴 APRÈS la section qui porte la barre de navigation — le header EST une
       section de `#pageContent`. Piège déjà payé une fois sur `/inscription` :
       inséré en premier, mon bloc poussait le menu sous lui, en production. */
    if (neuf) {
      var barre = hote.querySelector("nav.lw-topbar-menu, .lw-topbar, [class*='topbar']");
      var sectionBarre = barre && barre.closest("#pageContent > *");
      if (sectionBarre && sectionBarre.parentElement === hote) hote.insertBefore(box, sectionBarre.nextSibling);
      else hote.appendChild(box);
    }
    return true;
  }

  function demarrer() {
    if (slugCourant() !== SLUG) return;
    construire();
  }

  if (document.readyState !== "loading") demarrer();
  else document.addEventListener("DOMContentLoaded", demarrer);
  /* 🔴 Le Site Builder peint par étapes, et mesuré sur ce site il lui faut
     parfois 5 à 8 secondes. Les relances vont donc plus loin que sur les autres
     pages : c'est le délai réel qui a fait rater la section de réglages. */
  [400, 1200, 2500, 5000, 8000, 12000].forEach(function (d) { setTimeout(demarrer, d); });
})();
