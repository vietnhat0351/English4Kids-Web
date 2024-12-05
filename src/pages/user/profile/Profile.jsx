import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../../redux/slices/userSlice";
import customFetch from "../../../utils/customFetch";

import { MdModeEdit } from "react-icons/md";

import axios from "axios";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { setLessons } from "../../../redux/slices/lessonSlice";
import "./style.css";
import ModalUpdateUser from "./tool/ModalUpdateUser";
import { useNavigate } from "react-router-dom";

function Profile() {
  const user = useSelector((state) => state.user.profile);
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, message) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };

  const countCompleted =
    lessons.filter((lesson) => lesson.completed).length || 0;
  const [numOfVocab, setNumOfVocab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());

  const navigate = useNavigate();

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const fetchData = async () => {
    try {
      const response = await customFetch.get(
        "/api/v1/lessons/get-all-for-user"
      );
      if (response.status === 200) {
        dispatch(setLessons(response.data.sort((a, b) => a.id - b.id)));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const res = async () => {
      const response = await customFetch.get("/api/v1/user/voca-count");
      setNumOfVocab(response.data);
    };
    res();
    user &&
      customFetch
        .get(`/api/v1/study-schedule/find-by-userId?userId=${user?.id}`)
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            handleDateChange(new Date(response.data));
          }
        });
  }, [user]);

  useEffect(() => {
    if (!lessons.length) {
      fetchData();
    }
    if (user === null) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          const today = new Date();
          const todayISO = today.toISOString().split("T")[0];

          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          const yesterdayISO = yesterday.toISOString().split("T")[0];

          const lastSunday = new Date(today);
          lastSunday.setDate(today.getDate() - today.getDay()); // Lấy ngày Chủ Nhật tuần trước

          const { lastLearningDate } = response.data;

          // Chuyển đổi lastLearningDate sang kiểu Date
          const lastLearningDateObj = new Date(lastLearningDate);

          if (lastLearningDateObj.toISOString().split("T")[0] !== todayISO) {
            response.data.dailyPoints = 0;
          }

          // Kiểm tra nếu lastLearningDate là trước tuần hiện tại
          if (lastLearningDateObj < lastSunday) {
            response.data.weeklyPoints = 0;
          }

          // Kiểm tra nếu lastLearningDate là trước ngày hôm qua
          if (lastLearningDateObj < new Date(yesterdayISO)) {
            response.data.streak = 0;
          }

          dispatch(setUserProfile(response.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, dispatch, lessons]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    // kiểm tra dữ liệu trước khi gửi lên server
    if (!selectedDate) {
      alert("Please select a date to update schedule!");
      return;
    }
    // gửi dữ liệu lên server
    customFetch
      .post("/api/v1/study-schedule/create", {
        startTime: selectedDate,
      })
      .then((data) => {
        handleClickVariant("success", "Updated schedule successfully!");
      })
      .catch((error) => {
        console.error(error);
        handleClickVariant("error", "Schedule update failed");
      });
  };

  const [showOldPassword, setShowOldPassword] = useState(false);

  const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(setUserProfile(null));
    navigate("/login");
  }

  const handleChangePassword = () => {
    const oldPassword = document.getElementById("outlined-old-password").value;
    const newPassword = document.getElementById("outlined-new-password").value;
    const confirmPassword = document.getElementById("outlined-confirm-password").value;

    console.log(oldPassword, newPassword);
    if (!oldPassword || !newPassword) {
      handleClickVariant("error", "Please fill in all fields");
      return;
    }
    if (!validatePassword(newPassword)) {
      handleClickVariant(
        "error",
        "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      handleClickVariant("error", "New password and confirm password do not match");
      return;
    }
    customFetch
      .post("/api/v1/user/change-password", {
        oldPassword,
        newPassword,
      })
      .then((data) => {
        handleClickVariant("success", "Password changed successfully!");
        handleLogout();
      })
      .catch((error) => {
        console.error(error);
        handleClickVariant("error", "Password change failed");
      });
  };

  return (
    <div className="profile-container">
      {user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            height: "100%",
            gap: "20px",
          }}
        >
          <div className="profile-avatar">
            <div className="profile-avatar-image">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt="avatar"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
            <div className="profile-avatar-info">
              <div className="profile-avatar-info-name">
                {user.firstName + " " + user.lastName}
              </div>
              <p>{user.email}</p>
              <p>{"Last learning date : " + formatDate(user.lastLearningDate)}</p>
            </div>
            <div className="profile-avatar-edit">
              <button
                className="profile-avatar-edit-button"
                onClick={handleOpenModal}
              >
                <MdModeEdit />
              </button>
            </div>
            <div className="profile-avatar-progress">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileTimePicker
                  label={"Schedule"}
                  openTo="minutes"
                  onAccept={(date) => {
                    console.log(date.toJSON());
                    handleDateChange(date);
                  }}
                  // defaultValue={dayjs("2021-11-22T00:40:00")}
                  value={dayjs(selectedDate)}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
          </div>

          <div
            style={{
              width: "70%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Paper
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "rgba(50, 145, 250, 0.3)",
                borderRadius: "30px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                Statistics
              </div>
              <div className="profile-info-container">
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/fire.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {user.streak + " "}
                      </div>{" "}
                      Day streak{" "}
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/MedalProfile.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {countCompleted + " "}
                      </div>{" "}
                      Lesson completed{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-info-container">
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/thunder.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {user.totalPoints + " "}
                      </div>{" "}
                      Total XP{" "}
                    </div>
                  </div>
                </div>
                <div className="profile-info">
                  <img
                    src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/dictionary.png"
                    width={60}
                    height={60}
                    alt=""
                  />
                  <div>
                    <div>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: "bold",
                        }}
                      >
                        {numOfVocab + " "}
                      </div>{" "}
                      Vocabulary learned{" "}
                    </div>
                  </div>
                </div>
              </div>
            </Paper>

            <Paper
              style={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
                backgroundColor: "rgba(50, 145, 250, 0.3)",
                borderRadius: "30px",
                padding: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                Chage Password
              </span>
              <FormControl
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "white",
                  borderRadius: "5px"
                }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-old-password">Old Password</InputLabel>
                <OutlinedInput
                  id="outlined-old-password"
                  type={showOldPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showOldPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="---------------"
                />
              </FormControl>
              <FormControl
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "white",
                  borderRadius: "5px"
                }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-new-password">New Password</InputLabel>
                <OutlinedInput
                  id="outlined-new-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="--------------"
                />
              </FormControl>
              <FormControl
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  backgroundColor: "white",
                  borderRadius: "5px"
                }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                  id="outlined-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="---------------------"
                />
              </FormControl>
              <Button
                variant="contained"
                color="success"
                style={{ alignSelf: "center" }}
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            </Paper>
          </div>
          <ModalUpdateUser open={openModal} handleClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}

export default Profile;
