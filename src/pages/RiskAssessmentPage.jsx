import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  Brain, ShieldAlert, Activity, Target, 
  ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, Zap
} from 'lucide-react';
import { useAPI } from '../hooks/useAPI';

const TEST_CONFIGS = [
  {
    id: 'risk',
    title: 'Behavioral Risk Profiling',
    description: 'Discover your true psychological risk tolerance and investment style.',
    icon: Brain,
    color: 'text-indigo-500 bg-indigo-500/10',
    questions: [
      { id: 'q1', question: 'How do you feel when your portfolio drops 10% in a month?', options: ['Panicked, I want to sell', 'Nervous, but I hold', 'Excited, I buy more'] },
      { id: 'q2', question: 'What is your primary investment goal?', options: ['Capital Preservation', 'Steady Income', 'Maximum Growth'] },
      { id: 'q3', question: 'How long until you need to withdraw a significant portion of your investments?', options: ['Less than 3 years', '3 to 7 years', 'More than 7 years'] },
      { id: 'q4', question: 'If offered a guaranteed 5% return vs a 50/50 chance of 15% or -5%, which do you choose?', options: ['Guaranteed 5%', 'Wait for a better option', 'Take the 50/50 chance'] }
    ]
  },
  {
    id: 'resilience',
    title: 'Market Crash Resilience',
    description: 'Stress-test how you and your portfolio handle severe macro shocks.',
    icon: ShieldAlert,
    color: 'text-rose-500 bg-rose-500/10',
    questions: [
      { id: 'q1', question: 'During the 2020 COVID crash, what action did you take?', options: ['Sold everything', 'Did nothing', 'Bought the dip', 'Was not investing then'] },
      { id: 'q2', question: 'Do you have an emergency fund?', options: ['No', 'Yes, 3 months', 'Yes, 6+ months'] },
      { id: 'q3', question: 'If interest rates hike by 2%, how does your debt react?', options: ['Devastating (mostly floating rate)', 'Manageable', 'I have no debt'] },
      { id: 'q4', question: 'Would you use leverage/margin to recover losses faster?', options: ['Never', 'Only slightly', 'Yes, aggressively'] }
    ]
  },
  {
    id: 'retirement',
    title: 'Retirement Readiness',
    description: 'Analyze your long-term trajectory, longevity risk, and inflation impact.',
    icon: Target,
    color: 'text-emerald-500 bg-emerald-500/10',
    questions: [
      { id: 'q1', question: 'What is your target retirement age?', options: ['Before 50', 'Around 60', '65 or older'] },
      { id: 'q2', question: 'What percentage of your current income are you saving?', options: ['Less than 10%', '10% - 20%', 'More than 20%'] },
      { id: 'q3', question: 'Do you expect your living expenses to drop in retirement?', options: ['Yes, significantly', 'Remain about the same', 'No, they will increase (healthcare/travel)'] },
      { id: 'q4', question: 'Have you factored inflation into your retirement corpus target?', options: ['No', 'Yes, roughly', 'Yes, precisely modeled'] }
    ]
  }
];

