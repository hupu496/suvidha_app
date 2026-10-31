
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { darkTheme, lightTheme, ThemeColors, ThemeMode } from '@/theme/tokens';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = 'subidha_theme_mode_v2';

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (saved === 'light' || saved === 'dark') {
        setMode(saved);
      }
    } catch {
      // Keep the default theme if browser storage is unavailable.
    }
  }, []);

  const setThemeMode = (nextMode: ThemeMode) => {
    setMode(nextMode);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {
      // Theme changes still work if browser storage is unavailable.
    }
  };

  const toggleTheme = () => {
    setThemeMode(mode === 'dark' ? 'light' : 'dark');
  };

  const colors = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    // Keep CSS-only elements and browser controls in sync with the React theme.
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document.body.dataset.theme = mode;
  }, [mode]);

  return (
    <ThemeContext.Provider
      value={{ mode, colors, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
