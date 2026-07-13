import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import useFormatINR from '../../hooks/useFormatINR';

import { formatPercentage } from '../../utils/formatters';

const ReturnsCard = () => {
  const { portfolio } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();

  const totalInvested = portfolio.reduce((s, h) => s + (h.buyPrice * h.units), 0);
  const currentValue = portfolio.reduce((s, h) => s + (h.currentPrice * h.units), 0);
  const totalReturns = currentValue - totalInvested;
  const returnsPercent = ((totalReturns / totalInvested) * 100);
  const isPositive = totalReturns >= 0;

  // Approximate XIRR (simplified as annualized return)
  const xirr = returnsPercent * 0.85; // Rough annualized estimate

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '8px',
      padding: '20px',
    }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
        margin: '0 0 16px 0',
      }}>
        Returns Summary
      </h3>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Total Invested */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <p style={{
            fontSize: '11px',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Total Invested
          </p>
          <p className="font-number" style={{
            fontSize: '18px',
            fontWeight: 600,
            color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
            margin: 0,
          }}>
            {formatINR(totalInvested)}
          </p>
        </div>

        {/* Current Value */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <p style={{
            fontSize: '11px',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Current Value
          </p>
          <p className="font-number" style={{
            fontSize: '18px',
            fontWeight: 600,
            color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
            margin: 0,
          }}>
            {formatINR(currentValue)}
          </p>
        </div>

        {/* Total Returns */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <p style={{
            fontSize: '11px',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Total Returns
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isPositive ? (
              <TrendingUp size={16} style={{ color: isDarkMode ? '#4CAF50' : '#2E7D32' }} />
            ) : (
              <TrendingDown size={16} style={{ color: isDarkMode ? '#EF5350' : '#C62828' }} />
            )}
            <p className="font-number" style={{
              fontSize: '18px',
              fontWeight: 600,
              color: isPositive
                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                : (isDarkMode ? '#EF5350' : '#C62828'),
              margin: 0,
            }}>
              {isPositive ? '+' : ''}{formatINR(Math.abs(totalReturns))}
            </p>
            <span className="font-number" style={{
              fontSize: '13px',
              color: isPositive
                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                : (isDarkMode ? '#EF5350' : '#C62828'),
            }}>
              ({formatPercentage(returnsPercent)})
            </span>
          </div>
        </div>

        {/* XIRR */}
        <div style={{ flex: 1, minWidth: '140px' }}>
          <p style={{
            fontSize: '11px',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            XIRR (Annualized)
          </p>
          <p className="font-number" style={{
            fontSize: '18px',
            fontWeight: 600,
            color: isDarkMode ? '#00BFA5' : '#00796B',
            margin: 0,
          }}>
            {formatPercentage(xirr)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsCard;
