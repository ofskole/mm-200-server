async function getLanguageData(language) {
    let LANGUAGE = language;
    const chosenLanguage = require('./languages/' + LANGUAGE + '.json');
    switch (language) {     
        case language:
            return chosenLanguage;
        default:
            return {error: "Language could not be chosen."};
}
}

module.exports = getLanguageData;