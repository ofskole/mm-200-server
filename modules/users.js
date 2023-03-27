// ----------------------- Routes for user stuff ----------------------- //

const express = require("express");
const db = require("./db.js");
const authUtils = require("./auth_utils.js");
const protect = require("./auth.js");
const router = express.Router();


// Create user.
router.post("/users", async function(req, res, next) {
    let credString = req.headers.authorization; // receive credentials
    let cred = authUtils.decodeCred(credString); // decode credentials

    let hash = authUtils.createHash(cred.password); // create hash and salt

    try{
        let data = await db.createUser(cred.username, hash.value, hash.salt); // send username, hash, and salt to db.js

        if (data.rows.length > 0){ // if user was created, send success.
            res.status(200).json({msg: "User was created. Redirecting..."}).end();
        }

        else { // if user was not created, whine.
            throw "User could not be created.";
        }

    }
    catch(err){
        next(err);
    }
});


// Login user.
router.post("/users/login", async function(req, res, next) {

    let credString = req.headers.authorization; // receive credentials
    let cred = authUtils.decodeCred(credString); // decode credentials

    try{
        let data = await db.getUser(cred.username); // ask db.js function for information, send username

        let dbUserId = data.rows[0].id;
        let dbUsername = data.rows[0].username;
        let dbHash = data.rows[0].password;
        let dbSalt = data.rows[0].salt;
        let inputPassword = cred.password;

        if (data.rows.length == 0){
            res.status(403).json({error: "User does not exist"}).end();
            return;
        }

        if (authUtils.verifyPassword(inputPassword, dbHash, dbSalt)){ // if input hash matches db hash, create token and send it to user.
            let token = authUtils.createToken(dbUsername, dbUserId);
            res.status(200).json({
                token: token,
                msg: "User logged in. Redirecting..."
            }).end();
        }

        else{
            res.status(403).json({error: "Username and password do not match."}).end();
        }


    }
    catch(err){
        next(err);
    }
});


// Get user profile.
router.get("/profile", protect, async function(req, res, next) {

    let username = res.locals.username; // get username from session

    try{
        let data = await db.getUser(username);

        if (data.rows.length == 0){
            res.status(403).json({error: "User does not exist"}).end();
            return;
        }
        else{
            res.status(200).json({ //send username and role to client.
                user: username,
                role: data.rows[0].role
            }).end();
        }
    }
    catch(err){
        next(err);
    }
});




module.exports = router; // export router to server.js
