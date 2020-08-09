import trigger from "./trigger.js"
import reply from "./reply.js"
import alternative from "./alternative.js"
import covid from "./covid.js"

const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelect");
const inputField = document.getElementById("input")
const outputDiv = document.getElementById("output");
const rateSelect = document.querySelector("form[name='rate']")
const pitchSelect = document.querySelector("form[name='pitch']")
const languageSelect = document.getElementById("languageSelect")
let botName = "Alex";
let selectedPitch = 1;
let selectedRate = 1;
let voiceOptions = {};
let selectedVoice = null;

loadVoices().then(voices => {
    selectedVoice = voices[0];

    for (let i = 0; i < voices.length; i++) {
        const name = voices[i].name
        voiceOptions[name] = voices[i];
        const option = document.createElement("option");
        option.setAttribute("value", name);
        option.text = name;
        voiceSelect.appendChild(option);
    }
});

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
        let intro = ""
        if (selectedVoice.name.startsWith("Google")) {
            intro = "I don't have a name, I am a monstrosity forged in the bowels of Google. But you can call me Coach."
            botName = "Coach"
        } else {
            intro = `Hello, my name is ${selectedVoice.name}`
            botName = selectedVoice.name
        }

        const u = new SpeechSynthesisUtterance(intro);
        u.volume = 1;
        u.rate = selectedRate;
        u.pitch = selectedPitch;
        u.voice = selectedVoice;
        synth.speak(u)
    });

    rateSelect.addEventListener('click', () => {
        const rates = document.querySelectorAll("input[name='rate']")

        for (let i = 0; i < rates.length; i++) {
            rates[i].onclick = () => {
                selectedRate = rates[i].value;
            }
        }
    });

    pitchSelect.addEventListener('click', () => {
        const pitches = document.querySelectorAll("input[name='pitch']")

        for (let i = 0; i < pitches.length; i++) {
            rates[i].onclick = () => {
                selectedPitch = pitches[i].value;
            }
        }
    });
});

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

function loadVoices(language = "en") {
    return new Promise(
        function (resolve, reject) {
            let id;
            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    console.log(synth.getVoices(voice => voice.language))
                    resolve(synth.getVoices().filter(voice => voice.lang.startsWith(`${language}-`)));
                    clearInterval(id);
                }
            }, 10);
        }
    )
}