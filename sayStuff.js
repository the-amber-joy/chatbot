const synth = window.speechSynthesis;

export default function sayStuff({ newProp, voice, rate = 1, pitch = 1, text }) {
    const isGoogle = name.startsWith("Google");
    const intro = `Hello, my name is ${voice.name}`
    const extra = isGoogle ? ", but you can call me Chatbot." : "."

    const speech = new SpeechSynthesisUtterance()
    speech.volume = 1;
    speech.rate = rate;
    speech.pitch = pitch;
    speech.voice = voice

    if (text) {
        speech.text = text;
    }
    else if (newProp) {
        const textOptions = [
            `Now I am speaking with a ${newProp} voice.`,
            `This is my ${newProp} voice.`,
            `Is my ${newProp} voice acceptable?`,
            `I hope you enjoy my ${newProp} voice.`
        ]

        const statement = textOptions[Math.floor(Math.random() * Math.floor(textOptions.length))];

        speech.text = `${statement}`;
    } else {
        speech.text = intro + extra
    }

    synth.speak(speech)
}