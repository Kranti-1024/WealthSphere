import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // Calculate SIP Maturity
  // M = P × ({[1 + i]^n - 1} / i) × (1 + i)
  const calculateSIP = () => {
    const P = monthlyInvestment;
    const i = expectedReturn / 12 / 100;
    const n = timePeriod * 12;

    const M = Math.round(P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvested = P * n;
    const estReturns = M - totalInvested;

    // Generate chart data
    const data = [];
    for (let year = 1; year <= timePeriod; year++) {
      const currentN = year * 12;
      const currentM = Math.round(P * ((Math.pow(1 + i, currentN) - 1) / i) * (1 + i));
      data.push({
        year: `Year ${year}`,
        Invested: P * currentN,
        Returns: currentM - (P * currentN),
        Total: currentM
      });
    }

    return { totalInvested, estReturns, totalValue: M, chartData: data };
  };

  const results = calculateSIP();

  return (
    <div className="bg-[#0A111A] p-6 md:p-8 rounded-xl shadow-lg shadow-black/20 border border-white/5 transition-colors mt-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white">SIP Calculator</h3>
        <p className="text-gray-400">Plan your wealth creation journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Controls */}
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-100">Monthly Investment</label>
              <span className="text-white font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md">
                ₹{monthlyInvestment.toLocaleString('en-IN')}
              </span>
            </div>
            <input 
              type="range" 
              min="500" max="100000" step="500" 
              value={monthlyInvestment} 
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-(--color-accent)"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-100">Expected Return Rate (p.a)</label>
              <span className="text-white font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md">
                {expectedReturn}%
              </span>
            </div>
            <input 
              type="range" 
              min="1" max="30" step="0.5" 
              value={expectedReturn} 
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-(--color-accent)"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-100">Time Period (Years)</label>
              <span className="text-white font-bold bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-md">
                {timePeriod} Yr
              </span>
            </div>
            <input 
              type="range" 
              min="1" max="40" step="1" 
              value={timePeriod} 
              onChange={(e) => setTimePeriod(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-(--color-accent)"
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl border border-white/5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Invested Amount</p>
                <p className="text-lg font-semibold text-gray-100">₹{results.totalInvested.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Est. Returns</p>
                <p className="text-lg font-semibold text-(--color-positive)">₹{results.estReturns.toLocaleString('en-IN')}</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-white/5">
                <p className="text-sm text-gray-400 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-white">₹{results.totalValue.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card-surface)', color: 'var(--color-text-primary)' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
              />
              <Area type="monotone" dataKey="Invested" stackId="1" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorInvested)" />
              <Area type="monotone" dataKey="Returns" stackId="1" stroke="var(--color-accent)" fillOpacity={1} fill="url(#colorReturns)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
