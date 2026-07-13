import React from 'react';
import PortfolioChart from '../components/investments/PortfolioChart';
import HoldingsTable from '../components/investments/HoldingsTable';
import ReturnsCard from '../components/investments/ReturnsCard';

const Investments = () => {
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          margin: '0 0 4px 0',
        }}>
          Investment Portfolio
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Your complete investment overview
        </p>
      </div>

      <ReturnsCard />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        marginTop: '16px',
        marginBottom: '16px',
      }}>
        <PortfolioChart />
      </div>

      <HoldingsTable />
    </div>
  );
};

export default Investments;
