import React, { useState, useEffect } from 'react';
import apiService from '../services/api.service';
import '../styles/pickup-assignment-form.css';

const PickupAssignmentForm = ({ pickup, onAssign, onClose }) => {
    const [branches, setBranches] = useState([]);
    const [executives, setExecutives] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedExecutive, setSelectedExecutive] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            fetchExecutivesByBranch(selectedBranch);
        } else {
            setExecutives([]);
        }
    }, [selectedBranch]);

    const fetchBranches = async () => {
        try {
            const response = await apiService.getBranches();
            setBranches(response.data || []);
        } catch (err) {
            setError('Failed to fetch branches');
        }
    };

    const fetchExecutivesByBranch = async (branchId) => {
        try {
            const executives = await apiService.getExecutivesByBranch(branchId);
            setExecutives(executives);
        } catch (err) {
            setError('Failed to fetch executives');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBranch || !selectedExecutive) {
            setError('Please select both branch and executive');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onAssign({
                branch_id: selectedBranch,
                executive_id: selectedExecutive
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to assign pickup');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="assignment-form">
            <h3>Assign Pickup Request #{pickup.request_id}</h3>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Branch *</label>
                    <select
                        value={selectedBranch}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value);
                            setSelectedExecutive('');
                        }}
                        required
                    >
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.branch_id} value={branch.branch_id}>
                                {branch.branch_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Select Field Executive *</label>
                    <select
                        value={selectedExecutive}
                        onChange={(e) => setSelectedExecutive(e.target.value)}
                        required
                        disabled={!selectedBranch}
                    >
                        <option value="">Select Executive</option>
                        {executives.map(executive => (
                            <option key={executive.executive_id} value={executive.executive_id}>
                                {executive.first_name} {executive.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="cancel-button">
                        Cancel
                    </button>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Assigning...' : 'Assign Pickup'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PickupAssignmentForm; 