# GarageFlow App Technical Plan

## Architecture Decision

GarageFlow App uses the existing local TSH boilerplates as the project foundation.

Backend:

- Source: `~/Downloads/tsh/express-boilerplate`
- Target: `~/Projects/garageflow-app/backend`

Frontend:

- Source: `~/Downloads/tsh/react/react-starter-boilerplate`
- Target: `~/Projects/garageflow-app/frontend`

This project intentionally does not use Next.js, Supabase or Prisma in the first version. It keeps the TSH backend and frontend conventions and only simplifies boilerplate code in separate small steps after scaffolding.

## Final Project Structure

```text
garageflow-app/
├── backend/
├── frontend/
├── docs/
│   ├── adr/
│   ├── product-plan.md
│   └── technical-plan.md
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Backend Foundation

Keep the TSH Express backend conventions:

- Express
- TypeScript
- TypeORM
- PostgreSQL
- Celebrate/Joi validation
- Structured API errors
- Mocha/Chai/Supertest API tests
- Feature-based structure
- Command/query handler style where useful
- Awilix dependency injection
- Docker-oriented local development

## Frontend Foundation

Keep the TSH React frontend conventions:

- React
- Vite
- TypeScript
- TanStack Router
- TanStack Query
- Axios
- Vitest
- Playwright
- Existing API action patterns
- Existing route and UI structure

## UI Direction

The main GarageFlow interface should remain a daily workshop timeline or list rather than a plain admin table.

Timeline/list concept:

- Mechanics or work lanes as rows where useful
- Time of day as the horizontal axis where useful
- Jobs and bookings as simple blocks or rows
- Status badges for Booked, In workshop, Waiting for customer, Waiting for parts, Ready for collection, Completed and Cancelled
- Callback due/overdue highlighting
- Quick vehicle registration search
- Customer search
- Desktop-first garage/workshop view
- Practical, dark, industrial UI style

This direction affects the backend model: workshop jobs need scheduling fields, simple status fields and callback fields.

## Backend Module Plan

Planned backend features:

```text
backend/src/app/features/
├── customers/
├── vehicles/
├── mechanics/
└── workshop-jobs/
```

Each feature should follow the existing TSH backend style:

```text
feature/
├── actions/
├── commands/
├── handlers/
├── queries/
├── query-handlers/
├── models/
├── validators/
└── routing.ts
```

Existing shared backend utilities:

```text
backend/src/shared/garage-domain/
├── domain-validation.error.ts
├── job-status.ts
├── money-in-pence.ts
├── scheduled-time-range.ts
└── vehicle-registration.ts
```

`MoneyInPence` already exists as a small reusable helper. Billing and pricing are no longer MVP scope; this helper can remain for now and be removed later if it stays unused.

## Frontend Module Plan

Planned frontend areas:

```text
frontend/src/
├── api/actions/
│   ├── customers/
│   ├── vehicles/
│   ├── mechanics/
│   └── workshop-jobs/
├── routes/
├── ui/
├── hooks/
├── providers/
├── utils/
└── types/
```

Main screens:

- Workshop timeline/list
- New workshop job
- Workshop job detail
- Vehicle detail and visit history
- Customer detail
- Callback follow-up view

## API Route Plan

First backend APIs should support simple customers, vehicles, workshop jobs and callbacks:

```text
GET    /api/workshop-timeline?date=2026-07-12

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
GET    /api/customers/search?query=smith

GET    /api/vehicles/search?registration=AB12CDE
POST   /api/vehicles
GET    /api/vehicles/:id
GET    /api/vehicles/:id/history

GET    /api/mechanics

GET    /api/workshop-jobs
POST   /api/workshop-jobs
GET    /api/workshop-jobs/:id
PATCH  /api/workshop-jobs/:id/status
PATCH  /api/workshop-jobs/:id/callback
POST   /api/workshop-jobs/:id/notes
GET    /api/callbacks/due
```

Deferred from the previous broader plan:

- Labour line APIs
- Part line APIs
- Calculated job total APIs
- Customer handover summary API
- Invoice/payment/accounting APIs

## Data Model Plan

Use TypeORM in the first persistence version.

Core entities:

- Customer
- Vehicle
- Mechanic
- WorkshopJob
- VisitNote
- CallbackReminder
- WorkshopAuditEvent

Important rules:

- Vehicle registration is normalised and unique.
- Customer phone number is required for callback-focused flows.
- WorkshopJob has one customer and one vehicle.
- WorkshopJob can have one assigned mechanic.
- WorkshopJob should support scheduled start and scheduled end, or scheduled start and expected duration, for the timeline.
- WorkshopJob status is a simple controlled workflow.
- Callback overdue state is calculated from callback due date/time and callback status.
- Audit events record important status and callback changes.
- Labour and part pricing are not MVP concerns.

## Test Strategy

Backend unit tests:

- Registration normalisation
- Scheduled time range validation
- Simple status transition rules
- Callback due/overdue calculation
- Callback status rules

Backend API tests:

- Customer creation validation
- Vehicle creation validation
- Registration search normalisation
- Customer search
- Workshop timeline by date
- Workshop job creation
- Workshop job status update
- Callback update
- Due/overdue callback listing
- Visit notes
- Vehicle/customer visit history

Frontend tests:

- Route rendering
- Timeline/list rendering
- Status badge rendering
- Callback due/overdue state rendering
- Registration search form behaviour
- Customer search form behaviour

Playwright E2E tests:

- Workshop timeline loads seeded active jobs
- Registration search opens vehicle visit history
- Customer search opens customer history
- Workshop job detail shows notes and callback state
- Callback can be marked as done
- Overdue callback is highlighted

## Security Direction

Keep the secure-by-design direction from ADR 0001:

- Validate input at API boundaries
- Normalise vehicle registration before search and persistence
- Use safe errors without leaking stack traces
- Do not log sensitive customer, vehicle or note data
- Plan requestId/correlation ID support
- Keep secrets in environment variables
- Audit important workflow changes

## Observability Direction

Keep observability lightweight but intentional:

- Health endpoint
- Structured logs
- RequestId/correlation ID
- API request duration/status metrics
- Callback overdue count metric later
- Jobs by status metric later
- Audit events for status/callback changes
- Local development should work without a full observability stack

## Milestone Plan

1. `chore: scaffold GarageFlow App from TSH boilerplates`
2. `chore: replace boilerplate branding with GarageFlow`
3. `chore: simplify unused backend boilerplate surface`
4. `chore: simplify unused frontend starter surface`
5. `feat: build static workshop timeline prototype`
6. `docs: add product and architecture decision records`
7. `feat: add garage domain shared types and helpers`
8. `docs: simplify GarageFlow product scope`
9. `feat: add customer vehicle and mechanic entities`
10. `feat: add lightweight workshop job entity`
11. `feat: add callback reminder domain logic`
12. `feat: add seed data for workshop follow-up flow`
13. `feat: add workshop timeline API`
14. `feat: add registration and customer search APIs`
15. `feat: add workshop job status and callback APIs`
16. `test: add backend workflow API coverage`
17. `test: add Playwright recruiter-visible flows`
18. `docs: polish portfolio README`
