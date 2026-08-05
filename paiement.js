/* ============================================================
   PAGE DE PAIEMENT — /payment
   https://extremum84.github.io/lw-course-cards/paiement.js
   ------------------------------------------------------------
   Chargée par `tokens.js` sur `/payment` uniquement. Ziad n'a aucun code
   personnalisé à poser — et il ne POURRAIT pas : mesuré le 05/08, cette page ne
   reçoit que quatre loaders (`mega-menu`, `account-page`, `tokens`, `footer`).
   `inscription.js` n'y est PAS chargé, ce qui a déjà coûté une demi-journée : du
   code juste, écrit au mauvais endroit, ne s'exécute jamais et sans erreur.

   C'est le dernier écran avant de payer. Il portait encore le style brut de
   LearnWorlds : champs gris à coins carrés, titres hors DA, quatre pastilles de
   connexion sociale au milieu du tunnel, et un cadre d'image produit VIDE —
   des rayures grises à la place d'une illustration.

   🔴🔴 CE FICHIER NE TOUCHE PAS AU PAIEMENT. Il n'habille que ce qui entoure :
   le bloc Stripe vit dans une iframe, et rien ici ne la vise. On ne déplace
   aucun nœud, on ne recrée aucun bouton — la leçon des connexions sociales de
   `/inscription`, où déplacer un élément casse une délégation qu'on ne voit
   pas. Uniquement du CSS, sur des sélecteurs relevés en direct.

   🔴 LES CONNEXIONS SOCIALES SONT RETIRÉES ICI, ET SEULEMENT ICI (demande de
   Ziad). Ailleurs elles restent le chemin le plus court vers un compte. Mais
   sur un écran de paiement, elles proposent de repartir s'authentifier au
   moment précis où quelqu'un sort sa carte : un détour, pas un raccourci.
   ⚠️ Le bloc s'appelle `pm-form-social-buts` ici — préfixe `pm-`, différent du
   `-form-social-buttons` de la modale. Réutiliser le sélecteur de la modale
   n'aurait rien masqué du tout.
   ============================================================ */
