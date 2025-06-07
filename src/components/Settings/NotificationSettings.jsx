// src/components/forms/NotificationsForm.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Divider,
  FormGroup,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  MenuItem,
  InputLabel,
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

const NotificationSettings = () => {
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationFrequency: 'immediate',
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    notificationTypes: {
      bookingUpdates: true,
      paymentReminders: true,
      systemAlerts: true,
      marketingUpdates: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User data not found');
      }
      const response = await settingsService.getNotificationSettings(user.id);
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

  const handleNotificationTypeChange = (type) => (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: checked
      }
    }));
  };

  const handleQuietHoursChange = (field) => (e) => {
    const { value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: type === 'checkbox' ? checked : value
      }
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
      await settingsService.updateNotificationSettings(user.id, formData);
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
          Notification Channels
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                  />
                }
                label="Email Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleInputChange}
                  />
                }
                label="SMS Notifications"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleInputChange}
                  />
                }
                label="Push Notifications"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Notification Frequency</InputLabel>
              <Select
                name="notificationFrequency"
                value={formData.notificationFrequency}
                onChange={handleInputChange}
                label="Notification Frequency"
              >
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="daily">Daily Digest</MenuItem>
                <MenuItem value="weekly">Weekly Summary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    name="quietHours.enabled"
                    checked={formData.quietHours.enabled}
                    onChange={handleQuietHoursChange('enabled')}
                  />
                }
                label="Enable Quiet Hours"
              />
            </FormGroup>
            {formData.quietHours.enabled && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    name="quietHours.start"
                    value={formData.quietHours.start}
                    onChange={handleQuietHoursChange('start')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    name="quietHours.end"
                    value={formData.quietHours.end}
                    onChange={handleQuietHoursChange('end')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Notification Types
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notificationTypes.bookingUpdates}
                    onChange={handleNotificationTypeChange('bookingUpdates')}
                  />
                }
                label="Booking Updates"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notificationTypes.paymentReminders}
                    onChange={handleNotificationTypeChange('paymentReminders')}
                  />
                }
                label="Payment Reminders"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notificationTypes.systemAlerts}
                    onChange={handleNotificationTypeChange('systemAlerts')}
                  />
                }
                label="System Alerts"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.notificationTypes.marketingUpdates}
                    onChange={handleNotificationTypeChange('marketingUpdates')}
                  />
                }
                label="Marketing Updates"
              />
            </FormGroup>
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

export default NotificationSettings;