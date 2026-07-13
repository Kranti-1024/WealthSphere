import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { Mail, Phone, MapPin, User, CreditCard, CheckCircle, Calendar, Briefcase } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

import { formatDate } from '../../utils/formatters';

const PROFILE_COLORS = {
  Conservative: { color: '#0A2540', darkColor: '#94A3B8', bg: 'rgba(10,37,64,0.1)', darkBg: 'rgba(26,58,92,0.2)' },
  Moderate:     { color: '#00796B', darkColor: '#00BFA5', bg: 'rgba(0,121,107,0.1)', darkBg: 'rgba(0,191,165,0.1)' },
  Aggressive:   { color: '#C62828', darkColor: '#EF5350', bg: 'rgba(198,40,40,0.1)', darkBg: 'rgba(239,83,80,0.1)' },
};

const ProfileCard = ({ riskProfile }) => {
  const { user } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const profile = riskProfile || user.riskProfile;
  const profileInfo = PROFILE_COLORS[profile] || PROFILE_COLORS.Moderate;

  const cardStyle = {
    background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
    border: '1px solid',
    borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '16px',
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.5)',
  };

  return (
    <div style={cardStyle}>
      {/* Avatar + Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%',
          background: isDarkMode ? '#1A3A5C' : '#0A2540',
          color: '#FFFFFF', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px', fontWeight: 700,
          border: '2px solid', borderColor: isDarkMode ? '#00BFA5' : '#00796B',
        }}>
          {user.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
              {user.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: isDarkMode ? 'rgba(46,125,50,0.2)' : 'rgba(46,125,50,0.1)', color: isDarkMode ? '#4CAF50' : '#2E7D32', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>
              <CheckCircle size={10} /> KYC Verified
            </div>
          </div>
          <p className="font-number" style={{ margin: '2px 0 0 0', fontSize: '12px', color: isDarkMode ? '#94A3B8' : '#6B7280' }}>
            {user.customerId}
          </p>
        </div>
      </div>

      {/* Details */}
      {[
        { icon: Mail, label: 'Email', value: user.email },
        { icon: Phone, label: 'Phone', value: user.phone },
        { icon: Calendar, label: 'Date of Birth', value: '14 Oct 1985' },
        { icon: User, label: 'Gender', value: 'Male' },
        { icon: Briefcase, label: 'Occupation', value: 'Software Engineer' },
        { icon: CreditCard, label: 'PAN', value: 'ABCPD****K', className: 'font-number' },
        { icon: CreditCard, label: 'Aadhaar', value: 'XXXX XXXX 4321', className: 'font-number' },
        { icon: MapPin, label: 'Branch', value: user.branch },
        { icon: User, label: 'Last Login', value: formatDate(user.lastLogin) },
      ].map(({ icon: Icon, label, value, className }) => (
        <div key={label} style={rowStyle}>
          <Icon size={16} style={{ color: isDarkMode ? '#94A3B8' : '#6B7280', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: isDarkMode ? '#94A3B8' : '#6B7280', width: '90px', flexShrink: 0 }}>
            {label}
          </span>
          <span className={className} style={{ fontSize: '13px', fontWeight: 500, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfileCard;
