import View from "#core/view.js";
import Champion from "#models/champion.js";

class ChampionsIndexView extends View {
  static conteneur = View.html`
    <div id="champion-section">
      <input type="text" id="search-bar" placeholder="Rechercher un champion..." />
      <div id="filter-bar">
        <button class="filter-btn" data-role="Tank">
          <img src="../img/tank.svg" alt="Tank"></img>
        </button>
        <button class="filter-btn" data-role="Mage">
          <img src="../img/mage.svg" alt="Mage"></img>
        </button>
        <button class="filter-btn" data-role="Assassin">
          <img src="../img/assassin.svg" alt="Assassin"></img>
        </button>
        <button class="filter-btn" data-role="Support">
          <img src="../img/support.svg" alt="Support"></img>
        </button>
        <button class="filter-btn" data-role="Marksman">
          <img src="../img/marksman.svg" alt="Marksman"></img>
        </button>
        <button class="filter-btn" data-role="Fighter">
          <img src="../img/Fighter.svg" alt="Fighter"></img>
        </button>
      </div>
      <div id="champion-container">
        ${View.bodyMarker}
      </div>
    </div>
    <div id="info-container">
        <p>Sélectionnez un champion pour voir les détails !</p>
    </div>

`;

  /**
   * Template for a champion row.
   * @param {Champion} champion
   */
  static template = (champion) =>
    View.html`
    <div class="champion" data-champion-id="${champion.id}" data-roles="${champion.tags}">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champion.id}_0.jpg" alt="${champion.name}"/>
        <p>${champion.name}</p>
    </div>
    `;

  /**
   * @param {Champion[]} champions
   */
  constructor(champions) {
    super(ChampionsIndexView.template, champions, ChampionsIndexView.conteneur);
  }
}

export default ChampionsIndexView;
