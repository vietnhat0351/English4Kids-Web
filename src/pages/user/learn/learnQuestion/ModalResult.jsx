import React from "react";
import { Box, IconButton, Modal, Tooltip } from "@mui/material";
import "./styles.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ModalResult = ({ open, handleClose, countCorrect, totalQuestions }) => {
  const handleCloseModal = (event) => {
    // Ngừng việc đóng modal khi người dùng click vào background (click ngoài modal)
    event.stopPropagation();
  };

  return (
    <Modal
      open={open}
      onClose={(e) => e.stopPropagation()} // Ngừng việc đóng modal khi click vào backdrop
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu mờ tối phía ngoài
          backdropFilter: "blur(5px)", // Hiệu ứng mờ phía ngoài
        },
      }}
    >
      <Box sx={style} onClick={handleCloseModal}>
        <div className="l-bar-finish">
          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/cat.png"
            alt=""
            width={400}
            height={400}
          />
          <div className="l-bar-finish-body">
            <div className="l-bar-finish-body-1">
              Tổng điểm KN:
              <div className="l-bar-finish-body-3">
                {countCorrect * 10} điểm
              </div>
            </div>
            <div className="l-bar-finish-body-2">
              Quyết tâm!
              <div className="l-bar-finish-body-3">
                {countCorrect}/{totalQuestions} câu đúng
              </div>
            </div>
          </div>

          <button onClick={handleClose} className="l-bar-button-close">
            {" "}
            {/* Chỉ đóng modal khi click vào nút "Close" */}
            Tiếp tục
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalResult;
