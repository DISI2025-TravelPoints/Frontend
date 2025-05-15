import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Landing.css';
import backgroundImage from '../assets/background0.png';
import AttractionCard from '../components/AttractionCard';

const SearchResultsPage = () => {
    const location = useLocation();
    const searchResults = location.state?.results || [];

    return (
        <div className="landing-page">
            <Header />
            {/* HERO SECTION */}
            <div
                className="landing-hero"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <h1 className="landing-title">Your search results</h1>
                <p className="landing-text">
                    Here are all the places we found matching your search.
                </p>
            </div>

            {/* RESULTS SECTION */}
            <div className="destinations-section" style={{ background: '#f8f8f8', padding: '60px 20px' }}>
                {searchResults.length > 0 ? (
                    <div className="destinations-grid">
                        {searchResults.map((attraction) => (
                            <AttractionCard key={attraction.id} attraction={attraction} />
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;