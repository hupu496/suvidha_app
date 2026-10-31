import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

interface StatusBadgeProps {
  label: string;
  tone?: 'accent' | 'warning' | 'danger' | 'neutral' | 'info';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, tone = 'accent' }) => {
  const { colors } = useAppTheme();

  const getToneColors = () => {
    switch (tone) {
      case 'danger':
        return { bg: 'rgba(217, 72, 72, 0.16)', text: colors.sos };
      case 'warning':
        return { bg: 'rgba(224, 178, 91, 0.16)', text: colors.warning };
      case 'info':
        return { bg: 'rgba(127, 183, 217, 0.16)', text: colors.info };
      case 'neutral':
        return { bg: colors.secondaryBackground, text: colors.secondaryText };
      default:
        return { bg: colors.badgeBg, text: colors.primaryAccent };
    }
  };

  const palette = getToneColors();

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: palette.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});