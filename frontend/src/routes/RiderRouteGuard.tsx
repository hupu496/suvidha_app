
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/routes';
import { getCurrentUser } from '@/services/auth.service';

export default function RiderRouteGuard() {
  const currentUser = getCurrentUser();

  // No authenticated user: require rider login.
  if (!currentUser) {
    return (
      <Navigate
        to={ROUTES.auth.login.rider}
        replace
      />
    );
  }

  // Only rider accounts can enter the rider workspace.
  if (currentUser.role !== 'rider') {
    return <Navigate to={ROUTES.home} replace />;
  }

  // Pending riders must wait for admin approval.
  if (currentUser.applicationStatus === 'pending') {
    return (
      <Navigate
        to={ROUTES.rider.pendingApproval}
        replace
      />
    );
  }

  // Rejected riders must see their application status.
  if (currentUser.applicationStatus === 'rejected') {
    return (
      <Navigate
        to={ROUTES.rider.applicationStatus}
        replace
      />
    );
  }

  // Only approved riders can enter the workspace.
  if (currentUser.applicationStatus !== 'approved') {
    return (
      <Navigate
        to={ROUTES.rider.applicationStatus}
        replace
      />
    );
  }

  return <Outlet />;
}
