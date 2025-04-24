import RequestHandler from "./request-handler.js";

/**
 * Item Type Definition
 * @typedef {Object} Item
 * @property {number} id - Item ID
 * @property {string} nom - Item name
 * @property {string} description - Item description
 * @property {number} poids - Item weight
 */

// === MAIN APPLICATION MODULE ===
export const App = (() => {
  class App {
    // === STATIC PROPERTIES ===
    static mainContainer; // Main content container
    static modal; // Modal dialog element
    static champions; // Array of champion data

    // HTTP Methods enumeration
    static HTTP_METHODS = {
      POST: "POST", // Create operation
      GET: "GET", // Read operation
      PATCH: "PATCH", // Update operation
      DELETE: "DELETE", // Delete operation
    };

    // === NAVIGATION METHODS ===

    /**
     * Sets active state on navigation item
     * @param {string} id - ID of the nav item to activate
     */
    static activeNav(id = "Accueil") {
      document.querySelectorAll("#site-top-nav > ul > li").forEach((li) => {
        li.classList.toggle("nav-active", li.id === id);
      });
    }

    // === VIEW RENDERERS ===

    /**
     * Creates champions grid view
     * @param {Array} championArray - Array of champion objects
     * @return {string} - HTML string
     */
    static creerTableChampions(championArray) {
      return `
        <div id="champion-section">
          <input type="text" id="search-bar" placeholder="Search champions..." />
          <div id="filter-bar">
            ${["Tank", "Mage", "Assassin", "Support", "Marksman", "Fighter"]
              .map(
                (role) => `
                <button class="filter-btn" data-role="${role}">
                  <img src="../img/${role.toLowerCase()}.svg" alt="${role}">
                </button>`
              )
              .join("")}
          </div>
          <div id="champion-container">
            ${championArray
              .map((champ) => App.creerTableRowForChampion(champ))
              .join("")}
          </div>
        </div>
        <div id="info-container">
          <p>Select a champion to see details!</p>
        </div>`;
    }

    /**
     * Creates single champion card
     * @param {Object} champion - Champion data
     * @return {string} - HTML string
     */
    static creerTableRowForChampion(champion) {
      const champId =
        champion.id === "Fiddlesticks" ? "FiddleSticks" : champion.id;
      return `
        <div class="champion" data-champion-id="${champId}" data-roles="${champion.tags}">
          <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champId}_0.jpg" 
               alt="${champion.name}"/>
          <p>${champion.name}</p>
        </div>`;
    }

    // === CHAMPIONS DISPLAY LOGIC ===

    /**
     * Filters and displays champions based on role and search term
     * @param {string} filterRole - Role to filter by
     * @param {string} searchTerm - Search string for champion names
     */
    static displayChampions(filterRole = "All", searchTerm = "") {
      const container = App.mainContainer.querySelector("#champion-container");
      if (!container) return;

      // Préparer le filtre
      const term = searchTerm.toLowerCase();
      const isAll = filterRole === "All";

      const rows = Object.values(App.champions || {})
        .filter(
          (champ) =>
            // rôle
            (isAll || champ.tags.includes(filterRole)) &&
            // recherche
            (!term || champ.id.toLowerCase().includes(term))
        )
        .map((champ) => {
          // correction spécifique
          if (champ.id === "Fiddlesticks") champ.id = "FiddleSticks";
          return App.creerTableRowForChampion(champ);
        })
        .join("");

      container.innerHTML = rows;
    }

    /**
     * Displays detailed champion information
     * @param {string} id - Champion ID
     */
    static async displayChampionsInfo(id) {
      // 1) Récupérer le champion
      const champ = Object.values(App.champions || {}).find(
        (c) => String(c.id) === String(id)
      );
      if (!champ) {
        console.error("Champion not found:", id);
        return;
      }

      // 2) Vérifier si c'est un favori
      const isFav = await FavoriteService.isFav(champ.id);

      // 3) Trouver le container et injecter le HTML
      const container = App.mainContainer.querySelector("#info-container");
      if (!container) return;
      container.innerHTML = `
        <div class="champion-card">
          <img
            src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${
              champ.id
            }_0.jpg"
            alt="${champ.name}"
            class="champion-splash"
          />
          <h2>${champ.name}</h2>
          <p><strong>Role:</strong> ${champ.tags.join(", ")}</p>
          <p><em>${champ.title}</em></p>
          <p>${champ.blurb}</p>
          <button id="favourite-btn" class="${isFav ? "favourite" : ""}">
            ${isFav ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button id="close-details">Close</button>
        </div>
      `;

      // 4) Ajouter les écouteurs en utilisant optional chaining
      const closeBtn = container.querySelector("#close-details");
      closeBtn?.addEventListener("click", () => {
        container.innerHTML = `<p>Select a champion to see details!</p>`;
      });

      const favBtn = container.querySelector("#favourite-btn");
      favBtn?.addEventListener("click", async () => {
        // basculer le statut favori, puis recharger l'affichage
        await (isFav
          ? FavoriteService.remove(champ)
          : FavoriteService.add(champ));
        App.updateFavouriteList();
        App.displayChampionsInfo(champ.id);
      });
    }

    // === FAVORITES MANAGEMENT ===

    /**
     * Updates favorites list in sidebar
     */
    static updateFavouriteList = async () => {
      const ul = document.getElementById("favourite-list");
      if (!ul) return;

      const list = await FavoriteService.getAll().catch(() => []);
      if (list.length === 0) {
        ul.innerHTML = "<li>Aucun favori</li>";
      } else {
        // determine sort order
        const triBtn = document.getElementById("tri-button");
        const asc = triBtn?.dataset.asc === "true";

        const sorted = list.sort((a, b) =>
          asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );

        ul.innerHTML = sorted
          .map(
            (champ) => `
            <li class="favourite-item" data-champion-id="${champ.id}">
              <img
                src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champ.id}_0.jpg"
                alt="${champ.name}"
              />
              <span>${champ.name}</span>
            </li>`
          )
          .join("");
      }

      // re-attach click on each item
      ul.querySelectorAll(".favourite-item").forEach((li) =>
        li.addEventListener("click", () =>
          App.displayChampionsInfo(li.dataset.championId)
        )
      );

      // **ensure tri-button is wired** each time we rebuild
      const triBtn = document.getElementById("tri-button");
      if (triBtn) {
        // remove any existing handler to avoid double-fires
        triBtn.replaceWith(triBtn.cloneNode(true));
        const fresh = document.getElementById("tri-button");
        fresh.addEventListener("click", () => {
          const asc = fresh.dataset.asc === "true";
          fresh.dataset.asc = (!asc).toString();
          fresh.textContent = asc ? "Sort A-Z" : "Sort Z-A";
          App.updateFavouriteList();
        });
      }
    };

    // === UI UTILITIES ===

    /**
     * Toggles modal visibility
     * @param {HTMLElement} modal - Modal element
     */
    static toggleModal = (modal) => modal?.classList?.toggle("show");

    /**
     * Shows modal with message
     * @param {'success'|'error'} type - Modal type
     * @param {string} message - Message to display
     */
    static showModal(type, message) {
      const modalContent = App.modal?.querySelector(".modal-message-content");
      if (!modalContent) return;

      const modalTitle = modalContent.querySelector("h2");
      const modalMessage = modalContent.querySelector("p");

      if (modalTitle)
        modalTitle.innerText = type === "success" ? "Success!" : "Error!";
      if (modalMessage) {
        modalMessage.innerText = message;
        modalMessage.style.color = type === "success" ? "darkgreen" : "darkred";
      }

      App.toggleModal(App.modal);
    }

    static showSuccess = (message) => App.showModal("success", message);
    static showError = (message) => App.showModal("error", message);

    // === EVENT HANDLERS ===

    /**
     * Initializes all event listeners
     */
    static setEventListeners() {
      // Initialisation des écouteurs d'événements
      const closeModalBtn = document.querySelector(".fermer");
      if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () =>
          App.toggleModal(App.modal)
        );
      }

      // Fermer la modale en cliquant sur le fond
      document.addEventListener("click", (e) => {
        if (e.target === App.modal) {
          App.toggleModal(App.modal);
        }
      });

      // Basculer la navigation mobile
      const navToggle = document.getElementById("nav-toggle");
      if (navToggle) {
        navToggle.addEventListener("click", () => {
          const topNav = document.getElementById("site-top-nav");
          topNav?.classList.toggle("show");
          navToggle.classList.toggle("reverse");
          App.adjustMainContainer();
        });
      }

      // Liens de navigation principale
      document.querySelectorAll("#site-top-nav > ul > li").forEach((item) => {
        item.addEventListener("click", () => {
          const url = item.dataset.url;
          if (url) RequestHandler.handleRequest(url);
        });
      });

      // Écouteur délégué pour recherche et filtres
      const main = App.mainContainer;
      main.addEventListener("input", (e) => {
        if (e.target.matches("#search-bar")) {
          const role =
            document.querySelector(".filter-btn.active")?.dataset.role;
          App.displayChampions(role, e.target.value);
        }
      });
      main.addEventListener("click", (e) => {
        // Filtre par rôle
        const filterBtn = e.target.closest(".filter-btn");
        if (filterBtn) {
          const active = document.querySelector(".filter-btn.active");
          const searchVal = document.getElementById("search-bar")?.value || "";
          if (active === filterBtn) {
            active.classList.remove("active");
            App.displayChampions(undefined, searchVal);
          } else {
            active?.classList.remove("active");
            filterBtn.classList.add("active");
            App.displayChampions(filterBtn.dataset.role, searchVal);
          }
          return;
        }

        // Sélection d'un champion pour détails
        const championEl = e.target.closest(".champion");
        if (championEl) {
          App.displayChampionsInfo(championEl.dataset.championId);
          return;
        }

        console.log("Clicked:", e.target);
        // Tri A-Z / Z-A
        if (e.target.id === "tri-button") {
          const btn = e.target;
          const asc = btn.dataset.asc !== "false";
          btn.dataset.asc = !asc;
          btn.textContent = asc ? "Sort Z-A" : "Sort A-Z";
          App.updateFavouriteList();
          return;
        }
      });

      // Vider tous les favoris
      const clearFavBtn = document.querySelector("#clear-favourites");
      if (clearFavBtn) {
        clearFavBtn.addEventListener("click", async () => {
          const list = await FavoriteService.getAll();
          for (const champ of list) {
            await FavoriteService.remove(champ);
          }
          App.updateFavouriteList();
        });
      }

      // Double-clic sur un champion : auto-ajout aux favoris
      main.addEventListener("dblclick", (e) => {
        const champEl = e.target.closest(".champion");
        if (champEl) {
          const champId = champEl.dataset.championId;
          const champ = Object.values(App.champions || {}).find(
            (c) => String(c.id) === String(champId)
          );
          if (champ) {
            FavoriteService.add(champ).then(() => App.updateFavouriteList());
          }
        }
      });

      // Liens qui forcent un rechargement complet
      document.body.addEventListener("click", (e) => {
        const navElem = e.target.closest(".nav-element.no-ajax");
        if (navElem?.dataset.url) {
          window.location.href = navElem.dataset.url;
        }
      });
    }

    // === INITIALIZATION ===

    /**
     * Initializes the application
     */
    static init() {
      console.log("Initializing application...");
      App.mainContainer = document.getElementById("site-main-content");
      App.modal = document.getElementById("modal-message");
      App.setEventListeners();
    }

    /**
     * Adjusts main container positioning
     */
    static adjustMainContainer() {
      const header = document.getElementById("site-header");
      if (header && App.mainContainer) {
        App.mainContainer.style.marginTop = `${header.offsetHeight + 16}px`;
      }
    }
  }

  // Initialize when DOM is ready
  document.addEventListener("DOMContentLoaded", App.init);
  return App;
})();

