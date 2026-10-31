import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  style,
  accessibilityLabel,
}) => {
  const { colors } = useAppTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (variant === 'danger') return colors.sos;
    if (variant === 'secondary') return colors.secondaryBackground;
    if (variant === 'ghost') return 'transparent';
    return colors.primaryAccent;
  };

  const getTextColor = () => {
    if (disabled) return colors.secondaryText;
    if (variant === 'danger') return '#FFFFFF';
    if (variant === 'secondary' || variant === 'ghost') return colors.primaryText;
    return colors.buttonTextOnAccent;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderColor:
            variant === 'secondary' || variant === 'ghost'
              ? colors.border
              : 'transparent',
          borderWidth: variant === 'secondary' || variant === 'ghost' ? 1 : 0,
          width: fullWidth ? '100%' : undefined,
          opacity: pressed && !disabled ? 0.88 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{label}</Text>
      )}
    </Pressable>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = (props) => (
  <PrimaryButton {...props} variant="secondary" />
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 46,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});