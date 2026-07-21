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
       `color:var(--ps-accent,#6161FF)`
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

     Pour changer/ajouter une page : une ligne dans PAGE_ACCENTS, c'est tout. */
  var PAGE_ACCENTS={
    "fiches-secteur":"#fad54a",        /* Secteurs — jaune */
    "emptykk-clone-clone":"#009e78",   /* Cas — vert */
    "fiches-secteur-clone":"#c51d4a"   /* Cabinets — rouge */
  };

  function _chan(hex){var h=hex.replace("#","");if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
  function _hex2hsl(hex){var c=_chan(hex),r=c[0]/255,g=c[1]/255,b=c[2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,H=0,L=(mx+mn)/2,S=d===0?0:d/(1-Math.abs(2*L-1));if(d!==0){if(mx===r)H=60*(((g-b)/d)%6);else if(mx===g)H=60*((b-r)/d+2);else H=60*((r-g)/d+4);}if(H<0)H+=360;return [H,S*100,L*100];}
  function _hsl2hex(hh,s,l){s/=100;l/=100;var a=s*Math.min(l,1-l);function f(n){var k=(n+hh/30)%12,c=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*c).toString(16).padStart(2,"0");}return "#"+f(0)+f(8)+f(4);}
  function _lum(hex){var c=_chan(hex).map(function(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2];}
  function _contraste(hex){return 1.05/(_lum(hex)+0.05);}

  /* hex de page -> {accent (texte, lisible), rgb (lueur, vive), hover, tint}.
     hover/tint : mêmes coefficients que deduire() du configurateur. */
  function _deriver(hex){
    var t=_hex2hsl(hex), accent=hex;
    if(t[2]>55){ var L=t[2]; while(L>10 && _contraste(_hsl2hex(t[0],t[1],L))<4) L-=1; accent=_hsl2hex(t[0],t[1],L); }
    var ta=_hex2hsl(accent);
    return {
      accent:accent,
      rgb:_chan(hex).join(","),                                    /* lueur = couleur VIVE d'origine */
      hover:_hsl2hex(ta[0], Math.max(0,ta[1]*0.71), Math.max(0,ta[2]-10.4)),
      tint:_hsl2hex(t[0], 100, 96.5)
    };
  }

  function accentPage(){
    if(!document.body) return;                                    /* body pas encore là (script en <head>) */
    var m=document.body.className.match(/slug-([a-z0-9-]+)/i);
    var hex=m ? PAGE_ACCENTS[m[1]] : null;
    var st=document.getElementById("ps-tokens-page");
    if(!hex){ if(st) st.textContent=""; return; }                 /* page non listée -> accent global */
    var d=_deriver(hex);
    var css=":root{--ps-accent:"+d.accent+";--ps-accent-rgb:"+d.rgb+";--ps-accent-hover:"+d.hover+";--ps-accent-tint:"+d.tint+";}";
    /* APRÈS ps-tokens dans le <head> : même spécificité (:root), l'ordre du DOM
       tranche -> l'override de page gagne sur les valeurs globales. */
    if(!st){ st=document.createElement("style"); st.id="ps-tokens-page"; document.head.appendChild(st); }
    if(st.textContent!==css) st.textContent=css;
  }

  poser(); accentPage();
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){ poser(); accentPage(); });
})();
