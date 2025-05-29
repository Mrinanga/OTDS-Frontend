// CourierRateCalculator.jsx
import React, { useState } from "react";
import "../styles/rateCalculator.css"; // Adjust the path as necessary

const CourierRateCalculator = () => {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    packageType: "Document",
    declaredValue: "",
    insurance: false,
    deliverySpeed: "Standard",
    transportMode: "Surface",
    pickupRequired: false,
    cod: false,
  });

  const [rateResult, setRateResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculateRate = () => {
    const {
      weight,
      length,
      width,
      height,
      insurance,
      deliverySpeed,
      transportMode,
    } = formData;

    const volumetricWeight = (length * width * height) / 5000 || 0;
    const actualWeight = parseFloat(weight) || 0;
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);

    let baseRate = 50 + chargeableWeight * 10;

    if (deliverySpeed === "Express") baseRate += 30;
    if (transportMode === "Air") baseRate += 20;
    if (insurance) baseRate += 15;

    const estimatedDelivery =
      deliverySpeed === "Express" ? "1-2 Days" : deliverySpeed === "Standard" ? "2-5 Days" : "Same Day";

    setRateResult({
      chargeableWeight: chargeableWeight.toFixed(2),
      totalCost: baseRate.toFixed(2),
      estimatedDelivery,
    });
  };

  return (
    <div className="rate-calculator">
      <h2>Courier Rate Calculator</h2>

      <div className="form-grid">
        <input name="origin" placeholder="Origin City / PIN" onChange={handleChange} />
        <input name="destination" placeholder="Destination City / PIN" onChange={handleChange} />
        <input name="weight" placeholder="Weight (kg)" type="number" onChange={handleChange} />

        <input name="length" placeholder="Length (cm)" type="number" onChange={handleChange} />
        <input name="width" placeholder="Width (cm)" type="number" onChange={handleChange} />
        <input name="height" placeholder="Height (cm)" type="number" onChange={handleChange} />

        <select name="packageType" onChange={handleChange}>
          <option value="Document">Document</option>
          <option value="Parcel">Parcel</option>
        </select>

        <input name="declaredValue" placeholder="Declared Value (₹)" type="number" onChange={handleChange} />

        <div className="checkbox-group">
          <label><input type="checkbox" name="insurance" onChange={handleChange} /> Insurance</label>
          <label><input type="checkbox" name="pickupRequired" onChange={handleChange} /> Pickup Required</label>
          <label><input type="checkbox" name="cod" onChange={handleChange} /> COD</label>
        </div>

        <select name="deliverySpeed" onChange={handleChange}>
          <option value="Same Day">Same Day</option>
          <option value="Next Day">Next Day</option>
          <option value="Standard">Standard (2-5 Days)</option>
          <option value="Express">Express (1-2 Days)</option>
        </select>

        <select name="transportMode" onChange={handleChange}>
          <option value="Surface">Surface</option>
          <option value="Air">Air</option>
        </select>
      </div>

      <button className="calculate-btn" onClick={calculateRate}>Calculate Shipping Rate</button>

      {rateResult && (
        <div className="result-box">
          <h3>Estimated Shipping Cost</h3>
          <p><strong>Chargeable Weight:</strong> {rateResult.chargeableWeight} kg</p>
          <p><strong>Total Cost:</strong> ₹{rateResult.totalCost}</p>
          <p><strong>Estimated Delivery:</strong> {rateResult.estimatedDelivery}</p>
        </div>
      )}
    </div>
  );
};

export default CourierRateCalculator;