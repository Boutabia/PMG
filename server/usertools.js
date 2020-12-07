require('dotenv').config();
const {db, getNextID, queryPromise} = require("./dbpool");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

/**
 * Function to create a user. 
 * @param {string} username 
 * @param {string} password 
 */
async function createUser(username, password){
    const id =  await getNextID("user", "id");
    const pw = await bcrypt.hash(password, 12);
    const userInsert =
    "INSERT INTO user (id, name, passwordhash, role) VALUES (?, ?, ?, ?)";
    return await queryPromise(userInsert, [id, username, pw, "user"])
        .then((result)=>{
            return true;
        })
        .catch((err)=> {
            console.log(err);
            return false;
        });
    
}

//getUser
/**
 * iduser, name, passwordhash, role
 * @param {*} username 
 */
async function getUser(username){
    const query = "SELECT * FROM pmgdatabase.user WHERE name = ? ";
    return await queryPromise(query, [username])
        .then((res)=> {
            if (res.length === 1){

                return {
                    id: res[0].id, 
                    name: res[0].name, 
                    passwordhash: res[0].passwordhash,
                    role: res[0].role
                };
            }
            console.log("false, not in use");
            return undefined;
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        });
}

//usernameInUse
async function usernameInUse(username){
    const user = await getUser(username);
    if (user == null){
        return false;
    }
    return true;
}

//removeUser
async function deleteUser(username){
    const query = "DELETE ? FROM user";
    return await queryPromise(query, [username])
        .then((res)=> {
            console.log("Successfully deleted user.");
            return true;
        })
        .catch((err)=>{
            console.log(err);
            return false;
        });
}

/**
 * Function that authenticates the request token, and allows to continue
 * if it is valid. If not, you will be denied. You can add
 * this to other routes if needed. 
 * @param {request-object} req 
 * @param {Response-object} res 
 * @param {callback} next 
 */
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

/**
 * Function that generates and returns an accesstoken
 * based on the user-object-data.
 * @param {User-object} user 
 */

async function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "12h"});
}


module.exports = {
    createUser,
    getUser,
    usernameInUse,
    deleteUser,
    authenticateToken, 
    generateAccessToken
}