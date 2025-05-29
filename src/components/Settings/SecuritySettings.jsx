// src/components/forms/SecurityForm.js
import React from "react";

export default function SecurityForm({ formData, handleChange }) {
  return (
    <section>
      <h3>Security Settings</h3>
      <label>
        <input
          type="checkbox"
          name="twoFA"
          checked={formData.twoFA}
          onChange={handleChange}
        />
        Enable Two-Factor Authentication (2FA)
      </label>
      <p>Recent Logins:</p>
      <ul>
        <li>05 May 2025 – IP: 192.168.1.10</li>
        <li>02 May 2025 – IP: 192.168.1.12</li>
      </ul>
    </section>
  );
}
