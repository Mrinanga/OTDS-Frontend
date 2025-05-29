// ZoneNroutes.jsx
import React, { useState } from "react";
import "../styles/ZoneNroutes.css";

const zones = [
  { name: "Zone A", coverage: "Same City", time: "Same Day", samples: "Guwahati, Kolkata" },
  { name: "Zone B", coverage: "Same State / Nearby Cities", time: "1-2 Days", samples: "Silchar, Shillong" },
  { name: "Zone C", coverage: "Metro & Tier-1 Cities", time: "2-4 Days", samples: "Delhi, Mumbai" },
  { name: "Zone D", coverage: "Remote / ODA Locations", time: "4-7 Days", samples: "Tawang, Haflong" },
];

const routes = [
  { from: "Guwahati", to: "Kolkata", type: "Surface", frequency: "Daily" },
  { from: "Guwahati", to: "Shillong", type: "Surface", frequency: "Twice Daily" },
  { from: "Guwahati", to: "Delhi", type: "Air", frequency: "Alternate Days" },
];

const ZoneNroutes = () => {
  const [pin, setPin] = useState("");
  const [zoneResult, setZoneResult] = useState(null);

  const handleSearch = () => {
    if (!pin) return;
    const zone = zones[Math.floor(Math.random() * zones.length)];
    setZoneResult(zone);
  };

  return (
    <div className="zone-routes">
      <h2>Courier Zones & Service Routes</h2>

      <div className="pin-checker">
        <input
          type="text"
          placeholder="Enter your PIN Code"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button onClick={handleSearch}>Check Zone</button>
        {zoneResult && (
          <div className="zone-result">
            <strong>{zoneResult.name}</strong>: {zoneResult.coverage}, ETA: {zoneResult.time}
          </div>
        )}
      </div>

      <section className="zone-table">
        <h3>Zone Classification</h3>
        <table>
          <thead>
            <tr>
              <th>Zone</th>
              <th>Coverage Area</th>
              <th>Delivery Time</th>
              <th>Sample Locations</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((z, i) => (
              <tr key={i}>
                <td>{z.name}</td>
                <td>{z.coverage}</td>
                <td>{z.time}</td>
                <td>{z.samples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="route-table">
        <h3>Major Route Schedule</h3>
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Mode</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, i) => (
              <tr key={i}>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>{r.type}</td>
                <td>{r.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ZoneNroutes;