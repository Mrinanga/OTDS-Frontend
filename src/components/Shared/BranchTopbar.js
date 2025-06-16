import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import "../../styles/topbar.css";

const BranchTopbar = () => {
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
      <div className="topbar-left">
        OTDS Branch Panel
        {user.branch && (
          <span className="branch-info">
            - {user.branch.branch_name} ({user.branch.city})
          </span>
        )}
      </div>
      <div className="topbar-right">
        <span className="topbar-user">
          {user.first_name} {user.last_name}
        </span>
        <div className="avatar-container">
          <img 
            src="./assets/avatar.png" 
            alt="Branch Manager" 
            className="topbar-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info">
                <img src="./assets/avatar.png" alt="Branch Manager" className="dropdown-avatar" />
                <div className="user-details">
                  <h4>{user.first_name} {user.last_name}</h4>
                  <p>Branch Manager</p>
                  {user.branch && (
                    <p className="branch-details">
                      {user.branch.branch_name}<br />
                      {user.branch.city}, {user.branch.state}
                    </p>
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

export default BranchTopbar;
