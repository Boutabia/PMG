const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();

const {contentRouter} = require("./contentRouter");
const {usersRouter} = require("./userRouter");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

/**
 * All /api/content HTTP methods go to content.
 */

app.use("/api/content", contentRouter);

/**
 * All /api/user HTTP methods go to user.
 */


app.use("/api/user", usersRouter);

/**
 * port-definition
 */

app.listen(3001,()=>{
    console.log("running on port 3001");
});