# GarageFlow

GarageFlow is a simple workshop follow-up tracker for independent garages. It helps keep customer details, vehicle registration, visit notes and promised callbacks in one place.

This is a portfolio MVP and work in progress. It is not production software, it is not used by real garages, and it is not a complete garage ERP.

## Current Status

GarageFlow currently has a static frontend workshop timeline prototype plus tested backend domain helpers.

Backend APIs and persistence are planned, but not implemented yet.

## What Is Implemented

### Frontend prototype

- Static Workshop Timeline UI
- Mechanics displayed as rows
- Time-of-day scheduling
- Job blocks with vehicle registration, job title, time range and status
- Quick registration search UI
- GarageFlow app shell summary
- SPA-style header

### Backend foundation

- `VehicleRegistration` normalisation
- `MoneyInPence` validation and addition
- `JobStatus` workflow transition map and guard
- `ScheduledTimeRange` validation
- `DomainValidationError`
- Mocha/Chai unit tests

`MoneyInPence` exists as a small reusable helper, but billing and pricing are no longer MVP scope. A later cleanup can remove it if it remains unused.

## Engineering Highlights

- Built from cleaned The Software House full-stack boilerplates
- React, Vite and TypeScript frontend
- Express and TypeScript backend
- TypeORM/PostgreSQL direction
- Spec-driven UI work
- ADR-driven planning
- Secure-by-design direction
- Observability planned from day one
- Small commits and clean progression

## Product Direction

GarageFlow focuses on a smaller real-world garage problem: messy handwritten notes, repeated customer and vehicle detail capture, and missed promised callbacks.

The app should answer:

- Who is the customer?
- What car is it?
- Why is it here?
- What did we promise?
- When should we call back?
- Has the customer been contacted?
- What is the current simple job status?
- What notes did we write last time?

Target workflow:

```text
customer -> vehicle -> workshop job -> visit notes -> callback reminder -> simple status -> visit history
```

Out of scope for now:

- invoicing
- accounting
- payments
- VAT
- parts/labour costing
- ERP
- multi-tenant SaaS

## Security And Observability Direction

GarageFlow uses the UK Software Security Code of Practice as an influence for its secure-by-design direction.

Planned security and observability work includes:

- API boundary validation
- safe error handling
- no sensitive customer, vehicle or note data in logs
- requestId/correlation ID support
- health, metrics and structured logging direction
- audit events for status and callback changes

## Roadmap

- Simple customer API
- Simple vehicle API
- Lightweight workshop job API
- Callback reminders
- Overdue callback highlighting
- Registration search
- Customer search
- Visit history
- Unit/API/E2E tests

## Local Development

Root:

```bash
docker compose up postgres
```

Frontend:

```bash
cd frontend
npm start
npm run typecheck
npm test -- --run
npm run build
```

Backend:

```bash
cd backend
npm run build
npm run services-units
```

## Project Docs

- [Product plan](docs/product-plan.md)
- [Technical plan](docs/technical-plan.md)
- [ADR 0001: GarageFlow Domain, API, Security and Observability Direction](docs/adr/0001-garageflow-domain-api-security-observability.md)
- [ADR 0002: Simplify GarageFlow to a Workshop Follow-Up Tracker](docs/adr/0002-simplify-garageflow-to-workshop-follow-up-tracker.md)
