import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/rectangle-11.png';
import userApi from '../api';
import { validateEmailRequired, validatePassword } from '../utils/Validators';
import { getRoleFromToken } from '../utils/Auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async () => {
        const emailErrorMsg = validateEmailRequired(email);
        const passwordErrorMsg = validatePassword(password);

        setEmailError(emailErrorMsg);
        setPasswordError(passwordErrorMsg);

        if (emailErrorMsg || passwordErrorMsg) return;

        try {
            const response = await userApi.post('/api/user/login', { email, password });
            const token = response.data;
            localStorage.setItem('token', token);
            const role = getRoleFromToken();
            if (!token || token.trim() === '') {
                navigate('/unauthorized');
                return;
            }
           
            if (role === 'Admin') {
                navigate('/home-admin');
            }else{
                navigate('/home');  // redirect catre pagina comuna
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
                    alert("Unexpected error: " + backendMessage);
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

                    <div className="error-forgot-container">
                        <div className="left-error">
                            {passwordError && <p className="error-message">{passwordError}</p>}
                        </div>
                        <div className="right-forgot">
            <span className="forgot-password-link" onClick={() => navigate('/forgot-pass')}>
                Forgot password?
            </span>
                        </div>
                    </div>
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