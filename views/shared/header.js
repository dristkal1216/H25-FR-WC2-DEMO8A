import View from "#core/view.js";
import session from "express-session";


function getCookie(name) {
  const match = session.user?.cookie.match(
    new RegExp('(^|; )' + name + '=([^;]*)')
  );
  return match ? decodeURIComponent(match[2]) : null;
}

class SharedHeaderView extends View {

  static template = () => {
  
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
          <li data-url="/login" id="Login" class="nav-element nav-login">Login</li>
          <li data-url="/registrer" id="Register" class="nav-element nav-register">Register</li>
          </ul>
      </nav>
    </header>
  `;
  }

  constructor() {
    super(SharedHeaderView.template);
  }
}

export default new SharedHeaderView();
