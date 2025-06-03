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

    getBookingByNumber: async (bookingNumber) => {
        try {
            console.log('Fetching booking with number:', bookingNumber);
            if (!bookingNumber) {
                throw new Error('Booking number is required');
            }
            const response = await api.get(`/bookings/${bookingNumber}`);
            console.log('Booking response:', response);
            if (!response.data) {
                throw new Error('No data received from server');
            }
            return response;
        } catch (error) {
            console.error('Error in getBookingByNumber:', error.response || error);
            throw error;
        }
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
    getBranches: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/branches`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // Executive related methods
    getExecutives: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/field-executive`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            return data.data || []; // Return the data array or empty array if not found
        } catch (error) {
            console.error('Error fetching executives:', error);
            throw error;
        }
    },

    getExecutivesByBranch: async (branchId) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/field-executive/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            return data.data || []; // Return the data array or empty array if not found
        } catch (error) {
            console.error('Error fetching executives by branch:', error);
            throw error;
        }
    },

    // Shipment methods
    getAllShipments: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/shipments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getFilteredShipments: (status) => {
        return axios.get(`${API_CONFIG.BASE_URL}/shipments/filter?status=${status}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getShipmentById: (id) => {
        return axios.get(`${API_CONFIG.BASE_URL}/shipments/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    updateShipmentStatus: (id, status) => {
        return axios.put(`${API_CONFIG.BASE_URL}/shipments/${id}/status`, { status }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    updateShipment: (id, data) => {
        return axios.put(`${API_CONFIG.BASE_URL}/shipments/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    deleteShipment: (id) => {
        return axios.delete(`${API_CONFIG.BASE_URL}/shipments/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // Pickup Request Methods
    getAllPickupRequests: async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching pickup requests:', error);
            throw error;
        }
    },

    getFilteredPickupRequests: async (status) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request?action=filter&status=${status}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching filtered pickup requests:', error);
            throw error;
        }
    },

    getPickupRequestById: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request?id=${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching pickup request:', error);
            throw error;
        }
    },

    createPickupRequest: async (data) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating pickup request:', error);
            throw error;
        }
    },

    assignPickup: async (data) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request?action=assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('Error assigning pickup:', error);
            throw error;
        }
    },

    updatePickupStatus: async (id, status) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request?action=status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id, status })
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating pickup status:', error);
            throw error;
        }
    },

    deletePickupRequest: async (id) => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/pickup-request?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting pickup request:', error);
            throw error;
        }
    }
};

export default apiService;