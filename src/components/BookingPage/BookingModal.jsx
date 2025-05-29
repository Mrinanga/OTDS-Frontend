import React, { useState, useEffect } from 'react';
import '../../styles/BookingModal.css';

const generateBookingId = () => 'BKG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
const generatePickupRequestId = () => 'PCK-' + Math.random().toString(36).substr(2, 9).toUpperCase();

const BookingModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bookingId: '',
    pickupRequestId: '',

    // Sender Info
    senderName: '',
    senderCompany: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderPincode: '',
    senderPhone: '',
    senderEmail: '',

    // Receiver Info
    receiverName: '',
    receiverCompany: '',
    receiverAddress: '',
    receiverCity: '',
    receiverState: '',
    receiverPincode: '',
    receiverPhone: '',
    receiverEmail: '',

    // Shipment Info
    parcelType: '',
    description: '',
    packageValue: '',
    weight: '',
    dimensions: '',
    itemCount: '',

    // Pickup & Delivery
    pickupDate: '',
    pickupTime: '',
    deliveryPriority: 'Standard',
    insurance: false,
    cod: false,
    codAmount: '',
    specialInstructions: '',

    // Payment
    paymentMethod: 'Online',
    billingAddress: '',
    agreeTerms: false,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      bookingId: generateBookingId(),
      pickupRequestId: generatePickupRequestId(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert('Please agree to the terms & conditions.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box large">
        <h3 className="modal-title">Book a Courier</h3>
        <form onSubmit={handleSubmit} className="booking-form">

          {/* Sender Info */}
          <h4>Sender Information</h4>
          <input name="senderName" placeholder="Full Name" value={formData.senderName} onChange={handleChange} required />
          <input name="senderCompany" placeholder="Company Name" value={formData.senderCompany} onChange={handleChange} />
          <input name="senderAddress" placeholder="Pickup Address" value={formData.senderAddress} onChange={handleChange} required />
          <input name="senderCity" placeholder="City" value={formData.senderCity} onChange={handleChange} required />
          <input name="senderState" placeholder="State" value={formData.senderState} onChange={handleChange} required />
          <input name="senderPincode" placeholder="Pincode" value={formData.senderPincode} onChange={handleChange} required />
          <input name="senderPhone" placeholder="Mobile Number" value={formData.senderPhone} onChange={handleChange} required />
          <input name="senderEmail" placeholder="Email Address" value={formData.senderEmail} onChange={handleChange} />

          {/* Receiver Info */}
          <h4>Receiver Information</h4>
          <input name="receiverName" placeholder="Full Name" value={formData.receiverName} onChange={handleChange} required />
          <input name="receiverCompany" placeholder="Company Name" value={formData.receiverCompany} onChange={handleChange} />
          <input name="receiverAddress" placeholder="Delivery Address" value={formData.receiverAddress} onChange={handleChange} required />
          <input name="receiverCity" placeholder="City" value={formData.receiverCity} onChange={handleChange} required />
          <input name="receiverState" placeholder="State" value={formData.receiverState} onChange={handleChange} required />
          <input name="receiverPincode" placeholder="Pincode" value={formData.receiverPincode} onChange={handleChange} required />
          <input name="receiverPhone" placeholder="Mobile Number" value={formData.receiverPhone} onChange={handleChange} required />
          <input name="receiverEmail" placeholder="Email Address" value={formData.receiverEmail} onChange={handleChange} />

          {/* Shipment Info */}
          <h4>Shipment Details</h4>
          <select name="parcelType" value={formData.parcelType} onChange={handleChange} required>
            <option value="">Select Parcel Type</option>
            <option value="Document">Document</option>
            <option value="Non-document">Non-document</option>
            <option value="Fragile">Fragile</option>
            <option value="Perishable">Perishable</option>
          </select>
          <input name="description" placeholder="Package Description" value={formData.description} onChange={handleChange} />
          <input name="packageValue" placeholder="Package Value (₹)" type="number" value={formData.packageValue} onChange={handleChange} />
          <input name="weight" placeholder="Weight (kg)" type="number" value={formData.weight} onChange={handleChange} required />
          <input name="dimensions" placeholder="Dimensions (L x W x H in cm)" value={formData.dimensions} onChange={handleChange} />
          <input name="itemCount" placeholder="No. of Items" type="number" value={formData.itemCount} onChange={handleChange} required />

          {/* Pickup & Delivery */}
          <h4>Pickup & Delivery</h4>
          <input name="bookingId" placeholder="Booking ID" value={formData.bookingId} readOnly />
          <input name="pickupRequestId" placeholder="Pickup Request ID" value={formData.pickupRequestId} readOnly />
          <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required />
          <select name="pickupTime" value={formData.pickupTime} onChange={handleChange} required>
            <option value="">Select Pickup Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          <select name="deliveryPriority" value={formData.deliveryPriority} onChange={handleChange} required>
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="Same Day">Same Day</option>
          </select>
          <label><input type="checkbox" name="insurance" checked={formData.insurance} onChange={handleChange} /> Insurance Required</label>
          <label><input type="checkbox" name="cod" checked={formData.cod} onChange={handleChange} /> Cash on Delivery</label>
          {formData.cod && (
            <input name="codAmount" type="number" placeholder="COD Amount (₹)" value={formData.codAmount} onChange={handleChange} />
          )}
          <textarea name="specialInstructions" placeholder="Special Instructions" value={formData.specialInstructions} onChange={handleChange}></textarea>

          {/* Payment */}
          <h4>Payment</h4>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="Online">Online (UPI/Card)</option>
            <option value="Pay on Pickup">Pay on Pickup</option>
            <option value="Pay on Delivery">Pay on Delivery</option>
          </select>
          <input name="billingAddress" placeholder="Billing Address (if different)" value={formData.billingAddress} onChange={handleChange} />

          {/* Agreement */}
          <label className="checkbox-label">
              <input type="checkbox" name="agree" />
              I agree to the terms and conditions
          </label>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit">Submit Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
