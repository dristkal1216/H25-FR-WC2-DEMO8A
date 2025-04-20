import express from "express";
import { usersStore } from "#core/data-stores/index.js";
import LoginIndexView from "#views/login/index.js";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";

const router = express.Router();

// GET  /login  → show the form (with any flash error)
router.get(["/", "/view", "/view/index"], (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const pageContent = new LoginIndexView({ error }).render();
  if (req.xhr) {
    return res.send(pageContent);
  }
  return res.send(new SharedLayoutView(pageContent).render());
});

// POST /login  → process credentials
router.post(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ basic validation
    if (!username?.trim() || !password) {
      console.log("login failed", username, password);
      req.session.error = "Veuillez saisir nom d’utilisateur et mot de passe.";
      return res.redirect("/login");
    }

    // 2️⃣ lookup
    const users = await usersStore.read();
    const found = users.find((u) => u.username === username.trim());
    if (!found || found.password !== password) {
      console.log("login failed", username, password);
      req.session.error = "Utilisateur ou mot de passe incorrect.";
      return res.redirect("/login");
    }

    // 3️⃣ prevent session fixation
    req.session.regenerate((err) => {
      if (err) return next(err);
      console.log("session regenerated", req.session.id);
      // store only what you need
      req.session.user = {
        id: found.id,
        username: found.username,
        // optionally pull in favourites if you synced them server‑side
        favourites: found.favourites || [],
      };
      delete req.session.error;

      // 4️⃣ persist & redirect
      req.session.save((err) => {
        if (err) return next(err);
        console.log("session saved", req.session.user);
        const pageContent = new ProfileView(req.session.user).render();
        const fullPage = new SharedLayoutView(pageContent).render();
        res.send(fullPage);
      });
    });
  } catch (err) {
    next(err);
  }
});

export default router;
