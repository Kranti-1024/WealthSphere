import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import CustomTooltip from './CustomTooltip';

import useFormatINR from '../../hooks/useFormatINR';

const COLORS_LIGHT = ['#0A2540', '#00796B', '#2E7D32', '#C62828', '#1A3A5C', '#6B7280'];
const COLORS_DARK = ['#1A3A5C', '#00BFA5', '#4CAF50', '#EF5350', '#0D1B2A', '#94A3B8'];

const SpendingDonut = () => {
  const { spendingCategories } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR } = useFormatINR();
  const colors = isDarkMode ? COLORS_DARK : COLORS_LIGHT;
  const total = spendingCategories.reduce((s, c) => s + c.amount, 0);

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
        Spending Breakdown
      </h3>

      <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ width: '180px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={spendingCategories}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="amount"
                nameKey="category"
                stroke="none"
              >
                {spendingCategories.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, minWidth: '160px' }}>
          {spendingCategories.map((cat, index) => (
            <div key={cat.category} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: index < spendingCategories.length - 1
                ? `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.5)'}`
                : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  background: colors[index % colors.length],
                  display: 'inline-block',
                }} />
                <span style={{
                  fontSize: '12px',
                  color: isDarkMode ? '#94A3B8' : '#6B7280',
                }}>
                  {cat.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="font-number" style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                }}>
                  {formatINR(cat.amount)}
                </span>
                <span className="font-number" style={{
                  fontSize: '11px',
                  color: isDarkMode ? '#94A3B8' : '#6B7280',
                }}>
                  {cat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingDonut;
