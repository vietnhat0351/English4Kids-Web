import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import LOGO from "../../assets/WebLogo.png";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../../redux/slices/userSlice";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [seletedContent, setSelectedContent] = useState("");
  const currentUser = useSelector((state) => state.user.profile);

  const currentUrl = window.location.href;
  const lastUrl = currentUrl.split("/").pop();

  useEffect(() => {
    setSelectedContent(lastUrl);
    if (currentUser === null) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          dispatch(setUserProfile(response.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // lấy ra url hiện tại
  }, [lastUrl]);

  return (
    <div className="ad-container">
      <div className="ad-left">
        <div className="ad-avatar">
          <Avatar
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar.jpg"
            sx={{ width: 64, height: 64 }}
          ></Avatar>
          <div>
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
        </div>
        <div className="ad-menu">
          <NavLink
            className={`ad-menu-item ${
              seletedContent.startsWith("lesson") 
                ? "ad-menu-item-selected"
                : "ad-menu-item-none"
            }`}
            to={"/admin/lesson"}
          >
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/lesson.png"
              width={40}
              height={40}
              alt="lesson"
            />
            Quản lý bài học
          </NavLink>

          <NavLink
            className={`ad-menu-item ${
              seletedContent === "vocabulary"
                ? "ad-menu-item-selected"
                : "ad-menu-item-none"
            }`}
            to={"/admin/vocabulary"}
          >
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/dictionary.png"
              width={40}
              height={40}
              alt="lesson"
            />
            Quản lý từ vựng
          </NavLink>
          <NavLink
            className={`ad-menu-item ${
              seletedContent === "test"
                ? "ad-menu-item-selected"
                : "ad-menu-item-none"
            }`}
            to={"/admin/test"}
          >
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/test.png"
              width={40}
              height={40}
              alt="lesson"
            />
            Quản lý bài kiểm tra
          </NavLink>
          <NavLink
            className={`ad-menu-item ${
              seletedContent === "user"
                ? "ad-menu-item-selected"
                : "ad-menu-item-none"
            }`}
            to={"/admin/user"}
          >
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/team-management.png"
              width={40}
              height={40}
              alt="lesson"
            />
            Quản lý người dùng
          </NavLink>
          <NavLink
            className={`ad-menu-item ${
              seletedContent === "data"
                ? "ad-menu-item-selected"
                : "ad-menu-item-none"
            }`}
            to={"/admin/data"}
          >
            <img
              src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/exploration.png"
              width={40}
              height={40}
              alt="lesson"
            />
            Phân tích dữ liệu
          </NavLink>
        </div>
      </div>
      <div className="ad-right">
        <div className="ad-header">
          {" "}
          <div
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              textAlign: "center",
              padding: "0",
              margin: "0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            onClick={() => {
              navigate("/admin");
            }}
          >
            <img
              src={LOGO}
              style={{
                maxHeight: "50px",
              }}
              alt=""
            />
          </div>
          <div className="ad-header-right">
            <button className="ad-header-button-avt">
              <img
                src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/notification-bell.png"
                style={{ maxWidth: "30px", maxHeight: "30px" }}
                alt=""
              />
            </button>
            <button className="ad-header-botton-noti">
              <Avatar
                src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar.jpg"
                sx={{ width: 40, height: 40 }}
              ></Avatar>
            </button>
          </div>
        </div>
        <div className="ad-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
