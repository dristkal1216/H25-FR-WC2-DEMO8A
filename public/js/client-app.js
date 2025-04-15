/**
 * Item
 * @typedef {Object} Item
 * @property {number} id - I
 * @property {string} nom - I
 * @property {string} description - I
 * @property {number} poids - I
 */

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
            history.pushState(null, "", route);
            break;
          case route.includes("/contact") && method === App.HTTP_METHODS.GET:
            App.mainContainer.className = "contact-container";
            App.mainContainer.innerHTML = responseText;
            history.pushState(null, "", route);
            break;
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
            history.pushState(null, "", route);
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

      // On vide le container au début
      championsContainer.innerHTML = "";

      // On initialise une variable pour accumuler le HTML généré
      let htmlRows = "";

      // On parcourt chaque champion de App.champions.
      // Si App.champions est déjà un tableau, Object.values() n'est pas nécessaire.
      Object.values(App.champions).forEach((champion) => {
        // Vérifier si le champion possède le rôle recherché

        
          if (champion.id.toLowerCase() == "fiddlesticks") {
            champion.id = "FiddleSticks";
          }

        if (filterRole === "All" || champion.tags.includes(filterRole)) {
          if (searchTerm !== "") {
            // Vérifier si le nom du champion contient le terme de recherche
            if (champion.id.toLowerCase().includes(searchTerm.toLowerCase())) {
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
    /**
     * Extract a Champion object from the given table row.
     * @param {HTMLElement} targetTableRow
     * @returns {Object} The champion data object
     */
    static getObjectFromTableRow(targetTableRow) {
      let obj = {};
      const dataId = targetTableRow.dataset?.id ?? null;
      obj.id = dataId;
      const tableRowData = targetTableRow.querySelectorAll("td[data-key]");
      tableRowData.forEach((elem) => {
        const key = elem.dataset.key;
        // Get value from an input or textarea if present, otherwise use trimmed text.
        const value =
          elem.querySelector("input, textarea")?.value ?? elem.innerText.trim();
        // Convert comma-separated tags back into an array
        obj[key] =
          key === "tags" ? value.split(",").map((tag) => tag.trim()) : value;
      });
      return obj;
    }

    /** @param {Item[]} itemArray */
    static creerTableItems = (itemArray) => {
      return `
                <table data-table-for="items">
                    <thead>
                        <tr>
                            <th style="width:35%"> Nom </th>
                            <th style="width:35%"> Description </th>
                            <th style="width:20%"> Poids </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemArray
                          .map((item) => App.creerTableRowForItem(item))
                          .join("")}
                    </tbody>
                </table>
            `;
    };

    /** @param {Item} item */
    static creerTableRowForItem(item) {
      return `
                <tr data-id=${item.id}>
                    <td style="max-width:35%" class="td-input" data-key="nom" data-input="text"> ${
                      item.nom
                    } </td>
                    <td style="max-width:35%" class="td-input" data-key="description" data-input="textarea"> ${
                      item.description
                    } </td>
                    <td style="max-width:20%" class="td-input" data-key="poids" data-input="number" data-min="0" data-step="0.5"> ${Number(
                      item.poids
                    ).toFixed(1)} </td>
                    <td style="max-width:5%" class="btn-inside"> <span class="btn-modify"> ✏️ </span> </td>
                    <td style="max-width:5%" class="btn-inside"> <span class="btn-delete"> 🗑️ </span> </td>
                </tr>
            `;
    }

    // /**
    //  * @param {HTMLElement} targetTableRow
    //  * @returns {Object}
    //  */
    // static getObjectFromTableRow(targetTableRow){
    //     let obj = {};
    //     const dataId = targetTableRow.dataset?.id ?? null;
    //     obj.id = dataId;
    //     let tableRowData = targetTableRow.querySelectorAll('td[data-key]');
    //     tableRowData.forEach(elem => {
    //         const key = elem.dataset.key;
    //         const value = elem.querySelector('input, textarea')?.value ?? elem.value;
    //         obj[key] = value;
    //     });
    //     return obj;
    // }

    /**
     * @param {string} tableFor
     * @param {HTMLElement} targetTableRow
     */
    static handleTableModify(tableFor, targetTableRow) {
      const btnModify = targetTableRow.querySelector(".btn-modify");
      const btnDelete = targetTableRow.querySelector(".btn-delete");
      btnModify.className = btnModify.className.replace(
        "btn-modify",
        "btn-cancel"
      );
      btnModify.textContent = "❌";
      btnDelete.className = btnDelete.className.replace(
        "btn-delete",
        "btn-save"
      );
      btnDelete.textContent = "💾";

      const dataId = targetTableRow.dataset.id;
      const dataElem = targetTableRow.querySelectorAll("td[data-key]");
      let dataObj = {};
      dataObj.id = dataId;
      dataElem.forEach((elem) => {
        const currentValue = elem.textContent.trim();
        dataObj[elem.dataset.key] = currentValue;
        const inputType = elem.dataset.input;
        let input;
        switch (inputType) {
          case "text":
            input = document.createElement("input");
            input.type = inputType;
            break;
          case "textarea":
            input = document.createElement("textarea");
            input.style.resize = "vertical";
            input.style.maxHeight = "20vh";
            break;
          case "number":
            input = document.createElement("input");
            input.type = inputType;
            break;
          case "file":
            input = document.createElement("input");
            input.type = inputType;
            break;
        }

        input.value = currentValue;
        elem.textContent = "";
        elem.appendChild(input);
      });
      targetTableRow.dataset.oldValue = JSON.stringify(dataObj);
    }

    // /**
    //  * @param {string} tableFor
    //  * @param {HTMLElement} targetTableRow
    //  */
    // static handleTableCancel(tableFor, targetTableRow){
    //     const oldValue = JSON.parse(targetTableRow.dataset.oldValue);
    //     let tableRow;
    //     switch(tableFor){
    //         case "items":
    //             tableRow = this.creerTableRowForItem(oldValue);
    //         break;
    //     }
    //     targetTableRow.outerHTML = tableRow;
    // }

    // /**
    //  * @param {string} tableFor
    //  * @param {HTMLElement} targetTableRow
    //  */
    // static async handleTableSave(tableFor, targetTableRow){
    //     const dataId = targetTableRow.dataset.id;
    //     let newValue = App.getObjectFromTableRow(targetTableRow);
    //     let method = dataId ? 'PATCH' : 'POST';
    //     try {
    //         const response = await fetch(`/${tableFor}/${dataId}`, {
    //             method: `${method}`,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(newValue)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error updating item: ${response.statusText}`);
    //         }

    //         const updatedItem = await response.json();
    //         let tableRow;
    //         switch(tableFor){
    //             case 'items':
    //                 tableRow = App.creerTableRowForItem(updatedItem);
    //             break;
    //         }
    //         targetTableRow.outerHTML = tableRow;
    //         console.log('Item updated successfully:', updatedItem);
    //         // Optionally update your UI or application state here.
    //     } catch (error) {
    //         console.error('Error patching item:', error);
    //     }
    // }

    // /**
    //  * @param {string} tableFor
    //  * @param {HTMLElement} targetTableRow
    //  */
    // static async handleTableDelete(tableFor, targetTableRow){
    //     const dataId = targetTableRow.dataset.id;
    //     let method = 'delete';
    //     try {
    //         const response = await fetch(`/${tableFor}/${dataId}`, {
    //             method: `${method}`,
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error(`Error deleting item: ${response.statusText}`);
    //         }

    //         const deletedItem = await response.json();
    //         targetTableRow.remove();
    //         console.log('Item deleted successfully:', deletedItem);
    //         // Optionally update your UI or application state here.
    //     } catch (error) {
    //         console.error('Error deleting item:', error);
    //     }
    // }

    /**
     * @param {HTMLElement} table
     * @param {HTMLElement} target
     */
    static async handleTableClick(table, target) {
      const tableFor = table.dataset.tableFor;
      const targetClass = target.className;
      const targetTableRow = target.closest("tr");
      let jsObj;
      let method;
      let route;
      let response;

      if (targetClass.includes("btn")) {
        switch (true) {
          case targetClass.includes("modify"):
            App.handleTableModify(tableFor, targetTableRow);
            break;
          case targetClass.includes("cancel"):
            // App.handleTableCancel(tableFor, targetTableRow);
            const oldValue = JSON.parse(targetTableRow.dataset.oldValue);
            let tableRow;
            switch (tableFor) {
              case "items":
                tableRow = this.creerTableRowForItem(oldValue);
                break;
            }
            targetTableRow.outerHTML = tableRow;
            break;
          case targetClass.includes("save"):
            // App.handleTableSave(tableFor, targetTableRow);
            jsObj = App.getObjectFromTableRow(targetTableRow);
            route = `/${tableFor}`;
            if (jsObj.id) {
              method = App.HTTP_METHODS.PATCH;
              route += `/${jsObj.id}`;
            } else {
              method = App.HTTP_METHODS.POST;
            }

            response = await App.handleRequest(
              route,
              method,
              JSON.stringify(jsObj),
              false
            );

            if (response) {
              let tableRow;
              switch (tableFor) {
                case "items":
                  tableRow = App.creerTableRowForItem(response);
                  break;
              }
              targetTableRow.outerHTML = tableRow;
            }
            break;
          case targetClass.includes("delete"):
            // App.handleTableDelete(tableFor, targetTableRow);
            jsObj = App.getObjectFromTableRow(targetTableRow);
            route = `/${tableFor}/${jsObj.id}`;
            method = App.HTTP_METHODS.DELETE;

            response = await App.handleRequest(
              route,
              method,
              JSON.stringify(jsObj),
              false
            );
            if (response) {
              targetTableRow.remove();
            }
            break;
        }
      }
    }

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


        if (searchValue.value != null && btnActive != undefined ) {
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
          App.displayChampions(undefined,searchValue);
          activeBtn.classList.remove("active"); // Désactive le bouton actif
          return; // On arrête l'exécution ici
        }

        // Sinon, on applique le filtre normal
        App.displayChampions(selectedRole,searchValue);

        // Supprime l'ancienne classe "active" et l'ajoute au bouton sélectionné
        if (activeBtn) activeBtn.classList.remove("active");
        btn.classList.add("active");
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
