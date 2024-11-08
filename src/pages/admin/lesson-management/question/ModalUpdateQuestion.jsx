import {
  Box,
  Button,
  FormControl,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import customFetch from "../../../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import { setCLesson } from "../../../../redux/slices/clessonSlice";

const ModalUpdateQuestion = ({ visible, closeModal, data }) => {
  const dispatch = useDispatch();
  const lessonCurrent = useSelector((state) => state.clesson);

  const [typeSnackbar, setTypeSnackbar] = useState("success");

  const [audioQuestion, setAudioQuestion] = useState("");
  const [contentQuestion, setContentQuestion] = useState("");
  const fileTypes = ["MP3", "WAV", "OGG"];
  const [file, setFile] = useState(null);
  const [answerTA, setAnswerTA] = useState("");
  const [answerTB, setAnswerTB] = useState("");
  const [answerTC, setAnswerTC] = useState("");
  const [answerTD, setAnswerTD] = useState("");

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const clearModal = () => {
    setContentQuestion("");
    setAudioQuestion("");
    setAnswerTA("");
    setAnswerTB("");
    setAnswerTC("");
    setAnswerTD("");
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {

      return;
    }
    clearModal();
    setOpen(false);
  };

  useEffect(() => {
    if (!data) return;
    console.log("Data passed to modal: ", data?.audioUrl);
    setContentQuestion(data?.content);
    if (!data?.audioUrl){
      setAudioQuestion("");
    } else{
      setAudioQuestion(data?.audioUrl);
    }
    setAnswerTA(data?.answers[0].content);
    setAnswerTB(data?.answers[1].content);
    setAnswerTC(data?.answers[2].content);
    setAnswerTD(data?.answers[3].content);
  }, [data]);

  if (!visible) return null; // Don't render the modal if not visible

  const handleChangeAudio = async (selectedFile) => {
    setFile(selectedFile);
    await handleUploadAudio(selectedFile);
  };

  const handleUploadAudio = async (selectedFile) => {
    setLoading(true);
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
    } finally {
      setLoading(false); // Set loading to false after upload completes
    }
  };
  const handleClickOverlay = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };
  const handleUpdateQuestion = async () => {
    if (!contentQuestion || !answerTA || !answerTB || !answerTC || !answerTD) {
      setTypeSnackbar("error");
      setOpen(true);
      return;
    }
    await customFetch
      .get(`/api/v1/questions/get-question/${data.id}`)
      .then(async (res) => {
        const question = res.data;
        question.content = contentQuestion;
        question.audioUrl = audioQuestion;
        question.answers[0].content = answerTA;
        question.answers[1].content = answerTB;
        question.answers[2].content = answerTC;
        question.answers[3].content = answerTD;
        console.log("Question to update: ", question);
        try {
          await customFetch
            .post(`/api/v1/questions/create-question`, question)
            .then((res) => {
              customFetch
                .get(`/api/v1/lessons/find-lesson/${lessonCurrent.id}`)
                .then((res) => {
                  dispatch(setCLesson(res.data));
                  console.log(res.data);
                });
            });
          setOpen(true);
          setTypeSnackbar("success");
          closeModal();
        } catch (error) {
          console.error("There was an error updating the question!", error);
        }
      });
  };

  return (
    <div className="modal-overlay" onClick={handleClickOverlay}>
      {/* Display data passed to modal */}
      {data && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            height: "70%",
            bgcolor: "background.paper",
            border: "1px solid #000",
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            style={{
              display: "flex",
              padding: "10px",
              paddingBottom: "20px",
            }}
          >
            Chỉnh sửa câu hỏi
          </h2>
          <FormControl
            fullWidth
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            {/* <InputLabel id="demo-simple-select-label">Loại câu hỏi</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={typeQuestion}
              label="Loại câu hỏi"
              onChange={handleChange}
              style={{ width: "50%" }}
            >
              <MenuItem value={"TRANSLATION"}>Translation</MenuItem>
              <MenuItem value={"FILL_IN_BLANK"}>Fill in blank</MenuItem>
              <MenuItem value={"LISTENING"}>Listening</MenuItem>
            </Select> */}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FileUploader
                handleChange={handleChangeAudio}
                name="file"
                types={fileTypes}
              />
              {loading && (
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
            <div className="modal-update-question-grup-button">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateQuestion}
              >
                Lưu
              </Button>
              <Button variant="contained" color="error" onClick={closeModal}>
                Thoát
              </Button>
            </div>
          </FormControl>
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={typeSnackbar}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {typeSnackbar === "success"
            ? "Cập nhật câu hỏi thành công!"
            : "Vui lòng điền đầy đủ thông tin!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ModalUpdateQuestion;
