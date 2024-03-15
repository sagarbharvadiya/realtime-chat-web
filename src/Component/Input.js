// Input.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSmile,
    faPlus,
    faPaperPlane,
  } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "./EmojiPicker";
import Options from "./Options";
const Input = ({
  message,
  setMessage,
  handleSend,
  toggleOptions,
  showOptions,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiSelect,
  handleCameraClick,
  handleImageClick,
  handleStickyNoteClick,
  handleFileClick,
}) => {
  return (
    <div className="row">
      <div className="col-md-3">
        <FontAwesomeIcon
          icon={faSmile}
          className="emoji-icon"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
        <FontAwesomeIcon
          icon={faPlus}
          className="plus-icon"
          onClick={toggleOptions}
        />
        {showOptions && (
          <Options
            handleCameraClick={handleCameraClick}
            handleImageClick={handleImageClick}
            handleStickyNoteClick={handleStickyNoteClick}
            handleFileClick={handleFileClick}
          />
        )}
      </div>
      <div className="col-md-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
      </div>
      <div className="col-md-3">
        <FontAwesomeIcon
          icon={faPaperPlane}
          className="send-icon"
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default Input;
