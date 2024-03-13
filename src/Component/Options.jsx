import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faImage,
  faStickyNote,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

const Options = ({
  handleCameraClick,
  handleImageClick,
  handleStickyNoteClick,
  handleFileClick,
}) => {
  return (
    <div className="options">
      <FontAwesomeIcon
        icon={faCamera}
        className="option-icon"
        onClick={handleCameraClick}
      />
      <FontAwesomeIcon
        icon={faImage}
        className="option-icon"
        onClick={handleImageClick}
      />
      <FontAwesomeIcon
        icon={faStickyNote}
        className="option-icon"
        onClick={handleStickyNoteClick}
      />
      <FontAwesomeIcon
        icon={faFile}
        className="option-icon"
        onClick={handleFileClick}
      />
    </div>
  );
};

export default Options;
