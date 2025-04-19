/**
 * Item
 * @typedef {Object} Item
 * @property {number} id - I
 * @property {string} nom - I
 * @property {string} description - I
 * @property {number} poids - I
 */


// === favoriteService.js ===



const App = (() => {
  class App {
    /** @type {HTMLElement} */
    static mainContainer;
    /** @type {HTMLElement} */
    static modal;

    /**@type {[{}]} */
    static champions;

    static HTTP_METHODS = {
      POST: "POST", // CREATE
      GET: "GET", // READ
      PATCH: "PATCH", // UPDATE
      DELETE: "DELETE", // DELETE
    };

    static activeNav(id="Accueil") {
      const nav = document.querySelectorAll("#site-top-nav > ul > li");
      nav.forEach((li) => {
        if (li.id === id) {
          li.classList.add("nav-active");
        } else {
          li.classList.remove("nav-active");
        }
      });
    }

    /**
     * @param {string} route
     * @param {"POST"|"GET"|"PATCH"|"DELETE"} method
     * @param {string|URLSearchParams|FormData} body
     * @return {Object|null}
     */
    static async handleRequest(
      route,
      method = App.HTTP_METHODS.GET,
      body = null,
      pushState = true
    ) {
      const options = {
        method: `${method}`,
        headers: { "X-Requested-With": "XMLHttpRequest" },
      };

      if (body instanceof URLSearchParams) route += `?${body}`;
      if (body !== null && method !== "GET") {
        options.headers["Content-Type"] = "application/json";
        options.body = body;
      }

      const request = new Request(route, options);

      try {
        App.mainContainer.style = "";
        App.mainContainer.className = "";

        App.activeNav();
        
        const response = await fetch(request);
        if (!response.ok) {
          throw new Error(`Une erreur s'est produite: ${response.status}`);
        }
        let responseText = await response.text();
        // Process Response
        switch (true) {
          case route.includes("/accueil") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "acceuil-container";
            App.mainContainer.innerHTML = responseText;
            history.pushState(null, "", route);
            break;
          case route.includes("/apropos") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "apropos-container";
            App.mainContainer.innerHTML = responseText;
            App.activeNav("Apropos");
            history.pushState(null, "", route);
            break;
          case route.includes("/contact") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "contact-container";
            App.mainContainer.innerHTML = responseText;
            App.activeNav("Contact");
            history.pushState(null, "", route);
            break;
          case route.includes("/contact") && method === App.HTTP_METHODS.POST:
            App.mainContainer.className = "contact-container";
            App.mainContainer.innerHTML = responseText;
            App.activeNav("Contact");
            App.showSuccess("Votre message a été envoyé avec succès !");
            history.pushState(null, "", route);
          case route.includes("/items") && method === App.HTTP_METHODS.GET:
            let items = JSON.parse(responseText);
            let tableItems = App.creerTableItems(items);
            App.mainContainer.innerHTML = tableItems;
            history.pushState(null, "", route);
            break;
          case route.includes("/champion") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "site-main-container";
            let champions = JSON.parse(responseText);
            App.champions = champions;
            let tableChampions = App.creerTableChampions(champions);
            App.mainContainer.style = "display:flex";
            App.mainContainer.innerHTML = tableChampions;
            FavoriteService.getAll()
            App.updateFavouriteList();
            App.activeNav("Champion");
            history.pushState(null, "", route);
            break;
          case route.includes("/login") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "login-container";
            App.mainContainer.innerHTML = responseText;
            App.activeNav("Login");
            history.pushState(null, "", route); 
            break;
          case route.includes("/auth") && method === App.HTTP_METHODS.PUT:
            App.mainContainer.className = "login-container";
            App.mainContainer.innerHTML = responseText;
            const user = JSON.parse(responseText);
            if (user) {
              localStorage.setItem("loggedinUser", JSON.stringify(user));
              App.showSuccess("Vous êtes connecté !");
              App.handleRequest("/home/index", App.HTTP_METHODS.GET, null, false);
            } else {
              App.showError("Nom d'utilisateur ou mot de passe incorrect.");
            }
            history.pushState(null, "", route);
            break;
          case route.includes("/profil"):
            App.mainContainer.className = "profil-container";
            App.mainContainer.innerHTML = responseText;
            history.pushState(null, "", route);
            App.activeNav("Login");
            break;
          case route.includes("/items") && method === App.HTTP_METHODS.POST:
          case route.includes("/items") && method === App.HTTP_METHODS.PATCH:
          case route.includes("/items") && method === App.HTTP_METHODS.DELETE:
            const item = JSON.parse(responseText);
            return item;
          default:
            console.warn("route/methode incorrect:", route, method);
            break;
        }
      } catch (error) {
        App.showError(error.message);
        return null;
      }
    }

    /**
     * Render the champions table from an array of Champion objects.
     * @param {Champion[]} championArray
     * @returns {string} HTML for the table
     */
    static creerTableChampions(championArray) {
      return `
      <div id="champion-section">
      <input type="text" id="search-bar" placeholder="Rechercher un champion..." />
      <div id="filter-bar">
        <button class="filter-btn" data-role="Tank">
          <img src="../img/tank.svg" alt="Tank"></img>
        </button>
        <button class="filter-btn" data-role="Mage">
          <img src="../img/mage.svg" alt="Mage"></img>
        </button>
        <button class="filter-btn" data-role="Assassin">
          <img src="../img/assassin.svg" alt="Assassin"></img>
        </button>
        <button class="filter-btn" data-role="Support">
          <img src="../img/support.svg" alt="Support"></img>
        </button>
        <button class="filter-btn" data-role="Marksman">
          <img src="../img/marksman.svg" alt="Marksman"></img>
        </button>
        <button class="filter-btn" data-role="Fighter">
          <img src="../img/Fighter.svg" alt="Fighter"></img>
        </button>
      </div>
      <div id="champion-container">
        ${championArray
          .map((champion) => App.creerTableRowForChampion(champion))
          .join("")}
      </div>
    </div>
    <div id="info-container">
        <p>Sélectionnez un champion pour voir les détails !</p>
    </div>
    `;
    }

    /**
     * Create an HTML table row for a single Champion.
     * @param {Champion} champion
     * @returns {string} HTML string for the table row
     */
    static creerTableRowForChampion(champion) {


      if(champion.id == "Fiddlesticks") {

        champion.id = "FiddleSticks";
      }

      return `
       <div class="champion" data-champion-id="${champion.id}" data-roles="${champion.tags}">
        <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champion.id}_0.jpg" alt="${champion.name}"/>
        <p>${champion.name}</p>
      </div>
    `;
    }

    static displayChampions(filterRole = "All", searchTerm = "") {
      // Get the container element
      const championsContainer = App.mainContainer.querySelector(
        "#champion-container"
      );

      if (!championsContainer) {
        return;
      }

      // On vide le container au début
      championsContainer.innerHTML = "";

      // On initialise une variable pour accumuler le HTML généré
      let htmlRows = "";

      // On parcourt chaque champion de App.champions.
      // Si App.champions est déjà un tableau, Object.values() n'est pas nécessaire.
      Object.values(App.champions).forEach((champion) => {
        // Vérifier si le champion possède le rôle recherché

        if (filterRole === "All" || champion.tags.includes(filterRole)) {
          if (searchTerm !== "") {
            // Vérifier si le nom du champion contient le terme de recherche
            if (champion.id.toLowerCase().includes(searchTerm.toLowerCase())) {
              if (champion.id == "Fiddlesticks") {
                champion.id = "FiddleSticks";
                console.log(champion.id);
              }

              htmlRows += App.creerTableRowForChampion(champion);
            }
          } else {
            htmlRows += App.creerTableRowForChampion(champion);
          }
        }
      });

      // On assigne tout le HTML généré au container une seule fois.
      championsContainer.innerHTML = htmlRows;
    }

    static async displayChampionsInfo(id) {
      // 1️⃣ Trouver le champion en castant les deux cotés en chaîne
      const champ = Object.values(App.champions).find(c => String(c.id) === String(id));
    
      // 2️⃣ Gestion du cas “introuvable”
      if (!champ) {
        console.error(`Champion introuvable pour id=${champ.id}`, App.champions);
        return;
      }
    
      // 3️⃣ Affichage des détails
      const infoContainer = App.mainContainer.querySelector("#info-container");
      const isFav = await FavoriteService.isFav(champ.id);
    
      infoContainer.innerHTML = `
        <div class="champion-card">
          <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champ.id}_0.jpg"
               alt="${champ.name}" class="champion-splash" />
          <h2>${champ.name}</h2>
          <p><strong>Rôle :</strong> ${champ.tags.join(", ")}</p>
          <p><em>${champ.title}</em></p>
          <p>${champ.blurb}</p>
          <button id="favourite-btn" class="${isFav ? 'favourite' : ''}">
            ${isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
          <button id="close-details">Fermer</button>
        </div>
      `;
    
      // 4️⃣ Événements sur les boutons
      document.getElementById("close-details")
        .addEventListener("click", () => {
          infoContainer.innerHTML = `<p>Sélectionnez un champion pour voir les détails !</p>`;
        });
    
       document.getElementById("favourite-btn")
        .addEventListener("click", async () => {
          const isFav = await FavoriteService.isFav(champ.id);
          if (isFav) {
            await FavoriteService.remove(champ);
            console.log("Champion retiré des favoris !");
          } else {
            
            await FavoriteService.add(champ);
            console.log("Champion ajouté aux favoris !");
          }
          App.updateFavouriteList();
          App.displayChampionsInfo(champ.id);  // rafraîchir l’état du bouton
        });
    }
    

    // Met à jour la sidebar
   static  updateFavouriteList = async () => {
      const ul = document.getElementById("favourite-list");
      ul.innerHTML = "";
      let list = await FavoriteService.getAll();
      console.log(list);
      list.sort((a, b) => a.name.localeCompare(b.name));
      list.forEach((champ) => {
        let li = document.createElement("li");
        li.className = "favourite-item";
        li.dataset.championId = champ.id;
  
        let img = document.createElement("img");
        img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/${champ.id}_0.jpg`;
        img.alt = champ.name;
  
        let span = document.createElement("span");
        span.textContent = champ.name;
  
        li.appendChild(img);
        li.appendChild(span);
        // clic pour afficher détails
        li.addEventListener("click", () => App.displayChampionsInfo(champ.id));
        li.appendChild(img);
        ul.appendChild(li);
      });
    };

    // Trie A‑Z / Z‑A
    static toggleSort = () => {
      const btn = document.getElementById("tri-button");
      let asc = btn.dataset.asc !== "false";
      btn.dataset.asc = !asc;
      btn.textContent = asc ? "Trier Z‑A" : "Trier A‑Z";
      App.updateFavouriteList();
    };

    static toggleModal = (modal) => modal?.classList?.toggle("show");

    /**
     * Fonction globale pour afficher des modales.
     * @param {'success'|'error'} type 'success' or 'error'
     * @param {string} message The message to display.
     */
    static showModal(type, message) {
      const modalContent = App.modal?.querySelector(".modal-message-content");
      if (!modalContent) return;
      const modalTitle = modalContent.querySelector("h2");
      const modalMessage = modalContent.querySelector("p");
      if (modalTitle) {
        modalTitle.innerText = type === "success" ? "Succès!" : "Erreur!";
      }
      if (modalMessage) {
        modalMessage.innerText = message;
        modalMessage.style.color = type === "success" ? "darkgreen" : "darkred";
      }
      App.toggleModal(App.modal);
    }

    static showSuccess(message) {
      App.showModal("success", message);
    }

    static showError(message) {
      App.showModal("error", message);
    }

    // static showForbidden(page){
    //     const mainContainer = document.getElementById("site-main-content");
    //     mainContainer.innerHTML = `<h2>${page}</h2><p>Vous devez être enregistré et loggé pour accéder à ce contenu</p>`;
    // }

    static setEventListeners() {
      console.log("Initialisation des EventListeners...");

      // Modal
      const modalCloseButton = document.querySelector(".fermer");
      if (modalCloseButton) {
        modalCloseButton.addEventListener("click", () => {
          App.toggleModal(App.modal);
        });
      }
      window.addEventListener("click", (e) => {
        if (e.target === App.modal) {
          App.toggleModal(App.modal);
        }
      });

      // Navigation mobile
      const toggleButton = document.getElementById("nav-toggle");
      const nav = document.getElementById("site-top-nav");
      if (toggleButton && nav) {
        toggleButton.addEventListener("click", function () {
          nav.classList.toggle("show");
          toggleButton.classList.toggle("reverse");
          App.adjustMainContainer();
        });
      }

      // Navigation générale
      document.querySelectorAll("#site-top-nav > ul > li").forEach((elem) => {
        elem.addEventListener("click", () => {
          const route = elem.dataset.url;
          if (route) App.handleRequest(route);
        });
      });

      // Modification ou Suppression d'éléments de données dans une table ou card html
      App.mainContainer.addEventListener("click", (event) => {
        const target = event.target;
        const table = target.closest("table");
        const card = target.closest(".card");

        if (table) App.handleTableClick(table, target);
      });

      // App
      //Searchbar
      App.mainContainer.addEventListener("input", (event) => {
        const searchBar = event.target;
        const searchValue = searchBar.closest("input");
        const btnActive = document.querySelector(".filter-btn.active");

        if (searchValue.value != null && btnActive != undefined) {
          App.displayChampions(btnActive.dataset.role, searchValue.value);
        } else if (searchValue.value != null) {
          App.displayChampions(undefined, searchValue.value);
        }
      });
      // FilterBar
      App.mainContainer.addEventListener("click", (event) => {
        let btn = event.target.closest(".filter-btn"); // Vérifie si un bouton est cliqué
        if (!btn) return; // Ignore l'événement si ce n'est pas un bouton

        let selectedRole = btn.dataset.role;
        let activeBtn = document.querySelector(".filter-btn.active");
        let searchBar = document.getElementById("search-bar");
        let searchValue = searchBar.value;

        // Si on reclique sur le bouton actif, on affiche "All"
        if (activeBtn === btn) {
          App.displayChampions(undefined, searchValue);
          activeBtn.classList.remove("active"); // Désactive le bouton actif
          return; // On arrête l'exécution ici
        }

        // Sinon, on applique le filtre normal
        App.displayChampions(selectedRole, searchValue);

        // Supprime l'ancienne classe "active" et l'ajoute au bouton sélectionné
        if (activeBtn) activeBtn.classList.remove("active");
        btn.classList.add("active");
      });

      // InfoContainer Click
      App.mainContainer.addEventListener("click", (event) => {
        const el = event.target.closest(".champion");
        if (!el) return;
        App.displayChampionsInfo(el.dataset.championId);
      });

      // Tri
      App.mainContainer.addEventListener("click", (e) => {
        if (e.target.id === "tri-button") App.toggleSort();
      });
    }

    static init() {
      console.log("Initialisation de l'App...");
      App.mainContainer = document.getElementById("site-main-content");
      App.modal = document.getElementById("modal-message");
      // const route = location.hash ? location.hash : "/home/index";
      // App.handleRequest(route);
      App.setEventListeners();

      // App.adjustMainContainer();
    }

    static adjustMainContainer() {
      const header = document.getElementById("site-header");
      const mainContainer = document.getElementById("site-main-content");
      if (header && mainContainer) {
        const headerHeight = header.offsetHeight;
        mainContainer.style.marginTop = headerHeight + 16 + "px";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", App.init);

  return App;
})();

const FavoriteService = {
  STORAGE_KEY: "favouriteChampions",
  USER_KEY:    "loggedinUser",

  getUser: async () => {
    const res = await fetch("/auth", { credentials: 'include' },);
    if (!res.ok) return null;
    const { user } = await res.json();

    return user;
  },

  getAll: async () => {
    const user = await FavoriteService.getUser();
    return await user?.favourites || [];

  },

  add: async (champ) => {
    // ① Call your new POST /profil/favourites/:championId
    const response = await fetch(
      `/auth/${encodeURIComponent(champ.id)}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    if (!response.ok) {
      console.error('Error adding favourite:', response.statusText);
      return false;
    }
  
    return true;
  },
  

  remove: async (champ) => {
      // ① Call your new POST /profil/favourites/:championId
      const response = await fetch(
        `/auth/${encodeURIComponent(champ.id)}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      if (!response.ok) {
        console.error('Error adding favourite:', response.statusText);
        return false;
      }
    
      return true;
    },
  

  isFav: async (id) => {
    const list = await FavoriteService.getAll();
    return  list.some(c => c.id === String(id));
  }
};

