# SUBIDHA — Database Design

This document describes the **database design** of the SUBIDHA backend.

- Source of truth: `suvidha_backend/apps/**` (models, serializers, migrations, views)
- Related: UI entity mapping is documented in [`frontend/UI_DESIGN.md` §8](../frontend/UI_DESIGN.md#8-ui--database-alignment)

---

## Table of Contents

- [1. Database Overview](#1-database-overview)
- [2. Model Reference](#2-model-reference)
  - [2.1 User and Role Models](#21-user-and-role-models)
  - [2.2 Agent / Rider Profile and Application Models](#22-agent--rider-profile-and-application-models)
  - [2.3 OTP Model](#23-otp-model)
  - [2.4 Task Model](#24-task-model)
  - [2.5 Subscription Models](#25-subscription-models)
  - [2.6 Task Ledger Model](#26-task-ledger-model)
- [3. Entity Relationship Summary](#3-entity-relationship-summary)
- [4. Enums and Choice Fields](#4-enums-and-choice-fields)
- [5. Open Database Design Questions](#5-open-database-design-questions)

---

## 1. Database Overview

| Aspect | State |
|---|---|
| Backend | Python + Django + Django REST Framework |
| Database | PostgreSQL (+ PostGIS per blueprint; implemented Task uses decimal lat/lng columns) |
| Realtime | Django Channels WebSockets (task location stream) |
| Async dispatch | Celery + Redis |
| Billing | Zero-fee ledger (service fee `0.00` for active subscribers) |

Implemented apps: `authentication`, `tasks`, `subscriptions`, `ledger`.

## 2. Model Reference

### 2.1 User and Role Models — `apps/authentication/models.py`

`User` extends `AbstractUser`.

| Field | Type | Notes |
|---|---|---|
| `role` | `CharField(10)` | `B2C`, `B2B`, `AGENT`, `ADMIN`; default `B2C` |
| `phone_number` | `CharField(20)`, unique | Primary contact |
| `city` | `CharField(100)` nullable | Service city |
| `preferred_language` | `CharField(20)` default `'en'` | |
| Emergency contact: `emergency_contact_name`, `emergency_contact_phone`, `is_emergency_contact_enabled` | — | Optional |
| Business fields | — | `business_name`, `contact_person_name`, `business_email`, `business_category`, `business_address`, `operational_size`, `billing_frequency`, `included_capacity`, `used_capacity` |
| Subscription fields | — | `subscription_plan_id`, `subscription_valid_until` |

Properties: `full_name`, `frontend_role` (`B2C→customer`, `B2B→business`, `AGENT→rider`, `ADMIN→admin`).

Related: **`AgentProfile`** (1:1 to user, related name `agent_profile`) and **`OtpToken`**.

### 2.2 Agent / Rider Profile and Application Models

`AgentProfile`: `is_on_duty`, `current_latitude`, `current_longitude`, `rating`,
`wallet_balance`, `vehicle_type` (`bicycle`/`motorcycle`/`scooter`/`other`),
`vehicle_registration_number`, `documents` (JSON list), `bank_account` (JSON dict),
`application_status` (`pending`/`approved`/`rejected`/`suspended`), `is_available`,
`submitted_at`, `reviewed_at`, `rejection_reason`, `admin_notes`.

### 2.3 OTP Model

`OtpToken`: `phone_number`, `role`, `code` (6), `expires_at`, `used`, `created_at`;
helpers `generate_otp`, `is_expired`, `is_valid_code`.

### 2.4 Task Model — `apps/tasks/models.py`

| Field | Type | Notes |
|---|---|---|
| `requested_by` | FK `User` CASCADE | `created_tasks` |
| `assigned_agent` | FK `User` SET_NULL | `assigned_tasks` |
| `category` | `B2B_LOGISTICS` / `B2C_ASSIST` / `EMERGENCY_SOS` | |
| `status` | `CREATED` / `OFFERED` / `ACCEPTED` / `EN_ROUTE` / `STORE_PURCHASE` / `COMPLETED` / `CANCELLED` | |
| `pickup_latitude` / `pickup_longitude` | Decimal(9,6) | nullable |
| `drop_latitude` / `drop_longitude` | Decimal(9,6) | nullable |
| `instructions` | TextField | nullable |
| `created_at` | DateTime | auto |

### 2.5 Subscription Models — `apps/subscriptions/models.py`

- `SubscriptionPlan`: `audience` (`customer`/`tourist`/`business`/`enterprise`), `name`,
  `price`, `billing_period`, `description`, `features` (JSON), `external_expense_policy`, `badge`, `is_active`.
- `Subscription`: 1:1 user → plan, `status`, `started_at`, `ends_at`; property `is_active`.

### 2.6 Task Ledger Model — `apps/ledger/models.py`

- `TaskLedger`: 1:1 task, `receipt_image` (FileField), `actual_store_cost`, `service_fee`
  (`0.00` for active subscribers), `is_approved_by_customer`, `created_at`;
  property `total_customer_charge = actual_store_cost + service_fee`.

## 3. Entity Relationship Summary

```
User
 ├─ 1:1 AgentProfile
 ├─ 1:1 Subscription ── 1:N SubscriptionPlan
 ├─ 1:N Task (requested_by)
 ├─ 1:N Task (assigned_agent)
 └─ 1:N OtpToken

Task ── 1:1 TaskLedger
```

## 4. Enums and Choice Fields

| Model | Field | Values |
|---|---|---|
| `User` | `role` | `B2C_SUBSCRIBER`, `B2B_PARTNER`, `FIELD_AGENT`, `ADMIN` |
| `AgentProfile` | `vehicle_type` | `bicycle`, `motorcycle`, `scooter`, `other` |
| `AgentProfile` | `application_status` | `pending`, `approved`, `rejected`, `suspended` |
| `Task` | `category` | `B2B_LOGISTICS`, `B2C_ASSIST`, `EMERGENCY_SOS` |
| `Task` | `status` | `CREATED`, `OFFERED`, `ACCEPTED`, `EN_ROUTE`, `STORE_PURCHASE`, `COMPLETED`, `CANCELLED` |
| `SubscriptionPlan` | `audience` | `customer`, `tourist`, `business`, `enterprise` |
| `Subscription` | `status` | `active` |
| Rider delivery (frontend) | status | `assigned`, `accepted`, `rejected`, `picked_up`, `in_transit`, `delivered`, `cancelled`, `failed` |
| Rider earning (frontend) | status | `pending`, `confirmed`, `paid` |
| Wallet transaction (frontend) | type | `earning`, `payout`, `adjustment`, `refund` |

## 5. Open Database Design Questions

1. PostGIS spatial fields vs. decimal lat/lng columns.
2. Secure private storage + retention policy for receipt images.
3. Server-side rider document upload/validation workflow.
4. Production authorization, OTP delivery, payment provider, notifications.
