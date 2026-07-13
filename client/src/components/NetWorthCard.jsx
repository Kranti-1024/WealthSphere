import React, { useContext } from 'react';
import CountUp from './CountUpWrapper';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import MaskedAmount from './MaskedAmount';
import { PrivacyContext } from '../context/PrivacyContext';

const NetWorthCard = ({ netWorth }) => {
  const isPositive = netWorth.monthlyChange >= 0;
  const { isPrivacyMode } = useContext(PrivacyContext);

  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 tracking-wide">TOTAL NET WORTH</h3>
          <h2 className="text-3xl font-bold text-white mt-1 flex items-center font-number">
            {isPrivacyMode ? (
              <span className="tracking-widest">••••••</span>
            ) : (
              <>
                <IndianRupee className="w-6 h-6 mr-1" />
                <CountUp end={netWorth.total} separator="," duration={2.5} />
              </>
            )}
          </h2>
        </div>
        <div className={`flex items-center px-2.5 py-1 rounded-full text-sm font-number font-medium ${isPositive ? 'bg-green-50/50 dark:bg-[#4CAF50]/10 text-(--color-positive)' : 'bg-red-50/50 dark:bg-[#EF5350]/10 text-(--color-negative)'}`}>
          {isPositive ? '▲' : '▼'} {Math.abs(netWorth.monthlyChange)}%
        </div>
      </div>
      <p className="text-xs text-gray-400">Compared to last month</p>
    </div>
  );
};

export default NetWorthCard;
