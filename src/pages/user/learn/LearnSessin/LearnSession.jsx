import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setCLesson } from "../../../../redux/slices/clessonSlice";
import customFetch from "../../../../utils/customFetch";
import "./styles.css";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AudioPlayer from "../../../admin/lesson-management/question/AudioPlayer";

const LearnSession = () => {
  const user = useSelector((state) => state.user);
  const clesson = useSelector((state) => state.clesson);

  const location = useLocation();
  const params = useParams();
  const dispatch = useDispatch();

  const stateData = location.state || {};
  const lessonId = stateData.lessonId || params.lessonId;
  const partId = stateData.partId - 1 || params.partId - 1;

  const navigate = useNavigate();

  const [question, setQuestion] = useState(0);
  const [total, setTotal] = useState(0);

  const progressPercent = total > 0 ? (question / total) * 100 : 0;

  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Hàm xáo trộn mảng
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const playSound = () => {
    const audio = new Audio(
      "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Correct+Answer+sound+effect.mp3"
    );
    audio.play().catch((error) => console.log("Audio playback failed:", error));
  };

  const saveLessonProgress = async () => {
    const data = {
      user: {
        id: user.profile.id,
      },
      lessonPart: {
        id: clesson.lessonParts[partId].id,
      },
    };

    await customFetch
      .post("/api/v1/user/process/add-user-process", data)
      .then((res) => console.log(res.data));
  };

  useEffect(() => {
    const fetchLesson = async () => {
      const data = await customFetch
        .get("/api/v1/lessons/find-lesson/" + lessonId)
        .then((res) => res.data);
      // Xáo trộn các câu hỏi trong phần đầu tiên của bài học
      if (data.lessonParts && data.lessonParts.length > 0) {
        data.lessonParts[partId].questions = shuffleArray(
          data.lessonParts[partId].questions
        );
        setTotal(data.lessonParts[partId].questions.length);
      } else {
        console.error("No lesson parts found in lesson data.");
      }

      dispatch(setCLesson(data));
    };
    fetchLesson();
    setQuestion(0);
  }, [dispatch, lessonId, partId]);

  useEffect(() => {
    if (
      clesson.lessonParts &&
      clesson.lessonParts[partId]?.questions[question]
    ) {
      const currentAnswers =
        clesson.lessonParts[partId].questions[question].answers;
      setShuffledAnswers(shuffleArray([...currentAnswers])); // Shuffle answers
    }
  }, [question, clesson, partId, dispatch]);

  const handleAnswerSelection = (answer) => {
    if (answer.correct) {
      playSound();
      console.log("Correct");
      setQuestion((prev) => prev + 1);
      if (question >= total - 1) {
        saveLessonProgress();
      }
    } else {
      console.log("Incorrect");
    }
  };

  return (
    <div className="learn-session-container">
      {clesson &&
      user &&
      clesson.lessonParts &&
      clesson.lessonParts[partId] &&
      clesson.lessonParts[partId].questions[question] ? (
        <>
          <div className="learn-session-header">
            <div className="progress-header">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <button>
                <Tooltip title="Close">
                  <IconButton
                    onClick={() => {
                      navigate("/learn");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
            <p>
              Tiến trình: {question}/{total}
            </p>
          </div>
          <div className="learn-session-question">
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/talk.gif"
              alt="question"
              width={200}
              height={200}
            />
            {clesson.lessonParts[partId].questions[question].audioUrl && (
              <AudioPlayer
                audioSrc={
                  clesson.lessonParts[partId].questions[question].audioUrl
                }
              />
            )}
            <div className="learn-session-question-content">
              <p>{clesson.lessonParts[partId].questions[question].content}</p>
            </div>
          </div>

          <div className="learn-session-answers">
            {shuffledAnswers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelection(answer)}
                className="answer-button"
              >
                {answer.content}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div>
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/success.gif"
            alt=""
          />
          <button>
            <Tooltip title="Close">
              <IconButton
                onClick={() => {
                  navigate("/learn");
                }}
              >
                Tiếp tục
              </IconButton>
            </Tooltip>
          </button>
        </div>
      )}
    </div>
  );
};

export default LearnSession;
