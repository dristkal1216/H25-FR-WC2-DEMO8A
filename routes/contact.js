import express from "express";
import ContactIndexView from "#views/contact/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";

const router = express.Router();

/**
 * Affiche le formulaire de contact ou renvoie son fragment HTML.
 */
router.get(["/", "/index"], async (req, res, next) => {
  try {
    await renderWithLayout(req, res, ContactIndexView);
  } catch (err) {
    next(err);
  }
});

/**
 * Reçoit les données du formulaire, loggue email et message,
 * puis ré-affiche le formulaire (AJAX ou page complète).
 */
router.post(["/", "/index"], async (req, res, next) => {
  try {
    const { email, message } = req.body;
    console.log("email =", email);
    console.log("message =", message);

    // ici on pourrait valider et envoyer un mail, enregistrer, etc.

    await renderWithLayout(req, res, ContactIndexView);
  } catch (err) {
    next(err);
  }
});

export default router;
