import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import userApi from '../api';
import { getRoleFromToken } from './Auth';

const useAuthSession = (setUserRole, setDropdownOpen) => {
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                await userApi.post('/api/user/logout', null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error("Logout request failed:", error);
            }
        }

        localStorage.removeItem('token');
        if (setUserRole) setUserRole(null);
        if (setDropdownOpen) setDropdownOpen(false);
        navigate('/');
    }, [navigate, setUserRole, setDropdownOpen]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiration = payload.exp * 1000;
                const now = Date.now();
                const timeUntilExpiry = expiration - now;

                if (timeUntilExpiry > 0) {
                    const timeoutId = setTimeout(async () => {
                        alert("Your session has expired. You have been logged out.");
                        await handleLogout();
                    }, timeUntilExpiry);

                    return () => clearTimeout(timeoutId);
                } else {
                    void handleLogout();
                }

                setUserRole(getRoleFromToken());
            } catch (e) {
                console.error("Invalid token. Logging out.");
                void handleLogout();
            }
        }
    }, [handleLogout]);

    return handleLogout;
};

export default useAuthSession;
