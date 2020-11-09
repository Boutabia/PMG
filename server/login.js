const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const usertools = require('./usertools');

async function login(request, response){
    const body = request.body;
    const user = usertools.getUser(request.body.username);
    const pwCorrect = user === undefined
      ? false
      : await bcrypt.compare(body.password, user.passwordhash);
    if (!(user && passwordCorrect)) {
        response.writeHead(401, "invalid username or password");
        return response.end();
    }

    const userForToken = {
        username: user.name,
        id: user.id
    } 

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.writeHead(200, "Login valid.");
    return response.end();
}

module.exports = login;
