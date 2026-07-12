# ADR 0001: GarageFlow Domain, API, Security and Observability Direction

## Status

Proposed

## Context

GarageFlow is currently a static timeline-first prototype for independent garages. The backend sample user feature has been removed, the frontend scaffold has been cleaned, and the visible UI now presents a GarageFlow product shell with a Workshop Timeline, registration search, mechanic rows, time-of-day columns, job blocks and status badges.

Before implementing real backend entities, migrations or API endpoints, the project needs a clear domain, API, security and observability direction. The app should stay small and portfolio-friendly: it should demonstrate a mature full-stack workflow, not become a full garage ERP, accounting platform or multi-tenant SaaS product.

The existing TSH backend conventions should remain the implementation baseline:

- feature-based backend structure under `backend/src/app/features`
- REST actions plus command/query handlers rather than controller classes
- Awilix dependency injection
- TypeORM for persistence when database work begins
- Celebrate/Joi validation at API boundaries
- structured API errors and integration tests
- environment-based configuration

## Research Notes: what information a garage app needs

Research across garage/workshop management and fleet maintenance products points to the same practical workflow areas: customer records, vehicle records, work orders or job cards, scheduling, mechanic assignment, notes, inspections, parts and labour, totals, vehicle history, and customer-facing summaries.

Useful sources:

- GOV.UK Software Security Code of Practice: https://www.gov.uk/government/publications/software-security-code-of-practice/software-security-code-of-practice
- OWASP Input Validation Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- OpenTelemetry Observability Primer: https://opentelemetry.io/docs/concepts/observability-primer/
- Prometheus overview: https://prometheus.io/docs/introduction/overview/
- Grafana Loki documentation: https://grafana.com/docs/loki/latest/
- Fleetio maintenance/work-order feature review used as market context: https://www.techradar.com/reviews/fleetio
- ALLDATA product/company context for repair information, inspections and shop-management direction: https://en.wikipedia.org/wiki/ALLDATA
- GarageFlow local product plan: `docs/product-plan.md`
- GarageFlow local technical plan: `docs/technical-plan.md`

Practical MVP data areas:

- customer details: name, phone, email and optional address
- vehicle registration, with normalised search form and display form
- optional vehicle make/model for MVP, with room for richer vehicle metadata later
- job card / work order with work requested, scheduled start/end, assigned mechanic and status
- internal notes and inspection-style repair notes
- labour lines, part lines and backend-calculated totals
- vehicle/job history by registration or vehicle ID
- printable customer handover summary generated from job data
- audit trail for important status, assignment and totals changes

Later data areas:

- invoices, VAT/accounting and payment records
- stock-managed parts inventory
- external MOT/DVLA lookups
- SMS/email delivery history
- customer portal state
- advanced reporting and forecasting

## Product Scope Decision

MVP includes:

- Customers
- Vehicles
- Mechanics
- Workshop jobs
- Job status workflow
- Workshop timeline by date
- Registration search
- Job notes
- Labour lines
- Part lines
- Calculated job totals
- Vehicle history
- Printable customer handover summary
- Basic audit events
- Basic observability

Out of scope for now:

- invoices
- VAT/accounting
- payments
- payroll
- SMS/email sending
- MOT/DVLA integration
- parts inventory
- multi-tenant SaaS
- mobile app
- AI features
- drag and drop scheduling
- complex reporting
- customer portal
- microservices

## Domain Model Direction

### Customer

Purpose: represent the person or organisation that owns or brings in a vehicle.

Key fields:

- `id`
- `displayName`
- `phoneNumber`
- `email`
- `address`
- `createdAt`
- `updatedAt`

Important rules:

- At least one contact channel should be present for a real customer record.
- Email and phone input should be validated and normalised where practical.
- Customer records should not contain job notes; notes belong to a `WorkshopJob`.

### Vehicle

Purpose: represent a vehicle known to the garage and connect it to customer and job history.

Key fields:

- `id`
- `customerId`
- `registrationDisplay`
- `registrationNormalized`
- `make`
- `model`
- `year`
- `createdAt`
- `updatedAt`

Important rules:

- Vehicle registration is normalised for search and uniqueness.
- `registrationNormalized` is the unique/search field; `registrationDisplay` preserves the user-facing form.
- Make/model are useful but optional for MVP.
- Vehicle history is derived from completed and historical `WorkshopJob` records.

### Mechanic

Purpose: represent a workshop worker that can be assigned to jobs and displayed as a timeline row.

Key fields:

- `id`
- `displayName`
- `isActive`
- `createdAt`
- `updatedAt`

Important rules:

- Mechanics are domain records first; they may become authenticated users later.
- Inactive mechanics should not appear as default assignment options.

### WorkshopJob

Purpose: represent the garage job card / work order that drives the timeline and workflow.

