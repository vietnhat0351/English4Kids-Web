import React, { useRef } from "react";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const AudioPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: "lightgray",
          border: "none",
          color: "black",
          textDecoration: "none",
          cursor: "pointer",
          borderRadius: "50%",
        }}
        onClick={handlePlay}
      >
        <VolumeUpIcon fontSize="small"/>
      </button>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default AudioPlayer;
