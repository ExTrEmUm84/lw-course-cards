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
  var OFFRE="/program/collection-abonnement";

  function slugCourant(){
    var b=document.body;
    var m=b && (b.className||"").match(/(?:^|\s)slug-([a-z0-9-]+)/i);
    if(m) return m[1];
    return (location.pathname||"").split("/").filter(Boolean).pop()||"";
  }

  var CSS=[
    "#ps-insc{max-width:460px;margin:0 auto;padding:8px 0 40px;font-family:var(--ps-font,Figtree,sans-serif);}",
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
    var hote=document.getElementById("pageContent")||document.querySelector(".learnworlds-section-content");
    if(!hote) return false;

    poserCSS();
    var box=document.createElement("div"); box.id="ps-insc";
    box.innerHTML=
      '<div class="ps-i-sur">Créer votre compte</div>'+
      '<h2 class="ps-i-t">Commencez par votre e-mail</h2>'+
      '<p class="ps-i-d">Si votre école est partenaire, votre accès est déjà pris en charge. '+
        'Sinon, l\'accès se fait par abonnement.</p>'+
      '<label for="ps-i-mail">Votre adresse e-mail</label>'+
      '<input id="ps-i-mail" type="email" autocomplete="email" placeholder="prenom.nom@ecole.fr">'+
      '<div class="ps-i-err" id="ps-i-err"></div>'+
      '<button type="button" class="ps-i-go">Continuer</button>'+
      '<p class="ps-i-aide">Votre école est partenaire et on vous demande de payer&nbsp;? '+
        '<a href="mailto:contact@prepastrat.com">Écrivez-nous</a></p>';
    hote.insertBefore(box, hote.firstChild);

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
      location.href=OFFRE;
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
  function demarrer(){
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
