// ----------------------- Auth_utils module ----------------------- //

const crypto = require("crypto");
require("dotenv").config();

const secret = process.env.SECRET; //get secret from env file.

let utils = {}; //create object to hold functions.




utils.decodeCred = function (credString) {

    let cred = {}; //create object to hold username and password.

    let b64String = credString.replace("basic ", ""); //remove "basic " from string

    let asciiString = Buffer.from(b64String, "base64").toString("ascii"); //convert to ascii, clear text.

    cred.username = asciiString.replace(/:.*/, ""); //extract username, using regex

    cred.password = asciiString.replace(cred.username + ":", ""); //extract password.

    return cred; //return object with username and password.

}


utils.createHash = function (password) {

    let hash = {}; //create object to hold salt and hash.

    hash.salt = Math.random().toString(); //create random salt.
    hash.value = crypto.scryptSync(password, hash.salt, 64).toString('hex'); //create hash from password and salt.

    return hash; //return object with salt and hash.

}


utils.createToken = function (username, userID) {

    let part1 = JSON.stringify({"alg": "HS256", "typ": "JWT"}); //as json text
    let part2 = JSON.stringify({"user": username, "userid": userID, "iat": Date.now()}); //as json text

    let b64part1 = Buffer.from(part1).toString("base64"); //as base64
    let b64part2 = Buffer.from(part2).toString("base64"); //as base64

    let openPart = b64part1 + "." + b64part2; //combine parts with a dot

    let sign = crypto.createHmac('sha256', secret).update(openPart).digest("base64"); //create signature

    return openPart + "." + sign; //return token
}



utils.verifyToken = function (token) {

    let tokenArr = token.split("."); //split token into 3 parts
    let openPart = tokenArr[0] + "." + tokenArr[1]; //combine first 2 parts with a dot
    let signToCheck = tokenArr[2]; //get signature to check

    let sign = crypto.createHmac('sha256', secret).update(openPart).digest("base64"); //create signature

    if (signToCheck !== sign) { //check if signature is valid
        return false; //token is invalid
    }

    let payloadText = Buffer.from(tokenArr[1], "base64").toString("ascii"); //get payload as text
    let payload = JSON.parse(payloadText); //get payload as object

    let expireTime = payload.iat + 1000 * 60 * 60; //expire time is 1 hour

    if (expireTime < Date.now()) { //check if token has expired
        return false;
    }

    return payload; //token ok
    
}



utils.verifyPassword = function (pswFromUser, hashFromDB, saltFromDB) {

    hash = crypto.scryptSync(pswFromUser, saltFromDB, 64).toString("hex"); //create hash from password and salt.

    if (hash == hashFromDB) { //check if hash is valid
        return true;
    }

    return false;
}



module.exports = utils;