import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Sun, Moon } from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, colors, toggleTheme } = useAppTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.secondaryBackground,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {mode === 'dark' ? (
        <Sun size={16} color={colors.primaryAccent} />
      ) : (
        <Moon size={16} color={colors.primaryAccent} />
      )}
      <Text style={[styles.label, { color: colors.primaryText }]}>
        {mode === 'dark' ? 'Light' : 'Dark'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});