import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, ArrowRight } from 'lucide-react';

import { API_BASE_URL } from '../hooks/useAPI';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important for receiving HttpOnly cookies
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Invalid credentials');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Fetch Error: ' + err.message + ' | ' + err.name);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setToast('Password reset link sent to your registered email.');
    setTimeout(() => setToast(''), 3000);
  };

  const features = [
    'Real-time portfolio tracking & analytics',
    'AI-powered financial insights',
    'Smart budgeting & goal planning',
    'Bank-grade security & encryption',
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-app)',
      }}
    >
      {/* ─── Left Panel: Branding ─── */}
      <div
        style={{
          flex: '1 1 50%',
          background: 'linear-gradient(135deg, #0A2540 0%, #060F1E 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background circles */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(0, 121, 107, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(0, 191, 165, 0.06)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px' }}>
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #00796B, #00BFA5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#FFFFFF',
                letterSpacing: '-0.5px',
              }}
            >
              WealthSphere
            </span>
          </div>

          {/* Tagline */}
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: '1.2',
              marginBottom: '12px',
            }}
          >
            Your Complete Financial Command Center
          </h1>

          <p
            style={{
              fontSize: '16px',
              color: '#94A3B8',
              lineHeight: '1.6',
              marginBottom: '40px',
            }}
          >
            Take control of your finances with intelligent insights, real-time
            tracking, and personalized recommendations — powered by IDBI Bank.
          </p>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(0, 191, 165, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={14} color="#00BFA5" strokeWidth={3} />
                </div>
                <span style={{ color: '#CBD5E1', fontSize: '15px' }}>{feature}</span>
              </div>
            ))}
          </div>

          {/* Footer brand */}
          <div
            style={{
              marginTop: '64px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: '#64748B',
              }}
            >
              Powered by
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#94A3B8',
              }}
            >
              IDBI Bank
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Login Form ─── */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          background: 'var(--bg-app)',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
          }}
        >
          {/* Mobile logo (visible when left panel is hidden) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00796B, #00BFA5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                color: '#FFFFFF',
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.3px',
              }}
            >
              WealthSphere
            </span>
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              marginBottom: '36px',
            }}
          >
            Sign in to access your financial dashboard
          </p>

          {/* Toast notification */}
          {toast && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--accent)',
                color: '#FFFFFF',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              {toast}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(198, 40, 40, 0.1)',
                border: '1px solid rgba(198, 40, 40, 0.3)',
                color: 'var(--negative)',
                borderRadius: '8px',
                fontSize: '14px',
                marginBottom: '20px',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="login-email"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Email Address
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    color: 'var(--text-secondary)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@idbi.com"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 14px 14px 44px',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 200ms, box-shadow 200ms',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,121,107,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: '12px' }}>
              <label
                htmlFor="login-password"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    color: 'var(--text-secondary)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 44px',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: '10px',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border-color 200ms, box-shadow 200ms',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,121,107,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div
              style={{
                textAlign: 'right',
                marginBottom: '28px',
              }}
            >
              <button
                type="button"
                onClick={handleForgotPassword}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                background: isLoading
                  ? 'var(--text-secondary)'
                  : 'var(--primary)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 200ms, transform 100ms',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
            >
              Sign Up
            </button>
          </div>

          {/* Demo credentials hint */}
          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginBottom: '4px',
              }}
            >
              Demo Credentials
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--text-primary)',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            >
              demo@idbi.com &nbsp;/&nbsp; demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
