
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ThemeContextType {
  isRamadanMode: boolean;
  toggleRamadanMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isRamadanMode, setIsRamadanMode] = useState(false);

  useEffect(() => {
    if (isRamadanMode) {
      document.body.classList.add('ramadan-mode');
    } else {
      document.body.classList.remove('ramadan-mode');
    }
  }, [isRamadanMode]);

  const toggleRamadanMode = () => {
    setIsRamadanMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isRamadanMode, toggleRamadanMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