export default function RiskAssessmentPage() {
  const { isDarkMode } = useContext(ThemeContext);
  const { request } = useAPI();
  
  // View states: 'hub', 'questionnaire', 'dashboard'
  const [view, setView] = useState('hub');
  
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [dashboardData, setDashboardData] = useState({}); // mapped by testId

  const startTest = (testId) => {
    setSelectedTest(TEST_CONFIGS.find(t => t.id === testId));
    setAnswers({});
    setCurrentStep(0);
    setView('questionnaire');
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const nextStep = () => {
    if (currentStep < selectedTest.questions.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const answersArray = selectedTest.questions.map(q => ({
        question: q.question,
        answer: answers[q.id]
      }));
      
      const aiResponse = await request(`/profile/analyze/${selectedTest.id}`, {
        method: 'POST',
        body: JSON.stringify({ answers: answersArray })
      });
      
      setDashboardData(prev => ({
        ...prev,
        [selectedTest.id]: aiResponse
      }));
      
      setView('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render Helpers ----------------

  const renderHub = () => (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">AI Assessment Hub</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Comprehensive AI-driven testing to optimize your financial resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEST_CONFIGS.map(test => {
          const isCompleted = !!dashboardData[test.id];
          const Icon = test.icon;
          return (
            <div 
              key={test.id}
              className="p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${test.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {isCompleted ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      Pending
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{test.title}</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  {test.description}
                </p>
              </div>
              <button
                onClick={() => {
                  if (isCompleted) {
                    setSelectedTest(test);
                    setView('dashboard');
                  } else {
                    startTest(test.id);
                  }
                }}
                className="w-full py-2.5 rounded-lg font-bold text-sm transition-colors border"
                style={{ 
                  backgroundColor: isCompleted ? 'var(--bg-body)' : 'var(--accent-color)', 
                  color: isCompleted ? 'var(--text-primary)' : 'white',
                  borderColor: isCompleted ? 'var(--border-color)' : 'transparent'
                }}
              >
                {isCompleted ? 'View AI Report' : 'Start Assessment'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderQuestionnaire = () => {
    if (!selectedTest) return null;
    const currentQ = selectedTest.questions[currentStep];
    const progress = ((currentStep) / selectedTest.questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto mt-12 animate-fade-in">
        <button 
          onClick={() => setView('hub')}
          className="flex items-center gap-2 text-sm font-bold mb-8 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </button>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--accent-color)' }}>
              {selectedTest.title}
            </h2>
            <span className="text-sm font-bold font-number" style={{ color: 'var(--text-secondary)' }}>
              Question {currentStep + 1} of {selectedTest.questions.length}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent-color)' }}
            />
          </div>
        </div>

        <div className="p-8 rounded-2xl shadow-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h3 className="text-2xl font-bold mb-8 leading-tight">{currentQ.question}</h3>
          
          <div className="space-y-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(currentQ.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                    ${isSelected ? 'border-accent' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                  style={{ backgroundColor: isSelected ? 'var(--bg-body)' : 'var(--bg-body)' }}
                >
                  <span className="font-medium">{opt}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${isSelected ? 'border-accent' : 'border-gray-400 group-hover:border-gray-500'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
              disabled={currentStep === 0 || loading}
              className="p-3 rounded-xl disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextStep}
              disabled={!answers[currentQ.id] || loading}
              className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}
            >
              {loading ? (
                <><RefreshCw className="h-5 w-5 animate-spin" /> Analyzing...</>
              ) : currentStep === selectedTest.questions.length - 1 ? (
                <><Brain className="h-5 w-5" /> Analyze Profile</>
              ) : (
                <>Next <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!selectedTest) return null;
    const data = dashboardData[selectedTest.id];
    if (!data) return null;

    const { mainScore, narrative, biases, chartData, chartType, metrics, insights } = data;

    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-6 mb-4">
              <button 
                onClick={() => setView('hub')}
                className="flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="h-4 w-4" /> Back to Hub
              </button>
              <button 
                onClick={() => startTest(selectedTest.id)}
                className="flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity text-indigo-500 dark:text-indigo-400"
              >
                <RefreshCw className="h-4 w-4" /> Retake Test
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${selectedTest.color}`}>
                <selectedTest.icon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold">{selectedTest.title} Report</h1>
            </div>
          </div>
          <div className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-200" />
            <span className="font-medium text-blue-100">AI Score:</span>
            <span className="text-xl font-black">{mainScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Narrative & Chart */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Narrative */}
            <div className="p-8 rounded-3xl border shadow-sm bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-body)]" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Brain className="h-6 w-6 text-indigo-500" />
                AI Psychological Narrative
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {narrative && narrative.split('\n').map((para, i) => (
                  para.trim() ? <p key={i}>{para}</p> : null
                ))}
              </div>
            </div>

            {/* Dynamic Chart (Bar or Pie) */}
            <div className="p-6 rounded-3xl border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
                <Activity className="h-5 w-5 text-accent" />
                Data Visualization
              </h2>
              <div className="h-64 w-full">
                {chartType === 'bar' && chartData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                      <XAxis dataKey="name" tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(val) => `${val}%`} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                      <RechartsTooltip 
                        cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9' }}
                        contentStyle={{ backgroundColor: isDarkMode ? '#0f172a' : '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`${value}%`, 'Value']}
                      />
                      <ReferenceLine y={0} stroke={isDarkMode ? '#475569' : '#cbd5e1'} />
                      <Bar dataKey="impactPercent" radius={[4, 4, 4, 4]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.impactPercent < 0 ? (isDarkMode ? '#ef4444' : '#dc2626') : (isDarkMode ? '#22c55e' : '#16a34a')} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chartType === 'pie' && chartData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || (isDarkMode ? '#818cf8' : '#6366f1')} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value}%`, 'Value']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* AI Insights Cards */}
            {insights && insights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border shadow-sm flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-sm">{insight.title}</h3>
                        {insight.status === 'Warning' ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-positive" />
                        )}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{insight.description}</p>
                    </div>
                    <div className={`mt-3 text-xs font-bold px-2 py-1 rounded-md self-start ${insight.status === 'Warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {insight.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Dense Metrics & Biases */}
          <div className="space-y-6">
            
            {/* Advanced Metrics */}
            <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-accent" />
                Quant Metrics
              </h2>
              <div className="space-y-4">
                {metrics && Object.entries(metrics).map(([key, value], idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{key}</span>
                    <span className="font-bold font-number">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Biases */}
            <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-rose-500">
                <Brain className="h-5 w-5" />
                Identified Biases
              </h2>
              <div className="space-y-4">
                {biases && biases.map((bias, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/10">
                    <h3 className="font-bold text-sm text-rose-600 dark:text-rose-400 mb-1">{bias.name}</h3>
                    <p className="text-xs text-rose-900/70 dark:text-rose-200/60 leading-relaxed">{bias.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 relative">
      {view === 'hub' && renderHub()}
      {view === 'questionnaire' && renderQuestionnaire()}
      {view === 'dashboard' && renderDashboard()}
    </div>
  );
}