Key fields:

- `id`
- `customerId`
- `vehicleId`
- `assignedMechanicId`
- `jobNumber`
- `title`
- `workRequested`
- `status`
- `scheduledStart`
- `scheduledEnd`
- `labourSubtotalPence`
- `partsSubtotalPence`
- `totalPence`
- `createdAt`
- `updatedAt`

Important rules:

- `scheduledStart` and `scheduledEnd` support the timeline.
- Scheduled end must be after scheduled start.
- Status is controlled by a typed workflow.
- Invalid status transitions are rejected by the backend.
- Totals are calculated by the backend from labour and part lines.
- Customer handover summary is generated from job data, not manually typed as untrusted free text.

### JobNote

Purpose: record internal workshop notes, diagnostic findings and repair notes for a job.

Key fields:

- `id`
- `workshopJobId`
- `authorMechanicId`
- `noteText`
- `visibility`
- `createdAt`

Important rules:

- Notes are internal by default.
- Notes may be included in a customer handover only through an explicit summary-generation rule.
- Logs must not include full note content by default.

### LabourLine

Purpose: represent labour charged or recorded against a job.

Key fields:

- `id`
- `workshopJobId`
- `description`
- `quantityHours`
- `ratePence`
- `lineTotalPence`
- `createdAt`
- `updatedAt`

Important rules:

- Money is stored as integer pence.
- `lineTotalPence` is calculated by the backend.
- Quantity and rate must be non-negative and within configured limits.

### PartLine

Purpose: represent parts used or planned for a job.

Key fields:

- `id`
- `workshopJobId`
- `partName`
- `quantity`
- `unitCostPence`
- `lineTotalPence`
- `createdAt`
- `updatedAt`

Important rules:

- Money is stored as integer pence.
- `lineTotalPence` is calculated by the backend.
- Quantity and unit cost must be non-negative and within configured limits.
- This is not inventory management in MVP.

### WorkshopAuditEvent

Purpose: provide a business audit trail for important workflow changes.

Key fields:

- `id`
- `workshopJobId`
- `actorId`
- `eventType`
- `fromValue`
- `toValue`
- `metadata`
- `createdAt`
- `requestId`

Important rules:

- Status, assignment and totals-affecting changes should create audit events.
- Audit events should store useful metadata without storing sensitive full note content.
- Audit events should include `requestId` where the change came from an API request.

## Job Status Workflow

Statuses:

- `Booked`
- `CheckedIn`
- `Diagnosing`
- `WaitingForParts`
- `InProgress`
- `ReadyForCollection`
- `Completed`
- `Cancelled`

Allowed transitions:

- `Booked` -> `CheckedIn`
- `Booked` -> `Cancelled`
- `CheckedIn` -> `Diagnosing`
- `CheckedIn` -> `InProgress`
- `CheckedIn` -> `Cancelled`
- `Diagnosing` -> `WaitingForParts`
- `Diagnosing` -> `InProgress`
- `Diagnosing` -> `Cancelled`
- `WaitingForParts` -> `InProgress`
- `WaitingForParts` -> `Cancelled`
- `InProgress` -> `WaitingForParts`
- `InProgress` -> `ReadyForCollection`
- `InProgress` -> `Cancelled`
- `ReadyForCollection` -> `Completed`
- `ReadyForCollection` -> `InProgress`
- `Completed` has no default forward transitions
- `Cancelled` has no default forward transitions

Workflow decisions:

- Status should be represented as a controlled string literal union or enum.
- Transition rules should live in one explicit transition map.
- Invalid transitions should return a domain error mapped to a safe API error.
- Each accepted status change should create a `WorkshopAuditEvent`.

## API Direction

Use REST first. Keep GraphQL unused for this bounded context unless a later ADR chooses otherwise.

### Workshop Timeline

`GET /api/workshop-timeline?date=YYYY-MM-DD`

Purpose:

- Return the timeline view for one workshop date, grouped or groupable by mechanic.

Validation notes:

- `date` must be a valid ISO calendar date.
- Defaulting to today is acceptable later, but explicit date is clearer for tests.

Security notes:

- Protected endpoint once auth exists.
- Mechanics should only see data they are allowed to access when RBAC is introduced.

Observability notes:

- Log request method, path, status, duration and `requestId`.
- Track duration and error metrics.
- Domain metrics can include jobs by status for the requested date.

### Customers

Endpoints:

- `GET /api/customers`
- `POST /api/customers`
- `GET /api/customers/:id`

Purpose:

- Create and retrieve customer records used by vehicles and jobs.

Validation notes:

- Validate name length and contact fields.
- Use pagination for list endpoints following TSH DataGrid-style conventions where useful.

Security notes:

- Customer contact details are sensitive business data.
- Do not log phone/email values by default.
- Owner and ServiceAdvisor roles can manage customers; Mechanic role should be restricted later.

