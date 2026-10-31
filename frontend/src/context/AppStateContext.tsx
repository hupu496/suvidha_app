
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AppUser,
  BusinessTask,
  CustomerBooking,
  FieldAgent,
  TaskPriority,
  TaskStatus,
  UserRole,
} from '@/types';

import {
  getCurrentUser,
  logout as serviceLogout,
} from '@/services/auth.service';

import {
  createBooking as serviceCreateBooking,
  CreateBookingInput,
  getCustomerBookings,
} from '@/services/booking.service';

import {
  createBusinessTask as serviceCreateTask,
  CreateBusinessTaskInput,
  getBusinessTasks,
  getFleetAgents,
  updateTaskStatus as serviceUpdateTaskStatus,
} from '@/services/business.service';

export type LocationPermissionStatus =
  | 'prompt'
  | 'granted'
  | 'denied';

interface AppStateContextValue {
  user: AppUser | null;
  selectedRole: UserRole;
  prefilledPhone: string;
  bookings: CustomerBooking[];
  tasks: BusinessTask[];
  agents: FieldAgent[];
  toastMessage: string | null;
  locationPermission: LocationPermissionStatus;
  userLocationLabel: string;

  setLocationPermission: (
    status: LocationPermissionStatus,
    customAddress?: string
  ) => void;

  setSelectedRole: (role: UserRole) => void;
  setPrefilledPhone: (phone: string) => void;
  setAuthenticatedUser: (user: AppUser | null) => void;
  logoutUser: () => Promise<void>;

  addCustomerBooking: (
    input: Omit<CreateBookingInput, 'customerId'>
  ) => Promise<CustomerBooking>;

  addBusinessTask: (
    input: Omit<CreateBusinessTaskInput, 'businessId'> & {
      priority: TaskPriority;
    }
  ) => Promise<BusinessTask>;

  changeTaskStatus: (
    taskId: string,
    status: TaskStatus,
    assignedAgentId?: string
  ) => Promise<void>;

  showToast: (msg: string) => void;
}

const AppStateContext =
  createContext<AppStateContextValue | undefined>(undefined);

export const AppStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(
    () => getCurrentUser()
  );

  const [selectedRole, setSelectedRole] =
    useState<UserRole>('customer');

  const [prefilledPhone, setPrefilledPhone] =
    useState('');

  const [bookings, setBookings] =
    useState<CustomerBooking[]>([]);

  const [tasks, setTasks] =
    useState<BusinessTask[]>([]);

  const [agents, setAgents] =
    useState<FieldAgent[]>([]);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const [locationPermission, setLocationPermissionState] =
    useState<LocationPermissionStatus>('prompt');

  const [userLocationLabel, setUserLocationLabel] =
    useState('Sector 14, Salt Lake, Kolkata');

  useEffect(() => {
    getCustomerBookings(
      user?.role === 'customer' ? user.id : undefined
    ).then(setBookings);

    getBusinessTasks().then(setTasks);
    getFleetAgents().then(setAgents);
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage((previous) =>
        previous === msg ? null : previous
      );
    }, 3600);
  };

  const setLocationPermission = (
    status: LocationPermissionStatus,
    customAddress?: string
  ) => {
    setLocationPermissionState(status);

    if (customAddress?.trim()) {
      setUserLocationLabel(customAddress.trim());
    } else if (status === 'granted') {
      setUserLocationLabel(
        '42 Elm Street, Block C (Live GPS Active)'
      );

      showToast(
        'Location enabled for accurate pickup and SOS.'
      );
    }
  };

  const setAuthenticatedUser = (
    nextUser: AppUser | null
  ) => {
    const currentUserId = user?.id;
    const nextUserId = nextUser?.id;

    const isNewSession =
      nextUser !== null &&
      (user === null || currentUserId !== nextUserId);

    setUser(nextUser);

    if (nextUser) {
      setSelectedRole(nextUser.role);

      // Ask for location when a new user session begins,
      // not whenever a dashboard page changes.
      if (isNewSession) {
        setLocationPermissionState('prompt');
      }
    } else {
      setLocationPermissionState('prompt');
    }
  };

  const logoutUser = async () => {
    await serviceLogout();

    setUser(null);
    setLocationPermissionState('prompt');

    showToast('Signed out of SUBIDHA demo session.');
  };

  const addCustomerBooking = async (
    input: Omit<CreateBookingInput, 'customerId'>
  ) => {
    const customerId =
      user?.role === 'customer' ? user.id : 'cust-101';

    const created = await serviceCreateBooking({
      ...input,
      customerId,
    });

    const updated = await getCustomerBookings(customerId);

    setBookings(updated);

    showToast(
      `Request ${created.id} confirmed! Assigning nearby assistant.`
    );

    return created;
  };

  const addBusinessTask = async (
    input: Omit<CreateBusinessTaskInput, 'businessId'> & {
      priority: TaskPriority;
    }
  ) => {
    const businessId =
      user?.role === 'business' ? user.id : 'biz-201';

    const created = await serviceCreateTask({
      ...input,
      businessId,
    });

    const [updatedTasks, updatedAgents] = await Promise.all([
      getBusinessTasks(),
      getFleetAgents(),
    ]);

    setTasks(updatedTasks);
    setAgents(updatedAgents);

    showToast(`Dispatch task ${created.id} added to queue.`);

    return created;
  };

  const changeTaskStatus = async (
    taskId: string,
    status: TaskStatus,
    assignedAgentId?: string
  ) => {
    await serviceUpdateTaskStatus(
      taskId,
      status,
      assignedAgentId
    );

    const [updatedTasks, updatedAgents] = await Promise.all([
      getBusinessTasks(),
      getFleetAgents(),
    ]);

    setTasks(updatedTasks);
    setAgents(updatedAgents);

    showToast(`Task ${taskId} updated to ${status}.`);
  };

  return (
    <AppStateContext.Provider
      value={{
        user,
        selectedRole,
        prefilledPhone,
        bookings,
        tasks,
        agents,
        toastMessage,
        locationPermission,
        userLocationLabel,
        setLocationPermission,
        setSelectedRole,
        setPrefilledPhone,
        setAuthenticatedUser,
        logoutUser,
        addCustomerBooking,
        addBusinessTask,
        changeTaskStatus,
        showToast,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error(
      'useAppState must be used within AppStateProvider'
    );
  }

  return context;
};
