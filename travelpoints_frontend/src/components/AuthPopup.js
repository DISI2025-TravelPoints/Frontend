import "../styles/AuthPopup.css";

const AuthPopup = ({ onClose }) => (
    <div className="popup-backdrop">
        <div className="popup-box">
            <p>You need to be logged in to add to your wishlist.</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);

export default AuthPopup;
