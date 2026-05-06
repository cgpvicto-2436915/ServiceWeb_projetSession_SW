import utilisateurModel from "../models/bibliotheques.model.js";

//crée un utilisateur (biblio) a partir des infos et retourne une cle d'API
export const creerUtilisateur = async (req, res) => {

        const nom = req.body.nom;
        const courriel = req.body.courriel;
        const mdp = req.body.mot_de_passe;
        if(!nom||!courriel||!mdp){
            const reponse = {"erreur":"Un champ est manquant"};
            return res.status(400).json(reponse);
        }


        const uuid = crypto.randomUUID();
        try{
            const utilisateurExiste = await utilisateurModel.verifierCourrielbd(courriel);
            if( utilisateurExiste){
            const reponse = {"erreur":"Le courriel existe deja"};
            return res.status(401).json(reponse);
            }



            const id = await utilisateurModel.creerUtilisateurbd(nom,courriel,mdp,uuid);
            const reponse = {
                "message" : "L'utilisateur a été créé",
                "cle_api" : uuid
            };
            res.status(201).json(reponse);
        }
        catch (erreur){
    
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                "erreur": "Echec lors de la création de l'utilisateur "+ nom
            });
        }
}

//recupere une cle d'api ou en genere un autre selon le parametre nouvelle.
//retourne la cle d'api
export const recupererCle = async (req, res) => {

    const courriel = req.body.courriel;
    const mdp = req.body.mot_de_passe;
    const nouvelle = req.query.nouvelle;
    
    if(!courriel||!mdp){
        const reponse = {"erreur":"Un champ est manquant"};
        return res.status(400).json(reponse);
    }
    

    try{
        const usersValide = await utilisateurModel.connection(courriel, mdp);
        
        if(!usersValide)
        {
            const reponse = {"erreur":"Le compte n'existe pas"};
            return res.status(401).json(reponse);            
        }
        if(nouvelle == "1"){
            usersValide.cle_api = crypto.randomUUID();
            await utilisateurModel.modifierCleBD(usersValide.id, usersValide.cle_api);
            
        }
        const reponse = {
            "cle_api" : usersValide.cle_api
        };
        res.status(200).json(reponse);
    }
    catch (erreur){

        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            "erreur": "Echec lors de la recuperation de la cle"
        });
    }
}