import React, { useEffect, useState } from 'react';
import '../../styles/booking.css';
import apiService from '../../services/api.service';

const BookingForwardBranchModal = ({ booking, onClose, onSubmit }) => {
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBranches();
        if (response.data && response.data.data) {
          setBranches(response.data.data);
        }
      } catch (err) {
        setError('Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleBranchChange = (e) => {
    setSelectedBranchId(e.target.value);
  };

  const handleForward = async () => {
    console.log('Raw booking object:', JSON.stringify(booking, null, 2));
    if (!selectedBranchId) {
      setError('Please select a branch office');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Unique debug log to confirm execution
      console.log('!!! TRANSFORMATION BLOCK EXECUTED !!!');
      // Build the normalized payload
      const payload = {
        service_type: booking.service_type,
        package_type: booking.package_type,
        weight: booking.weight,
        package_details: {
          dimensions: booking.dimensions,
          quantity: booking.quantity,
          description: booking.description,
          special_instructions: booking.special_instructions,
        },
        pickup_address: {
          name: booking.pickup_name,
          phone: booking.pickup_phone,
          address: booking.pickup_address,
          city: booking.pickup_city,
          state: booking.pickup_state,
          country: booking.pickup_country,
          postal_code: booking.pickup_postal_code,
        },
        delivery_address: {
          name: booking.delivery_name,
          phone: booking.delivery_phone,
          address: booking.delivery_address,
          city: booking.delivery_city,
          state: booking.delivery_state,
          country: booking.delivery_country,
          postal_code: booking.delivery_postal_code,
        },
        payment_method: booking.payment_method,
        calculated_amount: booking.calculated_amount,
        total_amount: booking.total_amount,
        payment_status: booking.payment_status,
        // Add any other required fields here
      };
      // Debug: log the payload
      console.log('Forwarding bookingData:', JSON.stringify(payload, null, 2));
      const response = await apiService.forwardExternalBooking(payload, selectedBranchId);
      if (response.data && response.data.data && response.data.data.booking_number) {
        if (onSubmit) onSubmit(response.data.data.booking_number);
        onClose();
        alert(`Booking forwarded successfully! New booking number: ${response.data.data.booking_number}`);
      } else {
        setError('Failed to forward booking.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to forward booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Booking Forward Branch</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Booking Number:</strong> {booking.booking_number}</p>
          <p><strong>Service Type:</strong> {booking.service_type}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Total Amount:</strong> ₹{booking.total_amount}</p>
          <p><strong>Payment Status:</strong> {booking.payment_status}</p>
          <h4>Pickup Address</h4>
          <p>{booking.pickup_name}, {booking.pickup_phone}</p>
          <p>{booking.pickup_address}, {booking.pickup_city}, {booking.pickup_state}, {booking.pickup_country} - {booking.pickup_postal_code}</p>
          <h4>Delivery Address</h4>
          <p>{booking.delivery_name}, {booking.delivery_phone}</p>
          <p>{booking.delivery_address}, {booking.delivery_city}, {booking.delivery_state}, {booking.delivery_country} - {booking.delivery_postal_code}</p>
          <h4>Package Details</h4>
          <p><strong>Type:</strong> {booking.package_type}</p>
          <p><strong>Weight:</strong> {booking.weight} kg</p>
          <p><strong>Dimensions:</strong> {booking.dimensions}</p>
          <p><strong>Quantity:</strong> {booking.quantity}</p>
          <p><strong>Description:</strong> {booking.description}</p>
          <p><strong>Special Instructions:</strong> {booking.special_instructions}</p>
        </div>
        <div className="form-section">
          <h3>Select Branch Office to Forward</h3>
          <select value={selectedBranchId} onChange={handleBranchChange} required>
            <option value="">Select Branch</option>
            {branches.map(branch => (
              <option key={branch.branch_id} value={branch.branch_id}>
                {branch.branch_name} ({branch.city})
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions" style={{ marginTop: '2rem' }}>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="submit-button" onClick={handleForward} disabled={loading}>Forward</button>
        </div>
      </div>
    </div>
  );
};

export default BookingForwardBranchModal; 