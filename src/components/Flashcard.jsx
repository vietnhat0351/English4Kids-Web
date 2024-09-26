import React, { useState } from 'react';
import "../../src/App.css";

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
  
    const playAudio = () => {
      const audio = new Audio(flashcard.audioUrl);
      audio.play();
    };

    console.log(flashcard);
  
    return (
      <div 
        className={`flashcard ${flip ? 'flip' : ''}`}
        onClick={() => setFlip(!flip)}
      >
        <div className="front">
          <h3>{flashcard?.word}</h3>
          <img src={flashcard?.imageUrl} alt={flashcard.word} className="flashcard-image"/>
          <button onClick={playAudio}>🔊 Listen</button>
        </div>
        <div className="back">
          <h3>{flashcard?.word}</h3>
          <p>{flashcard?.definition}</p>
        </div>
      </div>
    );
  }

export default Flashcard;
