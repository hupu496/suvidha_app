import {
  loginWithPhone,
  registerCustomer,
  registerBusiness,
  verifyDemoOtp,
  resetDemoAuthStores,
  getCurrentUser,
  logout,
} from '@/services/auth.service';
import { describe, beforeEach, test, expect } from 'vitest';

describe('SUBIDHA Authentication & Role Separation Flows', () => {
  beforeEach(() => {
    resetDemoAuthStores();
  });

  test('1. Unregistered customer mobile number returns exists=false and required modal message', async () => {
    const result = await loginWithPhone('9123456789', 'customer');
    expect(result.exists).toBe(false);
    expect(result.role).toBe('customer');
    expect(result.message).toBe('This mobile number is not registered.');
  });

  test('2. Registered customer phone cannot authenticate as a business account unless registered for business', async () => {
    const customerCheck = await loginWithPhone('9876543210', 'customer');
    expect(customerCheck.exists).toBe(true);

    const businessCheck = await loginWithPhone('9876543210', 'business');
    expect(businessCheck.exists).toBe(false);
    expect(businessCheck.message).toBe('This mobile number is not registered.');
  });

  test('3. Customer registration + demo OTP 123456 verification logs in customer role', async () => {
    await registerCustomer({
      fullName: 'Test Customer',
      phone: '9111222333',
      city: 'Kolkata',
      preferredLanguage: 'English',
      consentAccepted: true,
    });

    const badOtp = await verifyDemoOtp('000000', '9111222333', 'customer');
    expect(badOtp.success).toBe(false);

    const goodOtp = await verifyDemoOtp('123456', '9111222333', 'customer');
    expect(goodOtp.success).toBe(true);
    expect(goodOtp.user?.role).toBe('customer');
    expect(getCurrentUser()?.phone).toBe('9111222333');
  });

  test('4. Business registration + demo OTP 123456 verification logs in business role and logout clears session', async () => {
    await registerBusiness({
      businessName: 'Metro Meds',
      contactPersonName: 'K. Basu',
      phone: '9444555666',
      businessEmail: 'ops@metromeds.example.com',
      businessCategory: 'Pharmacy',
      city: 'Kolkata',
      businessAddress: 'Salt Lake Sector II',
      operationalSize: '20 daily tasks',
      consentAccepted: true,
    });

    const verified = await verifyDemoOtp('123456', '9444555666', 'business');
    expect(verified.success).toBe(true);
    expect(verified.user?.role).toBe('business');

    await logout();
    expect(getCurrentUser()).toBeNull();
  });
});