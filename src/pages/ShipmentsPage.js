import React, { useState, useEffect } from 'react';
import "../styles/shipments.css";
import apiService from '../services/api.service';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, in-transit, delivered

  useEffect(() => {
    fetchShipments();
  }, [filter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBookings();
      setShipments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    try {
      await apiService.updateBooking(shipmentId, { status: newStatus });
      // Refresh the shipments list
      fetchShipments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipment status');
    }
  };

  const handleDelete = async (shipmentId) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await apiService.deleteBooking(shipmentId);
        // Refresh the shipments list
        fetchShipments();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete shipment');
      }
    }
  };

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
