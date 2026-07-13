import { useData } from '../context/DataContext';
import React from 'react';

import InvestmentCard from '../components/InvestmentCard';
import PortfolioSimulator from '../components/PortfolioSimulator';
import FadeIn from '../components/FadeIn';
import MaskedAmount from '../components/MaskedAmount';

const InvestmentPage = () => {
  const { portfolio } = useData();
  return (
    <FadeIn className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white transition-colors">Investment Portfolio</h1>
        <p className="text-gray-400 mt-1">Detailed breakdown of your assets and returns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InvestmentCard investments={portfolio} />
        </div>
        
        <div className="lg:col-span-2 bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-white/5 bg-[#050B14]">
            <h3 className="font-semibold text-white">Asset Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#050B14]">
                  <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Asset Class</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Invested Amount</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Current Value</th>
                  <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide text-right">Returns (XIRR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-border)">
                {portfolio.map((item, idx) => (
                  <tr key={item.id} className={`transition-colors hover:bg-white/5 hover:bg-white/5 ${idx % 2 === 0 ? 'bg-[#0A111A]' : 'bg-[#0A111A]'}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-white uppercase tracking-wider">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400"><MaskedAmount amount={item.amount * 0.9} className="font-number" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white"><MaskedAmount amount={item.amount} className="font-number" /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right font-number text-(--color-positive)">+12.5%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <PortfolioSimulator />
    </FadeIn>
  );
};

export default InvestmentPage;
