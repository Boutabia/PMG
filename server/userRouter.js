const express = require('express');
const usersRouter = express.Router();
const bcrypt = require('bcrypt');
const {getUser, generateAccessToken, authenticateToken,
       usernameInUse, createUser, deleteUser} = require("./usertools");



/**
 * POST can be used to log in, credentials are to be sent in
 * separate variables in body. Username and password. 
 * If correct, POST will return accesstoken in json response.
 */

usersRouter.post('/login', async(req, res)=>{
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
    return res.json({accessToken: accessToken, lifetime: "12"});
});

/**
 * A superuser can use this POST to register new users to the database.
 * user-object needs to be delivered in body, and it needs to have 
 * password and username defined. Role will automatically be user.
 */

usersRouter.post("/register", authenticateToken, async (req,res) => {
    //authorization
    if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }
    //act
    const newuser = req.body.newuser;
    if (await usernameInUse(newuser.name)){
        res.writeHead(400, "Username in use!");
        return res.end();
    }
    if (await createUser(newuser.name, newuser.password)){
        res.writeHead(200, "User created succesfully.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});

usersRouter.delete("/delete", authenticateToken, async(req, res)=>{
    if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }

    if (!await usernameInUse(req.body.name)){
        res.writeHead(404, "Username not found!");
        return res.end();
    }

    if (await deleteUser(req.body.name)){
        res.writeHead(200, "User deleted succesfuly.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});



module.exports={
    usersRouter
}