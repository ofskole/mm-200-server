// ----------------------- Auth Module ----------------------- //

const authUtils = require("./auth_utils.js");

function protect(req, res, next) { //protects routes from unauthorized access.

    let token = req.headers.authorization; //checks for token in header.

    if (!token) { //If not found, returns error.
        res.status(401).json({error: "You have no token. Please sign in."}).end();
        return;
    }

    let payload = authUtils.verifyToken(token); //If found, verifies token.
    if (!payload) {//If invalid, returns error.
        res.status(401).json({error: "Token is invalid."}).end();
        return;
    }

    //If valid, continues to next function.

    res.locals.userid = payload.userid;
    res.locals.username = payload.user;

    next();
}

module.exports = protect;