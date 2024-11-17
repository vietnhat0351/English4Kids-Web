import {
  Alert,
  Box,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../../utils/customFetch";
import { setLessons } from "../../../../redux/slices/lessonSlice";
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
const ModalAddLesson = ({ open, handleClose }) => {
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");
  const [loadingImage, setLoadingImage] = React.useState(false);

  const handleFileChange = async (selectedFile, type) => {
    let setLoading, setData;
    if (type === "image") {
      setLoading = setLoadingImage;
      setData = setImage;
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

  const handleChangeImage = (selectedFile) => {
    handleFileChange(selectedFile, "image");
  };

  const handleSaveLesson = async () => {
    if (!title || !description || !image) {
      handleClickSnack();
      return;
    } else {
        try{
            const response = await customFetch.post("/api/v1/lessons/create", {
                title,
                description,
                image,
            });
            if (response.status === 200) {
                console.log("Lesson created successfully!", response.data);
                // Reset all input fields
                setTitle("");
                setDescription("");
                setImage("");
                handleClose();

                await customFetch.get("/api/v1/lessons/get-all").then((response) => {
                    dispatch(setLessons(response.data));
                });

            }
        }
        catch (error) {
            console.error("There was an error creating the lesson!", error);
        }
    }
  };

  const [openSnackbar, setOpenSnackbar] = useState(false);

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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Thêm bài học
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            paddingTop: "30px",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Tiêu đề"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Mô tả"
            id="fullWidth"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="m-add-voca-upload-container">
            <button
              style={{
                width: "200px",
                padding: "10px",
                backgroundColor: "lightskyblue",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => document.getElementById("fileInput").click()}
            >
              {loadingImage ? "Đang tải..." : "Tải hình ảnh lên"}
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
              <img src={image} alt="Uploaded" width={140} height={140} />
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
                borderTop: "1px solid #e0e0e0",
                paddingTop: "20px",
                gap: "10px",
              }}
            >
              <button
                style={{
                  padding: "10px",
                  backgroundColor: "#30883e",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  color: "white",
                }}
                onClick={() => {
                  handleSaveLesson();
                }}
              >
                Lưu
              </button>
              <button
                style={{
                  padding: "10px",
                  backgroundColor: "lightcoral",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  color: "white",
                }}
                onClick={() => {
                  // Reset all input fields
                  setTitle("");
                  setDescription("");
                  setImage("");
                  handleClose();
                }}
              >
                Thoát
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
              Cần điền đầy đủ thông tin!.
            </Alert>
          </Snackbar>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalAddLesson;
