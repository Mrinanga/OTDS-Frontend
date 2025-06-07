import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import "../styles/LoginPage.css";
import apiService from '../services/api.service';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated, setRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login({ email, password });
      
      if (!response.data?.data) {
        setError('Invalid server response format');
        return;
      }

      const { token, user } = response.data.data;

      if (!token || !user) {
        setError('Invalid response format from server');
        return;
      }

      // Check if user has branch association
      if (user.role !== 'admin' && (!user.branch || !user.branch.branch_id)) {
        setError('No branch is associated with this user. Please contact your administrator.');
        return;
      }

      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update auth context
      setIsAuthenticated(true);
      setRole(user.role);
      
      // Navigate based on role
      if (user.role === 'branch_office') {
        navigate('/dashboard-branch', { replace: true });
      } else {
        navigate('/dashboard-admin', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
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
