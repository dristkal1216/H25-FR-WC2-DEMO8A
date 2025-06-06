import View from "#core/view.js";

class LoginIndexView extends View {
  static template = () => View.html`
  
    <h1 class="login-title">Connexion</h1>
      <form class="login-form" method="POST" action="/login">
        <label>Nom d'utilisateur</label>
        <input name="username" required />
        <label>Mot de passe</label>
        <input type="password" name="password" required />
        <button class="login-button" type="submit">Se connecter</button>
      </form> 
  
    
  `;
  constructor() {
    super(LoginIndexView.template);
  }
}

export default LoginIndexView;
