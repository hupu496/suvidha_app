
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Outlet, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppState } from '@/context/AppStateContext';
import { useAppTheme } from '@/context/ThemeContext';

import DashboardShell, {
  type NavItemConfig,
} from '@/components/layout/DashboardShell';

import { PrimaryButton } from '@/components/common/Buttons';

const BUSINESS_SIDEBAR_NAV: NavItemConfig[] = [
  {
    label: 'Dashboard',
    href: ROUTES.business.dashboard,
    icon: 'home',
  },
  {
    label: 'New Task Dispatch',
    href: ROUTES.business.tasks,
    icon: 'tasks',
  },
  {
    label: 'Fleet Tracker',
    href: ROUTES.business.fleet,
    icon: 'fleet',
  },
  {
    label: 'Subscriptions & Invoices',
    href: ROUTES.business.subscription,
    icon: 'bills',
  },
  {
    label: 'Merchant Profile',
    href: ROUTES.business.profile,
    icon: 'profile',
  },
];

const BUSINESS_BOTTOM_GRID: NavItemConfig[] = [
  {
    label: 'Dashboard',
    href: ROUTES.business.dashboard,
    icon: 'home',
  },
  {
    label: 'New Task',
    href: ROUTES.business.tasks,
    icon: 'tasks',
  },
  {
    label: 'Fleet',
    href: ROUTES.business.fleet,
    icon: 'fleet',
  },
  {
    label: 'Invoices',
    href: ROUTES.business.subscription,
    icon: 'bills',
  },
];

export default function BusinessLayout() {
  const { user } = useAppState();
  const { colors } = useAppTheme();
  const navigate = useNavigate();

  if (!user || user.role !== 'business') {
    return (
      <View
        style={[
          styles.guardBox,
          { backgroundColor: colors.background },
        ]}
      >
        <View
          style={[
            styles.guardCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.guardTitle,
              { color: colors.primaryText },
            ]}
          >
            Business Partner Account Required
          </Text>

          <Text
            style={[
              styles.guardDesc,
              { color: colors.secondaryText },
            ]}
          >
            Please sign in with a registered Business Partner
            mobile number (+91 9876501234).
          </Text>

          <PrimaryButton
            label="Sign In as Business Partner"
            onPress={() =>
              navigate(ROUTES.auth.login.business, {
                replace: true,
              })
            }
          />
        </View>
      </View>
    );
  }

  return (
    <DashboardShell
      roleLabel="PLAN: DEDICATED FLEET"
      navItems={BUSINESS_SIDEBAR_NAV}
      bottomGridItems={BUSINESS_BOTTOM_GRID}
      maxFrameWidth={1320}
      showLocationPromptOnHome
      locationPromptPath={ROUTES.business.dashboard}
    >
      <Outlet />
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  guardBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  guardCard: {
    maxWidth: 420,
    width: '100%',
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
    gap: 14,
  },
  guardTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  guardDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
});
