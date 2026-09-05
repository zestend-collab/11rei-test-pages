/*
menu.js — Menu de navigation partage du site 11e REI (variante de test GitHub Pages)
================================================================================================
Un seul fichier, charge par toutes les pages via <script src="/menu.js"></script>.
Insere le menu de navigation en haut de la page au chargement, sans dependance a un
template particulier.

Style : le menu flotte en surimpression transparente sur la banniere (texte blanc, pas
de fond), comme sur certaines pages du Google Sites. Des que la page est scrollee au-dela
de la hauteur de la banniere, le menu passe automatiquement en fond blanc plein + texte
sombre pour rester lisible par-dessus n'importe quel contenu (le menu reste toujours
visible, position fixe).

Pour changer un lien du menu : modifier UNIQUEMENT ce fichier, pas les generateurs Python.
*/

(function () {
  var SITE = "https://test.11regimentetranger.com";

  var LIENS = [
    { href: SITE + "/recensement-11e-rei", label: "Recensement 11e REI" },
    { href: SITE + "/arborescence", label: "Arborescence" },
    { href: SITE + "/recherche-legionnaire", label: "Recherche legionnaire" },
    { href: SITE + "/portraits", label: "Portraits légionnaires" },
    { href: SITE + "/blog", label: "Thèmes et biographies, 11e REI" },
    { href: SITE + "/livre", label: "Livre" },
    { href: SITE + "/contact", label: "Contact" }
  ];

  var CSS = ""
    + ".gsite-nav{position:fixed;top:0;left:0;width:100%;z-index:500;"
    + "font-family:'Roboto',Arial,sans-serif;background:transparent;"
    + "transition:background .25s ease,box-shadow .25s ease}"
    + ".gsite-nav.scrolled{background:#f1f3f4;box-shadow:0 1px 6px rgba(0,0,0,.15)}"
    + ".gsite-nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:28px;padding:0 24px;height:64px}"
    + ".gsite-logo{display:flex;align-items:center;white-space:nowrap;margin-right:8px;text-decoration:none}"
    + ".gsite-logo img{height:36px;width:auto;display:block;transition:height .25s ease}"
    + ".gsite-nav.scrolled .gsite-logo img{height:30px}"
    + ".gsite-links{display:flex;align-items:center;gap:26px;flex:1;overflow-x:auto}"
    + ".gsite-links a{font-size:.86rem;color:#ffffff;text-decoration:none;white-space:nowrap;padding:22px 0;border-bottom:3px solid transparent;transition:color .25s ease}"
    + ".gsite-nav.scrolled .gsite-links a{color:#3c4043}"
    + ".gsite-links a:hover{opacity:.8}"
    + ".gsite-nav.scrolled .gsite-links a:hover{color:#202124;opacity:1}"
    + ".gsite-links a.active{font-weight:500;border-bottom-color:#fab855}"
    + "@media (max-width:760px){.gsite-links{gap:16px}.gsite-nav-inner{gap:14px;padding:0 12px}}";

  function construireMenu() {
    var chemin = window.location.pathname;

    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    var nav = document.createElement("nav");
    nav.className = "gsite-nav";

    var inner = document.createElement("div");
    inner.className = "gsite-nav-inner";

    var logo = document.createElement("a");
    logo.className = "gsite-logo";
    logo.href = SITE;
    var logoImg = document.createElement("img");
    logoImg.src = "https://raw.githubusercontent.com/zestend-collab/11rei-photos-blog/main/logo.png";
    logoImg.alt = "11è REI";
    logo.appendChild(logoImg);
    inner.appendChild(logo);

    var linksWrap = document.createElement("div");
    linksWrap.className = "gsite-links";
    LIENS.forEach(function (lien) {
      var a = document.createElement("a");
      a.href = lien.href;
      a.textContent = lien.label;
      // marque comme actif le lien dont le chemin correspond au debut de l'URL courante
      var lienChemin = lien.href.replace(SITE, "") || "/";
      if (lienChemin !== "/" && chemin.indexOf(lienChemin) === 0) {
        a.className = "active";
      }
      linksWrap.appendChild(a);
    });
    inner.appendChild(linksWrap);

    nav.appendChild(inner);
    // Insere la nav tout en haut du body : si une banniere (.hero) existe deja ou est
    // ajoutee ensuite par banniere.js juste apres, elle devient de fait le tout premier
    // element du flux normal (la nav etant position:fixed, hors flux), et se retrouve
    // donc visuellement collee en haut de page, sous la nav transparente.
    document.body.insertBefore(nav, document.body.firstChild);

    // Bascule la nav en fond plein des que la banniere (si presente) est depassee par
    // le defilement, pour rester lisible par-dessus n'importe quel contenu ensuite.
    function onScroll() {
      var hero = document.querySelector(".hero");
      var heroHeight = hero ? hero.getBoundingClientRect().height : 0;
      var navHeight = nav.offsetHeight || 64;
      var seuil = Math.max(heroHeight - navHeight, 10);
      if (window.scrollY > seuil) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", construireMenu);
  } else {
    construireMenu();
  }
})();
