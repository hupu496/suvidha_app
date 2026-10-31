
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ROUTES } from '@/routes';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import {
  registerBusiness,
  normalizeIndianPhone,
} from '@/services/auth.service';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';

const businessSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required'),
  contactPersonName: z
    .string()
    .trim()
    .min(2, 'Contact person name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  businessEmail: z
    .string()
    .email('Enter a valid business email'),
  businessCategory: z
    .string()
    .trim()
    .min(2, 'Business category is required'),
  city: z.string().trim().min(2, 'City is required'),
  businessAddress: z
    .string()
    .trim()
    .min(5, 'Business address is required'),
  operationalSize: z
    .string()
    .trim()
    .min(2, 'Approximate operational need is required'),
  consentAccepted: z.boolean().refine((value) => value, {
    message: 'Please accept the partner terms and privacy notice',
  }),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

interface SignupLocationState {
  phone?: string;
}

export default function BusinessSignupPage() {
  const { colors } = useAppTheme();
  const {
    prefilledPhone,
    setSelectedRole,
    setPrefilledPhone,
  } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();
  const params = (location.state ?? {}) as SignupLocationState;

  const [submitError, setSubmitError] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: '',
      contactPersonName: '',
      phone: normalizeIndianPhone(params.phone || prefilledPhone || ''),
      businessEmail: '',
      businessCategory: 'Pharmacy / Retail / Clinic',
      city: 'Kolkata',
      businessAddress: '',
      operationalSize: '10–30 Daily Local Dispatches',
      consentAccepted: false,
    },
  });

  useEffect(() => {
    setSelectedRole('business');

    const phoneToUse = params.phone || prefilledPhone;

    if (phoneToUse) {
      setValue('phone', normalizeIndianPhone(phoneToUse), {
        shouldValidate: true,
      });
    }
  }, [params.phone, prefilledPhone, setSelectedRole, setValue]);

  const onSubmit = async (values: BusinessFormValues) => {
    setSubmitError('');

    const normalizedValues = {
      ...values,
      phone: normalizeIndianPhone(values.phone),
    };

    try {
      await registerBusiness(normalizedValues);

      setPrefilledPhone(normalizedValues.phone);
      setSelectedRole('business');

      navigate(ROUTES.auth.verifyOtp, {
        state: {
          phone: normalizedValues.phone,
          role: 'business',
        },
      });
    } catch {
      setSubmitError(
        'We could not complete your registration. Please check your details and try again.',
      );
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.outer}
      keyboardShouldPersistTaps="handled"
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
        <Text style={[styles.eyebrow, { color: colors.primaryAccent }]}>
          BUSINESS PARTNER ONBOARDING
        </Text>

        <Text style={[styles.title, { color: colors.primaryText }]}>
          Register Your Business Logistics Account
        </Text>

        <View
          style={[
            styles.onboardingBanner,
            {
              backgroundColor: colors.secondaryBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.onboardingText,
              { color: colors.secondaryText },
            ]}
          >
            How SUBIDHA Supports Partners: Centralize daily customer
            deliveries, inter-branch transfers, and field errands with
            predictable subscription capacity and verified agents.
          </Text>
        </View>

        <Controller
          control={control}
          name="businessName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Business / Organization Name *"
              placeholder="e.g., Greenleaf Diagnostics & Pharmacy"
              value={value}
              onChangeText={onChange}
              error={errors.businessName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="contactPersonName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Primary Contact Person *"
              placeholder="Operations Manager Name"
              value={value}
              onChangeText={onChange}
              error={errors.contactPersonName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Registered Business Mobile Number *"
              prefixText="+91"
              placeholder="9876501234"
              keyboardType="phone-pad"
              maxLength={10}
              value={value}
              onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
              error={errors.phone?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="businessEmail"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Business Email *"
              placeholder="ops@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.businessEmail?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="businessCategory"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Business Category *"
              placeholder="Pharmacy, Retail, Office, Diagnostic Lab"
              value={value}
              onChangeText={onChange}
              error={errors.businessCategory?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Operating City *"
              placeholder="Kolkata"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="businessAddress"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Primary Dispatch Hub / Business Address *"
              placeholder="Street address and landmark"
              value={value}
              onChangeText={onChange}
              error={errors.businessAddress?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="operationalSize"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Estimated Operational Needs *"
              placeholder="e.g., 15-40 daily dispatches"
              value={value}
              onChangeText={onChange}
              error={errors.operationalSize?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="consentAccepted"
          render={({ field: { onChange, value } }) => (
            <View style={styles.consentContainer}>
              <Pressable
                onPress={() => onChange(!value)}
                style={styles.checkboxRow}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: value }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: colors.primaryAccent,
                      backgroundColor: value
                        ? colors.primaryAccent
                        : 'transparent',
                    },
                  ]}
                >
                  {value ? (
                    <Text
                      style={[
                        styles.checkmark,
                        { color: colors.buttonTextOnAccent },
                      ]}
                    >
                      ✓
                    </Text>
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.consentText,
                    { color: colors.secondaryText },
                  ]}
                >
                  I accept the SUBIDHA Partner Logistics Terms and Privacy
                  Policy (Demo Account).
                </Text>
              </Pressable>

              {errors.consentAccepted ? (
                <Text style={[styles.errorText, { color: colors.sos }]}>
                  {errors.consentAccepted.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        {submitError ? (
          <Text
            accessibilityRole="alert"
            style={[styles.submitError, { color: colors.sos }]}
          >
            {submitError}
          </Text>
        ) : null}

        <PrimaryButton
          label="Register Partner & Verify OTP"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigate(ROUTES.auth.login.business)}
          style={styles.signInLink}
        >
          <Text
            style={[
              styles.signInText,
              { color: colors.primaryAccent },
            ]}
          >
            Already have a Partner account? Sign In
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSelectedRole('customer');
            navigate(ROUTES.auth.signup.customer);
          }}
          style={styles.signInLink}
        >
          <Text style={[styles.signInText, { color: colors.secondaryText }]}>
            Want to register as Customer? Register as Customer
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
    maxWidth: 560,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    maxWidth: 560,
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  onboardingBanner: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  onboardingText: {
    fontSize: 13,
    lineHeight: 20,
  },
  consentContainer: {
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 13,
    fontWeight: '700',
  },
  consentText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  submitError: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  signInLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
