import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_CONFIG from '../config/api.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        // Set the token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Try to fetch fresh user data
          const response = await axios.get(`${API_CONFIG.BASE_URL}/customers/profile`);
          setUser(response.data.data);
        } catch (err) {
          // If API call fails, use stored user data
          console.log('Using stored user data due to API error:', err);
          setUser(JSON.parse(storedUser));
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, credentials);
      const { token, user } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE}`, userData);
      const { token, user } = response.data.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update user state
      setUser(user);
      
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    // Remove token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CUSTOMERS.UPDATE}`, profileData);
      const updatedUser = response.data.data;
      
      // Update stored user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await axios.put(`${API_CONFIG.BASE_URL}/auth/password`, passwordData);
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await axios.post(`${API_CONFIG.BASE_URL}/auth/forgot-password`, { email });
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
      throw err;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      setError(null);
      await axios.post(`${API_CONFIG.BASE_URL}/auth/reset-password`, resetData);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 