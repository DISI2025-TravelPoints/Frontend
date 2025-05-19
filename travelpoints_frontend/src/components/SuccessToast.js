import React from "react";
import "../styles/SuccessToast.css";

const SuccessToast = () => {
    return (
        <div className="custom-success-toast">
            <span className="checkmark">✔</span>
            <span>Offer successfully sent</span>
        </div>
    );
};

export default SuccessToast;