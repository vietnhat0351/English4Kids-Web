import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import "./style.css";

import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";

import customFetch from "../../../../../utils/customFetch";
import AudioPlayer from "../../../../../utils/AudioPlayer";
import { setVocabularies } from "../../../../../redux/slices/vocabularySlice";
import { current } from "@reduxjs/toolkit";
import { setLessonSelected } from "../../../../../redux/slices/clessonSlice";
import { useLocation } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ModalUpdateQuestion = ({ open, handleClose, dataQuestion }) => {
  const location = useLocation();
  const vovabularies = useSelector((state) => state.vovabularies);
  const dispatch = useDispatch();

  const [word, setWord] = useState("");
  const [checkWord, setCheckWord] = useState(false);

  const [meaning, setMeaning] = useState("");
  const [checkMeaning, setCheckMeaning] = useState(false);

  const [pronunciation, setPronunciation] = useState("");
  const [checkPronunciation, setCheckPronunciation] = useState(false);

  const [type, setType] = useState("");
  const [checkType, setCheckType] = useState(false);

  const [image, setImage] = useState("");
  const [checkImage, setCheckImage] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [audio, setAudio] = useState("");
  const [checkAudio, setCheckAudio] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const [wordFind, setWordFind] = useState(null);
  const [checkWordFind, setCheckWordFind] = useState("");

  const [result, setResult] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarContent, setSnackBarContent] = useState("");
  const [snackBarType, setSnackBarType] = useState("error");

  // UseEffect to reset the form when the modal is closed
  React.useEffect(() => {
    if (dataQuestion && dataQuestion.vocabulary) {
      setWordFind(dataQuestion.vocabulary);
      setWord(dataQuestion.vocabulary.word || ""); // Giá trị mặc định là ""
      setMeaning(dataQuestion.vocabulary.meaning || "");
      setPronunciation(dataQuestion.vocabulary.pronunciation || "");
      setType(dataQuestion.vocabulary.type || "");
      setImage(dataQuestion.vocabulary.image || "");
      setAudio(dataQuestion.vocabulary.audio || "");
    } else {
      // Reset state nếu dataQuestion hoặc vocabulary không tồn tại
      setWord("");
      setMeaning("");
      setPronunciation("");
      setType("");
      setImage("");
      setAudio("");
    }
  }, [open, dataQuestion]);

  const handleClickSnack = (content, status) => {
    setSnackBarType(status);
    setSnackBarContent(content);
    setOpenSnackbar(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    //Xóa các trường dữ liệu đã nhập

    setOpenSnackbar(false);
  };

  const handleFindWord = async () => {
    if (word === "" || word === null) {
      setCheckWordFind("Word is required!");
      return;
    }
    // Call the API to find the word with word is lowercase
    const response = await customFetch.get(
      `/api/v1/vocabulary/find-word/${word.toLowerCase()}`
    );
    console.log("Response", response.data);
    if (response.data) {
      setWordFind(response.data);
      if (!response.data.inDatabase && response.data.word) {
        setCheckWordFind(
          "This information already exists, please double-check."
        );
        if (response.data.word) {
          setWord(response.data.word);
        }
        if (response.data.meaning) {
          setMeaning(response.data.meaning);
        }
        if (response.data.pronunciation) {
          setPronunciation(response.data.pronunciation);
        }
        if (response.data.type) {
          setType(response.data.type);
        }
        if (response.data.image) {
          setImage(response.data.image);
        }
        if (response.data.audio) {
          setAudio(response.data.audio);
        }
      } else if (response.data.inDatabase) {
        setMeaning(response.data.meaning);
        setPronunciation(response.data.pronunciation);
        setType(response.data.type);
        setImage(response.data.image);
        setAudio(response.data.audio);
        setCheckWordFind(
          "The vocabulary already exists! Please update the information if needed."
        );
      } else {
        setCheckWordFind("Vocabulary not found, please add a new one.");
        setMeaning("");
        setPronunciation("");
        setType("");
        setImage("");
        setAudio("");
      }
    } else {
      setCheckWordFind("Vocabulary not found, please add a new one.");
      setMeaning("");
      setPronunciation("");
      setType("");
      setImage("");
      setAudio("");
    }
    console.log("Word find", wordFind);
  };

  const handleSaveWord = async () => {
    try {
      const res = await customFetch.get(
        `/api/v1/vocabulary/find-word-fast/${word.toLowerCase()}`
      );
      if (res.data.inDatabase) {
        return;
      }
    } catch (error) {
      console.error("Error when finding word", error);
    }

    if (word === "") {
      setCheckWord(true);
      setCheckWordFind("");
    } else {
      setCheckWord(false);
    }

    if (meaning === "") {
      setCheckMeaning(true);
    } else {
      setCheckMeaning(false);
    }

    if (pronunciation === "") {
      setCheckPronunciation(true);
    } else {
      setCheckPronunciation(false);
    }

    if (type === "") {
      setCheckType(true);
    } else {
      setCheckType(false);
    }

    if (audio === "") {
      setCheckAudio(true);
    } else {
      setCheckAudio(false);
    }

    if (
      word === "" ||
      meaning === "" ||
      pronunciation === "" ||
      type === "" ||
      image === null ||
      audio === "" ||
      audio === null
    ) {
      handleClickSnack("All required fields must be filled out.", "error");
      return;
    }
    let dataSave = {
      word: word,
      meaning: meaning,
      pronunciation: pronunciation,
      type: type,
      image: image,
      audio: audio,
    };
    if (wordFind.inDatabase) {
      dataSave = {
        ...dataSave,
        id: wordFind.id,
      };
    }

    console.log("Data to save", dataSave);
    try {
      await customFetch
        .post(`/api/v1/vocabulary/create-vocabulary`, dataSave)
        .then((response) => {
          console.log("Word saved successfully!", response.data);
        });
      await customFetch
        .get(`/api/v1/vocabulary/vocabularies`)
        .then((response) => {
          dispatch(setVocabularies(response.data));
        });
      const isSuccess = false;
      handleClose(isSuccess);
    } catch (error) {
      console.error("Error when saving word", error);
    }
  };

  const handleFileChange = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingImage;
      setData = setImage;
    } else if (type === "audio") {
      setLoading = setLoadingAudio;
      setData = setAudio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  // Common file upload logic for image/audio
  const handleFileUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await customFetch.post(
      `/api/v1/storage/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  };

  // Usage for image change
  const handleChangeImage = (selectedFile) => {
    handleFileChange(selectedFile, "image");
  };

  // Usage for audio change
  const handleChangeAudio = (selectedFile) => {
    handleFileChange(selectedFile, "audio");
  };

  //================================================================================================
  //================================================================================================
  //================================================================================================
  //================================================================================================
  //================================================================================================
  const lessonCurrent = useSelector((state) => state.lessonSelected);

  const [questionContent, setQuestionContent] = useState("");
  const [questionImage, setQuestionImage] = useState("");
  const [loadingImageQuestion, setLoadingImageQuestion] = useState(false);
  const [questionAudio, setQuestionAudio] = useState("");
  const [loadingAudioQuestion, setLoadingAudioQuestion] = useState(false);
  const [questionType, setQuestionType] = useState("");

  const [answerContent, setAnswerContent] = useState("");
  const [answerImage, setAnswerImage] = useState("");
  const [loadingAnswerImage, setLoadingAnswerImage] = useState(false);
  const [answerAudio, setAnswerAudio] = useState("");
  const [loadingAnswerAudio, setLoadingAnswerAudio] = useState(false);

  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer1Disiable, setWrongAnswer1Disiable] = useState(true);
  const [wrongAnswer1Image, setWrongAnswer1Image] = useState("");
  const [loadingWrongAnswer1Image, setLoadingWrongAnswer1Image] =
    useState(false);
  const [wrongAnswer1Audio, setWrongAnswer1Audio] = useState("");
  const [loadingWrongAnswer1Audio, setLoadingWrongAnswer1Audio] =
    useState(false);

  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer2Disiable, setWrongAnswer2Disiable] = useState(true);
  const [wrongAnswer2Image, setWrongAnswer2Image] = useState("");
  const [loadingWrongAnswer2Image, setLoadingWrongAnswer2Image] =
    useState(false);
  const [wrongAnswer2Audio, setWrongAnswer2Audio] = useState("");
  const [loadingWrongAnswer2Audio, setLoadingWrongAnswer2Audio] =
    useState(false);

  const [wrongAnswer3, setWrongAnswer3] = useState("");
  const [wrongAnswer3Disiable, setWrongAnswer3Disiable] = useState(true);
  const [wrongAnswer3Image, setWrongAnswer3Image] = useState("");
  const [loadingWrongAnswer3Image, setLoadingWrongAnswer3Image] =
    useState(false);
  const [wrongAnswer3Audio, setWrongAnswer3Audio] = useState("");
  const [loadingWrongAnswer3Audio, setLoadingWrongAnswer3Audio] =
    useState(false);

  const [loadingQuestionImage, setLoadingQuestionImage] = useState(false);
  const [loadingQuestionAudio, setLoadingQuestionAudio] = useState(false);

  const [loadingAImage, setLoadingAImage] = useState(false);
  const [loadingAAudio, setLoadingAAudio] = useState(false);

  const [loadingA1Image, setLoadingA1Image] = useState(false);
  const [loadingA1Audio, setLoadingA1Audio] = useState(false);

  const [loadingA2Image, setLoadingA2Image] = useState(false);
  const [loadingA2Audio, setLoadingA2Audio] = useState(false);

  const [loadingA3Image, setLoadingA3Image] = useState(false);
  const [loadingA3Audio, setLoadingA3Audio] = useState(false);

  const [openSnackbarQuestion, setOpenSnackbarQuestion] = useState(false);

  const [questionErrorContent, setQuestionErrorContent] = useState("");

  React.useEffect(() => {
    if (dataQuestion) {
      // Kiểm tra sự tồn tại của vocabulary và answers trước khi truy cập
      setQuestionContent(dataQuestion.content || "");
      setQuestionType(dataQuestion.type || "");
      setQuestionImage(dataQuestion.image || "");
      setQuestionAudio(dataQuestion.audio || "");

      if (dataQuestion.vocabulary) {
        setWord(dataQuestion.vocabulary.word || "");
        setMeaning(dataQuestion.vocabulary.meaning || "");
        setPronunciation(dataQuestion.vocabulary.pronunciation || "");
        setType(dataQuestion.vocabulary.type || "");
        setImage(dataQuestion.vocabulary.image || "");
        setAudio(dataQuestion.vocabulary.audio || "");
      }

      if (dataQuestion.answers && dataQuestion.answers.length > 0) {
        setAnswerContent(dataQuestion.answers[0].content || "");
        setAnswerImage(dataQuestion.answers[0].image || "");
        setAnswerAudio(dataQuestion.answers[0].audio || "");

        // Lặp qua các câu trả lời sai (nếu có)
        setWrongAnswer1Disiable(false);
        setWrongAnswer1(dataQuestion.answers[1]?.content || "");
        setWrongAnswer1Image(dataQuestion.answers[1]?.image || "");
        setWrongAnswer1Audio(dataQuestion.answers[1]?.audio || "");

        setWrongAnswer2Disiable(false);
        setWrongAnswer2(dataQuestion.answers[2]?.content || "");
        setWrongAnswer2Image(dataQuestion.answers[2]?.image || "");
        setWrongAnswer2Audio(dataQuestion.answers[2]?.audio || "");

        setWrongAnswer3Disiable(false);
        setWrongAnswer3(dataQuestion.answers[3]?.content || "");
        setWrongAnswer3Image(dataQuestion.answers[3]?.image || "");
        setWrongAnswer3Audio(dataQuestion.answers[3]?.audio || "");
      }
    } else {
      // Reset state nếu dataQuestion không tồn tại
      setWord("");
      setMeaning("");
      setPronunciation("");
      setType("");
      setImage("");
      setAudio("");
      setAnswerContent("");
      setAnswerImage("");
      setAnswerAudio("");
      setWrongAnswer1("");
      setWrongAnswer1Image("");
      setWrongAnswer1Audio("");
      setWrongAnswer2("");
      setWrongAnswer2Image("");
      setWrongAnswer2Audio("");
      setWrongAnswer3("");
      setWrongAnswer3Image("");
      setWrongAnswer3Audio("");
    }
  }, [open, dataQuestion]);

  const handleClickSnackQuestion = (content) => {
    setQuestionErrorContent(content);
    setOpenSnackbarQuestion(true);
  };

  const handleCloseSnackQuestion = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbarQuestion(false);
  };

  // Usage for image change
  const handleChangeImageQ = (selectedFile) => {
    handleFileChangeQ(selectedFile, "image");
  };
  // Usage for audio change
  const handleChangeAudioQ = (selectedFile) => {
    handleFileChangeQ(selectedFile, "audio");
  };
  const handleFileChangeQ = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingQuestionImage;
      setData = setQuestionImage;
    } else if (type === "audio") {
      setLoading = setLoadingQuestionAudio;
      setData = setQuestionAudio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  //================================================================================================
  // Usage for image change
  const handleChangeImageA = (selectedFile) => {
    handleFileChangeA(selectedFile, "image");
  };

  // Usage for audio change
  const handleChangeAudioA = (selectedFile) => {
    handleFileChangeA(selectedFile, "audio");
  };
  const handleFileChangeA = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingAImage;
      setData = setAnswerImage;
    } else if (type === "audio") {
      setLoading = setLoadingAAudio;
      setData = setAnswerAudio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };
  //================================================================================================
  // Usage for image change
  const handleChangeImageA1 = (selectedFile) => {
    handleFileChangeA1(selectedFile, "image");
  };

  // Usage for audio change
  const handleChangeAudioA1 = (selectedFile) => {
    handleFileChangeA1(selectedFile, "audio");
  };
  const handleFileChangeA1 = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingA1Image;
      setData = setWrongAnswer1Image;
    } else if (type === "audio") {
      setLoading = setLoadingA1Audio;
      setData = setWrongAnswer1Audio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };

  //================================================================================================
  // Usage for image change
  const handleChangeImageA2 = (selectedFile) => {
    handleFileChangeA2(selectedFile, "image");
  };

  // Usage for audio change
  const handleChangeAudioA2 = (selectedFile) => {
    handleFileChangeA2(selectedFile, "audio");
  };
  const handleFileChangeA2 = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingA2Image;
      setData = setWrongAnswer2Image;
    } else if (type === "audio") {
      setLoading = setLoadingA2Audio;
      setData = setWrongAnswer2Audio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };
  //================================================================================================
  // Usage for image change
  const handleChangeImageA3 = (selectedFile) => {
    handleFileChangeA3(selectedFile, "image");
  };

  // Usage for audio change
  const handleChangeAudioA3 = (selectedFile) => {
    handleFileChangeA3(selectedFile, "audio");
  };
  const handleFileChangeA3 = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingA3Image;
      setData = setWrongAnswer3Image;
    } else if (type === "audio") {
      setLoading = setLoadingA3Audio;
      setData = setWrongAnswer3Audio;
    }
    setLoading(true);

    try {
      // Upload file using the customFetch utility
      const response = await handleFileUpload(selectedFile);
      console.log("File uploaded successfully!", response.data);

      // Update state with the uploaded file's data (image or audio URL)
      setData(response.data);
    } catch (error) {
      console.error(`There was an error uploading the ${type}!`, error);
    } finally {
      // Reset loading state regardless of success or failure
      setLoading(false);
    }
  };
  ///================================================================================================

  const handleSaveQuestion = async () => {
    console.log("Data question", wordFind);
    if (!questionContent || !questionType || !wordFind) {
      handleClickSnackQuestion("All question details must be filled out.");
      return;
    } else {
      //================================================================================================
      if (questionType === "WORD_MEANING" || questionType === "MEANING_WORD") {
        if (!answerContent) {
          handleClickSnackQuestion("Answer information is missing.");
          return;
        } else {
          if (!wrongAnswer1 && !wrongAnswer2 && !wrongAnswer3) {
            handleClickSnackQuestion("Answer information is missing.");
            return;
          }
        }
      }
      //================================================================================================
      if (questionType === "WORD_SPELLING") {
        if (!answerAudio) {
          handleClickSnackQuestion("Answer information is missing.");
          return;
        } else {
          if (!wrongAnswer1Audio && !wrongAnswer2Audio && !wrongAnswer3Audio) {
            handleClickSnackQuestion("Answer information is missing.");
            return;
          }
        }
      }
      //================================================================================================
      if (questionType === "SPELLING_WORD") {
        if (!questionAudio) {
          handleClickSnackQuestion("Answer information is missing.");
          return;
        } else {
          if (!answerContent) {
            handleClickSnackQuestion("Answer information is missing.");
            return;
          }
          if (!wrongAnswer1 && !wrongAnswer2 && !wrongAnswer3) {
            handleClickSnackQuestion("Answer information is missing. sai");
            return;
          }
        }
      }
      //================================================================================================
      if (questionType === "FILL_IN_FLANK") {
        if (!answerContent) {
          handleClickSnackQuestion("Answer information is missing.");
          return;
        } else {
          if (!wrongAnswer1 && !wrongAnswer2 && !wrongAnswer3) {
            handleClickSnackQuestion("Answer information is missing.");
            return;
          }
        }
      }
      //================================================================================================
      if (questionType === "WORD_ORDER") {
        //Nêu câu hỏi có ít hơn 2 từ thì lỗi
        if (questionContent.split(" ").length < 2) {
          handleClickSnackQuestion("Question must have at least 2 words.");
          return;
        }
      }
      //================================================================================================
      let dataSave = {
        id: dataQuestion.id,
        content: questionContent,
        type: questionType,
        image: questionImage,
        audio: questionAudio,
        lesson: {
          id: lessonCurrent.id,
        },
        vocabulary: {
          id: wordFind.id,
        },
      };
      let dataAnswer = [];
      if (answerContent) {
        dataAnswer.push({
          content: answerContent,
          image: answerImage,
          audio: answerAudio,
          isCorrect: true,
        });
      }
      if (wrongAnswer1) {
        dataAnswer.push({
          content: wrongAnswer1,
          image: wrongAnswer1Image,
          audio: wrongAnswer1Audio,
          isCorrect: false,
        });
      }
      if (wrongAnswer2) {
        dataAnswer.push({
          content: wrongAnswer2,
          image: wrongAnswer2Image,
          audio: wrongAnswer2Audio,
          isCorrect: false,
        });
      }
      if (wrongAnswer3) {
        dataAnswer.push({
          content: wrongAnswer3,
          image: wrongAnswer3Image,
          audio: wrongAnswer3Audio,
          isCorrect: false,
        });
      }
      dataSave = {
        ...dataSave,
        answers: dataAnswer,
      };
      console.log("Data save", dataSave);
      try {
        console.log("Data save", dataSave);
        const response = await customFetch.post(
          "/api/v1/questions/update",
          dataSave
        );
        console.log("Question saved successfully!", response.data);
        const lastUrl = location.pathname.split("/").pop();
        console.log("lastUrl", lastUrl);

        const fetchData = async () => {
          try {
            const response = await customFetch.get(
              `/api/v1/lessons/${lastUrl}`
            );
            console.log("response", response.data);
            dispatch(setLessonSelected(response.data));
          } catch (error) {
            console.error(error);
          }
        };
        fetchData();

        handleClose();
      } catch (error) {
        console.error("Error when saving question", error);
      }
      //================================================================================================
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="m-add-question-container">
          <div className="m-word-container">
            <Typography id="modal-modal-title" variant="h4" component="h1">
              Vocabulary
            </Typography>
            <div className="m-add-voca-content">
              <div className="m-add-voca-content-content">
                <TextField
                  fullWidth
                  id="demo-helper-text-misaligned"
                  label="Word"
                  value={word}
                  sx={{ width: "100%" }}
                  onChange={(e) => {
                    setWord(e.target.value);
                    setCheckWordFind("");
                  }}
                />
                <button
                  className="m-add-voca-button"
                  onClick={() => handleFindWord()}
                >
                  Find
                </button>
              </div>
              {checkWordFind !== "" && (
                <p
                  style={{
                    color: "green",
                    // kiểu chử nghiên
                    fontStyle: "italic",
                  }}
                >
                  *{checkWordFind}
                </p>
              )}

              <TextField
                id="demo-helper-text-misaligned"
                label="Meaning"
                value={meaning}
                sx={{ width: "100%" }}
                onChange={(e) => {
                  setMeaning(e.target.value);
                  setCheckMeaning(false);
     
                }}
              />
              {checkMeaning && (
                <p style={{ color: "red", fontStyle: "italic" }}>*</p>
              )}
              <TextField
                id="demo-helper-text-misaligned"
                label="Pronunciation"
                value={pronunciation}
                sx={{ width: "100%" }}
                onChange={(e) => {
                  setPronunciation(e.target.value);
                  setCheckPronunciation(false);
                }}
              />
              {checkPronunciation && (
                <p style={{ color: "red", fontStyle: "italic" }}>*</p>
              )}

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={(e) => {
                    setType(e.target.value);
                    setCheckType(false);
                  }}
                >
                  <MenuItem value={"NOUN"}>NOUN</MenuItem>
                  <MenuItem value={"VERB"}>VERB</MenuItem>
                  <MenuItem value={"ADJECTIVE"}>ADJECTIVE</MenuItem>
                  <MenuItem value={"ADVERB"}>ADVERB</MenuItem>
                  <MenuItem value={"PRONOUN"}>PRONOUN</MenuItem>
                  <MenuItem value={"PREPOSITION"}>PREPOSITION</MenuItem>
                  <MenuItem value={"CONJUNCTION"}>CONJUNCTION</MenuItem>
                  <MenuItem value={"INTERJECTION"}>INTERJECTION</MenuItem>
                  <MenuItem value={"EXCLAMATION"}>EXCLAMATION</MenuItem>
                  <MenuItem value={"" || null}>UNKNOWN</MenuItem>
                </Select>
              </FormControl>
              {checkType && (
                <p style={{ color: "red", fontStyle: "italic" }}>*</p>
              )}
              <div className="m-add-voca-upload">
                <div className="m-add-voca-upload-container">
                  <button
                    className="m-add-voca-upload-image"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    {loadingImage ? "Uploading..." : "Choose image"}
                  </button>

                  <input
                    id="fileInput"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleChangeImage(e.target.files[0])}
                    accept="image/png, image/jpeg"
                  />

                  {/* Display uploaded image if available */}
                  {image && (
                    <img src={image} alt="Uploaded" width={70} height={70} />
                  )}
                </div>
                <div className="m-add-voca-upload-container">
                  {/* Audio upload button */}
                  <button
                    className="m-add-voca-upload-image"
                    onClick={() =>
                      document.getElementById("audioInput").click()
                    }
                  >
                    {loadingAudio ? "Uploading..." : "Choose audio"}
                  </button>

                  <input
                    id="audioInput"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleChangeAudio(e.target.files[0])}
                    accept="audio/mp3"
                  />

                  {/* Display audio player if available */}
                  {audio && (
                    <>
                      <AudioPlayer audioSrc={audio} fontSize={"large"} />
                      <p
                        style={{
                          color: "green",
                          fontStyle: "italic",
                        }}
                      >
                        *Click to play audio
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="m-add-voca-content-footer">
                {wordFind && (
                  <button
                    className="m-add-voca-content-footer-add"
                    onClick={handleSaveWord}
                  >
                    {wordFind.inDatabase ? "Update" : "Save"}
                  </button>
                )}
              </div>
            </div>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnack}
            >
              <Alert
                onClose={handleCloseSnack}
                severity={snackBarType}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {snackBarContent}
              </Alert>
            </Snackbar>
          </div>
          <div className="m-question-container">
            <Typography id="modal-modal-title" variant="h4" component="h1">
              Update Question
            </Typography>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <TextField
                id="demo-helper-text-misaligned"
                label="Question content"
                value={questionContent}
                sx={{ width: "100%" }}
                onChange={(e) => {
                  setQuestionContent(e.target.value);
                }}
              />
              <FormControl style={{ minWidth: 210 }}>
                <InputLabel id="demo-simple-select-label">
                  Question type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={questionType}
                  label="Question type"
                  onChange={(e) => {
                    setQuestionType(e.target.value);
                  }}
                >
                  <MenuItem value={"WORD_MEANING"}>Word - Meaning</MenuItem>
                  <MenuItem value={"MEANING_WORD"}>Meaning - Word</MenuItem>
                  <MenuItem value={"WORD_SPELLING"}>
                    Word - Audio
                  </MenuItem>
                  <MenuItem value={"SPELLING_WORD"}>
                    Audio - Word
                  </MenuItem>
                  <MenuItem value={"FILL_IN_FLANK"}>
                    Fill in the blank
                  </MenuItem>
                  <MenuItem value={"WORD_ORDER"}>Word order</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div
              style={{
                display: "flex",
                gap: "50px",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <div className="m-add-voca-upload-container">
                <button
                  className="m-add-voca-upload-image"
                  onClick={() =>
                    document.getElementById("questionImageInput").click()
                  }
                >
                  {loadingImageQuestion ? "Uploading..." : "Choose image"}
                </button>

                <input
                  id="questionImageInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleChangeImageQ(e.target.files[0])}
                  accept="image/png, image/jpeg"
                />

                {questionImage && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    {" "}
                    <img
                      src={questionImage}
                      alt="Uploaded"
                      width={100}
                      height={100}
                    />
                    <button
                      className="m-q-clear-image"
                      onClick={() => {
                        setQuestionImage("");
                      }}
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="m-add-voca-upload-container">
                <button
                  className="m-add-voca-upload-image"
                  onClick={() =>
                    document.getElementById("questionAudioInput").click()
                  }
                >
                  {loadingAudioQuestion ? "Uploading..." : "Choose audio"}
                </button>

                <input
                  id="questionAudioInput"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleChangeAudioQ(e.target.files[0])}
                  // file am thanh
                  accept="audio/mp3"
                />

                {/* Display uploaded image if available */}
                {questionAudio && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <AudioPlayer audioSrc={questionAudio} fontSize={"large"} />
                    <button
                      className="m-q-clear-image"
                      onClick={() => {
                        setQuestionAudio("");
                      }}
                    >
                      <MdDelete /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            {questionType === "WORD_ORDER" ? (
              <div
                style={{
                  color: "green",
                  fontStyle: "italic",
                }}
              >
                {/* *Loại câu hỏi này chỉ cần nôi dung câu hỏi */}
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundColor: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                  >
                    Answer
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <div className="m-add-answer-corect">
                      <TextField
                        id="demo-helper-text-misaligned"
                        label="Answer content  "
                        value={answerContent}
                        sx={{ width: "100%" }}
                        onChange={(e) => {
                          setAnswerContent(e.target.value);
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "50%",
                          }}
                        >
                          <button
                            className="m-add-answer-button"
                            onClick={() =>
                              document
                                .getElementById("answerImageInput")
                                .click()
                            }
                          >
                            {loadingAnswerImage
                              ? "Uploading..."
                              : "Choose image"}
                          </button>

                          <input
                            id="answerImageInput"
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleChangeImageA(e.target.files[0])
                            }
                            accept="image/png, image/jpeg"
                          />

                          {/* Display uploaded image if available */}
                          {answerImage && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                              }}
                            >
                              {" "}
                              <img
                                src={answerImage}
                                alt="Uploaded"
                                width={70}
                                height={70}
                              />
                              <button
                                className="m-q-clear-image-answer"
                                onClick={() => {
                                  setAnswerImage("");
                                }}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            width: "50%",
                          }}
                        >
                          <button
                            className="m-add-answer-button"
                            onClick={() =>
                              document
                                .getElementById("answerAudioInput")
                                .click()
                            }
                          >
                            {loadingAnswerAudio
                              ? "Uploading..."
                              : "Choose audio"}
                          </button>

                          <input
                            id="answerAudioInput"
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              handleChangeAudioA(e.target.files[0])
                            }
                            accept="audio/mp3"
                          />

                          {/* Display uploaded image if available */}
                          {answerAudio && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                              }}
                            >
                              {" "}
                              <AudioPlayer
                                audioSrc={answerAudio}
                                fontSize={"large"}
                              />
                              <button
                                className="m-q-clear-image-answer"
                                onClick={() => {
                                  setAnswerAudio("");
                                }}
                              >
                                <MdDelete />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {!wrongAnswer1Disiable ? (
                      <div className="m-add-answer-wrong">
                        <TextField
                          id="demo-helper-text-misaligned"
                          label="Answer content"
                          value={wrongAnswer1}
                          sx={{ width: "100%" }}
                          onChange={(e) => {
                            setWrongAnswer1(e.target.value);
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer1ImageInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer1Image
                                ? "Uploading..."
                                : "Choose image"}
                            </button>

                            <input
                              id="wrongAnswer1ImageInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeImageA1(e.target.files[0])
                              }
                              accept="image/png, image/jpeg"
                            />
                            {wrongAnswer1Image && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                {" "}
                                <img
                                  src={wrongAnswer1Image}
                                  alt="Uploaded"
                                  width={70}
                                  height={70}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer1Image("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer1AudioInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer1Audio
                                ? "Uploading..."
                                : "Choose audio"}
                              
                            </button>

                            <input
                              id="wrongAnswer1AudioInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeAudioA1(e.target.files[0])
                              }
                              accept="audio/mp3"
                            />

                            {/* Display uploaded image if available */}
                            {wrongAnswer1Audio && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <AudioPlayer
                                  audioSrc={wrongAnswer1Audio}
                                  fontSize={"large"}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer1Audio("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          className="m-add-answer-button-add-answer-close"
                          onClick={() => {
                            setWrongAnswer1Disiable(true);
                            setWrongAnswer1Image("");
                            setWrongAnswer1Audio("");
                            setWrongAnswer1("");
                          }}
                        >
                          Delete answer
                        </button>
                      </div>
                    ) : (
                      <div className="m-add-answer-none">
                        <button
                          className="m-add-answer-button-add-answer"
                          onClick={() => {
                            setWrongAnswer1Disiable(false);
                            setWrongAnswer1Image("");
                            setWrongAnswer1Audio("");
                            setWrongAnswer1("");
                          }}
                        >
                          <IoMdAdd />
                        </button>
                      </div>
                    )}

                    {!wrongAnswer2Disiable ? (
                      <div className="m-add-answer-wrong">
                        <TextField
                          id="demo-helper-text-misaligned"
                          label="Answer content"
                          value={wrongAnswer2}
                          sx={{ width: "100%" }}
                          onChange={(e) => {
                            setWrongAnswer2(e.target.value);
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer2ImageInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer2Image
                                ? "Uploading..."
                                : "Choose image"}
                            </button>

                            <input
                              id="wrongAnswer2ImageInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeImageA2(e.target.files[0])
                              }
                              accept="image/png, image/jpeg"
                            />

                            {/* Display uploaded image if available */}
                            {wrongAnswer2Image && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <img
                                  src={wrongAnswer2Image}
                                  alt="Uploaded"
                                  width={70}
                                  height={70}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer2Image("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer2AudioInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer2Audio
                                ? "Uploading..."
                                : "Choose audio"}
                              
                            </button>

                            <input
                              id="wrongAnswer2AudioInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeAudioA2(e.target.files[0])
                              }
                              accept="audio/mp3"
                            />

                            {/* Display uploaded image if available */}
                            {wrongAnswer2Audio && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <AudioPlayer
                                  audioSrc={wrongAnswer2Audio}
                                  fontSize={"large"}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer2Audio("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          className="m-add-answer-button-add-answer-close"
                          onClick={() => {
                            setWrongAnswer2Disiable(true);
                            setWrongAnswer2("");
                            setWrongAnswer2Image("");
                            setWrongAnswer2Audio("");
                          }}
                        >
                          Delete answer
                        </button>
                      </div>
                    ) : (
                      <div className="m-add-answer-none">
                        <button
                          className="m-add-answer-button-add-answer"
                          onClick={() => {
                            setWrongAnswer2Disiable(false);
                            setWrongAnswer2Image("");
                            setWrongAnswer2Audio("");
                            setWrongAnswer2("");
                          }}
                        >
                          <IoMdAdd />
                        </button>
                      </div>
                    )}

                    {!wrongAnswer3Disiable ? (
                      <div className="m-add-answer-wrong">
                        <TextField
                          id="demo-helper-text-misaligned"
                          label="Answer content"
                          value={wrongAnswer3}
                          sx={{ width: "100%" }}
                          onChange={(e) => {
                            setWrongAnswer3(e.target.value);
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer3ImageInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer3Image
                                ? "Uploading..."
                                : "Choose image"}
                            </button>

                            <input
                              id="wrongAnswer3ImageInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeImageA3(e.target.files[0])
                              }
                              accept="image/png, image/jpeg"
                            />

                            {/* Display uploaded image if available */}
                            {wrongAnswer3Image && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <img
                                  src={wrongAnswer3Image}
                                  alt="Uploaded"
                                  width={70}
                                  height={70}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer3Image("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                              width: "50%",
                            }}
                          >
                            <button
                              className="m-add-answer-button"
                              onClick={() =>
                                document
                                  .getElementById("wrongAnswer3AudioInput")
                                  .click()
                              }
                            >
                              {loadingWrongAnswer3Audio
                                ? "Uploading..."
                                : "Choose audio"}
                              
                            </button>

                            <input
                              id="wrongAnswer3AudioInput"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleChangeAudioA3(e.target.files[0])
                              }
                              accept="audio/mp3"
                            />

                            {/* Display uploaded image if available */}
                            {wrongAnswer3Audio && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "10px",
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                <AudioPlayer
                                  audioSrc={wrongAnswer3Audio}
                                  fontSize={"large"}
                                />
                                <button
                                  className="m-q-clear-image-answer"
                                  onClick={() => {
                                    setWrongAnswer3Audio("");
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          className="m-add-answer-button-add-answer-close"
                          onClick={() => {
                            setWrongAnswer3Disiable(true);
                            setWrongAnswer3("");
                            setWrongAnswer3Image("");
                            setWrongAnswer3Audio("");
                          }}
                        >
                          Delete answer
                        </button>
                      </div>
                    ) : (
                      <div className="m-add-answer-none">
                        <button
                          className="m-add-answer-button-add-answer"
                          onClick={() => {
                            setWrongAnswer3Disiable(false);
                            setWrongAnswer3Image("");
                            setWrongAnswer3Audio("");
                            setWrongAnswer3("");
                          }}
                        >
                          <IoMdAdd />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="m-add-question-footer">
              <button
                className="m-add-question-button"
                onClick={() => {
                  handleSaveQuestion();
                }}
              >
                Save question
              </button>
            </div>
          </div>
        </div>
        <Snackbar
          open={openSnackbarQuestion}
          autoHideDuration={6000}
          onClose={handleCloseSnackQuestion}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackQuestion}
            severity="error"
            variant="filled"
            sx={{ width: "70%" }}
          >
            {questionErrorContent}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default ModalUpdateQuestion;
