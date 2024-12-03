import React, { useEffect, useState } from "react";

import "./Vocabulary.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import { setLessonSelected } from "../../../redux/slices/clessonSlice";
import FlashCardList from "./tool/FlashCardList";
import { IoMdArrowRoundBack } from "react-icons/io";

function Vocabulary() {
  const selectedLesson = useSelector((state) => state.lessonSelected);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [uniqueVocabularies, setUniqueVocabularies] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();
  const lastUrl = location.pathname.split("/").pop();

  useEffect(() => {
    console.log("lastUrl", lastUrl);
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(
          `/api/v1/lessons/get-lesson/${lastUrl}`
        );
        console.log("response", response.data);
        dispatch(setLessonSelected(response.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (selectedLesson?.vocabularies) {
      // Loại bỏ từ trùng lặp dựa trên thuộc tính "word"
      const filteredVocabularies = selectedLesson.vocabularies.filter(
        (vocabulary, index, self) =>
          index === self.findIndex((v) => v.word === vocabulary.word)
      );
      setUniqueVocabularies(filteredVocabularies);
    }
  }, [selectedLesson]);

  return (
    <div className="v-container">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack
              size={{
                width: "200px",
                height: "100px",
                padding: "5px",
              }}
            />
          </button>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <h1 style={{
              fontSize: "2rem",
              // fontFamily: "GBS",
            }}>{selectedLesson.title}</h1>
          </div>
          <div>
            {" "}
            <FlashCardList vocabulary={uniqueVocabularies} />
          </div>
        </div>
      )}
    </div>
  );
}
export default Vocabulary;
