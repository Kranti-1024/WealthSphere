import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import CyberBackground from '../components/CyberBackground';
import FadeIn from '../components/FadeIn';

import { API_BASE_URL } from '../hooks/useAPI';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!acceptTerms) {
      toast.error("You must accept the terms & conditions!");
      return;
    }
    
    setIsSigningUp(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Account created successfully! Please sign in.');
        navigate('/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (err) {
      toast.error('Network Error: ' + err.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <CyberBackground>
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 z-20">
        {/* Back button */}
        <Link 
          to="/" 
          className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <FadeIn delay={100} className="max-w-md w-full">
          <div className="w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl flex flex-col">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Create Account</h2>
              <p className="text-xs text-gray-400 mt-2">Register to deploy smart asset protection solutions.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0d12]/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    required 
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="email" 
                    placeholder="name@idbi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0d12]/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    required 
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-[#0d0d12]/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0d12]/60 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all outline-none"
                    required 
                  />
                </div>
              </div>

              {/* Accept Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded bg-[#0d0d12] border-white/10 text-emerald-500 focus:ring-emerald-500/20 focus:ring-offset-0 focus:ring-opacity-0 outline-none cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-400 select-none cursor-pointer leading-relaxed">
                  I agree to the <span className="text-emerald-400 hover:underline">terms of service</span> and security protocols of IDBI Wealth.
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isSigningUp}
                className="w-full py-3 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSigningUp ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Create Secure Account"
                )}
              </button>
            </form>

            {/* Switch to Sign In */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </CyberBackground>
  );
};

export default SignUp;
