// ----------------------- Routes for language ----------------------- //

const express = require("express");
const router = express.Router();
const getLanguageData = require("./dictionary.js");

router.get("/language", async function (req, res) {

    let language = req.query.language;//get chosen language from query string

    try {

        let data = await getLanguageData(language); //send chosen lagnuage to dictionary.js and get json language file.

        if (data.error) {
            res.status(403).json({error:err}).end();
        } else {
            res.status(200).json(data).end(); //return language file if found.
        }

    } catch (err) {
        console.log(err);
        res.status(403).json({error:err}).end();
    }
});

module.exports = router;