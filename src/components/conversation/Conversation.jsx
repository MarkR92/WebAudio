import { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import "./Conversation.css";
import { connectWebSocket, sendMessage, closeWebSocket } from "../../utils/websocket";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const shouldContinueListeningRef = useRef(false);

  const speak = (text) => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    //Stop mic to avoid picking up the speech
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      if (shouldContinueListeningRef.current) {
        restartRecognition();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Don't restart here — let speak() control restart after speaking
    };

    recognitionRef.current = recognition;
  };

  const restartRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const toggleListening = () => {
    shouldContinueListeningRef.current = !isListening;

    if (!isListening) {
      if (!recognitionRef.current) {
        initializeRecognition();
      }
      restartRecognition();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    sendMessage(text);
  };

  useEffect(() => {
    initializeRecognition();

    connectWebSocket((data) => {
      setMessages((prev) => [...prev, { role: "assistant", text: data }]);
      speak(data);
    });

    return () => {
      closeWebSocket();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  },);

  return (
    <div className="conversation-container">
      <div className="chat-box">
        <MessageList messages={messages} />
        <div className="input-row">
          <button
            className={`mic-button ${isListening ? "listening" : ""}`}
            onClick={toggleListening}
          >
            {isListening ? "🛑 Stop Listening" : "🎤 Start Listening"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
