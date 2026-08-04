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
    "--ps-accent:#507EC5",
    "--ps-accent-rgb:80,126,197",
    "--ps-accent-hover:#486798",
    "--ps-accent-tint:#edf4ff",
    "--ps-text:#1c1f26",
    "--ps-text-soft:#676879",
    "--ps-surface-soft:#F7F8FB",
    "--ps-border:#E6E9EF",
    "--ps-cab-logo:#507EC5",
    "--ps-an-avatar:56px",
    "--ps-an-col:260px",
    "--ps-pf-ring:64px",
    "--ps-pf-bar:8px",
    "--ps-font:Figtree,-apple-system,Segoe UI,Roboto,sans-serif",
    "--ps-r-card:16px",
    "--ps-r-pill:999px",
    "--ps-r-btn:10px",
    "--ps-lvl1:var(--ps-accent-hover)",
    "--ps-lvl1-tint:var(--ps-accent-tint)",
    "--ps-lvl2:#12A85F",
    "--ps-lvl2-tint:#E6F9F0",
    "--ps-lvl3:#009257",
    "--ps-lvl3-tint:#E1F7EC",
    "--ps-lvl4:#D22B45",
    "--ps-lvl4-tint:#FDECEF",
    "--ps-lvl5:#D98500",
    "--ps-lvl5-tint:#FFF3E0",
    "--ps-lvl6:#8A45C9",
    "--ps-lvl6-tint:#F3EAFB",
    "--ps-f1:var(--ps-accent)",
    "--ps-f1-tint:var(--ps-accent-tint)",
    "--ps-f2:#00C875",
    "--ps-f2-tint:#E3F8EE",
    "--ps-f3:#E2445C",
    "--ps-f3-tint:#FDECEF",
    "--ps-f4:#FDAB3D",
    "--ps-f4-tint:#FFF3E0",
    "--ps-f5:#A25DDC",
    "--ps-f5-tint:#F3EAFB",
    "--ps-f6:#0073EA",
    "--ps-f6-tint:#E6F1FD"
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
    "formation-par-modules":"#12d380",
    "fiches-cabinet":"#47ce22",
    "fiches-secteur":"#fad54a",
    "etudes-cas":"#6b7280"
  };
  var PAGE_STYLE={
    "formation-par-modules":{"contour":1,"ep":4,"duree":1.1},
    "fiches-secteur":{"contour":1,"ep":4,"duree":1.1}
  };
  var REGLAGES={
    "lien_video":"https://player.vimeo.com/video/910833393?h=94064c722b",
    "lien_video_background":"https://player.vimeo.com/video/910833393?h=94064c722b"
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
    "bootcamp-prepastrat":"#D98500",
    "entretiens-en-conditions-reelles":"#8A45C9",
    "formation-par-modules":"#507EC5",
    "fiches-cabinet":"#00C875",
    "fiches-secteur":"#FDAB3D",
    "sentrainer":"#A25DDC",
    "etudes-cas":"#E2445C",
    "annuaire-partenaire-de-cas":"#0073EA"
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
  var LINE_SEL=".ps-ccab,.ps-scard,.ps-cc,.ps-pfc";   /* cartes des pages AUTRES que Cours */
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
  window.PS_TOKENS_V="2026-08-04-d";

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
  var _revObs=null;
  function watchReveal(){
    if(!document.body || document.body.classList.contains("ps-cards-ready")) return;
    if(document.querySelector(READY_SEL)){ reveal(); return; }
    if(_revObs) return;
    _revObs=new MutationObserver(function(){ if(document.querySelector(READY_SEL)){ reveal(); _revObs.disconnect(); } });
    _revObs.observe(document.documentElement,{childList:true,subtree:true});
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
      "#animatedModal .landing-form-input,#animatedModal .learnworlds-input,#animatedModal select.learnworlds-input{"+
        "font-family:var(--ps-font,Figtree,sans-serif) !important;font-size:14.5px !important;"+
        "background:#fff !important;border:1.5px solid var(--ps-border,#E6E9EF) !important;"+
        "border-radius:var(--ps-r-btn,10px) !important;height:46px !important;color:var(--ps-text,#1c1f26) !important;}",
      /* 🔴 Le focus reprend le bleu des FILTRES (#3887B4) et non l'accent : c'est le
         système de couleur des CONTRÔLES, celui du champ de recherche `.-search-box`.
         Les deux accents du design system ne se mélangent pas. */
      "#animatedModal .landing-form-input:focus,#animatedModal .learnworlds-input:focus{"+
        "border-color:#3887B4 !important;box-shadow:0 0 0 3px rgba(56,135,180,.15) !important;outline:0 !important;}",
      "#animatedModal .login-form-input-wrapper label,#animatedModal .landing-form-label{"+
        "font:600 12.5px var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text-soft,#676879) !important;}",
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
    var NATIFS={ first_name:1, last_name:1, email:1, password:1 };

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
          var c=w.querySelector("input,select,textarea");
          var nom=c ? String(c.name||"") : "";
          w.classList.add(nom && NATIFS[nom] ? "ps-e1" : "ps-e2");
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

    /* La modale est créée à l'ouverture et détruite à la fermeture : on ne peut
       pas agir une fois pour toutes. L'observer la rattrape à chaque apparition ;
       le garde `data-ps-etapes` empêche de la retravailler en boucle. */
    function scruter(){ deuxEcrans(document.getElementById("signUpForm")); }
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
        for(var j=0;j<p.domaines.length && !ok;j++){
          var d=p.domaines[j].toLowerCase();
          if(dom===d || (dom.length>d.length && dom.slice(-(d.length+1))==="."+d)) ok=true;
        }
        if(ok){ _part=p; break; }
      }
    }
    window.PS_PARTENAIRE=_part;    // home-page.js lit ça pour sa section d'accueil
    return _part;
  }

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

  cloak(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){ cloak(); poser(); accentPage(); heroBtns(); watchReveal(); playerBack(); immersivePlayer(); playerFlag(); partnerHeader(); });
  /* Les boutons peuvent être rendus après nous (Site Builder progressif) :
     quelques relances pour attraper la classe active. */
  [300,800,1600].forEach(function(d){ setTimeout(heroBtns,d); setTimeout(playerBack,d); setTimeout(immersivePlayer,d); setTimeout(partnerHeader,d); });
  /* 🔴 Le contour se pose PLUS TARD que le reste : les cartes sont construites
     par les scripts de page, eux-mêmes en attente du rendu LearnWorlds (~5-8 s
     mesuré). Sortie immédiate si la page n'a pas le contour activé, donc ces
     relances ne coûtent rien aux autres pages. */
  [1000,3000,6000,10000].forEach(function(d){ setTimeout(contourPage,d); });
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
})();
