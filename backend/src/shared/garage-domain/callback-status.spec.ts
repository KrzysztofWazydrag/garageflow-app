import { expect } from "chai";
import { DomainValidationError } from "./domain-validation.error";
import {
  CALLBACK_STATUSES,
  CallbackStatus,
  createCallbackFollowUp,
  isCallbackOverdue,
} from "./callback-status";

describe("CALLBACK_STATUSES", () => {
  it("represents all ADR callback statuses", () => {
    const expectedStatuses: readonly CallbackStatus[] = ["NotRequired", "Required", "Done"];

    expect(CALLBACK_STATUSES).to.deep.equal(expectedStatuses);
  });
});

describe("createCallbackFollowUp", () => {
  it("creates NotRequired callback state", () => {
    const result = createCallbackFollowUp({ callbackStatus: "NotRequired" });

    expect(result).to.deep.equal({
      callbackStatus: "NotRequired",
      callbackDueAt: null,
      lastContactedAt: null,
    });
  });

  it("rejects NotRequired with due date", () => {
    expect(() =>
      createCallbackFollowUp({
        callbackStatus: "NotRequired",
        callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
      }),
    ).to.throw(DomainValidationError, "Callback due date must be empty when callback is not required");
  });

  it("creates Required callback with valid due date", () => {
    const callbackDueAt = new Date("2026-07-12T10:00:00.000Z");

    const result = createCallbackFollowUp({
      callbackStatus: "Required",
      callbackDueAt,
    });

    expect(result).to.deep.equal({
      callbackStatus: "Required",
      callbackDueAt,
      lastContactedAt: null,
    });
  });

  it("rejects Required callback without due date", () => {
    expect(() =>
      createCallbackFollowUp({
        callbackStatus: "Required",
        callbackDueAt: null,
      }),
    ).to.throw(DomainValidationError, "Callback due date is required when callback is required");
  });

  it("rejects Required callback with invalid due date", () => {
    expect(() =>
      createCallbackFollowUp({
        callbackStatus: "Required",
        callbackDueAt: new Date("not-a-date"),
      }),
    ).to.throw(DomainValidationError, "Callback due date must be a valid date");
  });

  it("creates Done callback with valid lastContactedAt", () => {
    const lastContactedAt = new Date("2026-07-12T11:00:00.000Z");

    const result = createCallbackFollowUp({
      callbackStatus: "Done",
      lastContactedAt,
    });

    expect(result).to.deep.equal({
      callbackStatus: "Done",
      callbackDueAt: null,
      lastContactedAt,
    });
  });

  it("rejects Done callback without lastContactedAt", () => {
    expect(() =>
      createCallbackFollowUp({
        callbackStatus: "Done",
        lastContactedAt: null,
      }),
    ).to.throw(DomainValidationError, "Last contacted date is required when callback is done");
  });

  it("rejects Done callback with invalid lastContactedAt", () => {
    expect(() =>
      createCallbackFollowUp({
        callbackStatus: "Done",
        lastContactedAt: new Date("not-a-date"),
      }),
    ).to.throw(DomainValidationError, "Last contacted date must be a valid date");
  });
});

describe("isCallbackOverdue", () => {
  it("rejects invalid reference date in overdue check", () => {
    const callback = createCallbackFollowUp({
      callbackStatus: "Required",
      callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
    });

    expect(() => isCallbackOverdue(callback, new Date("not-a-date"))).to.throw(
      DomainValidationError,
      "Callback overdue reference time must be a valid date",
    );
  });

  it("returns true for Required callback due before reference time", () => {
    const callback = createCallbackFollowUp({
      callbackStatus: "Required",
      callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
    });

    expect(isCallbackOverdue(callback, new Date("2026-07-12T10:01:00.000Z"))).to.equal(true);
  });

  it("returns false for Required callback due exactly at reference time", () => {
    const callback = createCallbackFollowUp({
      callbackStatus: "Required",
      callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
    });

    expect(isCallbackOverdue(callback, new Date("2026-07-12T10:00:00.000Z"))).to.equal(false);
  });

  it("returns false for Required callback due after reference time", () => {
    const callback = createCallbackFollowUp({
      callbackStatus: "Required",
      callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
    });

    expect(isCallbackOverdue(callback, new Date("2026-07-12T09:59:00.000Z"))).to.equal(false);
  });

  it("returns false for Done callback", () => {
    const callback = createCallbackFollowUp({
      callbackStatus: "Done",
      callbackDueAt: new Date("2026-07-12T10:00:00.000Z"),
      lastContactedAt: new Date("2026-07-12T10:30:00.000Z"),
    });

    expect(isCallbackOverdue(callback, new Date("2026-07-12T11:00:00.000Z"))).to.equal(false);
  });

  it("returns false for NotRequired callback", () => {
    const callback = createCallbackFollowUp({ callbackStatus: "NotRequired" });

    expect(isCallbackOverdue(callback, new Date("2026-07-12T11:00:00.000Z"))).to.equal(false);
  });
});
