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

const LearnQuestion = () => {
  const selectedLesson = useSelector((state) => state.lessonSelected);
  const user = useSelector((state) => state.user.profile);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();
  const lastUrl = location.pathname.split("/").pop();
  const audioRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  const [lessonQuestions, setLessonQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);

  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [correctAnswerStatus, setCorrectAnswerStatus] = useState(null);

  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const [countCorrect, setCountCorrect] = useState(0);
  const [countCorrectFag, setCountCorrectFag] = useState(true);

  const [nextQuestionDisable, setNextQuestionDisable] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [questionIncorrect, setQuestionIncorrect] = useState([]);

  const totalQuestions = selectedLesson?.questions?.length || 0;

  const [openModal, setOpenModal] = useState(false);

  const [imageMeow, setImageMeow] = useState(
    "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/thinking.png"
  );

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
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

        setLessonQuestions(shuffledQuestionsWithAnswers);
        dispatch(setLessonSelected(response.data));
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
    setListWordsAnswer(splitWords);
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
    setNextQuestionDisable(false);

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
        setCorrectAnswerStatus("correct");
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
          "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/Incorrect+sound+effect.mp3"
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
          try {
            const dataSave = {
              userId: user.id,
              lessonId: selectedLesson.id,
              // Làm tròn điểm số
              score: Math.round(countCorrect * 10),
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
            let userUpdate = {
              ...user,
              dailyPoints: user.dailyPoints + dataSave.score,
              weeklyPoints: user.weeklyPoints + dataSave.score,
              totalPoints: user.totalPoints + dataSave.score,
              lastLearningDate: todayISO,
            };

            if (user.lastLearningDate !== todayISO) {
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
      setNextQuestionDisable(true);
      setSelectedAnswer(null);
      setAnswerStatus(null);
      setCorrectAnswer(null);
      setCorrectAnswerStatus(null);
      setIsChecking(false);
      setIncorrectAnswers([]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!question) {
    return <div>Không có câu hỏi nào để hiển thị.</div>;
  }

  return (
    <div className="lq-question-container">
      <div className="lq-question-lesson">
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button className="back-btn" onClick={() => navigate(-1)}>
            <IoMdArrowRoundBack size={{}} />
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
                Làm lại câu sai
              </div>
            )}
            <h2 className="lq-question-title">
              {{
                WORD_MEANING: "Hãy chọn nghĩa tiếng Việt",
                MEANING_WORD: "Hãy chọn từ tiếng Anh",
                WORD_SPELLING: "Nghe và chọn từ đúng",
                FILL_IN_FLANK: "Điền vào chỗ trống",
                WORD_ORDER: "Sắp xếp từ thành câu",
              }[question.type] || "Hãy chọn đáp án"}
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
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
            <>
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
                  {answer.content}
                  {answer.image && (
                    <img
                      className="lq-answer-image"
                      src={answer.image}
                      alt="Answer"
                      width={150}
                      height={150}
                    />
                  )}
                </button>
              ))}
            </>
          )}
        </div>
        <div
          className="lq-next-question-container"
          style={{
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
          }}
        >
          {" "}
          {question?.type === "WORD_ORDER" ? (
            <>
              {question && answerStatus === "incorrect" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Đáp án đúng: " " +{originalWords.map((a) => a + " ")}
                </div>
              ) : question && answerStatus === "correct" ? (
                <div>Đúng rồi!</div>
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
                {!isChecking ? "Kiểm tra" : "Tiếp tục"}
              </button>
            </>
          ) : (
            <>
              {question && correctAnswer && answerStatus === "incorrect" ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  Đáp án đúng:
                  {" " +
                    question.answers.find((a) => a.id === correctAnswer)
                      .content}
                </div>
              ) : question && correctAnswer && answerStatus === "correct" ? (
                <div>Đúng rồi!</div>
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
                {!isChecking ? "Kiểm tra" : "Tiếp tục"}
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
      />
    </div>
  );
};

export default LearnQuestion;
