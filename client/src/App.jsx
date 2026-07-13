import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PrivacyProvider } from './context/PrivacyContext';

import PageWrapper from './components/layout/PageWrapper';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Spending from './pages/Spending';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Advisor from './pages/Advisor';
import Profile from './pages/Profile';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import Vault from './pages/Vault';
import CreditScore from './pages/CreditScore';
import SignUp from './pages/SignUp';

import { DataProvider } from './context/DataContext';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiBase}/api/auth/status`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-[#060F1E] text-white">Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <DataProvider isAuthenticated={isLoggedIn}>
      <PageWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/spending" element={<Spending />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/credit-score" element={<CreditScore />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </PageWrapper>
    </DataProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <PrivacyProvider>
        <Router>
          <AppContent />
        </Router>
      </PrivacyProvider>
    </ThemeProvider>
  );
}

export default App;
