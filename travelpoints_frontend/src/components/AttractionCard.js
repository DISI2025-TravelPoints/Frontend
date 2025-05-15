import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { motion } from 'framer-motion';                 // ➜ optional, pentru puls
import { useAudioPlayer } from '../utils/AudioPlayer';
import '../styles/AttractionCard.css';

const AttractionCard = ({ attraction, isInWishlist, onToggleWishlist }) => {
    const imageUrl = `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${attraction.id}/cover.jpeg`;
    const audioUrl = `https://travelpoints-bucket.s3.amazonaws.com/${attraction.audioFilePath}`;

    const { audioRef, isPlaying, toggle } = useAudioPlayer(audioUrl);

    const [localLiked, setLocalLiked] = useState(false);
    const liked = isInWishlist ?? localLiked;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (onToggleWishlist) {
            onToggleWishlist(attraction.id, liked);
        } else {
            setLocalLiked(!localLiked);
        }
    };

    return (
        <Link to={`/attractions/${attraction.id}`} className="attraction-card-link">
            <div className="attraction-card">
                {/* ──────────────── imag + heart btn ─────────────── */}
                <div className="image-wrapper">
                    <img src={imageUrl} alt={attraction.name} className="attraction-image" />
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        // className="wishlist-btn"
                        className={`wishlist-btn ${liked ? "liked" : ""}`}
                        onClick={handleWishlistClick}
                    >
                        {liked
                            ? <AiFillHeart size={20} />
                            : <AiOutlineHeart size={20} />
                        }
                    </motion.button>
                </div>

                {/* ──────────────── card contents ─────────────── */}
                <div className="attraction-content">
                    <h3 className="attraction-title">{attraction.name}</h3>

                    <div className="attraction-info">
                        <span className="attraction-price">entry fee: {attraction.entryFee}$</span>

                        <button type="button" className="audio-button" onClick={(e) => { e.preventDefault(); toggle(); }}>
                            {isPlaying
                                ? <IoPauseCircleOutline size={28} color="#4CAF50" />
                                : <IoPlayCircleOutline size={28} color="#4CAF50" />}
                        </button>

                        <audio ref={audioRef} preload="auto">
                            <source src={audioUrl} type="audio/wav" />
                            Your browser does not support audio playback.
                        </audio>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AttractionCard;
