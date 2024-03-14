import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";

const EmojiPicker = ({ onEmojiSelect }) => {
  // Function to generate a dynamic list of emojis
  const generateEmojis = () => {
    const emojis = [];
    for (let i = 128512; i <= 128591; i++) {
      emojis.push(String.fromCodePoint(i));
    }
    return emojis;
  };

  // State to track the selected emoji
  const [selectedEmoji, setSelectedEmoji] = useState("");

  // Function to handle emoji selection
  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    onEmojiSelect(emoji); // Send selected emoji to the parent component
  };

  return (
    <div className="emoji-picker">
      <div className="emoji-list">
        {generateEmojis().map((emoji, index) => (
          <span
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className={selectedEmoji === emoji ? "selected" : ""}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;
