import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import '../styles/pickup-assignment-modal.css';

const PickupAssignmentModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        email: '',
        address: '',
        landmark: '',
        city: '',
        pincode: '',
        package_type: '',
        weight: '',
        dimensions: '',
        quantity: 1,
        contents: '',
        pickup_date: '',
        time_slot: '',
        payment_mode: 'cash',
        special_instructions: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await apiService.createPickupRequest(formData);
            setSuccess(true);
            onSuccess(response.data);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setFormData({
                    customer_name: '',
                    phone: '',
                    email: '',
                    address: '',
                    landmark: '',
                    city: '',
                    pincode: '',
                    package_type: '',
                    weight: '',
                    dimensions: '',
                    quantity: 1,
                    contents: '',
                    pickup_date: '',
                    time_slot: '',
                    payment_mode: 'cash',
                    special_instructions: ''
                });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create pickup request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create Pickup Request</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">Pickup request created successfully!</div>}

                <form onSubmit={handleSubmit} className="pickup-form">
                    <div className="form-section">
                        <h3>Customer Details</h3>
                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Pickup Address</h3>
                        <div className="form-group">
                            <label>Address *</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Package Details</h3>
                        <div className="form-group">
                            <label>Package Type *</label>
                            <select
                                name="package_type"
                                value={formData.package_type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="document">Document</option>
                                <option value="parcel">Parcel</option>
                                <option value="box">Box</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Weight (kg) *</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Dimensions (LxWxH cm)</label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleInputChange}
                                    placeholder="30x20x10"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                        <div className="form-group">
                            <label>Contents</label>
                            <textarea
                                name="contents"
                                value={formData.contents}
                                onChange={handleInputChange}
                                placeholder="Describe the contents of the package"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Pickup Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Pickup Date *</label>
                                <input
                                    type="date"
                                    name="pickup_date"
                                    value={formData.pickup_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Time Slot *</label>
                                <select
                                    name="time_slot"
                                    value={formData.time_slot}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Time Slot</option>
                                    <option value="09:00-12:00">09:00 AM - 12:00 PM</option>
                                    <option value="12:00-15:00">12:00 PM - 03:00 PM</option>
                                    <option value="15:00-18:00">03:00 PM - 06:00 PM</option>
                                    <option value="18:00-21:00">06:00 PM - 09:00 PM</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Payment Mode *</label>
                            <select
                                name="payment_mode"
                                value={formData.payment_mode}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Special Instructions</label>
                            <textarea
                                name="special_instructions"
                                value={formData.special_instructions}
                                onChange={handleInputChange}
                                placeholder="Any special instructions for pickup"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Pickup Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PickupAssignmentModal; 