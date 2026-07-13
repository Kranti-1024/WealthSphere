import { useData } from '../context/DataContext';
import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronDown } from 'lucide-react';

import { formatINR } from '../utils/formatters';

const TransactionHistory = () => {
  const { mockData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, credit, debit
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Extract unique categories for the dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set(mockData.transactions.map(t => t.category));
    return Array.from(categories).sort();
  }, []);

  const filteredTransactions = useMemo(() => {
    return mockData.transactions.filter(txn => {
      const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            txn.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            txn.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesCategory = filterCategory === 'all' || txn.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, filterType, filterCategory]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Reset pagination if filtered results change and current page is out of bounds
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  } else if (totalPages === 0 && currentPage !== 1) {
    setCurrentPage(1);
  }

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownload = () => {
    const headers = ['ID,Date,Description,Category,Type,Amount'];
    const rows = filteredTransactions.map(t => 
      `${t.id},${t.date},${t.description},${t.category},${t.type},${t.amount}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wealthsphere_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0A111A] rounded-xl shadow-lg shadow-black/20 border border-white/5 mt-8 transition-colors">
      <div className="p-6 border-b border-white/5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Transaction History</h3>
          <p className="text-sm text-gray-400">View and download your recent activity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full xl:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full sm:w-56 border border-white/5 rounded-lg bg-gray-50 dark:bg-slate-800/50 text-gray-100 focus:ring-2 focus:ring-(--color-accent) outline-none text-sm"
            />
          </div>
          
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-white/5 rounded-lg bg-[#0A111A] text-gray-100 focus:ring-2 focus:ring-(--color-accent) outline-none cursor-pointer text-sm font-medium w-full sm:w-auto"
            >
              <option value="all">All Types</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-white/5 rounded-lg bg-[#0A111A] text-gray-100 focus:ring-2 focus:ring-(--color-accent) outline-none cursor-pointer text-sm font-medium w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <button 
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-(--color-primary) hover:bg-(--color-primary)/90 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-gray-50/50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Date</th>
              <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Description</th>
              <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide">Category</th>
              <th className="px-6 py-4 text-[13px] font-medium text-gray-400 uppercase tracking-wide text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {paginatedTransactions.map((txn, index) => (
              <tr 
                key={txn.id} 
                className={`border-l-4 border-l-transparent transition-all hover:bg-green-50/20 dark:hover:bg-[#132A42]/30 hover:border-l-(--color-positive) ${index % 2 === 0 ? 'bg-[#0A111A]' : 'bg-gray-50/30 dark:bg-slate-900/10'} animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-number">{new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-100">{txn.description}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-number">{txn.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-[11px] leading-5 font-bold uppercase tracking-wider rounded bg-gray-250 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {txn.category}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right font-number ${txn.type === 'credit' ? 'text-(--color-positive)' : 'text-(--color-negative)'}`}>
                  {txn.type === 'credit' ? '+' : '-'}{formatINR(txn.amount)}
                </td>
              </tr>
            ))}
            {paginatedTransactions.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                  No transactions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Showing <span className="font-medium">{filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of <span className="font-medium">{filteredTransactions.length}</span> results
        </span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1 border border-white/5 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-100"
          >
            Previous
          </button>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border border-white/5 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
