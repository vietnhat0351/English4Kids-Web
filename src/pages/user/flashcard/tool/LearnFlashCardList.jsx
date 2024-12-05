import React, { useEffect, useState } from "react";
import LearnFlashCardVocabulary from "./LearnFlashCardVocabulary";
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

const LearnFlashCardList = ({ vocabulary }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
          backgroundcolor: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
          borderRadius: "10px",
      }}>
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
        >
          {vocabulary?.map((flashcard, index) => (
            <SwiperSlide key={index} className="custom-swiper-slide">
              <div
                style={{
                  margin: "1rem",
                  display: "flex",
                }}
              >
                <LearnFlashCardVocabulary data={flashcard} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default LearnFlashCardList;
