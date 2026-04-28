import{
    creerPret,
    modifierPret,
    supprimerPret,
    modifierStatutPret
    } from '../controllers/prets.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', creerPret);
router.put('/:id/statut', modifierStatutPret);
router.put('/:id', modifierPret);
router.delete('/:id',supprimerPret);
export default router;