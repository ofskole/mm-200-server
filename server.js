const express = require("express");
const server = express();

const PORT = process.env.PORT || 8080;
server.set("port", PORT);

const list = require("./modules/lists.js");
const users = require("./modules/users.js");
const language = require("./modules/language.js");

server.use(express.static("public"));
server.use(express.json());
server.use(list);
server.use(users);
server.use(language);


server.use(function(err, res) {
    res.status(403).json({
        error :"Something went wrong.",
        descr: err
    }).end();
});


server.listen(PORT, function () {
    console.log("Pingu is flying...");
});