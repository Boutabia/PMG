require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usertools = require("./usertools");

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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});
}


/**
 * POST can be used to log in, credentials are to be sent in
 * separate variables in body. Username and password. 
 * If correct, POST will return accesstoken in json response.
 */

usersRouter.post('/login', async(req, res)=>{
    //Authenticate user
    const body = req.body;
    const user = await usertools.getUser(body.username);
    const pwCorrect = user === undefined
      ? false
      : await bcrypt.compare(body.password, user.passwordhash);
    if (!(user && pwCorrect)) {
        res.writeHead(401, "invalid username or password");
        return res.end();
    }

    const accessToken = await generateAccessToken(user);
    return res.json({accessToken: accessToken});
});

/**
 * A superuser can use this POST to register new users to the database.
 * user-object needs to be delivered in body, and it needs to have 
 * password and username defined. Role will automatically be user.
 */

usersRouter.post("/api/register", authenticateToken, async (req,res) => {
    //authorization
    if (req.user.role !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }
    //act
    const newuser = req.body.newuser;
    if (await usertools.usernameInUse(newuser.name)){
        res.writeHead(400, "Username in use!");
        return res.end();
    }
    if (await usertools.createUser(newuser.name, newuser.password)){
        res.writeHead(200, "User created succesfully.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});



module.exports={
    usersRouter
}