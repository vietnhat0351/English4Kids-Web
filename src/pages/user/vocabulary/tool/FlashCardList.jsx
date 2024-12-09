import React, { useEffect, useRef } from "react";
import FlashCardVocabulary from "./FlashCardVocabulary";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Keyboard,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/keyboard";

import "./style.css";

const FlashCardList = ({ vocabulary }) => {
  const audioRef = useRef(null);

  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl; // Gán đường dẫn audio mới
      audioRef.current.play(); // Phát âm thanh
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div className="flashcard-container-2">
        <audio ref={audioRef} />
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={true}
          pagination={{
            type: "fraction",
          }}
          backgroundColor="transparent"
          scrollbar={{ draggable: true }}
          keyboard={{
            enabled: true,
          }}
          className="custom-swiper"
          onSlideChange={({ activeIndex }) => {
            const currentFlashcard = vocabulary[activeIndex];
            if (currentFlashcard && currentFlashcard.audio) {
              playAudio(currentFlashcard.audio);
            }
          }}
        >
          {vocabulary?.map((flashcard, index) => (
            <SwiperSlide key={index} className="custom-swiper-slide">
              <div
                style={{
                  margin: "1rem",
                  display: "flex",
                }}
              >
                <FlashCardVocabulary data={flashcard} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FlashCardList;
