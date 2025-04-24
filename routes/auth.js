import express from "express";
import { usersStore, championsStore } from "#core/data-stores/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";
import AccueilIndexView from "#views/accueil/index.js";

const router = express.Router();

/**
 * Renvoie les informations de l’utilisateur connecté
 */
router.get(["/", "/view", "/view/index"], (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  res.json({ user: req.session.user });
});

/**
 * Détruit la session et revient à l’accueil
 */
router.get("/logout", async (req, res, next) => {
  try {
    // suppression de la session
    await new Promise((resolve, reject) =>
      req.session.destroy((err) => (err ? reject(err) : resolve()))
    );
    res.clearCookie("connect.sid", { path: "/" });

    // affichage selon type de requête (XHR = fragment, sinon page complète)
    await renderWithLayout(req, res, AccueilIndexView);
  } catch (err) {
    next(err);
  }
});

/**
 * Met à jour la liste des favoris de l’utilisateur
 */
router.put(["/", "/view", "/view/index"], async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const { favourites } = req.body;
  if (!Array.isArray(favourites)) {
    return res.status(400).json({ error: "Payload invalide" });
  }

  const allUsers = await usersStore.read();
  const me = allUsers.find((u) => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  me.favourites = favourites;
  await usersStore.write(allUsers);
  req.session.user.favourites = favourites;

  res.sendStatus(204);
});

/**
 * Ajoute un champion aux favoris
 */
router.post("/:championId", async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const champions = await championsStore.read();
  const foundChampion = champions.find((c) => c.id === req.params.championId);
  if (!foundChampion) {
    return res.status(404).send("Champion non trouvé");
  }

  const allUsers = await usersStore.read();
  const me = allUsers.find((u) => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  if (!me.favourites.some((c) => c.id === foundChampion.id)) {
    me.favourites.push(foundChampion);
    await usersStore.write(allUsers);
    req.session.user.favourites = me.favourites;
  }

  res.status(200).json({ favourites: me.favourites });
});

/**
 * Retire un champion des favoris
 */
router.delete("/:championId", async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const championId = req.params.championId;
  const champions = await championsStore.read();
  if (!champions.find((c) => c.id === championId)) {
    return res.status(404).send("Champion non trouvé");
  }

  const allUsers = await usersStore.read();
  const me = allUsers.find((u) => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  me.favourites = me.favourites.filter((c) => c.id !== championId);
  await usersStore.write(allUsers);
  req.session.user.favourites = me.favourites;

  res.sendStatus(204);
});

export default router;
