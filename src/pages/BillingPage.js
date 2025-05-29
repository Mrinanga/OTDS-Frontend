// CourierBilling.jsx
import React, { useState } from "react";
import BillingFormModal from "../components/Billing/BillingFormModal";
import "../styles/BillingPage.css";

const CourierBilling = () => {
  const [bills, setBills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveBill = (billData) => {
    setBills((prev) => [...prev, billData]);
  };

  const totalStats = bills.reduce(
    (acc, bill) => {
      const base = parseFloat(bill.baseCharge);
      const weightCharge = parseFloat(bill.weight) * 10;
      const fuel = parseFloat(bill.fuelSurcharge);
      const delivery = parseFloat(bill.deliveryFee);
      const gst = parseFloat(bill.gst);
      const subTotal = base + weightCharge + fuel + delivery;
      const gstAmount = (subTotal * gst) / 100;
      const total = subTotal + gstAmount;
      acc.totalEarnings += total;
      acc.totalShipments += 1;
      return acc;
    },
    { totalEarnings: 0, totalShipments: 0 }
  );

  return (
    <div className="courier-billing">
      <h2>Courier Billing Dashboard</h2>

      <div className="stats">
        <p>Total Shipments: {totalStats.totalShipments}</p>
        <p>Total Earnings: ₹{totalStats.totalEarnings.toFixed(2)}</p>
      </div>

      <div className="actions">
        <button onClick={() => setIsModalOpen(true)}>Generate Bill</button>
      </div>

      <BillingFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBill}
      />

      <div className="bill-list">
        <h3>Billing List</h3>
        <table>
          <thead>
            <tr>
              <th>Tracking #</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, index) => {
              const weightCharge = bill.weight * 10;
              const subTotal =
                parseFloat(bill.baseCharge) +
                weightCharge +
                parseFloat(bill.fuelSurcharge) +
                parseFloat(bill.deliveryFee);
              const gstAmount = (subTotal * parseFloat(bill.gst)) / 100;
              const total = subTotal + gstAmount;
              return (
                <tr key={index}>
                  <td>{bill.trackingNumber}</td>
                  <td>{bill.senderName}</td>
                  <td>{bill.receiverName}</td>
                  <td>{bill.weight} kg</td>
                  <td>₹{total.toFixed(2)}</td>
                  <td>{bill.shipmentDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourierBilling;
