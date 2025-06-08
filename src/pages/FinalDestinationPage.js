import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import '../styles/finalDestination.css';

const FinalDestinationPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [availableExecutives, setAvailableExecutives] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showExecutiveModal, setShowExecutiveModal] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [currentBranchId, setCurrentBranchId] = useState(null);
  const [selectedExecutive, setSelectedExecutive] = useState(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('User Data:', userData);
        
        if (!userData.branch || !userData.branch.branch_id) {
          setError('Branch ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        setCurrentBranchId(userData.branch.branch_id);
        await fetchShipments(userData.branch.branch_id);
      } catch (err) {
        console.error('Error initializing page:', err);
        setError('Failed to initialize page. Please refresh.');
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  const fetchShipments = async (branchId) => {
    try {
      setLoading(true);
      console.log('Fetching shipments for branch:', branchId);
      
      const response = await apiService.getAllShipments();
      console.log('API Response:', response);

      if (!response?.data?.data) {
        throw new Error('Invalid response format from server');
      }

      // Filter shipments for the current branch that are pending or in transit
      const branchShipments = response.data.data.filter(shipment => 
        shipment.destination_branch_id === branchId && 
        (shipment.status === 'pending' || shipment.status === 'in_transit')
      );

      console.log('Filtered shipments:', branchShipments);
      setShipments(branchShipments);
      setError('');
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError(err.message || 'Failed to fetch shipments. Please try again later.');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignExecutive = async (shipment) => {
    try {
      setSelectedShipment(shipment);
      const response = await apiService.getAvailableExecutives(currentBranchId);
      if (response.data && response.data.data) {
        setAvailableExecutives(response.data.data);
        setShowExecutiveModal(true);
      } else {
        setError('No executives available');
      }
    } catch (err) {
      console.error('Error fetching executives:', err);
      setError('Failed to fetch available executives');
    }
  };

  const handleExecutiveSelection = (executive) => {
    setSelectedExecutive(executive);
  };

  const handleExecutiveAssignment = async () => {
    try {
      if (!selectedShipment || !selectedExecutive) {
        setError('Please select a field executive');
        return;
      }

      const response = await apiService.assignExecutive(selectedShipment.id, selectedExecutive.id);
      if (response.data && response.data.status === 'success') {
        await fetchShipments(currentBranchId);
        setShowExecutiveModal(false);
        setSelectedExecutive(null);
        setError('');
      } else {
        setError(response.data.message || 'Failed to assign executive');
      }
    } catch (err) {
      console.error('Error assigning executive:', err);
      setError('Failed to assign executive');
    }
  };

  const handleAssignAndOutForDelivery = async () => {
    try {
      if (!selectedShipment || !selectedExecutive) {
        setError('Please select a field executive');
        return;
      }

      console.log('Assigning executive:', {
        shipmentId: selectedShipment.id,
        executiveId: selectedExecutive.id
      });

      // First assign the executive
      const assignResponse = await apiService.assignExecutive(selectedShipment.id, selectedExecutive.id);
      console.log('Assign executive response:', assignResponse);

      if (!assignResponse.data) {
        throw new Error('Invalid response from assign executive API');
      }

      if (assignResponse.data.status === 'success' || assignResponse.data.success) {
        console.log('Executive assigned successfully, updating to out for delivery');
        
        // Then mark as out for delivery
        const deliveryResponse = await apiService.updateToOutForDelivery(selectedShipment.id);
        console.log('Out for delivery response:', deliveryResponse);

        if (!deliveryResponse.data) {
          throw new Error('Invalid response from out for delivery API');
        }

        if (deliveryResponse.data.status === 'success' || deliveryResponse.data.success) {
          console.log('Successfully updated to out for delivery');
          await fetchShipments(currentBranchId);
          setShowExecutiveModal(false);
          setSelectedExecutive(null);
          setError('');
        } else {
          throw new Error(deliveryResponse.data.message || 'Failed to update delivery status');
        }
      } else {
        throw new Error(assignResponse.data.message || 'Failed to assign executive');
      }
    } catch (err) {
      console.error('Error in assign and out for delivery:', err);
      setError(err.message || 'Failed to process request. Please try again.');
    }
  };

  const handleOutForDelivery = async (shipmentId) => {
    try {
      const response = await apiService.updateToOutForDelivery(shipmentId);
      if (response.data && response.data.status === 'success') {
        await fetchShipments(currentBranchId);
        setError('');
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleDelivered = async (shipmentId) => {
    try {
      const response = await apiService.updateToDelivered(shipmentId, deliveryNotes);
      if (response.data.status === 'success') {
        await fetchShipments(currentBranchId);
        setDeliveryNotes('');
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'active': 'active',
      'inactive': 'inactive',
      'pending': 'pending',
      'out_for_delivery': 'out-for-delivery',
      'delivered': 'delivered'
    };
    return statusMap[status?.toLowerCase()] || 'pending';
  };

  if (loading) {
    return (
      <div className="destinations-container">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinations-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="refresh-button">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="destinations-container">
      <header className="destinations-header">
        <h1>Final Destination Shipments</h1>
        <p>Manage shipments at final destination and assign field executives</p>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      <div className="destinations-controls">
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Shipments</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
          </select>
        </div>
      </div>

      {!loading && shipments.length === 0 ? (
        <div className="no-data-message">
          <p>No shipments found.</p>
          <button onClick={() => fetchShipments(currentBranchId)} className="refresh-button">
            Refresh
          </button>
        </div>
      ) : (
        <div className="shipments-table-container">
          <table className="shipments-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Origin Branch</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Delivery Date</th>
                <th>Package Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.tracking_number}</td>
                  <td>{shipment.origin_branch || 'N/A'}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>{shipment.created_at ? new Date(shipment.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td>{shipment.estimated_delivery_date ? new Date(shipment.estimated_delivery_date).toLocaleDateString() : 'Pending'}</td>
                  <td>
                    <div className="package-details">
                      <p><strong>Type:</strong> {shipment.package_type || 'N/A'}</p>
                      <p><strong>Weight:</strong> {shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
                      <p><strong>Description:</strong> {shipment.description || 'N/A'}</p>
                    </div>
                  </td>
                  <td>
                    <div className="shipment-actions">
                      {!shipment.executive_id && (
                        <button 
                          className="action-btn assign-btn"
                          onClick={() => handleAssignExecutive(shipment)}
                        >
                          Assign Executive
                        </button>
                      )}
                      {shipment.executive_id && shipment.status === 'pending' && (
                        <button 
                          className="action-btn out-for-delivery-btn"
                          onClick={() => handleOutForDelivery(shipment.id)}
                        >
                          Out For Delivery
                        </button>
                      )}
                      {shipment.status === 'out_for_delivery' && (
                        <button 
                          className="action-btn delivered-btn"
                          onClick={() => handleDelivered(shipment.id)}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showExecutiveModal && selectedShipment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Field Executive</h3>
            
            <div className="shipment-details-section">
              <h4>Shipment Details</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Tracking Number:</label>
                  <span>{selectedShipment.tracking_number}</span>
                </div>
                <div className="detail-item">
                  <label>Package Type:</label>
                  <span>{selectedShipment.package_type || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Weight:</label>
                  <span>{selectedShipment.weight ? `${selectedShipment.weight} kg` : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <label>Description:</label>
                  <span>{selectedShipment.description || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="delivery-address-section">
              <h4>Delivery Address</h4>
              <div className="address-details">
                <p>{selectedShipment.delivery_address || 'N/A'}</p>
                <p>{selectedShipment.delivery_city || 'N/A'}, {selectedShipment.delivery_state || 'N/A'}</p>
                <p>Pincode: {selectedShipment.delivery_pincode || 'N/A'}</p>
              </div>
            </div>

            <div className="executive-selection-section">
              <h4>Select Field Executive</h4>
              {availableExecutives.length === 0 ? (
                <p className="no-executives">No executives available</p>
              ) : (
                <div className="executive-list">
                  {availableExecutives.map(executive => (
                    <div 
                      key={executive.id} 
                      className={`executive-item ${selectedExecutive?.id === executive.id ? 'selected' : ''}`}
                      onClick={() => handleExecutiveSelection(executive)}
                    >
                      <div className="executive-info">
                        <p><strong>Name:</strong> {executive.first_name} {executive.last_name}</p>
                        <p><strong>Phone:</strong> {executive.phone}</p>
                        <p><strong>Status:</strong> {executive.status || 'Available'}</p>
                      </div>
                      <div className="executive-selection-indicator">
                        {selectedExecutive?.id === executive.id && (
                          <span className="selected-icon">✓</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="action-btn submit-btn"
                onClick={handleAssignAndOutForDelivery}
                disabled={!selectedExecutive}
              >
                Assign and Make Out for Delivery
              </button>
              <button 
                className="close-modal-btn"
                onClick={() => {
                  setShowExecutiveModal(false);
                  setSelectedExecutive(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalDestinationPage;
