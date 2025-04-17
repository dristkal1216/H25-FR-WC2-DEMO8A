import View from "#core/view.js";

class ProfileView extends View {
  static template = () => View.html`
    <h1>Profil de </h1>
    <p>ID :</p>
    <a href="/login/logout">Déconnexion</a>
  `;

  constructor() {
    super(ProfileView.template);
  }
}
export default ProfileView;
