// ContainerComponent.js
import React from "react";
import "./styles.css"; // Make sure to keep your styles
import { Link, NavLink } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";

const ContainerComponent = ({ children, className = "a-l-container" }) => {
  return (
    <div className={className}>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink to="/admin/lesson/question" className="a-l-breadcrumb">
            Home
        </NavLink>
        <Link
          underline="hover"
          color="inherit"
          href="/material-ui/getting-started/installation/"
        >
          Core
        </Link>
      </Breadcrumbs>
      {children}
    </div>
  );
};

export default ContainerComponent;
