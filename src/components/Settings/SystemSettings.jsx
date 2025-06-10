// src/components/Settings/SystemSettings.jsx
import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Snackbar,
  Slider,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Info, Save, Refresh, Backup, Settings } from '@mui/icons-material';
import axios from 'axios';
import systemInfo from '../../config/systemInfo';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SystemSettings = () => {
  const [formData, setFormData] = useState({
    // System Information
    systemName: systemInfo.systemName,
    systemVersion: systemInfo.systemVersion,
    lastUpdate: systemInfo.lastUpdate,
    
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const response = await axios.get('/api/system/settings');
      setFormData(prev => ({
        ...response.data,
        // Keep system info from config
        systemName: systemInfo.systemName,
        systemVersion: systemInfo.systemVersion,
        lastUpdate: systemInfo.lastUpdate
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      setSnackbar({
        open: true,
        message: 'Error loading system settings',
        severity: 'error'
      });
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
      setSnackbar({
        open: true,
        message: 'Settings saved successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving system settings:', error);
      setSaveStatus('error');
      setSnackbar({
        open: true,
        message: 'Error saving settings',
        severity: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="System Information"
          avatar={<Info color="primary" />}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="System Name"
                name="systemName"
                value={formData.systemName}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="System Version"
                name="systemVersion"
                value={formData.systemVersion}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Last Update"
                name="lastUpdate"
                value={formData.lastUpdate}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          General Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                label="Timezone"
              >
                <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time</MenuItem>
                <MenuItem value="Europe/London">London (GMT)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Time Format</InputLabel>
              <Select
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleInputChange}
                label="Time Format"
              >
                <MenuItem value="24h">24-hour</MenuItem>
                <MenuItem value="12h">12-hour</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
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
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Delivery Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>
              Max Delivery Radius (km)
            </Typography>
            <Slider
              name="maxDeliveryRadius"
              value={formData.maxDeliveryRadius}
              onChange={handleInputChange}
              min={1}
              max={100}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Default Delivery Slot</InputLabel>
              <Select
                name="defaultDeliverySlot"
                value={formData.defaultDeliverySlot}
                onChange={handleInputChange}
                label="Default Delivery Slot"
              >
                <MenuItem value="morning">Morning (9 AM - 12 PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (12 PM - 4 PM)</MenuItem>
                <MenuItem value="evening">Evening (4 PM - 8 PM)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Performance Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Refresh Interval (seconds)</InputLabel>
              <Select
                name="refreshInterval"
                value={formData.refreshInterval}
                onChange={handleInputChange}
                label="Refresh Interval (seconds)"
              >
                <MenuItem value="30">30 seconds</MenuItem>
                <MenuItem value="60">1 minute</MenuItem>
                <MenuItem value="300">5 minutes</MenuItem>
                <MenuItem value="600">10 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Max Concurrent Deliveries"
              name="maxConcurrentDeliveries"
              value={formData.maxConcurrentDeliveries}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1, max: 1000 } }}
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Integration Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>SMS Gateway</InputLabel>
              <Select
                name="smsGateway"
                value={formData.smsGateway}
                onChange={handleInputChange}
                label="SMS Gateway"
              >
                <MenuItem value="twilio">Twilio</MenuItem>
                <MenuItem value="messagebird">MessageBird</MenuItem>
                <MenuItem value="nexmo">Nexmo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Email Provider</InputLabel>
              <Select
                name="emailProvider"
                value={formData.emailProvider}
                onChange={handleInputChange}
                label="Email Provider"
              >
                <MenuItem value="smtp">SMTP</MenuItem>
                <MenuItem value="sendgrid">SendGrid</MenuItem>
                <MenuItem value="mailgun">Mailgun</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Map Provider</InputLabel>
              <Select
                name="mapProvider"
                value={formData.mapProvider}
                onChange={handleInputChange}
                label="Map Provider"
              >
                <MenuItem value="google">Google Maps</MenuItem>
                <MenuItem value="mapbox">Mapbox</MenuItem>
                <MenuItem value="here">HERE Maps</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Payment Gateway</InputLabel>
              <Select
                name="paymentGateway"
                value={formData.paymentGateway}
                onChange={handleInputChange}
                label="Payment Gateway"
              >
                <MenuItem value="stripe">Stripe</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="razorpay">Razorpay</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Backup Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Backup Frequency</InputLabel>
              <Select
                name="backupFrequency"
                value={formData.backupFrequency}
                onChange={handleInputChange}
                label="Backup Frequency"
              >
                <MenuItem value="hourly">Hourly</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="time"
              label="Backup Time"
              name="backupTime"
              value={formData.backupTime}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Retention Period (days)"
              name="retentionPeriod"
              value={formData.retentionPeriod}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 1, max: 365 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Switch
                  name="autoBackup"
                  checked={formData.autoBackup}
                  onChange={handleInputChange}
                />
              }
              label="Enable Auto Backup"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Maintenance Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleInputChange}
                />
              }
              label="Maintenance Mode"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Maintenance Schedule"
              name="maintenanceSchedule"
              value={formData.maintenanceSchedule}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Maintenance Message"
              name="maintenanceMessage"
              value={formData.maintenanceMessage}
              onChange={handleInputChange}
              placeholder="Enter maintenance message to display to users"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          API Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="API Rate Limit (requests/minute)"
              name="apiRateLimit"
              value={formData.apiRateLimit}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 100, max: 10000 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="API Timeout (seconds)"
              name="apiTimeout"
              value={formData.apiTimeout}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 5, max: 300 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="enableApiLogging"
                  checked={formData.enableApiLogging}
                  onChange={handleInputChange}
                />
              }
              label="Enable API Logging"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Cache Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  name="cacheEnabled"
                  checked={formData.cacheEnabled}
                  onChange={handleInputChange}
                />
              }
              label="Enable Caching"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Cache Duration (seconds)"
              name="cacheDuration"
              value={formData.cacheDuration}
              onChange={handleInputChange}
              InputProps={{ inputProps: { min: 60, max: 86400 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  name="clearCacheOnUpdate"
                  checked={formData.clearCacheOnUpdate}
                  onChange={handleInputChange}
                />
              }
              label="Clear Cache on Update"
            />
          </Grid>
        </Grid>
      </StyledPaper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchSystemSettings}
        >
          Refresh
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<Save />}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default SystemSettings;
