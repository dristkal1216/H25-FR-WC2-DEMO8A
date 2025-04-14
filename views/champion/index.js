import View from "#core/view.js";
import Champion from "#models/champion.js";

class ChampionsIndexView extends View {
  static conteneur = View.html`
  <section id="champions-index">
    <div id="filter-search-bar">
      <input type="text" id="search-bar" placeholder="Rechercher un champion..." />
      <div id="filter-bar">
        <button class="filter-btn" data-role="All">All</button>
      </div>
    </div>
    <table data-table-for="Champions">
      <thead>
        <tr>
          <th style="width:35%"> Nom </th>
          <th style="width:35%"> Description </th>
          <th style="width:20%"> HP </th>
          <th style="width:5%"></th>
          <th style="width:5%"></th>
        </tr>
      </thead>
      <tbody>
        ${View.bodyMarker}
      </tbody>
    </table>
  </section>
`;

  /**
   * Template for a champion row.
   * @param {Champion} champion
   */
  static template = (champion) =>
    View.html`
    <h2>${champion.name} - ${champion.title}</h2>
          <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion.id}_0.jpg" alt="${champion.name}">
          <p>${champion.blurb}</p>
          <div class="champion-info">
            <strong>Info:</strong>
            Attack: ${champion.info.attack} |
            Defense: ${champion.info.defense} |
            Magic: ${champion.info.magic} |
            Difficulty: ${champion.info.difficulty}
          </div>
          <div class="champion-stats">
            <p><strong>HP:</strong> ${champion.stats.hp} (+${champion.stats.hpperlevel}/lvl)</p>
            <p><strong>Armor:</strong> ${champion.stats.armor} (+${champion.stats.armorperlevel}/lvl)</p>
            <p><strong>Attack Damage:</strong> ${champion.stats.attackdamage}</p>
          </div>
          <div class="champion-tags">
            <strong>Tags:</strong> ${champion.tags.join(', ')}
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
