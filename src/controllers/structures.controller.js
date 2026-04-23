import structuresModel from "../models/structures.model.js";

export const trouverStructure = async (req, res) => {

    // Teste si le paramètre id est présent et valide
    if(!req.params.id || parseInt(req.params.id) <= 0){
        res.status(400);
        res.send({
            message: "L'id du pokemon est obligatoire et doit être supérieur à 0"
        });
        return;
    }

    try {
        
        const pokemon = await structuresModel.getStructure(req.params.id);

        // On retourne un message d'erreur avec le code 404 si aucun professeur n'a été trouvé
        if(!pokemon)
        {
            res.status(404).send({erreur: "Echec lors de la récupération du pokemon avec l'id "+req.params.id});
        }
        // OK 
        res.send(pokemon);

    } catch (erreur) {
        // S'il y a eu une erreur au niveau de la requête, on retourne un erreur 500 car 
        //  c'est du serveur que provient l'erreur.
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la récupération du pokemon avec l'id " + req.params.id
        });
    };
};