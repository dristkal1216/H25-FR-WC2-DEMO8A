class User {
  /** @type {number} */
  id;
  /** @type {string} */
  nom;
  /** @type {string} */
  username;
  /** @type {string} */
  password;

  /**@type {[Champion]} */
  favourites = [];

  /**@type {string} */
  avatar = "/img/default-avatar.png";
}

export default User;
