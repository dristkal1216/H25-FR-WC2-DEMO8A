// Config File
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3001;
// CORS
import cors from "cors";
// Express Module
import express, { json } from "express";
// Express APP
const app = express();

app.use(json());
app.use(cors());

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
import routeChampions from "#routes/champions.js";
app.use("/champion", routeChampions);
app.use((req, res, next) => {
  res.status(404).send("404 - Page Non Trouvé");
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, (erreur) => {
  if (erreur) {
    throw erreur;
  }
  console.log(`Serveur Écoute pour http://127.0.0.1:${port}/`);
});
