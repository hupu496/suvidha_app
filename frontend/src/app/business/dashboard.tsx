import React from 'react';
import { ROUTES } from '@/routes';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function BusinessDashboardPage() {
  const { colors } = useAppTheme();
  const { user, tasks, changeTaskStatus, showToast } = useAppState();
  const navigate = useNavigate();

  if (!user || user.role !== 'business') return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <StatusBadge label="B2B MERCHANT OPERATIONS CONTROL" />
        <Text style={[styles.title, { color: colors.primaryText }]}>
          {user.businessName}
        </Text>
        <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
          Hub: {user.businessAddress}
        </Text>
      </View>

      {/* Metric Cards from Page 2.1 Architecture */}
      <View style={styles.metricsRow}>
        <View
          style={[
            styles.metricBox,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.primaryAccent }]}>
            4 / 5
          </Text>
          <Text style={[styles.metricLabel, { color: colors.primaryText }]}>
            Active Fleet (Plan: DEDICATED)
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.warning }]}>12</Text>
          <Text style={[styles.metricLabel, { color: colors.primaryText }]}>
            Pending Tasks
          </Text>
        </View>

        <View
          style={[
            styles.metricBox,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.metricVal, { color: colors.primaryAccent }]}>
            84
          </Text>
          <Text style={[styles.metricLabel, { color: colors.primaryText }]}>
            Completed Today
          </Text>
        </View>
      </View>

      {/* Quick Dispatch Buttons */}
      <View style={styles.ctaRow}>
        <PrimaryButton
          label="+ Single Pickup"
          onPress={() => navigate(ROUTES.business.tasks)}
          style={{ flex: 1 }}
        />
        <SecondaryButton
          label="Batch Upload CSV / API"
          onPress={() =>
            showToast('Simulated CSV Batch Upload queued (POST /api/v1/b2b/tasks/create/).')
          }
          style={{ flex: 1 }}
        />
      </View>

      {/* Interactive Dispatch Table */}
      <View
        style={[
          styles.tablePanel,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.panelTitle, { color: colors.primaryText }]}>
          Interactive Dispatch Table
        </Text>

        {tasks.map((t) => (
          <View
            key={t.id}
            style={[styles.dispatchRow, { borderBottomColor: colors.border }]}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <View style={styles.badgeLine}>
                <Text style={[styles.taskCode, { color: colors.primaryText }]}>
                  #{t.id} • {t.taskCategory}
                </Text>
                <StatusBadge
                  label={t.status === 'In Transit' ? 'EN_ROUTE' : t.status.toUpperCase()}
                  tone={t.status === 'In Transit' ? 'info' : 'accent'}
                />
              </View>
              <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                Address: {t.destination}
              </Text>
              <Text style={{ color: colors.primaryAccent, fontSize: 12, fontWeight: '700' }}>
                Assigned: {t.assignedAgentName}
              </Text>
            </View>

            <View style={styles.actionCol}>
              <SecondaryButton
                label={t.status === 'Queued' ? 'Reassign' : 'Track'}
                onPress={() =>
                  t.status === 'Queued'
                    ? changeTaskStatus(t.id, 'Assigned')
                    : navigate(ROUTES.business.fleet)
                }
              />
            </View>
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
  headerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    minWidth: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  metricVal: {
    fontSize: 24,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tablePanel: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  panelTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  dispatchRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  badgeLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  taskCode: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionCol: {
    alignItems: 'flex-end',
  },
});