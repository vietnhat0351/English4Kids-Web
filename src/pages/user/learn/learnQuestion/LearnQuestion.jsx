import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../../utils/customFetch";
import { setLessonSelected } from "../../../../redux/slices/clessonSlice";
import "./styles.css";

import AudioPlayer from "../../../../utils/AudioPlayer";
import ModalResult from "./ModalResult";
import { setUserProfile } from "../../../../redux/slices/userSlice";
import { IoMdArrowRoundBack } from "react-icons/io";
import { setLessons } from "../../../../redux/slices/lessonSlice";
import { FaCheck } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
const LearnQuestion = () => {

  const changeLater = 5;

  const selectedLesson = useSelector((state) => state.lessonSelected);
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const lastUrl = location.pathname.split("/").pop();
  const audioRef = useRef(null);

  const [lessonQuestions, setLessonQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [countCorrect, setCountCorrect] = useState(0);
  const [countCorrectFag, setCountCorrectFag] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questionIncorrect, setQuestionIncorrect] = useState([]);

  const totalQuestions = selectedLesson?.questions?.slice(0,changeLater).length || 0;

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  const handleStartStop = () => {
    setIsRunning((prev) => !prev); // Bật/tắt trạng thái chạy
  };

  const [openModal, setOpenModal] = useState(false);

  const [imageMeow, setImageMeow] = useState(
    "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/thinking.png"
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    const fetchData = async () => {
      try {
        const response = await customFetch.get(
          "/api/v1/lessons/get-all-for-user"
        );
        if (response.status === 200) {
          dispatch(setLessons(response.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    navigate(`/learn/${lastUrl}`);
    setOpenModal(false);
  };

  const progress =
    totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0;

  const [isChecking, setIsChecking] = useState(false);

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  useEffect(() => {
    console.log("lastUrl", lastUrl);
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(`/api/v1/lessons/${lastUrl}`);

        const shuffledQuestions = shuffleArray(response.data.questions);

        const shuffledQuestionsWithAnswers = shuffledQuestions.map(
          (question) => {
            return {
              ...question,
              answers: shuffleArray(question.answers),
            };
          }
        );

        setLessonQuestions(shuffledQuestionsWithAnswers.slice(0, changeLater));
        dispatch(setLessonSelected(response.data));
        setIsRunning(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, dispatch]);

  const question =
    lessonQuestions.length > 0 ? lessonQuestions[currentQuestionIndex] : null;

  const [listWords, setListWords] = useState([]);
  const [listWordsAnswer, setListWordsAnswer] = useState([]);
  const [originalWords, setOriginalWords] = useState([]);

  useEffect(() => {
    if (!question) return;
    const splitWords = question.content.split(" ") || [];

    setListWordsAnswer(shuffleArray(splitWords));
    setOriginalWords(splitWords);

    setListWords([]);
    console.log(listWords);
    if (question && question.audio) {
      const audio = new Audio(question.audio);
      audio.play().catch((error) => {
        console.error("Không thể phát audio:", error);
      });

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [question]);

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer.id);
    setAnswerStatus(null);
    setIsChecking(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (answer.audio) {
      const audio = new Audio(answer.audio);
      audioRef.current = audio;
      audio.play();
    }
  };

  const handleNextOrCheck = async () => {
    if (!isChecking) {
      let isCorrect = false;
      if (question.type === "WORD_ORDER") {
        const isEqual = (listWords, originalWords) => {
          if (listWords.length !== originalWords.length) return false;
          for (let i = 0; i < listWords.length; i++) {
            if (listWords[i] !== originalWords[i]) {
              return false; // Nếu có sự khác biệt, trả về false
            }
          }
          return true; // Nếu không có sự khác biệt, trả về true
        };

        isCorrect = isEqual(listWords, originalWords);
        setAnswerStatus(isCorrect ? "correct" : "incorrect");
      } else {
        isCorrect =
          selectedAnswer &&
          question.answers.find((a) => a.id === selectedAnswer)?.correct;
        setAnswerStatus(isCorrect ? "correct" : "incorrect");
        setCorrectAnswer(question.answers.find((a) => a.correct).id);
      }

      if (isCorrect) {
        const audio = new Audio(
          "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/am-thanh-tra-loi-dung-chinh-xac-www.tiengdong.com.mp3"
        );
        audio.play().catch((error) => {
          console.error("Không thể phát audio:", error);
        });
        setImageMeow(
          "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/love.png"
        );
        if (countCorrectFag) {
          setCountCorrect((prev) => prev + 1);
        }
        setAnsweredQuestions([...answeredQuestions, question.id]);

        const vi = question.vocabulary.id;

        console.log(vi);
        await customFetch.post(`/api/v1/user/update-user-vocabulary`, {
          vocabularyId: vi,
        });
      } else {
        const audio = new Audio(
          "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/windows-error-sound-effect-35894.mp3"
        );
        audio.play().catch((error) => {
          console.error("Không thể phát audio:", error);
        });
        setImageMeow(
          "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/tired.png"
        );
        setIncorrectAnswers([...incorrectAnswers, question.id]);
        setQuestionIncorrect([...questionIncorrect, question]);
      }
      setIsChecking(true);
    } else {
      setImageMeow(
        "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/thinking.png"
      );
      if (currentQuestionIndex < lessonQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setCountCorrectFag(false);

        if (questionIncorrect.length > 0) {
          setLessonQuestions(questionIncorrect);
          setQuestionIncorrect([]);
          setCurrentQuestionIndex(0);
        } else {
          setIsRunning(false);
          try {
            const dataSave = {
              userId: user.id,
              lessonId: selectedLesson.id,
              score: Math.round(countCorrect * 10),
              type: "LEARN",
              time: time,
              date: new Date(),
              isDone: false,
            };
            console.log(dataSave);
            if (!selectedLesson.completed) {
              await customFetch.post(
                "/api/v1/lessons/add-user-lesson",
                dataSave
              );
            }
            const today = new Date();
            const todayISO = today.toISOString().split("T")[0];
            // Nếu ngày học cuối cùng là hôm qua

            let userUpdate = {
              ...user,
              dailyPoints: user.dailyPoints + dataSave.score,
              weeklyPoints: user.weeklyPoints + dataSave.score,
              totalPoints: user.totalPoints + dataSave.score,
              lastLearningDate: todayISO,
            };

            if (user.lastLearningDate !== todayISO || user.streak === 0) {
              userUpdate = {
                ...userUpdate,
                streak: user.streak + 1,
              };
            }
            await customFetch.post(
              `/api/v1/user/update-user-point`,
              userUpdate
            );
            dispatch(setUserProfile(userUpdate));

            handleOpenModal();
            const audio = new Audio(
              "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/piglevelwin2mp3-14800.mp3"
            );
            audio.play().catch((error) => {
              console.error("Không thể phát audio:", error);
            });

            // return () => {
            //   audio.pause();
            //   audio.currentTime = 0;
            // };
          } catch (error) {}
        }
      }
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setCorrectAnswer(null);
      setIsChecking(false);
      setIncorrectAnswers([]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>There are no question to show</div>;
  }

  return (
    <div className="lq-question-container">
      <div className="lq-question-lesson">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 30,
            fontWeight: "bold",
            color: "black",
            padding: "10px",
          }}
        >
          Exercise
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack />
          </button>
          <button className="lq-question-lesson-title">
            {selectedLesson.title}
          </button>
        </div>
        <div className="lq-question-lesson-progress">
          <div
            className="lq-progress-bar"
            style={{ width: `${progress}%`, backgroundColor: "green" }}
          ></div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
            padding: "10px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              
              justifyContent: "flex-start",
              width: "20%",
            }}
          >
            <div style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid gray",
              padding: "10px",
              borderRadius: 10,
              backgroundColor: "white",
            }}>
              {"Question: "}
              {currentQuestionIndex + 1}/{totalQuestions}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid gray",
              padding: "10px",
              borderRadius: 10,
              backgroundColor: "white",
            }}
          >
            {" "}
            {formatTime(time)}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              justifyContent: "flex-end",
              width: "20%",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid gray",
                padding: "10px",
                borderRadius: 10,
                backgroundColor: "lightgreen",
              }}
            >
              <p>correct: {countCorrect}</p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid gray",
                padding: "10px",
                borderRadius: 10,
                backgroundColor: "lightcoral",
              }}
            >
              <p>incorrect: {questionIncorrect.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lq-queston-content-container">
        <div className="lq-question-title-container">
          <div>
            {!countCorrectFag && (
              <div
                style={{
                  display: "flex",
                  color: "red",
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "red",
                  padding: "10px",
                }}
              >
                Redo wrong questions
              </div>
            )}
            <h2 className="lq-question-title">
              {{
                WORD_MEANING: "Choose the meaning of the word",
                MEANING_WORD: "Choose the word",
                WORD_SPELLING: "Choose the correct pronunciation",
                SPELLING_WORD: "Listen and choose the correct word",
                FILL_IN_BLANK: "Fill in the blank",
                WORD_ORDER: "Arrange the words",
              }[question.type] || "Please select an answer"}
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={imageMeow} alt="" width={200} height={200} />{" "}
            <div className="lq-question-content-audio">
              {question.audio && <AudioPlayer audioSrc={question.audio} />}

              {question?.type === "WORD_ORDER" ? (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    borderBottom: "1px solid gray",
                    padding: "10px",
                  }}
                >
                  {listWords.map((word, index) => {
                    return (
                      <button
                        key={index}
                        className="lq-word-button"
                        onClick={() => {
                          // Thêm từ vào listWordsAnswer
                          setListWordsAnswer((prev) => {
                            const newListWordsAnswer = [...prev];
                            newListWordsAnswer.push(word); // Thêm từ vào listWordsAnswer
                            return newListWordsAnswer;
                          });

                          // Xóa từ khỏi listWords
                          setListWords((prev) => {
                            const newListWords = [...prev];
                            newListWords[index] = ""; // Xóa từ khỏi listWords
                            return newListWords.filter(Boolean); // Loại bỏ các phần tử rỗng
                          });
                        }}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="lq-question-content">{question?.content}</p>
              )}
            </div>
            {question.image && (
              <img
                className="lq-question-image"
                src={question.image}
                alt="Question"
                width={150}
                height={150}
              />
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {question?.type === "WORD_ORDER" ? (
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              {listWordsAnswer.map((word, index) => {
                return (
                  <button
                    key={index}
                    className="lq-word-button"
                    onClick={() => {
                      // Thêm từ vào listWords
                      setListWords((prev) => {
                        const newListWords = [...prev];
                        newListWords.push(word); // Thêm từ vào listWords
                        return newListWords;
                      });

                      // Xóa từ khỏi listWordsAnswer
                      setListWordsAnswer((prev) => {
                        const newListWordsAnswer = [...prev];
                        newListWordsAnswer.splice(index, 1); // Xóa từ khỏi listWordsAnswer
                        return newListWordsAnswer;
                      });
                    }}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="lq-answer-container">
              {question.answers.map((answer) => (
                <button
                  key={answer.id}
                  disabled={isChecking}
                  onClick={() => handleAnswerClick(answer)}
                  className={`lq-answer-button ${
                    selectedAnswer === answer.id
                      ? isChecking
                        ? answerStatus
                        : "selected"
                      : incorrectAnswers.includes(answer.id)
                      ? "incorrect"
                      : ""
                  } ${
                    correctAnswer === answer.id && answerStatus === "incorrect"
                      ? "correct-answer"
                      : ""
                  }`}
                >
                  {question.type === "WORD_SPELLING" ? (
                    <>🎵</>
                  ) : (
                    <>
                      {answer.content}
                      {answer.image && (
                        <img
                          className="lq-answer-image"
                          src={answer.image}
                          alt="Answer"
                          width={120}
                          height={120}
                        />
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          className="lq-next-question-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor:
              answerStatus === "correct"
                ? "lightgreen"
                : answerStatus === "incorrect"
                ? "tomato"
                : "transparent",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "20px",
            borderRadius: 10,
            justifyContent: "space-between",
            fontSize: 20,
          }}
        >
          {/*W*/}{" "}
          {question?.type === "WORD_ORDER" ? (
            <>
              {question && answerStatus === "incorrect" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "red",
                      fontSize: 20,
                      backgroundColor: "white",
                      borderRadius: "40px",
                    }}
                  >
                    <ImCancelCircle size={30} />
                  </div>
                  Correct answer: {originalWords.map((a) => a + " ")}
                </div>
              ) : question && answerStatus === "correct" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "Green",
                      fontSize: 20,
                      backgroundColor: "white",
                      borderRadius: "40px",
                      padding: "15px",
                    }}
                  >
                    <FaCheck size={30} />
                  </div>
                  <div>Correct!</div>
                </div>
              ) : (
                <div></div>
              )}
              <button
                onClick={handleNextOrCheck}
                className={`lq-next-button ${
                  !isChecking ? "lq-check-button" : "lq-next-button"
                }`}
                disabled={listWords.length === 0}
              >
                {!isChecking ? "Check" : "Next"}
              </button>
            </>
          ) : (
            <>
              {question && correctAnswer && answerStatus === "incorrect" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    color: "white",
                    fontSize: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "red",
                      fontSize: 20,
                      backgroundColor: "white",
                      borderRadius: "40px",
                    }}
                  >
                    <ImCancelCircle size={30} />
                  </div>

                  {question.type === "WORD_MEANING" ||
                  question.type === "MEANING_WORD"
                    ? "Correct answer: " +
                      question.answers.find((a) => a.id === correctAnswer)
                        ?.content
                    : "Incorrect!"}
                </div>
              ) : question && correctAnswer && answerStatus === "correct" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      color: "Green",
                      fontSize: 20,
                      backgroundColor: "white",
                      borderRadius: "40px",
                      padding: "15px",
                    }}
                  >
                    <FaCheck size={30} />
                  </div>
                  <div>Correct!</div>
                </div>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleNextOrCheck}
                className={`lq-next-button ${
                  !isChecking ? "lq-check-button" : "lq-next-button"
                }`}
                disabled={!selectedAnswer}
              >
                {!isChecking ? "Check" : "Next"}
              </button>
            </>
          )}
        </div>
      </div>
      <ModalResult
        open={openModal}
        handleClose={handleCloseModal}
        countCorrect={countCorrect}
        totalQuestions={totalQuestions}
        time={time}
      />
    </div>
  );
};

export default LearnQuestion;
