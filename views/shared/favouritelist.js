import View from "#core/view.js";

class SharedHeaderView extends View {
  static template = () => View.html`
    <aside id="favourite-champions">
      <h3>Favourite Champions</h3>
      <ul id="favourite-list"></ul>
      <button id="clear-favourites">Clear All</button>
      <button id="tri-button">Sort</button>
    </aside>
  `;

  constructor() {
    super(SharedHeaderView.template);
  }
}

export default new SharedHeaderView();
