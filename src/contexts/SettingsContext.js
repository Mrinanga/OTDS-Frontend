import React, { createContext, useContext, useState } from 'react';
import config from '../config';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(config.DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateSettings = (type, data) => {
    try {
      setSettings(prevSettings => ({
        ...prevSettings,
        [type]: {
          ...prevSettings[type],
          ...data
        }
      }));
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 