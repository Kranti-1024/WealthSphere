import React, { useContext, useState } from 'react';
import { ArrowRightLeft, Receipt, Landmark, TrendingUp, Link as LinkIcon, Building, CheckCircle2, X, Loader2 } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useAPI } from '../../hooks/useAPI';
import toast from 'react-hot-toast';

const actions = [
  { label: 'Transfer', icon: ArrowRightLeft, color: '#00796B', id: 'transfer' },
  { label: 'Link Bank', icon: LinkIcon, color: '#0A2540', id: 'link_bank' },
  { label: 'View FD', icon: Landmark, color: '#2E7D32', id: 'view_fd' },
  { label: 'Book SIP', icon: TrendingUp, color: '#1A3A5C', id: 'book_sip' },
];

const banks = ['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'];

const QuickActions = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { refreshData } = useData();
  const { request } = useAPI();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(banks[0]);
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const handleActionClick = (id) => {
    if (id === 'link_bank') {
      setIsModalOpen(true);
      setLinkSuccess(false);
      setIsLinking(false);
    } else {
      toast('Feature coming soon in full version!', { icon: '🚀' });
    }
  };

  const handleLinkBank = async () => {
    setIsLinking(true);
    
    // Simulate Account Aggregator OTP / Consent flow delay
    setTimeout(async () => {
      try {
        const response = await request('/portfolio/link-external', { 
          method: 'POST', 
          body: JSON.stringify({ bankName: selectedBank }) 
        });
        if (response.account) {
          setLinkSuccess(true);
          refreshData(); // Refresh global context to update net worth and accounts
          toast.success(`Successfully linked ${selectedBank}!`);
          setTimeout(() => setIsModalOpen(false), 2000);
        } else {
          toast.error(response.error || 'Failed to link account');
          setIsLinking(false);
        }
      } catch (err) {
        toast.error('Network error while linking');
        setIsLinking(false);
      }
    }, 2000); // 2 second fake delay
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
        marginBottom: '12px',
      }}>
        Quick Actions
      </h3>
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
                borderRadius: '6px',
                color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = isDarkMode ? '#00BFA5' : '#00796B';
                e.currentTarget.style.background = isDarkMode ? 'rgba(0,191,165,0.05)' : 'rgba(0,121,107,0.03)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
                e.currentTarget.style.background = isDarkMode ? '#0D1B2A' : '#FFFFFF';
              }}
            >
              <Icon size={16} style={{ color: isDarkMode ? '#00BFA5' : action.color }} />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Account Aggregator Link Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: isDarkMode ? '#060F1E' : '#FFFFFF',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: `1px solid ${isDarkMode ? '#1E3A5F' : '#E5E7EB'}`,
            position: 'relative',
          }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,191,165,0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                color: 'var(--accent)'
              }}>
                <Building size={28} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 8px 0' }}>Link External Bank</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>
                Securely connect via Account Aggregator to sync balances and transactions.
              </p>
            </div>

            {linkSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color="var(--positive)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>Account Linked!</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Your net worth has been updated.</p>
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Select Bank
                </label>
                <select 
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkMode ? '#1E3A5F' : '#E5E7EB'}`,
                    background: isDarkMode ? '#0D1B2A' : '#F9FAFB',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none',
                    marginBottom: '24px'
                  }}
                >
                  {banks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <button
                  onClick={handleLinkBank}
                  disabled={isLinking}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: isLinking ? 'var(--text-secondary)' : 'var(--primary)',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isLinking ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isLinking ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Connect Account'
                  )}
                </button>
                <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '16px' }}>
                  By proceeding, you consent to sharing financial data via RBI regulated Account Aggregator.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;
