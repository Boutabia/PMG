const mysql = require("mysql");


const db = mysql.createPool({
    host: "localhost",
    user: "kari",
    password: "123456",
    database: "pmgdatabase",
});

/**
 * Promise for a database query. Use it for making queries to db. 
 * @param {*} str 
 * @param {*} params 
 */

function queryPromise(str, params){
    return new Promise((resolve, reject) => {
        db.query(str, params, (err, result)=>{
            if (err) reject(err);
            resolve(result);
        })
    })
}

/**
 * get id one higher than the biggest one from said column from said table
 * @param {*} table 
 * @param {*} column 
 */
async function getNextID(table, column){
    let idquery = "SELECT MAX(" + column + ") AS maxid FROM "+ table;
    return await queryPromise(idquery, null);

} 

module.exports = {db, getNextID, queryPromise};