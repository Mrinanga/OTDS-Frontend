import axios from 'axios';
import API_CONFIG from '../config/api.config';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
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
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.error('Response Error:', error.response || error);
        return Promise.reject(error);
    }
);

// Dummy tracking data
const dummyTrackingData = {
  id: 1,
  tracking_id: "OTDS123456789",
  status: "in_transit",
  current_location: "Main Branch Hub",
  last_update: new Date().toISOString(),
  estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  recipient: {
    name: "John Doe",
    address: "123 Main Street, City",
    phone: "+1234567890"
  },
  sender: {
    name: "Jane Smith",
    address: "456 Business Ave, Town",
    phone: "+0987654321"
  },
  package_details: {
    weight: "2.5 kg",
    dimensions: "30x20x15 cm",
    type: "Express Delivery"
  },
  tracking_history: [
    {
      status: "in_transit",
      location: "Main Branch Hub",
      timestamp: new Date().toISOString(),
      description: "Package is in transit to destination"
    },
    {
      status: "picked_up",
      location: "Origin Branch",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      description: "Package picked up from sender"
    },
    {
      status: "processing",
      location: "Sorting Facility",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      description: "Package received at sorting facility"
    }
  ]
};

// API service methods
const apiService = {
    // Auth methods
    login: async (credentials) => {
        try {
            const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
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
    getAllBookings: () => api.get(API_CONFIG.ENDPOINTS.BOOKINGS.LIST),
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
    getDashboardStats: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.STATS),
    getBookingTrends: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.BOOKING_TRENDS),
    getServiceTypes: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.SERVICE_TYPES),
    getBranchPerformance: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.BRANCH_PERFORMANCE),
    getDeliveryStatus: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.DELIVERY_STATUS),
    getRecentActivities: () => api.get(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES),

    // Branch related methods
    getBranches: () => api.get('/branches'),
    createBranch: (branchData) => api.post('/branches', branchData),
    updateBranch: (branchId, branchData) => api.put(`/branches/${branchId}`, branchData),
    deleteBranch: (branchId) => api.delete(`/branches/${branchId}`),

    // User management methods
    getUsers: () => api.get('/users'),
    createUser: (userData) => api.post('/users', userData),
    updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
    deleteUser: (userId) => api.delete(`/users/${userId}`),

    // Executive related methods
    getExecutives: () => api.get(API_CONFIG.ENDPOINTS.FIELD_EXECUTIVE.LIST),
    getExecutivesByBranch: (branchId) => api.get(`${API_CONFIG.ENDPOINTS.FIELD_EXECUTIVE.BY_BRANCH}/${branchId}`),

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

    printShipmentLabel: async (shipmentId) => {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/shipments/${shipmentId}/label`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            console.error('Error printing shipment label:', error);
            throw error;
        }
    },

    getAllShipments: async () => {
        try {
            console.log('Making API request to fetch all shipments');
            const response = await axios.get(`${API_CONFIG.BASE_URL}/shipments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('API Response:', response);
            return response;
        } catch (error) {
            console.error('Error in getAllShipments:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                throw new Error(error.response.data.message || 'Failed to fetch shipments');
            }
            throw error;
        }
    },

    getFilteredShipments: (status) => {
        return axios.get(`${API_CONFIG.BASE_URL}/shipments/filter?status=${status}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getShipmentsByBranch: async (branchId) => {
        try {
            console.log('Making API request to fetch branch shipments:', {
                url: `${API_CONFIG.BASE_URL}/shipments/branch/${branchId}`,
                branchId: branchId,
                token: localStorage.getItem('token') ? 'Present' : 'Missing'
            });
            
            const response = await axios.get(`${API_CONFIG.BASE_URL}/shipments/branch/${branchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            console.log('Branch shipments API response:', {
                status: response.status,
                data: response.data,
                headers: response.headers
            });
            
            return response;
        } catch (error) {
            console.error('Error in getShipmentsByBranch:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });
            throw error;
        }
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

    getPickupsByBranch: async (branchId) => {
        try {
            console.log('API Service - getPickupsByBranch called with branchId:', branchId);
            const url = `/pickuprequest/branch/${branchId}`;
            console.log('Making request to URL:', url);
            const response = await api.get(url);
            console.log('API Service - getPickupsByBranch response:', response);
            return response.data;
        } catch (error) {
            console.error('API Service - Error in getPickupsByBranch:', error);
            throw error;
        }
    },

    getFilteredPickupRequests: async (status) => {
        try {
            console.log('API Service - getFilteredPickupRequests called with status:', status);
            const url = `${API_CONFIG.ENDPOINTS.PICKUP.FILTER}?action=filter&status=${status}`;
            console.log('Making request to URL:', url);
            const response = await api.get(url);
            console.log('API Service - getFilteredPickupRequests response:', response);
            return response.data;
        } catch (error) {
            console.error('API Service - Error in getFilteredPickupRequests:', error);
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
    },

    // Final Destination methods
    getFinalDestinationShipments: async (branchId) => {
        try {
            const response = await api.get(`/finaldestination/shipments/${branchId}`);
            return response;
        } catch (error) {
            console.error('Error fetching final destination shipments:', error);
            throw error;
        }
    },

    getAvailableExecutives: async (branchId) => {
        try {
            const response = await api.get(`/finaldestination/executives/${branchId}`);
            return response;
        } catch (error) {
            console.error('Error fetching available executives:', error);
            throw error;
        }
    },

    assignExecutiveAndOutForDelivery: async (data) => {
        try {
            const response = await api.post('/finaldestination/out-for-delivery', data);
            return response;
        } catch (error) {
            console.error('Error assigning executive:', error);
            throw error;
        }
    },

    async getLabelData(trackingNumber) {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_CONFIG.BASE_URL}/shipments/${trackingNumber}/label`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching label data:', error);
            throw error;
        }
    },

    getLiveTracking: async (branchId) => {
        try {
            const response = await axios.get(`${API_CONFIG.BASE_URL}/branch/${branchId}/live-tracking`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response;
        } catch (error) {
            console.error('Error fetching live tracking:', error);
            throw error;
        }
    },

    trackShipment: async (trackingId) => {
        try {
            // Try to fetch from backend first
            const response = await axios.get(`${API_CONFIG.BASE_URL}/track/${trackingId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            return response;
        } catch (error) {
            console.log('Using dummy tracking data for testing');
            // Return dummy data for testing
            return {
                data: {
                    ...dummyTrackingData,
                    tracking_id: trackingId // Use the provided tracking ID
                }
            };
        }
    },
};

export default apiService;