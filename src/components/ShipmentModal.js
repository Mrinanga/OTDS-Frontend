import React, { useState, useEffect } from 'react';
import '../styles/shipment-modal.css';
import apiService from '../services/api.service';

const ShipmentModal = ({ isOpen, onClose, pickupData, onSubmit }) => {
    const [branches, setBranches] = useState([]);
    const [shipmentData, setShipmentData] = useState({
        tracking_number: pickupData.request_id.toString(),
        shipping_method: 'standard',
        estimated_delivery: '',
        shipping_notes: '',
        final_destination_branch: '',
        sub_branches: [{ branch_id: '', arrival_time: '', departure_time: '' }]
    });

    useEffect(() => {
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

        fetchBranches();
    }, []);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiService.createShipment(shipmentData);
            if (response.success) {
                onSubmit(response.data);
                onClose();
            } else {
                // Handle error
                console.error('Failed to create shipment:', response.message);
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            // Handle error appropriately
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipmentData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubBranchChange = (index, field, value) => {
        const updatedSubBranches = [...shipmentData.sub_branches];
        updatedSubBranches[index] = {
            ...updatedSubBranches[index],
            [field]: value
        };
        setShipmentData(prev => ({
            ...prev,
            sub_branches: updatedSubBranches
        }));
    };

    const addSubBranch = () => {
        setShipmentData(prev => ({
            ...prev,
            sub_branches: [...prev.sub_branches, { branch_id: '', arrival_time: '', departure_time: '' }]
        }));
    };

    const removeSubBranch = (index) => {
        setShipmentData(prev => ({
            ...prev,
            sub_branches: prev.sub_branches.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Proceed with Shipment</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {/* Booking Details Section */}
                    <div className="booking-details-section">
                        <h3>Booking Details</h3>
                        <div className="booking-details-grid">
                            <div className="detail-item">
                                <label>Customer Name</label>
                                <div>{pickupData.customer_name}</div>
                            </div>
                            <div className="detail-item">
                                <label>Contact</label>
                                <div>{pickupData.phone}</div>
                                <div>{pickupData.email}</div>
                            </div>
                            <div className="detail-item">
                                <label>Address</label>
                                <div>{pickupData.address}</div>
                                <div>{pickupData.city} - {pickupData.pincode}</div>
                            </div>
                            <div className="detail-item">
                                <label>Package Details</label>
                                <div>Type: {pickupData.package_type}</div>
                                <div>Weight: {pickupData.weight} kg</div>
                                <div>Dimensions: {pickupData.dimensions}</div>
                            </div>
                            <div className="detail-item">
                                <label>Pickup Details</label>
                                <div>Date: {new Date(pickupData.pickup_date).toLocaleDateString()}</div>
                                <div>Time: {pickupData.time_slot}</div>
                            </div>
                            <div className="detail-item">
                                <label>Payment Mode</label>
                                <div>{pickupData.payment_mode}</div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h3>Shipment Information</h3>
                            <div className="form-group">
                                <label>Tracking Number</label>
                                <input
                                    type="text"
                                    name="tracking_number"
                                    value={shipmentData.tracking_number}
                                    readOnly
                                    className="readonly-input"
                                />
                                <small className="input-help-text">This is your booking number</small>
                            </div>
                            <div className="form-group">
                                <label>Shipping Method</label>
                                <select
                                    name="shipping_method"
                                    value={shipmentData.shipping_method}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="standard">Standard Shipping</option>
                                    <option value="express">Express Shipping</option>
                                    <option value="priority">Priority Shipping</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Estimated Delivery Date</label>
                                <input
                                    type="date"
                                    name="estimated_delivery"
                                    value={shipmentData.estimated_delivery}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Final Destination Branch</label>
                                <select
                                    name="final_destination_branch"
                                    value={shipmentData.final_destination_branch}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Final Destination Branch</option>
                                    {branches.map((branch) => (
                                        <option key={branch.branch_id} value={branch.branch_id}>
                                            {branch.branch_name} - {branch.city}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Sub-Branch Stops</h3>
                            {shipmentData.sub_branches.map((stop, index) => (
                                <div key={index} className="sub-branch-stop">
                                    <div className="stop-header">
                                        <h4>Stop {index + 1}</h4>
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                className="remove-stop"
                                                onClick={() => removeSubBranch(index)}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="stop-fields">
                                        <div className="form-group">
                                            <label>Branch</label>
                                            <select
                                                value={stop.branch_id}
                                                onChange={(e) => handleSubBranchChange(index, 'branch_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch.branch_id} value={branch.branch_id}>
                                                        {branch.branch_name} - {branch.city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Arrival Time</label>
                                            <input
                                                type="datetime-local"
                                                value={stop.arrival_time}
                                                onChange={(e) => handleSubBranchChange(index, 'arrival_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Departure Time</label>
                                            <input
                                                type="datetime-local"
                                                value={stop.departure_time}
                                                onChange={(e) => handleSubBranchChange(index, 'departure_time', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="add-stop-button"
                                onClick={addSubBranch}
                            >
                                Add Another Stop
                            </button>
                        </div>

                        <div className="form-section">
                            <h3>Additional Information</h3>
                            <div className="form-group">
                                <label>Shipping Notes</label>
                                <textarea
                                    name="shipping_notes"
                                    value={shipmentData.shipping_notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Add any special instructions or notes for the shipment"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-button">
                                Confirm Shipment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShipmentModal; 