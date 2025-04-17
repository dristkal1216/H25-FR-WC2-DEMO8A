import express from "express";
import { usersStore } from "#core/data-stores/index.js";
import LoginIndexView from "#views/login/index.js";
import ProfileView from "#views/profil/index.js";
import SharedLayoutView from "#views/shared/layout.js";

const router = express.Router();

// Affiche le formulaire
router.get(["/", "/view", "view/index"], (req, res) => {
  const pageContent = new LoginIndexView().render();

    
  if (req.get("X-Requested-With") === "XMLHttpRequest") {
    return res.send(pageContent);
  }

  const fullpage = new SharedLayoutView(pageContent).render();
  res.send(fullpage);
});

// Traite la soumission
router.post(["/", "/view", "view/index"], async (req, res) => {
  const { username, password } = req.body;
  const user = await usersStore.read();

  // On cherche l'utilisateur dans le magasin
  const foundUser = user.find((u) => u.username === username);
  console.log("foundUser", foundUser);
  if (foundUser && foundUser.password === password) {
    delete req.session.error;
    // On ne stocke pas le mot de passe en session
    req.session.user = { id: foundUser.id, username: foundUser.username };
    return res.redirect("/profil");
  }

  req.session.error = "Utilisateur ou mot de passe incorrect.";
  res.redirect("/login");
});

export default router;
