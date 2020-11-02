const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {db} = require("./dbpool");
const {getNextID, insertToScenario,
       insertToScenarioCategory, insertToQuestionlist,
       insertToQmultiplechoice} = require("./scenarios");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

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
    
    //Insert into QmultipleChoice table
    await insertToQmultiplechoice(req, questionID);
    res.writeHead(200, ("Inserting was successful."));
    res.end();
});



app.listen(3001,()=>{
    console.log("running on port 3001");
});