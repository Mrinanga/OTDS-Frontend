import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  InputAdornment,
  Modal
} from '@mui/material';
import {
  LocalShipping,
  AttachMoney,
  Schedule,
  Warning,
  MoreVert,
  TrendingUp,
  TrendingDown,
  Notifications,
  LocationOn,
  AccessTime,
  CheckCircle,
  Error,
  Search,
  TrackChanges
} from '@mui/icons-material';
import "../styles/dashboard.css";
import apiService from '../services/api.service';
import { useUser } from '../contexts/UserContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Dummy data for when backend is not available
const dummyStats = {
  todayDeliveries: 0,
  pendingPickups: 0,
  totalRevenue: 0,
  onTimeDelivery: 0,
  activeShipments: 0,
  delayedShipments: 0
};

const dummyDeliveryStats = [
  { date: 'Mon', deliveries: 3, pickups: 5 },
  { date: 'Tue', deliveries: 7, pickups: 5 },
  { date: 'Wed', deliveries: 4, pickups: 7 },
  { date: 'Thu', deliveries: 8, pickups: 3 },
  { date: 'Fri', deliveries: 0, pickups: 0 },
  { date: 'Sat', deliveries: 0, pickups: 0 },
  { date: 'Sun', deliveries: 0, pickups: 0 }
];

const dummyRevenueData = [
  { date: 'Mon', revenue: 0 },
  { date: 'Tue', revenue: 0 },
  { date: 'Wed', revenue: 0 },
  { date: 'Thu', revenue: 0 },
  { date: 'Fri', revenue: 0 },
  { date: 'Sat', revenue: 0 },
  { date: 'Sun', revenue: 0 }
];

const dummyStatusDistribution = [
  { name: 'Pending', value: 5 },
  { name: 'In Transit', value: 3 },
  { name: 'Delivered', value: 9 },
  { name: 'Failed', value: 0 }
];

