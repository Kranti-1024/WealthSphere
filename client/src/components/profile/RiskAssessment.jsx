import React, { useState, useContext } from 'react';
import { CheckCircle } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const QUESTIONS = [
  {
    id: 1,
    question: 'What is your primary financial goal?',
    options: [
      { label: 'Capital Safety', score: 1 },
      { label: 'Steady Growth', score: 2 },
      { label: 'High Returns', score: 3 },
    ],
  },
  {
    id: 2,
    question: 'How long can you stay invested?',
    options: [
      { label: '< 1 Year', score: 1 },
      { label: '1–3 Years', score: 2 },
      { label: '3–7 Years', score: 3 },
      { label: '7+ Years', score: 4 },
    ],
  },
  {
    id: 3,
    question: 'How do you react to a 20% portfolio drop?',
    options: [
      { label: 'Sell immediately', score: 1 },
      { label: 'Hold and wait', score: 2 },
      { label: 'Buy more (opportunity!)', score: 3 },
    ],
  },
  {
    id: 4,
    question: 'What % of your income can you invest monthly?',
    options: [
      { label: '< 10%', score: 1 },
      { label: '10–20%', score: 2 },
      { label: '20–30%', score: 3 },
      { label: '30%+', score: 4 },
    ],
  },
  {
    id: 5,
    question: 'Do you have a 6-month emergency fund?',
    options: [
      { label: 'No', score: 1 },
      { label: 'Partial', score: 2 },
      { label: 'Yes, fully funded', score: 3 },
    ],
  },
];

const PROFILE_INFO = {
  Conservative: {
    color: '#0A2540',
    darkColor: '#1A3A5C',
    bg: 'rgba(10,37,64,0.1)',
    darkBg: 'rgba(26,58,92,0.2)',
    description: 'You prioritize capital preservation over growth. Recommended allocation: 70% Debt (FDs, Bonds, PPF), 20% Hybrid Funds, 10% Large Cap Equity.',
  },
  Moderate: {
    color: '#00796B',
    darkColor: '#00BFA5',
    bg: 'rgba(0,121,107,0.1)',
    darkBg: 'rgba(0,191,165,0.1)',
    description: 'You seek a balance of growth and stability. Recommended allocation: 40% Equity (Large + Mid Cap), 40% Debt (Bonds, FDs), 20% Hybrid Funds.',
  },
  Aggressive: {
    color: '#C62828',
    darkColor: '#EF5350',
    bg: 'rgba(198,40,40,0.1)',
    darkBg: 'rgba(239,83,80,0.1)',
    description: 'You are comfortable with risk for higher potential returns. Recommended allocation: 70% Equity (All caps + ELSS), 20% Hybrid, 10% Gold/Alternatives.',
  },
};

const RiskAssessment = ({ onComplete }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const accentColor = isDarkMode ? '#00BFA5' : '#00796B';
  const textColor = isDarkMode ? '#F1F5F9' : '#1A1A2E';
  const subColor = isDarkMode ? '#94A3B8' : '#6B7280';

  const handleAnswer = (score) => {
    const newAnswers = [...answers, score];
    if (currentQ < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentQ(currentQ + 1);
    } else {
      const total = newAnswers.reduce((s, a) => s + a, 0);
      let profile;
      if (total <= 8) profile = 'Conservative';
      else if (total <= 14) profile = 'Moderate';
      else profile = 'Aggressive';

      setResult({ profile, score: total });
      if (onComplete) onComplete(profile);
    }
  };

  const handleRetake = () => {
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  const cardStyle = {
    background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
    border: '1px solid',
    borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
    borderRadius: '8px',
    padding: '32px',
    maxWidth: '560px',
    margin: '0 auto',
  };

  if (result) {
    const info = PROFILE_INFO[result.profile];
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <CheckCircle size={40} style={{ color: isDarkMode ? info.darkColor : info.color, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: textColor, margin: '0 0 8px' }}>
            Risk Profile Complete
          </h3>
          <p style={{ fontSize: '13px', color: subColor, margin: 0 }}>
            Score: {result.score} / 17
          </p>
        </div>

        <div style={{
          padding: '16px 20px',
          borderRadius: '8px',
          background: isDarkMode ? info.darkBg : info.bg,
          border: '2px solid',
          borderColor: isDarkMode ? info.darkColor : info.color,
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '12px', color: isDarkMode ? info.darkColor : info.color, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Your Investor Profile
          </p>
          <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 700, color: isDarkMode ? info.darkColor : info.color }}>
            {result.profile}
          </h2>
        </div>

        <p style={{ fontSize: '14px', color: textColor, lineHeight: 1.6, marginBottom: '24px' }}>
          {info.description}
        </p>

        <button
          onClick={handleRetake}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: '1px solid',
            borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
            borderRadius: '6px',
            color: subColor,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div style={cardStyle}>
      {/* Progress */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', color: subColor }}>Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span style={{ fontSize: '12px', color: accentColor, fontWeight: 600 }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '4px', background: isDarkMode ? '#1E3A5F' : '#94A3B8', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: accentColor, borderRadius: '2px', transition: 'width 300ms ease' }} />
        </div>
      </div>

      <h3 style={{ fontSize: '17px', fontWeight: 600, color: textColor, margin: '0 0 24px', lineHeight: 1.4 }}>
        {q.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {q.options.map(option => (
          <button
            key={option.label}
            onClick={() => handleAnswer(option.score)}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: isDarkMode ? '#060F1E' : '#F5F7FA',
              border: '1px solid',
              borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
              borderRadius: '6px',
              color: textColor,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 150ms',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseOver={e => {
              e.currentTarget.style.borderColor = accentColor;
              e.currentTarget.style.background = isDarkMode ? 'rgba(0,191,165,0.05)' : 'rgba(0,121,107,0.03)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
              e.currentTarget.style.background = isDarkMode ? '#060F1E' : '#F5F7FA';
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RiskAssessment;
