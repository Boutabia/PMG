const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const mysql = require("mysql");


const db = mysql.createPool({
    host: "localhost",
    user: "kari",
    password: "123456",
    database: "pmgdatabase",
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

function queryPromise(str, params){
    return new Promise((resolve, reject) => {
        db.query(str, params, (err, result)=>{
            if (err) reject(err);
            resolve(result);
        })
    })
}


async function getNextID(table, column){
    let idquery = "SELECT MAX(" + column + ") AS maxid FROM "+ table;
    return await queryPromise(idquery, null);

} 

/**
 * scenarioInserting POST. Should receive following:
 * string scenarioNameVar, int scenarioTypeVar, int questionTypeVar,
 * string questionTextVar(300), string questionOptionVar(1-4)(140),
 * int questionCorrectVar(1-4). 
 * 
 * With (1-4) add one of the numbers 
 * to the end of the variablename as a part of the name e.g. questionCorrectVar1.
 * (300) and (140) are number of characters.
 */

app.post("/api/insert", async (req,res) => {
    
    //Insert into scenario table
    const scenarioName= req.body.scenarioNameVar;
    const scenarioID = ((await getNextID("scenario", "scenarioid"))[0].maxid)+1;
    const questionID = ((await getNextID("scenario", "questionid"))[0].maxid)+1;
    console.log ("ID on " + scenarioID);
    console.log ("QID on " + questionID);
    const scenarioInsert = 
    "INSERT INTO scenario (scenarioid, scenarioname, questionid) VALUES (?, ?, ?)";
    await queryPromise(scenarioInsert,[scenarioID, scenarioName, questionID])
        .then((result)=> {
            console.log ("SUCCESS! 1");
        })
        .catch((err) => console.log(err));

    //Insert into scenariocategory table
    const scenarioCat = req.body.scenarioTypeVar;
    const categoryInsert = 
    "INSERT INTO scenariocategory (scenarioid, category) VALUES (?, ?)";
    await queryPromise(categoryInsert, [scenarioID, scenarioCat])
        .then((result)=> {
            console.log ("SUCCESS! 2");
        })
        .catch((err) => console.log(err));

    //Insert into questionlist table
    const questionType = req.body.questionTypeVar;
    const questionListInsert = 
    "INSERT INTO questionlist (questionid, questiontype) VALUES (?, ?)";
    await queryPromise(questionListInsert, [questionID, questionType])
        .then((result)=> {
            console.log ("SUCCESS! 3");
        })
        .catch((err) => console.log(err));


    //Insert into QmultipleChoice table
    const questionText = req.body.questionTextVar;
    const questionOption1 = req.body.questionOption1Var;
    const questionOption2 = req.body.questionOption2Var;
    const questionOption3 = req.body.questionOption3Var;
    const questionOption4 = req.body.questionOption4Var;
    const correct1 = req.body.questionCorrect1Var;
    const correct2 = req.body.questionCorrect2Var;
    const correct3 = req.body.questionCorrect3Var;
    const correct4 = req.body.questionCorrect4Var;
    const qmultiplechoiceInsert =
    "INSERT INTO qmultiplechoice (questionid, questiontext, option1, option2, option3, option4, correct1, correct2, correct3, correct4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryPromise(qmultiplechoiceInsert, [questionID, questionText, questionOption1, questionOption2, questionOption3, questionOption4, correct1, correct2, correct3, correct4])
    .then((result)=> {
        console.log ("SUCCESS! 4");
    })
    .catch((err) => console.log(err));
    res.end();
});



app.listen(3001,()=>{
    console.log("running on port 3001");
});