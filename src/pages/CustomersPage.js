import React, { useState, useEffect } from "react";
import "../styles/CustomersPage.css";
import apiService from '../services/api.service';

const initialCustomers = [
  {
    id: 1,
    name: "Ramesh Das",
    phone: "9876543210",
    email: "ramesh@example.com",
    address: "Guwahati, Assam",
    status: "Active",
    orders: 3,
  },
  {
    id: 2,
    name: "Priya Sharma",
    phone: "7896541230",
    email: "priya@example.com",
    address: "Shillong, Meghalaya",
    status: "Inactive",
    orders: 5,
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await apiService.updateProfile(formData);
      } else {
        await apiService.register(formData);
      }
      fetchCustomers();
      setSelectedCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer data');
    }
  };

  const handleDelete = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiService.deleteCustomer(customerId);
        fetchCustomers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete customer');
      }
    }
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCustomers = customers
    .filter((cust) =>
      cust.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const toggleStatus = (id) => {
    setCustomers(
      customers.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c
      )
    );
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Name", "Phone", "Email", "Address", "Status", "Orders"],
      ...customers.map((c) => [
        c.name,
        c.phone,
        c.email,
        c.address,
        c.status,
        c.orders,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h2>Customers</h2>
        <div>
          <button className="export-btn" onClick={handleExportCSV}>
            Export CSV
          </button>
          <button className="add-btn" onClick={handleAddCustomer}>
            + Add Customer
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Orders</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((cust, index) => (
              <tr key={cust.id}>
                <td>{index + 1}</td>
                <td>{cust.name}</td>
                <td>{cust.phone}</td>
                <td>{cust.email}</td>
                <td>{cust.address}</td>
                <td>{cust.orders}</td>
                <td>
                  <span
                    className={`status-badge ${cust.status.toLowerCase()}`}
                    onClick={() => toggleStatus(cust.id)}
                  >
                    {cust.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn view">View</button>
                  <button
                    className="action-btn edit"
                    onClick={() => handleEdit(cust)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(cust.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="8" className="no-data">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={handleSubmit}>
            <h3>{selectedCustomer ? "Edit Customer" : "Add Customer"}</h3>
            <input
              name="name"
              defaultValue={selectedCustomer?.name}
              required
              placeholder="Full Name"
            />
            <input
              name="phone"
              defaultValue={selectedCustomer?.phone}
              required
              placeholder="Phone"
            />
            <input
              name="email"
              defaultValue={selectedCustomer?.email}
              required
              placeholder="Email"
            />
            <input
              name="address"
              defaultValue={selectedCustomer?.address}
              required
              placeholder="Address"
            />
            <select
              name="status"
              defaultValue={selectedCustomer?.status || "Active"}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setSelectedCustomer(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}