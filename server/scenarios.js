const {db, queryPromise} = require("./dbpool");


/**
 * Method to insert into the scenario -table
 * @param {Object} req 
 * @param {*} scenarioID 
 * @param {*} questionID 
 */

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
    "INSERT INTO scenariocategory (scenarioid, categoryid) VALUES (?, ?)";
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
    const explanation = req.body.questionExplanationVar;
    const qmultiplechoiceInsert =
    "INSERT INTO qmultiplechoice (questionid, questiontext, picture, option1, option2, option3, option4, correct1, correct2, correct3, correct4, explanation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryPromise(qmultiplechoiceInsert, [questionID, questionText, picturePath, questionOption1, questionOption2, questionOption3, questionOption4, correct1, correct2, correct3, correct4, explanation])
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
///////////////////////////////Functios TODO for loading scenarios

//define search? For getScenario to not get so cluttered

//getScenario based on options chosen

//getQMultiplechoice

//more?


module.exports = {
    insertToScenario,
    insertToScenarioCategory,
    insertToQuestionlist,
    insertToQmultiplechoice
}