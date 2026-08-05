/**
 * player.js — Modernisation du LECTEUR de cours LearnWorlds (page /path-player).
 *
 * Chargé UNIQUEMENT sur le player par tokens.js (comme footer.js) → aucun code
 * dans le Code personnalisé de la page : on garde juste les 3 loaders habituels.
 *
 * Reprend fidèlement le code perso de Ziad :
 *   - burger : flèche native remplacée par 3 traits (gradients CSS)
 *   - navigation prev/suivant : chevrons ❮ ❯ + libellés « Leçon précédente/suivante »
 *     + nom de la leçon (script)
 *   - liste des chapitres (sommaire) épurée, compacte
 *   - ouverture/fermeture du sommaire au chargement (clic js-showhide-btn)
 * … et l'applique à la DA PrepaStrat :
 *   - chrome unifié MARINE #243B6B (au lieu des 2 bleus #0d6efd / #3887b4)
 *   - police Figtree
 *   - leçon active + barre de progression en BLEU DE MARQUE #507EC5
 *
 * 🔴 Tout est versionné ici → j'itère par git push. Changer la couleur du chrome =
 * la constante MARINE ci-dessous (ex. #507EC5 pour le bleu de marque).
 */
(function () {
  "use strict";

  window.PS_PLAYER_V = "2026-08-05-a";

  /* ====================================================================
     NOS LIBELLÉS SUIVENT LA LANGUE  (05/08 — piste trouvée par Ziad)
     --------------------------------------------------------------------
     Ziad : « on a refait le design du player, ça joue ? » — oui, en partie, et
     la mesure l'a confirmé. « Leçon précédente » et « Leçon suivante » sont
     écrites EN DUR par ce fichier, donc **injectées après le passage de
     Weglot** : il ne peut pas les voir, et elles restent françaises même quand
     `Weglot.getCurrentLang()` vaut `en` (relevé en direct sur le lecteur).
     🔴 Ce n'est pas TOUT le problème : « Retour à la page du cours » et les
     titres d'activités viennent de LearnWorlds et ne sont pas traduits non plus
     — ça, c'est hors de notre portée, et la documentation LearnWorlds annonce
     pourtant l'inverse. Question posée à leur support.
     ⇒ Ici on répare CE QUI EST À NOUS. Trois chaînes, pas une table à
     maintenir : dès qu'on écrit un texte dans le DOM, il doit connaître la
     langue, sinon on annule la traduction du site sans s'en rendre compte.
     🔴 Repli sur le français si Weglot est absent : le site est francophone,
     et une langue inconnue ne doit pas produire un libellé vide. */
  var TEXTES = {
    fr: { prev:"Leçon précédente", next:"Leçon suivante" },
    en: { prev:"Previous lesson",  next:"Next lesson" }
  };
  function langue(){
    try{
      var l = (window.Weglot && Weglot.getCurrentLang) ? Weglot.getCurrentLang() : "";
      return TEXTES[l] ? l : "fr";
    }catch(e){ return "fr"; }
  }
  function MOT(cle){ return TEXTES[langue()][cle]; }

  var MARINE = "#243B6B";                 // couleur du chrome (barres, burger)
  var ACCENT = "#507EC5";                 // bleu de marque (leçon active, progression)
  var FONT = "Figtree,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  /* ================================================================
     1) STYLES
     ================================================================ */
  if (!document.getElementById("ps-player-css")) {
    var W = "#coursePlayerWrapper ";
    var css = [
      /* --- Chrome unifié en MARINE (barre haute, navigation, burger, header) --- */
      W + ".-default-course-player-topbar{background:" + MARINE + " !important;height:60px !important;border-bottom:none !important;box-shadow:0 -2px 16px rgba(15,23,42,.16) !important;}",
      W + ".-default-course-player-nav{background:" + MARINE + " !important;height:60px !important;display:flex !important;align-items:center !important;}",
      W + ".-default-course-player-hamburger,"
        + W + ".-first-col-topbar,"
        + W + ".-default-course-player-topbar-back,"
        + W + ".-default-course-player-name-progress{background:" + MARINE + " !important;}",

      /* --- Textes blancs sur le chrome --- */
      W + ".-default-course-player-topbar," + W + ".-default-course-player-topbar *{color:#fff !important;}",
      W + ".-default-course-player-nav a," + W + ".-default-course-player-nav button{color:#fff !important;}",
      W + ".-default-course-player-topbar svg," + W + ".-default-course-player-topbar svg *{fill:#fff !important;stroke:#fff !important;}",

      /* --- Titre du cours --- */
      W + ".-default-course-player-name{color:#fff !important;font-weight:700 !important;letter-spacing:-.01em !important;font-family:" + FONT + " !important;}",

      /* --- Police Figtree sur le chrome + la liste --- */
      W + ".-default-course-player-topbar," + W + ".-default-course-player-topbar *,"
        + W + ".-first-col-topbar," + W + ".-lrn-path-wrapper,"
        + W + ".-lrn-path-wrapper *:not(svg):not(i){font-family:" + FONT + " !important;}",

      /* --- Burger : flèche native → 3 traits (technique de Ziad) --- */
      /* 🔴 LE MÊME élément .-default-course-player-topbar-back sert de burger dans les DEUX
         états → il faut un décalage PAR ÉTAT, sinon on répare l'un en cassant l'autre :
           • FERMÉ : la boîte tombe à x=-5 (transform natif translateX(45) sur base -50) →
             burger collé/rogné au bord gauche. Fix : left:16px → inset à x≈11.
           • OUVERT : ce même +16 poussait le burger (haut-droite du sommaire) HORS du
             panneau marine (débordait de ~11px dans le blanc). D'où : left:0 en BASE
             (ouvert = à plat, pas de débordement), +16 SEULEMENT en fermé.
         L'état est encodé dans le style inline de .-first-col : fermé ⇒ left négatif
         (ex. -446px) → sélecteur [style*='left: -']. Vérifié en direct : fermé inset,
         ouvert -5px à l'intérieur du bord marine. Valeur d'inset (16px) ajustable. */
      W + ".-default-course-player-topbar-back{position:relative !important;color:#fff !important;left:0 !important;}",
      W + ".-first-col[style*='left: -'] .-default-course-player-topbar-back{color:#fff !important;left:16px !important;}",
      W + ".-default-course-player-topbar-back-arrow{width:34px !important;height:34px !important;overflow:visible !important;"
        + "background:linear-gradient(currentColor,currentColor) center calc(50% - 8px)/26px 4px no-repeat,"
        + "linear-gradient(currentColor,currentColor) center center/26px 4px no-repeat,"
        + "linear-gradient(currentColor,currentColor) center calc(50% + 8px)/26px 4px no-repeat !important;}",
      W + ".-default-course-player-topbar-back-arrow g," + W + ".-default-course-player-topbar-back-arrow path{opacity:0 !important;}",

      /* --- Liste des chapitres (sommaire) : épurée, compacte --- */
      W + ".-lrn-path-wrapper{background:#fff !important;padding:10px 12px !important;overflow-y:auto !important;scrollbar-width:none !important;}",
      W + ".-lrn-path-wrapper::-webkit-scrollbar{display:none !important;}",
      W + ".-lrn-path-wrapper," + W + ".-lrn-path-wrapper *," + W + ".lrn-path," + W + ".lrn-path *,"
        + W + ".lrn-path-cont," + W + ".lrn-path-con-selected{background:transparent !important;box-shadow:none !important;border:0 !important;}",
      W + ".lrn-path-con-selected::before," + W + ".lrn-path-con-selected::after,"
        + W + ".lrn-path-cont::before," + W + ".lrn-path-cont::after{display:none !important;content:none !important;}",
      W + ".lrn-path-cont{padding:7px 0 !important;margin:0 !important;border-radius:0 !important;}",
      W + ".lrn-path-cont-link{display:flex !important;align-items:center !important;gap:8px !important;}",
      W + ".lrn-path-cont-icon{width:18px !important;min-width:18px !important;margin:0 8px 0 0 !important;opacity:.6 !important;}",
      W + ".lrn-path-cont-name{font-family:" + FONT + " !important;font-size:15px !important;line-height:1.32 !important;font-weight:400 !important;"
        + "color:#555 !important;white-space:normal !important;overflow:visible !important;text-overflow:unset !important;margin:0 !important;padding:0 12px 0 0 !important;}",
      W + ".lrn-path-con-selected .lrn-path-cont-name{color:" + ACCENT + " !important;font-weight:600 !important;}",
      W + ".lrn-path-cont:hover .lrn-path-cont-name{color:" + MARINE + " !important;}",
      W + ".lrn-path-cont-extras{margin-left:auto !important;padding-left:8px !important;}",

      /* --- Coche de complétion : pastille accent + ✓ blanche, centrée ---
         🔴 Natif = ✓ FIN en #3887B4 (bleu des filtres, pas notre accent) ; le wrapper
         .lrn-path-completion est épinglé EN HAUT (top:-3;bottom:27) et le cercle est en
         position:absolute + translate(-50%) → tick petit, mauvaise couleur, collé en haut
         (« moche et pas aligné »). Fix : le wrapper occupe toute la hauteur de ligne
         (top:0;bottom:0) en flex centré ; le cercle repasse en position:static pour être
         centré par le flex ; on en fait un DISQUE accent 18px avec ✓ blanche. Centrage
         vérifié en direct (delta=0 vs le nom). Ne touche que .completed (leçons finies). */
      W + ".lrn-path-completion{top:0 !important;bottom:0 !important;right:12px !important;height:auto !important;transform:none !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
      W + ".lrn-path-completion-circle.completed{position:static !important;top:auto !important;left:auto !important;right:auto !important;bottom:auto !important;width:18px !important;height:18px !important;min-width:18px !important;border-radius:50% !important;background:" + ACCENT + " !important;transform:none !important;display:flex !important;align-items:center !important;justify-content:center !important;}",
      W + ".lrn-path-completion-circle.completed::after{content:'\\2713' !important;color:#fff !important;font-size:11px !important;line-height:1 !important;font-weight:700 !important;position:static !important;transform:none !important;}",

      /* --- Barre de progression : bleu de marque sur piste translucide ---
         🔴 Le vrai DOM LW = .-default-course-player-progress-bar (PISTE) +
         .-default-course-player-progress-bar-interior (REMPLISSAGE, porte clr1-bg
         → blanc natif). Les anciens sélecteurs progress-bar-full/current N'EXISTAIENT
         PAS → le remplissage restait BLANC. Corrigé sur les vrais noms. */
      W + ".-default-course-player-progress-bar{background:rgba(255,255,255,.28) !important;}",
      W + ".-default-course-player-progress-bar-interior{background:" + ACCENT + " !important;}",

      /* --- Boutons de navigation prev/suivant : libellés + chevrons (Ziad) --- */
      ".default-course-player-nav-btn{max-width:42% !important;display:flex !important;align-items:center !important;}",
      ".default-course-player-nav-btn.previous{justify-content:flex-start !important;}",
      ".default-course-player-nav-btn.next{justify-content:flex-end !important;margin-left:auto !important;}",
      ".default-course-player-nav-btn-lbl{display:block !important;max-width:420px !important;overflow:hidden !important;white-space:nowrap !important;"
        + "text-overflow:ellipsis !important;line-height:1.3 !important;font-size:18px !important;font-family:" + FONT + " !important;}",
      ".default-course-player-nav-btn-lbl small{display:block !important;color:rgba(255,255,255,.75) !important;font-size:12px !important;margin-bottom:3px !important;}",
      ".default-course-player-nav-btn-arrow{display:none !important;}",
      ".default-course-player-nav-btn.previous::before{content:'\\276E' !important;color:#fff !important;font-size:34px !important;font-weight:300 !important;margin-right:18px !important;}",
      ".default-course-player-nav-btn.next::after{content:'\\276F' !important;color:#fff !important;font-size:34px !important;font-weight:300 !important;margin-left:18px !important;}",
      "@media(max-width:768px){.default-course-player-nav-btn{max-width:46% !important;}"
        + ".default-course-player-nav-btn-lbl{font-size:14px !important;max-width:170px !important;}"
        + ".default-course-player-nav-btn.previous::before,.default-course-player-nav-btn.next::after{font-size:28px !important;}}"
    ].join("");
    var st = document.createElement("style");
    st.id = "ps-player-css";
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ================================================================
     2) Ouverture/fermeture du sommaire au chargement (repris de Ziad)
     ================================================================ */
  (function () {
    var iv = setInterval(function () {
      var btn = document.querySelector(".js-showhide-btn");
      if (btn) { btn.click(); clearInterval(iv); }
    }, 20);
    setTimeout(function () { clearInterval(iv); }, 8000);   // garde-fou : ne tourne pas indéfiniment
  })();

  /* ================================================================
     3) Réécriture des boutons prev/suivant : libellé + nom de leçon (Ziad)
     ================================================================ */
  (function () {
    function clean(t) { return (t || "").replace(/\s+/g, " ").trim(); }
    function nameOf(el) { var n = el && el.querySelector(".lrn-path-cont-name"); return clean(n && n.textContent); }
    function update() {
      var items = [].slice.call(document.querySelectorAll(".lrn-path-cont"));
      var current = document.querySelector(".lrn-path-con-selected");
      if (!current) return;
      var i = items.indexOf(current);
      var prev = nameOf(items[i - 1]);
      var next = nameOf(items[i + 1]);
      var prevBtn = document.querySelector(".default-course-player-nav-btn.previous");
      var nextBtn = document.querySelector(".default-course-player-nav-btn.next");
      var prevLbl = prevBtn && prevBtn.querySelector(".default-course-player-nav-btn-lbl");
      var nextLbl = nextBtn && nextBtn.querySelector(".default-course-player-nav-btn-lbl");
      if (prevBtn && !prevLbl) { prevLbl = document.createElement("span"); prevLbl.className = "default-course-player-nav-btn-lbl"; prevBtn.appendChild(prevLbl); }
      if (nextBtn && !nextLbl) { nextLbl = document.createElement("span"); nextLbl.className = "default-course-player-nav-btn-lbl"; nextBtn.insertBefore(nextLbl, nextBtn.firstChild); }
      if (prevBtn) {
        if (prev) {
          prevBtn.style.visibility = "visible"; prevBtn.style.pointerEvents = "auto";
          prevLbl.innerHTML = "<small>" + MOT("prev") + "</small>" + prev;   // textContent des noms vient du DOM natif
        } else { prevBtn.style.visibility = "hidden"; }
      }
      if (nextBtn && next) { nextLbl.innerHTML = "<small>" + MOT("next") + "</small>" + next; }
    }
    update();
    setInterval(update, 800);
  })();
})();
