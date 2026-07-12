# Workshop Timeline Spec

## Purpose

Show the intended main GarageFlow screen as a static workshop schedule prototype before backend domain work begins.

## Users

- Garage owner
- Service advisor
- Mechanic

## Visible UI Elements

- Page heading: Workshop Timeline
- Quick vehicle registration search input
- Timeline hours from 08:00 to 17:00
- Mechanic rows for Dave, Liam and Sarah
- Static job blocks showing registration, job title, time range and status badge

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

## Acceptance Criteria

- The home route shows the Workshop Timeline shell.
- The registration search is visible and clearly labelled.
- Timeline hours 08:00 through 17:00 are visible.
- Dave, Liam and Sarah are visible as mechanic rows.
- Static jobs display registration number, title, scheduled time range and status.
- All planned status labels are visible.

## Test Checklist

- Home renders the workshop timeline shell.
- WorkshopTimeline renders heading and registration search.
- WorkshopTimeline renders mechanic rows.
- WorkshopTimeline renders sample jobs.
- WorkshopTimeline renders all status badges.
