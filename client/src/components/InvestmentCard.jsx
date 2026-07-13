import React from 'react';
import { Briefcase, IndianRupee, TrendingUp } from 'lucide-react';
import CountUp from './CountUpWrapper';
import { formatINR } from '../utils/formatters';

const InvestmentCard = ({ investments }) => {
  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-(--color-primary)/5 dark:bg-white/5 text-white rounded-lg mr-3 border border-white/5">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-gray-400 tracking-wide uppercase">Investments</h3>
            <h2 className="text-2xl font-bold text-white flex items-center font-number">
              <IndianRupee className="w-5 h-5 mr-0.5" />
              <CountUp end={investments.total} separator="," duration={2.5} />
            </h2>
            <div className="flex items-center text-[13px] font-medium text-(--color-positive) font-number mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {investments.returns}% XIRR
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto space-y-3 pt-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider pb-1 border-b border-white/5">Portfolio Breakdown</div>
        {investments.portfolio.map(item => (
          <div key={item.id} className="flex justify-between items-center text-[13px] group hover:bg-[#F5F7FA] hover:bg-white/5 rounded p-1 -mx-1 transition-colors">
            <span className="text-gray-100">{item.type}</span>
            <span className="font-number font-medium">{formatINR(item.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentCard;
