import React from 'react';
import NetWorthCard from '../components/dashboard/NetWorthCard';
import SummaryCards from '../components/dashboard/SummaryCards';
import InsightsFeed from '../components/dashboard/InsightsFeed';
import QuickActions from '../components/dashboard/QuickActions';
import TrendChart from '../components/analytics/TrendChart';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '100%' }}>
      <div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          Financial Overview
        </h2>
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Your 360° financial dashboard
        </p>
      </div>

      <NetWorthCard />
      <SummaryCards />
      <TrendChart />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <QuickActions />
        <InsightsFeed />
      </div>
    </div>
  );
};

export default Dashboard;
