import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { usersStore } from "#core/data-stores/index.js";
import { renderWithLayout } from "#views/shared/renderWithLayout.js";
import ProfileView from "#views/profil/index.js";

const router = express.Router();

// Multer : stocke dans public/img/avatar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public", "img", "avatar");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `avatar_${req.session.user.id}_${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

/**
 * GET /profil
 * Renvoie soit le fragment de profil (XHR), soit la page complète.
 */
router.get("/", async (req, res, next) => {
  try {
    // si non authentifié, redirige vers login
    if (!req.session.user) {
      return res.redirect("/login");
    }
    // renderWithLayout va renvoyer le fragment ou la page complète
    await renderWithLayout(req, res, ProfileView, req.session.user);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /profil/avatar
 * Téléverse le fichier, met à jour l’avatar et redirige vers le profil.
 */
router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }
    if (!req.file) {
      return res.status(400).send("Aucun fichier reçu");
    }

    const allUsers = await usersStore.read();
    const me = allUsers.find((u) => u.id === req.session.user.id);
    if (!me) {
      return res.sendStatus(404);
    }

    const avatarPath = `/img/avatar/${req.file.filename}`;
    me.avatar = avatarPath;
    req.session.user.avatar = avatarPath;

    await usersStore.write(allUsers);
    res.redirect("/profil");
  } catch (err) {
    next(err);
  }
});

/**
 * POST /profil/password
 * Change le mot de passe de l’utilisateur et redirige.
 */
router.post("/password", async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      // tous les champs sont requis
      return res.status(400).send("Veuillez remplir tous les champs");
    }

    const allUsers = await usersStore.read();
    const me = allUsers.find((u) => u.id === req.session.user.id);
    if (!me) {
      return res.sendStatus(404);
    }

    if (me.password !== oldPassword) {
      // ancien mot de passe incorrect
      return res.status(400).send("Ancien mot de passe incorrect");
    }

    me.password = newPassword;
    await usersStore.write(allUsers);

    // redirection vers le profil après changement
    res.redirect("/profil");
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /profil/favourites
 * Met à jour la liste des favoris de l’utilisateur.
 * Renvoie 204 ou 401/400 selon le cas.
 */
router.put("/favourites", async (req, res, next) => {
  try {
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
    req.session.user.favourites = favourites;
    await usersStore.write(allUsers);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
