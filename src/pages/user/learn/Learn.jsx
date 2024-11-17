import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import { setUserProcess } from "../../../redux/slices/userProcess";

import "./styles.css";
import { setLessons } from "../../../redux/slices/lessonSlice";

const Learn = () => {
  const user = useSelector((state) => state.user);
  const lessons = useSelector((state) => state.lessons);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {}, [user, navigate, dispatch]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await customFetch.get("/api/v1/lessons/get-all-for-user");
      if (response.status === 200) {
        dispatch(setLessons(response.data));
      }
      setHasFetched(true); // Mark that we've attempted to fetch data
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!lessons.length && !hasFetched) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [lessons, hasFetched, dispatch, fetchData]);

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="lesson-container">
      <div className="lesson-list">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <div className="lesson-card" key={index} onClick={
              () => {
                navigate("" + lesson.id);
              }
            }>
              <img
                className="lesson-image"
                src={lesson.image}
                alt={lesson.title}
     
              />
              <div className="lesson-content">
                <h3 className="lesson-title">{lesson.title}</h3>
                <p className="lesson-description">{lesson.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No lessons available</p>
        )}
      </div>
    </div>
  );
};

export default Learn;
