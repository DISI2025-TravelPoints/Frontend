import { jwtDecode } from 'jwt-decode';

export const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        return jwtDecode(token).role;
    } catch {
        return null;
    }
};
