import pool from '../config/db_pg.js';
//inspirer d'ancien projet

//retourne la liste de pret pour un livre en particulier.
const listePret = async (livre_id) => {
    //source pour "TO_CHAR" -> https://www.datacamp.com/fr/doc/postgresql/to_char-(formatting-dates)
    var requete = `SELECT id,emprunteur,TO_CHAR(date_debut, 'YYYY-MM-DD') AS date_debut,TO_CHAR(date_retour, 'YYYY-MM-DD') AS date_retour,CASE WHEN en_cours THEN 'En cours' ELSE 'Terminé' END AS statut FROM prets WHERE livre_id = $1 ORDER BY id`;
    try {
        var params = [livre_id];  
        var resultats = await pool.query(requete, params);

        return resultats.rows ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
};

//crée un pret a partir de toute  ces informations.
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

//modifie un pret avec toutes ces information.
const modifierPret = async(id, emprunteur,date_debut,date_retour,en_cours) =>{

    const requete = `UPDATE prets SET emprunteur = $1, date_debut = $2, date_retour = $3, en_cours = $4 WHERE prets.id=$5 RETURNING id`;
    const param = [emprunteur,date_debut,date_retour,en_cours,id];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message : ${erreur.message} `);
        throw erreur;
    }
}

//modifie le statut d'un pret a partir de son id
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

//supprime un pret dans la BD a partir du id
const supprimerPret = async(id) =>{
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

//retourne le id du livre qui correspond au pret
const livreIdPret = async(id) =>{
    const requete1 = `Select livre_id FROM prets WHERE id=$1`;
    const param = [id];
    try {

        const resultats = await pool.query(requete1,param);

        return resultats.rows[0]?.livre_id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
}

export default {
    listePret,
    creerPret,
    modifierPret,
    modifierStatutPret,
    livreIdPret,
    supprimerPret
}