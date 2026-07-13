import { useData } from '../../context/DataContext';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Send, Copy, Check, RotateCcw } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

import { canHandle, generateResponse, getFallback } from '../../utils/offlineAI';
import VoiceInput from './VoiceInput';

const API_URL = import.meta.env.VITE_API_URL || '';

const SUGGESTED_PROMPTS = [
  'How can I save more?',
  'Review my portfolio',
  'Plan my retirement',
  'Should I invest in FD or SIP?',
  'Help me reach my goals faster',
];

const TypingIndicator = ({ isDarkMode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '12px 16px' }}>
    {[0, 1, 2].map(i => (
      <span
        key={i}
        className="animate-typing-dot"
        style={{
          display: 'inline-block',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isDarkMode ? '#00BFA5' : '#00796B',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

const MessageBubble = ({ msg, isDarkMode }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
        <div style={{
          maxWidth: '70%',
          padding: '10px 16px',
          background: isDarkMode ? '#1A3A5C' : '#0A2540',
          borderRadius: '12px 12px 4px 12px',
          color: '#FFFFFF',
          fontSize: '14px',
          lineHeight: 1.5,
        }}>
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'flex-start' }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: isDarkMode ? '#00BFA5' : '#00796B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 700,
        flexShrink: 0,
        fontFamily: "'IBM Plex Mono', monospace",
      }}>
        WS
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          padding: '12px 16px',
          background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
          border: '1px solid',
          borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
          borderRadius: '4px 12px 12px 12px',
          fontSize: '14px',
          lineHeight: 1.6,
          color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
          whiteSpace: 'pre-wrap',
        }}>
          {msg.content}
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
            fontSize: '11px',
            padding: '2px 4px',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};

const AIAdvisor = () => {
  const { user, portfolio, goals, spendingCategories } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm WealthSphere, your AI financial advisor for IDBI Bank. I have full context on your financial profile — ₹12.5L net worth, Moderate risk profile, and 4 active goals.\n\nHow can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    const context = {
      user,
      portfolio,
      goals,
      spendingCategories
    };

    try {
      const res = await fetch(`${API_URL}/api/advisor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          financialContext: {
            riskProfile: user.riskProfile,
            netWorth: user.netWorth,
            income: user.monthlyIncome,
            expenses: 56000,
            portfolio: portfolio.map(p => `${p.name} (${p.type}): ₹${p.value.toLocaleString('en-IN')}`).join(', '),
            goals: goals.map(g => `${g.name}: ₹${g.current.toLocaleString('en-IN')} / ₹${g.target.toLocaleString('en-IN')}`).join(', '),
          },
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I'm having trouble connecting to my servers right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: `Hello! I'm WealthSphere, your AI financial advisor for IDBI Bank. How can I help you today?`,
    }]);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 120px)',
      background: isDarkMode ? '#060F1E' : '#F5F7FA',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
        borderBottom: '1px solid',
        borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
            AI Financial Advisor <span style={{ fontSize: '11px', fontWeight: 500, padding: '2px 8px', borderRadius: '12px', background: isDarkMode ? 'rgba(0,191,165,0.1)' : 'rgba(0,121,107,0.1)', color: isDarkMode ? '#00BFA5' : '#00796B', marginLeft: '8px' }}>🟢 Hybrid Mode</span>
          </h2>
          <p style={{ fontSize: '12px', color: isDarkMode ? '#94A3B8' : '#6B7280', margin: 0 }}>
            Powered by Claude + Offline Engine · Context-aware financial guidance
          </p>
        </div>
        <button onClick={handleReset} title="Reset conversation" style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: isDarkMode ? '#94A3B8' : '#6B7280', padding: '6px',
        }}>
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} isDarkMode={isDarkMode} />
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: isDarkMode ? '#00BFA5' : '#00796B',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontSize: '11px', fontWeight: 700,
              fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0,
            }}>WS</div>
            <div style={{
              padding: '4px 12px',
              background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
              border: '1px solid',
              borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
              borderRadius: '4px 12px 12px 12px',
            }}>
              <TypingIndicator isDarkMode={isDarkMode} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div style={{
        padding: '12px 20px 0',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        background: isDarkMode ? '#060F1E' : '#F5F7FA',
      }}>
        {SUGGESTED_PROMPTS.map(prompt => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            disabled={isLoading}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 500,
              background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
              border: '1px solid',
              borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
              borderRadius: '20px',
              color: isDarkMode ? '#94A3B8' : '#6B7280',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              whiteSpace: 'nowrap',
              transition: 'all 150ms',
            }}
            onMouseOver={e => !isLoading && (e.currentTarget.style.borderColor = isDarkMode ? '#00BFA5' : '#00796B')}
            onMouseOut={e => e.currentTarget.style.borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8'}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 20px 16px',
        background: isDarkMode ? '#060F1E' : '#F5F7FA',
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your finances..."
            disabled={isLoading}
            rows={1}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
              border: '1px solid',
              borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
              borderRadius: '8px',
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              lineHeight: 1.5,
            }}
          />
        </div>
        <VoiceInput onTranscript={(text) => setInput(prev => prev + text)} isDarkMode={isDarkMode} />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 16px',
            background: isDarkMode ? '#00BFA5' : '#00796B',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 150ms',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AIAdvisor;
