import express from "express";
import session from "express-session";
import { championsStore, usersStore } from "#core/data-stores/index.js";
import ChampionsIndexView from "#views/champion/index.js";
import SharedLayoutView from "#views/shared/layout.js";

const router = express.Router();

router.get(["/", "/view", "view/index"], async (req, res, next) => {
  const champions = await championsStore.read();

  if (req.get("X-Requested-With") === "XMLHttpRequest") {
    return res.json(champions);
  }

  const pageContent = new ChampionsIndexView(champions).render();

  const fullPage = new SharedLayoutView(pageContent, req.locals?.user).render();
  res.send(fullPage);
});

router.post(["", "/view", "/view/index"], async (req, res, next) => {
  const id = req.body.id;
  const champion = await championsStore.read();

  const championData = champion.find((champion) => champion.id === id);
  if (!championData) {
    return res.status(404).send("Champion not found");
  }

  usersStore.write(championData);

  const pageContent = new ChampionsIndexView().render();

  const fullPage = new SharedLayoutView(pageContent, req.locals.user).render();
});

export default router;
