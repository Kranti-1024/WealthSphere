import React from 'react';
import SpendingDonut from '../components/analytics/SpendingDonut';
import SpendingBar from '../components/analytics/SpendingBar';
import TransactionHistory from '../components/shared/TransactionHistory';

const Spending = () => {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          margin: '0 0 4px 0',
        }}>
          Spending Analysis
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Track and analyze your spending patterns
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px',
      }}>
        <SpendingDonut />
        <SpendingBar />
      </div>

      <TransactionHistory />
    </div>
  );
};

export default Spending;
