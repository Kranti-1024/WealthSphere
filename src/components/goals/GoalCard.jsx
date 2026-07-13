import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import useFormatINR from '../../hooks/useFormatINR';
import { formatDate } from '../../utils/formatters';

const GoalCard = ({ goal }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const remaining = goal.target - goal.current;

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '8px',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>{goal.icon}</span>
        <div>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
            {goal.name}
          </h4>
          <p style={{ margin: 0, fontSize: '11px', color: isDarkMode ? '#94A3B8' : '#6B7280' }}>
            Target: {formatDate(goal.deadline)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{
          height: '6px',
          background: isDarkMode ? '#1E3A5F' : '#94A3B8',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '6px',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: progress >= 100
              ? (isDarkMode ? '#4CAF50' : '#2E7D32')
              : (isDarkMode ? '#00BFA5' : '#00796B'),
            borderRadius: '3px',
            transition: 'width 600ms ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-number" style={{ fontSize: '12px', fontWeight: 600, color: isDarkMode ? '#00BFA5' : '#00796B' }}>
            {progress.toFixed(1)}%
          </span>
          <span className="font-number" style={{ fontSize: '11px', color: isDarkMode ? '#94A3B8' : '#6B7280' }}>
            {formatINR(goal.current)} / {formatINR(goal.target)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: '10px', color: isDarkMode ? '#94A3B8' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Remaining
          </p>
          <p className="font-number" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
            {formatINR(remaining)}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '10px', color: isDarkMode ? '#94A3B8' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Monthly Needed
          </p>
          <p className="font-number" style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#00BFA5' : '#00796B' }}>
            {formatINR(goal.monthlyRequired)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
