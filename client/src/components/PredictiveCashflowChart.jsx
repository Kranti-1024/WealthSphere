import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BrainCircuit } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const PredictiveCashflowChart = () => {
  // Mock data representing historical + predicted cashflow
  const data = useMemo(() => [
    { month: 'Jan', actual: 120000, predicted: null },
    { month: 'Feb', actual: 135000, predicted: null },
    { month: 'Mar', actual: 128000, predicted: null },
    { month: 'Apr', actual: 142000, predicted: null },
    { month: 'May', actual: 155000, predicted: 155000 }, // Connection point
    { month: 'Jun', actual: null, predicted: 168000 },
    { month: 'Jul', actual: null, predicted: 172000 },
    { month: 'Aug', actual: null, predicted: 165000 },
  ], []);

  return (
    <div className="bg-[#0A111A] border border-white/5 rounded-xl p-6 h-full flex flex-col shadow-lg shadow-black/20 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
            <BrainCircuit size={16} className="text-emerald-400" />
            AI Cashflow Projection
          </h3>
          <p className="text-xs text-gray-500 mt-1">Predictive analysis based on your recent spending and income patterns.</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-medium tracking-wider uppercase text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Historical
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500/30 border border-emerald-500 border-dashed"></div> Projected
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#050B14', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px'
              }}
              itemStyle={{ fontFamily: 'IBM Plex Mono', fontWeight: 600 }}
              formatter={(value, name) => [formatINR(value), name === 'actual' ? 'Historical' : 'Projected']}
            />
            
            <ReferenceLine x="May" stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#64748B', fontSize: 10 }} />

            <Area 
              type="monotone" 
              dataKey="actual" 
              stroke="#10B981" 
              strokeWidth={3}
              fill="url(#colorActual)" 
              activeDot={{ r: 6, fill: '#10B981', stroke: '#050B14', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="predicted" 
              stroke="#10B981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorPredicted)" 
              activeDot={{ r: 6, fill: '#050B14', stroke: '#10B981', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictiveCashflowChart;
