import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import ShipmentModal from '../components/ShipmentModal';
import '../styles/pickup-page.css';

const PickupPage = () => {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);

    useEffect(() => {
        fetchPickups();
    }, [filter]);

    const fetchPickups = async () => {
        try {
            setLoading(true);
            console.log('Fetching pickups with filter:', filter);
            const response = filter === 'all' 
                ? await apiService.getAllPickupRequests()
                : await apiService.getFilteredPickupRequests(filter);
            console.log('Pickup response:', response);
            setPickups(Array.isArray(response.data) ? response.data : []);
            setError(null);
        } catch (err) {
            console.error('Error in fetchPickups:', err);
            setError(err.message || 'Failed to fetch pickup requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await apiService.updatePickupStatus(id, newStatus);
            fetchPickups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to cancel this pickup request?')) {
            try {
                await apiService.deletePickupRequest(id);
                fetchPickups();
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to cancel pickup request');
            }
        }
    };

    const handleAssignPickup = async (pickupId, assignmentData) => {
        try {
            await apiService.assignPickup({
                request_id: pickupId,
                ...assignmentData
            });
            fetchPickups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to assign pickup');
        }
    };

    const handleShipmentSubmit = async (shipmentData) => {
        try {
            await apiService.createShipment({
                pickup_id: selectedPickup.request_id,
                ...shipmentData
            });
            setIsShipmentModalOpen(false);
            fetchPickups();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create shipment');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'status-badge pending';
            case 'assigned': return 'status-badge assigned';
            case 'in-progress': return 'status-badge in-progress';
            case 'completed': return 'status-badge completed';
            case 'cancelled': return 'status-badge cancelled';
            default: return 'status-badge';
        }
    };

    return (
        <div className="pickup-page">
            <div className="pickup-header">
                <h1>Pickup Requests</h1>
            </div>

            <div className="filter-controls">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading pickup requests...</div>
            ) : pickups.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <div className="empty-state-message">No Pickup Requests Available</div>
                    <div className="empty-state-submessage">
                        {filter === 'all' 
                            ? "There are no pickup requests in the system."
                            : `There are no ${filter} pickup requests.`}
                    </div>
                </div>
            ) : (
                <div className="pickup-table-container">
                    <table className="pickup-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Customer</th>
                                <th>Address</th>
                                <th>Package Details</th>
                                <th>Pickup Date/Time</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pickups.map(pickup => (
                                <tr key={pickup.request_id}>
                                    <td>#{pickup.request_id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <div>{pickup.customer_name}</div>
                                            <div className="contact-info">
                                                {pickup.phone}<br />
                                                {pickup.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="address-info">
                                            {pickup.address}
                                            {pickup.landmark && <div className="landmark">{pickup.landmark}</div>}
                                            <div className="city-pincode">
                                                {pickup.city} - {pickup.pincode}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="package-info">
                                            <div>Type: {pickup.package_type}</div>
                                            <div>Weight: {pickup.weight} kg</div>
                                            {pickup.dimensions && <div>Dimensions: {pickup.dimensions}</div>}
                                            {pickup.quantity > 1 && <div>Quantity: {pickup.quantity}</div>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="pickup-time-info">
                                            <div>{new Date(pickup.pickup_date).toLocaleDateString()}</div>
                                            <div>{pickup.time_slot}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={getStatusBadgeClass(pickup.status)}>
                                            {pickup.status}
                                        </span>
                                    </td>
                                    <td>
                                        {pickup.assigned_branch ? (
                                            <div className="assignment-info">
                                                <div>Branch: {pickup.assigned_branch}</div>
                                                {pickup.executive_first_name && (
                                                    <div>
                                                        Executive: {pickup.executive_first_name} {pickup.executive_last_name}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="not-assigned">Not Assigned</span>
                                        )}
                                    </td>
                                    <td className="actions-cell">
                                        {pickup.status === 'pending' && (
                                            <>
                                                <button
                                                    className="action-button assign"
                                                    onClick={() => handleAssignPickup(pickup.request_id, {})}
                                                >
                                                    Assign
                                                </button>
                                                <button
                                                    className="action-button cancel"
                                                    onClick={() => handleDelete(pickup.request_id)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {pickup.status === 'assigned' && (
                                            <button
                                                className="action-button ship"
                                                onClick={() => {
                                                    setSelectedPickup(pickup);
                                                    setIsShipmentModalOpen(true);
                                                }}
                                            >
                                                Proceed Shipment
                                            </button>
                                        )}
                                        {pickup.status === 'in-progress' && (
                                            <>
                                                <button
                                                    className="action-button complete"
                                                    onClick={() => handleStatusUpdate(pickup.request_id, 'completed')}
                                                >
                                                    Complete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isShipmentModalOpen && (
                <ShipmentModal
                    isOpen={isShipmentModalOpen}
                    onClose={() => setIsShipmentModalOpen(false)}
                    pickupData={selectedPickup}
                    onSubmit={handleShipmentSubmit}
                />
            )}
        </div>
    );
};

export default PickupPage;

