// src/components/forms/NotificationsForm.js
import React from "react";

export default function NotificationsForm({ formData, handleChange }) {
  return (
    <section className="notification-settings">
      <h3>Notification Settings</h3>

      <div className="form-section">
        <h4>Delivery Notifications</h4>
        <div className="notification-group">
          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifyDeliveryStatus"
                  checked={formData.notifyDeliveryStatus}
                  onChange={handleChange}
                />
                Delivery Status Updates
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryStatusEmail"
                    checked={formData.deliveryStatusEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryStatusSMS"
                    checked={formData.deliveryStatusSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryStatusPush"
                    checked={formData.deliveryStatusPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Get notified about delivery status changes (Picked up, In Transit, Delivered, etc.)</p>
          </div>

          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifyDeliveryAttempts"
                  checked={formData.notifyDeliveryAttempts}
                  onChange={handleChange}
                />
                Delivery Attempt Updates
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryAttemptsEmail"
                    checked={formData.deliveryAttemptsEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryAttemptsSMS"
                    checked={formData.deliveryAttemptsSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="deliveryAttemptsPush"
                    checked={formData.deliveryAttemptsPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Receive notifications about delivery attempts and any issues encountered</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Pickup Notifications</h4>
        <div className="notification-group">
          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifyPickupRequests"
                  checked={formData.notifyPickupRequests}
                  onChange={handleChange}
                />
                New Pickup Requests
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRequestsEmail"
                    checked={formData.pickupRequestsEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRequestsSMS"
                    checked={formData.pickupRequestsSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRequestsPush"
                    checked={formData.pickupRequestsPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Get notified when new pickup requests are assigned to you</p>
          </div>

          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifyPickupReminders"
                  checked={formData.notifyPickupReminders}
                  onChange={handleChange}
                />
                Pickup Reminders
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRemindersEmail"
                    checked={formData.pickupRemindersEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRemindersSMS"
                    checked={formData.pickupRemindersSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="pickupRemindersPush"
                    checked={formData.pickupRemindersPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Receive reminders about upcoming pickups</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>System Notifications</h4>
        <div className="notification-group">
          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifySystemAlerts"
                  checked={formData.notifySystemAlerts}
                  onChange={handleChange}
                />
                System Alerts
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="systemAlertsEmail"
                    checked={formData.systemAlertsEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="systemAlertsSMS"
                    checked={formData.systemAlertsSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="systemAlertsPush"
                    checked={formData.systemAlertsPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Receive important system alerts and updates</p>
          </div>

          <div className="notification-option">
            <div className="notification-header">
              <label>
                <input
                  type="checkbox"
                  name="notifyPerformanceReports"
                  checked={formData.notifyPerformanceReports}
                  onChange={handleChange}
                />
                Performance Reports
              </label>
              <div className="notification-channels">
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="performanceReportsEmail"
                    checked={formData.performanceReportsEmail}
                    onChange={handleChange}
                  />
                  Email
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="performanceReportsSMS"
                    checked={formData.performanceReportsSMS}
                    onChange={handleChange}
                  />
                  SMS
                </label>
                <label className="channel-option">
                  <input
                    type="checkbox"
                    name="performanceReportsPush"
                    checked={formData.performanceReportsPush}
                    onChange={handleChange}
                  />
                  Push
                </label>
              </div>
            </div>
            <p className="help-text">Get daily/weekly performance reports and analytics</p>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Notification Schedule</h4>
        <div className="form-group">
          <label>Quiet Hours:</label>
          <div className="time-range">
            <select
              name="quietHoursStart"
              value={formData.quietHoursStart}
              onChange={handleChange}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i}:00`}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
            <span>to</span>
            <select
              name="quietHoursEnd"
              value={formData.quietHoursEnd}
              onChange={handleChange}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i}:00`}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
          </div>
          <p className="help-text">During these hours, you'll only receive critical notifications</p>
        </div>

        <div className="form-group">
          <label>Report Frequency:</label>
          <select
            name="reportFrequency"
            value={formData.reportFrequency}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </section>
  );
}