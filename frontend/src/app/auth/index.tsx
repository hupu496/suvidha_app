
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Truck } from 'lucide-react';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  PrimaryButton,
  SecondaryButton,
} from '@/components/common/Buttons';

export default function AuthGatewayPage() {
  const { colors } = useAppTheme();
  const { setSelectedRole } = useAppState();
  const navigate = useNavigate();

  const openPortal = (
    role: 'customer' | 'business',
    destination: string,
  ) => {
    setSelectedRole(role);
    navigate(destination);
  };

  return (
    <ScrollView
      style={[
        styles.scrollView,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.container}
    >
      <View style={styles.topBar}>
        <AppLogo />
        <ThemeToggle />
      </View>

      <View style={styles.heading}>
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          YOUR SUBIDHA ACCOUNT
        </Text>

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Choose Your SUBIDHA Portal
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText },
          ]}
        >
          Customer and Business accounts use separate
          workspaces and registration records.
        </Text>
      </View>

      <View style={styles.grid}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <UserCheck
              size={28}
              color={colors.primaryAccent}
            />
          </View>

          <Text
            style={[
              styles.cardTitle,
              { color: colors.primaryText },
            ]}
          >
            Customer / Individual
          </Text>

          <Text
            style={[
              styles.cardDesc,
              { color: colors.secondaryText },
            ]}
          >
            Personal assistance, non-clinical medical escort
            support, errands, and tourist guidance.
          </Text>

          <View style={styles.actions}>
            <PrimaryButton
              label="Customer Sign In"
              fullWidth
              onPress={() =>
                openPortal(
                  'customer',
                  ROUTES.auth.login.customer,
                )
              }
            />

            <SecondaryButton
              label="Register as Customer"
              fullWidth
              onPress={() =>
                openPortal(
                  'customer',
                  ROUTES.auth.signup.customer,
                )
              }
            />
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.secondaryBackground },
            ]}
          >
            <Truck
              size={28}
              color={colors.primaryAccent}
            />
          </View>

          <Text
            style={[
              styles.cardTitle,
              { color: colors.primaryText },
            ]}
          >
            Business / Partner
          </Text>

          <Text
            style={[
              styles.cardDesc,
              { color: colors.secondaryText },
            ]}
          >
            B2B delivery dispatches, pharmacy and retail runs,
            and field fleet management.
          </Text>

          <View style={styles.actions}>
            <PrimaryButton
              label="Business Sign In"
              fullWidth
              onPress={() =>
                openPortal(
                  'business',
                  ROUTES.auth.login.business,
                )
              }
            />

            <SecondaryButton
              label="Register Business Partner"
              fullWidth
              onPress={() =>
                openPortal(
                  'business',
                  ROUTES.auth.signup.business,
                )
              }
            />
          </View>
        </View>
      </View>

      <Text
        style={[
          styles.footerNote,
          { color: colors.secondaryText },
        ]}
      >
        Choose the account type that matches how you use SUBIDHA.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  topBar: {
    width: '100%',
    maxWidth: 820,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 44,
  },
  heading: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
    marginBottom: 30,
    gap: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 30,
    lineHeight: 39,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 520,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    gap: 20,
    maxWidth: 820,
    width: '100%',
  },
  card: {
    flex: 1,
    minWidth: 280,
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  actions: {
    gap: 10,
    marginTop: 8,
  },
  footerNote: {
    marginTop: 28,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
  },
});
