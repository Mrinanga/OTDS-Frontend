// src/components/forms/CompanyForm.js
import React from "react";

export default function CompanyForm({ formData, handleChange }) {
  return (
    <section>
      <h3>Company Information</h3>
      <label>
        Company Name:
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </label>
      <label>
        Contact Phone:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </label>
      <label>
        Upload Logo:
        <input type="file" name="logo" />
      </label>
    </section>
  );
}
