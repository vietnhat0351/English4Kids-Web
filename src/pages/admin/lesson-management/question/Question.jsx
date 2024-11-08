import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Popover,
  Select,
  TextField,
  Tooltip,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import customFetch from "../../../../utils/customFetch";
import AudioPlayer from "./AudioPlayer";
import { FileUploader } from "react-drag-drop-files";
import { useDispatch, useSelector } from "react-redux";
import { setCLesson } from "../../../../redux/slices/clessonSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

import FileInput from "../../../../utils/ReadExcelFile/FileInput";
import ReadExcel from "../../../../utils/ReadExcelFile/ReadExcel";
import ModalUpdateQuestion from "./ModalUpdateQuestion";
import "./modal.css";

const Question = () => {
  const currentUrl = window.location.href;
  const lastUrl = currentUrl.split("/").pop();

  const dispatch = useDispatch();
  const lessonCurrent = useSelector((state) => state.clesson);

  const [questions, setQuestions] = useState([]);
  const resetFields = () => {
    setWord("");
    setVietnameseMeaning("");
    setPronunciation("");
    setAudio("");
    setType("");
    setTypeQuestion("");
    setContentQuestion("");
    setAudioQuestion("");
    setAnswerTD("");
    setAnswerTA("");
    setAnswerTB("");
    setAnswerTC("");
    setData({});
  };

  const [loadingFile, setLoadingFile] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetFields();
  };
  const [age, setAge] = useState('');

  const handleChangeSelect = async (event) => {
    setAge(event.target.value);
    // lọc theo loại câu hỏi
     if (event.target.value == 1) {
      setQuestions(
        lessonCurrent.lessonParts
          .map((part) => part.questions)
          .flat()
          .sort((a, b) => b.id - a.id)
      );
    }
    if (event.target.value == 2) {
      setQuestions(
        lessonCurrent.lessonParts[0].questions
        
      );
    }
    if (event.target.value == 3) {
      setQuestions(
        lessonCurrent.lessonParts[1].questions

      );
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [deleteId, setDeleteId] = useState(null);

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

  const [excelData, setExcelData] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  const [openSnack, setOpenSnack] = useState(false);

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack(false);
  };

  const openModalWithData = (dataQuestion) => {
    setModalData(dataQuestion); // Set the data for the modal
    setModalVisible(true); // Open the modal
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalData(null); // Clear the data when closing the modal
  };

  const handleFileSelect = async (file) => {
    try {
      let listQuestion = [];
      let questionNew = {};
      const data = await ReadExcel(file);
      setExcelData(data);
      for (let i = 0; i < data.length; i++) {
        if (audioQuestion == null) {
          audioQuestion = "";
        }
        await customFetch
          .get(`/api/v1/lessons/find-word/${data[i].word}`)
          .then((res) => {
            questionNew = {
              ...questionNew,
              vocabulary: {
                id: res.data.id,
              },
              questionType: data[i].questionType,
              content: data[i].content,
              audioUrl: data[i].audioUrl,
              answers: [
                { content: data[i].contentA, correct: false },
                { content: data[i].contentB, correct: false },
                { content: data[i].contentC, correct: false },
                { content: data[i].contentD, correct: true },
              ],
              typeQuestion: data[i].typeQuestion,
            };
            if (data[i].questionType == "TRANSLATION") {
              questionNew = {
                ...questionNew,
                lessonPart: {
                  id: lessonCurrent.lessonParts[0].id,
                },
              };
            }
            if (data[i].questionType == "FILL_IN_BLANK") {
              questionNew = {
                ...questionNew,
                lessonPart: {
                  id: lessonCurrent.lessonParts[1].id,
                },
              };
            }
            if (data[i].questionType == "LISTENING") {
              questionNew = {
                ...questionNew,
                lessonPart: {
                  id: lessonCurrent.lessonParts[2].id,
                },
              };
            }
          });
        listQuestion.push(questionNew);
      }

      await customFetch
        .post(`/api/v1/questions/create-questions`, listQuestion)
        .then((res) => {
          console.log(res.data);
        });

      await customFetch
        .get(`/api/v1/lessons/find-lesson/${lessonCurrent.id}`)
        .then((res) => {
          dispatch(setCLesson(res.data));
          console.log(res.data);
        });
    } catch (error) {
      console.log(error + "???");
    }
  };

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
      // Set the questions from the combied lesson parts sorted by id descending
      setQuestions(
        lessonCurrent.lessonParts
          .map((part) => part.questions)
          .flat()
          .sort((a, b) => b.id - a.id)
      );
    }
  }, [lessonCurrent]);
  const handleChange = (event) => {
    setTypeQuestion(event.target.value);
  };
  const handleChangeAudio = async (selectedFile) => {
    setFile(selectedFile);
    await handleUploadAudio(selectedFile);
  };
  const handleUploadAudio = async (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

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
    if (
      word == "" ||
      contentQuestion == "" ||
      answerTA == "" ||
      answerTB == "" ||
      answerTC == "" ||
      answerTD == ""
    ) {
      setOpenSnack(true);
      return;
    }
    let dataQ = {
      // lessonPart: {
      //   id: lessonCurrent.lessonParts[0].id,
      // },
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
    if (typeQuestion == "TRANSLATION") {
      dataQ = {
        ...dataQ,
        lessonPart: {
          id: lessonCurrent.lessonParts[0].id,
        },
      };
    }
    if (typeQuestion == "FILL_IN_BLANK") {
      dataQ = {
        ...dataQ,
        lessonPart: {
          id: lessonCurrent.lessonParts[1].id,
        },
      };
    }
    if (typeQuestion == "LISTENING") {
      dataQ = {
        ...dataQ,
        lessonPart: {
          id: lessonCurrent.lessonParts[2].id,
        },
      };
    }
    console.log(dataQ);
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
      resetFields();
      handleClose();
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
  const handleDeleteQuestion = async () => {
    try {
      await customFetch
        .post(`/api/v1/questions/delete-question/${deleteId}`)
        .then((res) => {
          customFetch
            .get(`/api/v1/lessons/find-lesson/${lessonCurrent.id}`)
            .then((res) => {
              dispatch(setCLesson(res.data));
              console.log(res.data);
            });
        });
      setOpenDialog(false);
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
            <div className="a-q-title-add">
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Loại câu hỏi</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Loại câu hỏi"
                    onChange={handleChangeSelect}
                  >
                    <MenuItem value={1}>Tất cả</MenuItem>
                    <MenuItem value={2}>Translation</MenuItem>
                    <MenuItem value={3}>Fill in blank</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <button className="a-q-add-button" onClick={handleOpen}>
                Thêm câu hỏi
              </button>
              <button className="a-q-add-button">
                Nhập bằng file excel
                <FileInput onFileSelect={handleFileSelect} />
              </button>
            </div>
          </div>
          <div className="questions-grid-container">
            <div className="questions-grid">
              {questions.map((question, key) => (
                <div key={question.id} className="a-q-question-list">
                  <div className="a-q-question-content">
                    <div className="a-q-question-content-content">
                      <div className="a-q-question-content-content-content">
                        {question.content}
                      </div>
                      <div>
                        <button
                          onClick={() => openModalWithData(question)}
                          className="a-q-question-content-button"
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </button>
                      </div>
                      <div>
                        <button
                          className="a-q-question-content-button"
                          onClick={() => {
                            handleClickOpenDialog();
                            setDeleteId(question.id);
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </button>
                      </div>
                    </div>
                    <div className="a-q-question-content-content">
                      <h4>File audio: </h4>
                      {!question.audioUrl ? (
                        <div>Không có file audio</div>
                      ) : (
                        <div>
                          <AudioPlayer audioSrc={question.audioUrl} />
                        </div>
                      )}
                    </div>
                    <div className="a-q-question-content-content">
                      <h4>Loại câu hỏi: </h4>
                      {question.questionType}
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
          </div>
          <ModalUpdateQuestion
            visible={isModalVisible}
            closeModal={closeModal}
            data={modalData}
          />
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
                width: "60%",
                height: "85%",
                bgcolor: "background.paper",
                border: "1px solid #000",
                boxShadow: 24,
                borderRadius: 4,
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
                      <SearchIcon />
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
                      {audio && (
                        <AudioPlayer
                          style={{
                            width: "100%",
                            backgroundColor: "lightgray",
                          }}
                          audioSrc={audio}
                        />
                      )}

                      {/* <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // handleSaveWord();
                          }}
                        >
                          Thêm từ vựng
                        </Button>
                      </div> */}
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
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "rơw",
                          gap: "10px",
                        }}
                      >
                        <h1>Từ được chọn:</h1>
                        <h1 style={{ color: "#1cbb9b" }}>{data.word}</h1>
                      </div>

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
                            style={{ width: "50%" }}
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
                        style={{ width: "79%" }}
                      />
                      <div className="modal-audio-upload">
                        <TextField
                          id="standard-basic"
                          label="Audio câu hỏi"
                          variant="standard"
                          value={audioQuestion}
                          onChange={(e) => setAudioQuestion(e.target.value)}
                        />

                        <FileUploader
                          handleChange={handleChangeAudio}
                          name="file"
                          types={fileTypes}
                        />
                        {loadingFile && (
                          <CircularProgress
                            size={24}
                            style={{ marginLeft: 10 }}
                            color="primary"
                          />
                        )}
                      </div>

                      <TextField
                        id="standard-basic"
                        label="Đáp án đúng"
                        variant="standard"
                        value={answerTD}
                        onChange={(e) => setAnswerTD(e.target.value)}
                        style={{ width: "79%" }}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 1"
                        variant="standard"
                        value={answerTA}
                        onChange={(e) => setAnswerTA(e.target.value)}
                        style={{ width: "79%" }}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 2"
                        variant="standard"
                        value={answerTB}
                        onChange={(e) => setAnswerTB(e.target.value)}
                        style={{ width: "79%" }}
                      />
                      <TextField
                        id="standard-basic"
                        label="Đáp án sai 3"
                        variant="standard"
                        value={answerTC}
                        onChange={(e) => setAnswerTC(e.target.value)}
                        style={{ width: "79%" }}
                      />
                    </div>
                    <div className="modal-add-question">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleAddQuestion();
                        }}
                      >
                        Thêm câu hỏi
                      </Button>
                    </div>
                  </Typography>
                </div>
              </div>
            </Box>
          </Modal>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Bạn có chắc chắn muốn xóa câu hỏi này không?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Câu hỏi này sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button onClick={handleDeleteQuestion} autoFocus>
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
          >
            <Alert
              onClose={handleCloseSnack}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Vui lòng điền đầy đủ thông tin!{" "}
            </Alert>
          </Snackbar>
        </div>
      )}

      <div className="a-q-content"></div>
    </div>
  );
};

export default Question;
