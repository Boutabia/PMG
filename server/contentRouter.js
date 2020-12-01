const {getNextID} = require("./dbpool");
const contentRouter = require("express").Router();
const {authenticateToken} = require("./usertools");
const {insertToScenario,
    insertToScenarioCategory,
    insertToQuestionlist,
    insertToQmultiplechoice, 
    getScenarioList,
    fetchQuestions,
    getCategories,
    insertCategory} = require("./contentTools");

/**
 * Method to insert into the scenario -table
 * @param {Object} req 
 * @param {Number} scenarioID 
 * @param {Number} questionID 
 */


 /**
 * A POST that can insert categories to the category -table. Only name is needed.
 */
contentRouter.post("/category", authenticateToken, async (req, res) => {
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

    res.writeHead(200, `Fetched ${fullArray.length} scenarios.`, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(fullArray));
});



/**
 * GET that gets all scenarios from the database with all the info.
 * Doesn't use any parameters.
 */

contentRouter.get("/allscenarios", authenticateToken, async(req, res)=>{
    const scenarioArray = await getScenarioList([], Number.MAX_SAFE_INTEGER, false);

    if (scenarioArray.length === 0){
        res.writeHead(500, "No scenarios found.");
        return res.end();
    }

    const fullArray = await fetchQuestions(scenarioArray); 

    res.writeHead(200, `Fetched ${fullArray.length} scenarios.`, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(fullArray));
});

/**
 * GETs a list of categories. Simple.
 * Doesn't use any input parameters.
 */

contentRouter.get("/category", async(req, res)=>{
    const categoryArray = await getCategories();
    res.writeHead(200, "Categories fetched", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(categoryArray));
});



module.exports = {
    contentRouter
}