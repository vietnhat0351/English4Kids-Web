import React, { useRef } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const AudioPlayer = ({ audioSrc, fontSize }) => {
  const audioRef = useRef(null);  // Create a ref to the audio element

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          console.log("Audio is playing");
        })
        .catch((error) => {
          console.error("Play failed", error);
        });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "black",
          textDecoration: "none",
          cursor: "pointer",
          borderRadius: "50%",
        }}
        onClick={handlePlay}
      >
        <VolumeUpIcon fontSize={fontSize} />
      </button>
      {/* Attach the ref to the audio element */}
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default AudioPlayer;
