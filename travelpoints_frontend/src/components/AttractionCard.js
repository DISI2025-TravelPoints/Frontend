import "../styles/AttractionCard.css";
import { useState, useEffect } from "react";
import { IoPlayCircleOutline, IoPauseCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';


const AttractionCard = ({ attraction }) => {
    const imageUrl = `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${attraction.id}/cover.jpeg`;
    const audioUrl = `https://travelpoints-bucket.s3.amazonaws.com/${attraction.audioFilePath}`;

    const audioElementId = `audio-${attraction.id}`;
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayAudio = (e) => {
         e.stopPropagation();
        const audio = document.getElementById(audioElementId);
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().then(() => {
                setIsPlaying(true);
            }).catch(err => {
                console.error("Error playing audio:", err);
            });
        }
    };


    useEffect(() => {
        const audio = document.getElementById(audioElementId);
        if (audio) {
            const handleEnded = () => setIsPlaying(false);
            audio.addEventListener("ended", handleEnded);
            return () => audio.removeEventListener("ended", handleEnded);
        }
    }, []);

    return (
        <Link to={`/attractions/${attraction.id}`} className="attraction-card-link">
        <div className="attraction-card">
            <img
                src={imageUrl}
                alt={`${attraction.name} - ${attraction.description}`}
                className="attraction-image"
            />
            <div className="attraction-content">
                <h3 className="attraction-title">{attraction.name}</h3>
                <div className="attraction-info">
                    <span className="attraction-price">fee: {attraction.entryFee}$</span>
                    <div className="attraction-days">
                        <div className="attraction-actions">
                            <button className="audio-button" onClick={handlePlayAudio}>
                                {isPlaying ? (
                                    <IoPauseCircleOutline size={30} color="#4CAF50" />
                                ) : (
                                    <IoPlayCircleOutline size={30} color="#4CAF50" />
                                )}
                            </button>

                            <audio id={audioElementId} preload="auto">
                                <source src={audioUrl} type="audio/wav" />
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );
};

export default AttractionCard;
