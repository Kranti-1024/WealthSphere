import { useData } from '../context/DataContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Shield, ShieldAlert, ShieldCheck, Scale, Rocket, Clock, TrendingDown, Coins, Briefcase, Sparkles, Target, BarChart2 } from 'lucide-react';

const assessmentQuestions = [
  {
    id: 1,
    text: "What is your primary financial goal?",
    options: [
      { id: '1a', type: 'Conservative', title: 'Capital Safety', desc: 'Preserve my wealth with minimal risk', icon: Shield, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
      { id: '1b', type: 'Moderate', title: 'Steady Growth', desc: 'Balance between risk and returns', icon: Scale, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
      { id: '1c', type: 'Aggressive', title: 'High Returns', desc: 'Maximize growth, willing to take risks', icon: Rocket, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' }
    ]
  },
  {
    id: 2,
    text: "What is your investment horizon?",
    options: [
      { id: '2a', type: 'Conservative', title: 'Less than 1 year', desc: 'Need access to funds very soon', icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
      { id: '2b', type: 'Conservative', title: '1–3 years', desc: 'Short-term goals', icon: Clock, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
      { id: '2c', type: 'Moderate', title: '3–7 years', desc: 'Medium-term goals', icon: Clock, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
      { id: '2d', type: 'Aggressive', title: '7+ years', desc: 'Long-term wealth creation', icon: Clock, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' }
    ]
  },
  {
    id: 3,
    text: "How would you react to a 20% drop in your portfolio?",
    options: [
      { id: '3a', type: 'Conservative', title: 'Sell immediately', desc: 'Cut losses to prevent further drop', icon: TrendingDown, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
      { id: '3b', type: 'Moderate', title: 'Hold and wait', desc: 'Give it time to recover', icon: ShieldCheck, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
      { id: '3c', type: 'Aggressive', title: 'Buy more', desc: 'Take advantage of lower prices', icon: Target, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' }
    ]
  },
  {
    id: 4,
    text: "What percentage of your income can you invest monthly?",
    options: [
      { id: '4a', type: 'Conservative', title: 'Less than 10%', desc: 'Building up slowly', icon: Coins, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' },
      { id: '4b', type: 'Moderate', title: '10–20%', desc: 'Standard savings rate', icon: Coins, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
      { id: '4c', type: 'Aggressive', title: '20–30%', desc: 'Aggressive savings rate', icon: Coins, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' },
      { id: '4d', type: 'Aggressive', title: '30% or more', desc: 'Maximum wealth accumulation', icon: Coins, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' }
    ]
  },
  {
    id: 5,
    text: "Do you have a 6-month emergency fund?",
    options: [
      { id: '5a', type: 'Aggressive', title: 'Yes, fully funded', desc: 'Protected against emergencies', icon: Briefcase, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', border: 'border-orange-200 dark:border-orange-800' },
      { id: '5b', type: 'Moderate', title: 'Partially funded', desc: 'Still building it up', icon: Briefcase, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/40', border: 'border-green-200 dark:border-green-800' },
      { id: '5c', type: 'Conservative', title: 'Not yet', desc: 'No emergency buffer', icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800' }
    ]
  }
];

const profiles = {
  Conservative: { icon: Shield, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', desc: 'Focus on capital preservation and steady income.', bestFor: 'Retirees, short-term goals', instruments: 'FDs, Debt Funds, Gold', return: '6-8% p.a.' },
  Moderate: { icon: ShieldCheck, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', desc: 'Balance between risk and reward.', bestFor: 'Medium-term goals, balanced growth', instruments: 'Index Funds, Balanced MFs', return: '10-12% p.a.' },
  Aggressive: { icon: ShieldAlert, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', desc: 'Maximize returns, willing to tolerate volatility.', bestFor: 'Long-term goals, young investors', instruments: 'Direct Equity, Small-cap MFs', return: '15%+ p.a.' }
};

const RiskAssessment = () => {
  const { user } = useData();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currentProfile = user.riskProfile || null;

  const handleNext = () => {
    if (currentIdx === assessmentQuestions.length - 1) {
      let conservative = 0;
      let moderate = 0;
      let aggressive = 0;
      
      Object.values(answers).forEach(optId => {
        for (const q of assessmentQuestions) {
          const opt = q.options.find(o => o.id === optId);
          if (opt) {
            if (opt.type === 'Conservative') conservative++;
            if (opt.type === 'Moderate') moderate++;
            if (opt.type === 'Aggressive') aggressive++;
          }
        }
      });
      
      let finalProfile = 'Conservative';
      if (aggressive >= 3) {
        finalProfile = 'Aggressive';
      } else if (moderate >= 2 && aggressive < 3) {
        finalProfile = 'Moderate';
      }
      
      user.riskProfile = finalProfile;
      setSubmitted(true);
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const q = assessmentQuestions[currentIdx];
  const hasAnsweredCurrent = !!answers[currentIdx];
  const isLastQuestion = currentIdx === assessmentQuestions.length - 1;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] -m-4 md:-m-8 bg-white dark:bg-(--color-background-app) transition-colors duration-200">
      {/* Left Panel: Quiz Engine */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-xl mx-auto h-full flex flex-col">
          {submitted ? (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="flex justify-between text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wider">
                <span>Assessment Complete</span>
                <span>100% Completed</span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-sm mb-6 w-full">
                <div className="h-full bg-(--color-accent) rounded-sm w-full transition-all duration-500" />
              </div>

              <h2 className="text-[1.15rem] font-medium text-gray-100 mb-6">
                Your profile: {mockData.user.riskProfile}
              </h2>

              <div className="border-[0.5px] border-white/5 rounded-xl p-6 bg-white dark:bg-gray-900/50 flex flex-col gap-4 shadow-lg shadow-black/20">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${profiles[mockData.user.riskProfile].bg} ${profiles[mockData.user.riskProfile].color}`}>
                    {React.createElement(profiles[mockData.user.riskProfile].icon, { size: 28 })}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-100 mb-1">{mockData.user.riskProfile} Investor</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profiles[mockData.user.riskProfile].desc}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-8 py-3 bg-(--color-primary) hover:bg-[#113860] dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Go to Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full animate-slide-in-right">
              <div className="flex justify-between text-xs uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wider">
                <span>Question {currentIdx + 1} of 5</span>
                <span>{Math.round((currentIdx / 5) * 100)}% Completed</span>
              </div>
              <div className="h-1 bg-gray-200 dark:bg-gray-850 rounded-sm mb-8 w-full">
                <div 
                  className="h-full bg-(--color-accent) rounded-sm transition-all duration-500 ease-out"
                  style={{ width: `${(currentIdx / 5) * 100}%` }}
                />
              </div>

              <h2 className="text-[1.15rem] font-medium text-gray-100 mb-6 leading-snug">
                {q.text}
              </h2>

              <div className="space-y-3 mb-8 flex-1">
                {q.options.map(opt => {
                  const isSelected = answers[currentIdx] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setAnswers({...answers, [currentIdx]: opt.id})}
                      className={`w-full text-left rounded-xl p-3.5 flex items-center gap-4 border-[0.5px] transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'border-(--color-accent) bg-teal-50/50 dark:bg-teal-900/20' 
                          : 'border-white/5 hover:border-(--color-accent) hover:bg-teal-50/30 dark:hover:bg-teal-900/10'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${opt.bg} ${opt.color}`}>
                        {React.createElement(opt.icon, { size: 18 })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.925rem] font-medium text-gray-100 mb-0.5">{opt.title}</div>
                        <div className="text-[0.8rem] text-gray-500 dark:text-gray-400 truncate">{opt.desc}</div>
                      </div>
                      
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-(--color-accent)' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-(--color-accent)" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-gray-800/50">
                <button 
                  onClick={handleBack}
                  disabled={currentIdx === 0}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!hasAnsweredCurrent}
                  className="flex-1 sm:flex-none sm:w-32 px-6 py-2.5 rounded-lg text-sm font-medium bg-(--color-primary) hover:bg-[#113860] dark:bg-blue-600 dark:hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-auto"
                >
                  {isLastQuestion && hasAnsweredCurrent ? 'Submit ✓' : 'Next'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right Panel: Context Sidebar */}
      <div className="w-full lg:w-[320px] shrink-0 bg-gray-50 dark:bg-[#0A1628] border-l-[0.5px] border-white/5 p-6 lg:p-8 overflow-y-auto hide-scrollbar">
        
        {/* Section 1: Current Profile Badge */}
        <div className="mb-10">
          <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider font-semibold">
            Your current profile
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-gray-900/50 p-3 rounded-lg border-[0.5px] border-white/5 shadow-lg shadow-black/20">
            <div className={`w-3 h-3 rounded-full shrink-0 ${
              submitted || currentProfile 
                ? profiles[mockData.user.riskProfile || currentProfile]?.color.replace('text', 'bg').split(' ')[0]
                : 'bg-gray-300 dark:bg-gray-700'
            }`} />
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-100 truncate">
                {submitted || currentProfile ? (mockData.user.riskProfile || currentProfile) : 'Not assessed yet'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {submitted || currentProfile ? 'Active profile' : 'Take the quiz to find out'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Progress Dots */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {[0, 1, 2, 3, 4].map((step) => {
              let state = 'upcoming';
              if (step === currentIdx && !submitted) state = 'active';
              else if (step < currentIdx || submitted) state = 'done';
              
              let circleClass = 'border-2 border-gray-200 dark:border-gray-700 text-gray-455 dark:text-gray-500 bg-white dark:bg-gray-900/50';
              if (state === 'active') circleClass = 'bg-(--color-primary) dark:bg-blue-600 text-white border-transparent shadow-lg shadow-black/20';
              if (state === 'done') circleClass = 'bg-(--color-accent) text-white border-transparent shadow-lg shadow-black/20';

              return (
                <React.Fragment key={step}>
                  <button 
                    disabled={submitted || step > currentIdx}
                    onClick={() => setCurrentIdx(step)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${circleClass} ${!submitted && step <= currentIdx ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-80'}`}
                  >
                    {step + 1}
                  </button>
                  {step < 4 && (
                    <div className="flex-1 h-[2px] mx-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-500 ${step < currentIdx || submitted ? 'bg-(--color-accent) w-full' : 'w-0'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Section 3: Risk Profiles Explained */}
        <div className="mb-10">
          <div className="text-[11px] uppercase text-gray-550 dark:text-gray-400 mb-3 tracking-wider font-semibold">
            Risk Profiles Explained
          </div>
          <div className="space-y-3">
            {Object.entries(profiles).map(([name, p]) => {
              const isCurrent = (submitted || currentProfile) && (mockData.user.riskProfile || currentProfile) === name;
              const emoji = name === 'Conservative' ? '🛡️' : name === 'Moderate' ? '⚖️' : '🚀';
              return (
                <div key={name} className={`p-4 rounded-xl border-[0.5px] transition-all duration-300 ${
                  isCurrent 
                    ? 'border-(--color-accent) bg-white dark:bg-gray-900 shadow-lg shadow-black/20 ring-1 ring-(--color-accent)/10' 
                    : 'border-gray-200 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/20'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{emoji}</div>
                      <div className="text-sm font-semibold text-gray-100">{name}</div>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase rounded-full tracking-wider animate-zoom-in">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-[0.8rem]">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 dark:text-gray-400 shrink-0">Best for</span>
                      <span className="text-gray-900 dark:text-gray-300 font-medium text-right ml-2 leading-tight">{p.bestFor}</span>
                    </div>
                    <div className="flex justify-between items-start pt-0.5">
                      <span className="text-gray-500 dark:text-gray-400 shrink-0">Instruments</span>
                      <span className="text-gray-900 dark:text-gray-300 font-medium text-right ml-2 leading-tight">{p.instruments}</span>
                    </div>
                    <div className="flex justify-between items-start pt-0.5">
                      <span className="text-gray-500 dark:text-gray-400 shrink-0">Target Return</span>
                      <span className="text-gray-900 dark:text-gray-300 font-medium leading-tight">{p.return}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: After Assessment */}
        <div>
          <div className="text-[11px] uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider font-semibold">
            After Assessment
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="text-[0.8rem] font-bold text-gray-100">AI advisor personalised</div>
                <div className="text-[0.8rem] text-gray-500 dark:text-gray-400">Get tailored market insights</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <BarChart2 size={14} />
              </div>
              <div>
                <div className="text-[0.8rem] font-bold text-gray-100">Portfolio recommendations</div>
                <div className="text-[0.8rem] text-gray-500 dark:text-gray-400">Assets matched to your risk level</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Target size={14} />
              </div>
              <div>
                <div className="text-[0.8rem] font-bold text-gray-100">Goal strategies updated</div>
                <div className="text-[0.8rem] text-gray-500 dark:text-gray-400">Realistic timelines & milestones</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiskAssessment;
