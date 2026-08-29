/*
menu.js — Menu de navigation partage du site 11e REI (variante de test GitHub Pages)
================================================================================================
Un seul fichier, charge par toutes les pages via <script src="/menu.js"></script>.
Insere le menu de navigation (reproduction du menu Google Sites) en haut de la page
au chargement, sans dependance a un template particulier.

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
    { href: SITE, label: "Livre" },
    { href: SITE, label: "Contact" },
  ];

  var CSS = ""
    + ".gsite-nav{background:#ffffff;border-bottom:1px solid #e0e0e0;position:sticky;top:0;z-index:200;font-family:'Roboto',Arial,sans-serif}"
    + ".gsite-nav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:28px;padding:0 24px;height:64px}"
    + ".gsite-logo{font-size:1.05rem;font-weight:500;color:#202124;white-space:nowrap;margin-right:8px;text-decoration:none}"
    + ".gsite-links{display:flex;align-items:center;gap:26px;flex:1;overflow-x:auto}"
    + ".gsite-links a{font-size:.86rem;color:#3c4043;text-decoration:none;white-space:nowrap;padding:22px 0;border-bottom:3px solid transparent}"
    + ".gsite-links a:hover{color:#202124}"
    + ".gsite-links a.active{color:#202124;font-weight:500;border-bottom-color:#fab855}"
    + ".gsite-search{width:2.2rem;height:2.2rem;border-radius:50%;border:none;background:transparent;color:#5f6368;font-size:1.1rem;cursor:pointer;flex-shrink:0}"
    + ".gsite-search:hover{background:#f1f3f4}"
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
    logo.textContent = "11è REI";
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

    var search = document.createElement("button");
    search.type = "button";
    search.className = "gsite-search";
    search.title = "Rechercher";
    search.setAttribute("aria-label", "Rechercher");
    search.textContent = "\uD83D\uDD0D"; // loupe
    search.addEventListener("click", function () {
      window.location.href = SITE + "/recherche-legionnaire";
    });
    inner.appendChild(search);

    nav.appendChild(inner);
    document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", construireMenu);
  } else {
    construireMenu();
  }
})();
