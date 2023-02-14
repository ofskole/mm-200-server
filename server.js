const express = require("express");
const getLanguageData = require("./languageModule/dictionary.js");
const server = express();

const PORT = process.env.PORT || 8080;
server.set("port", PORT);


server.use(express.static("public"));
server.use(express.json());


server.post("/language", async function (req, res) {

    
    let language = req.body.language;

    try {

        let data = await getLanguageData(language);

        if (data.error) {
            res.status(403).json({error:err}).end();
        } else {
            res.status(200).json(data).end();

        }

    } catch (err) {
        console.log(err);
        res.status(403).json({error:err}).end();
    }
});


server.use(function(err, res) {
    res.status(403).json({
        error :"Something went wong.",
        descr: err
    }).end();
});




server.listen(PORT, function () {
    console.log("Pingu is flying...");
});