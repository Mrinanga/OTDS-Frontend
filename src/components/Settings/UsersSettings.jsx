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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export default function UsersSettings() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "branch_office",
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    status: "active",
    branch_id: null
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await apiService.getBranches();
      if (response.data && response.data.data) {
        setBranches(response.data.data);
      }
    } catch (err) {
      setError('Error fetching branches: ' + err.message);
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
      
      // Validate required fields
      if (!formData.email || !formData.first_name || !formData.last_name || 
          !formData.phone || !formData.role) {
        throw new Error('Please fill in all required fields');
      }

      // Only require password for new users
      if (!isEditing && !formData.password) {
        throw new Error('Password is required for new users');
      }

      if (isEditing) {
        await apiService.updateUser(selectedUser.user_id, formData);
      } else {
        await apiService.createUser(formData);
      }
      
      setSuccess(true);
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      password: "", // Don't show password when editing
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      address: user.address || "",
      status: user.status,
      branch_id: user.branch_id
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        await apiService.deleteUser(userId);
        setSuccess(true);
        fetchUsers();
      } catch (err) {
        setError('Error deleting user: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      role: "branch_office",
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      status: "active",
      branch_id: null
    });
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setOpenDialog(false);
  };

  const getRoleLabel = (role) => {
    const labels = {
      master_admin: 'Master Admin',
      admin: 'Admin',
      branch_office: 'Branch Office',
      field_executive: 'Field Executive'
    };
    return labels[role] || role;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Users Management</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
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

      <TableContainer component={StyledPaper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{`${user.first_name} ${user.last_name}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Chip 
                    label={getRoleLabel(user.role)} 
                    color={
                      user.role === 'master_admin' ? 'error' :
                      user.role === 'admin' ? 'warning' :
                      user.role === 'branch_office' ? 'primary' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.branch_name || '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    color={user.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.user_id)} color="error">
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
          {isEditing ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
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

              {!isEditing && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditing}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="branch_office">Branch Office</MenuItem>
                    <MenuItem value="field_executive">Field Executive</MenuItem>
                  </Select>
                </FormControl>
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
                />
              </Grid>

              {(formData.role === 'branch_office' || formData.role === 'field_executive') && (
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Branch</InputLabel>
                    <Select
                      name="branch_id"
                      value={formData.branch_id || ''}
                      onChange={handleChange}
                      label="Branch"
                    >
                      {branches.map((branch) => (
                        <MenuItem key={branch.branch_id} value={branch.branch_id}>
                          {branch.branch_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

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
          User {isEditing ? 'updated' : 'created'} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
} 