import { App, FavoriteService } from "./client-app.js";

export default class RequestHandler {
  /**
   * Exécute une requête AJAX et met à jour l’interface selon la route.
   *
   * @param {string} route         L’URL ou le chemin de la ressource
   * @param {string} method        Méthode HTTP (GET, POST, etc.)
   * @param {string|URLSearchParams|null} body  Corps de la requête (JSON ou query params)
   * @param {boolean} pushState    Si true, synchronise l’historique du navigateur
   * @returns {Promise<null|any>}  null en cas d’erreur, sinon rien
   */
  static async handleRequest(
    route,
    method = App.HTTP_METHODS.GET,
    body = null,
    pushState = true
  ) {
    // 1) Construire l’objet fetch
    let url = route;
    const headers = { "X-Requested-With": "XMLHttpRequest" };

    // Si URLSearchParams → query string
    if (body instanceof URLSearchParams) {
      url += `?${body}`;
    }
    // Si payload JSON
    else if (body !== null && method !== App.HTTP_METHODS.GET) {
      headers["Content-Type"] = "application/json";
    }

    const options = { method, headers };
    if (
      body !== null &&
      method !== App.HTTP_METHODS.GET &&
      !(body instanceof URLSearchParams)
    ) {
      options.body = body;
    }

    try {
      // 2) Réinitialiser le conteneur principal
      App.mainContainer.className = "";
      App.mainContainer.removeAttribute("style");
      App.activeNav();

      // 3) Appeler l’API
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const responseText = await response.text();

      // 4) Mettre à jour l’interface selon la route
      switch (true) {
        case route.includes("/accueil") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "acceuil-container";
          App.mainContainer.innerHTML = responseText;
          break;

        case route.includes("/apropos") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "apropos-container";
          App.mainContainer.innerHTML = responseText;
          App.activeNav("Apropos");
          break;

        case route.includes("/contact") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "contact-container";
          App.mainContainer.innerHTML = responseText;
          App.activeNav("Contact");
          break;

        case route.includes("/contact") && method === App.HTTP_METHODS.POST:
          App.mainContainer.className = "contact-container";
          App.mainContainer.innerHTML = responseText;
          App.activeNav("Contact");
          App.showSuccess("Message sent successfully!");
          break;

        case route.includes("/items") && method === App.HTTP_METHODS.GET:
          App.mainContainer.style.display = "flex";
          App.mainContainer.innerHTML = App.creerTableItems(
            JSON.parse(responseText)
          );
          break;

        case route.includes("/champion") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "Champion-container";
          App.champions = JSON.parse(responseText);
          App.mainContainer.style.display = "flex";
          App.mainContainer.innerHTML = App.creerTableChampions(App.champions);
          await FavoriteService.getAll();
          App.updateFavouriteList();
          App.activeNav("Champion");
          break;

        case route.includes("/auth") && method === App.HTTP_METHODS.PUT:
          const user = JSON.parse(responseText);
          if (user) {
            localStorage.setItem("loggedinUser", JSON.stringify(user));
            App.showSuccess("Login successful!");
            // Recharge la page d’accueil sans pushState
            await RequestHandler.handleRequest(
              "/home/index",
              App.HTTP_METHODS.GET,
              null,
              false
            );
          } else {
            App.showError("Invalid credentials");
          }
          break;

        case route.includes("/login") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "login-container";
          App.mainContainer.innerHTML = responseText;
          App.activeNav("Login");
          break;

        case route.includes("/profil") && method === App.HTTP_METHODS.GET:
          App.mainContainer.className = "profil-container";
          App.mainContainer.innerHTML = responseText;
          App.activeNav("Profil");
          break;

        default:
          console.warn("Unhandled route/method:", route, method);
      }

      // 5) Mettre à jour l’historique si nécessaire
      if (pushState) {
        window.history.pushState(null, "", route);
      }
    } catch (err) {
      // 6) Gestion des erreurs
      console.error("handleRequest error:", err);
      App.showError(err.message);
      return null;
    }
  }
}
