import populateVoices from "./populateVoices.js"

const defaultLang = "English"

export default async function populateLanguages(langObjects) {
    const languageOptions = {};
    let defaultLangCode = null;

    langObjects.forEach((lang) => {
        // for each language, add it to the html option list
        languageOptions[lang.isoCode] = lang;
        const languageOption = document.createElement("option");
        languageOption.setAttribute("value", lang.isoCode);
        languageOption.text = lang.name;
        languageSelect.appendChild(languageOption);

        // if it's the default language, populate the voices for initial load
        if (lang.name === defaultLang) {
            languageOption.setAttribute("selected", true);
            defaultLangCode = lang.isoCode;
        }
    })

    return (async () => {
        return await populateVoices(defaultLangCode).then(voices => { return voices });
    })();
};
