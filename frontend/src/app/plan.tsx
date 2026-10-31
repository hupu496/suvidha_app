
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { DEMO_PLANS } from '@/mocks/services';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { AppFooter } from '@/components/layout/AppFooter';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function PlansPage() {
  const { colors } = useAppTheme();
  const navigate = useNavigate();

  const handleRegister = (audience: string) => {
    const isBusiness =
      audience === 'business' || audience === 'enterprise';

    navigate(
      isBusiness
        ? ROUTES.auth.signup.business
        : ROUTES.auth.signup.customer,
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
        <StatusBadge label="ILLUSTRATIVE SUBSCRIPTION PLANS" />

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Transparent Membership & Operational Plans
        </Text>

        <Text
          style={[
            styles.lead,
            { color: colors.secondaryText },
          ]}
        >
          Choose an Individual, Tourist, Business, or Enterprise
          demo plan. No real payments are processed in this
          frontend prototype.
        </Text>

        <View style={styles.grid}>
          {DEMO_PLANS.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <StatusBadge
                label={plan.badge || plan.audience}
              />

              <Text
                style={[
                  styles.cardTitle,
                  { color: colors.primaryText },
                ]}
              >
                {plan.name}
              </Text>

              <Text
                style={[
                  styles.price,
                  { color: colors.primaryAccent },
                ]}
              >
                {plan.priceDisplay}{' '}
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '400',
                    color: colors.secondaryText,
                  }}
                >
                  {plan.billingPeriod}
                </Text>
              </Text>

              <Text
                style={[
                  styles.desc,
                  { color: colors.secondaryText },
                ]}
              >
                {plan.description}
              </Text>

              <View style={styles.featuresList}>
                {plan.features.map((feature) => (
                  <View
                    key={feature}
                    style={styles.featureRow}
                  >
                    <CheckCircle2
                      size={16}
                      color={colors.primaryAccent}
                    />

                    <Text
                      style={[
                        styles.featureText,
                        { color: colors.primaryText },
                      ]}
                    >
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.policyBox,
                  {
                    backgroundColor:
                      colors.secondaryBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.policyLabel,
                    { color: colors.primaryText },
                  ]}
                >
                  External Expense Policy
                </Text>

                <Text
                  style={[
                    styles.policy,
                    { color: colors.secondaryText },
                  ]}
                >
                  {plan.externalExpensePolicy}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  label={
                    plan.audience === 'business' ||
                    plan.audience === 'enterprise'
                      ? 'Register Business Account'
                      : 'Register Customer Account'
                  }
                  onPress={() => handleRegister(plan.audience)}
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
    maxWidth: 760,
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
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  price: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '800',
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
  },
  featuresList: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  policyBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 5,
    marginTop: 4,
  },
  policyLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  policy: {
    fontSize: 12,
    lineHeight: 18,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 4,
  },
});