(function () {
  "use strict";

  window.PS_PAIEMENT_V = "2026-08-05-a";

  /* 🔴 Le test porte sur le CHEMIN et pas sur `body.slug-…` : cette page est
     servie par LearnWorlds, pas construite dans le Site Builder, et elle ne
     porte pas de slug exploitable. Vérifié : `/payment?product_id=…`. */
  if (!/^\/payment(\/|$)/.test(location.pathname || "")) return;

  var S = "body ";   /* portée : la page entière, elle n'est servie que là */

  var CSS = [
    /* ---------- fond et respiration ---------- */
    S + ".payment-section{background:var(--ps-surface-soft,#F7F8FB) !important;}",
    S + ".payment-section .learnworlds-section-content{padding-top:28px !important;padding-bottom:40px !important;}",

    /* ---------- les deux colonnes deviennent des cartes ----------
       🔴 `align-items:flex-start` sur la rangée : sans ça la colonne de droite
       s'étire à la hauteur du formulaire et le récapitulatif flotte au milieu
       d'un grand vide blanc. */
    S + ".payment-section .lw-cols.no-gutter.one-row{gap:24px !important;align-items:flex-start !important;}",
    S + ".payment-section .col.span_8_of_12,"+
    S + ".payment-section .col.span_4_of_12{background:#fff !important;border:1px solid var(--ps-border,#E6E9EF) !important;"+
      "border-radius:var(--ps-r-card,16px) !important;box-shadow:0 10px 30px rgba(32,56,102,.06) !important;"+
      "padding:28px 26px !important;}",

    /* ---------- UNE SEULE POLICE ----------
       🔴🔴 TROIS POLICES COHABITAIENT SUR CET ÉCRAN, mesuré le 05/08 : Figtree
       (nos titres), **Raleway** (la plupart des textes) et **Poppins** (les
       surtitres). Ma première version ne visait que les titres et les libellés,
       donc elle a en réalité AGGRAVÉ l'écart : deux polices soignées à côté de
       deux polices d'origine. Sur la page où l'on demande une carte bancaire,
       cette incohérence se lit comme un site mal fini.
       🔴🔴 LES ICÔNES SONT EXCLUES, ET C'EST INDISPENSABLE. FontAwesome affiche
       ses pictogrammes AVEC une police : forcer `font-family` sur eux les
       transformerait en lettres. Six icônes sur cette page (relevé). */
    S + ".payment-section :not(.learnworlds-icon):not([class*='fa-']):not(i){"+
      "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;}",

    /* ---------- titres ---------- */
    /* 🔴 `text-transform:capitalize` VENAIT DE LEARNWORLDS, pas d'une saisie :
       le texte est « Détails de la commande », c'est le CSS qui affichait
       « Détails De La Commande ». Les capitales de titre à l'anglaise ne se
       font pas en français — et corriger la saisie n'aurait rien changé. */
    S + ".payment-section .learnworlds-heading3,"+
    S + ".payment-section h1,"+S+".payment-section h2,"+S+".payment-section h4{"+
      "text-transform:none !important;}",
    S + ".payment-section .learnworlds-heading3{font-family:var(--ps-font,Figtree,sans-serif) !important;"+
      "color:var(--ps-text,#203866) !important;font-size:24px !important;line-height:1.25 !important;"+
      "margin:0 0 20px !important;letter-spacing:-.01em !important;}",
    /* 🔴🔴 SURTITRE : RESTREINT AU RÉCAPITULATIF, ET J'AI PAYÉ POUR L'APPRENDRE.
       J'avais visé `.learnworlds-overline-text` sur toute la page pour habiller
       « Programme d'apprentissage ». Or les LIBELLÉS DES CHAMPS portent la même
       classe : j'ai donc mis « QUEL EST VOTRE PRÉNOM ? » en capitales — pire que
       l'état d'origine — et, effet de bord immédiat, « QUEL EST LE MOT DE PASSE
       QUE VOUS SOUHAITEZ ? » est devenu trop long, est passé sur deux lignes et
       a **décalé son champ** par rapport à celui d'à côté. Signalé par Ziad
       dans la minute, capture à l'appui.
       ⇒ Mesuré : un seul élément mérite ce style, et il est dans la colonne de
       droite. **Une classe partagée n'est pas un rôle** : styler sur la classe,
       c'est styler tout ce qui la porte, y compris ce qu'on n'a pas regardé. */
    S + ".payment-section .col.span_4_of_12 .learnworlds-overline-text{"+
      "color:var(--ps-text-soft,#676879) !important;font-size:12px !important;"+
      "font-weight:700 !important;letter-spacing:.05em !important;text-transform:uppercase !important;}",
    /* Les libellés de champs gardent leur casse d'origine, et ne se répartissent
       plus la hauteur : chaque champ s'aligne sur le haut de sa cellule, donc un
       libellé sur deux lignes ne décale plus la colonne voisine. */
    S + ".payment-section .col.span_8_of_12 .learnworlds-overline-text{text-transform:none !important;}",
    S + ".payment-section .lw-cols{align-items:flex-start !important;}",

    /* ---------- libellés et champs ---------- */
    S + ".payment-section label{font-family:var(--ps-font,Figtree,sans-serif) !important;"+
      "color:var(--ps-text-soft,#676879) !important;font-size:13.5px !important;font-weight:600 !important;}",
    S + ".payment-section .learnworlds-input{font-family:var(--ps-font,Figtree,sans-serif) !important;"+
      "border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-btn,10px) !important;"+
      "background:#fff !important;padding:12px 14px !important;font-size:15px !important;"+
      "color:var(--ps-text,#203866) !important;transition:border-color .15s ease, box-shadow .15s ease !important;}",
    S + ".payment-section .learnworlds-input:focus{border-color:var(--ps-accent,#3887b4) !important;"+
      "box-shadow:0 0 0 3px rgba(var(--ps-accent-rgb,56,135,180),.14) !important;outline:none !important;}",

    /* ---------- bouton principal ---------- */
    S + ".payment-section .learnworlds-button-solid-brand{background:var(--ps-accent,#3887b4) !important;"+
      "border-color:var(--ps-accent,#3887b4) !important;color:#fff !important;"+
      "border-radius:var(--ps-r-btn,10px) !important;font-family:var(--ps-font,Figtree,sans-serif) !important;"+
      "font-weight:700 !important;}",
    S + ".payment-section .learnworlds-button-solid-brand:hover{background:var(--ps-accent-hover,#203866) !important;"+
      "border-color:var(--ps-accent-hover,#203866) !important;}",

    /* ---------- ce qu'on retire ----------
       🔴 LES DEUX `pm-form-social-buts` : mesuré, il y en a DEUX — l'un porte
       les pastilles, l'autre le mot « ou ». N'en masquer qu'un laisserait un
       « ou » suspendu au-dessus de rien. */
    S + ".payment-section .pm-form-social-buts{display:none !important;}",
    /* 🔴 L'IMAGE PRODUIT est un cadre VIDE : aucune illustration n'est
       renseignée sur le programme, LearnWorlds affiche donc son motif de
       rayures grises. Un espace réservé à une image absente n'informe personne
       et occupe le tiers du récapitulatif. */
    S + ".payment-section .col.span_4_of_12 .learnworlds-image{display:none !important;}",

    /* ---------- récapitulatif ---------- */
    S + ".payment-section .col.span_4_of_12{position:sticky !important;top:92px !important;}",
    S + ".payment-section .col.span_4_of_12 .learnworlds-main-text{font-family:var(--ps-font,Figtree,sans-serif) !important;}",

    /* 🔴 Sous 900 px la sticky et la grille à deux colonnes n'ont plus de sens :
       on rend la main à l'empilement natif. */
    "@media(max-width:900px){"+S+".payment-section .col.span_4_of_12{position:static !important;}"+
      S+".payment-section .col.span_8_of_12,"+S+".payment-section .col.span_4_of_12{padding:22px 18px !important;}}"
  ].join("\n");

  function poser() {
    if (document.getElementById("ps-paiement-css")) return;
    var st = document.createElement("style");
    st.id = "ps-paiement-css";
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ====================================================================
     LE BLOC DE SÉCURITÉ ÉTAIT EN ANGLAIS
     --------------------------------------------------------------------
     Deux phrases servies par LearnWorlds, jamais traduites, juste sous le
     bouton « Acheter » : « Guaranteed Security using one of the most advanced
     encrypted systems on the market. » C'est le seul texte de la page qui
     rassure sur le paiement — le laisser en anglais sur un site français,
     c'est perdre sa fonction au moment où elle sert.

     🔴 MÊME RÈGLE QUE LA PAGE DE VÉRIFICATION : on ne remplace QUE ce qu'on
     reconnaît. Si LearnWorlds traduit ces phrases un jour, ou si Ziad les
     réécrit, l'appariement échoue et on ne touche à rien. Le pire cas est
     « ma traduction ne s'applique pas », jamais « la page dit autre chose ».
     ==================================================================== */
  var TRADS = [
    { en: "guaranteed security using one of the most advanced encrypted systems on the market",
      fr: "Paiement sécurisé par l'un des systèmes de chiffrement les plus avancés du marché." },
    { en: "the information in this page is being processed and encrypted securely using industry-leading encryption and fraud prevention tools",
      fr: "Vos informations sont chiffrées et traitées de façon sécurisée, avec des outils de chiffrement et de prévention de la fraude parmi les plus reconnus." }
  ];

  function norm(t) {
    return String(t || "").replace(/ /g, " ").replace(/\s+/g, " ").trim()
      .replace(/[.\s]+$/, "").toLowerCase();
  }

  function traduire() {
    var sec = document.querySelector("section.payment-section");
    if (!sec) return false;
    var n = 0;
    /* 🔴 `textContent`, jamais `innerText` : le bloc peut être hors écran au
       moment où on passe, et `innerText` rendrait une chaîne vide — piège payé
       trois fois aujourd'hui, dont une sur la page de vérification. */
    [].slice.call(sec.querySelectorAll("div,p,span")).forEach(function (el) {
      if (el.children.length) return;                  /* seulement les feuilles */
      var t = norm(el.textContent);
      for (var i = 0; i < TRADS.length; i++) {
        if (TRADS[i].en === t) { el.textContent = TRADS[i].fr; n++; return; }
      }
    });
    return n > 0;
  }

  function passer() { poser(); traduire(); }

  passer();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", passer);
  }
  /* La page se peint en plusieurs temps (Stripe, récapitulatif) : quelques
     relances bornées, plutôt qu'un observateur permanent sur un écran de
     paiement où chaque frame compte. */
  [400, 1200, 3000, 6000].forEach(function (d) { setTimeout(passer, d); });
})();
