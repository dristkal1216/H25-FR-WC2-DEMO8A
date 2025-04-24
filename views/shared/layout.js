// views/shared/layout.js
import View from "#core/view.js";
import headView from "./head.js";
import SharedHeaderView from "./header.js";
import favouritelist from "./favouritelist.js";
import footerView from "./footer.js";

class SharedLayoutView extends View {
  static template = ({ content, user }) => View.html`
    <!DOCTYPE html>
    <html lang="fr">
      ${headView.render()}
      <body>
        ${new SharedHeaderView(user).render()}
        ${favouritelist.render()}
        <main id="site-main-content" class="site-main-content">
          ${content}
        </main>
        ${footerView.render()}
        
      </body>
    </html>
  `;

  constructor(content, user) {
    // on passe UN seul objet {content, user} au super
    super(SharedLayoutView.template, { content, user });
  }
}

export default SharedLayoutView;
