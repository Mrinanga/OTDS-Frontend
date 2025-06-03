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
      const response = filter === 'all' 
        ? await apiService.getAllShipments()
        : await apiService.getFilteredShipments(filter);
      
      if (response.data && response.data.data) {
        setShipments(response.data.data);
      } else {
        setShipments([]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shipments');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    try {
      await apiService.updateShipmentStatus(shipmentId, newStatus);
      // Refresh the shipments list
      fetchShipments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipment status');
    }
  };

  const handleDelete = async (shipmentId) => {
    if (window.confirm('Are you sure you want to cancel this shipment?')) {
      try {
        await apiService.deleteShipment(shipmentId);
        // Refresh the shipments list
        fetchShipments();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel shipment');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'pending': 'pending',
      'in-transit': 'in-transit',
      'delivered': 'delivered',
      'cancelled': 'cancelled'
    };
    return statusMap[status.toLowerCase()] || 'pending';
  };

  if (loading) {
    return (
      <div className="shipments-container">
        <div className="loading">Loading shipments...</div>
      </div>
    );
  }

  return (
    <div className="shipments-container">
      <header className="shipments-header">
        <h1>Shipment Overview</h1>
        <p>Track and manage all your courier shipments</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-controls">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Shipments</option>
          <option value="pending">Pending</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="shipments-table-container">
        {shipments.length === 0 ? (
          <p className="no-shipments">No shipments found.</p>
        ) : (
          <table className="shipments-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Origin Branch</th>
                <th>Destination Branch</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.shipment_id}>
                  <td>{shipment.tracking_number}</td>
                  <td>{shipment.origin_branch}</td>
                  <td>{shipment.destination_branch}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {shipment.status === 'pending' && (
                      <>
                        <button 
                          className="action-button update"
                          onClick={() => handleStatusUpdate(shipment.shipment_id, 'in-transit')}
                        >
                          Start Transit
                        </button>
                        <button 
                          className="action-button delete"
                          onClick={() => handleDelete(shipment.shipment_id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {shipment.status === 'in-transit' && (
                      <button 
                        className="action-button update"
                        onClick={() => handleStatusUpdate(shipment.shipment_id, 'delivered')}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ShipmentsPage;
