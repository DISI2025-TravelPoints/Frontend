import { FaRegHeart, FaHeart } from 'react-icons/fa';
import '../styles/SaveButton.css';

export default function SaveButton({ saved, onToggle }) {
    return (
        <button
            className={`save-btn ${saved ? 'saved' : ''}`}
            onClick={onToggle}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {saved ? (
                <FaHeart className="heart-icon" />
            ) : (
                <FaRegHeart className="heart-icon" />
            )}
            <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
    );
}



