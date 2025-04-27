import React, { useState } from 'react';
import '../styles/FormAttraction.css'; 
import { useNavigate } from 'react-router-dom';
import attractionApi from '../api/attractionApi'; 
import bgImage from '../assets/rectangle-11.png';

const CreateAttraction = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [entryFee, setEntryFee] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [file, setFile] = useState(null);

   const handleSubmit = async () => {
    if (!name || !description || !entryFee || !latitude || !longitude || !file) {
        alert("Please complete all fields before submitting the form.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('attraction', new Blob([JSON.stringify({
        name: name,
        description: description,
        entryFee: parseFloat(entryFee),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
    })], { type: 'application/json' }));

    try {
        await attractionApi.post('/api/attraction', formData,  {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Attraction created successfully!');
        navigate('/home-admin');
    } catch (err) {
        console.error(err);
        alert('Failed to create attraction. Please check your input and try again.');
    }
};


    return (
        <div className="auth-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="auth-content">
                <h1 className="auth-title">Add New Attraction</h1>

        
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
                        type="number"
                        step="0.01"
                        className="auth-input"
                        placeholder="Entry Fee"
                        value={entryFee}
                        onChange={(e) => setEntryFee(parseFloat(e.target.value))}
                    />
                </div>

               
                <div className="input-group">
                    <input
                        type="number"
                        step="0.000001"
                        className="auth-input"
                        placeholder="Latitude"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    />
                </div>

                
                <div className="input-group">
                    <input
                        type="number"
                        step="0.000001"
                        className="auth-input"
                        placeholder="Longitude"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
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
                    Add Attraction
                </button>
            </div>
        </div>
    );
};

export default CreateAttraction;
