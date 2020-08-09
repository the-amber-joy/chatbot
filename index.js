import trigger from "./trigger.js"
import reply from "./reply.js"
import alternative from "./alternative.js"
import covid from "./covid.js"
import isoLangs from "./isoLangs.js"

const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelect");
const languageSelect = document.getElementById("languageSelect")
const inputField = document.getElementById("input")
const outputDiv = document.getElementById("output");
const rateSelect = document.querySelector("form[name='rate']")
const pitchSelect = document.querySelector("form[name='pitch']")
const defaultLang = "English"
const voiceOptions = {};
let selectedPitch = 1;
let selectedRate = 1;
let botName = "";
let isGoogle = false;
let selectedVoice = null;

getLanguages().then(languages => {
    // trim countries from language codes
    languages = languages.map(lang => {
        const n = lang.indexOf('-');
        lang = lang.substring(0, n != -1 ? n : lang.length);
        return lang;
    })

    // Make a set to remove dupes, and convert back to array
    const filteredLangs = Array.from(new Set(languages));

    // Get language names, and sort the new collection
    const langObjects = filteredLangs.map(lang => {
        return { name: getLanguageName(lang), isoCode: lang };
    }).sort((a, b) => (a.name > b.name) ? 1 : -1)

    const languageOptions = {};
    // Add to language options
    langObjects.forEach((lang) => {
        languageOptions[lang.isoCode] = lang;
        const languageOption = document.createElement("option");
        languageOption.setAttribute("value", lang.isoCode);
        if (lang.name === defaultLang) {
            languageOption.setAttribute("selected", true);
            populateVoices(lang.isoCode)
        }
        languageOption.text = lang.name;
        languageSelect.appendChild(languageOption);
    })

})

document.addEventListener("DOMContentLoaded", () => {
    inputField.addEventListener("keydown", function (e) {
        if (e.code === "Enter") {
            let input = inputField.value;
            inputField.value = "";
            output(input);
        }
    });

    voiceSelect.addEventListener('change', function () {
        selectedVoice = voiceOptions[this.value];
        newGreeting(voiceOptions[this.value])
    });

    languageSelect.addEventListener('change', function () {
        const selectedLanguage = this.value;
        populateVoices(selectedLanguage)
    });


    rateSelect.addEventListener('click', () => {
        const rates = document.querySelectorAll("input[name='rate']")

        for (let i = 0; i < rates.length; i++) {
            rates[i].onclick = () => {
                selectedRate = rates[i].value;
                voiceChange(rates[i].id)
            }
        }
    });

    pitchSelect.addEventListener('click', () => {
        const pitches = document.querySelectorAll("input[name='pitch']")

        for (let i = 0; i < pitches.length; i++) {
            pitches[i].onclick = () => {
                selectedPitch = pitches[i].value;
                voiceChange(pitches[i].id)
            }
        }
    });
});

function newGreeting(selectedVoice) {
    const name = selectedVoice.name
    isGoogle = name.startsWith("Google");

    let intro = `Hello, my name is ${selectedVoice.name}`
    let extra = isGoogle ? ", but you can call be Googlebot." : "."
    botName = isGoogle ? "Googlebot" : selectedVoice.name

    const u = new SpeechSynthesisUtterance(intro + extra)
    u.volume = 1;
    u.rate = selectedRate;
    u.pitch = selectedPitch;
    u.voice = selectedVoice
    synth.speak(u)
}

function voiceChange(newProperty) {
    let speech = `Now I am speaking with a ${newProperty} voice`

    const u = new SpeechSynthesisUtterance(speech)
    u.volume = 1;
    u.rate = selectedRate;
    u.pitch = selectedPitch;
    u.voice = selectedVoice
    synth.speak(u)
}

function getLanguageName(key) {
    const lang = isoLangs[key];
    return lang ? lang.name : undefined;
}

function populateVoices(isoCode) {
    loadVoices(isoCode).then(voices => {
        voiceSelect.querySelectorAll('*').forEach(n => n.remove());

        selectedVoice = voices[0];

        for (let i = 0; i < voices.length; i++) {
            const name = voices[i].name

            isGoogle = name.startsWith("Google");

            voiceOptions[name] = voices[i];
            const voiceOption = document.createElement("option");
            voiceOption.setAttribute("value", name);
            voiceOption.text = isGoogle ? `${name} (Googlebot)` : name;
            voiceSelect.appendChild(voiceOption);
        }

        newGreeting(voiceOptions[selectedVoice.name])
    });
}

function output(input) {
    let response;

    //Transforms whatever the user inputs to lowercase and remove all chars except word characters, space, and digits
    let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

    // For example 'tell me a story' becomes 'tell me story'
    // Or 'i feel happy' -> 'happy'
    text = text
        .replace(/ a /g, " ")
        .replace(/i feel /g, "")
        .replace(/whats/g, "what is")
        .replace(/please /g, "")
        .replace(/ please/g, "");

    // Searches for an exact match with the 'trigger' array, if there are none, it goes will check if message contains 'covid/coronavirus,' and if not - random alternative
    if (compare(trigger, reply, text)) {
        response = compare(trigger, reply, text);
    } else if (text.match(/coronavirus/gi)) {
        response = covid[Math.floor(Math.random() * covid.length)];
    } else if (text.match(/covid/gi)) {
        response = covid[Math.floor(Math.random() * covid.length)];
    } else {
        response = alternative[Math.floor(Math.random() * alternative.length)];
    }

    //update DOM
    addChat(input, response);
    // copycat mode
    // addChat(input, input);
}

function compare(triggerArray, replyArray, string) {
    let item;
    for (let x = 0; x < triggerArray.length; x++) {
        for (let y = 0; y < replyArray.length; y++) {
            if (triggerArray[x][y] == string) {
                const items = replyArray[x];
                item = items[Math.floor(Math.random() * items.length)];
            }
        }
    }
    return item;
}

function addChat(input, response) {
    // Reply Mode (comment these 4 lines for copycat mode)
    const userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
    outputDiv.insertBefore(userDiv, document.getElementById("bot"))

    const u = new SpeechSynthesisUtterance(response);
    u.text = response;
    u.volume = 1;
    u.rate = selectedRate;
    u.pitch = selectedPitch;
    u.voice = selectedVoice;

    const botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.innerHTML = `${botName}: <span id="bot-response">${response}</span>`;
    outputDiv.insertBefore(botDiv, userDiv)
    // copycat mode
    // outputDiv.insertBefore(botDiv, document.getElementById("bot"))

    synth.speak(u);
}

function loadVoices(isoCode = "en") {
    return new Promise(
        function (resolve, reject) {
            let id;
            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices().filter(voice => voice.lang.startsWith(`${isoCode}`)));
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

function getLanguages() {
    return new Promise(
        function (resolve, reject) {
            let id;
            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    const languages = [];
                    synth.getVoices().forEach(voice => languages.push(voice.lang))
                    resolve(languages);
                    clearInterval(id);
                }
            }, 10);
        }
    )
}