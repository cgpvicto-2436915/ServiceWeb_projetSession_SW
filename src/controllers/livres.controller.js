import livresModel from "../models/livres.model.js";
import bibliothequesModel from "../models/bibliotheques.model.js";
import pretsModel from "../models/prets.model.js";

export const listeLivre = async (req, res) => {
    let tous = (req.query.tous == "1");

    const cleApi = req.headers.authorization.split(' ')[1];
    try {
        
        const livres = await livresModel.listeLivre(cleApi, tous);
        
        res.json(livres);

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la récupération de la liste des livres"
        });
    };
};
export const detailLivre = async (req, res) => {

    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.json({
            erreur: "L'id du livre est obligatoire et doit être supérieur à 0"
        });
        return;
    }
    const id = parseInt(req.params.id);
    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        const test = await livresModel.validerExistance(cleApi, id);
        if(test){
            const livre = await livresModel.detailLivre(id);
            const prets = await pretsModel.listePret(id);
            const reponse = {
                "id":livre.id,
                "titre":livre.titre,
                "description":livre.description,
                "auteur":livre.auteur,
                "isbn":livre.isbn,
                "disponible":livre.disponible,
                "prets":prets
            };
            res.json(reponse);
        }
        else{
            res.status(401)
            res.json({
                erreur: "Ce livre ne vous appartient pas."
            });
        }
        
        
        

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la récupération du livre."
        });
    };
};

export const creerLivre = async (req,res) => {
    const titre = req.body.titre;
    const description = req.body.description;
    const auteur = req.body.auteur;
    const isbn = req.body.isbn;
    const disponible = (req.body.disponible == true);
    const cleApi = req.headers.authorization.split(' ')[1];

    const champsManquants = [];
    if(!titre)
        champsManquants.push("titre");

    if(!auteur)
        champsManquants.push("auteur");

    if(!isbn)
        champsManquants.push("isbn");

    if(!titre || !auteur|| !isbn){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    try{
        const biblio = await bibliothequesModel.validationCle(cleApi);
        const id = await livresModel.creerLivre(biblio, titre, description, auteur, isbn, disponible);

        const reponse = {
            "message" : "Le livre a été ajouté avec succès",
            "livre" : {
            "id": id, 
            "titre":titre,
            "description":description,
            "auteur":auteur,
            "isbn":isbn,
            "disponible":disponible,
            }
        };
        res.status(201).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            message: "Echec lors de la création du livre "
        });
    }
};

export const modifierLivre = async (req,res) => {
    const id  = parseInt(req.params.id) ?? null;
    const titre = req.body.titre;
    const description = req.body.description;
    const auteur = req.body.auteur;
    const isbn = req.body.isbn;
    const disponible = (req.body.disponible == true);
    const cleApi = req.headers.authorization.split(' ')[1];

    const champsManquants = [];
    if(!titre)
        champsManquants.push("titre");

    if(!auteur)
        champsManquants.push("auteur");

    if(!isbn)
        champsManquants.push("isbn");

    if(!titre || !auteur|| !isbn){
        const reponse =
        {
        "erreur":"Le format des données est invalide",
        "champs_manquants": champsManquants
        };
        return res.status(400).json(reponse);
    }
    try{
        const existe = await livresModel.validerExistance(cleApi,id);
        if(!existe){
            return res.status(401).json({erreur: "Ce livre ne vous appartient pas."});
        }

        const resultats = await livresModel.modifierLivre(id, titre, description, auteur, isbn, disponible);

        const reponse = {
            "message" : "Le livre a été modifié avec succès",
            "livre" : {
            "id": id, 
            "titre":titre,
            "description":description,
            "auteur":auteur,
            "isbn":isbn,
            "disponible":disponible,
            }
        };
        res.status(201).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            message: "Echec lors de la modification du livre"
        });
    }
};

export const modifierStatutLivre = async (req, res) => {
    const id  = parseInt(req.params.id) ?? null;

    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        const existe = await livresModel.validerExistance(cleApi,id);
        if(!existe){
            return res.status(401).json({erreur: "Ce livre ne vous appartient pas."});
        }

        let livreStatut = await livresModel.modifierStatutLivre(id);
        
        if(listeLivre){
            livreStatut = "disponible"
        }else{
            livreStatut = "emprunté"
        }

        res.json({message: `Le livre est maintenant : ${livreStatut}`});

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la modification du statut du livre"
        });
    };
};

export const supprimeLivre = async (req, res) => {
    const id  = parseInt(req.params.id) ?? null;

    const cleApi = req.headers.authorization.split(' ')[1];

    try {
        const existe = await livresModel.validerExistance(cleApi,id);
        if(!existe){
            return res.status(401).json({erreur: "Ce livre ne vous appartient pas."});
        }

        let resultat = await livresModel.supprimeLivre(id);
        

        res.json({message: `Le livre a été supprimé avec succès`});

    } catch (erreur) {

        console.log('Erreur : ', erreur);
        res.status(500)
        res.json({
            erreur: "Echec lors de la suppression du livre"
        });
    };
};