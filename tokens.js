/* ============================================================
   TOKENS — le design system PrepaStrat en un seul endroit
   ------------------------------------------------------------
   À charger dans le Code personnalisé du SITE (Réglages du SITE, à côté de
   `mega-menu.js`), pour qu'il soit présent sur TOUTES les pages :
     <script src="https://extremum84.github.io/lw-course-cards/tokens.js"></script>

   ⚠️ GitHub Pages, PAS jsDelivr (abandonné le 16/07 : `@main` figé 12h en
   arrière, deux régressions en prod le même jour). Déploiement = `git push`.

   À QUOI ÇA SERT : changer une valeur ICI la change sur toutes les pages d'un
   coup. Avant, le violet `#6161FF` était écrit en dur 34 fois dans 9 fichiers.

   🔴 CHAQUE `var()` DES AUTRES FICHIERS PORTE SA VALEUR EN REPLI :
       `color:var(--ps-accent,#507EC5)`
   Donc si CE fichier ne charge pas (oubli dans le code du site, panne de
   Pages…), **rien ne casse** : chaque page retombe exactement sur les valeurs
   d'avant. Ne jamais retirer ces replis : ils sont le filet de sécurité de tout
   le système. Ils doivent rester égaux aux valeurs ci-dessous.

   ------------------------------------------------------------
   🔴🔴 LE BLOC DE VALEURS PLUS BAS EST RÉÉCRIT PAR MACHINE.
   Le configurateur (`configurateur.html`, bouton « Publier ») remplace TOUT ce
   qui se trouve entre les balises `>>> DEBUT TOKENS` et `<<< FIN TOKENS` via
   l'API GitHub. **N'y mettre AUCUN commentaire ni aucune logique : ils seraient
   effacés au prochain clic sur Publier.** Tout ce qu'il faut expliquer se met
   ICI, au-dessus. Les marqueurs eux-mêmes ne doivent jamais être renommés.
   ------------------------------------------------------------

   CE QU'IL FAUT SAVOIR SUR LES VALEURS :

   - `--ps-accent-rgb` = les CANAUX du violet, pour les `rgba()` : une variable
     ne peut pas être glissée dans `rgba(#hex, .18)`. C'est la lueur des cartes
     cours qui s'en sert. 🔴 DOIT rester synchronisé avec `--ps-accent` — le
     configurateur le DÉRIVE tout seul, à la main il faut y penser.

   - `--ps-r-card` commande AUSSI le liseré de la page Cours, dont le rect est
     tracé à `calc(var(--ps-r-card) - 2px)` pour rester concentrique.

   - `--ps-lvl1..6` (+ `-tint`) : pastille « Niveau N » et barre de progression,
     page Cours. Le niveau 1 SUIT la marque (`var(--ps-accent-hover)`) : changer
     l'accent recolore sa pastille. C'était déjà le cas de fait (mêmes valeurs),
     c'est désormais explicite.

   - `--ps-f1..6` (+ `-tint`) : cycle des pastilles de champs, fiches secteur.
     Le champ 1 suit la marque, comme le niveau 1. ⚠️ Palette DISTINCTE des
     niveaux : mêmes teintes parfois, rôles différents — ne pas les fusionner.

   - `--ps-font` : la police doit être DISPONIBLE côté LearnWorlds, sinon le
     site retombe sur la suivante de la liste.
   ============================================================ */
