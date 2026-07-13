import { useData } from '../../context/DataContext';
import React, { useContext } from 'react';
import { Wallet, TrendingUp, CreditCard } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import useFormatINR from '../../hooks/useFormatINR';

const sparklineData = {
  savings: [
    { v: 440000 }, { v: 445000 }, { v: 448000 }, { v: 450000 }, { v: 455000 }, { v: 458000 }, { v: 462000 }
  ],
  investments: [
    { v: 1180000 }, { v: 1195000 }, { v: 1188000 }, { v: 1210000 }, { v: 1205000 }, { v: 1215000 }, { v: 1210500 }
  ],
  spending: [
    { v: 52000 }, { v: 48000 }, { v: 55000 }, { v: 50000 }, { v: 58000 }, { v: 53000 }, { v: 56000 }
  ],
};

const SummaryCard = ({ title, value, icon: Icon, iconColor, sparkData, sparkColor, isDarkMode }) => {
  const { isPrivacyMode } = useContext(PrivacyContext);

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '12px',
      padding: '24px',
      flex: 1,
      minWidth: '240px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: `${iconColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon size={20} style={{ color: iconColor }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isDarkMode ? '#94A3B8' : '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {title}
            </span>
          </div>
          <p
            className="font-number"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              margin: 0,
              letterSpacing: '-0.5px'
            }}
          >
            {value}
          </p>
        </div>

        {/* Sparkline */}
        <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ width: '100px', height: '50px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SummaryCards = () => {
  const { savingsAccounts, portfolio, spendingCategories } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { formatINR } = useFormatINR();

  const totalSavings = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalInvestments = portfolio.reduce((sum, item) => sum + item.value, 0);
  const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    }}>
      <SummaryCard
        title="Total Savings"
        value={formatINR(totalSavings)}
        icon={Wallet}
        iconColor={isDarkMode ? '#00BFA5' : '#00796B'}
        sparkData={sparklineData.savings}
        sparkColor={isDarkMode ? '#00BFA5' : '#00796B'}
        isDarkMode={isDarkMode}
      />
      <SummaryCard
        title="Investment Value"
        value={formatINR(totalInvestments)}
        icon={TrendingUp}
        iconColor={isDarkMode ? '#4CAF50' : '#2E7D32'}
        sparkData={sparklineData.investments}
        sparkColor={isDarkMode ? '#4CAF50' : '#2E7D32'}
        isDarkMode={isDarkMode}
      />
      <SummaryCard
        title="Monthly Spend"
        value={formatINR(totalSpending)}
        icon={CreditCard}
        iconColor={isDarkMode ? '#EF5350' : '#C62828'}
        sparkData={sparklineData.spending}
        sparkColor={isDarkMode ? '#EF5350' : '#C62828'}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default SummaryCards;
