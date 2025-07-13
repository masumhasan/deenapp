
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

import en from '@/locales/en.json';
import bn from '@/locales/bn.json';
import hi from '@/locales/hi.json';

type Language = 'bn' | 'en' | 'hi';

const translations = { en, bn, hi };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'bn', 'hi'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };
  
  useEffect(() => {
    if (language === 'bn' || language === 'hi') {
      document.body.style.fontFamily = "'Hind Siliguri', sans-serif";
    } else {
      document.body.style.fontFamily = "'Alegreya', serif";
    }
  }, [language]);

  const t = useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
