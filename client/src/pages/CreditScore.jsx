import React, { useState, useEffect } from 'react';
import { Activity, Download, Info, CheckCircle, TrendingUp, Clock, CreditCard, ShieldAlert } from 'lucide-react';
import { useAPI } from '../hooks/useAPI';
import FadeIn from '../components/FadeIn';

const Gauge = ({ score }) => {
  // Normalize score between 300 and 900
  const normalizedScore = Math.max(300, Math.min(900, score));
  // Calculate percentage (0 to 1)
  const percentage = (normalizedScore - 300) / 600;
  
  // SVG Arc calculation
  const radius = 120;
  const strokeWidth = 24;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (percentage * circumference);

  let color = '#EF5350'; // Red (Poor)
  if (normalizedScore >= 750) color = '#4CAF50'; // Green (Excellent)
  else if (normalizedScore >= 650) color = '#FFA000'; // Orange (Fair)

  return (
    <div className="relative flex flex-col items-center justify-center py-6">
      <svg className="w-64 h-36 overflow-visible" viewBox="0 0 264 132">
        {/* Background Arc */}
        <path
          d={`M 12 132 A 120 120 0 0 1 252 132`}
          fill="none"
          stroke="var(--bg-app)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <path
          d={`M 12 132 A 120 120 0 0 1 252 132`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1500 ease-out"
        />
      </svg>
      <div className="absolute bottom-6 flex flex-col items-center">
        <span className="text-5xl font-bold font-number" style={{ color }}>{normalizedScore}</span>
        <span className="text-sm font-semibold text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
          {normalizedScore >= 750 ? 'Excellent' : normalizedScore >= 650 ? 'Fair' : 'Poor'}
        </span>
      </div>
      <div className="flex justify-between w-64 text-xs font-semibold text-[var(--text-secondary)] mt-4 px-2">
        <span>300</span>
        <span>900</span>
      </div>
    </div>
  );
};

const CreditScore = () => {
  const { request } = useAPI();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await request('/credit/score');
        setData(response);
      } catch (e) {
        console.error("Failed to fetch credit score", e);
      } finally {
        setLoading(false);
      }
    };
    fetchScore();
  }, [request]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch the PDF blob using the relative API route (which Vite proxies)
      const response = await fetch('/api/credit/report/download', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch PDF report");
      
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      
      // Create a hidden link to securely open the blob URL in a new tab
      const link = document.createElement('a');
      link.href = fileURL;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the object URL after a delay to ensure it had time to load in the new tab
      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    } catch (err) {
      console.error("Failed to download PDF", err);
      alert("Failed to download the CIBIL report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading || !data) return (
    <div className="p-6 max-w-5xl mx-auto flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-20">
      
      <FadeIn>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Activity className="text-[var(--accent)]" size={28} />
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Credit Health</h1>
            </div>
            <p className="text-[var(--text-secondary)] text-sm">Powered by CIBIL™ TransUnion</p>
          </div>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--accent)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 shadow-lg"
          >
            {downloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={18} />}
            {downloading ? 'Generating PDF...' : 'Download Full Report'}
          </button>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Score Card */}
        <FadeIn delay={100} className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] h-full flex flex-col items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] self-start w-full border-b border-[var(--border-color)] pb-3 mb-4">Your CIBIL Score</h2>
            
            <Gauge score={data.score} />
            
            <div className="mt-8 bg-[var(--bg-app)] p-4 rounded-xl border border-[var(--border-color)] w-full text-center">
              <div className="flex items-center justify-center gap-2 text-[var(--positive)] font-semibold text-sm mb-1">
                <TrendingUp size={16} />
                +15 Points
              </div>
              <p className="text-xs text-[var(--text-secondary)]">Since last month</p>
            </div>
            
            <p className="text-[11px] text-[var(--text-secondary)] mt-auto pt-6 text-center">
              Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </FadeIn>

        {/* Factors Breakdown */}
        <FadeIn delay={200} className="lg:col-span-2">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Credit Factors</h2>
              <button className="text-[var(--accent)] hover:underline text-sm font-medium flex items-center gap-1">
                <Info size={16} /> How is this calculated?
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 hover:border-[var(--positive)]/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-[var(--positive)]/10 text-[var(--positive)] rounded-lg"><CheckCircle size={20} /></div>
                  <span className="text-xs font-semibold text-[var(--positive)] uppercase tracking-wider">High Impact</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">Payment History</p>
                <p className="text-xl font-bold text-[var(--text-primary)] font-number mt-1">{data.factors.paymentHistory}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">100% on-time payments. Excellent!</p>
              </div>

              <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 hover:border-[var(--positive)]/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-[var(--positive)]/10 text-[var(--positive)] rounded-lg"><CreditCard size={20} /></div>
                  <span className="text-xs font-semibold text-[var(--positive)] uppercase tracking-wider">High Impact</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">Credit Utilization</p>
                <p className="text-xl font-bold text-[var(--text-primary)] font-number mt-1">{data.factors.creditUtilization}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Below the 30% recommended limit.</p>
              </div>

              <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 hover:border-[#FFA000]/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-[#FFA000]/10 text-[#FFA000] rounded-lg"><Clock size={20} /></div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Medium Impact</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">Age of Credit</p>
                <p className="text-xl font-bold text-[var(--text-primary)] font-number mt-1">{data.factors.creditAge}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Average age is good, keep older accounts open.</p>
              </div>

              <div className="p-4 border border-[var(--border-color)] rounded-xl bg-[var(--bg-app)]/50 hover:border-[#FFA000]/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-[#FFA000]/10 text-[#FFA000] rounded-lg"><ShieldAlert size={20} /></div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Low Impact</span>
                </div>
                <p className="text-[var(--text-secondary)] text-sm font-medium">Total Accounts</p>
                <p className="text-xl font-bold text-[var(--text-primary)] font-number mt-1">{data.factors.totalAccounts}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2">Healthy mix of credit cards and loans.</p>
              </div>

            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default CreditScore;