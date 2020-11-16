require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {db, getNextID} = require("./dbpool");
const {insertToScenario,
       insertToScenarioCategory, insertToQuestionlist,
       insertToQmultiplechoice} = require("./scenarios");
const usertools = require("./usertools");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use

/**********PACKAGE:JSON********************************************** */

/**
 * scenarioInserting POST. Should receive following:
 * string scenarioNameVar, int scenarioTypeVar, int questionTypeVar,
 * string questionTextVar(300), string pictureVar(90)(for path and the picturename),
 * string questionOptionVar(1-4)(140), int questionCorrectVar(1-4). 
 * 
 * With (1-4) add one of the numbers 
 * to the end of the variablename as a part of the name e.g. questionCorrectVar1.
 * (300) and (140) are number of characters.
 */

// We could also use a JSON -> TBD
app.get("/get", authenticateToken, async(req, res) =>{
    return res.json({happy: "true"});
});

app.post("/api/insert", async (req,res) => {
    //Check authorization

    //check input if it's JSON, if we are going for JSON?

    //get ID
    const scenarioID = (await getNextID("scenario", "scenarioid"));
    const questionID = (await getNextID("scenario", "questionid"));
    
    //Insert into scenario table
    await insertToScenario(req, scenarioID, questionID);
    
    //Insert into scenariocategory table
    await insertToScenarioCategory(req, scenarioID);

    //Insert into questionlist table
    await insertToQuestionlist(req, questionID);
    //When someone starts to add more questiontypes, the logic which one is inserted could go here
        /*By this logic, I use qmultiplechoice*/ 
    //Insert into qmultipleChoice table
    await insertToQmultiplechoice(req, questionID);
    res.writeHead(200, ("Inserting was successful."));
    return res.end();
});
//
app.post("/api/register", authenticateToken, async (req,res) => {
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

app.post("/api/login", async(req, res)=>{
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
})

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

async function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1h"});
}


app.listen(3001,()=>{
    console.log("running on port 3001");
});