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

app.post("/api/insert",(req,res) => {
    
    const scenarioName= req.body.scenarioNameVar;
    const scenarioType= req.body.scenarioTypeVar;
    const sqlInsert = 
    "INSERT INTO scenario (scenarioname , scenariotype) VALUES (? , ?)";
    db.query(sqlInsert,[scenarioName, scenarioType],(err,result)=>{
        console.log(err);
    });
});
app.listen(3001,()=>{
    console.log("running on port 3001");
});