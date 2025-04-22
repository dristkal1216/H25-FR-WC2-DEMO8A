import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { usersStore } from "#core/data-stores/index.js";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";

const router = express.Router();

// Configuration Multer (avatar → public/img/avatar)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public", "img", "avatar");
    fs.mkdirSync(dir, { recursive: true }); // crée le dossier si inexistant
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${req.session.user.id}_${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

/**
 * GET /profil → page de profil protégée
 */
router.get("/", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const pageContent = new ProfileView(req.session.user).render();

  if (req.xhr) return res.send(pageContent);
  return res.send(new SharedLayoutView(pageContent, req.session.user).render());
});

/**
 * POST /profil/avatar → téléversement de l’avatar
 */
router.post("/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  if (!req.file) return res.status(400).send("Aucun fichier reçu");

  const allUsers = await usersStore.read();
  const user = allUsers.find((u) => u.id === req.session.user.id);
  if (!user) return res.sendStatus(404);

  const avatarPath = `/img/avatar/${req.file.filename}`;
  user.avatar = avatarPath;
  req.session.user.avatar = avatarPath;

  await usersStore.write(allUsers);
  res.redirect("/profil");
});

/**
 * PUT /profil/favourites → mise à jour des favoris
 */
router.put("/favourites", async (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const { favourites } = req.body;
  if (!Array.isArray(favourites)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const allUsers = await usersStore.read();
  const user = allUsers.find((u) => u.id === req.session.user.id);
  if (!user) return res.sendStatus(404);

  user.favourites = favourites;
  req.session.user.favourites = favourites;

  await usersStore.write(allUsers);
  res.sendStatus(204);
});

export default router;
