# SUBIDHA — UI Design

This document describes the **user interface design** of the SUBIDHA frontend.

- Design source of truth: `frontend/src/theme/tokens.ts`, `frontend/src/components/**`,
  `frontend/src/app/**`, `frontend/src/routes/**`
- Related: backend entity mapping is documented in [UI ↔ Database Alignment](#8-ui--database-alignment)

> **Status note:** SUBIDHA is under active development. The screens and components described
> here are implemented in the frontend; production backend integration status is tracked in the
> root `README.md`.

---

## Table of Contents

- [1. Design Principles](#1-design-principles)
- [2. Design Tokens](#2-design-tokens)
- [3. Component Inventory](#3-component-inventory)
- [4. Layout and Navigation Patterns](#4-layout-and-navigation-patterns)
- [5. Screen Catalog](#5-screen-catalog)
  - [5.1 Public Screens](#51-public-screens)
  - [5.2 Customer Screens](#52-customer-screens)
  - [5.3 Business Screens](#53-business-screens)
  - [5.4 Rider Screens](#54-rider-screens)
  - [5.5 Admin Screens](#55-admin-screens)
- [6. Interaction and UX Patterns](#6-interaction-and-ux-patterns)
- [7. Responsive Behavior](#7-responsive-behavior)
- [8. UI ↔ Database Alignment](#8-ui--database-alignment)
- [9. Open UI Design Questions](#9-open-ui-design-questions)

---

## 1. Design Principles

1. **Neutral backgrounds** — white (`#FFFFFF`) surfaces in light mode, near-black (`#090B0E`) in dark mode.
2. **Muted accent** — crisp emerald-green primary accent (`#0C831F` light / `#36B86A` dark), concierge-style.
3. **Rounded cards** — radii from `8` (sm) to `22` (xl), fully rounded pills (`999`).
4. **Restrained shadows** — subtle elevation; mostly border + tinted backgrounds.
5. **Role separation** — customer, business, rider, and admin experiences are structurally distinct.
6. **Light and dark themes** — all components consume tokens via `ThemeContext`.

## 2. Design Tokens

### Colors

| Token | Light theme | Dark theme | Purpose |
|---|---|---|---|
| `background` | `#FFFFFF` | `#090B0E` | Page background |
| `secondaryBackground` | `#F8FAFC` | `#101317` | Secondary background |
| `cardBackground` | `#F3F6FA` | `#171B21` | Cards / inputs / sidebar boxes |
| `primaryAccent` | `#0C831F` | `#36B86A` | Primary actions, active nav, CTAs |
| `secondaryAccent` | `#2563EB` | `#64D18A` | Secondary highlights |
| `primaryText` | `#0F172A` | `#F5F7FA` | Headings |
| `secondaryText` | `#475569` | `#A3ADB9` | Secondary content |
| `border` | `#E2E8F0` | `#2B313A` | Borders |
| `sos` | `#DC2626` | `#D94848` | Emergency SOS |
| `success` | `#059669` | `#39B86A` | Success |
| `warning` | `#D97706` | `#E0B25B` | Warning |
| `info` | `#1D63ED` | `#7FB7D9` | Info |
| `inputBackground` | `#F8FAFC` | `#101317` | Form fields |
| `overlay` | `rgba(15,23,42,0.48)` | `rgba(10,14,14,0.78)` | Modal overlay |
| `badgeBg` | `#E6F4EA` | `rgba(57,184,106,0.14)` | Soft badge background |
| `buttonTextOnAccent` | `#FFFFFF` | `#FFFFFF` | Text on primary buttons |

### Spacing and radii

- Spacing: `xs:4`, `sm:8`, `md:16`, `lg:24`, `xl:32`, `xxl:48`
- Radii: `sm:8`, `md:12`, `lg:16`, `xl:22`, `pill:999`

## 3. Component Inventory

| Component | Path | Purpose |
|---|---|---|
| `AppLogo` | `components/common/AppLogo.tsx` | Logo, sizes `sm`/`md`, optional link |
| `Buttons` | `components/common/Buttons.tsx` | `PrimaryButton`, `SecondaryButton` |
| `FormField` | `components/common/FormField.tsx` | Labelled input + validation/error |
| `ModalDialog` | `components/common/ModalDialog.tsx` | Generic modal |
| `StatusBadge` | `components/common/StatusBadge.tsx` | Status pill |
| `ToastBanner` | `components/common/ToastBanner.tsx` | Toast feedback |
| `ThemeToggle` | `components/common/ThemeToggle.tsx` | Light/dark toggle |
| `OtpSixBoxInput` | `components/common/OtpSixBoxInput.tsx` | Six-box OTP |
| `LocationPermissionModal` | `components/common/LocationPermissionModal.tsx` | Location bottom sheet |
| `AnimatedHeroGraphic` | `components/landing/AnimatedHeroGraphic.tsx` | Landing hero animation |
| `RoleLoginScreen` | `components/auth/RoleLoginScreen.tsx` | Role-aware login screen |

## 4. Layout and Navigation Patterns

### Public layout
- `PublicNavbar`: max width ~1360, centered; desktop nav (`≥1024px`): Services, How It Works, Subscription Plans, For Businesses, For Individuals, About Us; mobile drawer.
- Rider entry is via the landing-page Rider card (Continue as Rider / Register as Rider), not the navbar.

### Dashboard shell (`DashboardShell`)
- Desktop (`≥900px`): header (menu button, logo, delivery context "Assistant ETA: 11 mins", search bar max 520, Download App + theme toggle), 260px sidebar (profile card, nav list, footer: SOS / Download App / Sign Out).
- Mobile: location strip, scrollable content, fixed bottom footer grid (4 items), slide-in drawer, location bottom sheet.
- Content constrained to max frame width (1320 default).

### Breakpoints
- Dashboard desktop vs. mobile shell: `≥900px`
- Public navbar desktop vs. drawer: `≥1024px`
- Rider dashboard mobile refinements: `<700px`

## 5. Screen Catalog

### 5.1 Public Screens
| Route | Screen |
|---|---|
| `/` | Landing page (hero, animated graphic, rider entry card) |
| `/about` | About |
| `/services` | Public service discovery |
| `/plan` | Subscription plans |
| `/auth/login*` | Customer / business / rider login |
| `/auth/signup*` | Customer / business / rider signup |
| `/auth/verify-otp` | OTP verification |

### 5.2 Customer Screens
| Route | Screen | Notes |
|---|---|---|
| `/customer/dashboard` | Dashboard | Promo banners, category grid, quick actions, SOS |
| `/customer/services` | Services | Escort / errands / handyman requests |
| `/customer/bookings` | Bookings / store bills | Statuses: Requested, Scheduled, In Progress, Completed |
| `/customer/profile` | Profile & ledger | Account, emergency contact, subscription, ledger |

Nav: Home Dashboard, Request Personal Escort, Active Task & Store Bills, Profile & Ledger.

### 5.3 Business Screens
| Route | Screen |
|---|---|
| `/business/dashboard` | Dashboard |
| `/business/tasks` | New Task Dispatch |
| `/business/fleet` | Fleet Tracker |
| `/business/subscription` | Subscriptions & invoices |
| `/business/profile` | Merchant Profile |

### 5.4 Rider Screens
| Route | Screen |
|---|---|
| `/rider/dashboard` | Dashboard (online toggle, delivery tasks, payouts) |
| `/rider/deliveries` | My Deliveries (assigned → accepted → picked_up → in_transit → delivered) |
| `/rider/earnings` | Earnings (gross / fee / net) |
| `/rider/wallet` | Wallet & transactions |
| `/rider/ratings` | Ratings |
| `/rider/profile` | Rider profile / documents / bank |
| `/rider/pending-approval` | Application status |

### 5.5 Admin Screens
| Route | Screen |
|---|---|
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |

## 6. Interaction and UX Patterns

- **Emergency SOS** — sidebar action (`onTriggerSos`) + modal flow in customer/rider dashboards.
- **Location** — bottom sheet: Allow / Enter Address Manually / Not Now; manual address persisted.
- **Auth** — role-aware login, signup variants, six-box OTP, role-based post-auth redirects.
- **Feedback** — `ToastBanner`, `ModalDialog`, `StatusBadge`.

## 7. Responsive Behavior

- Desktop-first dashboard with sidebar; mobile uses bottom footer grid + drawer.
- Light/dark themes via tokens; neutral surfaces; accent CTAs.

## 8. UI ↔ Database Alignment

| Frontend type (`frontend/src/types/index.ts`) | Backend entity (`suvidha_backend/apps/**`) |
|---|---|
| `CustomerProfile` | `User` (B2C) + `Subscription` |
| `BusinessProfile` | `User` (B2B) + `Subscription` |
| `RiderProfile` | `User` (AGENT) + `AgentProfile` |
| `RiderApplication` | `AgentProfile.application_status` |
| `CustomerBooking` | `Task` (`B2C_ASSIST`) |
| `BusinessTask` | `Task` (`B2B_LOGISTICS`) |
| `RiderDelivery` | Task lifecycle / dispatch state |
| `RiderEarning` / `WalletTransaction` / `RiderRating` | Agent wallet, ledger |

## 9. Open UI Design Questions

- SOS dispatch UX pending real backend integration.
- Rider PDF upload UX (browser-only today).
- Admin screens pending full operations.
- Mobile app parity (React Native) design phase.
