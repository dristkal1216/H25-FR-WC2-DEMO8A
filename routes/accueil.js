import express from "express";
import AccueilIndexView from "#views/accueil/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";

const router = express.Router();

// Exemple d’utilisation dans un routeur :
router.get(["/", "/index"], async (req, res, next) => {
  try {
    await renderWithLayout(req, res, AccueilIndexView);
  } catch (err) {
    next(err);
  }
});

export default router;
