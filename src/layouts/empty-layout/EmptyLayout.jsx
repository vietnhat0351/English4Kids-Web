import React from "react";
import { Outlet } from "react-router-dom";
const EmptyLayout = () => {
  return (
    <div>
      <div></div>
      <div>
        <Outlet />
      </div>

      <div></div>
    </div>
  );
};

export default EmptyLayout;
