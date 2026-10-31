import {
  AppUser,
  BusinessProfile,
  CustomerProfile,
  RiderProfile,
  OtpVerifyResponse,
  PhoneLookupResponse,
  UserRole,
  RiderApplicationStatus,
} from '@/types';

import {
  INITIAL_BUSINESSES,
  INITIAL_CUSTOMERS,
} from '@/mocks/users';

import { API_CONFIG } from './api.config';

// -----------------------------------------------------------------------------
// Rider application persistence (frontend demo only)
// -----------------------------------------------------------------------------

const RIDERS_STORAGE_KEY = 'subidha_rider_applications';

function loadRidersStore(): RiderProfile[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const saved = window.localStorage.getItem(RIDERS_STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    return Array.isArray(parsed) ? (parsed as RiderProfile[]) : [];
  } catch (error) {
    console.error('Unable to load rider applications:', error);
    return [];
  }
}

function saveRidersStore(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(
      RIDERS_STORAGE_KEY,
      JSON.stringify(ridersStore),
    );
  } catch (error) {
    console.error('Unable to save rider applications:', error);
    throw new Error(
      'Could not save rider applications in this browser.',
    );
  }
}

// -----------------------------------------------------------------------------
// Demo stores
// -----------------------------------------------------------------------------

let customersStore: CustomerProfile[] = [...INITIAL_CUSTOMERS];
let businessesStore: BusinessProfile[] = [...INITIAL_BUSINESSES];
let ridersStore: RiderProfile[] = loadRidersStore();

let currentSessionUser: AppUser | null = null;

export interface PendingAuthAttempt {
  phone: string;
  role: UserRole;
  isNewRegistration?: boolean;
}

let pendingAuthAttempt: PendingAuthAttempt | null = null;

// -----------------------------------------------------------------------------
// Phone helpers
// -----------------------------------------------------------------------------

// Normalize Indian phone numbers to their last 10 digits.
export function normalizeIndianPhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(-10);
}

export function isValidIndianPhone(raw: string): boolean {
  const cleaned = normalizeIndianPhone(raw);
  return /^[6-9]\d{9}$/.test(cleaned);
}

// -----------------------------------------------------------------------------
// Find user
// -----------------------------------------------------------------------------

/**
 * Find a user only within the requested role.
 * A phone number registered for one role must not authenticate another role.
 */
function findUserByPhone(
  phone: string,
  role: UserRole,
): AppUser | undefined {
  switch (role) {
    case 'customer':
      return customersStore.find(
        (customer) => customer.phone === phone,
      );

    case 'business':
      return businessesStore.find(
        (business) => business.phone === phone,
      );

    case 'rider':
      // Reload so changes made in another tab are visible.
      ridersStore = loadRidersStore();

      return ridersStore.find(
        (rider) => rider.phone === phone,
      );
  }
}

// -----------------------------------------------------------------------------
// Admin demo functions
// -----------------------------------------------------------------------------

/**
 * Get all rider applications.
 * The admin dashboard should call this function to load applications.
 */
export function getAllRiderApplications(): RiderProfile[] {
  ridersStore = loadRidersStore();

  return [...ridersStore];
}

/**
 * Update an application's status and persist the change.
 */
export function updateRiderApplicationStatus(
  riderId: string,
  status: RiderApplicationStatus,
): RiderProfile {
  // Always use the latest stored applications.
  ridersStore = loadRidersStore();

  const riderIndex = ridersStore.findIndex(
    (rider) => rider.id === riderId,
  );

  if (riderIndex === -1) {
    throw new Error('Rider application not found.');
  }

  const updatedRider: RiderProfile = {
    ...ridersStore[riderIndex],
    applicationStatus: status,
  };

  ridersStore[riderIndex] = updatedRider;

  // Save the updated application so the status persists.
  saveRidersStore();

  // Keep the current session synchronized if this is the same rider.
  if (
    currentSessionUser?.role === 'rider' &&
    currentSessionUser.id === riderId
  ) {
    currentSessionUser = updatedRider;
  }

  return updatedRider;
}

// -----------------------------------------------------------------------------
// Login with phone
// -----------------------------------------------------------------------------

/**
 * Future Django REST endpoint:
 * POST /api/v1/auth/phone-lookup/
 */
