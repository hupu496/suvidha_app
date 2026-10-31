import { CustomerProfile, BusinessProfile } from '@/types';

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'cust-101',
    role: 'customer',
    fullName: 'Aarav Sen',
    phone: '9876543210',
    email: 'aarav.sen@example.com',
    city: 'Kolkata',
    preferredLanguage: 'English & Bengali',
    emergencyContactName: 'Meera Sen',
    emergencyContactPhone: '9876543211',
    subscriptionPlanId: 'plan-individual-care',
    subscriptionValidUntil: '2026-12-31',
    createdAt: '2026-01-15',
  },
];

export const INITIAL_BUSINESSES: BusinessProfile[] = [
  {
    id: 'biz-201',
    role: 'business',
    businessName: 'Calcutta Apothecary & Co.',
    contactPersonName: 'Rohan Chatterjee',
    phone: '9876501234',
    businessEmail: 'ops@calcuttaapothecary.example.com',
    businessCategory: 'Pharmacy & Healthcare Retail',
    city: 'Kolkata',
    businessAddress: '42 Park Street, Central District',
    operationalSize: '15–40 Daily Dispatches',
    subscriptionPlanId: 'plan-business-growth',
    billingFrequency: 'Monthly',
    includedCapacity: 250,
    usedCapacity: 142,
    createdAt: '2026-02-01',
  },
];