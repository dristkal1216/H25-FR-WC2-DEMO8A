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
        const response = await fetch(request);
        if (!response.ok) {
          throw new Error(`Une erreur s'est produite: ${response.status}`);
        }
        let responseText = await response.text();
        console.log(route, method, responseText);
        // Process Response
        switch (true) {
          case route.includes("/accueil") && method === App.HTTP_METHODS.GET:
            App.mainContainer.innerHTML = responseText;
            history.pushState(null, "", route);
            break;
          case route.includes("/apropos") && method === App.HTTP_METHODS.GET:
            App.mainContainer.innerHTML = responseText;
            history.pushState(null, "", route);
            break;
          case route.includes("/contact") && method === App.HTTP_METHODS.GET:
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
            let champions = JSON.parse(responseText);
            let tableChampions = App.creerTableChampions(champions);
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
        <table data-table-for="champions">
            <thead>
                <tr>
                    <th style="width:20%"> Name </th>
                    <th style="width:20%"> Title </th>
                    <th style="width:30%"> Blurb </th>
                    <th style="width:15%"> Tags </th>
                    <th style="width:15%"> Partype </th>
                    <th style="width:5%"></th>
                    <th style="width:5%"></th>
                </tr>
            </thead>
            <tbody>
                ${championArray
          .map((champion) =>
            App.creerTableRowForChampion(champion)
          )
          .join("")}
            </tbody>
        </table>
    `;
    }

    /**
     * Create an HTML table row for a single Champion.
     * @param {Champion} champion
     * @returns {string} HTML string for the table row
     */
    static creerTableRowForChampion(champion) {
      return `
        <tr data-id="${champion.id}" data-roles='${JSON.stringify(
        champion.tags
      )}'>
            <td style="max-width:20%" class="td-input" data-key="name" data-input="text"> ${champion.name
        } 
        </tr>
    `;
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
                    <td style="max-width:35%" class="td-input" data-key="nom" data-input="text"> ${item.nom
        } </td>
                    <td style="max-width:35%" class="td-input" data-key="description" data-input="textarea"> ${item.description
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
    //     const mainContainer = document.getElementById("main-container");
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

      window.addEventListener("popstate", (event) => {
        // console.log('Popstate!');
        // console.log('URL:', document.location.href);
        // console.log('Event State object:', event.state);
        // console.log('History State object:', history.state);
        // console.log('Location:', document.location);
        // App.handleRequest(location.hash, false);
      });

      // document.getElementById("explore-btn").addEventListener("click", () => {
      //   let activeNav = document.querySelector(".nav-element.nav-active");
      //   if (activeNav) activeNav.classList.remove("nav-active");
      //   let navBtn = document.querySelector(".nav-element[value='3']");
      //   if (navBtn) navBtn.classList.add("nav-active");
      // });
    }

    static init() {
      console.log("Initialisation de l'App...");
      App.mainContainer = document.getElementById("main-container");
      App.modal = document.getElementById("modal-message");
      // const route = location.hash ? location.hash : "/home/index";
      // App.handleRequest(route);
      App.setEventListeners();

      // App.adjustMainContainer();
    }

    static adjustMainContainer() {
      const header = document.getElementById("site-header");
      const mainContainer = document.getElementById("main-container");
      if (header && mainContainer) {
        const headerHeight = header.offsetHeight;
        mainContainer.style.marginTop = headerHeight + 16 + "px";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", App.init);

  return App;
})();
