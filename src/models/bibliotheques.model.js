import bcrypt from 'bcrypt';
import pool from '../config/db_pg.js';
//inspirer d'ancien projet

//cree un utilisateur dans la BD selon les parametres
const creerUtilisateurbd = async (nom,courriel,mot_de_passe,cle_api) => {
    const costFactor = 10;
    const hash = await bcrypt.hash(mot_de_passe, costFactor);
    const requete = `INSERT INTO bibliotheque(nom, courriel, password,cle_api) VALUES ($1,$2,$3,$4) RETURNING id`;
    const param = [nom,courriel,hash,cle_api];
    try {
        const resultats = await pool.query(requete,param);
        
        return resultats.rows[0].id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}

//verifie que le courriel est bien dans la BD
const verifierCourrielbd = async (courriel) =>{
    const requete = `SELECT id FROM bibliotheque WHERE courriel= $1`;
    const param = [courriel];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0] ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}

//verifie que la cle api se trouve bien dans la BD
//retourne le id de la bibliotheque associé
const validationCle = async (cle) =>{
    const requete = `SELECT id FROM bibliotheque WHERE cle_api= $1`;
    const param = [cle];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows[0]?.id ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}

//modifie la cle api de la bibliotheque
const modifierCleBD = async (id,cle)=>{
    const requete = `UPDATE bibliotheque SET cle_api = $1 WHERE id=$2`;
    const param = [cle,id];
    try {
        const resultats = await pool.query(requete,param);

        return resultats.rows ?? null;
    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}

//valide que le courriel et le mot de passe sont valide
const connection = async (courriel,mdp) =>{
    const requete = `SELECT id, password, cle_api FROM bibliotheque WHERE courriel= $1`;
    const param = [courriel];

    try {
        const resultats = await pool.query(requete,param);

        if (!resultats.rows || resultats.rows.length === 0) {
            return null;
        }

        const motDePasseValide = await bcrypt.compare(mdp, resultats.rows[0].password);
        if(motDePasseValide)
        {
            return resultats.rows[0];
        }else{
            return null;
        }

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
}

export default {
    creerUtilisateurbd,
    verifierCourrielbd,
    validationCle,
    connection,
    modifierCleBD
}