import React, { useState } from "react";
import AudioPlayer from "../../../../utils/AudioPlayer";

const FlashCardVocabulary = ({ data }) => {
  const [showBack, setShowBack] = useState(false);

  const toggleCard = () => {
    setShowBack((prev) => !prev);
  };

  return (
    <div
      onClick={toggleCard}
      style={{
        width: "400px",
        height: "600px",
        perspective: "1000px",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.6s",
        }}
      >
        {/* Mặt trước */}
        <div
          style={{
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            gap: "20px",
            width: "100%",
            height: "100%",
            backgroundImage: `url("https://english-for-kids.s3.ap-southeast-1.amazonaws.com/8465f75c289e327ca398b56a7018251dd3a20797666d928bbdf3bc6f4ce2697c.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
            }}
          >
            {data.word}{" "}
            <span
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn sự kiện lật thẻ
              }}
            >
              <AudioPlayer audioSrc={data.audio} />
            </span>
          </div>
          <div
            style={{ fontStyle: "italic", color: "#555", fontSize: "1.5rem" }}
          >
            {data.pronunciation}
          </div>
          <div
            style={{
              padding: "5px 10px",
              backgroundColor: "#66CC66",
              color: "white",
              borderRadius: "5px",
            }}
          >
            {data.type}
          </div>
        </div>

        {/* Mặt sau */}
        <div
          style={{
            backfaceVisibility: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            width: "100%",
            height: "100%",
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotateY(180deg)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontSize: "3rem",
            fontWeight: "bold",
            position: "absolute",
          }}
        >
          {data.image && (
            <img
              src={data.image}
              alt="Meaning"
              style={{ width: "300px", height: "auto", objectFit: "cover" }}
            />
          )}

          <div
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
            }}
          >
            {data.meaning}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCardVocabulary;
