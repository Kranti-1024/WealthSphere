import { useData } from '../context/DataContext';
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Lightbulb, CheckCircle, Bell, TrendingUp } from 'lucide-react';


const InsightsFeed = () => {
  const { mockData } = useData();
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const generateInsights = () => {
      const generated = [];
      let idCounter = 1;

      // 1. Analyze spending comparison
      const highestIncrease = [...mockData.spending.comparison].sort((a, b) => 
        ((b.thisMonth - b.lastMonth) / b.lastMonth) - ((a.thisMonth - a.lastMonth) / a.lastMonth)
      )[0];

      if (highestIncrease && highestIncrease.thisMonth > highestIncrease.lastMonth) {
        const percentIncrease = Math.round(((highestIncrease.thisMonth - highestIncrease.lastMonth) / highestIncrease.lastMonth) * 100);
        generated.push({
          id: idCounter++,
          type: 'warning',
          text: `Your ${highestIncrease.category} spend is ${percentIncrease}% above last month.`,
          icon: <AlertTriangle className="w-5 h-5 text-(--color-negative)" />,
          bg: 'bg-red-50 dark:bg-red-900/20'
        });
      }

      // 2. Analyze goals
      const closestGoal = [...mockData.goals].sort((a, b) => 
        (b.current / b.target) - (a.current / a.target)
      )[0];

      if (closestGoal && (closestGoal.current / closestGoal.target) > 0.8) {
        const percent = Math.round((closestGoal.current / closestGoal.target) * 100);
        generated.push({
          id: idCounter++,
          type: 'achievement',
          text: `You are ${percent}% there! Almost reached your '${closestGoal.name}' goal.`,
          icon: <CheckCircle className="w-5 h-5 text-(--color-positive)" />,
          bg: 'bg-green-50 dark:bg-green-900/20'
        });
      }

      // 3. Analyze investments
      if (mockData.investments.returns > 10) {
        generated.push({
          id: idCounter++,
          type: 'opportunity',
          text: `Your portfolio is up ${mockData.investments.returns}%! Consider booking some profits.`,
          icon: <TrendingUp className="w-5 h-5 text-(--color-positive)" />,
          bg: 'bg-green-50 dark:bg-green-900/20'
        });
      }

      // 4. Analyze savings/FDs (Mocking an upcoming event)
      generated.push({
        id: idCounter++,
        type: 'alert',
        text: 'A Fixed Deposit of ₹1,50,000 is maturing in 4 days.',
        icon: <Bell className="w-5 h-5 text-(--color-accent)" />,
        bg: 'bg-teal-50 dark:bg-teal-900/20'
      });

      setInsights(generated);
    };

    generateInsights();
  }, []);

  return (
    <div className="bg-[#0A111A] p-6 rounded-xl shadow-lg shadow-black/20 border border-white/5 h-full transition-colors">
      <div className="mb-6">
        <h3 className="font-semibold text-gray-100 text-lg">Proactive Insights</h3>
        <p className="text-sm text-gray-400">AI-powered alerts based on your activity</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={insight.id} 
            className={`flex items-start gap-4 p-4 rounded-lg ${insight.bg} transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="shrink-0 mt-0.5 animate-pulse">
              {insight.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100">
                {insight.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsFeed;
