// routes/auth.js
import express from "express";
const router = express.Router();
import { usersStore,championsStore } from "#core/data-stores/index.js";

router.get(['/', '/view', '/view/index'], (req, res) => {
  if (!req.session.user) 
    return res.status(401).end();

  res.json({ user: req.session.user });
});

router.put(['/', '/view', '/view/index'], async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  console.log("PUT /auth", req.body);

  const { favourites } = req.body;
  if (!Array.isArray(favourites)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const allUsers = await usersStore.read();
  const me = allUsers.find(u => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  me.favourites = favourites;
  await usersStore.write(allUsers);
  req.session.user.favourites = favourites;

  res.sendStatus(204);
});

// Add a champion to the user's favorites
router.post('/:championid', async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const champions = await championsStore.read();

   const foundChampion = await champions.find(c => c.id === req.params.championid);
  if (!foundChampion) {
    return res.status(404).send('Champion not found');
  }

  const allUsers = await usersStore.read();
  const me = allUsers.find(u => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  // Only add if not already in favorites
  if (!me.favourites.includes(foundChampion)) {
    me.favourites.push(foundChampion);
    await usersStore.write(allUsers);
    req.session.user.favourites = me.favourites;
  }

  // Return updated list
  res.status(200).json({ favourites: me.favourites });
});

// Remove a champion from the user's favorites
router.delete('/:championId', async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const championId = req.params.championId;
  const champions = await championsStore.read();
  const foundChampion = await champions.find(c => c.id === championId);
  if (!foundChampion) {
    return res.status(404).send('Champion not found');
  }
  const allUsers = await usersStore.read();
  const me = allUsers.find(u => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  // Filter out the champion
  me.favourites = me.favourites.filter(c => c.id !== championId);
  await usersStore.write(allUsers);
  req.session.user.favourites = me.favourites;

  // No content on success
  res.sendStatus(204);
});


export default router;
