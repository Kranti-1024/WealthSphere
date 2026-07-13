import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const TrendChart = ({ data }) => {
  const [showForecast, setShowForecast] = useState(false);

  // Generate 5-year forecast data based on simple compound interest + monthly contribution
  const generateForecast = () => {
    const lastData = data[data.length - 1];
    const forecast = [...data];
    
    let currentIncome = lastData.income;
    let currentExpenses = lastData.expenses;
    let currentInvestment = lastData.investments;

    for (let i = 1; i <= 5; i++) {
      // Very basic 5-year simulation: 10% income growth, 6% expense growth, 12% investment compounding + 20k SIP
      currentIncome = Math.round(currentIncome * 1.10);
      currentExpenses = Math.round(currentExpenses * 1.06);
      currentInvestment = Math.round((currentInvestment + (20000 * 12)) * 1.12);

      forecast.push({
        month: `Year ${i}`,
        income: currentIncome,
        expenses: currentExpenses,
        investments: currentInvestment,
        isForecast: true
      });
    }
    return forecast;
  };

  const chartData = showForecast ? generateForecast() : data;

  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full flex flex-col transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-white text-lg">Wealth Trajectory</h3>
          <p className="text-sm text-gray-400">{showForecast ? 'Historical + 5-Year AI Forecast' : '12-Month Historical View'}</p>
        </div>
        <button 
          onClick={() => setShowForecast(!showForecast)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${showForecast ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300'}`}
        >
          {showForecast ? <TrendingUp size={16} /> : <Activity size={16} />}
          {showForecast ? 'View Historical' : 'Predict Future'}
        </button>
      </div>
      
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `₹${value / 1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-surface)', color: 'var(--color-text-primary)' }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
            />
            <Area type="monotone" dataKey="income" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="investments" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorInvestments)" strokeDasharray={showForecast ? "5 5" : "0"} />
            <Area type="monotone" dataKey="expenses" stroke="var(--color-negative)" strokeWidth={2} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
