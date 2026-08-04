/* ============================================================
   PAGE D'ENTRÉE — l'adresse e-mail décide du parcours
   ------------------------------------------------------------
   À charger dans le Code personnalisé du SITE, aux DEUX emplacements
   (connecté ET déconnecté) :
     <script src="https://extremum84.github.io/lw-course-cards/inscription.js"></script>

   🔴🔴 SURTOUT PAS DANS LE CODE PERSONNALISÉ DE LA PAGE. Mesuré le 04/08 : un
   visiteur non connecté ne reçoit AUCUN script de page — seulement ceux du site
   (`tokens.js`, `mega-menu.js`, `footer.js`, `account-page.js`). Or le public de
   cette page est exactement celui-là : des prospects sans compte. Chargée depuis
   la page, elle resterait blanche pour ceux à qui elle s'adresse.

   POURQUOI CETTE PAGE (Ziad, 04/08). Depuis que tout le catalogue est en
   inscription clôturée, un compte gratuit ne donne accès à RIEN — sauf pour un
   étudiant d'école partenaire, dont l'accès est ouvert par une automatisation sur
   le domaine de son adresse. Envoyer tout le monde sur le même formulaire n'a donc
   plus de sens : l'indépendant s'inscrit pour rien, et son compte se crée de toute
   façon pendant le paiement.
     domaine partenaire  -> inscription gratuite (le tag ouvrira l'accès)
     toute autre adresse -> page de l'offre, abonnement

   🔴🔴 CETTE PAGE ORIENTE, ELLE N'AUTORISE PAS. L'accès reste donné par le tag que
   LearnWorlds pose sur l'adresse VÉRIFIÉE à l'inscription. Quelqu'un qui
   contournerait cet aiguillage — en allant droit au formulaire — n'obtiendrait
   rien : pas de tag, pas de cours. C'est ce qui permet d'afficher ce tri sans
   créer de faille, et c'est pourquoi le champ déclaratif « école » avait été
   retiré du co-branding le 29/07.

   🔴 LA RÈGLE DE DOMAINE N'EST PAS ÉCRITE ICI. Elle vit dans `tokens.js`
   (`PS_PARTENAIRE_EMAIL`), qui porte déjà la table des écoles et sa comparaison
   avec sous-domaines. La recopier produirait deux règles vouées à diverger, et
   c'est un étudiant couvert qui paierait la divergence.
   ============================================================ */
