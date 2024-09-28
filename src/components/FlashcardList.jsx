import React from 'react';
import Flashcard from './Flashcard';
import "../../src/App.css";

function FlashcardList({ flashcards }) {
  return (
    <div className="flashcard-list">
      {flashcards.map(flashcard => (
        <Flashcard flashcard={flashcard} key={flashcard.id} />
      ))}
    </div>
  );
}

export default FlashcardList;
