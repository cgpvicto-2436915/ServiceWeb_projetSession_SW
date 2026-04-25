import pool from '../config/db_pg.js';
//inspirer d'ancien projet

//retourne la liste des livres qui appartient a la biblio
//affiche toute si "tous" est vrai
const listeLivre = async (cle_api, tous) => {
        if(tous){
            var requete = `SELECT livres.id,titre,description,auteur,isbn,disponible FROM livres INNER JOIN bibliotheque ON livres.bibliotheque_id = bibliotheque.id WHERE cle_api = $1 ORDER BY titre`;
                      
        } else{
            var requete = `SELECT livres.id,titre,description,auteur,isbn,disponible FROM livres INNER JOIN bibliotheque ON livres.bibliotheque_id = bibliotheque.id WHERE cle_api = $1  AND disponible = true ORDER BY titre`;
        }  


    try {
        var params = [cle_api];  
        var resultats = await pool.query(requete, params);

        return resultats.rows ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
};

//cherche dans la BD les detail du livre
const detailLivre = async (id) => {

    const requete = `SELECT livres.id,titre,description,auteur,isbn,disponible FROM livres INNER JOIN bibliotheque ON livres.bibliotheque_id = bibliotheque.id WHERE livres.id = $1`;
    const params = [id];

    try {

        const resultats = await pool.query(requete, params);
        return resultats.rows[0] ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
};


//cree un livre dans la BD selon les parametres
const creerLivre = async(biblio, titre, description, auteur, isbn, statut) =>{
    const requete = `INSERT INTO livres(bibliotheque_id, titre, description, auteur, isbn, date_ajout, disponible) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`;
    const param = [biblio, titre, description, auteur, isbn, new Date(), statut];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, ${erreur.code} message: ${erreur.message} `);
        throw erreur;
    }
}

//modifie le livre, qui correspond au id, avec les parametre.
const modifierLivre = async(id, titre, description, auteur, isbn, statut) =>{

    const requete = `UPDATE livres SET titre = $1, description = $2, auteur = $3, isbn = $4, disponible = $5 WHERE livres.id=$6 RETURNING id`;
    const param = [titre,description, auteur,isbn,statut,id];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message : ${erreur.message} `);
        throw erreur;
    }
}

//change le statut du livre
//si il est a "true",il passe a "false" et vis versa.
const modifierStatutLivre = async(id) =>{
    const requete1 = `SELECT disponible FROM livres WHERE id = $1`;

    let requete2="";
    const param = [id];
    try {

        const resultats = await pool.query(requete1,param);
        if(resultats.rows[0]?.disponible){
            requete2 = `UPDATE livres SET disponible = false WHERE id=$1 RETURNING disponible`;
        }
        else{
            requete2 = `UPDATE livres SET disponible = true WHERE id=$1 RETURNING disponible`;
        }

        const param2 = [id];

        const resultats2 = await pool.query(requete2,param2);
        return resultats2.rows[0]?.disponible ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message} `);
        throw erreur;
    }
}

//verifie si le livre(id) existe et appartient a la bonne biblio.
const validerExistance = async(cle_api, id) =>{
    if(!parseInt(id))
    {
        return null;
    }    
    const requete = `SELECT titre FROM livres INNER JOIN bibliotheque ON livres.bibliotheque_id = bibliotheque.id WHERE cle_api = $1 and livres.id = $2 `;
    const params = [cle_api,id];

    try {

        const resultats = await pool.query(requete, params);
        return resultats.rows[0] ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message : ${erreur.message} `);
        throw erreur;
    }
}

//supprime le livre et tous ces prets dans la BD
const supprimeLivre = async(id) =>{
    const requete1 = `DELETE FROM prets WHERE livre_id = $1`;
    const requete2 = `DELETE FROM livres WHERE id = $1`;
    const param = [id];
    try {

        const resultats = await pool.query(requete1,param);
        const resultats2 = await pool.query(requete2,param);

        return resultats2.rows[0] ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} message: ${erreur.message}`);
        throw erreur;
    }
}


export default {
    listeLivre,
    detailLivre,
    creerLivre,
    modifierLivre,
    validerExistance,
    modifierStatutLivre,
    supprimeLivre
}