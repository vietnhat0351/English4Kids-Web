import React from "react";
import { Outlet } from "react-router-dom";
import "./e-styles.css";
const EmptyLayout = () => {
  
    return (
      <div className="container">
        <div className="leftContainer"></div>
        <div className="centerContainer">
          <Outlet />
        </div>

        <div className="rightContainer"></div>
      </div>
    );

}

export default EmptyLayout;
