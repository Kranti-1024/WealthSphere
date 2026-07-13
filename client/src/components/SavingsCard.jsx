import React, { useContext } from 'react';
import { PiggyBank, IndianRupee } from 'lucide-react';
import CountUp from './CountUpWrapper';
import MaskedAmount from './MaskedAmount';
import { PrivacyContext } from '../context/PrivacyContext';

const SavingsCard = ({ savings }) => {
  const { isPrivacyMode } = useContext(PrivacyContext);
  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-[#0A2540]/5 dark:bg-white/5 text-white rounded-lg mr-3 border border-white/5">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[13px] font-medium text-gray-400 tracking-wide">TOTAL SAVINGS</h3>
            <h2 className="text-2xl font-bold text-white flex items-center font-number">
              {isPrivacyMode ? (
                <span className="tracking-widest">••••••</span>
              ) : (
                <>
                  <IndianRupee className="w-5 h-5 mr-0.5" />
                  <CountUp end={savings.total} separator="," duration={2.5} />
                </>
              )}
            </h2>
          </div>
        </div>
      </div>
      
      <div className="mt-auto space-y-3 pt-2">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider pb-1 border-b border-white/5">Accounts</div>
        {savings.accounts.map(acc => (
          <div key={acc.id} className="flex justify-between items-center text-[13px] group hover:bg-[#F5F7FA] hover:bg-white/5 rounded p-1 -mx-1 transition-colors">
            <span className="text-gray-100">{acc.type}</span>
            <MaskedAmount amount={acc.balance} className="font-number font-medium" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsCard;
