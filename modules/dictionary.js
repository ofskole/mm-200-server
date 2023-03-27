// ---------- Dictionary Module ----------

async function getLanguageData(language) { //run function with chosen language as parameter
    let LANGUAGE = language;
    const chosenLanguage = require('./languages/' + LANGUAGE + '.json'); //get json file with chosen language
    switch (language) {     
        case language:
            return chosenLanguage; //return the chosen language file
        default:
            return {error: "Language could not be chosen."};
}
}

module.exports = getLanguageData;