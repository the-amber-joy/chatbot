import trigger from "./trigger.js"
import reply from "./reply.js"
import alternative from "./alternative.js"
import covid from "./covid.js"

const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelect");
const inputField = document.getElementById("input")
const outputDiv = document.getElementById("output");
let botName = "Alex";
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
        console.log("selected name", selectedVoice.name)
        console.log("selected name startswith", selectedVoice.name.startsWith("Google"))
        if (selectedVoice.name.startsWith("Google")) {
            intro = "I don't have a name, I am a monstrosity forged in the bowels of Google. But you can call me Coach."
            botName = "Coach"
        } else {
            intro = `Hello, my name is ${selectedVoice.name}`
            botName = selectedVoice.name
        }

        const u = new SpeechSynthesisUtterance(intro);
        u.volume = 1;
        u.rate = 1;
        u.pitch = 1;
        u.voice = selectedVoice;
        synth.speak(u)
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
    const userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
    outputDiv.insertBefore(userDiv, document.getElementById("bot"))

    const u = new SpeechSynthesisUtterance(response);
    u.text = response;
    u.volume = 1;
    u.rate = 1;
    u.pitch = 1;
    u.voice = selectedVoice;

    const botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.innerHTML = `${botName}: <span id="bot-response">${response}</span>`;
    outputDiv.insertBefore(botDiv, userDiv)

    synth.speak(u);
}

function loadVoices() {
    return new Promise(
        function (resolve, reject) {
            let id;
            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices().filter(voice => voice.lang.startsWith("en-")));
                    clearInterval(id);
                }
            }, 10);
        }
    )
}