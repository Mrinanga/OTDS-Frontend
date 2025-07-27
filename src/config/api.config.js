const API_CONFIG = {
    // BASE_URL: 'https://otdscourier.in/OTDS-Backend/api',
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
        },
        DASHBOARD: {
            STATS: '/dashboard/stats',
            BOOKING_TRENDS: '/dashboard/booking-trends',
            SERVICE_TYPES: '/dashboard/service-types',
            BRANCH_PERFORMANCE: '/dashboard/branch-performance',
            DELIVERY_STATUS: '/dashboard/delivery-status',
            RECENT_ACTIVITIES: '/dashboard/recent-activities'
        },
        FIELD_EXECUTIVE: {
            LIST: '/field-executive',
            BY_BRANCH: '/field-executive/branch'
        },
        PICKUP: {
            LIST: '/pickup-request',
            FILTER: '/pickup-request',
            DETAILS: '/pickup-request',
            CREATE: '/pickup-request',
            UPDATE: '/pickup-request',
            DELETE: '/pickup-request',
            ASSIGN: '/pickup-request/assign'
        }
    }
};

export default API_CONFIG; 