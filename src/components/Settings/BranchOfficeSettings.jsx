import React, { useState, useEffect } from "react";
import apiService from "../../services/api.service";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Box,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

export default function BranchOfficeSettings() {
  const [branches, setBranches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
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
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBranches();
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      }
    } catch (err) {
      setError('Error fetching branches: ' + err.message);
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
    try {
      setLoading(true);
      setError(null);
      
      if (!formData.branch_name || !formData.address || !formData.city || 
          !formData.state || !formData.postal_code || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      if (isEditing) {
        await apiService.updateBranch(selectedBranch.branch_id, formData);
      } else {
        await apiService.createBranch(formData);
      }
      
      setSuccess(true);
      fetchBranches();
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      branch_name: branch.branch_name,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      country: branch.country || "India",
      postal_code: branch.postal_code,
      phone: branch.phone,
      email: branch.email,
      manager_id: branch.manager_id,
      status: branch.status
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        setLoading(true);
        await apiService.deleteBranch(branchId);
        setSuccess(true);
        fetchBranches();
      } catch (err) {
        setError('Error deleting branch: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setIsEditing(false);
    setSelectedBranch(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Branch Offices</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Branch
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Branch Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.branch_id}>
                <TableCell>{branch.branch_name}</TableCell>
                <TableCell>{branch.address}</TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.state}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>{branch.email}</TableCell>
                <TableCell>{branch.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(branch)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(branch.branch_id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? 'Edit Branch Office' : 'Create New Branch Office'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Branch Information</Typography>
              </Grid>
              
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

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.status === 'active'}
                      onChange={(e) => handleChange({
                        target: {
                          name: 'status',
                          value: e.target.checked ? 'active' : 'inactive'
                        }
                      })}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Branch office {isEditing ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 