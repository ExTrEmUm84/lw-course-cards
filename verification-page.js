/* ============================================================
   PAGE « VÉRIFIEZ VOTRE ADRESSE » — /email-verification-pending
   https://extremum84.github.io/lw-course-cards/verification-page.js
   ------------------------------------------------------------
   Chargée par `tokens.js` sur `body.slug-email-verification-pending`
   uniquement. Ziad n'a aucun code personnalisé à poser.

   C'est la première page que voit quelqu'un qui vient de s'inscrire. Elle
   était en ANGLAIS et affichait `{{user.email_to_verify}}` en clair, soit du
   code à la place de son adresse, à l'instant exact où on lui demande de faire
   confiance au site.

   🔴🔴 CE QUE CE FICHIER NE FAIT PAS : REMPLACER UN TEXTE QU'IL NE RECONNAÎT
   PAS. Chaque bloc n'est traduit que si son texte correspond EXACTEMENT à
   l'anglais d'origine (comparaison normalisée). Si Ziad traduit un jour la
   page dans le Site Builder, ce script ne reconnaît plus rien et ne touche à
   rien : **son édition gagne toujours**. C'est l'idiome déjà retenu sur
   `/inscription` — apparier sur la forme exacte, sinon laisser tel quel.

   🔴🔴 LE BOUTON « RESEND EMAIL » NE DOIT ÊTRE NI CLONÉ NI DÉPLACÉ. Il ne
   porte aucun `href` ni gestionnaire visible : LearnWorlds le câble à
   l'exécution depuis le JSON de la section, par son **id**
   (`"linkData":{"linkType":"handleResendEmailVerification"}`, relevé dans le
   HTML de la page le 05/08). Le recréer donnerait un bouton d'apparence
   identique et parfaitement inerte — exactement le piège des connexions
   sociales de `/inscription`, où déplacer un élément casse une délégation
   qu'on ne voit pas. On ne fait donc que l'HABILLER, sur place.

   🔴 « Return to Site » pointe sur **`/signout`** : ce bouton DÉCONNECTE. Le
   libellé français le dit, parce qu'un « Retour au site » qui déconnecte est
   un mensonge sur un clic irréversible pour quelqu'un qui n'a pas encore
   validé son compte.

   🔴 L'ADRESSE : `me.email_to_verify` N'EXISTE PAS (79 clés de `me` relevées
   le 05/08, aucune ne porte l'adresse en attente). On affiche donc `me.email`.
   Si `me` manque — un visiteur non connecté ne devrait jamais voir cette page,
   mais on ne parie pas là-dessus — la phrase est reformulée SANS adresse
   plutôt que d'en inventer une ou de laisser le `{{…}}` visible.
   ⚠️ Cas connu et non couvert : quelqu'un qui change d'adresse depuis son
   compte verrait ici son ANCIENNE adresse (`me.email` ne suit pas). LearnWorlds
   n'expose pas la nouvelle côté page. La phrase sans adresse serait alors plus
   juste — à revoir si le cas se présente vraiment.
   ============================================================ */
