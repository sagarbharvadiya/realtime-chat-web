import React from "react";

const FileUpload = ({ fileInputRef, handleFileChange }) => {
  return (
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleFileChange}
    />
  );
};

export default FileUpload;
