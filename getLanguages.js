const synth = window.speechSynthesis;

export default function getLanguages() {
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