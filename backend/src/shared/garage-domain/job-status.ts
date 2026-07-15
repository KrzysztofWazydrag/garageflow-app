import { DomainValidationError } from "./domain-validation.error";

export const JOB_STATUSES = [
  "Booked",
  "InWorkshop",
  "WaitingForCustomer",
  "WaitingForParts",
  "ReadyForCollection",
  "Completed",
  "Cancelled",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const ALLOWED_JOB_STATUS_TRANSITIONS = {
  Booked: ["InWorkshop", "Cancelled"],
  InWorkshop: ["WaitingForCustomer", "WaitingForParts", "ReadyForCollection", "Cancelled"],
  WaitingForCustomer: ["InWorkshop", "ReadyForCollection", "Cancelled"],
  WaitingForParts: ["InWorkshop", "ReadyForCollection", "Cancelled"],
  ReadyForCollection: ["Completed", "InWorkshop"],
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
