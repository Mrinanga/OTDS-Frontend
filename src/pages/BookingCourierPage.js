import React, { useState } from 'react';
import BookingModal from '../components/BookingPage/BookingModal';
import '../styles/booking.css';

const initialDummyData = [
  {
    name: 'Annay Borah',
    address: '13 Main Street, Morigaon',
    date: '2025-05-24',
    status: 'Booked',
  },
  {
    name: 'Nirmal Kakoti',
    address: '02 zoo road, Ghy',
    date: '2025-05-23',
    status: 'In Transit',
  },
  {
    name: ' Vikram Singh',
    address: '79 Shillong, Shillong',
    date: '2025-05-22',
    status: 'Delivered',
  },
];

const CourierBookings = () => {
  const [bookings, setBookings] = useState(initialDummyData);
  const [showModal, setShowModal] = useState(false);

  const handleNewBooking = (data) => {
    const newBooking = {
      ...data,
      date: new Date().toISOString().slice(0, 10),
      status: 'Booked',
    };
    setBookings([newBooking, ...bookings]);
    setShowModal(false);
  };

  return (
    <div className="bookings-container">
      <h2 className="bookings-title">Courier Bookings</h2>

      <button className="book-button" onClick={() => setShowModal(true)}>
        + Book a Courier
      </button>

      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer Name</th>
                <th>Address</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{booking.name}</td>
                  <td>{booking.address}</td>
                  <td>
                    <span
                      className={`status-badge ${booking.status
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.date}</td>
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
    </div>
  );
};

export default CourierBookings;
