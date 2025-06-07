// src/components/forms/PreferencesForm.js
import React from "react";

export default function PreferencesForm({ formData, handleChange }) {
  return (
    <section className="preferences-settings">
      <h3>System Preferences</h3>
      
      <div className="form-section">
        <h4>Display Settings</h4>
        <div className="form-group">
          <label>Theme:</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div className="form-group">
          <label>Language:</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="as">Assamese</option>
            <option value="bn">Bengali</option>
            <option value="gu">Gujarati</option>
            <option value="kn">Kannada</option>
            <option value="ml">Malayalam</option>
            <option value="mr">Marathi</option>
            <option value="pa">Punjabi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>Business Settings</h4>
        <div className="form-group">
          <label>Currency:</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Time Zone:</label>
          <select
            name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="Asia/Delhi">Asia/Delhi</option>
            <option value="Asia/Mumbai">Asia/Mumbai</option>
            <option value="Asia/Chennai">Asia/Chennai</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Asia/Dhaka">Asia/Dhaka</option>
            <option value="Asia/Karachi">Asia/Karachi</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date Format:</label>
          <select
            name="dateFormat"
            value={formData.dateFormat}
            onChange={handleChange}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h4>Delivery Settings</h4>
        <div className="form-group">
          <label>Default Delivery Time Slot:</label>
          <select
            name="defaultDeliverySlot"
            value={formData.defaultDeliverySlot}
            onChange={handleChange}
          >
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
            <option value="evening">Evening (3 PM - 6 PM)</option>
            <option value="night">Night (6 PM - 9 PM)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Default Pickup Time Slot:</label>
          <select
            name="defaultPickupSlot"
            value={formData.defaultPickupSlot}
            onChange={handleChange}
          >
            <option value="morning">Morning (9 AM - 12 PM)</option>
            <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
            <option value="evening">Evening (3 PM - 6 PM)</option>
            <option value="night">Night (6 PM - 9 PM)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Default Delivery Radius (km):</label>
          <input
            type="number"
            name="defaultDeliveryRadius"
            value={formData.defaultDeliveryRadius}
            onChange={handleChange}
            min="1"
            max="50"
          />
        </div>
      </div>

      <div className="form-section">
        <h4>Notification Preferences</h4>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="emailNotif"
              checked={formData.emailNotif}
              onChange={handleChange}
            />
            Email Notifications
          </label>
          <p className="help-text">Receive updates about deliveries and system notifications via email</p>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="smsNotif"
              checked={formData.smsNotif}
              onChange={handleChange}
            />
            SMS Notifications
          </label>
          <p className="help-text">Receive delivery updates and alerts via SMS</p>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="pushNotif"
              checked={formData.pushNotif}
              onChange={handleChange}
            />
            Push Notifications
          </label>
          <p className="help-text">Receive real-time updates in the browser</p>
        </div>
      </div>

      <div className="form-section">
        <h4>System Preferences</h4>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="autoAssignPickups"
              checked={formData.autoAssignPickups}
              onChange={handleChange}
            />
            Auto-assign Pickup Requests
          </label>
          <p className="help-text">Automatically assign pickup requests to available field executives</p>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="enableRouteOptimization"
              checked={formData.enableRouteOptimization}
              onChange={handleChange}
            />
            Enable Route Optimization
          </label>
          <p className="help-text">Automatically optimize delivery routes for field executives</p>
        </div>

        <div className="form-group">
          <label>Data Refresh Interval:</label>
          <select
            name="refreshInterval"
            value={formData.refreshInterval}
            onChange={handleChange}
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="600">10 minutes</option>
          </select>
        </div>
      </div>
    </section>
  );
}