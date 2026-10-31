
import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import { ROUTES } from './index';
import RootLayout from '@/app/_layout';

// Public pages
import HomePage from '@/app/index';
import AboutPage from '@/app/about';
import PlansPage from '@/app/plan';
import PublicServicesPage from '@/app/services';

// Authentication pages
import LoginPage from '@/app/auth/login';
import CustomerLoginPage from '@/app/auth/login/customer';
import BusinessLoginPage from '@/app/auth/login/business';
import RiderLoginPage from '@/app/auth/login/rider';

import CustomerSignupPage from '@/app/auth/signup/customer';
import BusinessSignupPage from '@/app/auth/signup/business';
import RiderSignupPage from '@/app/auth/signup/rider';
import VerifyOtpPage from '@/app/auth/verify-otp';

// Customer pages
import CustomerLayout from '@/app/customer/_layout';
import CustomerDashboard from '@/app/customer/dashboard';
import CustomerServices from '@/app/customer/services';
import CustomerBookings from '@/app/customer/bookings';
import CustomerProfile from '@/app/customer/profile';

// Business pages
import BusinessLayout from '@/app/business/_layout';
import BusinessDashboard from '@/app/business/dashboard';
import BusinessTasks from '@/app/business/tasks';
import BusinessFleet from '@/app/business/fleet';
import BusinessProfile from '@/app/business/profile';
import BusinessSubscription from '@/app/business/subscription';

// Rider pages
import RiderPendingApprovalPage from '@/app/rider/pending-approval';
import RiderDashboardPage from '@/app/rider/dashboard';
import RiderRouteGuard from './RiderRouteGuard';
import RiderLayout from '@/app/rider/_layout';
import RiderDeliveriesPage from '@/app/rider/deliveries';
import RiderEarningsPage from '@/app/rider/earnings';
import RiderProfilePage from '@/app/rider/profile';

// Admin pages
import AdminDashboardPage from '@/app/admin/dashboard';
import AdminLoginPage from '@/app/admin/login';
import AdminRouteGuard from './AdminRouteGuard';

export default function AppRoutes() {
  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL.replace(/\/$/, '')}
    >
      <RootLayout>
        <Routes>
          {/* Public website */}
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.about} element={<AboutPage />} />
          <Route path={ROUTES.plans} element={<PlansPage />} />
          <Route
            path={ROUTES.services}
            element={<PublicServicesPage />}
          />

          {/* Authentication */}
          <Route
            path={ROUTES.auth.index}
            element={
              <Navigate to={ROUTES.auth.login.index} replace />
            }
          />

          <Route
            path={ROUTES.auth.login.index}
            element={<LoginPage />}
          />
          <Route
            path={ROUTES.auth.login.customer}
            element={<CustomerLoginPage />}
          />
          <Route
            path={ROUTES.auth.login.business}
            element={<BusinessLoginPage />}
          />
          <Route
            path={ROUTES.auth.login.rider}
            element={<RiderLoginPage />}
          />

          <Route
            path={ROUTES.auth.signup.index}
            element={
              <Navigate to={ROUTES.auth.signup.customer} replace />
            }
          />
          <Route
            path={ROUTES.auth.signup.customer}
            element={<CustomerSignupPage />}
          />
          <Route
            path={ROUTES.auth.signup.business}
            element={<BusinessSignupPage />}
          />
          <Route
            path={ROUTES.auth.signup.rider}
            element={<RiderSignupPage />}
          />

          <Route
            path={ROUTES.auth.verifyOtp}
            element={<VerifyOtpPage />}
          />

          {/* Customer workspace */}
          <Route
            path={ROUTES.customer.index}
            element={<CustomerLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to={ROUTES.customer.dashboard}
                  replace
                />
              }
            />
            <Route
              path="dashboard"
              element={<CustomerDashboard />}
            />
            <Route
              path="services"
              element={<CustomerServices />}
            />
            <Route
              path="bookings"
              element={<CustomerBookings />}
            />
            <Route
              path="profile"
              element={<CustomerProfile />}
            />
          </Route>

          {/* Business workspace */}
          <Route
            path={ROUTES.business.index}
            element={<BusinessLayout />}
          >
            <Route
              index
              element={
                <Navigate
                  to={ROUTES.business.dashboard}
                  replace
                />
              }
            />
            <Route
              path="dashboard"
              element={<BusinessDashboard />}
            />
            <Route
              path="tasks"
              element={<BusinessTasks />}
            />
            <Route
              path="fleet"
              element={<BusinessFleet />}
            />
            <Route
              path="profile"
              element={<BusinessProfile />}
            />
            <Route
              path="subscription"
              element={<BusinessSubscription />}
            />
          </Route>

          {/* Rider workspace */}
          <Route path={ROUTES.rider.index}>
            <Route
              index
              element={
                <Navigate
                  to={ROUTES.rider.applicationStatus}
                  replace
                />
              }
            />

            {/* Protected rider pages */}
            <Route element={<RiderRouteGuard />}>
              <Route element={<RiderLayout />}>
                <Route
                  path="deliveries"
                  element={<RiderDeliveriesPage />}
              />
                <Route
                  path="earnings"
                  element={<RiderEarningsPage />}
                />
                <Route
                  path="profile"
                  element={<RiderProfilePage />}
                />
              </Route>

            {/* Keep the existing dashboard route for now */}

            <Route
              path="dashboard"
              element={<RiderDashboardPage />}
              />
            </Route>

            {/* Application status pages */}
            <Route
              path="pending-approval"
              element={<RiderPendingApprovalPage />}
            />
            <Route
              path="application-status"
              element={<RiderPendingApprovalPage />}
            />
          </Route>

          {/* Admin workspace */}
          <Route path={ROUTES.admin.index}>
            <Route
              index
              element={
                <Navigate to={ROUTES.admin.login} replace />
              }
            />

            <Route
              path="login"
              element={<AdminLoginPage />}
            />

            <Route element={<AdminRouteGuard />}>
              <Route
                path="dashboard"
                element={<AdminDashboardPage />}
              />
            </Route>
          </Route>

          {/* Unknown URLs */}
          <Route
            path="*"
            element={<Navigate to={ROUTES.home} replace />}
          />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
