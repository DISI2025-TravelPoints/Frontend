import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomeAdmin from './pages/HomeAdmin';

import CreateAttraction from './components/CreateAttraction';
import UpdateAttraction from './components/UpdateAttraction'; 
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* pagina principala MOMENTAN*/}
                
                <Route path="/home-admin" element={<HomeAdmin />}/>
                <Route path="/create-attraction" element={<CreateAttraction />} />
                <Route path="/update-attraction/:attractionId" element={<UpdateAttraction />} />

          

            </Routes>
        </BrowserRouter>
    );
}

export default App;