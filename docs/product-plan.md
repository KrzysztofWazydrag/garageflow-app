# GarageFlow App Product Plan

## Product Statement

GarageFlow App is a simple workshop follow-up tracker for independent garages and repair shops.

It helps small garages keep customer details, vehicle registrations, visit notes and promised callbacks in one simple workflow.

## Real-World Observation

A small garage visit showed that the garage already has software for invoices, payments, parts purchases and costing. GarageFlow should not duplicate that system.

The unresolved workflow problem is smaller and more practical:

- customer details are repeatedly asked for on repeat visits
- vehicle registrations are repeatedly written down
- phone numbers are stored in a messy handwritten notebook
- visit context and previous notes are hard to find
- promised callbacks can be missed

GarageFlow focuses on that gap: customer, vehicle, workshop job notes and callback follow-up.

## Problem Statement

Many small garages still use paper notes for day-to-day workshop follow-up. That makes it hard to answer basic operational questions:

- Who is the customer?
- What car is it?
- Why is it here?
- What did we promise?
- When should we call back?
- Has the customer been contacted?
- What is the current simple job status?
- What notes did we write last time?

GarageFlow is not a full garage ERP, accounting system, invoicing system or parts/labour costing product.

## Target Users

- Garage owner
- Service advisor
- Mechanic

## Core Workflow

1. Customer contacts or visits the garage.
2. User creates or finds the customer by name or phone number.
3. User creates or finds the vehicle by registration number.
4. User creates a lightweight workshop job with the reason for visit.
5. User assigns or reviews the simple job status.
6. Job appears on the daily workshop list or timeline.
7. User records notes during the visit.
8. User records whether a customer callback is required.
9. App highlights due and overdue callbacks.
10. Returning vehicles can be found by registration number with visit history.

## Main Interface Direction

GarageFlow should stay timeline/list-first rather than table-first or Kanban-first.

The main screen should help the garage quickly see the day:

- mechanics or work lanes as rows where useful
- time of day as the horizontal axis where useful
- jobs and bookings as simple blocks or rows
- status badges for simple workshop state
- callback due/overdue highlighting
- quick vehicle registration search
- customer search
- practical, dark, industrial UI style

The interface should remain small and focused on follow-up, not billing.

## MVP Scope

- Customer records with full name and phone number
- Vehicle records with registration display and normalised registration
- Optional vehicle make/model
- Lightweight workshop jobs
- Reason for visit
- Simple job status workflow
- Visit notes
- Callback required flag
- Promised callback date/time
- Callback status
- Last contacted timestamp
- Daily workshop list or timeline
- Registration search
- Customer search
- Visit history by registration/customer
- Callback reminders
- Overdue callback highlighting
- Audit events for status/callback changes
- Seed data
- Backend API tests
- Playwright E2E tests

## Out Of Scope

- Invoices
- Payments
- VAT/accounting rules
- Parts/labour costing
- Labour line pricing
- Part line pricing
- Parts inventory
- Supplier orders
- Payroll
- MOT/DVLA integrations
- Customer portal
- AI features
- Full ERP
- Multi-tenant SaaS
- Microservices

## Simplified Status Workflow

- Booked
- In workshop
- Waiting for customer
- Waiting for parts
- Ready for collection
- Completed
- Cancelled

Detailed states such as Diagnosing and In progress are deferred unless real workflow testing proves they are needed.

## Callback Workflow

Callback data:

- callback required
- callback due at
- callback status
- last contacted at

Callback statuses:

- Not required
- Required
- Done

Overdue should be calculated from callback due date/time and callback status rather than stored as a separate source of truth.

## Testing Showcase Direction

The simplified scope is intentionally good for demonstrating engineering quality:

- Unit tests for domain helpers
- API integration tests
- Validation tests
- Status transition tests
- Callback due/overdue logic tests
- Registration and customer search tests
- Playwright end-to-end tests
- Accessibility checks
- Error handling tests
- Security boundary tests
- Observability/logging expectations

## Portfolio Positioning

GarageFlow App should be understandable to a recruiter in under two minutes:

> A practical full-stack workflow app that digitises a small garage's paper notebook with customer/vehicle lookup, lightweight workshop jobs, visit notes and promised callback tracking.
