import View from '#core/View.js';

class SharedFooterView extends View {
  static template = () => View.html`
    <footer>
      <p>&copy; 2025 Mon App RPG</p>
    </footer>
  `;

  constructor() {
    super(SharedFooterView.template);
  }
}

export default new SharedFooterView();