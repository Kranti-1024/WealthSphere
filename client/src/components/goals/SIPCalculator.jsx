import React, { useState, useContext } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import useFormatINR from '../../hooks/useFormatINR';
import { calculateSIP, calculateEMI, calculateAmortisation } from '../../utils/calculations';
import CustomTooltip from '../analytics/CustomTooltip';

const SIPCalculator = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();
  const [activeTab, setActiveTab] = useState('sip');

  // SIP state
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // EMI state
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(240);

  // Calculations
  const sipMaturity = calculateSIP(sipAmount, sipRate, sipYears);
  const sipInvested = sipAmount * sipYears * 12;
  const sipReturns = sipMaturity - sipInvested;

  const emiAmount = calculateEMI(loanAmount, emiRate, emiTenure);
  const emiTotal = emiAmount * emiTenure;
  const emiInterest = emiTotal - loanAmount;

  // SIP Growth chart data
  const sipChartData = Array.from({ length: sipYears }, (_, i) => {
    const yr = i + 1;
    return {
      year: `Y${yr}`,
      invested: sipAmount * yr * 12,
      value: calculateSIP(sipAmount, sipRate, yr),
    };
  });

  // Amortisation (show first 12 months)
  const amortRows = calculateAmortisation(loanAmount, emiRate, emiTenure).slice(0, 12);

  const accentColor = isDarkMode ? '#00BFA5' : '#00796B';
  const gridColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textColor = isDarkMode ? '#94A3B8' : '#6B7280';

  const cardStyle = {
    background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
    border: '1px solid',
    borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
  };

  const inputStyle = {
    padding: '8px 12px',
    background: isDarkMode ? '#060F1E' : '#F5F7FA',
    border: '1px solid',
    borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
    borderRadius: '4px',
    color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
    fontSize: '13px',
    fontFamily: "'IBM Plex Mono', monospace",
    outline: 'none',
    width: '120px',
  };

  const labelStyle = {
    fontSize: '11px',
    color: textColor,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['sip', 'emi'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 24px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeTab === tab ? accentColor : (isDarkMode ? '#1E3A5F' : '#94A3B8'),
              background: activeTab === tab ? `${accentColor}15` : 'transparent',
              color: activeTab === tab ? accentColor : textColor,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 150ms',
            }}
          >
            {tab === 'sip' ? 'SIP Calculator' : 'EMI Calculator'}
          </button>
        ))}
      </div>

      {activeTab === 'sip' && (
        <>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
              SIP Calculator
            </h3>

            {/* Inputs */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Monthly SIP</label>
                <input
                  type="number"
                  value={sipAmount}
                  onChange={e => setSipAmount(Number(e.target.value))}
                  style={inputStyle}
                  min={500} step={500}
                />
                <input type="range" min={500} max={100000} step={500} value={sipAmount}
                  onChange={e => setSipAmount(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
              <div>
                <label style={labelStyle}>Expected Return (%/yr)</label>
                <input
                  type="number"
                  value={sipRate}
                  onChange={e => setSipRate(Number(e.target.value))}
                  style={inputStyle}
                  min={1} max={30} step={0.5}
                />
                <input type="range" min={6} max={18} step={0.5} value={sipRate}
                  onChange={e => setSipRate(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
              <div>
                <label style={labelStyle}>Duration (Years)</label>
                <input
                  type="number"
                  value={sipYears}
                  onChange={e => setSipYears(Number(e.target.value))}
                  style={inputStyle}
                  min={1} max={30} step={1}
                />
                <input type="range" min={1} max={30} step={1} value={sipYears}
                  onChange={e => setSipYears(Number(e.target.value))}
                  style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { label: 'Total Investment', value: formatINR(sipInvested), color: isDarkMode ? '#94A3B8' : '#6B7280' },
                { label: 'Expected Returns', value: formatINR(sipReturns), color: isDarkMode ? '#4CAF50' : '#2E7D32' },
                { label: 'Maturity Value', value: formatINR(sipMaturity), color: accentColor },
              ].map(stat => (
                <div key={stat.label} style={{
                  flex: 1, minWidth: '150px', padding: '14px',
                  background: isDarkMode ? '#060F1E' : '#F5F7FA',
                  borderRadius: '6px',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {stat.label}
                  </p>
                  <p className="font-number" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sipChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="year" tick={{ fill: textColor, fontSize: 11 }} tickLine={false} axisLine={{ stroke: gridColor }} />
                  <YAxis tick={{ fill: textColor, fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : `₹${(v / 100000).toFixed(1)}L`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="invested" name="Invested" stroke={isDarkMode ? '#94A3B8' : '#6B7280'} fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="value" name="Value" stroke={accentColor} fill={`${accentColor}20`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'emi' && (
        <>
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
              EMI Calculator
            </h3>

            {/* Inputs */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>Loan Amount</label>
                <input type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} style={inputStyle} min={10000} step={10000} />
                <input type="range" min={100000} max={10000000} step={50000} value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
              <div>
                <label style={labelStyle}>Interest Rate (%/yr)</label>
                <input type="number" value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} style={inputStyle} min={1} max={30} step={0.1} />
                <input type="range" min={5} max={20} step={0.1} value={emiRate} onChange={e => setEmiRate(Number(e.target.value))} style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
              <div>
                <label style={labelStyle}>Tenure (Months)</label>
                <input type="number" value={emiTenure} onChange={e => setEmiTenure(Number(e.target.value))} style={inputStyle} min={12} max={360} step={12} />
                <input type="range" min={12} max={360} step={12} value={emiTenure} onChange={e => setEmiTenure(Number(e.target.value))} style={{ width: '100%', marginTop: '8px', accentColor }} />
              </div>
            </div>

            {/* Results */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { label: 'Monthly EMI', value: formatINR(emiAmount), color: accentColor },
                { label: 'Total Interest', value: formatINR(emiInterest), color: isDarkMode ? '#EF5350' : '#C62828' },
                { label: 'Total Payment', value: formatINR(emiTotal), color: isDarkMode ? '#F1F5F9' : '#1A1A2E' },
              ].map(stat => (
                <div key={stat.label} style={{ flex: 1, minWidth: '150px', padding: '14px', background: isDarkMode ? '#060F1E' : '#F5F7FA', borderRadius: '6px' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '11px', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                  <p className="font-number" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Amortisation Table */}
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E', margin: '0 0 10px' }}>
              Amortisation Schedule (First 12 Months)
            </h4>
            <div style={{ overflowX: 'auto', maxHeight: '280px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th key={h} style={{
                        padding: '8px 10px', textAlign: 'right', fontWeight: 600,
                        color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: isDarkMode ? '#060F1E' : '#F5F7FA',
                        borderBottom: `1px solid ${isDarkMode ? '#1E3A5F' : '#94A3B8'}`,
                        position: 'sticky', top: 0,
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amortRows.map(row => (
                    <tr key={row.month}>
                      <td className="font-number" style={{ padding: '7px 10px', textAlign: 'right', color: isDarkMode ? '#94A3B8' : '#6B7280', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>{row.month}</td>
                      <td className="font-number" style={{ padding: '7px 10px', textAlign: 'right', color: isDarkMode ? '#F1F5F9' : '#1A1A2E', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>{formatINR(row.emi)}</td>
                      <td className="font-number" style={{ padding: '7px 10px', textAlign: 'right', color: isDarkMode ? '#4CAF50' : '#2E7D32', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>{formatINR(row.principal)}</td>
                      <td className="font-number" style={{ padding: '7px 10px', textAlign: 'right', color: isDarkMode ? '#EF5350' : '#C62828', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>{formatINR(row.interest)}</td>
                      <td className="font-number" style={{ padding: '7px 10px', textAlign: 'right', color: isDarkMode ? '#F1F5F9' : '#1A1A2E', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SIPCalculator;
