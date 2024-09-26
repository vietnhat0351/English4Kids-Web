import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <header className="bg-rose-500 text-white text-center text-2xl p-4">
        Application Layout
      </header>
      <div className="m-16 flex-1 bg-rose-100">
        <Outlet />
      </div>
      <footer className="bg-rose-500 text-white text-center text-lg p-4">
        Footer
      </footer>
    </div>
  );
};

export default AdminLayout;
