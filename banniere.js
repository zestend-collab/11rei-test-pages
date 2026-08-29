/*
banniere.js — Bannière visuelle par page du site 11e REI (variante de test GitHub Pages)
================================================================================================
Un seul fichier, charge par toutes les pages via <script src="/banniere.js"></script>.
Insere ou met a jour l'image de fond du bloc <div class="hero"> selon la page courante.

REGLE:
- Si un fichier bannière s'appelle "banniere-<slug-de-la-page>.jpg", il est reserve a
  la biographie de ce slug et s'affiche UNIQUEMENT sur cette page (PHOTOS_PERSONNELLES).
- Sinon, la page recoit une bannière du pot commun (BANNIERES_GENERIQUES), choisie de
  facon stable (toujours la meme a chaque visite) a partir du nom de la page.

Pour ajouter une bannière : uploader le fichier dans le depot 11rei-bannieres, puis
l'ajouter ici -> dans PHOTOS_PERSONNELLES si elle est dediee a une fiche precise
(cle = slug exact de la page, ex "buhrer-emile" pour /blog/buhrer-emile),
sinon dans BANNIERES_GENERIQUES.

Pour changer une bannière : modifier UNIQUEMENT ce fichier, pas les generateurs Python.
*/

(function () {
  var BASE = "https://raw.githubusercontent.com/zestend-collab/11rei-bannieres/main/";

  // Bannières dediees a UNE page precise (biographie ou page thematique) : cle = slug
  // de la page (dernier segment de l'URL, ex "buhrer-emile" pour /blog/buhrer-emile,
  // ou "ordre-de-bataille" pour /ordre-de-bataille).
  var PHOTOS_PERSONNELLES = {
    "arsene-zigrand": "banniere-arsene-zigrand.jpg",
    "binsztok-mordka": "banniere-binsztok-mordka.jpg",
    "brzezinski-israel": "banniere-brzezinski-israel.jpg",
    "buhrer-emile": "banniere-buhrer-emile.jpg",
    "amstutz-jean-bernard": "banniere-amstutz-groupe.jpg",
    "marguet-louis": "banniere-marguet-velos.jpg",
    "ordre-de-bataille": "banniere-ordre-de-bataille.jpg",
    "arborescence": "banniere-arborescence.jpg"

  };

  // Pot commun utilise pour toutes les autres pages (accueil, arborescence,
  // recensement, fiches sans photo dediee...). Choix stable par page : la meme
  // bannière s'affiche a chaque visite d'une page donnee.
  var BANNIERES_GENERIQUES = [
    "banniere-rang-soldats.jpg",
    "banniere-presenter-armes.jpg",
    "banniere-remise-vetements.jpg",
    "banniere-mitrailleuse-groupe.jpg",
    "banniere-cavalerie.jpg",
    "banniere-colonne-marche.jpg",
    "banniere-construction-abri-hd.jpg",
    "banniere-chantier-colline.jpg",
    "banniere-groupe-champ.jpg",
    "banniere-infirmerie.jpg",
    "banniere-interieur-equipement.jpg",
    "banniere-neige-feu.jpg",
    "banniere-porte-drapeau-marche.jpg",
    "banniere-portrait-officier.jpg",
    "banniere-portrait-officier-2.jpg",
    "banniere-tanks-motos.jpg",
    "banniere-tanks-motos-2.jpg",
    "banniere-troupe-champ-drapeaux.jpg",
    "banniere-balayage.jpg",
    "banniere-bar-alcool-tue.jpg",
    "banniere-deux-hommes-table.jpg",
    "banniere-general-cheval-troupe.jpg",
    "banniere-colonne-mitrailleuse.jpg",
    "banniere-5e-compagnie-salut.jpg",
    "banniere-clairons.jpg",
    "banniere-general-rue-face.jpg",
    "banniere-general-rue-profil.jpg",
    "banniere-tambours.jpg",
    "banniere-deux-cavaliers.jpg",
    "banniere-attelages-mitrailleuses.jpg",
    "banniere-colonne-contre-jour.jpg",
    "banniere-discours-officier.jpg",
    "banniere-fanfare-cymbales.jpg",
    "banniere-hiver-poele.jpg",
    "banniere-travaux-tranchee.jpg",
    "banniere-groupe-foret.jpg",
    "banniere-canon-ferroviaire.jpg",
    "banniere-salut-cheval-blanc.jpg",
    "banniere-jeu-cartes.jpg",
    "banniere-drapeau-regimentaire.jpg",
    "banniere-fanfare-cour-ferme.jpg"
  ];

  function slugDePage() {
    var chemin = window.location.pathname.replace(/\/$/, "");
    var morceaux = chemin.split("/");
    return morceaux[morceaux.length - 1] || "accueil";
  }

  // Hash simple et stable : meme resultat a chaque chargement, donc toujours la
  // meme bannière du pot commun pour une page donnee (pas d'aleatoire a chaque visite).
  function hashStable(texte) {
    var h = 0;
    for (var i = 0; i < texte.length; i++) {
      h = (h * 31 + texte.charCodeAt(i)) >>> 0;
    }
    return h;
  }

  function choisirBanniere(slug) {
    if (PHOTOS_PERSONNELLES[slug]) {
      return PHOTOS_PERSONNELLES[slug];
    }
    var index = hashStable(slug) % BANNIERES_GENERIQUES.length;
    return BANNIERES_GENERIQUES[index];
  }

  // Style de base du bloc .hero, injecte une seule fois en tout debut de <head> (donc
  // de plus faible priorite en cascade que n'importe quel CSS deja present sur la page :
  // une page qui definit deja .hero avec son propre style, comme recensement-11e-rei.html,
  // garde ce style ; les autres recoivent au moins une hauteur et un rendu correct).
  function injecterStyleParDefaut() {
    if (document.getElementById("banniere-js-style")) return;
    var style = document.createElement("style");
    style.id = "banniere-js-style";
    style.textContent =
      ".hero{min-height:340px;display:flex;align-items:center;justify-content:center;" +
      "color:#fff;text-align:center;padding:60px 20px;background-size:cover;" +
      "background-position:center;background-repeat:no-repeat}" +
      ".banniere-titre{font-family:Georgia,'Times New Roman',serif;font-size:1.9rem;" +
      "font-weight:bold;color:#fff;margin:0;padding:0 20px;max-width:900px;" +
      "text-shadow:0 2px 8px rgba(0,0,0,.6)}" +
      "@media (max-width:640px){.banniere-titre{font-size:1.3rem}}";
    document.head.insertBefore(style, document.head.firstChild);
  }
 // Reprend le <h1> deja present sur la page (ecrit par le generateur ou a la main) et
// l'affiche en surimpression sur la banniere, en blanc.
function ajouterTitre(hero, slug) {
  if (hero.querySelector("h1, h2")) return; // hero avec son propre titre deja fait main
  
  var h1Source = document.querySelector("h1");
  
  // MODIFICATION 1 : On utilise .innerHTML au lieu de .textContent pour récupérer le <br>
  var texte = (h1Source && h1Source.innerHTML.trim()) || titreDepuisSlug(slug);
  if (!texte) return;
  
  var titre = document.createElement("h1");
  titre.className = "banniere-titre";
  
  // MODIFICATION 2 : On injecte avec innerHTML pour que le navigateur lise le saut de ligne
  titre.innerHTML = texte;
  hero.appendChild(titre);

  // (MODIFICATION 3 supprimée : on ne masque plus le h1 original)
}
  }
  function appliquerBanniere() {
    injecterStyleParDefaut();

    var slug = slugDePage();
    var fichier = choisirBanniere(slug);
    var url = BASE + fichier;

    var hero = document.querySelector(".hero");
    if (!hero) {
      hero = document.createElement("div");
      hero.className = "hero";
      var nav = document.querySelector(".gsite-nav");
      if (nav && nav.nextSibling) {
        nav.parentNode.insertBefore(hero, nav.nextSibling);
      } else {
        document.body.insertBefore(hero, document.body.firstChild);
      }
    }

    hero.style.backgroundImage =
      "linear-gradient(rgba(20,15,10,0.55), rgba(20,15,10,0.55)), url('" + url + "')";
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
    hero.style.backgroundRepeat = "no-repeat";

    ajouterTitre(hero, slug);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", appliquerBanniere);
  } else {
    appliquerBanniere();
  }
})();
