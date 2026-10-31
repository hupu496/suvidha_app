import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function CustomerProfilePage() {
  const { colors } = useAppTheme();
  const { user } = useAppState();

  if (!user || user.role !== 'customer') return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Customer Profile & Emergency Contacts
      </Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <StatusBadge label="DEMO CUSTOMER PROFILE" />
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Full Name: {user.fullName}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Registered Mobile: +91 {user.phone}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Email: {user.email || 'Not provided'}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          City: {user.city}
        </Text>
        <Text style={[styles.row, { color: colors.primaryText }]}>
          Preferred Language: {user.preferredLanguage}
        </Text>
        <Text style={[styles.row, { color: colors.primaryAccent }]}>
          Emergency Contact: {user.emergencyContactName || 'Meera Sen'} (+91{' '}
          {user.emergencyContactPhone || '9876543211'})
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