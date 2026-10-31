
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
  normalizeIndianPhone,
  registerRider,
} from '@/services/auth.service';

import { AppLogo } from '@/components/common/AppLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton } from '@/components/common/Buttons';

// ---------------------------------------------------------
// VALIDATION SCHEMA
// ---------------------------------------------------------

const riderSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),

  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      'Enter a valid 10-digit Indian mobile number',
    ),

  email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),

  city: z.string().trim().min(2, 'Enter your city'),

  address: z
    .string()
    .trim()
    .min(5, 'Enter your complete address'),

  vehicleType: z.enum([
    'bicycle',
    'motorcycle',
    'scooter',
    'other',
  ]),

  vehicleRegistrationNumber: z
    .string()
    .trim()
    .min(4, 'Enter your vehicle registration number'),

  drivingLicenseNumber: z
    .string()
    .trim()
    .min(5, 'Enter your driving licence number'),

  // PAN is mandatory for this registration flow.
  identityType: z.literal('pan_card'),

  identityNumber: z
    .string()
    .trim()
    .regex(
      /^[A-Z]{5}[0-9]{4}[A-Z]$/,
      'Enter a valid PAN number (e.g. ABCDE1234F)',
    ),

  accountHolderName: z
    .string()
    .trim()
    .min(2, 'Enter the bank account holder name'),

  accountNumber: z
    .string()
    .trim()
    .regex(
      /^\d{9,18}$/,
      'Enter a valid bank account number',
    ),

  ifscCode: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/,
      'Enter a valid IFSC code',
    ),

  consentAccepted: z.boolean().refine(
    (value) => value,
    {
      message: 'You must accept the terms and privacy notice',
    },
  ),
});

type RiderFormValues = z.infer<typeof riderSchema>;

interface SignupLocationState {
  phone?: string;
}

// ---------------------------------------------------------
// DOCUMENT CONFIGURATION
// ---------------------------------------------------------

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB

// ---------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------

