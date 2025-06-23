import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import "../../styles/topbar.css";

const Topbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const { userDetails, clearUserDetails } = useUser();

  // Add useEffect to log user context data
  useEffect(() => {
    console.log('Topbar - UserContext Data:', {
      userDetails,
      authUser,
      isAuthenticated: userDetails !== null,
      branchInfo: userDetails?.branch,
      fullUserData: userDetails
    });
  }, [userDetails, authUser]);

  const handleLogout = () => {
    // Clear user details using UserContext
    clearUserDetails();
    // Use AuthContext logout
    logout();
    // Close the dropdown
    setShowDropdown(false);
    // Redirect to root route
    navigate("/", { replace: true });
  };

  // Log when dropdown is toggled
  const handleDropdownToggle = () => {
    console.log('Topbar - Dropdown Toggled:', {
      currentState: showDropdown,
      userDetails: userDetails,
      authUser: authUser
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
                  {/* Debug section - remove in production */}
                  <div style={{ marginTop: '10px', padding: '5px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                    <strong>Debug Info:</strong><br/>
                    UserContext: {userDetails ? 'Loaded' : 'Not loaded'}<br/>
                    AuthContext: {authUser ? 'Loaded' : 'Not loaded'}<br/>
                    User ID: {userDetails?.user_id || 'N/A'}<br/>
                    Role: {userDetails?.role || 'N/A'}
                  </div>
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
