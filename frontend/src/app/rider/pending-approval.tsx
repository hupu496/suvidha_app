
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { PrimaryButton } from '@/components/common/Buttons';

export default function RiderPendingApprovalPage() {
  const { colors } = useAppTheme();
  const navigate = useNavigate();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.outer}
    >
      <View style={styles.topRow}>
        <AppLogo />
        <ThemeToggle />
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
            styles.iconCircle,
            { backgroundColor: `${colors.primaryAccent}18` },
          ]}
        >
          <Text style={[styles.icon, { color: colors.primaryAccent }]}>
            ◷
          </Text>
        </View>

        <Text style={[styles.eyebrow, { color: colors.primaryAccent }]}>
          RIDER APPLICATION
        </Text>

        <Text style={[styles.title, { color: colors.primaryText }]}>
          Your application is under review
        </Text>

        <Text style={[styles.description, { color: colors.secondaryText }]}>
          Thank you for applying to become a SUBIDHA Rider. Our admin team
          needs to review your details and verification documents before
          activating your rider account.
        </Text>

        <View
          style={[
            styles.statusBox,
            { borderColor: colors.border, backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: colors.primaryAccent },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.statusTitle, { color: colors.primaryText }]}>
              Pending admin approval
            </Text>
            <Text style={[styles.statusDescription, { color: colors.secondaryText }]}>
              Your account is not yet approved for deliveries.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primaryText }]}>
          What happens next?
        </Text>

        {[
          'Our team reviews your registration details.',
          'Your identity and driving documents are checked.',
          'You can access rider features after approval.',
        ].map((item, index) => (
          <View key={item} style={styles.stepRow}>
            <View
              style={[
                styles.stepNumber,
                { borderColor: colors.border },
              ]}
            >
              <Text style={{ color: colors.primaryAccent, fontWeight: '700' }}>
                {index + 1}
              </Text>
            </View>
            <Text style={[styles.stepText, { color: colors.secondaryText }]}>
              {item}
            </Text>
          </View>
        ))}

        <PrimaryButton
          label="Back to Home"
          fullWidth
          onPress={() => navigate(ROUTES.home)}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigate(ROUTES.auth.login.rider)}
          style={styles.link}
        >
          <Text style={[styles.linkText, { color: colors.primaryAccent }]}>
            Already registered? Rider Sign In
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRow: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 36,
    fontWeight: '700',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  link: {
    marginTop: 18,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
