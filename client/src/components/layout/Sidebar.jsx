import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, CreditCard, Target,
  User, MessageSquare, LogOut, ClipboardCheck, Shield, Activity
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const mainNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/spending', label: 'Spending', icon: CreditCard },
  { path: '/investments', label: 'Investments', icon: TrendingUp },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/credit-score', label: 'Credit Score', icon: Activity },
  { path: '/profile', label: 'My Profile', icon: User },
];

const toolsNavItems = [
  { path: '/advisor', label: 'AI Advisor', icon: MessageSquare },
  { path: '/risk-assessment', label: 'Risk Assessment', icon: ClipboardCheck },
  { path: '/vault', label: 'Secure Vault', icon: Shield },
];

const Sidebar = ({ isOpen, onClose, isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const { isDarkMode } = useContext(ThemeContext);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    setIsLoggedIn(false);
  };

  const sidebarStyle = {
    width: '260px',
    minWidth: '260px',
    background: isDarkMode ? '#081824' : '#FFFFFF',
    borderRight: isDarkMode ? 'none' : '1px solid #E5E7EB',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    position: 'relative',
    zIndex: 40,
    transition: 'transform 300ms ease',
  };

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '13px 24px',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? (isDarkMode ? '#00BFA5' : '#00796B') : (isDarkMode ? '#F1F5F9' : '#1A1A2E'),
    background: isActive ? (isDarkMode ? 'rgba(0,191,165,0.1)' : 'rgba(0,121,107,0.1)') : 'transparent',
    borderLeft: `3px solid ${isActive ? (isDarkMode ? '#00BFA5' : '#00796B') : 'transparent'}`,
    textDecoration: 'none',
    transition: 'all 150ms ease',
    cursor: 'pointer',
  });

  const sectionHeaderStyle = {
    padding: '0 24px 10px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 35,
          }}
          className="md-hidden"
        />
      )}

      <aside style={sidebarStyle}>
        <div style={{ paddingTop: '28px', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Main Section */}
          <nav>
            <div style={sectionHeaderStyle}>Main</div>
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={linkStyle(isActive)}
                  onClick={onClose}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Tools Section */}
          <nav>
            <div style={sectionHeaderStyle}>Tools</div>
            {toolsNavItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={linkStyle(isActive)}
                  onClick={onClose}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {isLoggedIn && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '16px 16px 28px 16px',
          }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '13px 12px',
                fontSize: '14px',
                fontWeight: 500,
                color: isDarkMode ? '#EF5350' : '#C62828',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left',
                borderRadius: '6px',
                transition: 'background 150ms',
              }}
              onMouseOver={e => e.currentTarget.style.background = isDarkMode ? 'rgba(239,83,80,0.1)' : 'rgba(198,40,40,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
