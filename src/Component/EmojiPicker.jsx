import React, { useState } from "react";

const EmojiPicker = ({ onEmojiSelect }) => {
  const generateEmojis = (start, end) => {
    const emojis = [];
    for (let i = start; i <= end; i++) {
      emojis.push(String.fromCodePoint(i));
    }
    return emojis;
  };
  const generateFlagEmojis = () => {
    const emojis = [];
    const REGIONAL_INDICATOR_SYMBOL_LETTER_A = 0x1F1E6;
    const regionalIndicatorSymbolRange = 26; // Number of regional indicator symbols
  
    for (let i = 0; i < regionalIndicatorSymbolRange; i++) {
      emojis.push(
        String.fromCodePoint(
          REGIONAL_INDICATOR_SYMBOL_LETTER_A + i,
          REGIONAL_INDICATOR_SYMBOL_LETTER_A + i
        )
      );
    }
  
    return emojis;
  };
  
  const categories = [
    { name: "Smileys & People", emojis: generateEmojis(0x1F600, 0x1F64F) },
    { name: "Animals & Nature", emojis: generateEmojis(0x1F400, 0x1F4D3) },
    { name: "Food & Drink", emojis: generateEmojis(0x1F32D, 0x1F37F) },
    { name: "Activity", emojis: generateEmojis(0x1F3C3, 0x1F3CC) },
    { name: "Travel & Places", emojis: generateEmojis(0x1F30D, 0x1F6C5) },
    { name: "Objects", emojis: generateEmojis(0x1F4BA, 0x1F4F7) },
    { name: "Symbols", emojis: generateEmojis(0x1F300, 0x1F320) },
    { name: "Flags", emojis: generateFlagEmojis() },

  ];



  // State to track the selected emoji and category
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0); // Default to the first category

  // Function to handle emoji selection
  const handleEmojiClick = (emoji) => {
    setSelectedEmoji(emoji);
    onEmojiSelect(emoji); // Send selected emoji to the parent component
  };

  // Function to handle category change
  const handleCategoryChange = (categoryIndex) => {
    setSelectedCategory(categoryIndex);
    setSelectedEmoji(""); // Reset selected emoji when changing category
  };

  return (
    <div className="emoji-picker">
      <div className="category-list">
        {categories.map((category, index) => (
          <button key={index} onClick={() => handleCategoryChange(index)}>
            {category.name}
          </button>
        ))}
      </div>
      <div className="emoji-list">
        {categories[selectedCategory].emojis.map((emoji, idx) => (
          <span
            key={idx}
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
