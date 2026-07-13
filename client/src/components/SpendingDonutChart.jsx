import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-positive)', '#F59E0B', 'var(--color-negative)'];

const SpendingDonutChart = ({ data }) => {
  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-gray-100 dark:border-white/5 flex flex-col h-full transition-colors duration-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Spending Breakdown</h3>
        <p className="text-sm text-gray-400">Current Month Categories</p>
      </div>
      
      <div className="flex-1 min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="amount"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--color-card-surface)', color: 'var(--color-text-primary)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Total Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-sm text-gray-400">Total</span>
          <span className="text-xl font-bold text-white">
            ₹{data.reduce((sum, item) => sum + item.amount, 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpendingDonutChart;
