// Config File
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
// CORS
import cors from 'cors';
// Express Module
import express, { json } from 'express';
// Express APP
const app = express();

app.use(json());
app.use(cors());

// ROUTERS
app.use(express.static('public'));
import routeAccueil from '#routes/accueil.js';
app.use(['/', '/accueil'], routeAccueil);
import routeItems from '#routes/items.js';
app.use('/items', routeItems);

app.use((req, res, next) => {
    res.status(404).send('404 - Page Non Trouvé');
});

app.listen(port, (erreur) => {
    if(erreur){
        throw erreur;
    }
    console.log(`Serveur Écoute pour http://127.0.0.1:${port}/`);
});