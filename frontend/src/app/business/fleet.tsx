import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function BusinessFleetPage() {
  const { colors } = useAppTheme();
  const { agents } = useAppState();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Fleet & Field Agent Overview (Simulated Roster)
      </Text>
      <Text style={[styles.sub, { color: colors.secondaryText }]}>
        Illustrative agent roster and availability states. Live GPS tracking is intentionally omitted in this frontend prototype.
      </Text>

      <View style={styles.grid}>
        {agents.map((ag) => (
          <View
            key={ag.id}
            style={[
              styles.card,
              { backgroundColor: colors.cardBackground, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.name, { color: colors.primaryText }]}>
                {ag.name}
              </Text>
              <StatusBadge
                label={ag.availability}
                tone={ag.availability === 'Available' ? 'accent' : 'warning'}
              />
            </View>
            <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
              Agent ID: {ag.agentCode} • Specialization: {ag.specialization}
            </Text>
            <Text style={{ color: colors.primaryAccent, fontSize: 13 }}>
              Current Task: {ag.currentTaskId || 'None (Ready for Dispatch)'}
            </Text>
            <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
              Service Rating: {ag.demoRating}
            </Text>
          </View>
        ))}
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
  sub: {
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    flex: 1,
    minWidth: 290,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
});