import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, Menu } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import NotificationCenter from '../shared/NotificationCenter';


const Navbar = ({ onMenuToggle, isLoggedIn, setIsLoggedIn }) => {
  const { user } = useData();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { isPrivacyMode, togglePrivacy } = useContext(PrivacyContext);

  return (
    <header
      className="navbar"
      style={{
        height: '56px',
        background: isDarkMode ? '#0A2540' : '#FFFFFF',
        borderBottom: '1px solid',
        borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Logo + Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuToggle}
          className="md-hidden"
          style={{
            background: 'none',
            border: 'none',
            color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
            cursor: 'pointer',
            padding: '4px',
            display: 'none',
          }}
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#00796B',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '12px',
            fontFamily: "'IBM Plex Mono', monospace",
          }}>
            WS
          </div>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 700,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
            }}>
              WealthSphere
            </h1>
            <p style={{
              margin: 0,
              fontSize: '9px',
              color: '#94A3B8',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}>
              IDBI Wealth Management
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Privacy Toggle */}
        <button
          onClick={togglePrivacy}
          title={isPrivacyMode ? 'Show sensitive data' : 'Hide sensitive data'}
          style={{
            background: 'none',
            border: 'none',
            color: isPrivacyMode ? '#00BFA5' : '#94A3B8',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms',
          }}
        >
          {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
            transition: 'color 200ms',
          }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Center */}
        <NotificationCenter />

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '24px',
          background: isDarkMode ? '#1E3A5F' : '#94A3B8',
          margin: '0 8px',
        }} />

        {/* User Profile */}
        {isLoggedIn ? (
          <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{
                margin: 0,
                fontSize: '13px',
                fontWeight: 600,
                color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              }}>
                {user.name}
              </p>
              <p style={{
                margin: 0,
                fontSize: '10px',
                color: '#94A3B8',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                {user.customerId}
              </p>
            </div>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: isDarkMode ? '#1A3A5C' : '#00796B',
              color: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              border: '2px solid',
              borderColor: '#00796B',
            }}>
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </Link>
        ) : (
          <Link to="/login" style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            color: '#F1F5F9',
            padding: '6px 16px',
            background: '#00796B',
            borderRadius: '6px',
          }}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
