import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import '../styles/finalDestination.css';

const FinalDestinationPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [shipmentDetails, setShipmentDetails] = useState(null);
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFinalDestinations();
      if (response.data && response.data.data) {
        setDestinations(response.data.data);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching destinations:', err);
      setError('Failed to fetch destinations. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchShipmentDetails = async (destinationId) => {
    try {
      setLoading(true);
      const response = await apiService.getShipmentsByDestination(destinationId);
      if (response.data && response.data.data) {
        setShipmentDetails(response.data.data);
        setShowShipmentDetails(true);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching shipment details:', err);
      setError('Failed to fetch shipment details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    fetchShipmentDetails(destination.id);
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'active': 'active',
      'inactive': 'inactive',
      'pending': 'pending'
    };
    return statusMap[status.toLowerCase()] || 'active';
  };

  const getShipmentStatusBadgeClass = (status) => {
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
      <div className="destinations-container">
        <div className="loading">Loading destinations...</div>
      </div>
    );
  }

  return (
    <div className="destinations-container">
      <header className="destinations-header">
        <h1>Final Destinations</h1>
        <p>View delivery destinations and their related shipments</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="destinations-controls">
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Destinations</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="destinations-table-container">
        {destinations.length === 0 ? (
          <p className="no-destinations">No destinations found.</p>
        ) : (
          <table className="destinations-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {destinations.map((destination) => (
                <tr 
                  key={destination.id}
                  onClick={() => handleDestinationClick(destination)}
                  className="destination-row"
                >
                  <td>{destination.name}</td>
                  <td>{destination.address}</td>
                  <td>{destination.city}</td>
                  <td>{destination.state}</td>
                  <td>{destination.type}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(destination.status)}`}>
                      {destination.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showShipmentDetails && shipmentDetails && (
        <div className="shipment-details-container">
          <h2>Shipment Details for {selectedDestination?.name}</h2>
          <div className="shipment-details">
            <table className="shipments-table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Origin Branch</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Delivery Date</th>
                  <th>Package Details</th>
                </tr>
              </thead>
              <tbody>
                {shipmentDetails.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>{shipment.tracking_number}</td>
                    <td>{shipment.origin_branch}</td>
                    <td>
                      <span className={`status-badge ${getShipmentStatusBadgeClass(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td>{new Date(shipment.created_at).toLocaleDateString()}</td>
                    <td>{shipment.delivery_date ? new Date(shipment.delivery_date).toLocaleDateString() : 'Pending'}</td>
                    <td>
                      <div className="package-details">
                        <p><strong>Type:</strong> {shipment.package_type}</p>
                        <p><strong>Weight:</strong> {shipment.weight} kg</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            className="close-shipment-details-btn"
            onClick={() => setShowShipmentDetails(false)}
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalDestinationPage;
