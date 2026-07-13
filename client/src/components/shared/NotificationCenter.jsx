import { useData } from '../../context/DataContext';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Bell, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';


const NotificationCenter = () => {
  const { notifications: mockNotifications } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const { isDarkMode } = useContext(ThemeContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));
    if (notification.link) {
      navigate(notification.link);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          color: '#94A3B8',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#C62828',
            color: '#FFFFFF',
            fontSize: '9px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: '360px',
          maxHeight: '400px',
          overflowY: 'auto',
          background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
          border: '1px solid',
          borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
          borderRadius: '8px',
          boxShadow: isDarkMode
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(0,0,0,0.08)',
          zIndex: 100,
          marginTop: '4px',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid',
            borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
            }}>
              Notifications
            </h4>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: isDarkMode ? '#00BFA5' : '#00796B',
                    cursor: 'pointer',
                    padding: '2px 6px',
                  }}
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          {notifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid',
                borderColor: isDarkMode ? 'rgba(30,58,95,0.5)' : 'rgba(229,231,235,0.5)',
                cursor: 'pointer',
                background: notification.read
                  ? 'transparent'
                  : (isDarkMode ? 'rgba(0,191,165,0.03)' : 'rgba(0,121,107,0.02)'),
                transition: 'background 150ms',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = isDarkMode
                  ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = notification.read
                  ? 'transparent'
                  : (isDarkMode ? 'rgba(0,191,165,0.03)' : 'rgba(0,121,107,0.02)');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    {!notification.read && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isDarkMode ? '#00BFA5' : '#00796B',
                        flexShrink: 0,
                      }} />
                    )}
                    <span style={{
                      fontSize: '13px',
                      fontWeight: notification.read ? 500 : 600,
                      color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                    }}>
                      {notification.title}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '12px',
                    color: isDarkMode ? '#94A3B8' : '#6B7280',
                    margin: '0 0 4px 0',
                    lineHeight: 1.3,
                  }}>
                    {notification.message}
                  </p>
                  <span style={{
                    fontSize: '10px',
                    color: isDarkMode ? '#475569' : '#9CA3AF',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    {notification.time}
                  </span>
                </div>
                {notification.link && (
                  <ExternalLink size={12} style={{ color: '#94A3B8', marginTop: '2px', flexShrink: 0 }} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
