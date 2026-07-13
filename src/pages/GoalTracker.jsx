import { useData } from '../context/DataContext';
import React from 'react';
import { Target, CheckCircle2, Plus, ArrowRight, Lightbulb, Wallet } from 'lucide-react';

import SIPCalculator from '../components/SIPCalculator';
import FadeIn from '../components/FadeIn';
import CountUp from '../components/CountUpWrapper';
import MaskedAmount from '../components/MaskedAmount';
import { toast } from 'react-hot-toast';

const GoalTracker = () => {
  const { goals } = useData();
  return (
    <FadeIn className="p-4 md:p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white transition-colors">Financial Goals</h1>
        <p className="text-gray-400 mt-1">Track and manage your future milestones.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Content Area */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {goals.map(goal => {
          const progress = Math.min((goal.current / goal.target) * 100, 100).toFixed(1);
          return (
            <div key={goal.id} className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-(--color-accent)/10 text-(--color-accent) rounded-lg border border-(--color-accent)/20">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{goal.name}</h3>
                    <p className="text-[13px] text-gray-400 mt-0.5">Target: <MaskedAmount amount={goal.target} className="font-number" /></p>
                  </div>
                </div>
                {progress === "100.0" && (
                  <CheckCircle2 className="w-6 h-6 text-(--color-positive)" />
                )}
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between text-[13px] mb-2 font-number">
                  <MaskedAmount amount={goal.current} className="font-semibold text-white" />
                  <span className="text-gray-400">of <MaskedAmount amount={goal.target} /></span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-[#060F1E] rounded-full h-2 border border-white/5">
                  <div 
                    className="bg-(--color-accent) h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-right text-xs font-bold text-(--color-accent) font-number">
                  {progress}% Achieved
                </div>
              </div>
            </div>
          );
        })}
      </div>

          {/* SIP Planner Section */}
          <SIPCalculator />
        </div>

        {/* Right Side Widgets */}
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          {/* Quick Add Funds Widget */}
          <FadeIn delay={200}>
            <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-blue-600" />
                Quick Add Funds
              </h2>
              <p className="text-sm text-gray-400 mb-4">Accelerate your goals by making a quick top-up.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Select Goal</label>
                  <select className="w-full p-2.5 bg-gray-50 dark:bg-[#0A1628] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm">
                    {mockData.goals.map(g => <option key={g.id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                  <input type="number" placeholder="e.g. 50000" className="w-full p-2.5 bg-gray-50 dark:bg-[#0A1628] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <button 
                  onClick={() => toast.success('Funds successfully added to your goal!')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Top Up Now
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Goal Insights Widget */}
          <FadeIn delay={300}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
                Smart Insights
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    You are on track to achieve your <strong>Emergency Fund</strong> goal 3 months ahead of schedule.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Consider increasing your SIP by 10% next year to beat inflation.
                  </p>
                </li>
              </ul>
              <button onClick={() => window.location.href='/advisor'} className="mt-6 text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1 hover:gap-2 transition-all">
                Speak to an Advisor <ArrowRight size={16} />
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
};

export default GoalTracker;
