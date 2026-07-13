import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/formatters';

const ASSET_CLASSES = [
  { id: 'equity', name: 'Equity (Stocks/MFs)', rate: 0.12, color: 'var(--color-primary)' },
  { id: 'debt', name: 'Debt (Bonds)', rate: 0.08, color: 'var(--color-accent)' },
  { id: 'gold', name: 'Gold', rate: 0.06, color: '#F59E0B' },
  { id: 'fd', name: 'Fixed Deposits', rate: 0.065, color: 'var(--color-positive)' }
];

const PortfolioSimulator = () => {
  const [allocations, setAllocations] = useState({
    equity: 500000,
    debt: 200000,
    gold: 100000,
    fd: 200000
  });

  const [years, setYears] = useState(10);

  const handleAllocationChange = (id, value) => {
    setAllocations(prev => ({
      ...prev,
      [id]: parseInt(value) || 0
    }));
  };

  const projectionData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= years; year++) {
      const yearData = { name: `Year ${year}` };
      let totalValue = 0;
      
      ASSET_CLASSES.forEach(asset => {
        const principal = allocations[asset.id];
        const value = principal * Math.pow(1 + asset.rate, year);
        yearData[asset.id] = Math.round(value);
        totalValue += value;
      });
      
      yearData.total = Math.round(totalValue);
      data.push(yearData);
    }
    return data;
  }, [allocations, years]);

  const totalInvested = Object.values(allocations).reduce((a, b) => a + b, 0);
  const finalValue = projectionData[projectionData.length - 1]?.total || 0;

  return (
    <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 p-6 mt-8 transition-colors">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white">Portfolio Projection Simulator</h3>
        <p className="text-sm text-gray-400">Adjust your initial allocation to see how compounding affects your wealth over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-white/5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Invested</p>
            <p className="text-2xl font-bold text-gray-100 font-number">{formatINR(totalInvested)}</p>
            
            <div className="mt-4 border-t border-white/5 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Projected Value ({years} Years)</p>
              <p className="text-2xl font-bold text-(--color-positive) font-number">{formatINR(finalValue)}</p>
            </div>
          </div>

          <div className="space-y-4">
            {ASSET_CLASSES.map(asset => (
              <div key={asset.id}>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-medium text-gray-100">{asset.name}</label>
                  <span className="text-sm font-number text-gray-400">{(asset.rate * 100).toFixed(1)}% p.a.</span>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0" 
                    max="5000000" 
                    step="50000" 
                    value={allocations[asset.id]} 
                    onChange={(e) => handleAllocationChange(asset.id, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-(--color-primary)"
                  />
                  <div className="w-24 text-right text-sm font-number font-medium text-gray-100">
                    {formatINR(allocations[asset.id])}
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-100">Time Horizon (Years)</label>
                <span className="text-sm font-number font-bold text-white">{years} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1" 
                value={years} 
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-(--color-accent)"
              />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontFamily: 'IBM Plex Mono' }}
                tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-card-surface)', 
                  borderColor: 'var(--color-border)',
                  borderRadius: '0.5rem',
                  fontFamily: 'Inter',
                  color: 'var(--color-text-primary)'
                }}
                itemStyle={{ fontFamily: 'IBM Plex Mono', fontWeight: 600 }}
                formatter={(value) => [formatINR(value), 'Projected Value']}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSimulator;
