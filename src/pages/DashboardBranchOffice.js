import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../styles/dashboard.css";

const DashboardPage = () => {
  const deliveryStats = [
    { day: "Mon", deliveries: 120 },
    { day: "Tue", deliveries: 98 },
    { day: "Wed", deliveries: 110 }, 
    { day: "Thu", deliveries: 87 },
    { day: "Fri", deliveries: 140 },
    { day: "Sat", deliveries: 105 },
    { day: "Sun", deliveries: 90 },
  ];

  const cards = [
    { title: "Total Deliveries", count: 3421, color: "blue" },
    { title: "Pending Orders", count: 98, color: "yellow" },
    { title: "On-Time %", count: "92%", color: "green" },
    { title: "Cancelled Orders", count: 14, color: "red" },
  ];

  const activities = [
    "Order #45321 delivered to Guwahati",
    "Shipment #98412 picked up in Mumbai",
    "Order #76123 delayed - route jammed",
    "New bulk order from Bangalore added",
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Courier Dashboard</h1>
        <p>Live monitoring and delivery insights</p>
      </header>

      <section className="cards-grid">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`card card-${card.color}`}
          >
            <div className="card-title">{card.title}</div>
            <div className="card-count">{card.count}</div>
          </div>
        ))}
      </section>

      <section className="dashboard-main">
        <div className="chart-section">
          <h2>Weekly Deliveries</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="activity-section">
          <h2>Recent Activities</h2>
          <ul className="activity-list">
            {activities.map((item, idx) => (
              <li key={idx} className="activity-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