export default function RiderSignupPage() {
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
  const [notice, setNotice] = useState('');

  // Selected combined PDF.
  const [riderDocument, setRiderDocument] =
    useState<File | null>(null);

  const [documentError, setDocumentError] = useState('');

  // -------------------------------------------------------
  // FORM SETUP
  // -------------------------------------------------------

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RiderFormValues>({
    resolver: zodResolver(riderSchema),

    defaultValues: {
      fullName: '',
      phone: normalizeIndianPhone(
        params.phone || prefilledPhone || '',
      ),
      email: '',
      city: '',
      address: '',

      vehicleType: 'motorcycle',

      vehicleRegistrationNumber: '',
      drivingLicenseNumber: '',

      identityType: 'pan_card',
      identityNumber: '',

      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',

      consentAccepted: false,
    },
  });

  const vehicleType = watch('vehicleType');
  const consentAccepted = watch('consentAccepted');

  // -------------------------------------------------------
  // INITIAL ROLE AND PHONE
  // -------------------------------------------------------

  useEffect(() => {
    setSelectedRole('rider');

    const phoneToUse = params.phone || prefilledPhone;

    if (phoneToUse) {
      setValue(
        'phone',
        normalizeIndianPhone(phoneToUse),
        { shouldValidate: true },
      );
    }
  }, [
    params.phone,
    prefilledPhone,
    setSelectedRole,
    setValue,
  ]);

  // -------------------------------------------------------
  // PDF DOCUMENT SELECTION
  // -------------------------------------------------------

  const handleDocumentChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setDocumentError('');

    if (!file) {
      return;
    }

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setRiderDocument(null);

      setDocumentError(
        'Invalid file. Please upload a PDF document.',
      );

      event.target.value = '';
      return;
    }

    if (file.size === 0) {
      setRiderDocument(null);

      setDocumentError(
        'The selected PDF is empty.',
      );

      event.target.value = '';
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      setRiderDocument(null);

      setDocumentError(
        'The PDF must be 10 MB or smaller.',
      );

      event.target.value = '';
      return;
    }

    setRiderDocument(file);
  };

  const removeDocument = () => {
    setRiderDocument(null);
    setDocumentError('');

    const input = document.getElementById(
      'rider-document-upload',
    ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  };

  // -------------------------------------------------------
  // FORM SUBMISSION
  // -------------------------------------------------------

  const onSubmit = async (values: RiderFormValues) => {
    setSubmitError('');
    setNotice('');
    setDocumentError('');

    // PDF is mandatory.
    if (!riderDocument) {
      setDocumentError(
        'Please upload one PDF containing your PAN Card, RC, and Driving Licence.',
      );
      return;
    }

    const normalizedPhone = normalizeIndianPhone(
      values.phone,
    );

    try {
      // Current demo service accepts registration fields only.
      // The selected PDF will be connected through multipart
      // FormData when the backend upload endpoint is ready.

      await registerRider({
        ...values,
        phone: normalizedPhone,
      });

      setPrefilledPhone(normalizedPhone);
      setSelectedRole('rider');

      navigate(ROUTES.auth.verifyOtp, {
        state: {
          phone: normalizedPhone,
          role: 'rider',
          isNewRegistration: true,
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Registration failed. Please check your details and try again.',
      );
    }
  };

  // -------------------------------------------------------
  // REUSABLE FORM FIELD
  // -------------------------------------------------------

  const field = (
    name: keyof RiderFormValues,
    label: string,
    placeholder: string,
    options: {
      keyboardType?:
        | 'default'
        | 'phone-pad'
        | 'email-address'
        | 'numeric';

      autoCapitalize?:
        | 'none'
        | 'sentences'
        | 'words'
        | 'characters';

      maxLength?: number;
      prefixText?: string;
    } = {},
  ) => (
    <Controller
      key={name}
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormField
          label={label}
          placeholder={placeholder}
          value={String(value ?? '')}
          onChangeText={onChange}
          keyboardType={options.keyboardType}
          autoCapitalize={options.autoCapitalize}
          maxLength={options.maxLength}
          prefixText={options.prefixText}
          error={errors[name]?.message as string | undefined}
        />
      )}
    />
  );

  // -------------------------------------------------------
  // VEHICLE CHOICE BUTTON
  // -------------------------------------------------------

  const choice = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.choice,
        {
          borderColor: selected
            ? colors.primaryAccent
            : colors.border,

          backgroundColor: selected
            ? `${colors.primaryAccent}15`
            : colors.cardBackground,
        },
      ]}
    >
      <Text
        style={{
          color: colors.primaryText,
          fontWeight: selected ? '700' : '400',
        }}
      >
        {selected ? '✓  ' : ''}
        {label}
      </Text>
    </Pressable>
  );

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.outer}
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}

      <View style={styles.topRow}>
        <AppLogo />
        <ThemeToggle />
      </View>

      {/* REGISTRATION CARD */}

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
          RIDER REGISTRATION
        </Text>

        <Text
          style={[
            styles.title,
            { color: colors.primaryText },
          ]}
        >
          Become a SUBIDHA Rider
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.secondaryText },
          ]}
        >
          Complete your details and submit your documents
          for verification. Your Rider account must be
          approved before accessing delivery tasks.
        </Text>

        {/* ------------------------------------------------ */}
        {/* 1. PERSONAL INFORMATION */}
        {/* ------------------------------------------------ */}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          1. Personal Information
        </Text>

        {field(
          'fullName',
          'Full Name *',
          'Your full name',
        )}

        {field(
          'phone',
          'Mobile Number *',
          '9876543210',
          {
            keyboardType: 'phone-pad',
            prefixText: '+91',
            maxLength: 10,
          },
        )}

        {field(
          'email',
          'Email (Optional)',
          'you@example.com',
          {
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
        )}

        {field(
          'city',
          'City *',
          'e.g. Kolkata',
        )}

        {field(
          'address',
          'Residential Address *',
          'House, street, area',
        )}

        {/* ------------------------------------------------ */}
        {/* 2. VEHICLE INFORMATION */}
        {/* ------------------------------------------------ */}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          2. Vehicle Information
        </Text>

        <Text
          style={[
            styles.fieldLabel,
            { color: colors.secondaryText },
          ]}
        >
          Vehicle Type *
        </Text>

        <View style={styles.choices}>
          {choice(
            'Motorcycle',
            vehicleType === 'motorcycle',
            () =>
              setValue('vehicleType', 'motorcycle', {
                shouldValidate: true,
              }),
          )}

          {choice(
            'Scooter',
            vehicleType === 'scooter',
            () =>
              setValue('vehicleType', 'scooter', {
                shouldValidate: true,
              }),
          )}

          {choice(
            'Bicycle',
            vehicleType === 'bicycle',
            () =>
              setValue('vehicleType', 'bicycle', {
                shouldValidate: true,
              }),
          )}

          {choice(
            'Other',
            vehicleType === 'other',
            () =>
              setValue('vehicleType', 'other', {
                shouldValidate: true,
              }),
          )}
        </View>

        {field(
          'vehicleRegistrationNumber',
          'Vehicle Registration Number *',
          'e.g. WB12AB1234',
          {
            autoCapitalize: 'characters',
          },
        )}

        {/* ------------------------------------------------ */}
        {/* 3. VERIFICATION DOCUMENTS */}
        {/* ------------------------------------------------ */}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          3. Verification Documents
        </Text>

        {field(
          'drivingLicenseNumber',
          'Driving Licence Number *',
          'Enter your licence number',
          {
            autoCapitalize: 'characters',
          },
        )}

        {field(
          'identityNumber',
          'PAN Number *',
          'ABCDE1234F',
          {
            autoCapitalize: 'characters',
            maxLength: 10,
          },
        )}

        {/* COMBINED PDF UPLOAD */}

        <View
          style={[
            styles.uploadCard,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.uploadTitle,
              { color: colors.primaryText },
            ]}
          >
            Upload All Verification Documents *
          </Text>

          <Text
            style={[
              styles.uploadDescription,
              { color: colors.secondaryText },
            ]}
          >
            Combine the following three documents into
            one PDF before uploading.
          </Text>

          <View style={styles.documentChecklist}>
            {[
              'PAN Card',
              'Vehicle Registration Certificate (RC)',
              'Driving Licence',
            ].map((document) => (
              <View
                key={document}
                style={styles.documentChecklistItem}
              >
                <Text
                  style={{
                    color: colors.primaryAccent,
                    fontWeight: '800',
                  }}
                >
                  ✓
                </Text>

                <Text
                  style={{
                    color: colors.primaryText,
                    fontSize: 13,
                    flex: 1,
                  }}
                >
                  {document}
                </Text>
              </View>
            ))}
          </View>

          {/* Native browser file input for React Native Web */}

          <label
            htmlFor="rider-document-upload"
            style={{
              display: 'block',
              padding: 15,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.primaryAccent,
              borderRadius: 12,
              textAlign: 'center',
              cursor: 'pointer',
              color: colors.primaryAccent,
              fontWeight: 700,
              marginTop: 14,
            }}
          >
            {riderDocument
              ? 'Choose Another PDF'
              : '+ Select Combined PDF'}
          </label>

          <input
            id="rider-document-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleDocumentChange}
            style={{ display: 'none' }}
          />

          {/* Selected file information */}

          {riderDocument && (
            <View
              style={[
                styles.selectedFile,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.primaryText,
                    fontWeight: '700',
                  }}
                >
                  {riderDocument.name}
                </Text>

                <Text
                  style={{
                    color: colors.secondaryText,
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  {(
                    riderDocument.size /
                    (1024 * 1024)
                  ).toFixed(2)}{' '}
                  MB · PDF
                </Text>
              </View>

              <Pressable
                onPress={removeDocument}
                accessibilityRole="button"
                accessibilityLabel="Remove selected PDF"
                style={styles.removeButton}
              >
                <Text
                  style={{
                    color: colors.sos,
                    fontWeight: '700',
                  }}
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          )}

          <Text
            style={[
              styles.uploadHint,
              { color: colors.secondaryText },
            ]}
          >
            Accepted format: PDF only · Maximum size: 10 MB
          </Text>

          {documentError ? (
            <Text
              accessibilityRole="alert"
              style={[
                styles.errorText,
                { color: colors.sos },
              ]}
            >
              {documentError}
            </Text>
          ) : null}
        </View>

        {/* ------------------------------------------------ */}
        {/* 4. BANK INFORMATION */}
        {/* ------------------------------------------------ */}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          4. Bank Details
        </Text>

        {field(
          'accountHolderName',
          'Account Holder Name *',
          'Name as registered with the bank',
        )}

        {field(
          'accountNumber',
          'Bank Account Number *',
          'Enter account number',
          {
            keyboardType: 'numeric',
          },
        )}

        {field(
          'ifscCode',
          'IFSC Code *',
          'e.g. SBIN0001234',
          {
            autoCapitalize: 'characters',
          },
        )}

        <Text
          style={[
            styles.fieldLabel,
            { color: colors.secondaryText },
          ]}
        >
          Your bank information will require secure
          backend storage and verification.
        </Text>

        {/* ------------------------------------------------ */}
        {/* 5. CONSENT */}
        {/* ------------------------------------------------ */}

        <Text
          style={[
            styles.sectionTitle,
            { color: colors.primaryText },
          ]}
        >
          5. Terms and Consent
        </Text>

        <Controller
          control={control}
          name="consentAccepted"
          render={({ field: { onChange } }) => (
            <View style={styles.consentContainer}>
              <Pressable
                onPress={() =>
                  onChange(!consentAccepted)
                }
                style={styles.checkboxRow}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: consentAccepted,
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: colors.primaryAccent,
                      backgroundColor: consentAccepted
                        ? colors.primaryAccent
                        : 'transparent',
                    },
                  ]}
                >
                  {consentAccepted ? (
                    <Text
                      style={{
                        color: colors.buttonTextOnAccent,
                      }}
                    >
                      ✓
                    </Text>
                  ) : null}
                </View>

                <Text
                  style={{
                    color: colors.secondaryText,
                    flex: 1,
                  }}
                >
                  I agree to the SUBIDHA Terms of Service
                  and Privacy Policy.
                </Text>
              </Pressable>

              {errors.consentAccepted ? (
                <Text
                  style={{
                    color: colors.sos,
                    marginTop: 4,
                  }}
                >
                  {errors.consentAccepted.message}
                </Text>
              ) : null}
            </View>
          )}
        />

        {/* ------------------------------------------------ */}
        {/* ERROR AND NOTICE */}
        {/* ------------------------------------------------ */}

        {submitError ? (
          <Text
            accessibilityRole="alert"
            style={{
              color: colors.sos,
              marginBottom: 12,
            }}
          >
            {submitError}
          </Text>
        ) : null}

        {notice ? (
          <View
            style={[
              styles.infoBox,
              { borderColor: colors.border },
            ]}
          >
            <Text
              style={{
                color: colors.primaryText,
                lineHeight: 20,
              }}
            >
              {notice}
            </Text>
          </View>
        ) : null}

        {/* ------------------------------------------------ */}
        {/* SUBMIT */}
        {/* ------------------------------------------------ */}

        <PrimaryButton
          label="Submit Rider Application"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />

        {/* LOGIN LINK */}

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigate(ROUTES.auth.login.rider)
          }
          style={styles.signInLink}
        >
          <Text
            style={[
              styles.signInText,
              { color: colors.primaryAccent },
            ]}
          >
            Already registered? Rider Sign In
          </Text>
        </Pressable>

        {/* CUSTOMER REGISTRATION LINK */}

        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigate(ROUTES.auth.signup.customer)
          }
          style={styles.signInLink}
        >
          <Text
            style={[
              styles.signInText,
              { color: colors.secondaryText },
            ]}
          >
            Register as a Customer instead
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------
// STYLES
// ---------------------------------------------------------

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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 12,
  },

  fieldLabel: {
    fontSize: 13,
    marginTop: 8,
    marginBottom: 8,
  },

  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },

  choice: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },

  uploadCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
  },

  uploadTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },

  uploadDescription: {
    fontSize: 13,
    lineHeight: 20,
  },

  documentChecklist: {
    gap: 10,
    marginTop: 14,
  },

  documentChecklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  selectedFile: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  removeButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  uploadHint: {
    fontSize: 12,
    marginTop: 12,
  },

  errorText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },

  infoBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },

  consentContainer: {
    marginVertical: 18,
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
