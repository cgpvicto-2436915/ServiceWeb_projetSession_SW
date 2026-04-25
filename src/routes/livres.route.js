import{
    listeLivre,
    detailLivre,
    creerLivre, 
    modifierLivre,
    modifierStatutLivre,
    supprimeLivre
    } from '../controllers/livres.controller.js';
import express from 'express';

const router = express.Router();

router.delete('/:id',supprimeLivre);

router.post('/', creerLivre);

router.put('/:id/statut', modifierStatutLivre);
router.put('/:id', modifierLivre);

router.get('/:id', detailLivre);
router.get('/', listeLivre);


export default router;