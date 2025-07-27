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
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

function StaffSettings() {
  const [fes, setFEs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFE, setSelectedFE] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    contact: "",
    designation: "",
    joining_date: "",
    status: "active",
    vehicle_number: "",
    vehicle_type: ""
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [branchId, setBranchId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const branchId = user?.branch?.branch_id;
    setBranchId(branchId);
    if (branchId) {
      fetchFEs(branchId);
    } else {
      setError('Branch ID not found for current user.');
    }
    // eslint-disable-next-line
  }, []);

  const fetchFEs = async (branchId) => {
    setLoading(true);
    try {
      const response = await apiService.getExecutivesByBranch(branchId);
      if (response.data && response.data.data) {
        setFEs(response.data.data);
      } else {
        setFEs([]);
      }
    } catch (err) {
      setError('Error fetching Field Executives: ' + err.message);
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
    try {
      if (!formData.employee_id || !formData.name || !formData.contact || !formData.designation || !formData.joining_date) {
        throw new Error('Please fill in all required fields');
      }
      if (isNaN(Number(formData.contact))) {
        throw new Error('Contact must be a number');
      }
      // Get the logged-in user's user_id and branch_office_id
      const user = JSON.parse(localStorage.getItem('user'));
      const user_id = user?.user_id;
      const branch_office_id = user?.branch?.branch_id;
      if (!user_id) {
        throw new Error('Logged in user ID not found.');
      }
      if (!branch_office_id) {
        throw new Error('Logged in branch ID not found.');
      }
      const fePayload = {
        ...formData,
        branch_id: branch_office_id,
        user_id
      };
      if (isEditing && selectedFE?.executive_id) {
        await apiService.updateFieldExecutive(selectedFE.executive_id, fePayload);
      } else {
        await apiService.createFieldExecutive(fePayload);
      }
      setSuccess(true);
      fetchFEs(branchId);
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (fe) => {
    setSelectedFE(fe);
    setFormData({
      employee_id: fe.employee_id || "",
      name: fe.name || "",
      contact: fe.contact || "",
      designation: fe.designation || "",
      joining_date: fe.joining_date || "",
      status: fe.status || "active",
      vehicle_number: fe.vehicle_number || "",
      vehicle_type: fe.vehicle_type || ""
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (executiveId) => {
    if (window.confirm('Are you sure you want to delete this Field Executive?')) {
      setLoading(true);
      try {
        await apiService.deleteFieldExecutive(executiveId);
        setSuccess(true);
        fetchFEs(branchId);
      } catch (err) {
        setError('Error deleting Field Executive: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employee_id: "",
      name: "",
      contact: "",
      designation: "",
      joining_date: "",
      status: "active",
      vehicle_number: "",
      vehicle_type: ""
    });
    setIsEditing(false);
    setSelectedFE(null);
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
        <Typography variant="h5">Field Executives Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add New Field Executive
        </Button>
      </Box>

      {loading && <CircularProgress />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Vehicle Number</TableCell>
              <TableCell>Vehicle Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fes.map((fe) => (
              <TableRow key={fe.executive_id}>
                <TableCell>{fe.employee_id}</TableCell>
                <TableCell>{fe.name}</TableCell>
                <TableCell>{fe.contact}</TableCell>
                <TableCell>{fe.designation}</TableCell>
                <TableCell>{fe.joining_date}</TableCell>
                <TableCell>
                  <Typography color={fe.status === 'active' ? 'green' : fe.status === 'on_leave' ? 'orange' : 'grey'}>
                    {fe.status}
                  </Typography>
                </TableCell>
                <TableCell>{fe.vehicle_number || '-'}</TableCell>
                <TableCell>{fe.vehicle_type || '-'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(fe)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(fe.executive_id)} color="error">
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
          {isEditing ? 'Edit Field Executive' : 'Create New Field Executive'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact"
                  name="contact"
                  type="number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="vehicle_number"
                  value={formData.vehicle_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Vehicle Type"
                  name="vehicle_type"
                  value={formData.vehicle_type}
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
                          value: e.target.checked ? 'active' : (formData.status === 'on_leave' ? 'on_leave' : 'inactive')
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
          Field Executive {isEditing ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default StaffSettings; 