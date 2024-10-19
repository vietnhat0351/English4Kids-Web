import React, { useEffect, useState } from "react";
import "./styles.css";
import customFetch from "../../../../src/utils/customFetch";
import { useNavigate } from "react-router-dom";
import { Box, Modal, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setLessons } from "../../../redux/slices/lessonSlice";

const LessonManagement = () => {
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newLesson, setNewLesson] = useState("");

  const getMaxUnitNumber = (lessons) => {
    const regex = /UNIT\s*(\d+)/g; // Regex để tìm "UNIT" và số sau nó
    let maxNumber = 0; // Khởi tạo biến lưu số lớn nhất

    lessons.forEach((lesson) => {
      const matches = [...lesson.title.matchAll(regex)]; // Tìm tất cả các khớp
      if (matches.length > 0) {
        matches.forEach((match) => {
          const number = parseInt(match[1], 10); // Chuyển đổi sang số nguyên
          if (number > maxNumber) {
            maxNumber = number; // Cập nhật số lớn nhất
          }
        });
      }
    });

    return maxNumber; // Trả về số lớn nhất tìm được
  };

  useEffect(() => {
    const fetchLesson = async () => {
      const data = await customFetch
        .get("/api/v1/lessons/all-lessons")
        .then((res) => {
          return res.data;
        });
      dispatch(setLessons(data));
    };
    fetchLesson();
  }, [navigate]);

  const handleAddLesson = async () => {
    const maxUnitNumber = getMaxUnitNumber(lessons) + 1;
    const title = `UNIT ${maxUnitNumber} - ${newLesson}`;
    console.log(title);
    try {
      await customFetch
        .post("/api/v1/lessons/create-lesson", {
          title: title,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(setLessons([...lessons, res.data]));
            setNewLesson("");
            handleClose();
          }
        });
    } catch (e) {
      console.log("Lỗi ", e);
    }
  };

  return (
    <div className="a-l-container">
      <div className="ad-p-title">Quản lý bài học</div>
      <div className="a-t-add-topic">
        <button className="a-t-add-button" onClick={handleOpen}>
          Thêm bài học mới
        </button>
      </div>
      <div className="a-l-lesson-grid">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="a-l-lesson-list" >
            <div className="a-l-lesson-title">{lesson.title}</div>
            <div className="a-l-lesson-action">
              <div>
                
              </div>
              <button
                onClick={() => {
                  navigate(`/admin/lesson/${lesson.id}`,{state: {lesson: lesson}});
                }}
              >
                Quản lý câu hỏi
              </button>
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
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Thêm bài học mới
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} component="div">
            <TextField
              id="standard-basic"
              label="Tên bài học"
              variant="standard"
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
            />
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignContent: "center",
              gap: "10px",
            }}
            component="div"
          >
            <button
              onClick={async () => {
                await handleAddLesson();
              }}
            >
              Thêm
            </button>
            <button
              onClick={async () => {
                setNewLesson("");
                handleClose();
              }}
            >
              Hủy
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default LessonManagement;
