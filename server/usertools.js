const {db, getNextID, queryPromise} = require("./dbpool");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//createUser
async function createUser(username, password){
    const id =  await getNextID("user", "id");
    const pw = await bcrypt.hash(password, 12);
    const userInsert =
    "INSERT INTO user (id, name, passwordhash, role) VALUES (?, ?, ?, ?)";
    return await queryPromise(userInsert, [id, username, pw, "user"])
        .then((result)=>{
            console.log("Inserted user succesfully");
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
        console.log("Returning false");
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

module.exports = {
    createUser,
    getUser,
    usernameInUse,
    deleteUser
}