const { query } = require("express");
const {db, queryPromise, getNextID} = require("./dbpool");
/**
 * Inserts data to table named "scenario" 
 * @param {Request object} req 
 * @param {Number} scenarioID 
 * @param {Number} questionID 
 */
async function insertToScenario(req, scenarioID, questionID){
    let success = false;
    const difficulty = req.body.scenarioDifficultyVar ? req.body.scenarioDifficultyVar : 2;
    const scenarioName = req.body.scenarioNameVar;
    const scenarioInsert = 
    "INSERT INTO scenario (scenarioid, scenarioname, questionid, difficulty) VALUES (?, ?, ?, ?)";
    await queryPromise(scenarioInsert,[scenarioID, scenarioName, questionID, difficulty])
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

/**
 * Function that inserts to scenariocategory.
 * @param {Request-object} req 
 * @param {Number} scenarioID 
 */
async function insertToScenarioCategory(req, scenarioID){
    let success = false;
    const scenarioCat = req.body.scenarioCategoryVar;
    const categoryarray = new Array();
    for (let i = 0; i < scenarioCat.length; i++){
        categoryarray.push(scenarioID, scenarioCat[i]);
    }
    const categoryInsert = 
    "INSERT INTO scenariocategory (scenarioid, categoryid) VALUES (?, ?)";
    await queryPromise(categoryInsert, categoryarray)
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

/**
 * Inserts request data to questionlist table.
 * @param {Request} req 
 * @param {Number} questionID 
 */
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

/**
 * Inserts data from request to qmultiplechoice-table.
 * @param {Request} req 
 * @param {Number} questionID 
 */

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

/**
 * Gets all the scenarios and their related information
 * limited by parameters. If game, list is randomized and limited.
 * When game is false, returns list in id-order.
 * @param {Array} categories 
 * @param {Number} limit 
 * @param {Boolean} game 
 */
async function getScenarioList(categories = [], limit = 10, game = false, difficulty = 2){
    let query = "SELECT * FROM scenario, scenariocategory, category, questionlist "
    query += "WHERE (scenario.scenarioid = scenariocategory.scenarioid "
    query += "AND scenario.questionid = questionlist.questionid "
    if (game) query += "AND scenario.difficulty = ? ";
    query += "AND category.categoryid = scenariocategory.categoryid) ";

    if (categories.length > 0){
        query += "AND ("
        for (let i = 0; i < categories.length; i++){
            query += "scenariocategory.categoryid = ? OR "
        } 
        query += "1 = 2) ";
    }
    let queryarray;
    if (game){
        query += "ORDER BY RAND() LIMIT ?";
        queryarray = [difficulty].concat(categories.concat([limit]));
    }
    else {
        query += "ORDER BY scenario.scenarioid";
    }
    

    const result = await queryPromise(query, queryarray);

    //cleanup
    const scenarioArray = new Array();
    for (let i = 0; i < result.length; i++){
        const element = {
            scenarioid: result[i].scenarioid,
            scenarioname: result[i].scenarioname,
            scenariodifficulty: result[i].difficulty,
            questionid: result[i].questionid, 
            categoryid: result[i].categoryid,
            categoryname: result[i].categoryname,
            questiontype: result[i].questiontype
        }
        scenarioArray.push(element);
    }
    return scenarioArray;
}

/**
 * This can be extended or modularized to fetch multiple types of questions.
 * Currently just questiontype 1.
 * @param {Array} scenarioArray 
 */
async function fetchQuestions(scenarioArray){
    for (let i = 0; i < scenarioArray.length; i++){
        const questionid = scenarioArray[i].questionid;
        const questiontype = scenarioArray[i].questiontype;
        if (questiontype == 1){ // always true, as it is for now, the only questiontype
            const query = "SELECT * FROM qmultiplechoice WHERE questionid = ?"
            const result = await queryPromise(query, [questionid]);

            scenarioArray[i].questionid = result[0].questionid,
            scenarioArray[i].questiontext = result[0].questiontext,
            scenarioArray[i].picture = result[0].picture,
            scenarioArray[i].option1 = result[0].option1,
            scenarioArray[i].option2 = result[0].option2,
            scenarioArray[i].option3 = result[0].option3,
            scenarioArray[i].option4 = result[0].option4,
            scenarioArray[i].correct1 = result[0].correct1,
            scenarioArray[i].correct2 = result[0].correct2,
            scenarioArray[i].correct3 = result[0].correct3,
            scenarioArray[i].correct4 = result[0].correct4,
            scenarioArray[i].explanation = result[0].explanation
        }
    }
    //console.log(scenarioArray);
    return scenarioArray;
}

/**
 * Returns all categories saved in category-table. 
 */
async function getCategories(){
    const query = "SELECT * FROM category";
    result = await queryPromise(query);
    const categoryArray = new Array();
    for (let i = 0; i < result.length; i++){
        const element = {
            categoryid: result[i].categoryid,
            caregoryname: result[i].categoryname
        }
        categoryArray.push(element);
    }
    return categoryArray;
}

/**
 * Inserts a new category with new ID to the category-table
 * @param {String} newCategoryName 
 */
async function insertCategory(newCategoryName){
    const categoryid = await getNextID("category", "categoryid");
    const query = "INSERT INTO category VALUES (?, ?)"
    await queryPromise(query, [categoryid, newCategoryName])
        .catch((err)=>{
            console.log(err);
        });
    return;
}

/**
 * Returns an array of all the statistics for scenarios
 * If you want to limit to a single scenario statistics, add an id. 
 * @param {Number} id 
 */
async function getStatistics(id = 0){
    let query = "SELECT * FROM statistic ";
    const parameterarray = new Array();
    if (id > 0){
        query += "WHERE scenarioid = ?";
        parameterarray.push(id);
    } 
    const result = await queryPromise(query, parameterarray);
    const resultarray = new Array();
    for (let i = 0; i < result.length; i++){
        const element = {
            id: result[i].scenarioid,
            correct: result[i].correct,
            partiallycorrect: result[i].partiallycorrect,
            incorrect: result[i].incorrect,
            total: result[i].total 
        }
        resultarray.push(element);
    }
    return resultarray;
}
/**
 * Function that adds statistics. Array inserted needs to have
 * elements, which consist of ID that is going to be updated, and
 * statistic, which will be 0 1 or 2, according to that part
 * a certain stat will be incremented. 0 for incorrect, 1 for partially
 * correct and 2 for correct. Total will always be incremented.
 * @param {Array} statisticsArray 
 */

async function addStatistics(statisticsArray){
    const invalidated = new Array();
    for (let i = 0; i < statisticsArray.length; i++){
        const id = statisticsArray[i].id;
        const statistic = statisticsArray[i].statistic;
        let toIncrement;
        switch (statistic){
            case 0:
                toIncrement = "incorrect";
                break;
            case 1:
                toIncrement = "partiallycorrect";
                break;
            case 2: 
                toIncrement = "correct";
                break;
            default:
                invalidated.push(id);
                continue;
        }
        const query = "UPDATE statistic SET total = total+1, " 
                    + toIncrement + " = " + toIncrement+ "+1 "
                    + "WHERE scenarioid = ?";
        const result = await queryPromise(query, id);
        if (result.affectedRows > 0) continue;
        console.log("here");
        invalidated.push(id);
    }
    return invalidated;
}

/**
 * When inserting a scenario, statistics need also to be added for the scenario.
 * This function does that, and only id needs to be inserted. Other values
 * in table statistic will be defaulted. 
 * @param {Number} id 
 */
async function insertToStatistics(id){
    return queryResposne = await queryPromise("INSERT INTO statistic (scenarioid) VALUES (?)", [id]);
}
//more?

module.exports={
    insertToScenario,
    insertToScenarioCategory,
    insertToQuestionlist,
    insertToQmultiplechoice, 
    getScenarioList,
    fetchQuestions,
    getCategories,
    insertCategory,
    getStatistics,
    addStatistics,
    insertToStatistics
}