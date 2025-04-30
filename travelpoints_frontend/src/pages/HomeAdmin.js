import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import attractionApi from '../attractionApi';
import '../styles/FormAttraction.css';

function HomeAdmin() {
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        fetchAttractions();
    }, []);

    const fetchAttractions = async () => {
        try {
            const response = await attractionApi.get('/api/attraction');
            setAttractions(response.data);
        } catch (error) {
            console.error('Error loading attractions:', error);
            alert('Failed to load attractions.');
        }
    };



    const formatUUID = (id) => {
        if (id.length === 32) {
            return `${id.substring(0, 8)}-${id.substring(8, 12)}-${id.substring(12, 16)}-${id.substring(16, 20)}-${id.substring(20)}`;
        }
        return id;
    };
    

    const handleDelete = async (id) => {
        const formattedId = formatUUID(id);
        if (window.confirm('Are you sure you want to delete this attraction?')) {
            try {
                await attractionApi.delete(`/api/attraction/${formattedId}`);
                alert('Attraction deleted successfully!');
                fetchAttractions();
            } catch (error) {
                console.error('Error deleting attraction:', error);
                alert('Failed to delete attraction.');
            }
        }
    };
 
    

    const handleUpdate = (id) => {
        const formattedId = formatUUID(id);
        navigate(`/update-attraction/${formattedId}`);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-content">
                <h1 className="auth-title">Welcome, Admin!</h1>

                <button className="auth-btn" onClick={() => navigate('/create-attraction')}>
                    Create New Attraction
                </button>

                <div className="attractions-list">
                    {attractions.map((attraction) => (
                        <div key={attraction.id} className="attraction-card">
                            <h2>{attraction.name}</h2>
                            <p>{attraction.description}</p>
                            <p><strong>Entry Fee:</strong> {attraction.entryFee} $</p>
                            <p><strong>Last Update:</strong> {new Date(attraction.lastUpdate).toLocaleDateString()}</p>

                            {attraction.audioFilePath && (
                                <div style={{ marginTop: "10px" }}>
                                    <audio controls>
                                        <source src={'https://travelpoints-bucket1.s3.amazonaws.com/${attraction.audioFilePath}'} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}

                            <div className="button-group">
                                <button className="auth-btn-small" onClick={() => handleUpdate(attraction.id)}>
                                    Update
                                </button>
                                <button className="auth-btn-small delete" onClick={() => handleDelete(attraction.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
