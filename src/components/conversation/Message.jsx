import React from "react";
import "./Message.css";

const Message = ({ text, role }) => {
  const isUser = role === "user";
  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="bubble">{text}</div>
    </div>
  );
};

export default Message;
