import React, { useState, useEffect } from 'react';
import '../../styles/booking.css';
import { FaPen } from 'react-icons/fa';

const BookingModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    service_type: 'standard',
    package_type: '',
    weight: '',
    package_details: {
      dimensions: '',
      quantity: 1,
      description: '',
      special_instructions: ''
    },
    pickup_address: {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    },
    delivery_address: {
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postal_code: ''
    },
    payment_method: 'pay_on_pickup',
    calculated_amount: 0,
    manual_amount: '',
    is_manual_amount: false
  });

  // Calculate amount based on service type, weight, and package type
  useEffect(() => {
    let baseAmount = 0;
    
    // Base amount based on service type
    switch(formData.service_type) {
      case 'standard':
        baseAmount = 100;
        break;
      case 'express':
        baseAmount = 200;
        break;
      case 'same_day':
        baseAmount = 300;
        break;
      default:
        baseAmount = 100;
    }

    // Add amount based on weight (₹10 per kg)
    const weightAmount = formData.weight ? parseFloat(formData.weight) * 10 : 0;

    // Add amount based on package type
    let packageMultiplier = 1;
    switch(formData.package_type) {
      case 'document':
        packageMultiplier = 1;
        break;
      case 'parcel':
        packageMultiplier = 1.2;
        break;
      case 'box':
        packageMultiplier = 1.5;
        break;
      case 'envelope':
        packageMultiplier = 1.1;
        break;
      default:
        packageMultiplier = 1;
    }

    const totalAmount = (baseAmount + weightAmount) * packageMultiplier;
    const roundedAmount = Math.round(totalAmount);
    
    setFormData(prev => ({
      ...prev,
      calculated_amount: roundedAmount,
      // If not using manual amount, update manual_amount to match calculated
      manual_amount: prev.is_manual_amount ? prev.manual_amount : ''
    }));
  }, [formData.service_type, formData.weight, formData.package_type]);

  const handleChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target;
    
    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [name]: value
          }
        }
      }));
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare the data for submission
    const submissionData = {
      ...formData,
      total_amount: formData.is_manual_amount ? parseFloat(formData.manual_amount) || 0 : formData.calculated_amount,
      payment_status: formData.payment_method === 'pay_now' ? 'paid' : 'pending'
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Book a Courier</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Service Details</h3>
            <div className="form-group">
              <label>Service Type</label>
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
              >
                <option value="standard">Standard Delivery</option>
                <option value="express">Express Delivery</option>
                <option value="same_day">Same Day Delivery</option>
              </select>
            </div>

            <div className="form-group">
              <label>Package Type</label>
              <select
                name="package_type"
                value={formData.package_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Package Type</option>
                <option value="document">Document</option>
                <option value="parcel">Parcel</option>
                <option value="box">Box</option>
                <option value="envelope">Envelope</option>
              </select>
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                step="0.1"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Dimensions (L x W x H in cm)</label>
              <input
                type="text"
                name="dimensions"
                value={formData.package_details.dimensions}
                onChange={(e) => handleChange(e, 'package_details', null)}
                placeholder="e.g., 30x20x10"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.package_details.quantity}
                onChange={(e) => handleChange(e, 'package_details', null)}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.package_details.description}
                onChange={(e) => handleChange(e, 'package_details', null)}
                placeholder="Describe your package contents"
                required
              />
            </div>

            <div className="form-group">
              <label>Special Instructions</label>
              <textarea
                name="special_instructions"
                value={formData.package_details.special_instructions}
                onChange={(e) => handleChange(e, 'package_details', null)}
                placeholder="Any special handling instructions"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Pickup Address</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.pickup_address.name}
                onChange={(e) => handleChange(e, 'pickup_address', null)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.pickup_address.phone}
                onChange={(e) => handleChange(e, 'pickup_address', null)}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.pickup_address.address}
                onChange={(e) => handleChange(e, 'pickup_address', null)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.pickup_address.city}
                  onChange={(e) => handleChange(e, 'pickup_address', null)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.pickup_address.state}
                  onChange={(e) => handleChange(e, 'pickup_address', null)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.pickup_address.country}
                  onChange={(e) => handleChange(e, 'pickup_address', null)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.pickup_address.postal_code}
                  onChange={(e) => handleChange(e, 'pickup_address', null)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Delivery Address</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.delivery_address.name}
                onChange={(e) => handleChange(e, 'delivery_address', null)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.delivery_address.phone}
                onChange={(e) => handleChange(e, 'delivery_address', null)}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.delivery_address.address}
                onChange={(e) => handleChange(e, 'delivery_address', null)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.delivery_address.city}
                  onChange={(e) => handleChange(e, 'delivery_address', null)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.delivery_address.state}
                  onChange={(e) => handleChange(e, 'delivery_address', null)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.delivery_address.country}
                  onChange={(e) => handleChange(e, 'delivery_address', null)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.delivery_address.postal_code}
                  onChange={(e) => handleChange(e, 'delivery_address', null)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Payment Details</h3>
            
            <div className="amount-section">
              <h4>Amount</h4>
              
              <div className="form-group">
                <div className="amount-display-container">
                  <div className="calculated-amount amount-display">
                    ₹{formData.calculated_amount.toLocaleString()}
                  </div>
                  <button
                    type="button"
                    className="edit-amount-btn"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      is_manual_amount: !prev.is_manual_amount,
                      manual_amount: !prev.is_manual_amount ? prev.calculated_amount.toString() : prev.manual_amount
                    }))}
                    title={formData.is_manual_amount ? "Use calculated amount" : "Edit amount"}
                  >
                    <FaPen />
                  </button>
                </div>
              </div>

              {formData.is_manual_amount && (
                <div className="form-group custom-amount-group">
                  <label className="amount-label">Custom Amount</label>
                  <input
                    type="number"
                    name="manual_amount"
                    className="custom-amount-input"
                    value={formData.manual_amount}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      manual_amount: e.target.value
                    }))}
                    min="0"
                    step="0.01"
                    placeholder="Enter custom amount"
                    required
                  />
                  <div className="amount-info">
                    <small>Auto-calculated: ₹{formData.calculated_amount.toLocaleString()}</small>
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
              >
                <option value="pay_on_pickup">Pay on Pickup</option>
                <option value="pay_now">Pay Now (UPI)</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
              </select>
            </div>

            {formData.payment_method === 'pay_now' && (
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  name="upi_id"
                  placeholder="Enter your UPI ID"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 