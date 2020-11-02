const mysql = require("mysql");


const db = mysql.createPool({
    host: "localhost",
    user: "kari",
    password: "123456",
    database: "pmgdatabase",
});


module.exports = {db};