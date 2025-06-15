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

  const handlePrintLabel = async (shipment) => {
    try {
      console.log('Printing label for shipment:', shipment);
      
      // Get the label data using the new endpoint
      const response = await apiService.getLabelData(shipment.tracking_number);
      console.log('Label API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch label data');
      }

      const shipmentData = response.data;
      console.log('Raw shipment data:', shipmentData);

      if (!shipmentData) {
        throw new Error('No shipment data found');
      }

      // Map the data to match the label generator's expected structure
      const labelData = {
        trackingNumber: shipmentData.tracking_number || 'N/A',
        bookingNumber: shipmentData.booking_number || 'N/A',
        date: shipmentData.created_at ? new Date(shipmentData.created_at).toLocaleDateString() : 'N/A',
        shippingMode: shipmentData.shipping_mode || 'Surface',
        status: shipmentData.status || 'N/A',
        description: shipmentData.description || 'N/A',
        specialInstructions: shipmentData.special_instructions || 'N/A',
        
        // Origin Branch (keep for label generator as it expects it, even if N/A)
        originBranchName: shipmentData.origin_branch_name || 'N/A',
        originBranchAddress: shipmentData.origin_branch_address || 'N/A',
        originBranchCity: shipmentData.origin_branch_city || 'N/A',
        originBranchPincode: shipmentData.origin_branch_pincode || 'N/A',
        originBranchCode: shipmentData.origin_branch_code || 'N/A',
        
        // Destination Branch (keep for label generator as it expects it, even if N/A)
        destinationBranchName: shipmentData.destination_branch_name || 'N/A',
        destinationBranchAddress: shipmentData.destination_branch_address || 'N/A',
        destinationBranchCity: shipmentData.destination_branch_city || 'N/A',
        destinationBranchPincode: shipmentData.destination_branch_pincode || 'N/A',
        destinationBranchCode: shipmentData.destination_branch_code || 'N/A',
        
        // Recipient (keep for label generator as it expects it, even if N/A)
        recipientName: shipmentData.recipient_customer_name || 'N/A',
        recipientPhone: shipmentData.recipient_phone || 'N/A',
        recipientEmail: shipmentData.recipient_email || 'N/A',
        recipientAddress: shipmentData.recipient_address_line1 || 'N/A',
        recipientPoBox: shipmentData.recipient_po_box || '',
        recipientDistrict: shipmentData.recipient_district || '',
        recipientCity: shipmentData.recipient_city || 'N/A',
        recipientState: shipmentData.recipient_state || 'N/A',
        recipientPincode: shipmentData.recipient_pincode || 'N/A',
        
        // Sender (keep for label generator as it expects it, even if N/A)
        senderAddress: shipmentData.sender_address_line1 || 'N/A',
        senderCity: shipmentData.sender_city || 'N/A',
        senderState: shipmentData.sender_state || 'N/A',
        senderPincode: shipmentData.sender_pincode || 'N/A',
        
        // Order Details (keep for label generator as it expects it, even if N/A)
        items: shipmentData.items || [],
        amountDeclared: shipmentData.amount_declared || '0.00',
        paymentType: shipmentData.payment_type || 'Pre-paid',
        returnAddress: shipmentData.return_address || 'N/A',
        product: shipmentData.package_type || 'N/A', // Map directly from package_type
        
        // Formatted addresses for label generator (frontend responsibility)
        pickupAddress: [
          shipmentData.sender_address_line1,
          shipmentData.sender_city,
          shipmentData.sender_state,
          `PIN:${shipmentData.sender_pincode}`
        ].filter(Boolean).join(', '),
        
        deliveryAddress: [
          shipmentData.recipient_address_line1,
          shipmentData.recipient_po_box ? `P.o- ${shipmentData.recipient_po_box}` : '',
          shipmentData.recipient_district ? `Dist- ${shipmentData.recipient_district}` : '',
          shipmentData.recipient_city,
          shipmentData.recipient_state,
          `PIN:${shipmentData.recipient_pincode}`
        ].filter(Boolean).join(', ')
      };

      console.log('Mapped label data:', labelData);

      // Generate PDF
      const pdf = await generateShipmentLabel(labelData);
      
      // Open PDF in new window
      const pdfWindow = window.open('', '_blank');
      if (pdfWindow) {
        pdfWindow.document.write(`
          <html>
            <head>
              <title>Shipment Label - ${labelData.trackingNumber}</title>
            </head>
            <body style="margin: 0; padding: 0;">
              <iframe 
                src="${pdf.output('datauristring')}" 
                style="width: 100%; height: 100vh; border: none;"
              ></iframe>
            </body>
          </html>
        `);
        pdfWindow.document.close();
      } else {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
      }
    } catch (error) {
      console.error('Error generating label:', error);
      alert('Failed to generate label: ' + error.message);
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
                          onClick={() => handlePrintLabel(shipment)}
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
