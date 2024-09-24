import { jwtDecode } from 'jwt-decode';
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ roles }) => {
    
    const token = localStorage.getItem('accessToken');

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