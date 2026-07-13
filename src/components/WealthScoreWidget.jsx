import React from 'react';
import { ShieldCheck } from 'lucide-react';

const WealthScoreWidget = ({ score = 84 }) => {
  // Determine color based on score
  const colorClass = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  const strokeClass = score >= 80 ? 'stroke-emerald-400' : score >= 60 ? 'stroke-amber-400' : 'stroke-red-400';

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#0A111A] border border-white/5 rounded-xl p-5 h-full flex flex-col justify-between shadow-lg shadow-black/20 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-300">Wealth Health</h3>
        <ShieldCheck className={`w-5 h-5 ${colorClass}`} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative my-4">
        <svg className="w-24 h-24 transform -rotate-90">
          {/* Background Circle */}
          <circle 
            cx="48" cy="48" r="36" 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="none" 
            className="text-white/5"
          />
          {/* Progress Circle */}
          <circle 
            cx="48" cy="48" r="36" 
            stroke="currentColor" 
            strokeWidth="6" 
            fill="none" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${strokeClass} drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-number ${colorClass}`}>{score}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Status: <span className={colorClass}>Excellent</span></p>
        <p className="text-[10px] text-gray-500 leading-tight">Your portfolio diversification is within optimal parameters.</p>
      </div>
    </div>
  );
};

export default WealthScoreWidget;
