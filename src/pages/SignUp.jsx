import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

const SignUp = () => {

    const [showPassword, setShowPassword] = React.useState(false);

    const [otpForm, setOtpForm] = React.useState(false);

    const [otp, setOtp] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstname, setFirstname] = React.useState('');
    const [lastname, setLastname] = React.useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

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
            firstname,
            lastname,
            otp
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        })
    }

    const ValiateOTPForm = () => {
        return (
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
        )
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{
                display: 'flex',
                flex: 6,
            }}>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 6,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                {otpForm ? <ValiateOTPForm /> : (
                    <div>
                        <h1>Đăng nhập</h1>
                        <p>Please sign up to view this page.</p>
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-firstname">Họ</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-firstname"
                                type='text'
                                label="Họ"
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-lastname">Tên</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-lastname"
                                type='text'
                                label="Tên"
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email"
                                type='email'
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
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
                        <p>Đã có tài khoản? <a href='/login'>Đăng nhập</a></p>
                        <Button variant='contained' onClick={generateOTP}
                            style={{ width: '25ch', margin: '1rem 0' }}>Đăng ký</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SignUp