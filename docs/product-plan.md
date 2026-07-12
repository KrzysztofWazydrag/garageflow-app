# GarageFlow App Product Plan

## Product Statement

GarageFlow App is a small full-stack garage workflow application for independent garages and repair shops. It helps teams replace paper notebooks, scribbled job cards and memory-based tracking with a clean digital workflow for customers, vehicles, jobs, mechanic notes, costs and customer handover summaries.

## Problem Statement

Many small garages still manage work through paper job notes. That makes it hard to find returning vehicles, track job status, preserve mechanic notes, calculate parts and labour totals, and produce a clear customer-facing summary when the vehicle is collected.

GarageFlow App focuses on the practical daily workflow. It is not a full garage ERP, accounting system or invoicing product.

## Target Users

- Garage owner
- Service advisor
- Mechanic

## Core Workflow

1. Customer contacts the garage.
2. User creates or finds the customer.
3. User creates or finds the vehicle using registration number.
4. User creates a job or booking.
5. User assigns the job to a mechanic.
6. Job appears on the workshop timeline for the scheduled day.
7. Job moves through the workshop status workflow.
8. Mechanic adds internal notes.
9. User adds labour items.
10. User adds parts items.
11. App calculates labour subtotal, parts subtotal and job total.
12. Returning vehicles can be found by registration number with job history.
13. User prints a simple customer job summary / handover sheet.

## Main Interface Direction

GarageFlow App should use a workshop timeline as the main interface, not a plain table or simple Kanban board.

The timeline should be a desktop-first garage/workshop view inspired by scheduling and Gantt-style products:

- Mechanics as rows
- Time of day as the horizontal axis
- Jobs and bookings as blocks on the timeline
- Status badges or colours for the workshop status workflow
- Quick vehicle registration search above the timeline
- Clicking a job opens the job detail workflow
- Jobs can later be moved through workflow statuses
- Practical, dark, industrial UI style

The main screen should help the garage owner or service advisor quickly understand who is working on what, when vehicles are booked in, what is waiting for parts, and what is ready for collection.

## MVP Scope

- Workshop timeline with today's bookings and active jobs
- Quick vehicle registration search
- Customer records
- Vehicle records
- Job and booking records
- Mechanic records and assignment
- Job status workflow
- Mechanic notes
- Labour items
- Parts items
- Automatic cost totals
- Vehicle and job history
- Printable customer handover summary
- Seed data
- Backend API tests
- Playwright E2E tests

## Out Of Scope

- Payments
- Full invoices
- VAT/accounting rules
- Payroll
- Full CRM
- MOT/insurance integrations
- SMS/email sending
- AI features
- Complex inventory management
- Multi-tenant SaaS
- Microservices

## Status Workflow

- Booked
- Checked in
- Diagnosing
- Waiting for parts
- In progress
- Ready for collection
- Completed

## Cost Model

Labour item:

- Description
- Hours or quantity
- Rate or fixed price
- Line total

Part item:

- Part name
- Quantity
- Unit cost
- Line total

Job totals:

- Labour subtotal
- Parts subtotal
- Job total

## Printable Customer Summary

The printable document is a customer job summary / handover sheet, not an invoice. It should be white, simple and printer-friendly, with customer details, vehicle details, job number, work requested, work completed, line items and total cost.

## Portfolio Positioning

GarageFlow App should be understandable to a recruiter in under two minutes:

> A practical full-stack workflow app that digitises a paper-based garage process with a workshop timeline, vehicle history, job workflow and printable handover summaries.
