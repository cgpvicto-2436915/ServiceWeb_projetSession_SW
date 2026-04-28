import{creerUtilisateur,recupererCle} from '../controllers/bibliotheques.controller.js';
import express from 'express';

const router = express.Router();
router.post('/', creerUtilisateur);
router.post('/cle', recupererCle);


export default router;