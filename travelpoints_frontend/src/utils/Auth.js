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

export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || payload.sub || null;
    } catch (err) {
        console.error('Invalid token', err);
        return null;
    }
};