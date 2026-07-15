# ADR 0002: Simplify GarageFlow to a Workshop Follow-Up Tracker

## Status

Proposed

## Context

ADR 0001 described a broader workshop management direction with labour lines, part lines, calculated totals and customer handover summaries.

A real garage observation changed the product understanding. The garage already has software for invoicing, payments, part purchases and costing. GarageFlow should not duplicate those systems.

The unresolved pain is more specific:

- messy handwritten workshop notes
- repeated customer detail capture
- repeated vehicle registration capture
- repeated phone number capture
- promised callbacks that do not happen
- lack of easy visit history and context

GarageFlow should become smaller and sharper: a simple customer, vehicle, workshop job notes and callback tracker.

## Decision

GarageFlow MVP becomes a simple workshop follow-up tracker.

It will focus on:

- customer identity and phone number
- vehicle registration
- lightweight workshop job reason/status
- visit notes
- promised callback date/time
- callback completion
- visit history

GarageFlow will not duplicate invoice, accounting, payment, VAT, parts pricing or labour costing systems.

## Domain Model

Use:

- Customer
- Vehicle
- WorkshopJob
- VisitNote
- CallbackReminder
- WorkshopAuditEvent

### Naming Decision

Keep `WorkshopJob` as the core name.

`WorkshopVisit` is accurate for a simplified visit flow and avoids implying billing. However, `WorkshopJob` is more garage-native, already matches the UI language, and remains understandable to mechanics and service advisors.

In the MVP, `WorkshopJob` is lightweight and non-financial. It represents the reason the vehicle is in the workshop, its simple status, notes and callback obligations. It does not imply invoice, labour pricing or part pricing.

## Simplified Statuses

Use:

- Booked
- InWorkshop
- WaitingForCustomer
- WaitingForParts
- ReadyForCollection
- Completed
- Cancelled

Remove or defer:

- Diagnosing
- InProgress
- labour/pricing related states

The status workflow should remain controlled by explicit TypeScript unions and transition rules.

## Callback Workflow

Use callback-focused fields:

- `callbackRequired: boolean`
- `callbackDueAt: Date | null`
- `callbackStatus: NotRequired | Required | Done`
- `lastContactedAt: Date | null`

Overdue should be calculated from `callbackDueAt` and `callbackStatus`, not stored, unless later reporting requirements prove otherwise.

## In Scope

- customer full name
- customer phone number
- vehicle registration display
- vehicle registration normalised
- optional make/model
- reason for visit
- simple status
- visit notes
- promised callback date/time
- callback status
- last contacted timestamp
- daily workshop list/timeline
- registration search
- customer search
- callback reminders
- overdue callback highlighting
- visit history by registration/customer
- audit events for status/callback changes
- strong validation and test coverage

## Out Of Scope

- invoices
- payments
- VAT
- accounting
- labour line pricing
- part line pricing
- parts inventory
- supplier orders
- payroll
- MOT/DVLA integration
- full ERP
- multi-tenant SaaS
- customer portal
- AI features

## Testing Showcase Direction

This simplified scope is ideal for demonstrating:

- unit tests for domain helpers
- API integration tests
- validation tests
- status transition tests
- callback due/overdue logic tests
- registration/customer search tests
- Playwright end-to-end tests
- accessibility checks
- error handling tests
- security boundary tests
- observability/logging expectations

The product should stay small enough that happy paths, negative paths and edge cases can be tested thoroughly.

## Superseded Or Deferred From ADR 0001

ADR 0002 supersedes or defers these ADR 0001 areas:

- labour/part pricing
- calculated job totals
- customer handover summary as MVP
- broader workshop management surface

ADR 0002 keeps these ADR 0001 directions:

- secure-by-design direction
- input validation
- normalised registration
- no sensitive data in logs
- requestId/correlation ID direction
- audit events
- precise TypeScript/domain helper approach
- observability direction

`MoneyInPence` already exists as a small reusable helper. It should not be deleted as part of this decision. A later cleanup can remove it if it remains unused after the simplified MVP is implemented.

## Consequences

Positive:

- The product matches a real observed garage workflow problem.
- The MVP is smaller and easier to finish well.
- The app becomes stronger as a testing portfolio project.
- GarageFlow avoids duplicating software the garage already uses.
- Callback due/overdue behaviour creates useful domain logic and test cases.

Trade-offs:

- Some previously planned features are deferred.
- Existing `MoneyInPence` helper may become unused.
- The product is less broad, but more realistic.
- Future invoicing or costing would require a separate ADR.

## Open Questions

- Should callback reminders be attached directly to `WorkshopJob`, or stored as a separate table from day one?
- Should mechanics be users later, or remain simple domain records?
- Should the daily view remain a timeline, or become a denser callback-focused list?
- Should customer search include phone number from the first API version?
- Should overdue callback metrics be implemented before or after the first API demo?
