
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { DEMO_SERVICES } from '@/mocks/services';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function PublicServicesPage() {
  const { colors } = useAppTheme();
  const navigate = useNavigate();

  const handleServiceAction = (audience: string) => {
    navigate(
      audience === 'business'
        ? ROUTES.auth.login.business
        : ROUTES.auth.login.customer,
    );
  };

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.scrollContent}
    >
      <PublicNavbar />

      <View style={styles.container}>
        <StatusBadge label="PUBLIC SERVICE DIRECTORY · ILLUSTRATIVE" />

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Personal Concierge & Business Logistics Services
        </Text>

        <Text
          style={[
            styles.lead,
            { color: colors.secondaryText },
          ]}
        >
          Browse illustrative service categories available on
          SUBIDHA. Sign in as a Customer to book personal
          assistance or as a Business Partner to dispatch field
          tasks.
        </Text>

        <View style={styles.grid}>
          {DEMO_SERVICES.map((service) => (
            <View
              key={service.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.badgeRow}>
                <StatusBadge label={service.category} />
                <StatusBadge
                  label={`For ${service.audience}`}
                  tone="info"
                />
              </View>

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                {service.title}
              </Text>

              <Text
                style={[
                  styles.desc,
                  { color: colors.secondaryText },
                ]}
              >
                {service.fullDescription}
              </Text>

              <View style={styles.details}>
                <Text
                  style={[
                    styles.meta,
                    { color: colors.primaryAccent },
                  ]}
                >
                  Typical service window
                </Text>

                <Text
                  style={[
                    styles.detailValue,
                    { color: colors.primaryText },
                  ]}
                >
                  {service.estimatedDuration}
                </Text>

                <Text
                  style={[
                    styles.coverage,
                    { color: colors.secondaryText },
                  ]}
                >
                  {service.baseCoverageNote}
                </Text>
              </View>

              <View
                style={[
                  styles.expenseBox,
                  {
                    backgroundColor: colors.secondaryBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.expenseLabel,
                    { color: colors.primaryText },
                  ]}
                >
                  Expense information
                </Text>

                <Text
                  style={[
                    styles.expense,
                    { color: colors.secondaryText },
                  ]}
                >
                  {service.externalExpenseNote}
                </Text>
              </View>

              <View style={styles.action}>
                <PrimaryButton
                  label={
                    service.audience === 'business'
                      ? 'Sign In to Business Dispatch'
                      : 'Book This Service'
                  }
                  onPress={() =>
                    handleServiceAction(service.audience)
                  }
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <AppFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    gap: 14,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  lead: {
    fontSize: 16,
    lineHeight: 25,
    maxWidth: 780,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: 20,
  },
  card: {
    flex: 1,
    minWidth: 280,
    maxWidth: 600,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  details: {
    borderLeftWidth: 3,
    borderLeftColor: '#A3BFAE',
    paddingLeft: 12,
    gap: 4,
  },
  meta: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  coverage: {
    fontSize: 13,
    lineHeight: 20,
  },
  expenseBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 5,
  },
  expenseLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  expense: {
    fontSize: 12,
    lineHeight: 19,
  },
  action: {
    marginTop: 'auto',
    paddingTop: 4,
  },
});
