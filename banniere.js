/*
banniere.js — Bannière visuelle par page du site 11e REI (variante de test GitHub Pages)
================================================================================================
Un seul fichier, charge par toutes les pages via <script src="/banniere.js"></script>.
Insere ou met a jour l'image de fond du bloc <div class="hero"> selon la page courante.
*/

(function () {
  var BASE = "https://raw.githubusercontent.com/zestend-collab/11rei-bannieres/main/";

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

  var BANNIERES_GENERIQUES = [
    "banniere-rang-soldats.jpg", "banniere-presenter-armes.jpg", "banniere-remise-vetements.jpg",
    "banniere-mitrailleuse-groupe.jpg", "banniere-cavalerie.jpg", "banniere-colonne-marche.jpg",
    "banniere-construction-abri-hd.jpg", "banniere-chantier-colline.jpg", "banniere-groupe-champ.jpg",
    "banniere-infirmerie.jpg", "banniere-interieur-equipement.jpg", "banniere-neige-feu.jpg",
    "banniere-porte-drapeau-marche.jpg", "banniere-portrait-officier.jpg", "banniere-portrait-officier-2.jpg",
    "banniere-tanks-motos.jpg", "banniere-tanks-motos-2.jpg", "banniere-troupe-champ-drapeaux.jpg",
    "banniere-balayage.jpg", "banniere-bar-alcool-tue.jpg", "banniere-deux-hommes-table.jpg",
    "banniere-general-cheval-troupe.jpg", "banniere-colonne-mitrailleuse.jpg", "banniere-5e-compagnie-salut.jpg",
    "banniere-clairons.jpg", "banniere-general-rue-face.jpg", "banniere-general-rue-profil.jpg",
    "banniere-tambours.jpg", "banniere-deux-cavaliers.jpg", "banniere-attelages-mitrailleuses.jpg",
    "banniere-colonne-contre-jour.jpg", "banniere-discours-officier.jpg", "banniere-fanfare-cymbales.jpg",
    "banniere-hiver-poele.jpg", "banniere-travaux-tranchee.jpg", "banniere-groupe-foret.jpg",
    "banniere-canon-ferroviaire.jpg", "banniere-salut-cheval-blanc.jpg", "banniere-jeu-cartes.jpg",
    "banniere-drapeau-regimentaire.jpg", "banniere-fanfare-cour-ferme.jpg", "bannière-mort-2.jpg", "bannière-texte.jpg",
    "bannière-fm.jpg","bannière-carte.jpg", "bannière-anglada.jpg", "bannière-inor.jpg", "banniere-amstutz-groupe.jpg",
    "bannière-carnet.jpg", "banniere-brzezinski-israel.jpg", "bannière-saint-germain.jpg","bannière-mort.jpg",
    "bannière-7e-compagnie.jpg","bannière-evdg.jpg"

  ];

  // Fonction de secours pour transformer "nom-du-slug" en "Nom Du Slug" si le H1 est absent
  function titreDepuisSlug(slug) {
    if (!slug || slug === "accueil") return "";
    return slug
      .split("-")
      .map(function(mot) { return mot.charAt(0).toUpperCase() + mot.slice(1); })
      .join(" ");
  }

  function slugDePage() {
    var chemin = window.location.pathname.replace(/\/$/, "");
    var morceaux = chemin.split("/");
    var dernierMorceau = morceaux[morceaux.length - 1] || "accueil";
    // Supprime l'extension .html ou .htm si présente
    return dernierMorceau.replace(/\.html?$/i, "");
  }

  function hashStable(texte) {
  var h = 0;
  for (var i = 0; i < texte.length; i++) {
    h = (h * 31 + texte.charCodeAt(i)) >>> 0;
  }
  return h;
}

  // Correction de la variable interne dans hashStable
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

  function injecterStyleParDefaut() {
    if (document.getElementById("banniere-js-style")) return;
    var style = document.createElement("style");
    style.id = "banniere-js-style";
    style.textContent =
      ".hero{min-height:320px;display:flex;align-items:center;justify-content:center;" +
      "color:#fff;text-align:center;padding:60px 20px;background-size:cover;" +
      "background-position:center;background-repeat:no-repeat}" +
      ".banniere-titre{font-family:Georgia,'Times New Roman',serif;font-size:1.9rem;" +
      "font-weight:bold;color:#fff;margin:0;padding:0 20px;max-width:900px;" +
      "text-shadow:0 2px 8px rgba(0,0,0,.6)}" +
      "@media (max-width:640px){.banniere-titre{font-size:1.3rem}}";
    document.head.insertBefore(style, document.head.firstChild);
  }

  function ajouterTitre(hero, slug) {
    if (hero.querySelector("h1, h2")) return;

    var h1Source = document.querySelector("h1");
    
    // Si H1 trouvé, on garde innerHTML au cas où il y a des balises (ex: <span>)
    // Sinon, on génère un texte sécurisé depuis le slug
    var titre = document.createElement("h1");
    titre.className = "banniere-titre";

    if (h1Source && h1Source.innerHTML.trim()) {
      titre.innerHTML = h1Source.innerHTML.trim();
    } else {
      var texteSecours = titreDepuisSlug(slug);
      if (!texteSecours) return;
      titre.textContent = texteSecours; // Sécurisé
    }

    hero.appendChild(titre);
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
