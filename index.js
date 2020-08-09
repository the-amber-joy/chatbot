import { trigger, reply, alternative, covid } from "./words/index.js"
import getLanguages from "./getLanguages.js"
import filterLanguages from "./filterLanguages.js"
import populateLanguages from "./populateLanguages.js"
import populateVoices from "./populateVoices.js"
import sayStuff from "./sayStuff.js"

const voiceSelect = document.getElementById("voiceSelect");
const languageSelect = document.getElementById("languageSelect")
const inputField = document.getElementById("input")
const outputDiv = document.getElementById("output");
const rateSelect = document.querySelector("form[name='rate']")
const pitchSelect = document.querySelector("form[name='pitch']")
const synth = window.speechSynthesis;
let voiceOptions = {};
let selectedPitch = 1;
let selectedRate = 1;
let botName = "Alex";
let isGoogle = false;
let selectedVoice = null;


(async () => {
    const languages = await getLanguages();
    const { langObjects } = filterLanguages(languages);
    const voices = await populateLanguages(langObjects);
    selectedVoice = voices.selectedVoice;
    voiceOptions = voices.voiceOptions;
})()

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
        botName = this.value;
        sayStuff({
            voice: voiceOptions[this.value],
            rate: selectedRate,
            pitch: selectedPitch
        })
    });

    languageSelect.addEventListener('change', function () {
        const selectedLanguage = this.value;
        populateVoices(selectedLanguage).then(res => {
            voiceOptions = res.voiceOptions;
            selectedVoice = res.selectedVoice;
        });
    });


    rateSelect.addEventListener('click', () => {
        const rates = document.querySelectorAll("input[name='rate']")

        for (let i = 0; i < rates.length; i++) {
            rates[i].onclick = () => {
                selectedRate = rates[i].value;
                sayStuff({
                    newProp: rates[i].id,
                    voice: selectedVoice,
                    rate: selectedRate,
                    pitch: selectedPitch
                })

            }
        }
    });

    pitchSelect.addEventListener('click', () => {
        const pitches = document.querySelectorAll("input[name='pitch']")

        for (let i = 0; i < pitches.length; i++) {
            pitches[i].onclick = () => {
                selectedPitch = pitches[i].value;
                sayStuff({
                    newProp: pitches[i].id,
                    voice: selectedVoice,
                    rate: selectedRate,
                    pitch: selectedPitch
                })
            }
        }
    });
});

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
}

function addChat(input, response) {
    const userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
    outputDiv.insertBefore(userDiv, document.getElementById("bot"))

    const botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.innerHTML = `${botName}: <span id="bot-response">${response}</span>`;
    outputDiv.insertBefore(botDiv, userDiv)

    sayStuff({
        rate: selectedRate,
        pitch: selectedPitch,
        voice: selectedVoice,
        text: response
    })
}
