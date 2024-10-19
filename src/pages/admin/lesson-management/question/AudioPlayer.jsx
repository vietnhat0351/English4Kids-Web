import React, { useRef } from 'react';

const AudioPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div>
      <button onClick={handlePlay}>Play Audio</button>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
};

export default AudioPlayer;
