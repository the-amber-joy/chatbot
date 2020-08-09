import isoLangs from "./isoLangs.js"

function getLanguageName(key) {
    const lang = isoLangs[key];
    return lang ? lang.name : undefined;
}

export default function filterLanguages(languages) {
    // trim countries from language codes
    languages = languages.map(lang => {
        const n = lang.indexOf('-');
        lang = lang.substring(0, n != -1 ? n : lang.length);
        return lang;
    });

    // Make a set to remove dupes, and convert back to array
    const filteredLangs = Array.from(new Set(languages));

    // Get language names, and sort the new collection
    const langObjects = filteredLangs.map(lang => {
        return { name: getLanguageName(lang), isoCode: lang };
    }).sort((a, b) => (a.name > b.name) ? 1 : -1);
    return { langObjects };
}