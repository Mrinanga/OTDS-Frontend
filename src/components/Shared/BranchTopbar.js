import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/topbar.css";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    // Close the dropdown
    setShowDropdown(false);
    // Redirect to root route
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">OTDS Branch Panel</div>
      <div className="topbar-right">
        <span className="topbar-user">OTDS-Branch Manager</span>
        <div className="avatar-container">
          <img 
            src="./assets/avatar.png" 
            alt="Admin" 
            className="topbar-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info">
                <img src="./assets/avatar.png" alt="Admin" className="dropdown-avatar" />
                <div className="user-details">
                  <h4>OTDS-Branch Manager</h4>
                  <p>Branch Administrator</p>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
