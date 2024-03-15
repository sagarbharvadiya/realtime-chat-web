import React from "react";

const Message = ({ msg, currentUser }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className={`message ${msg.sender === currentUser.uid ? "sent" : "received"}`}>
      <div className="message-content">
        {msg.sender !== currentUser.uid && (
          <span className="sender-name">{msg.senderName}</span>
        )}
        {msg.content}
        {msg.imageURL && <img src={msg.imageURL} alt="Uploaded" />}
        {msg.fileURL && (
          <a href={msg.fileURL} target="_blank" rel="noopener noreferrer">
            {msg.fileName || "Document"}
          </a>
        )}
        {msg.receiver === currentUser.uid && (
          <span className="received-indicator">(Received)</span>
        )}
      </div>
      <div className="message-timestamp">{formatTimestamp(msg.timestamp)}</div>
    </div>
  );
};

export default Message;
