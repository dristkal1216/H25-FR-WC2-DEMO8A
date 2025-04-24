import express from "express";
import { championsStore, usersStore } from "#core/data-stores/index.js";
import ChampionsIndexView from "#views/champion/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";

const router = express.Router();

/**
 * Affiche la liste des champions (JSON pour XHR, sinon page complète)
 */
router.get(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    const champions = await championsStore.read();
    if (req.xhr) {
      return res.json(champions);
    }
    await renderWithLayout(req, res, ChampionsIndexView, champions);
  } catch (err) {
    next(err);
  }
});

/**
 * Reçoit un POST pour sélectionner/traiter un champion donné
 * - Si XHR → renvoie le champion JSON
 * - Sinon → re-render la page des champions
 */
router.post(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    const { id } = req.body;
    const champions = await championsStore.read();

    // Recherche du champion
    const championData = champions.find((c) => c.id === id);
    if (!championData) {
      return res.status(404).send("Champion non trouvé");
    }

    // Exemple de traitement : on enregistre quelque part (ici le store)
    // await usersStore.write(championData);

    // Pour une requête AJAX, on renvoie directement l’objet JSON
    if (req.xhr) {
      return res.json(championData);
    }

    // Sinon, on ré-affiche la page des champions
    await renderWithLayout(req, res, ChampionsIndexView, champions);
  } catch (err) {
    next(err);
  }
});

export default router;
