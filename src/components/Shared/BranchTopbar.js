import React from "react";
import "../../styles/topbar.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">OTDS Branch Panel</div>
      <div className="topbar-right">
        <span className="topbar-user">OTDS-Branch Manager</span>
        <img src="./assets/avatar.png" alt="Admin" className="topbar-avatar" />
      </div>
    </div>
  );
};

export default Topbar;
