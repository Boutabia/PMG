const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();

const {contentRouter} = require("./content");
const {usersRouter} = require("./users");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

/**
 * All /api/content HTTP methods go to content.
 */

app.use("/api/content", contentRouter);

app.use("/api/users", usersRouter);

/**
 * port-definition
 */

app.listen(3001,()=>{
    console.log("running on port 3001");
});