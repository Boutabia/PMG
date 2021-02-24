const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const {getUser, getUserList,generateAccessToken, authenticateToken,
       usernameInUse, createUser, getUserByID, updateUser, deleteUser} = require("../tools/usertools");



/**
 * POST can be used to log in, credentials are to be sent in
 * separate variables in body. Username and password. 
 * If correct, POST will return accesstoken in json response.
 */

userRouter.post('/login', async(req, res)=>{
    //Authenticate user
    const body = req.body;
    const user = await getUser(body.username);
    const pwCorrect = user === undefined
      ? false
      : await bcrypt.compare(body.password, user.passwordhash);
    if (!(user && pwCorrect)) {
        res.writeHead(401, "invalid username or password");
        return res.end();
    }

    const accessToken = await generateAccessToken(user);
    const expirationTime = Date.now()+(12*1000*3600); //12 * milliseconds * minutes * seconds = 12 hours
    return res.json({accessToken: accessToken, expiration: expirationTime});
});
/**
 * A superuser can use this POST to edit existing users to the database.
 * user-object needs to be delivered in body, and it needs to have 
 * password and username defined. Role will automatically be user.
 */

userRouter.put("/updateuser/:id", authenticateToken, async (req,res) => {
    //authorization
    if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }
    //act
    const newuser = req.body;
    if (await usernameInUse(newuser.username)){
        res.writeHead(400, "Username in use!");
        return res.end();
    }
    if (await updateUser(newuser.username, newuser.password,newuser.fullname, newuser.email, req.params.id)){
        res.writeHead(200, "User updated succesfully.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});

/**
 * A superuser can use this POST to register new users to the database.
 * user-object needs to be delivered in body, and it needs to have 
 * password and username defined. Role will automatically be user.
 */

userRouter.post("/register", authenticateToken, async (req,res) => {
    //authorization
    if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }
    //act
    const newuser = req.body;
    if (await usernameInUse(newuser.username)){
        res.writeHead(400, "Username in use!");
        return res.end();
    }
    if (await createUser(newuser.username, newuser.password,newuser.fullname, newuser.email)){
        res.writeHead(200, "User created succesfully.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});
/**
 * GET that gets all users from the database with all the info.
 * Doesn't use any parameters.
 */

userRouter.get("/allusers", authenticateToken, async(req, res)=>{
    const userArray = await getUserList();
    res.writeHead(200, "Users fetched", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(userArray));
});
/**
 * GET that gets one user from the database with all the info.
 *username as parameter.
 */

userRouter.get("/getuser/:id", authenticateToken, async(req, res)=>{    
    const user = await getUserByID(req.params.id);
    res.writeHead(200, "User fetched", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(user));
});

/**
 * You can delete a user if you are authenticated based on the name of the user
 * which should be sent in body as a variable "name"
 */

userRouter.delete("/delete/:id", authenticateToken, async(req, res)=>{
    /*if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }

    if (!await usernameInUse(req.body.name)){
        res.writeHead(404, "Username not found!");
        return res.end();
    }*/

    if (await deleteUser(req.params.id)){
        res.writeHead(200, "User deleted succesfuly.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});



module.exports={
    userRouter 
}