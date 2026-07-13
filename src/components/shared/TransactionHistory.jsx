import { useData } from '../../context/DataContext';
import React, { useState, useContext } from 'react';
import { Download, Search, Filter } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { PrivacyContext } from '../../context/PrivacyContext';
import useFormatINR from '../../hooks/useFormatINR';

import { formatDate } from '../../utils/formatters';

const CATEGORIES = ['All', 'Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Utilities', 'Income', 'Investment', 'Housing', 'Healthcare', 'Insurance'];
const PAGE_SIZE = 10;

const TransactionHistory = () => {
  const { transactions } = useData();
  const { isDarkMode } = useContext(ThemeContext);
  const { isPrivacyMode } = useContext(PrivacyContext);
  const { formatINR } = useFormatINR();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = transactions.filter(t => {
    const matchSearch = (t.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || t.category === category;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const downloadCSV = () => {
    const headers = 'Date,Description,Category,Type,Amount\n';
    const rows = filtered.map(t =>
      `${t.date},"${t.title || ''}",${t.category},${t.type},${t.amount}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wealthsphere-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const cardBg = isDarkMode ? '#0D1B2A' : '#FFFFFF';
  const borderColor = isDarkMode ? '#1E3A5F' : '#94A3B8';
  const textPrimary = isDarkMode ? '#F1F5F9' : '#1A1A2E';
  const textSecondary = isDarkMode ? '#94A3B8' : '#6B7280';
  const inputBg = isDarkMode ? '#060F1E' : '#F5F7FA';

  return (
    <div style={{ background: cardBg, border: '1px solid', borderColor, borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '12px', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: textPrimary }}>Transaction History</h3>
          <button onClick={downloadCSV} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', background: 'transparent',
            border: `1px solid ${borderColor}`, borderRadius: '4px',
            color: textSecondary, fontSize: '12px', fontWeight: 500, cursor: 'pointer',
          }}>
            <Download size={13} /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: textSecondary }} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                width: '100%', padding: '6px 10px 6px 30px',
                background: inputBg, border: `1px solid ${borderColor}`,
                borderRadius: '4px', color: textPrimary, fontSize: '12px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            style={{
              padding: '6px 10px', background: inputBg, border: `1px solid ${borderColor}`,
              borderRadius: '4px', color: textPrimary, fontSize: '12px', outline: 'none', cursor: 'pointer',
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            style={{
              padding: '6px 10px', background: inputBg, border: `1px solid ${borderColor}`,
              borderRadius: '4px', color: textPrimary, fontSize: '12px', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={isPrivacyMode ? 'privacy-blur' : ''} style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: isDarkMode ? 'rgba(6,15,30,0.5)' : 'rgba(245,247,250,0.8)' }}>
              {['Date', 'Description', 'Category', 'Amount', 'Type'].map(h => (
                <th key={h} style={{
                  padding: '10px 14px', textAlign: h === 'Amount' ? 'right' : 'left',
                  fontSize: '11px', fontWeight: 600, color: textSecondary,
                  textTransform: 'uppercase', letterSpacing: '0.5px',
                  borderBottom: `1px solid ${borderColor}`,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(txn => {
              const isCredit = txn.type === 'credit';
              const amtColor = isCredit
                ? (isDarkMode ? '#4CAF50' : '#2E7D32')
                : (isDarkMode ? '#EF5350' : '#C62828');

              return (
                <tr key={txn.id}
                  style={{ transition: 'background 100ms' }}
                  onMouseOver={e => e.currentTarget.style.background = isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td className="font-number" style={{ padding: '10px 14px', fontSize: '12px', color: textSecondary, borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}`, whiteSpace: 'nowrap' }}>
                    {formatDate(txn.date)}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 500, color: textPrimary, borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>
                    {txn.title}
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 500,
                      padding: '2px 8px', borderRadius: '3px',
                      background: isDarkMode ? 'rgba(26,58,92,0.3)' : 'rgba(10,37,64,0.06)',
                      color: textSecondary,
                    }}>
                      {txn.category}
                    </span>
                  </td>
                  <td className="font-number" style={{
                    padding: '10px 14px', textAlign: 'right', fontSize: '13px',
                    fontWeight: 600, color: amtColor,
                    borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {isCredit ? '+' : '−'}{formatINR(txn.amount)}
                  </td>
                  <td style={{ padding: '10px 14px', borderBottom: `1px solid ${isDarkMode ? 'rgba(30,58,95,0.3)' : 'rgba(229,231,235,0.4)'}` }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600,
                      padding: '2px 8px', borderRadius: '3px', textTransform: 'uppercase',
                      background: isCredit
                        ? (isDarkMode ? 'rgba(76,175,80,0.12)' : 'rgba(46,125,50,0.08)')
                        : (isDarkMode ? 'rgba(239,83,80,0.12)' : 'rgba(198,40,40,0.08)'),
                      color: amtColor,
                    }}>
                      {txn.type}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {paginated.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: textSecondary, fontSize: '13px' }}>
            No transactions match your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: `1px solid ${borderColor}` }}>
          <span style={{ fontSize: '12px', color: textSecondary }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '4px 12px', fontSize: '12px', background: 'transparent',
                border: `1px solid ${borderColor}`, borderRadius: '4px',
                color: page === 1 ? textSecondary : textPrimary,
                cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1,
              }}
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = i + Math.max(1, Math.min(page - 2, totalPages - 4));
              return (
                <button key={pg} onClick={() => setPage(pg)} style={{
                  padding: '4px 10px', fontSize: '12px',
                  background: pg === page ? (isDarkMode ? '#1A3A5C' : '#0A2540') : 'transparent',
                  border: `1px solid ${pg === page ? (isDarkMode ? '#00BFA5' : '#00796B') : borderColor}`,
                  borderRadius: '4px',
                  color: pg === page ? '#FFFFFF' : textPrimary, cursor: 'pointer',
                }}>
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '4px 12px', fontSize: '12px', background: 'transparent',
                border: `1px solid ${borderColor}`, borderRadius: '4px',
                color: page === totalPages ? textSecondary : textPrimary,
                cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
