function getNextID(table, column){
    let idquery = "SELECT MAX(?) AS maxid FROM ?";
    try{
        db.query(idquery,[column, table], (err, result)=>{
            if (err){
                console.log(err);
            }
            else{
                console.log(result);
                return result;
            }
        })
    }
    catch (e){
        console.log("ERROR: " + e);
    }
    return null;
}

app.post("/api/insert",(req,res) => {
    
    //Insert into scenario table
    const scenarioName= req.body.scenarioNameVar;
    const scenarioID = getNextID("scenario", "scenarioid");
    const questionID = getNextID("scenario", "questionid");
    console.log ("ID on " + scenarioID);
    console.log ("QID on " + questionID);
    const scenarioInsert = 
    "INSERT INTO scenario (scenarioid, scenarioname, questionid) VALUES (?, ?, ?)";
    db.query(scenarioInsert,[scenarioID, scenarioName, questionID],(err,result)=>{
        if (err){
            console.log(err);
        }
        else{
            console.log("inserted \n" + result);
        }
    });

    //Insert into scenariocategory table
    const scenarioCat = req.body.scenarioTypeVar;
    const categoryInsert = 
    "INSERT INTO scenariocategory (scenarioid, category) VALUES (?, ?)";
    db.query(categoryInsert, [scenarioID, scenarioCat], (err, result)=>{
        if (err) {
            console.log(err)
        }
        else {
            console.log("inserted" + result);
        }
    });

    //Insert into questionlist table
    const questionType = req.body.questionTypeVar;
    const questionListInsert = 
    "INSERT INTO questionlist (questionid, questiontype) VALUES (?, ?)";
    db.query(questionListInsert, [questionID, questionType], (err, result)=>{
        if (err) {
            console.log(err)
        }
        else {
            console.log("inserted" + result);
        }
    });


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
    "INSERT INTO qmultiplechoice (id, text, option1, option2, option3, option4, correct1, correct2, correct3, correct4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(qmultiplechoiceInsert, [questionID, questionText, questionOption1, questionOption2, questionOption3, questionOption4, correct1, correct2, correct3, correct4], (err, result)=>{
        if (err) {
            console.log(err)
        }
        else {
            console.log("inserted" + result);
        }
    })

});




/*
app.get("/api/randomscenario", (req, res)=>{
    /*
    Take restrictions to random from request parameters,
    e.g. 
        type == manager
        amount == 10

    const sqlSelect = "SELECT * FROM scenario WHERE type == ? ORDER BY RAND() LIMIT ?";
    db.query(sqlInsert,[scenarioType, scenarioAmount],(err, result)=>{
        console.log(err);
    });
    
});


/*
app.post("/insert/statistics", (req, res)=>{

    const {incorrects} = req.body.scenarioincorrectlist;
    const {corrects} = req.body.scenariocorrectlist;
    const sqlUpdate = "UPDATE scenarios SET corrects = corrects + 1 WHERE scenarioid = "
    for (corrects length > i; i++){
        add options to query
    } 
    db.query(sqlUpdate,(err, result)=>{
        console.log(err);
    });

    same for incorrects
});

*/