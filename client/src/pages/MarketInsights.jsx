import React from 'react';
import FadeIn from '../components/FadeIn';
import { TrendingUp, TrendingDown, Newspaper, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MarketInsights = () => {
  const indices = [
    { name: 'NIFTY 50', value: '22,450.10', change: '+1.2%', isPositive: true },
    { name: 'SENSEX', value: '74,119.39', change: '+1.1%', isPositive: true },
    { name: 'BANK NIFTY', value: '47,212.00', change: '-0.3%', isPositive: false }
  ];

  const news = [
    { id: 1, title: 'RBI keeps repo rate unchanged at 6.5%', source: 'Financial Times', time: '2 hours ago', category: 'Economy' },
    { id: 2, title: 'Tech sector Q3 earnings exceed expectations', source: 'Mint', time: '4 hours ago', category: 'Markets' },
    { id: 3, title: 'Gold prices hit all-time high amid global uncertainty', source: 'Economic Times', time: '5 hours ago', category: 'Commodities' },
    { id: 4, title: 'New tax regulations for mutual funds explained', source: 'Moneycontrol', time: '1 day ago', category: 'Personal Finance' }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white transition-colors">Market Insights</h1>
        <p className="text-gray-400 mt-1">Stay updated with the latest market trends and financial news.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {indices.map((index, idx) => (
          <FadeIn key={idx} delay={100 * (idx + 1)}>
            <div className="bg-[#0A111A] p-5 rounded-xl shadow-lg shadow-black/20 border border-white/5">
              <h3 className="text-sm font-medium text-gray-400">{index.name}</h3>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-2xl font-bold text-gray-100 font-number">{index.value}</span>
                <div className={`flex items-center text-sm font-medium ${index.isPositive ? 'text-(--color-positive)' : 'text-(--color-negative)'}`}>
                  {index.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                  {index.change}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={400}>
        <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Newspaper size={20} className="text-(--color-accent)" />
              Top Financial News
            </h2>
          </div>
          <div className="divide-y divide-(--color-border)">
            {news.map((item) => (
              <div 
                key={item.id} 
                className="p-6 hover:bg-gray-50 hover:bg-white/5/50 transition-colors cursor-pointer group"
                onClick={() => toast.success('Opening article view...')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 rounded uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.time} • {item.source}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-base font-semibold text-gray-100 group-hover:text-blue-600 dark:group-hover:text-[#00BFA5] transition-colors">
                    {item.title}
                  </h3>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-650 dark:group-hover:text-[#00BFA5] transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default MarketInsights;
