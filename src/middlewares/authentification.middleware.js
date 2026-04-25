import biblioModel from "../models/bibliotheques.model.js";
//inspirer des notes de cours.

const authentification = async (req, res, next) => {

    // Vérifier si la clé API est presente dans l'entête
    if(!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    // Récupérer la clé API qui est dans l'entête au format "cle_api XXXXXXXX"
    const cleApi = req.headers.authorization.split(' ')[1];
    // Vérifier si la clé API est valide
    try {
        const cleValide = await biblioModel.validationCle(cleApi);
        if(cleValide) {
            // La clé API est valide, on continue le traitement avec la fonction next()
            next();
        } else {
            return res.status(401).json({ message: "Clé API invalide" });
        }
    } catch (erreur) {
        console.log(erreur.message);
        return res.status(500).json({ message: "Erreur lors de la validation de la clé api" })
    }
}

export default authentification;