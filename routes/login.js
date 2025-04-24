import express from "express";
import { usersStore } from "#core/data-stores/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";
import LoginIndexView from "#views/login/index.js";

const router = express.Router();

/**
 * Affiche le formulaire de connexion (ou son fragment AJAX),
 * en passant un éventuel message d’erreur.
 */
router.get(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    // on récupère et vide le message d’erreur en session
    const error = req.session.error;
    delete req.session.error;

    // on affiche soit le fragment, soit la page complète
    await renderWithLayout(req, res, LoginIndexView, { error });
  } catch (err) {
    next(err);
  }
});

/**
 * Traite le POST du formulaire de connexion.
 * - en cas d’erreur d’input ou d’authentification, on stocke le message
 *   en session et on redirige vers GET /login
 * - en cas de succès, on régénère la session et on redirige vers /profil
 */
router.post(["/", "/view", "/view/index"], async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // validation basique
    if (!username?.trim() || !password) {
      req.session.error = "Veuillez saisir nom d’utilisateur et mot de passe.";
      return res.redirect("/login");
    }

    // recherche de l’utilisateur
    const users = await usersStore.read();
    const found = users.find((u) => u.username === username.trim());

    if (!found || found.password !== password) {
      req.session.error = "Utilisateur ou mot de passe incorrect.";
      return res.redirect("/login");
    }

    // prévention fixation de session
    req.session.regenerate((err) => {
      if (err) return next(err);

      // on ne stocke que l’essentiel
      req.session.user = {
        id: found.id,
        username: found.username,
        email: found.email || "",
        avatar: found.avatar || "",
        favourites: found.favourites || [],
      };
      delete req.session.error;

      // on sauvegarde la session avant la redirection
      req.session.save((err) => {
        if (err) return next(err);
        res.redirect("/profil");
      });
    });
  } catch (err) {
    next(err);
  }
});

export default router;
