import React from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from "./pages/LandingPage";
import Unauthorized from './pages/Unauthorized';
import RequireAuth from './utils/RequireAuth';
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import HomeAdmin from './pages/HomeAdmin';

import CreateAttraction from './components/CreateAttraction';
import UpdateAttraction from './components/UpdateAttraction'; 

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pagina principala MOMENTAN*/}
                <Route path="/home-admin" element={<HomeAdmin />}/>
                <Route path="/create-attraction" element={<CreateAttraction />} />
                <Route path="/update-attraction/:attractionId" element={<UpdateAttraction />} />


                <Route path="/" element={<LandingPage/>} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/home-admin" element={<HomeAdmin />}/>
                <Route path="/create-attraction" element={<CreateAttraction />} />
                <Route path="/update-attraction/:attractionId" element={<UpdateAttraction />} />
                <Route path="/reset-pass" element={<ResetPassword />}/>
                <Route path="/forgot-pass" element={<ForgotPassword />}/>

                {/*<Route path="/wishlist" element={*/}
                {/*    <RequireAuth allowedRoles={['Tourist']}>*/}
                {/*        <Wishlist />*/}
                {/*    </RequireAuth>*/}
                {/*} />               */}
                <Route path="/unauthorized" element={<Unauthorized />}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;