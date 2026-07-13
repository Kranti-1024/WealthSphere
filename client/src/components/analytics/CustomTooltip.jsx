import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import useFormatINR from '../../hooks/useFormatINR';

const CustomTooltip = ({ active, payload, label, showPercentage = false }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="animate-fade-in-up"
      style={{
        background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
        border: '1px solid',
        borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
        borderRadius: '6px',
        padding: '10px 14px',
        boxShadow: isDarkMode
          ? '0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        minWidth: '140px',
      }}
    >
      {label && (
        <p style={{
          fontSize: '11px',
          fontWeight: 500,
          color: isDarkMode ? '#94A3B8' : '#6B7280',
          margin: '0 0 6px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: index < payload.length - 1 ? '4px' : 0,
        }}>
          <span style={{
            fontSize: '12px',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: entry.color || entry.stroke,
              display: 'inline-block',
            }} />
            {entry.name || entry.dataKey}
          </span>
          <span
            className="font-number"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
            }}
          >
            {showPercentage
              ? `${entry.value}%`
              : formatINR(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomTooltip;
