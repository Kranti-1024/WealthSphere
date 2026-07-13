import { createContext, useState } from 'react';

export const PrivacyContext = createContext();

export const PrivacyProvider = ({ children }) => {
  const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
    const saved = sessionStorage.getItem('wealthsphere-privacy');
    return saved === 'true';
  });

  const togglePrivacy = () => {
    setIsPrivacyMode((prev) => {
      const next = !prev;
      sessionStorage.setItem('wealthsphere-privacy', String(next));
      return next;
    });
  };

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacy }}>
      {children}
    </PrivacyContext.Provider>
  );
};
