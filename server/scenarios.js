const {db} = require("./dbpool");

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

async function insertToScenario(req, scenarioID, questionID){
    let success = false;
    const scenarioName = req.body.scenarioNameVar;
    const scenarioInsert = 
    "INSERT INTO scenario (scenarioid, scenarioname, questionid) VALUES (?, ?, ?)";
    await queryPromise(scenarioInsert,[scenarioID, scenarioName, questionID])
        .then((result)=> {
            console.log ("Inserted scenario succesfully 1/4.");
            success = true;        
        })
        .catch((err) => {
            console.log(err);
            success = false;
        });
    return success;
}

async function insertToScenarioCategory(req, scenarioID){
    let success = false;
    const scenarioCat = req.body.scenarioTypeVar;
    const categoryInsert = 
    "INSERT INTO scenariocategory (scenarioid, category) VALUES (?, ?)";
    await queryPromise(categoryInsert, [scenarioID, scenarioCat])
        .then((result)=> {
            console.log ("Inserted scenario category succesfully 2/4.");
            success = true;
        })
        .catch((err) => {
            console.log(err)
            success = false;
        });
    return success;
}

async function insertToQuestionlist(req, questionID){
    let success = false;
    const questionType = req.body.questionTypeVar;
    const questionListInsert = 
    "INSERT INTO questionlist (questionid, questiontype) VALUES (?, ?)";
    await queryPromise(questionListInsert, [questionID, questionType])
        .then((result)=> {
            console.log ("Inserted questionlist succesfully 3/4.");
            success = true;
        })
        .catch((err) => {
            console.log(err)
            success = false;
        });
    return success;
}

async function insertToQmultiplechoice(req, questionID){
    const questionText = req.body.questionTextVar;
    const picturePath = req.body.pictureVar;
    const questionOption1 = req.body.questionOption1Var;
    const questionOption2 = req.body.questionOption2Var;
    const questionOption3 = req.body.questionOption3Var;
    const questionOption4 = req.body.questionOption4Var;
    const correct1 = req.body.questionCorrect1Var;
    const correct2 = req.body.questionCorrect2Var;
    const correct3 = req.body.questionCorrect3Var;
    const correct4 = req.body.questionCorrect4Var;
    const qmultiplechoiceInsert =
    "INSERT INTO qmultiplechoice (questionid, questiontext, picture, option1, option2, option3, option4, correct1, correct2, correct3, correct4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryPromise(qmultiplechoiceInsert, [questionID, questionText, picturePath, questionOption1, questionOption2, questionOption3, questionOption4, correct1, correct2, correct3, correct4])
        .then((result)=> {
            console.log ("Inserted qmultiplechoice succesfully 4/4.");
            success = true;
        })
        .catch((err) => {
            console.log(err)
            success = false;
        });
    return success;
}

module.exports = {
    queryPromise,
    getNextID,
    insertToScenario,
    insertToScenarioCategory,
    insertToQuestionlist,
    insertToQmultiplechoice
}