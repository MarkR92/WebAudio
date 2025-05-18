// src/components/Conversation.jsx
import { useEffect, useRef, useState } from "react";
import MessageList from "./MessageList";
import "./Conversation.css";
import {
  connectWebSocket,
  sendMessage,
  closeWebSocket,
} from "../../utils/websocket";
import {
  initSpeechRecognition,
  startListening,
  stopListening,
  speakText,
} from "../../utils/audio";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const shouldContinueListeningRef = useRef(false);

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    sendMessage(text);
  };

  const toggleListening = () => {
    shouldContinueListeningRef.current = !isListening;

    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  useEffect(() => {
    initSpeechRecognition(
      () => setIsListening(true),
      () => setIsListening(false),
      (transcript) => handleSend(transcript)
    );

    connectWebSocket((data) => {
      setMessages((prev) => [...prev, { role: "assistant", text: data }]);
      speakText(data, () => {
        if (shouldContinueListeningRef.current) {
          startListening();
        }
      });
    });

    return () => {
      closeWebSocket();
      stopListening();
    };
  }, []);

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
