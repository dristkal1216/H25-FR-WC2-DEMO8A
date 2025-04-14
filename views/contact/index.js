import View from "#core/view.js";

class ContactIndexView extends View {
  static template = () => View.html`
        <h1 class="contact-title">Contactez-moi</h1>
        <p class="contact-text">Si vous avez des questions ou des suggestions, n'hésitez pas à me contacter via ce formulaire.</p>
        
        <form id="contact-form" class="contact-form">
            <label for="email">Adresse e-mail :</label>
            <input type="email" id="email" name="email" placeholder="Votre adresse e-mail" required>

            <label for="message">Votre message :</label>
            <textarea id="message" name="message" placeholder="Écrivez votre message ici..." required></textarea>

            <button type="submit" class="contact-button">Envoyer</button>
        </form>
    `;

  constructor() {
    super(ContactIndexView.template);
  }
}

export default ContactIndexView;
