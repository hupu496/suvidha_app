
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { AppLogo } from '@/components/common/AppLogo';

type FooterLink = {
  label: string;
  href: string;
};

const PLATFORM_LINKS: FooterLink[] = [
  { label: 'Explore Services', href: ROUTES.services },
  { label: 'Subscription Plans', href: ROUTES.plans },
  { label: 'How It Works', href: ROUTES.about },
  { label: 'About SUBIDHA', href: ROUTES.about },
];

const ACCOUNT_LINKS: FooterLink[] = [
  { label: 'Customer Sign In', href: ROUTES.auth.login.customer },
  { label: 'Business Partner Sign In', href: ROUTES.auth.login.business },
  { label: 'Customer Registration', href: ROUTES.auth.signup.customer },
  { label: 'Business Registration', href: ROUTES.auth.signup.business },
];

export const AppFooter: React.FC = () => {
  const { colors } = useAppTheme();
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const isMobile = width < 768;

  const renderLink = (item: FooterLink) => (
    <Pressable
      key={item.label}
      onPress={() => navigate(item.href)}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.linkButton,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text
        style={[
          styles.linkText,
          { color: colors.secondaryText },
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.secondaryBackground,
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.mainContent,
            isMobile && styles.mainContentMobile,
          ]}
        >
          <View style={styles.brandSection}>
            <AppLogo size="lg" />

            <Text
              style={[
                styles.tagline,
                { color: colors.primaryText },
              ]}
            >
              Everyday essentials. Thoughtfully simplified.
            </Text>

            <Text
              style={[
                styles.description,
                { color: colors.secondaryText },
              ]}
            >
              Subscription-based personal assistance,
              trusted local escort support, and
              dedicated logistics for businesses.
            </Text>
          </View>

          <View
            style={[
              styles.linksGrid,
              isMobile && styles.linksGridMobile,
            ]}
          >
            <View style={styles.linkColumn}>
              <Text
                style={[
                  styles.columnTitle,
                  { color: colors.primaryText },
                ]}
              >
                Explore
              </Text>

              {PLATFORM_LINKS.map(renderLink)}
            </View>

            <View style={styles.linkColumn}>
              <Text
                style={[
                  styles.columnTitle,
                  { color: colors.primaryText },
                ]}
              >
                Account
              </Text>

              {ACCOUNT_LINKS.map(renderLink)}
            </View>
          </View>
        </View>

        <View
          style={[
            styles.bottomSection,
            { borderTopColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.bottomRow,
              isMobile && styles.bottomRowMobile,
            ]}
          >
            <Text
              style={[
                styles.copyright,
                { color: colors.secondaryText },
              ]}
            >
              © {new Date().getFullYear()} SUBIDHA.
              {' '}All rights reserved.
            </Text>

            <Text
              style={[
                styles.bottomLabel,
                { color: colors.secondaryText },
              ]}
            >
              Essential Support & Logistics Platform
            </Text>
          </View>

          <Text
            style={[
              styles.disclaimer,
              { color: colors.secondaryText },
            ]}
          >
            Prototype notice: Plans, ratings, bookings,
            and dispatch states currently use illustrative
            demo data. Backend integration with Django REST
            Framework is planned.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AppFooter;

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 48,
    paddingBottom: 28,
    paddingHorizontal: 24,
    marginTop: 48,
  },

  container: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
  },

  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 48,
    paddingBottom: 48,
  },

  mainContentMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 32,
    paddingBottom: 32,
  },

  brandSection: {
    flex: 1,
    maxWidth: 420,
    gap: 14,
  },

  tagline: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.4,
  },

  description: {
    fontSize: 14,
    lineHeight: 24,
    maxWidth: 390,
  },

  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 64,
    flex: 1,
  },

  linksGridMobile: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 32,
  },

  linkColumn: {
    minWidth: 145,
    gap: 14,
  },

  columnTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },

  linkButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    maxWidth: '100%',
  },

  linkText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
    flexShrink: 1,
  },

  bottomSection: {
    borderTopWidth: 1,
    paddingTop: 24,
    marginTop: 8,
    gap: 16,
    width: '100%',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },

  bottomRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },

  copyright: {
    fontSize: 12,
    lineHeight: 20,
    flexShrink: 1,
  },

  bottomLabel: {
    fontSize: 12,
    lineHeight: 20,
    flexShrink: 1,
  },

  disclaimer: {
    fontSize: 11,
    lineHeight: 18,
    maxWidth: 900,
    opacity: 0.8,
  },
});
