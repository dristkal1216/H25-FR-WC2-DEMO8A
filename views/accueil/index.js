import View from "#core/view.js";

class AccueilIndexView extends View {
  static template = () => View.html`
        <h1 class="acceuil-title">Bienvenue dans l'univers de League of Legends</h1>
      <p class="acceuil-text">
          Découvrez les champions et ajoutez vos favoris !
      </p>
      <button id="explore-btn" class="acceuil-button">Explorer</button>
    `;

  constructor() {
    super(AccueilIndexView.template);
  }
}

export default AccueilIndexView;
