import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaTruck, FaLifeRing, FaClipboardList, FaBoxOpen, FaUsers, FaCalculator, FaMapMarkedAlt, FaFileInvoiceDollar, FaBell, FaChartBar, FaCog } from "react-icons/fa";
import "../../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">OTDS Courier</div>
      <nav className="sidebar-nav sidebar-scrollable">
        <NavLink to="/" className="sidebar-link"><FaTachometerAlt /> Dashboard</NavLink>
        <NavLink to="/bookingcourier" className="sidebar-link"><FaTruck /> Book a Courier</NavLink>
        <NavLink to="/pickup-requests" className="sidebar-link"><FaClipboardList /> Pickup Requests</NavLink>
        <NavLink to="/shipments" className="sidebar-link"><FaBoxOpen /> Shipments</NavLink>
        <NavLink to="/finaldestination" className="sidebar-link"><FaLifeRing /> Final Destination</NavLink>
        <NavLink to="/customers" className="sidebar-link"><FaUsers /> Customers</NavLink>
        <NavLink to="/ratecalculator" className="sidebar-link"><FaCalculator /> Rate Calculator</NavLink>
        <NavLink to="/zones" className="sidebar-link"><FaMapMarkedAlt /> Zones & Routes</NavLink>
        <NavLink to="/billing" className="sidebar-link"><FaFileInvoiceDollar /> Billing</NavLink>
        <NavLink to="/notifications" className="sidebar-link"><FaBell /> Notifications</NavLink>
        <NavLink to="/reports" className="sidebar-link"><FaChartBar /> Reports</NavLink>
        <NavLink to="/settings" className="sidebar-link"><FaCog /> Settings</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