Observability notes:

- Log create/update events by customer ID, actor and `requestId`, not full contact details.

### Vehicles

Endpoints:

- `GET /api/vehicles/search?registration=AB12CDE`
- `POST /api/vehicles`
- `GET /api/vehicles/:id`
- `GET /api/vehicles/:id/history`

Purpose:

- Support quick registration search, vehicle creation and vehicle history.

Validation notes:

- Normalise registration before search and persistence.
- Reject empty or malformed registrations.
- Enforce uniqueness on `registrationNormalized`.

Security notes:

- Search endpoint should be protected for real APIs.
- Add rate limiting later because registration search is easy to enumerate.

Observability notes:

- Log search outcome as found/not found with `requestId`.
- Do not log customer contact details in vehicle search logs.

### Mechanics

Endpoint:

- `GET /api/mechanics`

Purpose:

- Return active mechanics for assignment and timeline rows.

Validation notes:

- Support active-only defaults.

Security notes:

- Protected endpoint once auth exists.

Observability notes:

- Low-risk read endpoint; include standard request metrics.

### Workshop Jobs

Endpoints:

- `GET /api/workshop-jobs`
- `POST /api/workshop-jobs`
- `GET /api/workshop-jobs/:id`
- `PATCH /api/workshop-jobs/:id/status`
- `PATCH /api/workshop-jobs/:id/assignment`
- `POST /api/workshop-jobs/:id/notes`

Purpose:

- Manage job cards / work orders, status workflow, mechanic assignment and notes.

Validation notes:

- Validate customer, vehicle and mechanic references.
- Validate schedule range.
- Validate status transitions against the transition map.
- Validate note length and visibility.

Security notes:

- Protected operations.
- Owner and ServiceAdvisor can create jobs and assign mechanics.
- Mechanics can add notes and move allowed workflow states later.
- Safe errors must not leak stack traces or database details.

Observability notes:

- Status and assignment changes create `WorkshopAuditEvent`.
- Log status transition metadata, job ID, actor ID and `requestId`.
- Track jobs by status as a domain metric.

### Labour Lines

Endpoints:

- `POST /api/workshop-jobs/:id/labour-lines`
- `PATCH /api/workshop-jobs/:id/labour-lines/:lineId`
- `DELETE /api/workshop-jobs/:id/labour-lines/:lineId`

Purpose:

- Add, update and remove labour lines for a job.

Validation notes:

- Validate description, quantity hours and rate pence.
- Recalculate job totals on every change.

Security notes:

- Owner and ServiceAdvisor can manage commercial line items.
- Mechanic permissions can be decided later.

Observability notes:

- Audit totals-affecting changes.
- Metrics can include total recalculation failures.

### Part Lines

Endpoints:

- `POST /api/workshop-jobs/:id/part-lines`
- `PATCH /api/workshop-jobs/:id/part-lines/:lineId`
- `DELETE /api/workshop-jobs/:id/part-lines/:lineId`

Purpose:

- Add, update and remove parts used or planned for a job.

Validation notes:

- Validate part name, quantity and unit cost pence.
- Recalculate job totals on every change.

Security notes:

- This is cost data and should be protected.
- Do not imply stock reservation; inventory is out of scope.

Observability notes:

- Audit totals-affecting changes.
- Do not log full free-text part notes if added later.

### Customer Handover Summary and Audit Events

Endpoints:

- `GET /api/workshop-jobs/:id/customer-handover-summary`
- `GET /api/workshop-jobs/:id/audit-events`

Purpose:

- Generate a customer-facing handover summary from job data.
- Retrieve internal audit history for a job.

Validation notes:

- Job ID must exist and be visible to the actor.
- Summary response should be derived from structured job fields and selected safe note content.

Security notes:

- Customer handover is protected until explicitly printed/exported by an authorised user.
- Audit events are internal and should not be exposed to customers.

Observability notes:

- Log summary generation by job ID and `requestId`.
- Audit event reads can be logged at debug/info without event payload details.

## Security Direction

GarageFlow should use the UK Software Security Code of Practice as a guiding influence. The code emphasises secure design and development, build environment security, secure deployment and maintenance, customer communication, secure-by-design and secure-by-default principles, dependency awareness, testing and accountability.

Secure-by-design decisions:

- Validate all input at API boundaries with Celebrate/Joi or the existing backend validation pattern.
- Treat request bodies and query parameters as `unknown` until parsed and validated.
- Normalise vehicle registration input before search, comparison and persistence.
- Use TypeORM repositories and query builders rather than raw SQL.
- Use safe error mapping and avoid stack traces in production responses.
- Include `requestId` on every API response/error when request ID middleware is added.
- Do not log customer phone/email, full addresses or full notes by default.
- Protect customer, vehicle and workshop data as business-sensitive data.
- Keep the attack surface small: REST endpoints only for MVP, no unused public domain APIs.
- Do not commit secrets; configuration comes from environment variables and `.env.dist` style templates.
- Review dependency vulnerabilities before a public demo.
- Add rate limiting later on public, auth and registration-search endpoints.
- Audit important domain changes, especially status, assignment and totals changes.
- Document security decisions in ADRs when they affect product behaviour.

