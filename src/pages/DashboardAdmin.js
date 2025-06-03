import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import "../styles/dashboard.css";
import apiService from '../services/api.service';

const DashboardPage = () => {
  const [trackingId, setTrackingId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard data states with default empty arrays
  const [statsCards, setStatsCards] = useState([]);
  const [bookingTrends, setBookingTrends] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [branchPerformance, setBranchPerformance] = useState([]);
  const [deliveryStatus, setDeliveryStatus] = useState([]);
  const [activities, setActivities] = useState([]);

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data in parallel
        const [
          statsResponse,
          trendsResponse,
          servicesResponse,
          performanceResponse,
          statusResponse,
          activitiesResponse
        ] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getBookingTrends(),
          apiService.getServiceTypes(),
          apiService.getBranchPerformance(),
          apiService.getDeliveryStatus(),
          apiService.getRecentActivities()
        ]);

        console.log('Dashboard API Responses:', {
          stats: statsResponse,
          trends: trendsResponse,
          services: servicesResponse,
          performance: performanceResponse,
          status: statusResponse,
          activities: activitiesResponse
        });

        // Update states with fetched data, ensuring we have arrays
        setStatsCards(statsResponse.data?.data || []);
        setBookingTrends(trendsResponse.data?.data || []);
        setServiceTypes(servicesResponse.data?.data || []);
        setBranchPerformance(performanceResponse.data?.data || []);
        setDeliveryStatus(statusResponse.data?.data || []);
        setActivities(activitiesResponse.data?.data || []);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        // Set empty arrays for all data states in case of error
        setStatsCards([]);
        setBookingTrends([]);
        setServiceTypes([]);
        setBranchPerformance([]);
        setDeliveryStatus([]);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.getTrackingStatus(trackingId.trim().toUpperCase());
      setTrackingInfo(response.data.data);
      setModalError("");
    } catch (err) {
      setTrackingInfo(null);
      setModalError(`No tracking information found for "${trackingId}"`);
    }
    setModalOpen(true);
    setTrackingId("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalError("");
    setTrackingInfo(null);
  };

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Courier Dashboard</h1>
        <p>Business insights and real-time tracking</p>
      </header>

      <section className="cards-grid">
        {statsCards && statsCards.length > 0 ? (
          statsCards.map((card, idx) => (
            <div key={idx} className={`card card-${card.color}`}>
              <div className="card-title">{card.title}</div>
              <div className="card-count">{card.count}</div>
            </div>
          ))
        ) : (
          <div className="no-data">No statistics available</div>
        )}
      </section>

      <section className="tracking-section">
        <h2>Live Tracking</h2>
        <div className="tracking-inputs">
          <input
            type="text"
            placeholder="Enter Tracking ID (e.g. TRK123)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack(e)}
            className="tracking-input"
          />
          <button onClick={handleTrack} className="track-button">
            Track
          </button>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-box">
          <h2>Daily Booking Trends</h2>
          {bookingTrends && bookingTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="bookings" stroke="#4F46E5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No booking trends available</div>
          )}
        </div>

        <div className="chart-box">
          <h2>Service Type Distribution</h2>
          {serviceTypes && serviceTypes.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceTypes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {serviceTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No service type data available</div>
          )}
        </div>

        <div className="chart-box">
          <h2>Branch Revenue Comparison</h2>
          {branchPerformance && branchPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="branch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#10B981" name="Bookings" />
                <Bar dataKey="revenue" fill="#F59E0B" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No branch performance data available</div>
          )}
        </div>

        <div className="chart-box">
          <h2>Delivery Status</h2>
          {deliveryStatus && deliveryStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deliveryStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No delivery status data available</div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>&times;</button>
            {modalError ? (
              <div className="error-text">{modalError}</div>
            ) : (
              <div className="tracking-details">
                <h3>Tracking Details</h3>
                <div className="tracking-section">
                  <h4>Booking Information</h4>
                  <p><strong>Booking Number:</strong> {trackingInfo?.booking_number || 'N/A'}</p>
                  <p><strong>Status:</strong> <span className={`status ${trackingInfo?.status?.toLowerCase() || ''}`}>{trackingInfo?.status || 'N/A'}</span></p>
                  <p><strong>Created At:</strong> {trackingInfo?.created_at || 'N/A'}</p>
                  <p><strong>Amount:</strong> ₹{trackingInfo?.total_amount || '0.00'}</p>
                  <p><strong>Payment Status:</strong> {trackingInfo?.payment_status || 'N/A'}</p>
                </div>

                <div className="tracking-section">
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {trackingInfo?.customer?.name || 'N/A'}</p>
                  <p><strong>Email:</strong> {trackingInfo?.customer?.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {trackingInfo?.customer?.phone || 'N/A'}</p>
                </div>

                <div className="tracking-section">
                  <h4>Pickup Address</h4>
                  <p><strong>Name:</strong> {trackingInfo?.pickup_address?.name || 'N/A'}</p>
                  <p><strong>Phone:</strong> {trackingInfo?.pickup_address?.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {trackingInfo?.pickup_address?.address || 'N/A'}</p>
                  <p><strong>City:</strong> {trackingInfo?.pickup_address?.city || 'N/A'}</p>
                  <p><strong>State:</strong> {trackingInfo?.pickup_address?.state || 'N/A'}</p>
                  <p><strong>Country:</strong> {trackingInfo?.pickup_address?.country || 'N/A'}</p>
                  <p><strong>Postal Code:</strong> {trackingInfo?.pickup_address?.postal_code || 'N/A'}</p>
                </div>

                <div className="tracking-section">
                  <h4>Delivery Address</h4>
                  <p><strong>Name:</strong> {trackingInfo?.delivery_address?.name || 'N/A'}</p>
                  <p><strong>Phone:</strong> {trackingInfo?.delivery_address?.phone || 'N/A'}</p>
                  <p><strong>Address:</strong> {trackingInfo?.delivery_address?.address || 'N/A'}</p>
                  <p><strong>City:</strong> {trackingInfo?.delivery_address?.city || 'N/A'}</p>
                  <p><strong>State:</strong> {trackingInfo?.delivery_address?.state || 'N/A'}</p>
                  <p><strong>Country:</strong> {trackingInfo?.delivery_address?.country || 'N/A'}</p>
                  <p><strong>Postal Code:</strong> {trackingInfo?.delivery_address?.postal_code || 'N/A'}</p>
                </div>

                {trackingInfo?.package_details && (
                  <div className="tracking-section">
                    <h4>Package Details</h4>
                    <p><strong>Type:</strong> {trackingInfo.package_details.type || 'N/A'}</p>
                    <p><strong>Weight:</strong> {trackingInfo.package_details.weight || '0.00'} kg</p>
                    <p><strong>Dimensions:</strong> {trackingInfo.package_details.dimensions || 'N/A'}</p>
                    <p><strong>Quantity:</strong> {trackingInfo.package_details.quantity || '0'}</p>
                    <p><strong>Description:</strong> {trackingInfo.package_details.description || 'N/A'}</p>
                    {trackingInfo.package_details.special_instructions && (
                      <p><strong>Special Instructions:</strong> {trackingInfo.package_details.special_instructions}</p>
                    )}
                  </div>
                )}

                {trackingInfo?.tracking_updates && trackingInfo.tracking_updates.length > 0 && (
                  <div className="tracking-section">
                    <h4>Tracking Updates</h4>
                    {trackingInfo.tracking_updates.map((update, index) => (
                      <div key={index} className="tracking-update">
                        <p><strong>Status:</strong> {update.status || 'N/A'}</p>
                        <p><strong>Location:</strong> {update.location || 'N/A'}</p>
                        <p><strong>Description:</strong> {update.description || 'N/A'}</p>
                        <p><strong>Updated At:</strong> {update.updated_at || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <section className="activity-section">
        <h2>Recent Activities</h2>
        <ul className="activity-list">
          {activities.map((item, idx) => (
            <li key={idx} className="activity-item">{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
