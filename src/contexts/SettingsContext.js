import React, { createContext, useContext, useState, useEffect } from 'react';
import settingsService from '../services/settings.service';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (type, data) => {
    try {
      setLoading(true);
      let response;

      switch (type) {
        case 'preferences':
          response = await settingsService.updatePreferences(data);
          break;
        case 'notifications':
          response = await settingsService.updateNotifications(data);
          break;
        case 'security':
          response = await settingsService.updateSecurity(data);
          break;
        default:
          throw new Error('Invalid settings type');
      }

      // Update the settings state with the new data
      setSettings(prevSettings => ({
        ...prevSettings,
        [type]: response.data
      }));

      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 