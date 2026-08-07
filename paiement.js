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

  window.PS_PAIEMENT_V = "2026-08-08-c";

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
    /* 🔴 L'IMAGE PRODUIT EST REMISE (Ziad, 05/08). Je l'avais masquée parce
       qu'elle affichait le motif de rayures grises de LearnWorlds — le
       placeholder d'une illustration non renseignée sur le programme. Ziad la
       veut : voir ce qu'on achète vaut mieux qu'un récapitulatif purement
       textuel, et le cadre se remplira dès qu'une image sera posée sur le
       programme. On l'habille donc au lieu de la retirer.
       ⏳ Tant qu'aucune illustration n'est renseignée, ce cadre reste rayé :
       c'est un réglage du PROGRAMME dans LearnWorlds, pas du code. */
    S + ".payment-section .col.span_4_of_12 .learnworlds-image{"+
      "border-radius:var(--ps-r-card,14px) !important;overflow:hidden !important;"+
      "border:1px solid var(--ps-border,#E6E9EF) !important;margin-bottom:18px !important;}",

    /* 🔴 LE MENU DÉROULANT « Cours inclus : » EST NEUTRALISÉ (Ziad, 05/08).
       Le survol de « 56 Cours inclus » ouvrait un panneau listant les 56 cours,
       qui recouvrait le prix et le bouton — sur l'écran de paiement, il cachait
       exactement ce qu'on vient y lire.
       🔴 On coupe le DÉCLENCHEUR (`pointer-events`), on ne masque pas le
       panneau : celui-ci n'existe dans le DOM qu'au survol, donc viser sa
       classe reviendrait à parier sur un nœud que je n'ai jamais mesuré. Couper
       l'interaction est vérifiable tout de suite, et le texte reste lisible. */
    S + ".payment-section .col.span_4_of_12 span.cursor-pointer{"+
      "pointer-events:none !important;cursor:default !important;}",

    /* ---------- récapitulatif ---------- */
    S + ".payment-section .col.span_4_of_12{position:sticky !important;top:92px !important;}",

    /* 🔴🔴 LA LIGNE DU COUPON SE BRISAIT EN PLEIN MONTANT (08/08, signalé par
       Ziad, mesuré sur la vraie page avec un coupon appliqué).
       La rangée de LearnWorlds est un `flex` en `nowrap`, large de 261 px, et
       ses trois cellules en réclament autant : nom 70 · montant · description
       163. Le montant, coincé à 28 px, passait sur DEUX lignes — le tiret
       au-dessus du chiffre, « -€99 » devenu illisible.
       ⇒ On autorise le repli, on interdit à chaque cellule de se couper, et on
       envoie la DESCRIPTION seule à la ligne (c'est le seul texte qui peut se
       permettre de passer sur deux lignes). Mesuré après application :
       montant 34×23 sur UNE ligne, description entière en dessous.
       🔴 `.lw-text-color-fadeout3` = le texte atténué, donc la description :
       c'est la seule prise disponible, LearnWorlds ne nomme pas ses cellules.
       Vérifié que les rangées voisines n'en pâtissent pas — « Total dû
       aujourd'hui €0 » reste sur une ligne de 29 px. */
    S + ".payment-section .col.span_4_of_12 .flex.j-c-sb{flex-wrap:wrap !important;gap:2px 10px !important;}",
    S + ".payment-section .col.span_4_of_12 .flex.j-c-sb > *{white-space:nowrap !important;}",
    S + ".payment-section .col.span_4_of_12 .flex.j-c-sb > .lw-text-color-fadeout3{"+
      "flex:1 1 100% !important;white-space:normal !important;}",

    /* 🔴 Animation vide, uniquement là pour être DÉTECTÉE : Chrome déclenche
       `animationstart` quand il autoremplit un champ, et c'est le seul signal
       fiable qu'un gestionnaire de mots de passe est passé par là. Voir le
       bloc `reveillerAutoremplissage()` plus bas. */
    "@keyframes ps-autofill{from{opacity:1}to{opacity:1}}",
    S + ".payment-section input:-webkit-autofill{animation-name:ps-autofill !important;animation-duration:.01s !important;}",
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

  /* ====================================================================
     « ABONNEMENT » ÉTAIT ÉCRIT DEUX FOIS, ET ÇA CASSAIT LA LIGNE DE PRIX
     --------------------------------------------------------------------
     Le récapitulatif affichait « Abonnement Trimestriel », puis juste en
     dessous « **Abonnement**  €252 chaque 3 mois ». Le mot revenait à deux
     lignes d'intervalle, et surtout son libellé mangeait la moitié de la
     largeur : le prix passait à la ligne, « €252 chaque 3 / mois ». Signalé
     par Ziad — c'est le chiffre le plus important de la page.

     🔴 ON NE PEUT PAS MASQUER TOUS LES `<strong>` du récapitulatif : « Total dû
     aujourd'hui » et le montant en sont aussi, et ce sont les lignes qui
     comptent le plus.

     🔴 MA PREMIÈRE CONDITION N'A RIEN ATTRAPÉ, et la mesure a dit pourquoi.
     J'avais supposé « le libellé et le prix sont dans le même parent ». Relevé :
     le libellé est SEUL dans son propre `<p>`, et le montant vit dans un élément
     FRÈRE, sous un `div` commun sans classe. On remonte donc jusqu'à trois
     niveaux à la recherche du montant — reconnaissable à `weglot-exclude`, que
     LearnWorlds pose pour que Weglot ne traduise pas un prix.
     ⇒ Deux conditions mesurées : le mot exact, et un montant au-dessus de lui.
     Sans la seconde, on masquerait « Abonnement Trimestriel », qui est la seule
     mention utile.
     ==================================================================== */
  function degrouperPrix() {
    var recap = document.querySelector(".payment-section .col.span_4_of_12");
    if (!recap) return false;
    var fait = false;
    [].slice.call(recap.querySelectorAll("strong")).forEach(function (s) {
      if (s.getAttribute("data-ps-prix")) return;
      if (norm(s.textContent) !== "abonnement") return;
      var a = s.parentElement, k = 0, trouve = false;
      while (a && k < 3) { if (a.querySelector(".weglot-exclude")) { trouve = true; break; } a = a.parentElement; k++; }
      if (!trouve) return;                       /* pas la ligne de prix : on laisse */
      s.setAttribute("data-ps-prix", "1");
      /* On masque le `<p>` quand le libellé y est seul : sinon il resterait une
         ligne vide qui garderait sa marge, et le prix ne remonterait pas. */
      var cible = (s.parentElement && s.parentElement.children.length === 1) ? s.parentElement : s;
      cible.style.setProperty("display", "none", "important");
      /* 🔴 ALIGNER LE PRIX À GAUCHE (Ziad, 05/08). La ligne est un flex en
         `space-between` : le libellé à gauche, le montant à droite. En retirant
         le libellé, le montant restait plaqué au bord droit, seul et décentré —
         retirer un élément ne suffit pas, il faut reprendre la mise en page
         qu'il tenait. On aligne sur le conteneur RÉELLEMENT trouvé (`a`), pas
         sur une classe supposée : celui-ci n'en porte aucune. */
      try {
        a.style.setProperty("justify-content", "flex-start", "important");
        a.style.setProperty("text-align", "left", "important");
        /* 🔴 ET IL FAUT DESCENDRE JUSQU'AU PRIX. Aligner le conteneur ne
           suffisait pas : mesuré, le `<p>` qui porte le montant a son PROPRE
           `text-align:right`, hérité de LearnWorlds. Le montant restait donc
           collé à droite d'une boîte alignée à gauche. On remonte du prix
           jusqu'au conteneur en redressant chaque niveau — il y en a trois. */
        var pr = a.querySelector(".weglot-exclude"), m = pr, garde = 0;
        while (m && m !== a && garde < 5) {
          m.style.setProperty("text-align", "left", "important");
          m = m.parentElement; garde++;
        }
      } catch (e) {}
      fait = true;
    });
    return fait;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LE CHAMP EST REMPLI, ET LEARNWORLDS LE CROIT VIDE  (08/08)
     --------------------------------------------------------------------------
     Signalé par Ziad : « ça bloque sur le mot de passe alors qu'il est bien
     là ». Diagnostiqué en direct sur sa page, sans jamais lire la valeur du
     champ : le message « Ce champ est requis » était rattaché à un `password`
     dont `value.length > 0`. En émettant les seuls ÉVÈNEMENTS de saisie, sans
     toucher à la valeur, les erreurs ont disparu instantanément.
     ⇒ Cause : le mot de passe vient d'un gestionnaire de mots de passe (ou d'un
     collage). Le navigateur remplit le DOM **sans émettre `input`**, et le
     validateur de LearnWorlds n'écoute que ça. Il maintient donc « vide » dans
     son état interne pendant que l'utilisateur voit son champ rempli.
     🔴 CE N'EST PAS NOTRE BUG, MAIS IL NOUS COÛTE DES VENTES : il frappe
     précisément les gens qui vont payer, et rien à l'écran ne leur dit quoi
     faire. À signaler à LearnWorlds — leur validateur doit lire la valeur, pas
     seulement écouter les frappes. En attendant, on le réveille.

     🔴🔴 CE QUE CE CODE NE FAIT PAS, ET NE DOIT JAMAIS FAIRE : il ne lit
     aucune valeur, n'en écrit aucune, ne soumet rien. Il se contente de dire
     « ce champ a été touché » — exactement ce qu'aurait produit une frappe au
     clavier. Sur un écran de paiement, toute autre liberté serait de trop.
     🔴 Un seul réveil par champ (`data-ps-reveille`) : ces évènements
     déclenchent des validations, en émettre à chaque passage ferait clignoter
     les messages d'erreur sous les doigts de l'utilisateur.
     ══════════════════════════════════════════════════════════════════════════ */
  function reveiller(el) {
    if (!el || el.dataset.psReveille) return false;
    /* 🔴🔴 CORRECTION DU 08/08 (voir le bloc « LE FANTÔME » plus bas) : un mot
       de passe que PERSONNE N'A TAPÉ n'est pas un champ à valider, c'est une
       valeur que Chrome a versée tout seul et qui va être effacée. Le
       réveiller apprendrait à LearnWorlds à l'accepter — c'est exactement
       l'erreur commise ici le 08/08 au matin, quand on a pris le fantôme pour
       « un mot de passe bien là que LearnWorlds refuse ». */
    if (estMdpChoisi(el) && !el.dataset.psFrappe) return false;
    /* On ne touche qu'à un champ qui a DÉJÀ quelque chose : réveiller un champ
       vide ferait apparaître l'erreur « requis » avant même que la personne
       ait commencé à écrire. */
    if (!el.value || !el.value.length) return false;
    el.dataset.psReveille = "1";
    ["input", "change"].forEach(function (t) {
      try { el.dispatchEvent(new Event(t, { bubbles: true })); } catch (e) {}
    });
    return true;
  }

  function reveillerAutoremplissage() {
    var champs = document.querySelectorAll(
      ".payment-section input[type='password'], .payment-section input[type='text'], .payment-section input[type='email']");
    for (var i = 0; i < champs.length; i++) reveiller(champs[i]);
  }

  /* Chrome annonce l'autoremplissage par l'animation déclarée plus haut. C'est
     le seul signal fiable : il arrive AVANT nos relances quand le navigateur
     remplit au chargement, et APRÈS elles quand la personne choisit une entrée
     de son gestionnaire trente secondes plus tard. */
  if (!window.__psAutofillLie) {
    window.__psAutofillLie = 1;
    document.addEventListener("animationstart", function (e) {
      if (e.animationName === "ps-autofill") reveiller(e.target);
    }, true);
  }

  /* ══════════════════════════════════════════════════════════════════════════
     LE FANTÔME : CHROME ÉCRIT UN MOT DE PASSE QUE PERSONNE N'A CHOISI (08/08)
     --------------------------------------------------------------------------
     Signalé par Ziad : « quand je clique sur le prénom, le mot de passe se
     remplit tout seul ». Mesuré en direct sur la vraie page, horodaté :

       47731 ms   #signin-email     rempli   [isTrusted]
       47732 ms   #signin-password  rempli   [isTrusted]
       47734 ms   mot de passe VISIBLE rempli (15 car.)
       47742 ms   focusin sur first_name          ← 8 ms PLUS TARD

     Le remplissage PRÉCÈDE le focus. Ce n'est donc pas le champ Prénom qui
     réagit : c'est **Chrome qui, au moment du clic, verse le mot de passe
     enregistré pour l'origine dans tout ce qui ressemble à un champ de mot de
     passe** — les formulaires cachés de LearnWorlds ET celui, visible, de
     l'inscription. Les évènements portent `isTrusted:true` : ils viennent du
     NAVIGATEUR, aucun script de la page n'écrit ces valeurs.

     🔴 CE QUE ÇA DONNE À L'ÉCRAN : e-mail VIDE, mot de passe PLEIN — l'inverse
     exact de ce que montre un formulaire de création de compte. Et l'acheteur
     repartirait avec un compte dont le mot de passe est celui d'un AUTRE
     compte, qu'il n'a jamais choisi ici.
     🔴 Ne sont touchés que ceux qui ont DÉJÀ un mot de passe enregistré pour
     `elearning.prepastrat.com`. Un prospect neuf ne voit rien — d'où le temps
     qu'il a fallu pour que ça se voie.

     PISTES ESSAYÉES ET ÉCARTÉES, chacune mesurée, aucune supposée :
     - **Réparer `autocomplete`.** LearnWorlds écrit `new-first_name` /
       `new-last_name`, des jetons qui N'EXISTENT PAS dans la norme (les vrais
       sont `given-name` / `family-name`). Corrigés en direct : Chrome a rempli
       quand même, et plus largement qu'avant. Sans effet.
     - **`readonly` levé au clic.** Efficace, et prouvé plutôt que supposé :
       pendant que le champ était verrouillé, Chrome a rempli le formulaire
       CACHÉ et pas celui-ci — donc son autoremplissage tournait toujours.
       Écarté quand même : **un champ en lecture seule n'ouvre pas le clavier
       sur téléphone**. On ne répare pas une gêne de bureau par une panne
       mobile.
     - **`:-webkit-autofill`** (le signal utilisé plus haut pour `reveiller`) :
       mesuré ABSENT sur ce champ précis, alors qu'il est bien présent sur les
       champs cachés. Le détecteur qui existe déjà ne pouvait donc pas servir.

     ⇒ RETENU : laisser le champ parfaitement normal — même `type`, saisissable,
     clavier mobile intact — et EFFACER ce qui y arrive sans frappe humaine.
     ══════════════════════════════════════════════════════════════════════════ */

  var MAX_EFFACEMENTS = 6;

  /* Mesuré sur la page : le SEUL `password` de `.payment-section` est celui de
     l'inscription ; le champ de CONNEXION (`#signin-password`,
     `current-password`) vit HORS de la section. On exige quand même
     `new-password` : si LearnWorlds glissait un jour une connexion ici,
     l'autoremplissage y serait LÉGITIME et ce code doit le laisser passer. */
  function champMdpChoisi() {
    return document.querySelector(
      ".payment-section input[type='password'][autocomplete='new-password']");
  }

  function estMdpChoisi(el) {
    return !!el && el.tagName === "INPUT" && el.type === "password" &&
      el.getAttribute("autocomplete") === "new-password" &&
      !!el.closest && !!el.closest(".payment-section");
  }

  function marquerFrappe(e) {
    var el = e.target;
    if (!estMdpChoisi(el) || el.dataset.psFrappe) return;
    /* Un déplacement au clavier n'est pas une saisie : compter Tab ouvrirait la
       porte au fantôme pour qui traverse le formulaire sans rien écrire. */
    if (e.type === "keydown" &&
        /^(Tab|Escape|Shift|Control|Alt|Meta|CapsLock)$/.test(e.key || "")) return;
    el.dataset.psFrappe = "1";
  }

  function effacerFantome(el) {
    if (!estMdpChoisi(el) || el.dataset.psFrappe || !el.value) return false;
    var n = +(el.dataset.psEfface || 0);
    /* Garde-fou : si le navigateur reremplit sans cesse, on s'arrête. Un champ
       qui clignote sous les doigts est pire que le défaut qu'on corrige. */
    if (n >= MAX_EFFACEMENTS) return false;
    el.dataset.psEfface = n + 1;
    el.value = "";
    /* 🔴 ON N'ÉMET RIEN. Émettre `input` sur un champ redevenu vide ferait
       surgir « Ce champ est requis » avant que la personne ait écrit un seul
       caractère — la raison même pour laquelle `reveiller()` refuse les champs
       vides quelques lignes plus haut. */
    return true;
  }

  if (!window.__psFantomeLie) {
    window.__psFantomeLie = 1;

    ["keydown", "paste", "contextmenu", "drop"].forEach(function (t) {
      document.addEventListener(t, marquerFrappe, true);
    });

    /* 1er chemin — l'évènement du navigateur, intercepté EN CAPTURE et coupé.
       LearnWorlds ne doit pas le voir passer : sinon son aide « le mot de passe
       doit contenir… » se déploie sur un simple clic dans Prénom, ce que Ziad a
       signalé pendant la mise au point. */
    ["beforeinput", "input", "change"].forEach(function (t) {
      document.addEventListener(t, function (e) {
        if (!e.isTrusted || !estMdpChoisi(e.target)) return;
        if (effacerFantome(e.target)) e.stopImmediatePropagation();
      }, true);
    });

    /* 2e chemin — LE REMPLISSAGE SILENCIEUX, et c'est lui qui compte. Mesuré :
       Chrome remplit parfois ce champ SANS émettre le moindre évènement, et
       c'est ce chemin-là qui a tout attrapé lors de la vérification finale.
       Sans lui, le correctif ne tiendrait que par chance.
       Déclencheur : le focus d'un champ de la section — le seul geste qui ait
       jamais provoqué le remplissage. Rafale BORNÉE (~450 ms) plutôt qu'un
       observateur permanent : sur un écran de paiement, chaque frame compte. */
    document.addEventListener("focusin", function (e) {
      var t = e.target;
      if (!t || !t.closest || !t.closest(".payment-section")) return;
      var fin = Date.now() + 450;
      (function encore() {
        effacerFantome(champMdpChoisi());
        if (Date.now() < fin) requestAnimationFrame(encore);
      })();
    }, true);

    /* 3e chemin — l'animation `ps-autofill` déclarée en haut de ce fichier.
       Mesurée ABSENTE sur ce champ (présente sur les champs cachés) : on la
       branche quand même, elle ne coûte rien et couvrira les versions de Chrome
       où elle apparaît. */
    document.addEventListener("animationstart", function (e) {
      if (e.animationName === "ps-autofill") effacerFantome(e.target);
    }, true);

    /* 4e chemin — LE REMPLISSAGE AU CHARGEMENT, SANS AUCUN CLIC. Observé APRÈS
       déploiement, et c'est le genre de trou qu'on ne voit qu'en production :
       une capture prise plusieurs secondes après l'ouverture montrait encore le
       fantôme, alors que le champ portait déjà `psEfface=1` — notre code avait
       agi, mais TARD, sur une relance de `passer()`.
       🔴 Le défaut est STRUCTUREL même s'il est intermittent : sans focus, la
       rafale ci-dessus ne part jamais, et passé la dernière relance (6 s) plus
       rien ne surveille. Un remplissage tardif resterait à l'écran pour de bon.
       Veille BORNÉE, dans l'esprit du reste du fichier (pas d'observateur
       permanent sur un écran de paiement) : on attend que le champ existe —
       LearnWorlds le peint tardivement —, puis on surveille encore 2 s, et
       jamais au-delà de 12 s. */
    (function veilleDemarrage() {
      var debut = Date.now(), vuA = 0;
      (function encore() {
        var el = champMdpChoisi();
        if (el) {
          if (!vuA) vuA = Date.now();
          effacerFantome(el);
        }
        if (Date.now() - debut < 12000 && (!vuA || Date.now() - vuA < 2000)) {
          requestAnimationFrame(encore);
        }
      })();
    })();
  }

  function passer() {
    poser(); traduire(); degrouperPrix();
    /* 🔴 L'ORDRE COMPTE : on chasse le fantôme AVANT de réveiller les champs,
       sinon `reveillerAutoremplissage()` validerait la valeur qu'on s'apprête
       à effacer. (`reveiller()` porte aussi son propre garde — deux verrous
       valent mieux qu'un sur un écran de paiement.) */
    effacerFantome(champMdpChoisi());
    reveillerAutoremplissage();
  }

  passer();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", passer);
  }
  /* La page se peint en plusieurs temps (Stripe, récapitulatif) : quelques
     relances bornées, plutôt qu'un observateur permanent sur un écran de
     paiement où chaque frame compte. */
  [400, 1200, 3000, 6000].forEach(function (d) { setTimeout(passer, d); });
})();
