// Config File
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3001;
// CORS
import cors from "cors";
// Express Module
import express, { json } from "express";
// Express APP
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // ne réécrit pas la session si elle n’a pas changé
    saveUninitialized: false, // ne sauve pas les sessions vides
    cookie: {
      maxAge: 86400000,
      secure: process.env.NODE_ENV === "production", // only true in prod
      httpOnly: true,
    },
  })
);

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));

// ROUTERS
app.use(express.static("public"));
import routeAccueil from "#routes/accueil.js";
app.use(["/", "/accueil"], routeAccueil);

import routeItems from "#routes/items.js";
app.use("/items", routeItems);

import routeApropos from "#routes/apropos.js";
app.use("/apropos", routeApropos);

import routeContact from "#routes/contact.js";
app.use("/contact", routeContact);

import routeChampion from "#routes/champion.js";
app.use("/champion", routeChampion);

import routeLogin from "#routes/login.js";
app.use("/login", routeLogin);

import routeProfil from "#routes/profil.js";
app.use("/profil", routeProfil);

import routeAuth from "#routes/auth.js";
app.use("/auth", routeAuth);

app.use((req, res, next) => {
  res.status(404).send("404 - Page Non Trouvé");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(async (req, res, next) => {
  if (req.session.user?.id) {
    res.locals.user = req.session.user;
    console.log("Session utilisateur :", req.session.user);
  } else {
    res.locals.user = null;
  }
  next();
});

app.listen(port, (erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log(`Serveur Écoute pour http://127.0.0.1:${port}/`);
});
