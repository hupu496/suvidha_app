# SUBIDHA Backend

Django REST Framework backend for the SUBIDHA Essential Services & Logistics Platform.

## Tech Stack

- Python / Django
- Django REST Framework (DRF)
- SimpleJWT (JWT authentication)
- django-cors-headers
- Channels + Celery (dispatch/websocket infrastructure)
- SQLite (development/test database; swap to PostgreSQL + PostGIS for production)

## Project Layout

```
suvidha_backend/
├── manage.py
├── requirements.txt
├── suvidha_core/          # Django project (settings, root urls, asgi, wsgi)
└── apps/
    ├── authentication/    # User profiles, JWT & auth roles, OTP
    ├── subscriptions/     # B2C/B2B subscription plans and user subscriptions
    ├── tasks/             # Task dispatch engine, SOS trigger, fleet agents
    └── ledger/            # Zero-fee billing & OCR verification ledger
```

## Setup

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

## API Modules

- `api/v1/auth/` — phone lookup, register (customer/business/rider), OTP request/verify, JWT token, session (`me`), logout, agent duty
- `api/v1/subscriptions/` — plan list (`plans/`), user subscription (`subscriptions/`)
- `api/v1/tasks/` — task list/create/detail (`tasks/`), SOS trigger (`tasks/sos-trigger/`), business tasks (`business/tasks/`), fleet agents (`business/fleet/agents/`)
- `api/v1/ledger/` — task ledger detail (`tasks/<task_id>/`) and customer approval (`tasks/<task_id>/approve/`)

## Running Tests

```bash
python manage.py test
```

The suite covers models, serializers and API views for every module:

- `apps/authentication` — users, agents, OTP lifecycle, registration, phone lookup, session, JWT
- `apps/subscriptions` — plans, subscription lifecycle
- `apps/tasks` — task CRUD, status transitions, SOS dispatch, business task list, fleet agents
- `apps/ledger` — ledger totals, approval flows, service fees

## Notes

- Task coordinates are stored as decimal latitude/longitude columns during development so the stack runs on SQLite; move to PostGIS `PointField` when PostgreSQL + PostGIS is available in production.
- Celery runs in eager mode (`CELERY_TASK_ALWAYS_EAGER`) for local development and tests.
- Channels use the in-memory channel layer for local development.
