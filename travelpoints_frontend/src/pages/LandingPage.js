import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../styles/Landing.css';
import { getRoleFromToken } from '../utils/Auth';
import GeoLocation from '../utils/GeoLocation';

const Landing = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [userGeohash, setUserGeohash] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setUserRole(getRoleFromToken());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        setDropdownOpen(false);
        navigate('/');
    };

    return (
        <div className="landing-wrapper">
            <header className="landing-header">
                {!userRole ? (
                    <>
                        <div className="landing-login" onClick={() => navigate('/login')}>
                            <FaUser style={{ marginRight: '8px' }} />
                            Login
                        </div>

                        <button className="landing-signup" onClick={() => navigate('/register')}>
                            Sign up free
                        </button>
                    </>
                ) : (
                    <div style={{ position: 'relative' }}>
                        <FaUserCircle
                            className="landing-avatar"
                            style={{ fontSize: '40px', color: '#2e6a5a', cursor: 'pointer' }}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        />
                        {dropdownOpen && (
                            <div className="landing-dropdown">
                                {userRole === 'Tourist' && (
                                    <>
                                        <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                                        <div className="dropdown-item" onClick={() => navigate('/wishlist')}>Wishlist</div>
                                        <div className="dropdown-item" onClick={() => navigate('/account')}>Account</div>
                                    </>
                                )}
                                <div className="dropdown-item" onClick={handleLogout}>
                                    <FaSignOutAlt style={{ marginRight: '8px' }} />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <div className="landing-body">
                <div className="landing-content">
                    <h1 className="landing-title">TravelPoints</h1>
                    <p className="landing-text">
                        {userRole === 'Admin' && (
                            <>Welcome back, Admin! You can now manage attractions and view insights.</>
                        )}
                        {userRole === 'Tourist' && (
                            <>Welcome, dear tourist! Start exploring top destinations and add favorites to your list.</>
                        )}
                        {!userRole && (
                            <>Discover the most spectacular tourist attractions in Romania and around the world.<br />Search, save, and explore.</>
                        )}
                    </p>
                </div>
                <div className="landing-map">
                    <GeoLocation setUserGeohash={setUserGeohash}></GeoLocation>
                </div>
            </div>
        </div>
    );
};

export default Landing;
