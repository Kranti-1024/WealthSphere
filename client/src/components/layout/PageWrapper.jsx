import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ThemeContext } from '../../context/ThemeContext';

const PageWrapper = ({ children, isLoggedIn, setIsLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-app)',
      backgroundImage: 'var(--bg-pattern)',
      backgroundRepeat: 'repeat',
      color: 'var(--text-primary)',
      transition: 'background 200ms, color 200ms',
    }}>
      <Navbar
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          background: 'transparent',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
