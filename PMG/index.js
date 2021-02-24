const express = require("express");
const bodyParser = require("body-parser");
const cors = require ("cors");
const app = express();
const {isThereASuperuser} = require("./tools/usertools");
const fileUpload = require('express-fileupload');
const path = require('path');
const {contentRouter} = require("./routes/contentRouter");
const {userRouter} = require("./routes/userRouter");
let PORT = process.env.PORT || 3000;

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
 * whitlisting
 */

const whitelist = ['http://localhost:3000', 'http://localhost:8080' , 'https://tuni-pmg.herokuapp.com']
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))


/**
 * Serving react
 */
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}


/**
 * port-definition
 */
app.listen(PORT,()=>{
    console.log(`app is running ${PORT}`);
});