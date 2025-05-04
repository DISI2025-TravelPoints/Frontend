import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../styles/Landing.css';
import { getRoleFromToken } from '../utils/Auth';
import backgroundImage from '../assets/background0.png';
import Destinations from './Destinations';
import useAuthSession from '../utils/AuthSession';
import GeoLocation from "../utils/GeoLocation";

const Landing = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userGeohash, setUserGeohash] = useState(null);

    useEffect(() => {
        setUserRole(getRoleFromToken());
    }, []);

    useEffect(() => {
             const role = getRoleFromToken();
              setUserRole(role);
             if (role === 'Admin') {
                    navigate('/home-admin');
                 } else if (role === 'Tourist') {
                    //sau putem duce turistii la profil
                       navigate('/');
                 }
            }, [navigate]);

    const handleLogout = useAuthSession(setUserRole, setDropdownOpen);

    return (
        <div className="landing-page"> {/* UN SINGUR WRAPPER */}
            <header className="landing-header">
                <div className="landing-logo" onClick={() => navigate('/')}>
                    travelpoints
                </div>
                {!userRole ? (
                    <div className="landing-actions">
                        <div className="landing-login" onClick={() => navigate('/login')}>
                            <FaUser style={{marginRight: '8px'}}/>
                            Login
                        </div>
                        <button className="landing-signup" onClick={() => navigate('/register')}>
                            Sign up free
                        </button>
                    </div>
                ) : (
                    <div style={{position: 'relative'}}>
                        <FaUserCircle
                            className="landing-avatar"
                            style={{fontSize: '40px', cursor: 'pointer'}}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="landing-dropdown">
                                {userRole === 'Tourist' && (
                                    <>
                                        <div className="dropdown-item" onClick={() => navigate('/profile')}>
                                            Profile
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate('/wishlist')}>
                                            Wishlist
                                        </div>
                                        <div className="dropdown-item" onClick={() => navigate('/account')}>
                                            Account
                                        </div>
                                    </>
                                )}
                                <div className="dropdown-item" onClick={handleLogout}>
                                    <FaSignOutAlt style={{marginRight: '8px'}}/>
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* HERO SECTION */}
            <div
                className="landing-hero"
                style={{backgroundImage: `url(${backgroundImage})`}}
            >
                <h1 className="landing-title">Explore the world with a smile</h1>
                <p className="landing-text">
                    {userRole === 'Admin' && (
                        <>Welcome back, Admin! You can now manage attractions and view insights.</>
                    )}
                    {userRole === 'Tourist' && (
                        <>Welcome, dear tourist! Start exploring top destinations and add favorites to your list.</>
                    )}
                    {!userRole && (
                        <>
                            Discover the most spectacular tourist attractions around the world.<br/>
                            Search, save, and explore.
                        </>
                    )}
                </p>
            </div>

            <div className="landing-map">
                <GeoLocation setUserGeohash={setUserGeohash}></GeoLocation>
            </div>

            {/* DESTINATIONS SECTION */}
            <div className="destinations-section" style={{background: '#f8f8f8', padding: '60px 20px'}}>
                <Destinations/>
            </div>
        </div>
    );
};

export default Landing;
