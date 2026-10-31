
# SUBIDHA — Essential Support & Logistics Platform

<p align="center">
  <strong>Everyday essentials. Thoughtfully simplified.</strong>
</p>

<p align="center">
  A responsive service and logistics platform connecting customers, business partners, and riders through role-specific experiences.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React%20Native%20Web-Responsive-61DAFB?logo=react&logoColor=black" alt="React Native Web" />
  <img src="https://img.shields.io/badge/Status-Active%20Development-orange" alt="Active Development" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Problem and Product Goals](#problem-and-product-goals)
- [User Roles](#user-roles)
- [Features](#features)
- [Authentication and Role Separation](#authentication-and-role-separation)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Application Routes](#application-routes)
- [Implementation Status](#implementation-status)
- [Development Commands](#development-commands)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Security and Privacy](#security-and-privacy)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SUBIDHA** is an essential support and logistics platform intended to make everyday assistance easier to discover, request, and coordinate. It brings individual assistance and business logistics into one application while keeping each user type's experience separate.

The application is being developed with a responsive frontend using React, TypeScript, and React Native Web. It supports desktop and mobile browser layouts, shared UI components, role-specific dashboards, and light and dark themes.

SUBIDHA is organized around four application roles:

- **Customer** — discovers and requests assistance services.
- **Business** — manages business-side tasks and logistics workflows.
- **Rider** — accesses a dedicated rider registration, login, and operational experience.
- **Admin** — accesses a protected administrative area for platform-level operations.

> **Project status:** SUBIDHA is under active development. The frontend contains implemented screens and workflows, but a visible interface does not automatically mean that the corresponding production service is operational. Authentication, OTP verification, document storage, bookings, dispatch, payments, location tracking, and administrative actions must be backed by secure and tested server-side APIs before production use.

## Problem and Product Goals

Individuals may need help with everyday errands, pharmacy pickups, local assistance, or travel-related support. Businesses may need a more structured way to coordinate field tasks and deliveries. Service providers also need a dedicated experience rather than sharing customer or business account flows.

SUBIDHA aims to bring these experiences together while maintaining clear role boundaries:

1. Give customers a straightforward way to explore and request services.
2. Give businesses tools to organize tasks and operational workflows.
3. Give riders a separate entry point and registration process.
4. Provide administrators with a protected area for platform management.
5. Keep the interface consistent across desktop and mobile screens.

## User Roles

| Role | Intended use | Entry point |
|---|---|---|
| Customer | Browse assistance services, manage account details, and view bookings | Customer sign in / sign up |
| Business | Manage business account and logistics workflows | Business sign in / sign up |
| Rider | Register as a rider and access rider-specific screens | Rider card on the public landing page |
| Admin | Access platform administration tools | Protected admin route |

Role access is deliberately separated. Rider authentication is not part of the general Customer/Business sign-in selector. A user should enter the rider flow through the Rider section on the landing page. Admin routes are protected separately from public customer and business navigation.

## Features

### 1. Public Website

- Landing page introducing SUBIDHA and its service model.
- Service, plan, business, individual, and about sections.
- Responsive public navigation for desktop and mobile.
- Customer and business sign-in entry points.
- A dedicated Rider section on the landing page with separate actions:
  - **Continue as Rider** — opens rider login.
  - **Register as Rider** — opens rider registration.
- Light and dark theme support.

Rider access is intentionally not exposed as a general item in the public top navigation. The Rider landing-page section is the intended public entry point for rider authentication and registration.

### 2. Customer Experience

The customer portal is intended for people requesting everyday support.

- Customer authentication and registration screens.
- Customer dashboard and profile area.
- Service discovery and assistance-related screens.
- Booking and task-related views.
- Subscription and billing-related interface areas.
- Emergency/SOS interface concepts.
- Responsive dashboard navigation.

The exact availability of each workflow depends on the current route and backend integration.

### 3. Business Experience

The business portal is intended for organizations coordinating services and field operations.

- Business-specific authentication and registration.
- Business dashboard.
- Business profile and account screens.
- Task and dispatch management interfaces.
- Fleet-related screens.
- Subscription and invoice-related interface areas.
- Responsive navigation and dashboard layout.

### 4. Rider Experience

Riders have a separate authentication and registration flow.

- Dedicated rider login route.
- Dedicated rider registration route.
- Rider-specific dashboard area and navigation.
- Rider registration form fields for personal, contact, vehicle, identity, and bank details.
- PDF document selection in the web registration form for the supported rider documents.
- Rider route protection separate from customer and business route protection.

**Document upload limitation:** The current web form can select and validate a PDF in the browser. Selecting a file does not by itself upload it or store it on a server. A multipart API endpoint, server-side validation, and secure document storage are required to complete document submission.

### 5. Admin Experience

- Separate admin route area.
- Admin-specific route guard.
- Admin service module and screens where implemented.

The existence of an admin route or guard should not be interpreted as proof that every administrative operation is complete or production-ready. Verify the current admin pages and API behavior in the source.

### 6. Authentication and Navigation

- Separate customer and business login and registration flows.
- Dedicated rider login and registration routes.
- OTP verification interface.
- Role-aware navigation and dashboard layouts.
- Separate route guards for protected role areas.
- Public navigation that does not expose rider login as a general top-level navigation item.

Client-side route guards improve navigation flow, but they are not a security boundary. The backend must independently authenticate users and authorize every protected operation.

### 7. Responsive UI and Themes

- Desktop dashboard layouts with a sidebar.
- Mobile navigation with a drawer and bottom navigation where applicable.
- Shared dashboard shell and reusable layout components.
- Reusable form fields, buttons, dialogs, and common UI elements.
- Light and dark themes.
- Shared theme tokens and application state.
- Responsive landing page and role-specific screens.

### 8. API Service Layer

API-related code is organized into service modules rather than being embedded directly in presentation components. This provides a place to centralize requests and connect the frontend to backend endpoints.

The planned backend direction is Python with Django REST Framework and PostgreSQL. Treat this as the intended architecture unless the backend repository and deployment configuration confirm that the services are already running.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based UI |
| TypeScript | Static typing |
| Vite | Development server and production bundler |
| React Native Web | React Native-style components rendered in web browsers |
| React Router DOM | Client-side routing |
| Lucide React / Lucide React Native | Interface icons, depending on component usage |
| React Hook Form | Form state management |
| Zod | Form and data validation |
| React Context | Shared application and theme state |
| CSS and React Native styles | Layout and responsive styling |

The installed package versions are defined in `frontend/package.json` and `frontend/package-lock.json`. Refer to those files for the exact versions currently used by the repository.

### Planned / Intended Backend

| Technology | Intended responsibility |
|---|---|
| Python | Backend language |
| Django | Backend application framework |
| Django REST Framework | REST API and business logic |
| PostgreSQL | Persistent relational database |

Additional backend services may be introduced for file storage, OTP delivery, payments, notifications, and location updates. Their presence should be confirmed in the backend source and deployment configuration.

### Development Tools

- Git and GitHub — version control and collaboration.
- npm — frontend dependency management.
- Visual Studio Code — development environment.
- Vitest — unit testing, if configured in the current package scripts.
- GitHub Actions — CI or deployment automation, if configured in the repository.

## Architecture

The frontend is organized by responsibility:

- `app/` contains route-level screens.
- `components/` contains reusable UI and layout components.
- `context/` contains shared application state.
- `routes/` contains route definitions and access guards.
- `services/` contains API-facing service modules.
- `theme/` contains theme definitions and design tokens.
- `mocks/` contains development/demo data where used.

### Architecture Principles

1. Keep route-level screens separate from reusable components.
2. Keep customer, business, rider, and admin experiences distinct.
3. Reuse shared components where behavior and presentation are genuinely common.
4. Keep API calls in service modules.
5. Centralize theme and shared application state.
6. Use server-side authorization for all protected data and actions.
7. Keep mock/demo data distinguishable from persistent backend data.

## Project Structure

The following is a **logical overview** of the frontend. It is not intended to replace the actual directory listing; filenames may change as development continues.

```text
SUBIDHA/
├── frontend/
│   ├── public/                         # Static assets
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── signup/
│   │   │   │   └── verify-otp.tsx      # OTP verification screen
│   │   │   ├── customer/               # Customer portal screens
│   │   │   ├── business/               # Business portal screens
│   │   │   ├── rider/                  # Rider portal screens
│   │   │   ├── admin/                  # Admin screens
│   │   │   ├── services/               # Public service screens
│   │   │   ├── index.tsx               # Public landing page
│   │   │   ├── about.tsx               # About page
│   │   │   └── plan.tsx                # Subscription plans
│   │   ├── components/
│   │   │   ├── auth/                   # Authentication components
│   │   │   ├── common/                 # Shared UI components
│   │   │   ├── landing/                # Landing page components
│   │   │   └── layout/                 # Navbar, dashboard shell, footer
│   │   ├── context/                    # Shared app/theme state
│   │   ├── mocks/                      # Development/demo data
│   │   ├── routes/
│   │   │   ├── AppRoutes.tsx           # Route registration
│   │   │   ├── AdminRouteGuard.tsx     # Admin route protection
│   │   │   ├── RiderRouteGuard.tsx     # Rider route protection
│   │   │   └── index.ts                # Route constants/exports
│   │   ├── services/
│   │   │   ├── auth.service.ts         # Authentication API functions
│   │   │   ├── admin.service.ts        # Admin API functions
│   │   │   └── ...                     # Other API service modules
│   │   ├── theme/                      # Theme tokens and definitions
│   │   ├── WebApp.tsx                  # Application route entry
│   │   ├── main.tsx                    # React bootstrap
│   │   └── global.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── ...                                 # Other project files 
```

## Getting Started

### Prerequisites

Install:

- Node.js version compatible with the Vite version in the project.
- npm.
- Git.
- A code editor such as Visual Studio Code.

### 1. Clone the Repository

```bash
git clone https://github.com/Soum12ya/Subidha.git
cd Subidha
```

### 2. Navigate to the Frontend

```bash
cd frontend
```

If your local checkout has a different folder layout, navigate to the directory containing the frontend `package.json`.

### 3. Install Dependencies

```bash
npm install
```

For a clean installation using the committed lockfile:

```bash
npm ci
```

Use either `npm install` or `npm ci` as appropriate; there is no need to run both one after the other.

### 4. Configure Environment Variables

If the frontend API client expects a backend URL, create a `.env.local` file in the frontend directory:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Use the exact variable name and URL expected by the current API configuration. This value is an example for a backend listening locally on port `8000`; confirm the actual backend port and API prefix.

**Important:** Variables prefixed with `VITE_` are included in the browser bundle and are visible to users. Never store database passwords, private API keys, signing secrets, or other confidential credentials in frontend environment variables.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in the terminal by Vite.

### 6. Create a Production Build

```bash
npm run build
```

Vite normally writes the production bundle to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## Application Routes

The following routes reflect the role-separated route design. Confirm exact paths in `frontend/src/routes/AppRoutes.tsx` and `frontend/src/routes/index.ts`, because route constants may evolve.

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/about` | About SUBIDHA |
| `/services` | Public service discovery |
| `/plans` | Subscription plans |
| `/auth/login/customer` | Customer login |
| `/auth/login/business` | Business login |
| `/auth/login/rider` | Rider login |
| `/auth/signup/customer` | Customer registration |
| `/auth/signup/business` | Business registration |
| `/auth/signup/rider` | Rider registration |
| `/auth/verify-otp` | OTP verification |
| `/customer/...` | Customer portal |
| `/business/...` | Business portal |
| `/rider/...` | Rider portal |
| `/admin/...` | Protected admin area |

### Role-Entry Rules

- The general Sign In flow is for Customer and Business.
- Rider login and registration are accessed from the Rider card on the public landing page.
- Rider login and registration are not listed as a general public navbar destination.
- Customer and Business authentication should not expose Rider as a selectable role.
- Admin pages should be reachable only through the intended protected admin flow.

## Implementation Status

This table describes the known frontend scope. It does not certify that backend integrations or production workflows are complete.

| Area | Current understanding |
|---|---|
| Public landing page | Frontend implemented; includes role entry points |
| Customer portal | Frontend screens and navigation implemented / evolving |
| Business portal | Frontend screens and navigation implemented / evolving |
| Rider login and registration | Dedicated frontend routes implemented / evolving |
| Rider dashboard area | Rider-specific frontend area present |
| Admin area | Admin route area and route guard present; verify individual operations |
| Role-aware route guards | Client-side guards present for protected role areas |
| OTP verification | Frontend flow exists; real verification requires backend integration |
| Rider PDF document selection | Browser-side selection and validation; server upload/storage still required |
| Theme support | Light and dark theme support implemented |
| Responsive layouts | Desktop and mobile layouts implemented / under refinement |
| Persistent bookings and dispatch | Requires verified backend integration |
| Live rider GPS tracking | Requires location services and backend integration |
| Payments and invoices | Requires payment and backend integration |
| Production authorization | Must be enforced by backend APIs |

Update this table whenever a feature is connected to a working backend or its implementation status changes.

## Development Commands

Run commands from the frontend directory:

```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Other scripts may be available in `package.json`. Check the `scripts` section before relying on commands such as `test`, `typecheck`, or `lint`.

## Testing and Quality Checks

Before committing changes, run the checks that are actually configured in `package.json`.

Recommended check:

```bash
npm run build
```

If the corresponding scripts exist, also run:

```bash
npm run typecheck
npm run test
npm run lint
```

Do not assume these optional scripts exist; verify the package scripts first.

### Manual Verification Checklist

- [ ] Landing page renders at desktop and mobile widths.
- [ ] Public navbar and mobile drawer behave correctly.
- [ ] Customer login and registration navigate to customer routes.
- [ ] Business login and registration navigate to business routes.
- [ ] Rider card opens the dedicated rider login and registration routes.
- [ ] Rider is not shown in the general Customer/Business login selector.
- [ ] Rider is not shown as a top-level public navbar item.
- [ ] Customer, Business, Rider, and Admin route access is checked independently.
- [ ] Dashboard sidebars, mobile drawers, and bottom navigation work.
- [ ] Light and dark themes remain readable.
- [ ] Forms show validation and error states.
- [ ] OTP flow handles success and failure responses correctly.
- [ ] Direct URL navigation and browser refresh work on deployed routes.
- [ ] Production build completes successfully.

## Deployment

The Vite frontend can be deployed to a static hosting provider after a successful production build.

```bash
npm run build
```

Deploy the generated `dist/` directory using the hosting provider's supported workflow.

### GitHub Pages

For a repository-based GitHub Pages URL such as:

```text
https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/
```

Vite may need a matching `base` setting in `vite.config.ts`:

```ts
base: '/YOUR_REPOSITORY/',
```

A root domain or custom domain generally uses a different base path.

Because SUBIDHA uses client-side routing, configure the hosting provider to support direct navigation and page refreshes on nested routes. Confirm the repository's actual deployment workflow before assuming GitHub Pages is configured.

## Roadmap

### Frontend and UX

- [ ] Complete and verify customer, business, rider, and admin flows.
- [ ] Improve loading, empty, error, and success states.
- [ ] Finish responsive checks across desktop, tablet, and mobile.
- [ ] Improve accessibility and keyboard navigation.
- [ ] Add consistent form validation and feedback.
- [ ] Verify route refresh and deep-link behavior in production.

### Authentication and Account Management

- [ ] Complete secure backend registration and login for every supported role.
- [ ] Complete OTP delivery and server-side OTP verification.
- [ ] Enforce role-based permissions in backend APIs.
- [ ] Implement secure session/token lifecycle and logout behavior.
- [ ] Add account recovery and verification flows as required.

### Rider Operations

- [ ] Connect rider registration to the backend.
- [ ] Implement secure PDF document upload and storage.
- [ ] Add server-side document validation and review status.
- [ ] Implement rider availability and delivery/task assignment.
- [ ] Add reliable location updates and tracking with user consent.
- [ ] Implement rider earnings and delivery history where required.

### Customer and Business Operations

- [ ] Persist customer bookings and service requests.
- [ ] Implement business task creation, assignment, and dispatch APIs.
- [ ] Connect fleet and task status updates to persistent data.
- [ ] Add notifications and booking updates.
- [ ] Integrate subscriptions, invoices, and payment processing.

### Admin and Production Operations

- [ ] Complete admin user and role management.
- [ ] Add operational monitoring and audit logs.
- [ ] Add automated frontend and backend CI checks.
- [ ] Configure production secrets and environment settings.
- [ ] Complete security, privacy, and performance reviews.
- [ ] Test critical workflows end to end before launch.

## Security and Privacy

SUBIDHA may handle personal information such as names, phone numbers, addresses, identity documents, bank details, emergency contacts, and location information. These data types require careful handling.

Before production use:

- Enforce authentication and authorization on the server.
- Never rely only on frontend route guards or role selection to protect data.
- Validate and sanitize all incoming data on the backend.
- Use HTTPS for production traffic.
- Store uploaded identity and vehicle documents in private storage with access controls.
- Limit access to sensitive documents and define retention/deletion policies.
- Do not expose bank details, identity numbers, OTPs, or tokens in logs.
- Keep secrets and database credentials on the server, not in frontend code.
- Request location permission only when necessary and explain why it is needed.
- Use a trusted payment provider; do not store raw card details.
- Do not represent demo SOS, GPS, or dispatch screens as real emergency services.
- Apply rate limiting and abuse protection to authentication and OTP endpoints.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a focused feature branch.
3. Make changes consistent with the existing architecture.
4. Run the relevant checks from `package.json`.
5. Test affected role flows on desktop and mobile.
6. Commit with a clear message.
7. Open a pull request describing the change and any remaining limitations.

Suggested branch names:

```text
feature/rider-registration
feature/customer-bookings
feature/business-dispatch
feature/admin-management
fix/mobile-navigation
fix/auth-role-routing
```

## License

No license has been specified in this repository documentation.

Add a `LICENSE` file before explicitly granting others permission to use, modify, or redistribute the project. Until a license is added, do not assume the source code is open for reuse.

---

<p align="center">
  <strong>SUBIDHA</strong><br />
  Everyday essentials. Thoughtfully simplified.
</p>
