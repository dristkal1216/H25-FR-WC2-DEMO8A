import View from "#core/view.js";
import headView from "./head.js";
import SharedHeaderView from "./header.js";
import footerView from "./footer.js";
import favouritelist from "./favouritelist.js";

class SharedLayoutView extends View {
  static template = ({ content, user }) => View.html`
    <!DOCTYPE html>
    <html lang="fr">
    ${headView.render()}
    <body>
      ${new SharedHeaderView({ user }).render()}
      ${favouritelist.render()}
      <main id="site-main-content" class="site-main-content">
        ${content}
      </main>
      ${footerView.render()}
    </body>
    </html>
  `;

  constructor(content, user) {
    super(SharedLayoutView.template);
    this.content = content;
    this.user = user;
  }

  render() {
    return this.template(this.content);
  }
}

export default SharedLayoutView;
