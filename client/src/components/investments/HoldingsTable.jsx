import { useData } from '../../context/DataContext';
import React, { useState, useContext } from 'react';
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import useFormatINR from '../../hooks/useFormatINR';

import { formatPercentage } from '../../utils/formatters';

const HoldingsTable = () => {
  const { holdings } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR } = useFormatINR();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = holdings
    .filter(h =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const mult = sortDir === 'asc' ? 1 : -1;
      if (typeof a[sortField] === 'string') {
        return mult * a[sortField].localeCompare(b[sortField]);
      }
      return mult * (a[sortField] - b[sortField]);
    });

  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const totalPnL = holdings.reduce((s, h) => {
    const pnl = (h.currentPrice - h.buyPrice) * h.units;
    return s + pnl;
  }, 0);

  const headerStyle = {
    padding: '10px 12px',
    fontSize: '11px',
    fontWeight: 600,
    color: isDarkMode ? '#94A3B8' : '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left',
    cursor: 'pointer',
    userSelect: 'none',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
    background: isDarkMode ? 'rgba(13,27,42,0.5)' : 'rgba(245,247,250,0.5)',
  };

  const cellStyle = {
    padding: '10px 12px',
    fontSize: '13px',
    borderBottom: '1px solid',
    borderColor: isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.5)',
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  return (
    <div style={{
      background: isDarkMode ? '#0D1B2A' : '#FFFFFF',
      border: '1px solid',
      borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Header with search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid',
        borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: 600,
          color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
          margin: 0,
        }}>
          Holdings
        </h3>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: isDarkMode ? '#94A3B8' : '#6B7280',
          }} />
          <input
            type="text"
            placeholder="Search holdings..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px 6px 32px',
              fontSize: '12px',
              border: '1px solid',
              borderColor: isDarkMode ? '#1E3A5F' : '#94A3B8',
              borderRadius: '4px',
              background: isDarkMode ? '#060F1E' : '#F5F7FA',
              color: isDarkMode ? '#F1F5F9' : '#1A1A2E',
              outline: 'none',
              width: '200px',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }} className={isPrivacyMode ? 'privacy-blur' : ''}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerStyle} onClick={() => handleSort('name')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Asset Name <SortIcon field="name" />
                </span>
              </th>
              <th style={headerStyle} onClick={() => handleSort('type')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Type <SortIcon field="type" />
                </span>
              </th>
              <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('units')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  Units <SortIcon field="units" />
                </span>
              </th>
              <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('buyPrice')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  Buy Price <SortIcon field="buyPrice" />
                </span>
              </th>
              <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('currentPrice')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  Current Price <SortIcon field="currentPrice" />
                </span>
              </th>
              <th style={{ ...headerStyle, textAlign: 'right' }}>P&L</th>
              <th style={{ ...headerStyle, textAlign: 'right' }} onClick={() => handleSort('returns')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  P&L % <SortIcon field="returns" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(holding => {
              const pnl = (holding.currentPrice - holding.buyPrice) * holding.units;
              const isPositive = pnl >= 0;
              const pnlColor = isPositive
                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                : (isDarkMode ? '#EF5350' : '#C62828');

              return (
                <tr key={holding.name} style={{
                  transition: 'background 100ms',
                }}
                onMouseOver={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ ...cellStyle, fontWeight: 500, color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
                    {holding.name}
                  </td>
                  <td style={{ ...cellStyle, color: isDarkMode ? '#94A3B8' : '#6B7280' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: isDarkMode ? 'rgba(26,58,92,0.3)' : 'rgba(10,37,64,0.06)',
                      color: isDarkMode ? '#94A3B8' : '#6B7280',
                    }}>
                      {holding.type}
                    </span>
                  </td>
                  <td className="font-number" style={{ ...cellStyle, textAlign: 'right', color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
                    {holding.units.toLocaleString('en-IN')}
                  </td>
                  <td className="font-number" style={{ ...cellStyle, textAlign: 'right', color: isDarkMode ? '#94A3B8' : '#6B7280' }}>
                    {formatINR(holding.buyPrice)}
                  </td>
                  <td className="font-number" style={{ ...cellStyle, textAlign: 'right', color: isDarkMode ? '#F1F5F9' : '#1A1A2E' }}>
                    {formatINR(holding.currentPrice)}
                  </td>
                  <td className="font-number" style={{ ...cellStyle, textAlign: 'right', color: pnlColor, fontWeight: 600 }}>
                    {isPositive ? '+' : ''}{formatINR(Math.abs(pnl))}
                  </td>
                  <td className="font-number" style={{ ...cellStyle, textAlign: 'right', color: pnlColor, fontWeight: 600 }}>
                    {formatPercentage(holding.returns)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Total Row */}
          <tfoot>
            <tr style={{
              background: isDarkMode ? 'rgba(0,191,165,0.04)' : 'rgba(0,121,107,0.03)',
            }}>
              <td colSpan={2} style={{ ...cellStyle, fontWeight: 600, color: isDarkMode ? '#F1F5F9' : '#1A1A2E', borderBottom: 'none' }}>
                Portfolio Total
              </td>
              <td colSpan={3} style={{ ...cellStyle, borderBottom: 'none' }}></td>
              <td className="font-number" style={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: totalPnL >= 0 ? (isDarkMode ? '#4CAF50' : '#2E7D32') : (isDarkMode ? '#EF5350' : '#C62828'), borderBottom: 'none' }}>
                {totalPnL >= 0 ? '+' : ''}{formatINR(Math.abs(totalPnL))}
              </td>
              <td className="font-number" style={{ ...cellStyle, textAlign: 'right', fontWeight: 700, color: isDarkMode ? '#F1F5F9' : '#1A1A2E', borderBottom: 'none' }}>
                {formatINR(totalValue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
