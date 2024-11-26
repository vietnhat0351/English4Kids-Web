import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);

    const [otpForm, setOtpForm] = useState(false);

    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

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

        const popup = window.open('http://localhost:8080/oauth2/authorization/google', 'Login with Google',
            `width=${width},height=${height},top=${top},left=${left}`);

        // Monitor the popup for changes
        const interval = setInterval(() => {
            if (popup.closed) {
                clearInterval(interval);
                // Handle popup closed logic, e.g., reload page or check login status
                console.log("Popup closed");
            }
        }, 500);
    }

    const generateOTP = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/send-otp`, {
            email
        }).then((response) => {
            console.log(response.data);
            setOtpForm(true);
        }).catch((error) => {
            console.error(error);
        })
    }

    const handleSigup = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/register`, {
            email,
            password,
            firstName,
            lastName,
            otp
        }).then((response) => {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            window.location.href = '/';
        }).catch((error) => {
            console.error(error);
        })
    }

    // const ValiateOTPForm = (setOtp) => {
    //     return (
    //         <div>
    //             <h1>Validate OTP</h1>
    //             <p>Enter the OTP sent to your email to validate your account.</p>
    //             <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
    //                 <InputLabel htmlFor="outlined-adornment-otp">OTP</InputLabel>
    //                 <OutlinedInput
    //                     id="outlined-adornment-otp"
    //                     type='text'
    //                     label="OTP"
    //                     onChange={(e) => setOtp(e.target.value)}
    //                 />
    //             </FormControl>
    //             <Button variant='contained' style={{ width: '25ch', margin: '1rem 0' }}
    //                 onClick={handleSigup}
    //             >Validate OTP</Button>
    //         </div>
    //     )
    // }

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{
                display: 'flex',
                flex: 6,
            }}>
            </div>
            <div style={{
                display: 'flex',
                flex: 6,
            }}>
                {otpForm ? (
                    <div>
                        <h1>Validate OTP</h1>
                        <p>Enter the OTP sent to your email to validate your account.</p>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-otp">OTP</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-otp"
                                type='text'
                                label="OTP"
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </FormControl>
                        <Button variant='contained' style={{ width: '25ch', margin: '1rem 0' }}
                            onClick={handleSigup}
                        >Validate OTP</Button>
                    </div>
                ) : (<div style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}>
                    <h1>Đăng ký</h1>
                    <p>Vui lòng đăng ký để xem trang này</p>
                    <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-firstname">Họ</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-firstname"
                            type='text'
                            label="Họ"
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-lastname">Tên</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-lastname"
                            type='text'
                            label="Tên"
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type='email'
                            label="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
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
                                        {showPassword ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Mật khẩu"
                        />
                    </FormControl>
                    <Button variant='contained' onClick={generateOTP}
                        style={{ margin: '1rem 0' }}>Đăng ký</Button>
                    <p>Đã có tài khoản? <a href='/login'>Đăng nhập</a></p>
                    <div style={{
                        display: "flex",
                        width: "50%",
                        alignItems: "center",
                    }}>
                        <div style={{
                            flex: 1,
                            borderBottom: "1px solid #ccc",
                        }}></div>
                        <div style={{
                            margin: "0 10px",
                            color: "#818181",
                            fontFamily: "Arial, sans-serif"
                        }}>Hoặc tiếp tục với</div>
                        <div style={{
                            flex: 1,
                            borderBottom: "1px solid #ccc"
                        }}></div>
                    </div>
                    <FcGoogle style={{
                        fontSize: "3rem",
                        margin: "1rem 0",
                        cursor: "pointer"
                    }} onClick={openLoginPopup} />
                </div>)}
            </div>
        </div>
    )
}

export default SignUp