import React from "react";
import { Outlet } from "react-router-dom";
// import "./e-styles.css";
const EmptyLayout = () => {

  return (
    <div>
      <Outlet />
    </div>
  );

}

export default EmptyLayout;
