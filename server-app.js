// ─── Imports ESModule en haut ───────────────────────────────────────────────
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import routeAccueil from "#routes/accueil.js";
import routeItems from "#routes/items.js";
import routeApropos from "#routes/apropos.js";
import routeContact from "#routes/contact.js";
import routeChampion from "#routes/champion.js";
import routeLogin from "#routes/login.js";
import routeProfil from "#routes/profil.js";
import routeAuth from "#routes/auth.js";

// ─── Configuration de l’environnement ──────────────────────────────────────
dotenv.config();
const port = process.env.PORT || 3001;

// ─── Simuler __dirname ─────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Création de l’app Express ─────────────────────────────────────────────
const app = express();

// ─── Middlewares globaux ───────────────────────────────────────────────────
// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86_400_000, // 1 jour
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

// Parser JSON et urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (pour inclure les cookies côté client)
app.use(cors({ origin: true, credentials: true }));

// Exposer les fichiers statiques (CSS, JS client, images…)
app.use(express.static(path.join(__dirname, "public")));

// Injecter `res.locals.user` pour les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// ─── Déclaration des routes ─────────────────────────────────────────────────
app.use(["/", "/accueil"], routeAccueil);
app.use("/items", routeItems);
app.use("/apropos", routeApropos);
app.use("/contact", routeContact);
app.use("/champion", routeChampion);
app.use("/login", routeLogin);
app.use("/profil", routeProfil);
app.use("/auth", routeAuth);

// ─── Gestion des 404 et erreurs ────────────────────────────────────────────
// Si aucune route n’a répondu
app.use((req, res) => {
  res.status(404).send("404 – Page non trouvée");
});

// Handler d’erreur générique
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Une erreur interne est survenue");
});

// ─── Lancement du serveur ───────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`Serveur écoute sur http://127.0.0.1:${port}/`);
});
