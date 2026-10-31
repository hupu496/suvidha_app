
export type UserRole = 'customer' | 'business' | 'rider';

// ─── Customer ───────────────────────────────────────────────

export interface CustomerProfile {
  id: string;
  role: 'customer';
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  preferredLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  subscriptionPlanId: string;
  subscriptionValidUntil: string;
  createdAt: string;
}

// ─── Business ──────────────────────────────────────────────

export interface BusinessProfile {
  id: string;
  role: 'business';
  businessName: string;
  contactPersonName: string;
  phone: string;
  businessEmail: string;
  businessCategory: string;
  city: string;
  businessAddress: string;
  operationalSize: string;
  subscriptionPlanId: string;
  billingFrequency: 'Monthly' | 'Annual';
  includedCapacity: number;
  usedCapacity: number;
  createdAt: string;
}

// ─── Rider ─────────────────────────────────────────────────

export type RiderApplicationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type DocumentVerificationStatus =
  | 'pending'
  | 'verified'
  | 'rejected';

export type RiderDocumentType =
  | 'driving_license'
  | 'pan_card'
  | 'identity_proof';

export interface RiderDocument {
  id: string;
  type: RiderDocumentType;
  documentNumber?: string;
  fileName?: string;
  fileUrl?: string;
  verificationStatus: DocumentVerificationStatus;
  rejectionReason?: string;
  uploadedAt?: string;
}

export interface RiderBankAccount {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName?: string;
  verificationStatus: DocumentVerificationStatus;
}

export interface RiderProfile {
  id: string;
  role: 'rider';
  fullName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  city: string;
  address: string;
  vehicleType: 'bicycle' | 'motorcycle' | 'scooter' | 'other';
  vehicleRegistrationNumber?: string;
  documents: RiderDocument[];
  bankAccount: RiderBankAccount;
  applicationStatus: RiderApplicationStatus;
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt?: string;
  reviewedAt?: string;
  isAvailable: boolean;
  createdAt: string;
}

// ─── Application and Admin Review ───────────────────────────

export interface RiderApplication {
  id: string;
  riderId: string;
  status: RiderApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// ─── Shared User ───────────────────────────────────────────

export type AppUser =
  | CustomerProfile
  | BusinessProfile
  | RiderProfile;

// ─── Services and Plans ────────────────────────────────────

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category:
    | 'personal'
    | 'escort'
    | 'errands'
    | 'tourist'
    | 'logistics'
    | 'transport';
  audience: 'customer' | 'business' | 'both';
  shortDescription: string;
  fullDescription: string;
  estimatedDuration: string;
  baseCoverageNote: string;
  externalExpenseNote: string;
  iconName: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  audience: 'customer' | 'tourist' | 'business' | 'enterprise';
  priceDisplay: string;
  billingPeriod: string;
  badge?: string;
  description: string;
  features: string[];
  externalExpensePolicy: string;
}

// ─── Customer Bookings ─────────────────────────────────────

export type BookingStatus =
  | 'Requested'
  | 'Scheduled'
  | 'In Progress'
  | 'Completed';

export interface CustomerBooking {
  id: string;
  customerId: string;
  serviceId: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  pickupLocation: string;
  dropOrVenueLocation?: string;
  instructions: string;
  status: BookingStatus;
  assignedAgentPlaceholder: string;
  createdAt: string;
}

// ─── Business Tasks and Field Agents ───────────────────────

export type TaskPriority = 'Standard' | 'High' | 'Urgent';

export type TaskStatus =
  | 'Queued'
  | 'Assigned'
  | 'In Transit'
  | 'Completed';

export interface BusinessTask {
  id: string;
  businessId: string;
  taskCategory: string;
  pickupOrigin: string;
  destination: string;
  assignedAgentId?: string;
  assignedAgentName: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  createdDate: string;
}

export interface FieldAgent {
  id: string;
  agentCode: string;
  name: string;
  availability: 'Available' | 'On Active Task' | 'Standby';
  currentTaskId?: string;
  specialization: string;
  demoRating: string;
}

// ─── Rider Deliveries ─────────────────────────────────────

export type RiderDeliveryStatus =
  | 'assigned'
  | 'accepted'
  | 'rejected'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export interface RiderDelivery {
  id: string;
  riderId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  pickupAddress: string;
  deliveryAddress: string;
  description: string;
  status: RiderDeliveryStatus;
  assignedAt: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  rejectionReason?: string;
  estimatedEarnings: number;
  finalEarnings?: number;
}

// ─── Rider Earnings and Wallet ─────────────────────────────

export type EarningsStatus =
  | 'pending'
  | 'confirmed'
  | 'paid';

export interface RiderEarning {
  id: string;
  riderId: string;
  deliveryId: string;
  customerId: string;
  customerName: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: EarningsStatus;
  createdAt: string;
  paidAt?: string;
}

export type WalletTransactionType =
  | 'earning'
  | 'payout'
  | 'adjustment'
  | 'refund';

export interface WalletTransaction {
  id: string;
  riderId: string;
  type: WalletTransactionType;
  amount: number;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface RiderWallet {
  riderId: string;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  updatedAt: string;
}

// ─── Customer Ratings ──────────────────────────────────────

export interface RiderRating {
  id: string;
  riderId: string;
  customerId: string;
  customerName: string;
  deliveryId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

// ─── Authentication Responses ──────────────────────────────

export interface PhoneLookupResponse {
  exists: boolean;
  role: UserRole;
  phone: string;
  maskedPhone?: string;
  message: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  user?: AppUser;
  error?: string;
}
