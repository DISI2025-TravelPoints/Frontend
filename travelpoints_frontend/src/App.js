import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomeTourist from './pages/HomeTourist';
import HomeAdmin from './pages/HomeAdmin';
import Register from './pages/Register';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pagina principala MOMENTAN*/}
                <Route path="/" element={<Register />} />

                <Route path="/sign-up" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home-user" element={<HomeTourist />} />
                <Route path="/home-admin" element={<HomeAdmin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;