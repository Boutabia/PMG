const {db, queryPromise, getNextID} = require("./dbpool");
const contentRouter = require("express").Router();
const authenticateToken = require("./users");

/**
 * Method to insert into the scenario -table
 * @param {Object} req 
 * @param {Number} scenarioID 
 * @param {Number} questionID 
 */


 /**
 * A POST that can insert categories to the category -table. Only name is needed.
 */
contentRouter.post("/category", async (req, res) => {
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

contentRouter.post("/complete", authenticateToken, async (req,res) => {
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

contentRouter.get("/startgame", async(req, res)=>{
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

contentRouter.get("/allscenarios", async(req, res)=>{
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

contentRouter.get("/api/get/category", async(req, res)=>{
    const categoryArray = await getCategories();
    res.writeHead(200, "Categories fetched", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(categoryArray));
});


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

/**
 * Function that inserts to scenariocategory.
 * @param {Request-object} req 
 * @param {Number} scenarioID 
 */
async function insertToScenarioCategory(req, scenarioID){
    let success = false;
    const scenarioCat = req.body.scenarioTypeVar;
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
async function getScenarioList(categories = [], limit = 10, game = false){
    let query = "SELECT * FROM scenario, scenariocategory, category, questionlist "
    query += "WHERE (scenario.scenarioid = scenariocategory.scenarioid "
    query += "AND scenario.questionid = questionlist.questionid "
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
        queryarray = categories.concat([limit]);
    }
    

    const result = await queryPromise(query, queryarray);

    //cleanup
    const scenarioArray = new Array();
    for (let i = 0; i < result.length; i++){
        const element = {
            scenarioid: result[i].scenarioid,
            scenarioname: result[i].scenarioname,
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

//more?

module.exports = {
    insertToScenario,
    insertToScenarioCategory,
    insertToQuestionlist,
    insertToQmultiplechoice, 
    getScenarioList,
    fetchQuestions,
    getCategories,
    insertCategory,
    scenarioRouter
}