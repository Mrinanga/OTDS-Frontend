import axios from 'axios';
import config from '../config';

class SettingsService {
    constructor() {
        this.api = axios.create({
            baseURL: config.API_BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add request interceptor to include auth token
        this.api.interceptors.request.use(
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
    }

    // Get all settings
    async getSettings() {
        try {
            const response = await this.api.get(config.API_ENDPOINTS.GET_SETTINGS);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update preferences
    async updatePreferences(preferences) {
        try {
            const response = await this.api.post(config.API_ENDPOINTS.UPDATE_PREFERENCES, preferences);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update notifications
    async updateNotifications(notifications) {
        try {
            const response = await this.api.post(config.API_ENDPOINTS.UPDATE_NOTIFICATIONS, notifications);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Update security settings
    async updateSecurity(security) {
        try {
            const response = await this.api.post(config.API_ENDPOINTS.UPDATE_SECURITY, security);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // Error handler
    handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            return {
                status: 'error',
                message: error.response.data.message || 'An error occurred',
                data: error.response.data
            };
        } else if (error.request) {
            // The request was made but no response was received
            return {
                status: 'error',
                message: 'No response from server',
                data: null
            };
        } else {
            // Something happened in setting up the request that triggered an Error
            return {
                status: 'error',
                message: error.message,
                data: null
            };
        }
    }
}

export default new SettingsService(); 