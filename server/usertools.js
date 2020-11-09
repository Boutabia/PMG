const {db, getNextID, queryPromise} = require("./dbpool");
const bcrypt = require('bcrypt');

//credentialsDecrypt
async function credentialsDecrypt(request){
    const authHeader = request.headers["authorization"];
    if (authHeader === undefined || authHeader === "") return null;
    const auth = authHeader.split(" ");
    if (auth[0] === "Basic"){
        if (auth.length === 1) return new Array();
        const buff = Buffer.from(auth[1], 'base64');
        const str = buff.toString();
        const creds = str.split(":");
        return creds;
    }
    return null;
}

//compareUser
async function comparePassword(){

}

//createUser
async function createUser(username, password){
    const id =  await getNextID("user", "id");
    const pw = await bcrypt.hash(password, 12);
    const userInsert =
    "INSERT INTO user (id, name, passwordhash) VALUES (?, ?, ?, ?)";
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
async function getUser(username){
    const query = "SELECT * WHERE name = ?";
    return await queryPromise(query, [username])
        .then((res)=> {
            console.log(res);
            if (res.length === 1){
                console.log("true");
                return res[0];
            }
            console.log("false");
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
    if (user == undefined){
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
        })
}

//getCurrentUserRole
async function getCurrentUserRole(request){
    const arr = await credentialsDecrypt(request);
    if (arr.length === 0 || arr === null){
        return "none";
    }
    const user = getUser(arr[0]);
    if (user == undefined){
        return "none";
    }
    return user.role;
}

module.exports = {
    credentialsDecrypt,
    createUser,
    getUser,
    getCurrentUserRole,
    usernameInUse,
    deleteUser
}