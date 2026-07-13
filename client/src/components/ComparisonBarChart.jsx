import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonBarChart = ({ data }) => {
  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-gray-100 dark:border-white/5 flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Monthly Comparison</h3>
        <p className="text-sm text-gray-400">This Month vs Last Month</p>
      </div>
      
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-card-surface)', color: 'var(--color-text-primary)' }}
              cursor={{ fill: 'var(--color-background-app)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="thisMonth" name="This Month" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="lastMonth" name="Last Month" fill="var(--color-text-secondary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonBarChart;
