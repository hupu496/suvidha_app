import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { useAppTheme } from '@/context/ThemeContext';

export const ToastBanner: React.FC = () => {
  const { toastMessage } = useAppState();
  const { colors } = useAppTheme();

  if (!toastMessage) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.primaryAccent,
        },
      ]}
      accessibilityLiveRegion="polite"
    >
      <CheckCircle2 size={18} color={colors.primaryAccent} />
      <Text style={[styles.text, { color: colors.primaryText }]}>{toastMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    left: 24,
    maxWidth: 420,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    zIndex: 9999,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});