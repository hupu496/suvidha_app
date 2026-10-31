
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from './index';
import { isAdminAuthenticated } from '@/services/admin.service';

export default function AdminRouteGuard() {
  if (!isAdminAuthenticated()) {
    return <Navigate to={ROUTES.admin.login} replace />;
  }

  return <Outlet />;
}
