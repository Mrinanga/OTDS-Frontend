import React from 'react';
import { FaUser, FaBuilding, FaCog, FaBell, FaShieldAlt, FaServer } from 'react-icons/fa';
import '../../styles/SettingsPage.css';

const SettingsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <FaUser />,
      description: 'Manage your personal information and account details'
    },
    {
      id: 'branch-offices',
      label: 'Branch Offices',
      icon: <FaBuilding />,
      description: 'Configure branch office locations and settings'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: <FaCog />,
      description: 'Customize your application preferences and defaults'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <FaBell />,
      description: 'Set up notification preferences and delivery channels'
    },
    {
      id: 'security',
      label: 'Security',
      icon: <FaShieldAlt />,
      description: 'Manage security settings and authentication methods'
    },
    {
      id: 'system',
      label: 'System',
      icon: <FaServer />,
      description: 'Configure system-wide settings and maintenance options'
    }
  ];

  return (
    <div className="settings-content">
      <div className="settings-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="tab-icon">{tab.icon}</div>
            <div className="tab-content">
              <h3>{tab.label}</h3>
              <p>{tab.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsTabs;
