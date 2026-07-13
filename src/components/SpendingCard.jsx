import React, { useContext } from 'react';
import { CreditCard, IndianRupee } from 'lucide-react';
import CountUp from './CountUpWrapper';
import MaskedAmount from './MaskedAmount';
import { PrivacyContext } from '../context/PrivacyContext';

const SpendingCard = ({ spending }) => {
  const { isPrivacyMode } = useContext(PrivacyContext);
  // Sort categories by amount to show top spenders
  const sortedCategories = [...spending.categories].sort((a, b) => b.amount - a.amount).slice(0, 3);

  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-(--color-negative)/10 dark:bg-(--color-negative)/20 text-(--color-negative) rounded-lg border border-(--color-negative)/20">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-[13px] font-medium text-gray-400 tracking-wide uppercase">Monthly Spending</h3>
          <h2 className="text-2xl font-bold text-white flex items-center font-number">
            {isPrivacyMode ? (
              <span className="tracking-widest">••••••</span>
            ) : (
              <>
                <IndianRupee className="w-5 h-5 mr-0.5" />
                <CountUp end={spending.monthlyTotal} separator="," duration={2.5} />
              </>
            )}
          </h2>
        </div>
      </div>
      
      <div className="mt-auto space-y-3 pt-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider pb-1 border-b border-white/5">Top Categories</div>
        {sortedCategories.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center text-[13px] group hover:bg-[#F5F7FA] hover:bg-white/5 rounded p-1 -mx-1 transition-colors">
            <span className="text-gray-100">{cat.name}</span>
            <MaskedAmount amount={cat.amount} className="font-number font-medium" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingCard;
