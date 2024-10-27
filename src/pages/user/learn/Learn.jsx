import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../utils/customFetch";
import { setUserProcess } from "../../../redux/slices/userProcess";

import "./styles.css";

const Learn = () => {
  const user = useSelector((state) => state.user);
  const clesson = useSelector((state) => state.clesson);
  const lessons = useSelector((state) => state.lessons);
  const userProcess = useSelector((state) => state.userProcess);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (user && user.profile && user.profile.id) {
        try {
          const data = await customFetch
            .get("/api/v1/user/process/" + user.profile.id)
            .then((res) => {
   
              return res.data;
            });

          dispatch(setUserProcess(data));
        } catch (error) {
          console.error("Error fetching user process:", error);
        } finally {
          setLoading(false); // Set loading to false after data fetch
        }
      } else {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [user, navigate, dispatch]);

  const getProgressClass = (time) => {
    if (time === 0) {
      return "progress-zero";
    }
    if (time === 1) {
      return "progress-one-third";
    }
    if (time === 2) {
      return "progress-two-third";
    }
    if (time >= 3) {
      return "progress-complete";
    }
  };
  const handlePartClick = (lessonId, partId) => {
    navigate(`/learn-session/${lessonId}/part/${partId}`, {
      state: { lessonId, partId },
    });
  };

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  return (
    <div className="l-container">
      <div className="l-title">
        <h1>HỌC THEO GIÁO TRÌNH</h1>
      </div>

      <div className="lesson-container">
        {userProcess.lessonProcesses &&
        userProcess.lessonProcesses.length > 0 ? (
          userProcess.lessonProcesses.map((lesson, index) => (
            <div key={lesson.id} className="lesson-card">
              <div className="lession-title">
                <h2>{lesson.title}</h2>
              </div>

              <div className="lesson-parts">
                {lesson.parts.map((part) => (
                  <button
                    key={part.id}
                    className={getProgressClass(part.time)}
                    onClick={() => handlePartClick(lesson.id, part.partNumber, part.id)}
                  >
                    <p>
                      Part {part.partNumber}: Time Spent {part.time}/3
                    </p>
                  </button>
                ))}
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
