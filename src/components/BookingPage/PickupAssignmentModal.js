import React, { useState, useEffect } from 'react';
import '../../styles/booking.css';

const PickupAssignmentModal = ({ onClose, onSubmit, booking, branches, executives }) => {
  const [formData, setFormData] = useState({
    branch_id: '',
    executive_id: '',
    pickup_date: '',
    pickup_time: '',
    notes: ''
  });

  const [filteredExecutives, setFilteredExecutives] = useState([]);

  useEffect(() => {
    if (formData.branch_id) {
      // Filter executives based on selected branch
      const branchExecutives = executives.filter(exec => exec.branch_id === formData.branch_id);
      setFilteredExecutives(branchExecutives);
    } else {
      setFilteredExecutives([]);
    }
  }, [formData.branch_id, executives]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Safely get pickup address
  const getPickupAddress = () => {
    if (!booking) return 'N/A';
    
    // Check if pickup_address exists and has address property
    if (booking.pickup_address && booking.pickup_address.address) {
      return booking.pickup_address.address;
    }
    
    // If pickup_address is a string
    if (typeof booking.pickup_address === 'string') {
      return booking.pickup_address;
    }
    
    // If pickup_address is an object with different structure
    if (booking.pickup_address) {
      const address = [
        booking.pickup_address.street,
        booking.pickup_address.city,
        booking.pickup_address.state,
        booking.pickup_address.postal_code
      ].filter(Boolean).join(', ');
      
      return address || 'N/A';
    }
    
    return 'N/A';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Request Pickup</h2>
        
        <div className="booking-details">
          <h3>Booking Details</h3>
          <p><strong>Booking Number:</strong> {booking?.booking_number || 'N/A'}</p>
          <p><strong>Service Type:</strong> {booking?.service_type || 'N/A'}</p>
          <p><strong>Pickup Address:</strong> {getPickupAddress()}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Assignment Details</h3>
            
            <div className="form-group">
              <label>Branch</label>
              <select
                name="branch_id"
                value={formData.branch_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {branches?.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Field Executive</label>
              <select
                name="executive_id"
                value={formData.executive_id}
                onChange={handleChange}
                required
                disabled={!formData.branch_id}
              >
                <option value="">Select Field Executive</option>
                {filteredExecutives?.map(exec => (
                  <option key={exec.id} value={exec.id}>
                    {exec.name} - {exec.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pickup Date</label>
                <input
                  type="date"
                  name="pickup_date"
                  value={formData.pickup_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label>Pickup Time</label>
                <input
                  type="time"
                  name="pickup_time"
                  value={formData.pickup_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions for pickup"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Assign Pickup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickupAssignmentModal; 