import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../../redux/slices/userSlice";

import { jwtDecode } from "jwt-decode";
import { FcGoogle } from "react-icons/fc";

import LOGO from "../../assets/WebLogo.png";

import { useNavigate } from "react-router-dom";
import "./styles.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  function openLoginPopup() {
    const width = 500;
    const height = 600;

    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // const popup = window.open('http://localhost:8080/oauth2/authorization/github?redirect_uri=http://localhost:3000/', 'Login with Google',
    //   `width=${width},height=${height},top=${top},left=${left}`);

    const popup = window.open(
      `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`,
      "Login with Google",
      `width=${width},height=${height},top=${top},left=${left}`
    );

    // Monitor the popup for changes
    const interval = setInterval(() => {
      if (popup.closed) {
        clearInterval(interval);
        // Handle popup closed logic, e.g., reload page or check login status
        console.log("Popup closed");
      }
    }, 500);
  }

  const handleLogin = async () => {
    await axios
      .post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("loginType", "normal");

        const decoded = jwtDecode(response.data.accessToken);
        console.log(decoded);

        axios
          .get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`, {
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            dispatch(setUserProfile(response.data));
            // window.location.href = "/";
            if (response.data.role === "ADMIN") {
              navigate("/admin/lesson");
            } else {
              navigate("/learn");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="login-logo">
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              textAlign: "center",
              padding: "0",
              margin: "0",
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img src={LOGO} alt="logo" style={{ width: "5%", height: "5%" }} />
            <h4 className="title">English4Kids</h4>
          </button>
        </div>
      </div>
      <div className="login-body">
        <div className="login-image">
         

          <img
            src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/image-home.png"
            alt="login"
            style={{ width: "50%", height: "50%" }}
          />
        </div>
        <div className="login-form">
          {" "}
          <div className="loginContainer">
            <div className="loginHeader">
              <h1
                style={{
                  fontFamily: "NotoSan",
                  fontSize: "1.5rem",
                }}
              >
                Log in
              </h1>
            </div>
            <div className="loginBody">
              <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Email
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type="email"
                  label="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <MdOutlineVisibility />
                        ) : (
                          <MdOutlineVisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
            <div className="loginFooter">
              <Button
                variant="contained"
                onClick={handleLogin}
                style={{ margin: "1rem 0" }}
              >
                Log in
              </Button>
              <p
                style={{
                  color: "#818181",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Don't have an account? <a href="/signup">Sign In</a>
              </p>
            </div>

            {/* <div className="loginGoogle">
              <div className="dash"></div>
              <div>Or continue with</div>
              <div
                style={{
                  flex: 1,
                  borderBottom: "1px solid #ccc",
                }}
              ></div>
            </div>
            <FcGoogle
              style={{
                fontSize: "3rem",
                margin: "1rem 0",
                cursor: "pointer",
              }}
              onClick={openLoginPopup}
            /> */}
          </div>
        </div>
      </div>

      {/* <div className="imgLogin">
        <img
          src="https://english-for-kids.s3.ap-southeast-1.amazonaws.com/image-home.png"
          alt="login"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
 */}
      {/* <div className="loginContainer">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h1>Đăng nhập</h1>
          <p>Please login to view this page.</p>
        </div>
        <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type="email"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Mật khẩu
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <MdOutlineVisibility />
                  ) : (
                    <MdOutlineVisibilityOff />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <Button
          variant="contained"
          onClick={handleLogin}
          style={{ margin: "1rem 0" }}
        >
          Đăng nhập
        </Button>
        <p
          style={{
            color: "#818181",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Chưa có tài khoản? <a href="/signup">Đăng ký</a>
        </p>

        <div
          style={{
            display: "flex",
            width: "50%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              borderBottom: "1px solid #ccc",
            }}
          ></div>
          <div
            style={{
              margin: "0 10px",
              color: "#818181",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Hoặc tiếp tục với
          </div>
          <div
            style={{
              flex: 1,
              borderBottom: "1px solid #ccc",
            }}
          ></div>
        </div>
        <FcGoogle
          style={{
            fontSize: "3rem",
            margin: "1rem 0",
            cursor: "pointer",
          }}
          onClick={openLoginPopup}
        />
      </div> */}
    </div>
  );
};

export default Login;
