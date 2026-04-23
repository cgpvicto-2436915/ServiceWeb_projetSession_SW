import pool from '../config/db.js';

const getStructure= async (id) => {

    const requete = `SELECT nom,type_primaire,type_secondaire,pv,attaque,defense FROM pokemon WHERE id = ? LIMIT 1`;
    const params = [id];

    try {

        const [resultats] = await pool.query(requete, params);
        return resultats[0] ?? null;

    } catch (erreur) {
        console.log(`Erreur, code: ${erreur.code} sqlState ${erreur.sqlState} : 
                    ${erreur.sqlMessage}`);
        throw erreur;
    }
};

export default {
    getStructure

}