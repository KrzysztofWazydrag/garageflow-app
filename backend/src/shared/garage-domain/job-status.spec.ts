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
      "InWorkshop",
      "WaitingForCustomer",
      "WaitingForParts",
      "ReadyForCollection",
      "Completed",
      "Cancelled",
    ];

    expect(JOB_STATUSES).to.deep.equal(expectedStatuses);
  });
});

describe("canTransitionJobStatus", () => {
  it("allows Booked to InWorkshop", () => {
    expect(canTransitionJobStatus("Booked", "InWorkshop")).to.equal(true);
  });

  it("allows Booked to Cancelled", () => {
    expect(canTransitionJobStatus("Booked", "Cancelled")).to.equal(true);
  });

  it("allows InWorkshop to WaitingForCustomer", () => {
    expect(canTransitionJobStatus("InWorkshop", "WaitingForCustomer")).to.equal(true);
  });

  it("allows InWorkshop to WaitingForParts", () => {
    expect(canTransitionJobStatus("InWorkshop", "WaitingForParts")).to.equal(true);
  });

  it("allows InWorkshop to ReadyForCollection", () => {
    expect(canTransitionJobStatus("InWorkshop", "ReadyForCollection")).to.equal(true);
  });

  it("allows WaitingForCustomer to InWorkshop", () => {
    expect(canTransitionJobStatus("WaitingForCustomer", "InWorkshop")).to.equal(true);
  });

  it("allows WaitingForParts to InWorkshop", () => {
    expect(canTransitionJobStatus("WaitingForParts", "InWorkshop")).to.equal(true);
  });

  it("allows ReadyForCollection to Completed", () => {
    expect(canTransitionJobStatus("ReadyForCollection", "Completed")).to.equal(true);
  });

  it("allows ReadyForCollection to InWorkshop", () => {
    expect(canTransitionJobStatus("ReadyForCollection", "InWorkshop")).to.equal(true);
  });

  it("rejects Completed to InWorkshop", () => {
    expect(canTransitionJobStatus("Completed", "InWorkshop")).to.equal(false);
  });

  it("rejects Booked to Completed", () => {
    expect(canTransitionJobStatus("Booked", "Completed")).to.equal(false);
  });

  it("rejects Cancelled to Booked", () => {
    expect(canTransitionJobStatus("Cancelled", "Booked")).to.equal(false);
  });
});

describe("assertCanTransitionJobStatus", () => {
  it("does not throw for valid transitions", () => {
    expect(() => assertCanTransitionJobStatus("Booked", "InWorkshop")).not.to.throw();
  });

  it("throws DomainValidationError for invalid transitions", () => {
    expect(() => assertCanTransitionJobStatus("Completed", "InWorkshop")).to.throw(
      DomainValidationError,
      "Cannot transition workshop job status from Completed to InWorkshop",
    );
  });
});
