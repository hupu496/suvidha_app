import { CustomerBooking } from '@/types';
import { INITIAL_CUSTOMER_BOOKINGS } from '@/mocks/bookings';
import { DEMO_SERVICES } from '@/mocks/services';

let bookingsStore: CustomerBooking[] = [...INITIAL_CUSTOMER_BOOKINGS];

export interface CreateBookingInput {
  customerId: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  pickupLocation: string;
  dropOrVenueLocation?: string;
  instructions: string;
}

/**
 * Future Django REST endpoint: GET /api/v1/customer/bookings/
 */
export async function getCustomerBookings(customerId?: string): Promise<CustomerBooking[]> {
  if (!customerId) return bookingsStore;
  const filtered = bookingsStore.filter((b) => b.customerId === customerId);
  return filtered.length > 0 ? filtered : bookingsStore;
}

/**
 * Future Django REST endpoint: POST /api/v1/customer/bookings/
 */
export async function createBooking(input: CreateBookingInput): Promise<CustomerBooking> {
  const service = DEMO_SERVICES.find((s) => s.id === input.serviceId) ?? DEMO_SERVICES[0];
  const newBooking: CustomerBooking = {
    id: `REQ-${Math.floor(8500 + Math.random() * 900)}`,
    customerId: input.customerId,
    serviceId: service.id,
    serviceTitle: service.title,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    pickupLocation: input.pickupLocation.trim(),
    dropOrVenueLocation: input.dropOrVenueLocation?.trim() || undefined,
    instructions: input.instructions.trim(),
    status: 'Requested',
    assignedAgentPlaceholder: 'Pending Assignment (Simulated Concierge Desk)',
    createdAt: new Date().toISOString().slice(0, 10),
  };

  bookingsStore = [newBooking, ...bookingsStore];
  return newBooking;
}