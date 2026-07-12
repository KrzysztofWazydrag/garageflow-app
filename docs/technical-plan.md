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

The main GarageFlow interface should be a workshop timeline rather than a plain table or simple Kanban board.

Timeline concept:

- Mechanics as rows
- Time of day as the horizontal axis
- Jobs and bookings as timeline blocks
- Status badges or colours for Booked, Checked in, Diagnosing, Waiting for parts, In progress, Ready for collection and Completed
- Quick vehicle registration search above the timeline
- Clicking a job opens the job detail workflow
- Desktop-first garage/workshop view
- Practical, dark, industrial UI style

This direction affects the backend model: jobs need scheduling fields that can support a daily timeline, such as scheduled date/time, expected duration or scheduled end time, assigned mechanic and status.

## Backend Module Plan

Planned backend features:

```text
backend/src/app/features/
├── dashboard/
├── customers/
├── vehicles/
├── mechanics/
└── jobs/
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

Shared backend utilities:

```text
backend/src/shared/
├── money/
├── registration/
└── workflow/
```

## Frontend Module Plan

Planned frontend areas:

```text
frontend/src/
├── api/actions/
│   ├── customers/
│   ├── vehicles/
│   ├── mechanics/
│   ├── jobs/
│   └── dashboard/
├── routes/
├── ui/
├── hooks/
├── providers/
├── utils/
└── types/
```

Main screens:

- Workshop timeline
- Jobs list
- New job
- Job detail
- Vehicle detail and history
- Customer detail
- Printable customer handover summary

## API Route Plan

```text
GET    /api/dashboard
GET    /api/workshop-timeline?date=2026-07-12

GET    /api/customers
POST   /api/customers
GET    /api/customers/:id

GET    /api/vehicles/search?registration=AB12CDE
POST   /api/vehicles
GET    /api/vehicles/:id
GET    /api/vehicles/:id/history

GET    /api/mechanics

GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PATCH  /api/jobs/:id/status
PATCH  /api/jobs/:id/assignment
POST   /api/jobs/:id/notes

POST   /api/jobs/:id/labour-items
PATCH  /api/jobs/:id/labour-items/:itemId
DELETE /api/jobs/:id/labour-items/:itemId

POST   /api/jobs/:id/part-items
PATCH  /api/jobs/:id/part-items/:itemId
DELETE /api/jobs/:id/part-items/:itemId

GET    /api/jobs/:id/customer-summary
```

## Data Model Plan

Use TypeORM in the first version.

Core entities:

- Customer
- Vehicle
- Mechanic
- Job
- JobNote
- LabourItem
- PartItem

Important rules:

- Vehicle registration is normalized and unique.
- Job has one customer and one vehicle.
- Job can have one assigned mechanic.
- Job should support scheduled start and scheduled end, or scheduled start and expected duration, for the workshop timeline.
- Job status drives timeline badges and workflow state.
- Labour and part line totals are calculated by the backend.
- Job total is calculated from labour and parts.
- Customer handover summary is not an invoice.

## Test Strategy

Backend API tests:

- Registration search normalization
- Workshop timeline by date
- Customer and vehicle creation validation
- Vehicle history
- Job creation
- Mechanic assignment
- Job status update
- Mechanic notes
- Parts/labour totals
- Customer summary endpoint

Frontend tests:

- Route rendering
- Timeline block rendering
- Status badge rendering
- Money formatting
- Registration search form behavior

Playwright E2E tests:

- Workshop timeline loads seeded active jobs
- Registration search opens vehicle history
- Job detail shows workflow state
- Mechanic note can be added
- Parts and labour totals are visible
- Print summary page renders customer-facing handover content

## Milestone Plan

1. `chore: scaffold GarageFlow App from TSH boilerplates`
2. `chore: replace boilerplate branding with GarageFlow`
3. `chore: simplify unused backend boilerplate surface`
4. `chore: simplify unused frontend starter surface`
5. `feat: add garage domain entities and migrations`
6. `feat: add seed data`
7. `feat: add customer and vehicle APIs`
8. `feat: add registration search and vehicle history`
9. `feat: add job workflow APIs`
10. `feat: add notes parts labour and totals`
11. `feat: build workshop timeline and registration search UI`
12. `feat: build job detail workflow UI`
13. `feat: add printable customer handover summary`
14. `test: add backend API workflow tests`
15. `test: add Playwright recruiter-visible flows`
16. `docs: polish portfolio README`
