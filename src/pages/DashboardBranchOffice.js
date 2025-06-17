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
  Divider
} from '@mui/material';
import {
  LocalShipping,
  AttachMoney,
  Schedule,
  Warning,
  MoreVert,
  TrendingUp,
  TrendingDown,
  Notifications
} from '@mui/icons-material';
import "../styles/dashboard.css";
import apiService from '../services/api.service';

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
  { date: 'Mon', deliveries: 0, pickups: 0 },
  { date: 'Tue', deliveries: 0, pickups: 0 },
  { date: 'Wed', deliveries: 0, pickups: 0 },
  { date: 'Thu', deliveries: 0, pickups: 0 },
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

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(dummyStats);
  const [recentActivities, setRecentActivities] = useState(dummyRecentActivities);
  const [deliveryStats, setDeliveryStats] = useState(dummyDeliveryStats);
  const [revenueData, setRevenueData] = useState(dummyRevenueData);
  const [statusDistribution, setStatusDistribution] = useState(dummyStatusDistribution);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend > 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend > 0 ? "success.main" : "error.main"}
                  ml={0.5}
                >
                  {Math.abs(trend)}% from last week
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: '50%',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Branch Dashboard</Typography>
        <Box>
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              fetchDashboardData();
            }}>Refresh Data</MenuItem>
            <MenuItem onClick={handleMenuClose}>Export Report</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Deliveries"
            value={stats.todayDeliveries}
            icon={<LocalShipping sx={{ color: '#1976d2' }} />}
            color="#1976d2"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Pickups"
            value={stats.pendingPickups}
            icon={<Schedule sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<AttachMoney sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
            trend={0}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="On-Time Delivery"
            value={`${stats.onTimeDelivery}%`}
            icon={<LocalShipping sx={{ color: '#9c27b0' }} />}
            color="#9c27b0"
            trend={0}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        {/* Delivery Trends */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deliveryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="deliveries"
                  stroke="#1976d2"
                  name="Deliveries"
                />
                <Line
                  type="monotone"
                  dataKey="pickups"
                  stroke="#2e7d32"
                  name="Pickups"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Shipment Status
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue and Activities Section */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#2e7d32" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
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
                      ) : activity.type === 'pickup' ? (
                        <Schedule color="warning" />
                      ) : (
                        <Notifications color="info" />
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

export default DashboardPage;
