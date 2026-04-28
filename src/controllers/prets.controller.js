import pretsModel from "../models/prets.model.js";
import livresModel from "../models/livres.model.js";


export const creerPret = async (req,res) => {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;


    const livre_id = parseInt(req.body.livre_id);
    const emprunteur = req.body.emprunteur;
    const date_debut = req.body.date_debut;
    const date_retour = req.body.date_retour;
    const en_cours = (req.body.en_cours == true);
    const cleApi = req.headers.authorization.split(' ')[1];

    const champsManquants = [];
    if(!livre_id || livre_id <= 0)
        champsManquants.push("livre_id");

    if(!emprunteur)
        champsManquants.push("emprunteur");

    if(!regexDate.test(date_debut))
        champsManquants.push("date_debut");
    
    if(!regexDate.test(date_retour))
        champsManquants.push("date_retour");

    if(champsManquants.length >=1){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    try{
        const existe = await livresModel.validerExistance(cleApi,livre_id);
        if(!existe){
            return res.status(401).json({erreur: "Le livre correspondant au prêt ne vous appartient pas."});
        }
        const id = await pretsModel.creerPret(livre_id,emprunteur,date_debut,date_retour,en_cours);

        const reponse = {
            "message" : "Le prêt a été ajouté avec succès",
            "livre" : {
                "id": id,
                "livre_id": livre_id,
                "emprunteur": emprunteur,
                "date_debut": date_debut,
                "date_retour": date_retour,
                "en_cours": en_cours
            }
        };
        res.status(201).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            message: "Echec lors de l'ajout du prêt"
        });
    }
};

export const modifierPret = async (req,res) => {
    const regexDate = /^\d{4}-\d{2}-\d{2}$/;


    const id  = parseInt(req.params.id) ?? null;
    const emprunteur = req.body.emprunteur;
    const date_debut = req.body.date_debut;
    const date_retour = req.body.date_retour;
    const en_cours = (req.body.en_cours == true);
    const cleApi = req.headers.authorization.split(' ')[1];

    const champsManquants = [];

    if(!emprunteur)
        champsManquants.push("emprunteur");

    if(!regexDate.test(date_debut))
        champsManquants.push("date_debut");
    
    if(!regexDate.test(date_retour))
        champsManquants.push("date_retour");

    if(champsManquants.length >=1){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    try{
        const livre_id = await pretsModel.livreIdPret(id);
        const existe = await livresModel.validerExistance(cleApi,livre_id);
        if(!existe){
            return res.status(401).json({erreur: "Le livre correspondant au prêt ne vous appartient pas."});
        }
        const resultat = await pretsModel.modifierPret(id,emprunteur,date_debut,date_retour,en_cours);

        const reponse = {
            "message" : "Le prêt a été modifié avec succès",
            "livre" : {
                "id": id,
                "livre_id": livre_id,
                "emprunteur": emprunteur,
                "date_debut": date_debut,
                "date_retour": date_retour,
                "en_cours": en_cours
            }
        };
        res.status(201).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            message: "Echec lors de l'ajout du prêt"
        });
    }
};

export const supprimerPret = async (req, res) => {
    const id  = parseInt(req.params.id) ?? null;

    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        const livre_id = await pretsModel.livreIdPret(id);
        const existe = await livresModel.validerExistance(cleApi,livre_id);
        if(!existe){
            return res.status(401).json({erreur: "Le livre correspondant au prêt ne vous appartient pas."});
        }

        let resultat = await pretsModel.supprimerPret(id);
        

        res.status(201).json({message: `Le prêt a été supprimé avec succès`});

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la suppression du prêt"
        });
    };
};

export const modifierStatutPret = async (req, res) => {
    const id  = parseInt(req.params.id) ?? null;

    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        const livre_id = await pretsModel.livreIdPret(id);
        const existe = await livresModel.validerExistance(cleApi,livre_id);
        if(!existe){
            return res.status(401).json({erreur: "Le livre correspondant au prêt ne vous appartient pas."});
        }

        let statut = await pretsModel.modifierStatutPret(id);
        
        if(statut){
            statut = "En cours"
        }else{
            statut = "Terminé"
        }

        res.json({message: `Le prêt est maintenant : ${statut}`});

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la modification du statut du livre"
        });
    };
};