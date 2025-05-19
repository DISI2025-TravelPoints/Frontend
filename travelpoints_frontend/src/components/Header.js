import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { getRoleFromToken } from '../utils/Auth';
import useAuthSession from '../utils/AuthSession';
import '../styles/Landing.css';

const Header = ({ className = '' }) => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setUserRole(getRoleFromToken());
    }, []);

    const handleLogout = useAuthSession(setUserRole, setDropdownOpen);

    return (
        <header className={`landing-header ${className}`}>
            <div className="landing-logo" onClick={() => navigate('/')}>travelpoints</div>
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
                                    <div className="dropdown-item" onClick={() => navigate('/profile')}>Profile</div>
                                    <div className="dropdown-item" onClick={() => navigate('/wishlist')}>Wishlist</div>
                                    <div className="dropdown-item" onClick={() => navigate('/account')}>Account</div>
                                    <div className="dropdown-item" onClick={() => navigate('/offers')}>My Offers</div>
                                </>
                            )}
                            <div className="dropdown-item" onClick={handleLogout}>
                                <FaSignOutAlt style={{marginRight: '8px'}}/> Logout
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;








