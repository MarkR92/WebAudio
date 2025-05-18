// src/utils/audioUtils.js

let recognitionInstance = null;

export const initSpeechRecognition = (onStartListening, onStopListening, onResult) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onstart = onStartListening;
  recognition.onend = onStopListening;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognitionInstance = recognition;

  return recognition;
};

export const startListening = () => {
  if (recognitionInstance) {
    recognitionInstance.start();
  }
};

export const stopListening = () => {
  if (recognitionInstance) {
    recognitionInstance.stop();
  }
};

export const speakText = (text, onEndCallback = null) => {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.onend = () => {
    if (onEndCallback) onEndCallback();
  };

  window.speechSynthesis.speak(utterance);
};
