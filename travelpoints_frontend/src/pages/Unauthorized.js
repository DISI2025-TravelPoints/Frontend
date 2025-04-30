import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="unauth-wrapper">
            <h1>Acces neautorizat 🚫</h1>
            <p>Nu ai permisiunea să accesezi această pagină.</p>
            <button className="unauth-btn" onClick={() => navigate('/')}>
                Înapoi la pagina principală
            </button>
        </div>
    );
};

export default Unauthorized;
