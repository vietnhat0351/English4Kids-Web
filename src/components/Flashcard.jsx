import React, { useState } from 'react';
import "../../src/App.css";
import axios from 'axios';

// function Flashcard({ flashcard }) {
//   const [flip, setFlip] = useState(false);

//   return (
//     <div 
//       className={`flashcard ${flip ? 'flip' : ''}`}
//       onClick={() => setFlip(!flip)}
//     >
//       <div className="front">
//         {flashcard.question}
//       </div>
//       <div className="back">
//         {flashcard.answer}
//       </div>
//     </div>
//   );
// }

function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);

  const [audioUrl, setAudioUrl] = useState(null);

  const playAudio = async (event) => {
    event.stopPropagation();
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

      const audio = new Audio(url);
      audio.play();

    } catch (error) {
      console.error("Error generating audio:", error);
    }

  };

  return (
    <div
      className={`flashcard ${flip ? 'flip' : ''}`}
      onClick={() => setFlip(!flip)}
    >
      <div className="front">
        <h3>{flashcard?.word}</h3>
        <img src={flashcard?.image} alt={flashcard.word} className="flashcard-image" />
        <button onClick={playAudio}
          style={{
            zIndex: 10,
          }}
        >🔊 Listen</button>
      </div>
      <div className="back">
        <h3>{flashcard?.word}</h3>
        <p>{flashcard?.meaning}</p>
      </div>
    </div>
  );
}

export default Flashcard;
