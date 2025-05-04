import React, { useEffect, useState } from 'react';
import AttractionCard from "../components/AttractionCard";
import '../styles/Destinations.css';
import {getAllAttractions} from "../requests/AdminRequests";

const Destinations = () => {
    const [attractions, setAttractions] = useState([]);

    useEffect(() => {
        const fetchAttractions = async () => {
            const data = await getAllAttractions();
            setAttractions(data);
        };
        void fetchAttractions();
    }, []);
    return (
        <div className="top-destination">
            <div className="top-destination-header">
                <h4 className="subtitle">Top Destinations</h4>
                <h2 className="title">Discover your next adventure</h2>
            </div>

            <div className="destination-grid">
                {attractions.map((attraction) => (
                    <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
            </div>
        </div>
    );
};

export default Destinations;

