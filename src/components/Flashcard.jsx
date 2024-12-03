import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Flashcard.css";
import customFetch from '../utils/customFetch';

function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const [flashcardData, setFlashcardData] = useState(flashcard);

  useEffect(() => {
    if (!flashcardData) {
      return;
    }
    console.log(flashcardData);
    const fetchAudio = async () => {
      try {

        const token = localStorage.getItem('accessToken');

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/tts/synthesize`,
          { text: flashcard.word },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
            },
            responseType: "arraybuffer" // Nhận dữ liệu nhị phân (binary)
          }
        );

        // Tạo blob từ dữ liệu nhị phân nhận được
        const blob = new Blob([response.data], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);  // Lưu URL để phát hoặc tải xuống
      } catch (error) {
        console.error("Error generating audio:", error);
      }
    }
    fetchAudio();
  }, [flashcard]);

  const playAudio = async (event) => {
    event.stopPropagation();
    if (!audioUrl) {
      return;
    }
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div
      className={`flashcard ${flip ? 'flip' : ''}`}
      onClick={() => setFlip(!flip)}
    >
      <div className="front">
        <h3>{flashcardData?.word}</h3>
        <p>{flashcardData?.phonetic}</p>
        <button onClick={playAudio}
        >🔊 Listen</button>
      </div>
      <div className="back">
        <div style={{
          height: "80%",
        }}>
          <img src={flashcardData?.image} alt={flashcardData.word} className="flashcard-image" />
        </div>
        <h3>{flashcardData?.meaning}</h3>
      </div>
    </div>
  );
}

export default Flashcard;
