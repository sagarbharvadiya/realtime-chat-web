// ChatWindow.js
import React, { useState, useEffect } from "react";

const ChatWindow = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch or load messages for the given user
  useEffect(() => {
    // Implement logic to fetch messages for the given userId
    // For example, you can fetch messages from a database
    // and update the state with setMessages
  }, [userId]);

  const handleSendMessage = () => {
    // Implement logic to send a message
    // Update the database with the new message
    // For example, you can use Firebase or another backend service

    // Update the state to reflect the new message
    setMessages([...messages, { senderId: "currentUser", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div>
      <h2>Chat with User {userId}</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.senderId === "currentUser" ? "You: " : `User ${userId}: `}
            {message.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          rows="4"
          style={{ width: "100%" }}
        ></textarea>
        <button onClick={handleSendMessage} style={{ marginTop: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
