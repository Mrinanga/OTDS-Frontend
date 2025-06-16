import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import "../../styles/topbar.css";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    // Reset authentication state
    setIsAuthenticated(false);
    setRole(null);
    // Close the dropdown
    setShowDropdown(false);
    // Redirect to root route
    navigate("/", { replace: true });
  };

  return (
    <div className="topbar">
      <div className="topbar-left">OTDS Admin Panel</div>
      <div className="topbar-right">
        <span className="topbar-user">OTDS-Manager</span>
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
                  <h4>OTDS-Manager</h4>
                  <p>Administrator</p>
                  {user.branch && (
                    <div className="branch-details">
                      <h5>Branch Information</h5>
                      <p><strong>Branch Name:</strong> {user.branch.branch_name}</p>
                      {/* <p><strong>Branch Manager:</strong> {user.branch.manager_first_name} {user.branch.manager_last_name}</p> */}
                      {/* <p><strong>Address:</strong> {user.branch.address}</p> */}
                      <p><strong>Location:</strong> {user.branch.city}, {user.branch.state}</p>
                    </div>
                  )}
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
