import React, { useState } from "react";
import userApi from '../api';
import "../styles/ForgotPassword.css";
import signpostImg from "../assets/arrow-icon.png";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSendEmail = async () => {
        try {
            const response = await userApi.post("/api/user/initiate-password-reset", {
                email: email,
            });
            setSuccessMessage("Password reset link sent! Please check your email.");
            setErrorMessage("");
        } catch (error) {
            console.error("Error sending reset email:", error);
            setErrorMessage("Failed to send password reset link. Please try again.");
            setSuccessMessage("");
        }
    };


    const handleBackToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="fp-container">
        <span className="fp-top-text">
            Don’t have an account? <a href="/register">Register Now</a>
        </span>

            <img src={signpostImg} alt="direction sign" className="fp-image" />

            <h1 className="fp-heading">Forgot your password?</h1>

            <p className="fp-subheading">
                Enter your email so that we can send you password reset link
            </p>

            <div className="fp-textbox">
                <input
                    className="fp-input"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* Mesaje puse exact între input și buton */}
            {(successMessage || errorMessage) && (
                <div className="fp-message-container">
                    {successMessage && <p className="fp-success-message">{successMessage}</p>}
                    {errorMessage && <p className="fp-error-message">{errorMessage}</p>}
                </div>
            )}

            <button className="fp-button-primary" onClick={handleSendEmail}>
                Send Email
            </button>

            <button className="fp-button-secondary" onClick={handleBackToLogin}>
                <AiOutlineArrowLeft className="fp-icon" />
                Back to Login
            </button>
        </div>
    );

};

export default ForgotPassword;
