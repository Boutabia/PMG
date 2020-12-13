require('dotenv').config();
const mysql = require("mysql");

const host = process.env.DB_HOST ? process.env.DB_HOST : "notlocalhost";
const user = process.env.DB_USER ? process.env.DB_USER : "notkari";
const password = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "not123456";
const database = process.env.DB_DATABASE ? process.env.DB_DATABASE : "notpmgdatabase";

const db = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
});

/**
 * Promise for a database query. Use it for making queries to db. 
 * @param {*} str 
 * @param {*} params 
 */

function queryPromise(query, params = []){
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result)=>{
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
    return (await queryPromise(idquery, null))[0].maxid+1;
} 

module.exports = {db, getNextID, queryPromise};