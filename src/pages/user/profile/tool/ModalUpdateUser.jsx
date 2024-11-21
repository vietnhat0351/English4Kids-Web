import { Box, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../../utils/customFetch";
import { setUserProfile } from "../../../../redux/slices/userSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
const ModalUpdateUser = ({ open, handleClose }) => {
  const user = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const listAvatar = [
    "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar1.png",
    "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar2.png",
    "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar3.png",
  ];
  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setAvatar(user.avatar || "");
  }, [open, user]);

  const handleUpdateUser = async () => {
    let data = {
      ...user,
      firstName,
      lastName,
      avatar,
    };
    try {
      const res = await customFetch.post("/api/v1/user/update-user-info", data);
      if (res.status === 200) {
        dispatch(setUserProfile(data));
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
    console.log(data);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu mờ tối phía ngoài
          backdropFilter: "blur(5px)", // Hiệu ứng mờ phía ngoài
        },
      }}
    >
      <Box sx={style}>
        <div className="modal-update-user-container">
          <div className="modal-update-user-title">
            <h1>Cập nhật thông tin</h1>
          </div>
          <div className="modal-update-user-content">
            <TextField
              id="outlined-basic"
              label="Họ"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Tên"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="modal-update-user-avatar">
            <img src={avatar} alt="avatar" width={200} height={200} />
            <div className="modal-update-user-avatar-list">
              <h3>Chọn hình đại </h3>
              <div className="modal-update-user-avatar-list-list">
                {listAvatar.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    alt="avatar"
                    width={100}
                    height={100}
                    onClick={() => setAvatar(item)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-update-user-footer">
            <button
              className="modal-update-user-footer-btn-save"
              onClick={handleUpdateUser}
            >
              Lưu
            </button>
            <button
              className="modal-update-user-footer-btn-cancel"
              onClick={handleClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalUpdateUser;
