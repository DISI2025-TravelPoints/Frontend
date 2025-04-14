import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from "./pages/LandingPage";
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './utils/RequireAuth';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pagina principala MOMENTAN*/}
                <Route path="/" element={<LandingPage/>} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<LandingPage />} />

                {/*<Route path="/wishlist" element={*/}
                {/*    <RequireAuth allowedRoles={['Tourist']}>*/}
                {/*        <Wishlist />*/}
                {/*    </RequireAuth>*/}
                {/*} />               */}
                <Route path="/unauthorized" element={<Unauthorized />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;