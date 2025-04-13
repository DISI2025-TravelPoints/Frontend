import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/rectangle-11.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleLogin = () => {
        let emailValid = true;
        let passwordValid = true;

        if (!email) {
            setEmailError("Email is required.");
            emailValid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required.");
            passwordValid = false;
        } else {
            setPasswordError("");
        }

        if (!emailValid || !passwordValid) return;

        // aici va fi legat de backend mai târziu
        console.log("Logging in with:", email, password);
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
            </div>

            <p className="auth-footer">
                Don't have an account?
                <span className="link" onClick={() => navigate('/register')}> Sign up</span>
            </p>
        </div>
    );
};

export default Login;