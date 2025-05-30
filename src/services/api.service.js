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
    createBooking: (bookingData) => {
        return axios.post(`${API_CONFIG.BASE_URL}/bookings`, bookingData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    getAllBookings: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/bookings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getBookingByNumber: (bookingNumber) => {
        return axios.get(`${API_CONFIG.BASE_URL}/bookings/${bookingNumber}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

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
    getDashboardStats: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getBookingTrends: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/booking-trends`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getServiceTypes: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/service-types`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getBranchPerformance: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/branch-performance`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getDeliveryStatus: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/delivery-status`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },
    getRecentActivities: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/dashboard/recent-activities`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // Branch related methods
    getBranches: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/branches`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching branches:', error);
            throw error;
        }
    },

    // Executive related methods
    getExecutives: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/executives`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching executives:', error);
            throw error;
        }
    },

    // Pickup assignment
    assignPickup: async (bookingId, assignmentData) => {
        try {
            console.log('Making API call to assign pickup:', {
                url: `${API_CONFIG.BASE_URL}/bookings/${bookingId}/assign-pickup`,
                data: assignmentData
            });

            const response = await axios.post(
                `${API_CONFIG.BASE_URL}/bookings/${bookingId}/assign-pickup`,
                assignmentData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Assign pickup response:', response);
            return response;
        } catch (error) {
            console.error('Error in assignPickup:', error.response || error);
            throw error;
        }
    }
};

export default apiService;