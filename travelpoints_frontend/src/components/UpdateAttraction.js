import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import attractionApi from '../attractionApi'; 

import '../styles/FormAttraction.css';
import bgImage from '../assets/rectangle-11.png';

const UpdateAttraction = () => {
    const { attractionId } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [file, setFile] = useState(null);
    const [currentFilePath, setCurrentFilePath] = useState(''); // fișierul existent

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await attractionApi.get(`/api/attraction/${attractionId}`);
                const data = response.data;
                setName(data.name || '');
                setDescription(data.description || '');
                setEntryFee(data.entryFee !== null ? data.entryFee : '');
                setLatitude(data.latitude !== null ? data.latitude : '');
                setLongitude(data.longitude !== null ? data.longitude : '');
                setCurrentFilePath(data.audioFilePath || '');
            } catch (error) {
                console.error(error);
                alert('Failed to load attraction data.');
            }
        };

        if (attractionId) {
            fetchAttraction();
        } else {
            alert('No attraction ID provided.');
        }
    }, [attractionId]);

    const handleSubmit = async () => {
        if (!name || !description || !entryFee) {
            alert("Please fill in all required fields.");
            return;
        }

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('file', new Blob([], { type: 'application/octet-stream' })); // trimitem un "mock" dacă nu e selectat alt fișier
        }

        formData.append('attraction', new Blob([JSON.stringify({
            name,
            description,
            entryFee: parseFloat(entryFee),
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null
        })], { type: 'application/json' }));

        try {
            await attractionApi.put(`/api/attraction/${attractionId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Attraction updated successfully!');
            navigate('/home-admin');
        } catch (err) {
            console.error(err);
            alert('Failed to update attraction.');
        }
    };

    return (
        <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="auth-content">
                <h1 className="auth-title">Update Attraction</h1>

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="number"
                        step="0.01"
                        placeholder="Entry Fee"
                        value={entryFee}
                        onChange={(e) => setEntryFee(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="number"
                        step="0.000001"
                        placeholder="Latitude (optional)"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                        className="auth-input"
                        type="number"
                        step="0.000001"
                        placeholder="Longitude (optional)"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                    />
                </div>


                <div className="input-group">
                    <input
                        className="auth-input"
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <button className="auth-btn" onClick={handleSubmit}>
                    Update Attraction
                </button>
            </div>
        </div>
    );
};

export default UpdateAttraction;
