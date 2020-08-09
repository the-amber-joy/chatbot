const synth = window.speechSynthesis;

export default function sayStuff({ newProp, voice, rate = 1, pitch = 1, text }) {
    const name = voice.name
    const isGoogle = name.startsWith("Google");
    const intro = `Hello, my name is ${voice.name}`
    const extra = isGoogle ? ", but you can call be Googlebot." : "."

    const speech = new SpeechSynthesisUtterance()
    speech.volume = 1;
    speech.rate = rate;
    speech.pitch = pitch;
    speech.voice = voice

    if (text) {
        speech.text = text;
    }
    else if (newProp) {
        speech.text = `Now I am speaking with a ${newProp} voice`
    } else {
        speech.text = intro + extra
    }

    synth.speak(speech)
}