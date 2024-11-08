import React from "react";
import UploadIcon from "@mui/icons-material/Upload"; // Example icon from Material UI

const FileInput = ({ onFileSelect }) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <button  onClick={handleClick}>
        <UploadIcon  sx={{ fontSize: 30 }}/> {/* Replace with your desired icon */}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx"
        style={{ display: "none" }} // Hide the input
      />
    </>
  );
};

export default FileInput;
