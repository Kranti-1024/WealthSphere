import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import CustomTooltip from '../analytics/CustomTooltip';

import useFormatINR from '../../hooks/useFormatINR';

const COLORS_LIGHT = ['#0A2540', '#00796B', '#2E7D32', '#C62828', '#1A3A5C', '#6B7280', '#0D47A1', '#4E342E'];
const COLORS_DARK = ['#1A3A5C', '#00BFA5', '#4CAF50', '#EF5350', '#0D1B2A', '#94A3B8', '#42A5F5', '#8D6E63'];

const PortfolioChart = () => {
  const { portfolio } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR } = useFormatINR();
  const colors = isDarkMode ? COLORS_DARK : COLORS_LIGHT;

  // Group by type for pie chart
  const typeGroups = portfolio.reduce((acc, item) => {
    const existing = acc.find(g => g.type === item.type);
    if (existing) {
      existing.value += item.value;
    } else {
      acc.push({ type: item.type, value: item.value });
    }
    return acc;
  }, []);

  const totalValue = portfolio.reduce((s, p) => s + p.value, 0);

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
        Asset Allocation
      </h3>

      <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeGroups}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                nameKey="type"
                stroke="none"
              >
                {typeGroups.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '10px',
              color: isDarkMode ? '#94A3B8' : '#6B7280',
              margin: 0,
            }}>
              Total
            </p>
            <p className="font-number" style={{
              fontSize: '14px',
              fontWeight: 700,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              margin: 0,
            }}>
              {formatINR(totalValue)}
            </p>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '160px' }}>
          {typeGroups.map((group, index) => (
            <div key={group.type} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: index < typeGroups.length - 1
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
                  fontSize: '13px',
                  color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                }}>
                  {group.type}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="font-number" style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                }}>
                  {formatINR(group.value)}
                </span>
                <span className="font-number" style={{
                  fontSize: '11px',
                  color: isDarkMode ? '#94A3B8' : '#6B7280',
                  marginLeft: '8px',
                }}>
                  {((group.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
