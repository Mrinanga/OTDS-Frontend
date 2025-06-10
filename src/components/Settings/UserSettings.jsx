import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Typography,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import apiService from '../../services/api.service';

const UserSettings = () => {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'staff',
    address: '',
    password: '',
    confirmPassword: '',
    branchId: '',
    status: 'active',
    is_primary: false
  });
  const [formErrors, setFormErrors] = useState({});

  const steps = ['User Information', 'Branch Assignment'];

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      if (response.data && response.data.status === 'success') {
        setUsers(response.data.data || []);
      } else {
        setError('Error fetching users: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (error) {
      setError('Error fetching users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await apiService.getBranches();
      setBranches(response.data.data || []);
    } catch (error) {
      setError('Error fetching branches: ' + error.message);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateStep = (step) => {
    const errors = {};
    
    if (step === 0) {
      if (!formData.first_name) errors.first_name = 'First name is required';
      if (!formData.last_name) errors.last_name = 'Last name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!validateEmail(formData.email)) errors.email = 'Invalid email format';
      if (!formData.phone) errors.phone = 'Phone is required';
      if (!validatePhone(formData.phone)) errors.phone = 'Phone must be 10-15 digits';
      if (!formData.role) errors.role = 'Role is required';
      if (!formData.address) errors.address = 'Address is required';
      
      if (!editingUser) {
        if (!formData.password) errors.password = 'Password is required';
        else if (!validatePassword(formData.password)) {
          errors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        }
        if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm password';
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
    } else if (step === 1) {
      if (!formData.branchId) errors.branchId = 'Branch is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (!validateStep(activeStep)) {
        throw new Error('Please fix the form errors');
      }

      // First create the user with only the required fields
      const userData = {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address
      };

      let userId;
      if (editingUser) {
        await apiService.updateUser(editingUser.id, userData);
        userId = editingUser.id;
      } else {
        const response = await apiService.createUser(userData);
        userId = response.data.user_id;
      }

      // Then create branch user association if branch is selected
      if (userId && formData.branchId) {
        try {
          await apiService.addUserToBranch(formData.branchId, userId, formData.is_primary);
        } catch (error) {
          console.error('Error creating branch user association:', error);
        }
      }
      
      setSuccess(true);
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    const [firstName, ...lastNameParts] = user.name.split(' ');
    const lastName = lastNameParts.join(' ');
    
    setEditingUser(user);
    setFormData({
      first_name: firstName,
      last_name: lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      branchId: user.branchId || '',
      status: user.status || 'active',
      is_primary: user.is_primary || false,
      password: '',
      confirmPassword: ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await apiService.deleteUser(userId);
        setSuccess(true);
        fetchUsers();
      } catch (error) {
        setError('Error deleting user: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'staff',
      address: '',
      password: '',
      confirmPassword: '',
      branchId: '',
      status: 'active',
      is_primary: false
    });
    setFormErrors({});
    setEditingUser(null);
    setActiveStep(0);
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                error={!!formErrors.last_name}
                helperText={formErrors.last_name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
                helperText={formErrors.address}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.role}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  required
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                </Select>
                {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
              </FormControl>
            </Grid>
            {!editingUser && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.branchId}>
                <InputLabel>Branch Office</InputLabel>
                <Select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleInputChange}
                  label="Branch Office"
                  required
                >
                  {branches.map(branch => (
                    <MenuItem key={branch.branch_id} value={branch.branch_id}>
                      {branch.branch_name}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.branchId && <FormHelperText>{formErrors.branchId}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status"
                  required
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleInputChange}
                  />
                }
                label="Primary Branch User"
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">User Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add New User
        </Button>
      </Box>

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                  <Typography color="textSecondary">{user.phone}</Typography>
                  <Typography color="textSecondary">Role: {user.role}</Typography>
                  <Typography color="textSecondary">Branch: {user.branch_name}</Typography>
                  <Typography color="textSecondary">Status: {user.status}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 4 }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (editingUser ? 'Update' : 'Create')}
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              variant="contained" 
              color="primary"
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          {editingUser ? 'User updated successfully' : 'User created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettings; 