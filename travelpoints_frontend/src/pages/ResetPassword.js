import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ResetPassword.css";
import mailboxIcon from "../assets/mailbox-icon.png";
import { useNavigate, useSearchParams } from "react-router-dom";


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [tokenValid, setTokenValid] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000); // 3 secunde să citească mesajul și apoi redirect

            return () => clearTimeout(timer);
        }
    }, [successMessage, navigate]);


    useEffect(() => {
        const validateToken = async () => {
            try {
                await axios.get(`http://localhost:8081/api/user/validate-password-reset-token?token=${token}`);
                setTokenValid(true);
            } catch (error) {
                console.error("Invalid token", error);
                setTokenValid(false);
            }
        };

        if (token) {
            validateToken();
        } else {
            setTokenValid(false);
        }
    }, [token]);

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please fill in both password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            await axios.post("http://localhost:8081/api/user/reset-password", {
                token: token,
                newPassword: newPassword
            });
            setSuccessMessage("Your password has been reset successfully!");
            setErrorMessage("");
        } catch (error) {
            console.error("Error resetting password:", error);
            setErrorMessage("Failed to reset password. Please try again.");
        }
    };

    if (!tokenValid) {
        return <div>Invalid or expired token. Please request a new password reset link.</div>;
    }

    return (
        <div className="container">
            <img src={mailboxIcon} alt="Mailbox" className="image" />
            <h1 className="text">Reset password</h1>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

            <div className="textbox">
                <label className="label" htmlFor="new-password">New password</label>
                <input
                    type="password"
                    id="new-password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            <div className="textbox">
                <label className="label" htmlFor="reenter-password">Re-enter password</label>
                <input
                    type="password"
                    id="reenter-password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="button" onClick={handleResetPassword}>Reset</button>
        </div>
    );
};

export default ResetPassword;
