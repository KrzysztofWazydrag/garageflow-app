import { DomainValidationError } from "./domain-validation.error";

export type ScheduledTimeRange = Readonly<{
  start: Date;
  end: Date;
}>;

const isValidDate = (date: Date): boolean => !Number.isNaN(date.getTime());

export const createScheduledTimeRange = (start: Date, end: Date): ScheduledTimeRange => {
  if (!isValidDate(start)) {
    throw new DomainValidationError("Scheduled start must be a valid date");
  }

  if (!isValidDate(end)) {
    throw new DomainValidationError("Scheduled end must be a valid date");
  }

  if (end.getTime() <= start.getTime()) {
    throw new DomainValidationError("Scheduled end must be after scheduled start");
  }

  return Object.freeze({
    start: new Date(start.getTime()),
    end: new Date(end.getTime()),
  });
};
