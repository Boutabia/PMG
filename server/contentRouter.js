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
    insertCategory, 
    getStatistics,
    addStatistics,
    insertToStatistics,
    deleteScenario,
    deleteCategory} = require("./contentTools");

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
    console.log(await insertToScenario(req, scenarioID, questionID));

    //insert into statistics
    console.log(await insertToStatistics(scenarioID));
    
    //Insert into scenariocategory table
    console.log(await insertToScenarioCategory(req, scenarioID));

    //Insert into questionlist table
    console.log(await insertToQuestionlist(req, questionID));
    //When someone starts to add more questiontypes, the logic which one is inserted could go here
        /*By this logic, I use qmultiplechoice*/ 
    //Insert into qmultipleChoice table
    console.log(await insertToQmultiplechoice(req, questionID));
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
    const scenarioArray = await getScenarioList(body.categories, body.limit, true, body.difficulty);

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

/**
 * GET all statistics, or set "scenarioIdVar" to body, if you want a single 
 * scenario statistics.
 */
contentRouter.get("/statistics", async(req, res)=>{
    const id = req.body.scenarioIdVar;
    const statistics = await id > 0 ? await getStatistics(id) : await getStatistics(); 
    res.writeHead(200, "Statistics fetched!", {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(statistics));
});
/**
 * PUT statistics to update new numbers in there. 
 * send statisticsArrayVar, which has 2 variables for each 
 * element. Variables are "id" and "statistic"
 * For id insert Number scenarioid, and for statistic
 * insert Number 0, 1 or 2 based on the 
 * answer. If answer was totally wrong: 0, 
 * if partially correct: 1, if totally correct: 2.
 */
contentRouter.put("/statistics", async(req, res)=>{
    const statistics = req.body.statisticsArrayVar;
    const invalidatedStatistics = await addStatistics(statistics);
    console.log(invalidatedStatistics);
    if (invalidatedStatistics.length > 0){
        res.statusCode = 400;
        res.statusMessage= "Some statistics were invalid";
        return res.end(JSON.stringify(invalidatedStatistics));
    }
    res.statusCode = 200;
    res.statusMessage = "All statistics updated.";
    return res.end();
});

contentRouter.delete("/scenario", authenticateToken, async(req, res)=>{
    const id = req.body.scenarioToDeleteVar;
    const deleted = await deleteScenario(id);
    res.writeHead(200, `Succesfully deleted ${deleted.affectedRows} records.`);
    res.end(deleted.affectedRows);
});

contentRouter.delete("/category", authenticateToken, async(req, res)=>{
    const id = req.body.categoryToDeleteVar;
    
    const scenariosUsingThisCategory = (await getScenarioList([id])).length;
    if (scenariosUsingThisCategory > 0) {
        res.writeHead(400, `Bad request. There are ${scenariosUsingThisCategory} scenarios using this category. Delete them before deleting the category`);
        return res.end();
    }
    const isDeleted = deleteCategory(id);
    res.writeHead(200, "Succesfully deleted a category.");
    res.end();
});


module.exports = {
    contentRouter
}