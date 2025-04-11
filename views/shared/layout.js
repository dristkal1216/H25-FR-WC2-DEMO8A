import View from '#core/View.js';
import headView from './head.js';
import headerView from './header.js';
import footerView from './footer.js';

class SharedLayoutView extends View {
  /**
   * The template accepts a content string that will be injected into the main container.
   */
  static template = (content) => View.html`
    <!DOCTYPE html>
    <html lang="fr">
    ${headView.render()}
    <body>
      ${headerView.render()}
      <main id="main-container">
        ${content}
      </main>
      ${footerView.render()}
    </body>
    </html>
  `;

  constructor(content) {
    super(SharedLayoutView.template);
    this.content = content;
  }

  render() {
    return this.template(this.content);
  }
}

export default SharedLayoutView;
