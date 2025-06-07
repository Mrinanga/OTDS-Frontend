// src/components/forms/PreferencesForm.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as settingsService from '../../services/settingsService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const PreferencesSettings = () => {
  const [formData, setFormData] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'INR',
    displayDensity: 'comfortable',
    autoSave: true,
    defaultView: 'dashboard'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferencesSettings();
  }, []);

  const loadPreferencesSettings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User data not found');
      }
      const response = await settingsService.getUserPreferences(user.id);
      setFormData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User data not found');
      }
      await settingsService.updateUserPreferences(user.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated successfully!
        </Alert>
      )}

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System Default</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Display Density</InputLabel>
              <Select
                name="displayDensity"
                value={formData.displayDensity}
                onChange={handleInputChange}
                label="Display Density"
              >
                <MenuItem value="comfortable">Comfortable</MenuItem>
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="spacious">Spacious</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Localization
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">Hindi</MenuItem>
                <MenuItem value="mr">Marathi</MenuItem>
                <MenuItem value="gu">Gujarati</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                label="Timezone"
              >
                <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
                <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
                <MenuItem value="Asia/Singapore">Singapore (SGT)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Date Format</InputLabel>
              <Select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleInputChange}
                label="Date Format"
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Time Format</InputLabel>
              <Select
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleInputChange}
                label="Time Format"
              >
                <MenuItem value="12h">12-hour (AM/PM)</MenuItem>
                <MenuItem value="24h">24-hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                label="Currency"
              >
                <MenuItem value="INR">Indian Rupee (₹)</MenuItem>
                <MenuItem value="USD">US Dollar ($)</MenuItem>
                <MenuItem value="EUR">Euro (€)</MenuItem>
                <MenuItem value="GBP">British Pound (£)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          General Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    name="autoSave"
                    checked={formData.autoSave}
                    onChange={handleInputChange}
                  />
                }
                label="Auto-save Changes"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Default View</InputLabel>
              <Select
                name="defaultView"
                value={formData.defaultView}
                onChange={handleInputChange}
                label="Default View"
              >
                <MenuItem value="dashboard">Dashboard</MenuItem>
                <MenuItem value="bookings">Bookings</MenuItem>
                <MenuItem value="reports">Reports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
};

export default PreferencesSettings;