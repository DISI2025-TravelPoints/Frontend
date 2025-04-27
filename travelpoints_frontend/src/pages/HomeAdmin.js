import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllAttractions } from '../requests/AdminRequests';

import '../styles/HomeAdmin.css'; 
const HomeAdmin = () => {

    // based on the selected setting, we will show the corresponding component
    const [selectedSetting, setSelectedSetting] = useState("attractions");
    const [data, setData] = useState([]);
    useEffect(()=>{
        switch(selectedSetting){
            case "users":
                break;
            case "attractions":
                setData(getAllAttractions());
                break;
            case "reviews":
                break;
        }
    },[selectedSetting]);

    return (
        <>
            <div className="admin-sidebar-container">
                <div className="admin-sidebar">
                    <h2>Admin Menu</h2>
                    <ul>
                        <hr></hr>
                        <button className = "admin-button"
                        onClick={() => setSelectedSetting("users")}>
                            Manage Users
                        </button>
                        <hr></hr>
                        <button
                         className = "admin-button"
                         onClick={() => setSelectedSetting("attractions")}>
                            Manage Attractions
                        </button>
                        <hr></hr>
                        <button className = "admin-button"
                         onClick={() => setSelectedSetting("reviews")}>
                            Manage Reviews
                        </button>
                        <hr></hr>
                    </ul>
                </div>
               
            </div>
            <div className="admin-content">
            </div>
        </>
    );
}

export default HomeAdmin;
