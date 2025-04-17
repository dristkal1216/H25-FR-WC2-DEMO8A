import View from "#core/view.js";

class SharedHeaderView extends View {
  static template = () => View.html`
    <header id="site-header">
        <!-- Commentaire -->
        <nav id="site-top-nav">
            <picture class="nav-element site-top-nav-logo">
            <source srcset="./img/logo.jpg" type="image/webp" />
            <img src="img/logo.jpg" alt="logo" />
            </picture>
        <ul class="site-top-nav-main">
          <li data-url="/accueil" class="nav-element nav-active">Accueil</li>
          <li data-url="/apropos" class="nav-element">À Propos</li>
          <li data-url="/champion" class="nav-element">App</li>
          <li data-url="/contact" class="nav-element">Contact</li>
        </ul>
        <ul class="site-top-nav-login">
          <li data-url="/profil" class="nav-element" style="display: none">Profil</li>
          <li data-url="/login" class="nav-element">Login</li>
        </ul>
      </nav>
    </header>
  `;

  constructor() {
    super(SharedHeaderView.template);
  }
}

export default new SharedHeaderView();
