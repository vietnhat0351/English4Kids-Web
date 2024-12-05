import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import imgWordGif from "../../assets/book.gif";
import imgWord from "../../assets/book.png";
import imgFlashCardGif from "../../assets/books.gif";
import imgFlashCard from "../../assets/books.png";
import imgFire from "../../assets/fire.gif";
import "./user-styles.css";

import { Button } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import LOGO from "../../assets/WebLogo.png";
import { setUserProfile } from "../../redux/slices/userSlice";

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.profile);
  const [selectedButton, setSelectedButton] = useState(1);
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  useEffect(() => {
    if (currentUrl.includes("/learn")) {
      setSelectedButton(1);
    } else if (currentUrl.includes("/flashcard")) {
      setSelectedButton(3);
    } else if (currentUrl.includes("/profile")) {
      setSelectedButton(5);
    } else if (currentUrl.includes("/practice")) {
      setSelectedButton(6);
    } else if (currentUrl.includes("/ranking")) {
      setSelectedButton(7);
    }

  }, [currentUrl]);

  useEffect(() => {
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

          const lastSunday = new Date(today);
          lastSunday.setDate(today.getDate() - today.getDay()); // Lấy ngày Chủ Nhật tuần trước

          const { lastLearningDate, weeklyPoints, streak } = response.data;

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
  }, [user, dispatch]);

  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex); // Cập nhật nút được chọn
    if (buttonIndex === 1) navigate("/learn");
    if (buttonIndex === 2) navigate("/vocabulary");
    if (buttonIndex === 3) navigate("/flashcard");
    if (buttonIndex === 4) navigate("/grammar");
    if (buttonIndex === 5) navigate("/profile");
    if (buttonIndex === 6) navigate("/practice");
    if (buttonIndex === 7) navigate("/ranking");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(setUserProfile(null));
    navigate("/login");
  }

  return (
    <div className="container">
      <div className="leftContainer" style={{
        overflowX: "hidden",
      }}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            outline: "none",
            textAlign: "center",
            padding: "10px",
            paddingBottom: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <img
            src={LOGO}
            alt=""
            // width={122.5}
            style={{
              maxHeight: "70px",
            }}
            onDragStart={(e) => e.preventDefault()}
          />
        </button>
        <button
          className={`button ${
            selectedButton === 1 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(1)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 1 ? imgWord : imgWordGif}
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>LESSON</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 3 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(3)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 3 ? imgFlashCard : imgFlashCardGif}
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>FLASHCARD</strong>
          </div>
        </button>

        <button
          className={`button ${
            selectedButton === 6 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(6)}
        >
          <div className="button-content">
            <img
              src={
                selectedButton === 6
                  ? "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/cubes.png"
                  : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/cubes.gif"
              }
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>GAMES</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 7 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(7)}
        >
          <div className="button-content">
            <img
              src={
                selectedButton === 7
                  ? "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/ranking.png"
                  : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/ranking.gif"
              }
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>LEADERBOARDS</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 5 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(5)}
        >
          <div className="button-content">
            <img
              src={
                selectedButton === 5
                  ? "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/user.png"
                  : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/user.gif"
              }
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>PROFILE</strong>
          </div>
        </button>
        <Button
          style={{
            position: "absolute",
            bottom: "10px",
            textAlign: "center",
            padding: "10px",
            left: "20%",
            gap: "10px",
          }}
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
            <img
              src={
                selectedButton === 7
                  ? "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/logout.png"
                  : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/logout.png"
              }
              alt="My GIF"
              style={{ width: "40px", height: "40px" }}
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>Logout</strong>
        </Button>
      </div>
      <div className="centerContainer">
        <Outlet />
      </div>
      <div className="rightContainer">
        <div className="top-header">
          {user && (
            <>
              <img
                src={user.avatar}
                alt=""
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />

              <strong>
                {user.firstName} {user.lastName}
              </strong>
            </>
          )}
        </div>
        <div className="right-header">
          <img
            src={
              user && user.streak > 0
                ? imgFire
                : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/fire.png"
            }
            alt="My GIF"
            style={{ width: "50px", height: "50px" }}
            onDragStart={(e) => e.preventDefault()}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "50px",
              gap: "10px",
              padding: "10px",
              fontWeight: "bold",
            }}
          >
            {user && user.streak}
          </div>
        </div>

        <div className="points-container">
          <strong className="points-title">XP earned</strong>
          <div className="points-content">
            <p className="points-item">
              <span className="points-label">Today:</span>
              <span className="points-value">
                {user && user.dailyPoints} XP
              </span>
            </p>
            <p className="points-item">
              <span className="points-label">Week:</span>
              <span className="points-value">
                {user && user.weeklyPoints} XP
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
