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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
                    refreshToken
                });

                const { token } = response.data;
                localStorage.setItem('token', token);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh token fails, logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// API service methods
const apiService = {
    // Auth methods
    login: (credentials) => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
    register: (userData) => api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
    logout: () => api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),

    // Booking methods
    createBooking: (bookingData) => api.post(API_CONFIG.ENDPOINTS.BOOKINGS.CREATE, bookingData),
    getBookings: () => api.get(API_CONFIG.ENDPOINTS.BOOKINGS.LIST),
    getBookingDetails: (id) => api.get(`${API_CONFIG.ENDPOINTS.BOOKINGS.DETAILS}/${id}`),
    updateBooking: (id, bookingData) => api.put(`${API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE}/${id}`, bookingData),
    deleteBooking: (id) => api.delete(`${API_CONFIG.ENDPOINTS.BOOKINGS.DELETE}/${id}`),

    // Customer methods
    getProfile: () => api.get(API_CONFIG.ENDPOINTS.CUSTOMERS.PROFILE),
    updateProfile: (profileData) => api.put(API_CONFIG.ENDPOINTS.CUSTOMERS.UPDATE, profileData),
    getAddresses: () => api.get(API_CONFIG.ENDPOINTS.CUSTOMERS.ADDRESSES),

    // Tracking methods
    getTrackingStatus: (trackingNumber) => api.get(`${API_CONFIG.ENDPOINTS.TRACKING.STATUS}/${trackingNumber}`),
    getTrackingHistory: (trackingNumber) => api.get(`${API_CONFIG.ENDPOINTS.TRACKING.HISTORY}/${trackingNumber}`),

    // Payment methods
    createPayment: (paymentData) => api.post(API_CONFIG.ENDPOINTS.PAYMENTS.CREATE, paymentData),
    verifyPayment: (paymentId) => api.post(`${API_CONFIG.ENDPOINTS.PAYMENTS.VERIFY}/${paymentId}`),
    getPaymentHistory: () => api.get(API_CONFIG.ENDPOINTS.PAYMENTS.HISTORY),

    // Support methods
    getTickets: () => api.get(API_CONFIG.ENDPOINTS.SUPPORT.TICKETS),
    createTicket: (ticketData) => api.post(API_CONFIG.ENDPOINTS.SUPPORT.CREATE_TICKET, ticketData),
};

export default apiService; 