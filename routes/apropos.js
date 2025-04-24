import express from "express";
import AproposIndexView from "#views/apropos/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";

const router = express.Router();

router.get(["/", "/index"], async (req, res, next) => {
  try {
    // renderWithLayout se charge de renvoyer
    // soit le fragment (XHR), soit la page complète
    await renderWithLayout(req, res, AproposIndexView);
  } catch (err) {
    next(err);
  }
});

export default router;
