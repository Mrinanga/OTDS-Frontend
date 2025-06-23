import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api.service';
import BookingModal from '../components/BookingPage/BookingModal';
import PickupAssignmentModal from '../components/BookingPage/PickupAssignmentModal';
import BookingForwardBranchModal from '../components/BookingPage/BookingForwardBranchModal';
import '../styles/booking.css';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';

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
  const [filterType, setFilterType] = useState('main');
  const [selectedBranchId, setSelectedBranchId] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showForwardBranchModal, setShowForwardBranchModal] = useState(false);
  const [forwardBranchBooking, setForwardBranchBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchExecutives();
  }, [filterType]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let response;
      if (filterType === 'external') {
        response = await apiService.getAllExternalBookings();
      } else {
        response = await apiService.getAllBookings();
      }
      console.log('Bookings response:', response);
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
    console.log('Selected booking for pickup:', booking);
    
    if (!booking?.booking_number) {
      console.error('Invalid booking data:', booking);
      setError('Invalid booking data: missing booking number');
      return;
    }

    // Set both states at once
    setSelectedBooking(booking);
    setShowPickupModal(true);
  };

  // Add effect to monitor state changes
  useEffect(() => {
    console.log('State changed:', {
      showPickupModal,
      selectedBooking,
      bookingNumber: selectedBooking?.booking_number
    });
  }, [showPickupModal, selectedBooking]);

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

  const handleFilterChange = async (event) => {
    const value = event.target.value;
    setFilterType(value);
    if (value !== 'branch') {
      setSelectedBranchId('');
    } else {
      // Fetch branches only if not already loaded
      if (branches.length === 0) {
        await fetchBranches();
      }
    }
  };

  const handleBranchChange = (event) => {
    setSelectedBranchId(event.target.value);
  };

  const getFilteredBookings = () => {
    let filtered = bookings;
    if (filterType === 'external') {
      // For external bookings, return all as-is
      return bookings;
    } else if (filterType === 'main') {
      filtered = filtered.filter(b => String(b.branch_id) === '1');
    } else if (filterType === 'branch' && selectedBranchId) {
      filtered = filtered.filter(b => String(b.branch_id) === String(selectedBranchId));
    }
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(b =>
        (b.booking_number && b.booking_number.toLowerCase().includes(term)) ||
        (b.service_type && b.service_type.toLowerCase().includes(term))
      );
    }
    // Date filter
    if (startDate) {
      filtered = filtered.filter(b => new Date(b.created_at) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(b => new Date(b.created_at) <= new Date(endDate));
    }
    return filtered;
  };

  const handleForwardBranch = (booking) => {
    setForwardBranchBooking(booking);
    setShowForwardBranchModal(true);
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
      {/* Booking Button and Filter Controls Row */}
      <div className="booking-controls-row">
        <button className="book-button" onClick={() => setShowModal(true)}>
          + Book a Courier
        </button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <FormControl size="small" style={{ minWidth: 180 }}>
            <InputLabel id="filter-type-label">Filter Bookings</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              label="Filter Bookings"
              onChange={handleFilterChange}
            >
              <MenuItem value="external">External Bookings</MenuItem>
              <MenuItem value="main">Main Branch Bookings</MenuItem>
              <MenuItem value="branch">Branch Bookings (by ID)</MenuItem>
            </Select>
          </FormControl>
          {filterType === 'branch' && (
            <FormControl size="small" style={{ minWidth: 150 }}>
              <InputLabel id="branch-select-label">Select Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                value={selectedBranchId}
                label="Select Branch"
                onChange={handleBranchChange}
              >
                {branches
                  .filter(branch => String(branch.branch_id) !== '1')
                  .map(branch => (
                    <MenuItem key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name} (ID: {branch.branch_id})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          )}
          {/* Search Bar */}
          <TextField
            size="small"
            label="Search Bookings"
            variant="outlined"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {/* Date Filter */}
          <TextField
            size="small"
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <TextField
            size="small"
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
      {!bookings || bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="table-wrapper scrollable-table">
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
              {getFilteredBookings().map((booking) => (
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
                    {filterType === 'external' && booking.status === 'pending' && (
                      <button 
                        className="pickup-button"
                        onClick={() => handleForwardBranch(booking)}
                      >
                        Forward Branch
                      </button>
                    )}
                    {filterType !== 'external' && booking.status === 'pending' && (
                      <button 
                        className="pickup-button"
                        onClick={() => handleRequestPickup(booking)}
                      >
                        Request Pickup
                      </button>
                    )}
                    {booking.status === 'FE Assigned' && (
                      <button 
                        className="edit-button"
                        onClick={() => handleRequestPickup(booking)}
                      >
                        Edit
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

      {showPickupModal && selectedBooking?.booking_number && (
        <PickupAssignmentModal
          key={selectedBooking.booking_number}
          onClose={() => {
            setShowPickupModal(false);
            setSelectedBooking(null);
          }}
          onSubmit={handlePickupAssignment}
          bookingNumber={selectedBooking.booking_number}
        />
      )}

      {showForwardBranchModal && forwardBranchBooking && (
        <BookingForwardBranchModal
          booking={forwardBranchBooking}
          onClose={() => {
            setShowForwardBranchModal(false);
            setForwardBranchBooking(null);
          }}
          // onSubmit={...} // To be implemented
        />
      )}
    </div>
  );
};

export default BookingCourierPage;
