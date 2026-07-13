import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { AlertTriangle, Lightbulb, TrendingDown, Landmark, Target, Bell, TrendingUp } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';


// Fallback colors for any type not mapped
const DEFAULT_LIGHT = { bg: 'rgba(0,121,107,0.08)', border: '#00796B', icon: '#00796B' };
const DEFAULT_DARK  = { bg: 'rgba(0,191,165,0.08)', border: '#00BFA5', icon: '#00BFA5' };

const typeColors = {
  warning:     { bg: 'rgba(198,40,40,0.08)',  border: '#C62828', icon: '#C62828' },
  opportunity: { bg: 'rgba(0,121,107,0.08)',  border: '#00796B', icon: '#00796B' },
  achievement: { bg: 'rgba(46,125,50,0.08)',  border: '#2E7D32', icon: '#2E7D32' },
  alert:       { bg: 'rgba(198,40,40,0.08)',  border: '#C62828', icon: '#C62828' },
  tip:         { bg: 'rgba(0,121,107,0.08)',  border: '#00796B', icon: '#00796B' },
  // types used in mockData
  saving:      { bg: 'rgba(0,121,107,0.08)',  border: '#00796B', icon: '#00796B' },
  investment:  { bg: 'rgba(10,37,64,0.08)',   border: '#0A2540', icon: '#0A2540' },
  tax:         { bg: 'rgba(46,125,50,0.08)',  border: '#2E7D32', icon: '#2E7D32' },
  goal:        { bg: 'rgba(0,121,107,0.08)',  border: '#00796B', icon: '#00796B' },
};

const typeColorsDark = {
  warning:     { bg: 'rgba(239,83,80,0.08)',  border: '#EF5350', icon: '#EF5350' },
  opportunity: { bg: 'rgba(0,191,165,0.08)', border: '#00BFA5', icon: '#00BFA5' },
  achievement: { bg: 'rgba(76,175,80,0.08)', border: '#4CAF50', icon: '#4CAF50' },
  alert:       { bg: 'rgba(239,83,80,0.08)',  border: '#EF5350', icon: '#EF5350' },
  tip:         { bg: 'rgba(0,191,165,0.08)', border: '#00BFA5', icon: '#00BFA5' },
  saving:      { bg: 'rgba(0,191,165,0.08)', border: '#00BFA5', icon: '#00BFA5' },
  investment:  { bg: 'rgba(26,58,92,0.15)',  border: '#1A3A5C', icon: '#94A3B8' },
  tax:         { bg: 'rgba(76,175,80,0.08)', border: '#4CAF50', icon: '#4CAF50' },
  goal:        { bg: 'rgba(0,191,165,0.08)', border: '#00BFA5', icon: '#00BFA5' },
};

// Emoji → lucide icon map
const iconMap = {
  '💡': Lightbulb,
  '📊': TrendingUp,
  '⚠️': AlertTriangle,
  '⚠': AlertTriangle,
  '🏦': Landmark,
  '🎯': Target,
  '📈': TrendingUp,
  '🔔': Bell,
  '✓': TrendingUp,
};

const InsightsFeed = () => {
  const { insights } = useData();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
        marginBottom: '12px',
        margin: '0 0 12px 0',
      }}>
        Proactive Insights
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {insights.map(insight => {
          const colors = (isDarkMode ? typeColorsDark : typeColors)[insight.type]
            || (isDarkMode ? DEFAULT_DARK : DEFAULT_LIGHT);
          const IconComponent = iconMap[insight.icon] || Bell;

          return (
            <div
              key={insight.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                background: colors.bg,
                borderLeft: `3px solid ${colors.border}`,
                borderRadius: '4px',
                cursor: 'default',
              }}
            >
              <IconComponent size={16} style={{ color: colors.icon, flexShrink: 0, marginTop: '2px' }} />
              <p style={{
                fontSize: '13px',
                fontWeight: 500,
                color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {insight.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsFeed;
