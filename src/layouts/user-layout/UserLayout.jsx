import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./user-styles.css";
import imgLearn from "../../assets/graduate.png";
import imgLearnGif from "../../assets/graduate.gif";
import imgWord from "../../assets/book.png";
import imgWordGif from "../../assets/book.gif";
import imgFlashCard from "../../assets/books.png";
import imgFlashCardGif from "../../assets/books.gif";
import imgFire from "../../assets/fire.gif";
import imgSuccess from "../../assets/success.gif";

import LOGO from "../../assets/WebLogo.png";
import Learn from "../../pages/user/learn/Learn";
import Flashcard from "../../pages/user/flashcard/Flashcard";
import Vocabulary from "../../pages/user/vocabulary/Vocabulary";
import Grammar from "../../pages/user/grammar/Grammar";
import Ranking from "../../pages/user/ranking/Ranking";
import Profile from "../../pages/user/profile/Profile";
import Practice from "../../pages/practice/Practice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../../redux/slices/userSlice";

const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.profile);
  const [seletedContent, setSelectedContent] = useState("");

  const currentUrl = window.location.href;
  const lastUrl = currentUrl.split("/").pop();

  useEffect(() => {
    setSelectedContent(lastUrl);
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
  }, [lastUrl, user, dispatch]);
  
  const [centerContent, setCenterContent] = useState(<Learn />);
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonClick = (contentComponent, buttonIndex) => {
    setCenterContent(contentComponent); // Cập nhật component khi nhấn nút
    setSelectedButton(buttonIndex); // Cập nhật nút được chọn
    if (buttonIndex === 1) navigate("/learn");
    if (buttonIndex === 2) navigate("/vocabulary");
    if (buttonIndex === 3) navigate("/flashcard");
    if (buttonIndex === 4) navigate("/grammar");
    if (buttonIndex === 5) navigate("/profile");
    if (buttonIndex === 6) navigate("/practice");
    if (buttonIndex === 7) navigate("/ranking");
  };
  return (
    <div className="container">
      <div className="leftContainer">
        
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
          onClick={() => handleButtonClick(<Learn />, 1)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 1 ? imgWord : imgWordGif}
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>BÀI HỌC</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 3 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Flashcard />, 3)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 3 ? imgFlashCard : imgFlashCardGif}
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>THẺ GHI NHỚ</strong>
          </div>
        </button>

        <button
          className={`button ${
            selectedButton === 6 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Practice />, 6)}
        >
          <div className="button-content">
            <img
              src={
                selectedButton === 6
                  ? "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/dumbbell.png"
                  : "https://english-for-kids.s3.ap-southeast-1.amazonaws.com/dumbbell.gif"
              }
              alt="My GIF"
              style={{ width: "40px", height: "40px" }} // Thay đổi kích thước tại đây
              onDragStart={(e) => e.preventDefault()}
            />
            <strong>TRÒ CHƠI</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 7 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Profile />, 7)}
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
            <strong>BẢNG XẾP HẠNG</strong>
          </div>
        </button>
        <button
          className={`button ${
            selectedButton === 5 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Profile />, 5)}
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
            <strong>HỒ SƠ</strong>
          </div>
        </button>
      </div>
      <div className="centerContainer">
        <Outlet />
      </div>
      <div className="rightContainer">
       
        <div className="right-header">
        
          <img
            src={imgFire}
            alt="My GIF"
            style={{ width: "100px", height: "100px" }}
            onDragStart={(e) => e.preventDefault()}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: "20px",
              gap: "10px",
              padding: "10px",
            }}
          >
           <h4>{user && user.streak}</h4>
          </div>
        </div>

        
        <div className="right-content">
          {/* <img
            src={imgSuccess}
            alt="My GIF"
            style={{ width: "80px", height: "80px" }} // Thay đổi kích thước tại đây
            onDragStart={(e) => e.preventDefault()}
          /> */}
          <div>
            <strong>Điểm kiếm được</strong>
            <div>
              <p>Điểm hôm nay: {user && user.dailyPoints}</p>
              <p>Điểm tuần này: {user && user.weeklyPoints}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
