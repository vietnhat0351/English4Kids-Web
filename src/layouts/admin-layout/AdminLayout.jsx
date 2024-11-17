import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import LOGO from "../../assets/WebLogo.png";
import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserProfile } from "../../redux/slices/userSlice";

import { useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();  // Hook to track the current route
  const [selectedContent, setSelectedContent] = useState("");
  const currentUser = useSelector((state) => state.user.profile);

  useEffect(() => {
    const lastUrl = location.pathname.split("/").pop();
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
  }, [location.pathname, currentUser, dispatch]); // Dependency on the current route

  return (
    <div className="ad-container">
      <div className="ad-header">
        <div className="ad-logo">
          <img src={LOGO} alt="Logo" width={50} height={50} />
        </div>

        <div className="ad-menu">
          <NavLink
            className={`ad-menu-item ${selectedContent === "lesson" ? "ad-menu-item-selected" : "ad-menu-item-none"}`}
            to="/admin/lesson"
          >
            <img src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/book.png" width={30} height={30} alt="lesson" />
            Bài học
          </NavLink>

          <NavLink
            className={`ad-menu-item ${selectedContent === "vocabulary" ? "ad-menu-item-selected" : "ad-menu-item-none"}`}
            to="/admin/vocabulary"
          >
            <img src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/book+(1).png" width={30} height={30} alt="vocabulary" />
            Từ vựng
          </NavLink>
          
          <NavLink
            className={`ad-menu-item ${selectedContent === "user" ? "ad-menu-item-selected" : "ad-menu-item-none"}`}
            to="/admin/user"
          >
            <img src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/management.png" width={30} height={30} alt="user" />
            Người dùng
          </NavLink>
        </div>

        <div className="ad-header-right">
          <button className="ad-header-button-avt">
            <Avatar src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/avatar.jpg" sx={{ width: 50, height: 50 }} />
            {currentUser?.firstName} {currentUser?.lastName}
          </button>
        </div>
      </div>

      <div className="ad-content">
        <div className="ad-content-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

