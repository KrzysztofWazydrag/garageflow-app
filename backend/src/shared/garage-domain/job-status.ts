import { DomainValidationError } from "./domain-validation.error";

export const JOB_STATUSES = [
  "Booked",
  "CheckedIn",
  "Diagnosing",
  "WaitingForParts",
  "InProgress",
  "ReadyForCollection",
  "Completed",
  "Cancelled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const ALLOWED_JOB_STATUS_TRANSITIONS = {
  Booked: ["CheckedIn", "Cancelled"],
  CheckedIn: ["Diagnosing", "InProgress", "Cancelled"],
  Diagnosing: ["WaitingForParts", "InProgress", "Cancelled"],
  WaitingForParts: ["InProgress", "Cancelled"],
  InProgress: ["WaitingForParts", "ReadyForCollection", "Cancelled"],
  ReadyForCollection: ["Completed", "InProgress"],
  Completed: [],
  Cancelled: [],
} as const satisfies Record<JobStatus, readonly JobStatus[]>;

export const canTransitionJobStatus = (from: JobStatus, to: JobStatus): boolean =>
  (ALLOWED_JOB_STATUS_TRANSITIONS[from] as readonly JobStatus[]).includes(to);

export const assertCanTransitionJobStatus = (from: JobStatus, to: JobStatus): void => {
  if (!canTransitionJobStatus(from, to)) {
    throw new DomainValidationError(`Cannot transition workshop job status from ${from} to ${to}`);
  }
};
