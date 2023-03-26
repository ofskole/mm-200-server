const express = require("express");
const router = express.Router();
const getLanguageData = require("./dictionary.js");

router.get("/language", async function (req, res) {

    let language = req.query.language;

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

module.exports = router;