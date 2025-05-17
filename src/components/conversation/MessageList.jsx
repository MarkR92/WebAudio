import React from "react";
import Message from "./Message";

const MessageList = ({ messages }) => (
  <div className="message-list">
    {messages.map((msg, index) => (
      <Message key={index} text={msg.text} role={msg.role} />
    ))}
  </div>
);

export default MessageList;
