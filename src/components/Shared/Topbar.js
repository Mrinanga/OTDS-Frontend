import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { useUser } from "../../contexts/UserContext";
import "../../styles/topbar.css";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const { userDetails, clearUserDetails } = useUser();

  // Add useEffect to log user context data
  useEffect(() => {
    console.log('UserContext Data:', {
      userDetails,
      isAuthenticated: userDetails !== null,
      branchInfo: userDetails?.branch,
      fullUserData: userDetails
    });
  }, [userDetails]);

  const handleLogout = () => {
    // Clear user details using UserContext
    clearUserDetails();
    // Reset authentication state
    setIsAuthenticated(false);
    setRole(null);
    // Close the dropdown
    setShowDropdown(false);
    // Redirect to root route
    navigate("/", { replace: true });
  };

  // Log when dropdown is toggled
  const handleDropdownToggle = () => {
    console.log('Dropdown Toggled:', {
      currentState: showDropdown,
      userDetails: userDetails
    });
    setShowDropdown(!showDropdown);
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
            onClick={handleDropdownToggle}
          />
          {showDropdown && (
            <div className="user-dropdown">
              <div className="user-info">
                <img src="./assets/avatar.png" alt="Admin" className="dropdown-avatar" />
                <div className="user-details">
                  <h4>OTDS-Manager</h4>
                  <p>Administrator</p>
                  {userDetails?.branch && (
                    <div className="branch-details">
                      <h5>Branch Information</h5>
                      <p><strong>Branch Name:</strong> {userDetails.branch.branch_name}</p>
                      <p><strong>Location:</strong> {userDetails.branch.city}, {userDetails.branch.state}</p>
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
