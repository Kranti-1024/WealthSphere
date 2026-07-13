import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import CustomTooltip from './CustomTooltip';


const SpendingBar = () => {
  const { monthlyComparison } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);

  const gridColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textColor = isDarkMode ? '#94A3B8' : '#6B7280';

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
        Monthly Comparison
      </h3>

      <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyComparison} barGap={2} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: textColor, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={val => `₹${(val / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: textColor }}
              iconType="square"
              iconSize={8}
            />
            <Bar
              dataKey="lastMonth"
              name="Last Month"
              fill={isDarkMode ? '#1A3A5C' : '#0A2540'}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="thisMonth"
              name="This Month"
              fill={isDarkMode ? '#00BFA5' : '#00796B'}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingBar;
