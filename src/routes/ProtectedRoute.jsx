
import { jwtDecode } from "jwt-decode";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ roles }) => {
  const token = localStorage.getItem("accessToken");

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded) {
      const userRoles = decoded.roles;
      // Check if user has required roles
      if (roles.some((role) => userRoles.includes(role))) {
        return <Outlet />;
      } else {
        return <Navigate to="/unauthorized" />;
      }
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;

