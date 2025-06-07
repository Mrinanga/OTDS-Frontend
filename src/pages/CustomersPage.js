import React, { useState, useEffect } from "react";
import "../styles/CustomersPage.css";
import apiService from '../services/api.service';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    business_type: '',
    tax_id: '',
    credit_limit: '',
    payment_terms: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCustomers();
      if (response.data && Array.isArray(response.data)) {
        // Transform the data to match our display format
        const transformedCustomers = response.data.map(customer => ({
          id: customer.customer_id,
          name: `${customer.first_name} ${customer.last_name}`,
          company: customer.company_name,
          email: customer.email,
          phone: customer.phone,
          business_type: customer.business_type,
          tax_id: customer.tax_id,
          credit_limit: customer.credit_limit,
          payment_terms: customer.payment_terms,
          status: customer.status || 'Active'
        }));
        setCustomers(transformedCustomers);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      first_name: customer.name.split(' ')[0] || '',
      last_name: customer.name.split(' ').slice(1).join(' ') || '',
      email: customer.email || '',
      phone: customer.phone || '',
      company_name: customer.company || '',
      business_type: customer.business_type || '',
      tax_id: customer.tax_id || '',
      credit_limit: customer.credit_limit || '',
      payment_terms: customer.payment_terms || ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCustomer) {
        await apiService.updateProfile(selectedCustomer.id, formData);
      } else {
        await apiService.createCustomer(formData);
      }
      fetchCustomers();
      setSelectedCustomer(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        business_type: '',
        tax_id: '',
        credit_limit: '',
        payment_terms: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save customer data');
      console.error('Error saving customer:', err);
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
      cust.name.toLowerCase().includes(search.toLowerCase()) ||
      cust.company.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleExportCSV = () => {
    const csvContent = [
      ["Name", "Company", "Phone", "Email", "Business Type", "Tax ID", "Credit Limit", "Payment Terms", "Status"],
      ...customers.map((c) => [
        c.name,
        c.company,
        c.phone,
        c.email,
        c.business_type,
        c.tax_id,
        c.credit_limit,
        c.payment_terms,
        c.status,
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
          <button className="add-btn" onClick={() => setSelectedCustomer(null)}>
            + Add Customer
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by name or company..."
        value={search}
        onChange={handleSearch}
        className="search-input"
      />

      {loading && <div className="loading">Loading customers...</div>}
      {error && <div className="error">{error}</div>}

      <div className="table-wrapper">
        <table className="customers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Business Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust, index) => (
                <tr key={cust.id}>
                  <td>{index + 1}</td>
                  <td>{cust.name}</td>
                  <td>{cust.company}</td>
                  <td>{cust.phone}</td>
                  <td>{cust.email}</td>
                  <td>{cust.business_type}</td>
                  <td>
                    <span className={`status-badge ${cust.status.toLowerCase()}`}>
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  {error ? 'Error loading customers' : 'No customers found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomer !== undefined && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={handleSubmit}>
            <h3>{selectedCustomer ? "Edit Customer" : "Add Customer"}</h3>
            <div className="form-row">
              <input
                name="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
                placeholder="First Name"
              />
              <input
                name="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
                placeholder="Last Name"
              />
            </div>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              required
              placeholder="Company Name"
            />
            <input
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              type="email"
              placeholder="Email"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              placeholder="Phone"
            />
            <input
              name="business_type"
              value={formData.business_type}
              onChange={(e) =>
                setFormData({ ...formData, business_type: e.target.value })
              }
              placeholder="Business Type"
            />
            <input
              name="tax_id"
              value={formData.tax_id}
              onChange={(e) =>
                setFormData({ ...formData, tax_id: e.target.value })
              }
              placeholder="Tax ID"
            />
            <input
              name="credit_limit"
              value={formData.credit_limit}
              onChange={(e) =>
                setFormData({ ...formData, credit_limit: e.target.value })
              }
              type="number"
              placeholder="Credit Limit"
            />
            <input
              name="payment_terms"
              value={formData.payment_terms}
              onChange={(e) =>
                setFormData({ ...formData, payment_terms: e.target.value })
              }
              placeholder="Payment Terms"
            />
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setSelectedCustomer(undefined)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
