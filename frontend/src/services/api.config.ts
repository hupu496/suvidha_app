
/**
 * Central API configuration for the Vite + React frontend
 * and future Django REST Framework + PostgreSQL integration.
 *
 * Do not store production secrets in frontend environment variables.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL.replace(/\/+$/, ''),
  USE_MOCK_SERVICES: true,
  DEMO_OTP_CODE: '123456',

  ENDPOINTS: {
    AUTH_LOOKUP_PHONE: '/auth/phone-lookup/',
    AUTH_REGISTER_CUSTOMER: '/auth/register/customer/',
    AUTH_REGISTER_BUSINESS: '/auth/register/business/',
    AUTH_REGISTER_RIDER: '/auth/register/rider/',
    AUTH_OTP: '/auth/otp/',
    AUTH_VERIFY_OTP: '/auth/verify-otp/',
    AUTH_SESSION_ME: '/auth/me/',
    AUTH_LOGOUT: '/auth/logout/',
    CUSTOMER_BOOKINGS: '/customer/bookings/',
    BUSINESS_TASKS: '/business/tasks/',
    BUSINESS_FLEET_AGENTS: '/business/fleet/agents/',
  },
} as const;
