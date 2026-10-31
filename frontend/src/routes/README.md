# SUBIDHA Route Guide

This document explains where each application route is defined and which screen file handles it.

## 1. Public routes

| URL path | Screen file |
|---|---|
| `/` | `src/app/index.tsx` |
| `/about` | `src/app/about.tsx` |
| `/plan` | `src/app/plan.tsx` |
| `/services` | `src/app/services/index.tsx` |

## 2. Authentication routes

| URL path | Screen file |
|---|---|
| `/auth` | `src/app/auth/index.tsx` |
| `/auth/login` | `src/app/auth/login/index.tsx` |
| `/auth/login/customer` | `src/app/auth/login/customer.tsx` |
| `/auth/login/business` | `src/app/auth/login/business.tsx` |
| `/auth/signup` | `src/app/auth/signup/index.tsx` |
| `/auth/signup/customer` | `src/app/auth/signup/customer.tsx` |
| `/auth/signup/business` | `src/app/auth/signup/business.tsx` |
| `/auth/verify-otp` | `src/app/auth/verify-otp.tsx` |

## 3. Customer routes

| URL path | Screen file |
|---|---|
| `/customer/dashboard` | `src/app/customer/dashboard.tsx` |
| `/customer/bookings` | `src/app/customer/bookings.tsx` |
| `/customer/services` | `src/app/customer/services.tsx` |
| `/customer/profile` | `src/app/customer/profile.tsx` |

## 4. Business routes

| URL path | Screen file |
|---|---|
| `/business/dashboard` | `src/app/business/dashboard.tsx` |
| `/business/tasks` | `src/app/business/tasks.tsx` |
| `/business/fleet` | `src/app/business/fleet.tsx` |
| `/business/subscription` | `src/app/business/subscription.tsx` |
| `/business/profile` | `src/app/business/profile.tsx` |

## 5. Central route registry

The file `src/routes/index.ts` contains the `ROUTES` object.

Import it into a component with:

`import { ROUTES } from '@/routes';`

Use it for navigation paths instead of repeating string literals.

## Important

Expo Router currently discovers screen routes from `src/app`. The `src/routes` directory is a registry and documentation location; it does not independently create screens or replace the router.
