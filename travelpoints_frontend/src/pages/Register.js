import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import bgImage from '../assets/rectangle-11.png';
import userApi from '../api';
import { validateName, validateEmail, validatePassword } from '../utils/Validators';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async () => {
        const nameErr = validateName(name);
        const emailErr = validateEmail(email);
        const passwordErr = validatePassword(password);

        setNameError(nameErr);
        setEmailError(emailErr);
        setPasswordError(passwordErr);

        if (nameErr || emailErr || passwordErr) {
            return;
        }

        try {
            await userApi.post('/api/user/register', {
                name,
                email,
                password
            });
            console.log('Cont creat cu succes!');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message;

            console.error('Eroare la înregistrare:', errorMsg);

            if (errorMsg.toLowerCase().includes("emailul este deja înregistrat")) { // recives it in ro from backend
                // setEmailError("An account with this email already exists.");
                // choosed a shorter version to fit the backround better
                setEmailError("Account already exists.");
            }
        }
    };

    return (
        <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="auth-content">
                <h1 className="auth-title">Create Account</h1>

                <div className="input-group">
                    <input
                        className={`auth-input ${nameError ? 'error' : ''}`}
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setNameError(validateName(e.target.value));
                        }}
                        autoComplete="off"
                    />
                    {nameError && <p className="error-message">{nameError}</p>}
                </div>


                <div className="input-group">
                    <input
                        className={`auth-input ${emailError ? 'error' : ''}`}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(validateEmail(e.target.value)); // actualizează live
                        }}
                        autoComplete="off"
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
                            setPasswordError(validatePassword(e.target.value));
                        }}
                        autoComplete="new-password"
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                </div>

                <button className="auth-btn" onClick={handleRegister}>
                    Sign up
                </button>
            </div>

            <p className="auth-footer">
                Already have an account?
                <span className="link" onClick={() => navigate('/login')}> Login</span>
            </p>
        </div>
    );
};

export default Register;

