import { Avatar, Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../../utils/customFetch";
import { setUserProfile } from "../../../../redux/slices/userSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

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
  const [dob, setDob] = useState(user.dob || "");
  const [gender, setGender] = useState(user.gender || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const listAvatar = [
    "https://assets.quizlet.com/static/i/animals/108.3b3090077134db3.jpg",
    "https://assets.quizlet.com/static/i/animals/109.5b75ca8158c771c.jpg",
    "https://assets.quizlet.com/static/i/animals/110.36d90f6882d4593.jpg",
    "https://assets.quizlet.com/static/i/animals/111.f9dd73353feb908.jpg",
    "https://assets.quizlet.com/static/i/animals/112.c90135dfc341a90.jpg",
    "https://assets.quizlet.com/static/i/animals/113.e4b7e1c4ed27afa.jpg",
    "https://assets.quizlet.com/static/i/animals/114.0adc064c9a6d1eb.jpg",
    "https://assets.quizlet.com/static/i/animals/115.70946d9217589e8.jpg",
    "https://assets.quizlet.com/static/i/animals/116.9aaedd4f4495837.jpg",
    "https://assets.quizlet.com/static/i/animals/117.3cd40b021ac604f.jpg",
    "https://assets.quizlet.com/static/i/animals/118.17bed2945aa1600.jpg",
    "https://assets.quizlet.com/static/i/animals/119.ed0b39ac3915639.jpg",
    "https://assets.quizlet.com/static/i/animals/120.bd14e2049ea1628.jpg",
    "https://assets.quizlet.com/static/i/animals/121.86d7c15a5a6be0f.jpg",
    "https://assets.quizlet.com/static/i/animals/122.c263b6b48ca2b1a.jpg",
    "https://assets.quizlet.com/static/i/animals/123.e5f0bd4b49e7c12.jpg",
    "https://assets.quizlet.com/static/i/animals/124.e99fa024b6881c1.jpg",
    "https://assets.quizlet.com/static/i/animals/125.a46eeeaa1617163.jpg",
    "https://assets.quizlet.com/static/i/animals/126.70ed6cbb19b8447.jpg",
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
      dob,
      gender
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

  const handleChange = (event) => {
    setGender(event.target.value);
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
            <h1>Update Information</h1>
          </div>

          <div className="modal-update-user-avatar">
            {/* <img src={avatar} alt="avatar" width={200} height={200} /> */}
            <Avatar
              alt="avatar"
              src={avatar}
              sx={{ width: 200, height: 200 }}
            />
            <div className="modal-update-user-avatar-list">
              <h3>Avatar</h3>
              <div className="modal-update-user-avatar-list-list">
                {listAvatar.map((item, index) => (
                  <Avatar
                    key={index}
                    alt="avatar"
                    src={item}
                    onClick={() => setAvatar(item)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-update-user-content">
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}>
              <TextField
                id="outlined-basic"
                label="First Name"
                variant="outlined"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Last Name"
                fullWidth
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker label="Date of Birth"
                  format="DD/MM/YYYY"
                  sx={{
                    width: "100%",
                  }} 
                  value={dob && dayjs(dob)}
                  onChange={(newValue) => {
                    setDob(newValue);
                  }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={gender}
                  label="Gender"
                  onChange={handleChange}
                >
                  <MenuItem value={"male"}>
                    Male
                  </MenuItem>
                  <MenuItem value={"female"}>
                    Female
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="modal-update-user-footer">
            <button
              className="modal-update-user-footer-btn-save"
              onClick={handleUpdateUser}
            >
              Save
            </button>
            <button
              className="modal-update-user-footer-btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalUpdateUser;