export async function loginWithPhone(
  phoneInput: string,
  role: UserRole,
): Promise<PhoneLookupResponse> {
  const phone = normalizeIndianPhone(phoneInput);

  if (!isValidIndianPhone(phone)) {
    return {
      exists: false,
      role,
      phone,
      message: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  const matchedUser = findUserByPhone(phone, role);

  if (!matchedUser) {
    return {
      exists: false,
      role,
      phone,
      message:
        role === 'rider'
          ? 'No Rider application was found for this number. Please register first.'
          : 'This mobile number is not registered.',
    };
  }

  pendingAuthAttempt = {
    phone,
    role,
    isNewRegistration: false,
  };

  return {
    exists: true,
    role,
    phone,
    maskedPhone: `+91 ••••••${phone.slice(-4)}`,
    message: 'Demo OTP ready for verification.',
  };
}

// -----------------------------------------------------------------------------
// Customer registration
// -----------------------------------------------------------------------------

export interface RegisterCustomerInput {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  preferredLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  consentAccepted: boolean;
}

/**
 * Future Django REST endpoint:
 * POST /api/v1/auth/register/customer/
 */
export async function registerCustomer(
  input: RegisterCustomerInput,
): Promise<{ user: CustomerProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  const existing = customersStore.find(
    (customer) => customer.phone === phone,
  );

  if (existing) {
    throw new Error(
      'A customer account already exists for this number. Please log in.',
    );
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  const newCustomer: CustomerProfile = {
    id: `cust-${Date.now()}`,
    role: 'customer',
    fullName: input.fullName.trim(),
    phone,
    email: input.email?.trim() || undefined,
    city: input.city.trim(),
    preferredLanguage: input.preferredLanguage.trim(),
    emergencyContactName:
      input.emergencyContactName?.trim() || undefined,
    emergencyContactPhone:
      input.emergencyContactPhone?.trim() || undefined,
    subscriptionPlanId: 'plan-individual-care',
    subscriptionValidUntil: '2026-12-31',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  customersStore = [newCustomer, ...customersStore];

  pendingAuthAttempt = {
    phone,
    role: 'customer',
    isNewRegistration: true,
  };

  return {
    user: newCustomer,
    otpRequired: true,
  };
}

// -----------------------------------------------------------------------------
// Business registration
// -----------------------------------------------------------------------------

export interface RegisterBusinessInput {
  businessName: string;
  contactPersonName: string;
  phone: string;
  businessEmail: string;
  businessCategory: string;
  city: string;
  businessAddress: string;
  operationalSize: string;
  consentAccepted: boolean;
}

/**
 * Future Django REST endpoint:
 * POST /api/v1/auth/register/business/
 */
export async function registerBusiness(
  input: RegisterBusinessInput,
): Promise<{ user: BusinessProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  const existing = businessesStore.find(
    (business) => business.phone === phone,
  );

  if (existing) {
    throw new Error(
      'A business account already exists for this number. Please log in.',
    );
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  const newBusiness: BusinessProfile = {
    id: `biz-${Date.now()}`,
    role: 'business',
    businessName: input.businessName.trim(),
    contactPersonName: input.contactPersonName.trim(),
    phone,
    businessEmail: input.businessEmail.trim(),
    businessCategory: input.businessCategory.trim(),
    city: input.city.trim(),
    businessAddress: input.businessAddress.trim(),
    operationalSize: input.operationalSize.trim(),
    subscriptionPlanId: 'plan-business-growth',
    billingFrequency: 'Monthly',
    includedCapacity: 250,
    usedCapacity: 12,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  businessesStore = [newBusiness, ...businessesStore];

  pendingAuthAttempt = {
    phone,
    role: 'business',
    isNewRegistration: true,
  };

  return {
    user: newBusiness,
    otpRequired: true,
  };
}

// -----------------------------------------------------------------------------
// Rider registration
// -----------------------------------------------------------------------------

export interface RegisterRiderInput {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  vehicleType: RiderProfile['vehicleType'];
  vehicleRegistrationNumber?: string;
  drivingLicenseNumber: string;
  identityType: 'pan_card' | 'identity_proof';
  identityNumber: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  consentAccepted: boolean;
}

/**
 * Demo implementation only.
 * Future Django REST endpoint:
 * POST /api/v1/auth/register/rider/
 *
 * Do not use real identity or bank information with this demo.
 */
export async function registerRider(
  input: RegisterRiderInput,
): Promise<{ user: RiderProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  // Reload the store before checking for duplicates.
  ridersStore = loadRidersStore();

  const existing = ridersStore.find(
    (rider) => rider.phone === phone,
  );

  if (existing) {
    throw new Error(
      'A Rider application already exists for this number. Please log in.',
    );
  }

  const now = new Date().toISOString();
  const riderId = `rider-${Date.now()}`;

  const newRider: RiderProfile = {
    id: riderId,
    role: 'rider',
    fullName: input.fullName.trim(),
    phone,
    email: input.email?.trim() || undefined,
    city: input.city.trim(),
    address: input.address.trim(),
    vehicleType: input.vehicleType,
    vehicleRegistrationNumber:
      input.vehicleRegistrationNumber?.trim() || undefined,
    documents: [
      {
        id: `doc-license-${riderId}`,
        type: 'driving_license',
        documentNumber: input.drivingLicenseNumber.trim(),
        verificationStatus: 'pending',
        uploadedAt: now,
      },
      {
        id: `doc-identity-${riderId}`,
        type: input.identityType,
        documentNumber: input.identityNumber.trim(),
        verificationStatus: 'pending',
        uploadedAt: now,
      },
    ],
    bankAccount: {
      accountHolderName: input.accountHolderName.trim(),
      accountNumber: input.accountNumber.trim(),
      ifscCode: input.ifscCode.trim().toUpperCase(),
      verificationStatus: 'pending',
    },
    applicationStatus: 'pending',
    isAvailable: false,
    submittedAt: now,
    createdAt: now,
  };

  // Add the new application and save it to browser storage.
  ridersStore = [newRider, ...ridersStore];
  saveRidersStore();

  pendingAuthAttempt = {
    phone,
    role: 'rider',
    isNewRegistration: true,
  };

  return {
    user: newRider,
    otpRequired: true,
  };
}

// -----------------------------------------------------------------------------
// OTP verification
// -----------------------------------------------------------------------------

/**
 * Future Django REST endpoint:
 * POST /api/v1/auth/verify-otp/
 */
export async function verifyDemoOtp(
  otpCode: string,
  overridePhone?: string,
  overrideRole?: UserRole,
): Promise<OtpVerifyResponse> {
  const targetPhone = normalizeIndianPhone(
    overridePhone || pendingAuthAttempt?.phone || '',
  );

  const targetRole = overrideRole || pendingAuthAttempt?.role;

  if (!targetPhone || !targetRole) {
    return {
      success: false,
      error:
        'No active login session found. Please enter your mobile number again.',
    };
  }

  if (otpCode.trim() !== API_CONFIG.DEMO_OTP_CODE) {
    return {
      success: false,
      error: `Invalid demo OTP. Please enter ${API_CONFIG.DEMO_OTP_CODE} for local verification.`,
    };
  }

  const user = findUserByPhone(targetPhone, targetRole);

  if (!user) {
    return {
      success: false,
      error:
        'This mobile number is not registered for the selected account type.',
    };
  }

  currentSessionUser = user;
  pendingAuthAttempt = null;

  return {
    success: true,
    user,
  };
}

// -----------------------------------------------------------------------------
// Session helpers
// -----------------------------------------------------------------------------

export function getPendingAuthAttempt(): PendingAuthAttempt | null {
  return pendingAuthAttempt;
}

export function setPendingAuthAttempt(
  attempt: PendingAuthAttempt | null,
): void {
  pendingAuthAttempt = attempt;
}

export function getCurrentUser(): AppUser | null {
  return currentSessionUser;
}

export async function logout(): Promise<void> {
  currentSessionUser = null;
  pendingAuthAttempt = null;
}

// -----------------------------------------------------------------------------
// Reset demo data
// -----------------------------------------------------------------------------

/**
 * Reset demo data.
 * Intended for tests and local development only.
 */
export function resetDemoAuthStores(): void {
  customersStore = [...INITIAL_CUSTOMERS];
  businessesStore = [...INITIAL_BUSINESSES];
  ridersStore = [];

  currentSessionUser = null;
  pendingAuthAttempt = null;

  saveRidersStore();
}

// -----------------------------------------------------------------------------
// Backend API integration (Django REST Framework)
// -----------------------------------------------------------------------------

import { apiClient, getAccessToken, setAccessToken } from './apiClient';

/**
 * Look up whether a mobile number is registered for the requested role
 * against the Django backend.
 */
export async function lookupPhone(
  phoneInput: string,
  role: UserRole,
): Promise<PhoneLookupResponse> {
  const phone = normalizeIndianPhone(phoneInput);

  if (!isValidIndianPhone(phone)) {
    return {
      exists: false,
      role,
      phone,
      message: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  const response = await apiClient.post<PhoneLookupResponse>(
    API_CONFIG.ENDPOINTS.AUTH_LOOKUP_PHONE,
    { phone, role },
  );

  return response;
}

/**
 * Register a new customer account on the Django backend.
 * Returns the created profile plus an OTP requirement.
 */
export async function registerCustomerAccount(
  input: RegisterCustomerInput,
): Promise<{ user: CustomerProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  const response = await apiClient.post<{
    success: boolean;
    otpRequired: boolean;
    user: CustomerProfile;
    message?: string;
  }>(API_CONFIG.ENDPOINTS.AUTH_REGISTER_CUSTOMER, {
    fullName: input.fullName,
    phone,
    email: input.email,
    city: input.city,
    preferredLanguage: input.preferredLanguage,
    emergencyContactName: input.emergencyContactName,
    emergencyContactPhone: input.emergencyContactPhone,
    consentAccepted: input.consentAccepted,
  });

  if (!response.success || !response.otpRequired || !response.user) {
    throw new Error(response.message || 'Customer registration failed.');
  }

  return { user: response.user, otpRequired: response.otpRequired };
}

/**
 * Register a new business account on the Django backend.
 */
export async function registerBusinessAccount(
  input: RegisterBusinessInput,
): Promise<{ user: BusinessProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  const response = await apiClient.post<{
    success: boolean;
    otpRequired: boolean;
    user: BusinessProfile;
    message?: string;
  }>(API_CONFIG.ENDPOINTS.AUTH_REGISTER_BUSINESS, {
    businessName: input.businessName,
    contactPersonName: input.contactPersonName,
    phone,
    businessEmail: input.businessEmail,
    businessCategory: input.businessCategory,
    city: input.city,
    businessAddress: input.businessAddress,
    operationalSize: input.operationalSize,
    consentAccepted: input.consentAccepted,
  });

  if (!response.success || !response.otpRequired || !response.user) {
    throw new Error(response.message || 'Business registration failed.');
  }

  return { user: response.user, otpRequired: response.otpRequired };
}

/**
 * Register a new rider application on the Django backend.
 */
export async function registerRiderAccount(
  input: RegisterRiderInput,
): Promise<{ user: RiderProfile; otpRequired: boolean }> {
  const phone = normalizeIndianPhone(input.phone);

  if (!isValidIndianPhone(phone)) {
    throw new Error('Enter a valid 10-digit Indian mobile number.');
  }

  if (!input.consentAccepted) {
    throw new Error('Please accept the consent to continue.');
  }

  const response = await apiClient.post<{
    success: boolean;
    otpRequired: boolean;
    user: RiderProfile;
    message?: string;
  }>(API_CONFIG.ENDPOINTS.AUTH_REGISTER_RIDER, {
    fullName: input.fullName,
    phone,
    email: input.email,
    city: input.city,
    address: input.address,
    vehicleType: input.vehicleType,
    vehicleRegistrationNumber: input.vehicleRegistrationNumber,
    drivingLicenseNumber: input.drivingLicenseNumber,
    identityType: input.identityType,
    identityNumber: input.identityNumber,
    accountHolderName: input.accountHolderName,
    accountNumber: input.accountNumber,
    ifscCode: input.ifscCode,
    consentAccepted: input.consentAccepted,
  });

  if (!response.success || !response.otpRequired || !response.user) {
    throw new Error(response.message || 'Rider registration failed.');
  }

  return { user: response.user, otpRequired: response.otpRequired };
}

/**
 * Request a fresh OTP from the Django backend.
 */
export async function requestBackendOtp(
  phone: string,
  role: UserRole,
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    API_CONFIG.ENDPOINTS.AUTH_OTP,
    { phone, role },
  );

  return response;
}

/**
 * Verify the OTP entered by the user against the Django backend.
 */
export async function verifyBackendOtp(
  phone: string,
  code: string,
  role?: UserRole,
): Promise<OtpVerifyResponse> {
  const response = await apiClient.post<{
    success: boolean;
    user?: AppUser;
    access?: string;
    refresh?: string;
    error?: string;
  }>(API_CONFIG.ENDPOINTS.AUTH_VERIFY_OTP, { phone, code, role });

  if (response.success && response.access) {
    setAccessToken(response.access);
  }

  return {
    success: response.success,
    user: response.user,
    error: response.error,
  };
}

/**
 * Load the currently authenticated user from the Django backend.
 */
export async function getBackendSession(): Promise<AppUser | null> {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const user = await apiClient.get<AppUser>(API_CONFIG.ENDPOINTS.AUTH_SESSION_ME);
    return user ?? null;
  } catch {
    setAccessToken(null);
    return null;
  }
}

/**
 * Clear the backend session token.
 */
export async function backendLogout(): Promise<void> {
  const token = getAccessToken();

  if (token) {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH_LOGOUT);
    } catch {
      // Logout should always clear the local token even if the backend is unreachable.
    }
  }

  setAccessToken(null);
}