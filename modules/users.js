const express = require("express");
const db = require("./db.js");
const authUtils = require("./auth_utils.js");
const protect = require("./auth.js");
const router = express.Router();



router.post("/users", async function(req, res, next) {
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == ""){
        res.status(403).json({error: "Username and password are required."}).end();
        return;
    }

    let hash = authUtils.createHash(cred.password);

    try{
        let data = await db.createUser(cred.username, hash.value, hash.salt);

        if (data.rows.length > 0){
            res.status(200).json({msg: "User was created. Redirecting..."}).end();
        }

        else {
            throw "User could not be created.";
        }

    }
    catch(err){
        next(err);
    }
});


router.post("/users/login", async function(req, res, next) {

    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == ""){
        res.status(403).json({error: "Username and password are required."}).end();
        return;
    }

    try{
        let data = await db.getUser(cred.username);

        let dbUserId = data.rows[0].id;
        let dbUsername = data.rows[0].username;
        let dbHash = data.rows[0].password;
        let dbSalt = data.rows[0].salt;
        let inputPassword = cred.password;

        if (data.rows.length == 0){
            res.status(403).json({error: "User does not exist"}).end();
            return;
        }

        if (authUtils.verifyPassword(inputPassword, dbHash, dbSalt)){
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


router.get("/profile", protect, async function(req, res, next) {

    let username = res.locals.username;

    try{
        let data = await db.getUser(username);

        if (data.rows.length == 0){
            res.status(403).json({error: "User does not exist"}).end();
            return;
        }
        else{
            res.status(200).json({
                user: username,
                role: data.rows[0].role
            }).end();
        }
    }
    catch(err){
        next(err);
    }
});




module.exports = router;
