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
import "./styles.css";

import customFetch from "../../../../utils/customFetch";
import AudioPlayer from "../../../../utils/AudioPlayer";
import { setVocabularies } from "../../../../redux/slices/vocabularySlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ModalAddVocabulary = ({ open, handleClose }) => {
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

  const [wordFind, setWordFind] = useState({});
  const [checkWordFind, setCheckWordFind] = useState("");

  const [result, setResult] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  // UseEffect to reset the form when the modal is closed
  React.useEffect(() => {
    if (!open) {
      setWord("");
      setMeaning("");
      setPronunciation("");
      setType("");
      setImage("");
      setAudio("");
      setCheckWord(false);
      setCheckMeaning(false);
      setCheckPronunciation(false);
      setCheckType(false);
      setCheckImage(false);
      setCheckAudio(false);
      setCheckWordFind("");
      setWordFind({});
    }
  }, [open]);

  const handleClickSnack = () => {
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
  };

  const handleSaveWord = async () => {
    console.log("Word", wordFind);
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
      handleClickSnack();
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
      try {
        await customFetch
          .post(`/api/v1/vocabulary/update-vocabulary`, dataSave)
          .then((response) => {
            console.log("Word saved successfully!", response.data);
          });

        await customFetch
          .get(`/api/v1/vocabulary/vocabularies`)
          .then((response) => {
            dispatch(setVocabularies(response.data));
          });
        handleClose(true, "Word saved successfully!", "success");
      } catch (error) {
        console.error("Error when saving word", error);
      }
    } else {
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
        handleClose(true, "Word saved successfully!", "success");
      } catch (error) {
        console.error("Error when saving word", error);
      }
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="m-add-voca-container">
          <Typography id="modal-modal-title" variant="h4" component="h1">
            Add Vocabulary
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
                console.log("Meaning", meaning);
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
                  {loadingImage ? "Uploading..." : "Upload image"}
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
                  onClick={() => document.getElementById("audioInput").click()}
                >
                  {loadingAudio ? "Uploading..." : "Upload audio"}
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
                      *Click on the audio player to play the audio.
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="m-add-voca-content-footer">
              <button
                className="m-add-voca-content-footer-add"
                onClick={handleSaveWord}
              >
                Save
              </button>
              <button
                className="m-add-voca-content-footer-cancel"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </div>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnack}
          >
            <Alert
              onClose={handleCloseSnack}
              severity="error"
              variant="filled"
              sx={{ width: "70%" }}
            >
              Cần điền đầy đủ thông tin từ vựng!.
            </Alert>
          </Snackbar>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalAddVocabulary;
