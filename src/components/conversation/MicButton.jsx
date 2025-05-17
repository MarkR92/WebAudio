// import React, { useState, useRef } from "react";
// import "./Conversation.css";

// const MicButton = ({ onTranscript }) => {
//   const [isListening, setIsListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const startListening = () => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       alert("Speech recognition not supported.");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognitionRef.current = recognition;

//     recognition.onstart = () => setIsListening(true);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       onTranscript(transcript);
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//     };

//     recognition.start();
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
//   };

//   return (
//     <button
//       className={`mic-button ${isListening ? "listening" : ""}`}
//       onMouseDown={startListening}
//       onMouseUp={stopListening}
//       onTouchStart={startListening}
//       onTouchEnd={stopListening}
//     >
//       {isListening ? "🎙️ Listening..." : "🎤 Hold to Talk"}
//     </button>
//   );
// };

// export default React.memo(MicButton);
