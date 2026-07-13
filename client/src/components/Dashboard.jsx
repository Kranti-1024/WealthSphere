import { useData } from '../context/DataContext';
import React from 'react';

import NetWorthCard from './NetWorthCard';
import SavingsCard from './SavingsCard';
import SpendingCard from './SpendingCard';
import TrendChart from './TrendChart';
import InsightsFeed from './InsightsFeed';
import FadeIn from './FadeIn';
import CountUp from './CountUpWrapper';
import WealthScoreWidget from './WealthScoreWidget';
import PredictiveCashflowChart from './PredictiveCashflowChart';

const Dashboard = () => {
  const { mockData } = useData();
  return (
    <div className="text-gray-100">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Terminal Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Welcome back, {mockData.user.name}. System secure. All systems nominal.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Last Sync</p>
          <p className="text-sm text-emerald-400 font-number">{new Date().toLocaleTimeString()} IST</p>
        </div>
      </div>
      
      {/* Top Section: Net Worth, Health Score, and Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-5">
        <div className="lg:col-span-1 flex flex-col gap-5">
          <FadeIn delay={100} className="flex-1">
            <NetWorthCard netWorth={mockData.netWorth} countUp={<CountUp end={mockData.netWorth} separator="," duration={2.5} />} />
          </FadeIn>
          <FadeIn delay={150} className="flex-1">
            <WealthScoreWidget score={84} />
          </FadeIn>
        </div>
        <div className="lg:col-span-3">
          <FadeIn delay={200} className="h-full">
            <TrendChart data={mockData.trendData} />
          </FadeIn>
        </div>
      </div>

      {/* Middle Section: Cashflow Prediction and Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <FadeIn delay={300} className="h-full">
            <PredictiveCashflowChart />
          </FadeIn>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-5">
          <FadeIn delay={400} className="flex-1">
            <SpendingCard spending={mockData.spending} countUp={<CountUp end={mockData.spending.total} separator="," duration={2.5} />} />
          </FadeIn>
          <FadeIn delay={450} className="flex-1">
            <SavingsCard savings={mockData.savings} />
          </FadeIn>
        </div>
      </div>

      {/* Bottom Section: Insights */}
      <div className="grid grid-cols-1 gap-5 mb-5">
        <div className="w-full">
          <FadeIn delay={500} className="h-full">
            <InsightsFeed insights={mockData.insights || []} />
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
