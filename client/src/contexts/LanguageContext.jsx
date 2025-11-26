// contexts/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('ev_language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    setLanguage(newLanguage);
    localStorage.setItem('ev_language', newLanguage);
  };

  const value = {
    language,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};