import { useData } from '../context/DataContext';
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ShieldCheck, Building2, TrendingUp, HeartPulse, CreditCard, ChevronRight, Lock, Bell, Smartphone, LogIn, FileText, CheckCircle, X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import ProfileCard from '../components/profile/ProfileCard';
import { useAPI } from '../hooks/useAPI';


const Profile = () => {
  const { user, refreshData } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { request } = useAPI();

  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [alerts, setAlerts] = useState(user?.alertsEnabled ?? true);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setTwoFactor(user.twoFactorEnabled || false);
      setAlerts(user.alertsEnabled ?? true);
    }
  }, [user]);

  const toggle2FA = async () => {
    const newValue = !twoFactor;
    setTwoFactor(newValue);
    try {
      await request('/profile/security/2fa', {
        method: 'PUT',
        body: JSON.stringify({ enabled: newValue })
      });
      toast.success(`Two-Factor Authentication ${newValue ? 'enabled' : 'disabled'}`);
      refreshData();
    } catch (err) {
      setTwoFactor(!newValue);
      toast.error('Failed to update 2FA settings');
    }
  };

  const toggleAlerts = async () => {
    const newValue = !alerts;
    setAlerts(newValue);
    try {
      await request('/profile/security/alerts', {
        method: 'PUT',
        body: JSON.stringify({ enabled: newValue })
      });
      toast.success(`Transaction alerts ${newValue ? 'enabled' : 'disabled'}`);
      refreshData();
    } catch (err) {
      setAlerts(!newValue);
      toast.error('Failed to update alert settings');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return toast.error('Please fill all fields');
    if (newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    
    setIsSubmitting(true);
    try {
      await request('/profile/security/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bgCard = isDarkMode ? '#0D1B2A' : '#FFFFFF';
  const borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textPrimary = isDarkMode ? '#F1F5F9' : '#1A1A2E';
  const textSecondary = isDarkMode ? '#94A3B8' : '#6B7280';
  const accentColor = isDarkMode ? '#00BFA5' : '#00796B';

  const sectionStyle = {
    background: bgCard,
    border: `1px solid ${borderColor}`,
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
  };

  const handleMockAction = (msg) => {
    toast.success(msg, {
      style: {
        background: isDarkMode ? '#1E3A5F' : '#FFFFFF',
        color: isDarkMode ? '#FFFFFF' : '#000000',
        border: `1px solid ${borderColor}`
      }
    });
  };

  return (
    <div>
      <Toaster position="bottom-right" />
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
          My Profile
        </h2>
        <p style={{ fontSize: '12px', color: textSecondary, margin: 0 }}>
          Manage your account settings, security, and preferences
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <ProfileCard riskProfile={user.riskProfile} />

          {/* Section 5 - Risk Profile Summary */}
          <div style={{ ...sectionStyle, marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDarkMode ? 'rgba(0,191,165,0.1)' : 'rgba(0,121,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px', color: textPrimary }}>Risk Profile</h3>
                <p style={{ fontSize: '11px', color: textSecondary, margin: 0 }}>Assessed: 15 Jun 2026</p>
              </div>
            </div>
            
            <div style={{ padding: '12px', background: isDarkMode ? '#060F1E' : '#F5F7FA', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: textSecondary }}>Current Profile</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, textTransform: 'uppercase' }}>{user.riskProfile}</span>
            </div>

            <Link to="/risk-assessment" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: accentColor, color: '#FFFFFF', textDecoration: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 500, transition: 'opacity 150ms' }} onMouseOver={e=>e.currentTarget.style.opacity=0.9} onMouseOut={e=>e.currentTarget.style.opacity=1}>
              Take Full Assessment <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Section 2 - Account Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { icon: Building2, label: 'Accounts', value: '3' },
              { icon: TrendingUp, label: 'Active SIPs', value: '3' },
              { icon: HeartPulse, label: 'Policies', value: '2' },
              { icon: FileText, label: 'CIBIL Score', value: '756' },
            ].map(stat => (
              <div key={stat.label} style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <stat.icon size={16} color={accentColor} />
                  <span style={{ fontSize: '12px', color: textSecondary }}>{stat.label}</span>
                </div>
                <span className="font-number" style={{ fontSize: '20px', fontWeight: 700, color: textPrimary }}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Section 3 - Linked Accounts & Nominations */}
          <div style={sectionStyle}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: textPrimary }}>Linked Accounts & Nominations</h3>
            
            <div style={{ border: `1px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', padding: '12px 16px', background: isDarkMode ? '#060F1E' : '#F5F7FA', fontSize: '12px', fontWeight: 600, color: textSecondary, borderBottom: `1px solid ${borderColor}` }}>
                <div>Account</div>
                <div>Nominee</div>
                <div>Status</div>
              </div>
              {[
                { acc: 'Premium Savings (...8921)', nominee: 'Anita Dhanawade (Wife)', status: 'Registered' },
                { acc: 'PPF Account (...4432)', nominee: 'Anita Dhanawade (Wife)', status: 'Registered' },
                { acc: 'Demat Account (...1199)', nominee: 'Anita Dhanawade (Wife)', status: 'Registered' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', padding: '16px', borderBottom: i < 2 ? `1px solid ${borderColor}` : 'none', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', color: textPrimary }}>{row.acc}</div>
                  <div style={{ fontSize: '13px', color: textSecondary }}>{row.nominee}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isDarkMode ? '#4CAF50' : '#2E7D32' }}>
                    <CheckCircle size={14} /> {row.status}
                  </div>
                </div>
              ))}
            </div>
            
            <button onClick={() => handleMockAction('Nominee update request initiated')} style={{ background: 'transparent', border: `1px solid ${borderColor}`, color: textPrimary, padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', transition: 'background 150ms' }} onMouseOver={e=>e.currentTarget.style.background=isDarkMode?'#1E3A5F':'#F5F7FA'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              Update Nominations
            </button>
          </div>

          {/* Section 4 - Security & Preferences */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={sectionStyle}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: textPrimary }}>Security</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={16} color={textSecondary} />
                    <div>
                      <div style={{ fontSize: '13px', color: textPrimary, fontWeight: 500 }}>Two-Factor Auth (2FA)</div>
                      <div style={{ fontSize: '11px', color: textSecondary }}>Via SMS to +91 98765*****</div>
                    </div>
                  </div>
                  <div style={{ width: '36px', height: '20px', background: twoFactor ? accentColor : (isDarkMode ? '#1E3A5F' : '#E5E7EB'), borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 200ms' }} onClick={toggle2FA}>
                    <div style={{ width: '16px', height: '16px', background: '#FFF', borderRadius: '50%', position: 'absolute', top: '2px', right: twoFactor ? '2px' : '18px', transition: 'right 200ms' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Bell size={16} color={textSecondary} />
                    <div>
                      <div style={{ fontSize: '13px', color: textPrimary, fontWeight: 500 }}>Transaction Alerts</div>
                      <div style={{ fontSize: '11px', color: textSecondary }}>Email & SMS for all debits</div>
                    </div>
                  </div>
                  <div style={{ width: '36px', height: '20px', background: alerts ? accentColor : (isDarkMode ? '#1E3A5F' : '#E5E7EB'), borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 200ms' }} onClick={toggleAlerts}>
                    <div style={{ width: '16px', height: '16px', background: '#FFF', borderRadius: '50%', position: 'absolute', top: '2px', right: alerts ? '2px' : '18px', transition: 'right 200ms' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button onClick={() => setShowPasswordModal(true)} style={{ flex: 1, background: 'transparent', border: `1px solid ${borderColor}`, color: textPrimary, padding: '8px 0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Change Password</button>
                  <button onClick={() => handleMockAction('PIN change requested')} style={{ flex: 1, background: 'transparent', border: `1px solid ${borderColor}`, color: textPrimary, padding: '8px 0', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Change PIN</button>
                </div>
              </div>
            </div>

            <div style={sectionStyle}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 16px', color: textPrimary }}>Recent Logins</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { device: 'MacBook Pro - Chrome', ip: '103.24.**.18', time: 'Today, 10:30 AM', current: true },
                  { device: 'iPhone 13 - App', ip: '117.20.**.45', time: 'Yesterday, 8:15 PM', current: false },
                  { device: 'Windows PC - Edge', ip: '103.24.**.18', time: '04 Jul, 11:20 AM', current: false },
                ].map((login, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: i < 2 ? '12px' : 0, borderBottom: i < 2 ? `1px solid ${borderColor}` : 'none' }}>
                    <div style={{ marginTop: '2px', color: login.current ? accentColor : textSecondary }}>
                      {login.device.includes('iPhone') ? <Smartphone size={16} /> : <LogIn size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', color: textPrimary, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {login.device}
                        {login.current && <span style={{ fontSize: '9px', background: isDarkMode ? 'rgba(0,191,165,0.2)' : 'rgba(0,121,107,0.1)', color: accentColor, padding: '2px 6px', borderRadius: '10px', textTransform: 'uppercase' }}>Current</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: textSecondary, marginTop: '2px' }}>
                        {login.ip} • {login.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: bgCard, border: `1px solid ${borderColor}`, borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: textPrimary }}>Change Password</h3>
              <X size={20} color={textSecondary} style={{ cursor: 'pointer' }} onClick={() => setShowPasswordModal(false)} />
            </div>
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: textSecondary, marginBottom: '6px' }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: isDarkMode ? '#060F1E' : '#F5F7FA', border: `1px solid ${borderColor}`, borderRadius: '6px', color: textPrimary, outline: 'none' }} required />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: textSecondary, marginBottom: '6px' }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: '10px', background: isDarkMode ? '#060F1E' : '#F5F7FA', border: `1px solid ${borderColor}`, borderRadius: '6px', color: textPrimary, outline: 'none' }} required />
              </div>
              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px', background: accentColor, color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
