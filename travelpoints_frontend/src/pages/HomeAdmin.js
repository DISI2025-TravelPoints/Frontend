import React from "react";
import { useNavigate } from "react-router-dom";
import { lazy, useState } from "react";
import { useEffect } from "react";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import "../styles/HomeAdmin.css";
import "../styles/Landing.css";
import useAuthSession from '../utils/AuthSession';
import { getEmailFromToken } from "../utils/Auth";

const HomeAdmin = () => {

  const AdminAttractionDashboard = lazy(() => import( '../components/admin/AdminAttractionDashboard'));
  const FrequencyGraph = lazy(()=>import('../components/admin/FrequencyGraph'));
  const AdminChats = lazy(()=>import('../components/admin/AdminChats'));
  // page/component state
  const [selectedSettingPage, setSelectedSettingPage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState("attractions");
  const navigate = useNavigate();

  const handleLogout = useAuthSession(null, setDropdownOpen);


  useEffect(() => {
    switch (selectedSetting) {
      case "visits":
         setSelectedSettingPage(<FrequencyGraph/>);
        break;
      case "attractions":
        setSelectedSettingPage(<AdminAttractionDashboard/>);
        break;
        case "chats":
        let email = getEmailFromToken(); // will be later passed to the chat-service to fetch unallocated chats or his own chats 
        setSelectedSettingPage(<AdminChats email={email}/>)
        break;
      case "reviews":
        break;
    }
  }, [selectedSetting]);

  //TODO return the created instance to update the table for a faster experience

  const settingNames = {
    visits: "Manage Visit Frequency",
    attractions: "Manage Attractions",
    reviews: "Manage Reviews",
    chats: "Chats"
  };

  return (
    <>
      <header className="landing-header-with-breadcrumbs">
        <div className="admin-breadcrumb">
          <span className="breadcrumb-root">Dashboard</span>
          <span className="breadcrumb-separator"> &gt; </span>
          <span className="breadcrumb-current">
            {settingNames[selectedSetting]}
          </span>
        </div>

        <div style={{ position: "relative" }}>
          <FaUserCircle
            className="landing-avatar"
            style={{ fontSize: "40px", color: "#2e6a5a", cursor: "pointer" }}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="landing-dropdown">
              <>
                <div className="dropdown-item" onClick={() => navigate("/")}>
                  Home
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setSelectedSetting("attractions")}
                >
                  Manage Attraction
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setSelectedSetting("reviews")}
                >
                  Manage Reviews
                </div>
                <div className = "dropdown-item" onClick={()=>setSelectedSetting("chats")}>
                  Chats
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => setSelectedSetting("visits")} // might need to change name
                >
                  Manage Visits 
                </div>
              </>

              <div className="dropdown-item" onClick={handleLogout}>
                <FaSignOutAlt style={{ marginRight: "8px" }} />
                Logout
              </div>
            </div>
          )}
        </div>
      </header>
      <div className="admin-content">
          {selectedSettingPage}
      </div>
    </>
  );
};

export default HomeAdmin;
