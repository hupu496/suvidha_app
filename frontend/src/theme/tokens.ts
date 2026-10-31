export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  secondaryBackground: string;
  cardBackground: string;
  primaryAccent: string;
  secondaryAccent: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  sos: string;
  success: string;
  warning: string;
  info: string;
  inputBackground: string;
  overlay: string;
  badgeBg: string;
  buttonTextOnAccent: string;
}

// Pure white main background (#FFFFFF) with soft light-tinted cards (#F4F7FA) like Blinkit
export const lightTheme: ThemeColors = {
  mode: 'light',
  background: '#FFFFFF',
  secondaryBackground: '#F8FAFC',
  cardBackground: '#F3F6FA',
  primaryAccent: '#0C831F', // Crisp emerald-green accent like Blinkit / modern concierge
  secondaryAccent: '#2563EB',
  primaryText: '#0F172A',
  secondaryText: '#475569',
  border: '#E2E8F0',
  sos: '#DC2626',
  success: '#059669',
  warning: '#D97706',
  info: '#1D63ED',
  inputBackground: '#F8FAFC',
  overlay: 'rgba(15, 23, 42, 0.48)',
  badgeBg: '#E6F4EA',
  buttonTextOnAccent: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: '#090B0E',
  secondaryBackground: '#101317',
  cardBackground: '#171B21',
  primaryAccent: '#36B86A',
  secondaryAccent: '#64D18A',
  primaryText: '#F5F7FA',
  secondaryText: '#A3ADB9',
  border: '#2B313A',
  sos: '#D94848',
  success: '#39B86A',
  warning: '#E0B25B',
  info: '#7FB7D9',
  inputBackground: '#101317',
  overlay: 'rgba(10, 14, 14, 0.78)',
  badgeBg: 'rgba(57, 184, 106, 0.14)',
  buttonTextOnAccent: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;