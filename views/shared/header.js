import View from '#core/View.js';

class SharedHeaderView extends View {
    static template = () => View.html`
    <header id="site-header">
        <!-- Commentaire -->
        <nav id="site-top-nav">
            <picture class="nav-element site-top-nav-logo">
                <source srcset="/img/logo.jpg" type="image/webp">
                <img src="/img/logo.jpg" alt="logo">
            </picture>
            <ul class="site-top-nav-main">
                <li data-url="/accueil" class="nav-element nav-active">Accueil</li>
                <li data-url="/characters" class="nav-element">Characters</li>
                <li data-url="/items" class="nav-element">Items</li>
                <li data-url="/apropos" class="nav-element">À Propos</li>
                <li data-url="/contact" class="nav-element">Contact</li>
            </ul>
            <ul class="site-top-nav-login">
                
            </ul>
        </nav>
        <img id="nav-toggle" aria-label="Toggle navigation" src="/img/expand-arrow.png"/>
    </header>
  `;

  constructor() {
    super(SharedHeaderView.template);
  }
}

export default new SharedHeaderView();