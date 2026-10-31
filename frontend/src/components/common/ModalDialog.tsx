import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAppTheme } from '@/context/ThemeContext';
import { PrimaryButton, SecondaryButton } from './Buttons';

interface ModalDialogProps {
  visible: boolean;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel?: string;
  variant?: 'default' | 'danger' | 'success';
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
  children?: React.ReactNode;
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
  visible,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  variant = 'default',
  onPrimaryPress,
  onSecondaryPress,
  children,
}) => {
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onSecondaryPress || onPrimaryPress}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onSecondaryPress} />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: variant === 'danger' ? colors.sos : colors.border,
            },
          ]}
          accessibilityRole="alert"
        >
          <View style={styles.iconRow}>
            {variant === 'danger' ? (
              <ShieldAlert size={28} color={colors.sos} />
            ) : variant === 'success' ? (
              <CheckCircle2 size={28} color={colors.primaryAccent} />
            ) : (
              <AlertCircle size={28} color={colors.primaryAccent} />
            )}
          </View>
          <Text style={[styles.title, { color: colors.primaryText }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            {description}
          </Text>
          {children}
          <View style={styles.actions}>
            {secondaryLabel && onSecondaryPress ? (
              <SecondaryButton
                label={secondaryLabel}
                onPress={onSecondaryPress}
                style={{ flex: 1 }}
              />
            ) : null}
            <PrimaryButton
              label={primaryLabel}
              variant={variant === 'danger' ? 'danger' : 'primary'}
              onPress={onPrimaryPress}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
  },
  iconRow: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});