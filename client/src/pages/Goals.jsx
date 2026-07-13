import React from 'react';
import GoalTracker from '../components/goals/GoalTracker';
import SIPCalculator from '../components/goals/SIPCalculator';

const Goals = () => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
          Financial Goals
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Track your goals and plan your savings
        </p>
      </div>

      <GoalTracker />

      <div style={{ marginTop: '32px', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>
          SIP & EMI Planner
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Calculate returns and plan your investments
        </p>
      </div>

      <SIPCalculator />
    </div>
  );
};

export default Goals;
