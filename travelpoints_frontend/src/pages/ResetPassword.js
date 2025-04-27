import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import userApi from "../api";
import mailboxIcon from "../assets/mailbox-icon.png";
import backgroundImg from "../assets/Wave.jpeg";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Token validation
    useEffect(() => {
        (async () => {
            try {
                await userApi.get(`/api/user/validate-password-reset-token?token=${token}`);
                setTokenValid(true);
            } catch {
                setTokenValid(false);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    // Redirect after succes
    useEffect(() => {
        if (successMessage) {
            const t = setTimeout(() => navigate("/login"), 3000);
            return () => clearTimeout(t);
        }
    }, [successMessage, navigate]);

    if (loading) return null;

    if (!tokenValid) {
        return (
            <div className="rp-page">
                <div
                    className="rp-background"
                    style={{ backgroundImage: `url(${backgroundImg})` }}
                />
                <div className="rp-container">
                    <div className="invalid-token-icon">✖</div>
                    <h2 className="invalid-token-title">Invalid or Expired Link</h2>
                    <p className="invalid-token-text">
                        To reset your password, request a new link.
                    </p>
                    <button
                        className="invalid-token-btn"
                        onClick={() => navigate("/forgot-pass")}
                    >
                        Request New Link
                    </button>
                </div>
            </div>
        );
    }

    const handleReset = async () => {
        if (!newPassword || !confirmPassword) {
            setErrorMessage("Please fill in both fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
        try {
            await userApi.post("/api/user/reset-password", { token, newPassword });
            setSuccessMessage("Password reset successfully!");
            setErrorMessage("");
        } catch {
            setErrorMessage("Failed to reset password. Try again.");
        }
    };

    return (
        <div className="rp-page">
            <div
                className="rp-background"
                style={{ backgroundImage: `url(${backgroundImg})` }}
            />
            <div className="rp-container">
                <img src={mailboxIcon} alt="Mailbox" className="rp-image" />
                <h1 className="rp-title">Reset Password</h1>

                {errorMessage && <div className="rp-error">{errorMessage}</div>}
                {successMessage && <div className="rp-success">{successMessage}</div>}

                <div className="rp-field">
                    <label>New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="rp-field">
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button className="rp-btn" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
