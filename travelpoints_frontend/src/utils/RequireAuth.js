import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRoleFromToken } from './Auth';

const RequireAuth = ({ allowedRoles, children }) => {
    const role = getRoleFromToken();
    if (!role) return <Navigate to="/login" />;
    return allowedRoles.includes(role) ? children : <Navigate to="/unauthorized" />;
};

export default RequireAuth;