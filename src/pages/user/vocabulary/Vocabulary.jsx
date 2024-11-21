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
          <div>
            {" "}
            <FlashCardList vocabulary={selectedLesson.vocabularies} />
          </div>
        </div>
      )}
    </div>
  );
}
export default Vocabulary;
