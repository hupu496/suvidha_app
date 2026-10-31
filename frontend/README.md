# SUBIDHA — Essential Support & Logistics Platform

<p align="center">
  <strong>Everyday essentials. Thoughtfully simplified.</strong>
</p>

<p align="center">
  A responsive web platform for personal assistance, local errands, trusted escort support, and business logistics.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React%20Native%20Web-Responsive-61DAFB?logo=react&logoColor=black" alt="React Native Web" />
  <img src="https://img.shields.io/badge/Status-Prototype-orange" alt="Prototype" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Application Routes](#application-routes)
- [Current Implementation Status](#current-implementation-status)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Overview

**SUBIDHA** is a personal assistance and logistics platform designed to make everyday support services easier to discover, request, and coordinate.

The platform brings together individual assistance and business logistics in one experience. Individuals can explore services such as personal escorts, pharmacy pickups, errands, transit assistance, and elder check-ins. Businesses can use a dedicated operational dashboard to organize dispatches, monitor tasks, and manage fleet-related workflows.

SUBIDHA is designed around a responsive interface that works across desktop browsers, tablets, and mobile devices. It includes customer and business portals, reusable interface components, light and dark themes, and a frontend architecture intended to support a future backend integration.

> **Project status:** The current frontend is a working prototype. Some bookings, task statuses, user profiles, ratings, and dispatch records use illustrative demo data. Production authentication, persistent bookings, live tracking, real payments, and emergency dispatch require appropriate backend services and integrations.

## Problem Statement

Everyday assistance can be difficult to coordinate, particularly for people who need help with routine errands, medical visits, local transportation, or essential deliveries.

Businesses also need a structured way to coordinate pickups, deliveries, field agents, and operational tasks.

SUBIDHA aims to address these needs through a unified platform with two complementary experiences:

- **Individual assistance:** Request and organize personal support services.
- **Business logistics:** Coordinate dispatches, field operations, and delivery-related workflows.

## Key Features

### 1. Public Landing Page

- Introduction to the SUBIDHA platform.
- Overview of its assistance and logistics services.
- Navigation to informational pages and subscription plans.
- Links to customer and business authentication.
- Responsive layouts for mobile and desktop.
- Mobile app download call to action.

### 2. Customer Portal

The customer experience is designed around everyday assistance and service coordination.

- Customer dashboard and profile.
- Personal escort service discovery.
- Errand and pick-and-drop service options.
- Pharmacy pickup and banking-related assistance.
- Transit support for railway stations and airports.
- Elder check-in and home assistance concepts.
- Booking and task views.
- Billing and subscription-related screens.
- Emergency SOS interface.
- Profile and emergency contact information.

### 3. Business Portal

The business experience focuses on operational coordination.

- Dedicated business dashboard.
- Dispatch task creation and management interfaces.
- Task status and assignment displays.
- Fleet tracking interface.
- Subscription and invoice screens.
- Business profile management.
- Single-task dispatch and batch-upload interface concepts.
- Operational metrics and completed-task summaries.

### 4. Authentication and Role-Based Navigation

- Separate customer and business login experiences.
- Separate customer and business registration flows.
- Role-specific navigation and dashboard layouts.
- Navigation between customer and business authentication screens.
- OTP verification interface.

The frontend provides the authentication experience; secure identity verification and authorization must be enforced by a backend before production use.

### 5. Responsive User Interface

- Desktop layouts with wider content areas.
- Mobile-friendly dashboard layouts.
- Responsive service cards and forms.
- Mobile bottom navigation for customer screens.
- Shared layout and navigation components.
- Reusable buttons, form fields, dialogs, and notifications.
- Light and dark theme support.
- Consistent spacing, typography, and color tokens.

### 6. Theme Support

SUBIDHA includes light and dark themes designed for readability.

The visual system uses neutral backgrounds, clear text contrast, subtle borders, and green accents for primary actions. Theme state is managed through a shared context.

### 7. API Integration Structure

The frontend separates service logic from presentation components. API configuration and service modules provide a foundation for connecting the interface to a backend.

The intended backend architecture uses Django REST Framework and PostgreSQL. Until the backend endpoints are implemented and connected, the relevant screens may rely on mock data.

## User Roles

| Role | Primary responsibilities |
|---|---|
| Customer | Explore services, manage a profile, view bookings, and access assistance-related screens. |
| Business partner | Manage operational tasks, dispatches, fleet-related workflows, and business account screens. |
| Administrator | A future role for managing users, services, subscriptions, and platform operations. |

Administrator functionality is a future extension and should not be considered implemented unless an administrative module is added separately.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Static typing and maintainable application code |
| Vite | Development server and production bundler |
| React Native Web | Cross-platform UI primitives rendered in the browser |
| React Router DOM | Client-side routing |
| Lucide React | Web-compatible interface icons |
| React Hook Form | Form state management |
| Zod | Schema validation |
| React Context | Shared application and theme state |
| CSS and React Native styles | Responsive styling and component layouts |

The exact dependencies and versions are defined in `package.json`.

### Planned Backend

| Technology | Intended purpose |
|---|---|
| Python | Backend application language |
| Django REST Framework | REST API and business logic |
| PostgreSQL | Persistent relational data storage |

The backend stack describes the planned integration architecture; it does not imply that a production backend is currently deployed.

### Development and Deployment

- Git and GitHub for source control.
- npm for dependency management.
- Vitest for frontend unit testing.
- GitHub Pages for static frontend hosting, if configured for the repository.
- GitHub Actions for automated deployment, if configured.

## Project Architecture

The frontend follows a component-oriented structure with separate routes, layouts, shared UI components, application state, and service modules.

```text
frontend/
├── public/                      # Static public assets
├── src/
│   ├── app/                     # Application screens and pages
│   │   ├── auth/                # Login, registration, verification
│   │   ├── customer/            # Customer portal screens
│   │   ├── business/            # Business portal screens
│   │   ├── index.tsx            # Landing page
│   │   ├── about.tsx            # Informational page
│   │   ├── plan.tsx             # Subscription plans
│   │   └── services/            # Service discovery
│   ├── components/
│   │   ├── auth/                # Authentication components
│   │   ├── common/              # Reusable UI components
│   │   ├── landing/             # Landing page components
│   │   └── layout/              # Navigation, shells, footer
│   ├── context/                 # Shared application/theme state
│   ├── mocks/                   # Illustrative development data
│   ├── routes/                  # Route definitions
│   ├── services/                # API configuration and services
│   ├── theme/                   # Theme tokens
│   ├── __tests__/               # Frontend tests
│   ├── WebApp.tsx               # Application route entry
│   ├── main.tsx                 # React application bootstrap
│   └── global.css               # Global styles
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

*The tree illustrates the principal architectural areas. Individual files may differ as the project evolves.*

### Architecture Principles

- Reusable components instead of duplicated interface code.
- Separate customer and business experiences.
- Shared layout components for consistent navigation.
- Centralized theme management.
- API service modules separated from UI rendering.
- Responsive layouts that adapt to the available viewport.
- Mock data isolated from the intended production API layer.

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js compatible with the installed Vite version.
- npm.
- Git.
- A code editor such as Visual Studio Code.

### 1. Clone the repository

Replace the repository URL below with your actual GitHub repository URL.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY/frontend
```

If the repository contains only the frontend, navigate to its root instead of using the `frontend` subdirectory.

### 2. Install dependencies

```bash
npm install
```

If `package-lock.json` is committed and you want a reproducible clean installation, use:

```bash
npm ci
```

Use one installation command, not both consecutively.

### 3. Configure environment variables

Create a `.env.local` file in the frontend project root if your API configuration requires an environment variable.

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

This is the expected local API URL when the backend is configured to run on port `8000`. Update it to match your actual backend.

Do not put passwords, private API keys, database credentials, or other secrets in frontend environment variables. Values prefixed with `VITE_` are exposed to client-side code.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal. The configured development port is `5173`, although the actual URL depends on the current Vite configuration.

### 5. Build the production frontend

```bash
npm run build
```

Vite generates the production assets in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Application Routes

The frontend uses React Router for navigation.

The principal route groups are:

| Route group | Purpose |
|---|---|
| `/` | Public landing page |
| `/about` | Platform information |
| `/services` | Service discovery |
| `/plans` | Subscription plans |
| `/auth/login/customer` | Customer login |
| `/auth/login/business` | Business login |
| `/auth/signup/customer` | Customer registration |
| `/auth/signup/business` | Business registration |
| `/auth/verify-otp` | OTP verification interface |
| `/customer/dashboard` | Customer dashboard |
| `/customer/bookings` | Customer bookings and task-related views |
| `/customer/services` | Customer service discovery |
| `/business/dashboard` | Business operations dashboard |
| `/business/fleet` | Fleet-related interface |
| `/business/tasks` | Business task management |
| `/business/subscription` | Business subscription and invoice screens |
| `/business/profile` | Business profile |

These are the intended primary paths. Confirm the actual route definitions in `src/routes/AppRoutes.tsx` and `src/routes/index.ts` before publishing, as paths can change during development.

## Current Implementation Status

| Area | Status |
|---|---|
| Public landing page | Implemented |
| Customer and business UI | Implemented as frontend screens |
| Responsive layouts | Implemented and under refinement |
| Light and dark themes | Implemented |
| Client-side navigation | Implemented |
| Authentication forms | Frontend implementation |
| OTP verification | Interface implemented; production verification requires backend integration |
| Demo profiles and task data | Illustrative mock data |
| Persistent production bookings | Requires backend integration |
| Live agent GPS tracking | Requires location services and backend integration |
| Emergency SOS dispatch | UI prototype; real dispatch is not implied |
| Subscription payments | Requires payment integration |
| Django REST API | Planned |
| PostgreSQL persistence | Planned for backend integration |
| Production authorization | Requires secure backend enforcement |

## Testing and Quality Checks

Run the checks defined in `package.json`.

### TypeScript

```bash
npm run typecheck
```

### Unit tests

```bash
npm run test
```

### Production build

```bash
npm run build
```

Before submitting a change, verify the affected pages in both desktop and mobile viewport sizes.

Recommended manual checks include:

- Customer login and registration navigation.
- Business login and registration navigation.
- Dashboard width at desktop sizes.
- Mobile bottom navigation and scrolling.
- Profile pages and footer positioning.
- Light and dark theme readability.
- Forms, dialogs, and notifications.
- Direct navigation to application routes.
- Production build and deployed-route behavior.

A command should be described as passing only after it has been run successfully against the current code.

## Deployment

### Option 1: Static Hosting

The Vite production build can be deployed to a static hosting provider.

Build the project:

```bash
npm run build
```

Deploy the contents of `dist/` using your hosting provider's supported workflow.

### Option 2: GitHub Pages

If you deploy to a repository-based GitHub Pages URL, configure Vite's `base` option to match the repository path.

For example, a project hosted at:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

typically needs a base path such as:

```ts
base: '/YOUR_REPOSITORY/',
```

A root-domain or custom-domain deployment generally uses a different base path.

If the project uses client-side routing, configure the hosting workflow to handle direct navigation and page refreshes. The repository may use a generated `404.html` fallback and a `.nojekyll` file, depending on its deployment configuration.

Check `vite.config.ts`, `package.json`, and `.github/workflows/` to confirm the current deployment setup before running deployment commands.

## Roadmap

### Frontend

- [ ] Finish responsive layout and footer refinements.
- [ ] Validate authentication switching for all customer/business flows.
- [ ] Improve loading, empty, error, and success states.
- [ ] Verify keyboard navigation and accessibility.
- [ ] Add consistent form validation and feedback.
- [ ] Complete desktop, tablet, and mobile UI checks.

### Backend and Data

- [ ] Build the Django REST Framework backend.
- [ ] Configure PostgreSQL and database migrations.
- [ ] Implement secure registration, login, and OTP verification.
- [ ] Add server-side role-based authorization.
- [ ] Persist users, bookings, tasks, and subscriptions.
- [ ] Implement task assignment and dispatch APIs.
- [ ] Integrate location updates and agent tracking.
- [ ] Integrate payment processing and invoice records.
- [ ] Add audit logs, monitoring, and error reporting.

### Production Readiness

- [ ] Add automated CI checks.
- [ ] Configure production environment variables.
- [ ] Add API and integration tests.
- [ ] Review security, privacy, and access control.
- [ ] Validate emergency workflows before offering them as a real service.

## Security Considerations

SUBIDHA handles workflows that may involve personal details, addresses, emergency contacts, and location information.

Before production deployment:

- Enforce authentication and authorization on the server.
- Never rely solely on client-side role selection to protect customer or business data.
- Validate all incoming data on the backend.
- Use HTTPS for production traffic.
- Protect sensitive data and limit its retention.
- Request location permission only when needed and explain its purpose.
- Avoid logging passwords, OTPs, or unnecessary personal information.
- Protect payment operations with a trusted payment provider.
- Do not represent demo SOS or GPS interfaces as operational emergency services.
- Store secrets in appropriate server-side configuration rather than frontend code.

## Contributing

Contributions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run the relevant type checks, tests, and production build.
5. Review the UI at desktop and mobile sizes.
6. Open a pull request describing the change.

Suggested branch naming:

```text
feature/customer-bookings
feature/business-dispatch
fix/mobile-footer
fix/theme-contrast
```

## License

No license has been specified yet.

Before making the repository public or accepting external contributions, add a `LICENSE` file with the license you choose. Until then, do not assume that others have permission to reuse or redistribute the code.

---

<p align="center">
  <strong>SUBIDHA</strong><br />
  Everyday essentials. Thoughtfully simplified.
</p>
