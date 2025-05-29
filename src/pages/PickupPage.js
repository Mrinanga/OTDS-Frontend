import React, { useState } from 'react';
import '../styles/pickupRequests.css';

const PickupRequest = () => {
  const [form, setForm] = useState({
    customerName: '', phone: '', email: '', address: '', landmark: '', city: '', pincode: '',
    packages: '', weight: '', dimensions: '', contents: '', pickupDate: '', timeSlot: '',
    paymentMode: '', instructions: '', agent: '', zone: '', vehicle: '',
  });

  const [pickupList, setPickupList] = useState([]);

  const branchOffices = ['North Branch', 'South Branch', 'East Branch', 'West Branch'];
  const agents = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPickup = { ...form, id: Date.now(), status: 'Pending' };
    setPickupList([newPickup, ...pickupList]);
    setForm({
      customerName: '', phone: '', email: '', address: '', landmark: '', city: '', pincode: '',
      packages: '', weight: '', dimensions: '', contents: '', pickupDate: '', timeSlot: '',
      paymentMode: '', instructions: '', agent: '', zone: '', vehicle: '',
    });
  };

  return (
    <div className="pickup-container">
      <div className="pickup-section">
        <h2>Pickup Requests</h2>
        <div className="pickup-table">
          <table>
            <thead>
              <tr><th>ID</th><th>Customer</th><th>Phone</th><th>City</th><th>Date</th><th>Assigned Branch</th><th>Assigned Agent</th><th>Status</th></tr>
            </thead>
            <tbody>
              {pickupList.map(req => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.customerName}</td>
                  <td>{req.phone}</td>
                  <td>{req.city}</td>
                  <td>{req.pickupDate}</td>
                  <td>{req.agent || '-'}</td>
                  <td>{req.agent || '-'}</td>
                  <td><span className={`status ${req.status.toLowerCase()}`}>{req.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PickupRequest;

