import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/rectangle-11.png';
import userApi from '../api';


const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await userApi.post('/api/user/register', {
                name: username,
                email: email,
                password: password
            });
            console.log('Cont creat cu succes!');
            navigate('/login');
        } catch (error) {
            const errorMsg =
                error.response?.data?.message || error.response?.data || error.message;
            console.error('Eroare la înregistrare:', errorMsg);
        }
    };

    const handleGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="auth-wrapper" style={{backgroundImage: `url(${bgImage})`}}>
            <div className="auth-content">
                <h1 className="auth-title">Create Account</h1>

                <input
                    className="auth-input"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="auth-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="auth-btn" onClick={handleRegister}>
                    Sign up
                </button>
            </div>

            <p className="auth-footer">
                Already have an account?
                <span className="link" onClick={handleGoToLogin}> Login</span>
            </p>
        </div>

    );
};

export default Register;

