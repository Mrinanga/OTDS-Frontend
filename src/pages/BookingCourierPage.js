import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import BookingModal from '../components/BookingPage/BookingModal';
import PickupAssignmentModal from '../components/BookingPage/PickupAssignmentModal';
import '../styles/booking.css';

const BookingCourierPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState([]);
  const [executives, setExecutives] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchBranches();
    fetchExecutives();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllBookings();
      if (response.data && response.data.data) {
        setBookings(response.data.data);
      } else {
        setBookings([]);
      }
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again later.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await apiService.getBranches();
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchExecutives = async () => {
    try {
      const response = await apiService.getExecutives();
      if (response.data && response.data.data) {
        setExecutives(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching executives:', err);
    }
  };

  const handleNewBooking = async (data) => {
    try {
      setLoading(true);
      const response = await apiService.createBooking(data);
      if (response.data && response.data.data) {
        const { booking_number } = response.data.data;
        
        // Refresh the bookings list
        await fetchBookings();
        
        // Close modal and show success message
        setShowModal(false);
        alert(`Booking created successfully! Your booking number is: ${booking_number}`);
        
        // Optionally navigate to tracking page
        navigate(`/tracking/${booking_number}`);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPickup = (booking) => {
    try {
      console.log('Selected booking:', booking);
      setSelectedBooking(booking);
      setShowPickupModal(true);
    } catch (error) {
      console.error('Error in handleRequestPickup:', error);
      setError('Failed to open pickup request modal. Please try again.');
    }
  };

  const handlePickupAssignment = async (assignmentData) => {
    try {
      setLoading(true);
      setError('');
      
      if (!selectedBooking || !selectedBooking.booking_number) {
        throw new Error('No booking selected');
      }

      console.log('Submitting pickup assignment:', {
        bookingNumber: selectedBooking.booking_number,
        assignmentData
      });

      const response = await apiService.assignPickup(selectedBooking.booking_number, assignmentData);
      
      console.log('Pickup assignment response:', response);

      if (response.data && response.data.success) {
        // Refresh the bookings list
        await fetchBookings();
        
        // Close modal and show success message
        setShowPickupModal(false);
        setSelectedBooking(null);
        alert('Pickup request assigned successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to assign pickup');
      }
    } catch (err) {
      console.error('Error assigning pickup:', err);
      setError(err.response?.data?.message || err.message || 'Failed to assign pickup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">Courier Bookings</h2>

      {error && <div className="error-message">{error}</div>}

      <button className="book-button" onClick={() => setShowModal(true)}>
        + Book a Courier
      </button>

      {!bookings || bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking Number</th>
                <th>Service Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_number}>
                  <td>{booking.booking_number}</td>
                  <td>{booking.service_type}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>₹{booking.total_amount}</td>
                  <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  <td className="actions-cell">
                    {booking.status === 'pending' && (
                      <button 
                        className="pickup-button"
                        onClick={() => handleRequestPickup(booking)}
                      >
                        Request Pickup
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <BookingModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewBooking}
        />
      )}

      {showPickupModal && selectedBooking && (
        <PickupAssignmentModal
          onClose={() => {
            setShowPickupModal(false);
            setSelectedBooking(null);
          }}
          onSubmit={handlePickupAssignment}
          booking={selectedBooking}
          branches={branches}
          executives={executives}
        />
      )}
    </div>
  );
};

export default BookingCourierPage;