const dummyRecentActivities = [
  {
    type: 'delivery',
    title: 'No recent activities',
    timestamp: 'N/A'
  }
];

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${color}30`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 4px 20px ${color}20`
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              fontWeight: 500,
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 600,
              color: color,
              mb: 1
            }}
          >
            {value}
          </Typography>
          {trend !== undefined && (
            <Box display="flex" alignItems="center">
              {trend > 0 ? (
                <TrendingUp sx={{ color: 'success.main', fontSize: '1rem' }} />
              ) : (
                <TrendingDown sx={{ color: 'error.main', fontSize: '1rem' }} />
              )}
              <Typography
                variant="body2"
                color={trend > 0 ? "success.main" : "error.main"}
                sx={{ ml: 0.5, fontWeight: 500 }}
              >
                {Math.abs(trend)}% from last week
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}20`,
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {React.cloneElement(icon, { 
            sx: { 
              fontSize: '2rem',
              color: color
            } 
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardBranchOffice = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(dummyStats);
  const [recentActivities, setRecentActivities] = useState(dummyRecentActivities);
  const [deliveryStats, setDeliveryStats] = useState(dummyDeliveryStats);
  const [revenueData, setRevenueData] = useState(dummyRevenueData);
  const [statusDistribution, setStatusDistribution] = useState(dummyStatusDistribution);
  const [anchorEl, setAnchorEl] = useState(null);
  const [liveTracking, setLiveTracking] = useState([]);
  const [trackingId, setTrackingId] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [selectedTracking, setSelectedTracking] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const branchId = userData?.branch?.branch_id;

      if (!branchId) {
        throw new Error('Branch ID not found');
      }

      try {
        // Attempt to fetch data from backend
        const [
          statsResponse,
          activitiesResponse,
          deliveryStatsResponse,
          revenueResponse,
          statusResponse
        ] = await Promise.all([
          apiService.getBranchStats(branchId),
          apiService.getRecentActivities(branchId),
          apiService.getDeliveryStats(branchId),
          apiService.getRevenueData(branchId),
          apiService.getStatusDistribution(branchId)
        ]);

        // If we get here, backend is working
        setStats(statsResponse.data || dummyStats);
        setRecentActivities(activitiesResponse.data || dummyRecentActivities);
        setDeliveryStats(deliveryStatsResponse.data || dummyDeliveryStats);
        setRevenueData(revenueResponse.data || dummyRevenueData);
        setStatusDistribution(statusResponse.data || dummyStatusDistribution);
        setError(null);
      } catch (err) {
        // If backend fails, use dummy data
        console.warn('Backend not available, using dummy data:', err);
        setStats(dummyStats);
        setRecentActivities(dummyRecentActivities);
        setDeliveryStats(dummyDeliveryStats);
        setRevenueData(dummyRevenueData);
        setStatusDistribution(dummyStatusDistribution);
        setError('Backend not available. Showing dummy data.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTrackShipment = async () => {
    if (!trackingId.trim()) {
      setTrackingError('Please enter a tracking ID');
      return;
    }

    try {
      const response = await apiService.trackShipment(trackingId);
      setLiveTracking([response.data]);
      setTrackingError('');
    } catch (error) {
      console.error('Error tracking shipment:', error);
      setTrackingError('Failed to track shipment. Please try again.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTrackShipment();
    }
  };

  const handleViewTrackingDetails = (tracking) => {
    setSelectedTracking(tracking);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Stat Cards Row */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Today's Deliveries"
            value={stats.todayDeliveries}
            icon={<LocalShipping />}
            color="#1976d2"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Pending Pickups"
            value={stats.pendingPickups}
            icon={<Schedule />}
            color="#ed6c02"
            trend={-2}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<AttachMoney />}
            color="#2e7d32"
            trend={8}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="On-Time Delivery"
            value={`${stats.onTimeDelivery}%`}
            icon={<CheckCircle />}
            color="#9c27b0"
            trend={3}
          />
        </Grid>

        {/* Live Tracking Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Live Shipment Tracking
            </Typography>
            
            {/* Search Bar */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Enter Tracking ID"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      setTrackingError('');
                    }}
                    onKeyPress={handleKeyPress}
                    error={!!trackingError}
                    helperText={trackingError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleTrackShipment}
                    startIcon={<TrackChanges />}
                    sx={{ height: '56px' }}
                  >
                    Track Shipment
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {liveTracking.length > 0 ? (
              <Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tracking ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Last Update</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {liveTracking.map((tracking) => (
                        <TableRow key={tracking.id}>
                          <TableCell>{tracking.tracking_id}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {tracking.status === 'in_transit' ? (
                                <LocalShipping color="primary" fontSize="small" />
                              ) : tracking.status === 'delivered' ? (
                                <CheckCircle color="success" fontSize="small" />
                              ) : (
                                <Error color="error" fontSize="small" />
                              )}
                              <Typography variant="body2" ml={1}>
                                {tracking.status.replace('_', ' ').toUpperCase()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <LocationOn fontSize="small" color="action" />
                              <Typography variant="body2" ml={1}>
                                {tracking.current_location}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="body2" ml={1}>
                                {new Date(tracking.last_update).toLocaleTimeString()}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewTrackingDetails(tracking)}
                            >
                              <MoreVert />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                p={4}
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1
                }}
              >
                <LocalShipping sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Track Your Shipment
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Enter a tracking ID above to view shipment details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Tracking Details Modal */}
        <Modal
          open={!!selectedTracking}
          onClose={() => setSelectedTracking(null)}
          aria-labelledby="tracking-details-modal"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 800,
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              overflow: 'auto'
            }}
          >
            {selectedTracking && (
              <>
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" component="h2">
                    Shipment Tracking Details
                  </Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                  {/* Shipment Details Card */}
                  <Card sx={{ mb: 3, p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Shipment Details
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Tracking ID:</strong> {selectedTracking.tracking_id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Package Type:</strong> {selectedTracking.package_details.type}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Weight:</strong> {selectedTracking.package_details.weight}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Dimensions:</strong> {selectedTracking.package_details.dimensions}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" color="primary" gutterBottom>
                          Delivery Information
                        </Typography>
                        <Box sx={{ pl: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Recipient:</strong> {selectedTracking.recipient.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Address:</strong> {selectedTracking.recipient.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Phone:</strong> {selectedTracking.recipient.phone}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Estimated Delivery:</strong> {new Date(selectedTracking.estimated_delivery).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>

                  {/* Tracking Status and History */}
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Tracking Status
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          {selectedTracking.status === 'in_transit' ? (
                            <LocalShipping color="primary" fontSize="small" />
                          ) : selectedTracking.status === 'delivered' ? (
                            <CheckCircle color="success" fontSize="small" />
                          ) : (
                            <Error color="error" fontSize="small" />
                          )}
                          <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>
                            {selectedTracking.status.replace('_', ' ').toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Location: {selectedTracking.current_location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Last Update: {new Date(selectedTracking.last_update).toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Tracking History
                      </Typography>
                      <List>
                        {selectedTracking.tracking_history.map((history, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemIcon>
                                {history.status === 'in_transit' ? (
                                  <LocalShipping color="primary" />
                                ) : history.status === 'delivered' ? (
                                  <CheckCircle color="success" />
                                ) : history.status === 'picked_up' ? (
                                  <Schedule color="warning" />
                                ) : (
                                  <Error color="error" />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={history.description}
                                secondary={
                                  <>
                                    <Typography variant="body2" component="span">
                                      {history.location}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">
                                      {new Date(history.timestamp).toLocaleString()}
                                    </Typography>
                                  </>
                                }
                              />
                            </ListItem>
                            {index < selectedTracking.tracking_history.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Box>
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={() => setSelectedTracking(null)} variant="contained">
                    Close
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>

        {/* Charts Row */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="deliveries" fill="#8884d8" name="Deliveries" />
                <Bar dataKey="pickups" fill="#82ca9d" name="Pickups" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      {activity.type === 'delivery' ? (
                        <LocalShipping color="primary" />
                      ) : (
                        <AttachMoney color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardBranchOffice;
