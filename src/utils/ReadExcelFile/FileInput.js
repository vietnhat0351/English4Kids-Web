// FileInput.js
import React from "react";
import UploadIcon from "@mui/icons-material/Upload";

const FileInput = ({ handleFileSelect , content }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <button onClick={handleClick} className="a-l-button">
        <UploadIcon  /> {content}
      </button>
      <input
      
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileSelect(e.target.files[0])}
        accept=".xlsx, .xls"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileInput;
