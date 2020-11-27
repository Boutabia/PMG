require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {db, getNextID} = require("./dbpool");
const {insertToScenario,
       insertToScenarioCategory, insertToQuestionlist,
       insertToQmultiplechoice, getScenarioList,
       fetchQuestions, getCategories, insertCategory} = require("./scenarios");
const usertools = require("./usertools");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

/**
 * Can be used to test if user is authenticated. 
 */
app.get("/get", authenticateToken, async(req, res) =>{
    return res.json({happy: "true"});
});

/**
 * A POST that can insert categories to the category -table. Only name is needed.
 */
app.post("/api/insert/category", async(req, res)=>{
    const newCategoryName = req.body.newCategoryName;
    insertCategory(newCategoryName);
    res.writeHead(200, "Succesful insert");
    return res.end();
});


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

app.post("/api/insert/scenario", authenticateToken, async (req,res) => {
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

/**
 * this GET should be called when a game is needed to begin. 
 * You can add int[] categories and int limit to get a fixed number
 * of scenarios and from fixed categories. With empty input 
 * gives 10  scenarios from all categories. 
 */

app.get("/api/startgame", async(req, res)=>{
    const body = req.body;
    const scenarioArray = await getScenarioList(body.categories, body.limit, true);

    if (scenarioArray.length === 0){
        res.writeHead(500, "No scenarios found.");
        return res.end();
    }

    const fullArray = await fetchQuestions(scenarioArray); 

    res.writeHead(200, "Fetched up to 10 scenarios.", { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(fullArray));
});

/**
 * GET that gets all scenarios from the database with all the info.
 * Doesn't use any parameters.
 */

app.get("/api/getScenarios", async(req, res)=>{
    const scenarioArray = await getScenarioList([], Number.MAX_SAFE_INTEGER, false);

    if (scenarioArray.length === 0){
        res.writeHead(500, "No scenarios found.");
        return res.end();
    }

    const fullArray = await fetchQuestions(scenarioArray); 

    res.writeHead(200, "Successfully fetched scenarios", { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(fullArray));
});

/**
 * GETs a list of categories. Simple.
 * Doesn't use any input parameters.
 */

app.get("/api/get/category", async(req, res)=>{
    const categoryArray = await getCategories();
    res.writeHead(200, "Categories fetched", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(categoryArray));
});

/**
 * A superuser can use this POST to register new users to the database.
 * user-object needs to be delivered in body, and it needs to have 
 * password and username defined. Role will automatically be user.
 */

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

/**
 * POST can be used to log in, credentials are to be sent in
 * separate variables in body. Username and password. 
 * If correct, POST will return accesstoken in json response.
 */

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
 * port-definition
 */

app.listen(3001,()=>{
    console.log("running on port 3001");
});