import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../styles/Auth.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Navbar */}
            <header style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '20px 40px',
                borderBottom: '1px solid #ccc',
                backgroundColor: 'white',
                gap: '20px'
            }}>
                <div
                    onClick={() => navigate('/login')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#2e6a5a',
                        fontWeight: '500',
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}
                >
                    <FaUser style={{ marginRight: '8px' }} />
                    Login
                </div>

                <button
                    style={{
                        border: '2px solid #0a0a4f',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        background: 'transparent',
                        color: '#132316',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/register')}
                >
                    Sign up free
                </button>
            </header>

            {/* Landing Content */}
            <div className="auth-wrapper" style={{ justifyContent: 'center', padding: '80px 20px' }}>
                <div className="auth-content" style={{ textAlign: 'center', maxWidth: '700px' }}>
                    <h1 className="auth-title" style={{
                        fontSize: '56px',
                        color: '#2b2b2b',
                        textShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
                    }}>TravelPoints</h1>
                    <p style={{
                        color: '#333',
                        fontSize: '24px',
                        lineHeight: '1.6',
                        padding: '0 10px'
                    }}>
                        Discover the most spectacular tourist attractions in Romania and around the world. <br />
                        Search, save, and explore.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Landing;