(function(){
  "use strict";

  var SLUG="inscription";                    // body.slug-inscription
  /* 🔴 DIRECTEMENT LE PAIEMENT, pas la page du programme (Ziad, 04/08) : celui qui
     n'a pas d'adresse d'école a déjà choisi en arrivant ici, la page intermédiaire
     n'ajoute qu'un clic.
     🔴 SANS `packageId`. L'URL relevée sur le site en portait un
     (`package_1785851559453_285`), généré à la création du plan tarifaire : le
     figer ici, c'est un lien qui casse le jour où le tarif change — et il casserait
     à l'étape la plus chère du parcours. Vérifié : sans lui, la page affiche bien
     30 €/mois et charge Stripe. */
  var PAIEMENT="/payment?product_id=collection-abonnement&type=learning_program";
  var CLE_MAIL="psMailInscription";

  function slugCourant(){
    var b=document.body;
    var m=b && (b.className||"").match(/(?:^|\s)slug-([a-z0-9-]+)/i);
    if(m) return m[1];
    return (location.pathname||"").split("/").filter(Boolean).pop()||"";
  }

  /* 🔴 LES PICTOS VIENNENT DE `mega-menu.js` (`PS_MM_ICON`), PAS D'UN TROISIÈME JEU.
     Le fichier les publie déjà pour le configurateur ; les redessiner ici, c'est
     exactement ce qui a été trouvé le 04/08 dans les maquettes de cartes — un jeu
     dessiné à la main qui montrait autre chose que le site.
     🔴 La mise en page ne DÉPEND PAS d'eux : si `mega-menu.js` n'est pas encore
     exécuté, la ligne s'affiche sans picto plutôt que de casser. */
  function picto(cle){
    var I=window.PS_MM_ICON;
    return (I && I[cle]) ? I[cle] : "";
  }

  /* Bande des écoles partenaires, en bas de la colonne de droite.
     🔴 ELLE SE DÉRIVE DE `PS_PARTENAIRES`, jamais écrite à la main : la même table
     qui porte les domaines et le co-branding. Ajouter une école, c'est une entrée,
     et la bande suit.
     🔴🔴 UN LOGO EST UNE MARQUE DÉPOSÉE. Note du 29/07 : ne pas récupérer le logo
     sur le site de l'école, son usage se négocie dans le contrat. Tant que le champ
     `logo` est vide, on affiche le NOM en pastille — mention neutre, sans reproduire
     une identité visuelle qu'on n'a pas le droit d'afficher.
     🔴 Rien du tout s'il n'y a aucune école : une bande « ils nous font confiance »
     vide dit exactement le contraire de ce qu'elle cherche à dire. */
  function bandeEcoles(){
    var T=window.PS_PARTENAIRES;
    if(!T) return "";
    var items=[];
    for(var k in T){
      var p=T[k];
      if(!p || !p.nom) continue;
      items.push(p.logo
        ? '<img src="'+String(p.logo).replace(/"/g,"")+'" alt="'+String(p.nom).replace(/"/g,"")+'">'
        : '<span class="ps-i-eco-n">'+p.nom+'</span>');
    }
    if(!items.length) return "";
    return '<div class="ps-i-eco"><div class="ps-i-eco-t">Écoles partenaires</div>'+
           '<div class="ps-i-eco-l">'+items.join("")+'</div></div>';
  }

  /* ====================================================================
     LE CONTENU DE DROITE VIENT DU SITE BUILDER
     --------------------------------------------------------------------
     Demande de Ziad : pouvoir changer ces mots sans moi ni déploiement. Il les
     écrit dans une section normale du builder ; nous n'apportons que la mise en
     forme. Les mots lui appartiennent, la présentation nous appartient.

     🔴 IDENTIFICATION PAR POSITION, ET C'EST UNE LIMITE ASSUMÉE. On prend la
     première section de `#pageContent` qui n'est ni la barre de navigation, ni le
     pied de page, ni notre propre bloc. Repérer par le TEXTE serait pire — Weglot
     traduit ces libellés, et une table indexée dessus perdrait tout en anglais.
     ⏳ Le jour où cette page portera plusieurs sections, il faudra un marqueur.

     🔴🔴 L'APPARIEMENT NE SE FAIT QUE SI LA FORME EST EXACTE. Le builder produit
     un bloc de texte plat : huit lignes alternant intitulé et précision. Les
     apparier par leur RANG marche tant que le compte est bon — mais une ligne
     ajoutée décalerait tout, et chaque précision se retrouverait sous le mauvais
     intitulé, sans que rien ne le signale. C'est la panne silencieuse qu'on a
     payée trois fois cette semaine. Hors du compte attendu, on ne devine pas : on
     garde le texte tel quel, simplement mis à la charte. Mal rangé se voit ;
     faux ne se voit pas. */
  /* Le texte vient du Site Builder, donc d'une saisie humaine : il passe par
     `innerHTML`, il doit être échappé. Un `&` ou un chevron dans un libellé ne
     doit pas pouvoir devenir du balisage. */
  function esc(s){
    return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
      .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function lignesUtiles(bloc){
    var out=[];
    var w=document.createTreeWalker(bloc,NodeFilter.SHOW_TEXT);
    var n;
    while((n=w.nextNode())){
      var t=(n.nodeValue||"").replace(/\s+/g," ").trim();
      if(t) out.push(t);
    }
    return out;
  }

  function sectionDeZiad(){
    var pc=document.getElementById("pageContent");
    if(!pc) return null;
    var secs=[].slice.call(pc.querySelectorAll(":scope > section"));
    for(var i=0;i<secs.length;i++){
      var s=secs[i];
      if(s.querySelector("nav.lw-topbar-menu, .lw-topbar, [class*='topbar']")) continue;
      if(s.querySelector("[class*='footer']")) continue;
      if(s.contains(document.getElementById("ps-insc"))) continue;
      if(!lignesUtiles(s).length) continue;
      return s;
    }
    return null;
  }

  /* Contenu de la colonne de droite. 🔴 Écrit par moi faute de mieux, à faire
     valider : « 60 cours » est le nombre compté par l'API le 04/08, pas
     nécessairement celui que Ziad veut afficher. */
  var ARGUMENTS=[
    ["book",  "60 cours",                    "Du screening à l'intégration en MBB"],
    ["clip",  "Études de cas",               "Cas réels de cabinets, corrigés"],
    ["doc",   "Fiches cabinets et secteurs", "Pour arriver préparé en entretien"],
    ["users", "Annuaire de partenaires",     "Pour vous entraîner à deux"]
  ];

  var CSS=[
    /* 🔴 Le fond gris est porté par NOTRE bloc, pas par la page : peindre
       `#pageContent` toucherait aussi la section du header. */
    "#ps-insc{background:var(--ps-surface-soft,#F7F8FB);border-radius:var(--ps-r-card,16px);"+
      "padding:34px 28px;margin:0 auto 44px;max-width:1000px;font-family:var(--ps-font,Figtree,sans-serif);}",
    /* 🔴 `center` et non `start` : la colonne de droite est plus courte que le
       formulaire, elle restait collée en haut avec un vide sous elle. Demandé par
       Ziad. Sur une seule colonne (mobile), l'alignement n'a plus d'effet. */
    "#ps-insc .ps-i-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:30px;align-items:center;}",
    "#ps-insc .ps-i-form{background:#fff;border:1px solid var(--ps-border,#E6E9EF);"+
      "border-radius:var(--ps-r-card,16px);padding:26px 24px;}",
    "#ps-insc .ps-i-args{padding-top:6px;}",
    "#ps-insc .ps-i-args h3{font:800 19px/1.3 var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text,#1c1f26) !important;"+
      "letter-spacing:-.01em !important;margin:0 0 18px !important;}",
    "#ps-insc .ps-i-arg{display:flex;gap:11px;align-items:flex-start;margin-bottom:14px;}",
    "#ps-insc .ps-i-ic{width:26px;height:26px;border-radius:8px;background:var(--ps-accent-tint,#edf4ff);"+
      "color:var(--ps-accent,#507EC5);display:flex;align-items:center;justify-content:center;flex:none;}",
    "#ps-insc .ps-i-ic svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;}",
    "#ps-insc .ps-i-at{font:700 14px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);}",
    "#ps-insc .ps-i-as{font:400 12.5px/1.5 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);}",
    /* bande des écoles partenaires */
    "#ps-insc .ps-i-eco{margin-top:20px;padding-top:16px;border-top:1px solid var(--ps-border,#E6E9EF);}",
    "#ps-insc .ps-i-eco-t{font:800 10px var(--ps-font,Figtree,sans-serif);text-transform:uppercase;"+
      "letter-spacing:.07em;color:#9AA0B0;margin-bottom:10px;}",
    "#ps-insc .ps-i-eco-l{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;}",
    "#ps-insc .ps-i-eco-l img{max-height:26px;width:auto;opacity:.75;}",
    "#ps-insc .ps-i-eco-n{font:700 13px var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);"+
      "background:#fff;border:1px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-pill,999px);padding:5px 13px;}",
    "#ps-insc .ps-i-sur{font:800 10.5px var(--ps-font,Figtree,sans-serif);text-transform:uppercase;letter-spacing:.07em;color:var(--ps-text-soft,#676879);margin-bottom:10px;}",
    "#ps-insc h2.ps-i-t{font:800 25px/1.25 var(--ps-font,Figtree,sans-serif) !important;color:var(--ps-text,#1c1f26) !important;letter-spacing:-.02em !important;margin:0 !important;}",
    "#ps-insc .ps-i-d{font:400 14px/1.6 var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);margin:10px 0 20px;}",
    "#ps-insc label{display:block;font:600 12.5px/21px var(--ps-font,Figtree,sans-serif);color:var(--ps-text-soft,#676879);}",
    "#ps-insc input[type=email]{width:100%;box-sizing:border-box;height:46px;padding:0 14px;"+
      "border:1.5px solid var(--ps-border,#E6E9EF);border-radius:var(--ps-r-btn,10px);"+
      "font:400 14.5px var(--ps-font,Figtree,sans-serif);color:var(--ps-text,#1c1f26);background:#fff;}",
    "#ps-insc input[type=email]:focus{border-color:#3887B4;box-shadow:0 0 0 3px rgba(56,135,180,.15);outline:0;}",
    "#ps-insc .ps-i-go{width:100%;margin-top:14px;height:52px;border:0;cursor:pointer;"+
      "border-radius:var(--ps-r-btn,10px);background:var(--ps-accent,#507EC5);color:#fff;"+
      "font:700 15px var(--ps-font,Figtree,sans-serif);transition:background .18s;}",
    "#ps-insc .ps-i-go:hover{background:var(--ps-accent-hover,#486798);}",
    "#ps-insc .ps-i-err{display:none;margin-top:10px;font:600 13px var(--ps-font,Figtree,sans-serif);color:#C0392B;}",
    "#ps-insc .ps-i-aide{margin-top:14px;text-align:center;font:400 12.5px/1.6 var(--ps-font,Figtree,sans-serif);color:#9AA0B0;}",
    "#ps-insc .ps-i-aide a{color:var(--ps-accent,#507EC5);}"
  ].join("\n");

  function poserCSS(){
    if(document.getElementById("ps-insc-css")) return;
    var s=document.createElement("style"); s.id="ps-insc-css"; s.textContent=CSS;
    (document.head||document.documentElement).appendChild(s);
  }

  /* Ouvre la modale native d'inscription. 🔴 Même mécanique que `footer.js` : on
     clique le déclencheur `openformslink` de LearnWorlds plutôt que d'inventer une
     URL — il n'existe pas de page `/signup` (elle renvoie 404), c'est une modale. */
  /* 🔴🔴 DEUX CHEMINS, PARCE QUE LE PREMIER N'EXISTE PAS SUR CETTE PAGE.
     Mesuré : depuis que le bouton « Sign up » du menu pointe vers `/inscription`,
     il n'y a plus AUCUN déclencheur `openformslink[signup]` ici — seulement
     `signin`. Mon premier jet cliquait donc dans le vide et retombait sur un
     `location.href="/"` : l'étudiant ESSEC était éjecté sur l'accueil, sans un
     mot. Le pire des résultats, et invisible dans le code.
     Chemin de repli, vérifié en direct : ouvrir la modale de CONNEXION (son
     déclencheur, lui, existe) puis cliquer son lien « Créer un nouveau compte ».
     🔴 On ne se contente pas d'avoir cliqué : on vérifie que le formulaire
     d'inscription est RÉELLEMENT visible. Le même lien, depuis l'inscription,
     ramène vers la connexion — annoncer le succès sur la foi d'un clic ferait
     exactement l'inverse de ce qu'on veut. */
  function inscriptionVisible(){
    var f=document.getElementById("signUpForm");
    return !!f && getComputedStyle(f).display!=="none" && f.getBoundingClientRect().height>0;
  }

  function ouvrirInscription(apres){
    if(inscriptionVisible()){ apres(true); return; }
    var t=document.querySelector('a[data-interactive-link-type="openformslink"][data-interactive-link-var1="signup"]');
    if(t){ t.click(); setTimeout(function(){ apres(inscriptionVisible()); },600); return; }

    var s=document.querySelector('a[data-interactive-link-type="openformslink"][data-interactive-link-var1="signin"]');
    if(!s){ apres(false); return; }
    s.click();
    var n=0;
    (function bascule(){
      if(inscriptionVisible()){ apres(true); return; }
      var m=document.getElementById("animatedModal");
      var a=m && [].slice.call(m.querySelectorAll("a")).filter(function(e){
        return /compte|account/i.test(e.textContent||"") && e.getBoundingClientRect().height>0; })[0];
      if(a) a.click();
      if(++n<15) setTimeout(bascule,200); else apres(inscriptionVisible());
    })();
  }

  /* Pré-remplit l'adresse déjà saisie : la redemander juste après l'avoir tapée
     est le genre de détail qui fait abandonner. La modale est construite par le
     SPA, donc elle n'existe pas encore au moment du clic — d'où les relances. */
  function prefill(email){
    var essais=0;
    (function pousser(){
      var f=document.getElementById("signUpForm");
      var c=f && f.querySelector('input[name="email"]');
      if(c){ c.value=email; c.dispatchEvent(new Event("input",{bubbles:true})); return; }
      if(++essais<12) setTimeout(pousser,150);
    })();
  }

  function construire(){
    if(document.getElementById("ps-insc")) return true;
    var hote=document.getElementById("pageContent");
    if(!hote) return false;

    poserCSS();
    var box=document.createElement("div"); box.id="ps-insc";
    /* 🔴 SI ZIAD A POSÉ SON PROPRE BLOC, C'EST LE SIEN QUI GAGNE. Il colle un
       élément HTML `<div id="ps-insc-args">…</div>` dans le Site Builder et
       modifie les mots sans moi ni déploiement. On le DÉPLACE dans la colonne de
       droite plutôt que de le recopier : son contenu reste sa propriété, et il n'y
       a jamais deux versions du texte à tenir.
       Le repli n'est pas décoratif : sans lui, oublier le bloc — ou le renommer —
       laisserait une colonne vide sur la page d'entrée du site. */
    /* Le contenu de Ziad prime ; le nôtre n'est qu'un filet si la section a été
       supprimée ou vidée — une colonne vide sur la page d'entrée serait pire. */
    var sec=sectionDeZiad(), brut=null, titre="Tout le catalogue, un seul accès", args="";
    if(sec){
      var h=sec.querySelector("h1,h2,h3");
      var tt=h ? (h.innerText||"").replace(/\s+/g," ").trim() : "";
      var lignes=lignesUtiles(sec);
      if(tt){ titre=tt; if(lignes[0]===tt) lignes=lignes.slice(1); }
      if(lignes.length===8){
        var CLES=["book","clip","doc","users"];
        args=[0,1,2,3].map(function(k){
          return '<div class="ps-i-arg"><span class="ps-i-ic">'+picto(CLES[k])+'</span>'+
                 '<div><div class="ps-i-at">'+esc(lignes[k*2])+'</div>'+
                 '<div class="ps-i-as">'+esc(lignes[k*2+1])+'</div></div></div>';
        }).join("");
      } else {
        brut=sec;                                  /* forme inattendue : on ne devine pas */
      }
    } else {
      args=ARGUMENTS.map(function(a){
        return '<div class="ps-i-arg"><span class="ps-i-ic">'+picto(a[0])+'</span>'+
               '<div><div class="ps-i-at">'+a[1]+'</div><div class="ps-i-as">'+a[2]+'</div></div></div>';
      }).join("");
    }
    box.innerHTML=
      '<div class="ps-i-grid">'+
        '<div class="ps-i-form">'+
          '<div class="ps-i-sur">Créer votre compte</div>'+
          '<h2 class="ps-i-t">Commencez par votre e-mail</h2>'+
          '<p class="ps-i-d">Si votre école est partenaire, votre accès est déjà pris en charge.</p>'+
          '<label for="ps-i-mail">Votre adresse e-mail</label>'+
          '<input id="ps-i-mail" type="email" autocomplete="email" placeholder="prenom.nom@ecole.fr">'+
          '<div class="ps-i-err" id="ps-i-err"></div>'+
          '<button type="button" class="ps-i-go">Continuer</button>'+
          '<p class="ps-i-aide">Votre école est partenaire et on vous demande de payer&nbsp;? '+
            '<a href="mailto:contact@prepastrat.com">Écrivez-nous</a></p>'+
        '</div>'+
        '<div class="ps-i-args"><h3>'+esc(titre)+'</h3>'+args+'</div>'+
      '</div>';
    /* 🔴🔴 SURTOUT PAS `firstChild` — LE HEADER EST UNE SECTION DE `#pageContent`.
       C'est le piège déjà noté sur la home (« section 1 = topbar, section 2 = le
       vrai hero »), et je l'ai reproduit : inséré en première position, mon bloc
       poussait la barre de navigation SOUS lui. Ziad l'a vu tout de suite —
       « le header est bas ». En production, sur la page d'entrée du site.
       On insère donc APRÈS la section qui contient la barre de navigation, et à
       défaut on ajoute à la fin : dans les deux cas le header reste en tête. */
    var barre=hote.querySelector("nav.lw-topbar-menu, .lw-topbar, [class*='topbar']");
    var sectionBarre=barre && barre.closest("#pageContent > *");
    if(sectionBarre && sectionBarre.parentElement===hote) hote.insertBefore(box, sectionBarre.nextSibling);
    else hote.appendChild(box);

    /* 🔴 On MASQUE la section d'origine, on ne la supprime pas : le Site Builder
       la republie à chaque édition, et Ziad doit continuer de la voir et de la
       modifier dans l'éditeur. La supprimer ferait disparaître son texte de la
       page sans qu'il puisse le retrouver.
       Après l'insertion de `box`, sinon on déplacerait vers un conteneur absent
       du document. */
    if(sec){
      if(brut){ box.querySelector(".ps-i-args").appendChild(sec); }
      else { sec.style.display="none"; sec.setAttribute("data-ps-repris","1"); }
    }
    /* La bande d'écoles se pose APRÈS le contenu, qu'il soit de Ziad ou le nôtre. */
    var eco=bandeEcoles();
    if(eco) box.querySelector(".ps-i-args").insertAdjacentHTML("beforeend", eco);

    var champ=box.querySelector("#ps-i-mail"), err=box.querySelector("#ps-i-err");
    function router(){
      var v=String(champ.value||"").trim();
      /* Contrôle minimal : on ne valide pas l'adresse, LearnWorlds le fera. On
         vérifie seulement qu'il y a un domaine à lire, sinon l'aiguillage n'a
         rien à décider et enverrait tout le monde vers l'abonnement. */
      if(v.indexOf("@")<1 || v.indexOf(".",v.indexOf("@"))<0){
        err.textContent="Saisissez une adresse e-mail complète pour continuer.";
        err.style.display="block"; champ.focus(); return;
      }
      err.style.display="none";
      /* 🔴🔴 SANS LA RÈGLE, ON NE DÉCIDE PAS — ON NE DEVINE PAS.
         Le commentaire en tête de `demarrer()` annonçait cette protection, mais le
         code ne l'assurait pas : `PS_PARTENAIRE_EMAIL` absente donnait `p=null`,
         donc TOUT LE MONDE partait vers l'abonnement — y compris un étudiant
         ESSEC, à qui on aurait réclamé 30 €/mois pour un accès déjà payé par son
         école. Le pire résultat possible, produit par le chemin par défaut.
         Attrapé en testant la page : `tokens.js` était encore en cache et la règle
         manquait pour de vrai. Un repli silencieux vers le cas payant n'est jamais
         acceptable ; on le dit et on laisse réessayer. */
      if(typeof window.PS_PARTENAIRE_EMAIL!=="function"){
        err.textContent="La page finit de charger, réessayez dans un instant.";
        err.style.display="block";
        return;
      }
      var p=window.PS_PARTENAIRE_EMAIL(v);
      if(p){
        ouvrirInscription(function(ok){
          if(ok){ prefill(v); return; }
          /* 🔴 JAMAIS DE REDIRECTION MUETTE ICI. Envoyer cet étudiant vers
             l'abonnement serait lui réclamer un accès que son école paie déjà ;
             l'envoyer sur l'accueil, c'est le perdre sans explication. On lui dit
             ce qui se passe et on lui laisse la main. */
          err.textContent="Le formulaire n'a pas pu s'ouvrir. Utilisez « Sign in » en haut de page, puis « Créer un nouveau compte ».";
          err.style.display="block";
        });
        return;
      }
      /* On emporte l'adresse pour la reposer dans le tunnel : la retaper au moment
         de sortir sa carte est un abandon gratuit. `sessionStorage` et non l'URL —
         une adresse e-mail n'a rien à faire dans une barre d'adresse, ni dans les
         journaux du serveur. */
      try{ sessionStorage.setItem(CLE_MAIL, v); }catch(e){}
      location.href=PAIEMENT;
    }
    box.querySelector(".ps-i-go").addEventListener("click",router);
    champ.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); router(); } });
    return true;
  }

  /* 🔴 `tokens.js` peut être exécuté APRÈS ce fichier — l'ordre des balises dans
     le code du site ne dépend pas de nous. Sans attente, `PS_PARTENAIRE_EMAIL`
     serait absente et TOUT LE MONDE partirait vers l'abonnement, y compris les
     étudiants d'écoles partenaires. On construit quand même l'interface (elle ne
     dépend de rien), mais on ne laisse pas router avant que la règle soit là. */
  /* ====================================================================
     REPRISE DE L'ADRESSE DANS LE TUNNEL DE PAIEMENT
     --------------------------------------------------------------------
     🔴🔴 ON NE TOUCHE À RIEN D'AUTRE SUR CETTE PAGE. C'est le seul endroit du
     site où un bug coûte une vente. On ne remplit que le champ e-mail, et
     SEULEMENT s'il est vide : si la personne a déjà saisi ou corrigé quelque
     chose, sa valeur gagne toujours sur la nôtre. Une seule fois, puis la clé est
     effacée — pour ne pas réécrire une adresse qu'elle viendrait de changer. */
  function reprendreMail(){
    if(!/^\/payment/.test(location.pathname||"")) return;
    var v="";
    try{ v=sessionStorage.getItem(CLE_MAIL)||""; }catch(e){ return; }
    if(!v) return;
    var essais=0;
    (function poser(){
      var c=document.querySelector('input[name="email"]');
      if(c && !String(c.value||"").trim()){
        c.value=v; c.dispatchEvent(new Event("input",{bubbles:true}));
        try{ sessionStorage.removeItem(CLE_MAIL); }catch(e){}
        return;
      }
      if(c) { try{ sessionStorage.removeItem(CLE_MAIL); }catch(e){} return; }  /* deja rempli : on s'efface */
      if(++essais<20) setTimeout(poser,250);
    })();
  }

  function demarrer(){
    reprendreMail();
    if(slugCourant()!==SLUG) return;
    var essais=0;
    (function attendre(){
      var pret=(typeof window.PS_PARTENAIRE_EMAIL==="function");
      if(construire() && pret) return;
      if(++essais<25) setTimeout(attendre,200);
    })();
  }

  if(document.readyState!=="loading") demarrer();
  else document.addEventListener("DOMContentLoaded",demarrer);
  /* Le Site Builder peint par étapes : on repasse, la construction est idempotente. */
  [400,1200,2500].forEach(function(d){ setTimeout(demarrer,d); });
})();
