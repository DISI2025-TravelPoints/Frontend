// components/RequireAuth.js
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const RequireAuth = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/unauthorized" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role;

        if (!allowedRoles.includes(role)) {
            return <Navigate to="/unauthorized" replace />;
        }

        return children;
    } catch (err) {
        return <Navigate to="/unauthorized" replace />;
    }
};

export default RequireAuth;
