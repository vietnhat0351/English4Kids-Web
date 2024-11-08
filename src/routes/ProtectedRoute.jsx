// import { jwtDecode } from "jwt-decode";
// import { Navigate, Outlet } from "react-router-dom";


// const ProtectedRoute = ({ roles }) => {
//   const token = localStorage.getItem("accessToken");

//   if (!token) {
//     return <Navigate to="/login" />;
//   }

//   const decoded = jwtDecode(token);

//   try {
//     // Check if user is authenticated
//     // decoded && decoded.exp * 1000 > Date.now()
//     if (decoded) {
//       const userRoles = decoded.roles;
//       if (roles.some((role) => userRoles.includes(role))) {
//         return <Outlet />;
//       } else {
//         return <Navigate to="/unauthorized" />;
//       }
//     } else {
//       return <Navigate to="/login" />;
//     }
//   } catch (error) {
//     // console.error('Failed to initialize Keycloak');
//     // console.error(error);
//   }
// };

// export default ProtectedRoute;



import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { setUserProfile } from "../redux/slices/userSlice";

const ProtectedRoute = ({ roles }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);

      // Check if token is still valid
      if (decoded.exp * 1000 > Date.now()) {
        // Fetch the user profile if not already done
        axios
          .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            // Dispatch user profile to Redux
            console.log("Scatter");
            dispatch(setUserProfile(response.data));
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    }
  }, [token, dispatch]);

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

