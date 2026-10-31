
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { UserRole } from '@/types';
import { API_CONFIG } from '@/services/api.config';
import {
  getPendingAuthAttempt,
  verifyDemoOtp,
} from '@/services/auth.service';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { OtpSixBoxInput } from '@/components/common/OtpSixBoxInput';
import { PrimaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

interface VerifyLocationState {
  phone?: string;
  role?: UserRole;
}

export default function VerifyOtpPage() {
  const { colors } = useAppTheme();

  const {
    setAuthenticatedUser,
    showToast,
    selectedRole,
    prefilledPhone,
  } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();
  const params = (location.state ?? {}) as VerifyLocationState;

  const pending = getPendingAuthAttempt();

  const activePhone =
    params.phone || pending?.phone || prefilledPhone || '';

  const activeRole: UserRole =
    params.role || pending?.role || selectedRole;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
      setLockoutSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (loading || lockoutSeconds > 0) return;

    setError('');

    if (!activePhone) {
      setError('Mobile number not found. Please return to login and try again.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter all 6 digits in the OTP boxes.');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyDemoOtp(otp, activePhone, activeRole);

      if (!result.success || !result.user) {
        const nextFailedAttempts = failedAttempts + 1;
        setFailedAttempts(nextFailedAttempts);

        if (nextFailedAttempts >= 5) {
          setLockoutSeconds(30);
          setOtp('');
          setError(
            'Too many invalid attempts. Verification is locked for 30 seconds.',
          );
        } else {
          setError(result.error || 'Invalid OTP code.');
        }

        return;
      }

      setAuthenticatedUser(result.user);

      showToast(
        `Verified! Welcome ${
          result.user.role === 'customer'
            ? result.user.fullName
            : result.user.role === 'business'
            ? result.user.businessName
            : result.user.fullName
        }`,
      );

      
let destination: string;

switch (result.user.role) {
  case 'customer':
    destination = ROUTES.customer.dashboard;
    break;

  case 'business':
    destination = ROUTES.business.dashboard;
    break;

  case 'rider':
    destination =
      result.user.applicationStatus === 'approved'
        ? ROUTES.rider.dashboard
        : ROUTES.rider.pendingApproval;
    break;
}

navigate(destination, { replace: true });

    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown > 0 || loading) return;

    setCountdown(30);
    setOtp('');
    setError('');

    // Demo flow: this resets the local timer; it does not send an SMS.
    showToast(
      `Demo OTP: ${API_CONFIG.DEMO_OTP_CODE}. No SMS was sent.`,
    );
  };

  const handleChangeNumber = () => {
    const loginRoute =
      activeRole === 'customer'
        ? ROUTES.auth.login.customer
        : activeRole === 'business'
          ? ROUTES.auth.login.business
          : ROUTES.auth.login.rider;

    navigate(loginRoute);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.pinnedHeader,
          {
            backgroundColor: colors.secondaryBackground,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.pinnedHeaderInner}>
          <AppLogo size="md" />
          <ThemeToggle />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.outer}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <StatusBadge
            label={`6-BOX OTP VERIFICATION • ${activeRole.toUpperCase()}`}
          />

          <Text style={[styles.title, { color: colors.primaryText }]}>
            Verify Mobile Number
          </Text>

          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Enter the 6-digit code sent to +91{' '}
            {activePhone || 'your mobile number'}.
            No SMS is sent in demo mode.
          </Text>

          <OtpSixBoxInput
            value={otp}
            onChange={(value) => {
              setOtp(value);
              if (error) setError('');
            }}
            error={error}
            disabled={lockoutSeconds > 0 || loading}
          />

          <View
            style={[
              styles.devHint,
              {
                backgroundColor: colors.secondaryBackground,
                borderColor: colors.border,
              },
            ]}
          >
            <ShieldCheck size={16} color={colors.primaryAccent} />

            <Text
              style={[
                styles.devHintText,
                { color: colors.primaryAccent },
              ]}
            >
              Demo OTP: {API_CONFIG.DEMO_OTP_CODE}. Verification allows up to
              five failed attempts before a temporary lockout.
            </Text>
          </View>

          <PrimaryButton
            label={
              lockoutSeconds > 0
                ? `Locked (${lockoutSeconds}s)`
                : 'Verify & Continue'
            }
            fullWidth
            disabled={lockoutSeconds > 0 || !activePhone}
            loading={loading}
            onPress={handleVerify}
          />

          <View style={styles.footerLinks}>
            <Pressable
              accessibilityRole="button"
              disabled={countdown > 0 || loading}
              onPress={handleResendOtp}
            >
              <Text
                style={[
                  styles.footerLink,
                  {
                    color:
                      countdown > 0 || loading
                        ? colors.secondaryText
                        : colors.primaryAccent,
                  },
                ]}
              >
                {countdown > 0
                  ? `Resend OTP in ${countdown}s`
                  : 'Resend 6-Digit OTP'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={handleChangeNumber}
            >
              <Text
                style={[
                  styles.changeNumberLink,
                  { color: colors.secondaryText },
                ]}
              >
                ← Change mobile number
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  pinnedHeader: {
    borderBottomWidth: 1,
    width: '100%',
  },
  pinnedHeaderInner: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  outer: {
    flexGrow: 1,
    padding: 18,
    paddingTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  devHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  devHintText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  footerLinks: {
    marginTop: 14,
    alignItems: 'center',
    gap: 10,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  changeNumberLink: {
    fontSize: 13,
  },
});
