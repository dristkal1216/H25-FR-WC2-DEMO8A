// views/shared/renderWithLayout.js
import SharedLayoutView from "#views/shared/layout.js";

/**
 * Affiche soit un fragment HTML, soit la page complète selon le type de requête.
 *
 * @param {Request}    req        L’objet requête Express
 * @param {Response}   res        L’objet réponse Express
 * @param {Function}   ViewClass  Constructeur de la vue spécifique à la page
 * @param {...any}     viewArgs   Arguments éventuels pour le constructeur
 */
export async function renderWithLayout(req, res, ViewClass, ...viewArgs) {
  // Génère le contenu spécifique
  let content = new ViewClass(...viewArgs).render();
  if (content && typeof content.outerHTML === "string") {
    content = content.outerHTML;
  }

  // Pour une requête AJAX, on renvoie uniquement le fragment
  if (req.xhr) {
    return res.send(content);
  }

  // Sinon, on enveloppe dans le layout avec l’utilisateur connecté
  let fullPage = new SharedLayoutView(content, res.locals.user).render();
  if (fullPage && typeof fullPage.outerHTML === "string") {
    fullPage = fullPage.outerHTML;
  }
  res.send(fullPage);
}
