//Le projet est inspiré des mes anciens projet.

import express from 'express';
import dotenv from 'dotenv';
import utilisateursRouter from './src/routes/bibliotheques.route.js';
import livresRouter from './src/routes/livres.route.js';

import authentification from './src/middlewares/authentification.middleware.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';


const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bibliotheque API"
};

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/api/utilisateur',utilisateursRouter);
app.use('/api/livre', authentification, livresRouter);

app.get('/api', (req, res) => {
    res.send("<h1>Mon premier serveur web sur express !</h1>");
});
app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
