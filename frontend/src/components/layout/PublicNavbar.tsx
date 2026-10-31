
import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SecondaryButton } from '@/components/common/Buttons';

type NavItem = {
  label: string;
  href?: string;
  action?: () => void;
};

export const PublicNavbar: React.FC = () => {
  const { colors } = useAppTheme();
  const { user, setSelectedRole } = useAppState();

  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDesktop = width >= 1024;

  // Rider access is intentionally excluded from the public navbar.
  // Riders can enter through the Rider card on the landing page.
  const navItems: NavItem[] = [
    {
      label: 'Services',
      href: ROUTES.services,
    },
    {
      label: 'How It Works',
      href: ROUTES.about,
    },
    {
      label: 'Subscription Plans',
      href: ROUTES.plans,
    },
    {
      label: 'For Businesses',
      action: () => {
        setSelectedRole('business');
        navigate(ROUTES.auth.login.business);
      },
    },
    {
      label: 'For Individuals',
      action: () => {
        setSelectedRole('customer');
        navigate(ROUTES.auth.login.customer);
      },
    },
    {
      label: 'About Us',
      href: ROUTES.about,
    },
  ];

  const handleDashboardRedirect = () => {
    if (!user) {
      navigate(ROUTES.auth.index);
      return;
    }

    switch (user.role) {
      case 'customer':
        navigate(ROUTES.customer.dashboard);
        break;

      case 'business':
        navigate(ROUTES.business.dashboard);
        break;

      case 'rider':
        navigate(ROUTES.rider.dashboard);
        break;
    }
  };

  const handleNavItemPress = (item: NavItem) => {
    setMobileMenuOpen(false);

    if (item.action) {
      item.action();
      return;
    }

    if (item.href) {
      navigate(item.href);
    }
  };

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    navigate(ROUTES.auth.login.index);
  };

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.inner}>
        <AppLogo />

        {/* Desktop Navigation */}
        {isDesktop && (
          <View style={styles.desktopLinks}>
            {navItems.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => handleNavItemPress(item)}
                style={({ pressed }) => [
                  styles.navPressable,
                  { opacity: pressed ? 0.65 : 1 },
                ]}
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.navLink,
                    { color: colors.secondaryText },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Header Actions */}
        <View style={styles.rightActions}>
          <ThemeToggle />

          {isDesktop ? (
            user ? (
              <SecondaryButton
                label={
                  user.role === 'customer'
                    ? 'Customer Dashboard'
                    : user.role === 'business'
                      ? 'Business Console'
                      : 'Rider Dashboard'
                }
                onPress={handleDashboardRedirect}
              />
            ) : (
              <SecondaryButton
                label="Sign In"
                onPress={handleSignIn}
              />
            )
          ) : (
            <Pressable
              onPress={() => setMobileMenuOpen((open) => !open)}
              accessibilityRole="button"
              accessibilityLabel={
                mobileMenuOpen
                  ? 'Close navigation menu'
                  : 'Open navigation menu'
              }
              style={[
                styles.menuBtn,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              {mobileMenuOpen ? (
                <X size={20} color={colors.primaryText} />
              ) : (
                <Menu size={20} color={colors.primaryText} />
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Mobile Navigation */}
      {!isDesktop && mobileMenuOpen && (
        <View
          style={[
            styles.mobileDrawer,
            {
              backgroundColor: colors.secondaryBackground,
              borderTopColor: colors.border,
            },
          ]}
        >
          {navItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => handleNavItemPress(item)}
              style={styles.mobileLinkItem}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.mobileLinkText,
                  { color: colors.primaryText },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}

          <View style={styles.mobileCtaRow}>
            {user ? (
              <SecondaryButton
                label="Open Dashboard"
                fullWidth
                onPress={() => {
                  setMobileMenuOpen(false);
                  handleDashboardRedirect();
                }}
              />
            ) : (
              <SecondaryButton
                label="Sign In"
                fullWidth
                onPress={handleSignIn}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default PublicNavbar;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    width: '100%',
    zIndex: 10,
  },

  inner: {
    maxWidth: 1360,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },

  desktopLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 24,
    flex: 1,
  },

  navPressable: {
    paddingVertical: 6,
  },

  navLink: {
    fontSize: 14,
    fontWeight: '600',
  },

  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  menuBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
  },

  mobileDrawer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 10,
  },

  mobileLinkItem: {
    paddingVertical: 10,
  },

  mobileLinkText: {
    fontSize: 15,
    fontWeight: '600',
  },

  mobileCtaRow: {
    marginTop: 8,
    gap: 10,
  },
});