Authentication and authorisation direction:

- Authentication can be deferred while the app is static/demo-only.
- Protected APIs should still be designed as if auth will exist.
- Future roles: `Owner`, `ServiceAdvisor`, `Mechanic`.
- Least privilege: mechanics need job workflow and notes; owners/service advisors can manage customers, vehicles, jobs, assignment and commercial line items.

## Observability Direction

GarageFlow should reuse the SiteCrew-style observability direction conceptually, staged for a small portfolio app.

Planned observability:

- health endpoint such as `GET /health`
- structured JSON logs
- requestId/correlationId middleware
- log API method, path, status code, duration and `requestId`
- validation errors include `requestId`
- clear error logs without sensitive data
- no customer phone/email, full notes or secrets in logs by default
- metrics endpoint where practical, such as `/metrics`
- request count, duration and error count metrics
- domain metrics:
  - jobs by status
  - jobs completed today
  - waiting for parts count
  - ready for collection count
- `WorkshopAuditEvent` records for business-critical changes
- future Prometheus/Grafana/Loki-compatible direction
- local dev should still work without a full observability stack

Prometheus is a good fit for numeric time-series metrics. Loki is a good conceptual fit for low-cost structured log aggregation. OpenTelemetry provides useful vocabulary for logs, metrics, traces and request correlation, even if full tracing is deferred.

## TypeScript Direction

GarageFlow should use precise, readable TypeScript types inspired by Total TypeScript-style practices:

- no `any`
- prefer `unknown` at trust boundaries and parse/validate before use
- use GarageFlow domain language for types
- keep DTOs separate from persistence entities where useful
- use explicit domain types such as `Customer`, `Vehicle`, `VehicleRegistration`, `Mechanic`, `WorkshopJob`, `JobStatus`, `JobNote`, `LabourLine`, `PartLine`, `ScheduledTimeRange`, `WorkshopTimeline`, `CustomerHandoverSummary` and `WorkshopAuditEvent`
- avoid generic names such as `Item`, `Data`, `Object`, `Card`, `Resource` and generic `Task` when `WorkshopJob` is more accurate
- use string literal unions or enums intentionally for stable workflows
- use discriminated unions for workflow state when that makes invalid states harder to represent
- use branded/opaque style types conceptually for identifiers, vehicle registration and money if useful
- store money as integer pence with helper functions for calculation
- use helper functions for registration normalisation and scheduled time range validation
- use `satisfies` for static maps such as job status transition maps where useful
- avoid clever type gymnastics; prefer maintainable domain code
- validate runtime input with schemas rather than trusting TypeScript alone

## Backend Implementation Sequence

Suggested small commits:

1. `docs: add GarageFlow domain API security observability ADR`
2. `feat: add garage domain shared types and helpers`
3. `feat: add mechanic customer vehicle entities`
4. `feat: add workshop job entity and status workflow`
5. `feat: add labour and part line entities`
6. `feat: add seed data for workshop timeline`
7. `feat: add workshop timeline API`
8. `feat: add vehicle registration search API`
9. `feat: add workshop job workflow APIs`
10. `feat: add job notes parts labour totals APIs`
11. `test: add backend garage workflow API coverage`
12. `docs: update API and portfolio README`

## First Implementation Recommendation

The first code commit after this ADR should be:

`feat: add garage domain shared types and helpers`

It should include:

- `VehicleRegistration` normalisation helper
- `MoneyInPence` helper/types
- `JobStatus` type and transition map
- `ScheduledTimeRange` helper/types
- unit tests

It should not include database entities, migrations, API endpoints or frontend changes.

## Consequences

Positive:

- Clear domain direction before coding.
- API design follows the timeline-first UI.
- Security and observability are planned from day one.
- The portfolio shows mature engineering process, not just screen-building.
- MVP remains focused on the garage workflow.

Trade-offs:

- More planning before visible backend features.
- Some security/auth work is intentionally deferred.
- Observability will be staged rather than fully implemented immediately.
- MVP stays intentionally small and excludes common commercial features such as invoices and payments.

## Open Questions

- Should auth be added before or after the first API demo?
- Should GraphQL remain unused or be removed later?
- Should audit events be a database table from day one?
- Should the printable handover summary be an HTML print view or PDF later?
- Should the timeline eventually support drag/drop?
- Should mechanics be users later or separate domain records?
