import React from 'react';
import { Link } from 'react-router-dom';
import { IoPlayCircleOutline, IoPauseCircleOutline } from 'react-icons/io5';
import { useAudioPlayer } from '../utils/AudioPlayer';
import '../styles/AttractionCard.css';

const AttractionCard = ({ attraction }) => {
    const imageUrl = `https://travelpoints-bucket.s3.amazonaws.com/travelpoints_images/${attraction.id}/cover.jpeg`;
    const audioUrl = `https://travelpoints-bucket.s3.amazonaws.com/${attraction.audioFilePath}`;
    const { audioRef, isPlaying, toggle } = useAudioPlayer(audioUrl);

    return (
        <Link to={`/attractions/${attraction.id}`} className="attraction-card-link">
            <div className="attraction-card">
                <img
                    src={imageUrl}
                    alt={attraction.name}
                    className="attraction-image"
                />
                <div className="attraction-content">
                    <h3 className="attraction-title">{attraction.name}</h3>
                    <div className="attraction-info">
                        <span className="attraction-price">entry fee: {attraction.entryFee}$</span>
                        <div className="attraction-actions">
                            <button
                                type="button"
                                className="audio-button"
                                onClick={toggle}
                            >
                                {isPlaying ? (
                                    <IoPauseCircleOutline size={28} color="#4CAF50" />
                                ) : (
                                    <IoPlayCircleOutline size={28} color="#4CAF50" />
                                )}
                            </button>
                            <audio ref={audioRef} preload="auto">
                                <source src={audioUrl} type="audio/wav" />
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default AttractionCard;