(function () {
  "use strict";

  /* 🔴 UN MARQUEUR, PARCE QUE SON ABSENCE COÛTE UNE HEURE. Sans lui, quand la
     page ne change pas, on ne peut pas distinguer « le code ne se déclenche
     pas » de « le cache de GitHub Pages sert encore l'ancien fichier ». Les
     deux se ressemblent exactement à l'écran — le 05/08 j'ai cru au premier,
     c'était le second. `window.PS_VERIF_V` en console tranche en une seconde.
     -b : cibles de traduction nommées (le paragraphe « spams » restait anglais).
     -b (08/08, soir) : la carte débordait de l'écran sur téléphone — notre
     `max-width` avait remplacé le `max-width:100%` de LearnWorlds sur un
     conteneur en `width:1170px`. Voir le bloc CSS. */
  window.PS_VERIF_V = "2026-08-08-b";

  var SLUG = "email-verification-pending";

  /* Le littéral que LearnWorlds laisse passer tel quel. On ne suppose PAS
     qu'il est toujours là : sur la vraie page d'un compte en attente, la
     plateforme l'interpole peut-être. Tout ce qui suit ne se déclenche que si
     on le TROUVE — mesuré, jamais présumé. */
  var LITTERAL = "{{user.email_to_verify}}";

  function estPage() {
    return /email-verification-pending/.test(location.pathname || "") ||
           !!(document.body && document.body.classList.contains("slug-" + SLUG));
  }

  /* Normalisation pour l'appariement : minuscules, espaces réduits,
     ponctuation de fin retirée. Assez souple pour absorber un espace en trop
     du Site Builder, assez stricte pour ne jamais confondre deux phrases. */
  function norm(t) {
    return String(t || "")
      .replace(/ /g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/[.\s]+$/, "")
      .toLowerCase();
  }

  /* La table de traduction. `en` = ce que LearnWorlds sert aujourd'hui,
     `fr` = ce qu'on affiche. Une entrée dont l'anglais ne se retrouve plus est
     simplement inopérante : la page reste dans l'état où le Site Builder l'a
     laissée, ce qui est le comportement voulu. */
  var TRADS = [
    { en: "verify your email address",
      fr: "Vérifiez votre adresse e-mail" },
    { en: "click on the link to complete the verification process",
      fr: "Cliquez sur ce lien pour activer votre compte." },
    { en: "you might need to check your spam folder",
      fr: "Pensez à regarder dans vos <strong>spams</strong> si vous ne le voyez pas.", html: true },
    { en: "you can reach us at contact@prepastrat.com if you have any questions",
      fr: "Une question ? Écrivez-nous à <a href=\"mailto:contact@prepastrat.com\">contact@prepastrat.com</a>.", html: true },
    { en: "resend email",
      fr: "Renvoyer l'e-mail" },
    { en: "return to site",
      fr: "Me déconnecter" }
  ];

  function traduireUn(el) {
    /* Même raison qu'au-dessus : on apparie sur le texte RÉEL, pas sur ce qui
       se trouve être visible à cet instant. */
    var n = norm(el.textContent);
    for (var i = 0; i < TRADS.length; i++) {
      if (TRADS[i].en !== n) continue;
      if (TRADS[i].html) el.innerHTML = TRADS[i].fr;
      else el.textContent = TRADS[i].fr;
      return true;
    }
    return false;
  }

  function adresse() {
    try {
      var m = window.me;
      return (m && typeof m.email === "string" && m.email.indexOf("@") > 0) ? m.email : null;
    } catch (e) { return null; }
  }

  /* Une adresse déjà présente dans la phrase — donc posée par LearnWorlds à la
     place du littéral. On la reconnaît large : ce qui compte est qu'elle
     ressemble à une adresse, pas qu'elle soit validée. */
  function adresseDuTexte(brut) {
    var m = String(brut || "").match(/[^\s<>()[\]{},;:"]+@[^\s<>()[\]{},;:"]+\.[a-z]{2,}/i);
    return m ? m[0].replace(/[.,;:]+$/, "") : null;
  }

  /* La première phrase est le seul bloc qu'on réécrit ENTIÈREMENT, parce que
     l'adresse s'y insère. `wg-notranslate` sur l'adresse : Weglot ne doit
     jamais « traduire » une adresse e-mail (leçon d'`annuaire.js`). */
  function poserPhrase(bloc) {
    /* 🔴🔴 `textContent`, JAMAIS `innerText` — ET LA RAISON EST CHEZ NOUS.
       `innerText` tient compte de la mise en page : il EXCLUT le texte d'un
       élément en `visibility:hidden`. Or l'anti-flash de `tokens.js` masque
       précisément le `span.bold` qui porte l'adresse. Résultat mesuré au
       harnais : la phrase remontait sans son adresse, `adresseDuTexte()` ne
       trouvait rien, et on écrasait l'adresse de LearnWorlds par le repli.
       **Notre propre masquage rendait la donnée invisible à notre propre
       lecture.** Le dépôt connaît ce piège (`abonnement.js` l'a payé sur une
       section masquée) — il n'a servi que parce que je ne l'ai pas relu. */
    var brut = bloc.textContent || "";
    var aLitteral = brut.indexOf(LITTERAL) >= 0;
    var estAnglais = /we have sent a verification link to/i.test(brut);
    if (!aLitteral && !estAnglais) return false;   /* déjà traduite par Ziad : on ne touche pas */

    /* 🔴🔴 ORDRE DE PRIORITÉ, ET IL A ÉTÉ INVERSÉ UNE FOIS.
       Si LearnWorlds a REMPLACÉ le littéral par une vraie adresse, c'est ELLE
       qui fait autorité : c'est celle qui a reçu le lien. `me.email` n'est
       qu'un repli, et il est FAUX dans le cas d'un changement d'adresse (il
       renvoie l'ancienne, pas celle en attente de vérification).
       Ma première version écrasait l'adresse de LearnWorlds par `me.email` dès
       que la phrase anglaise était reconnue — le harnais (`?cas=interpole`) l'a
       montré tout de suite. J'avais pourtant écrit ce risque en tête de fichier
       avant de coder l'inverse : un défaut connu et quand même commis. */
    var mail = adresseDuTexte(brut) || adresse();
    if (mail) {
      bloc.innerHTML = "Nous vous avons envoyé un lien de vérification à " +
        "<span class=\"bold ps-verif-mail wg-notranslate\"></span>.";
      /* En texte, jamais en HTML : une adresse est une donnée, pas du balisage. */
      bloc.querySelector(".ps-verif-mail").textContent = mail;
    } else {
      bloc.textContent = "Nous vous avons envoyé un lien de vérification à l'adresse que vous venez d'indiquer.";
    }
    return true;
  }

  var CSS = [
    /* Confirmation d'achat (08/08) — VERTE, pas bleue : c'est une bonne
       nouvelle, et elle doit se lire avant le titre qui, lui, demande encore
       quelque chose. Elle n'apparaît que si un programme est réellement acquis
       (cf. `rassurerAcheteur`). */
    "body.slug-" + SLUG + " #ps-achat{border-radius:14px;padding:14px 16px;margin:0 0 22px;" +
      "font:400 14.5px/1.55 var(--ps-font,Figtree,sans-serif);text-align:left;}",
    /* Vert = une bonne nouvelle (le paiement). Bleu = une information (l'accès
       existe, il faut l'activer). 🔴 Deux couleurs et non une : le premier cas
       annonce que l'argent est passé, les deux autres demandent encore quelque
       chose — les peindre pareil effacerait la seule chose qui rassure. */
    "body.slug-" + SLUG + " #ps-achat.ps-ok{background:var(--ps-ok-tint,#E8F7F0);" +
      "border:1px solid var(--ps-ok,#1b5e40);color:#154832;}",
    "body.slug-" + SLUG + " #ps-achat.ps-ok strong{color:#0f3a28;}",
    "body.slug-" + SLUG + " #ps-achat.ps-info{background:var(--ps-accent-tint,#EEF4FA);" +
      "border:1px solid var(--ps-border,#E6E9EF);color:var(--ps-text,#203866);}",
    "body.slug-" + SLUG + " #ps-achat.ps-info strong{color:var(--ps-text,#203866);}",
    "body.slug-" + SLUG + " #ps-achat a{color:var(--ps-accent,#3887b4);font-weight:700;}",
    "body.slug-" + SLUG + " #ps-achat em{font-style:normal;font-weight:700;}",
    /* Fond : la page n'a NI barre de navigation NI pied de page (une seule
       section `Thankyou1`, mesuré). Elle occupe donc tout l'écran, et c'est
       elle seule qui porte la DA. */
    "body.slug-" + SLUG + "{background:var(--ps-surface-soft,#F7F8FB);}",
    "body.slug-" + SLUG + " #pageContent > section{background:transparent;}",
    /* 🔴🔴 `width:auto` N'EST PAS UNE PRÉCAUTION, C'EST LE CORRECTIF — ET LE BUG
       ÉTAIT DANS LA LIGNE D'À CÔTÉ. Signalé par Ziad sur son téléphone : la
       carte débordait de l'écran, tout le texte rogné à droite. Mesuré dans la
       feuille de LearnWorlds (`pages.42a2536999c30ef8cac8.css`), pas déduit :
         .learnworlds-section-content      { max-width:100%; margin:0 auto }
         .learnworlds-section-content.wide { width:1170px }
       Le conteneur porte la classe `wide` — donc une largeur FIXE de 1170px —
       et c'est `max-width:100%` qui la ramenait dans l'écran. En posant notre
       `max-width:620px` (spécificité 0,2,1 contre 0,2,0 : on gagne), **on a
       remplacé le filet responsive de LearnWorlds par un plafond plus haut que
       le téléphone** : 620px de carte dans 390px de large. Invisible sur
       desktop, où 620 < 1170.
       ⇒ `width:auto` retire le 1170px de l'équation : la carte se dimensionne
       sur son conteneur, et `max-width` ne fait plus que la borner en grand
       écran. Rendu desktop **inchangé** (620px avant comme après, LW posant un
       `*,:after,:before{box-sizing:border-box}` global — vérifié).
       🔴 `width:100%` — l'idiome des autres fichiers du dépôt — serait FAUX
       ICI : la règle mobile plus bas donne des gouttières en `margin:0 16px`,
       et une marge s'ajoute EN DEHORS d'un `width:100%` ⇒ 32px de débordement.
       C'est `auto`, précisément parce qu'on marge au lieu de padder.
       🔴 LA LEÇON, ET ELLE DÉPASSE CE FICHIER : **poser un `max-width` sur un
       élément dont on n'a pas lu le `width` ne le contraint pas, ça écrase la
       contrainte de quelqu'un d'autre.** Ce que LW appelle `max-width:100%`
       était du responsive, pas du décor. */
    "body.slug-" + SLUG + " .learnworlds-section-content{width:auto !important;max-width:620px;margin:0 auto;" +
      "background:#fff;border:1px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-card,16px);" +
      "padding:44px 36px 40px;box-shadow:0 10px 30px rgba(32,56,102,.07);}",
    /* Pastille de l'icône : le rond natif est gris pâle, on le passe à l'accent. */
    "body.slug-" + SLUG + " .learnworlds-icon-wrapper.circle{background:var(--ps-accent-tint,#edf4ff) !important;}",
    "body.slug-" + SLUG + " .learnworlds-icon-wrapper.circle .learnworlds-icon{color:var(--ps-accent,#3887b4) !important;}",
    "body.slug-" + SLUG + " .learnworlds-heading{font-family:var(--ps-font,Figtree,sans-serif) !important;" +
      "color:var(--ps-text,#203866) !important;font-size:30px !important;line-height:1.2 !important;margin:18px 0 12px !important;}",
    "body.slug-" + SLUG + " .learnworlds-main-text{font-family:var(--ps-font,Figtree,sans-serif) !important;" +
      "color:var(--ps-text-soft,#676879) !important;font-size:15.5px !important;line-height:1.6 !important;}",
    "body.slug-" + SLUG + " .ps-verif-mail{color:var(--ps-text,#203866);font-weight:700;" +
      /* Une adresse longue ne doit pas élargir la carte sur un téléphone. */
      "overflow-wrap:anywhere;}",
    "body.slug-" + SLUG + " .learnworlds-button-wrapper{margin-top:26px !important;}",
    "body.slug-" + SLUG + " .learnworlds-button-solid-brand{background:var(--ps-accent,#3887b4) !important;" +
      "border-color:var(--ps-accent,#3887b4) !important;color:#fff !important;" +
      "border-radius:var(--ps-r-btn,10px) !important;font-family:var(--ps-font,Figtree,sans-serif) !important;" +
      "font-weight:600 !important;padding:12px 26px !important;transition:background .18s ease;}",
    "body.slug-" + SLUG + " .learnworlds-button-solid-brand:hover{background:var(--ps-accent-hover,#203866) !important;" +
      "border-color:var(--ps-accent-hover,#203866) !important;}",
    "body.slug-" + SLUG + " .learnworlds-button.text-only{color:var(--ps-text-soft,#676879) !important;" +
      "font-family:var(--ps-font,Figtree,sans-serif) !important;font-weight:500 !important;}",
    "body.slug-" + SLUG + " .learnworlds-button.text-only:hover{color:var(--ps-text,#203866) !important;}",
    /* 🔴 `!important` ICI AUSSI, et il manquait. Mesuré sur la VRAIE page :
       le lien ressortait gris souligné, c'est-à-dire au style de LearnWorlds.
       C'était la seule règle du fichier sans `!important` — les autres l'ont
       parce que la feuille de LW gagne autrement. Le harnais ne pouvait pas le
       voir : il reproduit la structure, pas la feuille de styles de la
       plateforme. **Un harnais valide une logique, jamais une cascade.** */
    "body.slug-" + SLUG + " a[href^=\"mailto:\"]{color:var(--ps-accent,#3887b4) !important;" +
      "text-decoration:none !important;font-weight:600 !important;}",
    "@media (max-width:640px){body.slug-" + SLUG + " .learnworlds-section-content{margin:0 16px;padding:32px 22px 28px;}" +
      "body.slug-" + SLUG + " .learnworlds-heading{font-size:25px !important;}}"
  ].join("\n");

  function styler() {
    if (document.getElementById("ps-verif-css")) return;
    var st = document.createElement("style");
    st.id = "ps-verif-css";
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* Révélation : c'est `tokens.js` qui masque l'adresse avant qu'on arrive
     (sinon le `{{…}}` clignote), et cette classe qui la rend. Elle est posée
     dans TOUS les cas où on a fini de passer — même si rien n'a matché : une
     page qu'on ne reconnaît pas doit rester lisible, pas amputée. */
  function reveler() {
    if (document.body) document.body.classList.add("ps-verif-pret");
  }

  function passer() {
    var sec = document.querySelector("#pageContent section[data-section-id]");
    if (!sec) return false;
    /* 🔴🔴 CIBLES NOMMÉES, PAS UN GARDE-FOU NÉGATIF.
       Première version : je prenais large (`button`, `span`, textes…) puis
       j'excluais « tout bloc contenant un span/strong/a », pour ne pas écraser
       le libellé interne des boutons ni l'icône flèche. Ce filtre sautait AUSSI
       le paragraphe « check your spam folder », qui contient un `<strong>` :
       la page est restée à moitié anglaise EN PRODUCTION, et le harnais ne l'a
       pas dit parce qu'aucune assertion ne portait sur ce paragraphe.
       ⇒ On désigne ce qu'on traduit. Pour les boutons on vise le `span` de
       LIBELLÉ (`data-node-type="text"` / `.js-can-edit-element`), jamais le
       `<button>` : l'icône flèche est un span FRÈRE, qu'un `textContent` sur le
       bouton supprimerait.
       🔴 La leçon vaut plus que le correctif : **un filtre par exclusion
       protège ce qu'on a prévu et mange ce qu'on a oublié.** */
    var cibles = [];
    [].push.apply(cibles, sec.querySelectorAll(".learnworlds-heading"));
    [].push.apply(cibles, sec.querySelectorAll(".learnworlds-main-text"));
    [].push.apply(cibles, sec.querySelectorAll("button span[data-node-type='text'], button span.js-can-edit-element"));
    if (!cibles.length) return false;

    var phraseFaite = false, n = 0;
    [].slice.call(sec.querySelectorAll(".learnworlds-main-text")).forEach(function (b) {
      if (poserPhrase(b)) { phraseFaite = true; n++; }
    });
    cibles.forEach(function (b) {
      if (traduireUn(b)) n++;
    });
    rassurerAcheteur(sec);
    styler();
    reveler();
    return phraseFaite || n > 0;
  }

  /* ══════════════════════════════════════════════════════════════════════════
     CELUI QUI VIENT DE PAYER N'EST PAS CELUI QUI VIENT DE S'INSCRIRE  (08/08)
     --------------------------------------------------------------------------
     Signalé par Ziad, mesuré sur son compte à l'instant : après un achat, il
     atterrit ici avec `userLearningPrograms.length === 1` — le paiement est
     passé, le programme est acquis — et la page ne dit **pas un mot de son
     achat**. Elle ne parle que d'« activer son compte », et ses deux seules
     actions sont « Renvoyer l'e-mail » et « Me déconnecter ».
     Quelqu'un qui vient de payer 99 € lit donc un écran qui ressemble à un
     échec. C'est le pire moment du parcours pour laisser un doute.

     🔴🔴 ON NE PROMET PAS L'ACCÈS, PARCE QU'IL N'EST PAS LÀ. Mesuré le 08/08 :
     `/path-player?courseid=niveau-1` répond 200 mais **son URL finale est
     `/email-verification-pending`** — LearnWorlds redirige le contenu côté
     serveur tant que l'adresse n'est pas vérifiée. Un bouton « accéder à mes
     cours » renverrait donc ici. On confirme l'ACHAT, on n'invente pas un
     accès. Rassurer n'est pas mentir.
     🔴 Le bloc n'apparaît QUE si un programme est réellement présent : sur un
     compte sans achat, annoncer « votre achat est enregistré » serait absurde,
     et `userLearningPrograms` absent veut dire « pas encore chargé », jamais
     « rien acheté » (même discipline que le blocage de `tokens.js`).
     🔴 INSÉRÉ AVANT le titre, jamais à la place : on n'enlève rien à la page de
     LearnWorlds, on ajoute au-dessus. Et jamais deux fois (`ps-achat`).
     ══════════════════════════════════════════════════════════════════════════ */
  function rassurerAcheteur(sec) {
    if (!sec || document.getElementById("ps-achat")) return;
    var m = (typeof me === "object" && me) ? me : null;
    if (!m) return;
    /* Tableau absent = pas encore chargé, JAMAIS « rien acheté ». Même
       discipline que le blocage de `tokens.js` : on ne conclut pas sur un
       doute, on attend le passage suivant. */
    if (!Array.isArray(m.userLearningPrograms)) return;

    var prog = m.userLearningPrograms.length;
    var ecole = null;
    try { ecole = window.PS_PARTENAIRE || null; } catch (e) {}

    var b = document.createElement("div");
    b.id = "ps-achat";

    if (prog > 0) {
      /* ── 1. Il vient de payer ──────────────────────────────────────────
         Le cas mesuré le 08/08 sur le compte de Ziad : programme acquis,
         adresse en attente, et une page qui ne parlait que d'« activer un
         compte ». On confirme d'abord l'argent, on demande ensuite. */
      var nom = "";
      try {
        var p = m.userLearningPrograms[0];
        nom = (p && (p.title || p.name)) ? String(p.title || p.name) : "";
      } catch (e2) {}
      b.className = "ps-ok";
      b.innerHTML =
        '<strong>Paiement reçu, merci&nbsp;!</strong> Votre accès à ' +
        (nom ? '<em>' + nom.replace(/[&<>]/g, "") + '</em>' : 'votre formation') +
        ' est enregistré. Il reste une seule étape&nbsp;: confirmer votre adresse e-mail. ' +
        'Vos cours s\'ouvriront dès que vous aurez cliqué sur le lien — ' +
        '<strong>rien ne sera à repayer</strong>.';

    } else if (ecole) {
      /* ── 2. Étudiant d'une école partenaire ────────────────────────────
         🔴 ON NE LUI PARLE JAMAIS D'ARGENT : son école a payé. C'est la règle
         posée le 07/08 pour le bandeau d'orientation, et elle vaut ici.
         🔴 Son accès n'existe pas ENCORE : l'automatisation d'école se
         déclenche précisément sur la vérification. La validation n'est donc
         pas une formalité administrative, c'est ce qui ouvre ses cours — et
         c'est ce que la phrase doit dire. */
      var nomEcole = "";
      try { nomEcole = ecole.nom ? String(ecole.nom).replace(/[&<>]/g, "") : ""; } catch (e3) {}
      b.className = "ps-info";
      b.innerHTML =
        '<strong>Votre accès est prévu' + (nomEcole ? ' avec ' + nomEcole : '') + '.</strong> ' +
        'Confirmez votre adresse e-mail pour l\'activer&nbsp;: c\'est ce clic qui ouvre vos cours. ' +
        'Vous n\'avez rien à payer.';

    } else {
      /* ── 3. Compte créé, rien acheté ───────────────────────────────────
         🔴 Le lien vers les formules est HONNÊTE : mesuré le 08/08,
         `/formules` répond 200 sans redirection pendant l'attente. Seul le
         LECTEUR de cours est bloqué par LearnWorlds — proposer « mes cours »
         ici renverrait sur cette même page. */
      b.className = "ps-info";
      b.innerHTML =
        '<strong>Votre compte est créé.</strong> Confirmez votre adresse e-mail pour l\'activer. ' +
        'Il vous restera à choisir votre formule pour ouvrir les cours — ' +
        '<a href="/formules">voir les formules</a>.';
    }
    /* 🔴🔴 ON S'INSÈRE À CÔTÉ DU TITRE, PAS À CÔTÉ DE SON PARENT. Première
       version : `titre.parentElement.parentElement.insertBefore(...)` — le bloc
       atterrissait dans `.lw-cols`, un conteneur FLEX EN LIGNE avec
       `align-items:stretch`. Il devenait donc une COLONNE, large de 314 px et
       **haute de 782 px**, étirée sur toute la rangée. Mesuré à l'écran avant
       de pousser ; invisible à la relecture du code.
       ⇒ Un niveau d'insertion se vérifie sur le rendu, pas sur l'intention. */
    var titre = sec.querySelector(".learnworlds-heading");
    if (titre && titre.parentElement) titre.parentElement.insertBefore(b, titre);
    else sec.insertBefore(b, sec.firstChild);
  }

  function demarrer() {
    if (!estPage()) return;
    if (window.__psVerifFait) return;
    window.__psVerifFait = true;

    var t0 = Date.now(), ok = passer();

    /* Le Site Builder peut peindre la section après nous. Même budget que le
       reste du dépôt : on observe un temps borné, puis on se retire — un
       observateur `subtree` oublié coûte à chaque mutation de la page. */
    var obs = new MutationObserver(function () {
      if (!ok) ok = passer();
      if (Date.now() - t0 > 15000) { obs.disconnect(); }
    });
    if (document.documentElement) {
      obs.observe(document.documentElement, { childList: true, subtree: true });
    }
    /* Filet : quoi qu'il arrive, l'adresse ne reste pas masquée. */
    setTimeout(reveler, 4000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})();
