const crypto = require("crypto");
require("dotenv").config();

const secret = process.env.SECRET;

let utils = {};




utils.decodeCred = function (credString) {

    let cred = {};

    let b64String = credString.replace("basic ", ""); //remove "basic " from string

    let asciiString = Buffer.from(b64String, "base64").toString("ascii"); //convert to ascii, clear text.

    cred.username = asciiString.replace(/:.*/, ""); //extract username, using regex

    cred.password = asciiString.replace(cred.username + ":", ""); //extract password.

    return cred;

}


utils.createHash = function (password) {

    let hash = {};

    hash.salt = Math.random().toString();
    hash.value = crypto.scryptSync(password, hash.salt, 64).toString('hex');

    return hash;

}


utils.createToken = function (username, userID) {

    let part1 = JSON.stringify({"alg": "HS256", "typ": "JWT"}); //as json text
    let part2 = JSON.stringify({"user": username, "userid": userID, "iat": Date.now()}); //as json text

    let b64part1 = Buffer.from(part1).toString("base64"); //as base64
    let b64part2 = Buffer.from(part2).toString("base64"); //as base64

    let openPart = b64part1 + "." + b64part2; //combine parts with a dot

    let sign = crypto.createHmac('sha256', secret).update(openPart).digest("base64");

    return openPart + "." + sign;
}



utils.verifyToken = function (token) {

    let tokenArr = token.split(".");
    let openPart = tokenArr[0] + "." + tokenArr[1];
    let signToCheck = tokenArr[2];

    let sign = crypto.createHmac('sha256', secret).update(openPart).digest("base64");

    if (signToCheck !== sign) {
        return false;
    }

    let payloadText = Buffer.from(tokenArr[1], "base64").toString("ascii");
    let payload = JSON.parse(payloadText);

    let expireTime = payload.iat + 1000 * 60 * 60; //expire time is 1 hour

    if (expireTime < Date.now()) {
        return false;
    }

    return payload; //token ok
    
}



utils.verifyPassword = function (pswFromUser, hashFromDB, saltFromDB) {

    hash = crypto.scryptSync(pswFromUser, saltFromDB, 64).toString("hex");

    if (hash == hashFromDB) {
        return true;
    }

    return false;
}



module.exports = utils;