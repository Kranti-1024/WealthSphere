import { useData } from '../context/DataContext';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';


const AIAdvisor = () => {
  const { mockData } = useData();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello ${mockData.user.name.split(' ')[0]}, I'm your WealthSphere AI Advisor. I've reviewed your financial portfolio. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Format history for Claude API (excluding the initial greeting to save tokens if we want, but let's send all)
      const historyForApi = updatedMessages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));

      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: historyForApi.slice(0, -1), // Everything except the last message which is sent in 'message'
          financialData: {
            netWorth: mockData.netWorth,
            savings: mockData.savings,
            investments: mockData.investments,
            spending: mockData.spending,
            goals: mockData.goals
          }
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not connect to AI service.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Network failure.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg shadow-black/20 border border-gray-100 flex flex-col h-[500px]">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Financial Advisor</h3>
          <p className="text-xs text-gray-400">Powered by Claude 3.5 Sonnet</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-(--color-accent) text-white' : 'bg-gray-100 text-gray-600'}`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-(--color-accent) text-white rounded-tr-sm' : 'bg-gray-50 text-gray-800 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 text-gray-800 rounded-tl-sm flex items-center">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your spending, investments, or goals..."
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-accent)/20 focus:border-(--color-accent)"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-(--color-primary) text-white p-2 px-4 rounded-lg hover:bg-(--color-primary)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
