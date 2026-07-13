import { useData } from '../../context/DataContext';
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import useFormatINR from '../../hooks/useFormatINR';
import { useAPI } from '../../hooks/useAPI';
import { 
  Plus, Target, BarChart2, Calendar, Smile, Shield, Sparkles, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie 
} from 'recharts';
import GoalCard from './GoalCard';

const EMOJI_OPTIONS = ['🎯', '🛡️', '🏠', '✈️', '🏖️', '🚗', '🎓', '💎', '💻', '💍', '👶'];

const GoalTracker = () => {
  const { goals, refreshData } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();
  const { request } = useAPI();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'add', 'analytics'
  
  // Add Goal Form State
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('🎯');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Layout styling variables
  const bgCard = isDarkMode ? '#0D1B2A' : '#FFFFFF';
  const bgApp = isDarkMode ? '#060F1E' : '#F5F7FA';
  const borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textPrimary = isDarkMode ? '#F1F5F9' : '#1A1A2E';
  const textSecondary = isDarkMode ? '#94A3B8' : '#6B7280';
  const accentColor = isDarkMode ? '#00BFA5' : '#00796B';

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.current, 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  // Calculate live monthly savings target
  const [liveMonthlyRequired, setLiveMonthlyRequired] = useState(0);
  const [liveMonths, setLiveMonths] = useState(0);

  useEffect(() => {
    if (target && deadline) {
      const targetVal = parseFloat(target) || 0;
      const currentVal = parseFloat(current) || 0;
      const remainingVal = Math.max(targetVal - currentVal, 0);
      
      const diffMs = new Date(deadline) - new Date();
      const months = diffMs / (1000 * 60 * 60 * 24 * 30.4375);
      const remainingMonths = Math.max(Math.ceil(months), 1);
      
      setLiveMonths(remainingMonths);
      setLiveMonthlyRequired(Math.round(remainingVal / remainingMonths));
    } else {
      setLiveMonthlyRequired(0);
      setLiveMonths(0);
    }
  }, [target, current, deadline]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!name || !target) return;

    setIsSubmitting(true);
    try {
      await request('/goals', {
        method: 'POST',
        body: JSON.stringify({
          name,
          targetAmount: parseFloat(target),
          currentAmount: parseFloat(current) || 0,
          deadline,
          icon,
          monthlyRequired: liveMonthlyRequired
        })
      });
      
      // Reset Form
      setName('');
      setTarget('');
      setCurrent('');
      setDeadline('');
      setIcon('🎯');
      setFormSuccess(true);
      
      // Refresh context data
      await refreshData();
      
      setTimeout(() => {
        setFormSuccess(false);
        setActiveTab('overview');
      }, 1500);

    } catch (err) {
      console.error('Failed to create goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recharts Chart Data Prep
  const barChartData = goals.map(g => ({
    name: g.name,
    Saved: g.current,
    Target: g.target
  }));

  const pieChartData = goals.map((g, idx) => ({
    name: g.name,
    value: g.target,
    color: ['#00BFA5', '#FFCA28', '#FF7043', '#42A5F5', '#AB47BC', '#26A69A', '#5C6BC0'][idx % 7]
  }));

  return (
    <div>
      {/* ─── Beautiful Tabs Navigation ─── */}
      <div style={{
        display: 'flex',
        borderBottom: `2px solid ${borderColor}`,
        marginBottom: '24px',
        gap: '8px'
      }}>
        {[
          { id: 'overview', label: 'My Goals', icon: Target },
          { id: 'add', label: 'Create New Goal', icon: Plus },
          { id: 'analytics', label: 'Goal Projections', icon: BarChart2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 600,
                color: isActive ? accentColor : textSecondary,
                background: 'transparent',
                border: 'none',
                borderBottom: `3px solid ${isActive ? accentColor : 'transparent'}`,
                cursor: 'pointer',
                marginBottom: '-2px',
                transition: 'all 150ms ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div>
          {/* Summary Dashboard Banner */}
          <div style={{
            background: bgCard,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', color: textSecondary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontWeight: 600 }}>
                Overall Savings Target Summary
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <span className="font-number" style={{ fontSize: '36px', fontWeight: 700, color: textPrimary }}>
                  {overallProgress.toFixed(1)}%
                </span>
                <span className="font-number" style={{ fontSize: '15px', color: textSecondary }}>
                  {formatINR(totalCurrent)} saved out of {formatINR(totalTarget)}
                </span>
              </div>
            </div>
            <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
              <div style={{
                height: '10px',
                background: isDarkMode ? '#1E3A5F' : '#E5E7EB',
                borderRadius: '5px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(overallProgress, 100)}%`,
                  background: `linear-gradient(90deg, ${isDarkMode ? '#00BFA5' : '#00796B'} 0%, #4CAF50 100%)`,
                  borderRadius: '5px',
                  transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
                }} />
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: textSecondary, textAlign: 'right' }}>
                {goals.length} Goals Active
              </p>
            </div>
          </div>

          {/* Goals Grid */}
          {goals.length === 0 ? (
            <div style={{
              background: bgCard,
              border: `1px dashed ${borderColor}`,
              borderRadius: '12px',
              padding: '64px 32px',
              textAlign: 'center'
            }}>
              <Sparkles size={48} style={{ color: textSecondary, marginBottom: '16px', opacity: 0.5 }} />
              <h3 style={{ margin: '0 0 8px', color: textPrimary }}>No Goals Added Yet</h3>
              <p style={{ margin: '0 0 24px', color: textSecondary, fontSize: '14px' }}>
                Set up financial targets like down payments, vacations, or emergency funds to track progress.
              </p>
              <button 
                onClick={() => setActiveTab('add')}
                style={{
                  background: accentColor,
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create First Goal
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}>
              {goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: MANUAL FORM ─── */}
      {activeTab === 'add' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Form Card */}
          <div style={{
            background: bgCard,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '32px',
          }}>
            <h3 style={{ margin: '0 0 24px', fontSize: '18px', color: textPrimary, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color={accentColor} /> Create Custom Savings Goal
            </h3>

            {formSuccess ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 0',
                color: isDarkMode ? '#4CAF50' : '#2E7D32'
              }}>
                <CheckCircle2 size={56} style={{ marginBottom: '16px', animation: 'fadeInUp 0.3s' }} />
                <h4>Goal Created Successfully!</h4>
                <p style={{ color: textSecondary, fontSize: '13px' }}>Refetching database & syncing dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleAddGoal}>
                {/* Goal Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '8px' }}>Goal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. New Car Down Payment, Dream Home"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${borderColor}`,
                      background: isDarkMode ? '#060F1E' : '#FFFFFF',
                      color: textPrimary,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Target & Current Saved Amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '8px' }}>Target Amount (₹)</label>
                    <input
                      type="number"
                      value={target}
                      onChange={e => setTarget(e.target.value)}
                      placeholder="e.g. 500000"
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${borderColor}`,
                        background: isDarkMode ? '#060F1E' : '#FFFFFF',
                        color: textPrimary,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '8px' }}>Current Savings (₹)</label>
                    <input
                      type="number"
                      value={current}
                      onChange={e => setCurrent(e.target.value)}
                      placeholder="e.g. 50000"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${borderColor}`,
                        background: isDarkMode ? '#060F1E' : '#FFFFFF',
                        color: textPrimary,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '8px' }}>Target Date / Deadline</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: textSecondary }} />
                    <input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1.5px solid ${borderColor}`,
                        background: isDarkMode ? '#060F1E' : '#FFFFFF',
                        color: textPrimary,
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                {/* Emoji / Category Picker */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: textSecondary, marginBottom: '8px' }}>Goal Icon</label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {EMOJI_OPTIONS.map(opt => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setIcon(opt)}
                        style={{
                          fontSize: '20px',
                          padding: '8px 12px',
                          border: `1.5px solid ${icon === opt ? accentColor : borderColor}`,
                          borderRadius: '8px',
                          background: icon === opt ? `${accentColor}15` : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 150ms ease'
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: accentColor,
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '15px',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Add Goal'}
                </button>
              </form>
            )}
          </div>

          {/* Live Dynamic Estimation Box */}
          <div style={{
            background: bgCard,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '32px',
          }}>
            <h4 style={{ margin: '0 0 16px', fontSize: '15px', color: textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live Target Projection
            </h4>

            {target && deadline ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  padding: '20px',
                  background: isDarkMode ? '#060F1E' : '#F5F7FA',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${accentColor}`
                }}>
                  <p style={{ margin: 0, fontSize: '12px', color: textSecondary, textTransform: 'uppercase' }}>Required Monthly Savings</p>
                  <p className="font-number" style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: 700, color: accentColor }}>
                    {formatINR(liveMonthlyRequired)}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: textSecondary }}>
                    Allocating monthly across the next <strong>{liveMonths} months</strong>.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: textSecondary }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Target Target Value:</span>
                    <strong className="font-number" style={{ color: textPrimary }}>{formatINR(parseFloat(target))}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Current Savings:</span>
                    <strong className="font-number" style={{ color: textPrimary }}>{formatINR(parseFloat(current) || 0)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${borderColor}`, paddingTop: '8px', marginTop: '4px' }}>
                    <span>Remaining deficit:</span>
                    <strong className="font-number" style={{ color: textPrimary }}>{formatINR(Math.max(parseFloat(target) - (parseFloat(current) || 0), 0))}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 0',
                color: textSecondary
              }}>
                <Sparkles size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p style={{ fontSize: '13px', margin: 0 }}>Enter Target Amount and Target Date to view dynamic savings projections.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 3: PROJECTIONS / GRAPH ─── */}
      {activeTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {goals.length === 0 ? (
            <div style={{
              background: bgCard,
              border: `1px dashed ${borderColor}`,
              borderRadius: '12px',
              padding: '64px 32px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: textSecondary }}>No goal data available for projections. Create a goal to update charts.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              {/* Bar Comparison Chart */}
              <div style={{
                background: bgCard,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: textPrimary }}>
                  Target vs. Saved Comparison
                </h4>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                      <XAxis dataKey="name" tick={{ fill: textSecondary, fontSize: 11 }} />
                      <YAxis tick={{ fill: textSecondary, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }} tickFormatter={val => `₹${(val/1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatINR(value)} />
                      <Legend />
                      <Bar dataKey="Saved" fill={accentColor} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Target" fill={isDarkMode ? '#1E3A5F' : '#E5E7EB'} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Allocation Chart */}
              <div style={{
                background: bgCard,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: textPrimary }}>
                  Allocation of Target Capital
                </h4>
                <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={50}
                        stroke="#060F1E"
                        strokeWidth={3}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatINR(value)} 
                        contentStyle={{ background: bgCard, borderColor: borderColor, borderRadius: '8px', color: textPrimary }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right" 
                        wrapperStyle={{ fontSize: '13px', color: textSecondary, paddingLeft: '20px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
