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
      /* left:15px s'ajoute au transform natif (qui fait dépasser le burger) sans le
         casser → burger non rogné (passait de left -5 à +10). border-radius symétrique
         + ombre légère = burger flottant propre (au lieu du bord plat rogné). */
      W + ".-default-course-player-topbar-back{position:relative !important;color:#fff !important;left:15px !important;border-radius:8px !important;box-shadow:0 3px 12px rgba(15,23,42,.2) !important;}",
      W + ".-first-col[style*='left: -'] .-default-course-player-topbar-back{color:#fff !important;}",
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

      /* --- Barre de progression : bleu de marque sur translucide --- */
      W + ".-default-course-player-progress-wrapper .progress," + W + "[class*='progress-bar-full']{background:rgba(255,255,255,.22) !important;}",
      W + "[class*='progress-bar-current']," + W + ".-default-course-player-progress-wrapper .progress>*{background:" + ACCENT + " !important;}",

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
          prevLbl.innerHTML = "<small>Leçon précédente</small>" + prev;   // textContent des noms vient du DOM natif
        } else { prevBtn.style.visibility = "hidden"; }
      }
      if (nextBtn && next) { nextLbl.innerHTML = "<small>Leçon suivante</small>" + next; }
    }
    update();
    setInterval(update, 800);
  })();
})();
