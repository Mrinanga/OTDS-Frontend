// src/components/forms/PreferencesForm.js
import React from "react";

export default function PreferencesForm({ formData, handleChange }) {
  return (
    <section>
      <h3>Preferences</h3>
      <label>
        Theme:
        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </label>
      <label>
        Language:
        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="as">Assamese</option>
        </select>
      </label>
      <label>
        Currency:
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
        </select>
      </label>
      <label>
        Time Zone:
        <select
          name="timeZone"
          value={formData.timeZone}
          onChange={handleChange}
        >
          <option value="Asia/Kolkata">Asia/Kolkata</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New York</option>
        </select>
      </label>
    </section>
  );
}