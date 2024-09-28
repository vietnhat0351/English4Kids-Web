import React, { useState } from "react";
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
import Learn from "../../pages/user/learn/Learn";
import Flashcard from "../../pages/user/flashcard/Flashcard";
import Vocabulary from "../../pages/user/vocabulary/Vocabulary";

const UserLayout = () => {
  const navigate = useNavigate();
  const [centerContent, setCenterContent] = useState(<Learn />); 
  const [selectedButton, setSelectedButton] = useState(1);

  const handleButtonClick = (contentComponent, buttonIndex) => {
    setCenterContent(contentComponent); // Cập nhật component khi nhấn nút
    setSelectedButton(buttonIndex); // Cập nhật nút được chọn
    if (buttonIndex === 1) navigate("/learn");
    if (buttonIndex === 2) navigate("/vocabulary");
    if (buttonIndex === 3) navigate("/flashcard");
  };
  return (
    <div className="container">
      <div className="leftContainer">
        <button style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          textAlign: "center",
          padding: "0",
          margin: "0",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }} onClick={()=>{navigate("/")}}><h2 className="title-left">English4Kids</h2></button>
        <button
          className={`button ${
            selectedButton === 1 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Learn/>, 1)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 1 ? imgLearn : imgLearnGif}
              alt="My GIF"
              style={{ width: "50px", height: "50px" }} // Thay đổi kích thước tại đây
            />
            <strong>Học</strong>
          </div>
        </button>

        <button
          className={`button ${
            selectedButton === 2 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Vocabulary />, 2)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 2 ? imgWord : imgWordGif}
              alt="My GIF"
              style={{ width: "50px", height: "50px" }} // Thay đổi kích thước tại đây
            />
            <strong>Từ vựng</strong>
          </div>
        </button>

        <button
          className={`button ${
            selectedButton === 3 ? "selected-button" : "bbton"
          }`}
          onClick={() => handleButtonClick(<Flashcard/>, 3)}
        >
          <div className="button-content">
            <img
              src={selectedButton === 3 ? imgFlashCard : imgFlashCardGif}
              alt="My GIF"
              style={{ width: "50px", height: "50px" }} // Thay đổi kích thước tại đây
            />
            <strong>Flashcard</strong>
          </div>
        </button>
      </div>
      <div className="centerContainer" >
       
        <Outlet />
      </div>
      <div className="rightContainer">
        
        <div className="right-header">
          <img
            src={imgFire}
            alt="My GIF"
            style={{ width: "100px", height: "100px" }} // Thay đổi kích thước tại đây
          />
          <strong>Bạn đã học 0 ngày liên tục</strong>
        </div>
        <div className="right-content">
          <img
            src={imgSuccess}
            alt="My GIF"
            style={{ width: "80px", height: "80px" }} // Thay đổi kích thước tại đây
          />
          <div>
          <strong>Bạn đang ở hạng ...</strong>
          <div>
            <p>Hãy tiếp tục phấn đấu !</p>
            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
