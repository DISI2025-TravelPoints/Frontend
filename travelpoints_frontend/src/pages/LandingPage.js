import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useWebSocket } from "../utils/WebSocketContext";
import "../styles/Landing.css";
import { getRoleFromToken } from "../utils/Auth";
import backgroundImage from "../assets/background0.png";
import Destinations from "./Destinations";
import useAuthSession from "../utils/AuthSession";
import GeoLocation from "../utils/GeoLocation";
import Header from "../components/Header";
import SearchBar from "../components/common/SearchBar";


const Landing = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userGeohash, setUserGeohash] = useState(null);
  const stompClientRef = useWebSocket();


  useEffect(() => {
    setUserRole(getRoleFromToken());
  }, []);

  // commented this because when in admin-dashboard we can't go back to the home page

  // useEffect(() => {
  //          const role = getRoleFromToken();
  //           setUserRole(role);
  //          if (role === 'Admin') {
  //                 navigate('/home-admin');
  //              } else if (role === 'Tourist') {
  //                 //sau putem duce turistii la profil
  //                    navigate('/');
  //              }
  //         }, [navigate]);


  useEffect(() => {
    if(userRole==='Admin'){ //handles room creation notification
      stompClientRef.current.subscribe("/notification/admin", (msg) => {
        console.log("notification: ", msg.body);
      });
    }

    //basic message notification 
    stompClientRef.current.subscribe("/notification/messages", (msg)=>{
      console.log("message notification: ", msg.body);
    })
  }, []);

  const handleLogout = useAuthSession(setUserRole, setDropdownOpen);

  return (
    <div className="landing-page">
      <Header />
      {/* HERO SECTION */}
      <div
        className="landing-hero"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="landing-title">Explore the world with a smile</h1>
        <p className="landing-text">
          Discover the most spectacular tourist attractions around the world.
          <br />
          Search, save, and explore.
        </p>
      </div>

      <div className="section-header">
        <h4 className="subtitle">Attractions nearby</h4>
        <h2 className="title">Start the journey from where you are</h2>
      </div>

      <SearchBar />
      <div className="landing-map">
        <GeoLocation setUserGeohash={setUserGeohash} />
      </div>

      {/* DESTINATIONS SECTION */}
      <div
        className="destinations-section"
        style={{ background: "#f8f8f8", padding: "60px 20px" }}
      >
        <Destinations />
      </div>
      
    </div>
  );
};

export default Landing;
