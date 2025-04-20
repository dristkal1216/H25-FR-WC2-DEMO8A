import View from "#core/view.js";

class ProfileView extends View {
  static template = (user) => View.html`
    <h1 class="profil-title">Mon Profil</h1>
    <p class="profil-text"><strong>Nom d'utilisateur :</strong> ${
      user.username
    }</p>

    <h2 class="profil-subtitle">Champions Favoris</h2>
    ${
      user.favourites.length > 0
        ? user.favourites
            .map(
              (champion) => View.html`
            <div class="champion" data-champion-id="${champion.id}" data-roles="${champion.tags}">
              <img
                src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champion.id}_0.jpg"
                alt="${champion.name}"
              />
              <p>${champion.name}</p>
            </div>
          `
            )
            .join("")
        : View.html`
          <p class="profil-text">Aucun champion favori sélectionné.</p>
        `
    }

    <h2 class="profil-subtitle">Avatar</h2>
    <img
      src="${user.avatar}"
      alt="Avatar de ${user.username}"
      class="profil-avatar"
    />
  `;

  static conteneur = View.html`
    <div>
      ${View.bodyMarker}

      <form
        id="upload-avatar-form"
        class="profil-form"
        method="POST"
        action="/profil/avatar"
        enctype="multipart/form-data"
      >
        <label for="avatar" class="profil-text">
          <strong>Photo de profil :</strong>
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          required
          class="profil-input"
        />
        <button type="submit" class="profil-button">Téléverser</button>
      </form>

      <h2 class="profil-subtitle">Changer de mot de passe</h2>
      <form
        id="change-password-form"
        class="profil-form"
        method="POST"
        action="/profil/password"
      >
        <input
          type="password"
          id="old-password"
          placeholder="Ancien mot de passe"
          required
          class="profil-input"
        />
        <input
          type="password"
          id="new-password"
          placeholder="Nouveau mot de passe"
          required
          class="profil-input"
        />
        <button type="submit" class="profil-button">Mettre à jour</button>
      </form>

      <button id="logout-btn" class="profil-button logout">
        Se déconnecter
      </button>
    </div>
  `;

  constructor(user) {
    super(ProfileView.template, user, ProfileView.conteneur);
  }
}

export default ProfileView;
