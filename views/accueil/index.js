import View from '#core/View.js';

class AccueilIndexView extends View {
    static template = () => View.html`
        <h1> Accueil </h1>
        <p> Bienvenue à tous les fans de RPG! </p>
    `;

    constructor(){
        super(AccueilIndexView.template);
    }
}

export default AccueilIndexView;