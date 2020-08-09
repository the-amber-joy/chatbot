import getLanguages from "./getLanguages.js"
import filterLanguages from "./filterLanguages.js"
import populateLanguages from "./populateLanguages.js"
import populateVoices from "./populateVoices.js"
import output from "./convo.js"
import sayStuff from "./sayStuff.js"

const inputField = document.getElementById("input")
const voiceSelect = document.getElementById("voiceSelect");
const languageSelect = document.getElementById("languageSelect")

const rateSelect = document.querySelector("form[name='rate']")
const pitchSelect = document.querySelector("form[name='pitch']")
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
            const voiceProps = {
                botName,
                voice: selectedVoice,
                rate: selectedRate,
                pitch: selectedPitch
            }

            output(input, voiceProps);
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
            sayStuff({
                voice: selectedVoice,
                rate: selectedRate,
                pitch: selectedPitch
            })
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
