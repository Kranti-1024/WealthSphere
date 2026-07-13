import { useData } from '../context/DataContext';
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Mic, MicOff, Sparkles, Zap, Minimize2, Maximize2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import AvatarVisual from './AvatarVisual';

const AvatarAssistant = () => {
  const { mockData } = useData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `System online. I am Aria, your AI Advisor.` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionRef = useRef(null);

  // Context-aware logic
  const getContext = () => {
    switch(location.pathname) {
      case '/dashboard':
        return { text: `Net worth grew ${mockData.netWorth.monthlyChange}%.`, actions: ['Analyze', 'Tax Tips'] };
      case '/goals':
        return { text: "84% to Emergency Fund.", actions: ['Optimize', 'SIPs'] };
      case '/investments':
        return { text: "Mutual funds outperformed.", actions: ['Rebalance', 'Compare'] };
      default:
        return { text: "Aria AI Copilot ready.", actions: ['Portfolio', 'News'] };
    }
  };

  const currentContext = getContext();

  useEffect(() => {
    if (SpeechRecognition && !recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, [SpeechRecognition]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textOverride) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend) return;

    if (!textOverride) setInput('');
    setIsExpanded(true);
    
    const updatedMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: [], financialData: {} })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        speak(data.reply);
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error: Connection lost to advisory core." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const avatarState = isListening ? 'listening' : isLoading ? 'thinking' : isSpeaking ? 'speaking' : 'idle';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-300 ease-in-out ${isExpanded ? 'w-[360px]' : 'w-[280px]'}`}>
      
      {/* Widget Container */}
      <div className="w-full bg-[#050B14]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header (Always Visible) */}
        <div 
          className="p-3 bg-[#0A111A] border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/30 flex-shrink-0">
               <AvatarVisual state={avatarState} size="sm" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-100 tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Aria Copilot
              </h3>
              {!isExpanded && <p className="text-[10px] text-emerald-400 mt-0.5 truncate">{currentContext.text}</p>}
            </div>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>

        {/* Expanded Chat Area */}
        <div className={`transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'h-[400px] opacity-100' : 'h-0 opacity-0 hidden'}`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050B14]">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentContext.actions.map(action => (
                <button 
                  key={action}
                  onClick={() => handleSend(action)}
                  className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-semibold text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <Zap size={10} />
                  {action}
                </button>
              ))}
            </div>

            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg text-[11px] leading-relaxed max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-emerald-500/20 text-emerald-50 border border-emerald-500/20' 
                    : 'bg-[#0A111A] text-gray-300 border border-white/5'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="p-3 rounded-lg bg-[#0A111A] border border-white/5 flex items-center h-8">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#0A111A] border-t border-white/5 flex gap-2 items-center">
            <button
              onClick={toggleListen}
              className={`p-2 rounded transition-colors ${isListening ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              {isListening ? <Mic size={14} /> : <MicOff size={14} />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query Copilot..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-gray-600 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarAssistant;
