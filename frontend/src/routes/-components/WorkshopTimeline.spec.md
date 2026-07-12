# Workshop Timeline Spec

## Purpose

Show the intended main GarageFlow screen as a static workshop schedule prototype before backend domain work begins.

## Users

- Garage owner
- Service advisor
- Mechanic

## Visible UI Elements

- GarageFlow app name
- Tagline: Garage job scheduling without the paper notebook.
- Date context: Today
- Summary cards for today's jobs, in-progress jobs, waiting-for-parts jobs and ready-for-collection jobs
- Static action buttons for New booking and Print day sheet
- Page heading: Workshop Timeline
- Quick vehicle registration search input
- Timeline hours from 08:00 to 17:00
- Mechanic rows for Dave, Liam and Sarah
- Static job blocks showing registration, job title, time range and status badge

## GarageFlow App Shell

- App name: GarageFlow
- Tagline: Garage job scheduling without the paper notebook.
- Date context: Today
- Summary cards:
  - Today's jobs: 7
  - In progress: 1
  - Waiting for parts: 1
  - Ready for collection: 1
- Static action buttons:
  - New booking
  - Print day sheet
- Action buttons are visible but not wired to real functionality.

## Static Sample Mechanics

- Dave
- Liam
- Sarah

## Static Sample Jobs

- MOT Check
- Brake pads
- Diagnosis
- Service
- Ready for collection

## Statuses Shown

- Booked
- Checked in
- Diagnosing
- Waiting for parts
- In progress
- Ready for collection
- Completed

## Non-Goals

- No backend API calls
- No persistence
- No drag and drop
- No GarageFlow entities or migrations
- No auth changes
- No real booking or print actions
- No fake success messages, fake navigation or fake API behaviour

## Acceptance Criteria

- The home route shows the Workshop Timeline shell.
- The GarageFlow app name, tagline and Today context are visible.
- Summary cards show the correct labels and values.
- New booking and Print day sheet actions are visible but clearly not active.
- The registration search is visible and clearly labelled.
- Timeline hours 08:00 through 17:00 are visible.
- Dave, Liam and Sarah are visible as mechanic rows.
- Static jobs display registration number, title, scheduled time range and status.
- All planned status labels are visible.

## Test Checklist

- Home renders the workshop timeline shell.
- WorkshopTimeline renders the GarageFlow app shell.
- WorkshopTimeline renders summary metrics.
- WorkshopTimeline renders non-functional action buttons.
- WorkshopTimeline renders heading and registration search.
- WorkshopTimeline renders mechanic rows.
- WorkshopTimeline renders sample jobs.
- WorkshopTimeline renders all status badges.
