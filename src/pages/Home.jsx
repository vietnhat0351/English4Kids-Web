import React, { useState } from 'react'
import FlashcardList from '../components/FlashcardList';
import './Home.css';

const Home = () => {

  // const [flashcards, setFlashcards] = useState([
  //   {
  //     id: 1,
  //     question: 'What is React?',
  //     answer: 'A JavaScript library for building user interfaces',
  //   },
  //   {
  //     id: 2,
  //     question: 'What is a component?',
  //     answer: 'Reusable piece of UI',
  //   },
  //   // Thêm các thẻ ghi nhớ khác
  // ]);
  
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      word: 'Apple',
      definition: 'A fruit that is typically red or green.',
      imageUrl: 'https://t4.ftcdn.net/jpg/02/52/93/81/360_F_252938192_JQQL8VoqyQVwVB98oRnZl83epseTVaHe.jpg', // Thay bằng URL ảnh thật
      audioUrl: 'https://example.com/apple.mp3'  // Thay bằng URL phát âm thật
    },
    {
      id: 2,
      word: 'Dog',
      definition: 'A domesticated carnivorous mammal.',
      imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg',
      audioUrl: 'https://example.com/dog.mp3'
    },
    // Thêm các từ vựng khác
  ]);

  return (
    <div>Home
      <FlashcardList flashcards={flashcards} />?
    </div>
  )
}

export default Home