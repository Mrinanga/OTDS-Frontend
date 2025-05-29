import React from "react";
import "../styles/shipments.css";

const shipments = [
  {
    id: "SHP1001",
    origin: "Mumbai",
    destination: "Delhi",
    status: "In Transit",
    date: "2025-05-13",
  },
  {
    id: "SHP1002",
    origin: "Guwahati",
    destination: "Kolkata",
    status: "Delivered",
    date: "2025-05-12",
  },
  {
    id: "SHP1003",
    origin: "Bangalore",
    destination: "Chennai",
    status: "Delayed",
    date: "2025-05-11",
  },
  {
    id: "SHP1004",
    origin: "Ahmedabad",
    destination: "Hyderabad",
    status: "Pending Pickup",
    date: "2025-05-14",
  },
];

const ShipmentsPage = () => {
  return (
    <div className="shipments-container">
      <header className="shipments-header">
        <h1>Shipment Overview</h1>
        <p>Track and manage all your courier shipments</p>
      </header>

      <div className="shipments-table-container">
        <table className="shipments-table">
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>{shipment.origin}</td>
                <td>{shipment.destination}</td>
                <td>
                  <span className={`status-badge ${shipment.status.replace(" ", "-").toLowerCase()}`}>
                    {shipment.status}
                  </span>
                </td>
                <td>{shipment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentsPage;
