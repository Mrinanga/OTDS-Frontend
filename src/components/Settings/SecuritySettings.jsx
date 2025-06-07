// src/components/forms/SecurityForm.js
import React, { useState } from "react";

export default function SecurityForm({ formData, handleChange }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Add password change logic here
    console.log("Password change requested:", passwordData);
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <section className="security-settings">
      <h3>Security Settings</h3>

      <div className="form-section">
        <h4>Two-Factor Authentication (2FA)</h4>
        <div className="security-option">
          <div className="security-header">
            <label>
              <input
                type="checkbox"
                name="twoFA"
                checked={formData.twoFA}
                onChange={handleChange}
              />
              Enable Two-Factor Authentication
            </label>
          </div>
          <p className="help-text">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </p>
          {formData.twoFA && (
            <div className="twofa-setup">
              <div className="form-group">
                <label>Verification Method:</label>
                <select
                  name="twoFAMethod"
                  value={formData.twoFAMethod}
                  onChange={handleChange}
                >
                  <option value="authenticator">Authenticator App</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </div>
              {formData.twoFAMethod === 'authenticator' && (
                <div className="authenticator-setup">
                  <p>Scan this QR code with your authenticator app:</p>
                  <div className="qr-code-placeholder">
                    {/* Add QR code component here */}
                    <div className="qr-code">QR Code</div>
                  </div>
                  <p className="backup-codes">
                    Backup Codes: <button type="button">Generate New Codes</button>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h4>Password Management</h4>
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <div className="form-group">
            <label>Current Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="password-strength">
              <div className="strength-meter">
                <div className="strength-bar" style={{ width: "0%" }}></div>
              </div>
              <span className="strength-text">Password strength: Weak</span>
            </div>
            <ul className="password-requirements">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>

          <div className="form-group">
            <label>Confirm New Password:</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button type="submit" className="change-password-btn">
            Change Password
          </button>
        </form>
      </div>

      <div className="form-section">
        <h4>Session Management</h4>
        <div className="security-option">
          <div className="form-group">
            <label>Session Timeout:</label>
            <select
              name="sessionTimeout"
              value={formData.sessionTimeout}
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>
          <p className="help-text">
            Automatically log out after a period of inactivity
          </p>
        </div>

        <div className="active-sessions">
          <h5>Active Sessions</h5>
          <div className="session-list">
            <div className="session-item">
              <div className="session-info">
                <span className="device">Windows PC - Chrome</span>
                <span className="location">Mumbai, India</span>
                <span className="time">Current Session</span>
              </div>
              <button type="button" className="end-session-btn">
                End Session
              </button>
            </div>
            <div className="session-item">
              <div className="session-info">
                <span className="device">iPhone - Safari</span>
                <span className="location">Delhi, India</span>
                <span className="time">Last active: 2 hours ago</span>
              </div>
              <button type="button" className="end-session-btn">
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>Login History</h4>
        <div className="login-history">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Device</th>
                <th>Location</th>
                <th>IP Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-03-15 14:30</td>
                <td>Windows PC - Chrome</td>
                <td>Mumbai, India</td>
                <td>192.168.1.1</td>
                <td className="status success">Successful</td>
              </tr>
              <tr>
                <td>2024-03-15 10:15</td>
                <td>iPhone - Safari</td>
                <td>Delhi, India</td>
                <td>192.168.1.2</td>
                <td className="status success">Successful</td>
              </tr>
              <tr>
                <td>2024-03-14 18:45</td>
                <td>Unknown Device</td>
                <td>Unknown Location</td>
                <td>192.168.1.3</td>
                <td className="status failed">Failed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h4>Security Alerts</h4>
        <div className="security-option">
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="alertNewLogin"
                checked={formData.alertNewLogin}
                onChange={handleChange}
              />
              Alert on New Login
            </label>
            <p className="help-text">
              Receive an email notification when your account is accessed from a new device or location
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="alertPasswordChange"
                checked={formData.alertPasswordChange}
                onChange={handleChange}
              />
              Alert on Password Change
            </label>
            <p className="help-text">
              Receive an email notification when your password is changed
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="alertSecuritySettings"
                checked={formData.alertSecuritySettings}
                onChange={handleChange}
              />
              Alert on Security Settings Change
            </label>
            <p className="help-text">
              Receive an email notification when security settings are modified
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
