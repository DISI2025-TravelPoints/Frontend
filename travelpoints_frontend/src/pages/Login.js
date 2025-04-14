import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/rectangle-11.png';
import { jwtDecode } from 'jwt-decode';
import userApi from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async () => {
        let emailValid = true;
        let passwordValid = true;

        if (!email) {
            setEmailError("Email is required.");
            emailValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError("Password is required.");
            passwordValid = false;
        } else {
            setPasswordError('');
        }

        if (!emailValid || !passwordValid) return;

        try {
            const response = await userApi.post('/api/user/login', { email, password });
            const token = response.data;
            localStorage.setItem('token', token);

            const storedToken = localStorage.getItem('token');
            if (!storedToken || storedToken.trim() === '') {
                navigate('/unauthorized');
                return;
            }

            const decoded = jwtDecode(storedToken);
            const role = decoded.role;
            console.log("Login reușit:", { email: decoded.sub, role });

            if (role === 'Admin') {
                navigate('/home-admin');
            } else if (role === 'Tourist') {
                navigate('/home-tourist');
            } else {
                navigate('/unauthorized');
            }

        } catch (error) {
            console.error("Eroare la login:", error);

            if (error.response) {
                const backendMessage = error.response.data?.message || error.response.data;

                if (backendMessage === "Email inexistent.") {
                    setEmailError("No account with this email.");
                } else if (backendMessage === "Parolă incorectă.") {
                    setPasswordError("Incorrect password.");
                } else {
                    alert("Eroare neașteptată: " + backendMessage);
                }
            } else {
                alert("A apărut o eroare. Încearcă din nou.");
            }
        }
    };

    return (
        <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="auth-content">
                <h1 className="auth-title">Login</h1>

                <div className="input-group">
                    <input
                        className={`auth-input ${emailError ? 'error' : ''}`}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError('');
                        }}
                        autoComplete="email"
                    />
                    {emailError && <p className="error-message">{emailError}</p>}
                </div>

                <div className="input-group">
                    <input
                        className={`auth-input ${passwordError ? 'error' : ''}`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (passwordError) setPasswordError('');
                        }}
                        autoComplete="current-password"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <button className="auth-btn" onClick={handleLogin}>
                    Login
                </button>

                <p className="auth-footer">
                    Don't have an account?
                    <span className="link" onClick={() => navigate('/register')}> Sign up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;
