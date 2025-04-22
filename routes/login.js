import express from "express";
import { usersStore } from "#core/data-stores/index.js";
import LoginIndexView from "#views/login/index.js";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";

const router = express.Router();

// GET /login → show login form (with optional flash error)
router.get(["/", "/view", "/view/index"], (req, res) => {
  const error = req.session.error;
  delete req.session.error;

  const pageContent = new LoginIndexView({ error }).render();

  if (req.xhr) return res.send(pageContent);

  res.send(
    new SharedLayoutView(pageContent, req.session.user || null).render()
  );
});

// POST /login → process login form
router.post(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1️⃣ Validate input
    if (!username?.trim() || !password) {
      req.session.error = "Veuillez saisir nom d’utilisateur et mot de passe.";
      return res.redirect("/login");
    }

    // 2️⃣ Find user
    const users = await usersStore.read();
    const found = users.find((u) => u.username === username.trim());

    if (!found || found.password !== password) {
      req.session.error = "Utilisateur ou mot de passe incorrect.";
      return res.redirect("/login");
    }

    // 3️⃣ Regenerate session to prevent fixation
    req.session.regenerate((err) => {
      if (err) return next(err);

      // 4️⃣ Store only required data in session
      req.session.user = {
        id: found.id,
        username: found.username,
        email: found.email || "",
        avatar: found.avatar || "",
        favourites: found.favourites || [],
      };

      delete req.session.error;

      console.log("Session user:", found);

      // 5️⃣ Render profile view with full user info (not just session)
      const pageContent = new ProfileView(found).render();

      // 6️⃣ Save session and return full layout
      req.session.save((err) => {
        if (err) return next(err);

        const fullPage = new SharedLayoutView(
          pageContent,
          req.session.user
        ).render();
        res.send(fullPage);
      });
    });
  } catch (err) {
    next(err);
  }
});

export default router;
