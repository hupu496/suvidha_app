import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function BusinessSubscriptionPage() {
  const { colors } = useAppTheme();
  const { user, showToast } = useAppState();

  if (!user || user.role !== 'business') return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Partner Subscription & Capacity Overview
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <StatusBadge label="ILLUSTRATIVE B2B PLAN" />
        <Text style={[styles.planName, { color: colors.primaryText }]}>
          Business Logistics Partner Plan
        </Text>
        <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
          Billing Frequency: {user.billingFrequency} • Included Monthly Dispatches:{' '}
          {user.includedCapacity}
        </Text>
        <Text style={{ color: colors.primaryAccent, fontSize: 15, fontWeight: '700' }}>
          Current Cycle Usage: {user.usedCapacity} / {user.includedCapacity} tasks
        </Text>
        <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
          No real payment processing is active in this frontend prototype.
        </Text>
        <PrimaryButton
          label="Request Enterprise Capacity Upgrade (Demo)"
          onPress={() =>
            showToast('Simulated sales inquiry logged for Enterprise SLA.')
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: '700',
  },
});