import { useData } from '../../context/DataContext';
import React, { useState, useContext } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import CustomTooltip from './CustomTooltip';

import { generateForecast } from '../../utils/calculations';

const TrendChart = () => {
  const { trendData } = useData();
  const [viewMode, setViewMode] = useState('historical');
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);

  const accentColor = isDarkMode ? '#00BFA5' : '#00796B';
  const gridColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textColor = isDarkMode ? '#94A3B8' : '#6B7280';

  // Generate forecast data
  const lastNetWorth = trendData[trendData.length - 1]?.netWorth || 1248500;
  const monthlySavings = 25000;
  const forecastData = generateForecast(lastNetWorth, monthlySavings, 8, 5);

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
          margin: 0,
        }}>
          Financial Trend
        </h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['historical', 'forecast'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '4px',
                border: '1px solid',
                borderColor: viewMode === mode
                  ? accentColor
                  : (isDarkMode ? '#1E3A5F' : '#94A3B8'),
                background: viewMode === mode
                  ? `${accentColor}15`
                  : 'transparent',
                color: viewMode === mode
                  ? accentColor
                  : textColor,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 150ms',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'historical' ? (
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="month"
                tick={{ fill: textColor, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => `₹${(val / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="netWorth"
                name="Net Worth"
                stroke={accentColor}
                fill={`${accentColor}20`}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={isDarkMode ? '#4CAF50' : '#2E7D32'}
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke={isDarkMode ? '#EF5350' : '#C62828'}
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            </AreaChart>
          ) : (
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="year"
                tick={{ fill: textColor, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                tick={{ fill: textColor, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={val => val >= 10000000 ? `₹${(val / 10000000).toFixed(1)}Cr` : `₹${(val / 100000).toFixed(1)}L`}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Confidence band */}
              <Area
                type="monotone"
                dataKey="upper"
                name="Upper Bound"
                stroke="transparent"
                fill={`${accentColor}10`}
              />
              <Area
                type="monotone"
                dataKey="lower"
                name="Lower Bound"
                stroke="transparent"
                fill={isDarkMode ? '#060F1E' : '#F5F7FA'}
              />
              {/* Main forecast line - dashed */}
              <Area
                type="monotone"
                dataKey="value"
                name="Forecast"
                stroke={accentColor}
                fill={`${accentColor}15`}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {viewMode === 'forecast' && (
        <p style={{
          fontSize: '11px',
          color: textColor,
          margin: '12px 0 0 0',
          fontStyle: 'italic',
        }}>
          Based on 8% annual return, current SIP maintained
        </p>
      )}
    </div>
  );
};

export default TrendChart;
