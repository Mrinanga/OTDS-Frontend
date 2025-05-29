// src/components/forms/ProfileForm.js
import React from "react";

export default function ProfileForm({ formData, handleChange }) {
  return (
    <section>
      <h3>Profile Settings</h3>
      <label>
        Full Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email Address:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Password:
        <input type="password" name="password" placeholder="•••••••" />
      </label>
    </section>
  );
}