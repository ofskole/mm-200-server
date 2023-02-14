Language module for the task "Making tools for your project".



Usage

const getLanguageData = require("./languageModule/dictionary.js"); //check location.

const languageData = getLanguageData("english"); / let data = await getLanguageData(language);

console.log(languageData);


The package currently support english, norwegian and swedish. To add more languages, simply add a json file in the languageModule/language folder with the same name as the language.
Button id, language const, etc should be the same as the name of the json file, for example "english" as button id and "english.json" as file name.

To add more content to your language, simply store it in the json file in the same way the other content is stored.
