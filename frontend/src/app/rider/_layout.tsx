
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppState } from '@/context/AppStateContext';

import DashboardShell, {
  type NavItemConfig,
} from '@/components/layout/DashboardShell';

const RIDER_SIDEBAR_NAV: NavItemConfig[] = [
  {
    label: 'Dashboard',
    href: ROUTES.rider.dashboard,
    icon: 'home',
  },
  {
    label: 'My Deliveries',
    href: ROUTES.rider.deliveries,
    icon: 'tasks',
  },
  {
    label: 'Earnings',
    href: ROUTES.rider.earnings,
    icon: 'bills',
  },
  {
    label: 'My Profile',
    href: ROUTES.rider.profile,
    icon: 'profile',
  },
];

const RIDER_BOTTOM_NAV: NavItemConfig[] = [
  {
    label: 'Home',
    href: ROUTES.rider.dashboard,
    icon: 'home',
  },
  {
    label: 'Deliveries',
    href: ROUTES.rider.deliveries,
    icon: 'tasks',
  },
  {
    label: 'Earnings',
    href: ROUTES.rider.earnings,
    icon: 'bills',
  },
  {
    label: 'Profile',
    href: ROUTES.rider.profile,
    icon: 'profile',
  },
];

export default function RiderLayout() {
  const { user } = useAppState();
  const navigate = useNavigate();

  // Prevent users with another role from accessing the Rider portal.
  if (!user || user.role !== 'rider') {
    navigate(ROUTES.home, { replace: true });
    return null;
  }

  return (
    <DashboardShell
      roleLabel="RIDER PARTNER"
      navItems={RIDER_SIDEBAR_NAV}
      bottomGridItems={RIDER_BOTTOM_NAV}
      maxFrameWidth={1320}
      showLocationPromptOnHome
      locationPromptPath={ROUTES.rider.dashboard}
    >
      <Outlet />
    </DashboardShell>
  );
}
