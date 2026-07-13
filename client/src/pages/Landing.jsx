import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, BrainCircuit, LineChart, ChevronRight, MessageSquare, Lock } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const Landing = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleOpenApp = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-emerald-900/20 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] -left-40 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"></div>
        
        {/* Subtle Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        ></div>
      </div>

      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-[#050B14]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
              ID
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">IDBI Wealth</span>
              <span className="text-[10px] block text-emerald-400 font-semibold tracking-wider uppercase leading-none mt-0.5">INNOVATE 2026</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 rounded-lg text-gray-300 hover:text-white font-medium text-sm transition-colors hidden sm:block"
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[calc(100vh-80px)]">
        
        {/* Left Column: Copy */}
        <div className="flex-1 text-center lg:text-left mt-10 lg:mt-0">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Introducing WealthSphere AI
            </div>
          </FadeIn>
          
          <FadeIn delay={200}>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Wealth Management.
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={300}>
            <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
              Experience the next generation of private banking. Automated rebalancing, dynamic insights, and a personalized AI advisor—all built on banking-grade security.
            </p>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={handleOpenApp}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Launch Platform <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                Explore Features
              </button>
            </div>
          </FadeIn>

          {/* Trust Badges */}
          <FadeIn delay={500}>
            <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto lg:mx-0">
              <div className="flex flex-col gap-2">
                <ShieldCheck className="text-emerald-400 w-6 h-6" />
                <h4 className="text-white font-semibold text-sm">Bank-Grade Security</h4>
                <p className="text-gray-500 text-xs leading-relaxed">End-to-end encryption for all your financial data.</p>
              </div>
              <div className="flex flex-col gap-2">
                <BrainCircuit className="text-emerald-400 w-6 h-6" />
                <h4 className="text-white font-semibold text-sm">24/7 AI Advisory</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Personalized strategies powered by Claude AI.</p>
              </div>
              <div className="flex flex-col gap-2">
                <LineChart className="text-emerald-400 w-6 h-6" />
                <h4 className="text-white font-semibold text-sm">Automated Growth</h4>
                <p className="text-gray-500 text-xs leading-relaxed">Dynamic portfolio rebalancing and tracking.</p>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: 3D Holographic AI Core */}
        <div className="flex-1 w-full max-w-2xl hidden lg:flex justify-center items-center relative perspective-1000 min-h-[500px]">
          <FadeIn delay={400} className="relative z-10 w-full h-full flex justify-center items-center transform-style-3d">
            
            {/* Holographic Base Ring */}
            <div className="absolute w-[400px] h-[400px] rounded-full border border-emerald-500/20 animate-spin-slow-3d shadow-[0_0_50px_rgba(16,185,129,0.1)]"></div>
            
            {/* Middle Data Ring */}
            <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-teal-400/40 animate-spin-reverse-3d"></div>
            
            {/* Core Neural Sphere */}
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-900/50 backdrop-blur-md border border-emerald-400/50 shadow-[0_0_100px_rgba(16,185,129,0.4)] animate-float-hologram flex items-center justify-center transform-style-3d">
              <BrainCircuit className="w-12 h-12 text-emerald-300 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              
              {/* Floating Data Nodes around Core */}
              <div className="absolute -top-10 -left-10 bg-[#050B14]/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl shadow-emerald-900/50 transform translate-z-20">
                <p className="text-[10px] text-emerald-400 font-number">SYS.OPT.77</p>
                <div className="w-16 h-1 bg-white/10 mt-1 rounded-full"><div className="w-10 h-1 bg-emerald-400 rounded-full"></div></div>
              </div>

              <div className="absolute -bottom-12 -right-8 bg-[#050B14]/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl shadow-teal-900/50 transform translate-z-30">
                <p className="text-[10px] text-teal-400 font-number">RISK: LOW</p>
                <p className="text-xs text-white font-bold tracking-wider mt-0.5">PROTECTED</p>
              </div>
            </div>

            {/* Glowing Floor Reflection */}
            <div className="absolute bottom-10 w-[300px] h-[40px] bg-emerald-500/20 blur-[30px] rounded-full transform rotateX(80deg)"></div>

            {/* Floating AI Teaser (Overlay on Mockup) */}
            <div className="absolute bottom-4 -left-10 bg-[#0A111A]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/80 flex gap-4 w-72 transform translate-z-40 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">Aria Copilot <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span></p>
                <p className="text-[11px] text-gray-400 leading-snug">"I noticed market volatility. Automatically hedging your equity exposure."</p>
              </div>
            </div>

          </FadeIn>
        </div>
      </main>

    </div>
  );
};

export default Landing;
