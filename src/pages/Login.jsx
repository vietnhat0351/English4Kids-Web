import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import axios from 'axios';
import React from 'react'
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';

const Login = () => {

    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`, {
            email,
            password
        }).then((response) => {
            console.log(response.data);
            // Save the token in local storage
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
        })
            .catch((error) => {
                console.error(error);
            })
    }

    const handleLoginn = () => {
        const token = localStorage.getItem('accessToken');
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/management`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.error(error);
            })
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
                <h1>Đăng nhập</h1>
                <p>Please login to view this page.</p>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
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
                        label="Password"
                    />
                </FormControl>
                <p>Chưa có tài khoản? <a href='/signup'>Đăng ký</a></p>
                <Button variant='contained' onClick={handleLogin}
                    style={{ width: '25ch', margin: '1rem 0' }}>Đăng nhập</Button>
                <Button variant='contained' onClick={handleLoginn} style={{ width: '25ch' }}>Đăng nhập với Google</Button>
            </div>
        </div>

    )
}

export default Login