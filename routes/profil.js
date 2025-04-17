// routes/profil.js
import express from "express";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";
import { usersStore } from "#core/data-stores/index.js";

const router = express.Router();

// GET /profil  → protected profile page
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  const pageContent = new ProfileView({ user: req.session.user }).render();
  if (req.xhr) return res.send(pageContent);
  res.send(new SharedLayoutView(pageContent).render());
});

// PUT /profil/favourites  → sync favourites to server
router.put("/favourites", async (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const { favourites } = req.body;
  if (!Array.isArray(favourites)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  // update JSON store
  const allUsers = await usersStore.read();
  const me = allUsers.find(u => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }

  me.favourites = favourites;
  await usersStore.write(allUsers);

  // update session copy
  req.session.user.favourites = favourites;
  res.sendStatus(204);
});

export default router;
