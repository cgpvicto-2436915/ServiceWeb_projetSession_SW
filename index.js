//Le projet est inspiré des mes anciens projet.

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import utilisateursRouter from './src/routes/bibliotheques.route.js';
import livresRouter from './src/routes/livres.route.js';
import pretsRouter from './src/routes/prets.route.js';

import authentification from './src/middlewares/authentification.middleware.js';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import fs from 'fs';

var accessLogStream = fs.createWriteStream('./erreur.log', { flags: 'a' });


const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bibliotheque API"
};

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(morgan('combined', { stream: accessLogStream,skip:(req,res)=>res.statusCode < 500 }));//docs de morgan
app.use(cors());

app.use(express.json());
app.use('/api/utilisateur',utilisateursRouter);
app.use('/api/livre', authentification, livresRouter);
app.use('/api/pret', authentification, pretsRouter);

app.get('/api', (req, res) => {
    res.send("<h1>Serveur web pour la gestion de prêts pour les livres d'une bibliothèque.</h1>");
});
app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
