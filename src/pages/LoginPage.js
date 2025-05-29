import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import "../styles/LoginPage.css";
import apiService from '../services/api.service';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login({ email: username, password });
      const { token, refreshToken, user } = response.data;
      
      // Store tokens
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Store user data if needed
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'branch') {
        navigate('/branch/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Panel */}
        <div className="left-panel">
          <h2>Start Shipping Today with<br />3 Simple Steps!</h2>
          <div className="step">
            <span>1</span>
            <div>
              <p className="step-title">KYC Verification</p>
              <p className="step-desc">It takes only 30 secs to complete</p>
            </div>
          </div>
          <div className="step">
            <span>2</span>
            <div>
              <p className="step-title">Recharge Your Wallet</p>
              <p className="step-desc">Add Credits and start shipping today</p>
            </div>
          </div>
          <div className="step">
            <span>3</span>
            <div>
              <p className="step-title">Place Your Order</p>
              <p className="step-desc">Create your order with 3 steps</p>
            </div>
          </div>
          <img src="/delivery-guy.png" alt="Delivery Guy" className="delivery-image" />
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <img src="./assets/logo.png" alt="Otds Logo" className="logo" />
          <h2>Login</h2>
          {error && <div className="error-text">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="branch">Branch Office</option>
            </select>

            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>Login</button>
            <div className="or">OR</div>
            <button type="button" className="otp-btn">Login with OTP</button>
            <p className="signup-link">
              Don't have an account? <a href="#">Sign up Now</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
