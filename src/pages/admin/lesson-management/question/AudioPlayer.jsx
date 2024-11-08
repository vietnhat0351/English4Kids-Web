import React, { useEffect, useRef } from "react";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const AudioPlayer = ({ audioSrc, autoPlay, onFirstPlay }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Autoplay failed, user interaction required");
      });
    }
  }, [audioSrc, autoPlay]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        if (onFirstPlay) {
          onFirstPlay(); // Set autoplay allowed after the first play
        }
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
        <VolumeUpIcon fontSize="small"/>
      </button>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default AudioPlayer;
