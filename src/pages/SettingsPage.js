import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import SettingsTabs from '../components/Settings/SettingsTabs';
import ProfileSettings from '../components/Settings/ProfileSettings';
import BranchOfficeSettings from '../components/Settings/BranchOfficeSettings';
import PreferencesSettings from '../components/Settings/PreferencesSettings';
import NotificationSettings from '../components/Settings/NotificationSettings';
import SecuritySettings from '../components/Settings/SecuritySettings';
import SystemSettings from '../components/Settings/SystemSettings';
import '../styles/SettingsPage.css';

const SettingsPage = () => {
  const { user } = useAuth();
  const { settings, updateSettings, loading, error } = useSettings();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    // Profile Settings
    name: user?.first_name + ' ' + user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: null,

    // Branch Office Settings
    branchOffices: [],
    newBranchOffice: {
      name: '',
      code: '',
      manager_id: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: ''
      },
      operating_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '14:00' },
        sunday: { open: '', close: '' }
      }
    },

    // Preferences Settings
    theme: 'light',
    language: 'en',
    currency: 'INR',
    timeZone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    defaultDeliverySlot: 'morning',
    defaultPickupSlot: 'morning',
    defaultDeliveryRadius: 5,
    autoAssignPickups: true,
    enableRouteOptimization: true,
    refreshInterval: 60,

    // Notification Settings
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
    reportFrequency: 'daily',

    // Security Settings
    twoFA: false,
    twoFAMethod: 'authenticator',
    sessionTimeout: 30,
    alertNewLogin: true,
    alertPasswordChange: true,
    alertSecuritySettings: true
  });

  useEffect(() => {
    if (settings) {
      setFormData(prevData => ({
        ...prevData,
        ...settings.preferences,
        ...settings.notifications,
        ...settings.security
      }));
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Group settings by tab
      const tabSettings = {
        profile: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar
        },
        branchOffices: {
          branchOffices: formData.branchOffices,
          newBranchOffice: formData.newBranchOffice
        },
        preferences: {
          theme: formData.theme,
          language: formData.language,
          currency: formData.currency,
          timeZone: formData.timeZone,
          dateFormat: formData.dateFormat,
          defaultDeliverySlot: formData.defaultDeliverySlot,
          defaultPickupSlot: formData.defaultPickupSlot,
          defaultDeliveryRadius: formData.defaultDeliveryRadius,
          autoAssignPickups: formData.autoAssignPickups,
          enableRouteOptimization: formData.enableRouteOptimization,
          refreshInterval: formData.refreshInterval
        },
        notifications: {
          notifyDeliveryStatus: formData.notifyDeliveryStatus,
          deliveryStatusEmail: formData.deliveryStatusEmail,
          deliveryStatusSMS: formData.deliveryStatusSMS,
          deliveryStatusPush: formData.deliveryStatusPush,
          notifyDeliveryAttempts: formData.notifyDeliveryAttempts,
          deliveryAttemptsEmail: formData.deliveryAttemptsEmail,
          deliveryAttemptsSMS: formData.deliveryAttemptsSMS,
          deliveryAttemptsPush: formData.deliveryAttemptsPush,
          notifyPickupRequests: formData.notifyPickupRequests,
          pickupRequestsEmail: formData.pickupRequestsEmail,
          pickupRequestsSMS: formData.pickupRequestsSMS,
          pickupRequestsPush: formData.pickupRequestsPush,
          notifyPickupReminders: formData.notifyPickupReminders,
          pickupRemindersEmail: formData.pickupRemindersEmail,
          pickupRemindersSMS: formData.pickupRemindersSMS,
          pickupRemindersPush: formData.pickupRemindersPush,
          notifySystemAlerts: formData.notifySystemAlerts,
          systemAlertsEmail: formData.systemAlertsEmail,
          systemAlertsSMS: formData.systemAlertsSMS,
          systemAlertsPush: formData.systemAlertsPush,
          notifyPerformanceReports: formData.notifyPerformanceReports,
          performanceReportsEmail: formData.performanceReportsEmail,
          performanceReportsSMS: formData.performanceReportsSMS,
          performanceReportsPush: formData.performanceReportsPush,
          quietHoursStart: formData.quietHoursStart,
          quietHoursEnd: formData.quietHoursEnd,
          reportFrequency: formData.reportFrequency
        },
        security: {
          twoFA: formData.twoFA,
          twoFAMethod: formData.twoFAMethod,
          sessionTimeout: formData.sessionTimeout,
          alertNewLogin: formData.alertNewLogin,
          alertPasswordChange: formData.alertPasswordChange,
          alertSecuritySettings: formData.alertSecuritySettings
        }
      };

      // Update only the settings for the active tab
      await updateSettings(activeTab, tabSettings[activeTab]);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'branch-offices':
        return (
          <BranchOfficeSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      case 'system':
        return (
          <SystemSettings
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Loading your settings...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Error loading settings</p>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>
      <div className="settings-content">
        <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <div className="settings-form-container">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
