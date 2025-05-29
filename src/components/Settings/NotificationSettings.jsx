// src/components/forms/NotificationsForm.js
import React from "react";

export default function NotificationsForm({ formData, handleChange }) {
  return (
    <section>
      <h3>Notification Settings</h3>
      <label>
        <input
          type="checkbox"
          name="emailNotif"
          checked={formData.emailNotif}
          onChange={handleChange}
        />
        Receive Email Notifications
      </label>
      <label>
        <input
          type="checkbox"
          name="smsNotif"
          checked={formData.smsNotif}
          onChange={handleChange}
        />
        Receive SMS Notifications
      </label>
    </section>
  );
}