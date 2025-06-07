// src/components/forms/SecurityForm.js
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
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, QrCode2 } from '@mui/icons-material';
import * as settingsService from '../../services/settingsService';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const SecuritySettings = () => {
  const [formData, setFormData] = useState({
    twoFA: false,
    twoFAMethod: 'authenticator',
    sessionTimeout: 30,
    alertNewLogin: true,
    alertPasswordChange: true,
    alertSecuritySettings: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    loadSecuritySettings();
  }, []);

  const loadSecuritySettings = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User data not found');
      }
      const response = await settingsService.getSecuritySettings(user.id);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User data not found');
      }
      // Add password change API call here
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      await settingsService.updateSecuritySettings(user.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
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
          Two-Factor Authentication (2FA)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    name="twoFA"
                    checked={formData.twoFA}
                    onChange={handleInputChange}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
            </FormGroup>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Add an extra layer of security to your account by requiring a verification code in addition to your password.
            </Typography>
          </Grid>
          {formData.twoFA && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Verification Method</InputLabel>
                  <Select
                    name="twoFAMethod"
                    value={formData.twoFAMethod}
                    onChange={handleInputChange}
                    label="Verification Method"
                  >
                    <MenuItem value="authenticator">Authenticator App</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.twoFAMethod === 'authenticator' && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<QrCode2 />}
                    onClick={() => setShowQRCode(true)}
                  >
                    Show QR Code
                  </Button>
                  <Button
                    variant="text"
                    sx={{ ml: 2 }}
                  >
                    Generate New Backup Codes
                  </Button>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Password Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              type={showPassword ? 'text' : 'password'}
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={calculatePasswordStrength(passwordData.newPassword)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: passwordData.newPassword.length >= 8 ? 'success.main' : 'error.main',
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Password strength: {passwordData.newPassword.length >= 8 ? 'Strong' : 'Weak'}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Password requirements:
            </Typography>
            <Typography variant="caption" color="text.secondary" component="ul" sx={{ pl: 2 }}>
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handlePasswordSubmit}
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Grid>
        </Grid>
      </StyledPaper>

      <StyledPaper>
        <Typography variant="h6" gutterBottom>
          Session Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Session Timeout</InputLabel>
              <Select
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleInputChange}
                label="Session Timeout"
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
                <MenuItem value={240}>4 hours</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    name="alertNewLogin"
                    checked={formData.alertNewLogin}
                    onChange={handleInputChange}
                  />
                }
                label="Alert me on new login"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="alertPasswordChange"
                    checked={formData.alertPasswordChange}
                    onChange={handleInputChange}
                  />
                }
                label="Alert me on password change"
              />
              <FormControlLabel
                control={
                  <Switch
                    name="alertSecuritySettings"
                    checked={formData.alertSecuritySettings}
                    onChange={handleInputChange}
                  />
                }
                label="Alert me on security settings change"
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

export default SecuritySettings;
