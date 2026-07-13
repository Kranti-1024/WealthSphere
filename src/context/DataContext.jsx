import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';
import { mapPortfolio, mapGoals, mapSpending, mapTransactions } from '../utils/mappers';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children, isAuthenticated }) => {
  const { request } = useAPI();
  
  const [data, setData] = useState({
    user: { name: 'Loading...', customerId: 'IDBI-XXXX-XXXX', riskProfile: 'Moderate', monthlyIncome: 0, netWorth: 0 },
    portfolio: [],
    holdings: [],
    savingsAccounts: [],
    goals: [],
    spendingCategories: [],
    monthlyComparison: [],
    transactions: [],
    insights: [],
    notifications: [],
    netWorth: 0,
    networthHistory: [],
    trendData: [],
    documents: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const [
        authRes,
        portfolioRes,
        savingsRes,
        goalsRes,
        spendingRes,
        transactionsRes,
        insightsRes,
        notificationsRes,
        networthRes,
        documentsRes
      ] = await Promise.all([
        request('/auth/me'),
        request('/portfolio'),
        request('/portfolio/savings'),
        request('/goals'),
        request('/analytics/spending'),
        request('/transactions?limit=10'),
        request('/insights'),
        request('/notifications'),
        request('/analytics/networth'),
        request('/documents')
      ]);

      setData({
        user: authRes.user,
        portfolio: mapPortfolio(portfolioRes.portfolio),
        holdings: mapPortfolio(portfolioRes.portfolio), // mockData exported both portfolio and holdings
        savingsAccounts: savingsRes.savingsAccounts || [],
        goals: mapGoals(goalsRes.goals),
        spendingCategories: mapSpending(spendingRes.categories),
        monthlyComparison: spendingRes.comparison || [],
        transactions: mapTransactions(transactionsRes.transactions),
        insights: insightsRes.insights || [],
        notifications: notificationsRes.notifications || [],
        netWorth: networthRes.current,
        networthHistory: networthRes.history || [],
        trendData: networthRes.history || [],
        documents: documentsRes.documents || []
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch app data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  return (
    <DataContext.Provider value={{ ...data, mockData: data, loading, error, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
