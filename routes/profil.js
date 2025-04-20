// routes/profil.js
import express from "express";
import multer from "multer";
import SharedLayoutView from "#views/shared/layout.js";
import ProfileView from "#views/profil/index.js";
import { usersStore } from "#core/data-stores/index.js";

const router = express.Router();

// Configuration de Multer pour le téléversement de fichier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../img/avatar/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const filename = `avatar_${req.session.user.id}_${Date.now()}.${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// GET /profil  → protected profile page
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  console.log("Session utilisateur :", req.session.user);

  const pageContent = new ProfileView(req.session.user).render();
  console.log("Profil de l'utilisateur :", req.session.user);
  if (req.xhr) return res.send(pageContent);
  res.send(new SharedLayoutView(pageContent).render());
});

// POST /profil/avatar  → réception et traitement du fichier avatar
router.post("/avatar", upload.single("avatar"), async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  if (!req.file) {
    return res.status(400).send("Aucun fichier reçu");
  }

  // Mettre à jour le chemin de l'avatar dans le stockage JSON
  const allUsers = await usersStore.read();
  const me = allUsers.find((u) => u.id === req.session.user.id);
  if (!me) {
    return res.sendStatus(404);
  }
  // Stocker le chemin relatif pour affichage
  const avatarPath = `../img/avatar/${req.file.filename}`;
  me.avatar = avatarPath;
  await usersStore.write(me);

  // Mettre à jour la session
  req.session.user.avatar = avatarPath;

  // Rediriger vers la page profil
  res.redirect("/profil");
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
  const me = allUsers.find((u) => u.id === req.session.user.id);
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
