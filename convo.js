import { trigger, reply, alternative, covid } from "./words/index.js"
import sayStuff from "./sayStuff.js"

const outputDiv = document.getElementById("output");

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

function addChat(input, response, voiceProps) {
    const { botName, voice, rate, pitch } = voiceProps;
    const userDiv = document.createElement("div");

    userDiv.id = "user";
    userDiv.innerHTML = `You: <span id="user-response">${input}</span>`;
    outputDiv.insertBefore(userDiv, document.getElementById("bot"))

    const botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.innerHTML = `${botName}: <span id="bot-response">${response}</span>`;
    outputDiv.insertBefore(botDiv, userDiv)

    sayStuff({
        rate,
        pitch,
        voice,
        text: response
    })
}

export default function output(input, voiceProps, selectedMode) {
    let response;

    if (selectedMode === "chat") {
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
    } else {
        response = input
    }


    //update DOM
    addChat(input, response, voiceProps);
}
