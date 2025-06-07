import axios from 'axios';
import config from '../config';

const API_BASE_URL = config.API_BASE_URL;

const SETTINGS_API = `${API_BASE_URL}/settings`;

// Profile Settings
export const getProfileSettings = async (userId) => {
    try {
        const response = await axios.get(`${SETTINGS_API}/profile/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateProfileSettings = async (userId, data) => {
    try {
        const response = await axios.post(`${SETTINGS_API}/profile/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Branch Office Settings
export const getBranchOfficeSettings = async (branchId) => {
    try {
        const response = await axios.get(`${SETTINGS_API}/branch-office/${branchId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateBranchOfficeSettings = async (branchId, data) => {
    try {
        const response = await axios.post(`${SETTINGS_API}/branch-office/${branchId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Preferences Settings
export const getUserPreferences = async (userId) => {
    try {
        const response = await axios.get(`${SETTINGS_API}/preferences/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateUserPreferences = async (userId, data) => {
    try {
        const response = await axios.post(`${SETTINGS_API}/preferences/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Notification Settings
export const getNotificationSettings = async (userId) => {
    try {
        const response = await axios.get(`${SETTINGS_API}/notifications/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateNotificationSettings = async (userId, data) => {
    try {
        const response = await axios.post(`${SETTINGS_API}/notifications/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Security Settings
export const getSecuritySettings = async (userId) => {
    try {
        const response = await axios.get(`${SETTINGS_API}/security/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateSecuritySettings = async (userId, data) => {
    try {
        const response = await axios.post(`${SETTINGS_API}/security/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}; 