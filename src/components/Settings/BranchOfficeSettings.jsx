import React, { useState, useEffect } from "react";
import apiService from "../../services/api.service";

export default function BranchOfficeSettings() {
  const [branches, setBranches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    manager_name: "",
    manager_phone: "",
    manager_email: "",
    status: "active"
  });

  useEffect(() => {
    fetchBranches();
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await apiService.updateBranch(selectedBranch.branch_id, formData);
      } else {
        await apiService.createBranch(formData);
      }
      fetchBranches();
      resetForm();
    } catch (err) {
      console.error('Error saving branch:', err);
    }
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      phone: branch.phone,
      email: branch.email,
      manager_name: branch.manager_name,
      manager_phone: branch.manager_phone,
      manager_email: branch.manager_email,
      status: branch.status
    });
    setIsEditing(true);
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await apiService.deleteBranch(branchId);
        fetchBranches();
      } catch (err) {
        console.error('Error deleting branch:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      branch_name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      manager_name: "",
      manager_phone: "",
      manager_email: "",
      status: "active"
    });
    setIsEditing(false);
    setSelectedBranch(null);
  };

  return (
    <section className="branch-office-settings">
      <h3>{isEditing ? 'Edit Branch Office' : 'Create New Branch Office'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Branch Information</h4>
          <div className="form-group">
            <label>Branch Name:</label>
            <input
              type="text"
              name="branch_name"
              value={formData.branch_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Branch Manager Information</h4>
          <div className="form-group">
            <label>Manager Name:</label>
            <input
              type="text"
              name="manager_name"
              value={formData.manager_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Manager Phone:</label>
              <input
                type="tel"
                name="manager_phone"
                value={formData.manager_phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Manager Email:</label>
              <input
                type="email"
                name="manager_email"
                value={formData.manager_email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Status</h4>
          <div className="form-group">
            <label>Branch Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {isEditing ? 'Update Branch' : 'Create Branch'}
          </button>
          <button type="button" className="cancel-btn" onClick={resetForm}>
            Cancel
          </button>
        </div>
      </form>

      <div className="existing-branches">
        <h4>Existing Branch Offices</h4>
        <div className="branches-list">
          {branches.map((branch) => (
            <div key={branch.branch_id} className="branch-card">
              <div className="branch-info">
                <h5>{branch.branch_name}</h5>
                <p>{branch.address}</p>
                <p>{branch.city}, {branch.state} - {branch.pincode}</p>
                <p>Manager: {branch.manager_name}</p>
                <p>Status: <span className={`status ${branch.status}`}>{branch.status}</span></p>
              </div>
              <div className="branch-actions">
                <button onClick={() => handleEdit(branch)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(branch.branch_id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 