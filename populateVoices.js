import sayStuff from "./sayStuff.js"

const synth = window.speechSynthesis;

function loadVoices(isoCode = "en") {
    return new Promise((resolve, reject) => {
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

export default async function populateVoices(isoCode) {
    let selectedVoice;
    let voiceOptions = {};
    const voiceSelect = document.getElementById("voiceSelect");

    let voices = loadVoices(isoCode).then(voices => {
        voiceSelect.querySelectorAll('*').forEach(n => n.remove());

        selectedVoice = voices[0];

        for (let i = 0; i < voices.length; i++) {
            const name = voices[i].name

            const isGoogle = name.startsWith("Google");

            voiceOptions[name] = voices[i];
            const voiceOption = document.createElement("option");
            voiceOption.setAttribute("value", name);
            voiceOption.text = isGoogle ? `${name} (Googlebot)` : name;
            voiceSelect.appendChild(voiceOption);
        }
        return { voiceOptions, selectedVoice };
    });

    return await voices;
}