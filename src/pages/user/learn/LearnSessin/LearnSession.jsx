import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../../utils/customFetch";
import { setLessonSelected } from "../../../../redux/slices/clessonSlice";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";

import "./style.css";
import { Box, Modal, Typography } from "@mui/material";

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const LearnSession = () => {
  const selectedLesson = useSelector((state) => state.lessonSelected);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();
  const lastUrl = location.pathname.split("/").pop();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log("lastUrl", lastUrl);
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await customFetch.get(
          `/api/v1/lessons/get-lesson/${lastUrl}`
        );
        console.log("response", response.data);
        dispatch(setLessonSelected(response.data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, dispatch]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="lesson-page-container">
      <div className="button-back" onClick={() => navigate("/learn")}>
        <IoChevronBack size={24} /> Lessons
      </div>
      <div
        className={
          selectedLesson.done ? "slesson-info-complete" : "slesson-info"
        }
      >
        <img
          className="slesson-image"
          src={selectedLesson.image}
          alt={selectedLesson.title}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <h2 className="slesson-title">{selectedLesson.title}</h2>
          <h5 className="slesson-description">{selectedLesson.description}</h5>
          {selectedLesson.done && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between", // Căn đều hai đầu nếu cần
                // alignItems: "center",
                height: "100px",
                borderRadius: "10px",
                color: "black",
                fontSize: "15px",
                fontWeight: "bold",
                width: "100%",
                padding: "0 10px", // Thêm khoảng c
                whiteSpace: "nowrap",
                gap: "50px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  // borderTop: "3px solid #30883e",
                  // borderLeft: "3px solid #30883e",
                  // borderRight: "0.5px solid #30883e",
                  // borderBottom: "0.5px solid #30883e",
                  padding: "5px",
                  backgroundColor: "",
                  borderRadius: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  Highest score:{" "}
                  <p
                    style={{
                      color: "#30883e",
                      fontSize: "15px",
                    }}
                  >
                    {Math.round(selectedLesson.score)}
                  </p>
                </div>
                {/* <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                Fastest time:{" "}
                <p
                  style={{
                    color: "#30883e",
                    fontSize: "15px",
                  }}
                >
                  {formatTime(selectedLesson.time)}
                </p>
              </div> */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  Last quiz:{" "}
                  <p
                    style={{
                      color: "#30883e",
                      fontSize: "15px",
                    }}
                  >
                    {formatDate(selectedLesson.date)}
                  </p>
                </div>
              </div>
              <IoMdCheckmarkCircleOutline
                size={{
                  width: "10px",
                  height: "10px",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Phần dưới - 3 nút (từ vựng, câu hỏi, luyện tập) */}
      <div className="sbutton-container">
        <button
          className={
            selectedLesson.done ? "saction-button-complete" : "saction-button"
          }
          onClick={() => {
            if(selectedLesson.questions.length < 10) {
              handleOpen();
            }else{
              navigate("/learn/vocabulary/" + selectedLesson.id);
            }
          }}
        >
          Learn Vocabulary
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/teacher.png"
            alt=""
            style={{
              width: "300px",
              height: "300px",
            }}
          />
        </button>
        <button
          className={
            selectedLesson.done ? "saction-button-complete" : "saction-button"
          }
          onClick={() => {
            if(selectedLesson.questions.length <10 ) {
              handleOpen();
            } else{
              navigate("/learn/question/" + selectedLesson.id);
            }
            
          }}
        >
          Practice Exercises
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/weights.png"
            alt=""
            style={{
              width: "300px",
              height: "300px",
            }}
          />
        </button>
        <button
          className={
            selectedLesson.done ? "saction-button-complete" : "saction-button"
          }
          onClick={() => {
            if (selectedLesson.questions.length < 10) {
              handleOpen();
            } else {
              navigate("/learn/question-test/" + selectedLesson.id);
            }
          }}
        >
          Do a Quiz
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/grade.png"
            alt=""
            style={{
              width: "300px",
              height: "300px",
            }}
          />
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Comming soon
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This lesson is not ready yet. Please come back later.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default LearnSession;
