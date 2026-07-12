import { expect } from "chai";
import { DomainValidationError } from "./domain-validation.error";
import {
  assertCanTransitionJobStatus,
  canTransitionJobStatus,
  JOB_STATUSES,
  JobStatus,
} from "./job-status";

describe("JOB_STATUSES", () => {
  it("represents all ADR job statuses", () => {
    const expectedStatuses: readonly JobStatus[] = [
      "Booked",
      "CheckedIn",
      "Diagnosing",
      "WaitingForParts",
      "InProgress",
      "ReadyForCollection",
      "Completed",
      "Cancelled",
    ];

    expect(JOB_STATUSES).to.deep.equal(expectedStatuses);
  });
});

describe("canTransitionJobStatus", () => {
  it("allows Booked to CheckedIn", () => {
    expect(canTransitionJobStatus("Booked", "CheckedIn")).to.equal(true);
  });

  it("allows Booked to Cancelled", () => {
    expect(canTransitionJobStatus("Booked", "Cancelled")).to.equal(true);
  });

  it("allows InProgress to ReadyForCollection", () => {
    expect(canTransitionJobStatus("InProgress", "ReadyForCollection")).to.equal(true);
  });

  it("allows ReadyForCollection to Completed", () => {
    expect(canTransitionJobStatus("ReadyForCollection", "Completed")).to.equal(true);
  });

  it("allows ReadyForCollection to InProgress", () => {
    expect(canTransitionJobStatus("ReadyForCollection", "InProgress")).to.equal(true);
  });

  it("rejects Completed to InProgress", () => {
    expect(canTransitionJobStatus("Completed", "InProgress")).to.equal(false);
  });

  it("rejects Cancelled to Booked", () => {
    expect(canTransitionJobStatus("Cancelled", "Booked")).to.equal(false);
  });
});

describe("assertCanTransitionJobStatus", () => {
  it("does not throw for valid transitions", () => {
    expect(() => assertCanTransitionJobStatus("Booked", "CheckedIn")).not.to.throw();
  });

  it("throws DomainValidationError for invalid transitions", () => {
    expect(() => assertCanTransitionJobStatus("Completed", "InProgress")).to.throw(
      DomainValidationError,
      "Cannot transition workshop job status from Completed to InProgress",
    );
  });
});
