import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Button, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import customFetch from "../../../utils/customFetch";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile } from "../../../redux/slices/userSlice";

import { MdModeEdit } from "react-icons/md";

import axios from "axios";

import "./style.css";
import { setLessons } from "../../../redux/slices/lessonSlice";
import ModalResult from "../learn/learnQuestion/ModalResult";
import ModalUpdateUser from "./tool/ModalUpdateUser";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Profile() {
  const user = useSelector((state) => state.user.profile);
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  const [loginType, setLoginType] = useState(localStorage.getItem("loginType"));

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, message) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };

  const [countCompleted, setCountCompleted] = useState(
    lessons.filter((lesson) => lesson.completed).length || 0
  );

  const [numOfVocab, setNumOfVocab] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());

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
        dispatch(setLessons(response.data));
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
    user && customFetch.get(`/api/v1/study-schedule/find-by-userId?userId=${user?.id}`)
      .then((response) => {
        console.log(response.data);
        if (response.data) {
          handleDateChange(new Date(response.data));
        }
      })
  }, [user]);

  useEffect(() => {
    if (!lessons.length) {
      fetchData();
      setCountCompleted(lessons.filter((lesson) => lesson.completed).length);
    }
    if (user === null) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const today = new Date();
          const todayISO = today.toISOString().split("T")[0];

          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          const yesterdayISO = yesterday.toISOString().split("T")[0];

          // Tìm ngày bắt đầu của tuần hiện tại (tuần bắt đầu từ Thứ Hai)
          const dayOfWeek = today.getDay();
          const startOfWeek = new Date(today);
          startOfWeek.setDate(
            today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
          ); // Nếu là Chủ Nhật (0), lùi về Thứ Hai tuần trước

          // Tìm ngày kết thúc của tuần hiện tại
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Ngày cuối tuần (Chủ Nhật)

          // Chuyển đổi lastLearningDate sang định dạng ngày
          const lastLearningDate = response.data.lastLearningDate.split("T")[0];
          console.log(lastLearningDate !== yesterdayISO);

          if (lastLearningDate !== todayISO) {
            response.data.dailyPoints = 0;
          }

          if (
            !lastLearningDate >= startOfWeek &&
            !lastLearningDate <= endOfWeek
          ) {
            response.data.weeklyPoints = 0;
          }
          if (lastLearningDate !== yesterdayISO) {
            console.log("streak");
            response.data.streak = 0;
          }
          if (lastLearningDate === todayISO && response.data.dailyPoints > 0) {
            response.data.streak = 1;
          }

          dispatch(setUserProfile(response.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user, dispatch]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = () => {
    // kiểm tra dữ liệu trước khi gửi lên server
    if (!selectedDate) {
      alert("Vui lòng chọn thời gian học hàng ngày");
      return;
    }
    // gửi dữ liệu lên server
    customFetch
      .post("/api/v1/study-schedule/create", {
        startTime: selectedDate,
      })
      .then((data) => {
        handleClickVariant('success', 'Cập nhật lịch học thành công');
      })
      .catch((error) => {
        console.error(error);
        handleClickVariant('error', 'Cập nhật lịch học thất bại');
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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = () => {
    const oldPassword = document.getElementById("outlined-old-password").value;
    const newPassword = document.getElementById("outlined-new-password").value;
    console.log(oldPassword, newPassword);
    if (!oldPassword || !newPassword) {
      handleClickVariant('error', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (!validatePassword(newPassword)) {
      handleClickVariant('error', 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
      return;
    }
    customFetch
      .post("/api/v1/user/change-password", {
        oldPassword,
        newPassword
      })
      .then((data) => {
        handleClickVariant('success', 'Đổi mật khẩu thành công');
      })
      .catch((error) => {
        console.error(error);
        handleClickVariant('error', 'Đã xảy ra lỗi, vui lòng thử lại');
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
              <img
                src={user.avatar}
                alt="avatar"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
            </div>
            <div className="profile-avatar-info">
              <div className="profile-avatar-info-name">
                {user.firstName + " " + user.lastName}
              </div>
              <p>{user.email}</p>
              <p>{"Ngày học cuối : " + formatDate(user.lastLearningDate)}</p>
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
              <LocalizationProvider dateAdapter={AdapterDayjs} >
                <MobileTimePicker
                  label={"Lịch Học Hàng Ngày"}
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
                Lưu
              </Button>
            </div>
          </div>

          <div
            style={{
              width: "70%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                fontSize: "25px",
                fontWeight: "bold",
              }}
            >
              Thống kê
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
                    Ngày liên tục{" "}
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
                    Bài học hoàn thành{" "}
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
                    Tổng điểm{" "}
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
                    Từ vựng đã học{" "}
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              display: "flex",
              // justifyContent: "center",
              // alignItems: "center",
              gap: "20px",
              flexDirection: "column"
            }}>
              <span style={{
                fontSize: "25px",
                fontWeight: "bold",
              }}>Mật khẩu cũ</span>
              <OutlinedInput
                id="outlined-old-password"
                type={showOldPassword ? 'text' : 'password'}
                // disabled={loginType && loginType === 'google'}
                sx={{ width: "80%", alignSelf: "center", backgroundColor: "white"}}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showOldPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowOldPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <span style={{
                fontSize: "25px",
                fontWeight: "bold",
              }}>Mật khẩu mới</span>
              <OutlinedInput
                id="outlined-new-password"
                type={showPassword ? 'text' : 'password'}
                // disabled={loginType && loginType === 'google'}
                sx={{ width: "80%", alignSelf: "center", backgroundColor: "white"}}
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
              />
              <Button
                variant="contained"
                color="primary"
                style={{ alignSelf: "center", marginTop: "30px" }}
                onClick={handleChangePassword}
              >lưu thay đổi</Button>
            </div>
          </div>
          <ModalUpdateUser open={openModal} handleClose={handleCloseModal} />
        </div>
      )}
    </div>
  );
}

export default Profile;
