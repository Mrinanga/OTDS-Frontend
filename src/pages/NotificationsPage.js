import React, { useState } from 'react';
import '../styles/Notifications.css';

const initialNotifications = [
  {
    id: 1,
    type: 'info',
    message: 'New courier booking received.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'success',
    message: 'Billing completed for Order #1023.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    message: 'Delivery agent not assigned for Zone A.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 4,
    type: 'error',
    message: 'Payment failed for Order #1009.',
    time: '2 days ago',
    read: true,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notifications.length > 0 && (
          <button onClick={clearAll} className="clear-btn">
            Clear All
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications to show.</div>
      ) : (
        <ul className="notification-list">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification-item ${notif.read ? 'read' : 'unread'}`}
              onClick={() => toggleRead(notif.id)}
            >
              <span className={`icon ${notif.type}`}>{getIcon(notif.type)}</span>
              <div className="content">
                <p>{notif.message}</p>
                <small>{notif.time}</small>
              </div>
              <div className="status-pill">{notif.read ? 'Read' : 'Unread'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
