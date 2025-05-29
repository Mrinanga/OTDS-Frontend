const API_CONFIG = {
    BASE_URL: 'http://localhost/OTDS-DEVELOPMENT/OTDS-Backend/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH_TOKEN: '/auth/refresh-token'
        },
        BOOKINGS: {
            CREATE: '/bookings/create',
            LIST: '/bookings/list',
            DETAILS: '/bookings/details',
            UPDATE: '/bookings/update',
            DELETE: '/bookings/delete'
        },
        CUSTOMERS: {
            PROFILE: '/customers/profile',
            UPDATE: '/customers/update',
            ADDRESSES: '/customers/addresses'
        },
        TRACKING: {
            STATUS: '/tracking/status',
            HISTORY: '/tracking/history'
        },
        PAYMENTS: {
            CREATE: '/payments/create',
            VERIFY: '/payments/verify',
            HISTORY: '/payments/history'
        },
        SUPPORT: {
            TICKETS: '/support/tickets',
            CREATE_TICKET: '/support/create-ticket'
        }
    }
};

export default API_CONFIG; 