import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaLifeRing, FaTruck, FaClipboardList, FaBoxOpen, FaUsers, FaCalculator, FaMapMarkedAlt, FaFileInvoiceDollar, FaBell, FaChartBar, FaCog } from "react-icons/fa";
import "../../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">OTDS Courier</div>
      <nav className="sidebar-nav sidebar-scrollable">
        <NavLink to="/" className="sidebar-link"><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="/dashboard-branch/bookings" className="sidebar-link"><FaTruck /> Book a Courier</NavLink>
        <NavLink to="/dashboard-branch/pickup-requests" className="sidebar-link"><FaClipboardList /> Pickup Requests</NavLink>
        <NavLink to="/dashboard-branch/shipments" className="sidebar-link"><FaBoxOpen /> Shipments</NavLink>
        <NavLink to="/dashboard-branch/finaldestination" className="sidebar-link"><FaBoxOpen /> Final Destination</NavLink>
        <NavLink to="/dashboard-branch/ratecalculator" className="sidebar-link"><FaCalculator /> Rate Calculator</NavLink>
        <NavLink to="/dashboard-branch/zones" className="sidebar-link"><FaMapMarkedAlt /> Zones & Routes</NavLink>
        <NavLink to="/dashboard-branch/billing" className="sidebar-link"><FaFileInvoiceDollar /> Billing</NavLink>
        {/* <NavLink to="/dashboard-branch/support" className="sidebar-link"><FaLifeRing /> Support Help</NavLink> */}
        <NavLink to="/dashboard-branch/notifications" className="sidebar-link"><FaBell /> Notifications</NavLink>
        <NavLink to="/dashboard-branch/reports" className="sidebar-link"><FaChartBar /> Reports</NavLink>
        <NavLink to="/dashboard-branch/settings" className="sidebar-link"><FaCog /> Settings</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
