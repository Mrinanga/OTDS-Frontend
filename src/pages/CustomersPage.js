import React, { useState } from "react";
import "../styles/CustomersPage.css";

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
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredCustomers = customers
    .filter((cust) =>
      cust.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleAddCustomer = () => {
    setEditCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this customer?")) {
      setCustomers(customers.filter((cust) => cust.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const newCustomer = {
      id: editCustomer ? editCustomer.id : Date.now(),
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      status: form.status.value,
      orders: editCustomer ? editCustomer.orders : 0,
    };
    if (editCustomer) {
      setCustomers(
        customers.map((c) => (c.id === newCustomer.id ? newCustomer : c))
      );
    } else {
      setCustomers([newCustomer, ...customers]);
    }
    setModalOpen(false);
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

      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={handleSave}>
            <h3>{editCustomer ? "Edit Customer" : "Add Customer"}</h3>
            <input
              name="name"
              defaultValue={editCustomer?.name}
              required
              placeholder="Full Name"
            />
            <input
              name="phone"
              defaultValue={editCustomer?.phone}
              required
              placeholder="Phone"
            />
            <input
              name="email"
              defaultValue={editCustomer?.email}
              required
              placeholder="Email"
            />
            <input
              name="address"
              defaultValue={editCustomer?.address}
              required
              placeholder="Address"
            />
            <select
              name="status"
              defaultValue={editCustomer?.status || "Active"}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}