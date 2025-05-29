import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  const statsCards = [
    { title: "Total Bookings", count: 7850, color: "blue" },
    { title: "Total Customers", count: 4321, color: "green" },
    { title: "Total Revenue", count: "₹12.3L", color: "yellow" },
    { title: "Active Shipments", count: 98, color: "blue" },
    { title: "Pending Payments", count: 56, color: "red" },
    { title: "Open Tickets", count: 17, color: "yellow" },
  ];

  const bookingTrends = [
    { date: "Mon", bookings: 120 },
    { date: "Tue", bookings: 98 },
    { date: "Wed", bookings: 110 },
    { date: "Thu", bookings: 87 },
    { date: "Fri", bookings: 140 },
    { date: "Sat", bookings: 105 },
    { date: "Sun", bookings: 90 },
  ];

  const serviceTypes = [
    { name: "Standard", value: 400 },
    { name: "Express", value: 300 },
    { name: "Overnight", value: 200 },
    { name: "International", value: 100 },
  ];

  const branchPerformance = [
    { branch: "Guwahati", bookings: 400, revenue: 75000 },
    { branch: "Mumbai", bookings: 350, revenue: 68000 },
    { branch: "Delhi", bookings: 300, revenue: 62000 },
  ];

  const topCustomers = [
    { name: "Amit Traders", spending: 120000 },
    { name: "S.K. Logistics", spending: 98000 },
    { name: "Urban Mart", spending: 87000 },
  ];

  const deliveryStatus = [
    { status: "Delivered", count: 450 },
    { status: "In Transit", count: 120 },
    { status: "Pending", count: 30 },
    { status: "Cancelled", count: 14 },
  ];

  const activities = [
    "Booking #12345 created by Amit Traders",
    "Payment received for Booking #12342",
    "Support ticket opened by Urban Mart",
    "Shipment #TRK456 out for delivery",
  ];

  const trackingData = {
    TRK123: {
      id: "TRK123",
      location: "Siliguri Hub",
      status: "In Transit",
      eta: "28 May, 2025 - 5:30 PM",
    },
    TRK456: {
      id: "TRK456",
      location: "Kolkata Distribution Center",
      status: "Out for Delivery",
      eta: "26 May, 2025 - 2:00 PM",
    },
    TRK789: {
      id: "TRK789",
      location: "Delivered in Guwahati",
      status: "Delivered",
      eta: "25 May, 2025 - 10:45 AM",
    },
  };

  const handleTrack = (e) => {
    e.preventDefault();
    const id = trackingId.trim().toUpperCase();
    const info = trackingData[id];
    if (info) {
      setTrackingInfo(info);
      setModalError("");
    } else {
      setTrackingInfo(null);
      setModalError(`No tracking information found for "${id}"`);
    }
    setModalOpen(true);
    setTrackingId("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalError("");
    setTrackingInfo(null);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Courier Dashboard</h1>
        <p>Business insights and real-time tracking</p>
      </header>

      <section className="cards-grid">
        {statsCards.map((card, idx) => (
          <div key={idx} className={`card card-${card.color}`}>
            <div className="card-title">{card.title}</div>
            <div className="card-count">{card.count}</div>
          </div>
        ))}
      </section>

      <section className="tracking-section">
        <h2>Live Tracking</h2>
        <div className="tracking-inputs">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. TRK123)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack(e)}
            className="tracking-input"
          />
          <button onClick={handleTrack} className="track-button">
            Track
          </button>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-box">
          <h2>Daily Booking Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#4F46E5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Service Type Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={serviceTypes}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {serviceTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Branch Revenue Comparison</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={branchPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="branch" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#10B981" name="Bookings" />
              <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Delivery Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="modal-close-button">
              &times;
            </button>
            {trackingInfo ? (
              <>
                <h3>Tracking Details</h3>
                <p><strong>Tracking ID:</strong> {trackingInfo.id}</p>
                <p><strong>Location:</strong> {trackingInfo.location}</p>
                <p><strong>Status:</strong> {trackingInfo.status}</p>
                <p><strong>ETA:</strong> {trackingInfo.eta}</p>
              </>
            ) : (
              <p className="error-text">{modalError}</p>
            )}
          </div>
        </div>
      )}

      <section className="activity-section">
        <h2>Recent Activities</h2>
        <ul className="activity-list">
          {activities.map((item, idx) => (
            <li key={idx} className="activity-item">{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
