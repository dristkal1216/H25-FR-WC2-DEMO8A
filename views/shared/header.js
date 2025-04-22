import View from "#core/view.js";
import session from "express-session";

function getCookie(name) {
  const match = session.user?.cookie.match(
    new RegExp("(^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

class SharedHeaderView extends View {
  static template = ({ user }) => {
    return View.html`
    <header id="site-header">
        <!-- Commentaire -->
        <nav id="site-top-nav">
            <picture class="nav-element site-top-nav-logo">
            <source srcset="./img/logo.jpg" type="image/webp" />
            <img src="img/logo.jpg" alt="logo" />
            </picture>
        <ul class="site-top-nav-main">
          <li data-url="/accueil" id="Accueil" class="nav-element nav-active">Accueil</li>
          <li data-url="/apropos" id="Apropos" class="nav-element">À Propos</li>
          <li data-url="/champion" id="Champion" class="nav-element">App</li>
          <li data-url="/contact" id="Contact" class="nav-element">Contact</li>
        </ul>
        <ul class="site-top-nav-login">
          ${
            user
              ? View.html`
                  <li data-url="/profil" class="nav-element"><img src="${user.avatar}"/></li>
                  <li data-url="/logout" class="nav-element">Déconnexion</li>
                `
              : View.html`
                  <li data-url="/login" class="nav-element">Connexion</li>
                  <li data-url="/register" class="nav-element">Inscription</li>
                `
          }
        </ul>

      </nav>
    </header>
  `;
  };

  constructor(user) {
    super(SharedHeaderView.template, user);
    this.user = user;
  }
}

export default SharedHeaderView;
