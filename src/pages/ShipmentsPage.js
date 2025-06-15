import React, { useState, useEffect } from 'react';
import "../styles/shipments.css";
import apiService from '../services/api.service';
import generateShipmentLabel from '../utils/labelGenerator';
import { 
    IconButton, 
    Menu, 
    MenuItem, 
    Button,
    Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PrintIcon from '@mui/icons-material/Print';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const ShipmentsPage = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, in-transit, delivered
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedShipment, setSelectedShipment] = useState(null);

  useEffect(() => {
    fetchShipments();
  }, [filter]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const response = filter === 'all' 
        ? await apiService.getAllShipments()
        : await apiService.getFilteredShipments(filter);
      
      console.log('Raw API response in fetchShipments:', response);

      if (response.data && response.data.data) {
        setShipments(response.data.data);
        console.log('Shipments fetched:', response.data.data);
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

  const handleMenuOpen = (event, shipment) => {
    setAnchorEl(event.currentTarget);
    setSelectedShipment(shipment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedShipment(null);
  };

  const handlePrintLabel = async (shipmentId) => {
    try {
      // Fetch full shipment details before generating label
      const response = await apiService.getShipmentById(shipmentId);
      
      // response.data is now expected to be the single shipment object directly
      const fullShipmentData = response.data;

      // Log the full shipment data to the console for inspection
      console.log('Full Shipment Data for Label:', fullShipmentData);

      if (!fullShipmentData) {
        setError('Shipment data not found.');
        return;
      }

      const doc = generateShipmentLabel(fullShipmentData);
      const blob = new Blob([doc.output('blob')], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            URL.revokeObjectURL(url); // Clean up the object URL
          }, 1000); // Give it a moment to render
        };
      } else {
        // Fallback for pop-up blockers
        alert('Please allow pop-ups for this site to print the label.');
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error generating or printing label:', err);
      setError(err.response?.data?.message || 'Failed to generate or print label.');
    }
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
                <tr key={shipment.id}>
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
                    <div className="action-buttons">
                      <Tooltip title="Print Label">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<PrintIcon />}
                          onClick={() => handlePrintLabel(shipment.shipment_id)}
                          className="action-button print"
                        >
                          Print Label
                        </Button>
                      </Tooltip>

                      {shipment.status === 'pending' && (
                        <Tooltip title="Start Transit">
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<LocalShippingIcon />}
                            onClick={() => handleStatusUpdate(shipment.shipment_id, 'in-transit')}
                            className="action-button update"
                          >
                            Start Transit
                          </Button>
                        </Tooltip>
                      )}

                      <Tooltip title="More Options">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, shipment)}
                          className="more-options-button"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="shipment-options-menu"
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          // Add view details handler
        }}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          // Add edit shipment handler
        }}>
          Edit Shipment
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          // Add track shipment handler
        }}>
          Track Shipment
        </MenuItem>
        {selectedShipment?.status === 'pending' && (
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              handleDelete(selectedShipment.shipment_id);
            }}
            className="delete-option"
          >
            Cancel Shipment
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default ShipmentsPage;
