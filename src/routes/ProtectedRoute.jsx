import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom'
import { setUserProfile } from '../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect } from 'react';

const ProtectedRoute = ({ roles }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/api/v1/user/current`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then((response) => {  
                    dispatch(setUserProfile(response.data));
                })
            } catch (error) {
                console.error(error);
            }
        };

        if (token) {
            fetchCurrentUser();
        }
    }, [token, dispatch]);


    if(!token) {
        return <Navigate to="/login" />;
    }

    const decoded = jwtDecode(token);

    try {
        // Check if user is authenticated
        // decoded && decoded.exp * 1000 > Date.now()
        if (decoded) {
            const userRoles = decoded.roles;
            if (roles.some(role => userRoles.includes(role))) {
                return <Outlet />;
            } else {
                return <Navigate to="/unauthorized" />;
            }
        } else {
            return <Navigate to="/login" />;
        }

    } catch (error) {
        // console.error('Failed to initialize Keycloak');
        // console.error(error);
    }
};

export default ProtectedRoute