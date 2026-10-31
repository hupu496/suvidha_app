
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
import { registerCustomer } from '@/services/auth.service';
import { normalizeIndianPhone } from '@/services/auth.service';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';

const customerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  city: z.string().trim().min(2, 'City is required'),
  preferredLanguage: z
    .string()
    .trim()
    .min(2, 'Preferred language is required'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^[6-9]\d{9}$/.test(value),
      'Enter a valid 10-digit emergency contact number',
    ),
  consentAccepted: z.boolean().refine((value) => value, {
    message: 'You must accept the terms and privacy notice to continue',
  }),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface SignupLocationState {
  phone?: string;
}

export default function CustomerSignupPage() {
  const { colors } = useAppTheme();
  const { prefilledPhone, setSelectedRole, setPrefilledPhone } = useAppState();

  const navigate = useNavigate();
  const location = useLocation();

  const params = (location.state ?? {}) as SignupLocationState;

  const [submitError, setSubmitError] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      fullName: '',
      phone: normalizeIndianPhone(params.phone || prefilledPhone || ''),
      email: '',
      city: 'Kolkata',
      preferredLanguage: 'English',
      emergencyContactName: '',
      emergencyContactPhone: '',
      consentAccepted: false,
    },
  });

  useEffect(() => {
    setSelectedRole('customer');

    const phoneToUse = params.phone || prefilledPhone;

    if (phoneToUse) {
      setValue('phone', normalizeIndianPhone(phoneToUse), {
        shouldValidate: true,
      });
    }
  }, [params.phone, prefilledPhone, setSelectedRole, setValue]);

  const onSubmit = async (values: CustomerFormValues) => {
    setSubmitError('');

    const normalizedValues = {
      ...values,
      phone: normalizeIndianPhone(values.phone),
      emergencyContactPhone: values.emergencyContactPhone
        ? normalizeIndianPhone(values.emergencyContactPhone)
        : '',
    };

    try {
      await registerCustomer(normalizedValues);

      setPrefilledPhone(normalizedValues.phone);
      setSelectedRole('customer');

      navigate(ROUTES.auth.verifyOtp, {
        state: {
          phone: normalizedValues.phone,
          role: 'customer',
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
          CUSTOMER REGISTRATION
        </Text>

        <Text style={[styles.title, { color: colors.primaryText }]}>
          Create Your Personal Assistance Account
        </Text>

        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Register your mobile number for individual or family concierge
          services.
        </Text>

        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Full Name *"
              placeholder="e.g., Sohini Dutta"
              value={value}
              onChangeText={onChange}
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Mobile Number *"
              prefixText="+91"
              placeholder="9876543210"
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
          name="email"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Email Address (Optional)"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="City *"
              placeholder="Kolkata"
              value={value}
              onChangeText={onChange}
              error={errors.city?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="preferredLanguage"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Preferred Language *"
              placeholder="English / Bengali / Hindi"
              value={value}
              onChangeText={onChange}
              error={errors.preferredLanguage?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactName"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Emergency Contact Name (Optional)"
              placeholder="Family contact name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="emergencyContactPhone"
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Emergency Contact Phone (Optional)"
              prefixText="+91"
              placeholder="9876543211"
              keyboardType="phone-pad"
              maxLength={10}
              value={value}
              onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
              error={errors.emergencyContactPhone?.message}
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
                  I agree to the SUBIDHA Terms of Service and Privacy Policy
                  (Demo Account).
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
          label="Register & Proceed to OTP"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        <Pressable
          accessibilityRole="button"
          onPress={() => navigate(ROUTES.auth.login.customer)}
          style={styles.signInLink}
        >
          <Text
            style={[
              styles.signInText,
              { color: colors.primaryAccent },
            ]}
          >
            Already registered? Sign In
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSelectedRole('business');
            navigate(ROUTES.auth.signup.business);
          }}
          style={styles.signInLink}
        >
          <Text style={[styles.signInText, { color: colors.secondaryText }]}>
            Want to register as Business? Register as Business Partner
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
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
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
