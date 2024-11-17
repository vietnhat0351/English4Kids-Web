import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../../utils/customFetch";
import { setLessonSelected } from "../../../../redux/slices/clessonSlice";
import "./styles.css";

import AudioPlayer from "../../../../utils/AudioPlayer";
import ModalResult from "./ModalResult";

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

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;
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
      const isCorrect =
        selectedAnswer &&
        question.answers.find((a) => a.id === selectedAnswer)?.correct;
      setAnswerStatus(isCorrect ? "correct" : "incorrect");
      setCorrectAnswer(question.answers.find((a) => a.correct).id);
      setCorrectAnswerStatus("correct");

      if (isCorrect) {
        if (countCorrectFag) {
          setCountCorrect((prev) => prev + 1);
        }
        setAnsweredQuestions([...answeredQuestions, question.id]);
      } else {
        setIncorrectAnswers([...incorrectAnswers, question.id]);
        setQuestionIncorrect([...questionIncorrect, question]);
      }
      setIsChecking(true);
    } else {
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
              score: countCorrect*100/totalQuestions,
            }
            console.log(dataSave);
            await customFetch.post(
              "/api/v1/lessons/add-user-lesson",
              dataSave
            );

            handleOpenModal();
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
        <button className="lq-question-lesson-title">
          {selectedLesson.title}
        </button>
        <div className="lq-question-lesson-progress">
          <div
            className="lq-progress-bar"
            style={{ width: `${progress}%`, backgroundColor: "green" }}
          ></div>
        </div>
      </div>

      <div className="lq-queston-content-container">
        <h2 className="lq-question-title">
          {{
            WORD_MEANING: "Hãy chọn nghĩa tiếng Việt",
            MEANING_WORD: "Hãy chọn từ tiếng Anh",
            WORD_SPELLING: "Nghe và chọn từ đúng",
            FILL_IN_FLANK: "Điền vào chỗ trống",
            WORD_ORDER: "Sắp xếp từ thành câu",
          }[question.type] || "Hãy chọn đáp án"}
        </h2>
        <div className="lq-question-content-audio">
          {question.audio && <AudioPlayer audioSrc={question.audio} />}
          <p className="lq-question-content">{question.content}</p>
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
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
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
            justifyContent: "center",
            alignItems: "center",
            padding: "20px 0",
            borderRadius: 10,
          }}
        >
          <button
            onClick={handleNextOrCheck}
            className={`lq-next-button ${
              !isChecking ? "lq-check-button" : "lq-next-button"
            }`}
            disabled={!selectedAnswer}
          >
            {!isChecking ? "Kiểm tra" : "Câu hỏi tiếp theo"}
          </button>
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
