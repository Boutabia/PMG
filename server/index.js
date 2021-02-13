const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {isThereASuperuser} = require("./tools/usertools");
const fileUpload = require('express-fileupload');

const {contentRouter} = require("./routes/contentRouter");
const {userRouter} = require("./routes/userRouter");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));

/**
 * if superuser has not been made when the server is launched, create a superuser.
 */

(async () => {
    await isThereASuperuser();
})();

/**
 * All /api/content HTTP methods go to content.
 */

app.use("/api/content", contentRouter);

/**
 * All /api/user HTTP methods go to user.
 */


app.use("/api/user", userRouter);

/**
 * port-definition
 */

app.listen(3001,()=>{
    console.log("running on port 3001");
});