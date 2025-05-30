const API_CONFIG = {
    BASE_URL: 'http://localhost/OTDS-DEVELOPMENT/OTDS-Backend/api',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout'
        },
        BOOKINGS: {
            CREATE: '/bookings/create',
            LIST: '/bookings',
            DETAILS: '/bookings',
            UPDATE: '/bookings',
            DELETE: '/bookings'
        },
        CUSTOMERS: {
            PROFILE: '/customers',
            UPDATE: '/customers',
            ADDRESSES: '/customers',
            CREATE: '/customers/create'
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