// === FAVORITES SERVICE ===
export const FavoriteService = {
  STORAGE_KEY: "favouriteChampions",
  USER_KEY: "loggedinUser",

  /**
   * Gets current user from server
   * @return {Promise<Object|null>} - User object or null
   */
  getUser: async () => {
    const res = await fetch("/auth", { credentials: "include" });
    return res.ok ? (await res.json()).user : null;
  },

  /**
   * Gets all favorite champions
   * @return {Promise<Array>} - Array of favorites
   */
  getAll: async () => {
    const user = await FavoriteService.getUser();
    return user?.favourites || [];
  },

  /**
   * Adds champion to favorites
   * @param {Object} champ - Champion to add
   * @return {Promise<boolean>} - Success status
   */
  add: async (champ) => {
    const response = await fetch(`/auth/${encodeURIComponent(champ.id)}`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    if (!response.ok)
      console.error("Add favorite failed:", response.statusText);
    return response.ok;
  },

  /**
   * Removes champion from favorites
   * @param {Object} champ - Champion to remove
   * @return {Promise<boolean>} - Success status
   */
  remove: async (champ) => {
    const response = await fetch(`/auth/${encodeURIComponent(champ.id)}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    if (!response.ok)
      console.error("Remove favorite failed:", response.statusText);
    return response.ok;
  },

  /**
   * Checks if champion is favorited
   * @param {string} id - Champion ID
   * @return {Promise<boolean>} - Favorite status
   */
  isFav: async (id) => {
    const list = await FavoriteService.getAll();
    return list.some((c) => c.id === String(id));
  },
};
