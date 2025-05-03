import "../styles/AttractionCard.css";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoPlayCircleOutline } from "react-icons/io5";

const AttractionCard = ({ attraction }) => {
    // const [isFavorite, setIsFavorite] = useState(false);
    const imageUrl = `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${attraction.id}/cover.jpeg`;

    const handlePlayAudio = () => {
        const audioUrl = `https://travelpoints-bucket.s3.amazonaws.com/${attraction.audio_file_path}`;
        const audio = new Audio(audioUrl);
        audio.play().catch(err => {
            console.error("Error playing audio:", err);
        });
    };

    // const toggleFavorite = () => {
    //     setIsFavorite(prev => !prev);
    // };

    return (
        <div className="attraction-card">
            <img src={imageUrl} alt={`${attraction.name} - ${attraction.description}`} className="attraction-image" />
            <div className="attraction-content">
                <h3 className="attraction-title">{attraction.name}</h3>
                <div className="attraction-info">
                    <span className="attraction-price"> fee: {attraction.entryFee}$</span>
                    <div className="attraction-days">
                        <div className="attraction-actions">
                            <button className="audio-button" onClick={handlePlayAudio}>
                                <IoPlayCircleOutline size={30} color="#4CAF50" />
                            </button>
                            {/*<button className="favorite-button" onClick={toggleFavorite}>
                                {isFavorite ? <FaHeart size={24} color="red" /> : <FaRegHeart size={24} />}
                            </button>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttractionCard;
