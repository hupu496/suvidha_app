
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';
import { ToastBanner } from '@/components/common/ToastBanner';

interface RootLayoutProps {
  children: React.ReactNode;
}

function ThemedRoot({ children }: RootLayoutProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {children}
      <ToastBanner />
    </View>
  );
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <ThemedRoot>{children}</ThemedRoot>
      </AppStateProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
});
