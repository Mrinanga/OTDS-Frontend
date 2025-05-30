import axios from 'axios';
import API_CONFIG from '../config/api.config';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request:', config);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        return response;
    },
    async (error) => {
        console.error('Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

// API service methods
const apiService = {
    // Auth methods
    login: async (credentials) => {
        try {
            console.log('Login attempt with:', credentials);
            const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
            console.log('Login response:', response);
            return response;
        } catch (error) {
            console.error('Login error:', error.response || error);
            throw error;
        }
    },
    register: (userData) => api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Booking methods
    createBooking: (bookingData) => api.post(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE, bookingData),
    getBookings: () => api.get(API_CONFIG.ENDPOINTS.BOOKINGS.LIST),
    getBookingDetails: (bookingId) => api.get(`${API_CONFIG.ENDPOINTS.BOOKINGS.DETAILS}/${bookingId}`),
    updateBooking: (bookingId, bookingData) => api.put(`${API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE}/${bookingId}`, bookingData),
    cancelBooking: (bookingId) => api.post(`${API_CONFIG.ENDPOINTS.BOOKINGS.CANCEL}/${bookingId}`),

    // Customer methods
    getProfile: () => api.get(API_CONFIG.ENDPOINTS.CUSTOMERS.PROFILE),
    updateProfile: (id, profileData) => api.put(`${API_CONFIG.ENDPOINTS.CUSTOMERS.UPDATE}/${id}`, profileData),
    getAddresses: () => api.get(API_CONFIG.ENDPOINTS.CUSTOMERS.ADDRESSES),
    createCustomer: (customerData) => api.post(API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE, customerData),
    deleteCustomer: (id) => api.delete(`${API_CONFIG.ENDPOINTS.CUSTOMERS.PROFILE}/${id}`),

    // Tracking methods
    getTrackingStatus: (trackingId) => api.post('/dashboard/track', { tracking_id: trackingId }),
    getTrackingHistory: (trackingNumber) => api.get(`${API_CONFIG.ENDPOINTS.TRACKING.HISTORY}/${trackingNumber}`),

    // Payment methods
    createPayment: (paymentData) => api.post(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData),
    verifyPayment: (paymentId) => api.post(`${API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY}/${paymentId}`),
    getPaymentHistory: () => api.get(API_CONFIG.ENDPOINTS.PAYMENTS.HISTORY),

    // Support methods
    getTickets: () => api.get(API_CONFIG.ENDPOINTS.SUPPORT.TICKETS),
    createTicket: (ticketData) => api.post(API_CONFIG.ENDPOINTS.SUPPORT.CREATE_TICKET, ticketData),

    // Dashboard methods
    getDashboardStats: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.STATS),
    getBookingTrends: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.BOOKING_TRENDS),
    getServiceTypes: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.SERVICE_TYPES),
    getBranchPerformance: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.BRANCH_PERFORMANCE),
    getDeliveryStatus: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.DELIVERY_STATUS),
    getRecentActivities: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES)
};

export default apiService;