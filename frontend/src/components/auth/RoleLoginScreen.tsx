
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { UserRole } from '@/types';

import {
  isValidIndianPhone,
  loginWithPhone,
  normalizeIndianPhone,
} from '@/services/auth.service';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';
import { ModalDialog } from '@/components/common/ModalDialog';

interface RoleLoginScreenProps {
  initialRole: UserRole;
}

export const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({
  initialRole,
}) => {
  const { colors } = useAppTheme();

  const {
    selectedRole,
    setSelectedRole,
    prefilledPhone,
    setPrefilledPhone,
  } = useAppState();

  const { width } = useWindowDimensions();
  const isMobile = width <= 600;

  const navigate = useNavigate();

  // Rider is fixed to the dedicated Rider login route.
  // Customer and Business can switch between their roles.
  const [role, setRole] = useState<UserRole>(initialRole);

  const [phone, setPhone] = useState<string>(prefilledPhone || '');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [unregisteredModalVisible, setUnregisteredModalVisible] =
    useState<boolean>(false);

  // Keep the selected role synchronized with the current route.
  useEffect(() => {
    setRole(initialRole);
    setSelectedRole(initialRole);
  }, [initialRole, setSelectedRole]);

  // Restore a phone number passed from registration.
  useEffect(() => {
    if (prefilledPhone) {
      setPhone(prefilledPhone);
    }
  }, [prefilledPhone]);

  // Get the signup route for the selected account type.
  const getSignupRoute = (currentRole: UserRole) => {
    switch (currentRole) {
      case 'customer':
        return ROUTES.auth.signup.customer;

      case 'business':
        return ROUTES.auth.signup.business;

      case 'rider':
        return ROUTES.auth.signup.rider;

      default:
        return ROUTES.auth.signup.customer;
    }
  };

  // Switch only between Customer and Business.
  const handleRoleSwitch = (nextRole: UserRole) => {
    if (initialRole === 'rider' || nextRole === 'rider') {
      return;
    }

    setRole(nextRole);
    setSelectedRole(nextRole);

    setError('');
    setPhone('');
    setPrefilledPhone('');

    const loginRoute =
      nextRole === 'customer'
        ? ROUTES.auth.login.customer
        : ROUTES.auth.login.business;

    navigate(loginRoute, { replace: true });
  };

  // Validate the phone number and check whether the account exists.
  const handleContinue = async () => {
    if (loading) return;

    setError('');

    const cleaned = normalizeIndianPhone(phone);

    if (!isValidIndianPhone(cleaned)) {
      setError(
        'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      );
      return;
    }

    setLoading(true);

    try {
      const lookup = await loginWithPhone(cleaned, role);

      setPrefilledPhone(cleaned);

      if (lookup.exists) {
        navigate(ROUTES.auth.verifyOtp, {
          state: {
            phone: cleaned,
            role,
          },
        });
      } else {
        setUnregisteredModalVisible(true);
      }
    } catch {
      setError('Unable to continue right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the appropriate registration page.
  const handleRegisterNow = () => {
    const cleaned = normalizeIndianPhone(phone);

    setPrefilledPhone(cleaned);
    setSelectedRole(role);
    setUnregisteredModalVisible(false);

    navigate(getSignupRoute(role), {
      state: {
        phone: cleaned,
        role,
      },
    });
  };

  // Open registration directly.
  const handleSignupNavigation = () => {
    const cleaned = normalizeIndianPhone(phone);

    setPrefilledPhone(cleaned);
    setSelectedRole(role);

    navigate(getSignupRoute(role), {
      state: {
        phone: cleaned,
        role,
      },
    });
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={[
        styles.outer,
        isMobile && styles.mobileOuter,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.topRow}>
        <AppLogo />
        <ThemeToggle />
      </View>

      {/* Login Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.eyebrow,
            { color: colors.primaryAccent },
          ]}
        >
          ACCOUNT AUTHENTICATION
        </Text>

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Welcome to SUBIDHA
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText },
          ]}
        >
          {role === 'rider'
            ? 'Sign in to your SUBIDHA Rider account using your registered mobile number.'
            : 'Select your account type and enter your registered mobile number.'}
        </Text>

        {/* Rider-only information */}
        {initialRole === 'rider' ? (
          <View
            style={[
              styles.riderInfoBox,
              {
                backgroundColor: colors.secondaryBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: colors.primaryAccent,
                fontWeight: '800',
                fontSize: 13,
                letterSpacing: 0.5,
              }}
            >
              RIDER ACCOUNT LOGIN
            </Text>

            <Text
              style={{
                color: colors.secondaryText,
                fontSize: 13,
                marginTop: 5,
                lineHeight: 19,
              }}
            >
              Access your delivery tasks, earnings, and rider profile after
              your application has been approved.
            </Text>
          </View>
        ) : (
          /* Customer and Business role selector */
          <View
            style={[
              styles.roleSwitcher,
              {
                backgroundColor: colors.secondaryBackground,
                borderColor: colors.border,
              },
            ]}
          >
            {(['customer', 'business'] as UserRole[]).map((item) => {
              const active = role === item;

              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => handleRoleSwitch(item)}
                  style={[
                    styles.roleTab,
                    {
                      backgroundColor: active
                        ? colors.primaryAccent
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleTabText,
                      {
                        color: active
                          ? colors.buttonTextOnAccent
                          : colors.secondaryText,
                      },
                    ]}
                  >
                    {item === 'customer' ? 'Customer' : 'Business'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Phone Number */}
        <FormField
          label="Indian Mobile Number"
          prefixText="+91"
          placeholder="9876543210"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={(value) => {
            setPhone(value.replace(/\D/g, ''));

            if (error) {
              setError('');
            }
          }}
          error={error}
          helperText={
            role === 'customer'
              ? 'Demo registered Customer number: 9876543210'
              : role === 'business'
                ? 'Demo registered Business number: 9876501234'
                : 'Enter your registered Rider mobile number.'
          }
        />

        {/* Continue */}
        <PrimaryButton
          label="Continue"
          fullWidth
          loading={loading}
          onPress={handleContinue}
        />

        {/* Registration and navigation links */}
        <View style={styles.linksFooter}>
          <Pressable
            accessibilityRole="button"
            onPress={handleSignupNavigation}
          >
            <Text
              style={[
                styles.linkText,
                { color: colors.primaryAccent },
              ]}
            >
              {role === 'rider'
                ? 'New Rider? Register here'
                : `New to SUBIDHA? Register as ${
                    role === 'customer' ? 'Customer' : 'Business'
                  }`}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => navigate(ROUTES.home)}
          >
            <Text
              style={[
                styles.backLink,
                { color: colors.secondaryText },
              ]}
            >
              ← Back to Home
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Unregistered Number Modal */}
      <ModalDialog
        visible={unregisteredModalVisible}
        title="This mobile number is not registered."
        description={
          role === 'rider'
            ? 'You do not have a Rider application yet. Register as a Rider to join SUBIDHA.'
            : 'Create your SUBIDHA account to continue.'
        }
        primaryLabel={
          role === 'rider' ? 'Register as Rider' : 'Register Now'
        }
        secondaryLabel="Cancel"
        onPrimaryPress={handleRegisterNow}
        onSecondaryPress={() => setUnregisteredModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mobileOuter: {
    justifyContent: 'flex-start',
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },

  topRow: {
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    borderWidth: 1,
    padding: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },

  roleSwitcher: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
  },

  roleTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  riderInfoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },

  linksFooter: {
    marginTop: 22,
    alignItems: 'center',
    gap: 12,
  },

  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  backLink: {
    fontSize: 13,
  },
});
