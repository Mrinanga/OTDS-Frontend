import React, { useState, useEffect } from "react";
import apiService from "../../services/api.service";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export default function BranchOfficeSettings() {
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    phone: "",
    email: "",
    manager_id: null,
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get current user's branch ID
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const branchId = user?.branch?.branch_id;
    if (branchId) {
      fetchBranch(branchId);
    } else {
      setError('Branch ID not found for current user.');
    }
    // eslint-disable-next-line
  }, []);

  const fetchBranch = async (branchId) => {
    setLoading(true);
    try {
      const response = await apiService.getBranch(branchId);
      if (response.data && response.data.data) {
        setFormData({
          branch_name: response.data.data.branch_name || "",
          address: response.data.data.address || "",
          city: response.data.data.city || "",
          state: response.data.data.state || "",
          country: response.data.data.country || "India",
          postal_code: response.data.data.postal_code || "",
          phone: response.data.data.phone || "",
          email: response.data.data.email || "",
          manager_id: response.data.data.manager_id || null,
          status: response.data.data.status || "active"
        });
      } else {
        setError('Branch data not found.');
      }
    } catch (err) {
      setError('Error fetching branch: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    const user = JSON.parse(localStorage.getItem('user'));
    const branchId = user?.branch?.branch_id;
    if (!branchId) {
      setError('Branch ID not found for current user.');
      setLoading(false);
      return;
    }
    try {
      await apiService.updateBranch(branchId, formData);
      setSuccess(true);
    } catch (err) {
      setError('Error updating branch: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <StyledPaper>
        <Typography variant="h5" gutterBottom>Branch Office Details</Typography>
        {loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress /></Box>}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Branch Name"
                name="branch_name"
                value={formData.branch_name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert onClose={() => setSuccess(false)} severity="success">
            Branch office updated successfully!
          </Alert>
        </Snackbar>
      </StyledPaper>
    </Box>
  );
} 