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
    getCustomers: () => api.get(API_CONFIG.ENDPOINTS.CUSTOMERS.PROFILE),
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

    createBranch: (branchData) => {
        return axios.post(`${API_CONFIG.BASE_URL}/branches`, branchData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    updateBranch: (branchId, branchData) => {
        return axios.put(`${API_CONFIG.BASE_URL}/branches/${branchId}`, branchData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    deleteBranch: (branchId) => {
        return axios.delete(`${API_CONFIG.BASE_URL}/branches/${branchId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // User management methods
    getUsers: () => {
        return axios.get(`${API_CONFIG.BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    createUser: (userData) => {
        return axios.post(`${API_CONFIG.BASE_URL}/users`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    updateUser: (userId, userData) => {
        return axios.put(`${API_CONFIG.BASE_URL}/users/${userId}`, userData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
    },

    deleteUser: (userId) => {
        return axios.delete(`${API_CONFIG.BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    // Executive related methods
    getExecutives: async () => {
        try {
            const response = await api.get(API_CONFIG.ENDPOINTS.FIELD_EXECUTIVE.LIST);
            return response;
        } catch (error) {
            console.error('Error fetching executives:', error);
            throw error;
        }
    },

    getExecutivesByBranch: async (branchId) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.FIELD_EXECUTIVE.BY_BRANCH}/${branchId}`);
            return response;
        } catch (error) {
            console.error('Error fetching executives by branch:', error);
            throw error;
        }
    },

    // Shipment methods
    createShipment: async (shipmentData) => {
        try {
            const response = await api.post(`${API_CONFIG.BASE_URL}/shipments`, shipmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating shipment:', error);
            throw error;
        }
    },

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
            const response = await api.get(API_CONFIG.ENDPOINTS.PICKUP.LIST);
            return response.data;
        } catch (error) {
            console.error('Error fetching pickup requests:', error);
            throw error;
        }
    },

    getFilteredPickupRequests: async (status) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.PICKUP.FILTER}?action=filter&status=${status}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching filtered pickup requests:', error);
            throw error;
        }
    },

    getPickupRequestById: async (id) => {
        try {
            const response = await api.get(`${API_CONFIG.ENDPOINTS.PICKUP.DETAILS}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching pickup request:', error);
            throw error;
        }
    },

    createPickupRequest: async (data) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.PICKUP.CREATE, data);
            return response.data;
        } catch (error) {
            console.error('Error creating pickup request:', error);
            throw error;
        }
    },

    updatePickupStatus: async (id, status) => {
        try {
            const response = await api.put(`${API_CONFIG.ENDPOINTS.PICKUP.UPDATE}?action=status`, { id, status });
            return response.data;
        } catch (error) {
            console.error('Error updating pickup status:', error);
            throw error;
        }
    },

    deletePickupRequest: async (id) => {
        try {
            const response = await api.delete(`${API_CONFIG.ENDPOINTS.PICKUP.DELETE}?id=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting pickup request:', error);
            throw error;
        }
    },

    async assignPickup(bookingNumber, data) {
        try {
            // First get the booking details
            const bookingResponse = await this.getBookingByNumber(bookingNumber);
            const bookingData = bookingResponse.data.data;

            // Get pickup address details
            const pickupAddress = bookingData.pickup_address;
            const deliveryAddress = bookingData.delivery_address || bookingData.pickup_address;

            // Format addresses
            const formatAddress = (address) => {
                if (!address) return 'N/A';
                if (typeof address === 'string') return address;
                return [
                    address.address,
                    address.city,
                    address.state,
                    address.postal_code,
                    address.country
                ].filter(Boolean).join(', ');
            };

            // Ensure quantity is a valid number
            let quantity = 1; // Default value
            if (bookingData.package_details && bookingData.package_details.quantity) {
                const parsedQuantity = parseInt(bookingData.package_details.quantity);
                if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                    quantity = parsedQuantity;
                }
            }

            // Combine booking data with pickup assignment data
            const requestData = {
                request_id: bookingNumber,
                branch_id: data.branch_id,
                executive_id: data.executive_id,
                pickup_date: data.pickup_date,
                pickup_time: data.pickup_time,
                service_type: bookingData.service_type,
                pickup_address: formatAddress(pickupAddress),
                delivery_address: formatAddress(deliveryAddress),
                customer_name: pickupAddress.name || 'N/A',
                phone: pickupAddress.phone || 'N/A',
                email: pickupAddress.email || 'N/A',
                address: pickupAddress.address || 'N/A',
                landmark: pickupAddress.landmark || 'N/A',
                city: pickupAddress.city || 'N/A',
                pincode: pickupAddress.postal_code || 'N/A',
                package_type: bookingData.package_details.type,
                weight: bookingData.package_details.weight,
                dimensions: bookingData.package_details.dimensions || 'N/A',
                quantity: quantity,
                contents: bookingData.package_details.description || 'N/A',
                payment_mode: 'cash', // Default to cash
                special_instructions: data.notes || 'N/A',
                status: 'assigned',
                created_by: 1, // This should be the logged-in user's ID
                updated_by: 1  // This should be the logged-in user's ID
            };

            console.log('Sending request to:', '/pickup-request/assign');
            console.log('Request data:', requestData);
            const response = await api.post('/pickup-request/assign', requestData);
            console.log('Response:', response);

            // Update booking status to 'FE Assigned'
            if (response.data.success) {
                // Include all required fields from the original booking data
                const updateData = {
                    service_type: bookingData.service_type,
                    status: 'FE Assigned',
                    total_amount: bookingData.total_amount,
                    payment_status: bookingData.payment_status,
                    branch_id: data.branch_id,
                    executive_id: data.executive_id,
                    pickup_date: data.pickup_date,
                    pickup_time: data.pickup_time,
                    pickup_notes: data.notes || 'N/A'
                };

                await api.put(`${API_CONFIG.ENDPOINTS.BOOKINGS.UPDATE}/${bookingNumber}`, updateData);
            }

            return response.data;
        } catch (error) {
            console.error('Error assigning pickup:', error);
            throw error;
        }
    }
};

export default apiService;