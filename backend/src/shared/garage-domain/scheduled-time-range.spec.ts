import { expect } from "chai";
import { DomainValidationError } from "./domain-validation.error";
import { createScheduledTimeRange } from "./scheduled-time-range";

describe("createScheduledTimeRange", () => {
  it("accepts valid start and end where end is after start", () => {
    const start = new Date("2026-07-12T08:00:00.000Z");
    const end = new Date("2026-07-12T09:00:00.000Z");

    const result = createScheduledTimeRange(start, end);

    expect(result).to.deep.equal({ start, end });
  });

  it("rejects equal start and end", () => {
    const start = new Date("2026-07-12T08:00:00.000Z");
    const end = new Date("2026-07-12T08:00:00.000Z");

    expect(() => createScheduledTimeRange(start, end)).to.throw(
      DomainValidationError,
      "Scheduled end must be after scheduled start",
    );
  });

  it("rejects end before start", () => {
    const start = new Date("2026-07-12T09:00:00.000Z");
    const end = new Date("2026-07-12T08:00:00.000Z");

    expect(() => createScheduledTimeRange(start, end)).to.throw(
      DomainValidationError,
      "Scheduled end must be after scheduled start",
    );
  });

  it("rejects invalid start Date", () => {
    const start = new Date("not-a-date");
    const end = new Date("2026-07-12T08:00:00.000Z");

    expect(() => createScheduledTimeRange(start, end)).to.throw(
      DomainValidationError,
      "Scheduled start must be a valid date",
    );
  });

  it("rejects invalid end Date", () => {
    const start = new Date("2026-07-12T08:00:00.000Z");
    const end = new Date("not-a-date");

    expect(() => createScheduledTimeRange(start, end)).to.throw(
      DomainValidationError,
      "Scheduled end must be a valid date",
    );
  });
});
