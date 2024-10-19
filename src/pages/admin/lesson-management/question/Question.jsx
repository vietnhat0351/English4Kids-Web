import React, { useEffect, useState } from "react";
import "./styles.css";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import customFetch from "../../../../utils/customFetch";
import AudioPlayer from "./AudioPlayer";
import { FileUploader } from "react-drag-drop-files";
import { useDispatch, useSelector } from "react-redux";
import { setCLesson } from "../../../../redux/slices/clessonSlice";

const Question = () => {
  const currentUrl = window.location.href;
  const lastUrl = currentUrl.split("/").pop();

  const dispatch = useDispatch();
  const lessonCurrent = useSelector((state) => state.clesson);

  const [questions, setQuestions] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [word, setWord] = useState("");
  const [vietnameseMeaning, setVietnameseMeaning] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [audio, setAudio] = useState("");
  const [type, setType] = useState("");

  const [data, setData] = useState({});

  const [typeQuestion, setTypeQuestion] = useState("TRANSLATION");

  const [audioQuestion, setAudioQuestion] = useState("");
  const [contentQuestion, setContentQuestion] = useState("");
  const [answerTA, setAnswerTA] = useState("");
  const [answerTB, setAnswerTB] = useState("");
  const [answerTC, setAnswerTC] = useState("");
  const [answerTD, setAnswerTD] = useState("");

  const fileTypes = ["MP3", "WAV", "OGG"];
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      await customFetch
        .get(`/api/v1/lessons/find-lesson/${lastUrl}`) // Use the id from URL
        .then((res) => {
          dispatch(setCLesson(res.data));
        });
    };
    fetchLesson();
  }, [lastUrl, dispatch]);
  useEffect(() => {
    if (
      lessonCurrent &&
      lessonCurrent.lessonParts &&
      lessonCurrent.lessonParts.length > 0
    ) {
      setQuestions(lessonCurrent.lessonParts[0].questions || []); // Sử dụng || [] để tránh lỗi nếu questions undefined
    }
  }, [lessonCurrent]);
  const handleChange = (event) => {
    setTypeQuestion(event.target.value);
  };
  const handleChangeAudio = async (file) => {
    setFile(file);
    await handleUploadAudio();
  };
  const handleUploadAudio = async () => {
    // event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await customFetch.post(
        `/api/v1/storage/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully!", response.data);
      setAudioQuestion(response.data);
      return response.data;
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      return null;
    }
  };

  const handleAddQuestion = async () => {
    const dataQ = {
      lessonPart: {
        id: lessonCurrent.lessonParts[0].id,
      },
      vocabulary: {
        id: data.id,
      },

      questionType: typeQuestion,
      content: contentQuestion,
      audioUrl: audioQuestion,
      answers: [
        { content: answerTA, correct: false },
        { content: answerTB, correct: false },
        { content: answerTC, correct: false },
        { content: answerTD, correct: true },
      ],
    };
    try {
      await customFetch
        .post(`/api/v1/questions/create-question`, dataQ)
        .then((res) => {
          customFetch
            .get(`/api/v1/lessons/find-lesson/${lessonCurrent.id}`)
            .then((res) => {
              dispatch(setCLesson(res.data));
              console.log(res.data);
            });
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFindWord = async (word) => {
    try {
      const res = await customFetch
        .get(`/api/v1/lessons/find-word/${word}`)
        .then((res) => {
          setVietnameseMeaning(res.data.vietnameseMeaning);
          setPronunciation(res.data.pronunciation);
          setAudio(res.data.audio);
          setType(res.data.type);
          console.log(res.data);
          setData(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="a-q-container">
      {lessonCurrent && (
        <div className="a-q-header">
          <div className="a-q-title">
            <h3>{lessonCurrent.title}</h3>
            <div>
              <button onClick={handleOpen}>Thêm câu hỏi</button>
            </div>
          </div>

          <div className="questions-grid">
            {questions.map((question) => (
              <div key={question.id} className="a-q-question-list">
                <div className="a-q-question-content">
                  <div className="a-q-question-content-content">
                    Nội dung câu hỏi: {question.content}
                  </div>
                  <div className="a-q-question-content-content">
                    File audio:{" "}
                    {question.audioUrl != "" ? (
                      <div>
                        <AudioPlayer audioSrc={question.audioUrl} />
                      </div>
                    ) : (
                      "Không có audio"
                    )}
                  </div>
                </div>
                <div className="a-q-answer">
                  <h4>Đáp án: </h4>
                  <div className="answers-grid">
                    {question.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className={`a-q-question-answer-item ${
                          answer.correct ? "correct" : "incorrect"
                        }`}
                      >
                        <div className="a-q-question-answer-content">
                          - {answer.content} {answer.correct ? "-" : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                height: "90%",
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <h2>Thêm câu hỏi mới</h2>
                <h5
                  style={{
                    color: "red",
                    fontWeight: "lighter",
                  }}
                >
                  * Mỗi câu hỏi sẽ phải liên quan tới 1 từ vựng
                </h5>
              </Typography>
              <div className="modal-modal-content">
                <div className="modal-modal-left">
                  <h4>Chọn từ vựng</h4>
                  <div className="modal-pick-word">
                    <TextField
                      id="outlined-basic"
                      label="Từ vựng"
                      variant="outlined"
                      width="80%"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleFindWord(word);
                      }}
                    >
                      Tìm từ vựng
                    </Button>
                  </div>
                  <div>
                    <Typography
                      id="modal-modal-description"
                      sx={{ mt: 2 }}
                      component="div"
                      className="modal-content-word"
                    >
                      <TextField
                        id="standard-basic"
                        label="Nghĩa tiếng Việt"
                        variant="standard"
                        value={vietnameseMeaning}
                        onChange={(e) => setVietnameseMeaning(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Phát âm"
                        variant="standard"
                        value={pronunciation}
                        onChange={(e) => setPronunciation(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Loại từ"
                        variant="standard"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Link audio"
                        variant="standard"
                        value={audio}
                        onChange={(e) => setAudio(e.target.value)}
                      />
                      <Button variant="contained" color="primary">
                        <AudioPlayer audioSrc={audio} />
                      </Button>
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // handleSaveWord();
                          }}
                        >
                          Thêm từ vựng
                        </Button>
                      </div>
                    </Typography>
                  </div>
                </div>
                <div className="modal-modal-right">
                  <Typography
                    id="modal-modal-description"
                    sx={{ mt: 2 }}
                    component="div"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                      }}
                    >
                      <h1>Từ được chọn: {data.word}</h1>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Loại câu hỏi
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={typeQuestion}
                            label="Loại câu hỏi"
                            onChange={handleChange}
                          >
                            <MenuItem value={"TRANSLATION"}>
                              Translation
                            </MenuItem>
                            <MenuItem value={"FILL_IN_BLANK"}>
                              Fill in blank
                            </MenuItem>
                            <MenuItem value={"LISTENING"}>Listening</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <TextField
                        id="standard-basic"
                        label="Nội dung câu hỏi"
                        variant="standard"
                        value={contentQuestion}
                        onChange={(e) => setContentQuestion(e.target.value)}
                      />
                      <div>
                        <TextField
                          id="standard-basic"
                          label="Audio câu hỏi"
                          variant="standard"
                          value={audioQuestion}
                          onChange={(e) => setAudioQuestion(e.target.value)}
                        />
                        <Button variant="contained" color="primary">
                          <FileUploader
                            handleChange={handleChangeAudio}
                            name="file"
                            types={fileTypes}
                          />
                        </Button>
                      </div>

                      <TextField
                        id="standard-basic"
                        label="Đáp án đúng"
                        variant="standard"
                        value={answerTD}
                        onChange={(e) => setAnswerTD(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 1"
                        variant="standard"
                        value={answerTA}
                        onChange={(e) => setAnswerTA(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 2"
                        variant="standard"
                        value={answerTB}
                        onChange={(e) => setAnswerTB(e.target.value)}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 3"
                        variant="standard"
                        value={answerTC}
                        onChange={(e) => setAnswerTC(e.target.value)}
                      />
                    </div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleAddQuestion();
                      }}
                    >
                      Thêm câu hỏi
                    </Button>
                  </Typography>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      )}

      <div className="a-q-content"></div>
    </div>
  );
};

export default Question;