(function(){
  "use strict";

  /* ====================================================================
     LE LISERÉ DES AUTRES PAGES — SA FEUILLE, PUBLIÉE AU CONFIGURATEUR
     --------------------------------------------------------------------
     Ce texte était enfermé dans `contourStyle()`, tout en bas. Il remonte ici
     pour une seule raison : l'aperçu du configurateur doit pouvoir l'afficher
     SANS en garder une copie. Chaque script de cartes publie déjà le sien dans
     `window.PS_CSS` derrière le drapeau `PS_CSS_ONLY` ; c'était le seul liseré
     qui manquait à l'appel, et l'aperçu le redessinait donc de mémoire — une
     copie de plus à tenir à jour, c'est-à-dire une divergence de plus en attente.
     🔴 `PS_CSS_ONLY` EST POSÉ PAR LE CONFIGURATEUR, JAMAIS PAR LE SITE. Sur une
     page LearnWorlds le drapeau est absent : on publie, puis on continue
     normalement. Dans le configurateur on publie et on SORT immédiatement — rien
     de ce fichier ne s'exécute, pas un token sur `:root`, pas un badge d'en-tête.

     🔴🔴 TOUT EST SCOPÉ À `.ps-line-hote`, la classe que ce code pose sur les
     cartes qu'il prend en charge. Régression signalée par Ziad : la règle
     était écrite sur `.ps-mline` tout court, avec `!important`. Or la page
     Cours a SON PROPRE liseré, défini dans `course-cards.js` avec
     `z-index:-1` pour passer SOUS l'illustration ronde — mon `!important` le
     battait, et le trait remontait par-dessus les images.
     Deux fichiers qui stylent le même élément, c'est un conflit garanti : ce
     code ne doit toucher QUE les cartes qu'il a lui-même équipées, et laisser
     `course-cards.js` maître chez lui.
     🔴 `z-index:0` et non 1, même pour nos propres cartes : au-dessus du fond,
     sous tout élément qui se place explicitement plus haut. */
  var LINE_CSS=
      ".ps-line-hote > .ps-mline{position:absolute !important;inset:0 !important;width:100% !important;height:100% !important;"+
        "pointer-events:none !important;z-index:0 !important;}"+
      ".ps-line-hote > .ps-mline rect{x:2px !important;y:2px !important;width:calc(100% - 4px) !important;height:calc(100% - 4px) !important;"+
        "rx:calc(var(--ps-r-card,16px) - 2px) !important;fill:none !important;stroke:var(--ps-line-c,rgb(var(--ps-accent-rgb,80,126,197))) !important;"+
        "stroke-width:var(--ps-line-w,4) !important;stroke-dasharray:1.02 !important;stroke-dashoffset:1.02 !important;"+
        "transition:stroke-dashoffset var(--ps-line-t,1.1s) ease !important;}"+
      ".ps-line-hote:hover > .ps-mline rect{stroke-dashoffset:0 !important;}"+
      /* Le liseré déborde de la carte si elle rogne son contenu. */
      ".ps-line-hote{position:relative !important;overflow:visible !important;}"+
      /* 🔴🔴 LE CONTENU PASSE AU-DESSUS DU TRAIT. Signalé par Ziad : le liseré
         recouvrait les illustrations rondes qui débordent en haut des cartes.
         Cause : un élément POSITIONNÉ (le SVG) peint au-dessus du contenu non
         positionné, quel que soit son rang dans le DOM — l'insérer en premier
         enfant ne suffit donc pas.
         🔴 On remonte le CONTENU plutôt que d'enfoncer le trait : à `z-index:-1`
         il passerait derrière le fond blanc de la carte, qui est porté par
         l'hôte lui-même, et redeviendrait invisible. C'est le piège inverse,
         déjà rencontré ce matin. */
      ".ps-line-hote > *:not(.ps-mline){position:relative !important;z-index:1 !important;}"+
      "@media(prefers-reduced-motion:reduce){.ps-line-hote > .ps-mline rect{transition:none !important;}}";
  window.PS_CSS=window.PS_CSS||{};
  window.PS_CSS.contour=LINE_CSS;
  if(window.PS_CSS_ONLY) return;

  var VALEURS=[
/* >>> DEBUT TOKENS — réécrit par le configurateur, ne rien ajouter ici */
    "--ps-accent:#3887b4",
    "--ps-accent-rgb:56,135,180",
    "--ps-accent-hover:#203866",
    "--ps-accent-tint:#edf4ff",
    "--ps-text:#203866",
    "--ps-text-soft:#676879",
    "--ps-surface-soft:#F7F8FB",
    "--ps-border:#E6E9EF",
    "--ps-cab-logo:#007260",
    "--ps-an-avatar:56px",
    "--ps-an-col:260px",
    "--ps-pf-ring:64px",
    "--ps-pf-bar:8px",
    "--ps-an-btn:#009e78",
    "--ps-font:Figtree,-apple-system,Segoe UI,Roboto,sans-serif",
    "--ps-r-card:16px",
    "--ps-r-pill:999px",
    "--ps-r-btn:10px",
    "--ps-lvl1:#3887b4",
    "--ps-lvl1-tint:#edf4ff",
    "--ps-lvl2:#ff5e5b",
    "--ps-lvl2-tint:#fdecef",
    "--ps-lvl3:#deb125",
    "--ps-lvl3-tint:#fff3e0",
    "--ps-lvl4:#009e78",
    "--ps-lvl4-tint:#e4fbf6",
    "--ps-lvl5:#c51d4a",
    "--ps-lvl5-tint:#fff0f4",
    "--ps-lvl6:#203866",
    "--ps-lvl6-tint:#edf4ff",
    "--ps-f1:#009e78",
    "--ps-f1-tint:#e4fbf6",
    "--ps-f2:#ff5e5b",
    "--ps-f2-tint:#fff0f4",
    "--ps-f3:#fdab3d",
    "--ps-f3-tint:#fff3e0",
    "--ps-f4:#3887b4",
    "--ps-f4-tint:#edf4ff",
    "--ps-f5:#c51d4a",
    "--ps-f5-tint:#fff0f4",
    "--ps-f6:#6b7280",
    "--ps-f6-tint:#ecedef"
/* <<< FIN TOKENS */
  ];

  var TOKENS=":root{"+VALEURS.join(";")+";}";

  /* Idempotent : l'observer des autres scripts peut rappeler le DOM en boucle,
     on ne réécrit que si le contenu a changé. */
  function poser(){
    var st=document.getElementById("ps-tokens");
    if(!st){
      st=document.createElement("style"); st.id="ps-tokens";
      /* En TÊTE du <head> : les tokens ne sont que des valeurs, ils ne doivent
         jamais entrer en concurrence de cascade avec les feuilles des pages. */
      document.head.insertBefore(st, document.head.firstChild);
    }
    if(st.textContent!==TOKENS) st.textContent=TOKENS;
  }

  /* ====================================================================
     ACCENT PAR PAGE — une couleur dominante par page
     --------------------------------------------------------------------
     Une seule couleur par page ; survol / teinte / canaux RGB sont DÉRIVÉS
     (mêmes coefficients que le configurateur). Pages non listées -> accent
     global défini plus haut (le bleu). Clé = slug LearnWorlds : la classe
     `slug-…` que LW pose sur le <body>, égale à "slug-" + le slug d'URL.

     🔴 Couleur CLAIRE (ex. jaune) : illisible en TEXTE sur blanc. On assombrit
     alors l'accent-texte jusqu'à un contraste lisible (>=4:1), MAIS la lueur
     des cartes (`--ps-accent-rgb`) garde la couleur VIVE. L'impression « page
     jaune » vient de la lueur + des pastilles claires, pas du texte. Les
     couleurs déjà foncées (vert, rouge) restent fidèles au hex donné.

     Pour changer/ajouter une page : une ligne dans PAGE_ACCENTS, c'est tout.

     🔴🔴 CE BLOC EST DÉSORMAIS RÉÉCRIT PAR LE CONFIGURATEUR (03/08, demande de
     Ziad : « je veux pouvoir modifier les couleurs de chaque page principale »).
     Mêmes règles que le bloc TOKENS : **aucun commentaire ni logique entre les
     marqueurs**, ils seraient effacés au prochain « Publier ». Les libellés des
     pages (« Secteurs », « Cabinets »…) vivent donc dans le configurateur, pas
     ici. Ne jamais renommer les marqueurs sans changer le regex là-bas — il
     refuse d'écrire s'il ne les trouve pas, ce qui est le comportement voulu.

     Mémo des couleurs, hors du bloc pour survivre aux publications :
       fiches-secteur = Secteurs (jaune) · etudes-cas = Études de cas
       (gris) · fiches-cabinet = Cabinets (vert, choix du 24/07, était
       rouge #c51d4a).

     🔴🔴 SLUG RENOMMÉ LE 03/08 : `fiches-secteur-clone` -> `fiches-cabinet`.
     Trouvé en allant mesurer la page pour la maquette : elle renvoyait **404**,
     et la page servie sous son nouveau nom s'affichait en BLEU DE MARQUE — elle
     avait perdu son vert, puisque cette table est indexée par slug.
     17 références mises à jour dans 6 fichiers, dont un lien du PIED DE PAGE
     présent sur tout le site et qui menait donc à une 404 pour tout le monde.
     C'est la troisième fois en une semaine qu'un renommage de page casse des
     références en silence (deux slugs le 30/07). **Un slug qui change ne
     prévient personne : à chaque renommage, chercher le slug dans tout le dépôt.**

     `REGLAGES` porte les valeurs libres (URLs de vidéo…). 🔴 Il vit ICI plutôt
     que dans un bloc de texte de la home : Ziad en avait posé un sur la page,
     et il s'affichait en clair pour les visiteurs. La configuration n'a rien à
     faire dans le contenu. */
/* >>> DEBUT PAGES — réécrit par le configurateur, ne rien ajouter ici */
  var PAGE_ACCENTS={
    "sentrainer":"#c51d4a",
    "fiches-cabinet":"#009e78",
    "fiches-secteur":"#deb125",
    "etudes-cas":"#6b7280"
  };
  var PAGE_STYLE={
    "formation-par-modules":{"contour":1,"ep":4,"duree":1.1}
  };
  var REGLAGES={
    "lien_video":"https://player.vimeo.com/video/910803542?",
    "lien_video_background":"https://player.vimeo.com/video/910803542?"
  };
/* <<< FIN PAGES */
  window.PS_REGLAGES=REGLAGES;                  // lu par home-page.js

  /* ====================================================================
     COULEUR DES PICTOS DU MEGA MENU — UNE PAR ENTRÉE, FIXE
     --------------------------------------------------------------------
     Décidé par Ziad le 04/08, après deux essais qui ne convenaient pas :
       1. couleurs cyclées par POSITION (`nth-child(6n+N)`) -> elles changeaient
          d'un menu à l'autre sans rien signifier ;
       2. couleur de la page VISÉE -> sept entrées sur onze tombaient sur le bleu
          de marque, faute de couleur propre, et le menu devenait monotone.
     ⇒ Chaque entrée porte SA teinte, décidée une fois, **indépendante des pages**
     et identique partout sur le site.

     🔴 LA CLÉ EST LE SLUG, PAS LE LIBELLÉ. Les libellés sont traduits par Weglot :
     une table indexée par « Fiches Secteur » perdrait toutes ses couleurs en
     anglais. Les jumelles EN sont résolues via `PAGES_FR` par `mega-menu.js`.
     🔴 Une entrée absente ne reçoit RIEN et retombe sur l'accent de la marque
     (règle CSS de `.ps-mm-ic`). C'est le cas voulu pour Profil et Déconnexion :
     ce sont des entrées de COMPTE, pas de contenu — les laisser sobres les
     distingue du reste.
     🔴🔴 CE BLOC EST RÉÉCRIT PAR LE CONFIGURATEUR (04/08). Mêmes règles que les
     blocs TOKENS et PAGES : **aucun commentaire ni logique entre les marqueurs**,
     ils seraient effacés à la prochaine publication. Les LIBELLÉS des entrées
     (« Fiches Secteur », « Bootcamp »…) vivent donc dans le configurateur.
     🔴 La clé peut porter une BARRE OBLIQUE : le menu vise `course/supports-webinar`,
     qui n'est pas un slug de page mais un chemin de cours. Le Worker a un motif de
     clé distinct de celui du bloc PAGES pour cette raison — le motif des pages
     refuserait cette entrée, et le Webinar perdrait sa couleur.
     🔴 Une entrée ABSENTE de la table retombe sur l'accent de la marque. C'est un
     état qui se règle : dans le configurateur, décocher la case d'une entrée la
     retire d'ici. Profil et Déconnexion n'y figurent pas du tout, volontairement. */
/* >>> DEBUT MENU — réécrit par le configurateur, ne rien ajouter ici */
  var MENU_COULEURS={
    "course/supports-webinar":"#12A85F",
    "bootcamp-prepastrat":"#ff5e5b",
    "entretiens-en-conditions-reelles":"#fdab3d",
    "formation-par-modules":"#3887b4",
    "fiches-cabinet":"#009e78",
    "fiches-secteur":"#deb125",
    "sentrainer":"#c51d4a",
    "etudes-cas":"#6b7280",
    "annuaire-partenaire-de-cas":"#203866"
  };
/* <<< FIN MENU */
  window.PS_MENU_COULEURS=MENU_COULEURS;        // lu par mega-menu.js

  function _chan(hex){var h=hex.replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
  function _hex2hsl(hex){var c=_chan(hex),r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,H=0,L=(mx+mn)/2,S=d===0?0:d/(1-Math.abs(2*L-1));if(d!==0){if(mx===r)H=60*(((g-b)/d)%6);else if(mx===g)H=60*((b-r)/d+2);else H=60*((r-g)/d+4);}if(H<0)H+=360;return [H,S*100,L*100];}
  function _hsl2hex(hh,s,l){s/=100;l/=100;var a=s*Math.min(l,1-l);function f(n){var k=(n+hh/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,"0");}return "#"+f(0)+f(8)+f(4);}
  function _lum(hex){var c=_chan(hex).map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
  function _contraste(hex){return 1.05/(_lum(hex)+0.05);}

  /* hex de page -> {accent (texte, lisible), rgb (lueur, vive), hover, tint}.
     hover/tint : mêmes coefficients que deduire() du configurateur. */
  /* 🔴🔴 PLUS AUCUN ASSOMBRISSEMENT (demande de Ziad, 03/08 : « je ne veux plus
     que tu assombrisses la couleur nulle part »). La couleur choisie est celle
     qui s'affiche, point.
     Ce que ça retire : une correction de contraste posée le 24/07, qui assombrissait
     les teintes claires pour qu'elles restent lisibles en TEXTE. Elle produisait
     silencieusement une couleur que Ziad n'avait pas choisie — sur Fiches secteur,
     son #fad54a ressortait en #987904, et coexistait avec deux autres ors sur la
     même page. C'est ce décalage invisible qui a fini par le gêner.
     ⚠️ CONSÉQUENCE ASSUMÉE : une couleur très claire sur fond blanc devient peu
     lisible en texte. C'est désormais un choix qui se voit et se corrige dans le
     configurateur, au lieu d'être compensé dans le dos de celui qui l'a fait. */
  function _deriver(hex){
    var t=_hex2hsl(hex), accent=hex;
    var ta=_hex2hsl(accent);
    return {
      accent:accent,
      rgb:_chan(hex).join(","),                                    /* lueur = couleur VIVE d'origine */
      hover:_hsl2hex(ta[0], Math.max(0,ta[1]*0.71), Math.max(0,ta[2]-10.4)),
      tint:_hsl2hex(t[0], 100, 96.5)
    };
  }

  /* 🔴🔴 REPLI SUR L'URL, ET C'EST LUI QUI COMPTE. Ziad : « quand je charge la
     page Cours le contenu arrive en bleu puis passe au rouge, c'est visible ».
     Cause : ce script est charge dans l'EN-TETE du site, donc `document.body`
     n'existe pas encore quand il s'execute. La fonction rendait "" , la couleur
     de page n'etait pas posee, et le bleu global s'affichait — puis le rouge
     arrivait au DOMContentLoaded. Un clignotement de marque a chaque chargement.
     `location.pathname` est disponible IMMEDIATEMENT : on peut donc poser la
     bonne couleur avant le moindre pixel. La classe du body reste prioritaire
     quand elle existe (LearnWorlds fait foi sur son propre slug), l'URL ne sert
     que tant qu'elle manque. */
  function slugPage(){
    var b=document.body;
    var m=b && b.className.match(/slug-([a-z0-9-]+)/i);
    if(m) return m[1];
    return (location.pathname||"").split("/").filter(Boolean).pop()||"";
  }

  function accentPage(){
    var slug=slugPage();                    /* plus de dependance au <body> : cf. slugPage */
    /* 🔴🔴 UNE PAGE JUMELLE HERITE DES REGLAGES DE SA PAGE FRANCAISE. Question de
       Ziad : « la page en anglais est restee en bleu, c'est normal ? ». Non — et
       c'est la limite que j'avais signalee en construisant les jumelles sans la
       traiter : ces tables sont indexees par SLUG, et la page EN a le sien.
       Elle n'heritait donc ni de la couleur, ni du contour.
       Une jumelle est la MEME page dans une autre langue : elle doit avoir la
       meme apparence. On remonte donc a la page FR (`PAGES_FR`) pour lire les
       reglages. Consequence voulue : regler la couleur de Cours la regle aussi
       pour sa version anglaise, sans double saisie et sans risque de divergence. */
    var base=(slug && PAGES_FR[slug]) || slug;
    var hex=base ? PAGE_ACCENTS[base] : null;
    var sty=(base && PAGE_STYLE[base]) || null;
    var st=document.getElementById("ps-tokens-page");
    var css="";
    if(hex){
      var d=_deriver(hex);
      css+=":root{--ps-accent:"+d.accent+";--ps-accent-rgb:"+d.rgb+";--ps-accent-hover:"+d.hover+";--ps-accent-tint:"+d.tint+";}";
    }
    /* 🔴 Les réglages de contour sont SÉPARÉS de la couleur : une page peut avoir
       un contour sans couleur propre, et l'inverse. Les lier aurait obligé à
       donner une couleur à une page juste pour épaissir son trait. */
    if(sty){
      var v=[];
      if(sty.ep!=null)    v.push("--ps-line-w:"+sty.ep);
      if(sty.duree!=null) v.push("--ps-line-t:"+sty.duree+"s");
      /* 🔴 Couleur du trait FACULTATIVE. Absente = le liseré suit l'accent de la
         page, ce qu'il a toujours fait. On ne la pose que si Ziad l'a choisie :
         sans ça, une page sans réglage se retrouverait figée sur une couleur au
         lieu de suivre la sienne. */
      if(sty.couleur)     v.push("--ps-line-c:"+sty.couleur);
      if(v.length) css+=":root{"+v.join(";")+";}";
    }
    if(!css){ if(st) st.textContent=""; return; }                 /* page non réglée -> valeurs globales */
    /* APRÈS ps-tokens dans le <head> : même spécificité (:root), l'ordre du DOM
       tranche -> l'override de page gagne sur les valeurs globales. */
    if(!st){ st=document.createElement("style"); st.id="ps-tokens-page"; document.head.appendChild(st); }
    if(st.textContent!==css) st.textContent=css;
  }

  /* ====================================================================
     CONTOUR ANIMÉ — DISPONIBLE PARTOUT, ACTIVÉ NULLE PART PAR DÉFAUT
     --------------------------------------------------------------------
     Demande de Ziad (03/08) : « tu peux le rajouter partout mais ne pas
     l'activer ». Le liseré qui se dessine au survol n'existait que sur la page
     Cours, écrit en dur dans `course-cards.js`. Il devient un réglage de page.

     🔴 ACTIVÉ NULLE PART SAUF OÙ IL L'EST DÉJÀ. `PAGE_STYLE` ne contient au
     départ que la page Cours, avec exactement ses valeurs actuelles (épaisseur 4,
     durée 1,1 s) : le site ne change donc pas d'un pixel tant que Ziad n'active
     rien. Un réglage neuf ne doit jamais modifier l'existant en s'installant.

     🔴 LA PAGE COURS GARDE SON PROPRE CODE. `course-cards.js` injecte déjà son
     liseré ; on ne le double pas ici (test `.ps-mline` déjà présent), on se
     contente de lui fournir les variables. Deux injecteurs sur la même carte,
     c'était la garantie d'un doublon invisible en test et voyant en prod.

     ⚠️ Réserve honnête : sur les autres pages, le liseré n'a jamais été dessiné.
     Leur carte peut porter un `overflow:hidden` qui le rognerait, ou un fond qui
     le masque. À vérifier page par page AU MOMENT de l'activer — d'où le fait
     qu'il soit livré éteint. */
  /* 🔴🔴 LE TRAIT PREND LA COULEUR VIVE, PAS L'ACCENT ASSOMBRI. Signale par
     Ziad : sur Fiches secteur le lisere sortait en or fonce (#987904) alors
     qu'il avait choisi #fad54a. `--ps-accent` est DELIBEREMENT assombri pour
     rester lisible en TEXTE (regle de contraste du 24/07) — mais un lisere
     n'est pas du texte, c'est un trait decoratif. Il prend donc la couleur
     VIVE, celle que Ziad a reellement choisie, comme le fait deja la lueur
     des cartes via ce meme `--ps-accent-rgb`.
     Une couleur propre de trait, si elle est reglee, reste prioritaire. */
  /* 🔴 Le texte de cette feuille vit tout en haut du fichier (`LINE_CSS`), pour
     pouvoir être PUBLIÉ au configurateur avant tout effet de bord. La règle et son
     commentaire sont là-bas ; ici, on ne fait que la poser. */
  function contourStyle(){
    if(document.getElementById("ps-line-css")) return;
    var st=document.createElement("style"); st.id="ps-line-css";
    st.textContent=LINE_CSS;
    (document.head||document.documentElement).appendChild(st);
  }
  /* 🔴 `.ps-abo-c` = les deux cartes de la page Formules. Elles ne sont pas des
     `.lw-course-card` : le `closest()` du bloc ci-dessous ne trouvera rien et
     retombera sur l'élément lui-même, ce qui est exactement le bon hôte ici.
     Sans cette entrée, cocher « liseré » sur cette page dans le configurateur
     n'aurait produit RIEN — une case qui ne fait rien est pire qu'une case
     absente, elle fait croire que le réglage a été pris en compte. */
  var LINE_SEL=".ps-ccab,.ps-scard,.ps-cc,.ps-pfc,.ps-abo-c";   /* cartes des pages AUTRES que Cours */
  function contourPage(){
    var slug=slugPage(); if(!slug) return;
    var sty=PAGE_STYLE[slug];
    if(!sty || !sty.contour) return;                  /* éteint : on ne touche à rien */
    contourStyle();
    var NS="http://www.w3.org/2000/svg";
    document.querySelectorAll(LINE_SEL).forEach(function(inner){
      /* 🔴🔴 LE LISERÉ VA SUR LA CARTE, PAS SUR SON CONTENU. Mesuré sur
         /fiches-secteur : `.ps-scard` fait 315x86 alors que la carte visible
         (`.lw-course-card`) fait 317x174 — le trait faisait donc le tour du bloc
         de texte, au milieu de la carte. Il était bien là, il entourait le mauvais
         élément. `course-cards.js` vise l'hôte depuis le début ; ce code visait le
         conteneur intérieur parce que c'est lui que le sélecteur trouve. */
      var c=inner.closest(".lw-course-card")||inner;
      if(c.querySelector(":scope > .ps-mline")) return;            /* déjà posé (ou posé par sa page) */
      c.classList.add("ps-line-hote");
      var s=document.createElementNS(NS,"svg");
      s.setAttribute("class","ps-mline");
      s.setAttribute("preserveAspectRatio","none");
      s.setAttribute("aria-hidden","true");
      var r=document.createElementNS(NS,"rect");
      r.setAttribute("x","0"); r.setAttribute("y","0");
      r.setAttribute("width","100%"); r.setAttribute("height","100%");
      r.setAttribute("rx","16"); r.setAttribute("pathLength","1");
      /* 🔴 Insérer EN PREMIER et non en dernier : sans z-index explicite, un frère
         placé après passe au-dessus. Ajouté à la fin, le trait serait repassé
         par-dessus l'illustration ronde — exactement la régression signalée ce
         matin sur la page Cours, qu'il serait absurde de reproduire ici. */
      s.appendChild(r); c.insertBefore(s, c.firstChild);
    });
  }

  /* ====================================================================
     BOUTONS DE HERO « Cours » / « Compétences » — SITE-WIDE
     --------------------------------------------------------------------
     Ces boutons natifs (`learnworlds-button-outline-accent1`) apparaissent sur
     plusieurs pages (Cours, Compétences…) qui ne chargent PAS le même script de
     cartes. Leur style + l'état actif vivent donc ici (tokens.js est chargé
     partout), et non dans course-cards.js.

     Style pilule au design system ; le bouton qui correspond à la page courante
     passe en PLEIN à la couleur d'accent de la page. Repérage par POSITION (le
     bouton LW ne porte pas son URL cible de façon fiable) : map slug -> index.
     Ajouter une page = une ligne dans HERO_ACTIVE.

     ⚠️ L'ALIGNEMENT des boutons (boîte 1000px) reste dans course-cards.js : il
     n'est valable que là où le titre est calé sur 1000px (page Cours). Ailleurs
     (ex. Compétences) le titre est à sa place naturelle et les boutons suivent.
     ==================================================================== */
  var HERO_ACTIVE={ "formation-par-modules":0, "formation-par-thematiques":1 };
  var HERO_BTN_CSS=
      "#pageContent .learnworlds-button.learnworlds-button-outline-accent1{font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;font-size:15px !important;font-weight:600 !important;padding:11px 26px !important;height:auto !important;border-radius:var(--ps-r-pill,999px) !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;background:#fff !important;color:var(--ps-text,#1c1f26) !important;box-shadow:0 1px 2px rgba(0,0,0,.04) !important;transition:all .15s ease !important;cursor:pointer !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1 *{font-family:inherit !important;color:inherit !important;font-weight:inherit !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1:hover{border-color:var(--ps-accent,#507EC5) !important;color:var(--ps-accent,#507EC5) !important;background:var(--ps-accent-tint,#edf4ff) !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active{background:var(--ps-accent,#507EC5) !important;border-color:var(--ps-accent,#507EC5) !important;color:#fff !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active *{color:#fff !important;}"
    + "#pageContent .learnworlds-button.learnworlds-button-outline-accent1.ps-hb-active:hover{background:var(--ps-accent-hover,#486798) !important;border-color:var(--ps-accent-hover,#486798) !important;color:#fff !important;}";

  function heroBtns(){
    var st=document.getElementById("ps-hero-btn");
    if(!st){ st=document.createElement("style"); st.id="ps-hero-btn"; (document.head||document.documentElement).appendChild(st); }
    if(st.textContent!==HERO_BTN_CSS) st.textContent=HERO_BTN_CSS;
    if(!document.body) return;
    var m=document.body.className.match(/slug-([a-z0-9-]+)/i);
    var idx=m ? HERO_ACTIVE[m[1]] : undefined;
    var btns=document.querySelectorAll("#pageContent .learnworlds-button.learnworlds-button-outline-accent1");
    btns.forEach(function(b,i){ b.classList.toggle("ps-hb-active", idx!==undefined && i===idx); });
  }

  /* ====================================================================
     ANTI-FLASH (FOUC) — masquer les cartes tant que nos scripts ne les ont pas
     refaites, puis révéler en FONDU. Sinon on voit les cartes NATIVES de
     LearnWorlds une fraction de seconde (« l'ancien css ») avant le restyling.
     Scopé aux pages à cartes gérées (par slug) pour ne RIEN cacher ailleurs.
     Révélé dès qu'une carte reconstruite apparaît (.ps-mcard/.ps-cc/…), ou au
     bout de 3,5 s (filet de sécurité : ne JAMAIS laisser une page cachée, même
     si un script échoue).
     ⚠️ Efficace parce que ce fichier (petit, en cache) s'exécute avant que la
     grosse SPA de LearnWorlds ne peigne les cartes. ==================== */
  /* 🔴 MAJ 30/07 — les slugs de Cours et Compétences ont CHANGÉ : `empty` ->
     `formation-par-modules`, `page-introduction` -> `formation-par-comptences`
     (relevés dans le sitemap et vérifiés en direct ; `/page-introduction`
     renvoie désormais une page d'erreur). Conséquence de l'ancien nom ici :
     l'anti-flash ne s'appliquait plus du tout sur la page Cours.
     🔴🔴 MAJ 04/08 — deux de plus, trouvés par le sitemap : Compétences
     `formation-par-comptences` -> `formation-par-thematiques`, Études de cas
     `emptykk-clone-clone` -> `etudes-cas`. Les anciens noms de ce commentaire
     datent chaque étape : ne pas les réécrire. */
  /* ====================================================================
     PASTILLE DE FILTRE — DÉFINITION UNIQUE, SITE-WIDE (03/08)
     --------------------------------------------------------------------
     🔴 POURQUOI ICI : chaque page a sa PROPRE logique de filtrage (champs lus
     dans les descriptions sur Cas, catégories LearnWorlds sur Cabinets), mais
     l'APPARENCE doit être la même partout. Elle était définie deux fois, avec
     deux états actifs différents — bleu clair dans `filters.js`, bleu foncé plein
     dans `cabinet-cards.js` — et ça se voyait en passant d'une page à l'autre.
     Le style vit donc ici, dans le fichier chargé sur tout le site ; les fichiers
     de page ne gardent que leur logique et se contentent d'appliquer `.ps-cf`.
     🔴 Les filtres gardent leur bleu propre (#3887B4 survol, #29457B actif) et NE
     suivent PAS l'accent de page : c'est le système d'accent séparé du 17/07.
     ==================================================================== */
  function styleFiltrePastille(){
    if(document.getElementById("ps-pastille-style")) return;
    var st=document.createElement("style"); st.id="ps-pastille-style";
    st.textContent=
      ".ps-cf{display:inline-flex !important;align-items:center !important;height:44px !important;"+
        "padding:0 18px !important;margin:0 10px 10px 0 !important;border-radius:var(--ps-r-pill,999px) !important;"+
        "border:1.5px solid var(--ps-border,#E6E9EF) !important;background:#fff !important;"+
        "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;"+
        "font-size:14px !important;font-weight:600 !important;color:#4B5563 !important;line-height:1 !important;"+
        "-webkit-appearance:none !important;appearance:none !important;cursor:pointer !important;"+
        "user-select:none !important;transition:all .15s ease !important;}"+
      ".ps-cf:hover{border-color:#3887B4 !important;color:#3887B4 !important;background:#F3F9FC !important;}"+
      /* État actif ALIGNÉ sur `.ps-ff` de filters.js : bordure et texte bleus sur
         fond très clair. C'est la référence, puisque c'est ce que voient déjà les
         étudiants sur la page Cas. */
      ".ps-cf.ps-cf-on{border-color:#3887B4 !important;background:#F3F9FC !important;color:#3887B4 !important;}";
    (document.head||document.documentElement).appendChild(st);
  }
  window.PS_FILTRE_STYLE=styleFiltrePastille;   // les scripts de page l'appellent

  /* ====================================================================
     PAGES JUMELLES FR / EN — LA LANGUE EST PORTÉE PAR LA PAGE
     --------------------------------------------------------------------
     🔴🔴 POURQUOI CE CHANGEMENT (03/08, décision de Ziad). Jusqu'ici la langue
     se jouait CARTE PAR CARTE : on masquait celles de l'autre langue (voir plus
     bas `langCourses`). Deux raisons de fond ont fait tomber ce modèle :

     1. IL NE MARCHAIT PAS POUR UN ÉTUDIANT. La source des tags est
        `/api/courses`, qui renvoie **0 cours** à un non-admin (mesuré le 30/07
        sur le compte ESSEC). Le filtre retombait sur le suffixe « - EN » du
        titre, or Ziad marque l'anglais par un TAG. Les cours anglais restaient
        donc visibles chez l'étudiant, et masqués seulement chez l'admin.
     2. IL NE PASSE PAS À L'ÉCHELLE. À ~200 cours par langue, porter les deux
        versions sur la même page voudrait dire les TÉLÉCHARGER toutes les deux.
        Mesuré le 03/08 sur `/profile` : les cartes sont rendues CÔTÉ SERVEUR
        (une seule requête réseau au chargement), un seul élément en a posé
        **55 d'un coup**, et celles qui sont en `display:none` sont quand même
        **dans le DOM et dans les 427 Ko de HTML**. Masquer en CSS n'économise
        RIEN. La pagination `lw-load-more` existe mais ne plafonne pas le
        premier écran, et l'élément « programmes » n'en a même pas.

     ⇒ La langue devient une propriété de la PAGE : une page FR sourcée sur le
     programme FR, sa jumelle EN sourcée sur le programme EN. LearnWorlds ne
     charge que ce qu'on lui demande.

     🔴 POURQUOI PAS UN FILTRE NATIF (option écartée) : le menu de filtres LW
     n'offre que « tout / mon / pas encore inscrit / nouveau / populaire /
     gratuit / certificat » (+ les catégories sur certaines pages). **Aucun
     filtre par programme ni par langue** — vérifié sur Cours et sur
     Compétences. Il n'existe donc aucun moyen de faire changer de programme à
     un élément sans changer de page.

     🔴 RÈGLE : L'URL FAIT FOI, pas le cookie. Arriver sur une page EN force
     Weglot en anglais. Ça rend les liens partagés et les favoris corrects, et
     surtout ça rend la boucle de redirection IMPOSSIBLE (voir `ps-lang` plus
     bas). Une page SANS jumelle garde le comportement d'avant : Weglot traduit
     sur place et la langue mémorisée s'applique.

     AJOUTER UNE PAGE TRADUITE = UNE LIGNE DANS `PAGES_EN`. C'est le seul
     endroit à toucher : l'anti-flash, le board et les liens du menu en dérivent.
     ==================================================================== */
  /* 🔴 MAJ 04/08 — TROIS JUMELLES DE PLUS. Elles existaient déjà sur le site et
     n'étaient déclarées NULLE PART : trouvées en listant le sitemap pour réparer
     les slugs morts. Sans cette table, arriver sur elles ne forçait pas l'anglais
     et le menu anglais gardait ses liens français.
     Appariement sans ambiguïté : chaque page anglaise porte le titre français
     suivi de « EN » (« Fiches secteur EN », « Formation par thématiques EN »), et
     les quatre répondent 200.
     ⚠️ CONTENU ENCORE FRANÇAIS SUR CES PAGES, ET C'EST ASSUMÉ. Ziad, 04/08 :
     « il y a du contenu français pour l'instant sur les pages EN mais il faut
     câbler, on changera le contenu plus tard ». Le câblage et la traduction sont
     donc deux chantiers séparés : celui-ci envoie l'anglophone sur la bonne page,
     ce qu'il y lit reste à corriger côté contenu.
     🟢 L'anti-flash suit tout seul : `CLOAK_SLUGS` se dérive de cette table (plus
     bas), il n'y a rien à ajouter à la main pour les trois nouvelles. */
  var PAGES_EN={
    "formation-par-modules":"formation-par-modules-en",
    "fiches-cabinet":"fiches-cabinet-en",
    "fiches-secteur":"fiches-secteur-en",
    "formation-par-thematiques":"formation-par-thematiques-en"
  };
  var PAGES_FR={};
  Object.keys(PAGES_EN).forEach(function(fr){ PAGES_FR[PAGES_EN[fr]]=fr; });
  window.PS_PAGE_ACCENTS=PAGE_ACCENTS;   /* lu par profile-page.js : une seule source de couleurs */
  window.PS_PAGES_EN=PAGES_EN;                  // lu par profile-page.js (boutons « Continuer »)
  window.PS_PAGES_FR=PAGES_FR;

  /* 🔴 Le slug vient de `body.slug-<slug>` (posé par LearnWorlds), avec repli
     sur l'URL : ce fichier peut tourner AVANT que `<body>` n'existe. */
  function slugCourant(){
    var b=document.body;
    var m=b && (b.className||"").match(/(?:^|\s)slug-([a-z0-9-]+)/i);
    if(m) return m[1];
    return (location.pathname||"").split("/").filter(Boolean).pop()||"";
  }
  function estPageEN(){ return !!PAGES_FR[slugCourant()]; }
  function jumelle(lang){
    var s=slugCourant();
    return (lang==="en") ? (PAGES_EN[s]||null) : (PAGES_FR[s]||null);
  }
  window.PS_EST_PAGE_EN=estPageEN;

  /* Langue mémorisée par Weglot. 🔴 `localStorage.wglang` est lisible TOUT DE
     SUITE, alors que `Weglot.getCurrentLang()` n'existe qu'une fois la
     bibliothèque injectée par LearnWorlds (plusieurs secondes plus tard).
     C'est ce qui permet de rediriger AVANT le rendu, sans flash de contenu
     français. Relevé en direct le 03/08 : `wglang`, `wg-translations`. */
  /* 🔴🔴 NOTRE PROPRE CLÉ, ET ELLE PASSE EN PREMIER — bug attrapé EN PRODUCTION
     le 03/08. J'écrivais la langue voulue dans `wglang`, et **Weglot la
     réécrivait** en s'initialisant : le français est sa langue SOURCE, il ne
     persiste pas ce choix et laissait donc « en » traîner. Symptôme mesuré :
     on clique le drapeau FR, on arrive bien sur la page française… et le
     chargement SUIVANT de cette même page renvoyait sur la page EN. La règle
     « l'URL fait foi » était contredite par une valeur qui ne m'appartenait pas.
     `psLang` n'est écrite que par nous (arrivée en `?ps-lang=`, clic sur un
     drapeau, page jumelle) : Weglot ne peut pas la contredire.
     Ordre : notre clé, puis Weglot s'il est prêt, puis `wglang` en dernier repli. */
  var PS_LANG_KEY="psLang";
  function memoriserLangue(l){
    if(l!=="fr" && l!=="en") return;
    try{ localStorage.setItem(PS_LANG_KEY, l); }catch(e){}
  }
  function langueMemorisee(){
    try{ var p=localStorage.getItem(PS_LANG_KEY); if(p) return p; }catch(e){}
    try{ if(window.Weglot && window.Weglot.initialized) return window.Weglot.getCurrentLang(); }catch(e){}
    try{ return localStorage.getItem("wglang")||""; }catch(e){ return ""; }
  }

  /* 🔴🔴 `?ps-lang=` REND LA BOUCLE IMPOSSIBLE. Sans lui : sur la page EN on
     clique le drapeau FR -> on part sur la page FR -> la langue mémorisée est
     encore « en » -> le filet ci-dessous renverrait sur la page EN, et ainsi de
     suite. Le paramètre dit « cette navigation est VOULUE, cette langue fait
     foi » ; il est appliqué puis retiré de l'URL pour ne pas rester dans les
     favoris. */
  var LANG_FORCEE=(function(){
    var m=(location.search||"").match(/[?&]ps-lang=(fr|en)\b/);
    return m ? m[1] : "";
  })();
  if(LANG_FORCEE){
    memoriserLangue(LANG_FORCEE);
    try{
      var propre=location.pathname+location.search.replace(/([?&])ps-lang=(fr|en)\b&?/,"$1").replace(/[?&]$/,"");
      history.replaceState(null,"",propre+location.hash);
    }catch(e){}
  }

  /* FILET DE SÉCURITÉ — un lien externe, un favori ou un vieux lien peut poser
     un anglophone sur la page FRANÇAISE. On l'envoie sur la jumelle.
     🔴 Exécuté au chargement du script, donc avant le rendu des cartes : pas de
     contenu français affiché puis remplacé.
     🔴 Ne se déclenche JAMAIS depuis une page EN (`estPageEN`), ni quand la
     langue vient d'être forcée : les deux verrous de la boucle. */
  (function redirigerVersJumelle(){
    if(LANG_FORCEE) return;
    if(estPageEN()) return;
    if(langueMemorisee()!=="en") return;
    var cible=PAGES_EN[slugCourant()];
    if(!cible) return;                            // pas de version anglaise : on reste, c'est voulu
    location.replace("/"+cible);                  // `replace` : pas d'entrée parasite dans l'historique
  })();

  /* L'URL FAIT FOI : sur une page EN, Weglot doit être en anglais, quoi qu'en
     dise la langue mémorisée. Weglot arrive tard -> on retente. */
  (function forcerLangueDeLaPage(){
    /* Deux cas, une seule mécanique :
       - page jumelle EN -> l'anglais, toujours (l'URL fait foi) ;
       - arrivée en `?ps-lang=` -> la langue demandée, y compris le retour au
         FRANÇAIS depuis une page anglaise.
       🔴 Le second cas n'est pas cosmétique : en cessant d'écrire dans `wglang`
       (correctif ci-dessus), on ne disait PLUS RIEN à Weglot, qui restait donc
       en anglais — la page française s'affichait « Modular Training ». Mesuré.
       On passe par son API `switchTo`, la voie supportée, plutôt que par sa
       clé de stockage dont il est propriétaire. */
    var cible=estPageEN() ? "en" : LANG_FORCEE;
    if(!cible) return;
    memoriserLangue(cible);                       // la mémoire suit l'URL
    var n=0, iv=setInterval(function(){
      var W=window.Weglot;
      if(W && W.initialized && typeof W.switchTo==="function"){
        try{ if(W.getCurrentLang()!==cible) W.switchTo(cible); }catch(e){}
        clearInterval(iv); return;
      }
      if(++n>50) clearInterval(iv);
    }, 400);
  })();

  /* LIENS DU MENU — en anglais, ils pointent vers les jumelles.
     🔴 Sans ça l'étudiant devrait recliquer le drapeau à CHAQUE page (question
     de Ziad, 03/08). Une page sans jumelle garde son lien français : mieux vaut
     du contenu français qu'une 404. */
  function liensMenuJumeles(){
    if(langueMemorisee()!=="en") return;
    document.querySelectorAll("nav.lw-topbar-menu a[href], .lw-topbar-mobile a[href]").forEach(function(a){
      if(a.dataset.psJumelle) return;             // déjà traité
      var h=a.getAttribute("href")||"";
      if(/^(https?:)?\/\//.test(h) && h.indexOf(location.host)<0) return;   // lien externe
      var seg=h.split("?")[0].split("#")[0].split("/").filter(Boolean).pop()||"";
      var cible=PAGES_EN[seg];
      if(!cible) return;
      a.setAttribute("href","/"+cible);
      a.dataset.psJumelle="1";
    });
  }
  window.PS_MENU_JUMELLES=liensMenuJumeles;      // pour observer, pas pour deviner

  /* 🔴 NUMÉRO DE VERSION DU FICHIER SERVI. Sans lui, impossible de savoir si un
     correctif ne marche pas ou si le navigateur exécute encore l'ancienne
     version — j'ai perdu une heure là-dessus le 03/08, en concluant « c'est le
     cache » sur la foi d'un `transferSize:0` qui ne prouvait RIEN (il vaut 0
     pour toute ressource cross-origin sans `Timing-Allow-Origin`).
     À incrémenter à chaque changement de comportement. Même règle que `AUTH_V`
     et `LP_STORE_V`. La fonction du menu est exposée pour pouvoir la déclencher
     à la main et observer ce qu'elle fait, plutôt que d'en déduire. */
  /* 🔴 -d : correctif du classement des deux écrans. J'ai poussé le correctif SANS
     incrémenter ce marqueur, et je me suis retrouvé incapable de dire si la page
     exécutait la version corrigée ou celle du cache — les deux annonçaient `-c`.
     C'est précisément le service que ce marqueur rend, et la règle est écrite deux
     lignes plus haut. Un marqueur qu'on oublie de bouger est pire qu'absent :
     il donne une réponse, et elle est fausse. */
  /* 🔴 -y : branchement de `verification-page.js`. Et la faute décrite juste
     au-dessus a été COMMISE UNE SECONDE FOIS, le même jour : poussé sans
     bouger ce marqueur, donc la vraie page annonçait `-x` et je ne pouvais pas
     distinguer « mon code ne se déclenche pas » de « le cache sert l'ancien
     fichier ». La réponse était le cache. Le marqueur ne sert QUE dans ce
     moment-là : le bouger fait partie du changement, pas de sa relecture. */
  /* 🔴 -z : la popup dit enfin pourquoi le Worker refuse. Marqueur bougé DANS
     le même changement — la leçon a coûté deux fois dans la journée. */
  window.PS_TOKENS_V="2026-08-05-z";

  /* 🔴 `formules` N'EST PAS ICI, ET C'EST VOULU. J'y avais ajouté le slug pour
     régler le flash du bloc de réglages brut signalé par Ziad le 05/08 — sans
     effet : `cloak()` ne masque que `.cards-grandpa .lw-course-card`, pas une
     section de texte. Un réglage qui ne fait rien est pire qu'un réglage
     absent, il fait croire que le problème est traité. Retiré.
     ✅ Le flash est traité plus bas, par `cloakFormules()` : même intention
     (masquer avant la peinture), mais un mécanisme à lui, parce que ce qu'il
     y a à masquer n'est pas une carte. */
  var CLOAK_SLUGS=["formation-par-modules","etudes-cas","fiches-secteur","fiches-cabinet","sentrainer"];
  /* 🔴 L'anti-flash DOIT couvrir les jumelles : une page EN porte un slug
     différent (`…-clone-en`), donc `body.slug-…` ne matchait pas et le flash
     de cartes non stylées revenait. Dérivé de la table, jamais écrit à la main. */
  CLOAK_SLUGS=CLOAK_SLUGS.concat(CLOAK_SLUGS.map(function(s){ return PAGES_EN[s]; }).filter(Boolean));
  var READY_SEL="#pageContent .ps-mcard,#pageContent .ps-cc,#pageContent .ps-ccab,#pageContent .ps-scard,#pageContent .ps-pfc";
  function cloak(){
    if(document.getElementById("ps-cloak")) return;
    /* 🔴 Trop tard ? Si les cartes sont DÉJÀ dans le DOM (LW les a déjà peintes),
       les cacher maintenant créerait un « blink » (visible -> caché -> révélé),
       pire que le flash. Dans ce cas on ne cache pas : jamais pire que l'actuel. */
    if(document.querySelector("#pageContent .cards-grandpa .lw-course-card")) return;
    /* pas sur une page à cartes gérée -> inutile (le sélecteur ne matcherait rien,
       mais on évite d'injecter une feuille pour rien). */
    var base=CLOAK_SLUGS.map(function(s){ return "body.slug-"+s; });
    var trans=base.map(function(b){ return b+" #pageContent .cards-grandpa .lw-course-card"; }).join(",")+"{transition:opacity .35s ease !important;}";
    var hide=base.map(function(b){ return b+":not(.ps-cards-ready) #pageContent .cards-grandpa .lw-course-card"; }).join(",")+"{opacity:0 !important;}";
    var st=document.createElement("style"); st.id="ps-cloak"; st.textContent=trans+hide;
    var head=document.head||document.documentElement; head.insertBefore(st, head.firstChild);
  }
  function reveal(){ if(document.body) document.body.classList.add("ps-cards-ready"); }

  /* ====================================================================
     🔴🔴 PERSONNE NE VA RESTYLER CES CARTES : IL FAUT LES MONTRER TOUT DE SUITE
     --------------------------------------------------------------------
     Défaut relevé le 05/08 en mesurant, et il coûtait deux secondes À CHAQUE
     PROSPECT. `READY_SEL` ne vise que des classes construites par les scripts
     de PAGE (`.ps-mcard`, `.ps-cc`…). Or **aucun script de cartes n'est servi à
     un visiteur déconnecté** — vérifié au curl sur la page Cours : il ne reçoit
     que `mega-menu.js`, `account-page.js` et `tokens.js`. Le sélecteur ne
     pouvait donc JAMAIS correspondre, et le dévoilement n'arrivait que par le
     filet des 3,5 s — alors que les cartes natives sont dans le DOM vers 1,4 s.
     ⇒ **Deux secondes de grille masquée par notre propre anti-flash**, et pour
     rien : il n'y avait aucun restylage à attendre.
     🔴 L'anti-flash n'est pas en cause dans son principe : il protège du
     passage « carte brute → carte à la charte ». Le défaut, c'est d'avoir fait
     dépendre le dévoilement d'un événement qui ne peut pas se produire dans la
     moitié des cas. La bonne question n'est pas « les cartes sont-elles
     stylées ? » mais « quelqu'un va-t-il les styler ? » — et ça se lit dans les
     balises `<script>` de la page.
     🔴 Le test se fait TARD, jamais à l'exécution de ce fichier : dans le
     `<head>`, les loaders de page ne sont pas encore analysés et on conclurait
     « personne » pour tout le monde, ce qui rendrait l'anti-flash inopérant
     pour les membres. L'observateur, lui, se déclenche quand les cartes
     arrivent — donc bien après. */
  var SCRIPTS_CARTES=/(course|case|sector|cabinet|program)-cards\.js/;
  function restylageAttendu(){
    var s=document.querySelectorAll("script[src]");
    for(var i=0;i<s.length;i++){
      if(SCRIPTS_CARTES.test(s[i].getAttribute("src")||"")) return true;
    }
    return false;
  }
  function pretADevoiler(){
    if(document.querySelector(READY_SEL)) return true;      /* cartes restylées : le cas d'origine */
    /* Aucun script de cartes sur la page ⇒ ce que LearnWorlds a peint est le
       rendu FINAL. Le cacher plus longtemps ne protège de rien. */
    return !restylageAttendu() &&
           !!document.querySelector("#pageContent .cards-grandpa .lw-course-card");
  }
  var _revObs=null;
  function watchReveal(){
    if(!document.body || document.body.classList.contains("ps-cards-ready")) return;
    if(pretADevoiler()){ reveal(); return; }
    if(_revObs) return;
    _revObs=new MutationObserver(function(){ if(pretADevoiler()){ reveal(); _revObs.disconnect(); } });
    _revObs.observe(document.documentElement,{childList:true,subtree:true});
  }

  /* ====================================================================
     ANTI-FLASH DE LA PAGE /formules — le bloc de réglages EN CLAIR
     --------------------------------------------------------------------
     Ziad écrit ses prix et ses libellés dans une section de texte normale
     (`titre : …`, `f1-prix : 99 €`, `f1-package : tier_…`). `abonnement.js`
     la lit puis la masque — mais il est INJECTÉ par ce fichier, en `async` :
     le temps que github.io réponde, le navigateur a déjà peint les réglages,
     identifiants de tarif Stripe compris. C'est le flash signalé le 05/08.
     🔴 Ce n'est pas un défaut d'`abonnement.js` : il ne peut pas être plus
     rapide que son propre téléchargement. Le seul code présent AVANT la
     peinture est celui-ci, servi dans le HTML de la page.

     Deux mécanismes, deux rôles — et c'est volontaire :
     1. une FEUILLE DE STYLE posée tout de suite : elle masque les sections
        de contenu tant que la page n'est pas construite. Elle ne dépend
        d'aucun minutage, donc le premier rendu est propre à coup sûr ;
     2. un OBSERVATEUR qui, dès que la section de réglages existe, lui pose
        `display:none` EN INLINE. C'est le masquage durable : il survit à la
        révélation, et il rattrape une section qui arriverait tard (le Site
        Builder peint par étapes, jusqu'à 8 s mesurées sur ce site).
     🔴 La règle de reconnaissance est ici volontairement plus LÂCHE que dans
     `abonnement.js` (préfixes de clés, pas la liste exacte) : les deux ne
     font pas le même travail. Ici on décide quoi CACHER — trop large est
     sans conséquence sur cette page. Là-bas on décide quoi AFFICHER, et une
     clé inconnue doit garder son repli. Copier la liste ici, c'est se
     garantir qu'elle divergera.
     🔴 CE QUI SE PASSE SI `abonnement.js` NE CHARGE JAMAIS — mesuré au
     harnais (`?panne=1`), pas supposé : le masquage inline a déjà eu lieu, donc
     la page garde sa navigation et son pied de page, et ne montre RIEN entre
     les deux. J'avais d'abord écrit ici qu'elle montrerait « le texte brut,
     moche mais jamais vide » : c'était faux, et le harnais l'a dit tout de
     suite. C'est un choix assumé — afficher `f1-package : tier_…` à un
     prospect est pire qu'une page sobre, et ni l'un ni l'autre ne permet
     d'acheter. Pour que la panne reste DIAGNOSTICABLE, on le dit en console.
     🔴 FILET des 6 s : il ne fait pas réapparaître les réglages (ils sont
     masqués en inline), il rend leur visibilité à toute AUTRE section que
     Ziad ajouterait un jour sur cette page. Sans lui, une section éditoriale
     resterait invisible pour toujours si la construction échouait. */
  var _aboObs=null, _aboT0=0;
  function estPageFormules(){
    return /^\/formules(\/|$)/.test(location.pathname||"") ||
           !!(document.body && document.body.classList.contains("slug-formules"));
  }
  /* Pure et testable : c'est elle qui décide ce qu'on masque. Une section de
     réglages, c'est au moins TROIS lignes `clé : valeur` dont la clé porte un
     des préfixes du gabarit. Trois, parce qu'une phrase isolée contenant deux
     points ne doit jamais suffire à faire disparaître un paragraphe. */
  function ressembleAuxReglages(texte){
    var n=0;
    String(texte||"").split(/\r?\n/).forEach(function(l){
      var m=l.match(/^\s*([a-z0-9_-]{2,20})\s*:\s*\S/i);
      if(m && /^(surtitre|titre|description|produit|pied|f\d|inclus)/i.test(m[1])) n++;
    });
    return n>=3;
  }
  /* 🔴 NI `innerText` NI `textContent` — pour la même raison qu'`abonnement.js`
     (documentée là-bas) : `innerText` rend une chaîne VIDE sur un élément
     masqué, or on masque justement, et `textContent` avale les retours à la
     ligne, or on découpe justement en lignes. */
  function texteSection(el){
    var h=(el&&el.innerHTML)||"";
    h=h.replace(/<br\s*\/?>/gi,"\n").replace(/<\/(p|div|li|h[1-6]|section)>/gi,"\n");
    var tmp=document.createElement("div"); tmp.innerHTML=h;
    return tmp.textContent||"";
  }
  function masquerReglages(){
    var hote=document.getElementById("pageContent");
    if(!hote) return false;
    var vu=false;
    [].slice.call(hote.children).forEach(function(sec){
      if(sec.id==="ps-abo" || sec.style.display==="none") return;
      var id=sec.getAttribute&&sec.getAttribute("data-section-id")||"";
      if(/^(topbar|footer)/i.test(id)) return;
      if(!ressembleAuxReglages(texteSection(sec))) return;
      sec.style.display="none";
      vu=true;
    });
    return vu;
  }
  function revelerFormules(){ if(document.body) document.body.classList.add("ps-abo-pret"); }
  function cloakFormules(){
    if(!estPageFormules()) return;
    if(!document.getElementById("ps-abo-cloak")){
      /* 🔴 Trop tard ? Si la page est DÉJÀ construite, masquer maintenant
         ferait clignoter — jamais pire que l'existant, même garde-fou que
         `cloak()` au-dessus. */
      if(document.getElementById("ps-abo")) return;
      var st=document.createElement("style"); st.id="ps-abo-cloak";
      st.textContent="body.slug-formules:not(.ps-abo-pret) #pageContent > section:not([data-section-id^=\"topbar\"]):not([data-section-id^=\"footer\"]){display:none !important;}";
      var head=document.head||document.documentElement; head.insertBefore(st, head.firstChild);
      _aboT0=Date.now();
      setTimeout(function(){
        revelerFormules();
        if(!document.getElementById("ps-abo")){
          try{ console.warn("[PrepaStrat] /formules : abonnement.js n'a rien construit au bout de 6 s. "+
            "Le bloc de réglages reste masqué (il ne doit pas s'afficher tel quel), donc la page est "+
            "vide entre l'en-tête et le pied. Vérifier le chargement de "+
            "https://extremum84.github.io/lw-course-cards/abonnement.js"); }catch(e){}
        }
      }, 6000);
    }
    if(masquerReglages()) revelerFormules();
    else if(document.getElementById("ps-abo")) revelerFormules();
    if(_aboObs || !document.documentElement) return;
    _aboObs=new MutationObserver(function(){
      if(masquerReglages() || document.getElementById("ps-abo")) revelerFormules();
      /* L'observateur reste en place le temps que le Site Builder finisse de
         peindre (dernière relance d'`abonnement.js` : 12 s), puis se retire :
         un observateur oublié sur `subtree` coûte à chaque mutation. */
      if(Date.now()-_aboT0>15000){ _aboObs.disconnect(); _aboObs=null; }
    });
    _aboObs.observe(document.documentElement,{childList:true,subtree:true});
  }

  /* ====================================================================
     CARTES FANTÔMES — OCCUPER L'ATTENTE AU LIEU DE LA SUBIR  (05/08)
     --------------------------------------------------------------------
     Mesuré ce jour sur 6 relevés : **LearnWorlds ne demande son catalogue
     qu'APRÈS l'événement `load`**. Les cartes n'existent donc qu'entre
     ~1,3 s (cache chaud) et ~3,5 s (première navigation). Pendant tout ce
     temps la grille est VIDE : la page a l'air finie et ratée, pas en train
     de charger.
     🔴 Ça ne gagne pas une milliseconde, et c'est assumé. La recherche du
     jour l'a établi : personne ne documente ce délai, les plaintes publiques
     visent l'administration, et les communications performance de
     LearnWorlds portent sur leurs applications mobiles. **Il n'y a pas de
     correctif à attendre.** Ce qu'on peut changer, c'est la lecture de
     l'attente — pas sa durée.

     🔴 ON VISE LE MARQUEUR DE LA PLATEFORME, PAS LA MISE EN PAGE.
     `[data-node-type="course-cards"]` est posé par LearnWorlds sur le
     conteneur, et il est présent dans le HTML SERVI, **vide** (mesuré au
     curl : le conteneur existe, les cartes non). Même règle que pour
     `MyCourses1` le 05/08 : viser l'identifiant de la plateforme, jamais le
     contenu — variable par définition — ni un titre que Weglot traduit.

     🔴 LE NOMBRE ET LA HAUTEUR SONT APPRIS, PAS DEVINÉS. Une grille fantôme
     qui ne fait pas la taille de la vraie provoque un saut au remplacement :
     on aurait troqué un vide contre une secousse. On mémorise donc, par page
     ET par grille, le nombre de cartes et leur hauteur relevés à la visite
     précédente. Première visite : 3 cartes et une hauteur proportionnelle,
     volontairement modestes — sous-promettre plutôt que rétrécir.
     🔴 Je n'ai PAS pu mesurer la hauteur réelle d'une carte depuis
     l'outillage (le panneau du navigateur piloté rapporte un viewport 0×0,
     donc largeur nulle et opacités fausses). D'où l'apprentissage côté
     client : le navigateur de l'utilisateur, lui, sait. À faire valider à
     l'œil par Ziad à la première visite, avant que la mémoire ne se remplisse.

     🔴 LE RETRAIT NE PEUT PAS ÊTRE « QUAND LES CARTES EXISTENT ». Sur les
     pages sous anti-flash, `cloak()` garde les vraies cartes à `opacity:0`
     jusqu'à `ps-cards-ready` : retirer les fantômes dès que le DOM contient
     des cartes rouvrirait le trou qu'on vient de boucher. Sur les autres
     pages, au contraire, les cartes sont visibles tout de suite et garder les
     fantômes afficherait les DEUX. On retire donc quand les cartes existent
     ET qu'elles sont réellement visibles (`ps-cards-ready` ou opacité non
     nulle) — la condition marche dans les deux cas sans connaître la liste
     des pages. */
  var CLE_GRILLES="psGrilles";
  var SEL_GRILLE='#pageContent [data-node-type="course-cards"]';
  var FANT_N=3, FANT_R=1.3;
  var _fantObs=null, _fantPoll=null, _fantSurvBody=false;

  /* 🔴 DÉFAUTS MESURÉS LE 05/08 SUR LES 5 PAGES À CARTES, en anonyme, fenêtre
     1440 px. Ils servent à la TOUTE PREMIÈRE visite, avant que la mémoire de
     l'appareil n'ait quoi que ce soit à dire. Relevé (nombre × largeur × hauteur) :
        formation-par-modules  6×361×538 · 5×361×409 · 1×361×477
        etudes-cas            12×445×479
        fiches-secteur        11×361×483
        fiches-cabinet        10×361×483
        sentrainer             3×361×432
     🔴🔴 ON FIGE DES RATIOS, PAS DES PIXELS. Une hauteur en dur mesurée sur un
     écran de 1440 px serait fausse partout ailleurs — sur mobile la grille
     passe à une colonne, la carte est deux fois plus large, donc plus haute.
     Le ratio hauteur/largeur, lui, traverse les tailles d'écran.
     🔴 Et je ne les ai pas pris de la première mesure venue : la première
     récolte avait été faite avec un panneau de largeur NULLE (cartes écrasées
     en colonnes). Deux valeurs sur cinq étaient fausses — `sentrainer` donnait
     318 au lieu de 432. Toute hauteur relevée sur une page non mise en page est
     à jeter, pas à arrondir. */
  var FANT_DEFAUTS={
    "formation-par-modules":[{n:6,r:1.49},{n:5,r:1.13},{n:1,r:1.32}],
    "etudes-cas":[{n:12,r:1.08}],
    "fiches-secteur":[{n:11,r:1.34}],
    "fiches-cabinet":[{n:10,r:1.34}],
    "sentrainer":[{n:3,r:1.20}]
  };
  /* Les jumelles anglaises portent un slug différent et la même grille : la
     table est DÉRIVÉE, jamais recopiée à la main — c'est ce qui avait fait
     rater l'anti-flash sur les pages EN. */
  try{
    Object.keys(FANT_DEFAUTS).forEach(function(s){
      var en=PAGES_EN && PAGES_EN[s];
      if(en && !FANT_DEFAUTS[en]) FANT_DEFAUTS[en]=FANT_DEFAUTS[s];
    });
  }catch(e){}

  /* Largeur d'une colonne de la grille fantôme, pour convertir un ratio en
     pixels. Les paliers suivent EXACTEMENT ceux de la feuille de style
     ci-dessous : deux jeux de seuils qui divergent donneraient une hauteur
     calculée pour une mise en page qui n'est pas celle affichée. */
  function largeurColonneFantome(g){
    var w=g.getBoundingClientRect().width;
    if(!w) return 0;
    var vw=window.innerWidth||1200;
    var cols=vw>1024?3:(vw>640?2:1);
    return (w-26*(cols-1))/cols;
  }

  function grillesMemo(){
    try{ return JSON.parse(localStorage.getItem(CLE_GRILLES)||"{}")||{}; }catch(e){ return {}; }
  }
  /* Relève ce que la page a FINI par afficher, pour la visite suivante. */
  function memoriserGrilles(){
    var gs=document.querySelectorAll(SEL_GRILLE);
    if(!gs.length) return;
    var liste=[], vu=false;
    [].slice.call(gs).forEach(function(g){
      var c=g.querySelectorAll(".lw-course-card");
      if(!c.length){ liste.push(null); return; }
      var r=c[0].getBoundingClientRect();
      var h=Math.round(r.height), w=Math.round(r.width);
      /* 🔴 ON MÉMORISE LA LARGEUR AVEC LA HAUTEUR, et sans elle on ne garde
         RIEN. Une hauteur seule ne veut rien dire : elle a été relevée à une
         certaine largeur de colonne, et rejouée sur un autre écran elle est
         fausse. C'est le piège qui m'a fait relever 318 px au lieu de 432 sur
         une fenêtre de largeur nulle. Pas de largeur crédible ⇒ on préfère le
         ratio figé, qui vient d'une mesure propre. */
      var utilisable=(h>80 && h<1200 && w>120);
      liste.push({n:c.length, h:utilisable?h:0, w:utilisable?w:0});
      vu=true;
    });
    if(!vu) return;
    var m=grillesMemo(); m[slugCourant()]=liste;
    try{ localStorage.setItem(CLE_GRILLES, JSON.stringify(m)); }catch(e){}
  }

  function cssFantomes(){
    if(document.getElementById("ps-fant-css")) return;
    var st=document.createElement("style"); st.id="ps-fant-css";
    st.textContent=
      ".ps-fantomes{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;width:100%;}"+
      "@media(max-width:1024px){.ps-fantomes{grid-template-columns:repeat(2,1fr);}}"+
      "@media(max-width:640px){.ps-fantomes{grid-template-columns:1fr;}}"+
      ".ps-fant{border-radius:var(--ps-r-card,16px);background:var(--ps-surface,#fff);"+
      "border:1px solid rgba(15,23,42,.07);overflow:hidden;display:flex;flex-direction:column;}"+
      ".ps-fant i{display:block;width:100%;aspect-ratio:16/10;background:rgba(15,23,42,.08);}"+
      ".ps-fant span{display:block;height:12px;border-radius:6px;background:rgba(15,23,42,.08);margin:16px 18px 0;}"+
      ".ps-fant span.ps-court{width:48%;}"+
      ".ps-fant b{display:block;height:34px;border-radius:var(--ps-r-btn,10px);"+
      "background:rgba(15,23,42,.05);margin:auto 18px 18px;}"+
      /* Le battement dit « ça travaille ». Discret : une grille qui clignote
         fort est plus agressive qu'un vide, on aurait échangé un défaut
         contre un autre. */
      ".ps-fant i,.ps-fant span,.ps-fant b{animation:ps-fant-bat 1.5s ease-in-out infinite;}"+
      "@keyframes ps-fant-bat{0%,100%{opacity:1;}50%{opacity:.5;}}"+
      /* 🔴 Respect du réglage système, comme sur la page d'abonnement :
         quelqu'un qui a demandé moins d'animation ne doit pas subir une
         grille qui pulse. */
      "@media(prefers-reduced-motion:reduce){.ps-fant i,.ps-fant span,.ps-fant b{animation:none;}}";
    (document.head||document.documentElement).appendChild(st);
  }

  function poserFantomes(){
    var gs=document.querySelectorAll(SEL_GRILLE);
    if(!gs.length) return false;
    var slug=slugCourant();
    var memo=grillesMemo()[slug]||[];
    var fige=FANT_DEFAUTS[slug]||[];
    cssFantomes();
    [].slice.call(gs).forEach(function(g,i){
      if(g.querySelector(".lw-course-card")) return;   /* LearnWorlds a déjà servi */
      if(g.querySelector(".ps-fantomes")) return;      /* idempotent */
      var vu=memo[i]||null, ref=fige[i]||null;
      var n=Math.max(1, Math.min(12, (vu && vu.n) || (ref && ref.n) || FANT_N));
      /* 🔴 Le ratio VU sur cet appareil bat le ratio figé — il vient de la
         vraie carte, sur le vrai écran. Le figé n'est là que pour la première
         visite, quand la mémoire est encore vide. */
      var ratio=(vu && vu.h && vu.w) ? (vu.h/vu.w) : ((ref && ref.r) || FANT_R);
      var col=largeurColonneFantome(g);
      var h=col ? Math.round(col*ratio) : 0;
      var boite=document.createElement("div");
      boite.className="ps-fantomes";
      /* Décor pur : rien à annoncer à un lecteur d'écran, qui lirait sinon
         une grille de vide avant la vraie. */
      boite.setAttribute("aria-hidden","true");
      var html="";
      for(var k=0;k<n;k++){
        html+='<div class="ps-fant"'+(h?' style="min-height:'+h+'px"':'')+
              '><i></i><span></span><span class="ps-court"></span><b></b></div>';
      }
      boite.innerHTML=html;
      g.appendChild(boite);
    });
    return true;
  }

  /* 🔴 ON RETIRE DÈS QUE LE DÉVOILEMENT COMMENCE, PAS QUAND IL FINIT.
     Les deux grilles sont SŒURS dans le même conteneur : tant que le fantôme
     est là, l'espace est occupé deux fois, donc la page double de hauteur
     puis se rétracte. Un saut de mise en page est plus violent que le fondu
     qu'on chercherait à éviter en attendant. J'ai essayé l'inverse (attendre
     une opacité de 0,9) et le harnais l'a montré à l'écran : deux grilles
     empilées.
     🔴 `ps-cards-ready` D'ABORD, l'opacité ensuite. Juste après le changement
     de classe, la valeur calculée vaut encore 0 — la transition n'a pas
     démarré. Tester l'opacité seule raterait donc l'instant exact du
     dévoilement et laisserait les fantômes jusqu'au prochain réveil. La
     classe, elle, dit « le fondu commence », ce qui est précisément le signal
     qu'on veut. L'opacité couvre l'autre cas : les pages sans anti-flash, où
     les cartes sont visibles d'emblée et où la classe n'arrive que plus tard. */
  function retirerFantomes(force){
    var boites=document.querySelectorAll(".ps-fantomes");
    if(!boites.length) return;
    var pret=!!(document.body && document.body.classList.contains("ps-cards-ready"));
    [].slice.call(boites).forEach(function(b){
      if(force){ if(b.parentNode) b.parentNode.removeChild(b); return; }
      var g=b.parentElement;
      var c=g && g.querySelector(".lw-course-card");
      if(!c) return;
      var visible=pret;
      if(!visible){
        try{ visible=parseFloat(getComputedStyle(c).opacity||"1")>0.02; }catch(e){ visible=true; }
      }
      if(visible && b.parentNode) b.parentNode.removeChild(b);
    });
  }

  function fantomes(){
    if(poserFantomes()){
      if(_fantObs){ _fantObs.disconnect(); _fantObs=null; }
    }else if(!_fantObs && document.readyState==="loading"){
      /* Le conteneur est dans le HTML servi, mais ce fichier tourne dans le
         `<head>` : il n'est pas encore analysé. L'observateur le prend au
         moment exact où l'analyseur l'insère, sans attendre DOMContentLoaded. */
      _fantObs=new MutationObserver(function(){
        if(poserFantomes()){ _fantObs.disconnect(); _fantObs=null; }
      });
      _fantObs.observe(document.documentElement,{childList:true,subtree:true});
      setTimeout(function(){ if(_fantObs){ _fantObs.disconnect(); _fantObs=null; } }, 6000);
    }
    /* 🔴 `document.body` n'existe pas quand ce fichier tourne dans le `<head>` :
       l'observateur de classe ne peut donc pas être posé au premier passage.
       Il l'est au suivant (DOMContentLoaded), d'où deux verrous distincts — un
       seul aurait fait sauter l'installation de l'observateur manquant. */
    if(!_fantSurvBody && document.body){
      _fantSurvBody=true;
      try{ new MutationObserver(function(){ retirerFantomes(false); })
        .observe(document.body,{attributes:true,attributeFilter:["class"]}); }catch(e){}
    }
    if(_fantPoll) return;

    /* 🔴🔴 LE RELAIS NE DOIT PAS DÉPENDRE D'UN MINUTEUR — C'EST LA MÊME FAUTE
       QUE LE GARDE-CLIC, MESURÉE LE MÊME JOUR. Première version : un
       `setInterval` à 250 ms chargé de retirer les fantômes. Relevé au
       harnais, jalons posés par observateur : cartes insérées à 2394 ms,
       dévoilement à 4403 ms, **fantômes retirés à 7267 ms** — 2,9 s pendant
       lesquelles les DEUX grilles étaient à l'écran, page doublée en hauteur.
       Cause : les `setInterval` sont ÉTRANGLÉS en onglet d'arrière-plan
       (jusqu'à un appel par minute). Un onglet au premier plan ne l'aurait pas
       montré — et j'aurais livré un défaut que seuls les utilisateurs
       auraient vu, sur les onglets qu'ils ouvrent en fond.
       ⇒ Deux OBSERVATEURS, qui se déclenchent sur l'événement réel :
       l'un sur l'arrivée des cartes, l'autre sur la classe de dévoilement.
       Ils couvrent les deux ordres possibles. Le minuteur ne reste qu'en
       filet, à une cadence lente où l'étranglement n'a plus d'importance. */
    try{
      new MutationObserver(function(){ retirerFantomes(false); })
        .observe(document.documentElement,{childList:true,subtree:true});
    }catch(e){}

    var t0=Date.now();
    _fantPoll=setInterval(function(){
      retirerFantomes(false);
      if(Date.now()-t0>6000) memoriserGrilles();
      if(Date.now()-t0>12000){
        clearInterval(_fantPoll); _fantPoll=null;
        /* Filet : au bout de 12 s, si LearnWorlds n'a toujours rien servi,
           une grille de fantômes éternels serait un mensonge. On les retire
           et la page assume qu'elle n'a pas de cartes. */
        retirerFantomes(true);
        memoriserGrilles();
      }
    }, 1000);
  }

  /* ====================================================================
     BOUTON RETOUR sur le PLAYER (page /path-player) — REMPLACE le natif
     --------------------------------------------------------------------
     Le player LW a un bouton natif « Retour à la page du cours »
     (a.-default-course-player-back, en haut de la sidebar du burger) qui
     mène à la présentation du cours. Quand une carte de liste (ex. fiches
     cabinet) est cliquée, le script de la page pose
     sessionStorage.psPlayerReturn = {url,label,slug}. Ici, si on est sur le
     player DU cours qu'on vient d'ouvrir (slug === courseid), on REMPLACE ce
     bouton natif : (1) on réécrit son libellé, (2) on intercepte son clic
     (phase CAPTURE, avant le handler natif) pour rediriger vers l'origine
     (ex. /fiches-cabinet) au lieu de la présentation. Batch auto.
     🔴 Le player ne se peint PAS en onglet caché (SPA) ; validé en direct,
     onglet au 1er plan : clic natif -> /fiches-cabinet. Placement/label
     ajustables ici. */
  function playerReturn(){
    var r; try{ r=JSON.parse(sessionStorage.getItem("psPlayerReturn")||"null"); }catch(e){ return null; }
    if(!r || !r.url) return null;
    var c=(new URLSearchParams(location.search)).get("courseid")||"";
    if(r.slug && c && r.slug!==c) return null;   // pas le cours ouvert depuis la liste
    return r;
  }
  function playerBack(){
    if(!/\/path-player/.test(location.pathname) && !(document.body && document.body.classList.contains("slug-path-player"))) return;
    var d=playerReturn();
    if(!d) return;
    /* 1) Réétiquette le libellé du bouton retour natif de la sidebar. */
    document.querySelectorAll("a.-default-course-player-back span").forEach(function(sp){
      if(sp.children.length===0 && (sp.textContent||"").trim()) sp.textContent=(d.label||"Retour").replace(/[<>]/g,"");
    });
    /* 2) Intercepte le clic du bouton natif (capture) et redirige vers
       l'origine. Posé une seule fois ; re-vérifie le flag AU CLIC. */
    if(!window.__psBackHooked){
      window.__psBackHooked=true;
      document.addEventListener("click", function(e){
        var back=e.target && e.target.closest && e.target.closest("a.-default-course-player-back");
        if(!back) return;
        var r=playerReturn();
        if(!r) return;                       // pas notre cas -> on laisse le natif
        e.preventDefault(); e.stopImmediatePropagation();
        window.location.href=r.url;
      }, true);
    }
  }

  /* ====================================================================
     LECTEUR IMMERSIF (page /path-player) — barre du bas auto-masquée
     --------------------------------------------------------------------
     La barre de navigation du bas (.-default-course-player-topbar) se cache
     pendant la lecture et réapparaît quand la souris s'approche du bas, puis se
     re-cache ~0,8 s après que la souris s'éloigne (auto-masquage temporisé, pour
     qu'elle disparaisse même si la souris s'arrête). 🔴 Le SOMMAIRE (.-first-col)
     a été RETIRÉ de l'immersif : le masquer par transform écrasait le burger natif
     (symptôme « pas de sommaire »). Le sommaire reste piloté par le burger.
     Seuils (110px) / délai (800ms) / vitesse (.3s) ajustables ici. */
  function immersivePlayer(){
    var onP = /\/path-player/.test(location.pathname) || (document.body && document.body.classList.contains("slug-path-player"));
    if(!onP || !document.body) return;
    if(!document.getElementById("ps-imm-css")){
      var s=document.createElement("style"); s.id="ps-imm-css";
      /* 🔴🔴 DEUX classes exigées : `ps-imm-bas` atteste que la barre est
         RÉELLEMENT en bas de l'écran. Sur une unité QUIZ, LearnWorlds rend cette
         même barre EN HAUT (l'élément s'appelle d'ailleurs `topbar`) — et un
         `translateY(130%)` sur une barre du haut ne la sort pas de l'écran, il la
         POUSSE DANS LE CONTENU : elle restait visible et décalée (signalé par
         Ziad, capture d'un quiz à l'appui). On ne masque donc que ce qui est
         vraiment en bas. */
      s.textContent="#coursePlayerWrapper .-default-course-player-topbar{transition:transform .3s ease !important;}"+
        "body.ps-imm-nobottom.ps-imm-bas #coursePlayerWrapper .-default-course-player-topbar{transform:translateY(130%) !important;}";
      (document.head||document.documentElement).appendChild(s);
      document.body.classList.add("ps-imm-nobottom");   // démarre caché
    }

    if(window.__psImmOn) return; window.__psImmOn=true;   // 🔴 tout ce qui suit ne s'enregistre QU'UNE FOIS (4 appels : démarrage + 3 relances)
    /* Barre en bas ou en haut ? Le test tient dans les DEUX états : masquée, une
       barre du bas reste sous la moitié de l'écran, et une barre du haut au-dessus.
       Réévalué en continu car le lecteur change d'unité sans recharger la page. */
    function evaluerBarre(){
      var b=document.querySelector("#coursePlayerWrapper .-default-course-player-topbar");
      if(!b){ document.body.classList.remove("ps-imm-bas"); return; }
      var r=b.getBoundingClientRect();
      if(!r.height){ document.body.classList.remove("ps-imm-bas"); return; }
      document.body.classList.toggle("ps-imm-bas", (r.top + r.height/2) > (window.innerHeight/2));
    }
    evaluerBarre();
    setInterval(evaluerBarre, 1000);
    window.addEventListener("resize", evaluerBarre, {passive:true});
    var hideT;
    function scheduleHide(){ clearTimeout(hideT); hideT=setTimeout(function(){ document.body.classList.add("ps-imm-nobottom"); }, 1200); }
    document.addEventListener("mousemove", function(e){
      if((window.innerHeight - e.clientY) < 110){ document.body.classList.remove("ps-imm-nobottom"); clearTimeout(hideT); }  // près du bas -> montre
      else scheduleHide();                                                                                                   // ailleurs -> re-cache après délai
    }, {passive:true});
    document.addEventListener("mouseleave", scheduleHide, {passive:true});
    /* 🔴 Le contenu de lecture est dans une IFRAME same-origin : les mousemove N'Y
       REMONTENT PAS au document parent → sans ça la barre ne se re-cache jamais quand
       on lit (bug « ne disparaît pas quand on quitte la zone »). On écoute AUSSI
       l'iframe : toute activité dedans = lecture → programme le masquage. Ré-attaché
       périodiquement (l'iframe se recharge à chaque leçon). */
    function hookIframe(){
      var f=document.querySelector("#coursePlayerWrapper iframe");
      if(!f) return;
      try{ var d=f.contentDocument; if(d && !d.__psImmHook){ d.__psImmHook=true; d.addEventListener("mousemove", scheduleHide, {passive:true}); } }catch(_){}
    }
    hookIframe(); setInterval(hookIframe, 2000);
  }

  /* ====================================================================
     BOUTON RETOUR DU PLAYER → PAGE PRINCIPALE, GÉNÉRIQUE (site-wide)
     --------------------------------------------------------------------
     Sur une page de LISTE, au clic d'un lien de cours, on mémorise l'origine
     dans sessionStorage.psPlayerReturn. playerBack() (plus haut) réécrit alors le
     bouton retour natif du player (« Retour à la page du cours ») pour revenir
     DIRECT à cette page principale, sans passer par la présentation. Marche sur
     TOUTES les pages sans script par page. Libellé selon le slug de la page. */
  var RETURN_LABELS={"formation-par-modules":"Retour aux cours",sentrainer:"Retour à l'entraînement","etudes-cas":"Retour aux études de cas","fiches-secteur":"Retour aux fiches secteur","fiches-cabinet":"Retour aux fiches cabinet","formation-par-thematiques":"Retour aux compétences"};
  function returnLabel(){ var m=(((document.body&&document.body.className)||"")).match(/slug-([a-z0-9-]+)/); return (m&&RETURN_LABELS[m[1]])||"Retour"; }
  function playerFlag(){
    if(window.__psFlagOn) return; window.__psFlagOn=true;
    document.addEventListener("click", function(e){
      if(/\/path-player/.test(location.pathname)) return;                  // pas depuis le player
      var a=e.target&&e.target.closest&&e.target.closest("a[href]"); if(!a) return;
      var href=a.getAttribute("href")||"";
      var m=href.match(/courseid=([^&]+)/)||href.match(/\/course\/([^\/?#]+)/); if(!m) return;   // pas un lien de cours
      var slug; try{ slug=decodeURIComponent(m[1]); }catch(_){ slug=m[1]; }
      try{ sessionStorage.setItem("psPlayerReturn", JSON.stringify({url:location.pathname,label:returnLabel(),slug:slug})); }catch(_){}
    }, true);   // capture, avant navigation
  }

  /* ====================================================================
     PANNEAU FLOTTANT WEGLOT -> MASQUÉ (site-wide, demandé par Ziad)
     --------------------------------------------------------------------
     Weglot ajoute de lui-même son propre sélecteur de langue : un
     `div.weglot-container` collé au `<body>` qui contient un
     `aside.weglot_switcher` en `position:fixed` en bas à droite
     (« Français ▸ »). Il faisait DOUBLON avec les drapeaux du header
     (ci-dessous, qui sont notre vrai switcher) et se superposait à ce qui
     traîne dans ce coin de l'écran.
     🔴 On masque l'INTERFACE, pas la traduction : `Weglot.switchTo()` ne
     dépend pas de ce panneau — les drapeaux continuent de fonctionner
     (vérifié en direct : cycle FR -> EN -> FR avec le panneau masqué).
     🔴 CSS et pas JS : la règle est posée AVANT que Weglot n'injecte son
     panneau (il se charge après nous), donc il n'apparaît jamais — pas de
     clignotement, et rien à rejouer au changement de page.
     Pour le faire revenir un jour : supprimer ce bloc. Le même réglage
     existe côté Weglot (`hide_switcher`) mais il vit dans les paramètres
     Weglot/LearnWorlds, hors de ce dépôt. */
  (function(){
    if(document.getElementById("ps-wg-hide")) return;
    var st=document.createElement("style"); st.id="ps-wg-hide";
    st.textContent=".weglot-container,aside.weglot_switcher{display:none !important;}";
    (document.head||document.documentElement).appendChild(st);
  })();

  /* ====================================================================
     FORMULAIRES D'INSCRIPTION ET DE CONNEXION (site-wide)
     --------------------------------------------------------------------
     Ce n'est PAS une page : `/signup` renvoie 404. C'est une modale native
     `#animatedModal.loginForm2`, injectée par l'application LearnWorlds quand on
     clique un lien `openformslink`. D'où le choix de la traiter ici : `tokens.js`
     est chargé sur toutes les pages ET servi aux visiteurs DÉCONNECTÉS — c'est-à-
     dire exactement le public qui s'inscrit.

     🔴 EN CSS PUR, ET C'EST LE POINT. La modale n'existe pas au chargement : elle
     apparaît au clic. Une feuille posée d'avance s'applique au moment où le DOM
     arrive, sans observer ni relancer quoi que ce soit. Toute autre approche
     (réécrire le formulaire en JS) se battrait avec Weglot, qui traduit ces
     libellés — la règle du 25/07 : ce qui réécrit du texte à chaque passage fait
     clignoter la page. On ne touche donc AUCUN texte, seulement l'apparence.

     MESURÉ AVANT D'ÉCRIRE (modale ouverte sur le vrai site, en anonyme) :
       `#signUpForm` = 420 px de large dans une modale de 990 -> 570 px perdus,
       et 1363 px de contenu pour 820 px de fenêtre : on scrollait pour créer un
       compte. 11 champs, chacun dans `.login-form-input-wrapper` de 360×76.
       Champs : 49 px, rayon 7, fond #F5F3F5, police **Raleway** (pas la nôtre).
       Bouton : #3887B4 — le bleu des FILTRES, pas l'accent de la marque.

     🔴 LE PASSAGE À DEUX COLONNES EST LE VRAI CORRECTIF. Restyler sans élargir
     aurait laissé le défaut principal — la longueur. La grille ne s'applique qu'à
     `#signUpForm` : le formulaire de CONNEXION n'a que deux champs, deux colonnes
     l'auraient rendu bancal. Les champs qui respirent mal à moitié de largeur
     (langue en radios, case d'acceptation) reprennent toute la ligne.
     🔴 `!important` partout : les classes de LearnWorlds
     (`.learnworlds-input-solid-light`…) portent leurs propres valeurs et gagnent
     autrement. Même raison que dans `mega-menu.js`.
     ⚠️ CE QUI NE SE RÈGLE PAS ICI, ce sont les LIBELLÉS et la LISTE des champs :
     ils viennent de la configuration LearnWorlds (Users -> User Fields). Deux
     d'entre eux s'affichent en clé technique brute — « annuaire » (le
     consentement RGPD de l'annuaire !) et « contact ». Les corriger en JS
     masquerait un défaut de configuration au lieu de le réparer. */
  /* ====================================================================
     LE BANDEAU « INSCRIPTION FERMÉE » DES CARTES DE COURS
     --------------------------------------------------------------------
     Depuis le 04/08, tout le catalogue est en « inscription clôturée » : on ne
     vend plus de cours à l'unité, on vend deux programmes « Accès total ». Le
     statut est le bon — les cartes restent visibles, ce que « Privé » aurait
     empêché — mais LearnWorlds pose alors sur CHAQUE carte un calque qui
     recouvre l'illustration et annonce « Inscription fermée ».
     🔴 Pour un prospect, ça se lit « c'est fermé, revenez plus tard » : l'inverse
     exact du message voulu, sur la page qui doit donner envie d'acheter. Le cours
     n'est pas fermé, il est inclus dans une offre.
     MESURÉ avant d'écrire : `div.lw-card-overlay`, `position:absolute`, 303×171,
     posé sur `div.learnworlds-image`, et ne contenant QUE ce libellé (11 cartes
     sur 12). Le masquer retire donc aussi le voile sombre et rend l'illustration.
     ⚠️ Ce calque sert aussi au statut « Bientôt ». Aucun cours ne le porte
     aujourd'hui (l'inventaire du 04/08 ne montre que free / paid / draft /
     enrollment_closed) ; le jour où l'un l'utilisera, il faudra distinguer les
     deux plutôt que de tout masquer. ⏳ Un libellé POSITIF renvoyant vers la page
     carrefour prendra sa place — il attend que cette page existe. */
  /* ====================================================================
     TUNNEL DE PAIEMENT — on y repose l'adresse déjà saisie
     --------------------------------------------------------------------
     La page d'entrée (`/inscription`) demande une adresse pour aiguiller ; sans
     ceci, l'acheteur la retape au moment de sortir sa carte. C'est un abandon
     gratuit, à l'endroit le plus cher du parcours.
     🔴 POURQUOI ICI ET NON DANS `inscription.js` : mesuré le 04/08, ce dernier
     n'est PAS chargé sur `/payment` — l'emplacement de code personnalisé qui le
     porte ne couvre pas cette page. Le code y était juste, et ne s'exécutait
     jamais : champ vide, aucune erreur en console. `tokens.js`, lui, est partout.
     🔴🔴 ON NE TOUCHE À RIEN D'AUTRE SUR CETTE PAGE. C'est le seul endroit du site
     où un bug coûte une vente. On ne remplit que le champ e-mail, et SEULEMENT
     s'il est vide : la valeur saisie par la personne gagne toujours sur la nôtre.
     Une seule fois, puis la clé est effacée — sinon on réécrirait une adresse
     qu'elle viendrait de corriger. */
  (function(){
    if(!/^\/payment/.test(location.pathname||"")) return;
    var CLE="psMailInscription", v="";
    try{ v=sessionStorage.getItem(CLE)||""; }catch(e){ return; }
    if(!v) return;
    var essais=0;
    (function poser(){
      var c=document.querySelector('input[name="email"]');
      if(c){
        if(!String(c.value||"").trim()){
          c.value=v; c.dispatchEvent(new Event("input",{bubbles:true}));
        }
        try{ sessionStorage.removeItem(CLE); }catch(e){}
        return;
      }
      /* Le tunnel est peint par le SPA, et Stripe met du temps : on laisse
         largement de quoi arriver plutôt que d'abandonner trop tôt. */
      if(++essais<40) setTimeout(poser,250);
    })();
  })();

  (function(){
    if(document.getElementById("ps-cardovl")) return;
    var st=document.createElement("style"); st.id="ps-cardovl";
    st.textContent=".lw-course-card .lw-card-overlay{display:none !important;}";
    (document.head||document.documentElement).appendChild(st);
  })();

  (function(){
    if(document.getElementById("ps-form-ps")) return;
    var F=[
      /* ---------- la boîte ---------- */
      "#animatedModal .modal-content{font-family:var(--ps-font,Figtree,sans-serif) !important;}",
      /* 🔴 LA BOÎTE BLANCHE, C'EST `#signUpForm` (et `.login-form` pour la
         connexion) — PAS `#animatedModal`, qui est le VOILE plein écran, ni
         `.modal-content`, qui est transparent. Arrondir le voile n'aurait rien
         donné : il couvre toute la fenêtre. Mesuré avant d'écrire.
         Rayon pris sur `--ps-r-card` : le popup suit les cartes du site et se
         règle depuis le configurateur, comme le reste.
         🔴 L'ombre n'est pas décorative : le voile est un blanc à 85 %, donc une
         carte blanche aux coins arrondis posée dessus ne se détacherait presque
         pas — l'arrondi serait invisible, et le réglage aurait l'air sans effet. */
      "#animatedModal #signUpForm,#animatedModal .login-form{"+
        "border-radius:var(--ps-r-card,16px) !important;"+
        "box-shadow:0 18px 50px rgba(0,0,0,.10) !important;}",
      "#animatedModal #signUpForm{width:min(820px,92vw) !important;max-width:none !important;}",
      /* 🔴🔴 LA CROIX DE FERMETURE FAIT 6 × 6 PIXELS (05/08, signalé par Ziad :
         « le bouton fermer ne fonctionne pas »). Elle n'est pas cassée — elle
         est INVISABLE. Le glyphe a pourtant 16 px de police et Font Awesome est
         bien chargée ; c'est la boîte du bouton qui reste à 6 px.
         🔴 CE N'EST PAS NOUS : mesuré à 6 × 6 avec notre feuille de style
         ACTIVÉE puis DÉSACTIVÉE. Rendu natif de LearnWorlds.
         🔴 PIÈGE DE MESURE À NE PAS REFAIRE : le DOM contient DIX boutons de
         fermeture (cinq modales × deux éléments), dont huit invisibles.
         `querySelector` renvoie le premier, donc un exemplaire caché — d'où des
         relevés qui se contredisaient (0×0, 6×6, 0×0) et un premier A/B
         entièrement faux. Toujours filtrer sur `offsetParent !== null`.
         ⇒ On porte la cible à 38 px, taille minimale confortable au doigt, et on
         centre le glyphe. Purement additif : au pire ça ne change rien. */
      "#animatedModal .close-animatedModal{width:38px !important;height:38px !important;"+
        "min-width:38px !important;display:inline-flex !important;align-items:center !important;"+
        "justify-content:center !important;border-radius:50% !important;cursor:pointer !important;"+
        "padding:0 !important;}",
      "#animatedModal .close-animatedModal:hover{background:rgba(15,23,42,.07) !important;}",
      "#animatedModal .login-form-close{font-size:19px !important;line-height:1 !important;"+
        "width:auto !important;height:auto !important;}",
      "#animatedModal .landing-form-title{font:800 27px/1.25 var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text,#1c1f26) !important;letter-spacing:-.02em !important;}",
      /* ---------- deux colonnes, inscription seulement ---------- */
      "#animatedModal #signUpForm .-form-inputs{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:2px 22px !important;}",
      /* un champ à radios ou une case d'acceptation tient mal sur une demi-ligne.
         🔴 DEUX RÈGLES SÉPARÉES, ET C'EST VOLONTAIRE : un sélecteur invalide
         invalide TOUTE la liste qui le contient. Réunies, un navigateur sans
         `:has()` aurait aussi perdu la première ligne — pourtant parfaitement
         valide — et la case d'acceptation serait retombée sur une demi-colonne.
         🔴🔴 `:not(.user-custom-field)` EST INDISPENSABLE, ET J'AI DÛ LE MESURER
         POUR LE VOIR. `.extra-form-input-wrapper` ne désigne PAS la case
         d'acceptation : les CINQ champs personnalisés la portent aussi. Sans le
         `:not`, École, Niveau, Recherche, annuaire et contact passaient tous en
         pleine largeur — 7 lignes sur 11, et les deux colonnes ne servaient plus
         à rien. Je l'avais écrit sur la foi d'un relevé qui TRONQUAIT les classes
         aux quatre premières : la cinquième était justement celle-là. Un
         sélecteur bâti sur une observation coupée décrit une page qui n'existe pas. */
      "#animatedModal #signUpForm .-form-inputs > .extra-form-input-wrapper:not(.user-custom-field){grid-column:1 / -1 !important;}",
      "#animatedModal #signUpForm .-form-inputs > .user-custom-field:has(input[type=radio]),"+
      "#animatedModal #signUpForm .-form-inputs > .user-custom-field:has(input[type=checkbox])"+
      "{grid-column:1 / -1 !important;}",
      "@media(max-width:760px){#animatedModal #signUpForm .-form-inputs{grid-template-columns:1fr !important;}}",
      /* ---------- les champs ---------- */
      /* 🔴🔴 ON VISE LES CONTRÔLES, PAS LA CLASSE. Première version :
         `.learnworlds-input` tout court — or LearnWorlds pose CETTE MÊME CLASSE sur
         le `ul` de la liste déroulante des menus (École, Niveau, Recherche…), pour
         lui donner l'allure d'un champ. Mon `height:46px !important` écrasait donc
         sa hauteur : la liste, qui a pourtant un `max-height:500px`, s'ouvrait sur
         **UNE SEULE option** avec un ascenseur. Signalé par Ziad, capture à l'appui,
         et invisible tant qu'on n'ouvre pas un menu — je ne les avais jamais ouverts.
         ⇒ On nomme les éléments qui sont vraiment des contrôles : les `input`, les
         `select`, et le déclencheur du menu personnalisé (un `div`, d'où sa mention
         explicite). **Styler par une classe partagée, c'est styler ce qu'on n'a pas
         regardé.** */
      "#animatedModal input.landing-form-input,#animatedModal input.learnworlds-input,"+
      "#animatedModal select.learnworlds-input,#animatedModal .custom-dropdown-trigger{"+
        "font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:14.5px !important;"+
        "background:#fff !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;"+
        "border-radius:var(--ps-r-btn,10px) !important;height:46px !important;color:var(--ps-text,#1c1f26) !important;}",
      /* Le panneau de la liste garde l'allure du reste, mais SANS hauteur imposée :
         c'est `max-h-500` + `overflow-y:auto` de LearnWorlds qui doivent décider. */
      "#animatedModal .custom-dropdown-list{background:#fff !important;"+
        "border:1.5px solid var(--ps-border,#E6E9EF) !important;border-radius:var(--ps-r-btn,10px) !important;"+
        "font-family:var(--ps-font,Figtree,sans-serif) !important;}",
      /* 🔴 Le focus reprend le bleu des FILTRES (#3887B4) et non l'accent : c'est le
         système de couleur des CONTRÔLES, celui du champ de recherche `.-search-box`.
         Les deux accents du design system ne se mélangent pas. */
      "#animatedModal input.landing-form-input:focus,#animatedModal input.learnworlds-input:focus,"+
      "#animatedModal select.learnworlds-input:focus{"+
        "border-color:#3887B4 !important;box-shadow:0 0 0 3px rgba(56,135,180,.15) !important;outline:0 !important;}",
      /* 🔴🔴 HAUTEUR DE LIGNE FIGÉE, SINON LES DEUX COLONNES SE DÉCALENT. Signalé
         par Ziad, capture à l'appui. Mesuré : un libellé SANS étoile fait 15 px
         (line-height `normal` sur 12,5 px), un libellé AVEC étoile fait **21 px** —
         l'astérisque est un `span.lw-field-required-asterisk` en 14px/21px
         `inline-flex`, et il étire la boîte de ligne du libellé. Le champ de
         gauche descendait donc de 6 px par rapport à celui de droite, sur chaque
         ligne où un seul des deux est obligatoire.
         ⇒ On pose une hauteur de ligne EXPLICITE (21 px, la plus grande des deux,
         pour ne rien rogner) et on empêche l'astérisque d'imposer la sienne. La
         hauteur du libellé ne dépend plus de son contenu, donc l'alignement ne
         dépend plus de quels champs sont obligatoires — un réglage que Ziad
         change dans LearnWorlds sans penser à la mise en page. */
      "#animatedModal .login-form-input-wrapper label,#animatedModal .landing-form-label{"+
        "font:600 12.5px/21px var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text-soft,#676879) !important;"+
        "display:block !important;}",
      "#animatedModal .lw-field-required-asterisk{font-size:12.5px !important;line-height:21px !important;}",
      /* ---------- le bouton ----------
         🔴 `.-login-but` EST MESURÉ, PAS DEVINÉ. J'avais écrit `.signin-btn` par
         symétrie avec `.signup-btn` : cette classe n'existe pas. Le bouton de
         CONNEXION serait donc resté dans le bleu natif #3887B4 pendant que celui
         d'inscription passait à l'accent de la marque — deux modales voisines,
         deux bleus différents, introduits par le correctif censé les accorder.
         Trouvé en ouvrant l'autre modale, pas en relisant le code. */
      "#animatedModal .signup-btn,#animatedModal .-login-but,#animatedModal .landing-form-small-button{"+
        "background:var(--ps-accent,#507EC5) !important;border:0 !important;"+
        "border-radius:var(--ps-r-btn,10px) !important;height:52px !important;"+
        "font:700 15px var(--ps-font,Figtree,sans-serif) !important;color:#fff !important;transition:background .18s !important;}",
      "#animatedModal .signup-btn:hover,#animatedModal .-login-but:hover,#animatedModal .landing-form-small-button:hover{"+
        "background:var(--ps-accent-hover,#486798) !important;}",
      "#animatedModal .-form-create-forgot a{font-family:var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-accent,#507EC5) !important;}",
      /* ---------- le logo, en haut des DEUX modales ----------
         🔴 `.js-form-enterkey` est le seul ancrage COMMUN : la modale
         d'inscription est `#signUpForm.landing-form`, celle de connexion
         `.login-form`, et cette dernière n'a même pas de conteneur de titre. Viser
         `.landing-form-title-social` aurait posé le logo sur l'inscription
         seulement — mesuré avant d'écrire, en ouvrant les deux.
         🔴 La règle est sous `html.ps-logo-ok` : sans ça, un logo introuvable
         laisserait un BLOC VIDE de 38 px en haut du formulaire. Une place réservée
         pour rien est pire que pas de logo. */
      "html.ps-logo-ok #animatedModal .js-form-enterkey::before{content:'' !important;display:block !important;"+
        "height:38px !important;margin:0 0 20px !important;background:var(--ps-form-logo) center/contain no-repeat !important;}",
      /* ---------- inscription en DEUX écrans ----------
         🔴 TOUT EST PILOTÉ PAR LA CLASSE `ps-2etapes`, POSÉE PAR NOTRE JS. Sans
         elle, aucune de ces règles ne s'applique : si le script échoue, ne tourne
         pas, ou si LearnWorlds change sa structure, le formulaire reste ENTIER et
         utilisable. Un découpage qui masque des champs par défaut transformerait
         la moindre panne en inscription impossible — c'est le parcours le plus
         critique du site. */
      /* 🔴 Écran d'après-OAuth : ni boutons sociaux, ni séparateur « ou ». La
         classe est posée par `apresOAuth()` sur le seul critère mesurable —
         un formulaire d'inscription sans champ mot de passe. */
      /* 🔴 PAS `.landing-form-title-social` : malgré son nom, cette classe porte
         le TITRE de la modale (« Inscrivez-vous à … »), pas un élément social.
         L'ajouter aurait décapité la fenêtre — un nom de classe n'est pas une
         description de contenu. */
      "#signUpForm.ps-oauth .-form-social-buttons,"+
      "#signUpForm.ps-oauth .-form-social-register-buttons,"+
      "#signUpForm.ps-oauth .-or{display:none !important;}",
      "#signUpForm.ps-2etapes.ps-etape-1 .-form-inputs > .ps-e2{display:none !important;}",
      "#signUpForm.ps-2etapes.ps-etape-2 .-form-inputs > .ps-e1{display:none !important;}",
      /* le vrai bouton d'envoi n'existe QUE sur le second écran */
      "#signUpForm.ps-2etapes.ps-etape-1 .form-input-group > button{display:none !important;}",
      /* 🔴 « Connectez-vous avec votre compte » et « Mot de passe oublié ? » vont
         sur l'écran 1, pas sur le 2 (Ziad, 04/08 — il a raison). Je les avais
         masqués avec le bouton d'envoi, en les traitant comme des accessoires de
         la validation. Ce sont des SORTIES : quelqu'un qui a déjà un compte s'en
         aperçoit devant le champ e-mail, pas après avoir renseigné son école et
         son niveau. Les lui cacher à ce moment-là, c'est le faire remplir un
         formulaire pour rien.
         Masqués sur l'écran 2 en revanche : on y est engagé, une porte de sortie
         n'y est plus une aide mais une distraction. */
      "#signUpForm.ps-2etapes.ps-etape-2 .-form-create-forgot{display:none !important;}",
      ".ps-etapes-nav{display:flex !important;gap:10px !important;align-items:center !important;margin:4px 0 0 !important;}",
      /* 🔴 La jauge vit SOUS le bouton (demande de Ziad, 04/08). Elle y change de
         nature : au-dessus des champs c'était un en-tête de section, en dessous
         c'est une légende du bouton. D'où la marge inversée et le centrage — un
         texte laissé à gauche sous un bouton pleine largeur paraît orphelin.
         🔴🔴 ET ELLE NE PEUT PAS RESTER UN SIMPLE TEXTE GRIS. Ziad : « ça fait
         juste un texte qui ressemble trop aux liens en bas ». Exact : sous le
         bouton, un texte gris centré au-dessus de deux liens bleus se lit comme
         un troisième lien. On en fait donc un VRAI indicateur — deux segments
         qui se remplissent — et le libellé passe en micro-titre capitales, l'idiome
         déjà utilisé pour les titres de cartes du configurateur. Une barre de
         progression ne peut pas être confondue avec un lien, et elle dit en plus
         ce que le texte disait : où l'on en est. */
      ".ps-etapes-jauge{display:flex !important;flex-direction:column !important;align-items:center !important;"+
        "gap:8px !important;margin:18px 0 0 !important;}",
      ".ps-jauge-bars{display:flex !important;gap:5px !important;}",
      ".ps-jauge-bars i{display:block !important;width:26px !important;height:4px !important;"+
        "border-radius:999px !important;background:var(--ps-border,#E6E9EF) !important;transition:background .2s !important;}",
      "#signUpForm.ps-etape-1 .ps-jauge-bars i:first-child,"+
      "#signUpForm.ps-etape-2 .ps-jauge-bars i{background:var(--ps-accent,#507EC5) !important;}",
      ".ps-jauge-t{font:800 10.5px var(--ps-font,Figtree,sans-serif) !important;text-transform:uppercase !important;"+
        "letter-spacing:.07em !important;color:var(--ps-text-soft,#676879) !important;}",
      /* 🔴 Les liens de sortie ont besoin d'air : mesuré, l'écart avec la jauge
         valait ZÉRO — les trois blocs se touchaient, ce qui accentuait justement
         la confusion signalée. Scopé à l'inscription : la modale de connexion
         n'a pas de jauge, sa mise en page n'a pas à bouger. */
      "#animatedModal #signUpForm .-form-create-forgot{margin-top:20px !important;}",
      ".ps-etape-btn{flex:1 !important;height:52px !important;border:0 !important;cursor:pointer !important;"+
        "border-radius:var(--ps-r-btn,10px) !important;font:700 15px var(--ps-font,Figtree,sans-serif) !important;"+
        "background:var(--ps-accent,#507EC5) !important;color:#fff !important;transition:background .18s !important;}",
      ".ps-etape-btn:hover{background:var(--ps-accent-hover,#486798) !important;}",
      ".ps-etape-btn.ps-retour{flex:0 0 auto !important;padding:0 18px !important;background:transparent !important;"+
        "color:var(--ps-text-soft,#676879) !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;}",
      ".ps-etape-btn.ps-retour:hover{background:var(--ps-surface-soft,#F7F8FB) !important;}",
      "#signUpForm.ps-etape-2 .ps-suivant{display:none !important;}",
      "#signUpForm.ps-etape-1 .ps-etapes-nav.ps-nav-2{display:none !important;}"
    ].join("\n");
    var st=document.createElement("style"); st.id="ps-form-ps"; st.textContent=F;
    (document.head||document.documentElement).appendChild(st);

    /* 🔴 LE LOGO EST LU SUR L'EN-TÊTE, PAS ÉCRIT EN DUR. L'URL LearnWorlds porte
       un hash propre au fichier téléversé (`…/0d0f4e02…png`) : la figer ici, c'est
       afficher l'ANCIEN logo le jour où Ziad le remplace, sans que rien ne le
       signale — le même piège que les URLs de photo de `me.image`, relevé le 29/07.
       En le lisant sur la page, le formulaire suit toujours le logo du site.
       🔴 Relances : `tokens.js` s'exécute avant que l'en-tête ne soit peint. Sans
       elles, la variable ne serait posée qu'une fois, trop tôt, et jamais.
       On n'écrit RIEN si on ne trouve pas : pas de logo plutôt qu'un logo faux. */
    var poseLogo=function(){
      if(document.documentElement.classList.contains("ps-logo-ok")) return true;
      var img=document.querySelector(".lw-topbar-logo-wrapper img, .lw-topbar-logo-col img");
      var src=img && img.currentSrc || img && img.src || "";
      if(!/^https:\/\//.test(src)) return false;
      document.documentElement.style.setProperty("--ps-form-logo",'url("'+src.replace(/["\\]/g,"")+'")');
      document.documentElement.classList.add("ps-logo-ok");
      return true;
    };
    if(!poseLogo()) [120,400,900,2000].forEach(function(d){ setTimeout(poseLogo,d); });

    /* ====================================================================
       INSCRIPTION EN DEUX ÉCRANS
       --------------------------------------------------------------------
       Demande de Ziad (04/08) : « un premier screen avec les infos civiles,
       l'école et la recherche, puis le mail et le mot de passe, ou l'inverse ».
       Retenu : IDENTIFIANTS D'ABORD, profil ensuite.

       🔴 LE DÉCOUPAGE EST PUREMENT VISUEL. LearnWorlds envoie le formulaire EN UNE
       SEULE FOIS : rien n'est enregistré entre les deux écrans. L'argument habituel
       des formulaires en étapes — « on garde au moins l'e-mail si la personne
       abandonne » — NE S'APPLIQUE PAS. C'est ce qui décide de l'ordre : on ne
       gagne rien à capturer l'e-mail tôt, alors on met d'abord ce que la personne
       est venue faire (créer un compte), et les questions de profil ensuite.
       Les champs masqués restent dans le formulaire, donc leurs valeurs partent
       normalement à l'envoi — `display:none` n'exclut pas un champ d'un POST.

       🔴🔴 L'ÉTAPE 2 EST DÉDUITE, PAS ÉNUMÉRÉE. L'écran 1 = les champs de COMPTE
       de LearnWorlds (nom, prénom, e-mail, mot de passe) ; tout le reste va en 2.
       Une liste écrite à la main aurait laissé le prochain champ personnalisé sur
       le premier écran sans que personne ne s'en aperçoive — exactement le défaut
       des tables indexées par slug qui nous a coûté quatre pannes cette semaine.

       🔴🔴 ON REVIENT AU FORMULAIRE ENTIER À L'ENVOI. Si LearnWorlds refuse une
       valeur, il affiche son message SUR le champ fautif. Un champ fautif resté
       masqué, c'est un bouton qui « ne fait rien » et une inscription abandonnée.
       Au clic sur le vrai bouton, on retire donc le découpage : au pire la
       personne revoit le formulaire complet, ce qui est le comportement d'avant.
       ==================================================================== */
    /* 🔴🔴 CORRIGÉ LE 04/08 (soir), APRÈS AVOIR VU LE RÉSULTAT EN PRODUCTION.
       Première règle : « écran 1 = les champs de compte connus, écran 2 = tout
       le reste ». Elle paraissait robuste — je l'avais même défendue comme
       « déduite, pas énumérée ». Elle ne l'était pas : elle énumérait l'écran 1.
       Le jour où Ziad a retiré les champs personnalisés du formulaire, « tout le
       reste » n'était plus le profil, c'était **l'avatar, la case des conditions
       générales et l'opt-in marketing**. Résultat mesuré : un formulaire de
       quatre champs toujours coupé en deux, avec les CGU derrière un bouton.
       J'avais annoncé que le découpage se désactiverait seul. C'était faux.

       La vraie règle tient au marqueur que LearnWorlds pose LUI-MÊME sur ses
       champs personnalisés : `user-custom-field`. Écran 2 = ces champs-là, et
       rien d'autre. Plus aucun champ perso ⇒ écran 2 vide ⇒ `if(!n1||!n2)` sort
       et le formulaire redevient simple, cette fois pour de bon.
       🔴 LEÇON : « déduit » ne veut rien dire tant qu'on n'a pas nommé DE QUOI.
       Je déduisais du mauvais côté. */
    var CLASSE_PERSO="user-custom-field";

    /* 🔴🔴 LE CLASSEMENT EST REJOUÉ À CHAQUE PASSAGE, ET C'EST TOUT LE CORRECTIF.
       Première version : on classait une fois, puis `data-ps-etapes` interdisait
       d'y revenir. Or LearnWorlds construit le formulaire PROGRESSIVEMENT — au
       premier passage de l'observer, la grille ne contenait que ses premiers
       champs. Les suivants n'ont donc reçu AUCUNE classe, et un champ sans classe
       n'est masqué par aucune des deux règles : il reste visible sur les deux
       écrans. Résultat en production : l'écran 1 affichait DIX champs au lieu de
       quatre — le découpage ne découpait rien.
       🔴 Invisible en test parce que j'injectais le code sur une modale DÉJÀ
       peinte. Un composant construit progressivement doit être retravaillé à
       chaque passage, jamais « une bonne fois ». C'est la raison des relances
       partout ailleurs dans ce dépôt.
       Le classement est idempotent (on ne touche qu'aux non-classés), donc le
       rejouer ne coûte rien ; seule la CONSTRUCTION de la navigation reste gardée. */
    function classer(grille){
      var n=[0,0];
      [].slice.call(grille.children).forEach(function(w){
        if(!w.classList.contains("ps-e1") && !w.classList.contains("ps-e2")){
          /* Le marqueur vient de LearnWorlds, pas de nous : il suit ses champs
             personnalisés où qu'ils aillent, et il ne se met pas à désigner les
             CGU le jour où la composition du formulaire change. */
          var perso=w.classList.contains(CLASSE_PERSO) || !!w.querySelector("."+CLASSE_PERSO);
          w.classList.add(perso ? "ps-e2" : "ps-e1");
        }
        n[w.classList.contains("ps-e1") ? 0 : 1]++;
      });
      return n;
    }

    function deuxEcrans(f){
      if(!f) return;
      var grille=f.querySelector(".-form-inputs");
      var groupe=f.querySelector(".form-input-group");
      var envoi=groupe && groupe.querySelector("button:not(.ps-etape-btn)");
      if(!grille || !groupe || !envoi) return;        /* structure inattendue : on ne touche à rien */

      var compte=classer(grille), n1=compte[0], n2=compte[1];
      if(f.dataset.psEtapes) return;                  /* navigation déjà construite */
      /* 🔴 Un seul écran utile ⇒ on n'en fabrique pas deux. Le jour où Ziad retire
         les champs personnalisés de l'inscription (ce qui est recommandé), le
         formulaire redevient simple tout seul, sans qu'on ait à défaire ceci. */
      if(!n1 || !n2) return;

      /* 🔴 Les deux segments sont des éléments à part, pas des pseudo-éléments :
         il faut pouvoir les remplir l'un après l'autre, et une règle CSS sur
         `:first-child` le fait sans que le JS ait à toucher au style. */
      var jauge=document.createElement("div");
      jauge.className="ps-etapes-jauge";
      jauge.innerHTML='<span class="ps-jauge-bars"><i></i><i></i></span><span class="ps-jauge-t"></span>';
      var jaugeT=jauge.querySelector(".ps-jauge-t");

      var nav1=document.createElement("div"); nav1.className="ps-etapes-nav";
      var suivant=document.createElement("button");
      /* 🔴 MESURÉ : il n'existe AUCUN élément `<form>` — `#signUpForm` est un `div`
         et LearnWorlds collecte les valeurs en JavaScript. `type="button"` n'est
         donc pas ce qui empêche un envoi prématuré aujourd'hui ; c'est une
         précaution pour le jour où LW enveloppera le tout dans un vrai `<form>`,
         où un `<button>` vaut `submit` par défaut. Elle ne coûte rien.
         🟢 Conséquence VÉRIFIÉE de cette architecture : masquer un champ ne lui
         retire pas sa valeur. Écran 2 affiché, les quatre champs de l'écran 1
         étaient bien `display:none` ET portaient toujours ce qui avait été saisi —
         c'est `.value` que LearnWorlds lit, et `display` ne la touche pas. */
      suivant.type="button"; suivant.className="ps-etape-btn ps-suivant";
      suivant.textContent="Continuer";
      nav1.appendChild(suivant);

      var nav2=document.createElement("div"); nav2.className="ps-etapes-nav ps-nav-2";
      var retour=document.createElement("button");
      retour.type="button"; retour.className="ps-etape-btn ps-retour"; retour.textContent="Retour";
      nav2.appendChild(retour);

      groupe.insertBefore(nav1, envoi);
      groupe.insertBefore(nav2, envoi);
      /* 🔴 APRÈS le bouton d'envoi, pas avant la grille. `envoi.nextSibling` peut
         valoir `null` quand le bouton est le dernier enfant — `insertBefore(x,null)`
         ajoute alors à la fin, ce qui est exactement le placement voulu. */
      groupe.insertBefore(jauge, envoi.nextSibling);

      function aller(n){
        f.classList.toggle("ps-etape-1", n===1);
        f.classList.toggle("ps-etape-2", n===2);
        /* Libellés courts : les deux segments disent déjà « sur 2 », et un
           micro-titre en capitales ne supporte pas une phrase. */
        jaugeT.textContent = n===1 ? "Étape 1 · votre compte" : "Étape 2 · votre profil";
        var p=f.querySelector(n===1 ? ".ps-e1 input" : ".ps-e2 input,.ps-e2 select");
        if(p && p.focus) try{ p.focus({preventScroll:true}); }catch(e){ }
        f.scrollTop=0;
      }
      suivant.addEventListener("click",function(){ aller(2); });
      retour.addEventListener("click",function(){ aller(1); });
      /* Filet : à l'envoi on redonne le formulaire entier (cf. le bloc ci-dessus). */
      envoi.addEventListener("click",function(){ f.classList.remove("ps-2etapes","ps-etape-1","ps-etape-2"); });

      f.classList.add("ps-2etapes");
      f.dataset.psEtapes="1";
      aller(1);
    }

    /* ==================================================================
       L'ÉCRAN D'APRÈS-OAUTH NE REPROPOSE PLUS LES CONNEXIONS SOCIALES
       ------------------------------------------------------------------
       Après Google ou LinkedIn, LearnWorlds affiche un écran de finalisation
       (prénom, nom, e-mail du fournisseur, CGU — pas de mot de passe) et y
       réaffiche un bloc social réduit au fournisseur utilisé : une pastille
       isolée, hors mise en page. On propose de se connecter avec LinkedIn à
       quelqu'un qui vient de se connecter avec LinkedIn.

       🔴🔴 LE CRITÈRE EST L'ÉCRAN, PAS LA PAGE — ET C'EST TOUTE L'HISTOIRE DE
       CE CORRECTIF. Première version, dans `inscription.js` et conditionnée à
       `body.slug-inscription` : elle ne s'est jamais exécutée. Mesuré en direct
       avec Ziad, le rappel OAuth atterrit sur **`/?code=…&signup=linkedin`**,
       c'est-à-dire sur la PAGE D'ACCUEIL. J'avais rattaché une règle à l'endroit
       d'où l'on PART, alors qu'elle devait valoir là où l'on ARRIVE.
       ⇒ La règle vit ici, dans `tokens.js` chargé partout, et se reconnaît à ce
       que l'écran EST : un formulaire d'inscription SANS champ mot de passe.
       🔴 On repose la classe à chaque passage plutôt qu'une fois : la même
       modale sert aux deux écrans, elle doit pouvoir redevenir normale. */
    function apresOAuth(f){
      if(!f) return;
      var aMdp=!!f.querySelector('input[type="password"],input[name="password"]');
      f.classList.toggle("ps-oauth", !aMdp);
    }

    /* La modale est créée à l'ouverture et détruite à la fermeture : on ne peut
       pas agir une fois pour toutes. L'observer la rattrape à chaque apparition ;
       le garde `data-ps-etapes` empêche de la retravailler en boucle. */
    function scruter(){
      var f=document.getElementById("signUpForm");
      apresOAuth(f);
      deuxEcrans(f);
    }
    if(document.body) new MutationObserver(scruter).observe(document.body,{childList:true,subtree:true});
    else document.addEventListener("DOMContentLoaded",function(){
      new MutationObserver(scruter).observe(document.body,{childList:true,subtree:true}); });
    scruter();
  })();

  /* ====================================================================
     DRAPEAUX FR / EN DU HEADER -> VRAI SWITCHER WEGLOT (site-wide)
     --------------------------------------------------------------------
     Les 2 drapeaux du header sont des IMAGES posées à la main dans le Site
     Builder, enveloppées dans un lien `a.js-linked-node`. 🔴 Ces liens
     pointaient vers `/courses-clone` et `/courses-clone-clone` — des pages
     sans aucun rapport (placeholders jamais nettoyés) : cliquer un drapeau
     envoyait donc sur une page au hasard au lieu de changer de langue.
     Ici on INTERCEPTE le clic (phase capture, avant la navigation) et on
     appelle l'API Weglot : `Weglot.switchTo('fr'|'en')`. Weglot traduit SUR
     PLACE, sans rechargement (vérifié en direct : la page entière, y compris
     nos contenus injectés, bascule en anglais).
     🔴 Weglot vient de l'intégration NATIVE de LearnWorlds et se charge de
     façon asynchrone -> on réessaie jusqu'à ce qu'il soit prêt.
     L'ordre des drapeaux dans le header donne les langues (1er = FR, 2e = EN) :
     changer FLAG_LANGS suffit si Ziad en ajoute ou les inverse. */
  var FLAG_LANGS=["fr","en"];

  function flagLinks(){
    /* Les drapeaux = liens du header contenant une petite image. On ne se fie
       PAS au href (il est faux) ni à une classe (aucune ne les distingue). */
    return [].slice.call(document.querySelectorAll("a.js-linked-node")).filter(function(a){
      if(!a.querySelector("img")) return false;
      var r=a.getBoundingClientRect();
      return r.top<130 && r.width>0 && r.width<80 && r.height<60;
    });
  }
  function flagActive(){
    var cur=""; try{ cur=window.Weglot.getCurrentLang(); }catch(e){ return; }
    document.querySelectorAll(".ps-flag[data-ps-lang]").forEach(function(a){
      var on=(a.getAttribute("data-ps-lang")===cur);
      a.classList.toggle("ps-flag-on", on);
      a.setAttribute("aria-current", on?"true":"false");
    });
  }
  function weglotFlags(){
    if(!window.Weglot || !window.Weglot.initialized || typeof window.Weglot.switchTo!=="function") return false;
    /* déjà convertis (les <a> n'existent plus) : on se contente de rafraîchir l'état actif */
    if(document.querySelectorAll(".ps-flag[data-ps-lang]").length>=2){ flagActive(); return true; }
    var links=flagLinks();
    if(links.length<2) return false;

    if(!document.getElementById("ps-flag-css")){
      var st=document.createElement("style"); st.id="ps-flag-css";
      /* Repère de langue active. 🔴 PAS de `grayscale` sur la langue inactive :
         Ziad n'aime pas le drapeau qui devient gris. Les deux drapeaux gardent
         donc LEURS COULEURS ; l'actif se distingue par un petit trait dessous
         (couleur d'accent) + une opacité pleine, l'inactif est juste un peu
         estompé et se réveille au survol. */
      st.textContent=
        ".ps-flag{cursor:pointer !important;position:relative !important;padding-bottom:5px !important;}"+
        ".ps-flag img{opacity:.72 !important;transition:opacity .18s ease, transform .18s ease !important;}"+
        ".ps-flag:hover img{opacity:1 !important;transform:translateY(-1px) !important;}"+
        ".ps-flag.ps-flag-on img{opacity:1 !important;}"+
        ".ps-flag::after{content:'' !important;position:absolute !important;left:50% !important;bottom:0 !important;"+
          "width:0 !important;height:2px !important;border-radius:2px !important;background:var(--ps-accent,#507EC5) !important;"+
          "transform:translateX(-50%) !important;transition:width .18s ease !important;}"+
        ".ps-flag.ps-flag-on::after{width:calc(100% - 8px) !important;}"+
        /* 🔴 Pas de RECTANGLE de focus après un clic souris (le drapeau est un
           `role=button tabindex=0` : le navigateur dessinait un cadre bleu autour,
           visible sur la capture de Ziad). On le garde pour le CLAVIER seulement. */
        ".ps-flag:focus{outline:none !important;}"+
        ".ps-flag:focus-visible{outline:2px solid var(--ps-accent,#507EC5) !important;outline-offset:3px !important;border-radius:4px !important;}";
      (document.head||document.documentElement).appendChild(st);
    }
    /* 🔴 On REMPLACE le lien LW par un <span> neutre au lieu d'intercepter son
       clic : LearnWorlds pose un écouteur sur `a.js-linked-node` qui STOPPE LA
       PROPAGATION avant d'atteindre le document — notre handler n'était jamais
       appelé (constaté : seul un écouteur posé sur `window` voyait l'événement).
       Sans balise <a>, plus rien n'intercepte. L'image d'origine est conservée
       (on déplace les enfants), donc le visuel ne change pas. */
    links.slice(0,2).forEach(function(a,i){
      var lang=FLAG_LANGS[i]||"";
      if(!lang) return;
      var span=document.createElement("span");
      span.className="ps-flag";
      span.setAttribute("data-ps-lang", lang);
      span.setAttribute("role","button");
      span.setAttribute("tabindex","0");
      span.setAttribute("title", (lang==="en")?"English":"Français");
      span.setAttribute("aria-label", (lang==="en")?"Switch to English":"Passer en français");
      span.style.cssText="display:inline-flex;align-items:center;cursor:pointer;";
      while(a.firstChild) span.appendChild(a.firstChild);
      a.parentNode.replaceChild(span, a);
      /* 🔴🔴 LE DRAPEAU NAVIGUE quand la page a une jumelle (03/08). Weglot
         traduit les TEXTES ; il ne peut pas faire changer de programme à un
         élément LearnWorlds, dont les cartes arrivent déjà écrites dans le HTML
         du serveur. Charger l'autre programme = charger l'autre page.
         `?ps-lang=` dit à la page d'arrivée que cette langue est VOULUE — c'est
         ce qui empêche le filet de sécurité de nous renvoyer d'où l'on vient.
         Sans jumelle, comportement d'avant : Weglot traduit sur place. */
      function go(){
        if(!window.Weglot) return;
        memoriserLangue(lang);                    // le choix du membre, avant toute navigation
        var cible=jumelle(lang);
        if(cible){ location.href="/"+cible+"?ps-lang="+lang; return; }
        try{ if(window.Weglot.getCurrentLang()!==lang) window.Weglot.switchTo(lang); }catch(_){}
        setTimeout(flagActive, 60);
      }
      span.addEventListener("click", function(e){ e.preventDefault(); e.stopPropagation(); go(); });
      span.addEventListener("keydown", function(e){        // accessible au clavier
        if(e.key==="Enter"||e.key===" "){ e.preventDefault(); go(); }
      });
    });
    flagActive();
    try{ window.Weglot.on("languageChanged", flagActive); }catch(_){}
    return true;
  }
  /* Weglot est injecté par LearnWorlds APRÈS nous : on retente jusqu'à ~20 s. */
  (function(){
    if(weglotFlags()) return;
    var n=0, iv=setInterval(function(){
      if(weglotFlags() || ++n>50) clearInterval(iv);
    }, 400);
  })();

  /* 🔴 OBSERVATEUR, PAS DES RELANCES À HEURE FIXE — corrigé après un test en
     production. Avec des relances (300/900/2000/4000 ms), le lien du menu
     restait parfois en français : mesuré sur la page EN, `data-ps-jumelle` sur
     ZÉRO lien alors que la logique était juste (langue « en », 1 candidat, lien
     interne). Le menu est simplement (re)peint APRÈS la dernière relance —
     LearnWorlds hydrate sa barre, puis `mega-menu.js` la retouche. Une course
     que des délais fixes ne peuvent pas gagner de façon fiable.
     🔴 Observateur PERMANENT : le menu peut être repeint à tout moment (ouverture
     d'un sous-menu, retour arrière). `data-ps-jumelle` rend le repassage
     gratuit, et on n'observe que `childList` — nos écritures sont des
     ATTRIBUTS, donc aucune boucle possible. */
  (function(){
    liensMenuJumeles();
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", liensMenuJumeles);
    /* 🔴🔴 `setTimeout` ET NON `requestAnimationFrame` — mesuré le 03/08.
       rAF ne se déclenche JAMAIS tant que l'onglet est en arrière-plan
       (`document.visibilityState==="hidden"`) : le navigateur ne peint pas, donc
       il n'appelle pas. Vérifié en direct — un rAF posé dans un onglet caché
       n'avait toujours pas tourné plusieurs secondes après. L'observateur voyait
       bien les mutations, mais notre fonction n'était jamais rappelée.
       Réécrire un `href` n'est PAS une tâche de rendu : elle ne doit pas dépendre
       du fait que la page soit peinte. Cas réels concernés : un lien ouvert dans
       un nouvel onglet en arrière-plan (Cmd+clic), un onglet restauré au
       démarrage. */
    var enAttente=false;
    function planifier(){
      if(enAttente) return;
      enAttente=true;
      setTimeout(function(){ enAttente=false; liensMenuJumeles(); }, 50);
    }
    try{ new MutationObserver(planifier).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
    var n=0, iv=setInterval(function(){
      try{
        if(window.Weglot && window.Weglot.on){ window.Weglot.on("languageChanged", liensMenuJumeles); clearInterval(iv); return; }
      }catch(e){ clearInterval(iv); return; }
      if(++n>50) clearInterval(iv);
    }, 400);
  })();

  /* ====================================================================
     COURS PAR LANGUE — n'afficher que les cours de la langue courante
     --------------------------------------------------------------------
     Ziad prépare des versions ANGLAISES (SCORM EN) de ses cours. Règle
     retenue (choix de Ziad le 25/07) :
       • en ANGLAIS  -> on n'affiche QUE les cours tagués « EN » ;
       • en FRANÇAIS -> on affiche tout SAUF les cours tagués « EN ».
     🔴 Un cours SANS tag de langue est considéré FRANÇAIS : sans cette
     tolérance, les 51 cours de l'école disparaîtraient tant que Ziad n'a
     pas tout tagué. Le tag « FR » est donc facultatif, le tag « EN » est
     celui qui compte.
     🔴 Le marquage est un TAG LearnWorlds (Cours -> Tags), pas un suffixe
     de nom : le titre reste libre et rien ne casse sur une faute de frappe.
     Source : `/api/courses` (catalogue de l'école, lisible côté page, sans
     Worker ni secret) -> table slug -> tags. Apparié aux cartes par le slug
     de leur lien (`?courseid=` ou `/course/<slug>`) : vérifié 12/12 en direct.
     Le catalogue est mis en cache pour la session (il bouge rarement). */
  var LANG_TAG_EN="EN";
  var _cat=null, _catEnCours=false;

  function catalogue(cb){
    if(_cat){ cb(_cat); return; }
    /* 🔴 Cache À DURÉE LIMITÉE (10 min). Sans expiration, une catégorie ajoutée
       dans LearnWorlds n'était prise en compte qu'après fermeture de l'onglet :
       constaté en prod pendant la création des cours EN, le filtre travaillait
       sur un catalogue périmé. */
    try{
      var brut=sessionStorage.getItem("psCatTags");
      if(brut){
        var j=JSON.parse(brut);
        if(j && j.t && (Date.now()-j.t)<600000 && j.map){ _cat=j.map; cb(_cat); return; }
      }
    }catch(e){}
    if(_catEnCours) return;                       // un seul appel en vol
    _catEnCours=true;
    try{
      fetch("/api/courses",{credentials:"include",headers:{Accept:"application/json"}})
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(j){
          var arr=(j && j.courses) ? Object.keys(j.courses).map(function(k){ return j.courses[k]; }) : [];
          var map={};
          arr.forEach(function(c){
            if(!c || !c.titleId) return;
            map[c.titleId]=(c.tags||[]).map(function(t){ return String(t).trim().toUpperCase(); });
          });
          _cat=map; _catEnCours=false;
          try{ sessionStorage.setItem("psCatTags", JSON.stringify({t:Date.now(), map:map})); }catch(e){}
          cb(map);
        })
        .catch(function(){ _catEnCours=false; });
    }catch(e){ _catEnCours=false; }
  }

  /* Convention maison : un contenu anglais se termine par « - EN » (ou « EN »).
     Sert de SECONDE source au filtre de langue, et de source unique pour les
     cartes de programme (un programme n'a pas de tag). */
  var RE_TITRE_EN=/(?:^|[\s\-–—:(\[])EN[)\]]?\s*$/i;
  function titreDeCarte(card){
    var h=card.querySelector(".learnworlds-heading3")||card.querySelector("[class*='heading']");
    return (h ? h.textContent : "").replace(/\s+/g," ").trim();
  }

  function slugDeCarte(card){
    var a=card.querySelector("a[href]"); if(!a) return "";
    var h=a.getAttribute("href")||"";
    var m=h.match(/courseid=([^&]+)/)||h.match(/\/course\/([^\/?#]+)/);
    if(!m) return "";
    try{ return decodeURIComponent(m[1]); }catch(e){ return m[1]; }
  }

  var _langBound=false;
  function langCourses(evLang){
    /* 🔴🔴 SUR UNE PAGE JUMELLE, ON NE FILTRE PLUS RIEN (03/08).
       C'est LA correction du test de Ziad : sa page EN affichait
       « Level #1 » et « Level #2 » MASQUÉES et 5 cartes françaises visibles —
       l'exact inverse du but. Cause : ce filtre se fie à Weglot, qui était
       encore en français, et il ignorait que la page EST la page anglaise. Sur
       une page jumelle, le contenu affiché est décidé par la SOURCE de
       l'élément, côté Site Builder : le code n'a plus rien à masquer.
       ⚠️ Conséquence assumée : si un bloc de la page EN est resté sourcé sur du
       contenu français, il s'affiche. C'est voulu — le code ne doit pas
       maquiller une source mal réglée, il doit la rendre VISIBLE.
       Ce filtre reste actif sur les pages SANS jumelle, où il est encore le
       seul garde-fou. Il disparaîtra quand toutes les pages auront la leur. */
    if(estPageEN()) return;
    var W=window.Weglot;
    /* 🔴 Abonnement fait ICI et pas au chargement : Weglot est injecté par
       LearnWorlds APRÈS nous, donc un `Weglot.on(...)` en haut de fichier ne
       s'exécuterait jamais (même piège que le titre animé). */
    if(!_langBound && W && W.on){ try{ W.on("languageChanged", langCourses); _langBound=true; }catch(e){} }
    var from=(W && W.options && W.options.language_from) || "fr";
    var lang=(typeof evLang==="string" && evLang) ? evLang
           : (W && W.initialized && W.getCurrentLang ? W.getCurrentLang() : from);
    var cards=document.querySelectorAll(".lw-course-card");
    if(!cards.length) return;

    if(!document.getElementById("ps-lang-css")){
      var st=document.createElement("style"); st.id="ps-lang-css";
      st.textContent=".lw-course-card.ps-lang-off{display:none !important;}"+
        /* même règle pour les cartes de PROGRAMME (page Compétences) */
        "[class*='learning-program-card'].ps-lang-off{display:none !important;}"+
        /* Bloc entier masqué quand AUCUNE de ses cartes n'est de la langue
           courante : c'est le cas d'usage « un élément par programme » (un bloc
           FR + un bloc EN sur la même page) — sans ça on verrait un carrousel
           vide avec son titre. */
        ".ps-lang-bloc-off{display:none !important;}"+
        ".ps-lang-empty{grid-column:1/-1 !important;padding:34px 4px !important;text-align:center !important;"+
        "font-family:var(--ps-font,Figtree,-apple-system,Segoe UI,Roboto,sans-serif) !important;"+
        "font-size:16px !important;color:var(--ps-text-soft,#676879) !important;}";
      (document.head||document.documentElement).appendChild(st);
    }

    /* 🔴🔴 PASSE IMMÉDIATE, SANS RÉSEAU (retour de Ziad, 29/07 : « on voit la
       carte disparaître, c'est pas top »). Le filtre n'agissait qu'APRÈS la
       réponse de `/api/courses` : les cartes anglaises s'affichaient, puis
       disparaissaient — un clignotement bien visible au premier chargement (les
       suivants sont instantanés grâce au cache de session).
       Or le SUFFIXE DU TITRE tranche déjà sans le moindre appel : on classe donc
       tout de suite avec lui, et la passe réseau ne fait plus que confirmer et
       rattraper les cas où le titre ne dirait rien (tag `EN` sans suffixe).
       🔴 Les DEUX passes appellent le même code : aucune règle ne peut diverger
       entre l'affichage immédiat et la correction qui suit. */
    appliquer(null);
    catalogue(appliquer);

    function appliquer(map){
      var enAnglais=(lang!==from);
      var visibles=0, masques=0;
      [].slice.call(cards).forEach(function(card){
        /* 🔴🔴 DEUX SOURCES, PAS UNE (bug signalé le 29/07 : sur un compte élève
           les cours FR et EN s'affichaient MÉLANGÉS, alors que le même filtre
           marchait sur le compte admin).
           Mécanique : `map[slug]` ne trouvait rien pour ce compte -> `tags` vide
           -> `estEN` faux -> le cours anglais passait pour français et restait
           visible. Le catalogue lui-même est PROPRE (vérifié : les 6 cours EN
           portent bien le tag `EN`), c'est l'APPARIEMENT carte -> cours qui rate
           — l'identifiant du lien (`?courseid=`) n'est pas toujours le `titleId`.
           Parade : si le tag ne tranche pas, on retombe sur le SUFFIXE DU TITRE
           (« … - EN »), exactement la convention déjà utilisée plus bas pour les
           cartes de PROGRAMME. Le repli ne peut se déclencher que sur un titre
           qui se TERMINE par EN, donc aucun cours français n'est menacé. */
        var tags=map ? map[slugDeCarte(card)] : null;
        var estEN=(!!tags && tags.indexOf(LANG_TAG_EN)>=0) || RE_TITRE_EN.test(titreDeCarte(card));
        var off=enAnglais ? !estEN : estEN;        // EN -> que les EN ; FR -> tout sauf EN
        card.classList.toggle("ps-lang-off", off);
        if(off) masques++; else visibles++;
      });

      /* 🔴 Cartes de PROGRAMME (page Compétences) : elles ne sont pas des cours,
         elles n'ont donc pas de tag. On se fie au SUFFIXE du nom — convention
         retenue avec Ziad : le programme anglais s'appelle « … - EN ». Sans ça,
         le programme anglais resterait visible en français (et son 0 % ferait
         chuter la tuile de progression de la page). */
      document.querySelectorAll("[class*='learning-program-card']").forEach(function(pc){
        var h=pc.querySelector("h3")||pc.querySelector("[class*='heading']");
        var titre=(h?h.textContent:"").replace(/\s+/g," ").trim();
        if(!titre) return;
        var estEN=RE_TITRE_EN.test(titre);            // « … - EN » OU « … EN » (même règle que les cours)
        pc.classList.toggle("ps-lang-off", enAnglais ? !estEN : estEN);
      });
      /* 🔴 Prévenir les scripts de page : la tuile « Progression sur N cours »
         fait la moyenne des cartes PRÉSENTES. Masquer une carte en CSS ne la
         retire pas du DOM -> sans ce signal, les cours de l'autre langue (à 0 %)
         resteraient dans le dénominateur et feraient chuter le pourcentage.
         Les scripts de cartes écoutent « ps-lang-change » et recalculent. */
      try{ window.dispatchEvent(new Event("ps-lang-change")); }catch(e){}

      /* 🔴 UN BLOC PAR PROGRAMME (organisation retenue avec Ziad le 26/07) :
         la page porte un élément « Cours » par langue — celui du programme FR
         et celui du programme EN. On masque donc le BLOC ENTIER dont aucune
         carte n'est de la langue courante, sinon il resterait un carrousel vide
         avec son titre. Le bloc est le conteneur de cartes (`.cards-grandpa`,
         ou à défaut le parent direct des cartes) ; on remonte aussi à sa
         SECTION si celle-ci ne contient que ce bloc, pour emporter le titre. */
      var blocs=[];
      [].slice.call(cards).forEach(function(card){
        var bloc=card.closest(".cards-grandpa")||card.parentNode;
        if(bloc && blocs.indexOf(bloc)<0) blocs.push(bloc);
      });
      blocs.forEach(function(bloc){
        var dedans=bloc.querySelectorAll(".lw-course-card");
        var cachees=bloc.querySelectorAll(".lw-course-card.ps-lang-off");
        var vide=(dedans.length>0 && dedans.length===cachees.length);
        bloc.classList.toggle("ps-lang-bloc-off", vide);
        var sec=bloc.closest("section.learnworlds-section");
        /* on n'emporte la section que si elle n'existe QUE pour ces cartes */
        if(sec && sec.querySelectorAll(".lw-course-card").length===dedans.length){
          sec.classList.toggle("ps-lang-bloc-off", vide);
        }
      });

      /* Message seulement si PLUS RIEN n'est visible sur toute la page (cas où
         aucune version dans cette langue n'existe encore). */
      var grille=cards[0] && cards[0].parentNode;
      if(grille){
        var note=document.querySelector(".ps-lang-empty");
        if(!visibles && masques){
          if(!note){ note=document.createElement("div"); note.className="ps-lang-empty"; grille.appendChild(note); }
          note.textContent="Aucun cours n'est encore disponible dans cette langue.";
          note.classList.remove("ps-lang-bloc-off");
          var pBloc=note.closest(".ps-lang-bloc-off");
          if(pBloc) pBloc.classList.remove("ps-lang-bloc-off");   // sinon le message serait masqué avec son bloc
        } else if(note){ note.remove(); }
      }
    }
  }
  /* Les cartes sont rendues par le JS catalogue de LW, souvent après nous. */
  [400,1000,2000,3500,6000].forEach(function(d){ setTimeout(function(){ langCourses(); }, d); });

  /* 🔴🔴 OBSERVATEUR — classer DÈS QUE la carte entre dans le DOM.
     Les relances ci-dessus sont à intervalles fixes : une carte rendue à 1,2 s
     n'était filtrée qu'à 2 s, soit ~800 ms pendant lesquels l'étudiant voyait la
     carte anglaise AVANT sa disparition (mesuré en harnais : 2,2 s). Avec
     l'observateur, la classification suit l'apparition de la carte.
     🔴 On n'observe QUE `childList` : nos propres `classList.toggle` sont des
     mutations d'ATTRIBUT, donc ils ne se re-déclenchent pas eux-mêmes (pas de
     boucle). Le petit délai regroupe les cartes rendues en rafale. */
  (function(){
    var enAttente=false;
    var obsLang=new MutationObserver(function(mutations){
      if(enAttente) return;
      var pertinent=false;
      for(var i=0;i<mutations.length && !pertinent;i++){
        var aj=mutations[i].addedNodes;
        for(var j=0;j<aj.length;j++){
          var n=aj[j];
          if(n.nodeType!==1) continue;
          if((n.classList && n.classList.contains("lw-course-card")) ||
             (n.querySelector && n.querySelector(".lw-course-card"))){ pertinent=true; break; }
        }
      }
      if(!pertinent) return;
      /* 🔴 MICROTÂCHE et non setTimeout : les minuteurs sont BRIDÉS à ~1 s dans
         un onglet d'arrière-plan (mesuré : 1,7 s au lieu de 30 ms). Une
         microtâche s'exécute à la fin de la tâche courante, sans bridage — donc
         le masquage suit vraiment l'apparition de la carte. Elle regroupe aussi
         les cartes rendues en rafale : un seul passage pour tout le lot. */
      enAttente=true;
      Promise.resolve().then(function(){ enAttente=false; langCourses(); });
    });
    function brancher(){ if(document.body) obsLang.observe(document.body,{childList:true,subtree:true}); }
    if(document.body) brancher(); else document.addEventListener("DOMContentLoaded", brancher);
  })();

  /* ====================================================================
     CO-BRANDING PARTENAIRE (écoles clientes) — site-wide
     --------------------------------------------------------------------
     Une école qui achète la formation pour ses étudiants veut voir SA marque.
     Ici : un badge « avec ESSEC » à côté du logo PrepaStrat dans l'en-tête ;
     `home-page.js` ajoute en plus une section d'accueil (il lit la même table
     via `window.PS_PARTENAIRE`, posé par `partenaire()` ci-dessous).

     🔴🔴 DÉTECTION SANS RÉSEAU : LearnWorlds fabrique tout seul un tag
     `cf_<champ>_<valeur>` pour chaque champ personnalisé rempli — vérifié en
     direct, le compte de Ziad porte `cf_ecole_ESCP` dans `me.tags`. Reconnaître
     l'école se réduit donc à lire `me.tags` : aucun appel, aucun Worker.
     🔴 Lire les TAGS et pas `me.custom_fields`, qui est VIDE côté page.
     🔴 `me` n'existe que pour un membre CONNECTÉ : un prospect anonyme ne voit
     aucun co-branding. C'est une limite du dispositif, pas un bug.
     ⚠️ `cf_ecole` est déclaré par l'étudiant et facultatif : pour une école
     facturée, le signal fiable est un tag posé par AUTOMATISATION sur le domaine
     e-mail. Les deux sont acceptés ci-dessous (tag d'abord, domaine en repli).

     AJOUTER UNE ÉCOLE = UNE ENTRÉE dans PARTENAIRES. Rien d'autre à toucher.
     🔴 Le logo est pour l'instant un bloc TYPOGRAPHIQUE : le logo d'une école est
     une marque déposée, on ne le récupère pas sur son site — il arrive par le
     contrat, puis se dépose dans /logos (champ `logo` ci-dessous). */
  var PARTENAIRES={
    essec:{
      nom:"ESSEC",
      /* 🔴🔴 TAG D'AUTOMATISATION UNIQUEMENT (bascule demandée le 29/07).
         `cf_ecole_ESSEC` a été RETIRÉ volontairement : ce tag vient du champ
         « école » que l'étudiant remplit LUI-MÊME dans l'annuaire — n'importe qui
         pouvait donc se déclarer ESSEC et récupérer le co-branding d'une école
         payante. Le tag ci-dessous est posé par une AUTOMATISATION LearnWorlds sur
         le domaine de l'e-mail, adresse vérifiée à l'inscription : il ne peut pas
         être obtenu sans posséder une adresse @essec.edu.
         🔴 Le nom doit correspondre EXACTEMENT au tag de l'automatisation. */
      tags:["ecole-essec"],
      /* Repli de secours si l'automatisation n'a pas encore tourné (tags posés
         seulement APRÈS activation chez LearnWorlds : les comptes existants se
         traitent en lot). Le domaine est celui de l'adresse VÉRIFIÉE. */
      domaines:["essec.edu"],
      logo:"",                       // SVG transparent à déposer dans /logos, sinon bloc typo
      pastille:"Accès offert par votre école",
      /* Texte fourni par Ziad le 29/07 — c'est du contenu commercial, il est
         maître du mot à mot. Deux corrections de saisie seulement : « moduldes »
         -> « modules », et « modules de formations » -> « de formation ». */
      titre:"Votre préparation au conseil, sponsorisée par l'Essec Career Center",
      texte:"Bénéficiez de l'intégralité de la plateforme en ligne : des modules de formation, une banque d'études de cas complète, des fiches cabinets et fiches secteurs.",
      puces:[
        {t:"Catalogue complet", s:"Aucun paiement"},
        {t:"Promo ESSEC",       s:"Annuaire entre étudiants"},
        {t:"Webinars",          s:"Tous les mois"}
      ],
      /* Accompagnements en présentiel proposés à l'école, affichés en 4 cartes
         sous la bande partenaire (contenu fourni par Ziad le 29/07).
         🔴 `url` VIDE = le bouton est rendu en pastille NON cliquable plutôt
         qu'en lien mort : un `href="#"` renverrait l'étudiant en haut de page,
         ce qui est pire que pas de lien. Renseigner l'URL suffit à l'activer. */
      offres:[
        {
          titre:"Ace Your Interview",
          lignes:["Entretien individuel en conditions réelles. 1 h avec un consultant ou ex-consultant MBB",
                  "1 fois dans l'année"],
          cta:"Réserver un créneau", url:""
        },
        {
          titre:"Task Force",
          lignes:["17 h de formation sur 3 jours",
                  "30 € de frais d'inscription — gratuit pour les étudiants boursiers"],
          cta:"S'inscrire à une session", url:""
        },
        {
          titre:"Consulting Squad",
          lignes:["Curieux du conseil à l'international ? 4 h de formation sur le recrutement dans une région du monde",
                  "8 personnes par squad"],
          cta:"S'inscrire à une session", url:""
        },
        {
          titre:"Classe Étoile",
          lignes:["Pour les étudiants au 2e tour de top cabinet",
                  "4 personnes par classe",
                  "3 h de formation + 1 h d'entretien individuel"],
          cta:"S'inscrire à une session", url:""
        }
      ]
    }
  };

  function membrePS(){ try{ return (typeof me==="object" && me) ? me : null; }catch(e){ return null; } }

  var _part;                       // undefined = pas encore cherché, null = aucun
  function partenaire(){
    if(_part!==undefined) return _part;
    _part=null;
    var u=membrePS();
    if(u){
      var tags=[].slice.call(u.tags||[]).map(function(t){
        return String(typeof t==="string" ? t : (t && t.name) || "").toLowerCase();
      });
      var dom=(String(u.email||"").split("@")[1]||"").toLowerCase();
      for(var k in PARTENAIRES){
        var p=PARTENAIRES[k], ok=false;
        for(var i=0;i<p.tags.length && !ok;i++){ if(tags.indexOf(p.tags[i].toLowerCase())>=0) ok=true; }
        if(!ok && domaineEstPartenaire(dom,p)) ok=true;
        if(ok){ _part=p; break; }
      }
    }
    window.PS_PARTENAIRE=_part;    // home-page.js lit ça pour sa section d'accueil
    return _part;
  }

  /* 🔴 UNE SEULE IMPLÉMENTATION DE LA RÈGLE DE DOMAINE. Elle était écrite en
     ligne dans `partenaire()` ; `inscription.js` en a besoin aussi, pour aiguiller
     un VISITEUR (qui n'a ni compte ni tags, donc rien d'autre que son adresse).
     La recopier là-bas aurait produit deux règles vouées à diverger — le jour où
     l'une accepte un sous-domaine que l'autre refuse, un étudiant couvert se voit
     réclamer un abonnement sans que rien ne l'explique.
     Le sous-domaine est accepté : `@student.essec.edu` correspond à `essec.edu`. */
  function domaineEstPartenaire(dom, p){
    dom=String(dom||"").toLowerCase();
    for(var j=0;j<p.domaines.length;j++){
      var d=String(p.domaines[j]).toLowerCase();
      if(!d) continue;
      if(dom===d || (dom.length>d.length && dom.slice(-(d.length+1))==="."+d)) return true;
    }
    return false;
  }

  /* Rendue publique pour la page d'entrée. 🔴 ELLE ORIENTE, ELLE N'AUTORISE PAS :
     l'accès reste donné par le tag que LearnWorlds pose sur l'adresse VÉRIFIÉE.
     Quelqu'un qui contournerait cet aiguillage n'obtiendrait donc rien. */
  /* La table entière, pour la bande d'écoles de la page d'entrée. 🔴 Elle reste
     la SEULE source : ajouter une école, c'est une entrée ici, et le co-branding,
     l'aiguillage par domaine et la bande de logos suivent ensemble. */
  window.PS_PARTENAIRES=PARTENAIRES;

  window.PS_PARTENAIRE_EMAIL=function(email){
    var dom=(String(email||"").split("@")[1]||"").toLowerCase().trim();
    if(!dom) return null;
    for(var k in PARTENAIRES){ if(domaineEstPartenaire(dom,PARTENAIRES[k])) return PARTENAIRES[k]; }
    return null;
  };

  function partnerHeader(){
    var p=partenaire();
    if(!p) return;
    if(document.querySelector(".ps-cob")) return;          // déjà posé
    var logo=document.querySelector("img.lw-logo");
    if(!logo) return;                                       // en-tête pas encore rendu -> relance
    /* On se pose APRÈS le lien qui enveloppe le logo, dans la même rangée flex. */
    var ancre=(logo.closest && logo.closest("a")) || logo;
    if(!ancre.parentNode) return;

    if(!document.getElementById("ps-cob-css")){
      var st=document.createElement("style"); st.id="ps-cob-css";
      st.textContent=
        /* 🔴🔴 Le logo vit dans un `div.lw-topbar-logo-wrapper` en `display:flex`
           avec **flex-wrap:wrap** (structure relevée sur le site). Sans annuler ce
           wrap, le badge passe à la ligne dès qu'il manque quelques pixels et
           l'en-tête grandit d'un cran — exactement ce que Ziad a constaté.
           On force donc `nowrap` sur CE conteneur (classe posée par le script,
           jamais sur tous les wrappers du site) et on empêche le badge de se
           comprimer ou de se couper en deux. */
        ".ps-cob-host{flex-wrap:nowrap !important;align-items:center !important;"+
          "width:auto !important;max-width:none !important;flex:0 0 auto !important;}"+
        ".ps-cob{display:inline-flex !important;align-items:center !important;gap:9px !important;margin-left:14px !important;"+
          "vertical-align:middle !important;flex:none !important;white-space:nowrap !important;}"+
        ".ps-cob-sep{display:block !important;width:1px !important;height:26px !important;background:#E3E8F0 !important;}"+
        ".ps-cob-av{font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:10.5px !important;font-weight:700 !important;"+
          "letter-spacing:.07em !important;text-transform:uppercase !important;color:#8A93A5 !important;}"+
        ".ps-cob-nom{font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:14px !important;font-weight:700 !important;"+
          "letter-spacing:.14em !important;color:var(--ps-cob-c,#243B6B) !important;border:1.5px solid var(--ps-cob-c,#243B6B) !important;"+
          "border-radius:4px !important;padding:3px 9px !important;line-height:1.2 !important;}"+
        ".ps-cob-img{height:26px !important;width:auto !important;display:block !important;}"+
        /* en petit écran l'en-tête est déjà serré : on ne garde que la marque */
        "@media (max-width:900px){.ps-cob-av{display:none !important;}.ps-cob{margin-left:9px !important;gap:7px !important;}}";
      (document.head||document.documentElement).appendChild(st);
    }

    var box=document.createElement("span");
    box.className="ps-cob";
    box.style.setProperty("--ps-cob-c", "#243B6B");
    var sep=document.createElement("span"); sep.className="ps-cob-sep"; box.appendChild(sep);
    var av=document.createElement("span"); av.className="ps-cob-av"; av.textContent="avec"; box.appendChild(av);
    if(p.logo){
      var im=document.createElement("img");
      im.className="ps-cob-img"; im.src=p.logo; im.alt=p.nom;
      box.appendChild(im);
    } else {
      var nm=document.createElement("span"); nm.className="ps-cob-nom"; nm.textContent=p.nom;
      box.appendChild(nm);
    }
    /* 🔴🔴 On se pose dans la COLONNE du logo, pas à côté du logo lui-même.
       Mesuré sur le site : `div.lw-topbar-logo-wrapper` fait EXACTEMENT la largeur
       du logo (138 px, zéro place restante) — y glisser le badge le renvoyait donc
       à la ligne, et `flex-wrap:nowrap` seul n'y changeait rien puisqu'il n'y a
       pas de place. En le posant dans la colonne parente et en libérant la largeur
       des deux conteneurs, la colonne s'élargit (188 -> 326 px) et la hauteur de
       l'en-tête ne bouge pas (55 px avant comme après, vérifié en direct). */
    var conteneur=ancre.parentNode;
    var colonne=conteneur && conteneur.parentNode;
    var cible=(colonne && colonne.classList && /logo-col/.test(colonne.className)) ? colonne : conteneur;
    cible.appendChild(box);
    if(conteneur.classList) conteneur.classList.add("ps-cob-host");
    if(cible!==conteneur && cible.classList) cible.classList.add("ps-cob-host");
  }

  /* ====================================================================
     DÉPÔT DE LA PROGRESSION (site-wide) — mesuré le 30/07
     --------------------------------------------------------------------
     🔴 POURQUOI : calculer la progression par l'API d'administration coûte
     ~1 appel PAR COURS et par membre (~60 pour un inscrit au catalogue complet),
     face à une limite LearnWorlds de 30 requêtes / 10 s qu'aucun plan Cloudflare
     ne relève. Or la progression est DÉJÀ dans la page : chaque membre dépose
     donc la sienne en passant (même principe que sa photo), et le Worker n'a plus
     qu'à LIRE. Quasi temps réel, et plus aucun appel LearnWorlds par membre.

     🔴 Ce qu'on lit : `.lw-course-card-progress-bar` PORTE lui-même
     `style="width:N%"` — l'élément EST le remplissage, il n'a aucun enfant
     (lire `firstElementChild.style.width` ne renvoie rien : piège vécu).
     🔴 Ce qu'on envoie : le `titleId` du lien de la carte, le SEUL identifiant
     commun à la page et à l'API d'administration (mesuré 46/46 ; les clés
     24-hexa de `/api/courses` ne matchent 0/46 et ne sortent jamais de la page).
     🔴 Ce qu'on n'invente pas : une carte SANS barre est ignorée. Poser un 0 %
     fabriquerait un faux « pas commencé », indiscernable d'un vrai.
     🔴 UNE PAGE NE MONTRE QU'UNE PARTIE DU CATALOGUE (10 cours sur Cours, 12 sur
     Cas… union de 46 sur 58 inscrits) : c'est le Worker qui FUSIONNE, on n'envoie
     ici que ce que la page courante sait. */
  var DEP_ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/depot";
  /* Clé de SITE Turnstile : publique par nature (c'est la clé secrète, côté
     Worker, qui valide). Même clé que l'annuaire, /account et /profile.
     🔴 Jamais de clé de service ici : ce dépôt est PUBLIC. */
  var DEP_SITEKEY="0x4AAAAAAD35WbGwkjYZmALf";
  var DEP_SIG="psDepotSig";
  var depEnVol=false, depTsEl=null, depRendu=false, depCorps=null, depSig="";

  function depMe(){ try{ return (typeof me==="object" && me && me.id) ? me : null; }catch(e){ return null; } }

  /* Paires titleId -> % présentes sur la page courante. null si rien. */
  function depLire(){
    var cards=document.querySelectorAll(".lw-course-card");
    var out={}, n=0;
    for(var i=0;i<cards.length;i++){
      var bar=cards[i].querySelector(".lw-course-card-progress-bar");
      if(!bar) continue;
      var w=(bar.style && bar.style.width)||"";
      if(w.indexOf("%")<0) continue;
      var p=parseFloat(w);
      if(!isFinite(p)) continue;
      var slug=slugDeCarte(cards[i]);
      if(!slug) continue;
      out[slug]=Math.max(0,Math.min(100,Math.round(p)));
      n++;
    }
    return n?out:null;
  }

  /* Progression PAR PROGRAMME (30/07) — la trouvaille qui règle les tuiles vides.
     🔴 Sur la page Compétences, LearnWorlds publie une barre par PROGRAMME
     (`.lw-learning-program-card`), pas par cours : mesuré, 4 cartes portant chacune
     une `.lw-course-card-progress-bar` à largeur inline, avec l'identifiant du
     programme dans le lien (`learningProgramId`). Notre collecteur ne regardait que
     les cartes de COURS et passait donc à côté.
     🔴 POURQUOI C'EST MIEUX QU'UNE MOYENNE : c'est une valeur DIRECTE, qui n'exige
     pas de retrouver chaque cours du programme — or 19 références de cours des
     programmes de l'école ne correspondent à aucune carte du site, ce qui laissait
     6 programmes à « — » pour toujours.
     🔴 On l'émet sous LES DEUX identifiants : le lien porte l'id de 24 caractères
     hexadécimaux, alors que `/bundles` côté API parle l'identifiant COURT.
     `me.userLearningPrograms` donne la correspondance sans aucun appel réseau. */
  function depLireProgrammes(u){
    var cards=document.querySelectorAll(".lw-learning-program-card");
    if(!cards.length) return null;
    var court={};                                  // id 24-hexa -> identifiant court
    var arr=(u && u.userLearningPrograms)||[];
    for(var i=0;i<arr.length;i++){
      if(arr[i] && arr[i].id && arr[i].titleId) court[String(arr[i].id)]=String(arr[i].titleId);
    }
    var out={}, pages={}, n=0;
    for(var j=0;j<cards.length;j++){
      var bar=cards[j].querySelector(".lw-course-card-progress-bar");
      if(!bar) continue;                           // pas de barre : on n'invente pas un 0 %
      var w=(bar.style && bar.style.width)||"";
      if(w.indexOf("%")<0) continue;
      var p=parseFloat(w);
      if(!isFinite(p)) continue;
      p=Math.max(0,Math.min(100,Math.round(p)));
      var a=cards[j].querySelector("a[href]");
      var h=a?(a.getAttribute("href")||""):"";
      var m=h.match(/learningProgramId=([^&]+)/)||h.match(/[?&]program=([^&]+)/);
      if(!m) continue;                             // sans identifiant, la valeur est inutilisable
      var id;
      try{ id=decodeURIComponent(m[1]); }catch(e){ id=m[1]; }
      out[id]=p; n++;
      if(court[id]) out[court[id]]=p;              // même valeur sous l'identifiant court
      /* 🔴 On note AUSSI la page où cette carte est apparue. Le rangement des
         tuiles du board venait jusqu'ici de tables écrites à la main, qui avaient
         dérivé du contenu réel : un parcours de la page Compétences se retrouvait
         rangé dans Études de cas, et un parcours présent sur AUCUNE page
         s'affichait quand même dans Compétences. On arrête de deviner. */
      pages[id]=location.pathname;
      if(court[id]) pages[court[id]]=location.pathname;
    }
    return n?{pct:out, pages:pages}:null;
  }

  /* ---- POURCENTAGE DE LA PAGE (03/08) --------------------------------------
     🔴 CE QUE ZIAD VEUT, et que j'avais mal modélisé pendant deux jours : le board
     de `/profile` doit afficher **la progression de chaque page**, rassemblée au
     même endroit — pas un second calcul par parcours qui donne un autre nombre.
     Donc on calcule ici, avec EXACTEMENT la règle de la tuile de page
     (`mountKpi`) : moyenne sur TOUTES les cartes de cours affichées, une carte
     sans barre comptant 0 au numérateur mais restant au dénominateur. Le profil
     se contente ensuite d'afficher cette valeur → les deux nombres sont le même
     par construction.
     🔴 `/profile` est EXCLU : le catalogue qu'on y a caché contient ~58 cartes et
     formerait une « page » fantôme qui écraserait toutes les autres.
     🔴 Dédup par lien, comme `mountKpi` : une même fiche affichée deux fois ne
     doit pas peser double. */
  function depLirePage(){
    if(/\/profile/.test(location.pathname)) return null;
    var cards=document.querySelectorAll("#pageContent .lw-course-card");
    /* 🔴 La page Compétences n'a AUCUNE carte de cours : elle n'affiche que des
       PROGRAMMES, et sa propre tuile moyenne ces programmes (cf. mountKpi de
       program-cards.js, qui déduplique par titre). Sans ce repli, cette page ne
       déposait rien et restait à 0 % sur le profil alors qu'elle affiche sa
       propre valeur. On reproduit donc sa règle, pas une autre. */
    if(!cards.length){
      var pc=document.querySelectorAll("#pageContent .lw-learning-program-card");
      if(!pc.length) return null;
      var vusP=Object.create(null), m=0;
      for(var q=0;q<pc.length;q++){
        var h=pc[q].querySelector(".learnworlds-heading3")||pc[q].querySelector("[class*='heading']");
        var t=h?(h.textContent||"").replace(/\s+/g," ").trim():"";
        if(!t || (t in vusP)) continue;             // dédup par titre, comme la tuile
        var bp=pc[q].querySelector(".lw-course-card-progress-bar");
        var vp=bp?parseInt(((bp.style&&bp.style.width)||"").replace("%",""),10):NaN;
        vusP[t]=isNaN(vp)?0:Math.max(0,Math.min(100,vp));
        m++;
      }
      if(!m) return null;
      var tp=0, kp;
      for(kp in vusP) tp+=vusP[kp];
      var op={}; op[location.pathname]=Math.round(tp/m);
      return {pct:op, cours:m};
    }
    var vus=Object.create(null), n=0;
    for(var i=0;i<cards.length;i++){
      if(cards[i].classList.contains("ps-lang-off")) continue;   // autre langue : hors calcul
      var a=cards[i].querySelector("a.card-link[href], a[href]");
      var cle=a?a.getAttribute("href"):null;
      if(!cle || (cle in vus)) continue;
      var bar=cards[i].querySelector(".lw-course-card-progress-bar");
      var p=bar?parseInt(((bar.style&&bar.style.width)||"").replace("%",""),10):NaN;
      vus[cle]=isNaN(p)?0:Math.max(0,Math.min(100,p));
      n++;
    }
    if(!n) return null;
    var total=0, k;
    for(k in vus) total+=vus[k];
    var o={};
    o[location.pathname]=Math.round(total/n);
    return {pct:o, cours:n};
  }

  /* Programmes du membre : `me.userLearningPrograms`, disponible sans réseau et
     COMPLET quelle que soit la page.
     🔴 C'est LUI le signal d'inscription, pas la présence d'une barre : les barres
     apparaissent quasi partout pour un membre connecté (mesuré 10/11, 3/3, 11/11,
     10/10, 12/12), donc une barre à 0 % ne prouve rien. Sans cette liste, un
     rapport d'école compterait des non-inscrits comme « inscrits à 0 % ». */
  /* 🔴 On envoie les DEUX identifiants de chaque programme. Mesuré en direct le
     30/07 : côté page un programme a un `id` de 24 caractères hexadécimaux ET un
     `titleId` court, exactement comme les cours — et c'est l'identifiant COURT que
     parle `/bundles` côté API d'administration. N'envoyer que `id` donnait une
     intersection VIDE côté Worker (13 programmes d'un côté, 12 de l'autre, 0 en
     commun). Envoyer les deux évite de parier sur le bon, et le Worker n'a qu'à
     tester l'appartenance. */
  function depProgrammes(u){
    var arr=u && u.userLearningPrograms;
    if(!arr || !arr.length) return [];
    var out=[];
    for(var i=0;i<arr.length;i++){
      var p=arr[i]; if(!p) continue;
      if(p.id) out.push(String(p.id));
      if(p.titleId && p.titleId!==p.id) out.push(String(p.titleId));
    }
    return out;
  }

  function depEnvoyer(jeton){
    if(!depCorps){ depEnVol=false; return; }
    var envoye=depSig;
    var nbProg=Object.keys(depCorps.progpct||{}).length;
    fetch(DEP_ENDPOINT,{
      method:"POST",
      headers:{ "Content-Type":"application/json", "X-Turnstile-Token":jeton },
      body:JSON.stringify(depCorps)
    })
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(j){
        /* 🔴 On ne mémorise la signature QUE si le Worker a bien répondu : sinon
           un échec réseau ferait sauter le dépôt jusqu'à la prochaine session,
           et la progression serait perdue pour rien.
           🔴🔴 ET ON EXIGE UN ACCUSÉ DE RÉCEPTION DE CE QU'ON A ENVOYÉ (leçon du
           30/07) : un Worker en retard d'une version répondait `ok:true` sans
           écrire les valeurs par programme. Comme on mémorisait la signature sur
           la seule foi de `ok`, le collecteur ne réessayait JAMAIS et la donnée
           était perdue en silence. Si on a envoyé des valeurs de programme, la
           réponse doit en compter au moins autant ; sinon on ne mémorise rien et
           la prochaine visite retentera — le système se répare tout seul dès que
           le Worker est à jour. */
        var accuse = !!(j && j.ok) && (!nbProg || (typeof j.programmes==="number" && j.programmes>=nbProg));
        if(accuse){ try{ sessionStorage.setItem(DEP_SIG, envoye); }catch(e){} }
      })
      .catch(function(){})
      .then(function(){ depEnVol=false; });
  }

  /* Turnstile invisible, auto-injecté. Widget rendu HORS ÉCRAN et non
     `display:none` : caché de cette façon il ne s'exécuterait pas.
     🔴 Un jeton est à USAGE UNIQUE : celui de /profile ou de l'annuaire a déjà
     servi, il faut le nôtre (même leçon que le dépôt de photo). */
  function depTurnstile(){
    if(!depTsEl){
      depTsEl=document.createElement("div");
      depTsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(depTsEl);
    }
    window.psDepTsReady=function(){
      try{
        /* 🔴 Le widget ne se rend qu'UNE fois ; pour un 2e dépôt (la page a fini
           d'afficher ses cartes entre-temps) on demande un NOUVEAU jeton par
           `reset` — un jeton Turnstile ne se rejoue pas, le Worker le refuserait
           en « timeout-or-duplicate ». */
        if(depRendu){ window.turnstile.reset(depTsEl); return; }
        window.turnstile.render(depTsEl,{
          sitekey:DEP_SITEKEY,
          callback:depEnvoyer,
          "error-callback":function(){ depEnVol=false; return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(depTsEl); }catch(e){} }
        });
        depRendu=true;
      }catch(e){ depEnVol=false; console.error("[ps-depot] turnstile",e); }
    };
    if(window.turnstile){ window.psDepTsReady(); return; }
    if(document.getElementById("ps-dep-ts-api")) return;
    var s=document.createElement("script");
    s.id="ps-dep-ts-api";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psDepTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function depotProgression(){
    if(depEnVol) return;                      // un dépôt déjà en cours d'envoi
    var u=depMe();
    if(!u) return;                            // anonyme : rien à déposer
    var cours=depLire();
    var lu=depLireProgrammes(u);
    var progpct=lu?lu.pct:null;
    var progpage=lu?lu.pages:null;
    var pageLue=depLirePage();
    var pagepct=pageLue?pageLue.pct:null;
    /* 🔴 On accepte l'UN ou l'AUTRE. La page Compétences n'a AUCUNE carte de cours
       (mesuré : 0 carte de cours, 4 cartes de programme) — exiger `cours` comme
       avant y aurait bloqué le dépôt et c'est précisément la page qui porte la
       donnée la plus utile. */
    if(!cours && !progpct && !pagepct) return;  // page sans rien à lire : on repassera
    var slugs=cours?Object.keys(cours).sort():[];
    var progs=depProgrammes(u);
    /* Signature = ce qu'on s'apprête à envoyer. 🔴 Sans elle, un membre qui
       navigue déclencherait un POST et une écriture KV par page — or KV plafonne
       à 1 écriture par seconde et par clé. On ne parle au Worker que quand la
       valeur a VRAIMENT changé — mais on RESTE capable de renvoyer plus tard dans
       la même page, quand le Site Builder a fini d'afficher ses cartes. */
    var pcles=progpct?Object.keys(progpct).sort():[];
    var gcles=progpage?Object.keys(progpage).sort():[];
    var acles=pagepct?Object.keys(pagepct).sort():[];
    var sig=slugs.map(function(s){ return s+":"+cours[s]; }).join(",")
          +"|"+progs.join(",")
          +"|"+pcles.map(function(k){ return k+":"+progpct[k]; }).join(",")
          +"|"+gcles.map(function(k){ return k+">"+progpage[k]; }).join(",")
          +"|"+acles.map(function(k){ return k+"="+pagepct[k]; }).join(",");
    var vue=null;
    try{ vue=sessionStorage.getItem(DEP_SIG); }catch(e){}
    if(vue===sig) return;
    depEnVol=true;
    depSig=sig;
    depCorps={ uid:String(u.id), cours:cours||{}, programmes:progs, progpct:progpct||{}, progpage:progpage||{}, pagepct:pagepct||{} };
    depTurnstile();
  }

  /* ====================================================================
     RAPPEL DE COMPLÉTION DE PROFIL  (04/08)
     --------------------------------------------------------------------
     Les champs de l'annuaire sortent du formulaire d'inscription : on ne
     demande plus rien pour créer un compte, et on invite à compléter APRÈS,
     quand la personne a déjà ce qu'elle est venue chercher.

     🔴🔴 ON NE RÉCLAME QUE CE QUI EST RÉELLEMENT SAISISSABLE. Mesuré le
     04/08 sur `/profile` : seuls `cf_annuaire, cf_contact, cf_ecole,
     cf_niveau, cf_recherche, cf_langue` y sont éditables. `cf_poste`,
     `cf_promo` et `cf_photo` EXISTENT dans l'école mais n'ont pas leur case
     « édition profil » cochée — les réclamer enverrait le membre chercher
     un champ qui n'est nulle part, et c'est nous qui aurions l'air cassés.

     🔴 `cf_matieres` N'EXISTE PAS ENCORE. Il est déclaré ci-dessous mais
     n'est compté que s'il apparaît dans `me.custom_fields` : le jour où
     Ziad le crée, le rappel le demande tout seul, sans toucher au code. On
     déduit, on n'énumère pas — même principe que le découpage en deux
     écrans, et pour la même raison : une liste écrite à la main se périme
     en silence.

     🔴 AUCUN APPEL RÉSEAU. `me.custom_fields` porte les 9 champs AVEC leurs
     valeurs sur une page membre (mesuré le 04/08). Attention : la même
     lecture faite dans l'ADMIN ressort vide — ne pas généraliser depuis là.

     🔴 ON NE COMPTE PAS `bio`, `location`, `linkedin` : ils ne sont pas
     exposés par `me`, et une mesure impossible ne doit pas entrer dans un
     pourcentage. Un profil « à 60 % » à cause de champs illisibles serait
     un chiffre inventé — l'erreur exacte de l'ancien calcul de progression.
     ==================================================================== */
  var CHAMPS_PROFIL=[
    {cle:"cf_ecole",     nom:"votre école"},
    {cle:"cf_niveau",    nom:"votre niveau"},
    {cle:"cf_recherche", nom:"le poste que vous visez"},
    {cle:"cf_langue",    nom:"votre langue"},
    {cle:"cf_contact",   nom:"comment vous joindre"},
    {cle:"cf_matieres",  nom:"les matières où vous pouvez aider"}
  ];

  /* 🔴 LA MÊME RÈGLE QUE LE WORKER, MOT POUR MOT. Lui décide qui apparaît
     dans l'annuaire (`accepteAnnuaire`), nous décidons qui on sollicite. Si
     les deux divergeaient, on réclamerait un profil à quelqu'un qui
     n'apparaîtra jamais, ou on laisserait tranquille quelqu'un qui figure
     dans la liste avec une fiche vide. Fermé par défaut des deux côtés. */
  function reponseOptin(v){
    var s=String(v==null?"":v).normalize("NFD").replace(/[̀-ͯ]/g,"").trim().toLowerCase();
    if(!s) return "sans-reponse";
    return s.indexOf("oui")===0 ? "oui" : "non";
  }

  function rempli(v){
    if(v==null) return false;
    if(Array.isArray(v)) return v.length>0;
    return String(v).trim()!=="";
  }

  /* Séparé et pur : c'est la seule partie qui décide quoi afficher, donc la
     seule qu'on ait besoin de relire quand le comportement surprend. */
  function etatProfil(champsMembre){
    var cf=champsMembre||{};
    var optin=reponseOptin(cf.cf_annuaire);
    if(optin==="non") return {afficher:false};              // choix respecté, on n'insiste jamais
    if(optin==="sans-reponse") return {afficher:true, mode:"invite"};

    var attendus=CHAMPS_PROFIL.filter(function(c){ return c.cle in cf; });
    var manquants=attendus.filter(function(c){ return !rempli(cf[c.cle]); });
    if(!attendus.length || !manquants.length) return {afficher:false};
    return {
      afficher:true, mode:"complement", manquants:manquants,
      pct:Math.round((attendus.length-manquants.length)/attendus.length*100)
    };
  }

  var RAPPEL_JOURS=7;

  /* ====================================================================
     LES PAGES OÙ NOS BANDEAUX SE TAISENT  (04/08, soir)
     --------------------------------------------------------------------
     🔴🔴 Vu en direct sur le compte que Ziad venait de créer par LinkedIn :
     sur `/email-verification-pending` — « Verify your email address » — mon
     bandeau d'orientation ET mon rappel de profil s'affichaient. La personne
     n'a QU'UNE chose à faire, cliquer le lien reçu par mail, et on lui
     proposait deux autres actions, dont **payer**. Trois appels à l'action
     concurrents sur l'écran le plus fragile du parcours, et le plus visible
     poussait vers l'abonnement alors que l'inscription n'est pas finie.
     🔴 La règle générale : tant que le compte n'est pas utilisable, on
     n'essaie ni de vendre ni de faire remplir un profil. Un écran de
     transaction ou de vérification appartient à LearnWorlds, pas à nous.
     ==================================================================== */
  var PAGES_MUETTES=/^\/(path-player|course-player|payment|email-verification|error|checkout|reset-password|confirm)/;

  function rappelProfil(){
    var u=membrePS();
    if(!u || document.getElementById("ps-rappel")) return;
    /* 🔴 UN SEUL SOLLICITEUR À LA FOIS. Le membre qui a un accès relève de la
       POPUP (`fichePopup`), qui fait remplir la fiche sur place ; lui montrer en
       plus la pastille en coin, c'est demander deux fois la même chose par deux
       chemins différents. Le rappel garde sa place pour les autres.
       Le test porte sur l'accès, pas sur « la popup est-elle affichée » : sinon
       le rappel réapparaîtrait dès que la popup est reportée. */
    if(ficheAcces(u) || document.getElementById("ps-fiche")) return;
    /* On n'interrompt ni une leçon, ni une inscription en cours de validation. */
    if(PAGES_MUETTES.test(location.pathname||"")) return;

    /* 🔴 CLÉ SUFFIXÉE PAR LE MEMBRE. Sans ça, sur un poste partagé, la mise
       en veille d'un membre masque le rappel du suivant — bug déjà commis
       avec `psLpProgress`, qui n'était pas clé par membre non plus. */
    var cle="psRappelProfil:"+(u.id||"?");
    try{
      var jusqua=Number(localStorage.getItem(cle)||0);
      if(jusqua && Date.now()<jusqua) return;
    }catch(e){}

    var etat=etatProfil(u.custom_fields);
    if(!etat.afficher) return;

    if(!document.getElementById("ps-rappel-css")){
      var st=document.createElement("style"); st.id="ps-rappel-css";
      st.textContent=
        "#ps-rappel{position:fixed;right:20px;bottom:20px;z-index:9998;width:min(360px,calc(100vw - 40px));"+
        "background:#fff;border:1px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-card,16px);"+
        "box-shadow:0 12px 34px rgba(15,23,42,.16);padding:18px 20px;font-family:var(--ps-font,Figtree,sans-serif);"+
        "animation:ps-rappel-in .32s ease both}"+
        "@keyframes ps-rappel-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}"+
        "#ps-rappel h4{margin:0 0 6px;font:800 15.5px/1.3 var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26)}"+
        "#ps-rappel p{margin:0;font:400 13.5px/1.5 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879)}"+
        "#ps-rappel .ps-rappel-x{position:absolute;top:10px;right:10px;width:26px;height:26px;border:0;background:transparent;"+
        "color:#b9c3d6;cursor:pointer;border-radius:50%;font-size:17px;line-height:1}"+
        "#ps-rappel .ps-rappel-x:hover{background:#F3F5F9;color:#676879}"+
        "#ps-rappel .ps-rappel-jauge{height:6px;border-radius:3px;background:#EDF0F5;margin:12px 0 4px;overflow:hidden}"+
        "#ps-rappel .ps-rappel-jauge i{display:block;height:100%;border-radius:3px;background:var(--ps-accent,#507EC5);transition:width .5s}"+
        "#ps-rappel .ps-rappel-pct{font:700 11.5px/1 var(--ps-font,Figtree,sans-serif);color:var(--ps-accent,#507EC5);letter-spacing:.04em}"+
        "#ps-rappel .ps-rappel-cta{display:inline-block;margin-top:14px;background:var(--ps-accent,#507EC5);color:#fff;"+
        "text-decoration:none;border:0;cursor:pointer;border-radius:var(--ps-r-btn,10px);padding:9px 16px;"+
        "font:700 13px var(--ps-font,Figtree,sans-serif)}"+
        "#ps-rappel .ps-rappel-cta:hover{background:var(--ps-accent-hover,#486798)}"+
        "@media(max-width:640px){#ps-rappel{right:12px;left:12px;bottom:12px;width:auto}}";
      document.head.appendChild(st);
    }

    var boite=document.createElement("div");
    boite.id="ps-rappel";
    boite.setAttribute("role","complementary");
    boite.style.position="fixed";

    var fermer=document.createElement("button");
    fermer.className="ps-rappel-x"; fermer.type="button";
    fermer.setAttribute("aria-label","Masquer ce rappel"); fermer.textContent="×";
    boite.appendChild(fermer);

    var titre=document.createElement("h4");
    var texte=document.createElement("p");
    if(etat.mode==="invite"){
      titre.textContent="Rejoignez l'annuaire des étudiants";
      texte.textContent="Trouvez un partenaire pour vous entraîner aux études de cas — et laissez les autres vous trouver.";
    }else{
      /* 🔴 Le titre suit le taux RÉEL. « Presque prête » sur une fiche à 0 %,
         c'est une phrase qui ment à la personne qui la lit — et un encouragement
         qui se contredit lui-même trois lignes plus bas, sous la barre. */
      titre.textContent = etat.pct>=60 ? "Votre fiche est presque prête"
                        : "Complétez votre fiche d'annuaire";
      /* On NOMME ce qui manque : « complétez votre profil » n'indique rien,
         et la personne repart chercher quoi remplir. */
      var liste=etat.manquants.map(function(c){ return c.nom; });
      var enTexte=liste.length===1 ? liste[0]
        : liste.slice(0,-1).join(", ")+" et "+liste[liste.length-1];
      texte.textContent="Il manque "+enTexte+".";
    }
    boite.appendChild(titre); boite.appendChild(texte);

    if(etat.mode==="complement"){
      var jauge=document.createElement("div"); jauge.className="ps-rappel-jauge";
      var barre=document.createElement("i"); barre.style.width=etat.pct+"%";
      jauge.appendChild(barre); boite.appendChild(jauge);
      var pct=document.createElement("div"); pct.className="ps-rappel-pct";
      pct.textContent=etat.pct+" % complété"; boite.appendChild(pct);
    }

    /* 🔴 LE RAPPEL OUVRE LE FORMULAIRE, IL NE DÉPLACE PLUS. Trois versions se
       sont succédé et les deux premières envoyaient vers `/profile` — page qui
       n'affiche AUCUN des six champs (mesuré le 05/08). On y expédiait donc les
       gens chercher un formulaire absent : c'est le meilleur candidat pour
       expliquer les 13 comptes sur 17 sans réponse à l'opt-in.
       ⇒ On ouvre la popup sur place quand elle est disponible ; sinon on va sur
       `/account`, où les champs existent vraiment. Plus de branche « suis-je
       déjà sur la bonne page » : ouvrir le formulaire marche partout. */
    var cta;
    if(typeof window.PS_FICHE_OUVRIR==="function"){
      cta=document.createElement("button");
      cta.type="button"; cta.textContent="Compléter ma fiche";
      cta.addEventListener("click",function(){
        boite.remove();
        if(window.PS_FICHE_OUVRIR(true)===false) location.href="/account";
      });
    }else{
      cta=document.createElement("a");
      cta.href="/account"; cta.textContent="Compléter ma fiche";
    }
    cta.className="ps-rappel-cta";
    boite.appendChild(cta);

    fermer.addEventListener("click",function(){
      try{ localStorage.setItem(cle, String(Date.now()+RAPPEL_JOURS*864e5)); }catch(e){}
      boite.remove();
    });

    (document.body||document.documentElement).appendChild(boite);
  }

  /* ====================================================================
     ORIENTATION APRÈS AUTHENTIFICATION  (04/08, nuit)
     --------------------------------------------------------------------
     La page d'entrée aiguille sur l'adresse SAISIE. Google et LinkedIn la
     court-circuitent : le compte se crée, la personne atterrit sur le site,
     et plus rien ne la mène nulle part. Mesuré sur un vrai compte créé par
     Ziad via Google (`@boks.app`) : catalogue visible, mais un clic sur un
     cours donne une PAGE D'ERREUR sur la page Cours, et une page de vente
     SANS BOUTON NI PRIX sur S'entraîner. Aucun chemin d'achat, nulle part.

     🔴 On rattrape donc APRÈS l'authentification, là où l'adresse est enfin
     connue : `me.email`. La règle de domaine est celle de la page d'entrée
     (`PS_PARTENAIRE_EMAIL`), il n'y en a toujours qu'une.

     🔴🔴 UNE ÉCOLE PARTENAIRE NE VOIT JAMAIS DE PAYWALL, MÊME SANS ACCÈS.
     C'est la règle la plus importante de ce bloc. Entre l'inscription et
     l'exécution de l'automatisation, un étudiant d'école a zéro programme :
     le pousser vers l'abonnement lui réclamerait 99 € pour un accès que son
     école paie déjà. C'est exactement le pire résultat par le chemin par
     défaut — le défaut que j'ai livré ce matin sur la page d'entrée. Ici on
     préfère un message d'attente à une erreur de facturation.

     🔴 On ORIENTE, on ne redirige pas. La personne vient de créer son compte ;
     l'expulser vers un tunnel de paiement avant qu'elle ait rien vu, c'est
     transformer une inscription réussie en sortie de site.
     ==================================================================== */
  /* La page d'offre, créée le 04/08 sous le slug `formules` (vérifié : 200).
     🔴 Elle a d'abord pointé vers `/program/collection-3-mois` — la page de
     programme native — le temps que celle-ci existe : un bandeau qui envoie
     vers une page inexistante est pire que pas de bandeau du tout. */
  var URL_OFFRE_DEFAUT="/formules";

  /* Pure et isolée : c'est elle qui décide, et elle seule mérite d'être relue
     quand le comportement surprend. `partenaire` est le résultat de la règle de
     domaine, `programmes` le nombre d'accès déjà obtenus. */
  function orientation(u, partenaire, programmes){
    if(!u) return {montrer:false};
    if(u.is_admin) return {montrer:false};              /* l'admin voit tout, il n'achète rien */
    if(programmes>0) return {montrer:false};            /* accès déjà en place */
    if(partenaire) return {montrer:true, mode:"ecole", ecole:partenaire.nom||""};
    return {montrer:true, mode:"offre"};
  }

  /* ====================================================================
     CADENAS SUR LES CARTES DE COURS NON ACCESSIBLES  (05/08)
     --------------------------------------------------------------------
     Demande de Ziad : la carte reste visible — c'est la vitrine, on a passé
     des semaines à la styler — mais au survol (ou au premier appui sur
     mobile) un cadenas apparaît et le clic ne mène plus au cours.

     🔴 LE SIGNAL D'ACCÈS EST `me.userLearningPrograms`, PAS LA BARRE DE
     PROGRESSION. Une barre à 0 % NE PROUVE PAS l'inscription : mesuré le
     30/07, elles s'affichent même quand `/api/courses` dit `registered:false`.
     Se fier à elles verrouillerait des cartes d'un membre inscrit.
     ⇒ Zéro programme = aucun accès. C'est exact tant qu'UN programme ouvre
     tout le catalogue, ce qui est le modèle actuel. **Le jour où un cours se
     vend à l'unité, cette règle devient fausse** — c'est écrit ici pour qu'on
     s'en souvienne à ce moment-là.

     🔴 Le clic mène à l'offre, PAS dans le vide. Un clic sans effet, c'est un
     prospect qui repart au moment précis où il manifeste son intérêt. C'est le
     même raisonnement que le bandeau d'orientation. Une ligne à changer si
     Ziad préfère le blocage sec.

     🔴 JAMAIS sur `/profile` : ses 55 cartes sont les cours DU MEMBRE, et la
     section est la meilleure source du collecteur de progression. Ni sur le
     lecteur, ni sur le tunnel, ni sur la page d'offre elle-même.
     ==================================================================== */
  var CARTES_HORS_VERROU=/^\/(profile|path-player|course-player|payment|formules|account)/;

  function accesOuvert(u){
    if(!u) return false;                                   /* anonyme : verrouillé */
    if(u.is_admin || u.isStaff || u.isAInstructor) return true;
    return (u.userLearningPrograms || []).length > 0;
  }

  function cssVerrou(){
    if(document.getElementById("ps-verrou-css")) return;
    var st=document.createElement("style"); st.id="ps-verrou-css";
    st.textContent=
      ".lw-course-card.ps-verrouille{position:relative !important;}"+
      /* 🔴🔴 ON FLOUTE LA CARTE, ON NE POSE PAS UN PANNEAU DESSUS.
         Première version : un voile plein avec titre et sous-titre. Ziad :
         « c'est moche », et il avait raison — je superposais un bloc de texte
         à une carte qui a déjà sa mise en page. Les deux textes se
         chevauchaient, et le rectangle gris ressemblait à un chargement raté.
         Le flou porte sur les ENFANTS de la carte, pas sur la carte elle-même :
         appliquer un filtre à la carte flouterait aussi le cadenas, qui est son
         enfant. Et comme l'illustration déborde de la boîte, la flouter par ce
         chemin la couvre enfin — ce qu'un `inset:0` ne faisait pas. */
      ".lw-course-card.ps-verrouille > *:not(.ps-verrou){transition:filter .2s ease, opacity .2s ease;}"+
      ".lw-course-card.ps-verrouille:hover > *:not(.ps-verrou),"+
      ".lw-course-card.ps-verrouille:focus-within > *:not(.ps-verrou),"+
      ".lw-course-card.ps-verrouille.ps-verrou-on > *:not(.ps-verrou)"+
      "{filter:blur(3.5px) saturate(.5);opacity:.45;}"+
      ".ps-verrou{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;"+
      "align-items:center;justify-content:center;gap:14px;border-radius:inherit;"+
      "opacity:0;pointer-events:none;transition:opacity .18s ease;"+
      "font-family:var(--ps-font,Figtree,sans-serif);text-align:center;padding:16px;}"+
      ".lw-course-card.ps-verrouille:hover .ps-verrou,"+
      ".lw-course-card.ps-verrouille:focus-within .ps-verrou,"+
      ".lw-course-card.ps-verrouille.ps-verrou-on .ps-verrou{opacity:1;}"+
      /* Le cadenas vit dans un disque : il se détache quelle que soit la carte
         derrière, sans avoir à assombrir toute la vitrine. */
      ".ps-verrou i{width:74px;height:74px;border-radius:50%;background:rgba(20,23,30,.88);"+
      "display:flex;align-items:center;justify-content:center;box-shadow:0 12px 30px rgba(15,23,42,.32);}"+
      ".ps-verrou svg{width:34px;height:34px;stroke:#fff;fill:none;stroke-width:1.8;}"+
      /* 🔴 Libellé sur une pastille BLANCHE : lisible au-dessus de n'importe
         quelle carte, quelles que soient ses couleurs — les pages ont chacune
         leur accent, du jaune au vert. Du texte blanc sur fond flouté serait
         illisible sur les cartes claires. */
      ".ps-verrou b{font:800 12.5px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);"+
      "background:#fff;padding:7px 15px;border-radius:var(--ps-r-pill,999px);"+
      "box-shadow:0 6px 18px rgba(15,23,42,.18);letter-spacing:.01em;}"+
      /* 🔴 Au doigt il n'existe pas de survol : le premier appui révèle le
         cadenas (classe posée par le JS), le second suit le lien vers l'offre.
         Sans ça, l'utilisateur mobile ne verrait jamais l'explication. */
      "@media(hover:none){.lw-course-card.ps-verrouille .ps-verrou{transition:opacity .12s ease;}}";
    (document.head||document.documentElement).appendChild(st);
  }

  var SVG_CADENAS='<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">'+
    '<rect x="4" y="10.5" width="16" height="10.5" rx="2.2"/>'+
    '<path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1"/><circle cx="12" cy="15.6" r="1.35" fill="#fff" stroke="none"/></svg>';

  /* ====================================================================
     QUELLES CARTES SE VERROUILLENT : CELLES DONT L'INSCRIPTION EST FERMÉE
     --------------------------------------------------------------------
     Demande de Ziad : garder le webinaire gratuit ouvert, y compris pour un
     compte non validé. La bonne règle n'est donc pas « tout verrouiller quand
     la personne n'a pas d'accès » mais « verrouiller les cours FERMÉS ». Les
     cours ouverts le restent tout seuls, sans exception à maintenir.

     🔴🔴 ET C'EST UNE DÉTECTION PAR LE TEXTE, CE QUE JE M'INTERDIS D'HABITUDE.
     Mesuré : la mention « Inscription fermée » vit dans un élément générique
     (`learnworlds-main-text …`), sans classe dédiée ni attribut. Il n'existe
     aucun marqueur stable à viser dans la page.
     Ce qui rend le compromis acceptable ICI, et seulement ici : **le cadenas
     n'est pas un contrôle d'accès**. C'est LearnWorlds qui protège les cours —
     un clic qui passerait tombe sur son écran « premium content ». Une
     détection qui se trompe coûte un affordance marketing, jamais l'accès.
     Je ne l'écrirais pas pour un verrou réel ; pour celui-ci, oui.
     🔴 Motif FR **et** EN : le site est traduit par Weglot, et ne matcher que
     le français laisserait tout ouvert en anglais.
     🔴 Et si plus RIEN n'est reconnu sur une page qui a des cartes, on le DIT.
     Une reformulation côté LearnWorlds désactiverait sinon le cadenas partout,
     en silence — exactement le défaut de l'opt-in corrigé ce matin. */
  var MOTIF_FERME=/inscription\s*(ferm|cl[oô]tur)|enrollment\s*(is\s*)?closed|closed\s*for\s*enrollment/i;

  function carteFermee(c){
    return MOTIF_FERME.test((c.textContent||"").replace(/\s+/g," "));
  }

  /* ====================================================================
     LA LISTE FAIT AUTORITÉ, LE LIBELLÉ N'EST QUE LE REPLI  (05/08)
     --------------------------------------------------------------------
     Le Worker publie sur `/cours` les identifiants des cours dont
     l'inscription est fermée, lus dans le champ `access` de l'API — la
     source d'autorité, pas un texte affiché.

     🔴 LA JOINTURE PASSE PAR `id`, ET C'EST UNE SURPRISE MESURÉE LE 05/08.
     Mes notes décrivaient l'identifiant d'administration comme opaque ; il
     vaut en réalité `niveau-1`, `support-webinar`… soit exactement le
     `courseid` des liens de cartes. `titleId`, lui, est vide sur les 61 cours.
     🔴 Je l'avais d'ailleurs conclu de travers : mon propre script imprimait
     la réponse trois lignes sous un verdict qui disait « jointure impossible ».
     C'est Ziad qui a lu le tableau. Un script doit lire sa propre mesure.

     🔴 LE REPLI RESTE. Si l'appel échoue — Worker indisponible, réseau coupé —
     on retombe sur la détection par libellé. Un cadenas approximatif vaut mieux
     qu'un catalogue entièrement déverrouillé, et l'accès reste de toute façon
     protégé par LearnWorlds.
     🔴 Mis en cache pour UNE HEURE, et dans `localStorage` — pas
     `sessionStorage` comme au premier jet. Un statut de cours change à la main,
     quelques fois par an ; le garder d'un onglet à l'autre fait disparaître la
     fenêtre où l'on ne sait pas encore quoi verrouiller, et c'est précisément
     cette fenêtre qui laissait passer les clics. La liste est école-wide, jamais
     propre à un membre : rien à cloisonner par compte (contrairement à
     `psLpProgress`, dont l'absence de clé par membre était un vrai défaut). */
  var ENDPOINT_COURS="https://annuaire-prepastrat.ziedbencheikh.workers.dev/cours";
  var CLE_FERMES="psCoursFermes";
  var _fermes=null;              /* Set des slugs fermés, ou null si on ne sait pas */
  var _fermesDemande=false;

  function slugDeCarte(c){
    var a=c.querySelector('a[href*="courseid="],a[href*="/course/"]');
    var h=a ? (a.getAttribute("href")||"") : "";
    var m=h.match(/[?&]courseid=([^&#]+)/);
    if(m) return decodeURIComponent(m[1]);
    m=h.match(/\/course\/([^\/?#]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function chargerCoursFermes(){
    if(_fermes!==null || _fermesDemande) return;
    _fermesDemande=true;
    try{
      var brut=localStorage.getItem(CLE_FERMES);
      if(brut){
        var o=JSON.parse(brut);
        if(o && o.exp>Date.now() && Array.isArray(o.f)){ _fermes=new Set(o.f); return; }
      }
    }catch(e){}
    try{
      fetch(ENDPOINT_COURS,{headers:{Accept:"application/json"}})
        .then(function(r){ return r.ok ? r.json() : null; })
        .then(function(d){
          if(!d || !Array.isArray(d.fermes)) return;
          _fermes=new Set(d.fermes);
          try{ localStorage.setItem(CLE_FERMES, JSON.stringify({f:d.fermes, exp:Date.now()+36e5})); }catch(e){}
          verrouCartes();                    /* on repasse, maintenant qu'on sait */
        })
        .catch(function(){});                /* silence : le repli prend la main */
    }catch(e){}
  }

  /* ====================================================================
     LE CLIC EST GARDÉ AVANT QUE LE CADENAS SOIT DESSINÉ  (05/08, reprise)
     --------------------------------------------------------------------
     Bug signalé par Ziad : « on a le temps de cliquer sur la carte au
     chargement de la page ». Exact, et c'était structurel : le garde-clic
     était posé CARTE PAR CARTE dans `verrouCartes()`.

     🔴 CHRONOLOGIE RÉELLE, relevée sur `/formation-par-modules` en anonyme
     (`performance.getEntriesByType('resource')`) — Ziad a demandé si « 5 à 8 s »
     n'était pas exagéré ; c'était une valeur recopiée de mes notes, la vraie
     mesure est différente et le trou est quand même de trois secondes :
        832 ms   DOMContentLoaded
       2168 ms   /api/learner/products  →  les cartes apparaissent vers 2,4-3 s
       2552 ms   /api/courses           (fin 3020 ms)
       4154 ms   notre /cours           (fin 4320 ms)  ← la liste arrivait ici
       ~6000 ms  premier passage de `verrouCartes()` qui trouve des cartes
     ⇒ **entre ~2,5 s et ~6 s, la carte était peinte, cliquable et sans
     gardien.** Le premier passage à 1 s ne servait à rien : il sortait sur
     `!cartes.length` AVANT même de demander la liste, ce qui repoussait la
     requête au passage suivant. Le garde partait donc APRÈS le problème.
     🔴🔴 UN VERROU DESSINÉ N'EST PAS UN VERROU. Le cadenas est un signal
     visuel, c'est le gestionnaire de clic qui décide. Les deux n'ont aucune
     raison d'arriver ensemble — et j'avais fait dépendre le second du premier.
     ⇒ UN SEUL écouteur, délégué au `document`, en phase de CAPTURE, posé dès
     l'exécution de ce fichier. Il n'attend aucune carte : il remonte du point
     cliqué jusqu'à `.lw-course-card`. Les écouteurs par carte ont disparu — en
     garder deux, c'était garder celui qui arrive trop tard.

     🔴 CE QUI REND LA DÉCISION POSSIBLE À t=0, mesuré et non supposé :
     `var me=` est défini à l'offset 1505 du HTML, dans le `<head>`, donc bien
     AVANT nos loaders. Savoir si la personne a déjà un accès ne demande donc
     aucune attente — c'était la seule inconnue qui aurait pu envoyer un membre
     payant vers l'offre au lieu de son cours.
     🔴 EN REVANCHE, le HTML servi ne contient **aucune carte** : ni élément
     `.lw-course-card`, ni lien de cours (mesuré au `curl`). Tout est construit
     en JS après `/api/learner/products`. Conséquence utile : quand un clic
     arrive, la carte EXISTE forcément — et son texte porte alors « Inscription
     fermée » (relevé : « Inscription fermée Niveau #1 — … »), même si notre CSS
     masque le calque qui l'affiche, car `textContent` ignore `display`.
     ⇒ Le repli par libellé tranche donc le plus souvent tout seul, sans
     attendre le Worker. L'attente bornée ci-dessous ne sert qu'au cas résiduel :
     carte présente, libellé pas encore rendu.
     🔴 Et les liens sont de la forme `/course/<slug>`, PAS `?courseid=` (0 lien
     de cette forme sur la page mesurée) — `slugDeCarte()` couvre les deux, il
     ne faut pas retirer la seconde branche en croyant qu'elle ne sert plus.
     🔴 Et si la liste n'arrive jamais, on suit le lien d'origine : l'erreur
     penche du côté qui ne bloque personne à tort. C'est déjà la règle du
     verrou, et le contenu reste protégé par LearnWorlds. */
  var ATTENTE_LISTE=1200;
  var _gardePosee=false;

  /* La même question pour le peintre et pour le garde : « faut-il verrouiller
     pour CETTE personne, sur CETTE page ? ». Une seule fonction, sinon les deux
     règles divergent au premier changement. */
  function modeVerrou(){
    if(CARTES_HORS_VERROU.test(location.pathname||"")) return false;
    var u=membrePS();
    if(accesOuvert(u)) return false;                       /* rien à verrouiller */
    /* 🔴🔴 UN ÉTUDIANT D'ÉCOLE PARTENAIRE NE VOIT JAMAIS « S'ABONNER ».
       Même règle que le bandeau d'orientation, et pour la même raison : entre
       son inscription et le passage de l'automatisation, il n'a aucun programme
       — donc `accesOuvert()` dit non. Verrouiller ses cartes avec « s'abonner »,
       ce serait réclamer 99 € à quelqu'un dont l'école a déjà payé, au moment
       exact où il découvre la plateforme. Le pire résultat par le chemin par
       défaut, encore une fois.
       On préfère le laisser voir des cartes cliquables quelques minutes : au
       pire il tombe sur l'écran d'accès de LearnWorlds, qui lui, ne lui réclame
       pas d'argent. */
    try{
      if(u && window.PS_PARTENAIRE_EMAIL && window.PS_PARTENAIRE_EMAIL(u.email)) return false;
    }catch(e){}
    return true;
  }

  /* Verdict pour UNE carte. `null` = on ne sait pas ENCORE — c'est un troisième
     état, pas un « non ». Le confondre avec « ouvert » est exactement ce qui
     laissait passer les clics.

     🔴🔴 LA LISTE NE FAIT AUTORITÉ QUE SI LA JOINTURE EST POSSIBLE. Défaut
     mesuré le 05/08 sur la page **Cas** : ses cartes n'ont pas de lien de
     cours, leurs `<a>` valent `javascript:void(0)` (LearnWorlds navigue en JS).
     Le slug ressortait donc VIDE — et comme je faisais confiance à la liste dès
     qu'elle était chargée, sans vérifier que la carte était identifiable,
     `_fermes.has("")` répondait « non » et **aucune des 12 cartes n'était
     verrouillée**. En silence, sur une page entière.
     🔴 L'ironie : le libellé « Inscription fermée » est bien présent sur ces
     cartes. Le repli existait, il n'était simplement plus atteignable. **Une
     source d'autorité ne doit prendre la main que là où elle sait répondre.**
     🔴 Pourquoi ça n'a pas sauté aux yeux : la page Cours, elle, a de vrais
     liens `/course/<slug>` — j'y ai vu 11 cartes verrouillées sur 12 et j'ai
     généralisé à tout le site. Une page vérifiée n'est pas cinq pages
     vérifiées. */
  /* 🔴🔴🔴 LA LISTE CONFIRME, ELLE NE DÉMENT PAS. Deuxième correctif du même
     jour, parce que le premier ne traitait que le slug VIDE (page Cas) et pas
     le slug FAUX. Mesuré sur `/fiches-secteur` : trois cartes portent
     « Inscription fermée » et restaient déverrouillées —
        fiche-secteur-pharmaceutique   absente de la liste
        fiche-secteur-aeronautique     absente de la liste
        lire-un-bilan-financier        l'API l'appelle « comment-lire-un-bilan-financier »
     Le slug étant non vide, j'interrogeais la liste, elle répondait « non », et
     je concluais « ouvert ». **Une jointure qui échoue ne dit pas « non », elle
     ne dit rien.** Confondre les deux, c'est déverrouiller un cours fermé.
     ⇒ Les deux signaux sont désormais POSITIFS et indépendants : la liste peut
     verrouiller, le libellé peut verrouiller, aucun des deux ne peut
     déverrouiller l'autre. L'union couvre le cas où l'identifiant d'API diffère
     du slug de page (avéré) ET le cas où LearnWorlds cesserait d'afficher sa
     mention (le motif de départ de la liste).
     🔴 Sur-verrouiller un cours réellement ouvert supposerait qu'il affiche
     « inscription fermée » : le webinaire gratuit ne le fait pas, et c'est
     vérifié à chaque page. */
  function carteVerrouillee(c){
    var s=slugDeCarte(c);
    if(_fermes && s && _fermes.has(s)) return true;   /* la liste confirme */
    if(carteFermee(c)) return true;                   /* le libellé confirme */
    return _fermes ? false : null;
  }

  function versOffre(){ location.href = window.PS_URL_OFFRE || URL_OFFRE_DEFAUT; }

  function attendreListe(cb){
    if(_fermes){ cb(); return; }
    var t0=Date.now();
    (function boucle(){
      if(_fermes || Date.now()-t0>ATTENTE_LISTE){ cb(); return; }
      setTimeout(boucle, 60);
    })();
  }

  function reagirVerrou(c){
    poserVerrou(c);                  /* le cadenas peut n'être pas encore dessiné */
    /* 🔴 Au doigt il n'existe pas de survol : le premier appui révèle le
       cadenas, le second suit vers l'offre. Sans ça, l'utilisateur mobile
       n'aurait jamais l'explication — juste une carte qui « saute ». */
    var tactile=false;
    try{ tactile=window.matchMedia("(hover:none)").matches; }catch(_){}
    if(tactile && !c.classList.contains("ps-verrou-on")){
      c.classList.add("ps-verrou-on");
      return;
    }
    versOffre();
  }

  function gardeClicCartes(){
    if(_gardePosee) return;
    _gardePosee=true;
    chargerCoursFermes();            /* la liste au plus tôt : c'est elle qui tranche */
    /* 🔴 En phase de CAPTURE, et sur le document : les liens sont à l'intérieur
       des cartes et LearnWorlds pose ses propres gestionnaires dessus. Attendre
       le bouillonnement, c'est arriver après le début de la navigation. */
    document.addEventListener("click", function(e){
      if(!modeVerrou()) return;
      var t=e.target;
      var c=(t && t.closest) ? t.closest(".lw-course-card") : null;
      if(!c) return;

      var verdict=carteVerrouillee(c);
      if(verdict===false) return;                          /* cours ouvert : on ne touche à rien */

      var lien=c.querySelector('a[href*="courseid="],a[href*="/course/"]');
      var cible=lien ? lien.getAttribute("href") : "";
      e.preventDefault(); e.stopPropagation();

      if(verdict===true){ reagirVerrou(c); return; }
      attendreListe(function(){
        if(carteVerrouillee(c)===true){ reagirVerrou(c); return; }
        if(cible) location.href=cible;
      });
    }, true);
  }

  /* Le PEINTRE. Il ne décide plus rien sur le clic — `gardeClicCartes()` s'en
     charge depuis t=0 — il ne fait que rendre le verrou visible. */
  function verrouCartes(){
    if(!modeVerrou()) return;
    var cartes=document.querySelectorAll(".lw-course-card");
    if(!cartes.length) return;

    /* 🔴 RENDRE LE SILENCE AUDIBLE. Si la page porte des cartes et qu'AUCUNE
       n'est reconnue comme fermée, ou bien tout est réellement ouvert, ou bien
       LearnWorlds a reformulé sa mention et le cadenas vient de s'éteindre
       partout sans prévenir. On ne peut pas trancher d'ici, mais on peut le
       dire — c'est ce qui manquait à l'opt-in de l'annuaire pendant des jours. */
    chargerCoursFermes();

    /* 🔴 UNE SEULE FONCTION DE DÉCISION, partagée avec le garde-clic.
       Le peintre avait sa propre copie de la règle — et c'est ainsi que le
       défaut de la page Cas est passé : la copie du garde a été corrigée, pas
       celle-ci, jusqu'à ce que la mesure les mette côte à côte. Deux endroits
       qui décident de la même chose finissent toujours par diverger. */
    var fermees = [].slice.call(cartes).filter(function(c){ return carteVerrouillee(c)===true; });
    if(!fermees.length){
      try{ console.warn("[PrepaStrat] Aucune carte « inscription fermée » reconnue sur "+
        location.pathname+" ("+cartes.length+" cartes). Soit tout est ouvert, soit le libellé "+
        "de LearnWorlds a changé et le cadenas ne s'applique plus."); }catch(e){}
      return;
    }

    cssVerrou();
    fermees.forEach(poserVerrou);
  }

  /* Dessine le cadenas sur UNE carte. Appelée par le peintre, et aussi par le
     garde-clic quand quelqu'un clique avant que la carte ait été traitée : dans
     ce cas le cadenas apparaît au moment du clic, ce qui vaut mieux qu'un clic
     qui ne produit rien de visible. */
  function poserVerrou(c){
      if(c.getAttribute("data-ps-verrou")) return;         /* idempotent */
      cssVerrou();
      c.setAttribute("data-ps-verrou","1");
      c.classList.add("ps-verrouille");

      var v=document.createElement("div");
      v.className="ps-verrou";
      /* 🔴 UNE seule ligne de texte. La version précédente en avait deux, qui
         se superposaient au titre de la carte. Le cadenas dit déjà « fermé » ;
         la pastille dit quoi faire. Le reste est du bruit. */
      /* 🔴 « S'abonner », pas « Ouvrir le catalogue » : Ziad l'a dit et il a
         raison, la seconde formule ne veut rien dire pour quelqu'un qui
         découvre le site. Le cadenas dit « fermé », la pastille dit ce qu'il
         faut faire — et elle doit le dire en mots de client, pas en mots de
         produit. */
      v.innerHTML="<i>"+SVG_CADENAS+"</i><b>S'abonner</b>";
      /* 🔴🔴 `display` POSÉ EN INLINE, ET C'EST INDISPENSABLE. Les scripts de
         page reconstruisent la carte et masquent tout enfant qui n'est pas à
         eux : `course-cards.js` a
         `#pageContent .lw-course-card > *:not(.ps-mcard):not(.learnworlds-image):not(.ps-mline){display:none !important}`.
         Mon cadenas tombait dans le lot — présent dans le DOM, invisible au
         survol, et rien ne le disait. Mesuré : `display:none`, taille 0×0.
         Surenchérir en spécificité serait un calcul à refaire pour chacun des
         cinq scripts de page, et à recasser au prochain `:not()` ajouté.
         L'inline `!important` bat n'importe quelle feuille — c'est le piège
         déjà noté le 25/07 sur les titres de widgets LearnWorlds.
         🔴 Seul `display` est forcé : `opacity` reste à la feuille, sinon
         l'apparition au survol ne pourrait plus s'animer. */
      /* 🔴🔴 LA POSITION AUSSI, ET C'EST LE MÊME PIÈGE QU'AVEC `display`.
         Signalé par Ziad : sur Fiches secteur, les cartes GRANDISSAIENT.
         Mesuré — une sonde neuve portant la classe `ps-verrou` calculait
         `position:relative` alors que ma feuille dit `absolute` : une règle de
         `sector-cards.js`, plus spécifique et en `!important`, l'écrasait. Mon
         overlay redevenait donc un bloc DANS LE FLUX (315×149) et poussait le
         contenu vers le bas.
         Je ne refais pas l'archéologie de spécificité pour chacun des cinq
         scripts de page — et je ne veux pas d'un correctif à recasser au
         prochain sélecteur ajouté. L'inline gagne toujours.
         🔴 `inset` posé propriété par propriété : la forme courte n'est pas
         reconnue par `setProperty` dans tous les navigateurs. */
      v.style.setProperty("display","flex","important");
      v.style.setProperty("position","absolute","important");
      ["top","right","bottom","left"].forEach(function(p){
        v.style.setProperty(p,"0","important");
      });
      c.appendChild(v);
      /* 🔴 PLUS D'ÉCOUTEUR PAR CARTE ICI. Il y en avait un, et c'était le bug :
         il n'existait qu'une fois la carte peinte ET traitée. Le garde est
         maintenant unique, sur le document, posé dès le chargement du fichier. */
  }

  /* ════════════════════════════════════════════════════════════════════════
     FICHE D'ANNUAIRE : UN ÉCRAN PAR QUESTION  (05/08)
     ────────────────────────────────────────────────────────────────────────
     Le rappel en coin (`rappelProfil`) renvoyait vers `/profile` pour compléter
     sa fiche. 🔴 Mesuré ce jour : le bouton « Edit profile » de `/profile` mène
     à `/account`, et `/account` ne contient AUCUN des six champs. **Le membre
     n'avait donc aucun chemin praticable** — ce qui explique très bien les 13
     comptes sur 17 sans réponse à l'opt-in. La popup n'est pas un confort,
     c'est le seul chemin.

     🔴 À QUI ON LA MONTRE. Ziad : « validé, et il a acheté OU a été ajouté par
     l'école ». Or `me` n'expose aucun signal de vérification d'e-mail (mesuré le
     04/08), et aucune liste de cours (70 clés listées le 05/08) — « au moins un
     cours fermé » n'est donc PAS calculable depuis une page. Les deux branches
     se rejoignent sur le seul fait observable : un accès en place.
     ⇒ `userLearningPrograms.length > 0` OU `isPaying`.
     ⚠️ `isPaying` ne veut PAS dire « a payé » : sur le compte de Ziad il vaut
     `true` alors que `/account` affiche « aucun paiement effectué ». On ignore
     ce qu'il mesure exactement ; il ne fait qu'élargir, jamais restreindre.

     🔴 NOYAU COURT, PUIS LE RESTE. Quatre questions (~40 s) suffisent à publier
     une fiche utile ; on propose ensuite de compléter. Un abandon après le
     noyau est un succès partiel, pas un échec — c'est toute la différence avec
     un formulaire de sept écrans qu'on quitte au troisième.

     🔴 UN SEUL ENREGISTREMENT, à la fin OU à la fermeture s'il y a des réponses.
     Le Worker exige un jeton Turnstile par requête, à USAGE UNIQUE : sauver à
     chaque écran en consommerait sept. Et fermer en route ne doit pas jeter ce
     qui a été saisi.

     🔴 LES VALEURS SONT CELLES DE LEARNWORLDS, AU CARACTÈRE PRÈS. Les libellés
     d'opt-in viennent de Ziad ; les quatre listes ont été relevées sur les
     facettes RÉELLES de l'annuaire en production le 05/08. Une majuscule qui
     diffère et l'annuaire affiche deux pastilles pour la même valeur (défaut
     déjà corrigé le 24/07, `91d7d47`) — ou, pour l'opt-in, le membre
     n'apparaît pas du tout.
     ════════════════════════════════════════════════════════════════════════ */
  var FICHE_ENDPOINT="https://annuaire-prepastrat.ziedbencheikh.workers.dev/profil";
  var FICHE_CLE="psFicheVue";
  var FICHE_JOURS=14;

  var OPTIN_OUI="Oui, afficher ma fiche";
  var OPTIN_NON="Non, je préfère rester discret";

  /* 🔴 `noyau:true` = posé avant la publication. Le reste vient après, et on
     peut s'arrêter là sans rien perdre. */
  var FICHE_ECRANS=[
    { cle:"cf_annuaire", type:"choix", vis:"annuaire", noyau:true,
      q:"Rejoignez l'annuaire des étudiants",
      sous:"Trouvez un partenaire pour vous entraîner aux études de cas — et laissez les autres vous trouver. Vous pouvez changer d'avis à tout moment.",
      /* Le « Oui » d'abord : dans LearnWorlds le champ liste le refus en
         premier, et on ne met pas le refus en tête d'une question qu'on pose.
         Les CHAÎNES, elles, sont identiques au caractère près. */
      options:[OPTIN_OUI, OPTIN_NON] },
    { cle:"cf_ecole", type:"choix", vis:"ecole", noyau:true, q:"Dans quelle école êtes-vous ?",
      sous:"Les autres pourront filtrer par école.",
      options:["HEC Paris","ESSEC","ESCP","EM Lyon","EDHEC","SKEMA","Audencia","NEOMA","Grenoble EM",
               "Polytechnique (X)","CentraleSupélec","Mines Paris","Ponts ParisTech","Télécom Paris",
               "ENSAE","Arts et Métiers","Dauphine","Sciences Po Paris","ENS","Autre"] },
    { cle:"cf_niveau", type:"choix", vis:"niveau", noyau:true, q:"Où en êtes-vous dans votre préparation ?",
      sous:"Pour qu'on vous propose des partenaires à votre niveau.",
      options:["Débutant","Avancé","Expert"] },
    { cle:"cf_recherche", type:"choix", vis:"cible", noyau:true, q:"Que cherchez-vous ?",
      options:["Stage","CDI Junior","CDI expérimenté"] },
    { cle:"cf_langue", type:"multi", vis:"langue", q:"Dans quelle langue voulez-vous vous entraîner ?",
      sous:"Plusieurs réponses possibles.", options:["Français","Anglais"] },
    { cle:"bio", type:"long", vis:"plume", q:"Deux lignes sur vous",
      sous:"Ce que vous préparez, d'où vous venez, ce qui vous motive.", max:280,
      placeholder:"En M1 à l'ESSEC, je vise le conseil en stratégie après une prépa HEC…" },
    { cle:"cf_contact", type:"texte", vis:"contact", q:"Comment peut-on vous joindre ?",
      sous:"E-mail, LinkedIn, WhatsApp, Calendly — ce que vous acceptez de partager. C'est ce qui fait apparaître le bouton « Contacter » sur votre fiche.",
      placeholder:"prenom.nom@exemple.fr" }
  ];

  function ficheAcces(u){
    if(!u) return false;
    if((u.userLearningPrograms||[]).length>0) return true;
    return u.isPaying===true;
  }

  function fichePeutSAfficher(){
    var u=membrePS();
    if(!u || !ficheAcces(u)) return null;
    if(PAGES_MUETTES.test(location.pathname||"")) return null;
    if(document.getElementById("ps-fiche")) return null;
    try{
      var jusqua=Number(localStorage.getItem(FICHE_CLE+":"+(u.id||"?"))||0);
      if(jusqua && Date.now()<jusqua) return null;
    }catch(e){}
    /* Même juge que le rappel en coin : opt-in refusé ⇒ on n'insiste jamais,
       fiche complète ⇒ rien à demander. */
    var etat=etatProfil(ficheChamps(u));
    return etat.afficher ? u : null;
  }

  /* 🔴🔴 `me.custom_fields` N'EST PAS FIABLE HORS `/profile` — mesuré le 05/08
     sur UN SEUL compte, ce qui lève l'ambiguïté d'une première tentative où
     j'avais comparé deux comptes différents et conclu trop vite : sur une page
     catalogue, `cf_annuaire` ressortait VIDE alors que le Worker, qui lit l'API
     d'administration, voyait ce même membre inscrit à l'annuaire.
     ⇒ Sans ce correctif, un membre à la fiche COMPLÈTE aurait vu la popup
     s'ouvrir sur chaque page catalogue : on aurait harcelé exactement ceux qui
     avaient déjà fait ce qu'on leur demandait.
     🟢 Les TAGS, eux, sont garnis partout : LearnWorlds fabrique
     `cf_<champ>_<valeur>` pour chaque champ rempli (pépite du 29/07). Ils ne
     disent pas la valeur exacte d'un texte libre, mais ils disent qu'il est
     REMPLI — c'est tout ce dont `etatProfil` a besoin. */
  function ficheChamps(u){
    var cf={}, k;
    var src=u.custom_fields||{};
    for(k in src) if(Object.prototype.hasOwnProperty.call(src,k)) cf[k]=src[k];
    [].slice.call(u.tags||[]).forEach(function(t){
      var s=String(typeof t==="string" ? t : (t && t.name) || "");
      if(s.indexOf("cf_")!==0) return;
      /* `cf_<champ>_<valeur>` : le champ est le segment AVANT le premier `_`
         qui suit `cf_`. On ne remplace jamais une valeur déjà connue — le
         champ réel fait foi quand il est là. */
      var reste=s.slice(3), i=reste.indexOf("_");
      if(i<=0) return;
      var cle="cf_"+reste.slice(0,i), val=reste.slice(i+1);
      if(!cf[cle] && val) cf[cle]=val;
    });
    return cf;
  }

  function ficheCSS(){
    if(document.getElementById("ps-fiche-css")) return;
    var st=document.createElement("style"); st.id="ps-fiche-css";
    st.textContent=
      "#ps-fiche{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.55);"+
      "display:flex;align-items:center;justify-content:center;padding:20px;"+
      "font-family:var(--ps-font,Figtree,sans-serif)}"+
      "#ps-fiche .pf{width:min(520px,100%);background:#fff;border-radius:var(--ps-r-card,18px);"+
      "box-shadow:0 24px 70px rgba(15,23,42,.28);overflow:hidden;position:relative}"+
      /* Progression par SEGMENTS : on voit ce qu'il RESTE, pas seulement ce qui
         est fait — c'est ce qui donne envie de finir. */
      "#ps-fiche .pf-prog{display:flex;gap:4px;padding:14px 20px 0}"+
      "#ps-fiche .pf-prog i{flex:1;height:4px;border-radius:2px;background:#E9EDF3;transition:background .35s}"+
      "#ps-fiche .pf-prog i.on{background:var(--ps-accent,#3887b4)}"+
      /* 🔴🔴 `z-index` INDISPENSABLE, ET J'AI DÛ LE MESURER POUR LE VOIR.
         Signalé par Ziad : « le bouton fermer ne fonctionne pas ». Il
         fonctionnait — `x.click()` fermait bien la popup — mais il était
         RECOUVERT : `elementFromPoint` au centre de la croix renvoyait
         `.pf-e`, le panneau d'écran. Cause : l'animation d'entrée `pf-in`
         applique un `transform` à `.pf-e`, ce qui crée un contexte
         d'empilement ; venant APRÈS la croix dans le DOM, il passe devant un
         élément positionné sans `z-index`.
         🔴 La leçon : « positionné » ne suffit pas à être au-dessus dès qu'un
         voisin porte une transformation — et une animation en est une. Un
         bouton qui répond au clic programmatique mais pas à la souris, c'est
         toujours un problème de recouvrement, jamais de gestionnaire. */
      "#ps-fiche .pf-x{position:absolute;top:12px;right:12px;z-index:3;width:30px;height:30px;border:0;"+
      "background:transparent;color:#b9c3d6;cursor:pointer;border-radius:50%;font-size:19px;line-height:1}"+
      "#ps-fiche .pf-x:hover{background:#F3F5F9;color:var(--ps-text-soft,#676879)}"+
      "#ps-fiche .pf-e{padding:22px 30px 26px;text-align:center;animation:pf-in .26s ease both}"+
      "@keyframes pf-in{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:none}}"+
      "#ps-fiche .pf-vis{height:126px;display:flex;align-items:center;justify-content:center}"+
      "#ps-fiche .pf-vis svg{width:114px;height:114px;overflow:visible}"+
      "#ps-fiche h3{margin:0 0 6px;font:800 21px/1.28 var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26)}"+
      "#ps-fiche .pf-sous{margin:0 0 18px;font:400 13.5px/1.5 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879)}"+
      "#ps-fiche .pf-choix{display:flex;flex-wrap:wrap;gap:9px;justify-content:center}"+
      "#ps-fiche .pf-choix button{border:1.5px solid var(--ps-border,#E6E9EF);background:#fff;"+
      "color:var(--ps-text,#1c1f26);border-radius:var(--ps-r-pill,999px);padding:10px 17px;"+
      "font:600 14px var(--ps-font,Figtree,sans-serif);cursor:pointer;transition:transform .12s,border-color .18s,background .18s}"+
      "#ps-fiche .pf-choix button:hover{border-color:var(--ps-accent,#3887b4);transform:translateY(-1px)}"+
      "#ps-fiche .pf-choix button.on{background:var(--ps-accent,#3887b4);border-color:var(--ps-accent,#3887b4);color:#fff}"+
      "#ps-fiche .pf-champ{width:100%;box-sizing:border-box;border:1.5px solid var(--ps-border,#E6E9EF);"+
      "border-radius:var(--ps-r-btn,12px);padding:12px 14px;font:400 14.5px var(--ps-font,Figtree,sans-serif);"+
      "color:var(--ps-text,#1c1f26);outline:none}"+
      "#ps-fiche .pf-champ:focus{border-color:var(--ps-accent,#3887b4);box-shadow:0 0 0 3px rgba(56,135,180,.14)}"+
      "#ps-fiche textarea.pf-champ{min-height:92px;resize:vertical}"+
      "#ps-fiche .pf-cpt{font:500 11.5px var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);text-align:right;margin-top:6px}"+
      "#ps-fiche .pf-pied{display:flex;align-items:center;justify-content:space-between;gap:12px;"+
      "padding:14px 22px;border-top:1px solid var(--ps-border,#E6E9EF);background:#FAFBFD}"+
      "#ps-fiche .pf-lien{border:0;background:transparent;color:var(--ps-text-soft,#676879);"+
      "font:600 13px var(--ps-font,Figtree,sans-serif);cursor:pointer}"+
      "#ps-fiche .pf-lien:hover{color:var(--ps-text,#1c1f26)}"+
      "#ps-fiche .pf-ok{background:var(--ps-accent,#3887b4);color:#fff;border:0;border-radius:var(--ps-r-btn,12px);"+
      "padding:11px 22px;font:800 14px var(--ps-font,Figtree,sans-serif);cursor:pointer}"+
      "#ps-fiche .pf-ok:hover{background:var(--ps-accent-hover,#203866)}"+
      "#ps-fiche .pf-carte{border:1px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-card,18px);"+
      "padding:18px;text-align:left;display:flex;gap:14px;align-items:flex-start}"+
      "#ps-fiche .pf-av{width:52px;height:52px;border-radius:50%;background:var(--ps-accent,#3887b4);color:#fff;"+
      "flex:none;display:flex;align-items:center;justify-content:center;font:800 18px var(--ps-font,Figtree,sans-serif)}"+
      "#ps-fiche .pf-nom{font:800 15.5px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26)}"+
      "#ps-fiche .pf-meta{font:500 12.5px var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);margin-top:2px}"+
      "#ps-fiche .pf-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}"+
      "#ps-fiche .pf-tags span{background:#EEF4FA;color:var(--ps-accent,#3887b4);border-radius:var(--ps-r-pill,999px);"+
      "padding:4px 10px;font:700 11.5px var(--ps-font,Figtree,sans-serif)}"+
      "#ps-fiche .pf-bio{font:400 12.5px/1.45 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);margin-top:9px}"+
      "@keyframes pf-trace{to{stroke-dashoffset:0}}"+
      "@keyframes pf-flotte{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}"+
      "#ps-fiche .tr{stroke-dasharray:var(--l,300);stroke-dashoffset:var(--l,300);animation:pf-trace 1.1s ease forwards}"+
      "#ps-fiche .fl{animation:pf-flotte 3.2s ease-in-out infinite}"+
      /* 🔴 Même règle que partout ailleurs dans ce fichier. */
      "@media(prefers-reduced-motion:reduce){#ps-fiche .pf-e,#ps-fiche .tr,#ps-fiche .fl"+
      "{animation:none !important;stroke-dashoffset:0 !important}}";
    (document.head||document.documentElement).appendChild(st);
  }

  var FICHE_VIS=(function(){
    var A="var(--ps-accent,#3887b4)";
    function s(inner){ return '<svg viewBox="0 0 120 120" fill="none" stroke="'+A+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>'; }
    return {
      annuaire:s('<g class="fl"><circle cx="42" cy="46" r="15" class="tr" style="--l:100"/><path d="M18 92c0-14 11-24 24-24s24 10 24 24" class="tr" style="--l:120"/><circle cx="84" cy="56" r="11" class="tr" style="--l:80" opacity=".55"/><path d="M66 92c0-11 8-19 18-19s18 8 18 19" class="tr" style="--l:100" opacity=".55"/></g>'),
      ecole:s('<g class="fl"><path d="M60 24 18 46l42 22 42-22-42-22Z" class="tr" style="--l:200"/><path d="M34 56v26c0 8 12 14 26 14s26-6 26-14V56" class="tr" style="--l:150"/><path d="M102 46v26" class="tr" style="--l:30"/></g>'),
      niveau:s('<g><path d="M20 96h22V70H20z" class="tr" style="--l:90"/><path d="M49 96h22V50H49z" class="tr" style="--l:120"/><path d="M78 96h22V28H78z" class="tr" style="--l:160"/><circle cx="89" cy="18" r="5" fill="'+A+'" stroke="none"/></g>'),
      cible:s('<g class="fl"><circle cx="60" cy="60" r="34" class="tr" style="--l:220"/><circle cx="60" cy="60" r="20" class="tr" style="--l:130"/><circle cx="60" cy="60" r="6" fill="'+A+'" stroke="none"/><path d="M88 32 60 60" class="tr" style="--l:60"/></g>'),
      langue:s('<g class="fl"><path d="M20 34h48a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H40l-14 12V72h-6a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8Z" class="tr" style="--l:230"/><path d="M92 52h8a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8h-4v10l-12-10H76" class="tr" style="--l:150" opacity=".55"/></g>'),
      plume:s('<g class="fl"><path d="M26 94c0-30 22-56 52-62 6-1 10 3 9 9-6 30-32 52-61 53Z" class="tr" style="--l:230"/><path d="M26 94 60 60" class="tr" style="--l:60"/></g>'),
      contact:s('<g class="fl"><rect x="20" y="36" width="80" height="52" rx="8" class="tr" style="--l:270"/><path d="m20 44 40 26 40-26" class="tr" style="--l:110"/></g>'),
      fini:s('<g><circle cx="60" cy="60" r="36" class="tr" style="--l:230"/><path d="m44 61 12 12 22-26" class="tr" style="--l:70"/></g>')
    };
  })();

  function ficheReporter(u){
    try{ localStorage.setItem(FICHE_CLE+":"+(u.id||"?"), String(Date.now()+FICHE_JOURS*864e5)); }catch(e){}
  }

  /* ── Envoi. Un jeton Turnstile par requête, à usage unique : on n'envoie donc
     que sur les vrais points de sortie (publication du noyau, fin, fermeture),
     et jamais deux fois la même chose — la signature évite un second jeton pour
     rien. */
  var _ficheSig="", _ficheEnVol=false, _ficheTsEl=null, _ficheRendu=false, _ficheAttente=null;
  /* Refus MOTIVÉ du Worker (adresse non validée) + moyen de repeindre la popup
     ouverte. Les deux vivent ici, et pas dans la closure de `ficheOuvrir` : la
     réponse arrive après, parfois alors que la popup a déjà changé d'écran. */
  var _ficheRefus="", _ficheRendre=null;

  function fichePayload(u, rep){
    var champs={};
    Object.keys(rep).forEach(function(k){
      var v=rep[k];
      if(Array.isArray(v)) v=v.join(", ");
      v=String(v==null?"":v).trim();
      if(v) champs[k]=v;
    });
    return { uid:String(u.id||""), email:String(u.email||""), champs:champs };
  }

  function ficheEnvoyer(u, rep, fini){
    var charge=fichePayload(u, rep);
    if(!Object.keys(charge.champs).length) return;
    var sig=JSON.stringify(charge.champs);
    if(sig===_ficheSig || _ficheEnVol) return;
    _ficheAttente={charge:charge, sig:sig, fini:fini};
    ficheTurnstile();
  }

  function ficheEnvoyerAvecJeton(jeton){
    var a=_ficheAttente; if(!a) return;
    _ficheEnVol=true;
    fetch(FICHE_ENDPOINT,{
      method:"POST",
      headers:{"Content-Type":"application/json","X-Turnstile-Token":jeton},
      body:JSON.stringify(a.charge)
    })
      /* 🔴🔴 ON LIT LE CORPS MÊME QUAND LA RÉPONSE N'EST PAS `ok`. Avant, un
         `r.ok ? r.json() : null` transformait tout refus en SILENCE : l'étudiant
         remplissait le formulaire, validait, et il ne se passait rien — pas même
         un message. Or le Worker refuse désormais d'écrire tant que l'adresse
         n'est pas validée (bug A) : ce refus est légitime, et il n'est utile que
         s'il est DIT. */
      .then(function(r){
        return r.json().catch(function(){ return null; })
          .then(function(j){ return {ok:r.ok, j:j}; });
      })
      .then(function(res){
        if(res.ok) return res.j;
        var j=res.j;
        if(j && j.detail==="verification_en_attente"){
          _ficheRefus = j.message || "Validez votre adresse e-mail pour publier votre fiche.";
          /* 🔴 On fige la signature : sans ça le collecteur retenterait en
             boucle un envoi que le Worker refusera à l'identique tant que
             l'adresse n'est pas validée. Ce n'est pas un échec transitoire. */
          _ficheSig = a.sig;
          if(_ficheRendre) try{ _ficheRendre(); }catch(e){}
          try{ document.dispatchEvent(new CustomEvent("ps:fiche-refusee",{detail:{raison:"verification_en_attente"}})); }catch(e){}
        }
        return null;
      })
      /* 🔴 On exige un ACCUSÉ de ce qu'on a envoyé, jamais un `ok` générique :
         c'est le piège du 30/07 (un Worker en retard répondait `ok:true` sans
         rien écrire, et le collecteur ne réessayait plus jamais). */
      .then(function(j){
        var pris=(j && j.ok && Array.isArray(j.ecrits)) ? j.ecrits.length : 0;
        if(pris>=Object.keys(a.charge.champs).length){
          _ficheSig=a.sig;
          /* 🔴🔴 ON MET À JOUR `me` ET ON PRÉVIENT LA PAGE. Signalé par Ziad :
             après avoir choisi « Non, je préfère rester discret », la carte
             continuait d'afficher « Visible ». L'écriture était pourtant bonne
             — mais `me.custom_fields` est une photo prise au chargement, et
             rien ne la rafraîchissait. La personne voyait donc l'inverse de ce
             qu'elle venait de décider, sur un sujet de confidentialité.
             ⇒ On recopie ce que le Worker a ACCEPTÉ (jamais ce qu'on a envoyé :
             c'est sa réponse qui fait foi) et on émet un événement pour que
             tout affichage dérivé se refasse, sans rechargement. */
          try{
            var u2=membrePS();
            if(u2){
              if(!u2.custom_fields) u2.custom_fields={};
              j.ecrits.forEach(function(k){ u2.custom_fields[k]=a.charge.champs[k]; });
            }
            document.dispatchEvent(new CustomEvent("ps:fiche-enregistree",{detail:{ecrits:j.ecrits}}));
          }catch(e){}
        }
        else try{ console.warn("[PrepaStrat] fiche : "+pris+" champ(s) enregistré(s) sur "+
          Object.keys(a.charge.champs).length+" envoyés — on retentera."); }catch(e){}
      })
      .catch(function(){})
      .then(function(){ _ficheEnVol=false; _ficheAttente=null; });
  }

  /* Widget hors écran, jamais `display:none` : caché ainsi il ne s'exécuterait
     pas. Le jeton de l'annuaire ou du dépôt a déjà servi — il nous faut le nôtre. */
  function ficheTurnstile(){
    if(!_ficheTsEl){
      _ficheTsEl=document.createElement("div");
      _ficheTsEl.style.cssText="position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;";
      (document.body||document.documentElement).appendChild(_ficheTsEl);
    }
    window.psFicheTsReady=function(){
      try{
        if(_ficheRendu){ window.turnstile.reset(_ficheTsEl); return; }
        window.turnstile.render(_ficheTsEl,{
          sitekey:DEP_SITEKEY,
          callback:ficheEnvoyerAvecJeton,
          "error-callback":function(){ _ficheEnVol=false; return true; },
          "expired-callback":function(){ try{ window.turnstile.reset(_ficheTsEl); }catch(e){} }
        });
        _ficheRendu=true;
      }catch(e){ _ficheEnVol=false; }
    };
    if(window.turnstile){ window.psFicheTsReady(); return; }
    if(document.getElementById("ps-fiche-ts")) return;
    var s=document.createElement("script");
    s.id="ps-fiche-ts";
    s.src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=psFicheTsReady&render=explicit";
    s.async=true; s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  /* ── Le formulaire lui-même ─────────────────────────────────────────────── */
  function ficheOuvrir(u){
    ficheCSS();
    var rep={}, i=0, NOYAU=4;
    var hote=document.createElement("div"); hote.id="ps-fiche";
    hote.setAttribute("role","dialog"); hote.setAttribute("aria-modal","true");
    document.body.appendChild(hote);

    function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }

    function fermer(enregistrer){
      if(enregistrer) ficheEnvoyer(u, rep, false);
      ficheReporter(u);
      if(hote.parentNode) hote.parentNode.removeChild(hote);
      document.removeEventListener("keydown", auClavier, true);
    }
    function auClavier(e){ if(e.key==="Escape"){ e.preventDefault(); fermer(true); } }
    document.addEventListener("keydown", auClavier, true);

    function carte(){
      var n=[u.firstName||u.first_name||"", u.lastName||u.last_name||""].filter(Boolean).join(" ")||u.username||"Vous";
      var ini=n.split(/\s+/).map(function(m){return m[0]||"";}).join("").slice(0,2).toUpperCase();
      var tags=[rep.cf_niveau, rep.cf_recherche].filter(Boolean);
      var meta=[rep.cf_ecole, (rep.cf_langue||[]).join(" · ")].filter(Boolean).join(" — ");
      return '<div class="pf-carte"><div class="pf-av">'+esc(ini)+'</div><div style="flex:1">'+
        '<div class="pf-nom">'+esc(n)+'</div>'+
        (meta?'<div class="pf-meta">'+esc(meta)+'</div>':'')+
        (tags.length?'<div class="pf-tags">'+tags.map(function(t){return '<span>'+esc(t)+'</span>';}).join("")+'</div>':'')+
        (rep.bio?'<div class="pf-bio">'+esc(rep.bio)+'</div>':'')+'</div></div>';
    }

    /* 🔴 La popup se laisse repeindre DE L'EXTÉRIEUR. Sans ça, une réponse du
       Worker arrivée après coup ne peut rien corriger à l'écran — et c'est
       exactement le défaut signalé par Ziad sur l'opt-in : la page affichait
       l'inverse de ce qui venait de se produire. */
    _ficheRendre = rendre;
    var _fermerOrig = fermer;
    fermer = function(enregistrer){ _ficheRendre = null; _fermerOrig(enregistrer); };

    function rendre(){
      var segs=""; for(var k=0;k<FICHE_ECRANS.length;k++) segs+='<i class="'+(k<i?"on":"")+'"></i>';
      var corps;

      /* 🔴🔴 LE WORKER A REFUSÉ — ET ON NE PEUT PAS LAISSER « VOTRE FICHE EST EN
         LIGNE » À L'ÉCRAN. Cet écran s'affiche AVANT la réponse du serveur : il
         annonce donc une publication qui n'a pas eu lieu. Un compte dont
         l'adresse n'est pas validée se voyait promettre une fiche publiée,
         alors que rien n'était écrit et que personne ne le lui disait.
         🔴 Le message vient du Worker, jamais d'ici : c'est lui qui sait
         pourquoi il refuse, et un texte recopié des deux côtés diverge. */
      /* 🔴 On REMPLIT `corps` et on laisse la suite faire son travail. Ma
         première version posait son propre `innerHTML` puis sortait par un
         `return` : elle sautait `brancher()`, deux lignes plus bas, et le
         bouton « J'ai compris » n'écoutait personne. L'écran s'affichait
         parfaitement et ne se fermait jamais. **Un chemin qui court-circuite la
         fin d'une fonction perd tout ce qu'elle faisait après.** */
      if(_ficheRefus){
        corps='<div class="pf-e"><div class="pf-vis">'+FICHE_VIS.fini+'</div>'+
          '<h3>Encore une étape</h3>'+
          '<p class="pf-sous">'+esc(_ficheRefus)+'</p></div>'+
          '<div class="pf-pied"><span class="pf-lien" style="cursor:default"></span>'+
          '<button class="pf-ok" data-a="fin">J\'ai compris</button></div>';
        hote.innerHTML='<div class="pf"><div class="pf-prog">'+segs+'</div>'+
          '<button class="pf-x" aria-label="Fermer">×</button>'+corps+'</div>';
        brancher();
        return;
      }

      /* 🔴 Refus de l'annuaire : on s'arrête là. Continuer à demander école,
         niveau et contact à quelqu'un qui vient de dire « je préfère rester
         discret » serait ne pas l'avoir écouté. */
      if(rep.cf_annuaire===OPTIN_NON){
        corps='<div class="pf-e"><div class="pf-vis">'+FICHE_VIS.fini+'</div>'+
          '<h3>C\'est noté</h3><p class="pf-sous">Votre fiche n\'apparaîtra pas dans l\'annuaire. '+
          'Vous pourrez changer d\'avis depuis votre profil.</p></div>'+
          '<div class="pf-pied"><span class="pf-lien" style="cursor:default"></span>'+
          '<button class="pf-ok" data-a="fin">Fermer</button></div>';
      } else if(i===NOYAU){
        corps='<div class="pf-e"><div class="pf-vis">'+FICHE_VIS.fini+'</div>'+
          '<h3>Votre fiche est en ligne</h3>'+
          '<p class="pf-sous">Voici ce que les autres étudiants verront. Trois questions de plus la rendent bien plus utile.</p>'+
          carte()+'</div>'+
          '<div class="pf-pied"><button class="pf-lien" data-a="fin">C\'est bon pour moi</button>'+
          '<button class="pf-ok" data-a="suite">Compléter (1 min)</button></div>';
      } else if(i>=FICHE_ECRANS.length){
        corps='<div class="pf-e"><div class="pf-vis">'+FICHE_VIS.fini+'</div>'+
          '<h3>Fiche complète, merci</h3>'+
          '<p class="pf-sous">Modifiable à tout moment depuis votre profil.</p>'+carte()+'</div>'+
          '<div class="pf-pied"><span class="pf-lien" style="cursor:default"></span>'+
          '<button class="pf-ok" data-a="fin">Fermer</button></div>';
      } else {
        var e=FICHE_ECRANS[i], champ="";
        if(e.type==="choix"||e.type==="multi"){
          champ='<div class="pf-choix">'+e.options.map(function(o){
            var on=e.type==="multi" ? (rep[e.cle]||[]).indexOf(o)>=0 : rep[e.cle]===o;
            return '<button type="button" data-o="'+esc(o)+'" class="'+(on?"on":"")+'">'+esc(o)+'</button>';
          }).join("")+'</div>';
        } else if(e.type==="long"){
          champ='<textarea class="pf-champ" maxlength="'+(e.max||280)+'" placeholder="'+esc(e.placeholder||"")+'">'+esc(rep[e.cle]||"")+'</textarea>'+
                '<div class="pf-cpt"><b>'+String(rep[e.cle]||"").length+'</b> / '+(e.max||280)+'</div>';
        } else {
          champ='<input class="pf-champ" type="text" placeholder="'+esc(e.placeholder||"")+'" value="'+esc(rep[e.cle]||"")+'">';
        }
        corps='<div class="pf-e"><div class="pf-vis">'+FICHE_VIS[e.vis]+'</div>'+
          '<h3>'+esc(e.q)+'</h3>'+(e.sous?'<p class="pf-sous">'+esc(e.sous)+'</p>':'')+champ+'</div>'+
          '<div class="pf-pied"><button class="pf-lien" data-a="passer">'+(i===0?"Plus tard":"Passer")+'</button>'+
          '<button class="pf-ok" data-a="suivant">'+(i===FICHE_ECRANS.length-1?"Terminer":"Continuer")+'</button></div>';
      }

      hote.innerHTML='<div class="pf"><div class="pf-prog">'+segs+'</div>'+
        '<button class="pf-x" aria-label="Fermer">×</button>'+corps+'</div>';
      brancher();
    }

    function brancher(){
      hote.querySelector(".pf-x").onclick=function(){ fermer(true); };
      hote.onclick=function(ev){ if(ev.target===hote) fermer(true); };   // clic hors carte
      var e=(i<FICHE_ECRANS.length && i!==NOYAU && rep.cf_annuaire!==OPTIN_NON) ? FICHE_ECRANS[i] : null;

      hote.querySelectorAll("[data-a]").forEach(function(b){
        b.onclick=function(){
          var a=b.getAttribute("data-a");
          if(a==="fin"){ fermer(true); return; }
          /* Publication du noyau : on enregistre AVANT de proposer la suite —
             celui qui ferme la fenêtre ici a déjà sa fiche. */
          if(a==="suite"){ ficheEnvoyer(u, rep, false); i++; rendre(); return; }
          if(a==="passer"||a==="suivant"){
            i++;
            if(i===NOYAU) ficheEnvoyer(u, rep, false);
            if(i>=FICHE_ECRANS.length) ficheEnvoyer(u, rep, true);
            rendre();
          }
        };
      });
      if(!e) return;

      hote.querySelectorAll(".pf-choix button").forEach(function(b){
        b.onclick=function(){
          var v=b.getAttribute("data-o");
          if(e.type==="multi"){
            var l=rep[e.cle]||[]; var j=l.indexOf(v);
            if(j>=0) l.splice(j,1); else l.push(v);
            rep[e.cle]=l; rendre();
          } else {
            rep[e.cle]=v;
            /* Choix unique : on avance seul. Un clic de plus par écran, c'est
               autant d'occasions d'abandonner. */
            setTimeout(function(){
              i++;
              if(i===NOYAU) ficheEnvoyer(u, rep, false);
              rendre();
            },190);
          }
        };
      });
      var champ=hote.querySelector(".pf-champ");
      if(champ){
        champ.oninput=function(){
          rep[e.cle]=champ.value;
          var c=hote.querySelector(".pf-cpt b"); if(c) c.textContent=champ.value.length;
        };
        champ.onkeydown=function(ev){
          if(ev.key==="Enter" && e.type!=="long"){ ev.preventDefault(); i++; if(i>=FICHE_ECRANS.length) ficheEnvoyer(u,rep,true); rendre(); }
        };
        try{ champ.focus(); }catch(_){}
      }
    }

    rendre();
  }

  function fichePopup(){
    var u=fichePeutSAfficher();
    if(u) ficheOuvrir(u);
  }

  /* Ouverture À LA DEMANDE, depuis une autre page. L'annuaire s'en sert quand il
     refuse l'accès : plutôt que de renvoyer vers `/profile` — où le membre ne
     trouve d'ailleurs pas ces champs (mesuré le 05/08) — on lui ouvre le
     formulaire sur place.
     🔴 `force` court-circuite la temporisation ET l'état : la personne vient de
     cliquer, elle n'a pas besoin qu'on juge si c'est le bon moment. Sans ça, un
     membre ayant reporté la popup la semaine dernière cliquerait sur un bouton
     qui ne fait rien. */
  window.PS_FICHE_OUVRIR=function(force){
    var u=membrePS();
    if(!u) return false;
    if(document.getElementById("ps-fiche")) return true;
    if(!force && !fichePeutSAfficher()) return false;
    ficheOuvrir(u);
    return true;
  };

  function orienterMembre(){
    var u=membrePS();
    if(!u || document.getElementById("ps-acces")) return;
    if(PAGES_MUETTES.test(location.pathname||"")) return;

    var part=null;
    try{ part=window.PS_PARTENAIRE_EMAIL ? window.PS_PARTENAIRE_EMAIL(u.email) : null; }catch(e){}
    var etat=orientation(u, part, (u.userLearningPrograms||[]).length);
    if(!etat.montrer) return;

    if(!document.getElementById("ps-acces-css")){
      var st=document.createElement("style"); st.id="ps-acces-css";
      st.textContent=
        /* 🔴 NI `position`, NI `z-index` — signalé par Ziad : le bandeau
           recouvrait le panneau du méga menu. `mega-menu.js` ne pose AUCUN
           z-index, il s'en remet à l'ordre naturel ; mon `position:relative`
           créait un contexte d'empilement et, venant après la barre dans le
           DOM, passait devant son panneau déroulant.
           Ce bandeau est un bloc dans le flux, il n'a rien à recouvrir. Le
           laisser statique suffit : un élément positionné (le panneau) repasse
           naturellement au-dessus d'un élément qui ne l'est pas. */
        "#ps-acces{display:flex;align-items:center;justify-content:center;"+
        "gap:16px;flex-wrap:wrap;padding:13px 22px;font-family:var(--ps-font,Figtree,sans-serif);"+
        "background:var(--ps-accent,#507EC5);color:#fff;}"+
        "#ps-acces.ps-acces-ecole{background:#E4F5EC;color:#1b5f41;border-bottom:1px solid #c6e7d5;}"+
        "#ps-acces p{margin:0;font:600 14px/1.45 var(--ps-font,Figtree,sans-serif);}"+
        "#ps-acces a.ps-acces-cta{background:#fff;color:var(--ps-accent,#507EC5);text-decoration:none;"+
        "border-radius:var(--ps-r-btn,10px);padding:9px 18px;font:800 13.5px var(--ps-font,Figtree,sans-serif);"+
        "white-space:nowrap;}"+
        "#ps-acces a.ps-acces-cta:hover{background:#eef3fb;}"+
        "#ps-acces.ps-acces-ecole a{color:#1b5f41;}"+
        "@media(max-width:640px){#ps-acces{padding:12px 14px;text-align:center}}";
      document.head.appendChild(st);
    }

    var b=document.createElement("div");
    b.id="ps-acces";
    var p=document.createElement("p");

    if(etat.mode==="ecole"){
      b.className="ps-acces-ecole";
      /* 🔴 Aucun bouton d'achat ici, volontairement. */
      p.textContent="Votre accès est pris en charge par "+(etat.ecole||"votre école")+
        ". S'il n'apparaît pas d'ici quelques minutes, écrivez-nous.";
      var a=document.createElement("a");
      a.href="mailto:contact@prepastrat.com"; a.textContent="Nous écrire";
      b.appendChild(p); b.appendChild(a);
    }else{
      p.textContent="Il vous reste une étape pour ouvrir le catalogue.";
      var cta=document.createElement("a");
      cta.className="ps-acces-cta";
      cta.href=window.PS_URL_OFFRE || URL_OFFRE_DEFAUT;
      cta.textContent="Voir les formules";
      b.appendChild(p); b.appendChild(cta);
    }

    /* 🔴 EN TÊTE DE `#pageContent`, MAIS APRÈS LA SECTION DE LA BARRE DE
       NAVIGATION — le header EST une section de `#pageContent`. Le piège est
       écrit dans nos notes depuis la refonte de la home, et je l'ai quand même
       reproduit une fois sur la page d'inscription. */
    var hote=document.getElementById("pageContent");
    if(!hote) return;
    var barre=hote.querySelector("nav.lw-topbar-menu, .lw-topbar, [class*='topbar']");
    var sectionBarre=barre && barre.closest("#pageContent > *");
    if(sectionBarre && sectionBarre.parentElement===hote) hote.insertBefore(b, sectionBarre.nextSibling);
    else hote.insertBefore(b, hote.firstChild);
  }

  /* 🔴 GARDE-FOU CONTRE LA DÉRIVE SILENCIEUSE. La table ci-dessus doit rester
     alignée sur les champs cochés « édition profil » dans LearnWorlds. Le jour
     où l'un est décoché, on réclamerait un champ introuvable. Sur /profile —
     la seule page où le formulaire existe — on compare et on le dit. Ça ne
     répare rien, mais ça transforme une dérive muette en dérive constatable. */
  function verifierChampsProfil(){
    if(!/^\/profile/.test(location.pathname||"")) return;
    var form=document.querySelectorAll('[name^="extralogin-cf_"]');
    if(!form.length) return;                       // formulaire pas encore rendu
    var presents={};
    [].slice.call(form).forEach(function(c){
      presents[(c.getAttribute("name")||"").replace("extralogin-","")]=1;
    });
    var u=membrePS(); if(!u) return;
    var reclames=CHAMPS_PROFIL.filter(function(c){ return c.cle in (u.custom_fields||{}); });
    var introuvables=reclames.filter(function(c){ return !presents[c.cle]; }).map(function(c){ return c.cle; });
    if(introuvables.length){
      try{ console.warn("[PrepaStrat] Le rappel de profil réclame des champs absents du formulaire /profile : "
        +introuvables.join(", ")+". Cocher leur « édition profil » dans LearnWorlds, ou les retirer de CHAMPS_PROFIL."); }catch(e){}
    }
  }

  cloak(); cloakFormules(); gardeClicCartes(); fantomes(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){ cloak(); cloakFormules(); gardeClicCartes(); fantomes(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader(); });
  /* Les boutons peuvent être rendus après nous (Site Builder progressif) :
     quelques relances pour attraper la classe active. */
  [300,800,1600].forEach(function(d){ setTimeout(heroBtns,d); setTimeout(playerBack,d); setTimeout(immersivePlayer,d); setTimeout(partnerHeader,d); });
  /* 🔴 Le contour se pose PLUS TARD que le reste : les cartes sont construites
     par les scripts de page, eux-mêmes en attente du rendu LearnWorlds (~5-8 s
     mesuré). Sortie immédiate si la page n'a pas le contour activé, donc ces
     relances ne coûtent rien aux autres pages. */
  [1000,3000,6000,10000].forEach(function(d){ setTimeout(contourPage,d); });
  /* 🔴 Mêmes délais que le contour, et pour la même raison : les cartes sont
     construites par les scripts de PAGE, eux-mêmes en attente du rendu
     LearnWorlds (~5 à 8 s mesuré). Poser le cadenas trop tôt n'en verrouillerait
     qu'une partie — et une carte non verrouillée au milieu d'un catalogue
     verrouillé, c'est une porte ouverte qui a l'air d'un bug. */
  [1000,3000,6000,10000,15000].forEach(function(d){ setTimeout(verrouCartes,d); });
  /* 🔴 Le rappel arrive APRÈS la page, jamais pendant. Il n'a aucune urgence
     et il est idempotent (`#ps-rappel` déjà posé ⇒ sortie immédiate) : deux
     relances suffisent à rattraper un `me` pas encore là, sans jamais voler
     l'attention au moment où la personne cherche son cours. */
  [1500,4000].forEach(function(d){ setTimeout(rappelProfil,d); });
  /* 🔴 La popup arrive APRÈS l'orientation et APRÈS le rappel dans le temps :
     elle prend le plein écran, donc elle ne doit jamais couper quelqu'un qui
     vient d'arriver et cherche encore où il est. Deux passages seulement — elle
     est idempotente (`#ps-fiche` déjà là ⇒ sortie), et `me.custom_fields` peut
     arriver après le premier rendu. */
  [3500,8000].forEach(function(d){ setTimeout(fichePopup,d); });
  /* 🔴 L'orientation passe AVANT le rappel de profil dans le temps : quelqu'un
     qui n'a pas encore d'accès n'a que faire de compléter sa fiche d'annuaire.
     Elle est aussi relancée plus longtemps — juste après une inscription,
     `me.userLearningPrograms` peut arriver après le premier rendu, et conclure
     trop tôt afficherait un paywall à quelqu'un qui vient d'obtenir son accès. */
  [900,2200,5000,9000].forEach(function(d){ setTimeout(orienterMembre,d); });
  [2500,6000].forEach(function(d){ setTimeout(verifierChampsProfil,d); });
  /* 🔴 Le dépôt est relancé PLUS TARD que le reste : les cartes du Site Builder
     n'apparaissent qu'au bout de plusieurs secondes (mesuré : ~5 à 8 s avant que
     le compte de barres se stabilise). Déposer trop tôt n'enverrait qu'une partie
     de la page — et la signature nous empêcherait de renvoyer le complément. */
  [4000,9000,15000].forEach(function(d){ setTimeout(depotProgression,d); });
  setTimeout(reveal, 3500);   // filet de sécurité anti-flash

  /* ====================================================================
     CHARGEMENT DU FOOTER REFAIT (footer.js)
     --------------------------------------------------------------------
     tokens.js est chargé sur TOUT le site ; le footer étant identique
     partout, on charge footer.js d'ici plutôt que d'ajouter un 2e include
     site-wide dans LearnWorlds (zéro admin : un git push suffit). Fichier
     séparé pour la lisibilité. Garde-fou par id -> jamais injecté 2 fois. */
  if(!document.getElementById("ps-footer-js")){
    var _fs=document.createElement("script");
    _fs.id="ps-footer-js";
    _fs.src="https://extremum84.github.io/lw-course-cards/footer.js";
    _fs.async=true;
    (document.head||document.documentElement).appendChild(_fs);
  }

  /* ====================================================================
     CHARGEMENT DU RESTYLE DU LECTEUR (player.js) — page /path-player
     --------------------------------------------------------------------
     Idem : chargé d'ici UNIQUEMENT sur le player → tout le CSS/JS du player
     (burger 3 traits, navigation, liste, DA marine/Figtree) est versionné dans
     le repo, plus rien dans le Code personnalisé de la page (3 loaders suffisent). */
  if((/\/path-player/.test(location.pathname) || (document.body && document.body.classList.contains("slug-path-player"))) && !document.getElementById("ps-player-js")){
    var _pl=document.createElement("script");
    _pl.id="ps-player-js";
    _pl.src="https://extremum84.github.io/lw-course-cards/player.js";
    _pl.async=true;
    (document.head||document.documentElement).appendChild(_pl);
  }

  /* ====================================================================
     CHARGEMENT DE LA PAGE D'ABONNEMENT (abonnement.js) — slug `abonnement`
     --------------------------------------------------------------------
     Même principe : Ziad crée la page dans LearnWorlds, et RIEN d'autre. Pas
     de code personnalisé à coller — ce qui évite le piège déjà payé avec
     `inscription.js`, dont le loader avait été posé dans un emplacement qui ne
     couvrait pas toutes les pages : le code était juste, et ne s'exécutait
     jamais, sans la moindre erreur en console.
     🔴 Le test porte sur le slug ET sur le chemin : la classe `slug-*` arrive
     avec le rendu de LearnWorlds, le chemin est disponible tout de suite. */
  if((/^\/formules(\/|$)/.test(location.pathname||"") ||
      (document.body && document.body.classList.contains("slug-formules"))) &&
     !document.getElementById("ps-abo-js")){
    var _ab=document.createElement("script");
    _ab.id="ps-abo-js";
    _ab.src="https://extremum84.github.io/lw-course-cards/abonnement.js";
    _ab.async=true;
    (document.head||document.documentElement).appendChild(_ab);
  }

  /* ====================================================================
     PAGE DE VÉRIFICATION D'E-MAIL (verification-page.js)
     --------------------------------------------------------------------
     Page servie juste après l'inscription. Elle affiche
     `{{user.email_to_verify}}` EN CLAIR — du code à la place de l'adresse, au
     moment précis où on demande à quelqu'un de nous faire confiance.

     🔴 ON NE MASQUE QUE L'ADRESSE, PAS LA PAGE. Sur `/formules` on masque tout
     jusqu'à reconstruction, parce que le contenu natif y est un bloc de
     réglages illisible : mieux vaut une page sobre. Ici c'est l'inverse — le
     contenu natif est une page correcte, seulement en anglais. Si
     `verification-page.js` ne chargeait jamais, la masquer donnerait un écran
     BLANC à quelqu'un qui attend une consigne, alors que la laisser donne une
     page anglaise qui fonctionne. On ne cache donc que le seul morceau qui ne
     doit jamais s'afficher : le littéral.
     🔴 `visibility`, pas `display` : la ligne garde sa place, donc pas de saut
     de mise en page quand l'adresse arrive.
     🔴 `span.bold` est UNIQUE dans cette section (mesuré le 05/08 : 1 seul, et
     le « spam folder » en gras est un `<strong>` dans un autre bloc). Le jour
     où un second apparaîtrait, le pire cas est un mot masqué 4 s — le filet
     ci-dessous le rend dans tous les cas, y compris si le script ne vient pas. */
  if(/email-verification-pending/.test(location.pathname||"") ||
     (document.body && document.body.classList.contains("slug-email-verification-pending"))){
    if(!document.getElementById("ps-verif-cloak")){
      var _vc=document.createElement("style");
      _vc.id="ps-verif-cloak";
      _vc.textContent="body.slug-email-verification-pending:not(.ps-verif-pret) #pageContent span.bold{visibility:hidden !important;}";
      var _vh=document.head||document.documentElement; _vh.insertBefore(_vc,_vh.firstChild);
      setTimeout(function(){
        if(document.body && !document.body.classList.contains("ps-verif-pret")){
          document.body.classList.add("ps-verif-pret");
          try{ console.warn("[PrepaStrat] /email-verification-pending : verification-page.js n'a rien fait "+
            "au bout de 6 s. La page reste en anglais avec le littéral {{user.email_to_verify}} visible. "+
            "Vérifier https://extremum84.github.io/lw-course-cards/verification-page.js"); }catch(e){}
        }
      },6000);
    }
    if(!document.getElementById("ps-verif-js")){
      var _vj=document.createElement("script");
      _vj.id="ps-verif-js";
      _vj.src="https://extremum84.github.io/lw-course-cards/verification-page.js";
      _vj.async=true;
      (document.head||document.documentElement).appendChild(_vj);
    }
  }
})();
