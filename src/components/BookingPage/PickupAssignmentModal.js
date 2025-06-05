import React, { useState, useEffect } from 'react';
import apiService from '../../services/api.service';
import '../../styles/booking.css';

const PickupAssignmentModal = ({ onClose, onSubmit, bookingNumber }) => {
  console.log('PickupAssignmentModal rendered with bookingNumber:', bookingNumber);

  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    branch_id: '',
    executive_id: '',
    pickup_date: '',
    pickup_time: '',
    notes: ''
  });

  const [branches, setBranches] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingNumber) {
        setError('No booking number provided');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching booking details for:', bookingNumber);
        const response = await apiService.getBookingByNumber(bookingNumber);
        console.log('Raw booking response:', response);
        
        // Handle the nested response structure
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // Find the specific booking by booking number
          const bookingData = response.data.data.find(
            booking => booking.booking_number === bookingNumber
          );
          
          if (bookingData) {
            console.log('Setting booking data:', bookingData);
            setBooking(bookingData);
          } else {
            console.log('Booking not found in response');
            setError('Booking not found');
          }
        } else if (response.data && response.data.data) {
          // If it's a single booking response
          console.log('Setting booking data:', response.data.data);
          setBooking(response.data.data);
        } else {
          console.log('No data in response');
          setError('No booking data received');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingNumber]);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await apiService.getBranches();
        if (response.data && response.data.data) {
          setBranches(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to fetch branches');
      }
    };

    fetchBranches();
  }, []);

  // Fetch executives when branch is selected
  useEffect(() => {
    const fetchExecutives = async () => {
      if (!formData.branch_id) {
        setExecutives([]);
        return;
      }

      try {
        console.log('Fetching executives for branch:', formData.branch_id);
        const response = await apiService.getExecutivesByBranch(formData.branch_id);
        console.log('Field executives response:', response);
        
        if (response.data && response.data.data) {
          setExecutives(response.data.data);
        } else {
          console.log('No executives data in response');
          setExecutives([]);
        }
      } catch (err) {
        console.error('Error fetching executives:', err);
        setError('Failed to fetch field executives');
        setExecutives([]);
      }
    };

    fetchExecutives();
  }, [formData.branch_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Field change:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log('Submitting pickup assignment data:', {
            bookingNumber,
            formData
        });
        
        const response = await apiService.assignPickup(bookingNumber, formData);
        console.log('Pickup assignment response:', response);
        
        if (response.success) {
            onClose();
            onSubmit(response.data);
        } else {
            setError(response.message || 'Failed to assign pickup');
        }
    } catch (error) {
        console.error('Error submitting pickup assignment:', error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Failed to assign pickup';
        setError(errorMessage);
    }
  };

  // Safely get pickup address
  const getPickupAddress = () => {
    if (!booking) {
      console.log('No booking data available');
      return 'N/A';
    }
    
    console.log('Booking data:', booking);
    
    // If pickup_address is a string
    if (typeof booking.pickup_address === 'string') {
      console.log('Pickup address is a string:', booking.pickup_address);
      return booking.pickup_address;
    }
    
    // If pickup_address is an object
    if (booking.pickup_address) {
      // Check if it has an address property
      if (booking.pickup_address.address) {
        console.log('Pickup address from address property:', booking.pickup_address.address);
        return booking.pickup_address.address;
      }
      
      // If it has individual address components
      const addressComponents = [
        booking.pickup_address.street,
        booking.pickup_address.address_line1,
        booking.pickup_address.address_line2,
        booking.pickup_address.city,
        booking.pickup_address.state,
        booking.pickup_address.postal_code,
        booking.pickup_address.country
      ].filter(Boolean);
      
      if (addressComponents.length > 0) {
        const formattedAddress = addressComponents.join(', ');
        console.log('Formatted address from components:', formattedAddress);
        return formattedAddress;
      }
    }
    
    // If pickup_address is in a different format
    if (booking.address) {
      console.log('Using booking.address:', booking.address);
      return booking.address;
    }
    
    console.log('No valid address found in booking data');
    return 'N/A';
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Request Pickup</h2>
        
        {loading ? (
          <div className="loading-container">
            <p>Loading booking details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        ) : !booking ? (
          <div className="error-container">
            <p>No booking details available</p>
            <p>Debug info: bookingNumber={bookingNumber}</p>
          </div>
        ) : (
          <>
            <div className="booking-details">
              <h3>Booking Details</h3>
              <p><strong>Booking Number:</strong> {booking.booking_number || 'N/A'}</p>
              <p><strong>Service Type:</strong> {
                booking.service_type ? 
                (typeof booking.service_type === 'string' ? 
                  booking.service_type.charAt(0).toUpperCase() + booking.service_type.slice(1).replace('_', ' ') 
                  : booking.service_type) 
                : 'N/A'
              }</p>
              <p><strong>Status:</strong> {
                booking.status ? 
                (typeof booking.status === 'string' ? 
                  booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ') 
                  : booking.status) 
                : 'N/A'
              }</p>
              <p><strong>Total Amount:</strong> ₹{booking.total_amount || '0.00'}</p>
              <p><strong>Branch:</strong> {booking.branch_name || 'N/A'}</p>
              <p><strong>Created At:</strong> {new Date(booking.created_at).toLocaleString() || 'N/A'}</p>
              
              {booking.company_name && (
                <p><strong>Company:</strong> {booking.company_name}</p>
              )}

              <div className="address-section">
                <h4>Pickup Address</h4>
                {booking.pickup_address ? (
                  <>
                    <p><strong>Name:</strong> {booking.pickup_address.name || 'N/A'}</p>
                    <p><strong>Phone:</strong> {booking.pickup_address.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {getPickupAddress()}</p>
                    <p><strong>City:</strong> {booking.pickup_address.city || 'N/A'}</p>
                    <p><strong>State:</strong> {booking.pickup_address.state || 'N/A'}</p>
                    <p><strong>Postal Code:</strong> {booking.pickup_address.postal_code || 'N/A'}</p>
                    <p><strong>Country:</strong> {booking.pickup_address.country || 'N/A'}</p>
                  </>
                ) : (
                  <p>No pickup address available</p>
                )}
              </div>

              <div className="package-section">
                <h4>Package Details</h4>
                {booking.package_details ? (
                  <>
                    <p><strong>Type:</strong> {booking.package_details.type || 'N/A'}</p>
                    <p><strong>Weight:</strong> {booking.package_details.weight ? `${booking.package_details.weight} kg` : 'N/A'}</p>
                    <p><strong>Dimensions:</strong> {booking.package_details.dimensions || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {booking.package_details.quantity || 'N/A'}</p>
                    <p><strong>Description:</strong> {booking.package_details.description || 'N/A'}</p>
                    {booking.package_details.special_instructions && (
                      <p><strong>Special Instructions:</strong> {booking.package_details.special_instructions}</p>
                    )}
                  </>
                ) : (
                  <p>No package details available</p>
                )}
              </div>
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
                    disabled={loading}
                  >
                    <option value="">Select Branch</option>
                    {branches?.map(branch => (
                      <option key={branch.branch_id} value={branch.branch_id}>
                        {branch.branch_name} - {branch.city}, {branch.state}
                      </option>
                    ))}
                  </select>
                  {error && <div className="error-message">{error}</div>}
                </div>

                <div className="form-group">
                  <label>Field Executive</label>
                  <select
                    name="executive_id"
                    value={formData.executive_id}
                    onChange={handleChange}
                    required
                    disabled={!formData.branch_id || loading}
                  >
                    <option value="">Select Field Executive</option>
                    {executives && executives.length > 0 ? (
                      executives.map(exec => (
                        <option key={exec.executive_id} value={exec.executive_id}>
                          {exec.first_name} {exec.last_name} - {exec.phone}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No executives available</option>
                    )}
                  </select>
                  {loading && <div className="loading-text">Loading executives...</div>}
                  {error && <div className="error-message">{error}</div>}
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
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Loading...' : 'Assign Pickup'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PickupAssignmentModal; 