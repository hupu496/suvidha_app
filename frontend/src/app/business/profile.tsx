import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function BusinessProfilePage() {
  const { colors } = useAppTheme();
  const { user } = useAppState();

  if (!user || user.role !== 'business') return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Business Partner Profile
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <StatusBadge label="REGISTERED PARTNER ORGANIZATION" />
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Business Name: {user.businessName}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Primary Contact: {user.contactPersonName}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Registered Mobile: +91 {user.phone}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Business Email: {user.businessEmail}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Category: {user.businessCategory}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Hub Address: {user.businessAddress}, {user.city}
        </Text>
        <Text style={[styles.row, { color: colors.primaryAccent }]}>
          Operational Scale: {user.operationalSize}
        </Text>
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
  row: {
    fontSize: 15,
    fontWeight: '500',
  },
});