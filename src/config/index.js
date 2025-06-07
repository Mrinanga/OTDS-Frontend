const config = {
    // API Base URL
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost/OTDS-Backend/api',

    // API Endpoints
    API_ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',

        // Settings endpoints
        GET_SETTINGS: '/settings',
        UPDATE_PREFERENCES: '/settings/preferences',
        UPDATE_NOTIFICATIONS: '/settings/notifications',
        UPDATE_SECURITY: '/settings/security',

        // Other endpoints can be added here
    },

    // Default settings
    DEFAULT_SETTINGS: {
        preferences: {
            theme: 'light',
            language: 'en',
            currency: 'INR',
            timeZone: 'Asia/Kolkata',
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            defaultDeliverySlot: 'morning',
            defaultPickupSlot: 'morning',
            defaultDeliveryRadius: 5,
            autoAssignPickups: true,
            enableRouteOptimization: true,
            refreshInterval: 60
        },
        notifications: {
            notifyDeliveryStatus: true,
            deliveryStatusEmail: true,
            deliveryStatusSMS: true,
            deliveryStatusPush: true,
            notifyDeliveryAttempts: true,
            deliveryAttemptsEmail: true,
            deliveryAttemptsSMS: true,
            deliveryAttemptsPush: true,
            notifyPickupRequests: true,
            pickupRequestsEmail: true,
            pickupRequestsSMS: true,
            pickupRequestsPush: true,
            notifyPickupReminders: true,
            pickupRemindersEmail: true,
            pickupRemindersSMS: true,
            pickupRemindersPush: true,
            notifySystemAlerts: true,
            systemAlertsEmail: true,
            systemAlertsSMS: true,
            systemAlertsPush: true,
            notifyPerformanceReports: true,
            performanceReportsEmail: true,
            performanceReportsSMS: true,
            performanceReportsPush: true,
            quietHoursStart: '22:00',
            quietHoursEnd: '07:00',
            reportFrequency: 'daily'
        },
        security: {
            twoFA: false,
            twoFAMethod: 'authenticator',
            sessionTimeout: 30,
            alertNewLogin: true,
            alertPasswordChange: true,
            alertSecuritySettings: true
        }
    },

    // Theme configuration
    THEME: {
        light: {
            primary: '#1976d2',
            secondary: '#dc004e',
            background: '#ffffff',
            text: '#000000',
            error: '#f44336',
            warning: '#ff9800',
            success: '#4caf50',
            info: '#2196f3'
        },
        dark: {
            primary: '#90caf9',
            secondary: '#f48fb1',
            background: '#121212',
            text: '#ffffff',
            error: '#f44336',
            warning: '#ff9800',
            success: '#4caf50',
            info: '#2196f3'
        }
    },

    // Available languages
    LANGUAGES: [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी' },
        { code: 'bn', name: 'বাংলা' },
        { code: 'as', name: 'অসমীয়া' }
    ],

    // Available currencies
    CURRENCIES: [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
    ],

    // Available time zones
    TIMEZONES: [
        { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }
    ],

    // Available date formats
    DATE_FORMATS: [
        { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
        { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
        { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
    ],

    // Available time formats
    TIME_FORMATS: [
        { value: '12h', label: '12-hour' },
        { value: '24h', label: '24-hour' }
    ],

    // Available delivery/pickup slots
    TIME_SLOTS: [
        { value: 'morning', label: 'Morning (9:00 AM - 12:00 PM)' },
        { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM)' },
        { value: 'evening', label: 'Evening (4:00 PM - 8:00 PM)' }
    ],

    // Available report frequencies
    REPORT_FREQUENCIES: [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' }
    ],

    // Available 2FA methods
    TWO_FA_METHODS: [
        { value: 'authenticator', label: 'Authenticator App' },
        { value: 'sms', label: 'SMS' },
        { value: 'email', label: 'Email' }
    ]
};

export default config; 