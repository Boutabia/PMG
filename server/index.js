const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {db, getNextID} = require("./dbpool");
const {insertToScenario,
       insertToScenarioCategory, insertToQuestionlist,
       insertToQmultiplechoice} = require("./scenarios");
const usertools = require("./usertools");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use


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


//Should be changed towards "/api/insert/scenario"
app.post("/api/insert", async (req,res) => {
    //Check authorization

    //check input if it's JSON, if we are going for JSON?

    //get ID
    const scenarioID = ((await getNextID("scenario", "scenarioid"))[0].maxid)+1;
    const questionID = ((await getNextID("scenario", "questionid"))[0].maxid)+1;
    
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
app.post("/api/insert/user", async (req,res) => {
    //validate
    if (usertools.getCurrentUserRole(req) !== "superuser"){
        res.writeHead(403, "Only allowed for superuser.");
        return res.end();
    }
    //act
    const user = req.body.user;
    if (usertools.usernameInUse(user.name)){
        res.writeHead(400, "Username in use!");
        return res.end();
    }
    if (usertools.createUser(user.name, user.password)){
        res.writeHead(200, "User created succesfully.");
        return res.end();
    }
    res.writeHead(500, "Unknown server error");
    return res.end();
});

app.post("/api/login"), async(req, res)=>{
    const creds = usertools.credentialsDecrypt(req);
    
}



app.listen(3001,()=>{
    console.log("running on port 3001");
});