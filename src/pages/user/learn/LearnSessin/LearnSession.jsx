import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setCLesson } from "../../../../redux/slices/clessonSlice";
import customFetch from "../../../../utils/customFetch";
import "./styles.css";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AudioPlayer from "../../../admin/lesson-management/question/AudioPlayer";
import { setUserProfile } from "../../../../redux/slices/userSlice";

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

  const [rightAnswers, setRightAnswers] = useState(0);

  const [canClickAnswer, setCanClickAnswer] = useState(true);

  const progressPercent = total > 0 ? (question / total) * 100 : 0;

  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const [result, setResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [isCorrectColor, setIsCorrectColor] = useState("l-result-correct");

  const [answerButtonColor, setAnswerButtonColor] = useState(false);

  const [isAutoplayAllowed, setIsAutoplayAllowed] = useState(false);

  const [userResult, setUserResult] = useState({});

  const handleFirstPlay = () => {
    setIsAutoplayAllowed(true);
  };

  // Hàm xáo trộn mảng
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // const playSound = () => {
  //   if (isCorrect) {
  //     const audio = new Audio(
  //       "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Correct+Answer+sound+effect.mp3"
  //     );
  //     audio
  //       .play()
  //       .catch((error) => console.log("Audio playback failed:", error));
  //   } else {
  //     const audio = new Audio(
  //       "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Incorrect+sound+effect.mp3"
  //     );
  //     audio
  //       .play()
  //       .catch((error) => console.log("Audio playback failed:", error));
  //   }
  // };

  const saveLessonProgress = async () => {
    console.log(rightAnswers, total);
    const data = {
      user: {
        id: user.profile.id,
      },
      lessonPart: {
        id: clesson.lessonParts[partId].id,
      },
      sessionDate: new Date().toISOString().split("T")[0],
      questionsAttempted: total,
      questionsCorrect: rightAnswers,
      completed: true,
      pointsEarned: Math.round(((rightAnswers + 1) / total) * 100),
    };

    setUserResult(data);
    setRightAnswers(0);
    if (data.pointsEarned > 50) {
      try {
        await customFetch
          .post("/api/v1/user/process/add-user-process", data)
          .then((res) => console.log(res.data));
      } catch (error) {
        console.error("Error saving lesson progress:", error);
      }
      let userUpdate = { ...user.profile };
      userUpdate.dailyPoints += data.pointsEarned;
      userUpdate.totalPoints += data.pointsEarned;
      userUpdate.weeklyPoints += data.pointsEarned;
      if (userUpdate.lastLearningDate !== data.sessionDate) {
        userUpdate.streak += 1;
      }
      userUpdate.lastLearningDate = data.sessionDate;

      dispatch(setUserProfile(userUpdate));

      console.log(JSON.stringify(userUpdate));
      try {
        await customFetch
          .post("/api/v1/user/update-user-point", userUpdate)
          .then((res) => console.log(res.data));
      } catch (error) {
        console.error("Error saving lesson progress:", error);
      }
    }
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

  const handleAnswerSelection = async (question, answer) => {
    //Tìm câu trả lời đúng
    setCanClickAnswer(false);
    setAnswerButtonColor(true);
    setResult(true);
    if (answer.correct) {
      console.log("Correct");
      setIsCorrect(true);
      setIsCorrectColor("l-result-correct");
      const audio = new Audio(
        "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Correct+Answer+sound+effect.mp3"
      );
      audio
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    } else {
      console.log(answer);
      setIsCorrect(false);
      setIsCorrectColor("l-result-incorrect");
      const audio = new Audio(
        "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Incorrect+sound+effect.mp3"
      );
      audio
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
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
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
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
                autoPlay={isAutoplayAllowed}
                onFirstPlay={handleFirstPlay}
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
                onClick={() => handleAnswerSelection(question, answer)}
                className={
                  answerButtonColor
                    ? answer.correct
                      ? "answer-button-correct"
                      : "answer-button-incorrect"
                    : "answer-button"
                }
                disabled={!canClickAnswer}
              >
                {answer.content}
              </button>
            ))}
          </div>
          {result ? (
            <div className={isCorrectColor}>
              {isCorrect ? (
                <div className="l-result-bar">
                  Câu trả lời chính xác
                  <button>
                    <Tooltip title="Close">
                      <IconButton
                        onClick={() => {
                          setAnswerButtonColor(false);
                          setCanClickAnswer(true);
                          setQuestion((prev) => prev + 1);
                          setRightAnswers((prev) => prev + 1);
                          if (question >= total - 1) {
                            saveLessonProgress();
                          }
                          setResult(false);
                        }}
                      >
                        Tiếp tục
                      </IconButton>
                    </Tooltip>
                  </button>
                </div>
              ) : (
                <div className="l-result-bar">
                  Câu trả lời không chính xác
                  <button>
                    <Tooltip title="Close">
                      <IconButton
                        onClick={() => {
                          setAnswerButtonColor(false);
                          setCanClickAnswer(true);
                          setQuestion((prev) => prev + 1);
                          if (question >= total - 1) {
                            saveLessonProgress();
                          }
                          setResult(false);
                        }}
                      >
                        Tiêp tục
                      </IconButton>
                    </Tooltip>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </>
      ) : (
        <div className="l-bar-finish">
          {/* <h1>Hoàn thành!</h1> */}
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/success.png"
            alt=""
            width={400}
            height={400}
          />
          <div className="l-bar-finish-body">
            <div className="l-bar-finish-body-1">
              Tổng điểm KN:
              <div className="l-bar-finish-body-3">
                {userResult.pointsEarned} điểm
              </div>
            </div>
            <div className="l-bar-finish-body-2">
              Quyết tâm!
              <div className="l-bar-finish-body-3">
                {userResult.questionsCorrect+1}/{userResult.questionsAttempted}{" "}
                câu đúng
              </div>
            </div>
          </div>
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
