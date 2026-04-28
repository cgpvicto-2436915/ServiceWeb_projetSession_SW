import pool from '../config/db_pg.js';
//inspirer d'ancien projet


const listePret = async (livre_id) => {
    var requete = `SELECT id,emprunteur,date_debut,date_retour,CASE WHEN en_cours THEN 'En cours' ELSE 'Terminé' END AS statut FROM prets WHERE livre_id = $1 ORDER BY id`;
    try {
        var params = [livre_id];  
        var resultats = await pool.query(requete, params);

        return resultats.rows ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
};

const creerPret = async(livre_id,emprunteur,date_debut,date_retour,en_cours) =>{
    const requete = `INSERT INTO prets(livre_id, emprunteur, date_debut, date_retour, en_cours) VALUES ($1,$2,$3,$4,$5) RETURNING id`;
    const param = [livre_id,emprunteur,date_debut,date_retour,en_cours];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, ${erreur.code} message: ${erreur.message} `);
        throw erreur;
    }
}


const modifierPret = async(id, livre_id,emprunteur,date_debut,date_retour,en_cours) =>{

    const requete = `UPDATE prets SET livre_id = $1, emprunteur = $2, date_debut = $3, date_retour = $4, en_cours = $5 WHERE prets.id=$6 RETURNING id`;
    const param = [livre_id,emprunteur,date_debut,date_retour,en_cours,id];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message : ${erreur.message} `);
        throw erreur;
    }
}

const modifierStatutPret = async(id) =>{
    const requete1 = `SELECT en_cours FROM prets WHERE id = $1`;

    let requete2="";
    const param = [id];
    try {

        const resultats = await pool.query(requete1,param);
        if(resultats.rows[0]?.en_cours){
            requete2 = `UPDATE prets SET en_cours = false WHERE id=$1 RETURNING en_cours`;
        }
        else{
            requete2 = `UPDATE prets SET en_cours = true WHERE id=$1 RETURNING en_cours`;
        }

        const param2 = [id];

        const resultats2 = await pool.query(requete2,param2);
        return resultats2.rows[0]?.en_cours ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message} `);
        throw erreur;
    }
}

const supprimePret = async(id) =>{
    const requete1 = `DELETE FROM prets WHERE id = $1`;
    const param = [id];
    try {

        const resultats = await pool.query(requete1,param);

        return resultats.rows[0] ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
}

export default {
    listePret,
    creerPret,
    modifierPret,
    modifierStatutPret
}