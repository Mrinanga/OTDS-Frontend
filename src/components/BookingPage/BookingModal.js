import React, { useState } from 'react';
import '../../styles/booking.css';

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
    }
  });

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
    onSubmit(formData);
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