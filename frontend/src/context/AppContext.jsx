import { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [displayName, setDisplayName] = useState('');
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setDisplayName(data.displayName || '');
        setTheme(data.theme || 'light');
        setPrimaryColor(data.primaryColor || '#3b82f6');
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Áp dụng theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = {
    displayName,
    setDisplayName,
    theme,
    setTheme,
    primaryColor,
    setPrimaryColor,
    loading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);