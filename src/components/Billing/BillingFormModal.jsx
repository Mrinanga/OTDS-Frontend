// BillingFormModal.jsx
import React, { useState } from "react";
import "../../styles/BillingFormModal.css"; // optional styling

const BillingFormModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderAddress: "",
    senderPhone: "",
    receiverName: "",
    receiverAddress: "",
    receiverPhone: "",
    trackingNumber: "",
    shipmentDate: "",
    origin: "",
    destination: "",
    mode: "Surface",
    packages: 1,
    weight: 1,
    baseCharge: 50,
    fuelSurcharge: 10,
    deliveryFee: 20,
    gst: 18,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Generate Courier Bill</h2>
        <div className="form-group">
          <h3>Sender Details</h3>
          <input name="senderName" placeholder="Sender Name" onChange={handleChange} />
          <input name="senderAddress" placeholder="Sender Address" onChange={handleChange} />
          <input name="senderPhone" placeholder="Sender Phone" onChange={handleChange} />
        </div>

        <div className="form-group">
          <h3>Receiver Details</h3>
          <input name="receiverName" placeholder="Receiver Name" onChange={handleChange} />
          <input name="receiverAddress" placeholder="Receiver Address" onChange={handleChange} />
          <input name="receiverPhone" placeholder="Receiver Phone" onChange={handleChange} />
        </div>

        <div className="form-group">
          <h3>Shipment Details</h3>
          <input name="trackingNumber" placeholder="Tracking Number" onChange={handleChange} />
          <input name="shipmentDate" type="date" onChange={handleChange} />
          <input name="origin" placeholder="Origin" onChange={handleChange} />
          <input name="destination" placeholder="Destination" onChange={handleChange} />
          <select name="mode" onChange={handleChange}>
            <option value="Surface">Surface</option>
            <option value="Air">Air</option>
            <option value="Express">Express</option>
          </select>
          <input type="number" name="packages" placeholder="No. of Packages" onChange={handleChange} />
          <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        </div>

        <div className="form-group">
          <h3>Charges</h3>
          <input name="baseCharge" placeholder="Base Charge" onChange={handleChange} />
          <input name="fuelSurcharge" placeholder="Fuel Surcharge" onChange={handleChange} />
          <input name="deliveryFee" placeholder="Delivery Fee" onChange={handleChange} />
          <input name="gst" placeholder="GST %" onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BillingFormModal;
