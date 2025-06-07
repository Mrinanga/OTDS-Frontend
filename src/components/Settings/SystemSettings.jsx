// src/components/forms/SystemForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    // System Information
    systemName: '',
    systemVersion: '',
    lastUpdate: '',
    
    // General Settings
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    language: 'en',
    
    // Delivery Settings
    maxDeliveryRadius: 50,
    defaultDeliverySlot: 'morning',
    defaultPickupSlot: 'morning',
    autoAssignPickups: true,
    enableRouteOptimization: true,
    
    // Performance Settings
    refreshInterval: '60',
    maxConcurrentDeliveries: 100,
    maxPickupAttempts: 3,
    deliveryTimeout: 30,
    
    // Integration Settings
    smsGateway: 'twilio',
    emailProvider: 'smtp',
    mapProvider: 'google',
    paymentGateway: 'stripe',
    
    // Backup Settings
    backupFrequency: 'daily',
    backupTime: '00:00',
    retentionPeriod: 30,
    autoBackup: true,
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: '',
    maintenanceSchedule: '',
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    enableApiLogging: true,
    
    // Cache Settings
    cacheEnabled: true,
    cacheDuration: 3600,
    clearCacheOnUpdate: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const response = await axios.get('/api/system/settings');
      setFormData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await axios.put('/api/system/settings', formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving system settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading system settings...</div>;
  }

  return (
    <div className="system-settings">
      <form onSubmit={handleSubmit}>
        {/* System Information Section */}
        <div className="settings-section">
          <h3>System Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>System Name</label>
              <input
                type="text"
                name="systemName"
                value={formData.systemName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="info-item">
              <label>System Version</label>
              <input
                type="text"
                name="systemVersion"
                value={formData.systemVersion}
                readOnly
                className="readonly"
              />
            </div>
            <div className="info-item">
              <label>Last Update</label>
              <input
                type="text"
                name="lastUpdate"
                value={formData.lastUpdate}
                readOnly
                className="readonly"
              />
            </div>
          </div>
        </div>

        {/* General Settings Section */}
        <div className="settings-section">
          <h3>General Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
              >
                <option value="Asia/Kolkata">India (IST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="Europe/London">London (GMT)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleInputChange}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Format</label>
              <select
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleInputChange}
              >
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Delivery Settings Section */}
        <div className="settings-section">
          <h3>Delivery Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>Max Delivery Radius (km)</label>
              <input
                type="number"
                name="maxDeliveryRadius"
                value={formData.maxDeliveryRadius}
                onChange={handleInputChange}
                min="1"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Default Delivery Slot</label>
              <select
                name="defaultDeliverySlot"
                value={formData.defaultDeliverySlot}
                onChange={handleInputChange}
              >
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Pickup Slot</label>
              <select
                name="defaultPickupSlot"
                value={formData.defaultPickupSlot}
                onChange={handleInputChange}
              >
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                <option value="evening">Evening (4 PM - 8 PM)</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="autoAssignPickups"
                  checked={formData.autoAssignPickups}
                  onChange={handleInputChange}
                />
                Auto-assign Pickups
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="enableRouteOptimization"
                  checked={formData.enableRouteOptimization}
                  onChange={handleInputChange}
                />
                Enable Route Optimization
              </label>
            </div>
          </div>
        </div>

        {/* Performance Settings Section */}
        <div className="settings-section">
          <h3>Performance Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>Refresh Interval (seconds)</label>
              <input
                type="number"
                name="refreshInterval"
                value={formData.refreshInterval}
                onChange={handleInputChange}
                min="30"
                max="300"
              />
            </div>
            <div className="form-group">
              <label>Max Concurrent Deliveries</label>
              <input
                type="number"
                name="maxConcurrentDeliveries"
                value={formData.maxConcurrentDeliveries}
                onChange={handleInputChange}
                min="1"
                max="1000"
              />
            </div>
            <div className="form-group">
              <label>Max Pickup Attempts</label>
              <input
                type="number"
                name="maxPickupAttempts"
                value={formData.maxPickupAttempts}
                onChange={handleInputChange}
                min="1"
                max="5"
              />
            </div>
            <div className="form-group">
              <label>Delivery Timeout (minutes)</label>
              <input
                type="number"
                name="deliveryTimeout"
                value={formData.deliveryTimeout}
                onChange={handleInputChange}
                min="15"
                max="120"
              />
            </div>
          </div>
        </div>

        {/* Integration Settings Section */}
        <div className="settings-section">
          <h3>Integration Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>SMS Gateway</label>
              <select
                name="smsGateway"
                value={formData.smsGateway}
                onChange={handleInputChange}
              >
                <option value="twilio">Twilio</option>
                <option value="msg91">MSG91</option>
                <option value="nexmo">Nexmo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email Provider</label>
              <select
                name="emailProvider"
                value={formData.emailProvider}
                onChange={handleInputChange}
              >
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
              </select>
            </div>
            <div className="form-group">
              <label>Map Provider</label>
              <select
                name="mapProvider"
                value={formData.mapProvider}
                onChange={handleInputChange}
              >
                <option value="google">Google Maps</option>
                <option value="mapbox">Mapbox</option>
                <option value="here">HERE Maps</option>
              </select>
            </div>
            <div className="form-group">
              <label>Payment Gateway</label>
              <select
                name="paymentGateway"
                value={formData.paymentGateway}
                onChange={handleInputChange}
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backup Settings Section */}
        <div className="settings-section">
          <h3>Backup Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>Backup Frequency</label>
              <select
                name="backupFrequency"
                value={formData.backupFrequency}
                onChange={handleInputChange}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="form-group">
              <label>Backup Time</label>
              <input
                type="time"
                name="backupTime"
                value={formData.backupTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Retention Period (days)</label>
              <input
                type="number"
                name="retentionPeriod"
                value={formData.retentionPeriod}
                onChange={handleInputChange}
                min="1"
                max="365"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="autoBackup"
                  checked={formData.autoBackup}
                  onChange={handleInputChange}
                />
                Enable Automatic Backup
              </label>
            </div>
          </div>
        </div>

        {/* Maintenance Settings Section */}
        <div className="settings-section">
          <h3>Maintenance Settings</h3>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleInputChange}
                />
                Enable Maintenance Mode
              </label>
            </div>
            <div className="form-group">
              <label>Maintenance Message</label>
              <textarea
                name="maintenanceMessage"
                value={formData.maintenanceMessage}
                onChange={handleInputChange}
                rows="3"
                placeholder="Enter maintenance message..."
              />
            </div>
            <div className="form-group">
              <label>Maintenance Schedule</label>
              <input
                type="datetime-local"
                name="maintenanceSchedule"
                value={formData.maintenanceSchedule}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* API Settings Section */}
        <div className="settings-section">
          <h3>API Settings</h3>
          <div className="settings-grid">
            <div className="form-group">
              <label>API Rate Limit (requests/hour)</label>
              <input
                type="number"
                name="apiRateLimit"
                value={formData.apiRateLimit}
                onChange={handleInputChange}
                min="100"
                max="10000"
              />
            </div>
            <div className="form-group">
              <label>API Timeout (seconds)</label>
              <input
                type="number"
                name="apiTimeout"
                value={formData.apiTimeout}
                onChange={handleInputChange}
                min="5"
                max="60"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="enableApiLogging"
                  checked={formData.enableApiLogging}
                  onChange={handleInputChange}
                />
                Enable API Logging
              </label>
            </div>
          </div>
        </div>

        {/* Cache Settings Section */}
        <div className="settings-section">
          <h3>Cache Settings</h3>
          <div className="settings-grid">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="cacheEnabled"
                  checked={formData.cacheEnabled}
                  onChange={handleInputChange}
                />
                Enable Caching
              </label>
            </div>
            <div className="form-group">
              <label>Cache Duration (seconds)</label>
              <input
                type="number"
                name="cacheDuration"
                value={formData.cacheDuration}
                onChange={handleInputChange}
                min="60"
                max="86400"
              />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="clearCacheOnUpdate"
                  checked={formData.clearCacheOnUpdate}
                  onChange={handleInputChange}
                />
                Clear Cache on Update
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
          {saveStatus === 'success' && (
            <span className="success-message">Settings saved successfully!</span>
          )}
          {saveStatus === 'error' && (
            <span className="error-message">Error saving settings. Please try again.</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;
