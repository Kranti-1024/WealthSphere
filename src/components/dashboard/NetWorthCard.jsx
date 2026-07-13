import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import useFormatINR from '../../hooks/useFormatINR';

import { formatPercentage } from '../../utils/formatters';

const NetWorthCard = () => {
  const { user } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR } = useFormatINR();

  const monthlyChange = 12400;
  const monthlyChangePercent = 1.0;
  const isPositive = monthlyChange >= 0;

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '12px',
      padding: '32px',
      marginBottom: '24px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
      }}>
        <div>
          <p style={{
            fontSize: '14px',
            fontWeight: 600,
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            margin: '0 0 12px 0',
          }}>
            Total Net Worth
          </p>
          <h2
            className="font-number"
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-1px'
            }}
          >
            {formatINR(user.netWorth)}
          </h2>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '8px',
          background: isPositive
            ? (isDarkMode ? 'rgba(76,175,80,0.1)' : 'rgba(46,125,50,0.08)')
            : (isDarkMode ? 'rgba(239,83,80,0.1)' : 'rgba(198,40,40,0.08)'),
        }}>
          {isPositive ? (
            <TrendingUp size={20} style={{ color: isDarkMode ? '#4CAF50' : '#2E7D32' }} />
          ) : (
            <TrendingDown size={20} style={{ color: isDarkMode ? '#EF5350' : '#C62828' }} />
          )}
          <span
            className="font-number"
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: isPositive
                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                : (isDarkMode ? '#EF5350' : '#C62828'),
            }}
          >
            {isPrivacyMode ? '***' : `+₹${monthlyChange.toLocaleString('en-IN')}`}
          </span>
          <span
            className="font-number"
            style={{
              fontSize: '14px',
              color: isDarkMode ? '#94A3B8' : '#6B7280',
            }}
          >
            {isPrivacyMode ? '' : `(${formatPercentage(monthlyChangePercent)})`}
          </span>
        </div>
      </div>
      <p style={{
        fontSize: '13px',
        color: isDarkMode ? '#475569' : '#9CA3AF',
        margin: '16px 0 0 0',
      }}>
        Last updated: {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
      </p>
    </div>
  );
};

export default NetWorthCard;
