import { useData } from '../context/DataContext';
import React from 'react';

import SpendingDonutChart from '../components/SpendingDonutChart';
import ComparisonBarChart from '../components/ComparisonBarChart';
import TransactionHistory from '../components/TransactionHistory';
import FadeIn from '../components/FadeIn';

const SpendingPage = () => {
  const { spendingCategories, monthlyComparison } = useData();
  return (
    <FadeIn className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white transition-colors">Spending Analysis</h1>
        <p className="text-gray-400 mt-1">Understand your cash flow and top expenses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingDonutChart data={spendingCategories} />
        <ComparisonBarChart data={monthlyComparison} />
      </div>

      <TransactionHistory />
    </FadeIn>
  );
};

export default SpendingPage;
