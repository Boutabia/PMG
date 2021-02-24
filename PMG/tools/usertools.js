require('dotenv').config();
const {db, getNextID, queryPromise} = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

/**
 * Function to create a user. 
 * @param {string} username 
 * @param {string} password 
 */
async function createUser(username, password, fullname, email ,role = "user"){
    const id =  await getNextID("user", "id");
    const pw = await bcrypt.hash(password, 12);
    const userInsert =
    "INSERT INTO user (id, name, passwordhash, fullname, email, role) VALUES (?, ?, ?, ?, ?,?)";
    return await queryPromise(userInsert, [id, username, pw, fullname, email, role])
        .then((result)=>{
            return true;
        })
        .catch((err)=> {
            console.log(err);
            return false;
        });
    
}

/**
 * Function to update a user. 
 * @param {string} username 
 * @param {string} password 
 */
async function updateUser(username, password, fullname, email , userid){
    const id =  userid;
    const pw = await bcrypt.hash(password, 12);
    const userUpdate =
    `Update heroku_b7e05243fb82f58.user SET  name=?, passwordhash=?, fullname=?, email=? WHERE id=`+id;
    return await queryPromise(userUpdate, [ username, pw, fullname, email])
        .then((result)=>{
            return true;
        })
        .catch((err)=> {
            console.log(err);
            return false;
        });
    
}

//get All users
async function getUserList( id = 0){
    let query = "SELECT * FROM heroku_b7e05243fb82f58.user WHERE name!=\"superuser\"";
    const result = await queryPromise(query);
    const userArray = new Array();
    for (let i = 0; i < result.length; i++){
        const element = {
            userId: result[i].id,
            userName: result[i].name,
            fullName: result[i].fullname,
            email: result[i].email
            
        }
        userArray.push(element);
    }
    return userArray;
}

//getUser
/**
 * iduser, name, passwordhash, role
 * @param {*} username 
 */
async function getUser(username){
    const query = "SELECT * FROM heroku_b7e05243fb82f58.user WHERE name = ? ";
    return await queryPromise(query, [username])
        .then((res)=> {
            if (res.length === 1){

                return {
                    id: res[0].id, 
                    username: res[0].name, 
                    passwordhash: res[0].passwordhash,
                    role: res[0].role
                };
            }
            return undefined;
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        });
}
//getUserByID
/**
 * iduser, name, passwordhash, role
 * @param {*} id
 */
async function getUserByID(id){
    const query = "SELECT * FROM heroku_b7e05243fb82f58.user WHERE id = ? ";
    return await queryPromise(query, [id])
        .then((res)=> {
            if (res.length === 1){

                return {
                    id: res[0].id, 
                    username: res[0].name, 
                    fullname: res[0].fullname,
                    email: res[0].email
                };
            }
            return undefined;
        })
        .catch((err) => {
            console.log(err);
            return undefined;
        });
}

/**
 * Checks if the username in parameter is in use.
 * @param {String} username 
 */
async function usernameInUse(username){
    const user = await getUser(username);
    if (user == null){
        return false;
    }
    return true;
}

/**
 * Deletes a user based on name. 
 * @param {Int} id
 */
async function deleteUser(id){
    const query = "DELETE FROM user WHERE id = ?";
    return await queryPromise(query, [id])
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

/**
 * Checks if there is a superuser, and if there isn't will create 
 * a new one based on environmental variables, or using a "superuserpassword2020" string.
 */
async function isThereASuperuser(){
    if (!(await usernameInUse("superuser"))){
        const password = process.env.SUPERUSERPASSWORD === undefined ? "superuserpassword2020" : process.env.SUPERUSERPASSWORD;
        await createUser("superuser", password , "superuser");
        console.log("Created a new superuser according to envronment settings.");
    }
    return;
}
 
module.exports = {
    createUser,
    getUser,
    getUserByID,
    updateUser,
    getUserList,
    usernameInUse,
    deleteUser,
    authenticateToken, 
    generateAccessToken,
    isThereASuperuser
}