// src/components/forms/SystemForm.js
import React from "react";

export default function SystemForm({ handleChange }) {
  return (
    <section>
      <h3>System Options</h3>
      <label>
        Data Backup:
        <button type="button">Download Backup</button>
      </label>
      <label>
        Auto-update Interval:
        <select name="updateInterval" onChange={handleChange}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </label>
      <label>
        Help & Support Link:
        <input
          type="url"
          name="supportLink"
          placeholder="https://support.yoursite.com"
          onChange={handleChange}
        />
      </label>
    </section>
  );
}
